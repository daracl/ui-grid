import { DaraGrid } from '/src/index.ts';
import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export-group.js';
import { contextItems } from '../../data/examples/context-export-file.js';

DaraGrid.create(document.getElementById('sample'), {
  title: '지역별 매출',
  selectionMode: 'multiCell',
  contextMenu: { items: contextItems },
  groupingFields: ['region', 'category'],
  groupSummaryFields: [{ field: 'quantity', expression: 'sum' }, { field: 'amount', expression: 'sum' }],
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
