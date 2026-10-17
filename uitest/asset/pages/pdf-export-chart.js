import { items, createExampleFields1 } from '../../data/examples/pdf-export-chart.js';

import { DaraGrid } from '/src/index.ts';

const grid = DaraGrid.create(document.getElementById('sample'), {
  fields: createExampleFields1(),
  items,
});

document.getElementById('export-pdf').addEventListener('click', async () => {
  const status = document.getElementById('export-status');
  status.textContent = ' Creating PDF...';
  try {
    await grid.exportPdf({
      fileName: 'chart-grid.pdf',
      title: 'Product revenue and weekly trend',
      author: 'Dara Grid UI test',
      orientation: 'landscape',
    });
    status.textContent = ' PDF downloaded.';
  } catch (error) {
    status.textContent = ` PDF export failed: ${error.message}`;
    console.error(error);
  }
});
