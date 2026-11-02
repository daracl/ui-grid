import type { DaraGrid } from '../../DaraGrid.js';
import type { LoadOptions, LoadResult, RemoteParams, RemoveOptions, RemoveSummary, SaveSummary } from '../../types/DataSource.js';
import type { GridOptions } from '../../types/GridOptions.js';
import type { GridMain } from '../../view/GridMain.js';
/**
 * dataSource 옵션을 검증하고 Grid 생성 전에 필요한 옵션을 보정한다.
 *
 * - 서버 정렬·필터링, Tree/Group 서버 페이징처럼 지원하지 않는 조합은 오류를 발생시킨다.
 * - save가 있으면 삭제 행을 추적해야 하므로 deleteMode 기본값을 soft로 설정한다.
 * - 서버 페이징이면 footer 페이지 이동을 onPage 콜백에 연결한다.
 */
export declare function prepareDataSourceOptions(opts: GridOptions, rawOptions: GridOptions, onPage: (page: number) => void): void;
/**
 * 서버 요청과 Grid 데이터 반영을 조정한다.
 *
 * 로컬 데이터 관리는 기존 DataManager가 담당하며, 이 클래스는 DataSource 호출과
 * 요청 순서·취소·충돌 정책·이벤트만 처리한다.
 */
export declare class RemoteDataController {
    private readonly gridMain;
    private readonly grid;
    private readonly source;
    private readonly events;
    private readonly serverPaging;
    private readonly serverSorting;
    private readonly infinite;
    private readonly threshold;
    private loadedCount;
    private hasMore;
    private retryAfter;
    private lastParams;
    private queried;
    private page;
    private loadSeq;
    private loadAbort;
    private loadActive;
    private loadTicket;
    private approvedTicket;
    private mutationAbort;
    private loading;
    private destroyed;
    private toolbarTimer?;
    constructor(gridMain: GridMain, grid: DaraGrid);
    /**
     * infinite 페이징에서 다음 페이지를 조회해 기존 데이터 뒤에 붙인다.
     * 다른 조회·저장·삭제가 진행 중이거나 더 받을 데이터가 없으면 요청하지 않고 null을 반환한다.
     */
    loadMore(): Promise<LoadResult | null>;
    /**
     * 본문을 그린 뒤 호출되어, 화면 끝에서 threshold행 이내이면 다음 페이지를 자동 조회한다.
     * 조회 실패는 loadError 이벤트로 알리며 스스로 재시도하지 않는다. 다음 스크롤에서 다시 확인하고,
     * 이미 끝에 있어 위치가 바뀌지 않는 입력(idleScroll)은 실패 직후 요청이 몰리지 않도록 1초 뒤부터 재시도한다.
     */
    checkLoadMore(idleScroll?: boolean): void;
    /** 헤더 정렬을 서버 조회로 처리하는지 여부 */
    isServerSorting(): boolean;
    /** 지금 조회할 수 없는 상태(미저장 변경 또는 저장·삭제 진행 중)인지 여부. 정렬 상태를 바꾸기 전에 확인한다. */
    isLoadBlocked(): boolean;
    /**
     * 헤더에서 바뀐 정렬 상태로 첫 페이지부터 다시 조회한다. 마지막 조회 조건은 유지한다.
     * 조회할 수 없는 상태이면 loadError 이벤트로 알리고 reject 한다.
     */
    sortRemote(options?: LoadOptions): Promise<LoadResult | null>;
    /** 헤더 정렬 상태를 서버 조회 조건으로 변환한다. 정렬이 없으면 빈 배열이다. */
    private getSortParams;
    isLoading(): boolean;
    /**
     * 서버 데이터를 조회한다. 조회 조건을 지정하면 마지막 조건이 교체되고 첫 페이지부터 조회한다.
     * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
     * 조건을 생략하면 이전 조회가 있을 때는 마지막 조건을, 없으면 툴바 값만 사용한다.
     *
     * @returns 반영한 조회 결과. before 이벤트로 취소되었거나 더 새로운 요청에 밀렸으면 null
     */
    load(params?: RemoteParams, options?: LoadOptions): Promise<LoadResult | null>;
    /**
     * 검색 조건을 적용하여 첫 페이지부터 서버 조회한다.
     * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
     */
    searchRemote(params: RemoteParams, options?: LoadOptions): Promise<LoadResult | null>;
    /**
     * toolbar.remote 설정에 따라 툴바 값으로 서버 조회를 자동 실행한다.
     * 실패는 loadError 이벤트로 알리므로 처리되지 않은 Promise 오류를 만들지 않는다.
     */
    searchByToolbar(trigger: 'search' | 'change'): void;
    private getToolbarParams;
    /** 마지막 조회 조건과 현재 페이지로 다시 조회한다. */
    reload(options?: LoadOptions): Promise<LoadResult | null>;
    /** 서버 페이징에서 지정 페이지를 마지막 조회 조건으로 조회한다. */
    goToPage(page: number): Promise<LoadResult | null>;
    /**
     * @param append true이면 결과를 기존 데이터 뒤에 붙인다(infinite 다음 페이지). 미저장 변경이 있어도 조회할 수 있다.
     */
    private fetch;
    private applyLoadResult;
    private getPageSize;
    /**
     * 변경된 행(C/U/D)을 서버에 저장한다. 변경이 없으면 요청하지 않는다.
     *
     * @returns 저장 요약. before 이벤트로 취소되면 null
     */
    save(): Promise<SaveSummary | null>;
    private saveChanges;
    /** 스냅샷을 서버 저장 포맷으로 변환한다. 삭제는 부모보다 자식을 먼저 보내도록 역순으로 담는다. */
    private toChangeSet;
    private refreshAfterSave;
    /**
     * 선택된 행(또는 options.rowIds)을 서버에서 삭제한다.
     * 서버에 저장된 적 없는 신규 행은 요청 없이 로컬에서만 제거한다.
     *
     * @returns 삭제 요약. before 이벤트로 취소되면 null
     */
    removeRemote(options?: RemoveOptions): Promise<RemoveSummary | null>;
    private removeRows;
    /**
     * infinite 페이징에서 서버 저장·삭제가 끝나면 첫 페이지부터 다시 조회한다.
     * 이미 받은 페이지는 서버에서 행이 바뀌면 offset이 어긋나 누락·중복이 생기기 때문이다.
     *
     * 다른 미저장 변경이 남아 있으면 그 변경을 버리게 되므로 다시 조회하지 않는다.
     * 조회 실패는 loadError 이벤트로 알리며 저장·삭제 결과에는 영향을 주지 않는다.
     */
    private reloadAfterMutation;
    private endMutation;
    private assertReady;
    /** save·remove는 진행 중인 다른 save·remove나 조회와 겹치지 않아야 한다. */
    private assertIdle;
    /** 사전 조건 오류를 error 이벤트로 알리고 던진다. */
    private reject;
    private updateLoading;
    /** before 이벤트를 호출한다. false를 반환하면 작업을 취소한다. */
    private emitBefore;
    /** 알림 이벤트를 호출한다. destroy 이후에는 호출하지 않고, 핸들러 오류는 작업 결과에 영향을 주지 않는다. */
    private emit;
    /** 진행 중인 요청을 취소하고 이후 이벤트·결과 반영을 막는다. */
    destroy(): void;
}
