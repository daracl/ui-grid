import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * hidden renderer
 *
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ViewCellRenderer}
 */
export class HiddenRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    // intentionally empty
  }
}
