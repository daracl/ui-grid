import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

export function verifyBuild(directory) {
  for (const name of ['index.js', 'index.cjs', 'index.min.js', 'index.min.cjs', 'index.d.ts',
    'daracl.grid.css', 'daracl.grid.min.css', 'assets/NotoSansKR-Regular.ttf', 'assets/OFL.txt']) {
    assert.ok(existsSync(join(directory, name)), `필수 배포 파일 누락: ${name}`);
  }
  for (const kind of ['pdf', 'excel', 'csv', 'json']) {
    for (const suffix of ['', '.min']) assert.ok(existsSync(join(directory, `daracl.grid.${kind}${suffix}.mjs`)));
  }
  for (const filename of ['daracl.grid.umd.js', 'daracl.grid.min.umd.js']) {
    const dom = new JSDOM('<div id="grid"></div>', { runScripts: 'outside-only', url: 'http://localhost/' });
    let grid;
    try {
      dom.window.PointerEvent = dom.window.MouseEvent;
      dom.window.HTMLCanvasElement.prototype.getContext = () => ({ font: '', measureText: (text) => ({ width: text.length * 8 }) });
      const code = readFileSync(join(directory, filename), 'utf8');
      assert.match(code, /Licensed MIT/);
      dom.window.eval(code);
      grid = dom.window.Daracl.grid.create(dom.window.document.getElementById('grid'), {
        width: 640, height: 320,
        fields: [{ name: 'name', width: 180 }], items: [{ name: '빌드 확인' }],
      });
      assert.equal(grid.getItems()[0].name, '빌드 확인');
      assert.ok(dom.window.document.getElementById('grid').textContent.includes('빌드 확인'));
    } finally { grid?.destroy(); dom.window.close(); }
  }
  // 선언 파일에는 소비자가 해석할 수 없는 저장소 별칭을 남기지 않습니다.
  const inspect = (folder) => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) inspect(file);
      else if (entry.name.endsWith('.d.ts')) assert.ok(!/from ['"]@(?:\/|t\/)/.test(readFileSync(file, 'utf8')), `해석되지 않은 별칭: ${file}`);
    }
  };
  inspect(directory);
  console.log('배포 파일·압축/비압축 UMD 렌더링·선언 별칭 검증 통과');
}
