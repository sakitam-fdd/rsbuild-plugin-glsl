import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Rspack's persistent-cache writer can race with its temporary directory swap
// during rapid MDX/HMR updates on macOS. Development already keeps the module
// graph in memory, so disable only the on-disk cache for the long-running dev
// server. Production builds keep Rspress' default persistent cache enabled.
const rspressCli = fileURLToPath(
  new URL('../node_modules/@rspress/core/bin/rspress.js', import.meta.url),
);
const child = spawn(process.execPath, [rspressCli, 'dev', ...process.argv.slice(2)], {
  env: {
    ...process.env,
    RSPRESS_PERSISTENT_CACHE: 'false',
  },
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(`Failed to start Rspress: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
