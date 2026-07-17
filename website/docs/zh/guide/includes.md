# 模块化 Shader

## 导入语法

插件默认识别 `#include`。模块路径可以使用引号或分号，也可以省略默认扩展名：

```glsl
#include common;
#include "lighting/brdf.glsl"
#include '../shared/color'
```

未写扩展名时，插件会补上 `defaultExtension`（默认为 `.glsl`）。`#include <common>` 会原样保留，交给 Three.js 等渲染器的预处理阶段解析。

## 相对路径与根路径

- `#include ./chunk`、`#include ../shared/chunk`：相对当前 shader 文件。
- `#include /src/shaders/chunk`：相对 `root` 对应的目录。
- `root` 相对 Rsbuild 项目根目录解析，不依赖进程的 `process.cwd()`。

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

这适用于 Slang 编译前处理、内部 Shader DSL，以及旧项目迁移。

## 重复导入

为兼容 1.0 版本，插件默认仍会内联重复模块并发出警告。确认模块不依赖重复声明后，建议开启去重：

```ts
pluginGlsl({
  removeDuplicatedImports: true,
  warnDuplicatedImports: true,
});
```

去重作用域是“单个入口 Shader 的完整依赖图”，不同入口之间不会共享状态。

## 循环依赖

`a.glsl → b.glsl → a.glsl` 会立即终止构建，并打印完整导入链。即使关闭重复导入警告，循环依赖仍然是错误。

## 注释

普通行注释和块注释会在展开阶段移除，因此注释中的 `#include` 不会触发文件读取。`///` 文档注释默认保留；如果其中包含导入指令，该行仍按注释处理。

## 监听与缓存

`watch: true`（默认值）会把所有递归依赖登记到 Rspack 依赖图中，同时服务于 HMR、watch 重建和持久缓存失效。只有当模块内容完全由外部系统管理时，才建议关闭该选项。
