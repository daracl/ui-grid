// 서버 없이 확인할 수 있도록 메모리 데이터를 서버처럼 사용하는 사용자 정의 DataSource 예제.
// 실제 서버를 사용할 때는 load/save/remove에 { url, method } 를 지정하면 코어 Ajax로 요청한다.
const serverRows = Array.from({ length: 35 }, (_, i) => ({ id: i + 1, name: '사용자' + (i + 1), status: i % 3 ? 'ACTIVE' : 'STOP' }));
let nextId = 1000;
const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    });
  });

const log = (text) => (document.getElementById('log').textContent = text);

const grid = Daracl.grid.create(document.getElementById('sample'), {
  theme: typeof G_GRID_THEME !== 'undefined' ? G_GRID_THEME : undefined,
  editable: true,
  rowIdField: 'id',
  selectionMode: 'multiRow',
  aside: { lineNumber: { enabled: true }, rowCheckbox: { enabled: true, width: 27 }, modifyInfo: { enabled: true } },
  fields: [
    { name: 'id', label: 'ID', width: 80 },
    { name: 'name', label: '이름', width: 160, editRenderer: { type: 'text' } },
    { name: 'status', label: '상태', width: 100, editRenderer: { type: 'text' } },
  ],
  footer: { enabled: true, paging: { enabled: true } },
  dataSource: {
    paging: { mode: 'server', pageSize: 10 },
    load: async (params, signal) => {
      await delay(300, signal);
      const rows = serverRows.filter((row) => !params.name || row.name.includes(params.name));
      const start = (params.page - 1) * params.pageSize;
      return { items: rows.slice(start, start + params.pageSize).map((row) => ({ ...row })), total: rows.length };
    },
    save: async (changes, signal) => {
      await delay(300, signal);
      const idMap = {};
      changes.created.forEach((row) => {
        const id = nextId++;
        idMap[row.id] = id;
        serverRows.push({ ...row, id });
      });
      changes.updated.forEach((row) => Object.assign(serverRows.find((r) => r.id === row.id) || {}, row));
      changes.deleted.forEach((row) => serverRows.splice(serverRows.findIndex((r) => r.id === row.id), 1));
      return { idMap };
    },
    remove: async (request, signal) => {
      await delay(300, signal);
      request.deleted.forEach((row) => serverRows.splice(serverRows.findIndex((r) => r.id === row.id), 1));
    },
    events: {
      loadingChange: ({ loading, operation }) => log(loading ? operation + ' ...' : ''),
      load: ({ total }) => log('조회 완료 (전체 ' + total + '건)'),
      save: ({ summary }) => log('저장: ' + JSON.stringify(summary)),
      remove: ({ summary }) => log('삭제: ' + JSON.stringify(summary)),
      loadError: ({ error }) => log('조회 실패: ' + error.code),
      saveError: ({ error }) => log('저장 실패: ' + error.code),
      removeError: ({ error }) => log('삭제 실패: ' + error.code),
    },
  },
});

const run = (promise) => promise.catch((error) => log(error.code + ': ' + error.message));

grid.load();
document.getElementById('btnSearch').onclick = () => run(grid.searchRemote({ name: document.getElementById('keyword').value }));
document.getElementById('btnReload').onclick = () => run(grid.reload());
document.getElementById('btnAdd').onclick = () => grid.createItem({ id: 'tmp-' + Date.now(), name: '', status: 'ACTIVE' });
document.getElementById('btnDelete').onclick = () => grid.removeItems(grid.getSelectedRowIds());
document.getElementById('btnSave').onclick = () => run(grid.save().then(() => grid.reload()));
document.getElementById('btnRemove').onclick = () => run(grid.removeRemote());
document.getElementById('btnDiscard').onclick = () => run(grid.reload({ discardChanges: true }));
