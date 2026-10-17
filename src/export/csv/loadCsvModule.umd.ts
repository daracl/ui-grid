declare const GRID_CSV_FILE: string;
const scriptUrl = typeof document === 'undefined' ? undefined : document.currentScript?.getAttribute('src');
const moduleUrl = scriptUrl
  ? new URL(GRID_CSV_FILE, new URL(scriptUrl, document.baseURI)).href
  : typeof document === 'undefined'
  ? `./${GRID_CSV_FILE}`
  : new URL(GRID_CSV_FILE, document.baseURI).href;

export function loadCsvModule(): Promise<typeof import('./CsvExport')> {
  return import(/* @vite-ignore */ moduleUrl);
}
