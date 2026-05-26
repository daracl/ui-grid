import { ALL_SELECT_VALUE, ROW_EXPANDED_KEY, ROW_HAS_CHILD_KEY } from '@/constants';
import { AddRowOptions, OptionCallback, RowId, SearchMode } from '@/types/Common';
import { GridOptions } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { sortTreeByLevel } from '@/util/utils';
import { GridMain } from '../view/GridMain';
import { DataManager } from './DataManager';

/**
 * TreeDataManager class
 *
 * @class TreeDataManager
 * @typedef {TreeDataManager}
 */
export class TreeDataManager extends DataManager {
  private readonly childrenMap = new Map<RowId, any[]>();

  private readonly idKey: string;
  private readonly pidKey: string;
  private readonly childrenKey: string;

  private orginTreeItems: any[] = [];
  private viewTreeItems: any[] = [];

  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain);

    this.idKey = opts.tree?.idField ?? 'id';
    this.pidKey = opts.tree?.parentIdField ?? 'pid';
    this.childrenKey = opts.tree?.childrenField ?? 'children';
  }

  /**
   * 트리 노드 렌더링을 위한 데이터 초기화
   * @param items 원본 데이터 배열
   */
  public setItems(items: any[]) {
    let treeItems;
    let flatItems;
    if (this.opts.tree?.isFlatData) {
      treeItems = this.buildTree(items);
      flatItems = items;
    } else {
      treeItems = items;
      flatItems = this.getTreeDataToList(treeItems);
    }

    super.setItems(flatItems);

    this.orginTreeItems = treeItems;
    this.viewTreeItems = treeItems;

    const expandDepth = this.opts.tree?.expandDepth ?? 1;
    const defaultExpandedIds = this.opts.tree?.defaultExpandedIds ?? [];

    this.initTreeItems(this.orginTreeItems, 1, expandDepth, defaultExpandedIds);
    this.buildViewItems(this.orginTreeItems);
  }

  dataSort(
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

  private getTreeDataToList(treeItems: any[]): any[] {
    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const item of list) {
        result.push(item);

        const children = item[this.childrenKey];

        if (children) dfs(children);
      }
    };

    dfs(treeItems);

    return result;
  }

  // ======================
  // 초기화
  // ======================
  private initTreeItems(items: any[], depth = 0, openDepth = 1, defaultExpandedIds: RowId[] = []): any[] {
    return items.map((item) => {
      super.createRowItem(item, depth);

      const rowId = item[this.rowIdField];

      item[ROW_EXPANDED_KEY] = depth < openDepth || defaultExpandedIds.includes(item[this.idKey]);
      const children = item[this.childrenKey];
      this.setRowItem(rowId, item);
      if (children?.length) {
        item[ROW_HAS_CHILD_KEY] = true;
        item[this.childrenKey] = this.initTreeItems(children, depth + 1, openDepth, defaultExpandedIds);

        this.childrenMap.set(rowId, children);
      }

      return item;
    });
  }

  // ======================
  // viewItems
  // ======================
  public buildViewItems(items?: any[]) {
    if (items) {
      this.setViewItems(this.getTreeToList(items));
    } else {
      this.setViewItems(this.getTreeToList(this.viewTreeItems));
    }
  }

  private getTreeToList(items: any[]): any[] {
    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const item of list) {
        result.push(item);

        const id = item[this.rowIdField];

        if (item[ROW_EXPANDED_KEY]) {
          const children = this.childrenMap.get(id);

          if (children) dfs(children);
        }
      }
    };

    dfs(items);

    return result;
  }

  /**
   * toggle row expand/collapse
   * @param rowId 행의 ID
   */
  public toggleRow(rowId: RowId) {
    const rowItem = this.getRowItem(rowId);

    rowItem[ROW_EXPANDED_KEY] = !rowItem[ROW_EXPANDED_KEY];

    this.buildViewItems();
  }

  /**
   * 모든 행을 접음
   */
  public collapseAll() {
    for (const item of this.getRowMap().values()) {
      item[ROW_EXPANDED_KEY] = false;
    }

    this.buildViewItems();
  }

  /**
   * 모든 행을 펼침
   */
  public expandAll() {
    for (const item of this.getRowMap().values()) {
      item[ROW_EXPANDED_KEY] = true;
    }

    this.buildViewItems();
  }

  /**
   * 특정 행을 펼침
   * @param rowId 펼칠 행의 ID
   * @returns
   */
  public expandRow(rowId: RowId) {
    const rowItem = this.getRowItem(rowId);
    if (rowItem === undefined) return;

    rowItem[ROW_EXPANDED_KEY] = true;

    this.buildViewItems();
  }
  /**
   * 행 삭제
   * @param ids 삭제할 행의 ID 배열
   * @returns 삭제된 행의 ID 배열
   */
  public removeRows(ids: RowId[]): RowId[] {
    throw new Error('Method not implemented.');
  }

  /**
   * 행 추가
   * @param addOpts 추가 옵션 (예: 부모 행 ID, 추가할 데이터 등)
   */
  public addRows(addOpts: AddRowOptions): void {
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

    if (!options.hideNonMatched) {
      return searchResults;
    }

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
