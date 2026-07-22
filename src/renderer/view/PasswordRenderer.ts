import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { ALIGN_STYLE } from '@/constantStyles';

/**
 * password renderer
 *
 * @typedef {PasswordRenderer}
 * @extends {ViewCellRenderer}
 */
export class PasswordRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const masked = '********';

    if (element.textContent !== masked) {
      element.textContent = masked;
    }
  }

  public alignStyle() {
    return ALIGN_STYLE.center;
  }

  public supportsEdit() {
    return true;
  }
}
