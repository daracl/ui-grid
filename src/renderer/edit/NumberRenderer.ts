import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {EditRenderer}
 */
export default class NumberRenderer extends EditRenderer {
  constructor(field: FieldItem) {
    super(field);
  }
  public render(element: HTMLElement, value: any): void {
    element.innerText = `<input type="number">`;

    this.getValue(value);
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
