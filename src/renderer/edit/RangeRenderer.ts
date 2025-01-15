import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * range renderer
 *
 * @class RangeRenderer
 * @typedef {RangeRenderer}
 * @extends {AbstractRenderer}
 */
export default class RangeRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerText = `${this.getValue(value)}`;
  }
  public editRender(element: HTMLElement, value: any): void {
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
