import path from 'node:path';
import type { RsbuildPlugin, Rspack } from '@rsbuild/core';

export const PLUGIN_GLSL_NAME = 'rsbuild:glsl';

/**
 * @const
 * @default
 * @readonly
 * @type {string}
 */
const DEFAULT_EXTENSION: string = 'glsl';

export interface PluginGlslOptions {
  include?: Rspack.RuleSetCondition;

  exclude?: Rspack.RuleSetCondition;

  defaultExtension?: string;

  warnDuplicatedImports?: boolean;

  compress?: boolean;

  root?: string;
}

export const pluginGlsl = (
  pluginOptions: PluginGlslOptions = {
    root: '/',
    exclude: undefined,
    include: /\.(glsl|wgsl|vert|frag|vs|fs)$/,
    warnDuplicatedImports: true,
    compress: false,
    defaultExtension: DEFAULT_EXTENSION,
  },
): RsbuildPlugin => ({
  name: PLUGIN_GLSL_NAME,

  setup(api) {
    api.modifyBundlerChain(async (chain, { isProd, environment, target }) => {
      const { config } = environment;
      const usingHMR = !isProd && config.dev.hmr && target === 'web';
      const rule = chain.module
        .rule('glsl')
        .type('javascript/auto')
        .test(pluginOptions.include!)
        // .merge({ sideEffects: true })
        .use('glsl')
        .loader(path.join(__dirname, './glsl-loader.js'))
        .options({
          ...pluginOptions,
          usingHMR,
        })
        .end();

      if (pluginOptions.exclude) {
        rule.exclude.add(pluginOptions.exclude);
      }
    });
  },
});
