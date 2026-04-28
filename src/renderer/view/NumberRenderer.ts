import { ALIGN_STYLE } from '@/constants';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ViewRenderer}
 */
export class NumberRenderer extends ViewRenderer {
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

  public canEdit() {
    return true;
  }
}
