import { useEffect } from 'react';
import type { FC } from 'react';
import { useRafLoop } from 'react-use';
import useSyncState from '@/hooks/useSyncState';
import { WebGLDevice } from '@luma.gl/webgl';
import { luma } from '@luma.gl/core';

import { Model } from '@luma.gl/engine';

import fs from './fs.glsl';
import vs from './vs.glsl';

import styles from './index.module.less';

luma.registerDevices([WebGLDevice]);

const Main: FC = () => {
  const [config, setConfig, configRef] = useSyncState<Record<string, any>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const createRender = async () => {
    const device = await luma.createDevice({ type: 'webgl', canvas: canvasRef.current });

    configRef.current.device = device;
    configRef.current.positionBuffer = device.createBuffer(new Float32Array([-0.2, -0.2, 0.2, -0.2, 0.0, 0.2]));
    configRef.current.colorBuffer = device.createBuffer(
      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0]),
    );
    configRef.current.offsetBuffer = device.createBuffer(
      new Float32Array([0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5]),
    );

    configRef.current.model = new Model(device, {
      vs,
      fs,
      // modules: [colorShaderModule],
      bufferLayout: [
        { name: 'position', format: 'float32x2' },
        { name: 'instanceColor', format: 'float32x3', stepMode: 'instance' },
        { name: 'instanceOffset', format: 'float32x2', stepMode: 'instance' },
      ],
      attributes: {
        position: configRef.current.positionBuffer,
        instanceColor: configRef.current.colorBuffer,
        instanceOffset: configRef.current.offsetBuffer,
      },
      vertexCount: 3,
      instanceCount: 4,
    });
  };

  useRafLoop(() => {
    const device = configRef.current.device;
    if (configRef.current.model && device) {
      device?.canvasContext?.resize({ useDevicePixels: true });
      device.gl.viewport(
        0,
        0,
        // @ts-ignore Expose canvasContext
        device.gl.drawingBufferWidth,
        // @ts-ignore Expose canvasContext
        device.gl.drawingBufferHeight,
      );

      const renderPass = configRef.current.device.beginRenderPass({ clearColor: [0, 0, 0, 1] });
      configRef.current.model.draw(renderPass);
      renderPass.end();
    }
  });

  const destroy = () => {
    configRef.current.model.destroy();
    configRef.current.positionBuffer.destroy();
    configRef.current.colorBuffer.destroy();
    configRef.current.offsetBuffer.destroy();
  };

  useEffect(() => {
    createRender();

    return () => destroy();
  });

  return (
    <div className={styles.wrap}>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </div>
  );
};

export default Main;
