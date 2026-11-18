import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export.js';

import { DaraGrid } from '/src/index.ts';
import { initExcelExample } from '../excelExportExample.js';
const grid = DaraGrid.create(document.getElementById('sample'), {
  width: 900,
  height: 360,
  rowSpanFields: ['category'],
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
initExcelExample(grid, { fileName: 'products.xlsx', sheetName: '상품' });
