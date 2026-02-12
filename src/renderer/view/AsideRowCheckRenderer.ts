import { FieldItem } from "@t/GridField";
import { ViewRenderer } from "../ViewRenderer";
import { ROW_CHECK_KEY } from "@/constants";
import { GridMain } from "@/view/GridMain";
import { eventOn } from "@/util/eventUtils";
import { getCellInfo } from "@/util/gridUtils";
import { CellInfo } from "@t/GridConfig";

/**
 * Aside RowCheck Renderer
 *
 * @class AsideRowCheckRenderer
 * @typedef {AsideRowCheckRenderer}
 * @extends {ViewRenderer}
 */
export class AsideRowCheckRenderer extends ViewRenderer {
  private allowMultiSelect: boolean;
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    this.allowMultiSelect = field.renderer.customOptions?.allowMultiSelect ?? true;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const isMulti = this.allowMultiSelect;
    const inputName = ROW_CHECK_KEY;

    let label = element.firstElementChild as HTMLLabelElement;

    // 최초 렌더링 시 구조 생성
    if (!label) {
      label = document.createElement("label");

      const input = document.createElement("input");
      input.type = isMulti ? "checkbox" : "radio";
      input.name = "dgRowCheck";
      if (!isMulti) input.classList.add("childRadio");

      const mark = document.createElement("span");
      mark.className = isMulti ? "dg-checkmark" : "radiomark";

      label.appendChild(input);
      label.appendChild(mark);

      element.appendChild(label);

      this.initClick(input);
    }
    const input = label.firstChild as HTMLInputElement;
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

        this.gridMain.getBody().setCheckItem(cellInfo, contentElement.checked);
      },
      { passive: false }
    );
  }
}
