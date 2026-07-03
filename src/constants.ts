import * as EditRenderer from './renderer/edit';

import * as ViewRenderer from './renderer/view';

import * as ToolbarRenderer from './renderer/toolbar';

// grid instance id attr key
export const INSTANCE_ATTR_KEY = 'daracl-grid-id';

export type MODE = 'edit' | 'view';

// copy type
export type COPY_MODE = 'single' | 'multiple' | 'none';

// align type
export type ALIGN_TYPE = 'left' | 'center' | 'right';

// 선택 타입
export type SELECTION_MODE = 'row' | 'cell' | 'multiple-row' | 'multiple-cell' | 'none';

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

// renderer type
export const VIEW_RENDERER: any = {
  lineNumber: ViewRenderer.AsideLineNumberRenderer,
  modifyInfo: ViewRenderer.AsideModifyInfoRenderer,
  rowCheckbox: ViewRenderer.AsideRowCheckRenderer,
  rowDragHandle: ViewRenderer.AsideRowDragHandleRenderer,
  dropdown: ViewRenderer.DropdownRenderer,
  checkbox: EditRenderer.CheckboxRenderer,
  switch: EditRenderer.SwitchRenderer,
  bar: ViewRenderer.BarRenderer,
  button: ViewRenderer.ButtonRenderer,
  hidden: ViewRenderer.HiddenRenderer,
  html: ViewRenderer.HtmlRenderer,
  image: ViewRenderer.ImageRenderer,
  link: ViewRenderer.LinkRenderer,
  number: ViewRenderer.NumberRenderer,
  text: ViewRenderer.TextRenderer,
  password: ViewRenderer.PasswordRenderer,
  sparkline: ViewRenderer.SparklineRenderer,
  sparklineBar: ViewRenderer.SparklineRendererBar,
  tree: ViewRenderer.TreeRenderer, // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: ViewRenderer.ViewCustomRenderer,
};

export type RENDERER_TYPE = keyof typeof VIEW_RENDERER;

// edit renderer type
export const EDIT_RENDERER: any = {
  date: EditRenderer.DateRenderer,
  custom: EditRenderer.CustomEditRenderer,
  text: EditRenderer.TextEditRenderer,
  number: EditRenderer.NumberEditRenderer,
  dropdown: EditRenderer.DropdownEditRenderer,
  checkbox: EditRenderer.CheckboxRenderer,
  password: EditRenderer.PasswordEditRenderer,
  range: EditRenderer.RangeRenderer,
  textarea: EditRenderer.TextAreaRenderer,
};

/**
 * toolbar renderer type
 */
export const TOOLBAR_RENDERER: any = {
  button: ToolbarRenderer.ButtonRenderer,
  checkbox: ToolbarRenderer.CheckboxRenderer,
  custom: ToolbarRenderer.CustomRenderer,
  date: ToolbarRenderer.DateRenderer,
  dropdown: ToolbarRenderer.DropdownRenderer,
  number: ToolbarRenderer.NumberRenderer,
  switch: ToolbarRenderer.SwitchRenderer,
  text: ToolbarRenderer.TextRenderer,
  textarea: ToolbarRenderer.TextRenderer,
};

export type TOOLBAR_RENDERER_TYPE = keyof typeof TOOLBAR_RENDERER;

export const ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const;

export const ALIGN_STYLE = {
  left: 'text-al',
  center: 'text-ac',
  right: 'text-ar',
} as const;

// theme type
export type THEME_TYPE = 'light' | 'dark';

export const GRID_THEME = {
  light: 'dg-light',
  dark: 'dg-dark',
} as const;

export const WHITE_SPACE = {
  pre: 'pre',
  wrap: 'pre-wrap',
  line: 'pre-line',
  normal: 'normal',
} as const;

export type WHITE_SPACE_TYPE = keyof typeof WHITE_SPACE;

export type TEXT_ALIGN_TYPE = keyof typeof ALIGN_STYLE;

export type POSITION_TYPE = 'left' | 'center' | 'right';

export type REGEXP_TYPE = 'email' | 'url' | 'alpha' | 'alpha-num';

export type PASSWORD_TYPE = 'number' | 'upper' | 'upper-special' | 'upper-special-number'; // 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자

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

export const SelectionModeMap = {
  MULTIPLE_ROW: 'multiple-row',
  MULTIPLE_CELL: 'multiple-cell',
  ROW: 'row',
  CELL: 'cell',
} as const;

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
