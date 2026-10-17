import { items, createExampleFields1 } from '../../data/examples/pdf-export-group.js';

import { DaraGrid } from '/src/index.ts';

const grid = DaraGrid.create(document.getElementById('sample'), {
  groupingFields: ['country', 'category'],
  sumFields: ['quantity', 'amount', 'cost', 'profit'],
  header: { height: [32, 30, 30] },
  showGroupSum: true,
  showGrandSum: true,
  fields: createExampleFields1(),
  items,
});

document.getElementById('export-pdf').addEventListener('click', async () => {
  const status = document.getElementById('export-status');
  status.textContent = ' Creating PDF...';
  try {
    await grid.exportPdf({
      fileName: 'grouped-grid.pdf',
      title: 'Sales by country and category',
      author: 'Dara Grid UI test',
      orientation: 'landscape',
    });
    status.textContent = ' PDF downloaded.';
  } catch (error) {
    status.textContent = ` PDF export failed: ${error.message}`;
    console.error(error);
  }
});
