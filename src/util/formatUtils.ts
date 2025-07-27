import { DisplayFormatOptions } from "@t/Common";
import { FieldItem } from "@t/GridField";
import { values } from "lodash";
import { ADD_ROW_POSITION } from "src/constants";
import { formatNumber } from "src/format/formatNumber";

export function formatValue(value: any, displayFormat: DisplayFormatOptions) {
  const type = displayFormat.type;

  if (type == "number" && !isNaN(value)) {
    return formatNumber(value, displayFormat.format ?? "0,0");
  }

  return value;
}
