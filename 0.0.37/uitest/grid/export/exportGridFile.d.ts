import type { DaraGrid } from '../DaraGrid.js';
import type { ExcelExportOptions } from './excel/ExcelConverter';
import type { CsvExportOptions } from './csv/CsvConverter';
import type { JsonExportOptions } from './json/JsonConverter';
import type { PdfExportOptions } from './pdf/PdfConverter';
export interface ExportFileOptions {
    excel?: ExcelExportOptions;
    csv?: CsvExportOptions;
    json?: JsonExportOptions;
    pdf?: PdfExportOptions;
}
/** 툴바와 컨텍스트 메뉴가 동일한 형식·파일명 규칙으로 내보낸다. */
export declare function exportGridFile(grid: DaraGrid, format: string, options: ExportFileOptions | undefined, unsupportedMessage: string): Promise<Blob>;
