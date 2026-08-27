import { ItemStatus, ItemStatusMap, ROW_FIELD, ROW_KEY_PREFIX } from '@/constants';
import {
  AddRowOptions,
  CURRENT_MATCH_INFO,
  MatchedField,
  RowId,
  RowSelectOptions,
  SearchMatchInfo,
  SearchMode,
  SearchResult,
  ViewItem,
} from '@/types/Common';
import { Selection, SelectionRange } from '@/types/GridConfig';
import { GridOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { isArray, isSameValue } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { merge } from '../util/utils';
import { FieldItem } from '@/types/GridField';
import {
  AddHistoryChange,
  HistoryChange,
  HistoryEntry,
  HistoryManager,
  HistorySelection,
  RemoveHistoryChange,
  UpdateHistoryChange,
} from './HistoryManager';
import { getScrollDirectionCode } from '@/util/gridUtils';

export abstract class DataManager {
  protected readonly rowHeight;
  protected readonly rowIdField;

  protected readonly cfg;

  private originalItems: any[] = [];
  private originalViewItems: ViewItem[] = [];

  private viewItems: ViewItem[] = [];

  private sortBaseItems: any[] = [];

  private beforeKeyword: string;
  private beforeSearchMode: SearchMode;
  private beforeSearchSortInfo: string;

  // 정렬 순서 정보
  private sortOrders: FieldSortInfo[] = [];

  // 정렬 정보
  private sortOpts: SortOption;

  // search item
  private readonly searchMap = new Map<RowId, ViewItem>();

  // all item info
  private readonly rowMap = new Map<RowId, any>();

  // row check item row id
  private readonly rowCheckSet = new Set<RowId>();

  // search match
  protected readonly matchOffsetMap = new Map<RowId, number>();

  private beforeDataRowLength = -1;

  /** Undo / Redo History */
  private readonly history: HistoryManager;

  constructor(protected opts: GridOptions, protected gridMain: GridMain, protected type: string) {
    this.cfg = gridMain.config();
    this.rowHeight = this.cfg.rowHeight;
    this.rowIdField = this.cfg.rowIdField;
    this.history = new HistoryManager();
  }

  /**
   * UUID
   * @returns
   */
  protected generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16));
  }

  /**
   * CUD 모드 변경.
   * new = create, modify = update, remove = delete
   */
  public setChangeValue(
    rowItem: any,
    field: FieldItem,
    newValue: any,
    applyValue?: (rowItem: any, field: FieldItem, newValue: any) => boolean | void,
  ): boolean {
    const fieldName = field.name;
    const beforeValue = rowItem[fieldName];
    const beforeStatus = rowItem[ROW_FIELD.CUD];

    if (applyValue) {
      const result = applyValue(rowItem, field, newValue);
      if (result === false) {
        return false;
      }
    } else {
      rowItem[fieldName] = newValue;
    }

    const afterValue = rowItem[fieldName];

    if (isSameValue(beforeValue, afterValue)) {
      return false;
    }

    if (rowItem[ROW_FIELD.CUD] === ItemStatusMap.READ) {
      this.setItemStatus(rowItem, ItemStatusMap.MODIFY);
    }

    const afterStatus = rowItem[ROW_FIELD.CUD];
    const rowId = rowItem[ROW_FIELD.ID];
    const changeSelection = this.createHistorySelectionByChange(rowId, field);

    // Transaction 중에는 HistoryManager가 Selection을 무시하고
    // commitHistory() 시점의 Selection을 afterSelection으로 기록합니다.
    this.history.add(
      {
        type: 'update',
        rowId,
        fieldName,
        beforeValue,
        afterValue,
        beforeStatus,
        afterStatus,
      },
      changeSelection,
      changeSelection,
    );

    return true;
  }

  /**
   * item 상태값 변경.
   *
   * @param item row item
   * @param status item status
   */
  public setItemStatus(item: any, status: ItemStatus) {
    const beforeValue = item[ROW_FIELD.CUD];
    item[ROW_FIELD.CUD] = status;

    if (status === ItemStatusMap.DELETE) {
      const deleteHistory: UpdateHistoryChange = {
        type: 'update',
        rowId: item[ROW_FIELD.ID],
        fieldName: ROW_FIELD.CUD,
        beforeValue: beforeValue,
        afterValue: ItemStatusMap.DELETE,
        beforeStatus: beforeValue,
        afterStatus: ItemStatusMap.DELETE,
      };

      this.history.add(deleteHistory);
    }
  }

  public removeSoftItem(ids: RowId[]) {
    this.beginHistory();

    try {
      for (const rowId of ids) {
        this.setItemStatus(this.getRowItem(rowId), ItemStatusMap.DELETE);
      }
      this.commitHistory();
    } catch (error) {
      this.rollbackHistory();

      throw error;
    }
  }

  /**
   * 변경된 아이템 얻기
   *
   * @returns 변경된 row items
   */
  public getChangedItems() {
    const originalItems = this.originalViewItems;
    const results = [];

    for (const viewItem of originalItems) {
      const item = this.getRowItem(viewItem.id);
      if (item[ROW_FIELD.CUD] == ItemStatusMap.READ) {
        continue;
      }

      results.push(this.filterRowItem(item, false));
    }

    return results;
  }

  /**
   * 전체 체크 설정
   */
  public setAllCheck() {
    for (const viewItem of this.getViewItems()) {
      this.rowCheckSet.add(viewItem.id);
    }
  }

  /**
   * 체크된 아이템 초기화
   */
  public clearAllCheck() {
    this.rowCheckSet.clear();
  }

  /**
   *  체크된 아이템 설정
   * @param cellInfo 체크된 셀 정보
   * @param checked 체크 여부
   */
  public setItemChecked(id: RowId, checked: boolean) {
    if (checked) {
      this.rowCheckSet.add(id);
    } else {
      this.rowCheckSet.delete(id);
    }
  }

  /**
   * 특정 아이템이 체크되어 있는지 여부 반환
   * @param item 체크 여부를 확인할 아이템
   * @returns 체크 여부
   */
  public isItemChecked(id: RowId): boolean {
    return this.rowCheckSet.has(id);
  }

  getCheckedCount(): number {
    return this.rowCheckSet.size;
  }

  /**
   * 데이터 세팅
   * @param items
   */
  public setItems(items: any[]) {
    this.history.clear();
    this.originalItems = items;
  }

  public createItem(item: any, addOpts?: AddRowOptions) {
    return this.cfg.dataManager.addItems([item], addOpts, ItemStatusMap.CREATE);
  }

  protected getSortBaseItems() {
    return this.sortBaseItems;
  }

  protected setSortBaseItems(items: any[]) {
    this.sortBaseItems = items;
  }

  dataSort(sortOrders: FieldSortInfo[], sortOpts: SortOption) {
    const sortArr = Array.from(sortOrders);

    this.sortOrders = sortOrders;
    this.sortOpts = sortOpts;

    sortArr.forEach((item) => {
      if (item.field.getValue) {
        item.isValue = true;
      }
    });

    if (this.opts.header.sort.customSorting) {
      this.setViewItems(this.opts.header.sort.customSorting(this.getAllRowItems(true), sortArr, sortOpts));
      return;
    }

    const sortData = this.getSortData(sortArr, sortOpts);

    this.setViewItems(sortData);
  }

  abstract getSortData(sortOrders: FieldSortInfo[], options: SortOption): ViewItem[];

  protected initializeRowItem(item: any, depth = 0, status = ItemStatusMap.READ): any {
    const rowIdField = this.rowIdField;
    const rowId = item[rowIdField] ?? this.generateUUID();

    if (!item[rowIdField]) {
      item[rowIdField] = rowId;
    }

    if (this.rowIdField != ROW_FIELD.ID) {
      item[ROW_FIELD.ID] = rowId;
    }

    item[ROW_FIELD.DEPTH] = depth;
    item[ROW_FIELD.CUD] = status;
    item[ROW_FIELD.HEIGHT] = this.rowHeight;

    return item;
  }

  public getViewItemIndex(id: RowId): number {
    const viewItems = this.viewItems;

    for (let idx = 0; idx < viewItems.length; idx++) {
      if (viewItems[idx].id === id) return idx;
    }

    return -1;
  }

  /**
   * grid view에 보여지는 item의 id 배열 반환
   * @returns
   */
  public getViewItems() {
    return this.viewItems;
  }

  /**
   *  grid view에 보여지는 item의 id 배열 설정
   * @param ids item id 배열
   * @param start start index
   * @param end end index
   */
  public setViewItems(ids: ViewItem[]) {
    const viewItemIds = ids;
    this.viewItems = viewItemIds;

    const dataInfo = this.cfg.dataInfo;

    dataInfo.rowLength = viewItemIds.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;

    if (this.beforeDataRowLength != -1 && this.beforeDataRowLength !== dataInfo.rowLength) {
      this.gridMain.selectionInfo.initSelection();
      this.gridMain.calcBody();
      this.gridMain.refreshBody(false, 'setViewItems');
    }

    this.beforeDataRowLength = dataInfo.rowLength;
    this.gridMain.getSummary()?.drawData();
  }

  public convertViewItemsToRowItems() {
    const results = [];

    for (const viewItem of this.getViewItems()) {
      const item = this.getRowItem(viewItem.id);
      results.push(item);
    }

    return results;
  }

  public getRowItem(rowId: RowId): any {
    return this.rowMap.get(rowId);
  }

  public getAllRowItems(rowIdInclude = false) {
    const viewItems = this.getViewItems();
    const results = new Array(viewItems.length);

    for (let i = 0; i < viewItems.length; i++) {
      const item = this.getRowItem(viewItems[i].id);
      results[i] = this.filterRowItem(item, rowIdInclude);
    }

    return results;
  }

  /**
   * 행 데이터에서 Grid 내부 관리용 필드를 제외하고 반환
   *
   *
   * @param item item
   * @param rowIdInclude 행 ID 포함 여부
   * @returns 내부 관리용 필드가 제외된 행 데이터
   */
  private filterRowItem(item: Record<string, any>, rowIdInclude: boolean) {
    const filteredItem: Record<string, any> = {};

    for (const key in item) {
      if (key.indexOf(ROW_KEY_PREFIX) === 0) {
        if (rowIdInclude && key === ROW_FIELD.ID) {
          filteredItem[key] = item[key];
        }
        continue;
      }

      filteredItem[key] = item[key];
    }

    return filteredItem;
  }

  public getDataType() {
    return this.type;
  }

  /**
   * row 추가
   * @param addOpts add options
   */
  public abstract addItems(items: any[], addOpts?: AddRowOptions, status?: ItemStatus): number;

  /**
   * row 삭제
   * @param ids 삭제할 row id 배열
   * @returns 삭제된 row id 배열
   */
  public abstract removeItems(ids: RowId[]): RowId[];

  protected abstract getRowIndexById(rowId: RowId): number;

  /**
   * 지정한 row id의 행을 선택
   * @param rowId 선택할 row id
   * @param opts 포커스 이동, 스크롤 여부 등의 행 선택 옵션
   */
  public selectRowById(rowId: RowId, opts: RowSelectOptions) {
    const index = this.getRowIndexById(rowId);

    if (index > -1) {
      let col = 1;
      if (opts?.fieldName) {
        const fieldInfo = this.cfg.allFieldMap.get(opts?.fieldName);
        if (fieldInfo?.$colSeq) col = fieldInfo?.$colSeq;
      } else {
        col = this.cfg.dataInfo.startCol;
      }

      this.gridMain.selectionInfo.setSelectionRangeInfo(
        {
          range: {
            type: 'cell',
            startIdx: index,
            endIdx: index,
            startCol: col,
            endCol: col,
          } as SelectionRange,
          isSelect: true,
          startCell: { startIdx: index, startCol: col },
        } as Selection,
        true,
        true,
      );

      if (opts?.scrollIntoView !== false) {
        this.gridMain.getScroll().moveVerticalScroll({ rowIdx: index, drawFlag: true });
      }
    }
  }

  /**
   * row 확장 (트리 구조에서 자식 노드 보이기)
   * @param id 확장할 row id
   */
  public abstract expandRow(id: RowId): void;

  /**
   * 원본 데이터 얻기
   * @returns
   */
  public getOriginalItems() {
    return this.originalItems;
  }

  public setOriginalViewItems(items: ViewItem[]) {
    this.originalViewItems = items;
  }
  /**
   * 현재 데이터 얻기
   * @returns
   */
  public getOriginalViewItems() {
    return this.originalViewItems;
  }

  protected clearRowMap() {
    this.rowMap.clear();
  }

  /**
   *clear search match map
   */
  protected clearSearchMap() {
    this.searchMap.clear();
  }

  protected addSearchMapItem(id: RowId, viewItem: ViewItem) {
    this.searchMap.set(id, viewItem);
  }

  public getSearchMapItem(rowId: RowId): ViewItem | undefined {
    return this.searchMap.get(rowId);
  }

  public hasSearchMapItem(rowId: RowId): boolean {
    return this.searchMap.has(rowId);
  }

  public getSearchMapItemLength(): number {
    return this.searchMap.size;
  }

  protected setRowItem(rowId: RowId, item: any) {
    this.rowMap.set(rowId, item);
  }

  // ============================================================
  // History
  // ============================================================

  protected getHistoryManager(): HistoryManager {
    return this.history;
  }

  public beginHistory(): void {
    this.history.begin(this.createHistorySelection());
  }

  public commitHistory(): void {
    this.history.commit(this.createHistorySelection());
  }

  public rollbackHistory(): void {
    this.history.rollback();
  }

  public canUndo(): boolean {
    return this.history.canUndo();
  }

  public canRedo(): boolean {
    return this.history.canRedo();
  }

  public clearHistory(): void {
    this.history.clear();
  }

  /**
   * 현재 View Selection을 History에서 사용하는 형태로 변환합니다.
   *
   * row index는 저장하지 않고 rowId를 저장합니다.
   */
  private createHistorySelection(): HistorySelection | undefined {
    const selection = this.cfg.selection;

    if (!selection?.range) {
      return undefined;
    }

    const range = selection.range;
    const startIdx = range.startIdx;
    const endIdx = range.endIdx;

    if (startIdx < 0 || endIdx < 0 || startIdx >= this.viewItems.length || endIdx >= this.viewItems.length) {
      return undefined;
    }

    const startRowId = this.viewItems[startIdx]?.id;
    const endRowId = this.viewItems[endIdx]?.id;

    if (startRowId === undefined || startRowId === null || endRowId === undefined || endRowId === null) {
      return undefined;
    }

    return {
      startRowId,
      endRowId,
      startCol: range.startCol,
      endCol: range.endCol,
    };
  }

  /**
   * 실제로 변경된 row와 field를 기준으로 Selection을 만듭니다.
   * 일반 셀 수정의 History Selection에 사용합니다.
   */
  private createHistorySelectionByChange(rowId: RowId, field: FieldItem): HistorySelection | undefined {
    const rowIndex = this.getViewItemIndex(rowId);
    const colSeq = field.$colSeq;

    if (rowIndex < 0 || colSeq === undefined || colSeq === null) {
      return undefined;
    }

    return {
      startRowId: rowId,
      endRowId: rowId,
      startCol: colSeq,
      endCol: colSeq,
    };
  }

  /**
   * History Entry 최대 보관 개수를 설정합니다.
   *
   * 예: 100으로 설정하면 가장 최근 100개의 Undo 단위만 보관합니다.
   * 0으로 설정하면 새로운 History를 저장하지 않습니다.
   */
  public setHistoryMaxCount(maxCount: number): void {
    this.history.setMaxCount(maxCount);
  }

  /**
   * 현재 History Entry 최대 보관 개수를 반환합니다.
   */
  public getHistoryMaxCount(): number {
    return this.history.getMaxCount();
  }

  /**
   * 현재 Undo History 개수를 반환합니다.
   */
  public getUndoHistoryCount(): number {
    return this.history.getUndoCount();
  }

  /**
   * 현재 Redo History 개수를 반환합니다.
   */
  public getRedoHistoryCount(): number {
    return this.history.getRedoCount();
  }

  public undo(): boolean {
    const entry = this.history.undo();

    if (!entry) {
      return false;
    }

    const previousSuspended = this.history.suspend();

    try {
      for (let i = entry.changes.length - 1; i >= 0; i--) {
        this.applyHistoryChange(entry.changes[i], true);
      }
    } finally {
      this.history.resume(previousSuspended);
    }

    this.refreshAfterHistory(entry, true);
    this.restoreHistorySelection(entry.beforeSelection);
    return true;
  }

  public redo(): boolean {
    const entry = this.history.redo();

    if (!entry) {
      return false;
    }

    const previousSuspended = this.history.suspend();

    try {
      for (let i = 0; i < entry.changes.length; i++) {
        this.applyHistoryChange(entry.changes[i], false);
      }
    } finally {
      this.history.resume(previousSuspended);
    }

    this.refreshAfterHistory(entry, false);
    this.restoreHistorySelection(entry.afterSelection);
    return true;
  }

  /**
   * History에 저장된 Selection을 현재 View 기준으로 복원합니다.
   * rowId로 현재 index를 다시 계산하기 때문에 정렬/검색/필터로
   * row 위치가 변경되어도 동일한 row를 선택할 수 있습니다.
   */
  private restoreHistorySelection(selection?: HistorySelection): void {
    if (!selection) {
      return;
    }

    const startIdx = this.getViewItemIndex(selection.startRowId);
    const endIdx = this.getViewItemIndex(selection.endRowId);

    if (startIdx < 0 || endIdx < 0) {
      return;
    }

    this.gridMain.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: 'cell',
          startIdx,
          endIdx,
          startCol: selection.startCol,
          endCol: selection.endCol,
        } as SelectionRange,
        isSelect: true,
        startCell: {
          startIdx,
          startCol: selection.startCol,
        },
      } as Selection,
      true,
      true,
    );
  }

  protected applyHistoryChange(change: HistoryChange, undo: boolean): void {
    switch (change.type) {
      case 'update':
        this.applyUpdateHistory(change, undo);
        break;

      case 'add':
        this.applyAddHistory(change, undo);
        break;

      case 'remove':
        this.applyRemoveHistory(change, undo);
        break;
    }
  }

  private applyUpdateHistory(change: UpdateHistoryChange, undo: boolean): void {
    const item = this.getRowItem(change.rowId);

    if (!item) {
      return;
    }

    item[change.fieldName] = undo ? change.beforeValue : change.afterValue;
    item[ROW_FIELD.CUD] = undo ? change.beforeStatus : change.afterStatus;
  }

  /**
   * 신규 row History 적용
   *
   * add의 의미:
   * - undo : row 제거
   * - redo : row 복원
   *
   * View 위치는 History에서 관리하지 않습니다.
   */
  protected applyAddHistory(change: AddHistoryChange, undo: boolean): void {
    if (undo) {
      this.rowMap.delete(change.rowId);
      this.removeViewItemById(change.rowId);
      return;
    }

    this.rowMap.set(change.rowId, change.item);
  }

  protected addHistory(rowId: RowId, item: any): void {
    this.history.add({
      type: 'add',
      rowId,
      item,
    });
  }

  /**
   * 삭제된 row History 적용
   *
   * remove의 의미:
   * - undo : row 복원
   * - redo : row 제거
   *
   * View 위치는 History에서 관리하지 않습니다.
   */
  protected applyRemoveHistory(change: RemoveHistoryChange, undo: boolean): void {
    if (undo) {
      this.rowMap.set(change.rowId, change.item);
      return;
    }

    this.rowMap.delete(change.rowId);
    this.removeViewItemById(change.rowId);
  }

  /**
   * View에서 특정 row를 제거합니다.
   */
  private removeViewItemById(rowId: RowId): void {
    const index = this.getViewItemIndex(rowId);

    if (index < 0) {
      return;
    }

    this.viewItems.splice(index, 1);
  }

  /**
   * History 적용이 끝난 후 현재 View를 갱신합니다.
   *
   * History는 데이터 변경만 관리하고 View의 index는 관리하지 않습니다.
   * 현재 정렬 상태라면 현재 데이터 기준으로 다시 정렬합니다.
   */
  protected refreshAfterHistory(entry: HistoryEntry, undo: boolean): void {
    if (this.sortOrders.length > 0) {
      this.dataSort(this.sortOrders, this.sortOpts);
    } else {
      this.syncHistoryViewItems(entry, undo);
      this.setViewItems(this.viewItems);
    }

    const cfg = this.cfg;
    const moveRowIdx = this.getViewItemIndex(entry.changes[0].rowId);

    const isMoveScroll = getScrollDirectionCode(cfg, cfg.scroll, moveRowIdx, -1) > 0;

    //this.gridMain.calcBody();
    this.gridMain.refreshBody(!isMoveScroll, 'history');

    if (isMoveScroll) {
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: this.getViewItemIndex(entry.changes[0].rowId) });
    }
    this.gridMain.getSummary()?.drawData();
  }

  /**
   * 정렬이 없는 상태에서 History로 추가/삭제된 row를 현재 View에 반영합니다.
   *
   * 복원 위치는 History에서 관리하지 않습니다.
   * 현재 View의 마지막에 추가하며, 정렬 상태에서는 dataSort()로 재배치합니다.
   */
  private syncHistoryViewItems(entry: HistoryEntry, undo: boolean): void {
    for (const change of entry.changes) {
      if (change.type === 'update') {
        continue;
      }

      const shouldExist = change.type === 'add' ? !undo : undo;
      const viewIndex = this.getViewItemIndex(change.rowId);

      if (shouldExist) {
        if (viewIndex === -1) {
          this.viewItems.push({ id: change.rowId } as ViewItem);
        }
      } else if (viewIndex > -1) {
        this.viewItems.splice(viewIndex, 1);
      }
    }
  }

  public search(keyword: string, options: SearchMode) {
    const keys: string[] = ['matchCase', 'matchWholeWord', 'useRegex', 'searchFields'];

    let isSameSearchOpts = this.beforeKeyword == keyword;

    if (this.beforeSearchMode) {
      for (const key of keys as (keyof SearchMode)[]) {
        if (key === 'searchFields') {
          const optsSearchFields = options.searchFields;
          const beforeOptsSearchFields = this.beforeSearchMode.searchFields;
          if (
            (isArray(optsSearchFields) && JSON.stringify(optsSearchFields) != JSON.stringify(beforeOptsSearchFields)) ||
            (!isArray(optsSearchFields) && optsSearchFields != beforeOptsSearchFields)
          ) {
            isSameSearchOpts = false;
            break;
          }
        } else {
          if (this.beforeSearchMode[key] !== options[key]) {
            isSameSearchOpts = false;
            break;
          }
        }
      }
    } else {
      isSameSearchOpts = false;
    }

    let searchMatchInfo;

    let searchResult: SearchResult;
    let searchItems;
    let isNewSearch = false;

    if (this.beforeKeyword == keyword && isSameSearchOpts) {
      searchMatchInfo = this.cfg.searchMatchInfo;
      searchItems = this.getViewItems();
    } else {
      isNewSearch = true;
      searchMatchInfo = this.clearSearchInfo();
      searchResult = this.getSearchData(keyword, options);
      searchMatchInfo.matchCount = searchResult.matchCount;
      searchItems = searchResult.items;
    }

    if (isNewSearch) {
      this.setViewItems(searchItems);
    }

    // 정렬 처리
    if (this.sortOrders.length > 0) {
      const currentSortState = JSON.stringify(
        this.sortOrders.map(({ name, ascOrder, sortCell }) => ({
          name,
          ascOrder,
          sortCell,
        })),
      );

      if (isNewSearch || this.beforeSearchSortInfo !== currentSortState) {
        this.dataSort(this.sortOrders, this.sortOpts);
        this.beforeSearchSortInfo = currentSortState;
      }
    }

    this.beforeKeyword = keyword;
    this.beforeSearchMode = merge({}, options);

    if (searchMatchInfo.matchCount < 1) {
      this.setCurrentMatchInfo(0, {
        id: '',
        rowIndex: -1,
        cellIndex: -1,
      } as CURRENT_MATCH_INFO);
      return;
    }

    const matchInfo = this.getMatchInfo(searchMatchInfo, isNewSearch, options);

    const { rowIndex: matchRowIndex, cellIndex: itemIndex } = matchInfo;

    const { startIdx, insideViewRow, insideStartCol, insideEndCol } = this.cfg.scroll;

    if (startIdx + insideViewRow <= matchRowIndex || matchRowIndex < startIdx) {
      let moveScrollRowIdx = -1;
      if (matchRowIndex < insideViewRow) {
        moveScrollRowIdx = 0;
      } else {
        moveScrollRowIdx = matchRowIndex - (insideViewRow - Math.ceil(insideViewRow / 2));
      }

      if (moveScrollRowIdx > -1) {
        this.gridMain.getScroll().moveVerticalScroll({ rowIdx: moveScrollRowIdx, drawFlag: false });
      }
    }

    if (itemIndex > -1) {
      const matchedInfo = matchInfo.matchedFields[itemIndex];

      const matchFieldInfo = this.cfg.allFieldMap.get(matchedInfo.fieldName);

      if (matchFieldInfo) {
        const colSeq = matchFieldInfo.$colSeq;

        if (matchFieldInfo.$panel == 'center' && (colSeq < insideStartCol || insideEndCol < colSeq)) {
          this.gridMain.getScroll().moveHorizontalScroll({ colIdx: colSeq, drawFlag: false });
        }
      }
    }
  }

  clearSearchInfo() {
    this.clearSearchMap();
    const searchMatchInfo = {
      id: '',
      rowIndex: -1,
      currentMatchIndex: -1,
      cellIndex: -1,
      matchCount: 0,
    };

    this.cfg.searchMatchInfo = searchMatchInfo;

    return searchMatchInfo;
  }

  abstract getSearchData(keyword: string, options: SearchMode): SearchResult;

  abstract getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO;

  /**
   * 현재 검색 포커스 cell 정보
   *
   * @param items check item list
   * @param matchId
   * @returns
   */
  protected setCurrentMatchInfo(currentMatchIndex: number, currentMatchInfo: CURRENT_MATCH_INFO) {
    const searchMatchInfo = this.cfg.searchMatchInfo;

    searchMatchInfo.currentMatchIndex = currentMatchIndex + currentMatchInfo.cellIndex + 1;
    searchMatchInfo.id = currentMatchInfo.id;
    searchMatchInfo.cellIndex = currentMatchInfo.cellIndex;
    searchMatchInfo.rowIndex = currentMatchInfo.rowIndex;

    this.gridMain.getDataSearch().setMatchCountText();
  }

  getCurrentMatchIndex(matchRowId: RowId) {
    return this.matchOffsetMap.get(matchRowId) ?? 0;
  }

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
  protected resolveCellIndex(
    isNext: boolean,
    sameRow: boolean,
    matchFieldLength: number,
    cellIdx: number,
    searchRowLength: number,
  ): number {
    if (!sameRow || cellIdx === -1) {
      return isNext ? 0 : matchFieldLength - 1;
    }

    const nextIndex = isNext ? cellIdx + 1 : cellIdx - 1;

    const outOfRange = isNext ? nextIndex >= matchFieldLength : nextIndex < 0;

    if (!outOfRange) {
      return nextIndex;
    }

    if (searchRowLength === 1) {
      return isNext ? 0 : matchFieldLength - 1;
    }

    return -1;
  }

  protected findMatch(
    isNext: boolean,
    checkMatchIndex: number,
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
  ): CURRENT_MATCH_INFO {
    const resultLength = searchResult.length;
    const currentCellIdx = searchMatchInfo.cellIndex;

    const searchRowLength = this.getSearchMapItemLength();

    for (let i = 0; i < resultLength; i++) {
      const searchRowIdx = isNext
        ? (checkMatchIndex + i) % resultLength
        : (checkMatchIndex - i + resultLength) % resultLength;

      const item = searchResult[searchRowIdx];
      const matchFields = this.getSearchMapItem(item.id)?.matchedFields;

      if (!matchFields?.length) continue;

      const sameRow = searchRowIdx === checkMatchIndex;

      const cellIndex = this.resolveCellIndex(isNext, sameRow, matchFields.length, currentCellIdx, searchRowLength);

      if (cellIndex < 0) continue;

      return this.createMatchInfo(item.id, searchRowIdx, cellIndex, matchFields);
    }

    return this.createFallbackMatch(resultLength, isNext, searchMatchInfo);
  }

  abstract createMatchInfo(
    matchId: RowId,
    rowIndex: number,
    cellIndex: number,
    matchedFields: MatchedField[],
  ): CURRENT_MATCH_INFO;

  private createFallbackMatch(
    resultLength: number,
    isNext: boolean,
    searchMatchInfo: SearchMatchInfo,
  ): CURRENT_MATCH_INFO {
    return {
      id: '',
      rowIndex: -1,
      cellIndex: -1,
      matchedFields: [],
    };
  }
}
