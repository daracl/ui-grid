import { countries, products, names, items, createExampleFields1 } from '../../data/examples/grouping.js';

import { DaraGrid } from '../../grid-entry.js';

DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['country', 'product', 'name'],
  selectionMode: 'multiCell',
  sumFields: ['quantity', 'amount'],
  showGroupSum: true,
  showGrandSum: false,
  fields: createExampleFields1(),
  items,
});
