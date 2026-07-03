import { isString } from './utils';

export function listToValueLabelMap(list: any[], labelKey: string, valueKey: string) {
  const valueLabelMap = new Map<string, any>();
  const isStringValue = isString(list[0]);
  for (const item of list) {
    let val: string;
    let label: string;

    if (isStringValue) {
      val = item;
      label = item;
    } else {
      val = item?.[valueKey] ?? '';
      label = item?.[labelKey] ?? '';
    }
    valueLabelMap.set(val, label);
  }

  return valueLabelMap;
}
