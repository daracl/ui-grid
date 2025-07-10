import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideLineNumberRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.innerText = cellInfo.rowIndex + 1 + "";
  }
}
