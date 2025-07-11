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
export const stringValidator = (value: string, field: FieldItem, rowItem: any, gridConfig: Config): ValidResult | null => {
  let result: ValidResult = { name: field.name, constraints: [] };

  const editRenderer = field.editRenderer;
  if (!editRenderer) {
    return null;
  }

  if (editRenderer.required && utils.isBlank(value)) {
    result.constraints.push(RULES.REQUIRED);
    return result;
  }
  const validResult = validator(value, field, rowItem, gridConfig, result);
  if (validResult != null) {
    return validResult;
  }

  const rule = editRenderer.rule;

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
      result.constraints.push(RULES.BETWEEN);
    } else {
      if (minRule) {
        result.constraints.push(RULES.MIN_LENGTH);
      }

      if (maxRule) {
        result.constraints.push(RULES.MAX_LENGTH);
      }
    }
    if (result.constraints.length > 0) {
      return result;
    }
  }

  return null;
};
