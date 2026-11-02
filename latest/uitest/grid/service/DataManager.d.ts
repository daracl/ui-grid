import { ItemStatus } from '../constants.js';
import { AddRowOptions, CURRENT_MATCH_INFO, MatchedField, RowId, RowSelectOptions, SearchMatchInfo, SearchMode, SearchResult, ViewItem } from '../types/Common.js';
import { GridOptions, SortOption } from '../types/GridOptions.js';
import { FieldSortInfo } from '../types/Header.js';
import { GridMain } from '../view/GridMain.js';
import { FieldItem } from '../types/GridField.js';
import { AddHistoryChange, HistoryChange, HistoryEntry, HistoryManager, RemoveHistoryChange } from './HistoryManager';
/** 저장 요청 시점의 행 스냅샷 */
export interface ChangeSnapshotEntry {
    rowId: RowId;
    status: ItemStatus;
    /** 요청 시점의 행 데이터(내부 관리 필드 제외) */
    data: Record<string, any>;
    /** 행 ID 필드 값. 서버 응답의 idMap·failed와 매칭한다. */
    key: RowId;
    /** 서버에 저장된 적 없는 신규 행. 서버 요청 없이 로컬에서만 제거한다. */
    localOnly: boolean;
}
export declare abstract class DataManager {
    protected opts: GridOptions;
    protected gridMain: GridMain;
    protected type: string;
    protected readonly rowHeight: number;
    protected readonly rowIdField: string;
    protected readonly cfg: import("../types/GridConfig.js").Config;
    private originalItems;
    private originalViewItems;
    private viewItems;
    private sortBaseItems;
    private beforeKeyword;
    private beforeSearchMode;
    private beforeSearchSortInfo;
    private searchDirty;
    private sortOrders;
    private sortOpts;
    private fullSortCache;
    private readonly searchMap;
    private readonly rowMap;
    private readonly rowCheckSet;
    private readonly createdRowIds;
    protected readonly matchOffsetMap: Map<RowId, number>;
    private beforeDataRowLength;
    /** Undo / Redo History */
    private readonly history;
    constructor(opts: GridOptions, gridMain: GridMain, type: string);
    /**
     * UUID
     * @returns
     */
    protected generateUUID(): string;
    /**
     * CUD 모드 변경.
     * new = create, modify = update, remove = delete
     */
    setChangeValue(rowItem: any, field: FieldItem, newValue: any, applyValue?: (rowItem: any, field: FieldItem, newValue: any) => boolean | void): boolean;
    /**
     * item 상태값 변경.
     *
     * @param item row item
     * @param status item status
     */
    setItemStatus(item: any, status: ItemStatus): void;
    removeSoftItem(ids: RowId[]): RowId[];
    /**
     * 변경된 아이템 얻기
     *
     * @returns 변경된 row items
     */
    getChangedItems(): Record<string, any>[];
    /**
     * 저장되지 않은 변경(C/U/D)이 있는지 확인한다.
     */
    hasChanges(): boolean;
    /**
     * 서버 저장용 변경 행 스냅샷을 만든다. 원본 순서(트리는 부모 → 자식)를 유지한다.
     */
    getChangeSnapshot(): ChangeSnapshotEntry[];
    /**
     * 지정한 행의 스냅샷을 만든다. 상태와 무관하게 포함하며 그룹 가상 행과 없는 ID는 제외한다.
     */
    getRowSnapshots(ids: RowId[]): ChangeSnapshotEntry[];
    private createSnapshotEntry;
    /** 서버로 보낼 행 데이터. 내부 관리 필드와 행 상태(_$CUD)는 제외한다. */
    private getSnapshotData;
    /**
     * 서버 저장 결과를 반영한다.
     *
     * 스냅샷 이후 다시 편집된 행은 변경 상태를 유지하고, 그 외 행은 확정(READ)한다.
     * 삭제가 확정된 행은 제거한다. Undo/Redo 이력은 서버 상태와 맞지 않게 되므로 초기화한다.
     *
     * @param entries 저장 요청에 사용한 스냅샷
     * @param failedKeys 저장에 실패한 행의 ID 필드 값
     * @param idMap 신규 행의 요청 ID → 서버 ID
     * @returns 확정되어 제거된 행 ID 배열
     */
    acceptChanges(entries: ChangeSnapshotEntry[], failedKeys?: Set<RowId>, idMap?: Record<string, RowId>): RowId[];
    /**
     * 행을 삭제 모드·이력과 무관하게 제거한다. 서버 반영이 끝난 삭제에 사용하며 Undo/Redo 이력은 초기화한다.
     */
    purgeItems(ids: RowId[]): RowId[];
    /**
     * 전체 체크 설정
     */
    setAllCheck(): void;
    /**
     * 체크된 아이템 초기화
     */
    clearAllCheck(): void;
    /**
     *  체크된 아이템 설정
     @param id 체크 설정할 row id
     * @param checked 체크 여부
     */
    setItemChecked(id: RowId, checked: boolean): void;
    /**
     * 특정 아이템이 체크되어 있는지 여부 반환
     @param id 체크 여부를 확인할 row id
     * @returns 체크 여부
     */
    isItemChecked(id: RowId): boolean;
    getCheckedCount(): number;
    /**
     * 데이터 세팅
     * @param items
     */
    setItems(items: any[]): void;
    /**
     * 서버에서 받은 행을 목록 끝에 붙인다. 조회 데이터이므로 READ 상태로 추가하고 Undo 이력은 남기지 않는다.
     *
     * @returns 추가된 첫 행의 index. 추가할 행이 없으면 -1
     */
    appendItems(items: any[]): number;
    createItem(item: any, addOpts?: AddRowOptions): number;
    /**
     * 화면에서 옮긴 행 순서를 원본 순서에도 반영한다. 이렇게 하지 않으면 이후 행 추가·삭제·검색 해제 등으로
     * 목록이 다시 만들어질 때 이동한 순서가 사라진다.
     *
     * 화면 순서가 곧 원본 순서인 경우에만 반영한다. 정렬·검색·페이징이 있으면(화면이 원본의 일부이거나 파생 순서)
     * 이동을 화면에만 적용해야 하므로 Tree·Group과 함께 false를 돌려준다.
     *
     * @param movedItems 이동 후 화면의 ViewItem 순서(원본 행 전체)
     * @returns 반영했으면 true(화면 목록도 새 순서로 갱신), 반영하지 않았으면 false
     */
    applyMovedOrder(movedItems: ViewItem[]): boolean;
    protected getSortBaseItems(): any[];
    protected setSortBaseItems(items: any[]): void;
    dataSort(sortOrders: FieldSortInfo[], sortOpts: SortOption): void;
    private getSortSignature;
    /** 전체 행이 원래 순서로 정렬 입력이 되는 경우에만 캐시를 사용·저장한다. 검색·사용자 정렬 함수·페이징과는 함께 쓰지 않는다. */
    private isFullSortCacheable;
    private isOriginalOrder;
    private cacheFullSort;
    /**
     * 정렬 입력이 전체 행(원래 순서)이고 행 구성과 정렬 기준 값이 정렬 당시와 같으면 이전 정렬 결과를 돌려준다.
     * 값을 다시 읽어 비교하므로 셀 수정·행 추가·삭제로 달라졌으면 캐시를 쓰지 않고 새로 정렬한다.
     */
    private reuseFullSort;
    /**
     * 정렬이 켜져 있을 때 소량의 행 추가와 삭제를 전체 재정렬 없이 반영한다.
     *
     * 정렬된 목록에서 삭제는 순서가 유지되고, 추가는 이진 탐색으로 자리를 찾는다. 같은 값은 원래 순서(sortOrder)를 따르므로
     * 전체를 다시 정렬한 결과와 같다. 검색·페이징·사용자 정렬 함수·Tree·Group이거나 추가 행이 많으면 반영하지 않고 false를 돌려준다.
     * 호출 전에 원본 목록(originalViewItems)이 이미 갱신되어 있어야 한다.
     *
     * @param added 새로 추가된 ViewItem
     * @param removedIds 삭제된 행 ID
     * @returns 반영했으면 true, 전체 재정렬이 필요하면 false
     */
    protected applyIncrementalMutation(added: ViewItem[], removedIds?: Set<RowId>): boolean;
    /** 사용자 정렬 결과를 원래 ViewItem에 연결하여 트리·그룹 메타데이터를 보존한다. */
    protected sortItems(source: ViewItem[], sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[];
    abstract getSortData(sortOrders: FieldSortInfo[], options: SortOption): ViewItem[];
    protected initializeRowItem(item: any, depth?: number, status?: string): any;
    getViewItemIndex(id: RowId): number;
    /**
     * grid view에 보여지는 item의 id 배열 반환
     * @returns
     */
    getViewItems(): ViewItem[];
    /** 페이징 전의 현재 검색·정렬 대상이다. */
    getPagingViewItems(): ViewItem[];
    protected applyViewItems(items: ViewItem[]): void;
    protected getUnfilteredViewItems(): ViewItem[];
    /** 데이터 변경 후 현재 검색·정렬·페이징을 다시 적용한다. */
    protected refreshViewAfterMutation(): void;
    /**
     *  grid view에 보여지는 item의 id 배열 설정
     @param ids 화면에 보여질 ViewItem 배열
     */
    setViewItems(ids: ViewItem[]): void;
    convertViewItemsToRowItems(): any[];
    getRowItem(rowId: RowId): any;
    protected deleteRowItem(rowId: RowId): void;
    getAllRowItems(rowIdInclude?: boolean): any[];
    /** 검색·페이징·트리 펼침 상태와 무관한 전체 원본 행의 얕은 복사본이다. */
    getSourceRowItems(): Record<string, any>[];
    /**
     * 행 데이터에서 Grid 내부 관리용 필드를 제외하고 반환
     *
     *
     * @param item item
     * @param rowIdInclude 행 ID 포함 여부
     * @returns 내부 관리용 필드가 제외된 행 데이터
     */
    private filterRowItem;
    getDataType(): string;
    /**
     * row 추가
     * @param addOpts add options
     */
    abstract addItems(items: any[], addOpts?: AddRowOptions, status?: ItemStatus): number;
    /**
     * row 삭제
     * @param ids 삭제할 row id 배열
     * @returns 삭제된 row id 배열
     */
    abstract removeItems(ids: RowId[]): RowId[];
    protected abstract getRowIndexById(rowId: RowId): number;
    /**
     * 지정한 row id의 행을 선택
     * @param rowId 선택할 row id
     * @param opts 포커스 이동, 스크롤 여부 등의 행 선택 옵션
     */
    selectRowById(rowId: RowId, opts: RowSelectOptions): void;
    /**
     * row 확장 (트리 구조에서 자식 노드 보이기)
     * @param id 확장할 row id
     */
    abstract expandRow(id: RowId): void;
    /**
     * 원본 데이터 얻기
     * @returns
     */
    getOriginalItems(): any[];
    setOriginalViewItems(items: ViewItem[]): void;
    /**
     * 현재 데이터 얻기
     * @returns
     */
    getOriginalViewItems(): ViewItem[];
    protected clearRowMap(): void;
    /**
     *clear search match map
     */
    protected clearSearchMap(): void;
    protected addSearchMapItem(id: RowId, viewItem: ViewItem): void;
    getSearchMapItem(rowId: RowId): ViewItem | undefined;
    hasSearchMapItem(rowId: RowId): boolean;
    getSearchMapItemLength(): number;
    protected setRowItem(rowId: RowId, item: any): void;
    protected getHistoryManager(): HistoryManager;
    beginHistory(): void;
    commitHistory(): void;
    rollbackHistory(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    clearHistory(): void;
    /**
     * 현재 View Selection을 History에서 사용하는 형태로 변환합니다.
     *
     * row index는 저장하지 않고 rowId를 저장합니다.
     */
    private createHistorySelection;
    /**
     * 실제로 변경된 row와 field를 기준으로 Selection을 만듭니다.
     * 일반 셀 수정의 History Selection에 사용합니다.
     */
    private createHistorySelectionByChange;
    /**
     * History Entry 최대 보관 개수를 설정합니다.
     *
     * 예: 100으로 설정하면 가장 최근 100개의 Undo 단위만 보관합니다.
     * 0으로 설정하면 새로운 History를 저장하지 않습니다.
     */
    setHistoryMaxCount(maxCount: number): void;
    /**
     * 현재 History Entry 최대 보관 개수를 반환합니다.
     */
    getHistoryMaxCount(): number;
    /**
     * 현재 Undo History 개수를 반환합니다.
     */
    getUndoHistoryCount(): number;
    /**
     * 현재 Redo History 개수를 반환합니다.
     */
    getRedoHistoryCount(): number;
    undo(): boolean;
    redo(): boolean;
    /**
     * History에 저장된 Selection을 현재 View 기준으로 복원합니다.
     * rowId로 현재 index를 다시 계산하기 때문에 정렬/검색/필터로
     * row 위치가 변경되어도 동일한 row를 선택할 수 있습니다.
     */
    private restoreHistorySelection;
    protected applyHistoryChange(change: HistoryChange, undo: boolean): void;
    private applyUpdateHistory;
    /**
     * 신규 row History 적용
     *
     * add의 의미:
     * - undo : row 제거
     * - redo : row 복원
     *
     * 신규 행의 Redo 위치는 View 동기화 단계에서 정합니다.
     */
    protected applyAddHistory(change: AddHistoryChange, undo: boolean): void;
    protected addHistory(rowId: RowId, item: any): void;
    protected removeHistory(rowId: RowId, viewItem: ViewItem, index: number): void;
    /**
     * 삭제된 row History 적용
     *
     * remove의 의미:
     * - undo : row 복원
     * - redo : row 제거
     *
     * 삭제 이력에 저장된 위치는 View 동기화 단계에서 복원합니다.
     */
    protected applyRemoveHistory(change: RemoveHistoryChange, undo: boolean): void;
    /**
     * View에서 특정 row를 제거합니다.
     */
    private removeViewItemById;
    /**
     * History 적용이 끝난 후 현재 View를 갱신합니다.
     *
     * History는 데이터 변경만 관리하고 View의 index는 관리하지 않습니다.
     * 현재 정렬 상태라면 현재 데이터 기준으로 다시 정렬합니다.
     */
    protected refreshAfterHistory(entry: HistoryEntry, undo: boolean): void;
    /**
     * 삭제 행은 변경 당시의 위치에 복원하고, 추가 행의 Redo는 마지막에 배치합니다.
     * 이후 현재 검색·정렬·페이징을 다시 적용합니다.
     */
    protected syncHistoryViewItems(entry: HistoryEntry, undo: boolean): void;
    search(keyword: string, options: SearchMode): void;
    clearSearchInfo(): {
        id: string;
        rowIndex: number;
        currentMatchIndex: number;
        cellIndex: number;
        matchCount: number;
    };
    abstract getSearchData(keyword: string, options: SearchMode): SearchResult;
    abstract getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO;
    /**
     * 현재 검색 포커스 cell 정보
     *
     @param currentMatchIndex 현재 행 이전까지의 누적 match 수
     @param currentMatchInfo 현재 match 위치 정보
     * @returns
     */
    protected setCurrentMatchInfo(currentMatchIndex: number, currentMatchInfo: CURRENT_MATCH_INFO): void;
    getCurrentMatchIndex(matchRowId: RowId): number;
    /**
     * resolveCellIndex
     *
     * 현재 row 내부에서 next/prev 검색 시 이동할 cell index를 계산한다.
     *
     * - row 이동 로직은 포함하지 않는다.
     * - 오직 "같은 row 안에서 몇 번째 match로 이동할지"만 결정한다.
     * - 결과가 -1이면 해당 row에서는 더 이상 이동할 match가 없음을 의미한다.
     *   (호출자가 다음/이전 row로 이동 처리해야 함)
     */
    protected resolveCellIndex(isNext: boolean, sameRow: boolean, matchFieldLength: number, cellIdx: number, searchRowLength: number): number;
    protected findMatch(isNext: boolean, checkMatchIndex: number, searchMatchInfo: SearchMatchInfo, searchResult: ViewItem[]): CURRENT_MATCH_INFO;
    abstract createMatchInfo(matchId: RowId, rowIndex: number, cellIndex: number, matchedFields: MatchedField[]): CURRENT_MATCH_INFO;
    private createFallbackMatch;
}
