import { ALL_SELECT_VALUE } from '@/constants';
import { DataManager } from '@/service/DataManager';
import { AddRowOptions, RowId, SearchMode } from '@/types/Common';
import { GridOptions, PagingParam } from '@/types/GridOptions';
import { PagingInfo } from '@/types/PagingInfo';
import { getPagingInfo, getPagingParamToPagingInfo } from '@/util/pagingUtil';
import { gridDataSearch } from '@/util/searchUtils';
import { GridMain } from '@/view/GridMain';

export class ListDataManager extends DataManager {
  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain);
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

    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.cfg.currentFields
        .filter((item) => !item.$isAside)
        .map((item) => {
          return item.name;
        });
    }

    return gridDataSearch(items, keyword, options);
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
