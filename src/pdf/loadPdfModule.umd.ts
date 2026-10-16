declare const GRID_PDF_FILE: string;

// UMD는 코드 분할을 지원하지 않으므로 실행 중인 스크립트 옆의 ESM 모듈을 로드한다.
const scriptUrl = typeof document === 'undefined' ? undefined : document.currentScript?.getAttribute('src');
const moduleUrl = scriptUrl
  ? new URL(GRID_PDF_FILE, new URL(scriptUrl, document.baseURI)).href
  : typeof document === 'undefined'
    ? `./${GRID_PDF_FILE}`
    : new URL(GRID_PDF_FILE, document.baseURI).href;

export function loadPdfModule(): Promise<typeof import('./PdfConverter')> {
  return import(/* @vite-ignore */ moduleUrl);
}
