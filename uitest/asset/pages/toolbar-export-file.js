import { DaraGrid } from '/src/index.ts';
import { createExampleFields1, createExampleItems2 } from '../../data/examples/excel-export-group.js';
import { exportField } from '../../data/examples/toolbar-export-file.js';

DaraGrid.create(document.getElementById('sample'), {
  toolbar: { enabled: true, items: [[{ position: 'right', children: [exportField] }]] },
  groupingFields: ['region', 'category'],
  groupSummaryFields: [{ field: 'quantity', expression: 'sum' }, { field: 'amount', expression: 'sum' }],
  fields: createExampleFields1(),
  items: createExampleItems2(),
});
