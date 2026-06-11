import { ORIGINAL_ORDER_KEY, ROW_DEPTH_KEY, ROW_ID_FIELD_NAME } from '@/constants';
import { AddRowOptions, RowId, SearchMode, SearchResult, TreeViewItem, ViewItem } from '@/types/Common';
import { GridOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { arrayCopy, hasOwnProp, multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { DataManager } from './DataManager';

/**
 * TreeDataManager class
 *
 * @class TreeDataManager
 * @typedef {TreeDataManager}
 */
export class TreeDataManager extends DataManager {
  private readonly idViewItemMap = new Map<RowId, TreeViewItem>();

  private readonly idKey: string;
  private readonly pidKey: string;
  private readonly childrenKey: string;

  // 원본 트리 구조 데이터
  private originalTreeItems: TreeViewItem[] = [];
  // 트리 구조 데이터
  private viewTreeItems: TreeViewItem[] = [];

  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain, 'tree');

    const tree = opts.tree;

    this.idKey = tree?.idField ?? 'id';
    this.pidKey = tree?.parentIdField ?? 'pid';
    this.childrenKey = tree?.childrenField ?? 'children';
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

    const expandDepth = this.opts.tree?.expandDepth ?? 1;
    const defaultExpandedIds = this.opts.tree?.defaultExpandedIds ?? [];

    const treeViewIds = this.convertOriginalTreeToTreeViewItems(treeItems, expandDepth, defaultExpandedIds);

    super.setItems(flatItems);

    this.originalTreeItems = treeViewIds;
    this.viewTreeItems = treeViewIds;

    this.buildViewItems();
  }

  private convertOriginalTreeToTreeViewItems(
    treeItems: any[],
    openDepth: number,
    defaultExpandedIds: RowId[],
  ): TreeViewItem[] {
    const childrenKey = this.childrenKey;

    const rootNodes: TreeViewItem[] = [];
    const dfs = (list: any[], depth: number, parentId: RowId, parentChildren: TreeViewItem[]) => {
      let orderIdx = 0;
      for (const item of list) {
        super.createRowItem(item, depth);

        const rowId = item[ROW_ID_FIELD_NAME];
        this.setRowItem(rowId, item);

        const treeViewItem = { id: rowId, pid: parentId, order: orderIdx++, depth: depth } as TreeViewItem;
        treeViewItem.expanded = depth < openDepth || defaultExpandedIds.includes(item[this.idKey]) ? 1 : 0;

        if (depth == 1) {
          rootNodes.push(treeViewItem);
        }
        parentChildren.push(treeViewItem);

        const children = item[childrenKey];
        if (children) {
          treeViewItem.children = [];
          dfs(children, depth + 1, rowId, treeViewItem.children);
        }

        this.idViewItemMap.set(rowId, treeViewItem);
      }
    };

    dfs(treeItems, 1, 'dg$root', []);

    return rootNodes;
  }

  /**
   * flat → tree
   * @param flatItems items
   * @returns
   */
  private buildTree(flatItems: any[]): any[] {
    const map = new Map<RowId, any>();
    const roots: any[] = [];
    const idKey = this.idKey;
    const pidKey = this.pidKey;
    const childrenKey = this.childrenKey;

    const hasChildrenKey = flatItems.some((item) => hasOwnProp(item, childrenKey));

    if (hasChildrenKey) {
      for (const flatItem of flatItems) {
        if (flatItem[ROW_DEPTH_KEY] === 1) {
          roots.push(flatItem);
        }
      }
      return roots;
    }

    flatItems.forEach((item) => {
      item[childrenKey] = [];

      map.set(item[idKey], item);
    });

    flatItems.forEach((item) => {
      const node = map.get(item[idKey]);

      const parent = map.get(item[pidKey]);
      if (parent) {
        parent[childrenKey].push(node);
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

  /**
   * viewItems
   * @param items items
   */
  public buildViewItems() {
    this.setViewItemIds(this.getTreeToList(this.viewTreeItems));
  }

  private getTreeToList(items: ViewItem[]): TreeViewItem[] {
    const result: TreeViewItem[] = [];
    const dfs = (list: ViewItem[]) => {
      for (const item of list) {
        const treeItem = this.idViewItemMap.get(item.id);
        if (treeItem) {
          result.push(treeItem);

          if (treeItem.expanded > 0) {
            const children = treeItem.children;

            if (children) dfs(children);
          }
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
    const viewItem = this.idViewItemMap.get(rowId);

    if (viewItem) {
      viewItem.expanded = viewItem?.expanded > 0 ? 0 : 1;
      this.buildViewItems();
    }
  }

  /**
   * 모든 행을 접음
   */
  public collapseAll() {
    for (const item of this.idViewItemMap.values()) {
      item.expanded = 0;
    }

    this.buildViewItems();
  }

  /**
   * 모든 행을 펼침
   */
  public expandAll() {
    for (const item of this.idViewItemMap.values()) {
      item.expanded = 1;
    }

    this.buildViewItems();
  }

  /**
   * 특정 행을 펼침
   * @param rowId 펼칠 행의 ID
   * @returns
   */
  public expandRow(rowId: RowId) {
    const treeViewItem = this.idViewItemMap.get(rowId);
    if (!treeViewItem) return;

    this.parentExpand(treeViewItem, []);

    this.buildViewItems();
  }

  private parentExpand(item: TreeViewItem, expandedIds: RowId[], addMatchedKey = false) {
    if (!item) return;
    const id = item.id;
    const pid = item.pid;
    const parentItem = this.idViewItemMap.get(pid);

    if (addMatchedKey) {
      item.expanded = item.expanded == 1 ? 3 : 2;
    } else {
      item.expanded = 1;
    }

    if (parentItem) {
      this.parentExpand(parentItem, expandedIds, addMatchedKey);
    }
    expandedIds.push(id);

    return expandedIds;
  }

  public getSearchData(keyword: string, options: SearchMode): SearchResult {
    const originalTreeItems = this.originalTreeItems;

    const expandedIds = new Set<RowId>();

    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.matchCount = 0;

    const optsHideNonMatched = options.hideNonMatched;

    //options.hideNonMatched = false;
    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (!viewItem) return;

      const treeViewItem = viewItem as TreeViewItem;

      if (isMatched) {
        this.addMatchMap(viewItem.id, treeViewItem);
        searchMatchInfo.matchCount += treeViewItem.matchedFields?.length ?? 0;

        const parentIds: RowId[] = [];

        if (!expandedIds.has(item[this.pidKey])) {
          this.parentExpand(item, parentIds, true);
          parentIds.forEach((id) => {
            expandedIds.add(id);
          });
        }

        expandedIds.add(item[ROW_ID_FIELD_NAME]);
      } else {
        treeViewItem.expanded = treeViewItem.expanded % 2 > 0 ? 1 : 0;
      }
    };

    const dataManager = this.cfg.dataManager;
    let totalMatchCount = 0;
    const matchItemMap = new Map<RowId, boolean>();
    function searchTree(nodes: TreeViewItem[]): SearchResult {
      const matchResult = gridDataSearch(nodes, dataManager, keyword, options);

      if (matchResult.isOriginal) {
        return matchResult;
      }

      const matchItems = matchResult.items;
      const searchResults: TreeViewItem[] = [];

      let childMatchResult: SearchResult = {} as SearchResult;
      for (const node of nodes) {
        const children = node.children;

        childMatchResult.matchCount = 0;
        if (children && children.length > 0) {
          childMatchResult = searchTree(arrayCopy(children));
        }

        console.log('matchItems.includes(node)   ', node, childMatchResult.matchCount);

        if (
          matchItems.some((item) => item.id === node.id) ||
          childMatchResult.matchCount > 0 ||
          matchItemMap.has(node.id)
        ) {
          if (!matchItemMap.has(node.pid)) {
            matchItemMap.set(node.pid, true);
          }
          searchResults.push(node);
        }
      }
      totalMatchCount += matchResult.matchCount;
      matchResult.items = searchResults;
      return matchResult;
    }

    const matchResult = searchTree(originalTreeItems);

    console.log('searchResults', totalMatchCount, matchItemMap, matchResult, matchResult.items);

    this.viewTreeItems = matchResult.items as TreeViewItem[];

    matchResult.items = this.getTreeToList(matchResult.items);
    matchResult.matchCount = totalMatchCount;

    return matchResult;
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): any[] {
    const dataManager = this.cfg.dataManager;
    function sortTree(nodes: TreeViewItem[]) {
      nodes = multiSort(nodes, dataManager, sortOrders, sortOpts.nullsLast) as TreeViewItem[];

      for (const node of nodes) {
        const treeViewItem = node;
        const children = treeViewItem.children;
        if (children && children.length > 0) {
          treeViewItem.children = sortTree(arrayCopy(children));
        }
      }
      return nodes;
    }
    const sortedTree = sortTree(this.viewTreeItems);

    //
    // 검색 정렬 처리 할것.
    //처리 할것.
    //
    //

    const result = this.getTreeToList(sortedTree);

    return result;
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
}
