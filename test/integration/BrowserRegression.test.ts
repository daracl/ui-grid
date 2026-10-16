describe('Browser audit regressions', () => {
  let DaraGrid: any;
  let grids: any[] = [];
  beforeAll(() => {
    Object.defineProperty(globalThis, 'APP_VERSION', { configurable: true, value: 'test' });
    Object.defineProperty(globalThis, 'PointerEvent', { configurable: true, value: class extends MouseEvent {} });
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }) as any;
    DaraGrid = require('@/DaraGrid').DaraGrid;
  });
  afterEach(() => {
    grids.forEach((grid) => grid.destroy());
    grids = [];
    document.body.innerHTML = '';
  });
  const create = (extra: any = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 240,
      rowIdField: 'id',
      fields: [
        { name: 'category', width: 160 },
        { name: 'amount', width: 100 },
      ],
      items: [
        { id: 'a', category: 'A', amount: 5 },
        { id: 'b', category: 'B', amount: 7 },
      ],
      ...extra,
    });
    grids.push(grid);
    const main = grid.gridMain;
    return { grid, main, manager: main.config().dataManager, element };
  };
  it.each([false, true])('supports a new addition after undo (grouped: %s)', (grouped) => {
    const { grid, manager } = create(grouped ? { groupingFields: ['category'], sumFields: ['amount'] } : {});
    grid.createItem({ id: 'c', category: 'C', amount: 3 });
    manager.undo();
    grid.createItem({ id: 'd', category: 'D', amount: 4 });
    expect(grid.getItems().map((item: any) => item.id)).toEqual(['a', 'b', 'd']);
    expect(manager.redo()).toBe(false);
  });
  it.each([false, true])('restores a sorted added row on redo (grouped: %s)', (grouped) => {
    const { grid, main, manager } = create(grouped ? { groupingFields: ['category'], sumFields: ['amount'] } : {});
    const field = main.config().currentFields.find((field: any) => field.name === 'amount');
    manager.dataSort(
      [{ name: 'amount', field, sortCell: field.$colSeq, ascOrder: true }],
      grid.getOptions().header.sort,
    );
    grid.createItem({ id: 'c', category: 'C', amount: 3 });
    manager.undo();
    manager.redo();
    expect(grid.getItems().map((item: any) => item.id)).toEqual(['c', 'a', 'b']);
  });
  it('clears both check data and header when replacing items', () => {
    const { grid, main, manager, element } = create({ aside: { rowCheckbox: { enabled: true } } });
    main.getBody().setItemsChecked(['a', 'b'], true);
    grid.setItems([{ id: 'new', category: 'New', amount: 1 }]);
    expect(manager.getCheckedCount()).toBe(0);
    expect(element.querySelector('.dg-checkbox.dg-all')!.classList.contains('dg-selected')).toBe(false);
  });
  it.each([false, true])('keeps header selection consistent (grouped: %s)', (grouped) => {
    const { main, element } = create({
      aside: { rowCheckbox: { enabled: true } },
      ...(grouped ? { groupingFields: ['category'], sumFields: ['amount'] } : {}),
    });
    const header = element.querySelector('.dg-checkbox.dg-all')!;
    main.getBody().setItemsChecked(['a', 'b'], true);
    expect(header.classList.contains('dg-selected')).toBe(true);
    expect(header.classList.contains('dg-indeterminate')).toBe(false);
    main.getBody().addItemChecked('a', false);
    main.getBody().addItemChecked('b', false);
    expect(header.classList.contains('dg-selected')).toBe(false);
    expect(header.classList.contains('dg-indeterminate')).toBe(false);
  });
  it.each([0, false])('preserves a nonblank value %s with a default configured', (value) => {
    const { element } = create({
      fields: [{ name: 'amount', width: 100, defaultValue: 100 }],
      items: [{ id: 'a', amount: value }],
    });
    expect(element.querySelector('.dg-region[data-region="center"] .dg-cell-renderer')!.textContent).toBe(
      String(value),
    );
  });
  it('cancels queued draws and destroys the toolbar on grid destruction', () => {
    const callbacks = new Map<number, FrameRequestCallback>();
    let sequence = 0;
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callbacks.set(++sequence, callback);
      return sequence;
    });
    const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      callbacks.delete(id);
    });
    try {
      const { grid, main } = create({
        height: 150,
        items: Array.from({ length: 100 }, (_, i) => ({ id: String(i), category: String(i), amount: i })),
      });
      callbacks.clear();
      const toolbarDestroy = jest.spyOn(main.getToolbar(), 'destroy');
      main.getScroll().moveVerticalScroll({ rowIdx: 10 });
      expect(callbacks.size).toBeGreaterThan(0);
      grid.destroy();
      grids = [];
      expect(toolbarDestroy).toHaveBeenCalledTimes(1);
      expect(callbacks.size).toBe(0);
    } finally {
      raf.mockRestore();
      cancel.mockRestore();
    }
  });
});
