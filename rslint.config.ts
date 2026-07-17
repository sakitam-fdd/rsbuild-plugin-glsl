import { defineConfig, globalIgnores, js, ts } from '@rslint/core';

export default defineConfig([
  globalIgnores([
    'dist/**',
    'node_modules/**',
    'playground/**',
    'website/doc_build/**',
    '.pnpm-store/**',
  ]),
  js.configs.recommended,
  ts.configs.recommended,
]);
