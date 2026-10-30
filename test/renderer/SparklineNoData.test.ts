import type { GridOptions } from '@/types/GridOptions';

/** sparkline·sparklineBar는 값이 없으면 아무것도 그리지 않고, 그래도 그리드는 계속 동작해야 한다. */
describe('sparkline 값이 없을 때', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  let rectSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn(),
      closePath: jest.fn(),
      arc: jest.fn(),
      setTransform: jest.fn(),
      scale: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      createLinearGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });

  beforeEach(() => {
    // jsdom은 레이아웃이 없어 셀 크기가 0이므로, 크기가 있는 것처럼 흉내 낸다.
    rectSpy = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 120,
      height: 30,
      top: 0,
      left: 0,
      bottom: 30,
      right: 120,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    } as DOMRect);
  });

  afterEach(() => {
    rectSpy.mockRestore();
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const chartRenderer = (type: string, withRefValue: boolean) => ({
    type,
    ...(withRefValue ? { refValue: (_field: unknown, value: unknown) => ({ value }) } : {}),
  });

  const create = (type: 'sparkline' | 'sparklineBar', withRefValue: boolean, trends: unknown[]) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 500,
      height: 300,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 60 },
        { name: 'name', width: 100 },
        { name: 'trend', width: 160, renderer: chartRenderer(type, withRefValue) },
      ],
      items: trends.map((trend, index) => ({ id: index + 1, name: `n${index + 1}`, trend })),
    } as unknown as GridOptions);
    grids.push(grid);

    const rows = Array.from(element.querySelectorAll('.dg-region[data-region="center"] .dg-row'));
    const cell = (row: number, name: string) => rows[row].querySelectorAll('.dg-cell')[['id', 'name', 'trend'].indexOf(name)] as HTMLElement;
    return { grid, element, rows, cell };
  };

  describe.each(['sparkline', 'sparklineBar'] as const)('%s', (type) => {
    it('refValue 설정이 없어도 오류 없이 그리드를 만들고, 차트는 그리지 않는다', () => {
      let created: ReturnType<typeof create> | undefined;
      expect(() => {
        created = create(type, false, [[1, 2, 3], [4, 5, 6]]);
      }).not.toThrow();

      const { rows, cell } = created!;
      expect(rows).toHaveLength(2);
      // 다른 열은 정상적으로 그려진다.
      expect(cell(0, 'name').textContent).toBe('n1');
      expect(cell(1, 'name').textContent).toBe('n2');
      expect(rows.some((row) => row.querySelector('canvas'))).toBe(false);
    });

    it('값이 없는 행(undefined·null·빈 배열·배열이 아님)은 비워 두고, 값이 있는 행은 그린다', () => {
      const { rows, cell } = create(type, true, [[1, 2, 3], undefined, null, [], 'text', [4, 5, 6]]);

      expect(rows).toHaveLength(6);
      const hasChart = rows.map((row) => !!row.querySelector('canvas'));
      expect(hasChart).toEqual([true, false, false, false, false, true]);
      // 값이 없는 행의 다른 열도 그대로 표시된다.
      expect(cell(1, 'name').textContent).toBe('n2');
      expect(cell(4, 'name').textContent).toBe('n5');
    });

    it('refValue가 아무것도 돌려주지 않아도 오류 없이 비워 둔다', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      const grid = DaraGrid.create(element, {
        width: 500,
        height: 300,
        fields: [{ name: 'trend', width: 160, renderer: { type, refValue: () => undefined } }],
        items: [{ trend: [1, 2, 3] }, { trend: [4, 5] }],
      } as unknown as GridOptions);
      grids.push(grid);

      expect(element.querySelector('canvas')).toBeNull();
      expect(element.querySelectorAll('.dg-region[data-region="center"] .dg-row')).toHaveLength(2);
    });

    it('셀이 다른 값으로 다시 그려질 때 값이 없어지면 이전 차트를 지우고, 다시 값이 생기면 그린다', () => {
      const { grid, cell } = create(type, true, [[1, 2, 3], [4, 5, 6]]);
      const main = (grid as unknown as { gridMain: any }).gridMain;
      const dm = main.config().dataManager;
      const trendCol = cell(0, 'trend');
      expect(trendCol.querySelector('canvas')).not.toBeNull();

      // 값을 비운 뒤 다시 그린다.
      dm.getRowItem(1).trend = [];
      main.getBody().dataDraw('test-empty');
      expect(cell(0, 'trend').querySelector('canvas')).toBeNull();
      expect(cell(1, 'trend').querySelector('canvas')).not.toBeNull();

      // 값이 다시 생기면 차트를 그린다.
      dm.getRowItem(1).trend = [7, 8, 9];
      main.getBody().dataDraw('test-refill');
      expect(cell(0, 'trend').querySelector('canvas')).not.toBeNull();
    });

    it('값이 없는 셀에 마우스를 올려도 툴팁이 나타나지 않는다', () => {
      const { cell } = create(type, true, [[]]);

      cell(0, 'trend').dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 }));

      expect(document.body.querySelectorAll('div[style*="position: fixed"]')).toHaveLength(0);
    });
  });
});
