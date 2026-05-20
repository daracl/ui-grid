import { ALL_SELECT_VALUE, ROW_DEPTH_KEY, ROW_EXPANDED_KEY, ROW_HAS_CHILD_KEY } from '@/constants';
import { AddRowOptions, OptionCallback, RowId, SearchMode } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { sortTreeByLevel } from '@/util/utils';
import { DataManager } from './DataManager';
import { GridMain } from '../view/GridMain';

export class TreeDataManager extends DataManager {
  private readonly childrenMap = new Map<RowId, any[]>();
  private readonly expandedSet = new Set<RowId>();
  private readonly idMap = new Map<RowId, RowId>();

  private readonly idKey: string;
  private readonly pidKey: string;
  private readonly childrenKey: string;

  private readonly expandDepth: number;
  private defaultExpandedIds: RowId[] = [];

  private orginTreeItems: any[] = [];

  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain);

    this.idKey = opts.tree?.idField ?? 'id';
    this.pidKey = opts.tree?.parentIdField ?? 'pid';
    this.childrenKey = opts.tree?.childrenField ?? 'children';

    this.expandDepth = opts.tree?.expandDepth ?? 1;
    this.defaultExpandedIds = opts.tree?.defaultExpandedIds ?? [];
  }

  public addRows(addOpts: AddRowOptions): void {
    throw new Error('Method not implemented.');
  }

  // ======================
  // 데이터 세팅
  // ======================
  public setItems(items: any[]) {
    super.setItems(items);

    const processedItems = this.opts.tree?.isFlatData ? this.buildTree(items) : items;
    this.orginTreeItems = processedItems;

    this.buildMaps();
    this.initExpandedState();
    this.buildViewItems();
  }

  dataSort(
    isShift: boolean,
    sortOrders: FieldSortInfo[],
    sortOpts: { enabled: boolean; nullsLast: boolean; customSorting: boolean | OptionCallback },
  ) {
    const sortOrginItems = this.getSortBaseItems();

    if (sortOrders.length > 0) {
      const sortArr = Array.from(sortOrders);

      sortArr.forEach((item) => {
        if (item.field.getValue) {
          item.isValue = true;
        }
      });

      const sortTreeData = sortTreeByLevel(this.orginTreeItems, sortArr, sortOpts.nullsLast);

      const treeData = this.getTreeToList(sortTreeData);

      this.setViewItems(treeData);
    } else {
      this.setViewItems(sortOrginItems);
      this.setSortBaseItems([]);
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
  private initTreeItems(items: any[], depth = 0): any[] {
    return items.map((item) => {
      super.createRowItem(item, depth);

      const children = item[this.childrenKey];

      if (children?.length) {
        item[ROW_HAS_CHILD_KEY] = true;
        item[this.childrenKey] = this.initTreeItems(children, depth + 1);
      }

      return item;
    });
  }

  // ======================
  // Map 구성
  // ======================
  private buildMaps() {
    this.clearRowMap();
    this.childrenMap.clear();
    this.idMap.clear();

    const traverse = (list: any[]) => {
      for (const item of list) {
        const rowId = item[this.rowIdField];
        const idValue = item[this.idKey];

        this.setRowItem(rowId, item);
        this.idMap.set(idValue, rowId);

        const children = item[this.childrenKey];

        if (children?.length) {
          this.childrenMap.set(rowId, children);
          traverse(children);
        }
      }
    };

    traverse(this.getCurrentItems());
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

    const rowMap = this.getRowMap();

    // 2. depth 기반 자동 expand
    if (this.expandDepth > 0) {
      for (const item of rowMap.values()) {
        const depth = item[ROW_DEPTH_KEY];
        const id = item[this.rowIdField];

        if (depth < this.expandDepth) {
          this.expandedSet.add(id);
        }
      }
    }

    for (const item of rowMap.values()) {
      const id = item[this.rowIdField];
      item[ROW_EXPANDED_KEY] = this.expandedSet.has(id);
    }
  }

  // ======================
  // viewItems
  // ======================
  public buildViewItems(start = 0, end = Infinity) {
    this.setViewItems(this.getTreeToList(this.getCurrentItems()), start, end);
  }

  private getTreeToList(list: any, start = 0, end = Infinity) {
    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const item of list) {
        if (result.length >= end) break;

        result.push(item);

        const id = item[this.rowIdField];

        if (this.expandedSet.has(id)) {
          const children = this.childrenMap.get(id);
          if (children) dfs(children);
        }
      }
    };

    dfs(list);

    return result;
  }

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

    this.getRowItem(rowId)[ROW_EXPANDED_KEY] = isExpand;

    this.buildViewItems();
  }

  public collapseAll() {
    this.expandedSet.clear();

    for (const item of this.getRowMap().values()) {
      item[ROW_EXPANDED_KEY] = false;
    }

    this.buildViewItems();
  }

  public expandAll() {
    for (const key of this.childrenMap.keys()) {
      this.expandedSet.add(key);
    }

    for (const item of this.getRowMap().values()) {
      const id = item[this.rowIdField];
      item[ROW_EXPANDED_KEY] = this.expandedSet.has(id);
    }

    this.buildViewItems();
  }

  public expandRow(id: RowId) {
    const rowId = this.idMap.get(id);
    if (rowId === undefined) return;

    this.expandedSet.add(rowId);

    this.getRowItem(rowId)[ROW_EXPANDED_KEY] = true;

    this.buildViewItems();
  }

  public removeRows(ids: RowId[]): RowId[] {
    throw new Error('Method not implemented.');
  }

  getSearchData(keyword: string, options: SearchMode) {
    const gridValue = [...this.getRowMap().values()];

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.cfg.currentFields
        .filter((item) => !item.$isAside)
        .map((item) => {
          return item.name;
        });
    }

    const searchResults = gridDataSearch(gridValue, keyword, options);

    // 트리 형태로 다시 구성
    const tree = this.buildSearchedTree(this.getCurrentItems(), searchResults);

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

    return result;
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
