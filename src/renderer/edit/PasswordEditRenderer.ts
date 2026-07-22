import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { TextAbstractRenderer } from './TextAbstractRenderer';

/**
 * password renderer
 *
 * @class PasswordEditRenderer
 * @typedef {PasswordEditRenderer}
 * @extends {EditCellRenderer}
 */
export class PasswordEditRenderer extends TextAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, 'password');
  }
}
