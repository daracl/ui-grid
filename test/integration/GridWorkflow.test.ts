import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';
import { SearchMode } from '@/types/Common';
import { TextEncoder } from 'util';

const canvasContext = {
  font: '',
  measureText: (text: string) => ({ width: text.length * 8 }),
};

type GridInstance = InstanceType<typeof import('@/DaraGrid').DaraGrid>;

const mockPdfBlob = new Blob(['%PDF']);
const mockPdfConvert = jest.fn().mockResolvedValue(mockPdfBlob);
const mockPdfDownload = jest.fn();

jest.mock('@/export/pdf/PdfConverter', () => ({
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

  const mainOf = (grid: GridInstance) => (grid as unknown as { gridMain: GridMain }).gridMain;

  it.each([false, true])('renders without aside columns (grouped: %s)', (grouped) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320,
      aside: { lineNumber: { enabled: false } },
      groupingFields: grouped ? ['category'] : [],
      groupSummaryFields: (grouped ? ['amount'] : []).map((field) => ({ field, expression: 'sum' })),
      fields: [{ name: 'category', width: 160 }, { name: 'amount', width: 100 }],
      items: [{ category: 'A', amount: 5 }],
    } as unknown as GridOptions);
    expect(element.querySelector('.dg-region[data-region="left"] .dg-row')).toBeNull();
    expect(centerRows(element)[0].textContent).toContain('A');
    expect(grid.getItems()).toHaveLength(1);
  });

  it.each([false, true])('renders with every data column fixed left (grouped: %s)', (grouped) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320, fixedLeftIndex: 2,
      groupingFields: grouped ? ['category'] : [],
      groupSummaryFields: (grouped ? ['amount'] : []).map((field) => ({ field, expression: 'sum' })),
      fields: [{ name: 'category', width: 160 }, { name: 'amount', width: 100 }],
      items: [{ category: 'A', amount: 5 }],
    } as unknown as GridOptions);
    expect(centerRows(element)).toHaveLength(0);
    expect(element.querySelector('.dg-region[data-region="left"] .dg-row')?.textContent).toContain('A');
    const main = mainOf(grid);
    const manager = main.config().dataManager;
    const id = manager.getViewItems()[0].id;
    manager.removeSoftItem([id]);
    main.getBody().dataDraw();
    expect(element.querySelector('.dg-region[data-region="left"] .dg-row')?.classList.contains('dg-status-delete')).toBe(true);
    manager.undo();
    expect(element.querySelector('.dg-region[data-region="left"] .dg-row')?.classList.contains('dg-status-delete')).toBe(false);
  });

  it('clears detail classes and search highlights when scrolling a subtotal into a recycled cell', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 180, groupingFields: ['category'], groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
      fields: [{ name: 'category', width: 160, cellClassName: 'detail-only' }, { name: 'amount', width: 100 }],
      items: Array.from({ length: 30 }, (_, i) => ({ category: `A${String(i).padStart(2, '0')}`, amount: i })),
    } as unknown as GridOptions);
    grid.search('A00', { searchFields: ['category'] } as SearchMode);
    const cell = element.querySelector('.dg-region[data-region="center"] .dg-row .dg-cell')!;
    expect(cell.classList.contains('detail-only')).toBe(true);
    expect(cell.classList.contains('dg-search-match')).toBe(true);
    const main = mainOf(grid);
    main.getScroll().moveVerticalScroll({ rowIdx: 1, drawFlag: false });
    main.getBody().dataDraw();
    expect(cell.classList.contains('dg-group-cell')).toBe(true);
    for (const name of ['detail-only', 'dg-search-match', 'dg-search-highlight']) {
      expect(cell.classList.contains(name)).toBe(false);
    }
    main.getScroll().moveVerticalScroll({ rowIdx: 0, drawFlag: false });
    main.getBody().dataDraw();
    expect(cell.classList.contains('detail-only')).toBe(true);
    expect(cell.classList.contains('dg-search-match')).toBe(true);
  });

  it.each([false, true])('removes hard-deleted row data and check state (grouped: %s)', (grouped) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320, rowIdField: 'id', deleteMode: 'hard',
      groupingFields: grouped ? ['category'] : [], groupSummaryFields: (grouped ? ['amount'] : []).map((field) => ({ field, expression: 'sum' })),
      fields: [{ name: 'category', width: 160 }, { name: 'amount', width: 100 }],
      items: [{ id: 'a', category: 'A', amount: 5 }, { id: 'b', category: 'B', amount: 7 }],
    } as unknown as GridOptions);
    const manager = mainOf(grid).config().dataManager;
    manager.setItemChecked('a', true);
    grid.removeItems(['a']);
    expect(manager.getRowItem('a')).toBeUndefined();
    expect(manager.getCheckedCount()).toBe(0);
    expect(grid.getItems().map((item: any) => item.id)).toEqual(['b']);
    if (grouped) expect(element.querySelector('.dg-region[data-region="center"] .dg-grand-summary')?.textContent).toContain('7');
  });

  it.each([false, true])('supports grouped add undo/redo and sum updates (sorted: %s)', (sorted) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320, rowIdField: 'id', groupingFields: ['category'], groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
      fields: [{ name: 'category', width: 160 }, { name: 'amount', width: 100 }],
      items: [{ id: 'a', category: 'A', amount: 5 }, { id: 'b', category: 'B', amount: 7 }],
    } as unknown as GridOptions);
    const main = mainOf(grid);
    const manager = main.config().dataManager;
    const field = main.config().currentFields.find((field) => field.name === 'amount')!;
    if (sorted) manager.dataSort([{ name: 'amount', field, ascOrder: true, sortCell: field.$colSeq }], grid.getOptions().header.sort);
    grid.createItem({ id: 'c', category: 'C', amount: 3 });
    const total = () => manager.getViewItems().find((item) => item.groupRowType === 'grandSummary')?.groupSums?.amount;
    expect(total()).toBe(15);
    expect(manager.undo()).toBe(true);
    expect(grid.getItems().map((item: any) => item.id)).not.toContain('c');
    expect(total()).toBe(12);
    expect(manager.redo()).toBe(true);
    expect(grid.getItems().map((item: any) => item.id)).toContain('c');
    expect(total()).toBe(15);
    manager.setChangeValue(manager.getRowItem('c'), field, 8);
    expect(total()).toBe(20);
    manager.undo();
    expect(total()).toBe(15);
  });

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

  it('exports collapsed tree descendants by default and visible rows on request without changing expansion', async () => {
    Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: TextEncoder });
    const { ExcelConverter } = await import('@/export/excel/ExcelConverter');
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      fields: [{ name: 'name', renderer: { type: 'tree' } }],
      items: [{ id: 'parent', name: 'Parent', children: [
        { id: 'child', name: 'Child', children: [{ id: 'leaf', name: 'Leaf' }] },
      ] }],
      tree: { idField: 'id', childrenField: 'children' },
    } as unknown as GridOptions);
    const convert = jest.spyOn(ExcelConverter.prototype, 'convert').mockReturnValue(new Blob());
    const download = jest.spyOn(ExcelConverter.prototype, 'download').mockImplementation(() => {});
    try {
      await grid.exportExcel();
      expect(convert.mock.calls[0][0].rows).toHaveLength(3);
      expect(convert.mock.calls[0][0].outlineLevels).toEqual([0, 1, 2]);
      expect(centerRows(element)).toHaveLength(1);
      await grid.exportExcel({ includeCollapsed: false });
      expect(convert.mock.calls[1][0].rows).toHaveLength(1);
      grid.expandAll();
      await grid.exportExcel({ includeCollapsed: false });
      expect(convert.mock.calls[2][0].rows).toHaveLength(3);
    } finally {
      convert.mockRestore();
      download.mockRestore();
    }
  });

  it.each([false, true])('exports all CSV source rows across pages for list and group grids (grouped: %s)', async (grouped) => {
    const { CsvConverter } = await import('@/export/csv/CsvConverter');
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320,
      fields: [{ name: 'category' }, { name: 'amount' }],
      items: Array.from({ length: 12 }, (_, index) => ({ category: 'A', amount: index + 1 })),
      groupingFields: grouped ? ['category'] : [], groupSummaryFields: (grouped ? ['amount'] : []).map((field) => ({ field, expression: 'sum' })),
      footer: { enabled: true, paging: { enabled: true } }, paging: { page: 1, pageSize: 5 },
    } as unknown as GridOptions);
    const convert = jest.spyOn(CsvConverter.prototype, 'convert').mockReturnValue(new Blob());
    const download = jest.spyOn(CsvConverter.prototype, 'download').mockImplementation(() => {});
    try {
      await grid.exportCsv();
      expect(convert.mock.calls[0][1]).toEqual(Array.from({ length: 12 }, (_, index) => ['A', index + 1]));
      await grid.exportCsv({ visibleOnly: true });
      expect(convert.mock.calls[1][1]).toEqual(Array.from({ length: 5 }, (_, index) => ['A', index + 1]));
    } finally { convert.mockRestore(); download.mockRestore(); }
  });

  it.each(['list', 'group', 'tree'])('exports JSON data with shared row and column options (%s)', async (type) => {
    const { JsonConverter } = await import('@/export/json/JsonConverter');
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320,
      fields: [{ name: 'name' }, { name: 'amount' }, { name: 'secret', hidden: true }],
      items: type === 'tree'
        ? [{ id: 'a', name: 'A', amount: 1, secret: true, children: [{ id: 'b', name: 'B', amount: 2, secret: false }] }]
        : [{ name: 'A', amount: 1, secret: true }, { name: 'B', amount: 2, secret: false }],
      tree: type === 'tree' ? { idField: 'id', childrenField: 'children' } : undefined,
      groupingFields: type === 'group' ? ['name'] : [], groupSummaryFields: (type === 'group' ? ['amount'] : []).map((field) => ({ field, expression: 'sum' })),
    } as unknown as GridOptions);
    const convert = jest.spyOn(JsonConverter.prototype, 'convert').mockReturnValue(new Blob());
    const download = jest.spyOn(JsonConverter.prototype, 'download').mockImplementation(() => {});
    const selected = jest.spyOn(grid, 'getSelectedRowIds');
    try {
      await grid.exportJson();
      expect(convert.mock.calls[0][0]).toEqual([{ name: 'A', amount: 1 }, { name: 'B', amount: 2 }]);
      await grid.exportJson({ visibleOnly: true, includeHiddenColumns: true });
      expect(convert.mock.calls[1][0]).toHaveLength(type === 'tree' ? 1 : 2);
      expect(convert.mock.calls[1][0][0]).toEqual({ name: 'A', amount: 1, secret: true });
      selected.mockReturnValue([mainOf(grid).config().dataManager.getViewItems()[0].id]);
      await grid.exportJson({ selectedOnly: true, useFormatter: true });
      expect(convert.mock.calls[2][0]).toEqual([{ name: 'A', amount: '1' }]);
    } finally { selected.mockRestore(); convert.mockRestore(); download.mockRestore(); }
  });

  it('exports CSV tree descendants, visible rows, hidden columns and selected rows through public options', async () => {
    const { CsvConverter } = await import('@/export/csv/CsvConverter');
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640, height: 320,
      fields: [{ name: 'name', renderer: { type: 'tree' } }, { name: 'secret', hidden: true }],
      items: [{ id: 'parent', name: 'Parent', secret: 'A', children: [{ id: 'child', name: 'Child', secret: 'B' }] }],
      tree: { idField: 'id', childrenField: 'children' },
    } as unknown as GridOptions);
    const convert = jest.spyOn(CsvConverter.prototype, 'convert').mockReturnValue(new Blob());
    const download = jest.spyOn(CsvConverter.prototype, 'download').mockImplementation(() => {});
    const selected = jest.spyOn(grid, 'getSelectedRowIds');
    try {
      await grid.exportCsv();
      expect(convert.mock.calls[0][1]).toEqual([['Parent'], ['Child']]);
      await grid.exportCsv({ visibleOnly: true, includeHiddenColumns: true });
      expect(convert.mock.calls[1][1]).toEqual([['Parent', 'A']]);
      // 공개 선택 API가 반환하는 내부 행 ID를 그대로 사용한다.
      const manager = mainOf(grid).config().dataManager as import('@/service/TreeDataManager').TreeDataManager;
      selected.mockReturnValue([manager.getAllTreeViewItems()[1].id]);
      await grid.exportCsv({ selectedOnly: true });
      expect(convert.mock.calls[2][1]).toEqual([['Child']]);
      selected.mockReturnValue([]);
      await grid.exportCsv({ selectedOnly: true });
      expect(convert.mock.calls[3][1]).toEqual([]);
      expect(centerRows(element)).toHaveLength(1);
    } finally {
      selected.mockRestore(); convert.mockRestore(); download.mockRestore();
    }
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
      groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
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
      pdfFontUrl: '/fonts/grid.ttf',
      groupingFields: ['category'],
      groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
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
    expect(mockPdfConvert).toHaveBeenCalledWith(expect.anything(), { ...options, fontUrl: '/fonts/grid.ttf' });
    await grid.exportPdf({ ...options, fontUrl: '/fonts/export.ttf' });
    expect(mockPdfConvert).toHaveBeenLastCalledWith(expect.anything(), { ...options, fontUrl: '/fonts/export.ttf' });
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

  it('exports display labels, masking, and effective column alignment', async () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 800,
      height: 320,
      fields: [
        { name: 'secret', renderer: { type: 'password' } },
        { name: 'empty', renderer: { type: 'hidden' } },
        { name: 'url', renderer: { type: 'link', refValue: () => ({ label: 'Open' }) } },
        {
          name: 'status',
          renderer: { type: 'dropdown' },
          editRenderer: { type: 'dropdown', listItem: { list: [{ value: 'A', label: 'Active' }] } },
        },
        { name: 'amount', renderer: { type: 'number' } },
      ],
      items: [{ secret: 'private', empty: 'invisible', url: 'https://example.com', status: 'A', amount: 10 }],
    } as unknown as GridOptions);
    mockPdfConvert.mockClear();
    await grid.exportPdf();
    const data = mockPdfConvert.mock.calls[0][0];
    expect(data.rows[0]).toEqual(['1', '********', '', 'Open', 'Active', '10']);
    expect(data.columns.find((column: { name: string }) => column.name === 'amount').align).toBe('right');
    expect(data.columns.find((column: { name: string }) => column.name === 'status').align).toBe('center');
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
      .dg-header th { background-color: rgb(20, 30, 40); color: rgb(240, 240, 240); }
      .dg-main { border: 2px dashed rgb(30, 40, 50); }
      .dg-body .dg-cell { color: rgb(80, 90, 100); }
    `;
    document.head.appendChild(style);

    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = createGrid(element, {
      width: 640,
      height: 320,
      groupingFields: ['country', 'category'],
      groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })),
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
    expect(exportedData.tableBorders.top).toEqual({ color: 'rgb(30, 40, 50)', width: 2, style: 'dashed' });
    expect(exportedData.tableBorders.left).toEqual(exportedData.tableBorders.top);
    expect(exportedData.cellTextColors[0][1]).toBe('rgb(80, 90, 100)');
    expect(exportedData.headerBackgrounds[1]).toBe('rgb(20, 30, 40)');
    expect(exportedData.headerTextColors[1]).toBe('rgb(240, 240, 240)');
    expect(exportedData.cellBorders[1][1].right).toEqual({ color: 'rgb(100, 100, 100)', width: 1 });
    expect(exportedData.cellBorders[1][1].bottom).toBeUndefined();
    expect(mockPdfConvert).toHaveBeenCalledWith(expect.anything(), {});
  });

});
