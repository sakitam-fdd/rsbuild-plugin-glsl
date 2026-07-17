import { useEffect, useRef, useState } from 'react';
import aurora from '../../shaders/aurora.frag';
import vertex from '../../shaders/base.vert';
import nebula from '../../shaders/nebula.frag';
import topography from '../../shaders/topography.frag';

type ShaderCanvasProps = {
  fragment: string;
  label: string;
  playing: boolean;
  speed: number;
  intensity: number;
};

const demos = [
  {
    id: 'aurora',
    title: 'Aurora field',
    titleZh: '极光场',
    detail: 'Root imports · FBM · palette chunk',
    detailZh: '根路径导入 · FBM · 调色板模块',
    fragment: aurora,
  },
  {
    id: 'topography',
    title: 'Signal topography',
    titleZh: '信号地形',
    detail: 'Nested chunks · contour synthesis',
    detailZh: '嵌套模块 · 等值线合成',
    fragment: topography,
  },
  {
    id: 'nebula',
    title: 'Procedural nebula',
    titleZh: '程序化星云',
    detail: 'Reusable noise · responsive uniforms',
    detailZh: '可复用噪声 · 响应式 uniform',
    fragment: nebula,
  },
] as const;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to allocate a WebGL shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compile error';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function ShaderCanvas({ fragment, label, playing, speed, intensity }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ playing, speed, intensity });
  const [error, setError] = useState('');

  settingsRef.current = { playing, speed, intensity };

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!canvas || !gl) {
      setError('WebGL is unavailable in this browser.');
      return;
    }

    let frame = 0;
    let elapsed = 0;
    let previous = performance.now();
    let observer: ResizeObserver | undefined;

    try {
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertex);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragment);
      const program = gl.createProgram();
      if (!program) throw new Error('Unable to allocate a WebGL program.');
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'Unable to link shader program.');
      }

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      const resolution = gl.getUniformLocation(program, 'uResolution');
      const time = gl.getUniformLocation(program, 'uTime');
      const strength = gl.getUniformLocation(program, 'uIntensity');

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
        const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      };

      const render = (now: number) => {
        resize();
        const settings = settingsRef.current;
        if (settings.playing) elapsed += Math.min(now - previous, 40) * settings.speed;
        previous = now;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, elapsed * 0.001);
        gl.uniform1f(strength, settings.intensity);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        frame = requestAnimationFrame(render);
      };

      observer = new ResizeObserver(resize);
      observer.observe(canvas);
      frame = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [fragment]);

  return (
    <div className="shader-canvas-shell">
      <canvas ref={canvasRef} aria-label={label} role="img" />
      <span className="shader-status">
        <i /> compiled by Rsbuild
      </span>
      {error ? <pre className="shader-error">{error}</pre> : null}
    </div>
  );
}

export function ShaderGallery({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(1);
  const isChinese = lang === 'zh';

  return (
    <section className="shader-gallery">
      <header className="shader-gallery-header">
        <div>
          <p className="shader-kicker">LIVE SHADER PIPELINE / 01—03</p>
          <h2>{isChinese ? '把源文件变成实时画面' : 'From source files to live pixels'}</h2>
          <p>
            {isChinese
              ? '下列三个画面直接导入仓库中的 .vert / .frag / .glsl 文件，并由本插件处理模块依赖。'
              : 'These canvases import .vert, .frag and .glsl files directly; this plugin resolves every chunk.'}
          </p>
        </div>
        <button type="button" className="shader-play" onClick={() => setPlaying(!playing)}>
          {playing ? (isChinese ? '暂停动画' : 'Pause') : isChinese ? '继续动画' : 'Resume'}
        </button>
      </header>

      <div className="shader-controls">
        <label>
          <span>
            {isChinese ? '速度' : 'Speed'} <output>{speed.toFixed(1)}×</output>
          </span>
          <input
            type="range"
            min="0.2"
            max="2.4"
            step="0.1"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
        <label>
          <span>
            {isChinese ? '能量' : 'Energy'} <output>{intensity.toFixed(1)}</output>
          </span>
          <input
            type="range"
            min="0.4"
            max="1.8"
            step="0.1"
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />
        </label>
        <div className="shader-pipeline">
          <span>IMPORT</span>
          <b>→</b>
          <span>INLINE</span>
          <b>→</b>
          <span>WATCH</span>
          <b>→</b>
          <span>DRAW</span>
        </div>
      </div>

      <div className="shader-grid">
        {demos.map((demo, index) => (
          <article className="shader-card" key={demo.id}>
            <ShaderCanvas
              fragment={demo.fragment}
              label={isChinese ? demo.titleZh : demo.title}
              playing={playing}
              speed={speed}
              intensity={intensity}
            />
            <footer>
              <span>0{index + 1}</span>
              <div>
                <h3>{isChinese ? demo.titleZh : demo.title}</h3>
                <p>{isChinese ? demo.detailZh : demo.detail}</p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
