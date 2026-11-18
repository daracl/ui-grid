import { ValidResult } from '../types/ValidResult.js';
import { FieldItem } from '../types/GridField.js';
import { Config } from '../types/GridConfig.js';
/**
 *  validator  ,  regexp 체크 .
 
* @param {*} rowItem
 * @param {FieldItem} field
 * @param {ValidResult} result
 * @returns {(ValidResult | boolean)}
 */
export declare const validator: (value: string, field: FieldItem, rowItem: any, gridConfig: Config, result: ValidResult) => ValidResult | null;
