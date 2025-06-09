import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * aside modify info
 *
 * @class AsideModifyInfoRenderer
 * @typedef {AsideModifyInfoRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideModifyInfoRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = ``;
  }
}
