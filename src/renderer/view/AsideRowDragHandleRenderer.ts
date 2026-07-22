import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { ALIGN_STYLE } from '@/constantStyles';

/**
 * rowDragHandle renderer
 *
 * @class AsideRowDragHandleRenderer
 * @typedef {AsideRowDragHandleRenderer}
 * @extends {ViewCellRenderer}
 */
export class AsideRowDragHandleRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    if (!element.classList.contains('dg-row-drag-handle')) {
      element.classList.add('dg-row-drag-handle');
    }
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }

  public supportsEdit() {
    return false;
  }
}
