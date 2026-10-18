import { calculateGroupSummary, getGroupSummaries } from '@/util/groupSummaryUtils';
import { calcSummary } from '@/util/mathUtils';
import { SummaryTextRenderer } from '@/renderer/summary/SummaryTextRenderer';
import { GroupPdfRenderer } from '@/export/pdf/GroupPdfRenderer';
import type { SummaryItem } from '@/types/Summary';
import type { FieldItem } from '@/types/GridField';
import type { GridMain } from '@/view/GridMain';

it('calculates numeric expressions, counts rows and handles missing group settings', () => {
  const rows = [{ value: 10 }, { value: '20' }, { value: null }, { value: '' }, { value: Infinity }, { value: 'invalid' }];
  expect(calculateGroupSummary(rows, { field: 'value', expression: 'sum' })).toBe(30);
  expect(calculateGroupSummary(rows, { field: 'value', expression: 'avg' })).toBe(15);
  expect(calculateGroupSummary(rows, { field: 'value', expression: 'count' })).toBe(6);
  expect(calculateGroupSummary(rows, { field: 'value', expression: 'min' })).toBe(10);
  expect(calculateGroupSummary(rows, { field: 'value', expression: 'max' })).toBe(20);
  expect(calculateGroupSummary([], { field: 'value', expression: 'avg' })).toBe(0);
  expect(getGroupSummaries({})).toEqual([]);
  expect(getGroupSummaries({ groupSummaryFields: [] })).toEqual([]);
  expect(calcSummary([{ value: 10 }, { value: 20 }], 'avg', 'value')).toBe(15);
});

it('shares field resolution, numeric calculations and formatting across summary renderers', () => {
  const rows = [{ amount: 1000 }, { amount: '2000' }];
  const field = { name: 'amount', $colSeq: 1 } as FieldItem;
  const main = {
    i18n: () => ({}),
    config: () => ({ dataManager: { getAllRowItems: () => rows } }),
  } as unknown as GridMain;
  const summary: SummaryItem = {
    field: 'amount', expression: 'avg', displayFormat: { type: 'number', format: '0,0', prefix: '', suffix: '', locale: 'en-US' },
  };
  expect(new SummaryTextRenderer(field, main, summary).getValue()).toEqual({ value: 1500, formatValue: '1,500' });
  expect(calculateGroupSummary(rows, { name: 'amount', expression: 'avg' })).toBe(1500);
  expect(new SummaryTextRenderer(field, main, { name: 'amount', expression: () => 'custom' }).getValue().value).toBe('custom');
  const table = new GroupPdfRenderer({
    fields: [field], groupingFields: ['category'], summaryFieldNames: ['amount'], summaryItems: [summary],
    viewItems: [{ id: 'total', sortOrder: 0, groupRowType: 'grandSummary', groupSums: { amount: 1500 } }],
    getRowItem: () => ({}),
  }).render();
  expect(table.rows).toEqual([['1,500']]);
});
