import { TextEncoder } from 'util';

describe('grid XLSX API', () => {
  let grid: any;
  let download: jest.SpyInstance;
  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: TextEncoder });
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue({ font: '', measureText: (text: string) => ({ width: text.length * 8 }) }) as any;
  });
  afterEach(() => {
    grid?.destroy();
    download?.mockRestore();
    document.body.innerHTML = '';
  });
  it('exports hidden columns, labels, masking and rowSpan through the public API and cleans up on failure', async () => {
    const { DaraGrid } = require('@/DaraGrid');
    const { ExcelConverter } = require('@/export/excel/ExcelConverter');
    download = jest.spyOn(ExcelConverter.prototype, 'download').mockImplementation(() => {});
    const element = document.createElement('div');
    document.body.appendChild(element);
    grid = DaraGrid.create(element, {
      width: 700,
      height: 300,
      rowSpanFields: ['category'],
      fields: [
        { name: 'category', label: '분류', width: 120 },
        {
          name: 'status',
          label: '상태',
          width: 120,
          renderer: { type: 'dropdown', refValue: () => ({ label: '활성' }) },
        },
        { name: 'secret', label: '비밀번호', width: 120, renderer: { type: 'password' } },
        { name: 'hidden', hidden: true },
      ],
      items: [
        { category: 'A', status: 'ACTIVE', secret: 'private-secret', hidden: 'hidden-content' },
        { category: 'A', status: 'ACTIVE', secret: 'private-secret', hidden: 'hidden-content' },
      ],
    });
    const originalRows = element.querySelectorAll('tr').length;
    const blob = await grid.exportExcel({ sheetName: '상품', includeRowNumber: false });
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsText(blob);
    });
    expect(content).toContain('활성');
    expect(content).toContain('********');
    expect(content).not.toContain('private-secret');
    expect(content).not.toContain('hidden-content');
    expect(content).toContain('<mergeCell ref="A2:A3"/>');
    expect(element.querySelectorAll('tr')).toHaveLength(originalRows);
    await expect(grid.exportExcel({ sheetName: 'invalid/name' })).rejects.toThrow('sheet name');
    expect(element.querySelectorAll('tr')).toHaveLength(originalRows);
    expect(download).toHaveBeenCalledTimes(1);
  });
});
