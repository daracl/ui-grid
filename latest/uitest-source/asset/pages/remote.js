// 실제 HTTP 요청 예제. vite dev 서버의 목 API(uitest/mockApi.mjs, 데이터: uitest/data/users.json)를
// 코어 Ajax로 호출한다. 브라우저 Network 탭에서 요청·응답을 확인할 수 있다.
//
// 툴바의 검색어(Enter·검색 버튼)와 상태 선택은 toolbar.remote 설정으로 searchRemote가 자동 실행되며,
// 툴바 값(status, name)이 조회 조건으로 함께 전달된다.
const log = (text) => (document.getElementById('log').textContent = text);

document.addEventListener('DOMContentLoaded', function () {
  const run = (promise) => promise.catch((error) => log(error.code + ': ' + error.message));
  let grid;

  grid = Daracl.grid.create(document.getElementById('sample'), {
    theme: typeof G_GRID_THEME !== 'undefined' ? G_GRID_THEME : undefined,
    editable: true,
    rowIdField: 'id',
    selectionMode: 'multiRow',
    header: { sort: { enabled: true } }, // 헤더 클릭 정렬: dataSource.sorting.mode 'server'이면 서버가 정렬한다.
    aside: { lineNumber: { enabled: true }, rowCheckbox: { enabled: true, width: 27 }, modifyInfo: { enabled: true } },
    fields: [
      { name: 'id', label: 'ID', width: 80 },
      { name: 'name', label: '이름', width: 160, editRenderer: { type: 'text' } },
      { name: 'email', label: '이메일', width: 220 },
      { name: 'status', label: '상태', width: 100, editRenderer: { type: 'text' } },
      { name: 'joinedAt', label: '가입일', width: 120 },
    ],
    toolbar: {
      enabled: true,
      height: 40,
      // 검색어 Enter·검색 버튼, 상태 변경 시 툴바 값으로 searchRemote 자동 실행
      remote: { trigger: ['search', 'change'], debounce: 0 },
      items: [
        [
          {
            position: 'left',
            children: [
              {
                label: '상태',
                name: 'status',
                width: 120,
                renderer: {
                  type: 'dropdown',
                  listItem: {
                    list: [
                      { label: '전체', value: '' },
                      { label: 'ACTIVE', value: 'ACTIVE' },
                      { label: 'STOP', value: 'STOP' },
                      { label: 'WAIT', value: 'WAIT' },
                    ],
                  },
                },
                defaultValue: '',
              },
              { name: 'name', renderer: 'search', placeholder: '이름 검색', width: 200 },
            ],
          },
          {
            position: 'right',
            children: [
              {
                label: '행 추가',
                renderer: { type: 'button' },
                click: () => grid.createItem({ id: 'tmp-' + Date.now(), name: '', status: 'ACTIVE' }),
              },
              {
                label: '선택 행 삭제(soft)',
                renderer: { type: 'button' },
                click: () => grid.removeItems(grid.getSelectedRowIds()),
              },
              {
                label: '저장',
                renderer: { type: 'button' },
                click: () => run(grid.save().then(() => grid.reload())),
              },
              {
                label: '서버 삭제',
                renderer: { type: 'button' },
                click: () => run(grid.removeRemote()),
              },
              {
                label: '변경 버리고 재조회',
                renderer: { type: 'button' },
                click: () => run(grid.reload({ discardChanges: true })),
              },
            ],
          },
        ],
      ],
    },
    footer: { enabled: true, paging: { enabled: true } },
    dataSource: {
      autoLoad: true, // 생성 직후 첫 조회(툴바 값 사용)
      paging: { mode: 'server', pageSize: 10 },
      sorting: { mode: 'server' }, // 정렬 클릭 시 sort=[{ field, order }]를 조회 조건에 담아 1페이지부터 다시 조회
      // 드롭다운 툴바 값은 배열(예: ['ACTIVE'])로 반환되므로 서버가 기대하는 문자열로 변환한다.
      // sort는 { field, order } 배열이므로 서버가 파싱하는 'field:order,...' 문자열로 바꾼다.
      requestMap: (data) =>
        Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            if (key === 'sort') return [key, value.map((item) => item.field + ':' + item.order).join(',')];
            return [key, Array.isArray(value) ? value.join(',') : value];
          }),
        ),
      load: { url: '/uitest/api/users', method: 'GET' }, // page, pageSize, 툴바 값(status, name)이 쿼리 스트링으로 전달
      save: { url: '/uitest/api/users/save', method: 'POST' }, // { created, updated, deleted } JSON 본문
      remove: { url: '/uitest/api/users/remove', method: 'POST' }, // { deleted } JSON 본문
      events: {
        loadingChange: ({ loading, operation }) => loading && log(operation + ' ...'), // 완료 메시지는 load/save/remove 이벤트가 표시
        load: ({ total }) => log('조회 완료 (전체 ' + total + '건)'),
        save: ({ summary }) => log('저장: ' + JSON.stringify(summary)),
        remove: ({ summary }) => log('삭제: ' + JSON.stringify(summary)),
        loadError: ({ error }) => log(error.code === 'UNSAVED_CHANGES' ? '저장하지 않은 변경이 있습니다. 저장하거나 변경을 버리고 재조회하세요.' : '조회 실패: ' + error.code),
        saveError: ({ error }) => log('저장 실패: ' + error.code),
        removeError: ({ error }) => log('삭제 실패: ' + error.code),
      },
    },
  });

});
