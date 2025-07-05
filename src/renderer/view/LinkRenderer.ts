import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isUndefined } from "src/util/utils";
import GridMain from "src/view/GridMain";
import { eventOn, stopPreventCancel } from "src/util/eventUtils";
import { getCellInfo } from "src/util/gridUtils";

/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {ViewRenderer}
 */
export default class LinkRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    let aElement = element.firstElementChild as HTMLAnchorElement | null;

    // 처음 생성 시
    if (!aElement) {
      aElement = document.createElement("a");
      aElement.className = this.getRendererStyleClass("dg-cell-content");
      aElement.setAttribute("tabindex", "-1");
      element.appendChild(aElement);
      this.initEvent(aElement);
    }

    if (refValue) {
      aElement.href = this.isClick ? "#" : refValue.href;
      if (!this.isClick) {
        aElement.target = refValue.target ?? "_blank";
      }
      aElement.textContent = refValue.label ?? value;
    } else {
      aElement.href = this.isClick ? "#" : value;
      if (!this.isClick) {
        aElement.target = "_blank";
      }
      aElement.textContent = value;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.getGrid().config();
    eventOn(
      contentElement,
      "pointerdown",
      (e: UIEvent) => {
        console.log("link click");
        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;
        const cellInfo = getCellInfo(cfg, cellElement);

        this.click(e, cellElement, cellInfo);
      },
      { passive: false }
    );
  }
}
