import { ItemStatusMap, ROW_FIELD } from '@/constants';
import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';

/**
 * aside modify info
 *
 * @class AsideModifyInfoRenderer
 * @typedef {AsideModifyInfoRenderer}
 * @extends {ViewCellRenderer}
 */
export class AsideModifyInfoRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const cudValue = item[ROW_FIELD.CUD];
    if (cudValue == ItemStatusMap.CREATE) {
      element.textContent = 'C';
      return;
    }

    if (cudValue == ItemStatusMap.MODIFY) {
      element.textContent = 'M';
      return;
    }

    if (cudValue == ItemStatusMap.DELETE) {
      element.textContent = 'D';
      return;
    }

    element.textContent = '';
  }

  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.center;
  }
}
