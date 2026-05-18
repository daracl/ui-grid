import { DataManager, RowId } from '@/service/DataManager';
import { SearchMode } from '@/types/Common';
import { Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';

export class ListDataManager extends DataManager {
  constructor(opts: GridOptions, cfg: Config) {
    super(opts, cfg);
  }

  public addRow(newItem: any): void {
    throw new Error('Method not implemented.');
  }
  public removeRows(ids: RowId[]): RowId[] {
    throw new Error('Method not implemented.');
  }
  search(keyword: string, options: SearchMode): any[] {
    throw new Error('Method not implemented.');
  }
}
