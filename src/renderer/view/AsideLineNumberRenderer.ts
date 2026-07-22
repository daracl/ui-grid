import { ALIGN_STYLE } from '@/constantStyles';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * Aside LineNumber renderer
 *
 * @class AsideLineNumberRenderer
 * @typedef {AsideLineNumberRenderer}
 * @extends {ViewCellRenderer}
 */
export class AsideLineNumberRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.textContent = cellInfo.rowIndex + 1 + '';
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
