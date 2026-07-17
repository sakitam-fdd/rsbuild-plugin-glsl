# 导出 API

## `pluginGlsl(options?)`

返回 `RsbuildPlugin`。插件名常量是 `rsbuild:glsl`，可通过 `PLUGIN_GLSL_NAME` 获取。

```ts
import { PLUGIN_GLSL_NAME, pluginGlsl } from 'rsbuild-plugin-glsl';
```

## `transformShader(source, resourcePath, options?)`

不依赖 Rsbuild 的底层转换函数，适用于测试、CLI 和自定义工具链。它不会共享跨调用状态。

```ts
const result = await transformShader(source, '/project/main.frag', {
  cwd: '/project',
  minify: true,
});
```

返回：

```ts
interface TransformShaderResult {
  code: string;
  dependencies: string[];
  warnings: string[];
}
```

可通过 `readFile` 注入虚拟文件系统：

```ts
await transformShader('#include common', '/virtual/main.frag', {
  readFile: async (path) => virtualFiles.get(path)!,
});
```

## `minifyShader(source)`

保守压缩 GLSL/WGSL 字符串。它删除普通注释和多余空白，但让 `#version`、`#define` 等预处理指令独占一行。

## `stripShaderComments(source, preserveTripleSlash?)`

删除所有块注释与普通行注释。默认保留 `///` 文档注释。

## `resolveOptions(options?)`

校验并补齐配置，返回 `ResolvedPluginGlslOptions`。空扩展名、空导入指令会尽早抛出 `TypeError`。

## 常量

- `PLUGIN_GLSL_NAME`：`'rsbuild:glsl'`
- `DEFAULT_SHADER_PATTERN`：默认后缀正则
- `DEFAULT_OPTIONS`：只读默认配置

## 类型导出

`PluginGlslOptions`、`ResolvedPluginGlslOptions`、`ShaderProcessor`、`TransformShaderOptions`、`TransformShaderResult` 均从包根导出。
