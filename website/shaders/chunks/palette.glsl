vec3 spectralPalette(float t) {
  vec3 a = vec3(0.48, 0.42, 0.58);
  vec3 b = vec3(0.42, 0.38, 0.46);
  vec3 c = vec3(1.0, 0.82, 0.68);
  vec3 d = vec3(0.12, 0.28, 0.58);
  return a + b * cos(6.28318 * (c * t + d));
}
