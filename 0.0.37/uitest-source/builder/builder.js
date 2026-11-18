import { DaraGrid } from '/src/index.ts';
import { BODY_STYLE } from '/src/constantStyles.ts';
import { datasets, settings } from '../data/builder/index.js';

const $ = (id) => document.getElementById(id);
let grid;
let timer;
let generated = '';
let availableFields = [];
$('preset').replaceChildren(...settings.types.map((type) => new Option(type.label, type.value)));
$('dataset').replaceChildren(...datasets.map((data) => new Option(data.label, data.id)));
$('bodyStyle').replaceChildren(...Object.keys(BODY_STYLE).map((style) => new Option(style, style)));

function syncFieldChoices(fields) {
  const leaves = [];
  function collect(list) {
    if (!Array.isArray(list)) return;
    for (const field of list) {
      if (!field || typeof field !== 'object') continue;
      if (field.children?.length) collect(field.children);
      else if (typeof field.name === 'string' && field.name.trim() && !leaves.some((item) => item.name === field.name))
        leaves.push(field);
    }
  }
  collect(fields);
  for (const [id, fallback] of [
    ['groupField', 'category'],
    ['sumField', 'amount'],
  ]) {
    const select = $(id);
    const previous = select.value;
    select.replaceChildren(
      ...leaves.map((field) => new Option(`${field.label ?? field.name} (${field.name})`, field.name)),
    );
    const preferred = leaves.some((field) => field.name === previous) ? previous : fallback;
    if (leaves.some((field) => field.name === preferred)) select.value = preferred;
    select.disabled = leaves.length === 0;
  }
}

function syncColumnChoices(fields) {
  availableFields = fields;
  $('columns').replaceChildren(...fields.map((field) => new Option(field.label ?? field.name, field.name, true, true)));
}

function sample(type) {
  const data = datasets.find((item) => item.id === $('dataset').value) ?? datasets[0];
  const fields = JSON.parse(JSON.stringify(data.fields));
  let items = JSON.parse(JSON.stringify(data.items));
  if (type === 'tree') {
    fields.find((field) => field.name === data.treeField).renderer = { type: 'tree' };
    const groups = new Map();
    for (const item of items) {
      const key = item[data.groupField];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    items = [...groups].map(([label, children], index) => ({
      id: 'parent-' + index,
      [data.groupField]: label,
      [data.treeField]: label,
      children,
    }));
  }
  if (type === 'chart')
    fields.find((field) => field.name === data.chartField).renderer = { type: 'bar', rule: { ...settings.chart } };
  $('fields').value = JSON.stringify(fields, null, 2);
  $('items').value = JSON.stringify(items, null, 2);
  syncFieldChoices(fields);
  syncColumnChoices(fields);
  $('groupField').value = data.groupField;
  $('sumField').value = data.sumField;
}

function number(id) {
  const input = $(id);
  if (!input.checkValidity() || input.value === '')
    throw new Error(`${input.parentElement.firstChild.textContent.trim()} 값을 확인하세요.`);
  return Number(input.value);
}

function options() {
  const fields = JSON.parse($('fields').value);
  const items = JSON.parse($('items').value);
  if (!Array.isArray(fields) || fields.length === 0) throw new Error('fields는 컬럼이 하나 이상인 배열이어야 합니다.');
  const names = new Set();
  function validateFields(list) {
    list.forEach((field) => {
      if (!field || typeof field !== 'object' || Array.isArray(field)) throw new Error('각 컬럼은 객체여야 합니다.');
      if (field.children?.length) return validateFields(field.children);
      if (typeof field.name !== 'string' || !field.name.trim() || names.has(field.name))
        throw new Error('컬럼 name은 비어 있지 않은 고유 문자열이어야 합니다.');
      names.add(field.name);
    });
  }
  validateFields(fields);
  syncFieldChoices(fields);
  function validateItems(list) {
    if (!Array.isArray(list) || list.some((item) => !item || typeof item !== 'object' || Array.isArray(item)))
      throw new Error('items는 행 객체의 배열이어야 합니다.');
    for (const item of list) if (item.children != null) validateItems(item.children);
  }
  validateItems(items);
  const type = $('preset').value;
  const groupField = $('groupField').value.trim();
  const sumField = $('sumField').value.trim();
  if (['group', 'rowspan'].includes(type) && !names.has(groupField))
    throw new Error('그룹 / 병합 필드는 fields에 존재해야 합니다.');
  if (type === 'group' && !names.has(sumField)) throw new Error('합계 필드는 fields에 존재해야 합니다.');
  const fixed = number('fixed');
  if (fixed > names.size) throw new Error('고정 열 수는 전체 컬럼 수 이하여야 합니다.');
  const paging = $('paging').checked;
  const result = {
    theme: $('theme').value,
    style: $('bodyStyle').value,
    height: number('height'),
    editable: $('editable').checked,
    fixedLeftIndex: fixed,
    header: { view: $('header').checked },
    body: { row: { height: number('rowHeight') } },
    aside: { lineNumber: { enabled: $('lineNumber').checked }, rowCheckbox: { enabled: $('checkbox').checked } },
    footer: { enabled: paging, paging: { enabled: paging } },
    paging: { page: 1, pageSize: number('pageSize') },
    fields,
    items,
  };
  if (type === 'group') {
    result.groupingFields = [groupField];
    result.groupSummaryFields = [{ field: sumField, expression: $('summaryExpression').value }];
    result.showGroupSummary = $('showGroupSummary').checked;
    result.showGrandSummary = $('showGrandSummary').checked;
  }
  if (type === 'rowspan') result.rowSpanFields = [groupField];
  if (type === 'tree') result.tree = { ...settings.tree };
  return result;
}

function apply() {
  clearTimeout(timer);
  try {
    const value = options();
    const code = JSON.stringify(value, null, 2);
    // 생성에 성공한 새 인스턴스로 교체하여 잘못된 설정 입력 시 기존 미리보기를 유지한다.
    const host = document.createElement('div');
    host.style.width = '100%';
    $('preview').appendChild(host);
    let next;
    try {
      next = DaraGrid.create(host, value);
    } catch (error) {
      DaraGrid.instance(host)?.destroy();
      host.remove();
      throw error;
    }
    grid?.destroy();
    for (const child of [...$('preview').children]) if (child !== host) child.remove();
    grid = next;
    generated = code;
    $('code').textContent = generated;
    $('error').textContent = '';
    $('status').textContent = `${$('preset').selectedOptions[0].textContent} · ${
      value.fields.length
    }개 컬럼 · 적용 완료`;
    $('expand').hidden = $('collapse').hidden = $('preset').value !== 'tree';
  } catch (error) {
    $('error').textContent = `적용 실패: ${error.message}`;
  }
}

$('options').addEventListener('submit', (event) => {
  event.preventDefault();
  apply();
});
$('options').addEventListener('input', (event) => {
  if (['preset', 'dataset', 'columns'].includes(event.target.id)) return;
  if (event.target.id === 'fields') {
    try {
      const fields = JSON.parse($('fields').value);
      if (Array.isArray(fields)) {
        syncFieldChoices(fields);
        syncColumnChoices(fields);
      }
    } catch {
      /* 편집 중인 불완전한 JSON은 적용 시 오류로 표시한다. */
    }
  }
  clearTimeout(timer);
  if ($('auto').checked) timer = setTimeout(apply, 400);
});
$('preset').addEventListener('change', () => {
  sample($('preset').value);
  if ($('auto').checked) apply();
});
$('dataset').addEventListener('change', () => {
  sample($('preset').value);
  if ($('auto').checked) apply();
});
$('columns').addEventListener('change', () => {
  const selected = new Set([...$('columns').selectedOptions].map((option) => option.value));
  const fields = availableFields.filter((field) => selected.has(field.name));
  $('fields').value = JSON.stringify(fields, null, 2);
  syncFieldChoices(fields);
  if ($('auto').checked) apply();
});
$('reset').addEventListener('click', () => {
  HTMLFormElement.prototype.reset.call($('options'));
  sample('list');
  apply();
});
$('expand').addEventListener('click', () => grid?.expandAll());
$('collapse').addEventListener('click', () => grid?.collapseAll());
const exportMethods = { excel: 'exportExcel', csv: 'exportCsv', json: 'exportJson', pdf: 'exportPdf' };
const exportButtons = [...document.querySelectorAll('[data-export]')];
for (const button of exportButtons) {
  button.addEventListener('click', async () => {
    if (!grid) return;
    const type = button.dataset.export;
    const label = button.textContent;
    exportButtons.forEach((item) => {
      item.disabled = true;
    });
    $('exportStatus').textContent = `${label} 파일 생성 중…`;
    try {
      await grid[exportMethods[type]]({ fileName: `grid-preview.${type === 'excel' ? 'xlsx' : type}` });
      $('exportStatus').textContent = `${label} 다운로드 완료`;
    } catch (error) {
      $('exportStatus').textContent = `다운로드 실패: ${error.message}`;
    } finally {
      exportButtons.forEach((item) => {
        item.disabled = false;
      });
    }
  });
}
$('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(generated);
    $('status').textContent = '옵션 JSON을 복사했습니다.';
  } catch {
    $('status').textContent = '복사할 수 없습니다. 아래 옵션을 직접 선택해 복사하세요.';
  }
});
window.addEventListener('pagehide', () => {
  clearTimeout(timer);
  grid?.destroy();
});
sample('list');
apply();
