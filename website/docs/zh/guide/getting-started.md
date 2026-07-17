# 快速开始

`rsbuild-plugin-glsl` 把 `.glsl`、`.wgsl`、`.vert`、`.frag`、`.vs` 和 `.fs` 文件编译为默认导出的字符串，并在编译前展开本地 shader 模块。

## 要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- Rsbuild `1.x` 或 `2.x`
- ESM 与 CommonJS 配置文件均可使用

## 安装

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

## 注册插件

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

export default defineConfig({
  plugins: [pluginGlsl()],
});
```

随后可以像普通模块一样导入：

```ts
import fragmentShader from './shaders/scene.frag';
import vertexShader from './shaders/scene.vert';

console.log(fragmentShader, vertexShader);
```

## 推荐的生产配置

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

`root: '/'` 表示以 Rsbuild 项目根目录为根路径，所以 `#include /src/shaders/common` 不依赖启动命令所在目录。

## 验证结果

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

构建后，导入值中不再包含 `#include`，而是完整的 `getColor` 函数。开发模式下修改 `color.glsl`，引用它的入口 shader 会被重新编译。

## 下一步

- 阅读[模块化 Shader](/guide/includes)，了解路径、递归和去重规则。
- 查看[全部配置项](/api/options)。
- 复制[原生 WebGL 示例](/examples/webgl)验证第一帧画面。
