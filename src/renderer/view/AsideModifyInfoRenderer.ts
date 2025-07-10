import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * aside modify info
 *
 * @class AsideModifyInfoRenderer
 * @typedef {AsideModifyInfoRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideModifyInfoRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.innerText = ``;
  }
}
