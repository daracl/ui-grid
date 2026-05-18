import {
  ALL_SELECT_VALUE,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_EXPANDED_KEY,
  ROW_HAS_CHILD_KEY,
  ROW_HEIGHT_KEY,
} from '@/constants';
import { OptionCallback, SearchMode } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { arrayCopy, multiSort, sortTreeByLevel } from '@/util/utils';

type RowId = string | number;

export abstract class DataManager {
  private viewItems: any[] = [];

  private readonly matchWholeRegex?: RegExp;

  private readonly rowHeight;
  private readonly rowIdField;

  private originItems: any[] = [];
  private currentItems: any[] = [];

  private sortOrginItems: any[] = [];

  private readonly rowCheckSet = new Set<RowId>();

  constructor(opts: GridOptions, cfg: Config) {
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
    this.originItems = items;
    this.currentItems = items;
  }

  dataSort(
    isShift: boolean,
    sortOrders: FieldSortInfo[],
    sortOpts: { enabled: boolean; nullsLast: boolean; customSorting: boolean | OptionCallback },
  ) {
    if (this.sortOrginItems.length == 0) {
      this.sortOrginItems = arrayCopy(this.getViewItems());
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
      this.setViewItems(this.sortOrginItems);
      this.sortOrginItems = [];
    }
  }

  // ======================
  // 초기화
  // ======================
  private initItems(items: any[], depth = 0): any[] {
    return items.map((item) => {
      item[this.rowIdField] = item[this.rowIdField] ?? this.generateUUID();
      item[ROW_DEPTH_KEY] = depth;
      item[ROW_CUD_KEY] = 'R';
      item[ROW_HEIGHT_KEY] = this.rowHeight;

      const children = item[this.childrenKey];

      if (children?.length) {
        item[ROW_HAS_CHILD_KEY] = true;
        item[this.childrenKey] = this.initItems(children, depth + 1);
      }

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
  public addRow(parentId: RowId | null, newItem: any) {
    const item = this.initItems([newItem])[0];

    item[ROW_EXPANDED_KEY] = false;

    if (!parentId || !this.isTreeType) {
      this.currentItems.push(item);
    } else {
      const parent = this.rowMap.get(parentId);
      if (!parent) return;

      parent[this.childrenKey] = parent[this.childrenKey] || [];
      parent[this.childrenKey].push(item);
    }

    this.buildMaps();
    this.buildViewItems();
  }

  // ======================
  // row 삭제
  // ======================
  public removeRow(ids: RowId[]) {
    const cfg = this.cfg;

    const currentItems = this.currentItems;
    for (const item of currentItems) {
      if (ids.length < 1) break;

      const index = ids.indexOf(item[cfg.rowIdField]);

      if (index !== -1) {
        this.expandedSet.delete(ids[index]);
        ids.splice(index, 1); // 인덱스 위치에서 1개 요소 삭제
        item[ROW_CUD_KEY] = 'D';
      }
    }

    this.currentItems = currentItems;

    this.buildMaps();
    this.buildViewItems();
  }

  // ======================
  // getter
  // ======================
  public getViewItems() {
    return this.viewItems;
  }

  public getOriginItems() {
    return this.originItems;
  }

  public getCurrentItems() {
    return this.currentItems;
  }

  public getRow(rowId: RowId) {
    return this.rowMap.get(rowId);
  }

  abstract search(keyword: string, options: SearchMode);
}
