import type { DaraGrid } from '@/DaraGrid';
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
export function exportGridFile(
  grid: DaraGrid,
  format: string,
  options: ExportFileOptions | undefined,
  unsupportedMessage: string,
): Promise<Blob> {
  const withFileName = <T extends { fileName?: string }>(value?: T) => ({
    ...value,
    fileName: value?.fileName?.trim() ? value.fileName : grid.getOptions().title?.trim() || undefined,
  });
  switch (format.toLowerCase()) {
    case 'excel':
    case 'xlsx':
      return grid.exportExcel(withFileName(options?.excel));
    case 'csv':
      return grid.exportCsv(withFileName(options?.csv));
    case 'json':
      return grid.exportJson(withFileName(options?.json));
    case 'pdf':
      return grid.exportPdf(withFileName(options?.pdf));
    default:
      throw new Error(unsupportedMessage);
  }
}
