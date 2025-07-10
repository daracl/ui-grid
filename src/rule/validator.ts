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
  const editRenderer = field.editRenderer;
  if (!editRenderer) return false;

  if (editRenderer.validator) {
    result.validator = editRenderer?.validator(field, rowItem);
    if (typeof result.validator === "object") {
      return result;
    }
  }

  result = regexpValidator(rowItem, field, result);

  if (result.regexp) {
    return result;
  }

  if (editRenderer.different) {
    const diffFieldName = editRenderer.different.field;
    const diffField = gridConfig.allColumnMap[diffFieldName];

    if (!utils.isEmpty(diffField) && value == diffField.$renderer.getValue(rowItem)) {
      result.message = editRenderer.different.message;
      return result;
    }
  }

  if (editRenderer.identical) {
    const diffFieldName = editRenderer.identical.field;
    const diffField = gridConfig.allColumnMap[diffFieldName];

    if (!utils.isEmpty(diffField) && value == diffField.$renderer.getValue(rowItem)) {
      result.message = editRenderer.identical.message;
      return result;
    }
  }

  return true;
};
