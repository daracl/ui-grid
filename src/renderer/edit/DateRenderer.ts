import { EditRenderer } from '../EditRenderer';
import { FieldItem } from '@t/GridField';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { eventOn } from '@/util/eventUtils';
import { stringValidator } from '@/rule/stringValidator';
import { TextEditAbstractRenderer } from './TextEditAbstractRenderer';

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {EditRenderer}
 */
export class DateRenderer extends TextEditAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, 'date');
  }
}
