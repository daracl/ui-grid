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

    it('save/remove에 GET 메서드는 허용하지 않는다', async () => {
      const { grid } = create({ load: { url: '/u' }, save: { url: '/s', method: 'GET' }, request: jest.fn() });
      await grid.load().catch(() => undefined);
      grid.createItem({ id: 'x', name: 'x' });
      await expect(grid.save()).rejects.toMatchObject({ code: 'CONFIG' });
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

  describe('서버 페이징·정렬·필터링', () => {
    const paging = { footer: { enabled: true, paging: { enabled: true } } };

    it('서버 정렬·필터링은 지원하지 않으므로 생성 시 오류이다', () => {
      expect(() => create({ sorting: { mode: 'server' } })).toThrow(DataSourceError);
      expect(() => create({ filtering: { mode: 'server' } })).toThrow(/not supported/);
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
