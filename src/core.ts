import { readFile as readFileFromDisk } from 'node:fs/promises';
import { dirname, extname, isAbsolute, resolve, sep } from 'node:path';
import type {
  PluginGlslOptions,
  ResolvedPluginGlslOptions,
  TransformShaderOptions,
  TransformShaderResult,
} from './types';

export const DEFAULT_SHADER_PATTERN = /\.(?:glsl|wgsl|vert|frag|vs|fs)$/i;

export const DEFAULT_OPTIONS: Readonly<ResolvedPluginGlslOptions> = Object.freeze({
  include: DEFAULT_SHADER_PATTERN,
  defaultExtension: 'glsl',
  warnDuplicatedImports: true,
  removeDuplicatedImports: false,
  importKeywords: Object.freeze(['#include']),
  minify: false,
  watch: true,
  root: '/',
});

export function resolveOptions(options: PluginGlslOptions = {}): ResolvedPluginGlslOptions {
  const minify = options.minify ?? options.compress ?? DEFAULT_OPTIONS.minify;
  const defaultExtension = (options.defaultExtension ?? DEFAULT_OPTIONS.defaultExtension).replace(
    /^\./,
    '',
  );
  const importKeywords = options.importKeywords ?? DEFAULT_OPTIONS.importKeywords;

  if (!defaultExtension) {
    throw new TypeError('`defaultExtension` must not be empty.');
  }

  if (importKeywords.length === 0 || importKeywords.some((keyword) => !keyword.trim())) {
    throw new TypeError('`importKeywords` must contain at least one non-empty keyword.');
  }

  return {
    include: options.include ?? DEFAULT_OPTIONS.include,
    defaultExtension,
    warnDuplicatedImports: options.warnDuplicatedImports ?? DEFAULT_OPTIONS.warnDuplicatedImports,
    removeDuplicatedImports:
      options.removeDuplicatedImports ?? DEFAULT_OPTIONS.removeDuplicatedImports,
    importKeywords: [...new Set(importKeywords.map((keyword) => keyword.trim()))],
    minify,
    watch: options.watch ?? DEFAULT_OPTIONS.watch,
    root: options.root ?? DEFAULT_OPTIONS.root,
    ...(options.exclude !== undefined ? { exclude: options.exclude } : {}),
    ...(options.onComplete !== undefined ? { onComplete: options.onComplete } : {}),
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createImportPattern(keywords: readonly string[]): RegExp {
  const alternatives = [...keywords]
    .sort((left, right) => right.length - left.length)
    .map(escapeRegExp)
    .join('|');

  return new RegExp(String.raw`(?:${alternatives})\s+([^\s<>]+);?`, 'gi');
}

/** Remove comments while preserving line endings and `///` documentation comments. */
export function stripShaderComments(
  source: string,
  preserveTripleSlash = true,
  importPattern?: RegExp,
): string {
  let result = '';
  let index = 0;
  let blockComment = false;

  while (index < source.length) {
    if (blockComment) {
      if (source[index] === '*' && source[index + 1] === '/') {
        blockComment = false;
        index += 2;
      } else {
        if (source[index] === '\n' || source[index] === '\r') {
          result += source[index];
        }
        index += 1;
      }
      continue;
    }

    if (source[index] === '/' && source[index + 1] === '*') {
      if (result && !/\s$/.test(result)) result += ' ';
      blockComment = true;
      index += 2;
      continue;
    }

    if (source[index] === '/' && source[index + 1] === '/') {
      const isTripleSlash = source[index + 2] === '/';
      const lineEnd = source.indexOf('\n', index);
      const end = lineEnd === -1 ? source.length : lineEnd;
      const comment = source.slice(index, end);
      const containsImport = importPattern
        ? new RegExp(importPattern.source, importPattern.flags).test(comment)
        : false;

      if (preserveTripleSlash && isTripleSlash && !containsImport) {
        result += comment;
      }

      index = end;
      continue;
    }

    result += source[index];
    index += 1;
  }

  return result;
}

/** Minify GLSL/WGSL without joining preprocessor directives to adjacent code. */
export function minifyShader(source: string): string {
  const withoutComments = stripShaderComments(source, false);
  const lines = withoutComments.split(/\r?\n/);
  const result: string[] = [];
  let code = '';

  const flushCode = () => {
    if (!code) return;
    result.push(
      code
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}=*,+/>[\]()!;|&])\s*/g, '$1')
        .replace(/\s+([,;])/g, '$1')
        .trim(),
    );
    code = '';
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      flushCode();
      result.push(line);
    } else {
      code += `${code ? ' ' : ''}${line}`;
    }
  }

  flushCode();
  return result.join('\n');
}

function normalizePath(path: string): string {
  const normalized = path.split(sep).join('/');
  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
}

function cleanSpecifier(value: string): string {
  return value
    .trim()
    .replace(/^(?:"|')|(?:"|');?$/g, '')
    .replace(/;$/, '');
}

function resolveRootDirectory(root: string, cwd: string): string {
  if (!root || root === '/' || root === '\\') return cwd;
  if (isAbsolute(root)) {
    return resolve(cwd, root.replace(/^[/\\]+/, ''));
  }
  return resolve(cwd, root);
}

function resolveChunk(
  specifier: string,
  importer: string,
  options: ResolvedTransformOptions,
): string {
  const cwd = options.cwd ?? process.cwd();
  const rootDirectory = resolveRootDirectory(options.root, cwd);
  const rootRelative = specifier.startsWith('/') || specifier.startsWith('\\');
  const baseDirectory = rootRelative ? rootDirectory : dirname(importer);
  const requestedPath = rootRelative ? specifier.replace(/^[/\\]+/, '') : specifier;
  let chunk = resolve(baseDirectory, requestedPath);

  if (!extname(chunk)) chunk = `${chunk}.${options.defaultExtension}`;
  return chunk;
}

interface TransformState {
  pattern: RegExp;
  options: ResolvedTransformOptions;
  readFile: (path: string) => Promise<string>;
  dependencies: Set<string>;
  seen: Set<string>;
  duplicateWarnings: Set<string>;
  warnings: string[];
}

interface ResolvedTransformOptions extends Omit<
  ResolvedPluginGlslOptions,
  'include' | 'exclude' | 'watch'
> {
  cwd: string;
}

async function expandShader(
  source: string,
  resourcePath: string,
  stack: string[],
  state: TransformState,
): Promise<string> {
  const cleanSource = stripShaderComments(source, true, state.pattern);
  const pattern = new RegExp(state.pattern.source, state.pattern.flags);
  const matches = [...cleanSource.matchAll(pattern)];
  if (matches.length === 0) return cleanSource.trim();

  let cursor = 0;
  let output = '';

  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    output += cleanSource.slice(cursor, matchIndex);
    cursor = matchIndex + match[0].length;

    const specifier = cleanSpecifier(match[1] ?? '');
    const chunkPath = resolveChunk(specifier, resourcePath, state.options);
    const chunkKey = normalizePath(chunkPath);
    const cycleIndex = stack.findIndex((item) => item === chunkKey);

    if (cycleIndex !== -1) {
      const cycle = [...stack.slice(cycleIndex), chunkKey].join(' -> ');
      throw new Error(`Recursive shader import detected: ${cycle}`);
    }

    state.dependencies.add(chunkPath);

    if (state.seen.has(chunkKey)) {
      const warningKey = `${normalizePath(resourcePath)}:${chunkKey}`;
      if (state.options.warnDuplicatedImports && !state.duplicateWarnings.has(warningKey)) {
        state.duplicateWarnings.add(warningKey);
        state.warnings.push(
          `Shader chunk "${chunkPath}" is imported multiple times by "${resourcePath}".`,
        );
      }

      if (state.options.removeDuplicatedImports) continue;
    }

    state.seen.add(chunkKey);

    let chunkSource: string;
    try {
      chunkSource = await state.readFile(chunkPath);
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : '';
      throw new Error(
        `Unable to load shader chunk "${specifier}" imported by "${resourcePath}".${detail}`,
        { cause: error },
      );
    }

    output += await expandShader(chunkSource, chunkPath, [...stack, chunkKey], state);
  }

  output += cleanSource.slice(cursor);
  return output.trim().replace(/(\r\n|\r|\n){3,}/g, '$1\n');
}

/** Expand, validate and optionally minify a shader without shared process state. */
export async function transformShader(
  source: string,
  resourcePath: string,
  options: TransformShaderOptions = {},
): Promise<TransformShaderResult> {
  const resolved = resolveOptions(options);
  const transformOptions: ResolvedTransformOptions = {
    defaultExtension: resolved.defaultExtension,
    warnDuplicatedImports: resolved.warnDuplicatedImports,
    removeDuplicatedImports: resolved.removeDuplicatedImports,
    importKeywords: resolved.importKeywords,
    minify: resolved.minify,
    root: resolved.root,
    cwd: options.cwd ?? process.cwd(),
    ...(resolved.onComplete ? { onComplete: resolved.onComplete } : {}),
  };
  const readFile = options.readFile ?? ((path: string) => readFileFromDisk(path, 'utf8'));
  const state: TransformState = {
    pattern: createImportPattern(transformOptions.importKeywords),
    options: transformOptions,
    readFile: async (path) => String(await readFile(path)),
    dependencies: new Set(),
    seen: new Set([normalizePath(resourcePath)]),
    duplicateWarnings: new Set(),
    warnings: [],
  };

  let code = await expandShader(source, resourcePath, [normalizePath(resourcePath)], state);

  if (typeof transformOptions.minify === 'function') {
    code = await transformOptions.minify(code, resourcePath);
  } else if (transformOptions.minify) {
    code = minifyShader(code);
  }

  if (transformOptions.onComplete) {
    code = await transformOptions.onComplete(code, resourcePath);
  }

  return {
    code,
    dependencies: [...state.dependencies],
    warnings: state.warnings,
  };
}
