import { FieldItem } from '../types/GridField.js';
import { ValidResult } from '../types/ValidResult.js';
/**
 * 정규식 유효성 체크.
 *
 * @param {string} value
 * @param {FieldItem} field
 * @param {(ValidResult | undefined)} result
 * @returns {ValidResult}
 */
export declare const regexpValidator: (value: string, field: FieldItem, result: ValidResult) => ValidResult;
