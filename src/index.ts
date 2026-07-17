import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RsbuildPlugin } from '@rsbuild/core';
import { resolveOptions } from './core';
import type { PluginGlslOptions } from './types';

export {
  DEFAULT_OPTIONS,
  DEFAULT_SHADER_PATTERN,
  minifyShader,
  resolveOptions,
  stripShaderComments,
  transformShader,
} from './core';
export type {
  PluginGlslOptions,
  ResolvedPluginGlslOptions,
  ShaderProcessor,
  TransformShaderOptions,
  TransformShaderResult,
} from './types';

export const PLUGIN_GLSL_NAME = 'rsbuild:glsl';

function getLoaderPath(): string {
  const currentFile = fileURLToPath(import.meta.url);
  const loaderExtension = extname(currentFile) === '.cjs' ? '.cjs' : '.js';
  return join(dirname(currentFile), `glsl-loader${loaderExtension}`);
}

export const pluginGlsl = (options: PluginGlslOptions = {}): RsbuildPlugin => {
  const resolvedOptions = resolveOptions(options);

  return {
    name: PLUGIN_GLSL_NAME,
    setup(api) {
      api.modifyBundlerChain((chain) => {
        const rule = chain.module
          .rule('glsl')
          .type('javascript/auto')
          .test(resolvedOptions.include)
          .use('glsl')
          .loader(getLoaderPath())
          .options(resolvedOptions)
          .end();

        if (resolvedOptions.exclude) {
          rule.exclude.add(resolvedOptions.exclude);
        }
      });
    },
  };
};
