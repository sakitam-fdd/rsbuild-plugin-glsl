# 模块化 Shader

## 导入语法

默认识别 `#include`，文件名可带引号、分号，也可省略默认扩展名：

```glsl
#include common;
#include "lighting/brdf.glsl"
#include '../shared/color'
```

未写扩展名时使用 `defaultExtension`（默认 `.glsl`）。`#include <common>` 会保留给 Three.js 等运行时处理，不会被本插件展开。

## 相对路径与根路径

- `#include ./chunk`、`#include ../shared/chunk`：相对当前 shader 文件。
- `#include /src/shaders/chunk`：相对 `root` 对应的目录。
- `root` 是相对 Rsbuild 项目根目录解析的，不依赖 `process.cwd()`。

```ts
pluginGlsl({
  root: '/src/shaders',
});
```

上述配置下，`#include /math/noise` 指向 `<项目根>/src/shaders/math/noise.glsl`。

## 自定义导入指令

多个关键字可以共存，正则特殊字符会被安全转义：

```ts
pluginGlsl({
  importKeywords: ['#include', '@import', '@use+'],
});
```

这对 Slang 转译前处理、内部 shader DSL 或迁移旧代码很有用。

## 重复导入

默认会继续内联重复模块并发出警告，以保持 1.0 版本行为。推荐在确认模块没有依赖重复声明后开启：

```ts
pluginGlsl({
  removeDuplicatedImports: true,
  warnDuplicatedImports: true,
});
```

去重作用域是“单个入口 shader 的完整依赖图”，不同入口之间互不共享状态。

## 循环依赖

`a.glsl → b.glsl → a.glsl` 会立即终止构建，并打印完整导入链。即使关闭重复导入警告，循环依赖仍然是错误。

## 注释

普通行注释和块注释会在展开阶段移除，因此注释中的 `#include` 不会访问文件系统。`///` 文档注释默认保留；如果其中包含导入指令，该行仍按注释处理。

## 监听与缓存

`watch: true`（默认）会把所有递归依赖传递给 Rspack 的依赖图。这同时服务于 HMR、watch 重建和持久缓存失效；它不是只在开发环境生效的开关。只有在 chunk 内容完全由外部系统管理时才建议关闭。
