import { ROW_ID_FIELD_NAME, SearchDirectionMap } from '@/constants';
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
import { multiSort } from '@/util/utils';
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

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? '';

    let currentMatchIndex = 0;
    let matchRowIndex = -1;

    this.matchOffsetMap.clear();
    const searchEnable = this.cfg.searchEnable;
    let offset = 0;
    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;

      if (searchEnable) {
        const matchViewItem = this.getSearchMapItem(id);
        if (matchViewItem) {
          this.matchOffsetMap.set(id, offset);

          offset += matchViewItem.matchedFields?.length ?? 0;
        }
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
