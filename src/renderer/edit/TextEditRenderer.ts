import { EditRenderer } from '../EditRenderer';
import { FieldItem } from '@t/GridField';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { eventOn } from '@/util/eventUtils';
import { stringValidator } from '@/rule/stringValidator';
import { TextEditAbstractRenderer } from './TextEditAbstractRenderer';

/**
 * text edit renderer
 *
 * @typedef {TextEditRenderer}
 * @extends {EditRenderer}
 */
export class TextEditRenderer extends TextEditAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, 'text');
  }
}
