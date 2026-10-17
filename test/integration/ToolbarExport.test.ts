describe('파일 다운로드 툴바', () => {
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
  it('downloads only on button click, forwards options, blocks duplicates and recovers from errors', async () => {
    const { DaraGrid } = require('@/DaraGrid');
    const element = document.createElement('div');
    document.body.appendChild(element);
    grid = DaraGrid.create(element, {
      width: 700,
      title: '매출 현황',
      height: 300,
      fields: [{ name: 'name' }],
      items: [{ name: '상품' }],
      toolbar: {
        enabled: true,
        items: [
          [
            {
              position: 'left',
              children: [
                {
                  name: 'file',
                  width: 280,
                  defaultValue: 'csv',
                  renderer: {
                    type: 'exportFile',
                    listItem: { list: ['csv', 'json', 'pdf', 'xlsx', 'invalid'] },
                    exportOptions: { csv: { fileName: 'test.csv' } },
                  },
                },
              ],
            },
          ],
        ],
      },
    });
    const csv = jest.spyOn(grid, 'exportCsv').mockResolvedValue(new Blob());
    const json = jest.spyOn(grid, 'exportJson').mockRejectedValue(new Error('실패 원인'));
    const pdf = jest.spyOn(grid, 'exportPdf').mockResolvedValue(new Blob());
    const excel = jest.spyOn(grid, 'exportExcel').mockResolvedValue(new Blob());
    const button = element.querySelector('.dg-export-download') as HTMLButtonElement;
    expect(csv).not.toHaveBeenCalled();
    button.click();
    button.click();
    await Promise.resolve();
    expect(csv).toHaveBeenCalledTimes(1);
    expect(csv).toHaveBeenCalledWith({ fileName: 'test.csv' });
    expect(button.disabled).toBe(false);
    grid.setToolbarValues({ file: ['json'] });
    expect(json).not.toHaveBeenCalled();
    button.click();
    await Promise.resolve();
    expect(button.title).toBe('실패 원인');
    expect(button.disabled).toBe(false);
    grid.setToolbarValues({ file: ['pdf'] });
    button.click();
    await Promise.resolve();
    expect(pdf).toHaveBeenCalledTimes(1);
    expect(pdf).toHaveBeenCalledWith({ fileName: '매출 현황' });
    grid.setToolbarValues({ file: ['xlsx'] });
    button.click();
    await Promise.resolve();
    expect(excel).toHaveBeenCalledTimes(1);
    expect(excel).toHaveBeenCalledWith({ fileName: '매출 현황' });
    expect(json).toHaveBeenCalledWith({ fileName: '매출 현황' });
    grid.setToolbarValues({ file: ['invalid'] });
    button.click();
    await Promise.resolve();
    expect(button.title).toContain('지원 형식');
  }, 15000);

  it('uses instance translations for labels, progress, completion and errors', async () => {
    const { DaraGrid } = require('@/DaraGrid');
    const element = document.createElement('div');
    document.body.appendChild(element);
    grid = DaraGrid.create(
      element,
      {
        width: 700,
        height: 300,
        fields: [{ name: 'name' }],
        items: [{ name: '상품' }],
        toolbar: {
          enabled: true,
          items: [
            [
              {
                position: 'left',
                children: [
                  {
                    name: 'file',
                    width: 280,
                    defaultValue: 'csv',
                    renderer: { type: 'exportFile', listItem: { list: ['csv', 'invalid'] } },
                  },
                ],
              },
            ],
          ],
        },
      },
      {
        'export.format': 'File format',
        'export.download': 'Download',
        'export.creating': 'Creating file',
        'export.completed': 'Download complete',
        'export.failed': 'Download failed',
        'export.unsupportedFormat': 'Choose a supported format',
      },
    );
    const download = jest.spyOn(grid, 'exportCsv').mockResolvedValue(new Blob());
    const button = element.querySelector('.dg-export-download') as HTMLButtonElement;
    const status = element.querySelector('.dg-export-status')!;
    expect(button.textContent).toBe('Download');
    expect(element.querySelector('.dg-dropdown-button')?.getAttribute('aria-label')).toBe('File format');
    button.click();
    expect(status.textContent).toBe('Creating file');
    await Promise.resolve();
    expect(status.textContent).toBe('Download complete');
    download.mockRejectedValue(new Error('Network error'));
    button.click();
    await Promise.resolve();
    expect(status.textContent).toBe('Download failed: Network error');
    expect(button.textContent).toBe('Download failed');
    grid.setToolbarValues({ file: ['invalid'] });
    button.click();
    await Promise.resolve();
    expect(button.title).toBe('Choose a supported format');
  });
});
