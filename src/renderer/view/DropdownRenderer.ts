import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isUndefined } from "src/util/utils";

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewRenderer}
 */
export default class DropdownRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    let contentElement = element.firstElementChild as HTMLElement;

    // 처음 생성 시
    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.className = this.getRendererStyleClass("dg-cell-content");

      const text = document.createElement("div");
      text.className = "dg-cell-content-label";
      const icon = document.createElement("div");
      icon.className = "dg-cell-content-icon";

      contentElement.appendChild(text);
      contentElement.appendChild(icon);

      element.appendChild(contentElement);
    }

    const textElement = contentElement.querySelector(".dg-cell-content-label") as HTMLElement;

    if (refValue) {
      textElement.textContent = refValue.label ?? value;
    } else {
      textElement.textContent = value;
    }
  }
}
