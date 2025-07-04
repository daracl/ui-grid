import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditRenderer}
 */
export default class TextRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    element.innerText = item[this.fieldName];
  }
}
