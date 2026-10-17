export function loadCsvModule(): Promise<typeof import('./CsvExport')> {
  return import('./CsvExport');
}
