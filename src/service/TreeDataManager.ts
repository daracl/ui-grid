import { ROW_ID_FIELD_NAME, SearchDirectionMap } from '@/constants';
import {
  AddRowOptions,
  CURRENT_MATCH_INFO,
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
import { MatchedField } from '../types/Common';

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
          expanded: depth < expandDepth || expandedIdSet.has(item[this.idKey]) ? EXPAND_TYPE.USER : 0,
        } as TreeViewItem;

        // haschild 항목 처리할 것.
        //
        //

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
    this.visibleIndexMap.clear();
    this.idViewItemMap.clear();
    this.matchOffsetMap.clear();
    const result: TreeViewItem[] = [];
    const flatList: TreeViewItem[] = [];

    const searchEnable = this.cfg.searchEnable;
    let offset = 0;
    const dfs = (list: ViewItem[], parentExpanded: boolean) => {
      for (const item of list) {
        const treeItem = item as TreeViewItem;

        const rowId = treeItem.id;

        if (searchEnable) {
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

        if (children) dfs(children, parentExpanded && treeItem.expanded > 0);
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

    options.hideNonMatched = true;

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

  private findMatch(
    isNext: boolean,
    checkMatchIndex: number,
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
  ): CURRENT_MATCH_INFO {
    const len = searchResult.length;
    const currentCellIdx = searchMatchInfo.cellIndex;

    for (let i = 0; i < len; i++) {
      const searchRowIdx = isNext ? (checkMatchIndex + i) % len : (checkMatchIndex - i + len) % len;

      const item = searchResult[searchRowIdx];
      const matchFields = this.getSearchMapItem(item.id)?.matchedFields;

      if (!matchFields?.length) continue;

      const matchId = item.id;
      const sameRow = searchRowIdx === checkMatchIndex;

      const baseIdx = isNext ? currentCellIdx + 1 : currentCellIdx - 1;

      if (sameRow) {
        // 같은 row에서 더 이상 이동 불가능하면 다음 row로 넘김
        const outOfRange = isNext ? baseIdx >= matchFields.length : baseIdx < 0;

        if (currentCellIdx !== -1 && outOfRange) {
          continue;
        }
      }

      const resolvedIdx = this.resolveCellIndex(isNext, sameRow, baseIdx, matchFields.length, currentCellIdx);

      //  유효한 index가 아니면 다음 row로
      if (resolvedIdx < 0) continue;

      const matchItem = this.getSearchMapItem(matchId) as TreeViewItem;

      if (matchItem && this.expandParents(matchItem, EXPAND_TYPE.SEARCH)) {
        this.buildViewItems();
      }

      return {
        id: matchId,
        rowIndex: this.visibleIndexMap.get(matchId) ?? -1,
        cellIndex: resolvedIdx,
        matchedFields: matchFields,
      };
    }

    // 못 찾은 경우 fallback
    return {
      id: '',
      rowIndex: -1,
      cellIndex: -1,
      matchedFields: [],
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

    if (!this.cfg.searchEnable) {
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
