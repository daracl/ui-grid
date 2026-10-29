import { spawn } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { buildFiles } from './build-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

function run(entry, args) {
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, [require.resolve(entry), ...args], {
      cwd: root, stdio: 'inherit', shell: false,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? done() : reject(new Error(`${entry}: ${code ?? signal}`)));
  });
}

async function emitDeclarations(directory) {
  await run('typescript/bin/tsc', ['-p', 'tsconfig-build.json', '--emitDeclarationOnly', '--outDir', directory]);
  buildFiles('dts', root, directory);
  await run('tsc-alias/dist/bin/index.js', ['-p', 'tsconfig-build.json', '--outDir', directory]);
}

// 형식(ES/CJS, UMD) × 모드(production, development) 4개 번들을 각각 별도 프로세스에서 동시에 빌드한다.
// 같은 파일명(CSS 등)을 쓰는 형식끼리 경쟁하지 않도록 임시 폴더에 만든 뒤 UMD가 마지막에 덮어쓰는 기존 순서로 합친다.
// 소스맵의 상대 경로가 달라지지 않도록 임시 폴더는 최종 출력과 같은 깊이에 둔다(production: 형제 폴더, development: 그 아래 unmin).
async function emitBundles(directory) {
  const jobs = [];
  for (const mode of ['production', 'development']) {
    for (const format of ['es', 'umd']) {
      const stageRoot = `${directory}.stage-${format}-${mode}`;
      jobs.push({ mode, format, stageRoot, outDir: mode === 'production' ? stageRoot : resolve(stageRoot, 'unmin') });
    }
  }
  const cleanup = () => jobs.forEach((job) => rmSync(job.stageRoot, { recursive: true, force: true }));

  // 한쪽이 실패해도 나머지 작업이 끝난 뒤 오류를 전달한다.
  const results = await Promise.allSettled(jobs.map((job) => runBundle(job)));
  const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
  if (errors.length) {
    cleanup();
    throw new AggregateError(errors, errors.map((error) => error.message).join('\n'));
  }

  for (const job of jobs) {
    const target = job.mode === 'production' ? directory : resolve(directory, 'unmin');
    if (existsSync(job.outDir)) cpSync(job.outDir, target, { recursive: true, force: true });
  }
  cleanup();
}

function runBundle({ mode, format, outDir }) {
  return new Promise((done, reject) => {
    const output = [];
    const child = spawn(process.execPath, [resolve(root, 'scripts/build-bundle.mjs'), format, mode, outDir], {
      cwd: root, stdio: ['ignore', 'pipe', 'pipe'], shell: false,
    });
    child.stdout.on('data', (chunk) => output.push(chunk));
    child.stderr.on('data', (chunk) => output.push(chunk));
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) return done();
      // 실패한 작업의 로그만 출력한다.
      process.stderr.write(Buffer.concat(output));
      reject(new Error(`${format}/${mode} 번들 빌드 실패 (종료 코드 ${code ?? signal})`));
    });
  });
}

/** 작업 소요 시간을 출력한다. */
async function timed(name, task) {
  const startedAt = performance.now();
  try {
    return await task();
  } finally {
    console.log(`  - ${name}: ${((performance.now() - startedAt) / 1000).toFixed(2)}초`);
  }
}

export async function buildProject(directory = resolve(root, 'dist')) {
  const startedAt = performance.now();
  // 경로 정리·복사는 프로젝트 내부의 정해진 출력만 사용합니다.
  buildFiles('clean-dist', root, directory);
  const results = await Promise.allSettled([
    timed('선언 파일', () => emitDeclarations(directory)),
    timed('번들', () => emitBundles(directory)),
  ]);
  const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
  if (errors.length) throw new AggregateError(errors, errors.map((error) => error.message).join('\n'));
  const copyStartedAt = performance.now();
  buildFiles('unmin', root, directory);
  buildFiles('clean-unmin', root, directory);
  buildFiles('html', root, directory);
  console.log(`  - 산출물 정리·복사: ${((performance.now() - copyStartedAt) / 1000).toFixed(2)}초`);
  console.log(`전체 빌드 완료: ${((performance.now() - startedAt) / 1000).toFixed(2)}초`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // 검증 빌드는 배포 산출물을 건드리지 않습니다.
  const args = process.argv.slice(2);
  if (args.length && !(args.length === 1 && args[0] === '--verify')) throw new Error('지원하지 않는 인자입니다.');
  const directory = args.length ? resolve(root, '.tmp', `build-${Date.now()}`) : resolve(root, 'dist');
  buildProject(directory).then(async () => {
    if (args.length) (await import('./verify-build.mjs')).verifyBuild(directory);
  }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
