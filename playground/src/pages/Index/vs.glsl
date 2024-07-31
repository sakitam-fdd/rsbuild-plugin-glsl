#version 300 es
in vec2 position;
in vec3 instanceColor;
in vec2 instanceOffset;

#include ./setColor.glsl

void main() {
  color_setColor(instanceColor);
  gl_Position = vec4(position + instanceOffset, 0.0, 1.0);
}
