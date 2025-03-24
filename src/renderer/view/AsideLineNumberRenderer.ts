import AbstractRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {AbstractRenderer}
 */
export default class AsideLineNumberRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, value: any, element: HTMLElement): void {
    element.innerText = value;
  }
}
