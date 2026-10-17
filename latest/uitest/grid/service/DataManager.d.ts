import { ItemStatus } from '../constants.js';
import { AddRowOptions, CURRENT_MATCH_INFO, MatchedField, RowId, RowSelectOptions, SearchMatchInfo, SearchMode, SearchResult, ViewItem } from '../types/Common.js';
import { GridOptions, SortOption } from '../types/GridOptions.js';
import { FieldSortInfo } from '../types/Header.js';
import { GridMain } from '../view/GridMain.js';
import { FieldItem } from '../types/GridField.js';
import { AddHistoryChange, HistoryChange, HistoryEntry, HistoryManager, RemoveHistoryChange } from './HistoryManager';
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
    private sortOrders;
    private sortOpts;
    private readonly searchMap;
    private readonly rowMap;
    private readonly rowCheckSet;
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
    removeSoftItem(ids: RowId[]): void;
    /**
     * 변경된 아이템 얻기
     *
     * @returns 변경된 row items
     */
    getChangedItems(): Record<string, any>[];
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
     * @param cellInfo 체크된 셀 정보
     * @param checked 체크 여부
     */
    setItemChecked(id: RowId, checked: boolean): void;
    /**
     * 특정 아이템이 체크되어 있는지 여부 반환
     * @param item 체크 여부를 확인할 아이템
     * @returns 체크 여부
     */
    isItemChecked(id: RowId): boolean;
    getCheckedCount(): number;
    /**
     * 데이터 세팅
     * @param items
     */
    setItems(items: any[]): void;
    createItem(item: any, addOpts?: AddRowOptions): number;
    protected getSortBaseItems(): any[];
    protected setSortBaseItems(items: any[]): void;
    dataSort(sortOrders: FieldSortInfo[], sortOpts: SortOption): void;
    abstract getSortData(sortOrders: FieldSortInfo[], options: SortOption): ViewItem[];
    protected initializeRowItem(item: any, depth?: number, status?: string): any;
    getViewItemIndex(id: RowId): number;
    /**
     * grid view에 보여지는 item의 id 배열 반환
     * @returns
     */
    getViewItems(): ViewItem[];
    /**
     *  grid view에 보여지는 item의 id 배열 설정
     * @param ids item id 배열
     * @param start start index
     * @param end end index
     */
    setViewItems(ids: ViewItem[]): void;
    convertViewItemsToRowItems(): any[];
    getRowItem(rowId: RowId): any;
    protected deleteRowItem(rowId: RowId): void;
    getAllRowItems(rowIdInclude?: boolean): any[];
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
     * View 위치는 History에서 관리하지 않습니다.
     */
    protected applyAddHistory(change: AddHistoryChange, undo: boolean): void;
    protected addHistory(rowId: RowId, item: any): void;
    /**
     * 삭제된 row History 적용
     *
     * remove의 의미:
     * - undo : row 복원
     * - redo : row 제거
     *
     * View 위치는 History에서 관리하지 않습니다.
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
     * 정렬이 없는 상태에서 History로 추가/삭제된 row를 현재 View에 반영합니다.
     *
     * 복원 위치는 History에서 관리하지 않습니다.
     * 현재 View의 마지막에 추가하며, 정렬 상태에서는 dataSort()로 재배치합니다.
     */
    private syncHistoryViewItems;
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
     * @param items check item list
     * @param matchId
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
