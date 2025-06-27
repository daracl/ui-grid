import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isUndefined } from "src/util/utils";

/**
 * link renderer
 *
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

    let aElement = element.firstElementChild as HTMLAnchorElement | null;

    // 처음 생성 시
    if (!aElement) {
      aElement = document.createElement("a");
      element.appendChild(aElement);
    }

    if (refValue) {
      aElement.href = refValue.href;
      aElement.target = refValue.target ?? "_blank";
      aElement.textContent = refValue.label ?? value;
    } else {
      aElement.href = value;
      aElement.target = "_blank";
      aElement.textContent = value;
    }
  }
}
