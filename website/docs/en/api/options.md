# Options

```ts
import { pluginGlsl, type PluginGlslOptions } from 'rsbuild-plugin-glsl';

const options: PluginGlslOptions = {};
pluginGlsl(options);
```

| Option                    | Type                         | Default                                  | Purpose                                            |
| ------------------------- | ---------------------------- | ---------------------------------------- | -------------------------------------------------- |
| `include`                 | `Rspack.RuleSetCondition`    | `/\.(glsl\|wgsl\|vert\|frag\|vs\|fs)$/i` | Select modules handled by the loader               |
| `exclude`                 | `Rspack.RuleSetCondition`    | `undefined`                              | Exclude paths or modules                           |
| `defaultExtension`        | `string`                     | `'glsl'`                                 | Suffix for extension-less chunk imports            |
| `warnDuplicatedImports`   | `boolean`                    | `true`                                   | Warn once per importer/duplicate pair              |
| `removeDuplicatedImports` | `boolean`                    | `false`                                  | Inline a chunk once per entry graph                |
| `importKeywords`          | `readonly string[]`          | `['#include']`                           | Recognized import directives                       |
| `onComplete`              | `ShaderProcessor`            | `undefined`                              | Async post-processing after expansion/minification |
| `minify`                  | `boolean \| ShaderProcessor` | `false`                                  | Built-in or custom minification                    |
| `compress`                | `boolean \| ShaderProcessor` | `false`                                  | Deprecated compatibility alias                     |
| `watch`                   | `boolean`                    | `true`                                   | Register recursive dependencies with Rspack        |
| `root`                    | `string`                     | `'/'`                                    | Project-relative base for root imports             |

## Filters

Filters are passed directly to the Rspack rule; they are not glob strings:

```ts
pluginGlsl({
  include: [/\.glsl$/i, /\.frag$/i],
  exclude: /node_modules/,
});
```

## `minify`

`true` uses a conservative built-in minifier that keeps preprocessor directives on separate lines. A function can be async:

```ts
pluginGlsl({
  minify: async (source, resourcePath) => {
    return optimizeWithYourCompiler(source, resourcePath);
  },
});
```

## `onComplete`

Runs after expansion and minification, which makes it suitable for Slang → WGSL compilation, validation or build markers:

```ts
pluginGlsl({
  onComplete: async (source, resourcePath) => {
    await validateShader(source);
    return `// built from ${resourcePath}\n${source}`;
  },
});
```

Thrown errors fail the current module while preserving their stack. Options merge field by field, so `pluginGlsl({})` receives the complete defaults.
