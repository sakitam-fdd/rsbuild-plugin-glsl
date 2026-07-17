# Modular shaders

## Include syntax

`#include` is recognized by default. Quotes, semicolons and explicit extensions are optional:

```glsl
#include common;
#include "lighting/brdf.glsl"
#include '../shared/color'
```

Extension-less paths use `defaultExtension` (`.glsl` by default). Angle-bracket includes such as `#include <common>` are preserved for runtimes like Three.js.

## Relative and root imports

- `./chunk` and `../shared/chunk` resolve from the importing shader.
- `/src/shaders/chunk` resolves from the directory configured by `root`.
- `root` itself resolves from Rsbuild's project root, never from ambient `process.cwd()`.

```ts
pluginGlsl({ root: '/src/shaders' });
```

With that option, `#include /math/noise` points to `<project>/src/shaders/math/noise.glsl`.

## Custom directives

Multiple directives may coexist and regular-expression metacharacters are escaped:

```ts
pluginGlsl({
  importKeywords: ['#include', '@import', '@use+'],
});
```

This is useful for Slang preprocessing, internal shader DSLs and legacy migrations.

## Duplicate imports

By default a duplicate is still inlined and a warning is emitted, preserving 1.0 behavior. After confirming that a chunk does not intentionally repeat declarations, prefer:

```ts
pluginGlsl({
  removeDuplicatedImports: true,
  warnDuplicatedImports: true,
});
```

Deduplication is scoped to one entry shader graph. Concurrent entries never share state.

## Cycles, comments and watching

A cycle such as `a.glsl → b.glsl → a.glsl` fails with the full path chain. Includes inside line or block comments are ignored. `///` documentation comments remain unless they contain an import directive.

`watch: true` registers every recursive chunk with Rspack for HMR, watch rebuilds and persistent-cache invalidation. It is not limited to browser HMR.
