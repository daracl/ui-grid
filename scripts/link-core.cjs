const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const packageName = '@daracl/core';
const sourceCondition = 'daracl-source';
const modulePath = path.join(root, 'node_modules', ...packageName.split('/'));

function inspect(directory) {
  try {
    const real = fs.realpathSync(directory);
    const pkg = JSON.parse(fs.readFileSync(path.join(real, 'package.json'), 'utf8'));
    const source = pkg.exports?.['./utils']?.[sourceCondition];
    if (pkg.name !== packageName || typeof source !== 'string') return null;
    const entry = path.resolve(real, source);
    const relative = path.relative(real, entry);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !fs.existsSync(entry)) return null;
    return { directory: real, entry };
  } catch { return null; }
}

function installedCoreSource() { return inspect(modulePath); }

function findCoreSource() {
  if (process.env.DARACL_CORE_ROOT) {
    const configured = inspect(path.resolve(root, process.env.DARACL_CORE_ROOT));
    if (!configured) throw new Error('DARACL_CORE_ROOT에 @daracl/core 소스가 없습니다.');
    return configured;
  }
  const installed = installedCoreSource();
  if (installed) return installed;
  // 폴더 이름 대신 package.json의 name으로 형제 체크아웃을 찾습니다.
  const parent = path.dirname(root);
  const candidates = fs.readdirSync(parent, { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.') && (entry.isDirectory() || entry.isSymbolicLink()))
    .map(entry => inspect(path.join(parent, entry.name))).filter(Boolean);
  const unique = [...new Map(candidates.map(candidate => [candidate.directory, candidate])).values()];
  if (unique.length > 1) throw new Error('@daracl/core 소스가 여러 개입니다. DARACL_CORE_ROOT로 선택하세요.');
  return unique[0] || null;
}

function linkCore() {
  const source = findCoreSource();
  if (!source) {
    console.log('[core] 체크아웃을 찾지 못해 설치된 패키지를 사용합니다.');
    return null;
  }
  if (installedCoreSource()?.directory === source.directory) return source;
  const temporary = path.join(root, '.tmp');
  // 이동할 경로는 이 저장소의 node_modules와 .tmp 안으로 한정합니다.
  for (const target of [modulePath, temporary]) {
    const relative = path.relative(root, target);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('잘못된 연결 경로');
  }
  if (fs.existsSync(temporary) && fs.lstatSync(temporary).isSymbolicLink()) throw new Error('.tmp 링크는 사용할 수 없습니다.');
  fs.mkdirSync(temporary, { recursive: true });
  fs.mkdirSync(path.dirname(modulePath), { recursive: true });
  // 기존 설치는 삭제하지 않고 보관하여 연결 실패 시 복원합니다.
  let backup;
  try {
    fs.lstatSync(modulePath);
    backup = path.join(fs.mkdtempSync(path.join(temporary, 'core-package-')), 'package');
    fs.renameSync(modulePath, backup);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  try { fs.symlinkSync(source.directory, modulePath, process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) {
    if (backup) fs.renameSync(backup, modulePath);
    throw error;
  }
  console.log('[core] @daracl/core 소스를 패키지 이름으로 연결했습니다.');
  return source;
}

module.exports = { findCoreSource, installedCoreSource, linkCore, sourceCondition };
if (require.main === module) {
  if (process.argv.length !== 2) throw new Error('추가 인자를 지원하지 않습니다.');
  linkCore();
}
