import { ValidResult } from "@t/ValidResult";
import { regexpValidator } from "./regexpValidator";
import * as utils from "src/util/utils";
import { FieldItem } from "@t/GridField";
import { Config } from "@t/GridConfig";

/**
 *  validator  ,  regexp 체크 .
 
* @param {*} rowItem
 * @param {FieldItem} field
 * @param {ValidResult} result
 * @returns {(ValidResult | boolean)}
 */
export const validator = (value: string, field: FieldItem, rowItem: any, gridConfig: Config, result: ValidResult): ValidResult | boolean => {
  const fieldRender = field.renderer;
  if (fieldRender.validator) {
    result.validator = fieldRender.validator(field, rowItem);
    if (typeof result.validator === "object") {
      return result;
    }
  }

  result = regexpValidator(rowItem, field, result);

  if (result.regexp) {
    return result;
  }

  if (fieldRender.different) {
    const diffFieldName = fieldRender.different.field;
    const diffField = gridConfig.allColumnMap[diffFieldName];

    if (!utils.isEmpty(diffField) && value == diffField.$renderer.getValue(rowItem)) {
      result.message = fieldRender.different.message;
      return result;
    }
  }

  if (fieldRender.identical) {
    const diffFieldName = fieldRender.identical.field;
    const diffField = gridConfig.allColumnMap[diffFieldName];

    if (!utils.isEmpty(diffField) && value == diffField.$renderer.getValue(rowItem)) {
      result.message = fieldRender.identical.message;
      return result;
    }
  }

  return true;
};
