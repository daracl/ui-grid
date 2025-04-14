import { Config } from "@t/GridConfig";
import { FieldItem } from "@t/GridField";
import { intValue } from "./utils";

/**
 * 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @param {string} position
 * @returns {boolean}
 */
export const isFixedLeftPostion = (fixedLeftIndex: number, idx: number): boolean => {
  return idx < fixedLeftIndex;
};

export const isFixedRightPostion = (fixedRightIndex: number, idx: number): boolean => {
  return idx > fixedRightIndex;
};

export const removeActiveColumnStyle = (element: HTMLElement) => {
  element.classList.remove("col-active");
};

/**
 * is multiple selection mode
 *
 * @type {string} selection mode
 */
export const isMultipleSelection = (selectionMode: string): boolean => {
  return selectionMode == "multiple-row" || selectionMode == "multiple-cell";
};

/**
 * cell 정보 얻기
 *
 * @param {Config} cfg 설정 정보
 * @param {HTMLElement} cellElement cell element
 * @returns {{ r: any; c: any; rowItemIdx: any; rowItem: any; colInfo: any; }}
 */
export const getCellInfo = (cfg: Config, cellElement: HTMLElement) => {
  const posInfo = getCellPosition(cellElement);
  const cellRow = cfg.scroll.viewRow + posInfo.r;
  return {
    r: posInfo.r,
    c: posInfo.c,
    rowItemIdx: cellRow,
    rowItem: cfg.items[cellRow],
    colInfo: cfg.currentFields[posInfo.c],
  };
};

/**
 * grid postion
 *
 * @param {HTMLElement} cellElement cell element
 * @returns {{ r: number; c: number; }}
 */
export const getCellPosition = (cellElement: HTMLElement) => {
  const posInfo = (cellElement.getAttribute("data-cell-position") ?? "").split(",");

  return {
    r: intValue(posInfo[0]),
    c: intValue(posInfo[1]),
  };
};
