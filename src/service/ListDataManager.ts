import { ROW_ID_FIELD_NAME } from '@/constants';
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

    options.postProcess = (isMatched: boolean, item: any, viewItem?: ViewItem) => {
      if (isMatched) {
        if (viewItem) {
          this.addMatchMap(viewItem.id, viewItem);
        }
      }
    };

    return gridDataSearch(items, this.cfg.dataManager, keyword, options);
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[] {
    return multiSort(this.getViewItems(), this.cfg.dataManager, sortOrders, sortOpts.nullsLast);
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
