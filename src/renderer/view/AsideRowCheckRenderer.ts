import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { ROW_CHECK_KEY } from "src/constants";
import GridMain from "src/view/GridMain";
import { eventOn } from "src/util/eventUtils";
import { getCellInfo } from "src/util/gridUtils";

/**
 * Aside RowCheck Renderer
 *
 * @class AsideRowCheckRenderer
 * @typedef {AsideRowCheckRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideRowCheckRenderer extends ViewRenderer {
  private allowMultiSelect: boolean;
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    this.allowMultiSelect = field.renderer.customOptions?.allowMultiSelect ?? true;
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const isMulti = this.allowMultiSelect;
    const inputName = ROW_CHECK_KEY;

    let input = element.firstElementChild as HTMLInputElement | null;

    // 최초 렌더링 시 구조 생성
    if (!input) {
      input = document.createElement("input");
      input.type = isMulti ? "checkbox" : "radio";
      input.name = "dgRowCheck";
      if (!isMulti) input.classList.add("childRadio");

      const mark = document.createElement("span");
      mark.className = isMulti ? "dg-checkmark" : "radiomark";

      element.appendChild(input);
      element.appendChild(mark);
      this.initClick(input);
    }
    input.checked = item[inputName];
  }

  public isAllowMultiSelect(): boolean {
    return this.allowMultiSelect;
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.getGrid().config();
    eventOn(
      contentElement,
      "click",
      (e: UIEvent) => {
        const cellElement = contentElement.closest(".dg-cell") as HTMLElement;

        const cellInfo = getCellInfo(cfg, cellElement);

        const checked = contentElement.checked;

        const item = cellInfo.item;

        this.gridMain.getBody().setCheckItem(cellInfo, checked, item);
      },
      { passive: false }
    );
  }
}
