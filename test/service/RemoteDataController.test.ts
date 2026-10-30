import { ItemStatusMap, ROW_FIELD } from '@/constants';
import { DataSourceError } from '@/service/remote/DataSourceError';
import type { ChangeSet, DataSourceOptions, HttpRequest, LoadResult } from '@/types/DataSource';
import type { GridOptions } from '@/types/GridOptions';
import type { GridMain } from '@/view/GridMain';

type Deferred<T> = { promise: Promise<T>; resolve: (value: T) => void; reject: (error: unknown) => void };

const deferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('RemoteDataController (dataSource)', () => {
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

  const users = () => [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
  ];

  const create = (dataSource?: DataSourceOptions, extra: Record<string, unknown> = {}) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const grid = DaraGrid.create(element, {
      width: 640,
      height: 320,
      rowIdField: 'id',
      fields: [
        { name: 'id', width: 80 },
        { name: 'name', width: 160 },
      ],
      dataSource,
      ...extra,
    } as unknown as GridOptions);
    grids.push(grid);
    const main = (grid as unknown as { gridMain: GridMain }).gridMain;
    const manager = main.config().dataManager;
    const edit = (rowId: number | string, name: string, value: string) => {
      const field = main.config().allFieldMap.get(name)!;
      manager.setChangeValue(manager.getRowItem(rowId), field, value);
    };
    const status = (rowId: number | string) => manager.getRowItem(rowId)?.[ROW_FIELD.CUD];
    return { grid, main, manager, edit, status, element };
  };

  /** 서버 데이터를 흉내 내는 사용자 정의 DataSource */
  const fakeServer = () => {
    const load = jest.fn(async (_params?: unknown): Promise<LoadResult> => ({ items: users(), total: 3 }));
    const save = jest.fn(async (_changes: ChangeSet, _signal: AbortSignal) => undefined as unknown as void);
    const remove = jest.fn(async (_request?: unknown, _signal?: AbortSignal) => undefined as unknown);
    return { load, save, remove };
  };

  it('dataSource가 없으면 기존처럼 동작하고 서버 API는 CONFIG 오류로 거부한다', async () => {
    const { grid } = create(undefined, { items: users() });
    expect(grid.getItems()).toHaveLength(3);
    await expect(grid.load()).rejects.toMatchObject({ code: 'CONFIG' });
    await expect(grid.save()).rejects.toBeInstanceOf(DataSourceError);
  });

  it('서버 데이터를 조회해 Grid에 반영한다', async () => {
    const server = fakeServer();
    const { grid } = create(server);
    const result = await grid.load();
    expect(result?.items).toHaveLength(3);
    expect(grid.getItems().map((item) => item.name)).toEqual(['A', 'B', 'C']);
    expect(grid.getChangedItems()).toEqual([]);
  });

  it('검색 조건으로 조회하고 reload는 마지막 조건을 재사용한다', async () => {
    const server = fakeServer();
    const { grid } = create(server);
    await grid.searchRemote({ name: 'A' });
    await grid.reload();
    await grid.load();
    expect(server.load.mock.calls.map(([params]) => params)).toEqual([{ name: 'A' }, { name: 'A' }, { name: 'A' }]);
    await grid.load({ name: 'B' });
    await grid.reload();
    expect(server.load.mock.calls[4][0]).toEqual({ name: 'B' });
  });

  it('조회가 겹치면 이전 요청을 취소하고 최신 응답만 반영한다', async () => {
    const first = deferred<LoadResult>();
    const second = deferred<LoadResult>();
    const signals: AbortSignal[] = [];
    const queue = [first, second];
    const load = jest.fn((_params: unknown, signal: AbortSignal) => {
      signals.push(signal);
      return queue.shift()!.promise;
    });
    const { grid } = create({ load });

    const p1 = grid.load({ q: 1 });
    await flush();
    const p2 = grid.load({ q: 2 });
    await flush();
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);

    second.resolve({ items: [{ id: 10, name: 'new' }] });
    first.resolve({ items: [{ id: 99, name: 'stale' }] });

    expect(await p1).toBeNull();
    expect((await p2)?.items).toHaveLength(1);
    expect(grid.getItems().map((item) => item.name)).toEqual(['new']);
  });

  it('조회 오류는 loadError 이벤트와 reject로 알리고 기존 데이터를 유지한다', async () => {
    const loadError = jest.fn();
    const load = jest.fn().mockResolvedValueOnce({ items: users() }).mockRejectedValueOnce({ type: 'http', status: 500 });
    const { grid } = create({ load, events: { loadError } });
    await grid.load();
    await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 500 });
    expect(loadError).toHaveBeenCalledTimes(1);
    expect(grid.getItems()).toHaveLength(3);
  });

  it('응답 형식이 잘못되면 INVALID_RESPONSE 이다', async () => {
    const { grid } = create({ load: { url: '/x' }, request: async () => ({ wrong: true }) });
    await expect(grid.load()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
  });

  it('신규·수정·삭제 행만 저장하고 성공하면 상태를 확정한다', async () => {
    const server = fakeServer();
    const { grid, edit, status } = create(server);
    await grid.load();
    grid.createItem({ id: 'tmp-1', name: 'new' });
    edit(2, 'name', 'B2');
    grid.removeItems([3]);

    const summary = await grid.save();

    expect(summary).toEqual({ created: 1, updated: 1, deleted: 1, failed: 0 });
    const changes = server.save.mock.calls[0][0];
    expect(changes.created).toEqual([{ id: 'tmp-1', name: 'new' }]);
    expect(changes.updated).toEqual([{ id: 2, name: 'B2' }]);
    expect(changes.deleted).toEqual([{ id: 3, name: 'C' }]);
    expect(grid.getChangedItems()).toEqual([]);
    expect(status(2)).toBe(ItemStatusMap.READ);
    expect(status('tmp-1')).toBe(ItemStatusMap.READ);
    expect(status(3)).toBeUndefined();
    expect(grid.getAllItems().map((item) => item.id)).toEqual([1, 2, 'tmp-1']);
  });

  it('변경이 없으면 저장 요청을 보내지 않는다', async () => {
    const server = fakeServer();
    const beforeSave = jest.fn();
    const { grid } = create({ ...server, events: { beforeSave } });
    await grid.load();
    expect(await grid.save()).toEqual({ created: 0, updated: 0, deleted: 0, failed: 0 });
    expect(server.save).not.toHaveBeenCalled();
    expect(beforeSave).not.toHaveBeenCalled();
  });

  it('저장에 실패하면 변경 상태를 유지하고 재시도할 수 있다', async () => {
    const server = fakeServer();
    server.save.mockRejectedValueOnce({ type: 'network' });
    const saveError = jest.fn();
    const { grid, edit, status } = create({ ...server, events: { saveError } });
    await grid.load();
    edit(1, 'name', 'A2');

    await expect(grid.save()).rejects.toMatchObject({ code: 'NETWORK' });
    expect(saveError).toHaveBeenCalledTimes(1);
    expect(status(1)).toBe(ItemStatusMap.MODIFY);

    await grid.save();
    expect(status(1)).toBe(ItemStatusMap.READ);
    expect(server.save).toHaveBeenCalledTimes(2);
  });

  it('저장 중 추가 편집한 변경사항은 유실되지 않고 다음 저장 대상이 된다', async () => {
    const pending = deferred<void>();
    const server = fakeServer();
    server.save.mockImplementationOnce(() => pending.promise);
    const { grid, edit, status } = create(server);
    await grid.load();
    edit(1, 'name', 'A2');
    grid.createItem({ id: 'n', name: 'new' });

    const saving = grid.save();
    await flush();
    edit(1, 'name', 'A3'); // 저장 요청 이후 다시 편집
    edit('n', 'name', 'new2'); // 저장 중인 신규 행 편집
    await expect(grid.save()).rejects.toMatchObject({ code: 'BUSY' });
    pending.resolve();
    await saving;

    expect(status(1)).toBe(ItemStatusMap.MODIFY);
    expect(status('n')).toBe(ItemStatusMap.MODIFY); // 서버에 이미 생성되었으므로 수정으로 전환
    expect(grid.getItemById(1).name).toBe('A3');

    await grid.save();
    const second = server.save.mock.calls[1][0];
    expect(second.created).toEqual([]);
    expect(second.updated).toEqual([
      { id: 1, name: 'A3' },
      { id: 'n', name: 'new2' },
    ]);
    expect(grid.getChangedItems()).toEqual([]);
  });

  it('서버가 부여한 신규 행 ID를 반영하고 실패 행은 상태를 유지한다', async () => {
    const server = fakeServer();
    server.save.mockResolvedValueOnce({ idMap: { t1: 100 }, failed: ['t2'] } as never);
    const { grid, status } = create(server);
    await grid.load();
    grid.createItem({ id: 't1', name: 'one' });
    grid.createItem({ id: 't2', name: 'two' });

    const summary = await grid.save();

    expect(summary).toEqual({ created: 1, updated: 0, deleted: 0, failed: 1 });
    const saved = grid.getAllItems();
    expect(saved.map((item) => item.id)).toEqual([1, 2, 3, 100, 't2']);
    expect(status('t2')).toBe(ItemStatusMap.CREATE);
  });

  it('저장하지 않은 신규 행을 삭제하면 서버 요청 없이 로컬에서만 제거한다', async () => {
    const server = fakeServer();
    const { grid } = create(server);
    await grid.load();
    grid.createItem({ id: 'tmp', name: 'x' });
    grid.removeItems(['tmp']);
    expect(grid.getChangedItems()).toHaveLength(1);

    await grid.save();
    expect(server.save).not.toHaveBeenCalled();
    expect(grid.getAllItems().map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('미저장 변경이 있으면 조회를 차단하고 discardChanges로 허용한다', async () => {
    const server = fakeServer();
    const beforeLoad = jest.fn().mockReturnValueOnce(false);
    const { grid, edit } = create({ ...server, events: { beforeLoad } });
    expect(await grid.load()).toBeNull(); // beforeLoad 취소
    expect(server.load).not.toHaveBeenCalled();

    await grid.load();
    edit(1, 'name', 'dirty');
    await expect(grid.load()).rejects.toMatchObject({ code: 'UNSAVED_CHANGES' });
    await expect(grid.reload()).rejects.toMatchObject({ code: 'UNSAVED_CHANGES' });
    expect(grid.getItemById(1).name).toBe('dirty');

    await grid.reload({ discardChanges: true });
    expect(grid.getItemById(1).name).toBe('A');
  });

  it('조회 응답을 기다리는 동안 편집하면 결과를 버리고 편집을 보존한다', async () => {
    const pending = deferred<LoadResult>();
    const load = jest.fn().mockResolvedValueOnce({ items: users() }).mockReturnValueOnce(pending.promise);
    const { grid, edit } = create({ load });
    await grid.load();
    const reloading = grid.reload();
    await flush();
    edit(1, 'name', 'typed');
    pending.resolve({ items: [{ id: 9, name: 'server' }] });
    await expect(reloading).rejects.toMatchObject({ code: 'UNSAVED_CHANGES' });
    expect(grid.getItemById(1).name).toBe('typed');
  });

  it('Undo/Redo는 저장 전 변경과 일관되고 저장 후에는 이력을 초기화한다', async () => {
    const server = fakeServer();
    const { grid, main, edit, status } = create(server);
    const manager = main.config().dataManager;
    await grid.load();
    edit(1, 'name', 'A2');
    expect(manager.undo()).toBe(true);
    expect(status(1)).toBe(ItemStatusMap.READ);
    expect(await grid.save()).toEqual({ created: 0, updated: 0, deleted: 0, failed: 0 });
    expect(server.save).not.toHaveBeenCalled();

    manager.redo();
    expect(status(1)).toBe(ItemStatusMap.MODIFY);
    await grid.save();
    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  it('removeRemote는 서버 삭제 성공 시에만 로컬에서 제거하고 신규 행은 요청 없이 제거한다', async () => {
    const server = fakeServer();
    server.remove.mockRejectedValueOnce({ type: 'http', status: 409 });
    const removeError = jest.fn();
    const { grid } = create({ ...server, events: { removeError } });
    await grid.load();
    grid.createItem({ id: 'tmp', name: 'x' });

    await expect(grid.removeRemote({ rowIds: [2] })).rejects.toMatchObject({ code: 'HTTP', status: 409 });
    expect(removeError).toHaveBeenCalledTimes(1);
    expect(grid.getAllItems()).toHaveLength(4);

    expect(await grid.removeRemote({ rowIds: [2, 'tmp'] })).toEqual({ removed: 1, discarded: 1 });
    expect(server.remove.mock.calls[1][0]).toEqual({ deleted: [{ id: 2, name: 'B' }] });
    expect(grid.getAllItems().map((item) => item.id)).toEqual([1, 3]);
  });

  it('removeRemote는 선택된 행을 기본 대상으로 사용한다', async () => {
    const server = fakeServer();
    const { grid, main } = create(server);
    await grid.load();
    main.selectionInfo.selectionRowIds = () => [3];
    expect(await grid.removeRemote()).toEqual({ removed: 1, discarded: 0 });
    expect(grid.getAllItems().map((item) => item.id)).toEqual([1, 2]);
  });

  it('Tree는 부모 → 자식 순으로 신규, 자식 → 부모 순으로 삭제를 전달한다', async () => {
    const server = fakeServer();
    const { grid } = create(server, {
      tree: { idField: 'id', childrenField: 'children' },
      fields: [{ name: 'name', width: 160 }],
    });
    await grid.load();
    grid.setItems([{ id: 'p', name: 'p', children: [{ id: 'c', name: 'c' }] }]);
    grid.createItem({ id: 'n1', name: 'n1' });
    grid.createItem({ id: 'n2', name: 'n2' }, { rowId: 'n1', position: 'inside' });
    await grid.save();
    expect(server.save.mock.calls[0][0].created.map((row) => row.id)).toEqual(['n1', 'n2']);

    grid.removeItems(['p']);
    await grid.save();
    expect(server.save.mock.calls[1][0].deleted.map((row) => row.id)).toEqual(['c', 'p']);
    expect(grid.getAllItems().map((item) => item.id)).toEqual(['n1', 'n2']);
  });

  it('Group의 합계 행은 저장 대상에서 제외한다', async () => {
    const server = fakeServer();
    server.load.mockResolvedValue({ items: [{ id: 1, name: 'A', amount: 1 }, { id: 2, name: 'A', amount: 2 }] });
    const { grid } = create(server, {
      groupingFields: ['name'],
      groupSummaryFields: [{ field: 'amount', expression: 'sum' }],
      fields: [{ name: 'name', width: 100 }, { name: 'amount', width: 100 }],
    });
    await grid.load();
    grid.createItem({ id: 3, name: 'A', amount: 3 });
    await grid.save();
    expect(server.save.mock.calls[0][0].created).toEqual([{ id: 3, name: 'A', amount: 3 }]);
    expect(server.save.mock.calls[0][0].updated).toEqual([]);
  });

  it('destroy하면 진행 중인 요청을 취소하고 이후 이벤트를 발생시키지 않는다', async () => {
    const pending = deferred<LoadResult>();
    let signal!: AbortSignal;
    const events = { load: jest.fn(), loadError: jest.fn(), loadingChange: jest.fn() };
    const { grid } = create({
      load: (_params, s) => {
        signal = s;
        return pending.promise;
      },
      events,
    });
    const loading = grid.load();
    await flush();
    expect(events.loadingChange).toHaveBeenCalledWith(expect.objectContaining({ loading: true }));

    grid.destroy();
    expect(signal.aborted).toBe(true);
    pending.resolve({ items: users() });

    expect(await loading).toBeNull();
    expect(events.load).not.toHaveBeenCalled();
    expect(events.loadError).not.toHaveBeenCalled();
    expect(events.loadingChange).toHaveBeenCalledTimes(1);
    await expect(grid.load()).rejects.toMatchObject({ code: 'DESTROYED' });
  });

  it('load/save/remove 이벤트와 loadingChange를 순서대로 호출한다', async () => {
    const log: string[] = [];
    const server = fakeServer();
    const { grid, edit } = create({
      ...server,
      events: {
        beforeLoad: () => void log.push('beforeLoad'),
        load: () => void log.push('load'),
        beforeSave: () => void log.push('beforeSave'),
        save: () => void log.push('save'),
        loadingChange: ({ loading }) => void log.push(`loading:${loading}`),
      },
    });
    await grid.load();
    edit(1, 'name', 'z');
    await grid.save();
    expect(log).toEqual(['loading:true', 'beforeLoad', 'load', 'loading:false', 'loading:true', 'beforeSave', 'save', 'loading:false']);
  });

  it('searchRemote는 툴바 값을 조회 조건에 포함하고 명시 조건이 우선하며 reload도 같은 조건을 쓴다', async () => {
    const server = fakeServer();
    const toolbar = {
      enabled: true,
      items: [[{ position: 'left', children: [
        { name: 'status', renderer: 'text', defaultValue: 'ACTIVE' },
        { name: 'keyword', renderer: 'search', defaultValue: 'kim' },
      ] }]],
    };
    const { grid, main } = create(server, { toolbar });
    await grid.searchRemote({ keyword: 'lee', extra: 1 });
    expect(server.load.mock.calls[0][0]).toEqual({ status: 'ACTIVE', keyword: 'lee', extra: 1 });

    main.getToolbar().setValues({ status: 'STOP' });
    await grid.searchRemote({});
    expect(server.load.mock.calls[1][0]).toEqual({ status: 'STOP', keyword: 'kim' });
    await grid.reload();
    expect(server.load.mock.calls[2][0]).toEqual({ status: 'STOP', keyword: 'kim' });

    main.getToolbar().setValues({ status: 'ETC' });
    await grid.load({ keyword: 'x' });
    expect(server.load.mock.calls[3][0]).toEqual({ status: 'ETC', keyword: 'x' });
    await grid.load(); // 이전 조회가 있으므로 마지막 조건 재사용
    expect(server.load.mock.calls[4][0]).toEqual({ status: 'ETC', keyword: 'x' });

    const fresh = fakeServer();
    const first = create(fresh, { toolbar });
    await first.grid.load(); // 첫 조회는 툴바 값만 사용
    expect(fresh.load.mock.calls[0][0]).toEqual({ status: 'ACTIVE', keyword: 'kim' });

    const off = fakeServer();
    const second = create({ ...off, toolbarParams: false }, { toolbar });
    await second.grid.searchRemote({ a: 1 });
    expect(off.load.mock.calls[0][0]).toEqual({ a: 1 });
  });

  describe('autoLoad', () => {
    it('기본값(false)에서는 생성만으로 조회하지 않는다', async () => {
      const server = fakeServer();
      create(server);
      await flush();
      expect(server.load).not.toHaveBeenCalled();
    });

    it('true이면 생성 직후 한 번 조회하고 결과를 반영한다(툴바 없이도)', async () => {
      const server = fakeServer();
      const loaded = jest.fn();
      const { grid } = create({ ...server, autoLoad: true, events: { load: loaded } });
      expect(server.load).not.toHaveBeenCalled(); // 생성 코드가 끝난 뒤 실행
      await flush();
      expect(server.load).toHaveBeenCalledTimes(1);
      expect(server.load.mock.calls[0][0]).toEqual({});
      expect(loaded).toHaveBeenCalledTimes(1);
      expect(grid.getItems()).toHaveLength(3);
    });

    it('툴바가 있으면 첫 조회에 툴바 값을 사용하고, 실패는 loadError 이벤트로 알린다', async () => {
      const loadError = jest.fn();
      const load = jest.fn().mockRejectedValue({ type: 'http', status: 500 });
      const toolbar = {
        enabled: true,
        items: [[{ position: 'left', children: [{ name: 'status', renderer: 'text', defaultValue: 'ACTIVE' }] }]],
      };
      create({ load, autoLoad: true, events: { loadError } }, { toolbar });
      await flush();
      expect(load.mock.calls[0][0]).toEqual({ status: 'ACTIVE' });
      expect(loadError).toHaveBeenCalledTimes(1); // 처리되지 않은 Promise 오류 없이 이벤트로만 전달
    });

    it('생성 직후 destroy하면 조회하지 않고, dataSource.load가 없으면 생성 시 오류이다', async () => {
      const server = fakeServer();
      const { grid } = create({ ...server, autoLoad: true });
      grid.destroy();
      await flush();
      expect(server.load).not.toHaveBeenCalled();

      expect(() => create({ save: async () => undefined, autoLoad: true })).toThrow(/autoLoad requires dataSource.load/);
    });
  });

  describe('toolbar.remote', () => {
    const toolbar = (remote: unknown, search?: () => unknown) => ({
      enabled: true,
      remote,
      items: [[{ position: 'left', children: [
        { name: 'status', renderer: 'text', defaultValue: 'ACTIVE' },
        { name: 'keyword', renderer: 'search', defaultValue: 'kim', search },
      ] }]],
    });
    const enter = (element: HTMLElement) => {
      const input = element.querySelector('.dg-search-text') as HTMLInputElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    };

    it('검색 필드 Enter·버튼이 툴바 값으로 searchRemote를 자동 실행한다', async () => {
      const server = fakeServer();
      const { element } = create(server, { toolbar: toolbar(true) });
      enter(element);
      await flush();
      expect(server.load).toHaveBeenCalledTimes(1);
      expect(server.load.mock.calls[0][0]).toEqual({ status: 'ACTIVE', keyword: 'kim' });
      (element.querySelector('.dg-search-btn') as HTMLElement).click();
      await flush();
      expect(server.load).toHaveBeenCalledTimes(2);
    });

    it('필드 search 콜백이 false를 반환하면 자동 조회하지 않는다', async () => {
      const server = fakeServer();
      const callback = jest.fn(() => false);
      const { element } = create(server, { toolbar: toolbar(true, callback) });
      enter(element);
      await flush();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(server.load).not.toHaveBeenCalled();
    });

    it('미저장 변경이 있으면 loadError로 알리고, discardChanges이면 버리고 조회한다', async () => {
      const loadError = jest.fn();
      const server = fakeServer();
      const first = create({ ...server, events: { loadError } }, { toolbar: toolbar(true) });
      first.grid.createItem({ id: 'n', name: 'n' });
      enter(first.element);
      await flush();
      expect(server.load).not.toHaveBeenCalled();
      expect(loadError).toHaveBeenCalledWith(expect.objectContaining({ error: expect.objectContaining({ code: 'UNSAVED_CHANGES' }) }));

      const other = fakeServer();
      const second = create(other, { toolbar: toolbar({ discardChanges: true }) });
      second.grid.createItem({ id: 'n', name: 'n' });
      enter(second.element);
      await flush();
      expect(other.load).toHaveBeenCalledTimes(1);
    });

    it("trigger 'change'는 조건 필드 변경 시 debounce 후 조회하고 검색어 입력은 제외한다", async () => {
      const server = fakeServer();
      const { element } = create(server, { toolbar: toolbar({ trigger: ['change'], debounce: 20 }) });
      const status = element.querySelector('.dg-edit-text') as HTMLInputElement;
      for (const value of ['A', 'AB', 'ABC']) {
        status.value = value;
        status.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const keyword = element.querySelector('.dg-search-text') as HTMLInputElement;
      keyword.value = 'typing';
      keyword.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(server.load).toHaveBeenCalledTimes(1);
      expect(server.load.mock.calls[0][0]).toMatchObject({ status: 'ABC' });
      enter(element); // 'search'는 trigger에 없으므로 조회하지 않는다.
      await flush();
      expect(server.load).toHaveBeenCalledTimes(1);
    });

    it('dataSource.load·toolbar 활성·toolbarParams가 맞지 않으면 생성 시 오류이다', () => {
      expect(() => create(undefined, { toolbar: toolbar(true) })).toThrow(/dataSource.load/);
      expect(() => create({ load: async () => ({ items: [] }), toolbarParams: false }, { toolbar: toolbar(true) })).toThrow(/toolbarParams/);
    });
  });

  describe('조회 상태 관리', () => {
    it('beforeLoad가 취소해도 진행 중인 이전 조회는 취소되지 않고 결과가 반영된다', async () => {
      const first = deferred<LoadResult>();
      const signals: AbortSignal[] = [];
      const load = jest.fn((_params: unknown, signal: AbortSignal) => {
        signals.push(signal);
        return first.promise;
      });
      let cancel = false;
      const { grid } = create({ load, events: { beforeLoad: () => (cancel ? false : undefined) } });

      const p1 = grid.load({ q: 1 });
      await flush();
      cancel = true;
      expect(await grid.load({ q: 2 })).toBeNull();

      expect(signals[0].aborted).toBe(false);
      expect(load).toHaveBeenCalledTimes(1);

      first.resolve({ items: users(), total: 3 });
      expect(await p1).not.toBeNull();
      expect(grid.getItems()).toHaveLength(3);
    });

    it('취소된 조회가 끝나도 진행 중인 다른 조회의 로딩 상태는 유지된다', async () => {
      const first = deferred<LoadResult>();
      const loadingChange = jest.fn();
      let cancel = false;
      const { grid, main } = create({
        load: () => first.promise,
        events: { beforeLoad: () => (cancel ? false : undefined), loadingChange },
      });

      const p1 = grid.load();
      await flush();
      cancel = true;
      await grid.load();

      expect(main.getRemote().isLoading()).toBe(true);
      first.resolve({ items: users() });
      await p1;
      expect(main.getRemote().isLoading()).toBe(false);
      expect(loadingChange.mock.calls.map(([event]) => event.loading)).toEqual([true, false]);
    });

    it('beforeLoad 승인을 기다리는 동안 더 늦게 호출된 조회가 먼저 승인되면 앞선 조회는 버린다', async () => {
      const gates = [deferred<void>(), deferred<void>()];
      let index = 0;
      const load = jest.fn(async (params: Record<string, unknown>) => ({ items: [{ id: Number(params.q), name: 'x' }] }));
      const { grid } = create({ load, events: { beforeLoad: () => gates[index++].promise } });

      const p1 = grid.load({ q: 1 });
      const p2 = grid.load({ q: 2 });
      gates[1].resolve();
      expect(await p2).not.toBeNull();
      gates[0].resolve();
      expect(await p1).toBeNull();

      expect(load).toHaveBeenCalledTimes(1);
      expect(grid.getItems().map((item) => item.id)).toEqual([2]);
    });

    it('조회가 실패하면 마지막 조회 조건과 페이지는 직전 성공 상태를 유지한다', async () => {
      const load = jest.fn(async (params: Record<string, unknown>) => {
        if (params.page === 3) throw new Error('fail');
        return { items: [{ id: Number(params.page), name: `p${params.page}` }], total: 25 };
      });
      const { grid, main } = create({ load, paging: { mode: 'server', pageSize: 10 } }, {
        footer: { enabled: true, paging: { enabled: true } },
        paging: { pageSize: 10 },
      });

      await grid.searchRemote({ q: 'x' });
      await main.getRemote().goToPage(2);
      await main.getRemote().goToPage(3);
      expect(main.config().paging).toMatchObject({ page: 2 });

      await grid.reload();
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 2, pageSize: 10 }, expect.any(AbortSignal));

      // 조건이 바뀐 조회가 실패해도 이전 조건을 유지한다.
      load.mockRejectedValueOnce(new Error('fail'));
      await expect(grid.searchRemote({ q: 'y' })).rejects.toBeInstanceOf(DataSourceError);
      await grid.reload();
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 2, pageSize: 10 }, expect.any(AbortSignal));
    });

    it('에러 이벤트의 error는 DataSourceError 타입으로 code를 바로 읽을 수 있다', async () => {
      const codes: string[] = [];
      const { grid } = create({
        load: async () => {
          throw new Error('fail');
        },
        events: { loadError: (event) => codes.push(event.error.code) },
      });

      await expect(grid.load()).rejects.toBeInstanceOf(DataSourceError);
      expect(codes).toEqual(['NETWORK']);
    });
  });

  describe('joinUrl', () => {
    it('baseUrl과 엔드포인트 사이의 슬래시를 하나로 맞추고 절대 URL은 baseUrl을 무시한다', () => {
      const { joinUrl } = require('@/util/utils');
      expect(joinUrl('/api', '/users')).toBe('/api/users');
      expect(joinUrl('/api/', '/users')).toBe('/api/users');
      expect(joinUrl('/api', 'users')).toBe('/api/users');
      expect(joinUrl('https://x.com/api//', '/users')).toBe('https://x.com/api/users');
      expect(joinUrl('/api', 'https://other.com/users')).toBe('https://other.com/users');
      expect(joinUrl('/api', '//cdn.com/users')).toBe('//cdn.com/users');
      expect(joinUrl('/api', '?a=1')).toBe('/api?a=1');
      expect(joinUrl('/api', '')).toBe('/api');
      expect(joinUrl(undefined, '/users')).toBe('/users');
      expect(joinUrl('', 'users')).toBe('users');
    });

    it('조회 요청 URL에 반영된다', async () => {
      const urls: string[] = [];
      const { grid } = create({
        baseUrl: 'https://x.com/api/',
        load: { url: '/users' },
        request: async (req: HttpRequest) => {
          urls.push(req.url);
          return users();
        },
      });
      await grid.load();
      expect(urls).toEqual(['https://x.com/api/users']);
    });
  });

  describe('HTTP DataSource', () => {
    it('조회는 쿼리, 저장은 JSON 본문으로 보내고 공통 헤더·변환 함수를 적용한다', async () => {
      const requests: HttpRequest[] = [];
      const request = jest.fn(async (req: HttpRequest) => {
        requests.push(req);
        return req.method === 'GET' ? { data: users(), total: 3 } : { ok: true };
      });
      const { grid, edit } = create({
        baseUrl: '/api',
        load: { url: '/users' },
        save: { url: '/users/save', method: 'PUT', headers: { 'X-Test': '1' } },
        headers: async () => ({ Authorization: 'Bearer t' }),
        credentials: 'include',
        request,
        requestMap: (data, operation) => (operation === 'load' ? { ...data, v: 1 } : data),
        responseMap: (response, operation) => (operation === 'load' ? { items: response.data, total: response.total } : response),
      });

      await grid.load({ q: 'a' });
      expect(requests[0]).toMatchObject({
        url: '/api/users',
        method: 'GET',
        data: { q: 'a', v: 1 },
        credentials: 'include',
        headers: { Authorization: 'Bearer t', Accept: 'application/json' },
      });
      expect(requests[0].signal).toBeInstanceOf(AbortSignal);

      edit(1, 'name', 'A2');
      await grid.save();
      expect(requests[1]).toMatchObject({
        url: '/api/users/save',
        method: 'PUT',
        data: { created: [], updated: [{ id: 1, name: 'A2' }], deleted: [] },
        headers: { Authorization: 'Bearer t', 'X-Test': '1', 'Content-Type': 'application/json' },
      });
    });

    it('코어 Ajax loaderContainer를 기본은 그리드 요소·조회에만 전달하고 옵션으로 바꿀 수 있다', async () => {
      const request = jest.fn(async (_req: HttpRequest) => ({ items: users() }));
      const first = create({ load: { url: '/u' }, save: { url: '/s' }, request });
      await first.grid.load();
      expect(request.mock.calls[0][0].loaderContainer).toBe(first.element);
      first.grid.createItem({ id: 'x', name: 'x' });
      await first.grid.save();
      expect(request.mock.calls[1][0].loaderContainer).toBeUndefined();

      const second = create({
        load: { url: '/u' },
        save: { url: '/s' },
        request,
        loader: { container: '#wrap', options: { content: 'wait' }, operations: ['save'] },
      });
      await second.grid.load();
      second.grid.createItem({ id: 'y', name: 'y' });
      await second.grid.save();
      expect(request.mock.calls[2][0].loaderContainer).toBeUndefined();
      expect(request.mock.calls[3][0]).toMatchObject({ loaderContainer: '#wrap', loaderOption: { content: 'wait' } });

      const off = create({ load: { url: '/u' }, request, loader: false });
      await off.grid.load();
      expect(request.mock.calls[4][0].loaderContainer).toBeUndefined();
    });

    it('responseFilter는 responseMap보다 먼저 응답 봉투를 검사·해제하고 던진 오류는 이벤트로 알린다', async () => {
      const order: string[] = [];
      const loadError = jest.fn();
      const request = jest
        .fn()
        .mockResolvedValueOnce({ code: 0, data: { list: users(), total: 3 } })
        .mockResolvedValueOnce({ code: 500, message: '서버 오류' })
        .mockResolvedValueOnce({ code: 0, data: { list: [], total: 0 } });
      const { grid } = create({
        load: { url: '/u' },
        request,
        events: { loadError },
        responseFilter: async (response, operation) => {
          order.push(`filter:${operation}`);
          if (response.code !== 0) throw new DataSourceError('HTTP', response.message, response.code, response);
          return response.data;
        },
        responseMap: (data) => {
          order.push('map');
          return { items: data.list, total: data.total };
        },
      });

      await grid.load();
      expect(order).toEqual(['filter:load', 'map']);
      expect(grid.getItems()).toHaveLength(3);

      await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 500, message: '서버 오류' });
      expect(loadError).toHaveBeenCalledWith(expect.objectContaining({ error: expect.objectContaining({ status: 500 }) }));
      expect(grid.getItems()).toHaveLength(3); // 실패하면 기존 데이터 유지
      expect(order).toEqual(['filter:load', 'map', 'filter:load']); // 실패 시 responseMap은 호출하지 않음

      await grid.load();
      expect(grid.getItems()).toHaveLength(0);
    });

    it('responseFilter는 save 응답에도 적용되고 일반 Error도 DataSourceError로 변환한다', async () => {
      const request = jest.fn().mockResolvedValueOnce({ items: users() }).mockResolvedValueOnce({ ok: false });
      const { grid, edit } = create({
        load: { url: '/u' },
        save: { url: '/s' },
        request,
        responseFilter: (response, operation) => {
          if (operation === 'save' && !response.ok) throw new Error('저장 거부');
          return response;
        },
      });
      await grid.load();
      edit(1, 'name', 'A2');
      await expect(grid.save()).rejects.toMatchObject({ code: 'INVALID_RESPONSE', message: '저장 거부' });
      expect(grid.getChangedItems()).toHaveLength(1); // 실패하면 변경 상태 유지
    });

    describe('responseFilter의 상태 코드 오류 처리', () => {
      const httpError = (status: number, body: unknown, statusText = '') => ({
        type: 'http',
        status,
        statusText,
        responseText: typeof body === 'string' ? body : JSON.stringify(body),
      });

      it('401/403/500 응답 본문을 info와 함께 받아 사용자 오류로 바꿀 수 있다', async () => {
        const seen: Array<[number, boolean, unknown]> = [];
        const request = jest
          .fn()
          .mockRejectedValueOnce(httpError(401, { code: 'EXPIRED', message: '세션 만료' }, 'Unauthorized'))
          .mockRejectedValueOnce(httpError(403, '권한 없음', 'Forbidden'))
          .mockRejectedValueOnce(httpError(500, { message: 'boom' }));
        const loadError = jest.fn();
        const { grid } = create({
          load: { url: '/u' },
          request,
          events: { loadError },
          responseFilter: (response, _operation, info) => {
            seen.push([info.status, info.ok, response]);
            if (!info.ok && info.status === 401) throw new DataSourceError('HTTP', response.message, info.status, response);
            if (!info.ok && info.status === 403) throw info.error; // 기본 오류 그대로
            throw new Error('서버 오류: ' + response.message);
          },
        });

        await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 401, message: '세션 만료' });
        await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 403, response: '권한 없음' });
        await expect(grid.load()).rejects.toMatchObject({ code: 'INVALID_RESPONSE', message: '서버 오류: boom' });
        expect(seen).toEqual([
          [401, false, { code: 'EXPIRED', message: '세션 만료' }],
          [403, false, '권한 없음'],
          [500, false, { message: 'boom' }],
        ]);
        expect(loadError).toHaveBeenCalledTimes(3);
      });

      it('오류 응답의 헤더를 info.headers로 전달한다(XHR·fetch Response·headers 객체)', async () => {
        const seen: Array<Record<string, string> | undefined> = [];
        const request = jest
          .fn()
          .mockRejectedValueOnce({
            ...httpError(401, ''),
            xhr: { getAllResponseHeaders: () => 'X-Api-Message: %EC%84%B8%EC%85%98\r\nContent-Type: application/json\r\n' },
          })
          .mockRejectedValueOnce({ ...httpError(403, ''), xhr: { headers: new Headers({ 'X-Reason': 'denied' }) } })
          .mockRejectedValueOnce({ ...httpError(500, ''), headers: { 'X-Trace': 'abc' } })
          .mockRejectedValueOnce(httpError(502, ''));
        const { grid } = create({
          load: { url: '/u' },
          request,
          responseFilter: (_response, _operation, info) => {
            seen.push(info.headers);
            throw info.error;
          },
        });

        for (let i = 0; i < 4; i++) await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP' });
        expect(seen).toEqual([
          { 'x-api-message': '%EC%84%B8%EC%85%98', 'content-type': 'application/json' },
          { 'x-reason': 'denied' },
          { 'x-trace': 'abc' },
          undefined,
        ]);
      });

      it('값을 반환하면 오류가 복구되어 정상 응답처럼 이어진다(404 → 빈 결과)', async () => {
        const request = jest.fn().mockRejectedValue(httpError(404, { message: 'none' }));
        const load = jest.fn();
        const { grid } = create({
          load: { url: '/u' },
          request,
          events: { load },
          responseFilter: (_response, _operation, info) => (info.status === 404 ? { items: [], total: 0 } : _response),
        });

        const result = await grid.load();
        expect(result).toEqual({ items: [], total: 0 });
        expect(load).toHaveBeenCalledTimes(1);
        expect(grid.getItems()).toHaveLength(0);
      });

      it('성공 응답에는 ok=true와 상태 코드가 전달되고, 연결 실패·timeout·취소는 필터를 호출하지 않는다', async () => {
        const filter = jest.fn((response: unknown, _operation: string, _info: unknown) => response);
        const request = jest
          .fn()
          .mockResolvedValueOnce({ items: users() })
          .mockRejectedValueOnce({ type: 'network' })
          .mockRejectedValueOnce({ type: 'timeout' });
        const { grid } = create({ load: { url: '/u' }, request, responseFilter: filter });

        await grid.load();
        expect(filter).toHaveBeenCalledTimes(1);
        expect(filter.mock.calls[0][1]).toBe('load');
        expect(filter.mock.calls[0][2]).toMatchObject({ ok: true, status: 200 });

        await expect(grid.load({ a: 1 }, { discardChanges: true })).rejects.toMatchObject({ code: 'NETWORK' });
        await expect(grid.load({ a: 2 })).rejects.toMatchObject({ code: 'TIMEOUT' });
        expect(filter).toHaveBeenCalledTimes(1);
      });

      it('save 요청의 상태 코드 오류도 필터로 처리하고 실패하면 변경 상태를 유지한다', async () => {
        const request = jest
          .fn()
          .mockResolvedValueOnce({ items: users() })
          .mockRejectedValueOnce(httpError(409, { message: '중복' }));
        const { grid, edit } = create({
          load: { url: '/u' },
          save: { url: '/s' },
          request,
          responseFilter: (response, operation, info) => {
            if (!info.ok) throw new DataSourceError('HTTP', `${operation}: ${response.message}`, info.status);
            return response;
          },
        });
        await grid.load();
        edit(1, 'name', 'A2');
        await expect(grid.save()).rejects.toMatchObject({ code: 'HTTP', status: 409, message: 'save: 중복' });
        expect(grid.getChangedItems()).toHaveLength(1);
      });
    });

    describe('errorFilter', () => {
      const httpError = (status: number, body: unknown, extra: Record<string, unknown> = {}) => ({
        type: 'http',
        status,
        statusText: 'ST' + status,
        responseText: typeof body === 'string' ? body : JSON.stringify(body),
        ...extra,
      });

      it('HTTP 오류의 상태·헤더·본문을 받아 오류를 교체하고 일반 Error는 code·status를 유지한다', async () => {
        const seen: Array<[number | undefined, string | undefined, unknown, unknown]> = [];
        const request = jest
          .fn()
          .mockRejectedValueOnce(httpError(401, { message: '만료' }, { headers: { 'X-Api-Message': 'expired' } }))
          .mockRejectedValueOnce(httpError(500, 'boom'));
        const loadError = jest.fn();
        const { grid } = create({
          load: { url: '/u' },
          request,
          events: { loadError },
          errorFilter: (error, operation, info) => {
            seen.push([info.status, info.headers?.['x-api-message'], info.data, operation]);
            if (error.status === 401) throw new DataSourceError('HTTP', '인증되지 않음', 401, info.data);
            throw new Error('서버 내부 오류');
          },
        });

        await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 401, message: '인증되지 않음' });
        await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 500, message: '서버 내부 오류', response: 'boom' });
        expect(seen).toEqual([
          [401, 'expired', { message: '만료' }, 'load'],
          [500, undefined, 'boom', 'load'],
        ]);
        expect(loadError).toHaveBeenCalledTimes(2);
      });

      it('값을 반환하면 오류가 복구되어 responseMap으로 이어지고 responseFilter·오류 이벤트는 호출하지 않는다', async () => {
        const responseFilter = jest.fn((response: unknown) => response);
        const loadError = jest.fn();
        const loaded = jest.fn();
        const request = jest.fn().mockRejectedValue(httpError(404, { message: 'none' }));
        const { grid } = create({
          load: { url: '/u' },
          request,
          events: { loadError, load: loaded },
          responseFilter,
          errorFilter: (error) => (error.status === 404 ? { list: [], count: 0 } : Promise.reject(error)),
          responseMap: (data: { list: unknown[]; count: number }) => ({ items: data.list, total: data.count }),
        });

        expect(await grid.load()).toEqual({ items: [], total: 0 });
        expect(responseFilter).not.toHaveBeenCalled();
        expect(loadError).not.toHaveBeenCalled();
        expect(loaded).toHaveBeenCalledTimes(1);
      });

      it('NETWORK·TIMEOUT도 받고(상태·본문 없음) ABORT는 호출하지 않는다', async () => {
        const codes: string[] = [];
        const infos: unknown[] = [];
        const request = jest
          .fn()
          .mockRejectedValueOnce({ type: 'network' })
          .mockRejectedValueOnce({ type: 'timeout' })
          .mockRejectedValueOnce({ type: 'abort' });
        const { grid } = create({
          load: { url: '/u' },
          request,
          errorFilter: (error, _operation, info) => {
            codes.push(error.code);
            infos.push(info);
            throw error;
          },
        });

        await expect(grid.load()).rejects.toMatchObject({ code: 'NETWORK' });
        await expect(grid.load()).rejects.toMatchObject({ code: 'TIMEOUT' });
        await expect(grid.load()).rejects.toMatchObject({ code: 'ABORT' });
        expect(codes).toEqual(['NETWORK', 'TIMEOUT']);
        expect(infos).toEqual([
          { status: undefined, statusText: undefined, headers: undefined, data: undefined },
          { status: undefined, statusText: undefined, headers: undefined, data: undefined },
        ]);
      });

      it('성공 응답에는 errorFilter를 호출하지 않고 responseFilter만 적용한다', async () => {
        const errorFilter = jest.fn();
        const request = jest.fn().mockResolvedValueOnce({ code: 0, data: { items: users() } });
        const { grid } = create({
          load: { url: '/u' },
          request,
          responseFilter: (response: { data: unknown }) => response.data,
          errorFilter,
        });

        await grid.load();
        expect(errorFilter).not.toHaveBeenCalled();
        expect(grid.getItems()).toHaveLength(3);
      });

      it('save 오류도 처리하며 던지면 변경 상태를 유지한다', async () => {
        const request = jest
          .fn()
          .mockResolvedValueOnce({ items: users() })
          .mockRejectedValueOnce(httpError(409, { message: '중복' }));
        const { grid, edit } = create({
          load: { url: '/u' },
          save: { url: '/s' },
          request,
          errorFilter: (error, operation, info) => {
            throw new DataSourceError('HTTP', operation + ': ' + (info.data as { message: string }).message, error.status);
          },
        });
        await grid.load();
        edit(1, 'name', 'A2');
        await expect(grid.save()).rejects.toMatchObject({ code: 'HTTP', status: 409, message: 'save: 중복' });
        expect(grid.getChangedItems()).toHaveLength(1);
      });
    });

    it('HTTP 오류와 timeout, 취소를 DataSourceError 코드로 변환한다', async () => {
      const request = jest
        .fn()
        .mockRejectedValueOnce({ type: 'http', status: 401, statusText: 'Unauthorized', responseText: 'no' })
        .mockRejectedValueOnce({ type: 'timeout' });
      const { grid } = create({ load: { url: '/u' }, request });
      await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 401, response: 'no' });
      await expect(grid.load()).rejects.toMatchObject({ code: 'TIMEOUT' });
    });

    it('코어 Ajax의 parse·method 오류를 INVALID_RESPONSE·CONFIG로 변환한다', async () => {
      const { AjaxError } = require('@daracl/core');
      const request = jest
        .fn()
        .mockRejectedValueOnce(new AjaxError({ type: 'parse', status: 200, responseText: '<html>not json</html>' }))
        .mockRejectedValueOnce(new AjaxError({ type: 'method', status: 405 }))
        .mockRejectedValueOnce(new AjaxError({ type: 'http', status: 500, statusText: 'Server Error', responseText: 'boom' }))
        .mockRejectedValueOnce(new AjaxError({ type: 'network' }))
        .mockRejectedValueOnce(new AjaxError({ type: 'abort' }));
      const { grid } = create({ load: { url: '/u' }, request });

      await expect(grid.load()).rejects.toMatchObject({ code: 'INVALID_RESPONSE', status: 200, response: '<html>not json</html>' });
      await expect(grid.load()).rejects.toMatchObject({ code: 'CONFIG', status: 405 });
      await expect(grid.load()).rejects.toMatchObject({ code: 'HTTP', status: 500, response: 'boom' });
      await expect(grid.load()).rejects.toMatchObject({ code: 'NETWORK' });
      // 그리드가 직접 취소한 것이 아닌 abort는 ABORT 오류로 알린다(그리드가 취소한 조회만 조용히 null로 끝난다).
      await expect(grid.load()).rejects.toMatchObject({ code: 'ABORT' });
    });

    it('save/remove에 GET 메서드는 허용하지 않는다', async () => {
      const { grid } = create({ load: { url: '/u' }, save: { url: '/s', method: 'GET' }, request: jest.fn() });
      await grid.load().catch(() => undefined);
      grid.createItem({ id: 'x', name: 'x' });
      await expect(grid.save()).rejects.toMatchObject({ code: 'CONFIG' });
    });

    it('JSON이 아닌 성공 응답은 INVALID_RESPONSE로 알리고 기존 데이터를 유지한다', async () => {
      const loadError = jest.fn();
      const fetchMock = jest.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => '<html>login page</html>',
        headers: new Headers(),
      }));
      Object.defineProperty(window, 'fetch', { configurable: true, writable: true, value: fetchMock });
      const { grid } = create({ load: { url: '/api/users' }, fetchMode: 'fetch', events: { loadError } }, { items: users() });

      await expect(grid.load()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
      expect(loadError).toHaveBeenCalledTimes(1);
      expect(loadError.mock.calls[0][0].error.code).toBe('INVALID_RESPONSE');
      expect(grid.getItems()).toHaveLength(3);
    });

    it('baseUrl이 있어도 이미 합친 주소를 코어 Ajax에 넘겨 중복 적용되지 않는다', async () => {
      const fetchMock = jest.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ items: users() }),
        headers: new Headers(),
      }));
      Object.defineProperty(window, 'fetch', { configurable: true, writable: true, value: fetchMock });
      const { grid } = create({ baseUrl: 'https://x.com/api/', load: { url: '/users' }, fetchMode: 'fetch' });

      await grid.load({ q: 'a' });
      const [url] = fetchMock.mock.calls[0] as unknown as [string];
      expect(url.startsWith('https://x.com/api/users')).toBe(true);
      expect(url).not.toContain('api/api');
      expect(url).not.toContain('https://x.com/api/https');
    });

    it('코어 Ajax 0.0.13 기본 동작: 기본 헤더와 조회 조건 직렬화', async () => {
      const fetchMock = jest.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ items: users() }),
        headers: new Headers(),
      }));
      Object.defineProperty(window, 'fetch', { configurable: true, writable: true, value: fetchMock });
      const { grid } = create({ baseUrl: '/api', load: { url: '/users' }, fetchMode: 'fetch' });

      await grid.load({ q: 'a', empty: null, missing: undefined, when: new Date(0) });

      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      // null·undefined 조건은 쿼리에 넣지 않고 Date는 ISO 문자열로 보낸다.
      expect(url).toBe('/api/users?q=a&when=1970-01-01T00%3A00%3A00.000Z');
      // 코어가 기본으로 붙이는 헤더. 예전의 X-Requested-With 대신 X-Client-Type을 사용한다.
      expect(init.headers).toMatchObject({ 'X-Client-Type': 'Web', Accept: 'application/json' });
      expect(init.headers).not.toHaveProperty('X-Requested-With');
    });

    it('코어 Ajax(fetch)로 요청한다', async () => {
      const fetchMock = jest.fn(async () => ({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => JSON.stringify({ items: users(), total: 3 }),
        headers: new Headers(),
      }));
      Object.defineProperty(window, 'fetch', { configurable: true, writable: true, value: fetchMock });
      const { grid } = create({ load: { url: '/api/users', method: 'POST' }, fetchMode: 'fetch' });
      await grid.load({ q: 1 });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toBe('/api/users');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body as string)).toEqual({ q: 1 });
      expect(grid.getItems()).toHaveLength(3);
    });
  });

  describe('infinite 페이징', () => {
    // 스크롤 반영(requestAnimationFrame)과 재시도 대기 시간을 실제 시간에 맡기지 않고 가짜 타이머로 진행한다.
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    const wait = (ms = 100) => jest.advanceTimersByTimeAsync(ms);
    const flush = () => jest.advanceTimersByTimeAsync(0);

    /** page·pageSize로 잘라 주는 서버. total 생략 시 마지막 페이지는 pageSize보다 적게 내려간다. */
    const pagedServer = (totalRows: number, withTotal = true) =>
      jest.fn(async (params: Record<string, unknown>): Promise<LoadResult> => {
        const page = Number(params.page);
        const size = Number(params.pageSize);
        const start = (page - 1) * size;
        const items = Array.from({ length: Math.max(0, Math.min(size, totalRows - start)) }, (_, i) => ({
          id: start + i + 1,
          name: `r${start + i + 1}`,
        }));
        return withTotal ? { items, total: totalRows } : { items };
      });

    const scrollTo = async (main: GridMain, rowIdx: number) => {
      (main as unknown as { scroll: { moveVerticalScroll: (o: unknown) => void } }).scroll.moveVerticalScroll({ rowIdx });
      await wait();
    };

    const infinite = (load: jest.Mock, pageSize = 50, extra: Record<string, unknown> = {}) =>
      create({ load, paging: { mode: 'infinite', pageSize }, ...extra });

    it('footer.paging과 함께 쓰거나 Tree·Group에서는 생성 시 오류이고, 조건이 안 맞는 loadMore는 CONFIG 오류이다', async () => {
      const load = pagedServer(10);
      expect(() =>
        create({ load, paging: { mode: 'infinite' } }, { footer: { enabled: true, paging: { enabled: true } } }),
      ).toThrow(/footer\.paging/);
      expect(() => create({ load, paging: { mode: 'infinite' } }, { tree: { idField: 'id' } })).toThrow(/tree/);
      expect(() => create({ load, paging: { mode: 'infinite' } }, { groupingFields: ['name'] })).toThrow(DataSourceError);

      const { grid } = create({ load });
      await expect(grid.loadMore()).rejects.toMatchObject({ code: 'CONFIG' });
      const second = infinite(load);
      await expect(second.grid.loadMore()).rejects.toMatchObject({ code: 'CONFIG' }); // load() 전
    });

    it('첫 조회는 page 1로 교체하고, 스크롤이 끝에 가까워지면 다음 페이지를 붙이며 스크롤 위치를 유지한다', async () => {
      const load = pagedServer(120);
      const { grid, main, manager } = infinite(load);
      await grid.searchRemote({ q: 'x' });
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 1, pageSize: 50 }, expect.any(AbortSignal));
      expect(grid.getItems()).toHaveLength(50);
      await wait();
      expect(load).toHaveBeenCalledTimes(1);

      await scrollTo(main, 49);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 2, pageSize: 50 }, expect.any(AbortSignal));
      expect(grid.getItems().map((item) => item.id).slice(48, 52)).toEqual([49, 50, 51, 52]);
      expect(grid.getItems()).toHaveLength(100);
      // 붙인 뒤에도 맨 위로 돌아가지 않는다.
      expect(main.config().scroll.startIdx).toBeGreaterThan(0);
      // 조회 데이터이므로 변경·이력으로 남지 않는다.
      expect(grid.getChangedItems()).toEqual([]);
      expect((manager as unknown as { history: { canUndo(): boolean } }).history.canUndo()).toBe(false);
    });

    it('total에 도달하면 더 요청하지 않고, total이 없으면 pageSize보다 적게 받은 페이지를 마지막으로 본다', async () => {
      const withTotal = pagedServer(70);
      const a = infinite(withTotal);
      await a.grid.load();
      await scrollTo(a.main, 49);
      expect(a.grid.getItems()).toHaveLength(70);
      await scrollTo(a.main, 69);
      await scrollTo(a.main, 0);
      await scrollTo(a.main, 69);
      expect(withTotal).toHaveBeenCalledTimes(2);
      await expect(a.grid.loadMore()).resolves.toBeNull();

      const noTotal = pagedServer(70, false);
      const b = infinite(noTotal);
      await b.grid.load();
      await scrollTo(b.main, 49);
      await scrollTo(b.main, 69);
      expect(noTotal).toHaveBeenCalledTimes(2);
      expect(b.grid.getItems()).toHaveLength(70);
    });

    it('화면이 다 채워지지 않으면 가득 찰 때까지 이어서 조회한다', async () => {
      const load = pagedServer(9);
      const { grid } = infinite(load, 3);
      await grid.load();
      await wait();
      // 3행씩 받아도 화면을 채우지 못하므로 마지막 페이지까지 조회한다.
      expect(load).toHaveBeenCalledTimes(3);
      expect(grid.getItems()).toHaveLength(9);
    });

    it('reload·검색은 첫 페이지부터 교체한다', async () => {
      const load = pagedServer(120);
      const { grid, main } = infinite(load, 50, { sorting: { mode: 'server' } });
      await grid.searchRemote({ q: 'a' });
      await scrollTo(main, 49);
      expect(grid.getItems()).toHaveLength(100);

      await grid.reload();
      expect(load).toHaveBeenLastCalledWith({ q: 'a', page: 1, pageSize: 50 }, expect.any(AbortSignal));
      expect(grid.getItems()).toHaveLength(50);

      await grid.searchRemote({ q: 'b' });
      expect(load).toHaveBeenLastCalledWith({ q: 'b', page: 1, pageSize: 50 }, expect.any(AbortSignal));
      expect(grid.getItems()).toHaveLength(50);
    });

    it('다음 페이지 응답을 기다리는 동안 새 조회가 시작되면 이전 응답은 버린다', async () => {
      const second = deferred<LoadResult>();
      const load = jest.fn((params: Record<string, unknown>): Promise<LoadResult> => {
        if (params.q === 'a' && params.page === 2) return second.promise;
        return Promise.resolve({ items: [{ id: Number(params.page) * 100, name: 'x' }], total: 500 });
      });
      const { grid, main } = infinite(load, 1);
      await grid.searchRemote({ q: 'a' });
      const pending = grid.loadMore();
      await flush();

      await grid.searchRemote({ q: 'b' });
      second.resolve({ items: [{ id: 999, name: 'stale' }], total: 500 });
      expect(await pending).toBeNull();
      expect(grid.getItems().map((item) => item.id)).not.toContain(999);
      expect(main.getRemote().isLoading()).toBe(false);
    });

    it('다음 페이지 조회가 실패해도 기존 데이터를 유지하고 loadError로 알리며 자동으로 반복 시도하지 않는다', async () => {
      const loadError = jest.fn();
      const base = pagedServer(120);
      let fail = false;
      const load = jest.fn(async (params: Record<string, unknown>) => {
        if (fail) throw new Error('boom');
        return base(params);
      });
      const { grid, main } = infinite(load, 50, { events: { loadError } });
      await grid.load();

      fail = true;
      await scrollTo(main, 49);
      await wait();
      expect(loadError).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledTimes(2);
      expect(grid.getItems()).toHaveLength(50);

      // 다음 스크롤에서 다시 시도해 성공하면 이어서 붙는다.
      fail = false;
      await scrollTo(main, 0);
      await scrollTo(main, 49);
      expect(grid.getItems()).toHaveLength(100);
      expect(load).toHaveBeenLastCalledWith({ page: 2, pageSize: 50 }, expect.any(AbortSignal));
    });

    it('미저장 변경이 있어도 다음 페이지를 붙일 수 있고 변경은 유지된다', async () => {
      const load = pagedServer(120);
      const { grid, main, edit, status } = infinite(load);
      await grid.load();
      edit(1, 'name', 'edited');

      await scrollTo(main, 49);
      expect(grid.getItems()).toHaveLength(100);
      expect(status(1)).toBe(ItemStatusMap.MODIFY);
      expect(grid.getChangedItems()).toHaveLength(1);
    });

    it('끝에서 조회가 실패하면 끝에서 계속 스크롤해도 1초 동안은 재시도하지 않고, 이후 입력부터 다시 조회한다', async () => {
      jest.setSystemTime(1_000_000);
      {
        const loadError = jest.fn();
        const base = pagedServer(120);
        let fail = false;
        const load = jest.fn(async (params: Record<string, unknown>) => {
          if (fail) throw new Error('boom');
          return base(params);
        });
        const { grid, main } = infinite(load, 50, { events: { loadError } });
        await grid.load();

        fail = true;
        await scrollTo(main, 49);
        expect(loadError).toHaveBeenCalledTimes(1);
        expect(load).toHaveBeenCalledTimes(2);

        // 이미 끝이라 위치가 바뀌지 않는 스크롤 입력: 실패 직후에는 요청하지 않는다.
        await scrollTo(main, 49);
        expect(load).toHaveBeenCalledTimes(2);

        // 1초 뒤 같은 입력이면 다시 시도하고, 성공하면 이어서 붙는다.
        jest.setSystemTime(1_001_500);
        fail = false;
        await scrollTo(main, 49);
        expect(load).toHaveBeenCalledTimes(3);
        expect(load).toHaveBeenLastCalledWith({ page: 2, pageSize: 50 }, expect.any(AbortSignal));
        expect(grid.getItems()).toHaveLength(100);
      }
    });

    describe('저장·삭제 후 첫 페이지부터 재조회', () => {
      /** 서버 저장·삭제와 페이지 조회를 흉내 낸다. */
      const mutableServer = () => {
        let rows = Array.from({ length: 120 }, (_, i) => ({ id: i + 1, name: `r${i + 1}` }));
        const load = jest.fn(async (params: Record<string, unknown>): Promise<LoadResult> => {
          const size = Number(params.pageSize);
          const start = (Number(params.page) - 1) * size;
          return { items: rows.slice(start, start + size).map((row) => ({ ...row })), total: rows.length };
        });
        const save = jest.fn(async (changes: ChangeSet) => {
          changes.updated.forEach((item) => {
            const row = rows.find((candidate) => candidate.id === item.id);
            if (row) row.name = item.name;
          });
        });
        const remove = jest.fn(async (request: { deleted: { id: number }[] }) => {
          const ids = new Set(request.deleted.map((item) => item.id));
          rows = rows.filter((row) => !ids.has(row.id));
        });
        return { load, save, remove };
      };

      it('저장하면 첫 페이지부터 다시 받아 교체한다(저장이 끝난 뒤 조회한다)', async () => {
        const server = mutableServer();
        const { grid, main, edit } = infinite(server.load, 50, { save: server.save } as never);
        await grid.load();
        await scrollTo(main, 49);
        expect(grid.getItems()).toHaveLength(100);

        edit(1, 'name', 'saved');
        const summary = await grid.save();

        expect(summary).toMatchObject({ updated: 1, failed: 0 });
        expect(server.load).toHaveBeenLastCalledWith({ page: 1, pageSize: 50 }, expect.any(AbortSignal));
        expect(grid.getItems()).toHaveLength(50);
        expect(grid.getItems()[0].name).toBe('saved');
        expect(main.getRemote().isLoading()).toBe(false);
      });

      it('서버 삭제 뒤에도 첫 페이지부터 다시 받아 누락 없이 이어진다', async () => {
        const server = mutableServer();
        const { grid, main } = infinite(server.load, 50, { remove: server.remove } as never);
        await grid.load();
        await scrollTo(main, 49);
        expect(grid.getItems()).toHaveLength(100);

        const summary = await grid.removeRemote({ rowIds: [1, 2, 3] });

        expect(summary).toMatchObject({ removed: 3 });
        expect(server.load).toHaveBeenLastCalledWith({ page: 1, pageSize: 50 }, expect.any(AbortSignal));
        expect(grid.getItems().map((item) => item.id).slice(0, 3)).toEqual([4, 5, 6]);
        await scrollTo(main, 49);
        // 서버 총 117건 중 page 2까지 받은 100건에 id 중복·누락이 없다.
        const ids = grid.getItems().map((item) => item.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids[99]).toBe(103);
      });

      it('서버에 요청하지 않은 로컬 신규 행 정리나 변경 없는 저장은 다시 조회하지 않는다', async () => {
        const server = mutableServer();
        const { grid, main } = infinite(server.load, 50, { save: server.save, remove: server.remove } as never);
        await grid.load();
        const before = server.load.mock.calls.length;

        await grid.save();
        expect(server.load).toHaveBeenCalledTimes(before);

        await main.getRemote().removeRemote({ rowIds: [] });
        expect(server.load).toHaveBeenCalledTimes(before);
      });

      it('실패한 행이 있으면 다시 조회하지 않아 편집 내용을 보존한다', async () => {
        const server = mutableServer();
        server.save.mockImplementation(async () => ({ failed: [1] }) as never);
        const { grid, edit, status } = infinite(server.load, 50, { save: server.save } as never);
        await grid.load();
        const before = server.load.mock.calls.length;

        edit(1, 'name', 'x');
        expect(await grid.save()).toMatchObject({ failed: 1 });
        expect(server.load).toHaveBeenCalledTimes(before);
        expect(status(1)).toBe(ItemStatusMap.MODIFY);
      });

      it('저장 중 추가로 편집한 미저장 변경이 남아 있으면 버리지 않도록 다시 조회하지 않는다', async () => {
        const server = mutableServer();
        const gate = deferred<void>();
        server.save.mockImplementation(async () => gate.promise);
        const { grid, edit, status } = infinite(server.load, 50, { save: server.save } as never);
        await grid.load();
        const before = server.load.mock.calls.length;

        edit(1, 'name', 'first');
        const pending = grid.save();
        await flush();
        edit(1, 'name', 'second');
        gate.resolve();
        await pending;

        expect(server.load).toHaveBeenCalledTimes(before);
        expect(status(1)).toBe(ItemStatusMap.MODIFY);
      });

      it('재조회가 실패해도 저장 결과는 성공으로 돌려주고 loadError로 알린다', async () => {
        const server = mutableServer();
        const loadError = jest.fn();
        const { grid, edit } = infinite(server.load, 50, { save: server.save, events: { loadError } } as never);
        await grid.load();

        edit(1, 'name', 'x');
        server.load.mockRejectedValueOnce(new Error('boom'));
        await expect(grid.save()).resolves.toMatchObject({ updated: 1 });
        expect(loadError).toHaveBeenCalledTimes(1);
      });

      it('infinite가 아니면 저장 후 자동으로 다시 조회하지 않는다', async () => {
        const server = fakeServer();
        const { grid, edit } = create({ load: server.load, save: server.save });
        await grid.load();
        edit(1, 'name', 'x');
        await grid.save();
        expect(server.save).toHaveBeenCalledTimes(1);
        expect(server.load).toHaveBeenCalledTimes(1);
      });
    });

    it('전체 체크한 뒤 다음 페이지를 붙이면 헤더 체크박스가 일부 선택 상태로 바뀐다', async () => {
      const load = pagedServer(120);
      const { grid, main, manager, element } = create(
        { load, paging: { mode: 'infinite', pageSize: 50 } },
        { selectionMode: 'multiRow', aside: { rowCheckbox: { enabled: true } } },
      );
      await grid.load();

      const header = () => element.querySelector('.dg-checkbox.dg-all') as HTMLElement;
      manager.setAllCheck();
      main.getHeader().setCheckboxStyle('all');
      expect(header().classList.contains('dg-selected')).toBe(true);

      await scrollTo(main, 49);
      expect(grid.getItems()).toHaveLength(100);
      expect(header().classList.contains('dg-selected')).toBe(false);
      expect(header().classList.contains('dg-indeterminate')).toBe(true);
    });

    it('체크된 행이 없으면 다음 페이지를 붙여도 헤더 체크박스는 해제 상태이다', async () => {
      const load = pagedServer(120);
      const { grid, main, element } = create(
        { load, paging: { mode: 'infinite', pageSize: 50 } },
        { selectionMode: 'multiRow', aside: { rowCheckbox: { enabled: true } } },
      );
      await grid.load();
      await scrollTo(main, 49);

      const header = element.querySelector('.dg-checkbox.dg-all') as HTMLElement;
      expect(header.classList.contains('dg-selected')).toBe(false);
      expect(header.classList.contains('dg-indeterminate')).toBe(false);
    });

    it('기존 로더(loaderContainer)를 첫 조회와 다음 페이지 조회에 똑같이 사용한다', async () => {
      const loaders: unknown[] = [];
      const { grid, main, element } = create({
        load: { url: '/users' },
        paging: { mode: 'infinite', pageSize: 50 },
        request: async (req: HttpRequest) => {
          loaders.push(req.loaderContainer);
          const page = Number((req.data as Record<string, unknown>).page);
          return { items: Array.from({ length: 50 }, (_, i) => ({ id: (page - 1) * 50 + i + 1, name: 'x' })), total: 120 };
        },
      });
      await grid.load();
      await scrollTo(main, 49);
      expect(loaders).toEqual([element, element]);
    });
  });

  describe('서버 페이징·정렬·필터링', () => {
    const paging = { footer: { enabled: true, paging: { enabled: true } } };

    it('서버 필터링은 지원하지 않으므로 생성 시 오류이다', () => {
      expect(() => create({ filtering: { mode: 'server' } })).toThrow(/not supported/);
    });

    describe('서버 정렬', () => {
      const sortable = { header: { sort: { enabled: true } } };

      /** 헤더 정렬 아이콘 클릭(Shift: 다중 정렬) */
      const clickSort = async (element: HTMLElement, index: number, shiftKey = false) => {
        const icon = element.querySelectorAll('.dg-header-cell .dg-sort-icon')[index];
        icon.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, shiftKey }));
        await flush();
      };

      const sortOf = (load: jest.Mock, call = -1) => {
        const calls = load.mock.calls;
        return calls[call < 0 ? calls.length + call : call][0].sort;
      };

      const serverLoad = () =>
        jest.fn(async (_params: Record<string, unknown>): Promise<LoadResult> => ({ items: users(), total: 25 }));

      it('Tree·Group과 함께 사용할 수 없다', () => {
        expect(() => create({ sorting: { mode: 'server' } }, { tree: { idField: 'id' } })).toThrow(/tree/);
        expect(() => create({ sorting: { mode: 'server' } }, { groupingFields: ['name'] })).toThrow(DataSourceError);
      });

      it('헤더 정렬 클릭 시 로컬 정렬 대신 필드 정보를 sort 조건으로 보내 다시 조회한다', async () => {
        const load = serverLoad();
        const { grid, element } = create({ load, sorting: { mode: 'server' } }, sortable);
        await grid.load({ q: 'x' });
        expect(sortOf(load)).toBeUndefined();

        await clickSort(element, 1);
        expect(load).toHaveBeenCalledTimes(2);
        expect(load).toHaveBeenLastCalledWith(
          { q: 'x', sort: [{ field: 'name', order: 'asc' }] },
          expect.any(AbortSignal),
        );
        // 서버가 정렬해 준 순서를 그대로 보여준다(로컬 재정렬 없음).
        expect(grid.getItems().map((item) => item.name)).toEqual(['A', 'B', 'C']);

        await clickSort(element, 1);
        expect(sortOf(load)).toEqual([{ field: 'name', order: 'desc' }]);

        // 세 번째 클릭은 정렬 해제 → sort 키를 보내지 않는다.
        await clickSort(element, 1);
        expect(load).toHaveBeenCalledTimes(4);
        expect(load.mock.calls[3][0]).toEqual({ q: 'x' });
      });

      it('Shift 클릭은 다중 정렬로 클릭 순서대로 담고, 다른 필드 클릭은 정렬을 교체한다', async () => {
        const load = serverLoad();
        const { grid, element } = create({ load, sorting: { mode: 'server' } }, sortable);
        await grid.load();

        await clickSort(element, 1);
        await clickSort(element, 0, true);
        expect(sortOf(load)).toEqual([
          { field: 'name', order: 'asc' },
          { field: 'id', order: 'asc' },
        ]);

        await clickSort(element, 0);
        expect(sortOf(load)).toEqual([{ field: 'id', order: 'asc' }]);
      });

      it('정렬 시 서버 페이징은 1페이지로 돌아가고, 페이지 이동·reload는 정렬을 유지한다', async () => {
        const load = serverLoad();
        const { grid, main, element } = create(
          { load, sorting: { mode: 'server' }, paging: { mode: 'server', pageSize: 10 } },
          { ...sortable, footer: { enabled: true, paging: { enabled: true } } },
        );
        await grid.searchRemote({ q: 'x' });
        await main.getRemote().goToPage(3);
        expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 3, pageSize: 10 }, expect.any(AbortSignal));

        await clickSort(element, 1);
        expect(load).toHaveBeenLastCalledWith(
          { q: 'x', page: 1, pageSize: 10, sort: [{ field: 'name', order: 'asc' }] },
          expect.any(AbortSignal),
        );

        await main.getRemote().goToPage(2);
        expect(load).toHaveBeenLastCalledWith(
          { q: 'x', page: 2, pageSize: 10, sort: [{ field: 'name', order: 'asc' }] },
          expect.any(AbortSignal),
        );
        await grid.reload();
        expect(sortOf(load)).toEqual([{ field: 'name', order: 'asc' }]);
      });

      it('beforeLoad 이벤트의 params에도 sort가 포함된다', async () => {
        const seen: unknown[] = [];
        const { grid, element } = create(
          { load: serverLoad(), sorting: { mode: 'server' }, events: { beforeLoad: (event) => void seen.push(event.params.sort) } },
          sortable,
        );
        await grid.load();
        await clickSort(element, 0);
        expect(seen).toEqual([undefined, [{ field: 'id', order: 'asc' }]]);
      });

      it('미저장 변경이 있으면 정렬 상태를 바꾸지 않고 loadError로 알린다', async () => {
        const load = serverLoad();
        const loadError = jest.fn();
        const { grid, element, edit } = create({ load, sorting: { mode: 'server' }, events: { loadError } }, sortable);
        await grid.load();
        edit(1, 'name', 'A2');

        await clickSort(element, 1);
        expect(load).toHaveBeenCalledTimes(1);
        expect(loadError).toHaveBeenCalledTimes(1);
        expect(loadError.mock.calls[0][0].error.code).toBe('UNSAVED_CHANGES');
        expect(element.querySelector('[data-dg-sort]')).toBeNull();

        // 변경을 버리고 다시 조회한 뒤에는 정렬이 정상 동작한다.
        await grid.load(undefined, { discardChanges: true });
        await clickSort(element, 1);
        expect(sortOf(load)).toEqual([{ field: 'name', order: 'asc' }]);
      });

      it('local 모드(기본)에서는 정렬해도 서버를 다시 조회하지 않는다', async () => {
        const load = serverLoad();
        const { grid, element } = create({ load }, sortable);
        await grid.load();
        await clickSort(element, 1);
        expect(load).toHaveBeenCalledTimes(1);
        expect(element.querySelector('[data-dg-sort="asc"]')).not.toBeNull();
      });
    });

    it('Tree·Group과 서버 페이징, hard 삭제와 save는 함께 사용할 수 없다', () => {
      expect(() => create({ paging: { mode: 'server' } }, { ...paging, tree: { idField: 'id' } })).toThrow(/tree/);
      expect(() => create({ paging: { mode: 'server' } }, { groupingFields: ['name'], ...paging })).toThrow(DataSourceError);
      expect(() => create({ paging: { mode: 'server' } })).toThrow(/footer/);
      expect(() => create({ save: async () => undefined }, { deleteMode: 'hard' })).toThrow(/soft/);
    });

    it('페이지 번호와 pageSize를 조회 조건에 포함하고 total로 페이징 정보를 만든다', async () => {
      const load = jest.fn(async (params: Record<string, unknown>) => ({
        items: [{ id: Number(params.page), name: `p${params.page}` }],
        total: 25,
      }));
      const { grid, main } = create({ load, paging: { mode: 'server', pageSize: 10 } }, paging);

      await grid.searchRemote({ q: 'x' });
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 1, pageSize: 10 }, expect.any(AbortSignal));
      expect(main.config().paging).toMatchObject({ totalCount: 25, totalPages: 3, page: 1 });

      await main.getRemote().goToPage(3);
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 3, pageSize: 10 }, expect.any(AbortSignal));
      expect(grid.getItems().map((item) => item.name)).toEqual(['p3']);

      await grid.reload();
      expect(load).toHaveBeenLastCalledWith({ q: 'x', page: 3, pageSize: 10 }, expect.any(AbortSignal));

      await grid.searchRemote({ q: 'y' });
      expect(load).toHaveBeenLastCalledWith({ q: 'y', page: 1, pageSize: 10 }, expect.any(AbortSignal));
    });
  });
});
