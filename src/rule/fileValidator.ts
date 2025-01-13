import { FileInfo, EditRenderer } from "@t/EditRenderer";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

/**
 * file validator
 *
 * @param {HTMLInputElement} element
 * @param {EditRenderer} field
 * @param {FileInfo[]} fileList
 * @returns {(ValidResult | boolean)}
 */
export const fileValidator = (element: HTMLInputElement, field: FieldItem, fileList: FileInfo[]): ValidResult | boolean => {
  const result: ValidResult = { name: field.name, constraint: [] };

  if (field.required && fileList.length < 1) {
    result.constraint.push(RULES.REQUIRED);
    return result;
  }

  if (result.constraint.length > 0) {
    return result;
  }

  return true;
};
