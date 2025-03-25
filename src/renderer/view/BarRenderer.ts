import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * bar renderer
 *
 * @class BarRenderer
 * @typedef {BarRenderer}
 * @extends {ViewRenderer}
 */
export default class BarRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    element.innerHTML = `<div>bar${value}</div>`;
  }
}
