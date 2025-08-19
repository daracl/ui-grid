import { FieldItem } from "@t/GridField";
import { ViewRenderer } from "../ViewRenderer";
import { GridMain } from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * password renderer
 *
 * @typedef {PasswordRenderer}
 * @extends {ViewRenderer}
 */
export class PasswordRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const raw = String(this.getValue(item) ?? "");
    const masked = "*".repeat(raw.length);

    if (element.textContent != masked) {
      const oldEl = element.firstChild;

      const newTextElement = document.createTextNode(masked);

      if (oldEl) {
        element.replaceChild(newTextElement, oldEl);
      } else {
        element.appendChild(newTextElement);
      }
    }
  }
}
