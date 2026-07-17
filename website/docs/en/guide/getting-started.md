# Getting started

`rsbuild-plugin-glsl` turns `.glsl`, `.wgsl`, `.vert`, `.frag`, `.vs` and `.fs` files into default-exported strings, expanding local shader modules before compilation.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- Rsbuild `1.x` or `2.x`
- Both ESM and CommonJS configuration consumers are supported

## Install

:::code-group

```bash [pnpm]
pnpm add -D rsbuild-plugin-glsl
```

```bash [npm]
npm install --save-dev rsbuild-plugin-glsl
```

```bash [yarn]
yarn add --dev rsbuild-plugin-glsl
```

:::

## Register the plugin

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

export default defineConfig({
  plugins: [pluginGlsl()],
});
```

Import shader files like any other module:

```ts
import fragmentShader from './shaders/scene.frag';
import vertexShader from './shaders/scene.vert';
```

## Recommended production setup

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

export default defineConfig(({ envMode }) => ({
  plugins: [
    pluginGlsl({
      minify: envMode === 'production',
      removeDuplicatedImports: true,
      warnDuplicatedImports: true,
      root: '/',
    }),
  ],
}));
```

`root: '/'` means the Rsbuild project root. An import such as `#include /src/shaders/common` is therefore independent of the directory that launched the process.

## Verify an include

```glsl title="scene.frag"
#include chunks/color;

void main() {
  gl_FragColor = getColor();
}
```

```glsl title="chunks/color.glsl"
vec4 getColor() {
  return vec4(0.2, 0.8, 1.0, 1.0);
}
```

The imported JavaScript string contains `getColor`, not `#include`. Editing `color.glsl` recompiles every entry shader that depends on it.

Next, read [Modular shaders](/en/guide/includes), review [all options](/en/api/options), or copy the [vanilla WebGL example](/en/examples/webgl).
