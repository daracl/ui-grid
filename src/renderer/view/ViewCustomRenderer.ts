import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * view custom renderer
 *
 * @class ViewCustomRenderer
 * @typedef {ViewCustomRenderer}
 * @extends {ViewCellRenderer}
 */
export class ViewCustomRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.innerHTML = '<input type="text">';
  }
}
