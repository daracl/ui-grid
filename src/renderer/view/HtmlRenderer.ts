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

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    element.innerHTML = `<div>${value}</div>`;
  }
}
