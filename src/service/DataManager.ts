import { ALL_SELECT_VALUE, ROW_CUD_KEY, ROW_DEPTH_KEY, ROW_HEIGHT_KEY } from '@/constants';
import { OptionCallback, RowId, SearchMode, AddRowOptions } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions, SearchOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { arrayCopy, multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { merge } from '../util/utils';

export abstract class DataManager {
  private viewItems: any[] = [];

  protected readonly matchWholeRegex?: RegExp;

  protected readonly rowHeight;
  protected readonly rowIdField;

  protected readonly cfg;

  private readonly searchOpts: SearchOptions;

  private originalItems: any[] = [];
  private currentItems: any[] = [];

  private sortBaseItems: any[] = [];
  private defaultSearchOpts: SearchOptions;

  private readonly rowMap = new Map<RowId, any>();
  private readonly rowCheckSet = new Set<RowId>();

  constructor(protected opts: GridOptions, protected gridMain: GridMain, protected type: string) {
    this.cfg = gridMain.config();
    this.searchOpts = opts.search;
    this.rowHeight = this.cfg.rowHeight;
    this.rowIdField = this.cfg.rowIdField;

    this.defaultSearchOpts = merge(
      {},
      {
        matchCase: false,
        matchWholeWord: false,
        useRegex: false,
        searchFields: ALL_SELECT_VALUE,
        matchWholeRegex: /[ㄱ-ㅎ가-힣a-zA-Z0-9_]+/g,
        hideNonMatched: false,
      },
      opts.search,
    );

    console.log('this.rowIdField ', this.rowIdField);
  }

  // ======================
  // UUID
  // ======================
  protected generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16));
  }

  /**
   * 전체 체크 설정
   */
  public setAllCheck() {
    for (const item of this.getViewItems()) {
      this.rowCheckSet.add(item[this.rowIdField]);
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
  public setItemChecked(item: any, checked: boolean) {
    const rowId = item[this.rowIdField];

    if (checked) {
      this.rowCheckSet.add(rowId);
    } else {
      this.rowCheckSet.delete(rowId);
    }
  }

  /**
   * 특정 아이템이 체크되어 있는지 여부 반환
   * @param item 체크 여부를 확인할 아이템
   * @returns 체크 여부
   */
  public isItemChecked(item: any): boolean {
    return item[this.rowIdField] && this.rowCheckSet.has(item[this.rowIdField]);
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
    return items.map((item) => {
      this.createRowItem(item, depth);

      this.setRowItem(item[this.rowIdField], item);

      return item;
    });
  }

  /**
   * 데이터 세팅
   * @param items
   */
  public setItems(items: any[]) {
    this.clearRowMap();
    this.originalItems = items;
    this.currentItems = items;
  }

  protected getSortBaseItems() {
    return this.sortBaseItems;
  }

  protected setSortBaseItems(items: any[]) {
    this.sortBaseItems = items;
  }

  dataSort(
    sortOrders: FieldSortInfo[],
    sortOpts: { enabled: boolean; nullsLast: boolean; customSorting: boolean | OptionCallback },
  ) {
    if (this.sortBaseItems.length == 0) {
      this.setSortBaseItems(arrayCopy(this.getViewItems()));
    }

    if (sortOrders.length > 0) {
      const sortArr = Array.from(sortOrders);

      sortArr.forEach((item) => {
        if (item.field.getValue) {
          item.isValue = true;
        }
      });

      this.setViewItems(multiSort(this.getViewItems(), sortArr, sortOpts.nullsLast));
    } else {
      this.setViewItems(this.getSortBaseItems());
      this.setSortBaseItems([]);
    }
  }

  protected createRowItem(item: any, depth: number): any {
    item[this.rowIdField] = item[this.rowIdField] ?? this.generateUUID();
    item[ROW_DEPTH_KEY] = depth;
    item[ROW_CUD_KEY] = 'R';
    item[ROW_HEIGHT_KEY] = this.rowHeight;

    return item;
  }

  public setViewItems(items: any[], start?: number, end?: number) {
    const viewItems = arrayCopy(items, start, end);
    this.viewItems = viewItems;

    const dataInfo = this.cfg.dataInfo;

    const beforeDataRowLength = dataInfo.rowLength;

    dataInfo.rowLength = viewItems.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;

    if (beforeDataRowLength !== dataInfo.rowLength) {
      this.gridMain.calcBody();
    }
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
   * grid 표시 데이터 얻기
   * @returns
   */
  public getViewItems() {
    return this.viewItems;
  }

  /**
   * 원본 데이터 얻기
   * @returns
   */
  public getOriginalItems() {
    return this.originalItems;
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

  protected getRowItem(rowId: RowId) {
    return this.rowMap.get(rowId);
  }

  protected getRowMap() {
    return this.rowMap;
  }

  protected setRowItem(rowId: RowId, item: any) {
    this.rowMap.set(rowId, item);
  }

  public search(keyword: string, options: SearchMode) {
    if (this.matchWholeRegex) options.matchWholeRegex = this.matchWholeRegex;

    options = merge({}, this.defaultSearchOpts, options);
    this.setViewItems(this.getSearchData(keyword, options));
  }

  abstract getSearchData(keyword: string, options: SearchMode): any[];
}
