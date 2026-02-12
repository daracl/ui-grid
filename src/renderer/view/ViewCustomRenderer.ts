import { FieldItem } from "@t/GridField";
import { ViewRenderer } from "../ViewRenderer";
import { GridMain } from "@/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * view custom renderer
 *
 * @class ViewCustomRenderer
 * @typedef {ViewCustomRenderer}
 * @extends {ViewRenderer}
 */
export class ViewCustomRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.innerText = `<input type="text">`;
  }
}
