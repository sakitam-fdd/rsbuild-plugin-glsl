import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type UserConfig } from '@rspress/core';
import { pluginGlsl } from 'rsbuild-plugin-glsl';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

const config: UserConfig = {
  root: join(currentDirectory, 'docs'),
  outDir: join(currentDirectory, 'doc_build'),
  base: isGitHubActions ? '/rsbuild-plugin-glsl/' : '/',
  lang: 'zh',
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Rsbuild GLSL',
      description: '面向 GLSL、WGSL 与模块化 Shader 的可靠 Rsbuild 插件',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'Rsbuild GLSL',
      description: 'A reliable Rsbuild plugin for GLSL, WGSL and modular shaders',
    },
  ],
  logo: '/logo.svg',
  logoText: 'GLSL / Rsbuild',
  icon: '/logo.svg',
  globalStyles: join(currentDirectory, 'theme/styles.css'),
  head: [
    ['meta', { name: 'theme-color', content: '#07111f' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
  ],
  themeConfig: {
    darkMode: 'dark',
    enableContentAnimation: true,
    enableAppearanceAnimation: true,
    lastUpdated: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/sakitam-fdd/rsbuild-plugin-glsl',
      },
      {
        icon: 'npm',
        mode: 'link',
        content: 'https://www.npmjs.com/package/rsbuild-plugin-glsl',
      },
    ],
    editLink: {
      docRepoBaseUrl: 'https://github.com/sakitam-fdd/rsbuild-plugin-glsl/tree/main/website/docs',
    },
    footer: {
      message: 'Shaders are source code. Build them like source code. · MIT Licensed',
    },
  },
  builderConfig: {
    plugins: [
      pluginGlsl({
        root: '/',
        warnDuplicatedImports: true,
        removeDuplicatedImports: true,
      }),
    ],
  },
};

export default defineConfig(config);
