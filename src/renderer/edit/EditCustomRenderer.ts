import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";

/**
 * custom renderer
 *
 * @class EditCustomRenderer
 * @typedef {EditCustomRenderer}
 * @extends {EditRenderer}
 */
export default class EditCustomRenderer extends EditRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public getValue(value: any) {
    return value[this.field.name];
  }
  public setValue(element: HTMLElement, value: any): void {
    (element as HTMLInputElement).value = this.getValue(value);
  }
  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    element.innerText = `<input type="text">`;
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
