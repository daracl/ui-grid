import { ItemStatusMap, ROW_FIELD } from '@/constants';
import { CustomSortingCallback, GridOptions } from '@/types/GridOptions';
import { SearchMode } from '@/types/Common';
import { GridMain } from '@/view/GridMain';

describe('데이터 변경과 공개 조회·정렬 계약', () => {
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

  const create = (extra: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'category', width: 160 },
        { name: 'amount', width: 100 },
      ],
      items: [
        { id: 'a', category: 'A', amount: 5 },
        { id: 'b', category: 'A', amount: 3 },
        { id: 'c', category: 'B', amount: 2 },
      ],
      ...extra,
    } as unknown as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: GridMain }).gridMain;
    return { grid, main, manager: main.config().dataManager, element };
  };

  const grouping = { groupingFields: ['category'], groupSummaryFields: [{ field: 'amount', expression: 'sum' }] };
  const tree = {
    tree: { idField: 'id', childrenField: 'children' },
    items: [
      { id: 'p', category: 'A', children: [{ id: 'child', category: 'A', children: [{ id: 'leaf', category: 'B' }] }] },
      { id: 'q', category: 'C' },
    ],
  };
  // 트리 입력은 라이브러리가 children을 정규화하므로 테스트마다 새로 만든다.
  const treeOptions = () => JSON.parse(JSON.stringify(tree));

  it('트리 soft 삭제는 자손을 보존하며 한 번의 Undo/Redo로 상태를 복원한다', () => {
    const { grid, manager } = create({ ...treeOptions(), deleteMode: 'soft' });
    grid.removeItems(['p', 'child', 'p']);
    expect(grid.getAllItems().map((item) => item.id)).toEqual(['p', 'child', 'leaf', 'q']);
    expect(grid.getChangedItems().map((item) => item.id)).toEqual(['p', 'child', 'leaf']);
    expect(manager.getUndoHistoryCount()).toBe(1);
    expect(manager.undo()).toBe(true);
    expect(grid.getChangedItems()).toEqual([]);
    expect(manager.redo()).toBe(true);
    expect(grid.getItemById('leaf')[ROW_FIELD.CUD]).toBe(ItemStatusMap.DELETE);
  });

  it.each([false, true])('잘못된 soft 삭제는 데이터와 기존 이력을 보존한다 (트리: %s)', (isTree) => {
    const { grid, manager, main } = create({ ...(isTree ? treeOptions() : {}), deleteMode: 'soft' });
    const id = isTree ? 'p' : 'a';
    const field = main.config().currentFields.find((field) => field.name === 'category')!;
    manager.setChangeValue(grid.getItemById(id), field, 'changed');
    expect(() => grid.removeItems([id, 'missing'])).toThrow('Row not found');
    expect(grid.getItemById(id)[ROW_FIELD.CUD]).toBe(ItemStatusMap.MODIFY);
    expect(manager.getUndoHistoryCount()).toBe(1);
    manager.undo();
    expect(grid.getItemById(id).category).toBe('A');
  });

  it.each([false, true])('hard 삭제의 순서·체크·합계를 Undo/Redo로 복원한다 (그룹: %s)', (grouped) => {
    const { grid, manager } = create(grouped ? grouping : {});
    manager.setItemChecked('b', true);
    grid.removeItems(['b', 'c']);
    expect(grid.getItems().map((item) => item.id)).toEqual(['a']);
    expect(manager.getUndoHistoryCount()).toBe(1);
    expect(manager.getCheckedCount()).toBe(0);
    for (let i = 0; i < 2; i++) {
      expect(manager.undo()).toBe(true);
      expect(grid.getItems().map((item) => item.id)).toEqual(['a', 'b', 'c']);
      expect(manager.isItemChecked('b')).toBe(true);
      if (grouped)
        expect(manager.getViewItems().find((item) => item.groupRowType === 'grandSummary')?.groupSums?.amount).toBe(10);
      expect(manager.redo()).toBe(true);
      expect(grid.getAllItems().map((item) => item.id)).toEqual(['a']);
      expect(manager.getCheckedCount()).toBe(0);
    }
  });

  it('트리 hard 삭제를 반복 복원해도 접힘 상태와 자손 구조를 유지한다', () => {
    const { grid, manager } = create(treeOptions());
    manager.setItemChecked('leaf', true);
    grid.removeItems(['p', 'child']);
    expect(grid.getAllItems().map((item) => item.id)).toEqual(['q']);
    expect(manager.getUndoHistoryCount()).toBe(1);
    for (let i = 0; i < 2; i++) {
      manager.undo();
      expect(grid.getItems().map((item) => item.id)).toEqual(['p', 'q']);
      expect(grid.getAllItems().map((item) => item.id)).toEqual(['p', 'child', 'leaf', 'q']);
      expect(manager.isItemChecked('leaf')).toBe(true);
      grid.expandAll();
      expect(grid.getItems().map((item) => item.id)).toEqual(['p', 'child', 'leaf', 'q']);
      manager.redo();
      expect(grid.getAllItems().map((item) => item.id)).toEqual(['q']);
    }
  });

  it.each([false, true])('변경·Undo/Redo 후에도 검색 필터와 정렬을 유지한다 (그룹: %s)', (grouped) => {
    const { grid, manager, main } = create(grouped ? grouping : {});
    grid.search('A', { searchFields: ['category'], hideNonMatched: true } as SearchMode);
    const field = main.config().currentFields.find((field) => field.name === 'amount')!;
    manager.dataSort(
      [{ name: 'amount', field, ascOrder: true, sortCell: field.$colSeq }],
      grid.getOptions().header.sort,
    );
    grid.addItems([
      { id: 'hidden', category: 'C', amount: 0 },
      { id: 'new', category: 'A', amount: 1 },
    ]);
    expect(grid.getItems().map((item) => item.id)).toEqual(['new', 'b', 'a']);
    grid.removeItems(['b']);
    expect(grid.getItems().map((item) => item.id)).toEqual(['new', 'a']);
    expect(main.config().searchMatchInfo.matchCount).toBe(2);
    manager.undo();
    expect(grid.getItems().map((item) => item.id)).toEqual(['new', 'b', 'a']);
    manager.redo();
    expect(grid.getItems().map((item) => item.id)).toEqual(['new', 'a']);
  });

  it('같은 검색어의 숨김 옵션 변경을 재검색에 반영한다', () => {
    const { grid } = create();
    grid.search('A', { searchFields: ['category'], hideNonMatched: false } as SearchMode);
    expect(grid.getItems()).toHaveLength(3);
    grid.search('A', { searchFields: ['category'], hideNonMatched: true } as SearchMode);
    expect(grid.getItems().map((item) => item.id)).toEqual(['a', 'b']);
    grid.search('A', { searchFields: ['category'], hideNonMatched: false } as SearchMode);
    expect(grid.getItems()).toHaveLength(3);
  });

  it.each([false, true])('페이징 개수·필터·정렬과 전체 조회를 함께 유지한다 (그룹: %s)', (grouped) => {
    const { grid, manager, main } = create({
      ...(grouped ? grouping : {}),
      footer: { enabled: true, paging: { enabled: true } },
      paging: { page: 1, pageSize: 1 },
    });
    const field = main.config().currentFields.find((field) => field.name === 'amount')!;
    grid.search('A', { searchFields: ['category'], hideNonMatched: true } as SearchMode);
    manager.dataSort(
      [{ name: 'amount', field, ascOrder: true, sortCell: field.$colSeq }],
      grid.getOptions().header.sort,
    );
    grid.addItems([{ id: 'new', category: 'A', amount: 1 }]);
    expect(main.config().paging.totalCount).toBe(3);
    expect(grid.getItems().map((item) => item.id)).toEqual(['new']);
    main.getFooter().goPage(2);
    expect(grid.getItems().map((item) => item.id)).toEqual(['b']);
    expect(grid.getAllItems().map((item) => item.id)).toEqual(['a', 'b', 'c', 'new']);
    grid.removeItems(['b']);
    expect(main.config().paging.totalCount).toBe(2);
    manager.undo();
    expect(main.config().paging.totalCount).toBe(3);
    expect(grid.getAllItems().map((item) => item.id)).toEqual(['a', 'b', 'c', 'new']);
  });

  it('비어 있는 페이지에 추가해도 설정한 페이지 크기를 유지한다', () => {
    const { grid, main } = create({ footer: { enabled: true, paging: { enabled: true } }, paging: { pageSize: 10 } });
    grid.removeItems(['a', 'b', 'c']);
    expect(main.config().paging.totalCount).toBe(0);
    grid.addItems([{ id: 'new', amount: 1 }]);
    expect(main.config().paging.pageSize).toBe(10);
    expect(main.config().paging.totalCount).toBe(1);
    expect(grid.getItems()).toHaveLength(1);
  });

  it.each([false, true])('외부 이력 묶음 안의 여러 삭제도 원래 순서로 복원한다 (트리: %s)', (isTree) => {
    const { grid, manager } = create(isTree ? treeOptions() : {});
    manager.beginHistory();
    grid.removeItems([isTree ? 'child' : 'b']);
    grid.removeItems([isTree ? 'p' : 'a']);
    manager.commitHistory();
    expect(manager.getUndoHistoryCount()).toBe(1);
    manager.undo();
    expect(grid.getAllItems().map((item) => item.id)).toEqual(isTree ? ['p', 'child', 'leaf', 'q'] : ['a', 'b', 'c']);
    manager.redo();
    expect(grid.getAllItems().map((item) => item.id)).toEqual(isTree ? ['q'] : ['c']);
  });

  it('페이지를 여러 번 이동한 뒤 추가해도 현재 페이지를 유지한다', () => {
    const { grid, main } = create({ footer: { enabled: true, paging: { enabled: true } }, paging: { pageSize: 1 } });
    main.getFooter().goPage(2);
    main.getFooter().goPage(3);
    grid.addItems([{ id: 'd' }]);
    expect(main.config().paging.page).toBe(3);
    expect(grid.getItems().map((item) => item.id)).toEqual(['c']);
  });

  it('외부 페이징은 전체 개수와 로드한 현재 페이지를 보존한다', () => {
    const { grid, main } = create({
      footer: { enabled: true, paging: { enabled: true, callback: jest.fn() } },
      paging: { page: 2, pageSize: 3, totalCount: 30 },
    });
    expect(grid.getItems()).toHaveLength(3);
    expect(grid.getAllItems()).toHaveLength(3);
    expect(main.config().paging.totalCount).toBe(30);
  });

  it('전체 조회는 접힌 자손을 포함하고 반환 행 수정이 원본에 전달되지 않는다', () => {
    const { grid } = create(treeOptions());
    expect(grid.getItems()).toHaveLength(2);
    const all = grid.getAllItems();
    expect(all).toHaveLength(4);
    expect(Object.keys(all[0]).some((key) => key.startsWith('_dg$'))).toBe(false);
    all[0].category = 'edited';
    expect(grid.getItemById('p').category).toBe('A');
  });

  it.each([false, true])('사용자 정렬은 실제 행과 기존 ViewItem 반환을 지원한다 (기존 반환: %s)', (legacy) => {
    const custom: CustomSortingCallback = (rows) =>
      rows.sort((a, b) => a.amount - b.amount).map((row) => (legacy ? { id: row[ROW_FIELD.ID], sortOrder: 0 } : row));
    const { grid, manager, main } = create({
      rowIdField: 'key',
      items: [
        { key: 0, id: 'unrelated', amount: 5 },
        { key: 1, id: 'other', amount: 1 },
      ],
      header: { sort: { customSorting: custom } },
    });
    const field = main.config().currentFields.find((field) => field.name === 'amount')!;
    manager.dataSort(
      [{ name: 'amount', field, ascOrder: true, sortCell: field.$colSeq }],
      grid.getOptions().header.sort,
    );
    expect(grid.getItems().map((item) => item.key)).toEqual([1, 0]);
  });

  it('사용자 정렬은 트리 형제별로 적용하고 이후 펼침에도 순서를 유지한다', () => {
    const custom: CustomSortingCallback = (rows) => rows.reverse();
    const { grid, manager, main } = create({ ...treeOptions(), header: { sort: { customSorting: custom } } });
    const field = main.config().currentFields.find((field) => field.name === 'category')!;
    manager.dataSort(
      [{ name: 'category', field, ascOrder: true, sortCell: field.$colSeq }],
      grid.getOptions().header.sort,
    );
    grid.expandAll();
    expect(grid.getItems().map((item) => item.id)).toEqual(['q', 'p', 'child', 'leaf']);
  });

  it('사용자 정렬의 ID 누락·중복·미등록 행을 표시 상태 변경 전에 거부한다', () => {
    const custom = jest.fn<ReturnType<CustomSortingCallback>, Parameters<CustomSortingCallback>>();
    const { grid, manager, main } = create({ header: { sort: { customSorting: custom } } });
    const field = main.config().currentFields.find((field) => field.name === 'amount')!;
    for (const result of [[], [{ id: 'a' }, { id: 'a' }, { id: 'c' }], [{ id: 'a' }, { id: 'b' }, { id: 'missing' }]]) {
      custom.mockReturnValue(result);
      expect(() =>
        manager.dataSort(
          [{ name: 'amount', field, ascOrder: true, sortCell: field.$colSeq }],
          grid.getOptions().header.sort,
        ),
      ).toThrow('customSorting');
      expect(grid.getItems().map((item) => item.id)).toEqual(['a', 'b', 'c']);
    }
    expect(() => grid.addItems([{ id: 'd' }])).not.toThrow();
  });
});
