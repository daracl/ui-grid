import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export-tree.js';

import { DaraGrid } from '/src/index.ts';
import { initExcelExample } from '../excelExportExample.js';
const grid = DaraGrid.create(document.getElementById('sample'), {
  tree: { idField: 'id', parentIdField: 'parentId', childrenField: 'children' },
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
grid.expandAll();
document.getElementById('expand').addEventListener('click', () => grid.expandAll());
document.getElementById('collapse').addEventListener('click', () => grid.collapseAll());
const exportOptions = {
  fileName: 'organization-tree.xlsx',
  sheetName: '조직도',
  autoFilter: true,
  includeCollapsed: true,
};
document.getElementById('visibleOnly').addEventListener('change', (event) => {
  exportOptions.includeCollapsed = !event.target.checked;
});
initExcelExample(grid, exportOptions);
