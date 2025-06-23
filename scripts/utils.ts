import { write, file, $ } from 'bun';
import { resolve, join } from 'node:path/posix';

export const SCRIPTS = import.meta.dir;
export const ROOT = resolve(SCRIPTS, '..');
export const SOURCE = ROOT + '/src';
export const LIB = ROOT + '/lib';
export const BENCH = ROOT + '/bench';

export const cp = (from: string, to: string, path: string) =>
  write(join(to, path), file(join(from, path)));
export const exec = (...args: Parameters<typeof $>) =>
  $(...args).catch((err) => process.stderr.write(err.stderr as any));
export const cd = (dir: string) => $.cwd(dir);
