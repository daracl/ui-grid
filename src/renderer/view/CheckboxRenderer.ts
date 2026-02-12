import { FieldItem } from "@t/GridField";
import { GridMain } from "@/view/GridMain";
import { ViewRenderer } from "../ViewRenderer";
import { eventOn } from "@/util/eventUtils";
import { getCellInfo } from "@/util/gridUtils";
import { CellInfo } from "@t/GridConfig";

/**
 * checkbox renderer
 *
 * @class CheckboxRenderer
 * @typedef {CheckboxRenderer}
 * @extends {ViewRenderer}
 */
export class CheckboxRenderer extends ViewRenderer {
  private readonly trueValue: string | boolean;
  private readonly falseValue: string | boolean;
  private readonly showLabel: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
    this.showLabel = rendererInfo.showLabel ?? false;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const inputName = this.fieldName;

    const val = item[inputName];

    let label = element.firstElementChild as HTMLLabelElement;

    // 최초 렌더링 시 구조 생성
    if (!label) {
      label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = inputName;

      const mark = document.createElement("span");
      mark.className = "dg-checkmark";

      label.appendChild(input);
      label.appendChild(mark);

      if (this.showLabel) {
        const textLabel = document.createElement("span");
        textLabel.className = "dg-cell-content-label dg-cell-ellipsis";
        label.appendChild(textLabel);
      }

      element.appendChild(label);

      this.initClick(input);
    }

    const input = label.firstChild as HTMLInputElement;
    input.checked = val === this.trueValue;

    if (this.showLabel) {
      const labelElement = element.querySelector(".dg-cell-content-label");
      if (labelElement) labelElement.textContent = val;
    }
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

        item[this.fieldName] = checked ? this.trueValue : this.falseValue;

        this.render(cellInfo, cellElement);
      },
      { passive: false }
    );
  }

  public isEditRenderer() {
    return true;
  }
}
