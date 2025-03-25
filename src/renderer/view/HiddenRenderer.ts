import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";

/**
 * hidden renderer
 *
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ViewRenderer}
 */
export default class HiddenRenderer extends ViewRenderer {
  constructor(field: FieldItem) {
    super(field);
  }

  public render(rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {}
}
