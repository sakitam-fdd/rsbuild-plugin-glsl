# WebGPU / WGSL

`.wgsl` 默认位于匹配范围内，导入结果同样是字符串。下面的示例聚焦于“导入源码 → 创建模块 → 读取诊断”，提交计算任务时还需要创建 bind group、pipeline 和 command encoder。

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

## 自定义指令

WGSL 本身没有 `#include` 标准。若团队希望避免预处理器风格，可以改成：

```ts
pluginGlsl({
  importKeywords: ['@import'],
  defaultExtension: 'wgsl',
});
```

```wgsl
@import chunks/color;
```

## Slang → WGSL

把 `.slang` 纳入 `include`，再通过异步 `onComplete` 调用编译器：

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

编译器二进制、缓存和诊断策略由项目控制；插件会把回调异常作为构建错误报告。
