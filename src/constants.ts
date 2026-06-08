import { CheckboxRenderer } from './renderer/edit/CheckboxRenderer';
import { CustomEditRenderer } from './renderer/edit/CustomEditRenderer';
import { DateRenderer } from './renderer/edit/DateRenderer';

import { NumberEditRenderer } from './renderer/edit/NumberEditRenderer';
import { RangeRenderer } from './renderer/edit/RangeRenderer';
import { TextAreaRenderer } from './renderer/edit/TextAreaRenderer';
import { TextEditRenderer } from './renderer/edit/TextEditRenderer';
import { PasswordRenderer } from './renderer/view/PasswordRenderer';

import { AsideLineNumberRenderer } from './renderer/view/AsideLineNumberRenderer';
import { AsideModifyInfoRenderer } from './renderer/view/AsideModifyInfoRenderer';
import { AsideRowCheckRenderer } from './renderer/view/AsideRowCheckRenderer';

import { DropdownEditRenderer } from './renderer/edit/DropdownEditRenderer';
import { PasswordEditRenderer } from './renderer/edit/PasswordEditRenderer';
import { SwitchRenderer } from './renderer/edit/SwitchRenderer';
import { AsideRowDragHandleRenderer } from './renderer/view/AsideRowDragHandleRenderer';
import { BarRenderer } from './renderer/view/BarRenderer';
import { ButtonRenderer } from './renderer/view/ButtonRenderer';
import { DropdownRenderer } from './renderer/view/DropdownRenderer';
import { HiddenRenderer } from './renderer/view/HiddenRenderer';
import { HtmlRenderer } from './renderer/view/HtmlRenderer';
import { ImageRenderer } from './renderer/view/ImageRenderer';
import { LinkRenderer } from './renderer/view/LinkRenderer';
import { NumberRenderer } from './renderer/view/NumberRenderer';
import { SparklineRenderer } from './renderer/view/SparklineRenderer';
import { SparklineRendererBar } from './renderer/view/SparklineRendererBar';
import { TextRenderer } from './renderer/view/TextRenderer';
import { TreeRenderer } from './renderer/view/TreeRenderer';
import { ViewCustomRenderer } from './renderer/view/ViewCustomRenderer';

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
  lineNumber: AsideLineNumberRenderer,
  modifyInfo: AsideModifyInfoRenderer,
  rowCheckbox: AsideRowCheckRenderer,
  rowDragHandle: AsideRowDragHandleRenderer,
  dropdown: DropdownRenderer,
  checkbox: CheckboxRenderer,
  switch: SwitchRenderer,
  bar: BarRenderer,
  button: ButtonRenderer,
  hidden: HiddenRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
  number: NumberRenderer,
  text: TextRenderer,
  password: PasswordRenderer,
  sparkline: SparklineRenderer,
  sparklineBar: SparklineRendererBar,
  tree: TreeRenderer, // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: ViewCustomRenderer,
};

// edit renderer type
export const EDIT_RENDERER: any = {
  date: DateRenderer,
  custom: CustomEditRenderer,
  text: TextEditRenderer,
  number: NumberEditRenderer,
  dropdown: DropdownEditRenderer,
  checkbox: CheckboxRenderer,
  password: PasswordEditRenderer,
  range: RangeRenderer,
  textarea: TextAreaRenderer,
};

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

export type RENDERER_TYPE =
  | 'bar'
  | 'button'
  | 'html'
  | 'image'
  | 'link'
  | 'number'
  | 'text'
  | 'file'
  | 'textarea'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'dateyear'
  | 'datemonth'
  | 'datehour'
  | 'group'
  | 'tree'
  | 'custom';

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

export const ROw_ITEM_PREFIX_NAME = '_dg';

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
export const ROW_CHECK_KEY = ROw_ITEM_PREFIX_NAME + ROW_CHECK_NAME;

/**
 * row id key
 *
 * @type {"_dg$rowid"}
 */
export const ROW_ID_FIELD_NAME = ROw_ITEM_PREFIX_NAME + '$rowid';

/**
 * row height key
 *
 * @type {"_dg$rowHeight"}
 */
export const ROW_HEIGHT_KEY = ROw_ITEM_PREFIX_NAME + '$rowHeight';

/**
 * row cud name key
 *
 * @type {string}
 */
export const ROW_CUD_KEY = ROw_ITEM_PREFIX_NAME + '$CUD';

/**
 * row depth key
 *
 * @type {"_dg$depth"}
 */
export const ROW_DEPTH_KEY = ROw_ITEM_PREFIX_NAME + '$depth';

/**
 * row haschild key
 *
 * @type {"_dg$haschild"}
 */
export const ROW_HAS_CHILD_KEY = ROw_ITEM_PREFIX_NAME + '$haschild';

/**
 * row has expanded key
 *
 * @type {"_dg$expanded"}
 */
export const ROW_EXPANDED_KEY = ROw_ITEM_PREFIX_NAME + '$expanded';

/**
 * 전체 선택 value
 */
export const ALL_SELECT_VALUE = '$all$';

/**
 * original order key for sort
 *
 * @type {"$originOrder"}
 */
export const ORIGINAL_ORDER_KEY = ROw_ITEM_PREFIX_NAME + '$originOrder';

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

export const HIDDEN_ELEMENT_SELECTOR = '.dg-hidden-container';

export const POINTER_STATE = {
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

export const SelectionMode = {
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
export const BodyCellStyle = {
  CELL: 'dg-cell',
  SELECTION: 'dg-selection',
  START_CELL: 'dg-start-cell',
} as const;
