// 라벨·콜백 없이 키만 지정해 기본 메뉴 구성을 확인한다.
export const contextItems = [
  { key: 'copy' },
  {
    key: 'exportFile',
    children: [{ key: 'excel' }, { key: 'csv' }, { key: 'pdf' }, { key: 'json' }],
  },
];
