import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * link renderer
 *
 * @export
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {ViewRenderer}
 */
export default class LinkRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    const refValue = this.getRefValue(value);
    if (refValue) {
      element.innerHTML = `<a href="${refValue.href}" _blank="${refValue.target ?? ""}">${value}</a>`;
    } else {
      element.innerHTML = `<a href="${value}">${value}</a>`;
    }
  }
}
