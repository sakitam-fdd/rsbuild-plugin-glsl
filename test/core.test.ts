import { resolve } from 'node:path';
import { describe, expect, it } from '@rstest/core';
import { minifyShader, resolveOptions, stripShaderComments, transformShader } from '../src/core';

const projectRoot = resolve('/project');

function createReader(files: Record<string, string>) {
  const normalized = new Map(
    Object.entries(files).map(([path, source]) => [resolve(projectRoot, path), source]),
  );

  return async (path: string) => {
    const source = normalized.get(path);
    if (source === undefined) throw new Error(`ENOENT: ${path}`);
    return source;
  };
}

describe('resolveOptions', () => {
  it('merges individual options and keeps the compress alias working', () => {
    expect(resolveOptions({}).root).toBe('/');
    expect(resolveOptions({ compress: true }).minify).toBe(true);
    expect(resolveOptions({ compress: true, minify: false }).minify).toBe(false);
    expect(resolveOptions({ defaultExtension: '.wgsl' }).defaultExtension).toBe('wgsl');
  });

  it('rejects invalid parser options early', () => {
    expect(() => resolveOptions({ defaultExtension: '.' })).toThrow('must not be empty');
    expect(() => resolveOptions({ importKeywords: [] })).toThrow('at least one');
  });
});

describe('transformShader', () => {
  it('expands nested, extension-less and root-relative imports', async () => {
    const resourcePath = resolve(projectRoot, 'src/main.frag');
    const result = await transformShader(
      `#version 300 es
#include "chunks/color";
#include /shared/math.glsl
void main(){gl_FragColor=makeColor(saturate(2.0));}`,
      resourcePath,
      {
        cwd: projectRoot,
        readFile: createReader({
          'src/chunks/color.glsl': 'vec4 makeColor(float v){return vec4(v);}',
          'shared/math.glsl': 'float saturate(float v){return clamp(v,0.0,1.0);}',
        }),
      },
    );

    expect(result.code).toContain('vec4 makeColor');
    expect(result.code).toContain('float saturate');
    expect(result.dependencies).toHaveLength(2);
  });

  it('ignores imports in comments and Three.js angle-bracket chunks', async () => {
    const source = `// #include missing-a
/// #include missing-b
/* #include missing-c */
#include <common>
void main() {}`;
    const result = await transformShader(source, resolve(projectRoot, 'main.frag'), {
      cwd: projectRoot,
      readFile: createReader({}),
    });

    expect(result.dependencies).toEqual([]);
    expect(result.code).toContain('#include <common>');
  });

  it('warns about duplicate imports and can remove the duplicate output', async () => {
    const result = await transformShader(
      '#include a\n#include b',
      resolve(projectRoot, 'main.frag'),
      {
        cwd: projectRoot,
        removeDuplicatedImports: true,
        readFile: createReader({
          'a.glsl': '#include shared\nfloat a(){return shared();}',
          'b.glsl': '#include shared\nfloat b(){return shared();}',
          'shared.glsl': 'float shared(){return 1.0;}',
        }),
      },
    );

    expect(result.warnings).toHaveLength(1);
    expect(result.code.match(/float shared/g)).toHaveLength(1);
  });

  it('reports the complete recursive import chain', async () => {
    await expect(
      transformShader('#include a', resolve(projectRoot, 'main.frag'), {
        cwd: projectRoot,
        readFile: createReader({
          'a.glsl': '#include nested/b',
          'nested/b.glsl': '#include ../a',
        }),
      }),
    ).rejects.toThrow(/a\.glsl.*b\.glsl.*a\.glsl/);
  });

  it('supports escaped custom import keywords', async () => {
    const result = await transformShader('@use+ chunk.wgsl', resolve(projectRoot, 'main.wgsl'), {
      cwd: projectRoot,
      importKeywords: ['@use+'],
      readFile: createReader({ 'chunk.wgsl': 'fn shade() -> f32 { return 1.0; }' }),
    });

    expect(result.code).toContain('fn shade');
  });

  it('awaits custom minification and completion hooks in order', async () => {
    const calls: string[] = [];
    const resourcePath = resolve(projectRoot, 'main.frag');
    const result = await transformShader('void main() {}', resourcePath, {
      cwd: projectRoot,
      minify: async (source) => {
        calls.push('minify');
        return source.replace(' ', '');
      },
      onComplete: async (source, path) => {
        calls.push('complete');
        return `${source}\n// ${path}`;
      },
    });

    expect(calls).toEqual(['minify', 'complete']);
    expect(result.code).toContain(`// ${resourcePath}`);
  });

  it('keeps concurrent transforms isolated', async () => {
    const run = (name: string, value: string) =>
      transformShader(`#include ${name}`, resolve(projectRoot, `${name}.frag`), {
        cwd: projectRoot,
        readFile: async () => {
          await new Promise((resolvePromise) => setTimeout(resolvePromise, 5));
          return value;
        },
      });

    const [first, second] = await Promise.all([
      run('first', 'float firstOnly = 1.0;'),
      run('second', 'float secondOnly = 2.0;'),
    ]);

    expect(first.code).toContain('firstOnly');
    expect(first.code).not.toContain('secondOnly');
    expect(second.code).toContain('secondOnly');
    expect(second.code).not.toContain('firstOnly');
  });

  it('adds useful context to missing chunk errors', async () => {
    await expect(
      transformShader('#include missing', resolve(projectRoot, 'main.frag'), {
        cwd: projectRoot,
        readFile: createReader({}),
      }),
    ).rejects.toThrow(/missing.*main\.frag/);
  });
});

describe('source processing helpers', () => {
  it('removes every block comment without joining tokens', () => {
    expect(stripShaderComments('float/* one */value;/* two */\n// tail')).toBe('float value; \n');
  });

  it('preserves preprocessor lines while minifying shader code', () => {
    expect(minifyShader('#version 300 es\n#define FOO 1\nvoid main () { return; }')).toBe(
      '#version 300 es\n#define FOO 1\nvoid main(){return;}',
    );
  });
});
