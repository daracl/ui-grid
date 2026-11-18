import { countries, products, names, items, createExampleFields1 } from '../../data/examples/grouping.js';

import { DaraGrid } from '/src/index.ts';

DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['country', 'product', 'name'],
  selectionMode: 'multiCell',
  groupSummaryFields: [{ field: 'quantity', expression: 'sum' }, { field: 'amount', expression: 'avg' }],
  showGroupSummary: true,
  showGrandSummary: false,
  fields: createExampleFields1(),
  items,
});
