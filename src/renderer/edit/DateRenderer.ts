import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";

/**
 * date renderer
 *
 * @class DateRenderer
 * @typedef {DateRenderer}
 * @extends {EditRenderer}
 */
export default class DateRenderer extends EditRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public getValue(value: any) {
    return value[this.field.name];
  }
  public setValue(element: HTMLElement, value: any): void {
    (element as HTMLInputElement).value = this.getValue(value);
  }
  public render(element: HTMLElement, value: any): void {
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
