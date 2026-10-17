import type { PdfRendererContext } from '../pdf/PdfRenderer';
import type { PdfTableData } from '../pdf/PdfConverter';
import type { PdfHeaderCell } from '../pdf/PdfConverter';
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
export declare function columnName(index: number): string;
/** PDF의 표시 값·합계·스타일 계산을 재사용하되 PDFKit은 로드하지 않는다. */
export declare function createExcelData(context: ExcelRendererContext, rowSpanFields?: string[]): ExcelTableData;
