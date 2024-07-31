attribute vec2 uvs;
attribute vec2 vertices;

varying vec2 vUv;

void main () {
    vUv = vec2(uvs.x, 1.0 - uvs.y);

    gl_Position = vec4(vertices, 0.0, 1.0);
}
