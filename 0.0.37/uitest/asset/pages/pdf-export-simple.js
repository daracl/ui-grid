import { items, createExampleFields1 } from '../../data/examples/pdf-export-simple.js';

import { DaraGrid } from '../../grid-entry.js';

const grid = DaraGrid.create(document.getElementById('sample'), {
  fields: createExampleFields1(),
  items,
});

document.getElementById('export-pdf').addEventListener('click', async () => {
  const status = document.getElementById('export-status');
  status.textContent = ' Creating PDF...';
  try {
    await grid.exportPdf({
      fileName: 'simple-grid.pdf',
      title: 'Employee directory',
      author: 'Dara Grid UI test',
      orientation: 'landscape',
    });
    status.textContent = ' PDF downloaded.';
  } catch (error) {
    status.textContent = ` PDF export failed: ${error.message}`;
    console.error(error);
  }
});
