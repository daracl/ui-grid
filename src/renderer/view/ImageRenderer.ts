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
      element.innerHTML = `<img src="${refValue.src}" ${refValue.alt ? 'alt="' + refValue.alt + '"' : ""}/> ${refValue.label ? `<span>${refValue.label}</span>` : ""}`;
    } else {
      element.innerHTML = `<img src="${value}"/>`;
    }
  }

  public isWrapper() {
    return false;
  }
}
