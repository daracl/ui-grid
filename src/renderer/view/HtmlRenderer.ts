import { FieldItem } from "@t/GridField";
import { ViewRenderer } from "../ViewRenderer";
import { GridMain } from "@/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { isString } from "@/util/utils";

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
    const value = item[this.fieldName];

    const refValue = this.getRefValue(value);

    if (refValue) {
      const template = refValue.template;
      if (isString(refValue.template)) {
        element.innerHTML = refValue.template;
      } else {
        const oldEl = element.firstChild;
        if (oldEl) {
          element.replaceChild(template, oldEl);
        } else {
          element.appendChild(template);
        }
      }
    } else {
      element.innerHTML = value;
    }
  }
}
