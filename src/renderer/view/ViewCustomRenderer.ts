import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";

/**
 * view custom renderer
 *
 * @class ViewCustomRenderer
 * @typedef {ViewCustomRenderer}
 * @extends {ViewRenderer}
 */
export default class ViewCustomRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = `<input type="text">`;
  }
}
