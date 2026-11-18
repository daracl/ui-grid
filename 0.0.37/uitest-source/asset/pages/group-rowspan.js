import { partNames, descriptions, items, createExampleFields1 } from '../../data/examples/group-rowspan.js';

import { DaraGrid } from '/src/index.ts';

DaraGrid.create(document.getElementById('sample'), {
  rowSpanFields: ['partNo', 'partName'],
  selectionMode: 'multiCell',
  fields: createExampleFields1(),
  items,
});
