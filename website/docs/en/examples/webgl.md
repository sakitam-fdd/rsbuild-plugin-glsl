# Vanilla WebGL

This is the smallest framework-free rendering path.

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

const canvas = document.querySelector('canvas')!;
const gl = canvas.getContext('webgl')!;

function compile(type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compile failed');
  }
  return shader;
}

const program = gl.createProgram()!;
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program) ?? 'Program link failed');
}

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

const position = gl.getAttribLocation(program, 'position');
gl.useProgram(program);
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
gl.uniform1f(gl.getUniformLocation(program, 'uTime'), performance.now() / 1000);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

Keep `minify` disabled during development for readable driver diagnostics, then enable it in production.
