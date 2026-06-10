import { DataManager } from '@/service/DataManager';
import { AddRowOptions, RowId, SearchMode, SearchResult, ViewItem } from '@/types/Common';
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

  public setItems(items: any[]) {
    const viewItemIds = this.initItems(items);

    super.setItems(items);

    const footerOpts = this.opts.footer;
    if (footerOpts?.enabled && footerOpts.paging?.enabled) {
      const itemLength = items.length;
      const pagingParam = this.opts.paging;

      const pagingInfo = getPagingParamToPagingInfo(pagingParam ?? ({} as PagingParam), itemLength);

      this.gridMain.setPaging(pagingInfo);
      if (itemLength < pagingInfo.countPerPage) {
        this.setViewItemIds(viewItemIds);
      } else {
        const countPerPage = pagingInfo.countPerPage;
        const startIdx = (pagingInfo.currPage - 1) * countPerPage;

        this.setViewItemIds(viewItemIds, startIdx, startIdx + countPerPage);
      }
    } else {
      this.setViewItemIds(viewItemIds);
    }
  }

  getSearchData(keyword: string, options: SearchMode): SearchResult {
    const items = this.getCurrentItems();

    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (isMatched) {
        if (viewItem) {
          this.addMatchMap(viewItem.id, viewItem);
        }
      }
    };

    return gridDataSearch(items, keyword, options);
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[] {
    return multiSort(this.convertViewItemsToRowItems(), sortOrders, sortOpts.nullsLast);
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
