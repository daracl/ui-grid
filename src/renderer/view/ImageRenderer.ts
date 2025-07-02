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

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);
    const labelText = refValue?.label ?? null;
    const src = refValue?.src ?? value;
    const alt = refValue?.alt ?? "";

    // 캐싱된 요소 재사용
    let img = element.querySelector("img.dg-img") as HTMLImageElement;
    let label = element.querySelector("span.dg-img-label") as HTMLSpanElement;

    // img 없으면 새로 생성
    if (!img) {
      img = document.createElement("img");
      img.className = this.getRendererStyleClass("dg-img");
      element.appendChild(img);
    }

    // 이미지 속성 변경이 필요한 경우만 변경
    if (img.src !== src) img.src = src;
    if (alt && img.alt !== alt) img.alt = alt;

    // label이 필요한 경우
    if (labelText) {
      if (!label) {
        label = document.createElement("span");
        label.className = "dg-img-label";
        element.appendChild(label);
      }

      if (label.textContent !== labelText) {
        label.textContent = labelText;
      }
    } else if (label) {
      // 필요 없는 label은 제거
      label.remove();
    }
  }

  public isWrapper() {
    return false;
  }
}
