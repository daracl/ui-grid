import { Config } from "@t/GridConfig";
import { intValue, isEmpty } from "./utils";
import { GridOptions } from "@t/GridOptions";
import { FieldItem } from "@t/GridField";

/**
 * 왼쪽 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @returns {boolean}
 */
export const isFixedLeftPostion = (cfg: Config, idx: number): boolean => {
  return idx < cfg.fixedLeftIndex;
};

/**
 * 오른쪽 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @returns {boolean}
 */
export const isFixedRightPostion = (cfg: Config, idx: number): boolean => {
  return idx > cfg.fixedRightIndex;
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

export const getMaxColumnSize = (cfg: Config, opts: GridOptions, field: FieldItem, checkWidth: number): number => {
  const items = opts.items;
  const maxWidth = opts.header.resize.maxWidth;
  let returnMaxWidth = 0;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.font = "16px Arial";

  for (let i = 0, len = cfg.dataInfo.rowLength < 100 ? cfg.dataInfo.rowLength : 100; i < len; i++) {
    const tmpVal = field.$renderer.getValue(items[i]);

    if (isEmpty(tmpVal)) continue;

    let metrics = context.measureText(tmpVal);
    checkWidth = Math.max(metrics.width, checkWidth);

    if (maxWidth > 0 && checkWidth >= maxWidth) {
      return maxWidth;
    }

    returnMaxWidth = Math.max(returnMaxWidth, checkWidth);
  }

  return returnMaxWidth;
};
