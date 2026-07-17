# Three.js

The plugin produces strings and stays renderer-agnostic.

```ts title="src/material.ts"
import * as THREE from 'three';
import fragmentShader from './shaders/planet.frag';
import vertexShader from './shaders/planet.vert';

export const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uAtmosphere: { value: new THREE.Color('#67d9ff') },
  },
});
```

## Coexisting with Three.js chunks

Use paths for local chunks:

```glsl
#include ./chunks/project-noise;
```

Keep angle brackets for built-in Three.js chunks:

```glsl
#include <common>
#include <tonemapping_fragment>
```

Angle-bracket imports pass through for `ShaderMaterial` to resolve.

## React Three Fiber

Import sources outside the component so React does not recreate module strings:

```tsx
import fragmentShader from './ocean.frag';
import vertexShader from './ocean.vert';

export function Ocean() {
  return (
    <mesh>
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
}
```

Rspack rebuilds shaders when a nested chunk changes. Whether the material instance is reused or replaced is controlled by the framework's HMR behavior.
