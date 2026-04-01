import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * rowDragHandle renderer
 *
 * @class AsideRowDragHandleRenderer
 * @typedef {AsideRowDragHandleRenderer}
 * @extends {ViewRenderer}
 */
export class AsideRowDragHandleRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    if (!element.classList.contains('dg-row-drag-handle')) {
      element.classList.add('dg-row-drag-handle');
    }
  }
}
