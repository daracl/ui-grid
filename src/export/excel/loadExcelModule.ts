export function loadExcelModule(): Promise<typeof import('./ExcelExport')> {
  return import('./ExcelExport');
}
