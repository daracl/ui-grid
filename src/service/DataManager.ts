import {
  ROW_HAS_CHILD_KEY,
  ROW_CUD_KEY,
  ROW_DEPTH_KEY,
  ROW_EXPANDED_KEY,
  ROW_HEIGHT_KEY,
  ROW_ID_KEY,
  ALL_SELECT_VALUE,
} from '@/constants';
import { OptionCallback, SearchMode } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { multiSort } from '@/util/utils';
import { arrayCopy } from '../util/utils';

type RowId = string | number;

export class DataManager {
  private originItems: any[] = [];
  private readonly rowMap = new Map<RowId, any>();
  private readonly childrenMap = new Map<RowId, any[]>();
  private readonly expandedSet = new Set<RowId>();
  private readonly idMap = new Map<RowId, RowId>();
  private viewItems: any[] = [];

  private sortOrginItems: any[] = [];

  private rowHeight;

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

    this.rowHeight = cfg.rowHeight;
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

  dataSort(
    isShift: boolean,
    sortOrders: FieldSortInfo[],
    sortOpts: { enabled: boolean; nullsLast: boolean; customSorting: boolean | OptionCallback },
  ) {
    if (this.sortOrginItems.length == 0) {
      this.sortOrginItems = arrayCopy(this.getViewItems());
    }
    if (sortOrders.length > 0) {
      this.setViewItems(multiSort(this.getViewItems(), sortOrders, sortOpts.nullsLast));
    } else {
      this.setViewItems(this.sortOrginItems);
      this.sortOrginItems = [];
    }
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
      this.setViewItems(this.originItems, start, end);
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

    this.setViewItems(result, start, end);
  }

  public setViewItems = (items: any[], start?: number, end?: number) => {
    const viewItems = arrayCopy(items, start, end);
    this.viewItems = viewItems;

    const dataInfo = this.cfg.dataInfo;
    dataInfo.rowLength = viewItems.length;
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

  search(keyword: string, options: SearchMode) {
    const gridValue = [...this.rowMap.values()];

    if (!keyword.trim()) {
      this.setViewItems(gridValue);
      return;
    }

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.cfg.currentFields
        .filter((item) => !item.$isAside)
        .map((item) => {
          return item.name;
        });
    }

    const searchResults = gridDataSearch(gridValue, keyword, options);

    //console.log('searchResults : ', this.isTreeType, searchResults);

    if (!this.isTreeType) {
      this.setViewItems(searchResults);
      return;
    }

    // 트리 형태로 다시 구성
    const tree = this.buildSearchedTree(this.originItems, searchResults);

    // flatten for view cache
    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const node of list) {
        result.push(node);
        if (node[this.childrenKey]?.length) {
          dfs(node[this.childrenKey]);
        }
      }
    };
    dfs(tree);

    this.setViewItems(result);
  }

  buildSearchedTree(originTree: any[], searchResults: any[]): any[] {
    const idKey = this.idKey;
    const parentKey = this.pidKey;
    const childrenKey = this.childrenKey;

    // 1) Flat index from origin tree
    const nodeMap = new Map<any, any>();
    const flatList: any[] = [];

    const dfsFlat = (nodes: any[]) => {
      for (const n of nodes) {
        flatList.push(n);
        nodeMap.set(n[idKey], n);
        if (n[childrenKey]?.length) dfsFlat(n[childrenKey]);
      }
    };
    dfsFlat(originTree);

    // 2) 검색된 노드 ID set
    const matchedIds = new Set(searchResults.map((item) => item[idKey]));

    // 3) 검색된 노드의 모든 조상 포함
    const visibleIds = new Set<any>();

    const addWithParents = (id: any) => {
      if (!id || visibleIds.has(id)) return;
      visibleIds.add(id);

      const node = nodeMap.get(id);
      if (node && node[parentKey]) addWithParents(node[parentKey]);
    };

    for (const id of matchedIds) addWithParents(id);

    // 4) 트리 재구성(O(n))
    const rebuildTree = (nodes: any[]): any[] => {
      const result: any[] = [];
      for (const n of nodes) {
        if (!visibleIds.has(n[idKey])) continue;

        const clone = { ...n };
        if (n[childrenKey]?.length) {
          clone[childrenKey] = rebuildTree(n[childrenKey]);
        } else {
          clone[childrenKey] = [];
        }
        result.push(clone);
      }
      return result;
    };

    return rebuildTree(originTree);
  }
}
