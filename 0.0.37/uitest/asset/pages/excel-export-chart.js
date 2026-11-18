import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export-chart.js';

import { DaraGrid } from '../../grid-entry.js';
import { initExcelExample } from '../excelExportExample.js';
const grid = DaraGrid.create(document.getElementById('sample'), {
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
initExcelExample(grid, { fileName: 'chart-data.xlsx', sheetName: '차트 데이터' });
