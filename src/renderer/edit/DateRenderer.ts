import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * date renderer
 *
 * @class DateRenderer
 * @typedef {DateRenderer}
 * @extends {AbstractRenderer}
 */
export default class DateRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public getValue(value: any) {
    return value[this.field.name];
  }
  public setValue(element: HTMLElement, value: any): void {
    (element as HTMLInputElement).value = this.getValue(value);
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
