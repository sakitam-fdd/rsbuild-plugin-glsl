# 配置项

```ts
import { pluginGlsl, type PluginGlslOptions } from 'rsbuild-plugin-glsl';

const options: PluginGlslOptions = {};
pluginGlsl(options);
```

| 配置                      | 类型                         | 默认值                                   | 说明                              |
| ------------------------- | ---------------------------- | ---------------------------------------- | --------------------------------- |
| `include`                 | `Rspack.RuleSetCondition`    | `/\.(glsl\|wgsl\|vert\|frag\|vs\|fs)$/i` | 选择交给 loader 的文件            |
| `exclude`                 | `Rspack.RuleSetCondition`    | `undefined`                              | 排除路径或模块                    |
| `defaultExtension`        | `string`                     | `'glsl'`                                 | 导入未写后缀时补充的扩展名        |
| `warnDuplicatedImports`   | `boolean`                    | `true`                                   | 对每个导入者/重复模块组合警告一次 |
| `removeDuplicatedImports` | `boolean`                    | `false`                                  | 同一入口依赖图只内联一次模块      |
| `importKeywords`          | `readonly string[]`          | `['#include']`                           | 可识别的模块导入指令              |
| `onComplete`              | `ShaderProcessor`            | `undefined`                              | 展开、压缩之后的异步后处理        |
| `minify`                  | `boolean \| ShaderProcessor` | `false`                                  | 内置压缩或自定义压缩函数          |
| `compress`                | `boolean \| ShaderProcessor` | `false`                                  | `minify` 的兼容别名（已废弃）     |
| `watch`                   | `boolean`                    | `true`                                   | 向 Rspack 注册递归依赖            |
| `root`                    | `string`                     | `'/'`                                    | 根路径导入相对项目根的基目录      |

## `include` / `exclude`

它们直接交给 Rspack rule，而不是作为 glob 处理：

```ts
pluginGlsl({
  include: [/\.glsl$/i, /\.frag$/i],
  exclude: /node_modules/,
});
```

## `minify`

`true` 使用内置的保守压缩器，保留预处理指令的换行。也可传异步函数：

```ts
pluginGlsl({
  minify: async (source, resourcePath) => {
    return optimizeWithYourCompiler(source, resourcePath);
  },
});
```

## `onComplete`

始终在内联和 `minify` 之后调用，适合 Slang → WGSL、注入构建标记或项目级校验：

```ts
pluginGlsl({
  onComplete: async (source, resourcePath) => {
    await validateShader(source);
    return `// built from ${resourcePath}\n${source}`;
  },
});
```

回调抛出的错误会让当前模块构建失败，并保留错误栈。

## 默认值解析

选项会逐项合并，而不是只在整个参数为 `undefined` 时应用。`pluginGlsl()`、`pluginGlsl({})` 与只传一个字段都能得到完整默认值。
