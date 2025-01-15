import { Config } from "@t/GridConfig";
import { FieldItem } from "@t/GridField";

/**
 * 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @param {string} position
 * @returns {boolean}
 */
export const isFixedPostion = (cfg: Config, idx: number, position?: string): boolean => {
  //position = position || "l";

  return idx < cfg.fixedHeaderIndex;
};

export const removeActiveColumnStyle = (element: HTMLElement) => {
  element.classList.remove("col-active");
};



/**
 * is multiple selection mode
 *
 * @type {string} selection mode
 */
export const isMultipleSelection(selectionMode:string) {
  return selectionMode == "multiple-row" || selectionMode == "multiple-cell";
}