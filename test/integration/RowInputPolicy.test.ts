import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

describe('문제 행 제외 입력 정책', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  const grids: InstanceType<typeof DaraGrid>[] = [];
  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue({ font: '', measureText: () => ({ width: 20 }) }) as any;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });
  afterEach(() => {
    grids.splice(0).forEach((grid) => grid.destroy());
    document.body.innerHTML = '';
  });
  const create = (kind = 'list', items: any[] = [{ id: 'old', name: 'old' }]) => {
    const host = document.createElement('div');
    document.body.append(host);
    const grid = DaraGrid.create(host, {
      width: 600,
      height: 300,
      rowIdField: 'id',
      deleteMode: 'hard',
      fields: [{ name: 'name' }],
      items,
      ...(kind === 'group' ? { groupingFields: ['name'] } : {}),
      ...(kind === 'tree' || kind === 'flat'
        ? {
            tree: {
              idField: 'id',
              parentIdField: 'pid',
              childrenField: 'children',
              isFlatData: kind === 'flat',
              expandDepth: 10,
            },
          }
        : {}),
    } as unknown as GridOptions);
    grids.push(grid);
    const manager = (grid as unknown as { gridMain: GridMain }).gridMain.config().dataManager;
    return { grid, manager };
  };

  it.each(['list', 'group', 'tree', 'flat'])(
    '%s: null·잘못된 행과 뒤 중복만 제외하고 ID 누락·혼합 ID는 유지한다',
    (kind) => {
      const { grid } = create(kind);
      const shared = { name: 'shared' };
      grid.setItems([
        null,
        3,
        [],
        undefined,
        { id: 0, name: 'zero' },
        { id: '0', name: 'string' },
        { id: 'a', name: 'first' },
        { id: 'a', name: 'duplicate' },
        shared,
        shared,
        { name: 'missing' },
      ]);
      expect(grid.getAllItems().map((row) => row.name)).toEqual(['zero', 'string', 'first', 'shared', 'missing']);
      expect(grid.getItemById('old')).toBeUndefined();
      expect(grid.getItemById('a').name).toBe('first');
    },
  );

  it.each(['list', 'group', 'tree', 'flat'])('%s: 추가 충돌은 기존 행·체크·이력을 보존한다', (kind) => {
    const { grid, manager } = create(kind);
    manager.setItemChecked('old', true);
    grid.addItems([{ id: 'old', name: 'overwrite' }, null]);
    expect(manager.getUndoHistoryCount()).toBe(0);
    expect(grid.getItemById('old').name).toBe('old');
    expect(manager.isItemChecked('old')).toBe(true);
    grid.createItem({ id: 'new', name: 'new' });
    manager.undo();
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old']);
    manager.redo();
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old', 'new']);
  });

  it('flat 트리에서 순환 구성원만 제외하고 정상 자손과 고아를 루트로 보존한다', () => {
    const { grid } = create('flat');
    grid.setItems([
      { id: 'a', pid: 'b' },
      { id: 'b', pid: 'a' },
      { id: 'c', pid: 'a' },
      { id: 'd', pid: 'c' },
      { id: 'self', pid: 'self' },
      { id: 'orphan', pid: 'missing' },
    ]);
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['c', 'd', 'orphan']);
    expect(grid.getItems().map((row) => row.id)).toEqual(['c', 'd', 'orphan']);
  });

  it('중첩 순환과 중복 부모를 제외하되 정상 자손은 보존한다', () => {
    const { grid, manager } = create('tree');
    const a: any = { id: 'a', children: [] };
    const b: any = { id: 'b', children: [a, { id: 'leaf' }] };
    const c: any = { id: 'c', children: [b] };
    a.children = [b, c];
    grid.addItems([a, { id: 'old', children: [{ id: 'new' }] }]);
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old', 'leaf', 'new']);
    manager.undo();
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old']);
    manager.redo();
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old', 'leaf', 'new']);
  });

  it.each(['list', 'tree'])('%s: 전부 제외되는 교체는 빈 데이터로 정상 완료한다', (kind) => {
    const { grid } = create(kind);
    grid.setItems([null, undefined, false, []]);
    expect(grid.getAllItems()).toEqual([]);
    expect(grid.getItemById('old')).toBeUndefined();
  });

  it.each(['list', 'tree'])('%s: 배열 자체가 잘못되면 변경 전에 거부한다', (kind) => {
    const { grid } = create(kind);
    expect(() => grid.setItems(null as any)).toThrow('items must be an array');
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['old']);
  });

  it('최초 생성의 순환 입력에도 같은 정책을 적용한다', () => {
    const cyclic: any = { id: 'cycle', children: [] };
    cyclic.children = [cyclic, { id: 'leaf' }];
    const { grid } = create('tree', [cyclic, null, { id: 'valid' }]);
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['leaf', 'valid']);
  });

  it('중복만 추가하면 접힌 부모를 펼치거나 이력을 만들지 않는다', () => {
    const { grid, manager } = create('tree');
    grid.collapseAll();
    const expanded = (manager.getViewItems()[0] as any).expanded;
    grid.addItems([{ id: 'old' }], { rowId: 'old', position: 'inside' });
    expect(manager.getUndoHistoryCount()).toBe(0);
    expect((manager.getViewItems()[0] as any).isLeaf).toBe(true);
    expect((manager.getViewItems()[0] as any).expanded).toBe(expanded);
  });

  it('잘못된 children 값은 빈 자손으로 처리하고 정상 부모를 보존한다', () => {
    const { grid } = create('tree');
    grid.setItems([
      { id: 'a', children: 'invalid' },
      { id: 'b', children: {} },
    ]);
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['a', 'b']);
  });
});
