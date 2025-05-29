import CheckboxRenderer from "./renderer/edit/CheckboxRenderer";
import EditCustomRenderer from "./renderer/edit/EditCustomRenderer";
import DateRenderer from "./renderer/edit/DateRenderer";
import DropdownRenderer from "./renderer/edit/DropdownRenderer";
import NumberRenderer from "./renderer/edit/NumberRenderer";
import PasswordRenderer from "./renderer/edit/PasswordRenderer";
import RadioRenderer from "./renderer/edit/RadioRenderer";
import RangeRenderer from "./renderer/edit/RangeRenderer";
import TextAreaRenderer from "./renderer/edit/TextAreaRenderer";
import EditTextRenderer from "./renderer/edit/EditTextRenderer";

import AsideLineNumberRenderer from "./renderer/view/AsideLineNumberRenderer";
import AsideModifyInfoRenderer from "./renderer/view/AsideModifyInfoRenderer";
import AsideRowCheckRenderer from "./renderer/view/AsideRowCheckRenderer";

import BarRenderer from "./renderer/view/BarRenderer";
import ButtonRenderer from "./renderer/view/ButtonRenderer";
import HiddenRenderer from "./renderer/view/HiddenRenderer";
import HtmlRenderer from "./renderer/view/HtmlRenderer";
import ImageRenderer from "./renderer/view/ImageRenderer";
import LinkRenderer from "./renderer/view/LinkRenderer";
import TextRenderer from "./renderer/view/TextRenderer";
import ViewCustomRenderer from "./renderer/view/ViewCustomRenderer";

export type MODE = "edit" | "view";

// copy type
export type COPY_MODE = "single" | "multiple" | "none";

// align type
export type ALIGN_TYPE = "left" | "center" | "right";

// 선택 타입
export type SELECTION_MODE = "row" | "cell" | "multiple-row" | "multiple-cell" | "none";

// theme type
export type THEME_TYPE = "light" | "dark";

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
  bar: BarRenderer,
  button: ButtonRenderer,
  hidden: HiddenRenderer,
  html: HtmlRenderer,
  image: ImageRenderer,
  link: LinkRenderer,
  text: TextRenderer,
  custom: ViewCustomRenderer,
};

// edit renderer type
export const EDIT_RENDERER: any = {
  checkbox: CheckboxRenderer,
  date: DateRenderer,
  dropdown: DropdownRenderer,
  custom: EditCustomRenderer,
  text: EditTextRenderer,
  number: NumberRenderer,
  password: PasswordRenderer,
  radio: RadioRenderer,
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

/**
 * scroll button size
 *
 * @type {14}
 */
export const SCROLL_ARROW_BUTTON_SIZE = 14;
