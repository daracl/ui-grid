import { CellInfo, Config } from "@t/GridConfig";
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
  return cfg.fixedRightIndex > 0 && idx >= cfg.fixedRightIndex;
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
 * @returns {{ r: any; c: any; rowItemIdx: any; rowItem: any; field: FieldItem; }}
 */
export const getCellInfo = (cfg: Config, cellElement: HTMLElement): CellInfo => {
  const posInfo = getCellPosition(cellElement);
  const rowIndex = cfg.scroll.startRow + posInfo.r;

  return {
    r: posInfo.r,
    c: posInfo.c,
    rowIndex: rowIndex,
    item: cfg.items[rowIndex],
    field: cfg.currentFields[posInfo.c],
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

/**
 * 스크롤 left postion -> 그리드 센터 포지션 값으로 변환.
 *
 * @param cfg 그리드 설정 정보
 * @param scrollLeft scroll left 값
 * @returns
 */
export function getCenterContentLeft(cfg: Config, scrollLeft: number): number {
  if (scrollLeft < 1) {
    return 0;
  }
  return scrollLeft < 1 ? 0 : ((cfg.dimensions.mainTotalWidth - cfg.dimensions.mainInsideWidth) * ((scrollLeft / (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) * 100)) / 100;
}

/**
 * input field check
 * @param tagName html tag name
 * @returns
 */
export function isInputField(tagName: string): boolean {
  return tagName.search(/(input|select|textarea)/i) > -1;
}

export function getOverCellPosition(cellInfo: CellInfo): string {
  return `${cellInfo.r}_${cellInfo.c}_${cellInfo.rowIndex}`;
}
