# Migration and compatibility

## Upgrading from 1.0.x

Existing configuration remains valid:

- `pluginGlsl()` and its named export are unchanged.
- `compress` remains as a deprecated alias for `minify`.
- Existing `root`, filter, extension and duplicate-warning defaults are preserved.
- The package still publishes both ESM `import` and CommonJS `require` conditions.

Move to the clearer name when convenient:

```diff
 pluginGlsl({
-  compress: true,
+  minify: true,
 })
```

When both are present, `minify` wins so shared configuration can migrate incrementally.

## Rsbuild 1 and 2

The peer range is `^1.0.0 || ^2.0.0`. The implementation uses `modifyBundlerChain` and loader APIs shared by both lines. CI tests Rsbuild 2 as the mainline and runs a separate build against the latest Rsbuild 1.x branch.

## Correctness fixes

- `pluginGlsl({})` now receives every default.
- Per-transform state prevents parallel compilation leaks.
- Root imports use Rsbuild's `rootContext`.
- Nested chunks are always registered as dependencies.
- Multiple block comments and commented imports are handled correctly.

Keep `removeDuplicatedImports: false` if existing shaders intentionally rely on repeated declarations.

## Migrating from vite-plugin-glsl

Shader options map closely, but Vite filters are globs while Rsbuild uses Rspack conditions:

```diff
- include: ['**/*.glsl', '**/*.frag']
+ include: /\.(?:glsl|frag)$/i
```

`onComplete`, `importKeywords`, `minify`, `watch` and `removeDuplicatedImports` transfer directly.
