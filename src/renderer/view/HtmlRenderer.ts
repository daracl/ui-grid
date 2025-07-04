import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewRenderer}
 */
export default class HtmlRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    element.innerHTML = value;
  }
}
