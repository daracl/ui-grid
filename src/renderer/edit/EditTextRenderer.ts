import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditRenderer}
 */
export default class TextRenderer extends EditRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerText = `<input type="text">`;
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
