const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const temporary = path.resolve(__dirname, '../.tmp');
fs.mkdirSync(temporary, { recursive: true });
function fixture(t) {
  const directory = fs.mkdtempSync(path.join(temporary, 'core-link-test-'));
  const root = path.join(directory, 'consumer');
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  const script = path.join(root, 'scripts/link-core.cjs');
  fs.copyFileSync(path.join(__dirname, 'link-core.cjs'), script);
  const original = process.env.DARACL_CORE_ROOT;
  delete process.env.DARACL_CORE_ROOT;
  t.after(() => {
    if (original === undefined) delete process.env.DARACL_CORE_ROOT;
    else process.env.DARACL_CORE_ROOT = original;
    fs.rmSync(directory, { recursive: true, force: true });
  });
  function source(name) {
    const target = path.join(directory, name);
    fs.mkdirSync(path.join(target, 'source'), { recursive: true });
    fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({
      name: '@daracl/core', exports: { './utils': { 'daracl-source': './source/entry.ts' } },
    }));
    fs.writeFileSync(path.join(target, 'source/entry.ts'), 'export const value = 1;');
    return fs.realpathSync(target);
  }
  function installed() {
    const target = path.join(root, 'node_modules/@daracl/core');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'package.json'), '{"name":"@daracl/core","version":"old"}');
    return target;
  }
  return { root, source, installed, helper: require(script) };
}

test('폴더명에 의존하지 않고 패키지 이름으로 연결하며 기존 설치를 보관한다', t => {
  const { root, source, installed, helper } = fixture(t);
  const target = source('arbitrary-folder');
  const modulePath = installed();
  assert.equal(helper.findCoreSource().directory, target);
  helper.linkCore();
  assert.equal(fs.realpathSync(modulePath), target);
  const backups = fs.readdirSync(path.join(root, '.tmp'));
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, '.tmp', backups[0], 'package/package.json'))).version, 'old');
  helper.linkCore();
  assert.deepEqual(fs.readdirSync(path.join(root, '.tmp')), backups);
});

test('중복 체크아웃은 명시적인 환경 변수로 선택한다', t => {
  const { source, helper } = fixture(t);
  source('first-copy');
  const selected = source('second-copy');
  assert.throws(() => helper.findCoreSource(), /여러 개/);
  process.env.DARACL_CORE_ROOT = selected;
  assert.equal(helper.findCoreSource().directory, selected);
});

test('연결 실패 시 기존 패키지를 복원한다', t => {
  const { source, installed, helper } = fixture(t);
  source('core-source');
  const modulePath = installed();
  const symlink = fs.symlinkSync;
  try {
    fs.symlinkSync = () => { throw new Error('fixture link failure'); };
    assert.throws(() => helper.linkCore(), /fixture link failure/);
  } finally { fs.symlinkSync = symlink; }
  assert.equal(JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'))).version, 'old');
});

test('체크아웃 없이 설치된 배포 패키지는 변경하지 않는다', t => {
  const { root, installed, helper } = fixture(t);
  const modulePath = installed();
  const metadata = JSON.stringify({
    name: '@daracl/core', version: '0.0.9',
    exports: { './utils': { 'daracl-source': './src/utils/index.ts', require: './dist/utils.cjs' } },
  });
  fs.writeFileSync(path.join(modulePath, 'package.json'), metadata);
  assert.equal(helper.installedCoreSource(), null);
  assert.equal(helper.findCoreSource(), null);
  assert.equal(helper.linkCore(), null);
  assert.equal(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'), metadata);
  assert.equal(fs.lstatSync(modulePath).isSymbolicLink(), false);
  assert.equal(fs.existsSync(path.join(root, '.tmp')), false);
});
