import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * image renderer
 *
 * @export
 * @class ImageRenderer
 * @typedef {ImageRenderer}
 * @extends {ViewRenderer}
 */
export default class ImageRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    const refValue = this.getRefValue(value);
    if (refValue) {
      element.innerHTML = `<img src="${refValue.src}" ${refValue.alt ? 'alt="' + refValue.alt + '"' : ""}"/>`;
    } else {
      element.innerHTML = `<img src="${value}"/>`;
    }
  }
}
