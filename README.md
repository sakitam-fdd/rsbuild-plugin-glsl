# rsbuild-plugin-glsl

rsbuild-plugin-glsl is a Rsbuild plugin to process GLSL shader files.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-glsl">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-glsl?style=flat-square&colorA=444D56&colorB=28A745" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=444D56&colorB=28A745" alt="license" />

  <a href="https://github.com/sakitam-fdd/rsbuild-plugin-glsl/actions/workflows/ci.yml" target="_blank">
    <img alt="CI" src="https://github.com/sakitam-fdd/rsbuild-plugin-glsl/actions/workflows/ci.yml/badge.svg" />
  </a>
</p>

## Usage

Install:

```bash
npm i rsbuild-plugin-glsl -D

pnpm i rsbuild-plugin-glsl -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import AutoImport from 'unplugin-auto-import/rspack';
import { resolve } from 'path';

import IconsResolver from 'unplugin-icons/resolver';
import { pluginGlsl } from './lib/plugin-glsl';

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
  },
  output: {
    externals: {
      'mapbox-gl': 'mapboxgl',
    },
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
    },
  },
  server: {
    proxy: {},
  },
});

```

### With TypeScript ###

Add extension declarations to your [`types`](https://www.typescriptlang.org/tsconfig#types) in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "rsbuild-plugin-glsl/ext"
    ]
  }
}
```

or as a [package dependency directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) to your global types:

```ts
/// <reference types="rsbuild-plugin-glsl/ext" />
```

## Options

| Option  | Desc                                  | Type      | Default |
|---------|---------------------------------------|-----------|---------|
| root    | Directory for root imports            | `string`  | `/`     |
| include | Glob pattern, RegExp for include file | `RegExp`  |   `/\.(glsl|wgsl|vert|frag|vs|fs)$/`      |
| exclude     | Glob pattern, RegExp for ignore       | `RegExp`  |     `undefined`   |
| warnDuplicatedImports     | Warn if the same chunk was imported multiple times       | `boolean` | `true`  |
| compress     | Compress output shader code      | `boolean` | `true`  |
| defaultExtension     | Shader suffix when no extension is specified      | `string` | `glsl`  |

- Example:

```js
pluginGlsl({
  include: /\.(glsl|wgsl|vert|frag|vs|fs)$/,
  exclude: undefined,
  warnDuplicatedImports: true,
  defaultExtension: 'glsl',
  compress: false,
  root: '/'
});
```

## Example ##

```
root
├── src/
│   ├── glsl/
│   │   ├── chunk0.frag
│   │   ├── chunk3.frag
│   │   ├── main.frag
│   │   ├── main.vert
│   │   └── utils/
│   │       ├── chunk1.glsl
│   │       └── chunk2.frag
│   └── main.js
├── rsbuild.config.ts
└── package.json
```

```js
// main.js
import fragment from './glsl/main.frag';
```

```glsl
// main.frag
#version 300 es

#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision highp float;
#endif

out vec4 fragColor;

#include chunk0.frag;

void main (void) {
  fragColor = chunkFn();
}
```

```glsl
// chunk0.frag

// ".glsl" extension will be added automatically:
#include utils/chunk1;

vec4 chunkFn () {
  return vec4(chunkRGB(), 1.0);
}
```

```glsl
// utils/chunk1.glsl

#include chunk2.frag;
#include ../chunk3.frag;

vec3 chunkRGB () {
  return vec3(chunkRed(), chunkGreen(), 0.0);
}
```

```glsl
// utils/chunk2.frag

float chunkRed () {
  return 0.0;
}
```

```glsl
// chunk3.frag

float chunkGreen () {
  return 0.8;
}
```

Will result in:

```glsl
// main.frag
#version 300 es

#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision highp float;
#endif

out vec4 fragColor;

float chunkRed () {
  return 0.0;
}

float chunkGreen () {
  return 0.8;
}

vec3 chunkRGB () {
  return vec3(chunkRed(), chunkGreen(), 0.0);
}

vec4 chunkFn () {
  return vec4(chunkRGB(), 1.0);
}

void main (void) {
  fragColor = chunkFn();
}
```

## License

[MIT](./LICENSE).
