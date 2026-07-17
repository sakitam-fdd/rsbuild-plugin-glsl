# 故障排查

## TypeScript 找不到 shader 模块

确认应用 `tsconfig.json` 的 `types` 包含 `rsbuild-plugin-glsl/ext`，或添加 triple-slash 引用。若使用自定义后缀，需要自行声明该模块。

## `Unable to load shader chunk`

错误会同时包含请求路径和导入者。依次检查：

1. 未写后缀时，实际文件是否符合 `defaultExtension`。
2. `/` 开头的路径是否基于 `root`，而不是磁盘根目录。
3. Linux CI 区分文件名大小写，本地 macOS 可能没有暴露问题。
4. 路径不能使用 Three.js 的 `<chunk>` 语法引用本地文件；尖括号导入会被故意保留。

## `Recursive shader import detected`

按照错误中的路径链找到第一次重复出现的文件。把共享声明抽到第三个叶子模块，或删除反向导入。`removeDuplicatedImports` 不能掩盖真正的循环依赖。

## 修改 chunk 后没有刷新

确保没有设置 `watch: false`。如果文件来自生成器，生成器应原子写入最终路径；写入临时路径后重命名通常比逐字节覆盖更稳定。

## Shader 编译报错行号偏移

GL 驱动看到的是展开后的完整字符串。开发阶段关闭 `minify`，并在模块边界使用注释或 `#line`（如果目标语言/驱动支持）辅助定位。可以用 `onComplete` 自动插入诊断标记。

## 包格式错误

项目在发布前运行 `publint` 和 Are The Types Wrong，检查 ESM、CJS 和类型条件。如果消费端仍有解析问题，请附上 Node 版本、Rsbuild 版本、包管理器和最小复现。
