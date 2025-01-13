import AbstractRenderer from "../AbstractRenderer";
import { numberValidator } from "src/rule/numberValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { numberInputEvent } from "src/event/renderEvents";
import { FieldItem } from "@t/GridField";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {AbstractRenderer}
 */
export default class NumberRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {
    element.innerText = `${this.getValue(value)}`;
  }
  public editRender(element: HTMLElement, value: any): void {
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
