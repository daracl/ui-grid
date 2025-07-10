import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * number renderer
 *
 * @class NumberRenderer
 * @typedef {NumberRenderer}
 * @extends {EditRenderer}
 */
export default class NumberRenderer extends EditRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }
  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    element.innerText = `<input type="number">`;
    const value = item[cellInfo.field.name];

    this.getValue(value);
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
