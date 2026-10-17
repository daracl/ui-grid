declare const GRID_EXCEL_FILE: string;
const scriptUrl = typeof document === 'undefined' ? undefined : document.currentScript?.getAttribute('src');
const moduleUrl = scriptUrl
  ? new URL(GRID_EXCEL_FILE, new URL(scriptUrl, document.baseURI)).href
  : typeof document === 'undefined'
  ? `./${GRID_EXCEL_FILE}`
  : new URL(GRID_EXCEL_FILE, document.baseURI).href;

export function loadExcelModule(): Promise<typeof import('./ExcelExport')> {
  return import(/* @vite-ignore */ moduleUrl);
}
