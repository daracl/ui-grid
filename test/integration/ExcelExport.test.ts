import { TextEncoder } from 'util';
import path from 'path';
import { readFileSync } from 'fs';
import { BODY_STYLE } from '@/constantStyles';

jest.mock('@/export/pdf/PdfConverter', () => ({
  PdfConverter: class {
    public async convert() { return new Blob(); }
    public download() {}
  },
}));

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
    document.getElementById('export-body-style')?.remove();
  });
  it.each(Object.keys(BODY_STYLE))('exports %s backgrounds and borders consistently to Excel and PDF', async (styleName) => {
    const { DaraGrid } = require('@/DaraGrid');
    const { ExcelConverter } = require('@/export/excel/ExcelConverter');
    const { PdfConverter } = require('@/export/pdf/PdfConverter');
    const sass = require('sass');
    const mixins = ['borderless', 'rows', 'cells', 'striped', 'stripedrows', 'stripedcells'];
    const source = mixins.map((name) => readFileSync(
      path.join(__dirname, `../../style/views/style/_${name}.scss`), 'utf8',
    )).join('\n');
    const css = sass.compileString(`${source}\n.dg-layout.dg-style- { ${mixins.map((name) => `@include ${name};`).join(' ')} }`, {
      logger: { warn: () => {} },
    }).css.replace(/var\(--row-bg\)/g, 'rgb(230, 240, 250)')
      .replace(/var\(--border-thick-color\)/g, 'rgb(30, 40, 50)')
      .replace(/var\(--border-color\)/g, 'rgb(100, 110, 120)');
    const style = document.createElement('style');
    style.id = 'export-body-style';
    style.textContent = `
      .dg-body { background-color: rgb(255, 255, 255); }
      .dg-main, .dg-cell, .dg-header-cell { border: 1px solid rgb(100, 110, 120); }
      ${css}
    `;
    document.head.appendChild(style);
    const element = document.createElement('div');
    document.body.appendChild(element);
    grid = DaraGrid.create(element, {
      width: 500, height: 200, style: styleName,
      fields: [{ name: 'name', label: 'Name', width: 150 }],
      items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
    });
    // 스크롤에 따라 바뀌는 화면 홀짝 상태가 내보내기에 영향을 주지 않아야 한다.
    element.querySelector('.dg-body')!.classList.replace('dg-body-even', 'dg-body-odd');
    const rowCount = element.querySelectorAll('tr').length;
    const excel = jest.spyOn(ExcelConverter.prototype, 'convert');
    download = jest.spyOn(ExcelConverter.prototype, 'download').mockImplementation(() => {});
    const pdf = jest.spyOn(PdfConverter.prototype, 'convert').mockResolvedValue(new Blob());
    const pdfDownload = jest.spyOn(PdfConverter.prototype, 'download').mockImplementation(() => {});
    try {
      await grid.exportExcel();
      await grid.exportPdf();
      const excelData = excel.mock.calls[0][0] as any;
      const pdfData = pdf.mock.calls[0][0] as any;
      expect(excelData.cellBackgrounds).toEqual(pdfData.cellBackgrounds);
      expect(excelData.cellBorders).toEqual(pdfData.cellBorders);
      const striped = styleName.startsWith('striped');
      expect(pdfData.cellBackgrounds.map((row: string[]) => row[1])).toEqual([
        'rgb(255, 255, 255)', striped ? 'rgb(230, 240, 250)' : 'rgb(255, 255, 255)', 'rgb(255, 255, 255)',
      ]);
      const borders = pdfData.cellBorders[0][1];
      expect(Boolean(borders.right)).toBe(!['borderless', 'rows', 'stripedRows', 'stripedCells'].includes(styleName));
      expect(Boolean(borders.bottom)).toBe(styleName !== 'borderless');
      if (styleName === 'stripedCells') {
        expect(pdfData.cellBorders.every((row: any[]) => row[row.length - 1].right === undefined)).toBe(true);
        expect(pdfData.cellBorders[0][0].right).toBeDefined();
        expect(pdfData.headerCellBorders[pdfData.columns.length - 1].right).toBeUndefined();
        expect(excelData.headerCellBorders).toEqual(pdfData.headerCellBorders);
      }
      expect(element.querySelectorAll('tr')).toHaveLength(rowCount);
      expect(element.querySelectorAll('.dg-body')).toHaveLength(1);
    } finally {
      excel.mockRestore();
      pdf.mockRestore();
      pdfDownload.mockRestore();
    }
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
