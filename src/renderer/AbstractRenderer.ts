import { OptionCallback } from "@t/Common";
import { FieldItem } from "@t/GridField";

import { ValidResult } from "@t/ValidResult";
import { REGEXP_TYPE } from "src/constants";
import DaraGrid from "src/DaraGrid";
import * as utils from "src/util/utils";

export default abstract class AbstractRenderer {
  protected field;

  private enableView: boolean = true;

  protected listValueKey;

  protected listLabelKey;

  constructor(field: FieldItem) {
    this.field = field;

    this.listValueKey = field.renderer?.listItem?.valueField ? field.renderer?.listItem.valueField : "value";

    this.listLabelKey = field.renderer?.listItem?.labelField ? field.renderer?.listItem.labelField : "label";
  }

  /**
   * 값 얻기
   *
   * @param {any} value row item
   * @returns {any} field value
   */
  public abstract getValue(value: any): any;

  /**
   * 값 셋팅
   *
   * @public
   * @abstract
   * @param {HTMLElement} element
   * @param {any} value
   */
  public abstract setValue(element: HTMLElement, value: any): void;

  /**
   * view render
   *
   * @param {HTMLElement} element td element
   * @param {*} value value row item
   */
  public abstract render(element: HTMLElement, value: any): void;

  /**
   * edit row render
   *
   * @param {HTMLElement} element element td element
   * @param {*} value value row item
   */
  public abstract editRender(element: HTMLElement, value: any): void;

  public abstract reset(element: HTMLElement): void;
  public abstract valid(element: HTMLElement): ValidResult | boolean;

  public setValueItems(value: any): void {}

  public isEnableView() {
    return this.enableView;
  }

  public static valuesLabelValue(label: string, val: any) {
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
    const fieldValue = field.$renderer.getValue(element);

    if (field.renderer.onChange) {
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

      if (changeInfo.oldValue != changeInfo.value && field.renderer.onChange.call(null, changeInfo) === false) {
        field.$renderer.setValue(fieldValue, false);
        return false;
      }

      //field.$value = changeInfo.value;
    }
  }
}
