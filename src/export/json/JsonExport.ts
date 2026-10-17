import type { PdfRendererContext } from '../pdf/PdfRenderer';
import { getExportCellValues } from '../exportCellValues';
import type { JsonExportOptions } from './JsonConverter';
export { JsonConverter } from './JsonConverter';
export type { JsonExportOptions } from './JsonConverter';

/** 필드명을 키로 사용하며 내부 행 ID·상태와 그룹 가상 행은 제외한다. 트리는 평탄한 행 배열이다. */
export function createJsonData(
  context: PdfRendererContext,
  options: JsonExportOptions = {},
): Record<string, unknown>[] {
  return context.viewItems
    .filter((viewItem) => !viewItem.groupRowType)
    .map((viewItem) => {
      const item = context.getRowItem(viewItem.id);
      const formatted = options.useFormatter ? getExportCellValues(context.fields, item) : undefined;
      return Object.fromEntries(
        context.fields.map((field, column) => [field.name, formatted ? formatted[column] : item[field.name] ?? null]),
      );
    });
}
