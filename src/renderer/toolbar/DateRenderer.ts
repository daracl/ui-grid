import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';
import { TextRenderer } from './TextRenderer';

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {EditRenderer}
 */
export class DateRenderer extends TextRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(element: HTMLElement): void {
    //this.textRender(cellInfo, element, 'date');
  }
}
