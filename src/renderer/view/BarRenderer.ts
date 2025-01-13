import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * bar renderer
 *
 * @class BarRenderer
 * @typedef {BarRenderer}
 * @extends {AbstractRenderer}
 */
export default class BarRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerHTML = `<div>bar${this.getValue(value)}</div>`;
  }
  public editRender(element: HTMLElement, value: any): void {
    element.innerText = this.getValue(value);
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
