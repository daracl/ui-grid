import { DataManager } from '@/service/DataManager';
import { AddRowOptions, RowId, SearchMode } from '@/types/Common';
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

  public setItems(items: any[]) {
    items = this.initItems(items);
    super.setItems(items);

    const footerOpts = this.opts.footer;
    if (footerOpts?.enabled && footerOpts.paging?.enabled) {
      const itemLength = items.length;
      const pagingParam = this.opts.paging;

      const pagingInfo = getPagingParamToPagingInfo(pagingParam ?? ({} as PagingParam), itemLength);

      this.gridMain.setPaging(pagingInfo);
      if (itemLength < pagingInfo.countPerPage) {
        this.setViewItems(this.getCurrentItems());
      } else {
        const countPerPage = pagingInfo.countPerPage;
        const startIdx = (pagingInfo.currPage - 1) * countPerPage;

        this.setViewItems(this.getCurrentItems(), startIdx, startIdx + countPerPage);
      }
    } else {
      this.setViewItems(this.getCurrentItems());
    }
  }

  getSearchData(keyword: string, options: SearchMode): any[] {
    const items = this.getCurrentItems();
    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.matchCount = 0;
    options.postProcess = (isMatched: boolean, item: any) => {
      if (isMatched) {
        searchMatchInfo.matchCount += 1;
      }
    };

    options.hideNonMatched = options.hideNonMatched ?? true;

    return gridDataSearch(items, keyword, options).items;
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): any[] {
    if (sortOrders.length > 0) {
      return multiSort(this.getViewItems(), sortOrders, sortOpts.nullsLast);
    } else {
      return multiSort(this.getViewItems(), [], sortOpts.nullsLast);
    }
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
