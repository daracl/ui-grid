import {
  ALL_SELECT_VALUE,
  MATCH_WHOLE_REGEX,
  ORIGINAL_ORDER_KEY,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_HEIGHT_KEY,
  ROW_ID_FIELD_NAME,
  ROW_ITEM_PREFIX_NAME,
} from '@/constants';
import {
  AddRowOptions,
  CURRNET_MATCH_INFO,
  MatchedField,
  RowId,
  SearchMode,
  SearchResult,
  ViewItem,
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
    const matchId = this.cfg.searchMatchInfo.id;
    if (matchId) {
      for (let i = 0; i < sortData.length; i++) {
        if (sortData[i].id == matchId) {
          searchMatchInfo.matchIndex = i;
          break;
        }
      }
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

  public getMatchViewItem(rowId: RowId): ViewItem | undefined {
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
      searchMatchInfo.matchIndex = startIdx;
      searchMatchInfo.itemIndex = -1;
      this.clearMatchMap();
      searchResult = this.getSearchData(keyword, options);
      searchMatchInfo.matchCount = searchResult.matchCount;
      searchItems = searchResult.items;
    }

    let matchInfo: CURRNET_MATCH_INFO = { id: '', matchIndex: -1, itemIndex: 0, matchedInfo: [] as MatchedField[] };

    if (searchMatchInfo.matchCount > 0) {
      matchInfo = this.getMatchInfo(searchMatchInfo, searchItems);

      if (matchInfo.matchIndex == -1) {
        searchMatchInfo.matchIndex = -1;
        matchInfo = this.getMatchInfo(searchMatchInfo, searchItems);
      }
    }

    const { matchIndex, itemIndex } = matchInfo;

    let moveScrollRowIdx = -1;

    if (startIdx + insideViewRow <= matchIndex || matchIndex < startIdx) {
      if (matchIndex < insideViewRow) {
        moveScrollRowIdx = 0;
      } else {
        moveScrollRowIdx = matchIndex - (insideViewRow - Math.ceil(insideViewRow / 2));
      }
    }

    if (searchMatchInfo.matchCount > 0 && moveScrollRowIdx > -1) {
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: moveScrollRowIdx, drawFlag: false });
    }

    const matchedInfo = isArray(matchInfo.matchedInfo) ? matchInfo.matchedInfo[itemIndex] : null;

    if (matchedInfo) {
      const matchFieldInfo = this.cfg.allFieldMap.get(matchedInfo.fieldName);

      if (matchFieldInfo) {
        const colSeq = matchFieldInfo.$colSeq;

        if (matchFieldInfo.$panel == 'center' && (colSeq < insideStartCol || insideEndCol < colSeq)) {
          this.gridMain.getScroll().moveHorizontalScroll({ colIdx: colSeq, drawFlag: false });
        }
      }
    }

    searchMatchInfo.id = matchInfo.id;
    searchMatchInfo.matchIndex = matchIndex;
    searchMatchInfo.itemIndex = itemIndex;

    this.beforeKeyword = keyword;
    this.beforeSearchMode = merge({}, options);

    if (isNewSearch) {
      this.setViewItemIds(searchItems);
    }

    // 정렬이되어 있을경우 정렬 처리.
    if (this.sortOrders.length > 0) {
      this.dataSort(this.sortOrders, this.sortOpts);
    }
  }

  abstract getSearchData(keyword: string, options: SearchMode): SearchResult;

  /**
   * next match item 구하기
   *
   * @param searchMatchInfo match 정보
   * @param searchResult 검색 리스트
   * @returns
   */
  private getMatchInfo(searchMatchInfo: any, searchResult: ViewItem[]): CURRNET_MATCH_INFO {
    const currentMatchIndex = searchMatchInfo.matchIndex;
    const checkMatchIndex = currentMatchIndex == -1 ? 0 : currentMatchIndex;
    const checkItemIdx = currentMatchIndex == -1 ? -1 : searchMatchInfo.itemIndex;

    let matchIndex = -1;
    let itemIndex = -1;
    let matchId: RowId = '';
    let matchedInfo: MatchedField[] = [];

    for (let searchRowIdx = checkMatchIndex; searchRowIdx < searchResult.length; searchRowIdx++) {
      const item = searchResult[searchRowIdx];
      const itemMatchInfos = this.matchMap.get(item.id)?.matchedFields;

      if (itemMatchInfos && itemMatchInfos.length > 0) {
        matchId = item.id;
        if (checkMatchIndex == searchRowIdx) {
          const isSammeMatchLength = itemMatchInfos.length != checkItemIdx + 1;

          if (isSammeMatchLength) {
            matchIndex = searchRowIdx;
            itemIndex = checkItemIdx + 1;
          } else {
            continue;
          }
        } else {
          matchIndex = searchRowIdx;
          itemIndex = 0;
        }
        matchedInfo = itemMatchInfos;
        break;
      }
    }

    return { id: matchId, matchIndex, itemIndex, matchedInfo };
  }
}
