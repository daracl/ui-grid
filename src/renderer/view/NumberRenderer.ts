import { ALIGN_STYLE } from '@/constantStyles';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';

/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ViewCellRenderer}
 */
export class NumberRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const renderValue = this.getValue(item);

    if (element.textContent !== renderValue) {
      element.textContent = renderValue;
    }
  }

  public alignStyle(): string {
    return ALIGN_STYLE.right;
  }

  public supportsEdit() {
    return true;
  }
}
