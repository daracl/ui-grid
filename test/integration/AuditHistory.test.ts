import { GridOptions } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';

describe('감사: 행 교체와 이력 분기', () => {
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

  const create = (tree = false) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const grid = DaraGrid.create(host, {
      width: 600,
      height: 300,
      rowIdField: 'id',
      deleteMode: 'hard',
      fields: [{ name: 'name', width: 200 }],
      items: [
        { id: 'p', name: 'parent' },
        { id: 'q', name: 'other' },
      ],
      ...(tree ? { tree: { idField: 'id', childrenField: 'children', expandDepth: 10 } } : {}),
    } as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: GridMain }).gridMain;
    return {
      grid,
      manager: main.config().dataManager,
      field: main.config().currentFields.find((field) => field.name === 'name')!,
    };
  };

  it('트리 setItems 후 이전 행 ID를 조회할 수 없다', () => {
    const { grid } = create(true);
    grid.setItems([{ id: 'new', name: 'new' }]);
    expect(grid.getItemById('p')).toBeUndefined();
    expect(grid.getAllItems().map((row) => row.id)).toEqual(['new']);
  });

  it('트리 자식과 손자 추가를 한 번에 Undo/Redo하고 부모 관계를 복원한다', () => {
    const { grid, manager } = create(true);
    grid.createItem(
      { id: 'c', name: 'child', children: [{ id: 'leaf', name: 'leaf' }] },
      { rowId: 'p', position: 'inside' },
    );
    expect(manager.getUndoHistoryCount()).toBe(1);
    for (let i = 0; i < 2; i++) {
      expect(manager.undo()).toBe(true);
      expect(grid.getAllItems().map((row) => row.id)).toEqual(['p', 'q']);
      expect(grid.getItemById('leaf')).toBeUndefined();
      expect(manager.redo()).toBe(true);
      expect(manager.getRowSnapshots(['c', 'leaf']).every((row) => row.localOnly)).toBe(true);
      grid.expandAll();
      expect(grid.getItems().map((row) => row.id)).toEqual(['p', 'c', 'leaf', 'q']);
    }
  });

  it('진행 중인 새 변경이 있으면 이전 분기의 Redo를 적용하지 않는다', () => {
    const { grid, manager, field } = create();
    manager.setChangeValue(grid.getItemById('p'), field, 'first');
    manager.undo();
    manager.beginHistory();
    manager.setChangeValue(grid.getItemById('p'), field, 'second');
    expect(manager.redo()).toBe(false);
    manager.commitHistory();
    expect(grid.getItemById('p').name).toBe('second');
    manager.undo();
    expect(grid.getItemById('p').name).toBe('parent');
  });

  it('추가한 체크 행을 Undo하면 체크 집합에 유령 ID가 남지 않는다', () => {
    const { grid, manager } = create();
    grid.createItem({ id: 'new', name: 'new' });
    manager.setItemChecked('new', true);
    manager.undo();
    expect(manager.getCheckedCount()).toBe(0);
  });

  it.each([false, true])('신규 행 hard 삭제를 Undo하면 서버 미저장 상태를 복원한다 (트리: %s)', (tree) => {
    const { grid, manager } = create(tree);
    grid.createItem({ id: 'new', name: 'new' });
    grid.removeItems(['new']);
    manager.undo();
    expect(manager.getRowSnapshots(['new'])[0].localOnly).toBe(true);
  });
});
