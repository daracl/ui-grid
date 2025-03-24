import { FieldItem } from "@t/GridField";

import Renderer from "./Renderer";
import { isFunction } from "src/util/utils";

export default abstract class ViewRenderer extends Renderer {
  private refValue: any;
  private isRefFunction: boolean;

  constructor(field: FieldItem) {
    super(field);
    this.refValue = this.field.renderer.refValue;
    this.isRefFunction = isFunction(this.refValue);
  }

  /**
   * view render
   *
   * @public
   * @abstract
   * @param {number} rowNumber
   * @param {number} colNumber
   * @param {HTMLElement} element
   * @param {*} value
   */
  public abstract render(rowNumber: number, colNumber: number, value: any, element?: HTMLElement): void;

  public getRefValue(value: any, rowItem?: any): any {
    if (this.isRefFunction) {
      return this.refValue.call(this.field, value, rowItem);
    }
    return this.refValue[value];
  }

  public getValue(rowItem: any): any {
    return rowItem[this.field.name];
  }
}
