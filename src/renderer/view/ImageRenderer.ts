import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * button renderer
 *
 * @export
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {AbstractRenderer}
 */
export default class ButtonRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerHTML = `<img src="${this.getValue(value)}" />`;
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
