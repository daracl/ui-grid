import type { PdfRendererContext } from '../pdf/PdfRenderer';
import type { CsvExportOptions } from './CsvConverter';
export { CsvConverter } from './CsvConverter';
export type { CsvExportOptions } from './CsvConverter';
/** CSV는 가상 그룹 합계 행을 제외한 실제 데이터 행을 내보낸다. */
export declare function createCsvData(context: PdfRendererContext, options?: CsvExportOptions): {
    headers: string[];
    rows: unknown[][];
};
