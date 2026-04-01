import { ValidResult } from '@t/ValidResult';
import { regexpValidator } from './regexpValidator';
import * as utils from '@/util/utils';
import { FieldItem } from '@t/GridField';
import { Config } from '@t/GridConfig';

/**
 *  validator  ,  regexp 체크 .
 
* @param {*} rowItem
 * @param {FieldItem} field
 * @param {ValidResult} result
 * @returns {(ValidResult | boolean)}
 */
export const validator = (
  value: string,
  field: FieldItem,
  rowItem: any,
  gridConfig: Config,
  result: ValidResult,
): ValidResult | null => {
  const editRenderer = field.editRenderer;
  if (!editRenderer) return null;

  if (editRenderer.validator) {
    result.validator = editRenderer?.validator(field, rowItem);
    if (typeof result.validator === 'object') {
      return result;
    }
  }

  result = regexpValidator(value, field, result);

  if (result.regexp) {
    return result;
  }

  if (editRenderer.different) {
    const diffFieldName = editRenderer.different.field;

    if (
      gridConfig.allFieldMap.has(diffFieldName) &&
      value == gridConfig.allFieldMap.get(diffFieldName)?.$renderer.getValue(rowItem)
    ) {
      result.message = editRenderer.different.message;
      return result;
    }
  }

  if (editRenderer.identical) {
    const diffFieldName = editRenderer.identical.field;

    if (
      gridConfig.allFieldMap.has(diffFieldName) &&
      value == gridConfig.allFieldMap.get(diffFieldName)?.$renderer.getValue(rowItem)
    ) {
      result.message = editRenderer.identical.message;
      return result;
    }
  }

  return null;
};
