import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';
import { TextAbstractRenderer } from './TextAbstractRenderer';

/**
 * text edit renderer
 *
 * @typedef {TextEditRenderer}
 * @extends {EditRenderer}
 */
export class TextEditRenderer extends TextAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, 'text');
  }
}
