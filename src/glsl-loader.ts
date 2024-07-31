import type { Rspack } from '@rsbuild/core';
import { dirname, resolve, extname, posix, sep } from 'path';
import { emitWarning, cwd } from 'process';
import { readFileSync } from 'fs';

/**
 * @name recursiveChunk
 *
 * @description Shader chunk path
 * that caused a recursion error
 */
let recursiveChunk: string = '';

/**
 * @const
 * @name allChunks
 *
 * @description List of all shader chunks,
 * it's used to track included files
 */
const allChunks: Set<string> = new Set();

/**
 * @const
 * @name dependentChunks
 *
 * @description Map of shaders that import other chunks, it's
 * used to track included files in order to avoid recursion
 * - Key: shader path that uses other chunks as dependencies
 * - Value: list of chunk paths included within the shader
 */
const dependentChunks: Map<string, string[]> = new Map();

/**
 * @const
 * @name duplicatedChunks
 *
 * @description Map of duplicated shader
 * imports, used by warning messages
 */
const duplicatedChunks: Map<string, string[]> = new Map();

/**
 * @const
 * @name include
 *
 * @description RegEx to match GLSL
 * `#include` preprocessor instruction
 */
const include: RegExp = /#include(\s+([^\s<>]+));?/gi;

/**
 * @function
 * @name resetSavedChunks
 * @description Clears all lists of saved chunks
 * and resets "recursiveChunk" path to empty
 *
 * @returns {string} Copy of "recursiveChunk" path
 */
function resetSavedChunks(): string {
  const chunk = recursiveChunk;
  duplicatedChunks.clear();
  dependentChunks.clear();

  recursiveChunk = '';
  allChunks.clear();
  return chunk;
}

/**
 * @function
 * @name getRecursionCaller
 * @description Gets last chunk that caused a
 * recursion error from the "dependentChunks" list
 *
 * @returns {string} Chunk path that started a recursion
 */
function getRecursionCaller(): string {
  const keys = dependentChunks.keys();
  const dependencies = [...Array.from(keys)];
  return dependencies[dependencies.length - 1];
}

/**
 * @function
 * @name checkDuplicatedImports
 * @description Checks if shader chunk was already included
 * and adds it to the "duplicatedChunks" list if yes
 *
 * @param {string} path Shader's absolute path
 *
 * @throws {Warning} If shader chunk was already included
 */
function checkDuplicatedImports(path: string) {
  if (!allChunks.has(path)) return;
  const caller = getRecursionCaller();

  const chunks = duplicatedChunks.get(caller) ?? [];
  if (chunks.includes(path)) return;

  chunks.push(path);
  duplicatedChunks.set(caller, chunks);

  emitWarning(`'${path}' was included multiple times.`, {
    code: 'rsbuild-plugin-glsl',
    detail:
      'Please avoid multiple imports of the same chunk in order to avoid' +
      ` recursions and optimize your shader length.\nDuplicated import found in file '${caller}'.`,
  });
}

/**
 * @function
 * @name removeSourceComments
 * @description Removes comments from shader source
 * code in order to avoid including commented chunks
 *
 * @param {string}  source Shader's source code
 * @param {boolean} triple Remove comments starting with `///`
 *
 * @returns {string} Shader's source code without comments
 */
function removeSourceComments(source: string, triple: boolean = false): string {
  if (source.includes('/*') && source.includes('*/')) {
    source = source.slice(0, source.indexOf('/*')) + source.slice(source.indexOf('*/') + 2, source.length);
  }

  const lines = source.split('\n');

  for (let l = lines.length; l--; ) {
    const index = lines[l].indexOf('//');

    if (index > -1) {
      if (lines[l][index + 2] === '/' && !include.test(lines[l]) && !triple) continue;
      lines[l] = lines[l].slice(0, lines[l].indexOf('//'));
    }
  }

  return lines.join('\n');
}

/**
 * @function
 * @name checkRecursiveImports
 * @description Checks if shader dependencies
 * have caused a recursion error or warning
 *
 * @param {string}  path Shader's absolute path
 * @param {boolean} warn Check already included chunks
 *
 * @returns {boolean} Import recursion has occurred
 */
function checkRecursiveImports(path: string, warn: boolean): boolean {
  warn && checkDuplicatedImports(path);
  return checkIncludedDependencies(path, path);
}

/**
 * @function
 * @name checkIncludedDependencies
 * @description Checks if included
 * chunks caused a recursion error
 *
 * @param {string} path Current chunk absolute path
 * @param {string} root Main shader path that imports chunks
 *
 * @returns {boolean} Included chunk started a recursion
 */
function checkIncludedDependencies(path: string, root: string): boolean {
  const dependencies = dependentChunks.get(path);
  let recursiveDependency = false;

  if (dependencies?.includes(root)) {
    recursiveChunk = root;
    return true;
  }

  dependencies?.forEach((dependency) => (recursiveDependency ||= checkIncludedDependencies(dependency, root)));

  return recursiveDependency;
}

/**
 * @function
 * @name compressShader
 * @description Compresses shader source code by
 * removing unnecessary whitespace and empty lines
 *
 * @param {string}  shader  Shader code with included chunks
 * @param {boolean} newLine Flag to require a new line for the code
 *
 * @returns {string} Compressed shader's source code
 */
function compressShader(shader: string, newLine: boolean = false): string {
  return shader
    .replace(/\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/g, '')
    .split(/\n+/)
    .reduce((result: string[], line: string) => {
      line = line.trim().replace(/\s{2,}|\t/, ' ');

      if (/@(vertex|fragment)/.test(line) || line.endsWith('return')) line += ' ';

      if (line[0] === '#') {
        newLine && result.push('\n');
        result.push(line, '\n');
        newLine = false;
      } else {
        !line.startsWith('{') && result.length && result[result.length - 1].endsWith('else') && result.push(' ');
        result.push(line.replace(/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|\-|!|;)\s*/g, '$1'));
        newLine = true;
      }

      return result;
    }, [])
    .join('')
    .replace(/\n+/g, '\n');
}

/**
 * @function
 * @name loadChunks
 * @description Includes shader's dependencies
 * and removes comments from the source code
 *
 * @param {string}  source    Shader's source code
 * @param {string}  path      Shader's absolute path
 * @param {string}  extension Default shader extension
 * @param {boolean} warn      Check already included chunks
 * @param {string}  root      Shader's root directory
 *
 * @throws {Error}   If shader chunks started a recursion loop
 *
 * @returns {string} Shader's source code without external chunks
 */
function loadChunks(source: string, path: string, extension: string, warn: boolean, root: string): string {
  const unixPath = path.split(sep).join(posix.sep);

  if (checkRecursiveImports(unixPath, warn)) {
    return recursiveChunk;
  }

  source = removeSourceComments(source);
  let directory = dirname(unixPath);
  allChunks.add(unixPath);

  if (include.test(source)) {
    dependentChunks.set(unixPath, []);
    const currentDirectory = directory;

    source = source.replace(include, (_, chunkPath) => {
      chunkPath = chunkPath.trim().replace(/^(?:"|')?|(?:"|')?;?$/gi, '');

      if (!chunkPath.indexOf('/')) {
        const base = cwd().split(sep).join(posix.sep);
        chunkPath = base + root + chunkPath;
      }

      const directoryIndex = chunkPath.lastIndexOf('/');
      directory = currentDirectory;

      if (directoryIndex !== -1) {
        directory = resolve(directory, chunkPath.slice(0, directoryIndex + 1));
        chunkPath = chunkPath.slice(directoryIndex + 1, chunkPath.length);
      }

      let shader = resolve(directory, chunkPath);

      if (!extname(shader)) shader = `${shader}.${extension}`;

      const shaderPath = shader.split(sep).join(posix.sep);
      dependentChunks.get(unixPath)?.push(shaderPath);

      return loadChunks(readFileSync(shader, 'utf8'), shader, extension, warn, root);
    });
  }

  if (recursiveChunk) {
    const caller = getRecursionCaller();
    const rc = resetSavedChunks();

    throw new Error(`Recursion detected when importing '${rc}' in '${caller}'.`);
  }

  return source.trim().replace(/(\r\n|\r|\n){3,}/g, '$1\n');
}

/**
 * @function
 * @name loadShader
 * @description Iterates through all external chunks,
 * includes them into the shader's source code
 * and optionally compresses the output
 *
 * @param {string}         source  Shader's source code
 * @param {string}         shader  Shader's absolute path
 * @param {options} options Configuration object to define:
 *
 *  - Warn if the same chunk was imported multiple times
 *  - Shader suffix when no extension is specified
 *  - Compress output shader code
 *  - Directory for root imports
 *
 * shader output and Map of shaders that import other chunks
 */
function loadShader(
  source: string,
  shader: string,
  options: {
    warnDuplicatedImports: boolean;
    defaultExtension: string;
    compress: boolean;
    root: string;
  },
): {
  dependentChunks: Map<string, string[]>;
  outputShader: string;
} {
  const { warnDuplicatedImports, defaultExtension, compress, root } = options;

  resetSavedChunks();

  let output = loadChunks(source, shader, defaultExtension, warnDuplicatedImports, root);
  output = compress ? removeSourceComments(output, true) : output;

  return {
    dependentChunks,
    outputShader: compress ? (typeof compress !== 'function' ? compressShader(output) : output) : output,
  };
}

function glslLoader(this: Rspack.LoaderContext<any>, contents: string): void {
  this?.cacheable();

  const callback = this.async();

  const options = this.getOptions();

  const previousExport = (() => {
    if (contents.startsWith('export ')) return contents;
    const exportMatches = contents.match(/^module.exports\s*=\s*(.*)/);
    return exportMatches ? `export default ${exportMatches[1]}` : null;
  })();

  if (!previousExport) {
    const { outputShader, dependentChunks: dcs } = loadShader(contents, this.resourcePath, options);

    if (options.usingHMR) {
      const chunks = Array.from(dcs.values()).flat();
      chunks.forEach((chunk) => this.addDependency(chunk));
    }

    callback(null, `export default ${JSON.stringify(outputShader)}`);
  } else {
    this.fs.readFile(this.resourcePath, (err: Error, result: unknown) => {
      if (err) {
        callback(err);
        return;
      }

      const { outputShader, dependentChunks: dcs } = loadShader(String(result), this.resourcePath, options);

      if (options.usingHMR) {
        const chunks = Array.from(dcs.values()).flat();
        chunks.forEach((chunk) => this.addDependency(chunk));
      }

      callback(null, `export default ${JSON.stringify(outputShader)}`);
    });
  }
}

export default glslLoader;
