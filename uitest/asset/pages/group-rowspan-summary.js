import { items, createExampleFields1 } from '../../data/examples/group-rowspan.js';

import { DaraGrid } from '/src/index.ts';

// partNo·partName 단계마다 소계 행을 만들고, 두 컬럼은 셀 병합으로 표시한다.
// partNo 병합 셀은 partName 소계 행까지 이어지고 'P-xxx 합계' 행에서 끊긴다.
const grid = DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['partNo', 'partName'],
  rowSpanFields: ['partNo', 'partName'],
  groupSummaryFields: [{ field: 'quantity', expression: 'sum' }],
  showGroupSummary: true,
  showGrandSummary: true,
  selectionMode: 'multiCell',
  fields: createExampleFields1(),
  items,
});

// 파일 다운로드: Excel·PDF는 화면처럼 소계와 셀 병합(Excel)을 포함하고, CSV·JSON은 원본 데이터 행만 내보낸다.
const exporters = {
  excel: () => grid.exportExcel({ fileName: 'group-rowspan-summary.xlsx', sheetName: '부품별 수량' }),
  pdf: () =>
    grid.exportPdf({
      fileName: 'group-rowspan-summary.pdf',
      title: 'Quantity by part',
      author: 'Dara Grid UI test',
      orientation: 'landscape',
    }),
  csv: () => grid.exportCsv({ fileName: 'group-rowspan-summary.csv' }),
  json: () => grid.exportJson({ fileName: 'group-rowspan-summary.json' }),
};

const status = document.getElementById('export-status');

document.querySelectorAll('[data-export]').forEach((button) => {
  button.addEventListener('click', async () => {
    const type = button.dataset.export;
    button.disabled = true;
    status.textContent = ` ${type.toUpperCase()} 파일 생성 중...`;
    try {
      await exporters[type]();
      status.textContent = ` ${type.toUpperCase()} 다운로드 완료`;
    } catch (error) {
      status.textContent = ` ${type.toUpperCase()} 내보내기 실패: ${error.message}`;
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
});
