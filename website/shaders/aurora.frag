precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

#include /shaders/chunks/noise;
#include /shaders/chunks/palette;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  float ribbon = fbm(vec2(uv.x * 1.35 + uTime * 0.08, uv.y * 2.2 - uTime * 0.12));
  float glow = 0.035 / abs(uv.y + ribbon * 0.62 - 0.2);
  vec3 color = spectralPalette(ribbon + uTime * 0.025) * glow * uIntensity;
  color += vec3(0.01, 0.025, 0.055) / max(length(uv) * 0.8, 0.2);
  gl_FragColor = vec4(pow(color, vec3(0.82)), 1.0);
}
