import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";

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

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = ``;
  }
}
