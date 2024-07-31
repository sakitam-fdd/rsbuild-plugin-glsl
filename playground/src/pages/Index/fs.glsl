#version 300 es
out vec4 fragColor;

#include ./getColor.glsl

void main() {
  fragColor = vec4(color_getColor(), 1.0);
}
