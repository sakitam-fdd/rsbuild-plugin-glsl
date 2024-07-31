import UnoCSS from '@unocss/postcss';
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import AutoImport from 'unplugin-auto-import/rspack';
import { resolve } from 'path';

import IconsResolver from 'unplugin-icons/resolver';

export default defineConfig({
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
    alias: {
      '@': resolve(__dirname, './src'),
    },
    define: {
      'process.env.APP_TITLE': JSON.stringify(process.env.APP_TITLE),
    },
  },
  output: {
    externals: {
      // 'mapbox-gl': 'mapboxgl',
    },
    assetPrefix: '/rsbuild-plugin-glsl/',
  },
  plugins: [pluginReact(), pluginLess(), pluginGlsl()],
  tools: {
    rspack: {
      plugins: [
        AutoImport({
          // dts: path.resolve(pathSrc, 'typings', 'auto-imports.d.ts'),
          dts: 'types/auto-imports.d.ts',
          // dirs: ['./src/hooks'],
          // Generate corresponding .eslintrc-auto-import.json file.
          // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
          eslintrc: {
            enabled: true,
          },
          imports: [
            'react',
            {
              // 全局使用 _.xxxx()
              'lodash-es': [
                // default imports
                ['*', '_'], // import { * as _ } from 'lodash-es',
              ],
            },
          ],
          // Auto import functions from UILibrary, e.g. Message, Spin, Loading, MessageBox... (with style)
          resolvers: [
            IconsResolver({
              prefix: 'icon',
              extension: 'jsx',
              customCollections: ['custom'],
            }),
          ],
        }),
      ],
      output: {
        publicPath: '/rsbuild-plugin-glsl/',
      },
    },
    postcss: {
      postcssOptions: {
        plugins: [UnoCSS()],
      },
    },
  },
  server: {
    proxy: {},
  },
});
