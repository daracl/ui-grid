const mockExcelLoaded = jest.fn();
jest.mock('@/export/excel/ExcelExport', () => {
  mockExcelLoaded();
  return { ExcelConverter: class {}, createExcelData: jest.fn() };
});
import { loadExcelModule } from '@/export/excel/loadExcelModule';

it('loads Excel code only when requested and reuses it', async () => {
  Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
  require('@/DaraGrid');
  expect(mockExcelLoaded).not.toHaveBeenCalled();
  const first = await loadExcelModule();
  expect((await loadExcelModule()).ExcelConverter).toBe(first.ExcelConverter);
  expect(mockExcelLoaded).toHaveBeenCalledTimes(1);
});
