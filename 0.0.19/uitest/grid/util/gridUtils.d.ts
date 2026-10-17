import { PointerPosition } from '../event/PointerSession.js';
import { CellInfo, Config, HeaderCellInfo, ScrollInfo } from '../types/GridConfig.js';
import { FieldItem } from '../types/GridField.js';
import { GridOptions } from '../types/GridOptions.js';
import { EditRendererInfo } from '../types/RendererInfo.js';
/**
 * 왼쪽 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @returns {boolean}
 */
export declare const isFixedLeftPostion: (cfg: Config, idx: number) => boolean;
/**
 * 오른쪽 고정 컬럼 여부 체크.
 *
 * @param {Config} cfg
 * @param {number} idx
 * @returns {boolean}
 */
export declare const isFixedRightPostion: (cfg: Config, idx: number) => boolean;
/**
 * is multiple selection mode
 *
 * @type {string} selection mode
 */
export declare const isMultipleSelectionMode: (selectionMode: string) => boolean;
export declare const isSingleSelectionMode: (selectionMode: string) => boolean;
export declare const isMultipleCellSelectionMode: (selectionMode: string) => boolean;
/**
 * row selection check
 *
 * @param {string} selectionMode mode
 * @returns {boolean}
 */
export declare const isRowSelectionMode: (selectionMode: string) => boolean;
/**
 * cell selection check
 * @param selectionMode  selection mode
 * @returns boolean cell selection 여부
 */
export declare const isCellSelectionMode: (selectionMode: string) => boolean;
/**
 * cell 정보 얻기
 *
 * @param {Config} cfg 설정 정보
 * @param {HTMLElement} cellElement cell element
 * @returns {{ r: any; c: any; rowItemIdx: any; rowItem: any; field: FieldItem; }}
 */
export declare const getCellInfo: (cfg: Config, cellElement: HTMLElement) => CellInfo;
/**
 * grid postion
 *
 * @param {HTMLElement} cellElement cell element
 * @returns {{ r: number; c: number; }}
 */
export declare const getCellPosition: (cellElement: HTMLElement) => {
    r: number;
    c: number;
};
export declare const getCellPositionAttr: (cellElement: HTMLElement) => string | undefined;
/**
 * header cell 정보 얻기
 *
 * @param {Config} cfg 설정 정보
 * @param {HTMLElement} cellElement cell element
 * @returns {c: number; field: FieldItem; }
 */
export declare const getHeaderCellInfo: (cfg: Config, cellElement: HTMLElement) => HeaderCellInfo;
export declare const getHeaderResizeCellInfo: (cfg: Config, cellElement: HTMLElement) => HeaderCellInfo;
/**
 * cell element
 * @param cellElement cell element
 * @returns
 */
export declare const getHeaderCellPosition: (cellElement: HTMLElement) => number;
/**
 * text width
 *
 * @param {Config} cfg Config
 * @param {string} text text
 * @returns {*}
 */
export declare const getTextWidth: (cfg: Config, text: string, padding?: number) => number;
/**
 * max column width
 *
 * @param {Config} cfg config
 * @param {GridOptions} opts grid option
 * @param {FieldItem} field field item
 * @param {number} checkWidth check width
 * @returns {number} max width size
 */
export declare const getMaxColumnSize: (cfg: Config, opts: GridOptions, field: FieldItem) => number;
/**
 * 스크롤 left postion -> 그리드 센터 포지션 값으로 변환.
 *
 * @param cfg 그리드 설정 정보
 * @param scrollLeft scroll left 값
 * @returns {number}
 */
export declare const getCenterContentLeft: (cfg: Config, scrollLeft: number) => number;
/**
 * 센터 포지션 값 - > 스크롤 left postion
 *
 * @param {Config} cfg 그리드 설정 정보
 * @param {number} centerGridLeft center content left 값
 * @returns {number}
 */
export declare const getHorizontalScrollPosition: (cfg: Config, centerGridLeft: number, direction?: string) => number;
/**
 * input field check
 * @param tagName html tag name
 * @returns
 */
export declare const isInputField: (tagName: string) => boolean;
export declare const getOverCellPosition: (cellInfo: CellInfo) => string;
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
export declare const dragVerticalMovePosition: (cfg: Config, moveY: number, rowHeight: number, startCellInfo: CellInfo, _t: number, _b: number) => {
    scrollDirectionY: "U" | null;
    rowIdx: number;
    viewRowIdx: number;
} | {
    scrollDirectionY: "D" | null;
    rowIdx: number;
    viewRowIdx: number;
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
export declare const dragHorizontalMovePosition: (cfg: Config, moveX: number, positionX: number, _l: number, _r: number, beforeEndCol: number) => {
    scrollDirectionX: "R" | "L" | null;
    overCell: number;
};
/**
 * create new item
 *
 * @param {FieldItem[]} fields field items
 * @param {number} [createCount=1] create count
 * @returns {any[]} result
 */
export declare const createNewItems: (fields: FieldItem[], createCount?: number) => any[];
/**
 * 체크박스 상태(mode)를 반환합니다.
 *
 * @param checkLength - 체크된 항목의 수
 * @param itemLength - 전체 항목 수
 * @returns "all" (전체 선택), "partial" (일부 선택), "none" (선택 없음)
 */
export declare const getCheckboxMode: (checkLeneth: number, itemLength: number) => "none" | "all" | "partial";
export declare const isImageType: (type: string) => type is "image";
/**
 * list item value key
 *
 * @export
 * @param {EditRendererInfo} rendererInfo renderer info
 * @returns {string} value key
 */
export declare const valuesValueKey: (rendererInfo: EditRendererInfo) => string;
/**
 * list item label key
 *
 * @export
 * @param {EditRendererInfo} rendererInfo renderer info
 * @returns {string} label key
 */
export declare const valuesLabelKey: (rendererInfo: EditRendererInfo) => string;
export declare const valuesLabelValue: (label: string, val: any) => any;
/**
 * get height option value first value
 *
 * @export
 * @param {(number | number[] | undefined)} heightOption  height option value
 * @param {number} defaultHeight default height
 * @returns {{ height: number; heights: {}; }}
 */
export declare const heightOptionValue: (heightOption: number | number[] | undefined, defaultHeight: number) => {
    height: number;
    heights: number[];
};
/**
 * 배열 아이템 이동
 *
 * @param {any[]} array 이동할 배열
 * @param {number} fromIndex 이동할 아이템의 현재 인덱스
 * @param {number} toIndex 이동할 아이템의 새로운 인덱스
 * @returns {any[]} 이동된 아이템이 반영된 새로운 배열
 */
export declare const moveItem: (array: any[], fromIndex: number, toIndex: number) => any[];
/**
 *  배열이 연속된 숫자로 이루어져 있는지 확인
 *
 * @param arr 확인할 숫자 배열
 * @returns {boolean} 배열이 연속된 숫자로 이루어져 있으면 true, 그렇지 않으면 false
 */
export declare const isSequential: (arr: number[]) => boolean;
/**
 * 마우스가 이동했는지 확인
 *
 * @param startPos start position of mouse event
 * @param currentPos current position of mouse event
 * @param threshold 이동으로 간주할 최소 거리 (기본값: 5 픽셀)
 * @returns
 */
export declare const isMouseMoved: (startPos: PointerPosition, currentPos: PointerPosition, threshold?: number) => boolean;
export declare const escapeCellValue: (value: any) => any;
/**
 * Parses clipboard text into a 2D array of strings
 * @param text The clipboard text to parse
 * @returns A 2D array representing the parsed rows and cells
 */
export declare const parseClipboard: (text: string) => string[][];
/**
 * 필드의 편집 가능 여부를 반환
 *
 * @param cfg Grid 설정 정보
 * @param field 편집 가능 여부를 확인할 필드 정보
 * @returns 편집 가능 여부
 */
export declare const isFieldEditable: (cfg: Config, field: FieldItem) => boolean;
/**
 * grid 가용 가능한 넓이
 *
 * @param cfg Grid 설정 정보
 * @returns
 */
export declare const gridAvailableWidth: (cfg: Config) => number;
export declare const getScrollDirectionCode: (cfg: Config, scrollInfo: ScrollInfo, moveRowIdx: number, moveColIdx: number) => number;
/**
 * 입력된 값을 리스트 형태의 문자열 배열로 변환합니다.
 *
 * - 배열인 경우: 입력된 배열을 그대로 반환합니다.
 * - 문자열인 경우: valueDelimiter를 기준으로 문자열을 분리하여 반환합니다.
 * - 그 외의 경우: 입력된 값을 배열의 단일 요소로 감싸서 반환합니다.
 *
 * @param value 변환할 값 또는 값의 배열
 * @param valueDelimiter 문자열을 분리할 때 사용할 구분자
 * @returns 리스트 형태로 변환된 값
 */
export declare const getListItemValue: (value: any | any[], valueDelimiter: string) => string[];
