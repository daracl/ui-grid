import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ROW_FIELD } from '@/constants';

import { BodyContext } from './BodyContext';
import { BodyCell } from './BodyCell';

/**
 * Row data 변경(CUD) 관련 처리를 담당
 */
export class BodyData {
  constructor(private readonly context: BodyContext, private readonly cell: BodyCell) {}

  /**
   * CUD 모드 변경.
   * new = create, modify = update, remove = delete
   */
  public setChangeValue(mode: string, rowItem: any, colInfo?: FieldItem, newValue?: any) {
    if (mode === 'new') {
      rowItem[ROW_FIELD.CUD] = 'C';
      return rowItem;
    }

    if (mode === 'remove') {
      rowItem[ROW_FIELD.CUD] = 'D';
      return rowItem;
    }

    if (mode === 'modify' && colInfo) {
      if (rowItem[ROW_FIELD.CUD] === '_') {
        rowItem[ROW_FIELD.CUD] = 'U';
      }

      rowItem[colInfo.name] = newValue;

      const config = this.context.gridMain.config();
      const cell = config.edit.cell;

      this.cell.refreshEditedCell(cell as CellInfo);

      return rowItem;
    }

    return rowItem;
  }
}
