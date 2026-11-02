import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataFile = resolve(dirname(fileURLToPath(import.meta.url)), 'data/users.json');

/**
 * uitest 전용 목(mock) API. `vite dev`에서만 동작하며 빌드에는 포함되지 않는다.
 * 데이터는 uitest/data/users.json을 메모리에 읽어 사용하므로 서버를 재시작하면 초기화된다.
 *
 * - GET  /uitest/api/users?name=&status=&sort=&page=&pageSize=  → { items, total } (sort: 'field:asc,field2:desc')
 * - POST /uitest/api/users/save    { created, updated, deleted } → { idMap }
 * - POST /uitest/api/users/remove  { deleted }
 * - GET  /uitest/api/users/reset   원본 데이터로 초기화
 */
export function uitestMockApi() {
  let rows = load();

  return {
    name: 'uitest-mock-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/uitest/api/users', async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://localhost');
          const path = url.pathname.replace(/\/$/, '');
          await delay(300); // 로딩 표시를 확인할 수 있도록 지연

          if (req.method === 'GET' && path === '') return list(url, res);
          if (req.method === 'GET' && path === '/reset') {
            rows = load();
            return send(res, 200, { ok: true });
          }
          if (req.method === 'POST' && path === '/save') return save(await body(req), res);
          if (req.method === 'POST' && path === '/remove') return remove(await body(req), res);

          send(res, 404, { message: 'not found' });
        } catch (error) {
          send(res, 500, { message: String(error?.message ?? error) });
        }
      });
    },
  };

  function list(url, res) {
    const name = url.searchParams.get('name') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize')) || rows.length || 1);

    const filtered = rows.filter((row) => (!name || row.name.includes(name)) && (!status || row.status === status));
    const sorts = (url.searchParams.get('sort') ?? '')
      .split(',')
      .map((token) => token.split(':'))
      .filter(([field]) => field && field in (rows[0] ?? {}));
    if (sorts.length > 0) {
      filtered.sort((a, b) => {
        for (const [field, order] of sorts) {
          const left = a[field];
          const right = b[field];
          const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right));
          if (result !== 0) return order === 'desc' ? -result : result;
        }
        return 0;
      });
    }
    const start = (page - 1) * pageSize;
    send(res, 200, { items: filtered.slice(start, start + pageSize), total: filtered.length });
  }

  function save({ created = [], updated = [], deleted = [] }, res) {
    let nextId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
    const idMap = {};

    for (const row of created) {
      const id = nextId++;
      idMap[row.id] = id;
      rows.push({ ...row, id });
    }
    for (const row of updated) {
      const target = rows.find((item) => item.id === row.id);
      if (target) Object.assign(target, row);
    }
    const removeIds = new Set(deleted.map((row) => row.id));
    rows = rows.filter((row) => !removeIds.has(row.id));

    send(res, 200, { idMap });
  }

  function remove({ deleted = [] }, res) {
    const removeIds = new Set(deleted.map((row) => row.id));
    rows = rows.filter((row) => !removeIds.has(row.id));
    send(res, 200, { removed: removeIds.size });
  }
}

function load() {
  return JSON.parse(readFileSync(dataFile, 'utf8'));
}

function delay(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

function body(req) {
  return new Promise((done, fail) => {
    let text = '';
    req.on('data', (chunk) => (text += chunk));
    req.on('end', () => {
      try {
        done(text ? JSON.parse(text) : {});
      } catch (error) {
        fail(error);
      }
    });
    req.on('error', fail);
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
