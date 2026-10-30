import type { GridOptions } from '@/types/GridOptions';

/** 내보내기(Excel·PDF)의 셀 스타일 계산이 행 수에 비례해 느려지지 않고 결과도 같은지 확인한다. */
describe('내보내기 셀 스타일 계산', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  let styleSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  afterEach(() => {
    styleSpy?.mockRestore();
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  /**
   * 테마 CSS가 없는 jsdom에서 스타일이 클래스와 줄무늬 위치로 결정되는 것처럼 흉내 낸다.
   * - tr: 첫 번째 행(짝)과 두 번째 행(홀)의 배경이 다르다.
   * - td: neg 클래스면 빨간 배경·글자색, 오른쪽 테두리 색은 행 줄무늬에 따라 다르다.
   */
  const mockStyles = () => {
    styleSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(((element: Element) => {
      const row = element.closest('tr');
      const odd = !!row?.previousElementSibling;
      const negative = (element.className || '').toString().includes('neg');
      const isCell = element.tagName === 'TD';

      return {
        backgroundColor: element.tagName === 'TR' ? (odd ? 'rgb(2, 2, 2)' : 'rgb(1, 1, 1)') : isCell && negative ? 'rgb(255, 0, 0)' : isCell ? 'transparent' : 'rgb(255, 255, 255)',
        color: negative ? 'rgb(200, 0, 0)' : 'rgb(0, 0, 0)',
        borderTopWidth: '',
        borderRightWidth: isCell ? '1px' : '',
        borderBottomWidth: '',
        borderLeftWidth: '',
        borderTopStyle: '',
        borderRightStyle: isCell ? 'solid' : '',
        borderBottomStyle: '',
        borderLeftStyle: '',
        borderTopColor: '',
        borderRightColor: odd ? 'rgb(8, 8, 8)' : 'rgb(9, 9, 9)',
        borderBottomColor: '',
        borderLeftColor: '',
        getPropertyValue: () => '',
      } as unknown as CSSStyleDeclaration;
    }) as typeof window.getComputedStyle);
  };

  const create = (rows: number, extraFields: Record<string, unknown>[] = []) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 80 },
        { name: 'name', width: 120 },
        { name: 'amount', width: 100, cellClassName: ({ item }: { item: { amount: number } }) => (item.amount < 0 ? 'neg' : '') },
        ...extraFields,
      ],
      items: Array.from({ length: rows }, (_, i) => ({
        id: i + 1,
        name: `n${i}`,
        amount: i % 3 === 0 ? -i : i,
        percent: i % 100,
      })),
    } as unknown as GridOptions);
    grids.push(grid);

    const main = (grid as unknown as { gridMain: any }).gridMain;
    const cfg = main.config();
    const fields = cfg.currentFields.filter((field: { $isAside: boolean; hidden: boolean }) => !field.$isAside && !field.hidden);
    const probe = (grid as unknown as { createPdfCellStyleResolver(a: unknown, b: unknown): any }).createPdfCellStyleResolver(fields, fields);
    return { grid, cfg, fields, probe, dm: cfg.dataManager };
  };

  it('행이 아무리 많아도 클래스 조합 수만큼만 스타일을 계산하고 결과는 기대와 같다', () => {
    mockStyles();
    const { probe, dm, fields } = create(3000);
    const amountCol = fields.findIndex((field: { name: string }) => field.name === 'amount');
    styleSpy.mockClear();

    const viewItems = dm.getViewItems();
    for (let rowIndex = 0; rowIndex < viewItems.length; rowIndex++) {
      const styles = probe.getCellStyles(viewItems[rowIndex], rowIndex);
      const item = dm.getRowItem(viewItems[rowIndex].id);
      const negative = item.amount < 0;
      const odd = rowIndex % 2 === 1;

      expect(styles.backgrounds).toHaveLength(fields.length);
      fields.forEach((_: unknown, col: number) => {
        const isNegativeCell = col === amountCol && negative;
        expect(styles.backgrounds[col]).toBe(isNegativeCell ? 'rgb(255, 0, 0)' : odd ? 'rgb(2, 2, 2)' : 'rgb(1, 1, 1)');
        expect(styles.textColors[col]).toBe(isNegativeCell ? 'rgb(200, 0, 0)' : 'rgb(0, 0, 0)');
        expect(styles.borders[col]?.right).toEqual({ width: 1, color: odd ? 'rgb(8, 8, 8)' : 'rgb(9, 9, 9)' });
      });
    }

    // 3000행 × 3열이라도 (줄무늬 2 × 음수 여부 2) 조합만 계산한다.
    expect(styleSpy.mock.calls.length).toBeLessThan(100);
  });

  it('돌려준 배열을 바꿔도 이후 행의 결과에 영향을 주지 않는다', () => {
    mockStyles();
    const { probe, dm } = create(10);
    const viewItems = dm.getViewItems();

    const first = probe.getCellStyles(viewItems[0], 0);
    first.backgrounds[0] = 'tampered';
    first.textColors.length = 0;
    first.borders.length = 0;

    const third = probe.getCellStyles(viewItems[2], 2);
    expect(third.backgrounds[0]).toBe('rgb(1, 1, 1)');
    expect(third.textColors).toHaveLength(3);
    expect(third.borders).toHaveLength(3);
  });

  it('행마다 고유한 클래스가 붙어도 올바른 결과를 돌려준다', () => {
    mockStyles();
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 80, cellClassName: ({ item }: { item: { id: number } }) => (item.id === 3 ? 'neg' : `row-${item.id}`) },
      ],
      items: Array.from({ length: 6 }, (_, i) => ({ id: i + 1 })),
    } as unknown as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: any }).gridMain;
    const fields = main.config().currentFields.filter((field: { $isAside: boolean }) => !field.$isAside);
    const probe = (grid as unknown as { createPdfCellStyleResolver(a: unknown, b: unknown): any }).createPdfCellStyleResolver(fields, fields);
    const viewItems = main.config().dataManager.getViewItems();

    const backgrounds = viewItems.map((viewItem: unknown, index: number) => probe.getCellStyles(viewItem, index).backgrounds[0]);
    expect(backgrounds).toEqual([
      'rgb(1, 1, 1)',
      'rgb(2, 2, 2)',
      'rgb(255, 0, 0)',
      'rgb(2, 2, 2)',
      'rgb(1, 1, 1)',
      'rgb(2, 2, 2)',
    ]);
  });

  it('막대 차트 색상은 내보내기마다 한 번만 읽는다', () => {
    mockStyles();
    const { grid, cfg, probe, dm } = create(300, [
      { name: 'percent', width: 120, renderer: { type: 'bar', rule: { minimum: 0, maximum: 100 } } },
    ]);
    const percentField = cfg.currentFields.find((field: { name: string }) => field.name === 'percent');
    const gridElement = (grid as unknown as { gridMain: any }).gridMain.element().getElement();
    styleSpy.mockClear();

    const charts = dm
      .getViewItems()
      .map((viewItem: { id: number }) =>
        (grid as unknown as { getPdfCellChart(f: unknown, i: unknown): any }).getPdfCellChart(percentField, dm.getRowItem(viewItem.id)),
      );

    expect(charts.filter(Boolean).length).toBeGreaterThan(250);
    const gridCalls = styleSpy.mock.calls.filter(([element]) => element === gridElement).length;
    expect(gridCalls).toBe(1);
    void probe;
  });
});
