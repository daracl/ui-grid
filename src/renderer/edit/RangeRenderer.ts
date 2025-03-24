import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";

/**
 * range renderer
 *
 * @class RangeRenderer
 * @typedef {RangeRenderer}
 * @extends {EditRenderer}
 */
export default class RangeRenderer extends EditRenderer {
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
