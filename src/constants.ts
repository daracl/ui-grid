import { CheckboxRenderer } from "./renderer/view/CheckboxRenderer";
import { CustomEditRenderer } from "./renderer/edit/CustomEditRenderer";
import { DateRenderer } from "./renderer/edit/DateRenderer";

import { NumberEditRenderer } from "./renderer/edit/NumberEditRenderer";
import { PasswordRenderer } from "./renderer/view/PasswordRenderer";
import { RangeRenderer } from "./renderer/edit/RangeRenderer";
import { TextAreaRenderer } from "./renderer/edit/TextAreaRenderer";
import { TextEditRenderer } from "./renderer/edit/TextEditRenderer";

import { AsideLineNumberRenderer } from "./renderer/view/AsideLineNumberRenderer";
import { AsideModifyInfoRenderer } from "./renderer/view/AsideModifyInfoRenderer";
import { AsideRowCheckRenderer } from "./renderer/view/AsideRowCheckRenderer";

import { BarRenderer } from "./renderer/view/BarRenderer";
import { ButtonRenderer } from "./renderer/view/ButtonRenderer";
import { HiddenRenderer } from "./renderer/view/HiddenRenderer";
import { HtmlRenderer } from "./renderer/view/HtmlRenderer";
import { ImageRenderer } from "./renderer/view/ImageRenderer";
import { DropdownRenderer } from "./renderer/view/DropdownRenderer";
import { LinkRenderer } from "./renderer/view/LinkRenderer";
import { TextRenderer } from "./renderer/view/TextRenderer";
import { ViewCustomRenderer } from "./renderer/view/ViewCustomRenderer";
import { SparklineRenderer } from "./renderer/view/SparklineRenderer";
import { SparklineRendererBar } from "./renderer/view/SparklineRendererBar";
import { SwitchRenderer } from "./renderer/view/SwitchRenderer";
import { PasswordEditRenderer } from "./renderer/edit/PasswordEditRenderer";

export type MODE = "edit" | "view";

// copy type
export type COPY_MODE = "single" | "multiple" | "none";

// align type
export type ALIGN_TYPE = "left" | "center" | "right";

// 선택 타입
export type SELECTION_MODE = "row" | "cell" | "multiple-row" | "multiple-cell" | "none";

export const RULES = {
  NAN: "nan",
  MIN: "minimum",
  EXCLUSIVE_MIN: "exclusiveMinimum",
  MAX: "maximum",
  EXCLUSIVE_MAX: "exclusiveMaximum",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  BETWEEN: "between",
  BETWEEN_EXCLUSIVE_MIN: "betweenExclusiveMin",
  BETWEEN_EXCLUSIVE_MAX: "betweenExclusiveMax",
  BETWEEN_EXCLUSIVE_MINMAX: "betweenExclusiveMinMax",
  REGEXP: "regexp",
  REQUIRED: "required",
  VALIDATOR: "validator",
} as const;

export const FIELD_PREFIX = "dg"; // daracl grid field

// renderer type
export const VIEW_RENDERER: any = {
  lineNumber: AsideLineNumberRenderer,
  modifyInfo: AsideModifyInfoRenderer,
  rowCheckbox: AsideRowCheckRenderer,
  dropdown: DropdownRenderer,
  checkbox: CheckboxRenderer,
  switch: SwitchRenderer,
  bar: BarRenderer,
  button: ButtonRenderer,
  hidden: HiddenRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
  text: TextRenderer,
  password: PasswordRenderer,
  sparkline: SparklineRenderer,
  sparklineBar: SparklineRendererBar,
  custom: ViewCustomRenderer,
};

// edit renderer type
export const EDIT_RENDERER: any = {
  date: DateRenderer,
  custom: CustomEditRenderer,
  text: TextEditRenderer,
  number: NumberEditRenderer,
  dropdown: DropdownRenderer,
  password: PasswordEditRenderer,
  range: RangeRenderer,
  textarea: TextAreaRenderer,
};

export const ALIGN = {
  left: "left",
  center: "center",
  right: "right",
} as const;

export const ALIGN_STYLE = {
  left: "text-al",
  center: "text-ac",
  right: "text-ar",
} as const;

// theme type
export type THEME_TYPE = "light" | "dark";

export const GRID_THEME = {
  light: "dg-light",
  dark: "dg-dark",
} as const;

export type TEXT_ALIGN_TYPE = (typeof ALIGN)[keyof typeof ALIGN];

export type POSITION_TYPE = "left" | "center" | "right";

export type RENDERER_TYPE = "bar" | "button" | "html" | "image" | "link" | "number" | "text" | "file" | "textarea" | "dropdown" | "radio" | "checkbox" | "date" | "datetime" | "dateyear" | "datemonth" | "datehour" | "group" | "custom";

export type REGEXP_TYPE = "email" | "url" | "alpha" | "alpha-num";

export type PASSWORD_TYPE = "number" | "upper" | "upper-special" | "upper-special-number"; // 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자

export type ORIENTATION_TYPE = "horizontal" | "vertical";

export type ADD_ROW_POSITION = "before" | "after";

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

export const ROw_ITEM_PREFIX_NAME = "_dg";

/**
 * line number name
 *
 * @type {"$lineNumber"}
 */
export const LINE_NUMBER_NAME = "$lineNumber";

/**
 * row check name
 *
 * @type {"$rowCheck"}
 */
export const ROW_CHECK_NAME = "$rowCheck";

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
export const ROW_ID_KEY = ROw_ITEM_PREFIX_NAME + "$rowid";

/**
 * row id key
 *
 * @type {"_dg$rowid"}
 */
export const ROW_HEIGHT_KEY = ROw_ITEM_PREFIX_NAME + "$rowHeight";

/**
 * row cud name key
 *
 * @type {string}
 */
export const ROW_CUD_KEY = ROw_ITEM_PREFIX_NAME + "$CUD";

/**
 * layer attribute name
 *
 * @type {"data-dg-grid-layer"}
 */
export const LAYER_ATTR_NAME = "data-dg-grid-layer";

/**
 * 전체 선택 value
 */
export const ALL_SELECT_VALUE = "$all$";

/**
 * item chunk size
 *
 * @type {1000}
 */
export const CHUNK_SIZE = 1000;

export const HIDDEN_ELEMENT_SELECTOR = ".dg-hidden-container";

export const POINTER_STATE = {
  IDLE: "IDLE",
  PRESSED: "PRESSED",
  DRAGGING: "DRAGGING",
} as const;
