import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * view custom renderer
 *
 * @class ViewCustomRenderer
 * @typedef {ViewCustomRenderer}
 * @extends {ViewRenderer}
 */
export default class ViewCustomRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = `<input type="text">`;
  }
}
