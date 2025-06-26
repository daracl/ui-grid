import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";

/**
 * textarea renderer
 *
 * @class TextAreaRenderer
 * @typedef {TextAreaRenderer}
 * @extends {EditRenderer}
 */
export default class TextAreaRenderer extends EditRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerText = `<input type="text">`;

    this.getValue(value);
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
