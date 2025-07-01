import { FieldItem } from "@t/GridField";

import { ValidResult } from "@t/ValidResult";
import * as utils from "src/util/utils";
import Renderer from "./Renderer";

export default abstract class EditRenderer extends Renderer {
  private readonly enableView: boolean = true;

  protected listValueKey;

  protected listLabelKey;

  constructor(field: FieldItem) {
    super(field);

    this.listValueKey = field.renderer?.listItem?.valueField ? field.renderer?.listItem.valueField : "value";

    this.listLabelKey = field.renderer?.listItem?.labelField ? field.renderer?.listItem.labelField : "label";
  }

  /**
   * view render
   *
   * @param {HTMLElement} element td element
   * @param {*} value value row item
   */
  public abstract render(element: HTMLElement, value: any): void;

  public abstract reset(element: HTMLElement): void;

  public abstract valid(element: HTMLElement): ValidResult | boolean;

  /**
   * set value items
   *
   * @public
   * @param {any[]} listItem list items dropdown,checkbox,radio value
   */
  public setValueItems(listItem: any[]): void {}

  /**
   * 값 얻기
   *
   * @param {any} value row item
   * @returns {any} field value
   */
  public getValue(value: any, formatFlag?: boolean) {
    return value[this.field.name];
  }

  /**
   * 값 셋팅
   *
   * @public
   * @param {HTMLElement} element cell element
   * @param {any} value row value
   */
  public setValue(element: HTMLElement, value: any): void {
    (element as HTMLInputElement).value = this.getValue(value);
  }

  public isEnableView() {
    return this.enableView;
  }

  public valuesLabelValue(label: string, val: any) {
    let replaceFlag = false;
    const resultValue = label.replace(/\{\{([A-Za-z0-9_.]*)\}\}/g, (match, key) => {
      replaceFlag = true;
      return val[key] || "";
    });

    if (replaceFlag) {
      return resultValue;
    }

    return val[label] || "";
  }

  public changeEventCall(e: Event | null, element: HTMLElement): boolean | undefined {
    const field = this.field;
    const fieldValue = field.$editRenderer.getValue(element);

    if (field.renderer.change) {
      let changeInfo: any = {
        field: field,
        evt: e,
        //oldValue: field.$value,
        value: fieldValue,
      };

      if (field.renderer?.listItem?.list) {
        const listItems = field.renderer?.listItem?.list;
        let valuesItem = [];
        const valueKey = this.listValueKey;

        for (let val of listItems) {
          let changeVal = val[valueKey];
          if (utils.isString(fieldValue)) {
            if (changeVal == fieldValue) {
              valuesItem.push(val);
              break;
            }
          } else if (utils.isArray(fieldValue)) {
            if (fieldValue.includes(changeVal)) {
              valuesItem.push(val);
            }
          }
        }

        changeInfo.valueItems = valuesItem;
      }

      if (changeInfo.oldValue != changeInfo.value && field.renderer.change.call(null, changeInfo) === false) {
        field.$editRenderer.setValue(fieldValue, false);
        return false;
      }

      //field.$value = changeInfo.value;
    }
  }
}
