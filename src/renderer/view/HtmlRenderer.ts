import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * html renderer
 *
 * @export
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewRenderer}
 */
export default class HtmlRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    element.innerHTML = `<div>${value}</div>`;
  }
}
