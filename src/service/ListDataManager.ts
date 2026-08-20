import { ItemStatusMap, ROW_FIELD, SearchDirectionMap } from '@/constants';
import { DataManager } from '@/service/DataManager';
import {
  AddRowOptions,
  CURRENT_MATCH_INFO,
  MatchedField,
  RowId,
  SearchMatchInfo,
  SearchMode,
  SearchResult,
  ViewItem,
} from '@/types/Common';
import { GridOptions, PagingParam, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { getPagingParamToPagingInfo } from '@/util/pagingUtil';
import { gridDataSearch } from '@/util/searchUtils';
import { arrayCopy, multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';

export class ListDataManager extends DataManager {
  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain, 'list');
  }

  /**
   * init item
   * @param items items
   * @param depth depth
   * @returns
   */
  private initItems(items: any[], depth = 0): any[] {
    let orderIdx = 0;
    const viewItems: ViewItem[] = [];

    this.clearRowMap();

    items.forEach((item) => {
      this.initializeRowItem(item, depth, ItemStatusMap.READ);

      const rowId = item[ROW_FIELD.ID];
      viewItems.push({
        id: rowId,
        sortOrder: orderIdx++,
      });
      this.setRowItem(rowId, item);
    });

    return viewItems;
  }

  public setItems(items: any[]) {
    const viewItemIds = this.initItems(items);

    super.setItems(items);
    super.setOriginalViewItems(viewItemIds);

    this.updatePagingAndViewItems(viewItemIds);
  }

  /**
   * 페이징 옵션 여부에 따라 현재 ViewItems 및 페이징 정보를 업데이트합니다.
   */
  private updatePagingAndViewItems(viewItemIds: ViewItem[]): void {
    const footerOpts = this.opts.footer;
    if (footerOpts?.enabled && footerOpts.paging?.enabled) {
      const itemLength = viewItemIds.length;
      const pagingParam = this.opts.paging;

      const pagingInfo = getPagingParamToPagingInfo(pagingParam ?? ({} as PagingParam), itemLength);

      this.gridMain.setPaging(pagingInfo);
      if (itemLength < pagingInfo.countPerPage) {
        this.setViewItems(viewItemIds);
      } else {
        const countPerPage = pagingInfo.countPerPage;
        const startIdx = (pagingInfo.currPage - 1) * countPerPage;

        const viewItems = arrayCopy(viewItemIds, startIdx, startIdx + countPerPage);

        this.setViewItems(viewItems);
      }
    } else {
      this.setViewItems(viewItemIds);
    }
  }

  getSearchData(keyword: string, options: SearchMode): SearchResult {
    const items = this.getOriginalViewItems();

    this.matchOffsetMap.clear();

    let firstMatchId: RowId = '';
    let offset = 0;
    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (!isMatched || !viewItem) return;

      const id = viewItem.id;
      if (!firstMatchId) {
        firstMatchId = viewItem.id;
      }

      this.matchOffsetMap.set(id, offset);
      offset += viewItem.matchedFields?.length ?? 0;

      this.addSearchMapItem(viewItem.id, viewItem);
    };

    const result = gridDataSearch(items, this.cfg.dataManager, keyword, options);

    if (firstMatchId) {
      const firstItem = this.getSearchMapItem(firstMatchId);
      if (firstItem) firstItem.isCurrentMatch = true;
    }
    return result;
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[] {
    const sortData = multiSort(this.getViewItems(), this.cfg.dataManager, sortOrders, sortOpts.nullsLast);
    if (!this.cfg.searchEnable) {
      return sortData;
    }

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? '';

    let currentMatchIndex = 0;
    let matchRowIndex = -1;

    this.matchOffsetMap.clear();

    let offset = 0;
    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;

      const matchViewItem = this.getSearchMapItem(id);
      if (matchViewItem) {
        this.matchOffsetMap.set(id, offset);

        offset += matchViewItem.matchedFields?.length ?? 0;
      }

      if (matchRowIndex != -1) {
        continue;
      }

      if (id == matchId) {
        matchRowIndex = i;
      }
    }

    currentMatchIndex = this.getCurrentMatchIndex(matchId);

    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: searchMatchInfo.cellIndex,
    } as CURRENT_MATCH_INFO);

    return sortData;
  }

  public getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO {
    const isNext = options.direction === SearchDirectionMap.NEXT;

    const searchResult = this.getViewItems();

    const viewItem = this.getSearchMapItem(searchMatchInfo.id);
    if (viewItem) {
      viewItem.isCurrentMatch = false;
    }

    let checkMatchIndex = searchMatchInfo.rowIndex ?? -1;
    checkMatchIndex = checkMatchIndex < 0 ? this.cfg.scroll.startIdx : checkMatchIndex;

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
    return {
      id: matchId,
      rowIndex,
      cellIndex,
      matchedFields,
    };
  }

  public getRowIndexById(rowId: RowId) {
    return this.getViewItemIndex(rowId);
  }

  /**
   * 신규 행 아이템들을 지정된 기준 위치(rowId, position)에 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts AddRowOptions { rowId?, position? }
   */
  public addItems(items: any[], addOpts: AddRowOptions = { position: 'after' }, status = ItemStatusMap.READ): number {
    if (!items || items.length === 0) return -1;

    const originalViewItems = [...this.getOriginalViewItems()];
    let targetIndex = originalViewItems.length; // 기본값: 리스트 맨 끝

    const isPositionBefore = addOpts?.position === 'before';

    // 삽입 위치(targetIndex) 계산
    const addRowId = addOpts?.rowId;
    if (addRowId !== undefined) {
      const foundIdx = originalViewItems.findIndex((v) => v.id === addRowId);
      if (foundIdx !== -1) {
        if (isPositionBefore) {
          targetIndex = foundIdx;
        } else {
          // 'after' 또는 'inside' (단순 리스트 형태에서는 기준 행 다음 위치에 삽입)
          targetIndex = foundIdx + 1;
        }
      }
    } else if (isPositionBefore) {
      // addRowId가 없고 position이 'before'인 경우 가장 맨 앞으로 설정
      targetIndex = 0;
    }

    // ViewItem 생성
    const newViewItems: ViewItem[] = items.map((item) => {
      this.initializeRowItem(item, 0, status);
      const rowId = item[ROW_FIELD.ID];
      this.setRowItem(rowId, item);

      return {
        id: rowId,
        sortOrder: 0,
      };
    });

    // 신규 ViewItem 추가
    originalViewItems.splice(targetIndex, 0, ...newViewItems);

    // 재정렬
    originalViewItems.forEach((vItem, idx) => {
      vItem.sortOrder = idx;
    });

    // 갱신
    this.setOriginalViewItems(originalViewItems);
    this.updatePagingAndViewItems(originalViewItems);

    return targetIndex;
  }

  /**
   * ID 목록에 해당하는 행들을 삭제
   *
   * @param ids 삭제할 행 ID 배열
   * @returns 실제 삭제된 행 ID 배열
   */
  public removeItems(ids: RowId[]): RowId[] {
    if (!ids || ids.length === 0) return [];

    const removeSet = new Set(ids);
    const originalViewItems = this.getOriginalViewItems();
    const removedIds: RowId[] = [];
    const remainingViewItems: ViewItem[] = [];

    if (this.opts.deleteMode == 'soft') {
      for (const rowId of ids) {
        this.setItemStatus(this.getRowItem(rowId), ItemStatusMap.DELETE);
      }
    } else {
      // 제거
      originalViewItems.forEach((viewItem) => {
        const rowId = viewItem.id;
        if (removeSet.has(rowId)) {
          removedIds.push(rowId);

          // DataManager 내 데이터 삭제 처리
          if (typeof (this as any).deleteRowItem === 'function') {
            (this as any).deleteRowItem(rowId);
          } else if (typeof (this as any).removeRowItem === 'function') {
            (this as any).removeRowItem(rowId);
          }
          this.matchOffsetMap.delete(rowId);
        } else {
          remainingViewItems.push(viewItem);
        }
      });
    }

    if (removedIds.length === 0) return [];

    // 재정렬
    remainingViewItems.forEach((vItem, idx) => {
      vItem.sortOrder = idx;
    });

    // 갱신
    this.setOriginalViewItems(remainingViewItems);
    this.updatePagingAndViewItems(remainingViewItems);

    return removedIds;
  }

  public expandRow(rowId: RowId) {
    // not used
  }
}
