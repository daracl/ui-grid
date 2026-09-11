import { ItemStatusMap, ROW_FIELD, SearchDirectionMap } from '@/constants';
import {
  AddRowOptions,
  CURRENT_MATCH_INFO,
  MatchedField,
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

const EXPAND_TYPE = {
  USER: 1,
  SEARCH: 2,
};

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

  // viewTreeItems를 flat 한 데이터
  private flatViewTreeItems: TreeViewItem[] = [];

  //
  private readonly visibleIndexMap = new Map<RowId, number>();

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
    let expandDepth = this.opts.tree?.expandDepth ?? 0;
    expandDepth = expandDepth - 1;
    const childrenKey = this.childrenKey;
    const expandedIdSet = new Set(this.opts.tree?.defaultExpandedIds ?? []);

    const rootNodes: TreeViewItem[] = [];

    const flatItems: any[] = [];

    const dfs = (list: any[], depth: number, parentId: RowId, target: TreeViewItem[]): void => {
      let orderIdx = 0;

      for (const item of list) {
        this.initializeRowItem(item, depth, ItemStatusMap.READ);

        const rowId = item[ROW_FIELD.ID];
        this.setRowItem(rowId, item);

        const treeViewItem = {
          id: rowId,
          pid: parentId,
          sortOrder: orderIdx++,
          depth,
          isLeaf: true,
          expanded: depth < expandDepth || expandedIdSet.has(item[this.idKey]) ? EXPAND_TYPE.USER : 0,
        } as TreeViewItem;

        target.push(treeViewItem);

        flatItems.push(item);

        const children = item[childrenKey];

        if (children?.length && children.length > 0) {
          treeViewItem.children = [];
          treeViewItem.isLeaf = false;
          dfs(children, depth + 1, rowId, treeViewItem.children);

          item[childrenKey] = null;
        }
      }
    };

    dfs(treeItems, 0, 'dg$root', rootNodes);

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
    this.visibleIndexMap.clear();
    this.idViewItemMap.clear();
    this.matchOffsetMap.clear();
    const result: TreeViewItem[] = [];
    const flatList: TreeViewItem[] = [];

    const searchEnabled = this.cfg.searchEnabled;

    let offset = 0;
    const dfs = (list: ViewItem[], parentExpanded: boolean) => {
      for (const item of list) {
        const treeItem = item as TreeViewItem;

        const rowId = treeItem.id;

        if (searchEnabled) {
          const matchViewItem = this.getSearchMapItem(rowId);
          if (matchViewItem) {
            this.matchOffsetMap.set(rowId, offset);
            offset += matchViewItem.matchedFields?.length ?? 0;
          }
        }

        this.idViewItemMap.set(rowId, treeItem);

        flatList.push(treeItem);
        if (parentExpanded) {
          this.visibleIndexMap.set(rowId, result.length);
          result.push(treeItem);
        }

        const children = treeItem.children;

        if (children && children.length > 0) {
          dfs(children, parentExpanded && treeItem.expanded > 0);
        }
      }
    };

    dfs(items, true);

    this.flatViewTreeItems = flatList;

    return result;
  }

  /**
   * toggle row expand/collapse
   * @param rowId 행의 ID
   */
  public toggleRow(rowId: RowId) {
    const viewItem = this.idViewItemMap.get(rowId);

    if (viewItem) {
      viewItem.expanded = viewItem?.expanded > 0 ? 0 : EXPAND_TYPE.USER;
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
          item.expanded = flag ? EXPAND_TYPE.USER : 0;
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

    this.expandParents(treeViewItem);

    this.buildViewItems();
  }

  private expandParents(item: TreeViewItem, mode = 1): boolean {
    let changed = false;
    let current: TreeViewItem | undefined = item;

    while (current) {
      if (current.expanded < 1) {
        changed = true;
        current.expanded = mode;
      }

      current = this.idViewItemMap.get(current.pid);
    }

    return changed;
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

    const hideNonMatched = options.hideNonMatched;

    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (!viewItem) return;

      const treeViewItem = viewItem as TreeViewItem;

      if (isMatched) {
        this.addSearchMapItem(treeViewItem.id, treeViewItem);
        searchMatchInfo.matchCount += treeViewItem.matchedFields?.length ?? 0;
      } else {
        treeViewItem.expanded = treeViewItem.expanded % 2 > 0 ? EXPAND_TYPE.USER : 0;
      }
    };

    const dataManager = this.cfg.dataManager;
    const matchItemSet = new Set<RowId>();

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
        const pid = node.pid;
        const isMatched = node.matchedFields?.length || childResult.matchCount > 0 || matchItemSet.has(node.id);

        if (!hideNonMatched) {
          if (isMatched) {
            node.expanded = isMatched ? EXPAND_TYPE.SEARCH : node.expanded;
            if (!matchItemSet.has(pid)) {
              matchItemSet.add(pid);
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
          newNode.expanded = EXPAND_TYPE.SEARCH;

          resultNodes.push(newNode);

          if (!matchItemSet.has(pid)) {
            matchItemSet.add(pid);
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

  public getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO {
    const isNext = options.direction === SearchDirectionMap.NEXT;

    const searchResult = this.flatViewTreeItems;

    const viewItem = this.getSearchMapItem(searchMatchInfo.id);
    if (viewItem) {
      viewItem.isCurrentMatch = false;
    }

    let checkMatchIndex = searchMatchInfo.rowIndex ?? -1;
    checkMatchIndex = checkMatchIndex < 0 ? this.cfg.scroll.startIdx : checkMatchIndex;

    const viewItems = this.getViewItems();
    if (viewItems.length <= checkMatchIndex) {
      checkMatchIndex = 0;
    }

    const viewRowId = viewItems[checkMatchIndex].id;

    checkMatchIndex = searchResult.findIndex((item) => item.id == viewRowId);

    const currentMatchInfo = this.findMatch(isNext, checkMatchIndex, searchMatchInfo, searchResult);

    const matchRowId = currentMatchInfo.id;

    const matchViewItem = this.getSearchMapItem(matchRowId);

    if (matchViewItem) {
      matchViewItem.isCurrentMatch = true;
      currentMatchInfo.matchedFields = matchViewItem.matchedFields ?? [];
    }

    const currentMatchIndex = this.getCurrentMatchIndex(matchRowId);

    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchRowId,
      rowIndex: currentMatchInfo.rowIndex,
      cellIndex: currentMatchInfo.cellIndex,
    } as CURRENT_MATCH_INFO);

    return currentMatchInfo;
  }

  public createMatchInfo(
    matchId: RowId,
    rowIndex: number,
    cellIndex: number,
    matchedFields: MatchedField[],
  ): CURRENT_MATCH_INFO {
    const matchItem = this.getSearchMapItem(matchId) as TreeViewItem;

    if (matchItem && this.expandParents(matchItem, EXPAND_TYPE.SEARCH)) {
      this.buildViewItems();
    }

    return {
      id: matchId,
      rowIndex: this.visibleIndexMap.get(matchId) ?? -1,
      cellIndex,
      matchedFields,
    };
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

    if (!this.cfg.searchEnabled) {
      return result;
    }

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id;

    const currentMatchIndex = this.getCurrentMatchIndex(matchId);

    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: this.cfg.scroll.startIdx,
      cellIndex: searchMatchInfo.cellIndex,
    } as CURRENT_MATCH_INFO);

    return result;
  }

  public getRowIndexById(rowId: RowId) {
    this.expandRow(rowId);

    return this.getViewItemIndex(rowId);
  }

  /**
   * 트리 구조에 신규 행 아이템들을 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts 추가 옵션 { rowId?, position? ('before' | 'after' | 'inside') }
   */
  public addItems(items: any[], addOpts: AddRowOptions = {}, status = ItemStatusMap.READ): number {
    if (!items || items.length === 0) return -1;

    let parentId: RowId = 'dg$root';
    let depth = 0;
    let targetSiblings: TreeViewItem[] = this.viewTreeItems;
    let insertIndex = targetSiblings.length;

    // 1. 기준 위치(targetNode) 탐색 및 삽입 타겟 배열/인덱스/depth 결정
    if (addOpts?.rowId !== undefined) {
      const targetNode = this.idViewItemMap.get(addOpts.rowId);
      if (targetNode) {
        if (addOpts.position === 'inside') {
          // 지정한 행의 자식 노드로 추가
          parentId = targetNode.id;
          depth = targetNode.depth + 1;
          if (!targetNode.children) {
            targetNode.children = [];
          }
          targetNode.isLeaf = false;
          // 추가된 자식이 보일 수 있도록 부모 노드 펼침
          targetNode.expanded = EXPAND_TYPE.USER;
          targetSiblings = targetNode.children;
          insertIndex = targetSiblings.length;
        } else {
          // 'before' 또는 'after': 지정한 행과 동일한 계층(형제 노드)에 추가
          parentId = targetNode.pid;
          depth = targetNode.depth;

          if (parentId === 'dg$root' || !parentId) {
            targetSiblings = this.viewTreeItems;
          } else {
            const parentNode = this.idViewItemMap.get(parentId);
            targetSiblings = parentNode?.children ?? this.viewTreeItems;
          }

          const foundIdx = targetSiblings.findIndex((node) => node.id === targetNode.id);
          if (foundIdx !== -1) {
            insertIndex = addOpts.position === 'before' ? foundIdx : foundIdx + 1;
          }
        }
      }
    } else if (addOpts?.position === 'before') {
      insertIndex = 0;
    }

    // 2. 신규 아이템을 재귀적으로 TreeViewItem으로 변환하는 내부 헬퍼 함수
    const createTreeViewNodes = (list: any[], currentDepth: number, currentPid: RowId): TreeViewItem[] => {
      let orderIdx = 0;
      const nodes: TreeViewItem[] = [];

      for (const item of list) {
        this.initializeRowItem(item, currentDepth, status);
        const newRowId = item[ROW_FIELD.ID];
        item[this.pidKey] = currentPid;
        this.setRowItem(newRowId, item);

        const children = item[this.childrenKey];
        const hasChildren = Array.isArray(children) && children.length > 0;

        const treeNode: TreeViewItem = {
          id: newRowId,
          pid: currentPid,
          sortOrder: orderIdx++,
          depth: currentDepth,
          isLeaf: !hasChildren,
          expanded: 0,
          children: [],
        };

        if (hasChildren) {
          treeNode.children = createTreeViewNodes(children, currentDepth + 1, newRowId);
          item[this.childrenKey] = null;
        }

        nodes.push(treeNode);
      }

      return nodes;
    };

    // 3. 신규 트리 노드 생성 및 대상 위치에 삽입
    const newTreeNodes = createTreeViewNodes(items, depth, parentId);
    targetSiblings.splice(insertIndex, 0, ...newTreeNodes);

    // 4. 형제 노드 간 sortOrder 재정렬
    targetSiblings.forEach((node, idx) => {
      node.sortOrder = idx;
    });

    // 5. 트리 뷰 갱신
    this.buildViewItems();

    return insertIndex;
  }

  /**
   * 행 삭제 구현
   * @param ids 삭제할 행의 ID 배열
   * @returns 삭제된 행 ID 배열
   */
  public removeItems(ids: RowId[]): RowId[] {
    if (!ids || ids.length === 0) return [];

    const removeSet = new Set(ids);
    const removedIds: RowId[] = [];

    // 삭제 대상 노드 및 그 모든 하위 자식 노드를 맵과 캐시에서 제거하는 재귀 함수
    const collectAndClean = (node: TreeViewItem) => {
      removedIds.push(node.id);

      if (typeof (this as any).deleteRowItem === 'function') {
        (this as any).deleteRowItem(node.id);
      } else if (typeof (this as any).removeRowItem === 'function') {
        (this as any).removeRowItem(node.id);
      }

      this.idViewItemMap.delete(node.id);
      this.visibleIndexMap.delete(node.id);
      this.matchOffsetMap.delete(node.id);

      if (node.children && node.children.length > 0) {
        node.children.forEach(collectAndClean);
      }
    };

    // 트리 구조 순회하며 삭제 수행
    const filterNodes = (nodes: TreeViewItem[]): TreeViewItem[] => {
      const result: TreeViewItem[] = [];

      for (const node of nodes) {
        if (removeSet.has(node.id)) {
          collectAndClean(node);
        } else {
          if (node.children && node.children.length > 0) {
            node.children = filterNodes(node.children);
            if (node.children.length === 0) {
              node.isLeaf = true;
            }
          }
          result.push(node);
        }
      }

      result.forEach((node, idx) => {
        node.sortOrder = idx;
      });

      return result;
    };

    // 1. 트리 데이터 필터링
    this.viewTreeItems = filterNodes(this.viewTreeItems);
    this.originalTreeItems = filterNodes(this.originalTreeItems);

    // 2. 트리 뷰 갱신
    this.buildViewItems();

    return removedIds;
  }
}
