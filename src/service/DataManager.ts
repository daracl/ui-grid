import {
  ROW_HAS_CHILD_KEY,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_EXPANDED_KEY,
  ROW_HEIGHT_KEY,
  ROW_ID_KEY,
} from '@/constants';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';

type RowId = string | number;

export class DataManager {
  private originItems: any[] = [];
  private readonly rowMap = new Map<RowId, any>();
  private readonly childrenMap = new Map<RowId, any[]>();
  private readonly expandedSet = new Set<RowId>();
  private readonly idMap = new Map<RowId, RowId>();
  private viewItems: any[] = [];

  private rowHeight = 30;

  private isTreeType = false;
  private idKey = 'id';
  private pidKey = 'pid';
  private childrenKey = 'children';

  private expandDepth = 1;
  private defaultExpandedIds: RowId[] = [];

  constructor(private opts: GridOptions, private cfg: Config) {
    this.isTreeType = !!opts.tree;

    this.idKey = opts.tree?.idField ?? this.idKey;
    this.pidKey = opts.tree?.parentIdField ?? this.pidKey;
    this.childrenKey = opts.tree?.childrenField ?? this.childrenKey;

    this.expandDepth = opts.tree?.expandDepth ?? this.expandDepth;
    this.defaultExpandedIds = opts.tree?.defaultExpandedIds ?? [];

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
  public setItems(items: any[]) {
    const processedItems = this.opts.tree?.isFlatData ? this.buildTree(items) : items;

    this.originItems = this.initItems(processedItems);

    this.buildMaps();
    this.initExpandedState();
    this.buildViewItems();
  }

  // ======================
  // flat → tree
  // ======================
  private buildTree(flatItems: any[]): any[] {
    const map = new Map<RowId, any>();
    const roots: any[] = [];

    flatItems.forEach((item) => map.set(item[this.idKey], { ...item, [this.childrenKey]: [] }));

    flatItems.forEach((item) => {
      const node = map.get(item[this.idKey]);

      if (map.has(item[this.pidKey])) {
        map.get(item[this.pidKey])[this.childrenKey].push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  // ======================
  // 초기화
  // ======================
  private initItems(items: any[], depth = 0): any[] {
    return items.map((item) => {
      item[ROW_ID_KEY] = item[ROW_ID_KEY] ?? this.generateUUID();
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

  // ======================
  // Map 구성
  // ======================
  private buildMaps() {
    this.rowMap.clear();
    this.childrenMap.clear();
    this.idMap.clear();

    const traverse = (list: any[]) => {
      for (const item of list) {
        const rowId = item[ROW_ID_KEY];
        const idValue = item[this.idKey];

        this.rowMap.set(rowId, item);
        this.idMap.set(idValue, rowId);

        const children = item[this.childrenKey];

        if (children?.length) {
          this.childrenMap.set(rowId, children);
          traverse(children);
        }
      }
    };

    traverse(this.originItems);
  }

  // ======================
  // 초기 펼침 상태
  // ======================
  private initExpandedState() {
    this.expandedSet.clear();

    // O(N) → O(1)로 개선
    for (const id of this.defaultExpandedIds) {
      const rowId = this.idMap.get(id);
      if (rowId !== undefined) {
        this.expandedSet.add(rowId);
      }
    }

    // 2. depth 기반 자동 expand
    if (this.expandDepth > 0) {
      for (const item of this.rowMap.values()) {
        const depth = item[ROW_DEPTH_KEY];
        const id = item[ROW_ID_KEY];

        if (depth < this.expandDepth) {
          this.expandedSet.add(id);
        }
      }
    }

    for (const item of this.rowMap.values()) {
      const id = item[ROW_ID_KEY];
      item[ROW_EXPANDED_KEY] = this.expandedSet.has(id);
    }
  }

  // ======================
  // viewItems
  // ======================
  public buildViewItems(start = 0, end = Infinity) {
    if (!this.isTreeType) {
      this.setViewItems(this.originItems.slice(start, end));
      return;
    }

    const result: any[] = [];

    const dfs = (list: any[]) => {
      for (const item of list) {
        if (result.length >= end) break;

        result.push(item);

        const id = item[ROW_ID_KEY];

        if (this.expandedSet.has(id)) {
          const children = this.childrenMap.get(id);
          if (children) dfs(children);
        }
      }
    };

    dfs(this.originItems);

    this.setViewItems(result.slice(start, end));
  }

  public setViewItems = (items: any[]) => {
    this.viewItems = items;

    const dataInfo = this.cfg.dataInfo;
    dataInfo.rowLength = items.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;
  };

  // ======================
  // toggle
  // ======================
  public toggleRow(rowId: RowId) {
    let isExpand;
    if (this.expandedSet.has(rowId)) {
      isExpand = false;
      this.expandedSet.delete(rowId);
    } else {
      isExpand = true;
      this.expandedSet.add(rowId);
    }

    this.rowMap.get(rowId)[ROW_EXPANDED_KEY] = isExpand;

    this.buildViewItems();
  }

  public collapseAll() {
    this.expandedSet.clear();

    for (const item of this.rowMap.values()) {
      item[ROW_EXPANDED_KEY] = false;
    }

    this.buildViewItems();
  }

  public expandAll() {
    if (!this.isTreeType) return;

    for (const key of this.childrenMap.keys()) {
      this.expandedSet.add(key);
    }

    for (const item of this.rowMap.values()) {
      const id = item[ROW_ID_KEY];
      item[ROW_EXPANDED_KEY] = this.expandedSet.has(id);
    }

    this.buildViewItems();
  }

  public expandRow(id: RowId) {
    const rowId = this.idMap.get(id);
    if (rowId === undefined) return;

    this.expandedSet.add(rowId);

    this.rowMap.get(rowId)[ROW_EXPANDED_KEY] = true;

    this.buildViewItems();
  }

  // ======================
  // row 추가
  // ======================
  public addRow(parentId: RowId | null, newItem: any) {
    const item = this.initItems([newItem])[0];

    item[ROW_EXPANDED_KEY] = false;

    if (!parentId || !this.isTreeType) {
      this.originItems.push(item);
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
  public removeRow(rowId: RowId) {
    const remove = (list: any[]): any[] =>
      list.filter((item) => {
        if (item[ROW_ID_KEY] === rowId) return false;

        const children = item[this.childrenKey];
        if (children) item[this.childrenKey] = remove(children);

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
  /*
  public search(keyword: string) {
    if (!keyword) {
      // 검색 초기화
      this.initExpandedState();
      this.buildViewItems();
      return;
    }

    const lower = keyword.toLowerCase();

    const matchedSet = new Set<RowId>();
    const visibleSet = new Set<RowId>();

    this.rowMap.entries();

    // 1. match 찾기
    for (const [rowId, item] of this.rowMap.entries()) {
      const name = String(item.name ?? '').toLowerCase();

      if (name.includes(lower)) {
        matchedSet.add(rowId);

        // 2. 부모 추적
        let current = item;
        while (current) {
          const currentRowId = current[ROW_ID_KEY];
          visibleSet.add(currentRowId);

          const parentId = current[this.pidKey];
          const parentRowId = this.idMap.get(parentId);

          if (!parentRowId) break;

          current = this.rowMap.get(parentRowId);
        }
      }
    }

    // 3. expandedSet 구성 (검색 결과는 자동 펼침)
    this.expandedSet.clear();

    for (const rowId of visibleSet) {
      const children = this.childrenMap.get(rowId);
      if (children?.length) {
        this.expandedSet.add(rowId);
      }
    }

    // 4. viewItems 생성 (필터 적용 DFS)
    const result: any[] = [];

    const dfs = (list: any[]) => {
      for (const item of list) {
        const rowId = item[ROW_ID_KEY];

        if (!visibleSet.has(rowId)) continue;

        result.push(item);

        if (this.expandedSet.has(rowId)) {
          const children = this.childrenMap.get(rowId);
          if (children) dfs(children);
        }
      }
    };

    dfs(this.originItems);

    // 5. item 상태 동기화
    for (const item of this.rowMap.values()) {
      const rowId = item[ROW_ID_KEY];
      item[ROW_EXPANDED_KEY] = this.expandedSet.has(rowId);
    }

    this.setViewItems(result);
  }
    */
}
