import { isHTMLElement } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewRenderer}
 */
export class HtmlRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);

    const refValue = this.getRefValue(value, item);

    if (refValue) {
      const template = refValue;

      if (isHTMLElement(template)) {
        const oldEl = element.firstChild;
        if (oldEl) {
          element.replaceChild(template, oldEl);
        } else {
          element.appendChild(template);
        }
      } else {
        element.innerHTML = template;
      }
    } else {
      element.innerHTML = value;
    }
  }
}
