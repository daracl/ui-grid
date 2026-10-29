// 번들 하나(형식 × 모드)를 별도 프로세스에서 빌드한다. 사용법: node scripts/build-bundle.mjs <es|umd> <production|development> <outDir>
// scripts/build.mjs가 4개 조합을 동시에 실행해 CPU 코어를 모두 사용한다.
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import esConfig from '../vite.config.mjs';
import umdConfig from '../vite.config.umd.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [format, mode, outDir] = process.argv.slice(2);

const configs = { es: esConfig, umd: umdConfig };
if (!configs[format] || !['production', 'development'].includes(mode) || !outDir) {
  throw new Error('사용법: build-bundle.mjs <es|umd> <production|development> <outDir>');
}

const config = configs[format]({ command: 'build', mode });
await build({
  ...config,
  root,
  configFile: false,
  mode,
  build: { ...config.build, outDir: resolve(outDir), emptyOutDir: false, copyPublicDir: false },
});
