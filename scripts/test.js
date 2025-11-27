import { spawn } from 'node:child_process';

const runInBandFlag = '--runInBand';
const args = process.argv
  .slice(2)
  .filter((arg) => arg !== runInBandFlag);

const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(runner, ['vitest', ...args], { stdio: 'inherit' });

child.on('close', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});
