import { ItemStatusMap } from '@/constants';
import type { DaraGrid } from '@/DaraGrid';
import type { RowId } from '@/types/Common';
import type {
  ChangeSet,
  DataSourceEvents,
  DataSourceOperation,
  LoadOptions,
  LoadResult,
  RemoteParams,
  RemoveOptions,
  RemoveRequest,
  RemoveSummary,
  SaveSummary,
} from '@/types/DataSource';
import type { GridOptions, ToolbarRemoteOptions } from '@/types/GridOptions';
import { getPagingInfo } from '@/util/pagingUtil';
import type { GridMain } from '@/view/GridMain';
import type { ChangeSnapshotEntry } from '../DataManager';
import { createDataSource, DataSource, normalizeLoadResult } from './DataSource';
import { DataSourceError, toDataSourceError } from './DataSourceError';

/**
 * dataSource 옵션을 검증하고 Grid 생성 전에 필요한 옵션을 보정한다.
 *
 * - 서버 정렬·필터링, Tree/Group 서버 페이징처럼 지원하지 않는 조합은 오류를 발생시킨다.
 * - save가 있으면 삭제 행을 추적해야 하므로 deleteMode 기본값을 soft로 설정한다.
 * - 서버 페이징이면 footer 페이지 이동을 onPage 콜백에 연결한다.
 */
export function prepareDataSourceOptions(
  opts: GridOptions,
  rawOptions: GridOptions,
  onPage: (page: number) => void,
): void {
  const dataSource = opts.dataSource;

  if (opts.toolbar?.remote) {
    if (!dataSource?.load) {
      throw new DataSourceError('CONFIG', 'toolbar.remote requires dataSource.load');
    }
    if (!opts.toolbar.enabled) {
      throw new DataSourceError('CONFIG', 'toolbar.remote requires toolbar.enabled');
    }
    if (dataSource.toolbarParams === false) {
      throw new DataSourceError('CONFIG', 'toolbar.remote cannot be used with dataSource.toolbarParams false');
    }
  }

  if (!dataSource) return;

  if (dataSource.autoLoad && !dataSource.load) {
    throw new DataSourceError('CONFIG', 'dataSource.autoLoad requires dataSource.load');
  }

  if (dataSource.sorting?.mode === 'server') {
    throw new DataSourceError('UNSUPPORTED', 'dataSource.sorting.mode "server" is not supported yet');
  }
  if (dataSource.filtering?.mode === 'server') {
    throw new DataSourceError('UNSUPPORTED', 'dataSource.filtering.mode "server" is not supported yet');
  }

  if (dataSource.save) {
    if (rawOptions.deleteMode === 'hard') {
      throw new DataSourceError('CONFIG', 'dataSource.save requires deleteMode "soft" to track deleted rows');
    }
    opts.deleteMode = 'soft';
  }

  if (dataSource.paging?.mode === 'server') {
    if (opts.tree || opts.groupingFields?.length) {
      throw new DataSourceError('UNSUPPORTED', 'server paging cannot be used with tree or groupingFields');
    }
    if (!opts.footer?.enabled || !opts.footer.paging?.enabled) {
      throw new DataSourceError('CONFIG', 'server paging requires footer.enabled and footer.paging.enabled');
    }
    if (opts.footer.paging.callback) {
      throw new DataSourceError('CONFIG', 'footer.paging.callback is managed by dataSource.paging when mode is "server"');
    }

    opts.footer.paging.callback = onPage;
    if (dataSource.paging.pageSize) {
      opts.paging = { ...opts.paging, pageSize: dataSource.paging.pageSize } as GridOptions['paging'];
    }
  }
}

/**
 * 서버 요청과 Grid 데이터 반영을 조정한다.
 *
 * 로컬 데이터 관리는 기존 DataManager가 담당하며, 이 클래스는 DataSource 호출과
 * 요청 순서·취소·충돌 정책·이벤트만 처리한다.
 */
export class RemoteDataController {
  private readonly source: DataSource;
  private readonly events: DataSourceEvents;
  private readonly serverPaging: boolean;

  private lastParams: RemoteParams = {};
  private queried = false;
  private page = 1;

  // 가장 최근 조회만 결과를 반영하기 위한 순번과 취소 컨트롤러
  private loadSeq = 0;
  private loadAbort: AbortController | null = null;
  private loadPending = false;

  // save·remove는 동시에 하나만 실행한다.
  private mutationAbort: AbortController | null = null;

  private loading = false;
  private destroyed = false;
  private toolbarTimer?: ReturnType<typeof setTimeout>;

  constructor(private readonly gridMain: GridMain, private readonly grid: DaraGrid) {
    const dataSource = gridMain.options().dataSource;
    if (!dataSource) throw new DataSourceError('CONFIG', 'dataSource option is required');

    this.source = createDataSource(dataSource, gridMain.element().getElement());
    this.events = dataSource.events ?? {};
    this.serverPaging = dataSource.paging?.mode === 'server';
  }

  public isLoading(): boolean {
    return this.loading;
  }

  // ============================================================
  // 조회
  // ============================================================

  /**
   * 서버 데이터를 조회한다. 조회 조건을 지정하면 마지막 조건이 교체되고 첫 페이지부터 조회한다.
   * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
   * 조건을 생략하면 이전 조회가 있을 때는 마지막 조건을, 없으면 툴바 값만 사용한다.
   *
   * @returns 반영한 조회 결과. before 이벤트로 취소되었거나 더 새로운 요청에 밀렸으면 null
   */
  public load(params?: RemoteParams, options?: LoadOptions): Promise<LoadResult | null> {
    const conditions = params ?? (this.queried ? this.lastParams : {});
    return this.fetch(params || !this.queried ? { ...this.getToolbarParams(), ...conditions } : conditions, 1, options);
  }

  /**
   * 검색 조건을 적용하여 첫 페이지부터 서버 조회한다.
   * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
   */
  public searchRemote(params: RemoteParams, options?: LoadOptions): Promise<LoadResult | null> {
    return this.fetch({ ...this.getToolbarParams(), ...params }, 1, options);
  }

  /**
   * toolbar.remote 설정에 따라 툴바 값으로 서버 조회를 자동 실행한다.
   * 실패는 loadError 이벤트로 알리므로 처리되지 않은 Promise 오류를 만들지 않는다.
   */
  public searchByToolbar(trigger: 'search' | 'change'): void {
    const remote = this.gridMain.options().toolbar?.remote;
    if (!remote || this.destroyed) return;

    const config: ToolbarRemoteOptions = remote === true ? {} : remote;
    const triggers = config.trigger ?? ['search'];
    if (!triggers.includes(trigger)) return;

    const run = () => {
      this.toolbarTimer = undefined;
      this.searchRemote({}, { discardChanges: config.discardChanges === true }).catch(() => undefined);
    };

    clearTimeout(this.toolbarTimer);
    const delay = trigger === 'change' ? config.debounce ?? 300 : config.debounce ?? 0;
    if (trigger === 'change' && delay > 0) this.toolbarTimer = setTimeout(run, delay);
    else run();
  }

  private getToolbarParams(): RemoteParams {
    const opts = this.gridMain.options();
    if (opts.dataSource?.toolbarParams === false || !opts.toolbar?.enabled) return {};
    return this.gridMain.getToolbarValues();
  }

  /** 마지막 조회 조건과 현재 페이지로 다시 조회한다. */
  public reload(options?: LoadOptions): Promise<LoadResult | null> {
    return this.fetch(this.lastParams, this.page, options);
  }

  /** 서버 페이징에서 지정 페이지를 마지막 조회 조건으로 조회한다. */
  public goToPage(page: number): Promise<LoadResult | null> {
    return this.fetch(this.lastParams, Math.max(1, Math.floor(page) || 1)).catch((error) => {
      // 이벤트(loadError)로 이미 알렸으므로 페이지 클릭 핸들러에서는 처리되지 않은 Promise 오류를 만들지 않는다.
      if (!(error instanceof DataSourceError)) throw error;
      return null;
    });
  }

  private async fetch(params: RemoteParams, page: number, options: LoadOptions = {}): Promise<LoadResult | null> {
    this.assertReady('load');
    if (!this.source.load) throw new DataSourceError('CONFIG', 'dataSource.load is not configured');
    if (this.mutationAbort) {
      this.reject('loadError', 'load', new DataSourceError('BUSY', 'Cannot load while saving or removing'));
    }

    const discard = options.discardChanges === true;
    const dataManager = this.gridMain.config().dataManager;

    if (!discard && dataManager.hasChanges()) {
      this.reject(
        'loadError',
        'load',
        new DataSourceError('UNSAVED_CHANGES', 'Unsaved changes exist. Save them or pass { discardChanges: true }'),
      );
    }

    // 이전 조회를 취소하고 이번 조회를 최신으로 등록한다.
    this.loadAbort?.abort();
    const abort = new AbortController();
    const seq = ++this.loadSeq;
    this.loadAbort = abort;
    this.loadPending = true;
    this.updateLoading('load');

    const requestParams: RemoteParams = { ...params };
    if (this.serverPaging) {
      requestParams.page = page;
      requestParams.pageSize = this.getPageSize();
    }

    const isCurrent = () => !this.destroyed && seq === this.loadSeq;

    try {
      if (!(await this.emitBefore('beforeLoad', { operation: 'load', params: requestParams }))) {
        return null;
      }
      if (!isCurrent()) return null;

      this.lastParams = { ...params };
      this.queried = true;
      this.page = page;

      const result = normalizeLoadResult(await this.source.load(requestParams, abort.signal));

      // 응답을 기다리는 동안 destroy 되었거나 더 새로운 조회가 시작되었으면 결과를 버린다.
      if (!isCurrent()) return null;

      if (!discard && dataManager.hasChanges()) {
        throw new DataSourceError('UNSAVED_CHANGES', 'Unsaved changes were made while loading; the result was discarded');
      }

      this.applyLoadResult(result, page);
      this.emit('load', { operation: 'load', params: requestParams, items: result.items, total: result.total ?? result.items.length });
      return result;
    } catch (error) {
      const dsError = toDataSourceError(error);
      if (!isCurrent() || (dsError.code === 'ABORT' && abort.signal.aborted)) return null;

      this.emit('loadError', { operation: 'load', error: dsError });
      throw dsError;
    } finally {
      if (seq === this.loadSeq) {
        this.loadPending = false;
        this.loadAbort = null;
        this.updateLoading('load');
      }
    }
  }

  private applyLoadResult(result: LoadResult, page: number): void {
    const gridMain = this.gridMain;

    if (this.serverPaging) {
      const opts = gridMain.options();
      const total = result.total ?? result.items.length;
      const paging = getPagingInfo(total, page, this.getPageSize(), opts.paging?.unitPage ?? 5);
      this.page = paging.page || 1;
      gridMain.setPaging(paging);
    }

    gridMain.setItems(result.items);
  }

  private getPageSize(): number {
    return this.gridMain.options().paging?.pageSize || 10;
  }

  // ============================================================
  // 저장
  // ============================================================

  /**
   * 변경된 행(C/U/D)을 서버에 저장한다. 변경이 없으면 요청하지 않는다.
   *
   * @returns 저장 요약. before 이벤트로 취소되면 null
   */
  public async save(): Promise<SaveSummary | null> {
    this.assertReady('save');
    if (!this.source.save) throw new DataSourceError('CONFIG', 'dataSource.save is not configured');
    this.assertIdle('saveError', 'save');

    const dataManager = this.gridMain.config().dataManager;
    const snapshot = dataManager.getChangeSnapshot();
    const remote = snapshot.filter((entry) => !entry.localOnly);

    if (remote.length === 0) {
      // 서버에 저장된 적 없는 신규 행을 삭제한 경우만 있으면 로컬에서만 정리한다.
      if (snapshot.length > 0) {
        dataManager.acceptChanges(snapshot);
        this.refreshAfterSave();
      }
      return { created: 0, updated: 0, deleted: 0, failed: 0 };
    }

    const changes = this.toChangeSet(remote);
    const abort = new AbortController();
    this.mutationAbort = abort;
    this.updateLoading('save');

    try {
      if (!(await this.emitBefore('beforeSave', { operation: 'save', changes }))) return null;
      if (this.destroyed) return null;

      const result = await this.source.save(changes, abort.signal);
      if (this.destroyed) return null;

      const failedKeys = new Set<RowId>(result.failed ?? []);
      const idMap = result.idMap ?? {};

      dataManager.acceptChanges(snapshot, failedKeys, idMap);
      this.refreshAfterSave();

      const failed = remote.filter((entry) => failedKeys.has(entry.key));
      const count = (status: string) => remote.filter((entry) => entry.status === status).length - failed.filter((entry) => entry.status === status).length;
      const summary: SaveSummary = {
        created: count(ItemStatusMap.CREATE),
        updated: count(ItemStatusMap.MODIFY),
        deleted: count(ItemStatusMap.DELETE),
        failed: failed.length,
      };

      this.emit('save', { operation: 'save', changes, summary });
      return summary;
    } catch (error) {
      if (this.destroyed) return null;
      const dsError = toDataSourceError(error);
      this.emit('saveError', { operation: 'save', error: dsError });
      throw dsError;
    } finally {
      this.endMutation(abort, 'save');
    }
  }

  /** 스냅샷을 서버 저장 포맷으로 변환한다. 삭제는 부모보다 자식을 먼저 보내도록 역순으로 담는다. */
  private toChangeSet(entries: ChangeSnapshotEntry[]): ChangeSet {
    const changes: ChangeSet = { created: [], updated: [], deleted: [] };

    for (const entry of entries) {
      if (entry.status === ItemStatusMap.CREATE) changes.created.push(entry.data);
      else if (entry.status === ItemStatusMap.MODIFY) changes.updated.push(entry.data);
      else if (entry.status === ItemStatusMap.DELETE) changes.deleted.push(entry.data);
    }

    changes.deleted.reverse();
    return changes;
  }

  private refreshAfterSave(): void {
    this.gridMain.refreshBody(true, 'remoteSave');
    this.gridMain.getHeader()?.setCheckboxStyle('none');
  }

  // ============================================================
  // 삭제
  // ============================================================

  /**
   * 선택된 행(또는 options.rowIds)을 서버에서 삭제한다.
   * 서버에 저장된 적 없는 신규 행은 요청 없이 로컬에서만 제거한다.
   *
   * @returns 삭제 요약. before 이벤트로 취소되면 null
   */
  public async removeRemote(options: RemoveOptions = {}): Promise<RemoveSummary | null> {
    this.assertReady('remove');
    if (!this.source.remove) throw new DataSourceError('CONFIG', 'dataSource.remove is not configured');
    this.assertIdle('removeError', 'remove');

    const gridMain = this.gridMain;
    const dataManager = gridMain.config().dataManager;
    const ids = [...new Set(options.rowIds ?? (gridMain.selectionInfo.selectionRowIds() as RowId[]))];

    const entries = dataManager.getRowSnapshots(ids);
    const localIds = entries.filter((entry) => entry.localOnly).map((entry) => entry.rowId);
    const remoteEntries = entries.filter((entry) => !entry.localOnly);

    if (remoteEntries.length === 0) {
      if (localIds.length > 0) {
        dataManager.purgeItems(localIds);
        gridMain.refreshBody(true, 'remoteRemove');
      }
      return { removed: 0, discarded: localIds.length };
    }

    const request: RemoveRequest = { deleted: remoteEntries.map((entry) => entry.data) };
    const abort = new AbortController();
    this.mutationAbort = abort;
    this.updateLoading('remove');

    try {
      if (!(await this.emitBefore('beforeRemove', { operation: 'remove', request }))) return null;
      if (this.destroyed) return null;

      await this.source.remove(request, abort.signal);
      if (this.destroyed) return null;

      // 서버 삭제가 끝난 뒤에만 로컬에서 제거한다.
      gridMain.config().dataManager.purgeItems([...remoteEntries.map((entry) => entry.rowId), ...localIds]);
      gridMain.refreshBody(true, 'remoteRemove');

      const summary: RemoveSummary = { removed: remoteEntries.length, discarded: localIds.length };
      this.emit('remove', { operation: 'remove', request, summary });
      return summary;
    } catch (error) {
      if (this.destroyed) return null;
      const dsError = toDataSourceError(error);
      this.emit('removeError', { operation: 'remove', error: dsError });
      throw dsError;
    } finally {
      this.endMutation(abort, 'remove');
    }
  }

  private endMutation(abort: AbortController, operation: DataSourceOperation): void {
    if (this.mutationAbort === abort) {
      this.mutationAbort = null;
      this.updateLoading(operation);
    }
  }

  // ============================================================
  // 상태·이벤트
  // ============================================================

  private assertReady(operation: DataSourceOperation): void {
    if (this.destroyed) throw new DataSourceError('DESTROYED', `Cannot ${operation}: grid is destroyed`);
  }

  /** save·remove는 진행 중인 다른 save·remove나 조회와 겹치지 않아야 한다. */
  private assertIdle(errorEvent: 'saveError' | 'removeError', operation: DataSourceOperation): void {
    if (this.mutationAbort || this.loadPending) {
      this.reject(errorEvent, operation, new DataSourceError('BUSY', 'Another remote operation is in progress'));
    }
  }

  /** 사전 조건 오류를 error 이벤트로 알리고 던진다. */
  private reject(
    name: 'loadError' | 'saveError' | 'removeError',
    operation: DataSourceOperation,
    error: DataSourceError,
  ): never {
    this.emit(name, { operation, error });
    throw error;
  }

  private updateLoading(operation: DataSourceOperation): void {
    const loading = this.loadPending || this.mutationAbort !== null;
    if (loading === this.loading) return;

    this.loading = loading;
    this.emit('loadingChange', { operation, loading });
  }

  /** before 이벤트를 호출한다. false를 반환하면 작업을 취소한다. */
  private async emitBefore<K extends 'beforeLoad' | 'beforeSave' | 'beforeRemove'>(
    name: K,
    event: Omit<Parameters<NonNullable<DataSourceEvents[K]>>[0], 'grid'>,
  ): Promise<boolean> {
    const handler = this.events[name] as ((event: unknown) => unknown) | undefined;
    if (!handler) return true;

    return (await handler({ ...event, grid: this.grid })) !== false;
  }

  /** 알림 이벤트를 호출한다. destroy 이후에는 호출하지 않고, 핸들러 오류는 작업 결과에 영향을 주지 않는다. */
  private emit<K extends Exclude<keyof DataSourceEvents, 'beforeLoad' | 'beforeSave' | 'beforeRemove'>>(
    name: K,
    event: Omit<Parameters<NonNullable<DataSourceEvents[K]>>[0], 'grid'>,
  ): void {
    const handler = this.events[name] as ((event: unknown) => void) | undefined;
    if (!handler || this.destroyed) return;

    try {
      handler({ ...event, grid: this.grid });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[daracl-grid] dataSource.events.${name} handler error`, error);
    }
  }

  /** 진행 중인 요청을 취소하고 이후 이벤트·결과 반영을 막는다. */
  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    clearTimeout(this.toolbarTimer);
    this.loadAbort?.abort();
    this.mutationAbort?.abort();
    this.loadAbort = null;
    this.mutationAbort = null;
  }
}
