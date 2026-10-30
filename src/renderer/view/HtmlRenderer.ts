import { isHTMLElement, setSafeHtml } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridOptions } from '@/types/GridOptions';

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewCellRenderer}
 */
export class HtmlRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);

    const refValue = this.getRefValue(value, item) as any;

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
        setSafeHtml(element, template);
      }
    } else {
      setSafeHtml(element, value);
    }
  }

  public getMinWidth(cfg: Config, opts: GridOptions) {
    return 60;
  }
}
