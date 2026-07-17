precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

#include chunks/noise;
#include chunks/palette;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  float field = fbm(uv * 3.1 + vec2(uTime * 0.035, -uTime * 0.02));
  float lines = 1.0 - smoothstep(0.035, 0.09, abs(fract(field * 11.0) - 0.5));
  float grid = smoothstep(0.96, 1.0, max(abs(sin(uv.x * 18.0)), abs(sin(uv.y * 18.0))));
  vec3 base = mix(vec3(0.012, 0.035, 0.075), spectralPalette(field + 0.18), field * 0.72);
  vec3 color = base + lines * vec3(0.2, 0.95, 0.82) * uIntensity + grid * 0.025;
  gl_FragColor = vec4(color, 1.0);
}
