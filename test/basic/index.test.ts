import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginGlsl } from '../../dist/index';
import { getRandomPort } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));

const res = {
  vs: 'attribute vec2 uvs;\nattribute vec2 vertices;\n\nvarying vec2 vUv;\n\nvoid main () {\n    vUv = vec2(uvs.x, 1.0 - uvs.y);\n\n    gl_Position = vec4(vertices, 0.0, 1.0);\n}',
  fs: 'precision highp float;\n\nuniform sampler2D u_texture;\n\nvarying vec2 vUv;\n\nvoid main () {\n    vec2 uv = vUv;\n\n    vec4 color = texture2D(u_texture, vUv);\n\n    gl_FragColor = color;\n}',
};

test('should render page as expected', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [pluginGlsl()],
      server: {
        port: getRandomPort(),
      },
    },
  });

  const { server, urls } = await rsbuild.startDevServer();

  await page.goto(urls[0]);
  const v = await page.evaluate('window.exportString');
  expect(v).toEqual(res);

  await server.close();
});

test('should build succeed', async ({ page }) => {
  const rsbuild = await createRsbuild({
    cwd: __dirname,
    rsbuildConfig: {
      plugins: [pluginGlsl()],
    },
  });

  await rsbuild.build();
  const { server, urls } = await rsbuild.preview();

  await page.goto(urls[0]);
  expect(await page.evaluate('window.exportString')).toEqual(res);

  await server.close();
});
