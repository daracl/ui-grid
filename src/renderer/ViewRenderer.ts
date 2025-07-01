import { FieldItem } from "@t/GridField";

import Renderer from "./Renderer";
import { isFunction } from "src/util/utils";
import { CellInfo, Config } from "@t/GridConfig";

export default abstract class ViewRenderer extends Renderer {
  private readonly refValue: any;
  private readonly isRefFunction: boolean;

  constructor(field: FieldItem) {
    super(field);
    this.refValue = this.field.renderer.refValue ?? {};
    this.isRefFunction = isFunction(this.refValue);
  }

  /**
   * view render
   *
   * @param rowIdx row index
   * @param rowNumber grid row number
   * @param colNumber column number
   * @param value row item
   * @param element cell element
   * @param config config
   */
  public abstract render(rowIdx: number, rowNumber: number, colNumber: number, value: any, element: HTMLElement): void;

  public isWrapper(): boolean {
    return true;
  }

  public getRefValue(value: any, rowItem?: any): any {
    if (this.isRefFunction) {
      return this.refValue.call(null, this.field, value, rowItem);
    }
    return this.refValue[value];
  }

  public getValue(rowItem: any): any {
    return rowItem[this.field.name];
  }

  public click(cellInfo: CellInfo) {
    if (this.field.$renderer.click) {
      this.field.$renderer.click(cellInfo);
    }
  }
}
