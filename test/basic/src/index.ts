import vs from './picker.vert.glsl';
import fs from './picker.frag.glsl';

const exportString = { vs, fs };

// @ts-ignore ignore type
window.exportString = exportString;

export { vs, fs };
