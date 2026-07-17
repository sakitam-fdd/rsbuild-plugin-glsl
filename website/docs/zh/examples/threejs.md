# Three.js

插件只负责把文件转换成字符串，因此不会绑定具体渲染库。

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

## 与 Three.js chunk 共存

本地路径不使用尖括号：

```glsl
#include ./chunks/project-noise;
```

Three.js 内置 chunk 使用尖括号：

```glsl
#include <common>
#include <tonemapping_fragment>
```

后者会原样保留，由 `ShaderMaterial` 的内部预处理器解析。

## React Three Fiber

在组件外部导入 Shader，避免每次渲染都重新创建模块字符串：

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

当 chunk 文件发生变化时，Rspack 会重新构建依赖它的 Shader 模块；应用层是否复用或重建材质，则由框架自身的 HMR 行为决定。
