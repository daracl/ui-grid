import { ORIGINAL_ORDER_KEY, ROW_DEPTH_KEY, ROW_EXPANDED_KEY, ROW_HAS_CHILD_KEY, ROW_ID_FIELD_NAME } from '@/constants';
import { AddRowOptions, RowId, SearchMode, SearchResult, ViewItem } from '@/types/Common';
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
  private readonly childrenMap = new Map<RowId, any[]>();

  private readonly idKey: string;
  private readonly pidKey: string;
  private readonly childrenKey: string;

  // 원본 트리 구조 데이터
  private originalTreeItems: any[] = [];
  // 트리 구조 데이터
  private viewTreeItems: any[] = [];

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

    super.setItems(flatItems);

    this.originalTreeItems = treeItems;
    this.viewTreeItems = treeItems;

    const expandDepth = this.opts.tree?.expandDepth ?? 1;
    const defaultExpandedIds = this.opts.tree?.defaultExpandedIds ?? [];

    this.initTreeItems(treeItems, 1, expandDepth, defaultExpandedIds);
    this.buildViewItems();
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
   * tree data 초기화
   * @param items items
   * @param depth tree depth
   * @param openDepth open depth
   * @param defaultExpandedIds 펼침 ids
   * @returns
   */
  private initTreeItems(items: any[], depth = 0, openDepth = 1, defaultExpandedIds: RowId[] = []): any[] {
    let orderIdx = 0;
    return items.map((item) => {
      super.createRowItem(item, depth);
      item[ORIGINAL_ORDER_KEY] = orderIdx++;

      const rowId = item[ROW_ID_FIELD_NAME];

      item[ROW_EXPANDED_KEY] = depth < openDepth || defaultExpandedIds.includes(item[this.idKey]) ? 1 : 0;
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

  /**
   * viewItems
   * @param items items
   */
  public buildViewItems() {
    this.setViewItemIds(this.getTreeToList(this.viewTreeItems));
  }

  private getTreeToList(items: any[]): any[] {
    const result: any[] = [];
    const dfs = (list: any[]) => {
      for (const item of list) {
        result.push(item);

        if (item[ROW_EXPANDED_KEY] > 0) {
          const children = item[this.childrenKey];

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

    rowItem[ROW_EXPANDED_KEY] = rowItem[ROW_EXPANDED_KEY] > 0 ? 0 : 1;

    this.buildViewItems();
  }

  /**
   * 모든 행을 접음
   */
  public collapseAll() {
    for (const item of this.getRowMap().values()) {
      item[ROW_EXPANDED_KEY] = 0;
    }

    this.buildViewItems();
  }

  /**
   * 모든 행을 펼침
   */
  public expandAll() {
    for (const item of this.getRowMap().values()) {
      item[ROW_EXPANDED_KEY] = 1;
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

    this.parentExpand(rowItem, []);

    this.buildViewItems();
  }

  private parentExpand(item: any, expandedIds: RowId[], addMatchedKey = false) {
    if (!item) return;
    const id = item[this.idKey];
    const pid = item[this.pidKey];
    const parentItem = this.getRowItem(pid);

    if (addMatchedKey) {
      item[ROW_EXPANDED_KEY] = item[ROW_EXPANDED_KEY] == 1 ? 3 : 2;
    } else {
      item[ROW_EXPANDED_KEY] = 1;
    }

    if (parentItem) {
      this.parentExpand(parentItem, expandedIds, addMatchedKey);
    }
    expandedIds.push(id);

    return expandedIds;
  }

  public getSearchData(keyword: string, options: SearchMode) {
    const originalTreeItems = this.originalTreeItems;

    const expandedIds = new Set<RowId>();

    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.matchCount = 0;

    const optsHideNonMatched = options.hideNonMatched;

    //options.hideNonMatched = false;
    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (isMatched) {
        if (viewItem) this.addMatchMap(viewItem.id, viewItem);
        searchMatchInfo.matchCount += 1;

        const parentIds: RowId[] = [];

        if (!expandedIds.has(item[this.pidKey])) {
          this.parentExpand(item, parentIds, true);
          parentIds.forEach((id) => {
            expandedIds.add(id);
          });
        }

        expandedIds.add(item[ROW_ID_FIELD_NAME]);
      } else {
        item[ROW_EXPANDED_KEY] = item[ROW_EXPANDED_KEY] % 2 > 0 ? 1 : 0;
      }
    };

    const childrenKey = this.childrenKey;
    let totalMatchCount = 0;
    const idKey = this.idKey;
    const pidKey = this.pidKey;
    const matchItemMap = new Map<RowId, boolean>();
    function searchTree(nodes: any[], keyword: string, options: SearchMode): SearchResult {
      const matchResult = gridDataSearch(nodes, keyword, options);

      if (matchResult.isOriginal) {
        return matchResult;
      }

      const matchItems = matchResult.items;
      const searchResults = [];

      let childMatchResult: SearchResult = {} as SearchResult;
      for (const node of nodes) {
        const children = node[childrenKey];

        childMatchResult.matchCount = 0;
        if (children && children.length > 0) {
          childMatchResult = searchTree(arrayCopy(children), keyword, options);
        }

        console.log('matchItems.includes(node)   ', node, childMatchResult.matchCount);

        if (matchItems.includes(node) || childMatchResult.matchCount > 0 || matchItemMap.has(node[idKey])) {
          if (!matchItemMap.has(node[pidKey])) {
            matchItemMap.set(node[pidKey], true);
          }
          searchResults.push(node);
        }
      }
      totalMatchCount += matchResult.matchCount;
      matchResult.items = searchResults;
      return matchResult;
    }

    const matchResult = searchTree(originalTreeItems, keyword, options);

    console.log('searchResults', totalMatchCount, matchItemMap, matchResult, matchResult.items);

    //console.log('this.getTreeDataToList(matchResult.items)', this.getTreeDataToList(matchResult.items));

    //
    //
    // sort 처리 필요.

    this.viewTreeItems = matchResult.items;

    return this.getTreeDataToList(matchResult.items);
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): any[] {
    const childrenKey = this.childrenKey;
    const cfg = this.cfg;
    function sortTree(nodes: any[]) {
      //
      //
      //확인할 것.
      //
      //
      nodes = multiSort(nodes, sortOrders, sortOpts.nullsLast);

      for (const node of nodes) {
        const children = node[childrenKey];
        if (children && children.length > 0) {
          node[childrenKey] = sortTree(arrayCopy(children));
        }
      }
      return nodes;
    }
    const sortedTree = sortTree(this.viewTreeItems);

    //
    // 검색 정렬 처리 할것.
    //
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
