// 실행: node scripts/audit-browser.cjs .tmp/build-<검증 빌드 번호>
// 설치된 Edge로 실제 배포 번들을 검사한다. 결과는 .tmp/audit-browser에 저장한다.
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

async function run() {
  const root = path.resolve(__dirname, '..');
  const build = path.resolve(root, process.argv[2] || 'dist');
  const output = path.join(root, '.tmp', 'audit-browser');
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (name === '/') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<!doctype html><html><head><link rel="stylesheet" href="/daracl.grid.css"></head><body></body></html>');
      return;
    }
    const target = path.resolve(build, `.${name}`);
    if (!target.startsWith(build + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' })[path.extname(target)] || 'application/octet-stream');
    fs.createReadStream(target).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.addScriptTag({ url: '/daracl.grid.min.umd.js' });
    if (process.argv.includes('--editing-only')) {
      await page.evaluate(() => {
        const host = document.createElement('div');
        document.body.append(host);
        window.auditGrid = window.Daracl.grid.create(host, {
          width: 900, height: 360, rowIdField: 'id', editable: true,
          fields: [
            { name: 'name', width: 250, editRenderer: { type: 'text' } },
            { name: 'memo', width: 250, editRenderer: { type: 'textarea', required: true, rule: { minLength: 2 } } },
          ],
          items: [{ id: 1, name: '기존 이름', memo: '기존 메모' }],
        });
      });
      const open = async (name) => {
        const column = await page.evaluate((name) => window.auditGrid.gridMain.config().currentFields.findIndex((field) => field.name === name), name);
        await page.locator(`[data-cell-position="0,${column}"]`).click();
        await page.keyboard.press('Space');
      };
      const value = (name) => page.evaluate((name) => window.auditGrid.getItemById(1)[name], name);
      await open('name');
      await page.locator('.dg-edit-input').fill('한');
      await page.locator('.dg-edit-input').dispatchEvent('keydown', { key: 'Enter', isComposing: true });
      assert.equal(await value('name'), '기존 이름');
      await page.locator('.dg-edit-input').fill('한글');
      await page.locator('.dg-edit-input').press('Enter');
      assert.equal(await value('name'), '한글');
      await open('memo');
      await page.locator('.dg-edit-textarea').fill('');
      await page.locator('.dg-edit-textarea').dispatchEvent('blur');
      assert.equal(await value('memo'), '기존 메모');
      await page.locator('.dg-edit-textarea').fill('정상\n메모');
      await page.locator('.dg-edit-textarea').dispatchEvent('blur');
      assert.equal(await value('memo'), '정상\n메모');
      await open('name');
      await page.locator('.dg-edit-input').fill('이전 편집');
      await page.evaluate(() => window.auditGrid.setItems([{ id: 1, name: '교체 이름', memo: '교체 메모' }]));
      await page.locator('.dg-edit-input').dispatchEvent('keydown', { key: 'Enter' });
      assert.equal(await value('name'), '교체 이름');
      assert.equal(await page.evaluate(() => window.auditGrid.gridMain.config().dataManager.canUndo()), false);
      assert.deepEqual(errors, []);
      const report = { browser: await browser.version(), editing: 'passed', errors, ime: 'synthetic composition keydown' };
      fs.writeFileSync(path.join(output, 'editing-results.json'), JSON.stringify(report, null, 2));
      console.log(JSON.stringify(report));
      await page.evaluate(() => window.auditGrid.destroy());
      return;
    }
    const results = await page.evaluate(async () => {
      const rows = [];
      const timing = (fn) => { const start = performance.now(); fn(); return +(performance.now() - start).toFixed(2); };
      for (const count of [100, 1000, 10000, 50000, 100000]) {
        const host = document.createElement('div');
        document.body.append(host);
        const items = Array.from({ length: count }, (_, id) => ({ id, name: `한글 ${id}`, amount: count - id }));
        let grid;
        const createMs = timing(() => grid = window.Daracl.grid.create(host, {
          width: 900, height: 360, rowIdField: 'id', deleteMode: 'hard',
          fields: [{ name: 'name', width: 250 }, { name: 'amount', width: 160 }], items,
        }));
        const main = grid.gridMain;
        const manager = main.config().dataManager;
        const field = main.config().currentFields.find((field) => field.name === 'amount');
        const searchMs = timing(() => grid.search('한글 9', { searchFields: ['name'], hideNonMatched: true }));
        const matches = grid.getItems().length;
        grid.search('', {});
        const sortMs = timing(() => manager.dataSort([{ name: 'amount', field, ascOrder: true }], grid.getOptions().header.sort));
        const firstAmount = grid.getItems()[0].amount;
        const addMs = timing(() => grid.addItems([{ id: 'added', name: '추가', amount: 0 }]));
        const removeMs = timing(() => grid.removeItems(['added']));
        const editMs = timing(() => manager.setChangeValue(grid.getItemById(0), field, 42));
        main.getScroll().moveVerticalScroll({ rowIdx: 0 });
        await new Promise(requestAnimationFrame);
        const scrollStart = performance.now();
        const scrollMs = timing(() => main.getScroll().moveVerticalScroll({ rowIdx: count - 10 }));
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const scrollFrameMs = +(performance.now() - scrollStart).toFixed(2);
        const domCells = host.querySelectorAll('.dg-cell').length;
        const heapBytes = performance.memory?.usedJSHeapSize;
        const destroyMs = timing(() => grid.destroy());
        const remainingChildren = host.children.length;
        host.remove();
        rows.push({ count, createMs, searchMs, matches, sortMs, firstAmount, addMs, removeMs, editMs, scrollMs, scrollFrameMs, domCells, destroyMs, remainingChildren, heapBytes });
      }
      const host = document.createElement('div');
      document.body.append(host);
      window.auditGrid = window.Daracl.grid.create(host, {
        width: 900, height: 360, rowIdField: 'id',
        fields: [{ name: 'name', label: '이름', width: 250 }, { name: 'amount', label: '수량', width: 160 }],
        items: Array.from({ length: 100 }, (_, id) => ({ id, name: id === 0 ? '한글,"따옴표"\n줄바꿈' : `한글 ${id}`, amount: id })),
      });
      return rows;
    });
    for (const row of results) {
      assert.equal(row.firstAmount, 1);
      assert.equal(row.remainingChildren, 0);
      assert.ok(row.domCells < 500, '가상 렌더링 DOM 상한');
    }
    const exports = [];
    for (const [method, extension] of [['exportCsv', 'csv'], ['exportJson', 'json'], ['exportExcel', 'xlsx'], ['exportPdf', 'pdf']]) {
      const start = performance.now();
      const downloadEvent = page.waitForEvent('download', { timeout: 60000 });
      await page.evaluate(async ({ method, extension }) => window.auditGrid[method]({ fileName: `audit.${extension}` }), { method, extension });
      const download = await downloadEvent;
      const target = path.join(output, `audit.${extension}`);
      await download.saveAs(target);
      exports.push({ method, ms: +(performance.now() - start).toFixed(2), bytes: fs.statSync(target).size });
    }
    await page.screenshot({ path: path.join(output, 'light.png') });
    await page.evaluate(() => document.documentElement.setAttribute('data-daracl-theme', 'dark'));
    await page.screenshot({ path: path.join(output, 'dark.png') });
    await page.evaluate(() => window.auditGrid.destroy());
    const report = { browser: await browser.version(), node: process.version, platform: process.platform, results, exports, errors };
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
