import fragment from './main.frag';

(globalThis as typeof globalThis & { __shaderFixture: string }).__shaderFixture = fragment;
