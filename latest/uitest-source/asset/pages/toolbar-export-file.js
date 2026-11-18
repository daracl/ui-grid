import { DaraGrid } from '/src/index.ts';
import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export-group.js';
import { exportField } from '../../data/examples/toolbar-export-file.js';

// 조회 조건(startdt, enddt, search) 확인용. 실제 조회 연동 시 info.values를 서버 요청에 사용한다.
const searchFn = (info) => {
  console.log('조회 조건', info.values);
  grid.search(info.values.search ?? '');
};

const grid = DaraGrid.create(document.getElementById('sample'), {
  toolbar: {
    enabled: true,
    items: [
      [
        {
          position: 'left',
          children: [
            { name: 'startdt', label: '시작일', width: 150, renderer: { type: 'date' } },
            { name: 'enddt', label: '종료일', width: 150, renderer: { type: 'date' } },
            {
              name: 'search',
              label: '사용자 ID',
              renderer: 'search',
              placeholder: '검색어',
              width: 200,
              search: searchFn,
            },
          ],
        },
        { position: 'right', children: [exportField] },
      ],
      // 2번째 행: left, center, right 배치 확인용
      [
        { position: 'left', children: [{ renderer: { type: 'button' }, label: 'Left', click: (info) => console.log('left', info) }] },
        { position: 'center', children: [{ renderer: { type: 'button' }, label: 'Center', click: (info) => console.log('center', info) }] },
        { position: 'right', children: [{ renderer: { type: 'button' }, label: 'Right', click: (info) => console.log('right', info) }] },
      ],
    ],
  },
  groupingFields: ['region', 'category'],
  groupSummaryFields: [
    { field: 'quantity', expression: 'sum' },
    { field: 'amount', expression: 'sum' },
  ],
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
