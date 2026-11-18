import { Config } from '../types/GridConfig.js';
import { FieldItem } from '../types/GridField.js';
import { ValidResult } from '../types/ValidResult.js';
/**
 * string validator
 *
 * @param {string} value
 * @param {FieldItem} field
 * @returns {(ValidResult | boolean)}
 */
export declare const stringValidator: (value: string, field: FieldItem, rowItem: any, gridConfig: Config) => ValidResult | null;
