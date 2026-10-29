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
  it.each(['text', 'date', 'time', 'number', 'textarea'])(
    '브라우저 확대 후 열린 %s 편집 레이어의 좌표를 갱신하고 입력값을 보존한다',
    (type) => {
      const observerDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver');
      const disconnect = jest.fn();
      Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        value: class { observe() {} unobserve() {} disconnect = disconnect; },
      });
      const { grid, main, element } = create({
        editable: true,
        fields: [{ name: 'amount', width: 100, editable: true, editRenderer: { type } }],
      });
      const rect = (left: number, top: number, width: number, height: number) =>
        ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) });
      const cell = element.querySelector('.dg-region[data-region="center"] .dg-cell')!;
      const field = main.config().currentFields.find((field: any) => field.name === 'amount');
      let cellRect = rect(120, 60, 100, 28);
      const cellBounds = jest.spyOn(cell, 'getBoundingClientRect').mockImplementation(() => cellRect);
      const layerBounds = jest.spyOn(main.getRendererLayerElement(), 'getBoundingClientRect')
        .mockReturnValue(rect(20, 10, 640, 240));
      const visible = jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(640);
      const callbacks: FrameRequestCallback[] = [];
      const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        callbacks.push(callback);
        return callbacks.length;
      });
      jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
      try {
        window.dispatchEvent(new Event('resize'));
        expect(jest.getTimerCount()).toBe(0);
        expect(callbacks).toHaveLength(0);
        field.$editRenderer.render({ item: { amount: '' }, c: field.$colSeq }, cell);
        const input = main.getRendererLayerElement().querySelector('input, textarea') as HTMLInputElement;
        expect(input.style.left).toBe('100px');
        input.value = type === 'date' ? '2026-10-29' : type === 'time' ? '12:30' : '42';
        const value = input.value;
        cellRect = rect(340, 80, 150, 32);
        window.dispatchEvent(new Event('resize'));
        jest.advanceTimersByTime(100);
        callbacks.splice(0).forEach((callback) => callback(0));
        expect(input.style.left).toBe('320px');
        expect(input.style.top).toBe('70px');
        expect(input.style.width).toBe('150px');
        expect(input.value).toBe(value);
        main.hideLayer();
        cellRect = rect(500, 80, 150, 32);
        main.resize(main.element());
        callbacks.splice(0).forEach((callback) => callback(0));
        expect(input.style.left).toBe('320px');
        grid.destroy();
        expect(disconnect).not.toHaveBeenCalled();
        callbacks.length = 0;
        window.dispatchEvent(new Event('resize'));
        jest.advanceTimersByTime(100);
        expect(callbacks).toHaveLength(0);
      } finally {
        jest.useRealTimers();
        raf.mockRestore();
        visible.mockRestore();
        cellBounds.mockRestore();
        layerBounds.mockRestore();
        if (observerDescriptor) Object.defineProperty(globalThis, 'ResizeObserver', observerDescriptor);
        else Reflect.deleteProperty(globalThis, 'ResizeObserver');
      }
    },
  );
  it('observer와 window 알림을 한 프레임으로 합치고 destroy 시 예약 작업을 취소한다', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver');
    let notify: () => void;
    const disconnect = jest.fn();
    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: class {
        constructor(callback: () => void) { notify = callback; }
        observe() {} unobserve() {} disconnect = disconnect;
      },
    });
    const { grid, main, element } = create({ width: 'auto' });
    const callbacks = new Map<number, FrameRequestCallback>();
    let nextId = 0;
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callbacks.set(++nextId, callback);
      return nextId;
    });
    const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { callbacks.delete(id); });
    const visible = jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(640);
    const size = jest.spyOn(main, 'setSize').mockImplementation(() => {});
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    try {
      const layer = document.createElement('input');
      main.getRendererLayerElement().appendChild(layer);
      const update = jest.fn();
      main.openLayer(layer, update);
      for (let i = 0; i < 20; i++) {
        notify!();
        window.dispatchEvent(new Event('resize'));
      }
      jest.advanceTimersByTime(100);
      expect(callbacks.size).toBe(1);
      const [id, callback] = [...callbacks][0];
      callbacks.delete(id);
      callback(0);
      expect(update).toHaveBeenCalledTimes(2);
      expect(size.mock.calls.length).toBeLessThanOrEqual(1);
      notify!();
      window.dispatchEvent(new Event('resize'));
      expect(callbacks.size).toBe(1);
      expect(jest.getTimerCount()).toBe(1);
      grid.destroy();
      expect(callbacks.size).toBe(0);
      expect(jest.getTimerCount()).toBe(0);
      expect(disconnect).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
      raf.mockRestore(); cancel.mockRestore(); visible.mockRestore(); size.mockRestore();
      if (descriptor) Object.defineProperty(globalThis, 'ResizeObserver', descriptor);
      else Reflect.deleteProperty(globalThis, 'ResizeObserver');
    }
  });
  it.each([false, true])('다중 그리드의 resize 예약과 해제는 서로 독립적이다 (자동 크기: %s)', (autoSize) => {
    const first = create(autoSize ? { width: 'auto' } : {});
    const second = create(autoSize ? { width: 'auto' } : {});
    const callbacks = new Map<number, FrameRequestCallback>();
    let nextId = 0;
    const raf = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callbacks.set(++nextId, callback);
      return nextId;
    });
    const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { callbacks.delete(id); });
    const visibility = [first, second].map(({ element }) =>
      jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(640));
    const sizing = [first, second].map(({ main }) => jest.spyOn(main, 'setSize').mockImplementation(() => {}));
    const updates = [jest.fn(), jest.fn()];
    jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    const flush = () => {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback(0));
    };
    try {
      [first, second].forEach(({ main }, index) => {
        const layer = document.createElement('input');
        main.getRendererLayerElement().appendChild(layer);
        main.openLayer(layer, updates[index]);
      });
      for (let i = 0; i < 20; i++) window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(100);
      expect(callbacks.size).toBe(2);
      flush();
      updates.forEach((update) => expect(update).toHaveBeenCalledTimes(2));
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(100);
      expect(callbacks.size).toBe(2);
      first.grid.destroy();
      expect(callbacks.size).toBe(1);
      flush();
      expect(updates[0]).toHaveBeenCalledTimes(2);
      expect(updates[1]).toHaveBeenCalledTimes(3);
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(100);
      expect(callbacks.size).toBe(1);
      flush();
      expect(updates[1]).toHaveBeenCalledTimes(4);
    } finally {
      jest.useRealTimers();
      raf.mockRestore(); cancel.mockRestore();
      [...visibility, ...sizing].forEach((spy) => spy.mockRestore());
    }
  });
  it.each([false, true])('supports a new addition after undo (grouped: %s)', (grouped) => {
    const { grid, manager } = create(grouped ? { groupingFields: ['category'], groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })) } : {});
    grid.createItem({ id: 'c', category: 'C', amount: 3 });
    manager.undo();
    grid.createItem({ id: 'd', category: 'D', amount: 4 });
    expect(grid.getItems().map((item: any) => item.id)).toEqual(['a', 'b', 'd']);
    expect(manager.redo()).toBe(false);
  });
  it.each([false, true])('restores a sorted added row on redo (grouped: %s)', (grouped) => {
    const { grid, main, manager } = create(grouped ? { groupingFields: ['category'], groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })) } : {});
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
      ...(grouped ? { groupingFields: ['category'], groupSummaryFields: (['amount']).map((field) => ({ field, expression: 'sum' })) } : {}),
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
