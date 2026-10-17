import { createPdfHeaderRows } from '@/export/pdf/PdfHeader';
import type { FieldItem } from '@/types/GridField';

it('preserves merged header spans, visible order and line numbers for uneven trees', () => {
  const roots = [
    {
      name: 'group',
      label: 'Group',
      children: [
        {
          name: 'nested',
          label: 'Nested',
          children: [
            { name: 'a', label: 'A' },
            { name: 'hidden', hidden: true },
          ],
        },
        { name: 'b', label: 'B' },
      ],
    },
  ] as FieldItem[];
  const fields = [{ name: 'line' }, { name: 'a' }, { name: 'b' }] as FieldItem[];
  const rows = createPdfHeaderRows(roots, fields, {})!;
  expect(rows[0].map(({ column, colSpan, rowSpan }) => [column, colSpan, rowSpan])).toEqual([
    [0, 1, 3],
    [1, 2, 1],
  ]);
  expect(rows[1].map(({ label, rowSpan }) => [label, rowSpan])).toEqual([
    ['Nested', 1],
    ['B', 2],
  ]);
  expect(rows[2].map(({ label }) => label)).toEqual(['A']);
  expect(
    createPdfHeaderRows([{ name: 'a' }] as FieldItem[], [{ name: 'a' }] as FieldItem[], {}),
  ).toBeUndefined();
});
