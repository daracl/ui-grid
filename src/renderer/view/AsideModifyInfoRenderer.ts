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

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    element.innerText = ``;
  }
}
