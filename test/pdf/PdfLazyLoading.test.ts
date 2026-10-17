const mockModuleLoaded = jest.fn();

jest.mock('@/export/pdf/PdfConverter', () => {
  mockModuleLoaded();
  return { PdfConverter: class {} };
});

import { loadPdfModule } from '@/export/pdf/loadPdfModule';

describe('PDF lazy loading', () => {
  it('loads the converter only when requested and reuses the module', async () => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    require('@/DaraGrid');
    expect(mockModuleLoaded).not.toHaveBeenCalled();

    const first = await loadPdfModule();
    expect(first.PdfConverter).toBeDefined();
    expect((await loadPdfModule()).PdfConverter).toBe(first.PdfConverter);
    expect(mockModuleLoaded).toHaveBeenCalledTimes(1);
  });
});
