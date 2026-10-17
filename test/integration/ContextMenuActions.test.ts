describe('컨텍스트 메뉴 기본 동작', () => {
  let grid: any;
  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue({ font: '', measureText: (text: string) => ({ width: text.length * 8 }) }) as any;
  });
  afterEach(() => {
    grid?.destroy();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });
  it('copies, exports child formats, respects callbacks/disabled items and recovers from export errors', async () => {
    const { DaraGrid } = require('@/DaraGrid');
    const element = document.createElement('div');
    document.body.appendChild(element);
    const callback = jest.fn();
    const custom = jest.fn();
    grid = DaraGrid.create(element, {
      title: '매출 내역',
      width: 700,
      height: 300,
      fields: [{ name: 'name' }],
      items: [{ name: '상품' }],
      contextMenu: {
        callback,
        items: [
          { key: 'copy' },
          {
            key: 'exportFile',
            exportOptions: { csv: { fileName: 'sales.csv' }, pdf: { margin: 20 } },
            children: [
              { key: 'csv', exportOptions: { csv: { bom: false } } },
              { key: 'pdf', label: 'PDF' },
              { key: 'json', label: 'JSON' },
              { key: 'xlsx', label: 'Excel' },
            ],
          },
          {
            key: 'custom',
            label: '사용자 메뉴',
            children: [
              { key: 'csv', label: '다른 CSV' },
              { key: 'copy', label: '사용자 복사', callback: custom },
            ],
          },
          { key: 'disabled', label: '비활성', disabled: true, children: [{ key: 'copy', label: '비활성 복사' }] },
        ],
      },
    });
    const copy = jest.spyOn(grid, 'copyData').mockImplementation(() => {});
    expect(document.querySelector('[data-item-key="0_copy"] .dg-contextmenu-label')?.textContent).toBe('Copy');
    expect(document.querySelector('[data-item-key="0_exportFile"] .dg-contextmenu-label')?.textContent).toBe('Export file');
    expect(document.querySelector('[data-item-key="0_exportFile_1_csv"] .dg-contextmenu-label')?.textContent).toBe('CSV');
    expect(grid.getOptions().contextMenu.items[0]).toEqual({ key: 'copy' });
    const csv = jest.spyOn(grid, 'exportCsv').mockResolvedValue(new Blob());
    const pdf = jest.spyOn(grid, 'exportPdf').mockResolvedValue(new Blob());
    const json = jest.spyOn(grid, 'exportJson').mockRejectedValue(new Error('download failed'));
    const excel = jest.spyOn(grid, 'exportExcel').mockResolvedValue(new Blob());
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const click = (key: string) =>
      document.querySelector(`[data-item-key="${key}"]`)!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    click('0_copy');
    expect(copy).toHaveBeenCalledTimes(1);
    click('0_exportFile_1_csv');
    click('0_exportFile_1_csv');
    await Promise.resolve();
    await Promise.resolve();
    expect(csv).toHaveBeenCalledTimes(1);
    expect(csv).toHaveBeenCalledWith({ fileName: 'sales.csv', bom: false });
    click('0_exportFile_1_pdf');
    await Promise.resolve();
    await Promise.resolve();
    expect(pdf).toHaveBeenCalledWith({ margin: 20, fileName: '매출 내역' });
    click('0_exportFile_1_json');
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    expect(error).toHaveBeenCalled();
    click('0_exportFile_1_xlsx');
    await Promise.resolve();
    await Promise.resolve();
    expect(excel).toHaveBeenCalledWith({ fileName: '매출 내역' });
    click('0_custom_1_csv');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(csv).toHaveBeenCalledTimes(1);
    click('0_custom_1_copy');
    expect(custom).toHaveBeenCalledTimes(1);
    expect(copy).toHaveBeenCalledTimes(1);
    click('0_disabled_1_copy');
    expect(copy).toHaveBeenCalledTimes(1);
  }, 15000);
});
