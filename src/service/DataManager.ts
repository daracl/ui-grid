import { ROW_CUD_KEY, ROW_DEPTH_KEY, ROW_HEIGHT_KEY } from '@/constants';
import { OptionCallback, SearchMode } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { arrayCopy, multiSort } from '@/util/utils';

export type RowId = string | number;

export abstract class DataManager {
  private viewItems: any[] = [];

  protected readonly matchWholeRegex?: RegExp;

  protected readonly rowHeight;
  protected readonly rowIdField;

  private originalItems: any[] = [];
  private currentItems: any[] = [];

  private sortBaseItems: any[] = [];

  private readonly rowMap = new Map<RowId, any>();
  private readonly rowCheckSet = new Set<RowId>();

  constructor(protected opts: GridOptions, protected cfg: Config) {
    this.rowHeight = cfg.rowHeight;
    this.rowIdField = cfg.rowIdField;
    this.matchWholeRegex = opts.search?.matchWholeRegex;
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
    return this.rowCheckSet.has(item[this.rowIdField]);
  }

  getCheckedCount(): number {
    return this.rowCheckSet.size;
  }

  // ======================
  // 데이터 세팅
  // ======================
  public setItems(items: any[]) {
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
    isShift: boolean,
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

  // ======================
  // 초기화
  // ======================
  protected initItems(items: any[], depth = 0): any[] {
    return items.map((item) => {
      item[this.rowIdField] = item[this.rowIdField] ?? this.generateUUID();
      item[ROW_DEPTH_KEY] = depth;
      item[ROW_CUD_KEY] = 'R';
      item[ROW_HEIGHT_KEY] = this.rowHeight;

      return item;
    });
  }

  public setViewItems = (items: any[], start?: number, end?: number) => {
    const viewItems = arrayCopy(items, start, end);
    this.viewItems = viewItems;

    const dataInfo = this.cfg.dataInfo;
    dataInfo.rowLength = viewItems.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;
  };

  // ======================
  // row 추가
  // ======================
  public abstract addRow(newItem: any): void;

  // ======================
  // row 삭제
  // ======================
  public abstract removeRows(ids: RowId[]): RowId[];

  // ======================
  // getter
  // ======================
  public getViewItems() {
    return this.viewItems;
  }

  public getOriginalItems() {
    return this.originalItems;
  }

  public getCurrentItems() {
    return this.currentItems;
  }

  public getRowItem(rowId: RowId) {
    return this.rowMap.get(rowId);
  }

  abstract search(keyword: string, options: SearchMode): any[];
}
