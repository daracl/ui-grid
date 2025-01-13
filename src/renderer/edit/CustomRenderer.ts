import AbstractRenderer from "../AbstractRenderer";
import { invalidMessage, resetRowElementStyleClass } from "src/util/validUtils";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { stringValidator } from "src/rule/stringValidator";

/**
 * custom renderer
 *
 * @class CustomRenderer
 * @typedef {CustomRenderer}
 * @extends {AbstractRenderer}
 */
export default class CustomRenderer extends AbstractRenderer {
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
