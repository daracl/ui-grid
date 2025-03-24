import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewRenderer}
 */
export default class ButtonRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    element.innerHTML = `<button>${value}</button>`;
  }
}
