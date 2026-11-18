document.addEventListener('DOMContentLoaded', function () {
  const logElement = document.getElementById('log');
  const log = (message) => {
    logElement.textContent = message;
  };

  // 페이징 UI 없이 스크롤이 끝에 가까워지면 다음 페이지를 조회해 이어 붙인다.
  // 조회 중에는 기존 로더(dataSource.loader)가 그리드 위에 표시된다.
  Daracl.grid.create(document.getElementById('sample'), {
    theme: typeof G_GRID_THEME !== 'undefined' ? G_GRID_THEME : undefined,
    rowIdField: 'id',
    aside: { lineNumber: { enabled: true } },
    header: { sort: { enabled: true } },
    fields: [
      { name: 'id', label: 'ID', width: 80 },
      { name: 'name', label: '이름', width: 160 },
      { name: 'email', label: '이메일', width: 220 },
      { name: 'status', label: '상태', width: 100 },
      { name: 'joinedAt', label: '가입일', width: 120 },
    ],
    dataSource: {
      autoLoad: true,
      paging: { mode: 'infinite', pageSize: 20, threshold: 5 }, // 마지막 5행 이내로 스크롤하면 다음 페이지 조회
      sorting: { mode: 'server' }, // 정렬하면 1페이지부터 다시 조회
      requestMap: (data) => {
        const { sort, ...rest } = data;
        return sort ? { ...rest, sort: sort.map((item) => item.field + ':' + item.order).join(',') } : rest;
      },
      load: { url: '/uitest/api/users', method: 'GET' },
      events: {
        load: ({ params, items, total }) =>
          log('page ' + params.page + ' 조회 (' + items.length + '건, 전체 ' + total + '건)'),
        loadError: ({ error }) => log('조회 실패: ' + error.code),
      },
    },
  });
});
