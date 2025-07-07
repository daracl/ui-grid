import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";
import { eventOn, stopPreventCancel } from "src/util/eventUtils";
import { getCellInfo } from "src/util/gridUtils";

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewRenderer}
 */
export default class ButtonRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];

    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement("div");
      btnElement.className = this.getRendererStyleClass("dg-cell-content");
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }

    // 값이 바뀌었을 때만 갱신
    if (btnElement.textContent !== value) {
      btnElement.textContent = value;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.getGrid().config();
    eventOn(
      contentElement,
      "click",
      (e: UIEvent) => {
        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;
        const cellInfo = getCellInfo(cfg, cellElement);

        this.click(e, cellElement, cellInfo);
      },
      { passive: false }
    );
  }
}
