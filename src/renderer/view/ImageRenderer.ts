import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { Config } from "@t/GridConfig";

/**
 * image renderer
 *
 * @class ImageRenderer
 * @typedef {ImageRenderer}
 * @extends {ViewRenderer}
 */
export default class ImageRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement, config: Config): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);
    if (refValue) {
      let labelHtml = "";
      let styleClass = "dg-img";
      if (refValue.label) {
        styleClass = "dg-img-label";
        labelHtml = `<span class="dg-img-label">${refValue.label}</span>`;
      }

      element.innerHTML = `<img class="dg-img" src="${refValue.src}" ${refValue.alt ? 'alt="' + refValue.alt + '"' : ""}/>${labelHtml}`;
    } else {
      element.innerHTML = `<img class="dg-img" src="${value}"/>`;
    }
  }

  public isWrapper() {
    return false;
  }
}
