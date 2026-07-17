# 原生 WebGL

下面是一条不依赖框架、可以直接运行的最小渲染链路。示例同时处理编译诊断、高 DPI 画布和逐帧绘制，避免“能编译但画面尺寸或错误信息不可靠”的常见问题。

```glsl title="src/shaders/color.glsl"
vec3 colorRamp(float t) {
  return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}
```

```glsl title="src/shaders/fullscreen.vert"
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
```

```glsl title="src/shaders/gradient.frag"
precision highp float;
varying vec2 vUv;
uniform float uTime;

#include color;

void main() {
  gl_FragColor = vec4(colorRamp(vUv.x + uTime * 0.05), 1.0);
}
```

```ts title="src/main.ts"
import fragmentSource from './shaders/gradient.frag';
import vertexSource from './shaders/fullscreen.vert';

const canvas = document.querySelector<HTMLCanvasElement>('canvas');
if (!canvas) throw new Error('Canvas element not found');

const gl = canvas.getContext('webgl');
if (!gl) throw new Error('WebGL is not supported in this browser');

function compile(type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Shader compile failed';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
const program = gl.createProgram();
if (!program) throw new Error('Unable to create WebGL program');

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  const message = gl.getProgramInfoLog(program) ?? 'Program link failed';
  gl.deleteProgram(program);
  throw new Error(message);
}
gl.deleteShader(vertexShader);
gl.deleteShader(fragmentShader);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

const position = gl.getAttribLocation(program, 'position');
const time = gl.getUniformLocation(program, 'uTime');
if (position < 0 || !time) throw new Error('Required shader inputs are inactive');

gl.useProgram(program);
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function render(now: number) {
  resizeCanvas();
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(time, now / 1000);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
```

在组件中使用时，还应在卸载阶段取消动画帧并删除 buffer 与 program。开发模式下保持 `minify: false`，可以获得更容易对应源码的 GPU 编译日志；生产构建再开启压缩。
