import type { Rspack } from '@rsbuild/core';
import { resolveOptions, transformShader } from './core';
import type { PluginGlslOptions } from './types';

function readOriginalResource(context: Rspack.LoaderContext<PluginGlslOptions>): Promise<string> {
  return new Promise((resolve, reject) => {
    context.fs.readFile(
      context.resourcePath,
      (error: NodeJS.ErrnoException | null, value?: Buffer) => {
        if (error) reject(error);
        else resolve(String(value));
      },
    );
  });
}

function glslLoader(this: Rspack.LoaderContext<PluginGlslOptions>, contents: string): void {
  this.cacheable(true);
  const callback = this.async();

  void (async () => {
    try {
      const rawOptions = this.getOptions() as PluginGlslOptions;
      const options = resolveOptions(rawOptions);
      const preTransformed =
        /^\s*export\s+default\s/.test(contents) || /^\s*module\.exports\s*=/.test(contents);
      const source = preTransformed ? await readOriginalResource(this) : String(contents);
      const result = await transformShader(source, this.resourcePath, {
        ...options,
        cwd: this.rootContext,
      });

      if (options.watch) {
        for (const dependency of result.dependencies) {
          this.addDependency(dependency);
        }
      }

      for (const warning of result.warnings) {
        this.emitWarning(new Error(warning));
      }

      callback(null, `export default ${JSON.stringify(result.code)};`);
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  })();
}

export default glslLoader;
