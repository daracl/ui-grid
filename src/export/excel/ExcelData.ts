import type { PdfRendererContext } from '../pdf/PdfRenderer';
import type { PdfTableData } from '../pdf/PdfConverter';
import type { PdfHeaderCell } from '../pdf/PdfConverter';
import { GroupPdfRenderer } from '../pdf/GroupPdfRenderer';
import { SimplePdfRenderer } from '../pdf/SimplePdfRenderer';
import type { TreeViewItem } from '@/types/Common';

export interface ExcelRendererContext extends PdfRendererContext {
  rowHeight?: number;
}

export interface ExcelTableData extends Omit<PdfTableData, 'rows'> {
  headerRows?: PdfHeaderCell[][];
  rows: (string | number | boolean)[][];
  merges: string[];
  cellIndents?: number[][];
  outlineLevels?: number[];
  rowHeight?: number;
}

export function columnName(index: number): string {
  let name = '';
  for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(65 + ((value - 1) % 26)) + name;
  }
  return name;
}

/** PDF의 표시 값·합계·스타일 계산을 재사용하되 PDFKit은 로드하지 않는다. */
export function createExcelData(context: ExcelRendererContext, rowSpanFields: string[] = []): ExcelTableData {
  const renderer = context.groupingFields.length ? new GroupPdfRenderer(context) : new SimplePdfRenderer(context);
  const table = renderer.render();
  const offset = context.lineNumberField ? 1 : 0;
  const hasTree = context.fields.some((field) => field.renderer?.type === 'tree');
  const depths = context.viewItems.map((item) => Math.max(0, Math.floor((item as TreeViewItem).depth ?? 0)));
  const cellIndents = hasTree
    ? context.viewItems.map((_, index) => [
        ...(offset ? [0] : []),
        ...context.fields.map((field) => (field.renderer?.type === 'tree' ? Math.min(250, depths[index]) : 0)),
      ])
    : undefined;
  const rows: ExcelTableData['rows'] = table.rows.map((row, rowIndex) => {
    const values: ExcelTableData['rows'][number] = [...row];
    const viewItem = context.viewItems[rowIndex];
    if (offset) values[0] = (context.lineNumberStart ?? 0) + rowIndex + 1;
    context.fields.forEach((field, index) => {
      if (viewItem.groupRowType) {
        const sum = viewItem.groupSums?.[field.name];
        if (sum !== undefined && context.summaryFieldNames.includes(field.name) && row[index + offset] === String(sum)) {
          values[index + offset] = sum;
        }
      } else if (!field.displayFormat && ['text', 'number'].includes(field.renderer?.type ?? 'text')) {
        const value = field.$renderer.getValue(context.getRowItem(viewItem.id));
        // 라벨이나 그룹 반복 숨김을 원시 값으로 덮어쓰지 않는다.
        if (
          ((typeof value === 'number' && Number.isFinite(value)) || typeof value === 'boolean') &&
          row[index + offset] === String(value)
        ) {
          values[index + offset] = value;
        }
      }
    });
    return values;
  });
  const merges: string[] = [];
  table.cellCharts?.forEach((charts, row) =>
    charts.forEach((chart, column) => {
      if (chart) rows[row][column] = '';
    }),
  );
  rowSpanFields.forEach((name, level) => {
    const column = context.fields.findIndex((field) => field.name === name);
    if (column < 0) return;
    for (let start = 0; start < context.viewItems.length; ) {
      const first = context.viewItems[start];
      if (first.groupRowType) {
        start++;
        continue;
      }
      const item = context.getRowItem(first.id);
      let end = start + 1;
      while (
        end < context.viewItems.length &&
        !context.viewItems[end].groupRowType &&
        rowSpanFields
          .slice(0, level + 1)
          .every((key) => Object.is(item[key], context.getRowItem(context.viewItems[end].id)[key]))
      )
        end++;
      if (end - start > 1) {
        const letter = columnName(column + offset);
        merges.push(`${letter}${start + 2}:${letter}${end + 1}`);
        for (let index = start + 1; index < end; index++) {
          rows[index][column + offset] = '';
          if (table.cellCharts?.[index]) table.cellCharts[index][column + offset] = undefined;
        }
      }
      start = end;
    }
  });
  return {
    ...table,
    rows,
    merges,
    cellIndents,
    outlineLevels: hasTree ? depths.map((depth) => Math.min(7, depth)) : undefined,
    rowHeight: context.rowHeight,
  };
}
