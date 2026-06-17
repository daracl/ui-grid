import { ROW_ID_FIELD_NAME, SearchDirectionMap } from '@/constants';
import { DataManager } from '@/service/DataManager';
import {
  AddRowOptions,
  CURRNET_MATCH_INFO,
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
import { multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';

export class ListDataManager extends DataManager {
  private searchMatchedIds: RowId[] = [];

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
      this.createRowItem(item, depth);

      const rowId = item[ROW_ID_FIELD_NAME];
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

    const footerOpts = this.opts.footer;
    if (footerOpts?.enabled && footerOpts.paging?.enabled) {
      const itemLength = items.length;
      const pagingParam = this.opts.paging;

      const pagingInfo = getPagingParamToPagingInfo(pagingParam ?? ({} as PagingParam), itemLength);

      this.gridMain.setPaging(pagingInfo);
      if (itemLength < pagingInfo.countPerPage) {
        this.setViewItems(viewItemIds);
      } else {
        const countPerPage = pagingInfo.countPerPage;
        const startIdx = (pagingInfo.currPage - 1) * countPerPage;

        this.setViewItems(viewItemIds, startIdx, startIdx + countPerPage);
      }
    } else {
      this.setViewItems(viewItemIds);
    }
  }

  getSearchData(keyword: string, options: SearchMode): SearchResult {
    const items = this.getOriginalViewItems();
    const matchedIds: RowId[] = [];
    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (isMatched) {
        if (viewItem) {
          matchedIds.push(viewItem.id);
          this.addSearchMapItem(viewItem.id, viewItem);
        }
      }
    };
    this.searchMatchedIds = matchedIds;

    if (matchedIds.length > 0) {
      const firstItem = this.getSearchMapItem(matchedIds[0]);
      if (firstItem) firstItem.isCurrentMatch = true;
    }
    return gridDataSearch(items, this.cfg.dataManager, keyword, options);
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[] {
    const sortData = multiSort(this.getViewItems(), this.cfg.dataManager, sortOrders, sortOpts.nullsLast);

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? '';

    let currentMatchIndex = 0;
    let matchRowIndex = -1;
    const matchedIds: RowId[] = [];
    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;
      const searchViewItem = this.getSearchMapItem(id);

      if (searchViewItem) {
        matchedIds.push(id);
      }

      if (matchRowIndex != -1) {
        continue;
      }

      if (id == matchId) {
        matchRowIndex = i;
      }
    }

    this.searchMatchedIds = matchedIds;
    currentMatchIndex = this.getCurrentMatchIndex(matchedIds, matchId);

    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: searchMatchInfo.cellIndex,
    } as CURRNET_MATCH_INFO);

    return sortData;
  }

  public getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRNET_MATCH_INFO {
    const isPrev = options.direction === SearchDirectionMap.PREV;

    const searchResult = this.getViewItems();

    const searchMatchedIds = this.searchMatchedIds;

    const viewItem = this.getSearchMapItem(searchMatchInfo.id);
    if (viewItem) {
      viewItem.isCurrentMatch = false;
    }

    let currentMatchInfo;
    if (isNew) {
      currentMatchInfo = {
        id: searchMatchedIds[0],
        rowIndex: -1,
        cellIndex: 0,
      } as CURRNET_MATCH_INFO;
    } else {
      const checkMatchIndex = searchMatchInfo.rowIndex ?? -1;

      currentMatchInfo = isPrev
        ? this.getPrevMatch(checkMatchIndex, searchMatchInfo, searchResult)
        : this.getNextMatch(checkMatchIndex, searchMatchInfo, searchResult);
    }

    const matchRowId = currentMatchInfo.id;

    const matchViewItem = this.getSearchMapItem(matchRowId);

    if (matchViewItem) {
      matchViewItem.isCurrentMatch = true;
      currentMatchInfo.matchedFields = matchViewItem.matchedFields ?? [];
    }

    const currentMatchIndex = this.getCurrentMatchIndex(searchMatchedIds, matchRowId);

    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchRowId,
      rowIndex: currentMatchInfo.rowIndex,
      cellIndex: currentMatchInfo.cellIndex,
    } as CURRNET_MATCH_INFO);

    return currentMatchInfo;
  }

  /**
   * 검색 다음 찾기
   * @param searchMatchInfo 검색 정보
   * @param searchResult 검색 결과
   * @returns
   */
  private getNextMatch(
    checkMatchIndex: number,
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
  ): CURRNET_MATCH_INFO {
    const checkItemIdx = searchMatchInfo.cellIndex;

    let matchRowIndex = -1;
    let itemIndex = -1;
    let matchId: RowId = '';
    let matchedInfo: MatchedField[] = [];

    const searchResultLength = searchResult.length;

    // 순환 정방향 검색
    for (let i = 0; i < searchResultLength; i++) {
      const searchRowIdx = (checkMatchIndex + i) % searchResultLength;

      const item = searchResult[searchRowIdx];
      const itemMatchInfos = this.getSearchMapItem(item.id)?.matchedFields;

      if (!itemMatchInfos?.length) continue;

      matchId = item.id;

      // 시작 row 처리
      if (searchRowIdx === checkMatchIndex) {
        const nextItemIdx = checkItemIdx + 1;

        if (checkItemIdx === -1 || nextItemIdx < itemMatchInfos.length) {
          matchRowIndex = searchRowIdx;
          itemIndex = checkItemIdx === -1 ? 0 : nextItemIdx;
          matchedInfo = itemMatchInfos;
          break;
        }

        // 현재 row에 다음 match가 없으면 다음 row로
        continue;
      }

      // 다른 row는 항상 첫 번째 match 선택
      matchRowIndex = searchRowIdx;
      itemIndex = 0;
      matchedInfo = itemMatchInfos;
      break;
    }

    return {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: itemIndex,
      matchedFields: matchedInfo,
    };
  }

  /**
   * 검색 이전 찾기
   * @param searchMatchInfo 검색 정보
   * @param searchResult 검색 결과
   * @returns
   */
  private getPrevMatch(
    checkMatchIndex: number,
    searchMatchInfo: SearchMatchInfo,
    searchResult: ViewItem[],
  ): CURRNET_MATCH_INFO {
    const checkItemIdx = searchMatchInfo.cellIndex;

    let matchIndex = -1;
    let itemIndex = -1;
    let matchId: RowId = '';
    let matchedInfo: MatchedField[] = [];
    const searchResultLength = searchResult.length;

    // 순환 역방향 검색
    for (let i = 0; i < searchResultLength; i++) {
      const searchRowIdx = (checkMatchIndex - i + searchResultLength) % searchResultLength;

      const item = searchResult[searchRowIdx];
      const itemMatchInfos = this.getSearchMapItem(item.id)?.matchedFields;

      if (!itemMatchInfos?.length) continue;

      matchId = item.id;

      // 시작 row 처리
      if (searchRowIdx === checkMatchIndex) {
        const prevItemIdx = checkItemIdx === -1 ? itemMatchInfos.length - 1 : checkItemIdx - 1;

        if (prevItemIdx >= 0) {
          matchIndex = searchRowIdx;
          itemIndex = prevItemIdx;
          matchedInfo = itemMatchInfos;
          break;
        }

        // 현재 row에 이전 match가 없으면 다음 순환 row 검사
        continue;
      }

      // 다른 row는 항상 마지막 match 선택
      matchIndex = searchRowIdx;
      itemIndex = itemMatchInfos.length - 1;
      matchedInfo = itemMatchInfos;
      break;
    }

    return {
      id: matchId,
      rowIndex: matchIndex,
      cellIndex: itemIndex,
      matchedFields: matchedInfo,
    };
  }
  public addRows(addOpts: AddRowOptions): void {
    throw new Error('Method not implemented.');
  }
  public removeRows(ids: RowId[]): RowId[] {
    throw new Error('Method not implemented.');
  }

  public expandRow(rowId: RowId) {
    // not used
  }
}
