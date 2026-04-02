import { ROW_CUD_KEY, ROW_DEPTH_KEY, ROW_HEIGHT_KEY, ROW_ID_KEY } from './constants';
import { Config } from './types/GridConfig';
import { GridOptions } from './types/GridOptions';
type RowId = string | number;

export class DataManager {
  private originItems: any[] = [];
  private rowMap = new Map<RowId, any>(); // rowId → node
  private childrenMap = new Map<RowId, any[]>(); // rowId → children
  private expandedSet = new Set<RowId>(); // 열린 노드
  private viewItems: any[] = []; // 현재 UI 표시 데이터
  private rowHeight = 30;

  private isTreeType = false; // 트리 여부
  private idKey = 'id';
  private pidKey = 'pid';

  constructor(private opts: GridOptions, private cfg: Config) {
    this.isTreeType = cfg.isTreeType;
    this.idKey = cfg.tree?.idKey ?? this.idKey;
    this.pidKey = cfg.tree?.pidKey ?? this.pidKey;
    this.rowHeight = cfg.rowHeight ?? 30;
  }

  // ======================
  // UUID
  // ======================
  private generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16));
  }

  // ======================
  // 데이터 세팅
  // ======================
  public setData(items: any[]) {
    const processedItems = this.isTreeType ? this.buildTree(items) : items;
    this.originItems = this.initItems(processedItems);
    this.buildMaps();
    this.buildViewItems();
  }

  // ======================
  // 트리 변환 (flat → nested)
  // ======================
  private buildTree(flatData: any[]): any[] {
    const map = new Map<RowId, any>();
    const roots: any[] = [];

    flatData.forEach((item) => map.set(item[this.idKey], { ...item, children: [] }));
    flatData.forEach((item) => {
      const node = map.get(item[this.idKey]);
      if (item[this.pidKey] === '0' || !map.has(item[this.pidKey])) {
        roots.push(node);
      } else {
        map.get(item[this.pidKey]).children.push(node);
      }
    });

    return roots;
  }

  // ======================
  // 초기화: depth, UUID, rowHeight
  // ======================
  private initItems(items: any[], depth = 0): any[] {
    return items.map((item) => {
      const newItem = { ...item };

      newItem[this.idKey] = newItem[this.idKey] ?? this.generateUUID();
      newItem[ROW_ID_KEY] = newItem[ROW_ID_KEY] ?? newItem[this.idKey];
      newItem[ROW_DEPTH_KEY] = depth;
      newItem[ROW_CUD_KEY] = 'R';
      newItem[ROW_HEIGHT_KEY] = this.rowHeight;

      if (newItem.children?.length) {
        newItem.children = this.initItems(newItem.children, depth + 1);
      }

      return newItem;
    });
  }

  // ======================
  // rowMap, childrenMap 생성
  // ======================
  private buildMaps() {
    this.rowMap.clear();
    this.childrenMap.clear();

    const traverse = (list: any[]) => {
      for (const item of list) {
        this.rowMap.set(item[ROW_ID_KEY], item);
        if (item.children?.length) {
          this.childrenMap.set(item[ROW_ID_KEY], item.children);
          traverse(item.children);
        }
      }
    };

    traverse(this.originItems);
  }

  // ======================
  // viewItems 계산
  // ======================
  public buildViewItems(start = 0, end = Infinity) {
    if (!this.isTreeType) {
      // 트리 아닌 일반 배열은 그대로 slice
      this.viewItems = this.originItems.slice(start, end);
      return;
    }

    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const item of list) {
        if (result.length >= end) break;
        result.push(item);
        if (this.expandedSet.has(item[ROW_ID_KEY])) {
          const children = this.childrenMap.get(item[ROW_ID_KEY]);
          if (children) dfs(children);
        }
      }
    };

    dfs(this.originItems);
    this.viewItems = result.slice(start, end);
  }

  // ======================
  // 펼침/접기
  // ======================
  public toggleRow(rowId: RowId) {
    this.expandedSet.has(rowId) ? this.expandedSet.delete(rowId) : this.expandedSet.add(rowId);
    this.buildViewItems();
  }

  public collapseAll() {
    this.expandedSet.clear();
    this.buildViewItems();
  }

  public expandAll() {
    if (!this.isTreeType) return;
    for (const key of this.childrenMap.keys()) this.expandedSet.add(key);
    this.buildViewItems();
  }

  // ======================
  // row 추가
  // ======================
  public addRow(parentId: RowId | null, newItem: any) {
    const item = this.initItems([newItem])[0];

    if (!parentId || !this.isTreeType) {
      this.originItems.push(item);
    } else {
      const parent = this.rowMap.get(parentId);
      if (!parent) return;
      parent.children = parent.children || [];
      parent.children.push(item);
    }

    this.buildMaps();
    this.buildViewItems();
  }

  // ======================
  // row 삭제
  // ======================
  public removeRow(rowId: RowId) {
    const remove = (list: any[]): any[] =>
      list.filter((item) => {
        if (item[ROW_ID_KEY] === rowId) return false;
        if (item.children) item.children = remove(item.children);
        return true;
      });

    this.originItems = remove(this.originItems);
    this.expandedSet.delete(rowId);

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

  public getRow(rowId: RowId) {
    return this.rowMap.get(rowId);
  }
}
