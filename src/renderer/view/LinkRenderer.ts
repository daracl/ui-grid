import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * link renderer
 *
 * @export
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {AbstractRenderer}
 */
export default class LinkRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerHTML = `<a href="${this.getValue(value)}">${this.getValue(value)}</a>`;
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
