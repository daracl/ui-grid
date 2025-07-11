import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * password renderer
 *
 * @typedef {PasswordRenderer}
 * @extends {ViewRenderer}
 */
export default class PasswordRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = item[this.fieldName];

    const raw = String(value ?? "");
    const masked = "*".repeat(raw.length);
    element.innerText = masked;
  }
}
