import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * range renderer
 *
 * @class RangeRenderer
 * @typedef {RangeRenderer}
 * @extends {EditRenderer}
 */
export default class RangeRenderer extends EditRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    element.innerText = `<input type="text">`;
    const value = item[cellInfo.field.name];

    this.getValue(value);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
