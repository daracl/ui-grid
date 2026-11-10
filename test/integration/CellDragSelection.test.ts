import { PointerStateMap } from '@/constants';
import type { GridOptions } from '@/types/GridOptions';

/** 셀 드래그 선택 시 빈 영역/바깥 영역 이동 테스트 */
describe('셀 드래그 선택', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];
  let handlers: any[] = [];

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
    handlers.forEach((handler) => handler.stopAutoScroll?.());
    handlers = [];
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const rows = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `n${i + 1}`, qty: i + 1 }));

  const create = (count = 4) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      selectionMode: 'multiCell',
      aside: { rowCheckbox: { enabled: true, checkOnRowSelect: true } },
      fields: [
        { name: 'id', width: 80 },
        { name: 'name', width: 120 },
        { name: 'qty', width: 100 },
      ],
      items: rows(count),
    } as unknown as GridOptions);
    grids.push(grid);

    const main = (grid as unknown as { gridMain: any }).gridMain;
    const cfg = main.config();
    const dm = cfg.dataManager;
    const col = (name: string) => cfg.currentFields.findIndex((field: { name: string }) => field.name === name);
    const cell = (row: number, name: string) =>
      element.querySelector(`[data-cell-position="${row},${col(name)}"]`) as HTMLElement;

    const handler = main
      .getBody()
      .bodyEvent.handlers.find(
        (candidate: { constructor: { name: string } }) => candidate.constructor.name === 'CellClickHandler',
      );
    handlers.push(handler);

    const rowHeight = cfg.rowHeight as number;
    // 컬럼 중앙 x 좌표(body 왼쪽 기준)
    const colX = (name: string) => {
      let x = 0;
      for (let i = 0; i < col(name); i++) x += cfg.currentFields[i].width ?? 0;
      return x + 5;
    };

    /** (row, name) 셀에서 드래그를 시작한다. */
    const startDrag = (row: number, name: string) => {
      cell(row, name).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      const viewItem = dm.getViewItems()[row];
      const session = {
        state: PointerStateMap.DRAGGING,
        event: new MouseEvent('pointerdown'),
        startPos: { x: colX(name), y: rowHeight * row + 2 },
        currentPos: { x: colX(name), y: rowHeight * row + 2 },
        cellInfo: { rowIndex: row, item: dm.getRowItem(viewItem.id), viewItem, field: cfg.currentFields[col(name)] },
        cellEl: cell(row, name),
        clickManager: { getClickCount: () => 1 },
      } as any;
      handler.onPointerDown(session);
      handler.onActivate(session);

      const moveTo = (x: number, y: number) => {
        session.currentPos = { x, y };
        handler.onPointerMove(session);
      };
      return { session, moveTo };
    };

    const range = () => {
      const r = cfg.selection.range;
      return { startIdx: r.startIdx, endIdx: r.endIdx, startCol: r.startCol, endCol: r.endCol };
    };
    const checkedIds = () =>
      grid
        .getCheckedItems()
        .map((item) => item.id as number)
        .sort((a: number, b: number) => a - b);

    return { grid, cfg, col, rowHeight, colX, startDrag, range, checkedIds };
  };

  it('마지막 행 아래 빈 영역으로 드래그해도 선택이 마지막 행까지 유지된다', () => {
    const t = create(4);
    const { moveTo } = t.startDrag(0, 'name');

    // 마지막 행(3)까지 드래그
    moveTo(t.colX('name'), t.rowHeight * 3 + 2);
    const lastRowRange = t.range();
    expect(lastRowRange).toMatchObject({ startIdx: 0, endIdx: 3 });
    expect(lastRowRange.endCol).toBeGreaterThan(-1);

    // 데이터 행 아래 빈 영역(body 안쪽): 행·열 모두 유지
    moveTo(t.colX('name'), t.rowHeight * 8 + 2);
    expect(t.range()).toEqual(lastRowRange);
    expect(t.checkedIds()).toEqual([1, 2, 3, 4]);

    // 빈 영역에서 옆 컬럼으로 이동해도 행은 유지되고 열만 바뀐다
    moveTo(t.colX('qty'), t.rowHeight * 8 + 2);
    expect(t.range()).toMatchObject({ startIdx: 0, endIdx: 3 });
    expect(t.range().endCol).toBeGreaterThan(lastRowRange.endCol);
  });

  it('중간 행에서 빈 영역으로 드래그하면 마지막 행까지 확장된다', () => {
    const t = create(4);
    const { moveTo } = t.startDrag(1, 'name');
    moveTo(t.colX('name'), t.rowHeight * 10 + 2);
    expect(t.range()).toMatchObject({ startIdx: 1, endIdx: 3 });
    expect(t.checkedIds()).toEqual([2, 3, 4]);
  });

  it('위쪽 바깥으로 드래그하면 첫 행까지 선택된다', () => {
    const t = create(4);
    const { moveTo } = t.startDrag(2, 'name');
    moveTo(t.colX('name'), -10);
    expect(t.range()).toMatchObject({ startIdx: 2, endIdx: 0 });
  });

  it('스크롤할 행이 없을 때 아래쪽 바깥으로 드래그하면 마지막 행까지 선택된다', () => {
    const t = create(4);
    const { moveTo } = t.startDrag(0, 'name');
    moveTo(t.colX('name'), t.cfg.dimensions.mainBodyHeight + 30);
    expect(t.range()).toMatchObject({ startIdx: 0, endIdx: 3 });
  });

  it('데이터가 충분하면 행 위 드래그는 해당 행까지 선택한다', () => {
    const t = create(50);
    const { moveTo } = t.startDrag(0, 'name');
    moveTo(t.colX('name'), t.rowHeight * 5 + 2);
    expect(t.range()).toMatchObject({ startIdx: 0, endIdx: 5 });
  });
});
