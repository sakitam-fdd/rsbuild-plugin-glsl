# Troubleshooting

## TypeScript cannot find shader modules

Add `rsbuild-plugin-glsl/ext` to `compilerOptions.types` or use the triple-slash reference. Custom extensions need their own ambient module declaration.

## `Unable to load shader chunk`

The message includes both the request and importer. Check the implicit `defaultExtension`, root-relative base, case-sensitive file names on Linux CI, and whether angle-bracket syntax was used accidentally. `<chunk>` imports are intentionally left to Three.js.

## `Recursive shader import detected`

Follow the printed chain to the first repeated path. Extract shared declarations into a leaf module or remove the reverse edge. Deduplication never hides a real cycle.

## Chunk edits do not refresh

Keep `watch: true`. Generated files should be written atomically to their final path so file watchers receive a stable event.

## Driver line numbers look shifted

GPU drivers compile the expanded string. Disable `minify` in development and consider injecting module markers or supported `#line` directives through `onComplete`.

## Package resolution problems

Releases are checked with publint and Are The Types Wrong across ESM, CJS and TypeScript resolution modes. Include Node, Rsbuild and package-manager versions in a minimal reproduction.
