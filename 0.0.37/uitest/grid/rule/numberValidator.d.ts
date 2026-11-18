import { ValidResult } from '../types/ValidResult.js';
import { FieldItem } from '../types/GridField.js';
import { Config } from '../types/GridConfig.js';
/**
 * 숫자 유효성 체크
 *
 * @param {string} value
 * @param {FieldItem} field
 * @returns {(ValidResult | boolean)}
 */
export declare const numberValidator: (value: string, field: FieldItem, rowItem: any, gridConfig: Config) => ValidResult | null;
