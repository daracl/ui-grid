import { CellInfo } from '@t/GridConfig';
import { EditRenderer } from '../EditRenderer';
import { FieldItem } from '@t/GridField';
import { GridMain } from '@/view/GridMain';

/**
 * textarea renderer
 *
 * @class TextAreaRenderer
 * @typedef {TextAreaRenderer}
 * @extends {EditRenderer}
 */
export class TextAreaRenderer extends EditRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    element.innerHTML = '<textarea></textarea>';
    const value = item[cellInfo.field.name];

    this.getValue(value);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
