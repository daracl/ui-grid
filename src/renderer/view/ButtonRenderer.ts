import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewRenderer}
 */
export default class ButtonRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    element.innerHTML = `<div class="dg-cell-btn">${value}</div>`;
  }
}
