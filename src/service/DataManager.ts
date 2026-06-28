import { ROW_CUD_KEY, ROW_DEPTH_KEY, ROW_HEIGHT_KEY, ROW_ID_FIELD_NAME, ROW_ITEM_PREFIX_NAME } from '@/constants';
import {
  AddRowOptions,
  CURRENT_MATCH_INFO,
  MatchedField,
  RowId,
  SearchMatchInfo,
  SearchMode,
  SearchResult,
  ViewItem,
} from '@/types/Common';
import { GridOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { arrayCopy, isArray } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { merge } from '../util/utils';

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

  private sortOrders: FieldSortInfo[] = [];
  private sortOpts: SortOption;

  private readonly searchMap = new Map<RowId, ViewItem>();

  private readonly rowMap = new Map<RowId, any>();
  private readonly rowCheckSet = new Set<RowId>();

  protected readonly matchOffsetMap = new Map<RowId, number>();

  private beforeDataRowLength = -1;

  constructor(protected opts: GridOptions, protected gridMain: GridMain, protected type: string) {
    this.cfg = gridMain.config();
    this.rowHeight = this.cfg.rowHeight;
    this.rowIdField = this.cfg.rowIdField;
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
    return this.rowMap.has(id) && this.rowCheckSet.has(id);
  }

  getCheckedCount(): number {
    return this.rowCheckSet.size;
  }

  /**
   * 데이터 세팅
   * @param items
   */
  public setItems(items: any[]) {
    this.originalItems = items;
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

  protected createRowItem(item: any, depth: number): any {
    const rowIdField = this.rowIdField;
    const rowId = item[rowIdField] ?? this.generateUUID();

    if (!item[rowIdField]) {
      item[rowIdField] = rowId;
    }

    if (this.rowIdField != ROW_ID_FIELD_NAME) {
      item[ROW_ID_FIELD_NAME] = rowId;
    }

    item[ROW_DEPTH_KEY] = depth;
    item[ROW_CUD_KEY] = 'R';
    item[ROW_HEIGHT_KEY] = this.rowHeight;

    return item;
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
  public setViewItems(ids: ViewItem[], start?: number, end?: number) {
    const viewItemIds = ids;
    this.viewItems = viewItemIds;

    const dataInfo = this.cfg.dataInfo;

    dataInfo.rowLength = viewItemIds.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;

    if (this.beforeDataRowLength != -1 && this.beforeDataRowLength !== dataInfo.rowLength) {
      this.gridMain.calcBody();
      this.gridMain.refreshBody(false, 'search');
    }

    this.beforeDataRowLength = dataInfo.rowLength;
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

      const filteredItem: Record<string, any> = {};

      for (const key in item) {
        if ((rowIdInclude && key === ROW_ID_FIELD_NAME) || !key.startsWith(ROW_ITEM_PREFIX_NAME)) {
          filteredItem[key] = item[key];
        }
      }

      results[i] = filteredItem;
    }

    return results;
  }

  public getDataType() {
    return this.type;
  }

  /**
   * row 추가
   * @param addOpts add options
   */
  public abstract addRows(addOpts: AddRowOptions): void;

  /**
   * row 삭제
   * @param ids 삭제할 row id 배열
   * @returns 삭제된 row id 배열
   */
  public abstract removeRows(ids: RowId[]): RowId[];

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
    const beforeRowLength = this.cfg.dataInfo.rowLength;
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
        cellIndex: 0,
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
    if (!sameRow) {
      return isNext ? 0 : matchFieldLength - 1;
    }

    if (cellIdx === -1) return matchFieldLength - 1;

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
