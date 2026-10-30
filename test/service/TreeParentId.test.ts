import type { GridOptions } from '@/types/GridOptions';

/** 트리에서 형제 노드를 추가할 때 부모 값(ID)을 어떻게 해석하는지 확인한다. */
describe('트리 형제 노드 추가: 부모 ID 해석', () => {
  let DaraGrid: typeof import('@/DaraGrid').DaraGrid;
  let grids: InstanceType<typeof DaraGrid>[] = [];

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
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });

  const create = (rootId: number | string, flat = false) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const items = flat
      ? [
          { id: rootId, pid: null, name: 'root' },
          { id: 100, pid: rootId, name: 'child' },
        ]
      : [{ id: rootId, name: 'root', children: [{ id: 100, name: 'child' }] }];
    const grid = DaraGrid.create(element, {
      width: 500,
      height: 300,
      rowIdField: 'id',
      tree: flat
        ? { idField: 'id', parentIdField: 'pid', isFlatData: true, expandDepth: 5 }
        : { idField: 'id', childrenField: 'children', expandDepth: 5 },
      fields: [{ name: 'id', renderer: { type: 'tree' } }, { name: 'name' }],
      items,
    } as unknown as GridOptions);
    grids.push(grid);

    const dm = (grid as unknown as { gridMain: any }).gridMain.config().dataManager;
    const topLevel = () => dm.originalTreeItems.map((node: { id: unknown }) => node.id);
    const nodes = () => dm.getViewItems().map((viewItem: { id: unknown; pid: unknown; depth: number }) => ({
      id: viewItem.id,
      pid: viewItem.pid,
      depth: viewItem.depth,
    }));

    return { grid, topLevel, nodes };
  };

  it.each([
    ['after', 'ID가 0인 부모의 자식 뒤에 추가해도 같은 부모의 자식이 된다'],
    ['before', 'ID가 0인 부모의 자식 앞에 추가해도 같은 부모의 자식이 된다'],
  ])('%s: %s', (position) => {
    const { grid, topLevel, nodes } = create(0);

    grid.addItems([{ id: 200, name: 'sibling' }], { rowId: 100, position } as never);

    expect(topLevel()).toEqual([0]);
    const added = nodes().find((node: { id: unknown }) => node.id === 200);
    expect(added).toEqual({ id: 200, pid: 0, depth: 1 });
  });

  it('문자열 "0" 부모도 실제 ID로 취급한다', () => {
    const { grid, topLevel, nodes } = create('0');

    grid.addItems([{ id: 200, name: 'sibling' }], { rowId: 100, position: 'after' });

    expect(topLevel()).toEqual(['0']);
    expect(nodes().find((node: { id: unknown }) => node.id === 200)).toEqual({ id: 200, pid: '0', depth: 1 });
  });

  it('부모 ID가 0인 flat 데이터도 같다', () => {
    const { grid, topLevel, nodes } = create(0, true);

    grid.addItems([{ id: 200, pid: 0, name: 'sibling' }], { rowId: 100, position: 'after' });

    expect(topLevel()).toEqual([0]);
    expect(nodes().find((node: { id: unknown }) => node.id === 200)?.pid).toBe(0);
  });

  it('최상위 노드 옆에 추가하면 최상위로 들어간다', () => {
    const { grid, topLevel, nodes } = create(1);

    grid.addItems([{ id: 300, name: 'root sibling' }], { rowId: 1, position: 'after' });

    expect(topLevel()).toEqual([1, 300]);
    expect(nodes().find((node: { id: unknown }) => node.id === 300)).toEqual({ id: 300, pid: 'dg$root', depth: 0 });
  });

  it('최상위가 ID 0인 노드여도 그 옆에 추가하면 최상위로 들어간다', () => {
    const { grid, topLevel } = create(0);

    grid.addItems([{ id: 300, name: 'root sibling' }], { rowId: 0, position: 'after' });

    expect(topLevel()).toEqual([0, 300]);
  });
});
