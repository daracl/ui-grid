import NumberRender from "src/renderer/edit/NumberRender";
import TextAreaRender from "src/renderer/edit/TextAreaRender";
import DropdownRender from "src/renderer/edit/DropdownRender";
import TextRender from "src/renderer/edit/TextRender";
import CheckboxRender from "src/renderer/edit/CheckboxRender";
import RadioRender from "src/renderer/edit/RadioRender";
import PasswordRender from "src/renderer/edit/PasswordRender";
import FileRender from "src/renderer/edit/FileRender";
import CustomRender from "./renderer/edit/CustomRender";
import GroupRender from "./renderer/edit/GroupRender";
import HiddenRender from "./renderer/edit/HiddenRender";
import ButtonRender from "./renderer/view/ButtonRenderer";
import RangeRender from "./renderer/edit/RangeRender";
import DateRender from "./renderer/edit/DateRender";
import TabRender from "./renderer/edit/TabRender";
import GridRender from "./renderer/edit/GridRender";

export type FORM_MODE = "new" | "modify" | "view";

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
  file: FileRender,
  custom: CustomRender,
  group: GroupRender,
  hidden: HiddenRender,
  button: ButtonRender,
  range: RangeRender,
  datehour: DateRender,
  datemonth: DateRender,
  date: DateRender,
  datetime: DateRender,
  tab: TabRender,
  grid: GridRender,
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

export type FIELD_POSITION = "top" | "left" | "left-left" | "left-right" | "right" | "right-left" | "right-right" | "bottom";

export type ORIENTATION_TYPE = "horizontal" | "vertical";

interface StringArrayMap {
  [key: string]: string[];
}

export const FIELD_POSITION_STYLE: StringArrayMap = {
  "top-left": ["top", "txt-left"],
  "top-center": ["top", "txt-center"],
  "top-right": ["top", "txt-right"],
  "left-left": ["", "txt-left"],
  "left-center": ["", "txt-center"],
  "left-right": ["", "txt-right"],
  "right-right": ["right", "txt-right"],
  "right-center": ["right", "txt-center"],
  "right-left": ["right", "txt-left"],
  "bottom-left": ["bottom", "txt-left"],
  "bottom-center": ["bottom", "txt-center"],
  "bottom-right": ["bottom", "txt-right"],
};
FIELD_POSITION_STYLE["top"] = FIELD_POSITION_STYLE["top-left"];
FIELD_POSITION_STYLE["right"] = FIELD_POSITION_STYLE["right-right"];
FIELD_POSITION_STYLE["left"] = FIELD_POSITION_STYLE["left-left"];
FIELD_POSITION_STYLE["bottom"] = FIELD_POSITION_STYLE["bottom-left"];
