// 실행: node scripts/audit-boundaries.cjs .tmp/build-<검증 빌드 번호>
// 정책 결정이 필요한 입력의 실제 결과와 ESM/CJS 소비 동작을 기록한다.
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');

async function run() {
  const build = path.resolve(process.argv[2] || 'dist');
  const dom = new JSDOM('<div id="grid"></div>', { runScripts: 'outside-only', url: 'http://localhost/' });
  const win = dom.window;
  win.PointerEvent = win.MouseEvent;
  win.HTMLCanvasElement.prototype.getContext = () => ({ font: '', measureText: (text) => ({ width: text.length * 8 }) });
  win.eval(fs.readFileSync(path.join(build, 'daracl.grid.umd.js'), 'utf8'));
  const observations = {};
  const create = (extra = {}) => win.Daracl.grid.create(win.document.getElementById('grid'), {
    width: 600, height: 300, rowIdField: 'id', fields: [{ name: 'name' }], items: [], ...extra,
  });
  let grid;
  try {
    grid = create();
    grid.setItems([{ id: 1, name: 'first' }, { id: 1, name: 'last' }]);
    observations.duplicate = Array.from(grid.getItems(), (row) => row.name);
    assert.deepEqual(observations.duplicate, ['first']);
    grid.setItems([{ id: 0, name: 'number' }, { id: '0', name: 'string' }]);
    observations.mixedIds = grid.getItems().map((row) => row.name);
    grid.destroy();
    grid = create({ tree: { idField: 'id', parentIdField: 'pid', isFlatData: true } });
    grid.setItems([{ id: 'a', pid: 'b', name: 'a' }, { id: 'b', pid: 'a', name: 'b' }, { id: 'valid', pid: 'a', name: 'valid' }]);
    observations.flatCycle = grid.getAllItems();
    assert.deepEqual(Array.from(grid.getAllItems(), (row) => row.id), ['valid']);
    grid.destroy();
    grid = create();
    grid.setItems([{ id: 'good', name: 'good' }]);
    try { grid.setItems([{ id: 'new', name: 'new' }, null]); }
    catch (error) { observations.invalidRowError = error.message; }
    observations.previousRowAfterInvalidSet = grid.getItemById('good') ?? null;
    observations.validRowsAfterPartialSet = Array.from(grid.getAllItems(), (row) => row.id);
    assert.deepEqual(observations.validRowsAfterPartialSet, ['new']);
    grid.destroy();
    for (const name of ['window', 'document', 'Document', 'HTMLElement', 'Element', 'Node', 'HTMLInputElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'MouseEvent', 'PointerEvent', 'getComputedStyle', 'navigator']) {
      Object.defineProperty(globalThis, name, { configurable: true, value: typeof win[name] === 'function' && name === 'getComputedStyle' ? win[name].bind(win) : win[name] });
    }
    globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
    globalThis.cancelAnimationFrame = clearTimeout;
    observations.formats = {};
    for (const name of ['index.cjs', 'index.js', 'index.min.cjs', 'index.min.js']) {
      try {
        const module = name.endsWith('.cjs') ? require(path.join(build, name)) : await import(pathToFileURL(path.join(build, name)));
        const instance = module.DaraGrid.create(win.document.getElementById('grid'), {
          width: 600, height: 300, fields: [{ name: 'name' }], items: [{ name: '소비자 확인' }],
        });
        assert.equal(instance.getItems()[0].name, '소비자 확인');
        instance.destroy();
        observations.formats[name] = 'passed';
      } catch (error) { observations.formats[name] = error.message; }
    }
    console.log(JSON.stringify(observations, null, 2));
    assert.ok(Object.values(observations.formats).every((result) => result === 'passed'), '배포 형식 로드 실패');
  } finally { grid?.destroy(); win.close(); }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
