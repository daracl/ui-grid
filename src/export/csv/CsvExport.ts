import type { PdfRendererContext } from '../pdf/PdfRenderer';
import { getExportCellValues } from '../exportCellValues';
import type { CsvExportOptions } from './CsvConverter';
export { CsvConverter } from './CsvConverter';
export type { CsvExportOptions } from './CsvConverter';

/** CSV는 가상 그룹 합계 행을 제외한 실제 데이터 행을 내보낸다. */
export function createCsvData(context: PdfRendererContext, options: CsvExportOptions = {}) {
  const viewItems = context.viewItems.filter((item) => !item.groupRowType);
  const useFormatter = options.useFormatter !== false;
  return {
    headers: context.fields.map((field) => field.label ?? field.name),
    rows: viewItems.map((viewItem) => {
      const item = context.getRowItem(viewItem.id);
      const formatted = useFormatter ? getExportCellValues(context.fields, item) : undefined;
      return context.fields.map((field, column) => {
        const value = item[field.name];
        if (value == null && (!formatted || (!field.getValue && field.defaultValue == null)))
          return options.nullValue ?? '';
        if (!formatted) return value;
        const display = formatted[column];
        return typeof value === 'number' && display === String(value) ? value : display;
      });
    }),
  };
}
