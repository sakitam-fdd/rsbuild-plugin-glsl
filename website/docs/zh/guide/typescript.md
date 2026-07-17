# TypeScript

## 全局声明

在应用的 `tsconfig.json` 中加入类型入口：

```json
{
  "compilerOptions": {
    "types": ["rsbuild-plugin-glsl/ext"]
  }
}
```

也可以放在项目的全局声明文件中：

```ts
/// <reference types="rsbuild-plugin-glsl/ext" />
```

它为 `.glsl`、`.wgsl`、`.vert`、`.frag`、`.vs`、`.fs` 提供 `string` 默认导出。

## 配置类型

```ts
import type {
  PluginGlslOptions,
  ShaderProcessor,
  TransformShaderResult,
} from 'rsbuild-plugin-glsl';
```

`include` 与 `exclude` 使用 Rspack 的 `RuleSetCondition`，可以传正则、字符串条件、函数或条件数组。它们不是 shell glob；需要匹配后缀时优先使用正则：

```ts
const options: PluginGlslOptions = {
  include: /\.(?:glsl|wgsl|vert|frag)$/i,
  exclude: /(?:^|[/\\])vendor(?:[/\\])/,
};
```

## 非默认后缀

若项目包含 `.slang`，需要补充自己的模块声明：

```ts title="src/env.d.ts"
declare module '*.slang' {
  const source: string;
  export default source;
}
```

同时让规则选中它：

```ts
pluginGlsl({
  include: /\.(?:glsl|slang)$/i,
});
```
