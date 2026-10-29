import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildFiles } from './build-files.mjs';

test('선언·지연 로딩 파일·폰트와 라이선스를 복사하고 production 파일을 보존한다', () => {
  const root = mkdtempSync(join(tmpdir(), 'grid-build-'));
  try {
    for (const dir of ['src/types', 'public/assets', 'dist/unmin']) mkdirSync(join(root, dir), { recursive: true });
    writeFileSync(join(root, 'src/types/Field.d.ts'), 'export interface Field {}');
    writeFileSync(join(root, 'src/skip.ts'), 'skip');
    writeFileSync(join(root, 'public/assets/OFL.txt'), 'license');
    writeFileSync(join(root, 'public/assets/font.ttf'), 'font');
    writeFileSync(join(root, 'dist/unmin/sidecar.mjs'), 'sidecar');
    writeFileSync(join(root, 'dist/index.min.js'), 'production');
    for (const command of ['dts', 'unmin', 'clean-unmin', 'html']) buildFiles(command, root);
    assert.equal(readFileSync(join(root, 'dist/index.min.js'), 'utf8'), 'production');
    assert.equal(readFileSync(join(root, 'dist/sidecar.mjs'), 'utf8'), 'sidecar');
    assert.equal(readFileSync(join(root, 'dist/assets/OFL.txt'), 'utf8'), 'license');
    assert.ok(existsSync(join(root, 'dist/assets/font.ttf')));
    assert.ok(existsSync(join(root, 'dist/types/Field.d.ts')));
    assert.equal(existsSync(join(root, 'dist/skip.ts')), false);
    assert.equal(existsSync(join(root, 'dist/unmin')), false);
    assert.throws(() => buildFiles('clean-dist', root, join(root, 'src')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('출력 디렉터리 링크를 통한 외부 삭제를 거부한다', () => {
  const root = mkdtempSync(join(tmpdir(), 'grid-build-'));
  const outside = mkdtempSync(join(tmpdir(), 'grid-outside-'));
  try {
    writeFileSync(join(outside, 'keep.txt'), 'keep');
    symlinkSync(outside, join(root, 'dist'), process.platform === 'win32' ? 'junction' : 'dir');
    assert.throws(() => buildFiles('clean-dist', root), /링크/);
    assert.equal(readFileSync(join(outside, 'keep.txt'), 'utf8'), 'keep');
    rmSync(join(root, 'dist'));
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(outside, { recursive: true, force: true });
  }
});
