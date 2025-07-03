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

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];

    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement("div");
      btnElement.className = this.getRendererStyleClass("dg-cell-content");
      element.appendChild(btnElement);
    }

    // 값이 바뀌었을 때만 갱신
    if (btnElement.textContent !== value) {
      btnElement.textContent = value;
    }
  }
}
