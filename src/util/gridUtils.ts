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
  element.classList.remove("selection");
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
 * row selection check
 *
 * @param {string} selectionMode mode
 * @returns {boolean}
 */
export const isRowSelection = (selectionMode: string): boolean => {
  return selectionMode == "multiple-row" || selectionMode == "row";
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
  const rowIndex = cfg.scroll.startIdx + posInfo.r;

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
 * @returns {number}
 */
export function getCenterContentLeft(cfg: Config, scrollLeft: number): number {
  if (scrollLeft < 1) {
    return 0;
  }
  return (cfg.dimensions.mainCenterOverWidth * ((scrollLeft / (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) * 100)) / 100;
}

/**
 * 센터 포지션 값 - > 스크롤 left postion
 *
 * @export
 * @param {Config} cfg 그리드 설정 정보
 * @param {number} contentLeft center content left 값
 * @returns {number}
 */
export function getHorizontalScrollPosition(cfg: Config, contentLeft: number, direction?: string): number {
  if (contentLeft < 1) {
    return 0;
  }

  if (direction == "R") {
    contentLeft = contentLeft - cfg.dimensions.mainCenterViewWidth;
  } else {
    contentLeft = contentLeft - 2;
  }

  return ((contentLeft / cfg.dimensions.mainCenterOverWidth) * 100 * (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) / 100;
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

/**
 * get mouse darg vertical postion
 *
 * @export
 * @param {Config} cfg 설정
 * @param {number} moveY 마우스 move position
 * @param {number} rowHeight row height
 * @param {CellInfo} startCellInfo start cell 정보
 * @param {number} _t grid top position
 * @param {number} _b grid bottom position
 * @returns {{ mouseDragDirectionY: string; rowIdx: number; }}
 */
export function dragVerticalMovePosition(cfg: Config, moveY: number, rowHeight: number, startCellInfo: CellInfo, _t: number, _b: number) {
  let mouseDragDirectionY = "";
  let rowIdx = 0;

  if (moveY < _t) {
    mouseDragDirectionY = "U";
  } else if (moveY > _b) {
    mouseDragDirectionY = "D";
  } else {
    let topVal = 0;
    const contentTop = moveY - _t;
    for (let i = 0; i < cfg.scroll.viewRow; i++) {
      topVal += rowHeight;

      if (topVal > contentTop) {
        rowIdx = i;
        break;
      }
    }

    if (rowIdx > 0) {
      rowIdx = cfg.scroll.startIdx + rowIdx;
    }
  }

  return { mouseDragDirectionY, rowIdx };
}

/**
 * 마우스 drag 시 좌우 스크롤 이동 처리
 *
 * @private
 * @param {Config} cfg config
 * @param {number} moveX drag move x
 * @param {number} startEvtPositionX mousedown event position
 * @param {number} positionX grid left position
 * @param {number} _l  left end position
 * @param {number} _r right start position
 * @param {HTMLElement} cellElement start element
 * @param {string} selectionMode selection mode
 * @returns {{ mouseScrollDirectionX: string; overCell: number; }}
 */
export function dragHorizontalMovePosition(cfg: Config, moveX: number, startCellInfo: CellInfo, positionX: number, _l: number, _r: number) {
  let mouseScrollDirectionX = "";
  let overCell = 0;
  let contentLeftVal = 0;
  let centerMovePageX = 0;
  let startCellIdx = 0,
    endCellIdx = cfg.currentFields.length;
  if (moveX < _l) {
    centerMovePageX = moveX - positionX;
    endCellIdx = cfg.fixedLeftIndex;
    mouseScrollDirectionX = "L";
  } else if (moveX > _r) {
    startCellIdx = cfg.fixedRightIndex;

    if (startCellIdx > 0) {
      centerMovePageX = moveX - _r;
    } else {
      overCell = endCellIdx - 1;
    }

    mouseScrollDirectionX = "R";
  } else {
    centerMovePageX = moveX - _l;
    startCellIdx = cfg.fixedLeftIndex;
    contentLeftVal = getCenterContentLeft(cfg, cfg.scroll.left);
  }

  if (overCell == 0) {
    let leftVal = 0;
    let startFlag = false;

    for (let i = startCellIdx; i < endCellIdx; i++) {
      const itemWidth = cfg.currentFields[i].$width;

      leftVal += itemWidth;

      if ((contentLeftVal <= 0 || startFlag) && leftVal > centerMovePageX) {
        overCell = i;
        break;
      } else if (!startFlag && leftVal >= contentLeftVal) {
        startFlag = true;
        leftVal = contentLeftVal > 0 && leftVal > contentLeftVal ? leftVal - contentLeftVal : leftVal;
      }
    }
  }

  if (isFixedLeftPostion(cfg, startCellInfo.c) || isFixedRightPostion(cfg, startCellInfo.c)) {
    mouseScrollDirectionX = "";
  }

  return { mouseScrollDirectionX, overCell };
}
