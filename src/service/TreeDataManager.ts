import { ROW_ID_FIELD_NAME, SearchDirectionMap } from '@/constants';
import {
  AddRowOptions,
  CURRNET_MATCH_INFO,
  RowId,
  SearchMatchInfo,
  SearchMode,
  SearchResult,
  TreeViewItem,
  ViewItem,
} from '@/types/Common';
import { GridOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { gridDataSearch } from '@/util/searchUtils';
import { multiSort } from '@/util/utils';
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

  private searchMatchedIds: RowId[] = [];

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
    if (this.opts.tree?.isFlatData) {
      treeItems = this.buildTree(items);
    } else {
      treeItems = items;
    }

    const itemInfo = this.convertOriginalTreeToTreeViewItems(treeItems);

    super.setItems(itemInfo.flatItems);

    this.originalTreeItems = itemInfo.treeViewItems;
    this.viewTreeItems = itemInfo.treeViewItems;

    this.buildViewItems();
  }

  private convertOriginalTreeToTreeViewItems(treeItems: any[]) {
    const expandDepth = this.opts.tree?.expandDepth ?? 1;
    const childrenKey = this.childrenKey;
    const expandedIdSet = new Set(this.opts.tree?.defaultExpandedIds ?? []);

    const rootNodes: TreeViewItem[] = [];

    const flatItems: any[] = [];

    const dfs = (list: any[], depth: number, parentId: RowId, target: TreeViewItem[]): void => {
      let orderIdx = 0;

      for (const item of list) {
        this.createRowItem(item, depth);

        const rowId = item[ROW_ID_FIELD_NAME];
        this.setRowItem(rowId, item);

        const treeViewItem = {
          id: rowId,
          pid: parentId,
          sortOrder: orderIdx++,
          depth,
          expanded: depth < expandDepth || expandedIdSet.has(item[this.idKey]) ? 1 : 0,
        } as TreeViewItem;

        target.push(treeViewItem);

        flatItems.push(item);

        const children = item[childrenKey];

        if (children?.length) {
          treeViewItem.children = [];

          dfs(children, depth + 1, rowId, treeViewItem.children);

          item[childrenKey] = null;
        }
      }
    };

    dfs(treeItems, 1, 'dg$root', rootNodes);

    return { flatItems, treeViewItems: rootNodes };
  }

  /**
   * flat → tree
   * @param flatItems items
   * @returns
   */
  private buildTree(flatItems: any[]): any[] {
    const idKey = this.idKey;
    const pidKey = this.pidKey;
    const childrenKey = this.childrenKey;

    const map = new Map<RowId, any>();
    const roots: any[] = [];

    // 인덱스 생성 + children 초기화
    for (const item of flatItems) {
      item[childrenKey] = [];
      map.set(item[idKey], item);
    }

    // 부모-자식 연결
    for (const item of flatItems) {
      const parentId = item[pidKey];

      if (parentId == null) {
        roots.push(item);
        continue;
      }

      const parent = map.get(parentId);

      if (parent) {
        parent[childrenKey].push(item);
      } else {
        roots.push(item);
      }
    }

    return roots;
  }

  /**
   * viewItems
   * @param items items
   */
  public buildViewItems() {
    this.setViewItems(this.getTreeToList(this.viewTreeItems));
  }

  private getTreeToList(items: ViewItem[]): TreeViewItem[] {
    const result: TreeViewItem[] = [];

    const matchedIds: RowId[] = [];

    const dfs = (list: ViewItem[], parentExpanded: boolean) => {
      for (const item of list) {
        const treeItem = item as TreeViewItem;

        const rowId = treeItem.id;

        const matchViewItem = this.getMatchMap(rowId);

        if (matchViewItem) {
          matchedIds.push(rowId);
        }

        this.idViewItemMap.set(rowId, treeItem);

        if (parentExpanded) {
          result.push(treeItem);
        }

        const children = treeItem.children;

        if (children) dfs(children, treeItem.expanded > 0);
      }
    };

    dfs(items, true);

    this.searchMatchedIds = matchedIds;

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
    this.allToggle(false);
  }

  /**
   * 모든 행을 펼침
   */
  public expandAll() {
    this.allToggle(true);
  }

  private allToggle(flag: boolean) {
    function dfs(items: TreeViewItem[]) {
      for (const item of items) {
        if (item.children?.length > 0) {
          item.expanded = flag ? 1 : 0;
          dfs(item.children);
        }
      }
    }

    dfs(this.viewTreeItems);

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

  /**
   * 검색
   *
   * @param keyword 검색어
   * @param options 검색 옵션
   * @returns
   */
  public getSearchData(keyword: string, options: SearchMode): SearchResult {
    const originalTreeItems = this.originalTreeItems;

    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.matchCount = 0;

    options.hideNonMatched = true;

    const hideNonMatched = options.hideNonMatched;

    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (!viewItem) return;

      const treeViewItem = viewItem as TreeViewItem;

      if (isMatched) {
        this.addMatchMap(treeViewItem.id, treeViewItem);
        searchMatchInfo.matchCount += treeViewItem.matchedFields?.length ?? 0;
      } else {
        treeViewItem.expanded = treeViewItem.expanded % 2 > 0 ? 1 : 0;
      }
    };

    const dataManager = this.cfg.dataManager;
    const matchItemMap = new Map<RowId, boolean>();

    const searchTree = (nodes: TreeViewItem[], depth: number): SearchResult => {
      const matchResult = gridDataSearch(nodes, dataManager, keyword, options);

      if (matchResult.isOriginal) {
        return matchResult;
      }

      const resultNodes: TreeViewItem[] = [];

      for (const node of nodes) {
        const children = node.children ?? [];

        let childResult: SearchResult = {} as SearchResult;

        if (children.length > 0) {
          childResult = searchTree(children, depth + 1);
        }

        const isMatched = node.matchedFields?.length || childResult.matchCount > 0 || matchItemMap.has(node.id);

        if (!hideNonMatched) {
          if (isMatched) {
            node.expanded = isMatched ? 2 : node.expanded;
            if (!matchItemMap.has(node.pid)) {
              matchItemMap.set(node.pid, true);
            }
          }

          resultNodes.push(node);
          continue;
        }

        if (isMatched) {
          const newNode: TreeViewItem = {
            ...node,
            children: (childResult.items ?? []) as TreeViewItem[],
          };
          newNode.expanded = 2;

          resultNodes.push(newNode);

          if (!matchItemMap.has(node.pid)) {
            matchItemMap.set(node.pid, true);
          }
        }
      }

      return {
        ...matchResult,
        items: resultNodes,
      };
    };

    const matchResult = searchTree(originalTreeItems, 0);

    this.viewTreeItems = matchResult.items as TreeViewItem[];

    matchResult.items = this.getTreeToList(matchResult.items);
    matchResult.matchCount = searchMatchInfo.matchCount;

    return matchResult;
  }

  protected getMatchInfo(
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
    options: SearchMode,
  ): CURRNET_MATCH_INFO {
    const isPrev = options.direction === SearchDirectionMap.PREV;

    const matchId = searchMatchInfo.id;

    const searchMatchIdLength = this.searchMatchedIds.length;
    const currentIdx = this.searchMatchedIds.indexOf(matchId);
    let nextIdx;
    if (isPrev) {
      nextIdx = currentIdx > 0 ? currentIdx - 1 : searchMatchIdLength - 1;
    } else {
      nextIdx = currentIdx < searchMatchIdLength - 1 ? currentIdx + 1 : 0;
    }
    const nextId = this.searchMatchedIds[nextIdx];

    const nextViewItem = this.getMatchMap(nextId) as TreeViewItem;

    if ((this.idViewItemMap.get(nextViewItem.pid) as TreeViewItem).expanded < 1) {
      this.expandRow(nextId);

      //this.getViewItems();
      // 접기/펼치기 처리.
      //const matchInfo = super.getMatchInfo(searchMatchInfo, searchResult, options);
    }

    const matchInfo = super.getMatchInfo(searchMatchInfo, searchResult, options);

    return matchInfo;
  }

  /**
   * 정렬
   *
   * @param sortOrders 정렬 정보
   * @param sortOpts 정렬 옵션
   * @returns
   */
  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): any[] {
    const dataManager = this.cfg.dataManager;
    function sortTree(nodes: TreeViewItem[]) {
      nodes = multiSort(nodes, dataManager, sortOrders, sortOpts.nullsLast) as TreeViewItem[];

      for (const node of nodes) {
        const treeViewItem = node;
        const children = treeViewItem.children;
        if (children && children.length > 0) {
          sortTree(children);
        }
      }
      return nodes;
    }
    const sortedTree = sortTree(this.viewTreeItems);

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
