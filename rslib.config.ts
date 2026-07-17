import { defineConfig } from '@rslib/core';

const entry = {
  index: './src/index.ts',
  'glsl-loader': './src/glsl-loader.ts',
  ext: './src/ext.ts',
};

export default defineConfig({
  source: { entry },
  output: {
    cleanDistPath: true,
    sourceMap: true,
  },
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      autoExtension: true,
      dts: {
        distPath: './dist/types/esm',
      },
      redirect: {
        dts: {
          extension: true,
        },
      },
    },
    {
      format: 'cjs',
      syntax: 'es2022',
      autoExtension: true,
      dts: {
        autoExtension: true,
        distPath: './dist/types/cjs',
      },
      redirect: {
        dts: {
          extension: true,
        },
      },
      shims: {
        cjs: {
          'import.meta.url': true,
        },
      },
    },
  ],
});
