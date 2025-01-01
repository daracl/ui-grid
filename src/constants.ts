import NumberRender from "src/renderer/edit/NumberRender";
import TextAreaRender from "src/renderer/edit/TextAreaRender";
import DropdownRender from "src/renderer/edit/DropdownRender";
import TextRender from "src/renderer/edit/TextRender";
import CheckboxRender from "src/renderer/edit/CheckboxRender";
import RadioRender from "src/renderer/edit/RadioRender";
import PasswordRender from "src/renderer/edit/PasswordRender";
import CustomRender from "./renderer/edit/CustomRender";
import ButtonRender from "./renderer/view/ButtonRenderer";
import RangeRender from "./renderer/edit/RangeRender";
import DateRender from "./renderer/edit/DateRender";
import {StringArrayMap} from "@t/DataMap";


export type MODE = "edit" | "view";

// copy type
export type COPY_MODE = "single"|"multiple"| "none";

// align type
export type ALIGN_TYPE = "left"|"center"| "right";

// 선택 타입 
export type SELECTION_TYPE = "row"|"cell"|"multiple-row"|"multiple-cell";

// theme type
export type THEME_TYPE = "light"|"dark";


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

export const FIELD_PREFIX = "dgf"; // daracl form field

export const RENDER_TEMPLATE: any = {
  number: NumberRender,
  textarea: TextAreaRender,
  dropdown: DropdownRender,
  checkbox: CheckboxRender,
  radio: RadioRender,
  text: TextRender,
  password: PasswordRender,
  custom: CustomRender,
  button: ButtonRender,
  range: RangeRender,
  datehour: DateRender,
  datemonth: DateRender,
  date: DateRender,
  datetime: DateRender,
};

export const ALIGN = {
  left: "left",
  center: "center",
  right: "right",
} as const;

export type TEXT_ALIGN_TYPE = (typeof ALIGN)[keyof typeof ALIGN];

export type POSITION_TYPE = "left" | "center" | "right";

export type VIEW_RENDER_TYPE = "bar" | "button" | "html" | "image" | "link";

export type EDIT_RENDER_TYPE = "number" | "text" | "file" | "textarea" | "dropdown" | "radio" | "checkbox" | "date" | "datetime" | "dateyear" | "datemonth" | "datehour" | "group" | "custom";

export type REGEXP_TYPE = "email" | "url" | "alpha" | "alpha-num";

export type PASSWORD_TYPE = "number" | "upper" | "upper-special" | "upper-special-number"; // 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자

export type ORIENTATION_TYPE = "horizontal" | "vertical";

