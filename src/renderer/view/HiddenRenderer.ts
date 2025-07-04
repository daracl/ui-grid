import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import GridMain from "src/view/GridMain";

/**
 * hidden renderer
 *
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ViewRenderer}
 */
export default class HiddenRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {}
}
