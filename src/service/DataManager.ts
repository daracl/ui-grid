import {
  ALL_SELECT_VALUE,
  MATCH_WHOLE_REGEX,
  ORIGINAL_ORDER_KEY,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_HEIGHT_KEY,
  ROW_ID_FIELD_NAME,
  ROW_ITEM_PREFIX_NAME,
  SearchDirectionMap,
} from '@/constants';
import {
  AddRowOptions,
  CURRNET_MATCH_INFO,
  MatchedField,
  RowId,
  SearchMode,
  SearchResult,
  ViewItem,
  SearchMatchInfo,
} from '@/types/Common';
import { GridOptions, SearchOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { arrayCopy, isArray } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { merge } from '../util/utils';

export abstract class DataManager {
  private viewItems: ViewItem[] = [];

  protected readonly matchWholeRegex?: RegExp;

  protected readonly rowHeight;
  protected readonly rowIdField;

  protected readonly cfg;

  private originalItems: any[] = [];
  private currentItems: any[] = [];

  private sortBaseItems: any[] = [];
  private readonly defaultSearchOpts: SearchOptions;

  private beforeKeyword: string;
  private beforeSearchMode: SearchMode;

  private sortOrders: FieldSortInfo[] = [];
  private sortOpts: SortOption;

  private readonly matchMap = new Map<RowId, ViewItem>();

  private readonly rowMap = new Map<RowId, any>();
  private readonly rowCheckSet = new Set<RowId>();

  constructor(protected opts: GridOptions, protected gridMain: GridMain, protected type: string) {
    this.cfg = gridMain.config();
    this.rowHeight = this.cfg.rowHeight;
    this.rowIdField = this.cfg.rowIdField;

    this.defaultSearchOpts = merge(
      {
        matchCase: false,
        matchWholeWord: false,
        useRegex: false,
        searchFields: ALL_SELECT_VALUE,
        matchWholeRegex: MATCH_WHOLE_REGEX,
        hideNonMatched: false,
      },
      opts.search,
    );
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
   * init item
   * @param items items
   * @param depth depth
   * @returns
   */
  protected initItems(items: any[], depth = 0): any[] {
    let orderIdx = 0;
    const viewItems: ViewItem[] = [];

    this.clearRowMap();

    items.forEach((item) => {
      this.createRowItem(item, depth);
      item[ORIGINAL_ORDER_KEY] = orderIdx++;

      const rowId = item[ROW_ID_FIELD_NAME];
      viewItems.push({
        id: rowId,
      });
      this.setRowItem(rowId, item);
    });

    return viewItems;
  }

  /**
   * 데이터 세팅
   * @param items
   */
  public setItems(items: any[]) {
    this.originalItems = items;
    this.setCurrentItems(items);
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
      this.setViewItemIds(this.opts.header.sort.customSorting(this.getRowItems(true), sortArr, sortOpts));
      return;
    }

    const sortData = this.getSortData(sortArr, sortOpts);
    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id;

    if (matchId) {
      this.setCurrentMatchIndex(sortData, matchId);

      this.gridMain.getDataSearch().setMatchCountText();
    }

    this.setViewItemIds(sortData);
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
  public setViewItemIds(ids: ViewItem[], start?: number, end?: number) {
    const viewItemIds = arrayCopy(ids, start, end);
    this.viewItems = viewItemIds;

    const dataInfo = this.cfg.dataInfo;

    const beforeDataRowLength = dataInfo.rowLength;

    dataInfo.rowLength = viewItemIds.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;

    if (beforeDataRowLength !== dataInfo.rowLength) {
      this.gridMain.calcBody();
    }
  }

  public convertViewItemsToRowItems() {
    const results = [];

    for (const viewItem of this.getViewItems()) {
      const item = this.getRowItem(viewItem.id);
      results.push(item);
    }

    return results;
  }

  public getRowItems(rowIdInclude = false) {
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

  public setCurrentItems(items: any[]) {
    this.currentItems = items;
  }
  /**
   * 현재 데이터 얻기
   * @returns
   */
  public getCurrentItems() {
    return this.currentItems;
  }

  protected clearRowMap() {
    this.rowMap.clear();
  }

  /**
   *clear search match map
   */
  protected clearMatchMap() {
    this.matchMap.clear();
  }

  protected addMatchMap(id: RowId, viewItem: ViewItem) {
    this.matchMap.set(id, viewItem);
  }

  public getMatchMap(rowId: RowId): ViewItem | undefined {
    return this.matchMap.get(rowId);
  }

  public getRowItem(rowId: RowId): any {
    return this.rowMap.get(rowId);
  }

  public getRowMap() {
    return this.rowMap;
  }

  protected setRowItem(rowId: RowId, item: any) {
    this.rowMap.set(rowId, item);
  }

  public search(keyword: string, options: SearchMode) {
    if (this.matchWholeRegex) options.matchWholeRegex = this.matchWholeRegex;

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.cfg.currentFields
        .filter((item) => !item.$isAside)
        .map((item) => {
          return item.name;
        });
    }

    options = merge({}, this.defaultSearchOpts, options);

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

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const { startIdx, insideViewRow, insideStartCol, insideEndCol } = this.cfg.scroll;

    let searchResult: SearchResult;
    let searchItems;
    let isNewSearch = false;
    if (this.beforeKeyword == keyword && isSameSearchOpts) {
      searchItems = this.getViewItems();
    } else {
      isNewSearch = true;
      searchMatchInfo.id = '';
      searchMatchInfo.currentMatchIndex = -1;
      searchMatchInfo.matchRowIndex = startIdx;
      searchMatchInfo.itemIndex = -1;
      this.clearMatchMap();
      searchResult = this.getSearchData(keyword, options);
      searchMatchInfo.matchCount = searchResult.matchCount;
      searchItems = searchResult.items;
    }

    if (isNewSearch) {
      this.setViewItemIds(searchItems);
    }

    // 정렬 처리
    if (this.sortOrders.length > 0) {
      this.dataSort(this.sortOrders, this.sortOpts);
    }

    let matchInfo: CURRNET_MATCH_INFO = { id: '', matchRowIndex: -1, itemIndex: 0, matchedInfo: [] as MatchedField[] };

    if (searchMatchInfo.matchCount > 0) {
      matchInfo = this.getMatchInfo(searchMatchInfo, this.getViewItems(), options);

      if (matchInfo.matchRowIndex == -1) {
        searchMatchInfo.matchRowIndex = -1;
        matchInfo = this.getMatchInfo(searchMatchInfo, this.getViewItems(), options);
      }
    }

    const { matchRowIndex, itemIndex } = matchInfo;

    let moveScrollRowIdx = -1;

    if (startIdx + insideViewRow <= matchRowIndex || matchRowIndex < startIdx) {
      if (matchRowIndex < insideViewRow) {
        moveScrollRowIdx = 0;
      } else {
        moveScrollRowIdx = matchRowIndex - (insideViewRow - Math.ceil(insideViewRow / 2));
      }
      if (moveScrollRowIdx > -1) {
        this.gridMain.getScroll().moveVerticalScroll({ rowIdx: moveScrollRowIdx, drawFlag: false });
      }
    }

    if (matchInfo.matchedInfo?.length > 0) {
      const matchedInfo = matchInfo.matchedInfo[itemIndex];
      const matchFieldInfo = this.cfg.allFieldMap.get(matchedInfo.fieldName);

      if (matchFieldInfo) {
        const colSeq = matchFieldInfo.$colSeq;

        if (matchFieldInfo.$panel == 'center' && (colSeq < insideStartCol || insideEndCol < colSeq)) {
          this.gridMain.getScroll().moveHorizontalScroll({ colIdx: colSeq, drawFlag: false });
        }
      }
    }

    searchMatchInfo.id = matchInfo.id;
    searchMatchInfo.matchRowIndex = matchRowIndex;
    searchMatchInfo.itemIndex = itemIndex;

    this.beforeKeyword = keyword;
    this.beforeSearchMode = merge({}, options);
  }

  abstract getSearchData(keyword: string, options: SearchMode): SearchResult;

  private getMatchInfo(
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
    options: SearchMode,
  ): CURRNET_MATCH_INFO {
    const isPrev = options.direction === SearchDirectionMap.PREV;

    const currentMatchInfo = isPrev
      ? this.getPrevMatch(searchMatchInfo, searchResult)
      : this.getNextMatch(searchMatchInfo, searchResult);

    this.setCurrentMatchIndex(searchResult, currentMatchInfo.id);

    return currentMatchInfo;
  }

  /**
   * 현재 검색 포커스 cell 정보
   *
   * @param items check item list
   * @param matchId
   * @returns
   */
  private setCurrentMatchIndex(items: ViewItem[], matchId: RowId) {
    let currentMatchIndex = 0;
    let matchRowIndex = -1;
    for (let i = 0; i < items.length; i++) {
      const id = items[i].id;

      if (id == matchId) {
        matchRowIndex = i;
        break;
      }

      currentMatchIndex += this.getMatchMap(id)?.matchedFields?.length ?? 0;
    }

    this.cfg.searchMatchInfo.currentMatchIndex = currentMatchIndex;
    this.cfg.searchMatchInfo.matchRowIndex = matchRowIndex;
  }

  /**
   * 검색 다음 찾기
   * @param searchMatchInfo 검색 정보
   * @param searchResult 검색 결과
   * @returns
   */
  private getNextMatch(searchMatchInfo: SearchMatchInfo, searchResult: ViewItem[]): CURRNET_MATCH_INFO {
    const currentMatchRowIndex = searchMatchInfo.matchRowIndex;
    const checkMatchIndex = currentMatchRowIndex === -1 ? 0 : currentMatchRowIndex;
    const checkItemIdx = currentMatchRowIndex === -1 ? -1 : searchMatchInfo.itemIndex;

    let matchRowIndex = -1;
    let itemIndex = -1;
    let matchId: RowId = '';
    let matchedInfo: MatchedField[] = [];

    for (let searchRowIdx = checkMatchIndex; searchRowIdx < searchResult.length; searchRowIdx++) {
      const item = searchResult[searchRowIdx];
      const itemMatchInfos = this.getMatchMap(item.id)?.matchedFields;

      if (!itemMatchInfos?.length) continue;

      matchId = item.id;

      if (searchRowIdx === checkMatchIndex) {
        const nextItemIdx = checkItemIdx + 1;

        if (checkItemIdx === -1 || nextItemIdx < itemMatchInfos.length) {
          matchRowIndex = searchRowIdx;
          itemIndex = checkItemIdx === -1 ? 0 : nextItemIdx;
          matchedInfo = itemMatchInfos;
          break;
        }

        continue;
      }

      matchRowIndex = searchRowIdx;
      itemIndex = 0;
      matchedInfo = itemMatchInfos;
      break;
    }

    return { id: matchId, matchRowIndex: matchRowIndex, itemIndex, matchedInfo };
  }

  /**
   * 검색 이전 찾기
   * @param searchMatchInfo 검색 정보
   * @param searchResult 검색 결과
   * @returns
   */
  private getPrevMatch(searchMatchInfo: SearchMatchInfo, searchResult: ViewItem[]): CURRNET_MATCH_INFO {
    const currentMatchRowIndex = searchMatchInfo.matchRowIndex;
    const checkMatchIndex = currentMatchRowIndex === -1 ? searchResult.length - 1 : currentMatchRowIndex;
    const checkItemIdx = currentMatchRowIndex === -1 ? -1 : searchMatchInfo.itemIndex;

    let matchIndex = -1;
    let itemIndex = -1;
    let matchId: RowId = '';
    let matchedInfo: MatchedField[] = [];

    for (let searchRowIdx = checkMatchIndex; searchRowIdx >= 0; searchRowIdx--) {
      const item = searchResult[searchRowIdx];
      const itemMatchInfos = this.getMatchMap(item.id)?.matchedFields;

      if (!itemMatchInfos?.length) continue;

      matchId = item.id;

      // 같은 row 내부 처리
      if (searchRowIdx === checkMatchIndex) {
        const prevItemIdx = checkItemIdx === -1 ? itemMatchInfos.length - 1 : checkItemIdx - 1;

        // 핵심 수정: boundary 처리 강화
        if (prevItemIdx >= 0) {
          matchIndex = searchRowIdx;
          itemIndex = prevItemIdx;
          matchedInfo = itemMatchInfos;
          break;
        }

        // 이 row에서는 더 이상 없음 → 이전 row로 넘어감
        continue;
      }

      // 다른 row로 이동했을 때는 항상 "마지막 match"부터
      matchIndex = searchRowIdx;
      itemIndex = itemMatchInfos.length - 1;
      matchedInfo = itemMatchInfos;
      break;
    }

    return {
      id: matchId,
      matchRowIndex: matchIndex,
      itemIndex,
      matchedInfo,
    };
  }
}
