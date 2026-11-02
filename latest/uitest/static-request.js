// 정적 문서에서는 실제 서버 대신 iframe별 메모리 데이터로 원본 목 API를 재현합니다.
// 원본 HTTP 예제는 ui-grid의 개발 서버에서 실행할 수 있습니다.
const initialRows = fetch(new URL('./data/users.json', import.meta.url)).then(response => {
  if (!response.ok) throw new Error('Could not load example users');
  return response.json();
});
let rows;
export async function staticRequest(request) {
  if (request.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  rows ??= structuredClone(await initialRows);
  await new Promise(resolve => setTimeout(resolve, 100));
  if (request.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const endpoint = new URL(request.url, location.href).pathname;
  const data = request.data ?? {};
  if (endpoint.endsWith('/save')) {
    let nextId = rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
    const idMap = {};
    for (const row of data.created ?? []) {
      const id = nextId++;
      idMap[row.id] = id;
      rows.push({ ...row, id });
    }
    for (const row of data.updated ?? []) {
      const target = rows.find(item => item.id === row.id);
      if (target) Object.assign(target, row);
    }
    const ids = new Set((data.deleted ?? []).map(row => row.id));
    rows = rows.filter(row => !ids.has(row.id));
    return { idMap };
  }
  if (endpoint.endsWith('/remove')) {
    const ids = new Set((data.deleted ?? []).map(row => row.id));
    rows = rows.filter(row => !ids.has(row.id));
    return { removed: ids.size };
  }
  const filtered = rows.filter(row => (!data.name || row.name.includes(data.name)) && (!data.status || row.status === data.status));
  const sorts = String(data.sort ?? '').split(',').map(token => token.split(':')).filter(([field]) => field in (rows[0] ?? {}));
  filtered.sort((a, b) => {
    for (const [field, order] of sorts) {
      const result = typeof a[field] === 'number' && typeof b[field] === 'number' ? a[field] - b[field] : String(a[field]).localeCompare(String(b[field]));
      if (result) return order === 'desc' ? -result : result;
    }
    return 0;
  });
  const size = Math.max(1, Number(data.pageSize) || rows.length || 1);
  const start = (Math.max(1, Number(data.page) || 1) - 1) * size;
  return { items: structuredClone(filtered.slice(start, start + size)), total: filtered.length };
}
