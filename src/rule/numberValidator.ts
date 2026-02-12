import { ValidResult } from "@t/ValidResult";
import { RULES } from "@/constants";
import { validator } from "./validator";
import * as utils from "@/util/utils";
import { FieldItem } from "@t/GridField";
import { Config } from "@t/GridConfig";

/**
 * 숫자 유효성 체크
 *
 * @param {string} value
 * @param {EditRenderer} field
 * @returns {(ValidResult | boolean)}
 */
export const numberValidator = (value: string, field: FieldItem, rowItem: any, gridConfig: Config): ValidResult | null => {
  const result: ValidResult = { name: field.name, constraints: [] };
  const numValue = Number(value);

  const editRenderer = field.editRenderer;
  if (!editRenderer) {
    return null;
  }

  if (editRenderer.required && utils.isBlank(value)) {
    result.constraints.push(RULES.REQUIRED);
    return result;
  }

  if (!utils.isNumber(value)) {
    result.constraints.push(RULES.NAN);
    return result;
  }

  if (validator(value, field, rowItem, gridConfig, result) != null) {
    return result;
  }

  const rule = editRenderer.rule;
  if (rule) {
    const isMinimum = utils.isNumber(rule.minimum),
      isMaximum = utils.isNumber(rule.maximum);

    let minRule = false,
      minExclusive = false,
      maxRule = false,
      maxExclusive = false;

    if (isMinimum) {
      if (rule.exclusiveMinimum && numValue <= rule.minimum) {
        minExclusive = true;
      } else if (numValue < rule.minimum) {
        minRule = true;
      }
    }

    if (isMaximum) {
      if (rule.exclusiveMaximum && numValue >= rule.maximum) {
        maxExclusive = true;
      } else if (numValue > rule.maximum) {
        maxRule = true;
      }
    }

    if (isMinimum && isMaximum && (minRule || minExclusive || maxRule || maxExclusive)) {
      if (rule.exclusiveMinimum && rule.exclusiveMaximum && (minExclusive || maxExclusive)) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MINMAX);
      } else if (minExclusive) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MIN);
      } else if (maxExclusive) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MAX);
      } else {
        result.constraints.push(RULES.BETWEEN);
      }
    } else {
      if (minExclusive) {
        result.constraints.push(RULES.EXCLUSIVE_MIN);
      }

      if (maxExclusive) {
        result.constraints.push(RULES.EXCLUSIVE_MAX);
      }

      if (minRule) {
        result.constraints.push(RULES.MIN);
      }

      if (maxRule) {
        result.constraints.push(RULES.MAX);
      }
    }
  }

  if (result.constraints.length > 0) {
    return result;
  }

  return null;
};
