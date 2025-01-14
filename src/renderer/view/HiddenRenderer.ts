import AbstractRenderer from "../AbstractRenderer";
import { FieldItem } from "@t/GridField";

/**
 * hidden renderer
 *
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {AbstractRenderer}
 */
export default class HiddenRenderer extends AbstractRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(element: HTMLElement, value: any): void {}
  public editRender(element: HTMLElement, value: any): void {}
  public reset(element: HTMLElement): void {}

  valid(element: HTMLElement): any {}
}
