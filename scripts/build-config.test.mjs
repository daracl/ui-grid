import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createAssetFileNames, createCommonConfig } from '../vite.common.mjs';
import esConfig from '../vite.config.mjs';
import umdConfig from '../vite.config.umd.mjs';

test('CSS 자산 이름은 names API와 기존 Rollup 양쪽을 지원한다', () => {
  assert.equal(createAssetFileNames(true)({ names: ['style.css'], get name() { throw new Error('deprecated'); } }), 'daracl.grid.min.[ext]');
  assert.equal(createAssetFileNames(false)({ name: 'style.css' }), 'daracl.grid.[ext]');
  assert.equal(createAssetFileNames(true)({ names: [] }), 'assets/[name].[ext]');
});

test('개발 서버는 현재 저장소와 연결된 core만 허용한다', () => {
  const config = createCommonConfig(false);
  const require = createRequire(import.meta.url);
  const localCore = require('./link-core.cjs').installedCoreSource();
  assert.equal(config.server.host, '127.0.0.1');
  assert.equal(config.server.fs.strict, true);
  assert.equal(config.server.fs.allow.length, localCore ? 2 : 1);
  if (localCore) assert.ok(config.server.fs.allow.includes(localCore.directory));
  assert.equal(config.preview.host, '127.0.0.1');
});

test('기존 패키지 하위 경로와 출력 파일명·라이선스를 유지한다', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.exports['./dist/*'], './dist/*');
  assert.equal(pkg.exports['./style/*'], './style/*');
  for (const mode of ['production', 'development']) {
    const prod = mode === 'production';
    const es = esConfig({ mode });
    const umd = umdConfig({ mode });
    assert.equal(es.build.lib.fileName('es'), prod ? 'index.min.js' : 'index.js');
    assert.equal(umd.build.lib.fileName('umd'), `daracl.grid${prod ? '.min' : ''}.umd.js`);
    assert.equal(umd.build.minify, prod ? 'esbuild' : false);
    assert.match(es.build.rollupOptions.output.banner, /Licensed MIT/);
    assert.match(umd.define.GRID_PDF_FILE, /daracl\.grid\.pdf/);
  }
});
