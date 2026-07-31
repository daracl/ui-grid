// grid instance id attr key
export const INSTANCE_ATTR_KEY = 'daracl-grid-id';

export type MODE = 'edit' | 'view';

export const SelectionModeMap = {
  cell: 'cell',
  multiCell: 'multiCell',
  row: 'row',
  multiRow: 'multiRow',
  none: 'none',
} as const;

// 선택 타입
export type SelectionMode = (typeof SelectionModeMap)[keyof typeof SelectionModeMap];

// body hover
export const HoverModeMap = {
  cell: 'dg-body-hover-cell',
  row: 'dg-body-hover-row',
  none: 'dg-body-hover-none',
} as const;

export type HoverMode = 'cell' | 'row' | 'none';

export const ALIGN_STYLE = {
  left: 'dg-left',
  center: 'dg-center',
  right: 'dg-right',
} as const;

// align type
export type AlignStyleType = (typeof ALIGN_STYLE)[keyof typeof ALIGN_STYLE];

export const RULES = {
  NAN: 'nan',
  MIN: 'minimum',
  EXCLUSIVE_MIN: 'exclusiveMinimum',
  MAX: 'maximum',
  EXCLUSIVE_MAX: 'exclusiveMaximum',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  BETWEEN: 'between',
  BETWEEN_EXCLUSIVE_MIN: 'betweenExclusiveMin',
  BETWEEN_EXCLUSIVE_MAX: 'betweenExclusiveMax',
  BETWEEN_EXCLUSIVE_MINMAX: 'betweenExclusiveMinMax',
  REGEXP: 'regexp',
  REQUIRED: 'required',
  VALIDATOR: 'validator',
} as const;

export const FIELD_PREFIX = 'dg'; // daracl grid field

export type POSITION_TYPE = 'left' | 'center' | 'right';

export type REGEXP_TYPE = 'email' | 'url' | 'alpha' | 'alpha-num';

/**
 * 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자
 */
export type PASSWORD_TYPE = 'number' | 'upper' | 'upper-special' | 'upper-special-number';

export type ORIENTATION_TYPE = 'horizontal' | 'vertical';

export type ADD_ITEM_POSITION = 'before' | 'after' | 'inside';

export const MovePositionMap = {
  BEFORE: 'before',
  AFTER: 'after',
  INSIDE: 'inside',
} as const;

export type MovePosition = (typeof MovePositionMap)[keyof typeof MovePositionMap];

/**
 * mouse move threshold
 */
export const MOUSE_MOVE_THRESHOLD = 5;

/**
 * default toolbar height
 *
 * @type {50}
 */
export const TOOLBAR_HEIGHT = 35;

/**
 * default footer height
 *
 * @type {50}
 */
export const FOOTER_HEIGHT = 35;

export const ROW_KEY_PREFIX = '_dg';

/**
 * line number name
 *
 * @type {"$lineNumber"}
 */
export const LINE_NUMBER_NAME = '$lineNumber';

/**
 * row check name
 *
 * @type {"$rowCheck"}
 */
export const ROW_CHECK_NAME = '$rowCheck';

/**
 * row check key
 *
 * @type {"_dg$rowCheck"}
 */
export const ROW_CHECK_KEY = ROW_KEY_PREFIX + ROW_CHECK_NAME;

export const ROW_FIELD = {
  ID: `${ROW_KEY_PREFIX}$rowid`,
  DEPTH: `${ROW_KEY_PREFIX}$depth`,
  HEIGHT: `${ROW_KEY_PREFIX}$rowHeight`,
  CUD: `${ROW_KEY_PREFIX}$CUD`,
  ORIGINAL_ORDER: `${ROW_KEY_PREFIX}$originOrder`,
} as const;

/**
 * 전체 선택 value
 */
export const ALL_SELECT_VALUE = '$all$';

/**
 * row drag handle name
 *
 * @type {"$rowDragHandle"}
 */
export const ROW_DRAG_HANDLE_NAME = '$rowDragHandle';

/**
 * layer attribute name
 *
 * @type {"data-dg-grid-layer"}
 */
export const LAYER_ATTR_NAME = 'data-dg-grid-layer';

/**
 * field layer class
 *
 * @type {"dg-field-layer"}
 */
export const FIELD_LAYER_CLASS = 'dg-field-layer';

/**
 * item chunk size
 *
 * @type {1000}
 */
export const CHUNK_SIZE = 1000;

export const HIDDEN_ELEMENT_SELECTOR = '.dg-hidden-layers';

export const PointerStateMap = {
  IDLE: 'IDLE',
  PRESSED: 'PRESSED',
  DRAGGING: 'DRAGGING',
} as const;

export const SCROLL_THUMB_MIN_SIZE = 18;

export const SCROLL_INSET = 4;

/**
 * Scroll direction for X-axis
 */
export const ScrollDirectionXMap = {
  LEFT: 'L',
  RIGHT: 'R',
} as const;

export type ScrollDirectionX = (typeof ScrollDirectionXMap)[keyof typeof ScrollDirectionXMap];

/**
 * Scroll direction for Y-axis
 */
export const ScrollDirectionYMap = {
  UP: 'U',
  DOWN: 'D',
} as const;

export type ScrollDirectionY = (typeof ScrollDirectionYMap)[keyof typeof ScrollDirectionYMap];

/**
 * body cell style class
 *
 * @type {{CELL: string, SELECTION: string, START_CELL: string}}
 */
export const BodyCellStyleMap = {
  CELL: 'dg-cell',
  SELECTION: 'dg-selection',
  START_CELL: 'dg-start-cell',
} as const;

/**
 * match whole regex
 */
export const MATCH_WHOLE_REGEX = /[ㄱ-ㅎ가-힣a-zA-Z0-9_]+/g;

/**
 * 검색 방향
 */
export const SearchDirectionMap = {
  PREV: 'prev',
  NEXT: 'next',
} as const;

export type SearchDirection = (typeof SearchDirectionMap)[keyof typeof SearchDirectionMap];
