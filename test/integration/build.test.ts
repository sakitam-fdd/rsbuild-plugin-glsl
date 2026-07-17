import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRsbuild } from '@rsbuild/core';
import { describe, expect, it } from '@rstest/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

const fixtureRoot = join(dirname(fileURLToPath(import.meta.url)), 'fixture');

async function findJavaScript(directory: string): Promise<string> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await findJavaScript(path).catch(() => '');
      if (nested) return nested;
    } else if (/\.js$/.test(entry.name)) {
      return path;
    }
  }
  throw new Error(`No JavaScript output found in ${directory}`);
}

describe('Rsbuild integration', () => {
  it('builds expanded shader modules with the current Rsbuild API', async () => {
    const outputPath = await mkdtemp(join(tmpdir(), 'rsbuild-plugin-glsl-'));

    try {
      const rsbuild = await createRsbuild({
        cwd: fixtureRoot,
        rsbuildConfig: {
          plugins: [pluginGlsl({ minify: true })],
          source: { entry: { index: './src/index.ts' } },
          output: { distPath: { root: outputPath } },
        },
      });

      await rsbuild.build();
      const bundle = await readFile(await findJavaScript(outputPath), 'utf8');

      expect(bundle).toContain('pickColor');
      expect(bundle).toContain('gl_FragColor');
      expect(bundle).not.toContain('#include');
    } finally {
      await rm(outputPath, { recursive: true, force: true });
    }
  });
});
