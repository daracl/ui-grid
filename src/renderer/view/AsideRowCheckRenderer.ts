import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { ROW_CHECK_KEY } from "src/constants";

/**
 * Aside RowCheck Renderer
 *
 * @class AsideRowCheckRenderer
 * @typedef {AsideRowCheckRenderer}
 * @extends {ViewRenderer}
 */
export default class AsideRowCheckRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    let checkElement = element.querySelector('[name="dgRowCheck"]');
    if (!checkElement) {
      element.innerHTML = `<label class="dg-checkbox"><input type="checkbox" name="dgRowCheck"/><span class="checkmark"></span></label>`;
      checkElement = element.querySelector('[name="dgRowCheck"]');
    }

    (checkElement as HTMLInputElement).checked = item[ROW_CHECK_KEY];
  }
}
