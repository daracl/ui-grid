import { GridOptions } from '@/types/GridOptions';

const canvasContext = {
  font: '',
  measureText: (text: string) => ({ width: text.length * 8 }),
};

type GridInstance = InstanceType<typeof import('@/DaraGrid').DaraGrid>;

const mockPdfBlob = new Blob(['%PDF']);
const mockPdfConvert = jest.fn().mockResolvedValue(mockPdfBlob);
const mockPdfDownload = jest.fn();

jest.mock('@/pdf/PdfConverter', () => ({
  PdfConverter: jest.fn().mockImplementation(() => ({
    convert: mockPdfConvert,
    download: mockPdfDownload,
  })),
  normalizePdfCellValue: (value: unknown) => (value == null ? '' : String(value)),
}));

describe('Grid workflows', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: GridInstance[] = [];

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(canvasContext) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  beforeEach(() => {
    grids = [];
    document.body.innerHTML = '';
  });

  afterEach(() => {
    grids.forEach((grid) => grid.destroy());
    document.getElementById('pdf-export-test-style')?.remove();
  });

  const createGrid = (element: HTMLElement, options: GridOptions) => {
    const grid = DaraGrid.create(element, options);
    grids.push(grid);
    return grid;
  };

  const centerRows = (element: HTMLElement) =>
    Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-row'));

  it('renders list data and reflects replacement through the public API', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      fields: [{ name: 'name', label: 'Name', width: 180 }],
      items: [
        { id: 'first', name: 'First row' },
        { id: 'second', name: 'Second row' },
      ],
    } as unknown as GridOptions);

    expect(centerRows(element)).toHaveLength(2);
    expect(grid.getItems().map((item: any) => item.name)).toEqual(['First row', 'Second row']);

    grid.setItems([{ id: 'replacement', name: 'Replacement row' }]);

    expect(centerRows(element)).toHaveLength(1);
    expect(grid.getItems().map((item: any) => item.name)).toEqual(['Replacement row']);
  });

  it('expands and collapses tree rows through the public API', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      fields: [{ name: 'name', label: 'Name', width: 180, renderer: { type: 'tree' } }],
      items: [{ id: 'parent', name: 'Parent', children: [{ id: 'child', name: 'Child' }] }],
      tree: { idField: 'id', parentIdField: 'parentId', childrenField: 'children' },
    } as unknown as GridOptions);

    expect(centerRows(element)).toHaveLength(1);

    grid.expandAll();
    expect(centerRows(element)).toHaveLength(2);
    expect(
      Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-cell-content-title')).map(
        (title) => title.textContent,
      ),
    ).toContain('Child');

    grid.collapseAll();
    expect(centerRows(element)).toHaveLength(1);
    expect(
      Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-cell-content-title')).map(
        (title) => title.textContent,
      ),
    ).not.toContain('Child');
  });

  it('renders group subtotals while exposing only source data through the public API', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      groupingFields: ['category'],
      sumFields: ['amount'],
      fields: [
        { name: 'category', label: 'Category', width: 180 },
        { name: 'amount', label: 'Amount', width: 120 },
      ],
      items: [
        { id: 'one', category: 'A', amount: 5 },
        { id: 'two', category: 'A', amount: 7 },
        { id: 'three', category: 'B', amount: 3 },
      ],
    } as unknown as GridOptions);

    expect(centerRows(element)).toHaveLength(6);
    expect(element.querySelector('.dg-region[data-region="center"] .dg-group-summary')?.textContent).toContain('12');
    expect(grid.getItems().map((item: any) => item.id)).toEqual(['one', 'two', 'three']);
  });

  it('exports all visible rows and group totals to a configurable PDF download', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      groupingFields: ['category'],
      sumFields: ['amount'],
      fields: [
        { name: 'category', label: 'Category', width: 180 },
        { name: 'amount', label: 'Amount', width: 120 },
      ],
      items: [{ id: 'one', category: 'A', amount: 5 }],
    } as unknown as GridOptions);
    const options = {
      fileName: 'grouped-report',
      title: 'Grouped report',
      fontName: 'Helvetica',
    };
    mockPdfConvert.mockClear();
    mockPdfDownload.mockClear();

    const blob = await grid.exportPdf(options);

    expect(blob).toBe(mockPdfBlob);
    const exportedData = mockPdfConvert.mock.calls[0][0];
    expect(exportedData.columns.map(({ name, label }: { name: string; label: string }) => [name, label])).toEqual([
      ['$lineNumber', ''],
      ['category', 'Category'],
      ['amount', 'Amount'],
    ]);
    expect(exportedData.rows).toEqual([
      ['1', 'A', '5'],
      ['2', 'A 합계', '5'],
      ['3', 'Grand Total', '5'],
    ]);
    expect(exportedData.cellBorders).toHaveLength(3);
    expect(mockPdfConvert).toHaveBeenCalledWith(expect.anything(), options);
    expect(mockPdfDownload).toHaveBeenCalledWith(mockPdfBlob, 'grouped-report');
  });

  it('exports simple grid rows without applying group formatting', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      fields: [
        { name: 'name', label: 'Name', width: 180 },
        { name: 'amount', label: 'Amount', width: 120 },
      ],
      items: [
        { id: 'one', name: 'First', amount: 5 },
        { id: 'two', name: 'Second', amount: 7 },
      ],
    } as unknown as GridOptions);
    mockPdfConvert.mockClear();

    await grid.exportPdf();

    const exportedData = mockPdfConvert.mock.calls[0][0];
    expect(exportedData.columns.map(({ name, label }: { name: string; label: string }) => [name, label])).toEqual([
      ['$lineNumber', ''],
      ['name', 'Name'],
      ['amount', 'Amount'],
    ]);
    expect(exportedData.rows).toEqual([
      ['1', 'First', '5'],
      ['2', 'Second', '7'],
    ]);
    expect(exportedData.cellBorders).toHaveLength(2);
    expect(mockPdfConvert).toHaveBeenCalledWith(expect.anything(), {});
  });

  it('exports bar and sparkline fields as chart graphics', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      fields: [
        { name: 'product', label: 'Product', width: 160 },
        {
          name: 'revenue',
          label: 'Revenue',
          width: 150,
          renderer: { type: 'bar', rule: { minimum: 0, maximum: 8000 } },
        },
        {
          name: 'trend',
          label: 'Trend',
          width: 220,
          renderer: { type: 'sparklineBar', refValue: (_field: unknown, value: number[]) => ({ value }) },
        },
      ],
      items: [{ id: 'one', product: 'Tea', revenue: 4200, trend: [12, 16, 14, 21, 24] }],
    } as unknown as GridOptions);
    mockPdfConvert.mockClear();

    await grid.exportPdf();

    const exportedData = mockPdfConvert.mock.calls[0][0];
    expect(exportedData.cellCharts[0]).toEqual([
      undefined,
      undefined,
      {
        type: 'bar',
        value: 4200,
        minimum: 0,
        maximum: 8000,
        label: '4200',
        color: '#77c0fc',
      },
      { type: 'sparklineBar', values: [12, 16, 14, 21, 24] },
    ]);
  });

  it('exports grouped rows with repeated values suppressed like the visible grid', async () => {
    const style = document.createElement('style');
    style.id = 'pdf-export-test-style';
    style.textContent = `
      .dg-body .dg-group-cell { background-color: rgb(240, 240, 240); }
      .dg-body .dg-cell { border-right: 1px solid rgb(100, 100, 100); border-bottom: 1px solid rgb(100, 100, 100); }
      .dg-body .dg-group-continuation { border-bottom-color: transparent !important; }
    `;
    document.head.appendChild(style);

    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      groupingFields: ['country', 'category'],
      sumFields: ['amount'],
      fields: [
        { name: 'country', label: 'Country', width: 120 },
        { name: 'category', label: 'Category', width: 120 },
        { name: 'product', label: 'Product', width: 120 },
        { name: 'amount', label: 'Amount', width: 100 },
      ],
      items: [
        { id: 'one', country: 'Korea', category: 'Tea', product: 'Green tea', amount: 10 },
        { id: 'two', country: 'Korea', category: 'Tea', product: 'Black tea', amount: 20 },
        { id: 'three', country: 'Korea', category: 'Coffee', product: 'Americano', amount: 30 },
        { id: 'four', country: 'Japan', category: 'Tea', product: 'Matcha', amount: 40 },
      ],
    } as unknown as GridOptions);
    mockPdfConvert.mockClear();

    await grid.exportPdf();

    const exportedData = mockPdfConvert.mock.calls[0][0];
    expect(exportedData.columns.map(({ name, label }: { name: string; label: string }) => [name, label])).toEqual([
      ['$lineNumber', ''],
      ['country', 'Country'],
      ['category', 'Category'],
      ['product', 'Product'],
      ['amount', 'Amount'],
    ]);
    expect(exportedData.rows).toEqual([
      ['1', 'Korea', 'Tea', 'Green tea', '10'],
      ['2', '', '', 'Black tea', '20'],
      ['3', '', 'Tea 합계', '', '30'],
      ['4', '', 'Coffee', 'Americano', '30'],
      ['5', '', 'Coffee 합계', '', '30'],
      ['6', 'Japan', 'Tea', 'Matcha', '40'],
      ['7', '', 'Tea 합계', '', '40'],
      ['8', 'Grand Total', '', '', '100'],
    ]);
    expect(exportedData.cellBackgrounds[2].slice(1)).toEqual([
      'rgb(240, 240, 240)',
      'rgb(240, 240, 240)',
      'rgb(240, 240, 240)',
      'rgb(240, 240, 240)',
    ]);
    expect(exportedData.cellBorders).toHaveLength(8);
    expect(exportedData.cellBorders[1][1].right).toEqual({ color: 'rgb(100, 100, 100)', width: 1 });
    expect(exportedData.cellBorders[1][1].bottom).toBeUndefined();
    expect(mockPdfConvert).toHaveBeenCalledWith(expect.anything(), {});
  });

});
