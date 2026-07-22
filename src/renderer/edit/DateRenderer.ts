import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { TextAbstractRenderer } from './TextAbstractRenderer';

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {TextAbstractRenderer}
 */
export class DateRenderer extends TextAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, 'date');
  }
}
