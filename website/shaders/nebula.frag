precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

#include chunks/noise;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  float radius = length(uv);
  float cloud = fbm(uv * 4.0 + vec2(uTime * 0.025, uTime * 0.018));
  float core = exp(-radius * 3.2) * (0.7 + cloud);
  float stars = step(0.992, hash21(floor(gl_FragCoord.xy * 0.45))) * (0.6 + hash21(gl_FragCoord.xy));
  vec3 color = mix(vec3(0.015, 0.015, 0.06), vec3(0.72, 0.18, 0.78), cloud * core);
  color += vec3(0.12, 0.55, 1.0) * core * uIntensity + stars;
  gl_FragColor = vec4(color, 1.0);
}
