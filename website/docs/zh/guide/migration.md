# 迁移与兼容

## 从 1.0.x 升级

现有配置无需修改。以下接口保持兼容：

- `pluginGlsl()` 与命名导出不变。
- `compress` 继续可用，内部作为 `minify` 的废弃别名。
- `root`、`include`、`exclude`、`defaultExtension`、`warnDuplicatedImports` 默认行为保持一致。
- 包仍同时提供 ESM `import` 与 CommonJS `require` 条件。

建议逐步把 `compress` 改名为 `minify`：

```diff
 pluginGlsl({
-  compress: true,
+  minify: true,
 })
```

同时配置两者时，`minify` 优先，便于分阶段迁移共享配置。

## Rsbuild 1 与 2

peer dependency 范围是 `^1.0.0 || ^2.0.0`。插件只使用两个版本都稳定提供的 `modifyBundlerChain` 与 Rspack loader API。CI 以 Rsbuild 2 为主线，并单独对最新 1.x 分支执行兼容构建。

## 行为修正

这些修正通常只会消除异常：

- `pluginGlsl({})` 现在会正确补齐全部默认值。
- 不再使用进程级 `Set` / `Map`，并行编译不会串扰。
- 根路径相对 Rsbuild `rootContext`，不再受启动目录影响。
- 所有嵌套依赖都会注册，不再仅在 web HMR 场景注册。
- 多个块注释和注释中的导入都会被正确处理。

如果旧项目依赖“重复声明被多次内联”，请保持 `removeDuplicatedImports: false`（默认）。

## 从 vite-plugin-glsl 迁移

两者的 shader 选项语义基本对应，但构建过滤器不同：Vite 使用 glob，Rsbuild/Rspack 使用 `RuleSetCondition`。把 glob 改为正则即可：

```diff
- include: ['**/*.glsl', '**/*.frag']
+ include: /\.(?:glsl|frag)$/i
```

`onComplete`、`importKeywords`、`minify`、`watch`、`removeDuplicatedImports` 均可直接迁移。
