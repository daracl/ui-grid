import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditRenderer}
 */
export default class TextRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    element.innerText = value;
  }
}
