import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isUndefined } from "src/util/utils";

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

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    if (!isUndefined(refValue)) {
      element.innerHTML = `<a href="${refValue.href}" _blank="${refValue.target ?? ""}">${value}</a>`;
    } else {
      element.innerHTML = `<a href="${value}">${value}</a>`;
    }
  }
}
