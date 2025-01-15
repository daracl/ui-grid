import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import * as utils from "src/util/utils";
import { validator } from "./validator";
import { FieldItem } from "@t/GridField";
import { Config } from "@t/GridConfig";
/**
 * string validator
 *
 * @param {string} value
 * @param {EditRenderer} field
 * @returns {(ValidResult | boolean)}
 */
export const stringValidator = (value: string, field: FieldItem, rowItem: any, gridConfig: Config): ValidResult | boolean => {
  let result: ValidResult = { name: field.name, constraint: [] };

  if (field.renderer.required && utils.isBlank(value)) {
    result.constraint.push(RULES.REQUIRED);
    return result;
  }
  const validResult = validator(value, field, rowItem, gridConfig, result);
  if (validResult !== true) {
    return validResult;
  }

  const rule = field.renderer.rule;

  if (rule) {
    const valueLength = value.length;

    const isMinNumber = utils.isNumber(rule.minLength),
      isMaxNumber = utils.isNumber(rule.maxLength);

    let minRule = false,
      maxRule = false;
    if (isMinNumber && valueLength < rule.minLength) {
      minRule = true;
    }
    if (isMaxNumber && valueLength > rule.maxLength) {
      maxRule = true;
    }

    if (isMinNumber && isMaxNumber && (minRule || maxRule)) {
      result.constraint.push(RULES.BETWEEN);
    } else {
      if (minRule) {
        result.constraint.push(RULES.MIN_LENGTH);
      }

      if (maxRule) {
        result.constraint.push(RULES.MAX_LENGTH);
      }
    }
    if (result.constraint.length > 0) {
      return result;
    }
  }

  return true;
};
