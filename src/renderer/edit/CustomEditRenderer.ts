import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { FieldItem } from '@t/GridField';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * custom renderer
 *
 * @class CustomEditRenderer
 * @typedef {CustomEditRenderer}
 * @extends {EditCellRenderer}
 */
export class CustomEditRenderer extends EditCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public getValue(value: any) {
    return value[this.field.name];
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    element.innerHTML = '<input type="text">';
    const value = item[cellInfo.field.name];

    this.getValue(value);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
