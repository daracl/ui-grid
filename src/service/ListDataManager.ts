import { ALL_SELECT_VALUE } from '@/constants';
import { DataManager } from '@/service/DataManager';
import { AddRowOptions, RowId, SearchMode } from '@/types/Common';
import { GridOptions } from '@/types/GridOptions';
import { gridDataSearch } from '@/util/searchUtils';
import { GridMain } from '@/view/GridMain';

export class ListDataManager extends DataManager {
  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain);
  }

  public setItems(items: any[]) {
    items = this.initItems(items);
    super.setItems(items);
    this.setViewItems(this.getCurrentItems());
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
