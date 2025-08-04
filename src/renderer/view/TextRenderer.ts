import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ViewRenderer}
 */
export default class TextRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const renderValue = this.getValue(item);

    if (element.textContent != renderValue) {
      const oldEl = element.firstChild;

      const newTextElement = document.createTextNode(renderValue);

      if (oldEl) {
        element.replaceChild(newTextElement, oldEl);
      } else {
        element.appendChild(newTextElement);
      }
    }
  }
}
