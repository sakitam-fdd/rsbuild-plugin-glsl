# rsbuild-plugin-glsl

[中文](#中文) · [English](#english) · [Documentation](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/)

[![npm](https://img.shields.io/npm/v/rsbuild-plugin-glsl?style=flat-square)](https://www.npmjs.com/package/rsbuild-plugin-glsl)
[![CI](https://github.com/sakitam-fdd/rsbuild-plugin-glsl/actions/workflows/ci.yml/badge.svg)](https://github.com/sakitam-fdd/rsbuild-plugin-glsl/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/rsbuild-plugin-glsl?style=flat-square)](./LICENSE)

## 中文

为 Rsbuild 提供 GLSL、WGSL 和模块化 shader 文件导入。支持递归 `#include`、依赖监听、重复模块检测/去重、异步后处理和生产压缩。

### 安装

```bash
pnpm add -D rsbuild-plugin-glsl
```

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

export default defineConfig(({ envMode }) => ({
  plugins: [
    pluginGlsl({
      minify: envMode === 'production',
      removeDuplicatedImports: true,
    }),
  ],
}));
```

```glsl title="main.frag"
#include chunks/color;

void main() {
  gl_FragColor = getColor();
}
```

```ts
import fragmentShader from './main.frag';
```

TypeScript 项目在 `compilerOptions.types` 中加入 `rsbuild-plugin-glsl/ext`。

完整的[中文指南](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/)、[配置 API](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/api/options)和[实时示例](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/examples/)由 Rspress 构建。

## English

Import GLSL, WGSL and modular shader files in Rsbuild. Recursive includes, dependency watching, duplicate detection/removal, async post-processing and production minification are built in.

### Install

```bash
npm install --save-dev rsbuild-plugin-glsl
```

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

export default defineConfig(({ envMode }) => ({
  plugins: [
    pluginGlsl({
      minify: envMode === 'production',
      removeDuplicatedImports: true,
    }),
  ],
}));
```

```ts
import fragmentShader from './main.frag';
```

Add `rsbuild-plugin-glsl/ext` to `compilerOptions.types` in TypeScript applications.

Read the full [English guide](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/en/guide/getting-started), [API reference](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/en/api/options) and [live examples](https://sakitam-fdd.github.io/rsbuild-plugin-glsl/en/examples/).

## Options

| Option                    | Default                 | Notes                                  |
| ------------------------- | ----------------------- | -------------------------------------- |
| `include`                 | shader extension RegExp | Rspack `RuleSetCondition`              |
| `exclude`                 | `undefined`             | Rspack `RuleSetCondition`              |
| `defaultExtension`        | `'glsl'`                | Appended to extension-less chunks      |
| `warnDuplicatedImports`   | `true`                  | One warning per importer/chunk pair    |
| `removeDuplicatedImports` | `false`                 | Inline a chunk once per entry graph    |
| `importKeywords`          | `['#include']`          | Custom directives are supported        |
| `onComplete`              | `undefined`             | Async final processor                  |
| `minify`                  | `false`                 | Boolean or custom async processor      |
| `compress`                | `false`                 | Deprecated alias of `minify`           |
| `watch`                   | `true`                  | Register all chunks with Rspack        |
| `root`                    | `'/'`                   | Project-relative base for root imports |

## Compatibility and reliability

- Rsbuild `1.x` and `2.x`; Node.js `^20.19.0 || >=22.12.0`.
- ESM and CommonJS package conditions with matching `.d.ts` and `.d.cts` declarations.
- Per-transform state: parallel entries and multi-environment builds cannot leak dependency state.
- CI covers Linux, Windows, minimum/latest Node, Rsbuild 1 compatibility, package export validation and the Rspress production build.

Inspired by [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl).

## License

[MIT](./LICENSE)
