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

/**
 * @method calcViewCol
 * @param leftVal {Integer} body left position
 * @description view col 위치 구하기.
 */
export const calcViewCol = (cfg: Config, leftVal: number): number => {
  const dimensions = cfg.dimensions;

  const mainOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth;

  const containerLeft = leftVal < 1 ? 0 : (mainOverWidth * ((leftVal / (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) * 100)) / 100;

  const tci = cfg.currentFields;
  const gridW = containerLeft + cfg.dimensions.mainInsideWidth;
  let itemLeftVal = 0;

  let startCol = 0,
    endCol = tci.length - 1;

  let startFlag = true,
    inSideStartFlag = true;

  for (let i = cfg.fixedLeftIndex; i < tci.length; i++) {
    if (inSideStartFlag && itemLeftVal >= containerLeft) {
      cfg.scroll.insideStartCol = i;
      inSideStartFlag = false;
    }

    itemLeftVal += tci[i].width;

    if (startFlag && itemLeftVal > containerLeft) {
      startCol = i;
      startFlag = false;
      continue;
    }

    if (itemLeftVal >= gridW) {
      endCol = i;
      break;
    }
  }
  cfg.scroll.containerLeft = containerLeft;
  cfg.scroll.before.startCol = cfg.scroll.startCol; // 이전데이터
  cfg.scroll.before.endCol = cfg.scroll.endCol;

  cfg.scroll.startCol = startCol > 0 ? startCol : 0;
  cfg.scroll.endCol = endCol >= tci.length ? tci.length : endCol;

  // 화면에 다 보이는 col size
  cfg.scroll.insideEndCol = cfg.scroll.endCol + (itemLeftVal != gridW ? -1 : 0);

  return containerLeft;
};
