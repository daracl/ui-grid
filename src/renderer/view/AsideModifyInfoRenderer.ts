import { FieldItem } from "@t/GridField";
import { ViewRenderer } from "../ViewRenderer";
import { GridMain } from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { ROW_CUD_KEY } from "src/constants";

/**
 * aside modify info
 *
 * @class AsideModifyInfoRenderer
 * @typedef {AsideModifyInfoRenderer}
 * @extends {ViewRenderer}
 */
export class AsideModifyInfoRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const cudValue = item[ROW_CUD_KEY];
    if (cudValue == "C") {
      element.innerText = "C";
      return;
    }

    if (cudValue == "U") {
      element.innerText = "M";
      return;
    }

    if (cudValue == "D") {
      element.innerText = "D";
      return;
    }

    element.innerText = "";
  }
}
