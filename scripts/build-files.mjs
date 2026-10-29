import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// 복사·정리 대상의 링크를 따라 저장소 밖에 쓰지 않습니다.
function outputPath(base, ...parts) {
  let target = base;
  for (const part of parts) {
    target = join(target, part);
    try {
      if (lstatSync(target).isSymbolicLink()) throw new Error(`출력 경로에 링크를 사용할 수 없습니다: ${target}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return target;
}

function copyTree(source, destination, predicate = () => true) {
  if (!existsSync(source)) return;
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const input = join(source, entry.name);
    const output = outputPath(destination, entry.name);
    if (entry.isDirectory()) copyTree(input, output, predicate);
    else if (predicate(entry.name)) {
      mkdirSync(dirname(output), { recursive: true });
      copyFileSync(input, output);
    }
  }
}

export function buildFiles(command, projectRoot = root, directory) {
  const base = resolve(projectRoot);
  const parts = relative(base, resolve(directory ?? join(base, 'dist'))).split(/[\\/]/);
  if (isAbsolute(parts.join('/')) || !(parts.length === 1 && parts[0] === 'dist') &&
      !(parts.length === 2 && parts[0] === '.tmp' && /^build-[\w-]+$/.test(parts[1]))) {
    throw new Error('출력은 dist 또는 .tmp/build-* 디렉터리만 사용할 수 있습니다.');
  }
  const dist = outputPath(base, ...parts);
  if (command === 'clean-dist') rmSync(dist, { recursive: true, force: true });
  else if (command === 'dts') copyTree(join(projectRoot, 'src'), dist, (name) => name.endsWith('.d.ts'));
  else if (command === 'unmin') copyTree(outputPath(dist, 'unmin'), dist);
  else if (command === 'clean-unmin') rmSync(outputPath(dist, 'unmin'), { recursive: true, force: true });
  // public/index.html이 없어도 폰트와 라이선스는 빠짐없이 복사합니다.
  else if (command === 'html') copyTree(join(projectRoot, 'public'), dist);
  else throw new Error(`지원하지 않는 복사 작업: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3) throw new Error('복사 작업 하나만 지정하세요.');
  buildFiles(process.argv[2]);
}
