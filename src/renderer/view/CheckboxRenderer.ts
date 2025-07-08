import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import ViewRenderer from "../ViewRenderer";
import { eventOn } from "src/util/eventUtils";
import { getCellInfo } from "src/util/gridUtils";

/**
 * checkbox renderer
 *
 * @class CheckboxRenderer
 * @typedef {CheckboxRenderer}
 * @extends {ViewRenderer}
 */
export default class CheckboxRenderer extends ViewRenderer {
  private trueValue: string | boolean;
  private falseValue: string | boolean;
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const inputName = this.fieldName;

    const val = item[inputName];

    let input = element.firstElementChild as HTMLInputElement;

    // 최초 렌더링 시 구조 생성
    if (!input) {
      input = document.createElement("input");
      input.type = "checkbox";
      input.name = inputName;

      const mark = document.createElement("span");
      mark.className = "checkmark";

      element.appendChild(input);
      element.appendChild(mark);
      this.initClick(input);
    }
    input.checked = val === this.trueValue;
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
      },
      { passive: false }
    );
  }
}
