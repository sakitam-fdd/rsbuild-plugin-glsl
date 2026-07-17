# WebGPU / WGSL

`.wgsl` is included in the default condition and exports a string like GLSL. This example covers source import, module creation and diagnostics; dispatching work also requires bind groups, a pipeline and a command encoder.

```wgsl title="src/shaders/chunks/color.wgsl"
fn heat(value: f32) -> vec3f {
  return vec3f(value, value * value, 1.0 - value);
}
```

```wgsl title="src/shaders/compute.wgsl"
#include chunks/color.wgsl;

@group(0) @binding(0) var<storage, read_write> output: array<vec4f>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  let value = f32(id.x % 256u) / 255.0;
  output[id.x] = vec4f(heat(value), 1.0);
}
```

```ts
import computeSource from './shaders/compute.wgsl';

if (!navigator.gpu) throw new Error('WebGPU is not supported in this browser');

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error('No compatible WebGPU adapter was found');

const device = await adapter.requestDevice();
const module = device.createShaderModule({ code: computeSource });

const diagnostics = await module.getCompilationInfo();
for (const message of diagnostics.messages) {
  const log =
    message.type === 'error'
      ? console.error
      : message.type === 'warning'
        ? console.warn
        : console.info;
  log(`${message.lineNum}:${message.linePos} ${message.message}`);
}

if (diagnostics.messages.some((message) => message.type === 'error')) {
  throw new Error('WGSL compilation failed');
}
```

WGSL has no standard include directive. Teams that prefer a less preprocessor-like style can configure `importKeywords: ['@import']` and `defaultExtension: 'wgsl'`.

## Slang to WGSL

Include `.slang` in the rule and call a compiler from the async post-processing hook:

```ts
pluginGlsl({
  include: /\.(?:slang|wgsl)$/i,
  importKeywords: ['#include', '@import'],
  onComplete: async (source, path) => {
    if (!path.endsWith('.slang')) return source;
    return compileSlangToWgsl(source);
  },
});
```

Your project owns compiler caching and diagnostics; callback failures surface as module build errors.
