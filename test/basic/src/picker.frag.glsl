precision highp float;

uniform sampler2D u_texture;

varying vec2 vUv;

void main () {
    vec2 uv = vUv;

    vec4 color = texture2D(u_texture, vUv);

    gl_FragColor = color;
}
