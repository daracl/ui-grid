import {
  regions,
  categories,
  createExampleFields1,
  createExampleItems2,
} from '../../data/examples/excel-export-group.js';

import { DaraGrid } from '../../grid-entry.js';
import { initExcelExample } from '../excelExportExample.js';

const grid = DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['region', 'category'],
  sumFields: ['quantity', 'amount'],
  showGroupSum: true,
  showGrandSum: true,
  header: { height: [32, 30, 30] },
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
initExcelExample(grid, { fileName: 'grouped-sales.xlsx', sheetName: '지역별 매출' });
