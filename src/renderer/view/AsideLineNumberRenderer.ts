import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideLineNumberRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = rowIdx + 1 + "";
  }
}
