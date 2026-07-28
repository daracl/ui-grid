import { ROW_FIELD, ScrollDirectionXMap, ScrollDirectionY, SelectionModeMap } from '@/constants';
import { PointerPosition } from '@/event/PointerSession';
import { CellInfo, Config, HeaderCellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { GridOptions } from '@t/GridOptions';
import { EditRendererInfo } from '@t/RendererInfo';
import { ScrollDirectionYMap } from '../constants';
import { intValue, isArray, isEmpty, isNumber } from './utils';

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

/**
 * is multiple selection mode
 *
 * @type {string} selection mode
 */
export const isMultipleSelectionMode = (selectionMode: string): boolean => {
  return selectionMode == SelectionModeMap.multiRow || selectionMode == SelectionModeMap.multiCell;
};

export const isSingleSelectionMode = (selectionMode: string): boolean => {
  return selectionMode == SelectionModeMap.cell || selectionMode == SelectionModeMap.row;
};

export const isMultipleCellSelectionMode = (selectionMode: string): boolean => {
  return selectionMode == SelectionModeMap.multiCell;
};

/**
 * row selection check
 *
 * @param {string} selectionMode mode
 * @returns {boolean}
 */
export const isRowSelectionMode = (selectionMode: string): boolean => {
  return selectionMode == SelectionModeMap.multiRow || selectionMode == SelectionModeMap.row;
};

/**
 * cell selection check
 * @param selectionMode  selection mode
 * @returns boolean cell selection 여부
 */
export const isCellSelectionMode = (selectionMode: string): boolean => {
  return selectionMode == SelectionModeMap.multiCell || selectionMode == SelectionModeMap.cell;
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
  const viewItem = cfg.dataManager.getViewItems()[rowIndex];
  return {
    r: posInfo.r,
    c: col,
    rowIndex: rowIndex,
    field: cfg.currentFields[posInfo.c],
    item: cfg.dataManager.getRowItem(viewItem.id),
    viewItem: viewItem,
  };
};

/**
 * grid postion
 *
 * @param {HTMLElement} cellElement cell element
 * @returns {{ r: number; c: number; }}
 */
export const getCellPosition = (cellElement: HTMLElement) => {
  const posInfo = (getCellPositionAttr(cellElement) ?? '').split(',');

  return {
    r: intValue(posInfo[0]),
    c: intValue(posInfo[1]),
  };
};

export const getCellPositionAttr = (cellElement: HTMLElement) => {
  return cellElement.getAttribute('data-cell-position');
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

export const getHeaderResizeCellInfo = (cfg: Config, cellElement: HTMLElement): HeaderCellInfo => {
  const col = intValue(cellElement.getAttribute('data-resize-idx') ?? '-1');

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
  return intValue(cellElement.getAttribute('data-header-cell-position') ?? '-1');
};

/**
 * text width
 *
 * @param {Config} cfg Config
 * @param {string} text text
 * @returns {*}
 */
export const getTextWidth = (cfg: Config, text: string, padding = 10) => {
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
  const dataManager = cfg.dataManager;
  const items = dataManager.getViewItems();
  const maxWidth = opts.header.resize.maxWidth;
  let returnMaxWidth = 0;

  const context = cfg.canvasContext as CanvasRenderingContext2D;

  const startIdx = cfg.scroll.startIdx;

  for (let i = startIdx, len = Math.min(cfg.dataInfo.rowLength, startIdx + 100); i < len; i++) {
    const tmpVal = field.$renderer.getValue(dataManager.getRowItem(items[i].id));

    if (isEmpty(tmpVal)) continue;

    const metrics = context.measureText(tmpVal);
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
export const getCenterContentLeft = (cfg: Config, scrollLeft: number): number => {
  if (scrollLeft < 1) {
    return 0;
  }
  return (
    (cfg.dimensions.mainCenterOverWidth * ((scrollLeft / (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) * 100)) /
    100
  );
};

/**
 * 센터 포지션 값 - > 스크롤 left postion
 *
 * @param {Config} cfg 그리드 설정 정보
 * @param {number} centerGridLeft center content left 값
 * @returns {number}
 */
export const getHorizontalScrollPosition = (cfg: Config, centerGridLeft: number, direction?: string): number => {
  if (centerGridLeft < 1) {
    return 0;
  }

  if (cfg.dimensions.mainCenterOverWidth <= 0) {
    return 0;
  }

  let left;
  if (direction === ScrollDirectionXMap.RIGHT) {
    left = centerGridLeft - cfg.dimensions.mainCenterViewWidth;
  } else {
    left = centerGridLeft - 2;
  }

  return ((left / cfg.dimensions.mainCenterOverWidth) * 100 * (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) / 100;
};

/**
 * input field check
 * @param tagName html tag name
 * @returns
 */
export const isInputField = (tagName: string): boolean => {
  return tagName.search(/(input|select|textarea)/i) > -1;
};

export const getOverCellPosition = (cellInfo: CellInfo): string => {
  return `${cellInfo.r}_${cellInfo.c}_${cellInfo.rowIndex}`;
};

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
export const dragVerticalMovePosition = (
  cfg: Config,
  moveY: number,
  rowHeight: number,
  startCellInfo: CellInfo,
  _t: number,
  _b: number,
) => {
  const scroll = cfg.scroll;
  const dataInfo = cfg.dataInfo;

  const startIdx = scroll.startIdx;
  const insideViewRow = scroll.insideViewRow;
  const viewRow = scroll.viewRow;
  const rowLength = dataInfo.rowLength;

  let scrollDirectionY: ScrollDirectionY | null = null;
  let rowIdx = -1;

  // 위
  if (moveY < _t) {
    if (startIdx > 0) {
      scrollDirectionY = ScrollDirectionYMap.UP;
      rowIdx = startIdx - 1;
    } else {
      rowIdx = 0;
    }

    return { scrollDirectionY, rowIdx, viewRowIdx: 0 };
  }

  // 아래
  if (moveY > _b) {
    if (startIdx + insideViewRow < rowLength) {
      scrollDirectionY = ScrollDirectionYMap.DOWN;
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
};

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
export const dragHorizontalMovePosition = (
  cfg: Config,
  moveX: number,
  positionX: number,
  _l: number,
  _r: number,
  beforeEndCol: number,
) => {
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

    scrollDirectionX = ScrollDirectionXMap.LEFT;
  } else if (moveX > _r) {
    // 오른쪽으로 드래그
    startCellIdx = fixedRightIndex;

    if (startCellIdx > 0) {
      centerMovePageX = moveX - _r;
    } else {
      overCell = totalCells - 1;
    }

    scrollDirectionX = ScrollDirectionXMap.RIGHT;
  } else {
    // 중앙 영역
    centerMovePageX = moveX - _l;
    startCellIdx = fixedLeftIndex;
    contentLeftVal = getCenterContentLeft(cfg, cfg.scroll.left);
  }

  if (!(startCellIdx < 1 && scrollDirectionX === ScrollDirectionXMap.RIGHT)) {
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
    (scrollDirectionX === ScrollDirectionXMap.LEFT && (isFixedLeftPostion(cfg, startCol) || cfg.scroll.left == 0)) ||
    (scrollDirectionX === ScrollDirectionXMap.RIGHT &&
      (isFixedRightPostion(cfg, startCol) ||
        totalCells - (fixedRightIndex > 0 ? totalCells - fixedRightIndex : 0) - 1 == cfg.scroll.insideEndCol))
  ) {
    scrollDirectionX = null;
  }

  overCell = Math.max(overCell, cfg.dataInfo.startCol);

  return { scrollDirectionX, overCell };
};

/**
 * create new item
 *
 * @param {FieldItem[]} fields field items
 * @param {number} [createCount=1] create count
 * @returns {any[]} result
 */
export const createNewItems = (fields: FieldItem[], createCount = 1): any[] => {
  const len = fields.length;

  const result = [];
  for (let i = 0; i < createCount; i++) {
    const newItem: any = {};
    newItem[ROW_FIELD.CUD] = 'C';
    for (let j = 0; j < len; j++) {
      const field = fields[j];
      newItem[field.name] = field.defaultValue ?? '';
    }

    result.push(newItem);
  }

  return result;
};
/**
 * 체크박스 상태(mode)를 반환합니다.
 *
 * @param checkLength - 체크된 항목의 수
 * @param itemLength - 전체 항목 수
 * @returns "all" (전체 선택), "partial" (일부 선택), "none" (선택 없음)
 */
export const getCheckboxMode = (checkLeneth: number, itemLength: number) => {
  if (checkLeneth == 0) return 'none';
  if (checkLeneth == itemLength) return 'all';
  return 'partial';
};

export const isImageType = (type: string) => {
  return type == 'image';
};

/**
 * list item value key
 *
 * @export
 * @param {EditRendererInfo} rendererInfo renderer info
 * @returns {string} value key
 */
export const valuesValueKey = (rendererInfo: EditRendererInfo): string => {
  return rendererInfo?.listItem?.valueField ?? 'value';
};

/**
 * list item label key
 *
 * @export
 * @param {EditRendererInfo} rendererInfo renderer info
 * @returns {string} label key
 */
export const valuesLabelKey = (rendererInfo: EditRendererInfo): string => {
  return rendererInfo?.listItem?.labelField ?? 'label';
};

const TEMPLATE_REGEX = /\{\{([A-Za-z0-9_.]*)\}\}/g;
export const valuesLabelValue = (label: string, val: any) => {
  let replaceFlag = false;
  const resultValue = label.replace(TEMPLATE_REGEX, (match, key) => {
    replaceFlag = true;
    return val[key] || '';
  });

  if (replaceFlag) {
    return resultValue;
  }

  return val[label] || '';
};

/**
 * get height option value first value
 *
 * @export
 * @param {(number | number[] | undefined)} heightOption  height option value
 * @param {number} defaultHeight default height
 * @returns {{ height: number; heights: {}; }}
 */
export const heightOptionValue = (heightOption: number | number[] | undefined, defaultHeight: number) => {
  let height: number;
  let heights: number[] = [];
  if (isArray(heightOption) && heightOption.length > 0) {
    height = heightOption[0];
    heights = heightOption;
  } else {
    height = !isNumber(heightOption) ? 28 : heightOption;
  }

  return { height, heights };
};

/**
 * 배열 아이템 이동
 *
 * @param {any[]} array 이동할 배열
 * @param {number} fromIndex 이동할 아이템의 현재 인덱스
 * @param {number} toIndex 이동할 아이템의 새로운 인덱스
 * @returns {any[]} 이동된 아이템이 반영된 새로운 배열
 */
export const moveItem = (array: any[], fromIndex: number, toIndex: number): any[] => {
  const item = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, item);
  return array;
};

/**
 *  배열이 연속된 숫자로 이루어져 있는지 확인
 *
 * @param arr 확인할 숫자 배열
 * @returns {boolean} 배열이 연속된 숫자로 이루어져 있으면 true, 그렇지 않으면 false
 */
export const isSequential = (arr: number[]): boolean => {
  const set = new Set(arr);
  if (set.size !== arr.length) return false;

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  return max - min + 1 === arr.length;
};

/**
 * 마우스가 이동했는지 확인
 *
 * @param startPos start position of mouse event
 * @param currentPos current position of mouse event
 * @param threshold 이동으로 간주할 최소 거리 (기본값: 5 픽셀)
 * @returns
 */
export const isMouseMoved = (startPos: PointerPosition, currentPos: PointerPosition, threshold = 5): boolean => {
  const dx = currentPos.x - startPos.x;
  const dy = currentPos.y - startPos.y;

  return dx * dx + dy * dy > threshold * threshold;
};

/*
 * 셀 값 이스케이프 처리
 * - 셀 값에 줄바꿈(\n, \n\r)이나 탭(\t)이 포함된 경우, 값 전체를 큰따옴표로 감싸고, 기존의 큰따옴표는 두 개로 이스케이프 처리
 * - 예: Hello\nWorld -> "Hello\nWorld", She said "Hi" -> "She said ""Hi"""
 */
export const escapeCellValue = (value: any) => {
  if (typeof value !== 'string') return value;

  const hasSpecial = /["\n\r\t]/.test(value);

  if (hasSpecial) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
};

/**
 * Parses clipboard text into a 2D array of strings
 * @param text The clipboard text to parse
 * @returns A 2D array representing the parsed rows and cells
 */
export const parseClipboard = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  text = text.replace(/(\r?\n){2}$/, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && char === '\t') {
      row.push(cell);
      cell = '';
    } else if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i++;

      row.push(cell);
      rows.push(row);

      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);

  return rows;
};

/**
 * 필드의 편집 가능 여부를 반환한다.
 *
 * Grid의 편집 기능이 활성화되어 있고,
 * 필드에서 editable이 명시적으로 false가 아닌 경우 편집 가능으로 판단한다.
 *
 * @param cfg Grid 설정 정보
 * @param field 편집 가능 여부를 확인할 필드 정보
 * @returns 편집 가능 여부
 */
export const isFieldEditable = (cfg: Config, field: FieldItem): boolean => {
  // if (!field) return false;

  return field.editable === true || (cfg.enableCellEdit && field.editable !== false);
};
