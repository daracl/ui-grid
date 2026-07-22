import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ViewCellRenderer}
 */
export class TextRenderer extends ViewCellRenderer {
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

  public supportsEdit() {
    return true;
  }
}
