import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import esConfig from '../vite.config.mjs';
import umdConfig from '../vite.config.umd.mjs';
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

async function emitBundles(directory) {
  // production과 development는 서로 다른 경로에 쓰고, 같은 경로를 쓰는 형식은 순서대로 생성합니다.
  const emitMode = async (mode) => {
    for (const createConfig of [esConfig, umdConfig]) {
      const config = createConfig({ command: 'build', mode });
      await build({
        ...config, root, configFile: false, mode,
        build: {
          ...config.build,
          outDir: mode === 'production' ? directory : resolve(directory, 'unmin'),
          emptyOutDir: false, copyPublicDir: false,
        },
      });
    }
  };
  // 한쪽이 실패해도 다른 모드의 출력이 끝난 뒤 오류를 전달합니다.
  const results = await Promise.allSettled(['production', 'development'].map(emitMode));
  const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
  if (errors.length) throw new AggregateError(errors, errors.map((error) => error.message).join('\n'));
}

export async function buildProject(directory = resolve(root, 'dist')) {
  const startedAt = performance.now();
  // 경로 정리·복사는 프로젝트 내부의 정해진 출력만 사용합니다.
  buildFiles('clean-dist', root, directory);
  const results = await Promise.allSettled([emitDeclarations(directory), emitBundles(directory)]);
  const errors = results.filter((result) => result.status === 'rejected').map((result) => result.reason);
  if (errors.length) throw new AggregateError(errors, errors.map((error) => error.message).join('\n'));
  buildFiles('unmin', root, directory);
  buildFiles('clean-unmin', root, directory);
  buildFiles('html', root, directory);
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
