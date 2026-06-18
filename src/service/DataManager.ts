import {
  ALL_SELECT_VALUE,
  MATCH_WHOLE_REGEX,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_HEIGHT_KEY,
  ROW_ID_FIELD_NAME,
  ROW_ITEM_PREFIX_NAME,
} from '@/constants';
import {
  AddRowOptions,
  CURRNET_MATCH_INFO,
  RowId,
  SearchMatchInfo,
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
  protected readonly matchWholeRegex?: RegExp;

  protected readonly rowHeight;
  protected readonly rowIdField;

  protected readonly cfg;

  private originalItems: any[] = [];
  private originalViewItems: ViewItem[] = [];

  private viewItems: ViewItem[] = [];

  private sortBaseItems: any[] = [];
  private readonly defaultSearchOpts: SearchOptions;

  private beforeKeyword: string;
  private beforeSearchMode: SearchMode;
  private beforeSearchSortInfo: string;

  private sortOrders: FieldSortInfo[] = [];
  private sortOpts: SortOption;

  private readonly searchMap = new Map<RowId, ViewItem>();

  private readonly rowMap = new Map<RowId, any>();
  private readonly rowCheckSet = new Set<RowId>();

  protected readonly matchOffsetMap = new Map<RowId, number>();

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
      this.setViewItems(this.opts.header.sort.customSorting(this.getRowItems(true), sortArr, sortOpts));
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

  public getRowItem(rowId: RowId): any {
    return this.rowMap.get(rowId);
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
        cellIndex: 0,
      } as CURRNET_MATCH_INFO);
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

    //this.setCurrentMatchInfo(this.getViewItems(), matchInfo.id, matchInfo.itemIndex);
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

  abstract getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRNET_MATCH_INFO;

  /**
   * 현재 검색 포커스 cell 정보
   *
   * @param items check item list
   * @param matchId
   * @returns
   */
  protected setCurrentMatchInfo(currentMatchIndex: number, currentMatchInfo: CURRNET_MATCH_INFO) {
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
}
