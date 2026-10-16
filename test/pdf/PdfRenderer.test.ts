/** @jest-environment node */

import { GroupPdfRenderer } from '@/pdf/GroupPdfRenderer';
import { PdfRendererContext } from '@/pdf/PdfRenderer';
import { FieldItem } from '@/types/GridField';
import { ViewItem } from '@/types/Common';

describe('GroupPdfRenderer', () => {
  it('preserves row numbering and resets grouping state for each export', () => {
    const field = {
      name: 'category',
      label: 'Category',
      $renderer: { getValue: (item: Record<string, unknown>) => item.category },
    } as FieldItem;
    const context: PdfRendererContext = {
      fields: [field],
      lineNumberField: { name: 'lineNumber', label: '#' } as FieldItem,
      lineNumberStart: 10,
      viewItems: [
        { id: 'first' },
        { id: 'subtotal', groupRowType: 'groupSummary', groupField: 'category', groupValue: 'A' },
        { id: 'second' },
        { id: 'total', groupRowType: 'grandSummary' },
      ] as ViewItem[],
      groupingFields: ['category'],
      sumFields: [],
      getRowItem: () => ({ category: 'A' }),
    };
    const renderer = new GroupPdfRenderer(context);
    const first = renderer.render();

    expect(first.rows).toEqual([
      ['11', 'A'],
      ['12', 'A 합계'],
      ['13', ''],
      ['14', 'Grand Total'],
    ]);
    expect(renderer.render()).toEqual(first);
  });
});
