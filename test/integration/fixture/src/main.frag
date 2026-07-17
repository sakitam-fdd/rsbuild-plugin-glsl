precision highp float;

#include chunks/color;

void main() {
  gl_FragColor = pickColor(vec2(0.5));
}
