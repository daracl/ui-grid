import {
  regions,
  categories,
  createExampleFields1,
  createExampleItems2,
} from '../../data/examples/excel-export-group.js';

import { DaraGrid } from '/src/index.ts';
import { initExcelExample } from '../excelExportExample.js';

const grid = DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['region', 'category'],
  groupSummaryFields: [{ field: 'quantity', expression: 'sum' }, { field: 'amount', expression: 'sum' }],
  showGroupSummary: true,
  showGrandSummary: true,
  header: { height: [32, 30, 30] },
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
initExcelExample(grid, { fileName: 'grouped-sales.xlsx', sheetName: '지역별 매출' });
