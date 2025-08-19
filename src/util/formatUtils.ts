import { DisplayFormatOptions } from "@t/Common";
import { formatNumber } from "src/format/formatNumber";

export function formatValue(value: any, displayFormat: DisplayFormatOptions) {
  const type = displayFormat.type;

  if (type == "number" && !isNaN(value)) {
    return formatNumber(value, displayFormat.format ?? "0,0");
  }

  return value;
}
