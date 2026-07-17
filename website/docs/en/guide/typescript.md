# TypeScript

Add the bundled declarations to your application:

```json
{
  "compilerOptions": {
    "types": ["rsbuild-plugin-glsl/ext"]
  }
}
```

Or reference them from a global declaration file:

```ts
/// <reference types="rsbuild-plugin-glsl/ext" />
```

The subpath declares string default exports for `.glsl`, `.wgsl`, `.vert`, `.frag`, `.vs` and `.fs`.

## Configuration types

```ts
import type {
  PluginGlslOptions,
  ShaderProcessor,
  TransformShaderResult,
} from 'rsbuild-plugin-glsl';
```

`include` and `exclude` are Rspack `RuleSetCondition` values, not shell globs. Prefer a regular expression for extensions:

```ts
const options: PluginGlslOptions = {
  include: /\.(?:glsl|wgsl|vert|frag)$/i,
  exclude: /(?:^|[/\\])vendor(?:[/\\])/,
};
```

Custom extensions require a matching ambient module declaration and an updated `include` condition.
