import type { Rspack } from '@rsbuild/core';

export type ShaderProcessor = (source: string, resourcePath: string) => string | Promise<string>;

export interface PluginGlslOptions {
  /** Rspack rule condition used to select shader modules. */
  include?: Rspack.RuleSetCondition;
  /** Rspack rule condition used to exclude shader modules. */
  exclude?: Rspack.RuleSetCondition;
  /** Extension appended to extension-less chunk imports. @default 'glsl' */
  defaultExtension?: string;
  /** Emit one warning per duplicated import and importing file. @default true */
  warnDuplicatedImports?: boolean;
  /** Inline a chunk only once for each shader module. @default false */
  removeDuplicatedImports?: boolean;
  /** Directives that import shader chunks. @default ['#include'] */
  importKeywords?: readonly string[];
  /** Process the fully expanded shader. */
  onComplete?: ShaderProcessor;
  /** Minify the expanded shader, or provide a custom minifier. @default false */
  minify?: boolean | ShaderProcessor;
  /**
   * Backward-compatible alias for `minify`.
   * @deprecated Use `minify` instead.
   */
  compress?: boolean | ShaderProcessor;
  /** Register imported chunks as build dependencies. @default true */
  watch?: boolean;
  /** Base directory for imports beginning with `/`, relative to Rsbuild root. @default '/' */
  root?: string;
}

export interface ResolvedPluginGlslOptions {
  include: Rspack.RuleSetCondition;
  exclude?: Rspack.RuleSetCondition;
  defaultExtension: string;
  warnDuplicatedImports: boolean;
  removeDuplicatedImports: boolean;
  importKeywords: readonly string[];
  onComplete?: ShaderProcessor;
  minify: boolean | ShaderProcessor;
  watch: boolean;
  root: string;
}

export interface TransformShaderOptions extends PluginGlslOptions {
  /** Project root used to resolve root-relative imports. @default process.cwd() */
  cwd?: string;
  /** File reader override for virtual file systems and tests. */
  readFile?: (path: string) => string | Promise<string>;
}

export interface TransformShaderResult {
  code: string;
  dependencies: string[];
  warnings: string[];
}
