import { fields, createCsvExampleItems } from '../../data/examples/csv-export.js';

import { DaraGrid } from '../../grid-entry.js';
let grid;
const type = document.getElementById('type');

function create() {
  grid?.destroy();
  const items = createCsvExampleItems();
  const options = { fields: fields.map((field) => ({ ...field })), items };
  if (type.value === 'list') {
    options.footer = { enabled: true, paging: { enabled: true } };
    options.paging = { page: 1, pageSize: 5 };
  } else if (type.value === 'group') {
    options.groupingFields = ['category'];
    options.sumFields = ['amount'];
  } else if (type.value === 'rowspan') {
    options.rowSpanFields = ['category'];
  } else if (type.value === 'chart') {
    options.fields[2].renderer = { type: 'bar', rule: { minimum: 0, maximum: 12000 } };
  } else if (type.value === 'tree') {
    options.tree = { idField: 'id', childrenField: 'children' };
    options.fields[1].renderer = { type: 'tree' };
    options.items = [{ ...items[0], children: items.slice(1) }];
  }
  grid = DaraGrid.create(document.getElementById('sample'), options);
  document.getElementById('status').textContent = '';
}
type.addEventListener('change', create);
document.getElementById('export').addEventListener('click', async (event) => {
  event.target.disabled = true;
  try {
    await grid.exportCsv({
      fileName: `${type.value}.csv`,
      visibleOnly: document.getElementById('visible').checked,
      selectedOnly: document.getElementById('selected').checked,
      includeHiddenColumns: document.getElementById('hidden').checked,
      useFormatter: document.getElementById('formatted').checked,
    });
    document.getElementById('status').textContent = '다운로드 완료';
  } catch (error) {
    document.getElementById('status').textContent = `실패: ${error.message}`;
  } finally {
    event.target.disabled = false;
  }
});
create();
