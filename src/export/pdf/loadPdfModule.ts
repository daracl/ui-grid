export function loadPdfModule(): Promise<typeof import('./PdfConverter')> {
  return import('./PdfConverter');
}
