import { CellInfo, Config, HeaderCellInfo } from "@t/GridConfig";
import { intValue, isArray, isEmpty, isNumber } from "./utils";
import { GridOptions } from "@t/GridOptions";
import { FieldItem } from "@t/GridField";
import { RendererInfo } from "@t/RendererInfo";
import { ROW_CUD_KEY, ScrollDirectionX, ScrollDirectionY, SelectionMode } from "@/constants";

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
  return selectionMode == SelectionMode.MULTIPLE_ROW || selectionMode == SelectionMode.MULTIPLE_CELL;
};

export const isMultipleCellSelection = (selectionMode: string): boolean => {
  return selectionMode == SelectionMode.MULTIPLE_CELL;
};

/**
 * row selection check
 *
 * @param {string} selectionMode mode
 * @returns {boolean}
 */
export const isRowSelection = (selectionMode: string): boolean => {
  return selectionMode == SelectionMode.MULTIPLE_ROW || selectionMode == SelectionMode.ROW;
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
  const col = posInfo.c;
  return {
    r: posInfo.r,
    c: col,
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
  const posInfo = (getCellPositionAttr(cellElement) ?? "").split(",");

  return {
    r: intValue(posInfo[0]),
    c: intValue(posInfo[1]),
  };
};

export const getCellPositionAttr = (cellElement: HTMLElement) => {
  return cellElement.getAttribute("data-cell-position");
};

/**
 * header cell 정보 얻기
 *
 * @param {Config} cfg 설정 정보
 * @param {HTMLElement} cellElement cell element
 * @returns {c: number; field: FieldItem; }
 */
export const getHeaderCellInfo = (cfg: Config, cellElement: HTMLElement): HeaderCellInfo => {
  const col = getHeaderCellPosition(cellElement);

  return {
    c: col,
    field: cfg.currentFields[col],
  };
};

/**
 * cell element
 * @param cellElement cell element
 * @returns
 */
export const getHeaderCellPosition = (cellElement: HTMLElement) => {
  return intValue(cellElement.getAttribute("data-header-cell-position") ?? "-1");
};

/**
 * text width
 *
 * @param {Config} cfg Config
 * @param {string} text text
 * @returns {*}
 */
export const getTextWidth = (cfg: Config, text: string, padding: number = 10) => {
  const metrics = cfg.canvasContext?.measureText(text);
  return (metrics?.width ?? 0) + padding;
};

/**
 * max column width
 *
 * @param {Config} cfg config
 * @param {GridOptions} opts grid option
 * @param {FieldItem} field field item
 * @param {number} checkWidth check width
 * @returns {number} max width size
 */
export const getMaxColumnSize = (cfg: Config, opts: GridOptions, field: FieldItem, checkWidth: number): number => {
  const items = cfg.items;
  const maxWidth = opts.header.resize.maxWidth;
  let returnMaxWidth = 0;

  const context = cfg.canvasContext as CanvasRenderingContext2D;

  const startIdx = cfg.scroll.startIdx;

  for (let i = startIdx, len = Math.min(cfg.dataInfo.rowLength, startIdx + 100); i < len; i++) {
    const tmpVal = field.$renderer.getValue(items[i]);

    if (isEmpty(tmpVal)) continue;

    let metrics = context.measureText(tmpVal);
    checkWidth = Math.max(metrics.width, checkWidth);

    if (maxWidth > 0 && checkWidth >= maxWidth) {
      return maxWidth;
    }

    returnMaxWidth = Math.max(returnMaxWidth, checkWidth);
  }

  return returnMaxWidth + 16;
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
 * @param {Config} cfg 그리드 설정 정보
 * @param {number} centerGridLeft center content left 값
 * @returns {number}
 */
export function getHorizontalScrollPosition(cfg: Config, centerGridLeft: number, direction?: string): number {
  if (centerGridLeft < 1) {
    return 0;
  }

  if (cfg.dimensions.mainCenterOverWidth <= 0) {
    return 0;
  }

  let left;
  if (direction == ScrollDirectionX.RIGHT) {
    left = centerGridLeft - cfg.dimensions.mainCenterViewWidth;
  } else {
    left = centerGridLeft - 2;
  }

  return ((left / cfg.dimensions.mainCenterOverWidth) * 100 * (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) / 100;
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
 * @param {Config} cfg 설정
 * @param {number} moveY 마우스 move position
 * @param {number} rowHeight row height
 * @param {CellInfo} startCellInfo start cell 정보
 * @param {number} _t grid top position
 * @param {number} _b grid bottom position
 * @returns {{ scrollDirectionY: string; rowIdx: number;, viewRowIdx: number; }}
 */
export function dragVerticalMovePosition(cfg: Config, moveY: number, rowHeight: number, startCellInfo: CellInfo, _t: number, _b: number) {
  const scroll = cfg.scroll;
  const dataInfo = cfg.dataInfo;

  const startIdx = scroll.startIdx;
  const insideViewRow = scroll.insideViewRow;
  const viewRow = scroll.viewRow;
  const rowLength = dataInfo.rowLength;

  let scrollDirectionY: ScrollDirectionY.UP | ScrollDirectionY.DOWN | null = null;
  let rowIdx = -1;

  // 위
  if (moveY < _t) {
    if (startIdx > 0) {
      scrollDirectionY = ScrollDirectionY.UP;
      rowIdx = startIdx - 1;
    } else {
      rowIdx = 0;
    }

    return { scrollDirectionY, rowIdx, viewRowIdx: 0 };
  }

  // 아래
  if (moveY > _b) {
    if (startIdx + insideViewRow < rowLength) {
      scrollDirectionY = ScrollDirectionY.DOWN;
      rowIdx = startIdx + insideViewRow + 1;
    } else {
      rowIdx = rowLength - 1;
    }

    return { scrollDirectionY, rowIdx, viewRowIdx: insideViewRow };
  }

  // 내부 영역
  const relativeY = moveY - _t;

  // division 제거 → 곱셈 사용
  const invRowHeight = 1 / rowHeight;
  const viewRowIdx = (relativeY * invRowHeight) | 0;
  // | 0 은 floor보다 빠름 (양수 전제)

  if (viewRowIdx < viewRow) {
    rowIdx = startIdx + viewRowIdx;
  }

  return { scrollDirectionY, rowIdx, viewRowIdx };
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
 * @returns {{ scrollDirectionX: string; overCell: number; }}
 */
export function dragHorizontalMovePosition(cfg: Config, moveX: number, positionX: number, _l: number, _r: number, beforeEndCol: number) {
  let scrollDirectionX = null;
  let overCell = -1;

  const currentFields = cfg.currentFields;
  const totalCells = currentFields.length;

  const startCol = cfg.selection.startCell.startCol;

  let startCellIdx = 0;
  let endCellIdx = totalCells;

  let centerMovePageX = 0;
  let contentLeftVal = 0;

  const { fixedLeftIndex, fixedRightIndex } = cfg;
  if (moveX < _l) {
    // 왼쪽으로 드래그
    centerMovePageX = moveX - positionX;
    endCellIdx = fixedLeftIndex;

    scrollDirectionX = ScrollDirectionX.LEFT;
  } else if (moveX > _r) {
    // 오른쪽으로 드래그
    startCellIdx = fixedRightIndex;

    if (startCellIdx > 0) {
      centerMovePageX = moveX - _r;
    } else {
      overCell = totalCells - 1;
    }

    scrollDirectionX = ScrollDirectionX.RIGHT;
  } else {
    // 중앙 영역
    centerMovePageX = moveX - _l;
    startCellIdx = fixedLeftIndex;
    contentLeftVal = getCenterContentLeft(cfg, cfg.scroll.left);
  }

  if (!(startCellIdx < 1 && scrollDirectionX === ScrollDirectionX.RIGHT)) {
    if (centerMovePageX <= 0) {
      overCell = 0;
    } else if (overCell === -1) {
      let leftSum = 0;
      let passedContentLeft = false;

      for (let i = startCellIdx; i < endCellIdx; i++) {
        const colWidth = currentFields[i].$width;
        leftSum += colWidth;

        if ((contentLeftVal <= 0 || passedContentLeft) && leftSum > centerMovePageX) {
          overCell = i;
          break;
        }

        if (!passedContentLeft && leftSum >= contentLeftVal) {
          passedContentLeft = true;
          leftSum = contentLeftVal > 0 && leftSum > contentLeftVal ? leftSum - contentLeftVal : leftSum;
        }
      }

      if (overCell === -1 && leftSum < centerMovePageX) {
        overCell = endCellIdx;
      }
    }
  }

  if (
    (scrollDirectionX == ScrollDirectionX.LEFT && (isFixedLeftPostion(cfg, startCol) || cfg.scroll.left == 0)) ||
    (scrollDirectionX == ScrollDirectionX.RIGHT && (isFixedRightPostion(cfg, startCol) || totalCells - (fixedRightIndex > 0 ? totalCells - fixedRightIndex : 0) - 1 == cfg.scroll.insideEndCol))
  ) {
    scrollDirectionX = null;
  }

  overCell = Math.max(overCell, cfg.dataInfo.startCol);

  return { scrollDirectionX, overCell };
}

/**
 * create new item
 *
 * @param {FieldItem[]} headerItems field items
 * @param {number} [createCount=1] create count
 * @returns {any[]} result
 */
export function createNewItems(headerItems: FieldItem[], createCount: number = 1): any[] {
  const len = headerItems.length;

  const result = [];
  for (let i = 0; i < createCount; i++) {
    let newItem: any = {};
    newItem[ROW_CUD_KEY] = "C";
    for (let j = 0; j < len; j++) {
      const headerItem = headerItems[j];
      newItem[headerItem.name] = headerItem.defaultValue ?? "";
    }

    result.push(newItem);
  }

  // console.log("createNewItems , ", createCount, result);

  return result;
}
/**
 * 체크박스 상태(mode)를 반환합니다.
 *
 * @param checkLength - 체크된 항목의 수
 * @param itemLength - 전체 항목 수
 * @returns "all" (전체 선택), "partial" (일부 선택), "none" (선택 없음)
 */
export function getCheckboxMode(checkLeneth: number, itemLength: number) {
  if (checkLeneth == 0) return "none";
  if (checkLeneth == itemLength) return "all";
  return "partial";
}

export function isImageType(renderType: string) {
  return renderType == "image";
}

/**
 * list item value key
 *
 * @export
 * @param {RendererInfo} rendererInfo renderer info
 * @returns {string} value key
 */
export function valuesValueKey(rendererInfo: RendererInfo): string {
  return rendererInfo?.listItem?.valueField ?? "value";
}

/**
 * list item label key
 *
 * @export
 * @param {RendererInfo} rendererInfo renderer info
 * @returns {string} label key
 */
export function valuesLabelKey(rendererInfo: RendererInfo): string {
  return rendererInfo?.listItem?.labelField ?? "label";
}

const TEMPLATE_REGEX = /\{\{([A-Za-z0-9_.]*)\}\}/g;
export function valuesLabelValue(label: string, val: any) {
  let replaceFlag = false;
  const resultValue = label.replace(TEMPLATE_REGEX, (match, key) => {
    replaceFlag = true;
    return val[key] || "";
  });

  if (replaceFlag) {
    return resultValue;
  }

  return val[label] || "";
}

/**
 * get height option value first value
 *
 * @export
 * @param {(number | number[] | undefined)} heightOption  height option value
 * @param {number} defaultHeight default height
 * @returns {{ height: number; heights: {}; }}
 */
export function heightOptionValue(heightOption: number | number[] | undefined, defaultHeight: number) {
  let height: number;
  let heights: number[] = [];
  if (isArray(heightOption) && heightOption.length > 0) {
    height = heightOption[0];
    heights = heightOption;
  } else {
    height = !isNumber(heightOption) ? 28 : heightOption;
  }

  return { height, heights };
}

/**
 * 배열 아이템 이동
 *
 * @param {any[]} array 이동할 배열
 * @param {number} fromIndex 이동할 아이템의 현재 인덱스
 * @param {number} toIndex 이동할 아이템의 새로운 인덱스
 * @returns {any[]} 이동된 아이템이 반영된 새로운 배열
 */
export function moveItem(array: any[], fromIndex: number, toIndex: number): any[] {
  const item = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, item);
  return array;
}
