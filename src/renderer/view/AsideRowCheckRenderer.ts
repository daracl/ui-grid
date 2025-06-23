import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

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
    element.innerHTML = `<input name="dgRowCheck" type="checkbox" class="dg-row-check"/>`;
  }
}
