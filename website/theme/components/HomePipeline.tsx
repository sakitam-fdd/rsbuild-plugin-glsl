type HomePipelineProps = {
  lang?: 'zh' | 'en';
};

const copy = {
  zh: {
    kicker: 'BUILD GRAPH / 01—03',
    title: '从一次导入，到可执行的 Shader 源码',
    description:
      '插件在构建阶段展开本地模块、登记递归依赖，并把最终源码作为普通 JavaScript 字符串交给渲染层。',
    stages: [
      {
        title: '匹配 Shader 模块',
        detail: '默认覆盖六类常见扩展名，也支持 Rspack 条件自定义。',
        code: "import scene from './scene.frag'",
      },
      {
        title: '递归展开依赖',
        detail: '相对路径、根路径、循环检测与重复模块策略在同一依赖图内完成。',
        code: '#include chunks/noise;',
      },
      {
        title: '输出可消费源码',
        detail: 'WebGL、Three.js 与 WebGPU 只接收最终字符串，不需要额外运行时。',
        code: 'material.fragmentShader = scene',
      },
    ],
    result: '一次构建，完整追踪',
    metrics: [
      ['6', '默认扩展名'],
      ['0', '跨模块共享状态'],
      ['1 / 2', 'Rsbuild 主版本'],
    ],
  },
  en: {
    kicker: 'BUILD GRAPH / 01—03',
    title: 'From one import to executable shader source',
    description:
      'At build time, the plugin expands local modules, registers recursive dependencies and exports the final source as an ordinary JavaScript string.',
    stages: [
      {
        title: 'Match shader modules',
        detail: 'Six common extensions work by default, with full Rspack condition support.',
        code: "import scene from './scene.frag'",
      },
      {
        title: 'Expand the graph',
        detail:
          'Relative and root imports, cycle detection and deduplication stay inside one graph.',
        code: '#include chunks/noise;',
      },
      {
        title: 'Emit consumable source',
        detail: 'WebGL, Three.js and WebGPU receive a final string with no client runtime.',
        code: 'material.fragmentShader = scene',
      },
    ],
    result: 'One build, complete tracking',
    metrics: [
      ['6', 'default extensions'],
      ['0', 'cross-module state'],
      ['1 / 2', 'Rsbuild majors'],
    ],
  },
} as const;

export function HomePipeline({ lang = 'zh' }: HomePipelineProps) {
  const content = copy[lang];

  return (
    <section className="home-pipeline">
      <header className="home-pipeline__header">
        <div>
          <p className="home-pipeline__kicker">{content.kicker}</p>
          <h2>{content.title}</h2>
        </div>
        <p>{content.description}</p>
      </header>

      <div className="home-pipeline__workspace">
        <ol className="home-pipeline__stages">
          {content.stages.map((stage, index) => (
            <li key={stage.title}>
              <span className="home-pipeline__index">0{index + 1}</span>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
                <code>{stage.code}</code>
              </div>
            </li>
          ))}
        </ol>

        <aside className="home-pipeline__result" aria-label={content.result}>
          <div className="home-pipeline__terminal-bar">
            <span />
            <span />
            <span />
            <b>GLSL_PIPELINE</b>
          </div>
          <div className="home-pipeline__terminal-body">
            <p>$ rsbuild build</p>
            <p>
              <i>✓</i> 3 chunks inlined
            </p>
            <p>
              <i>✓</i> dependency graph registered
            </p>
            <p>
              <i>✓</i> ESM string emitted
            </p>
            <strong>{content.result}</strong>
          </div>
          <dl>
            {content.metrics.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
