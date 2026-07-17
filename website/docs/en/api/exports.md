# Exported API

## `pluginGlsl(options?)`

Returns an `RsbuildPlugin`. Its stable plugin-name constant is available as `PLUGIN_GLSL_NAME` (`rsbuild:glsl`).

## `transformShader(source, resourcePath, options?)`

The Rsbuild-independent transformation function for tests, CLIs and custom tooling. Calls never share mutable state.

```ts
const result = await transformShader(source, '/project/main.frag', {
  cwd: '/project',
  minify: true,
});
```

```ts
interface TransformShaderResult {
  code: string;
  dependencies: string[];
  warnings: string[];
}
```

Pass `readFile` to integrate a virtual file system.

## Processing helpers

- `minifyShader(source)` conservatively removes comments and whitespace while preserving preprocessor lines.
- `stripShaderComments(source, preserveTripleSlash?)` removes block and regular line comments.
- `resolveOptions(options?)` validates and fills every option.

## Constants and types

- `PLUGIN_GLSL_NAME`
- `DEFAULT_SHADER_PATTERN`
- `DEFAULT_OPTIONS`
- `PluginGlslOptions`
- `ResolvedPluginGlslOptions`
- `ShaderProcessor`
- `TransformShaderOptions`
- `TransformShaderResult`
