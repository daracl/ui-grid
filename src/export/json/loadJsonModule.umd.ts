declare const GRID_JSON_FILE: string;
const scriptUrl = typeof document === 'undefined' ? undefined : document.currentScript?.getAttribute('src');
const moduleUrl = scriptUrl
  ? new URL(GRID_JSON_FILE, new URL(scriptUrl, document.baseURI)).href
  : typeof document === 'undefined'
  ? `./${GRID_JSON_FILE}`
  : new URL(GRID_JSON_FILE, document.baseURI).href;

export function loadJsonModule(): Promise<typeof import('./JsonExport')> {
  return import(/* @vite-ignore */ moduleUrl);
}
