import { LAYER_ATTR_NAME } from "src/constants";
import { styleClassSplit } from "./styleUtils";
import { isArray } from "./utils";
import { SearchMode } from "@t/Common";

export function gridDataSearch<T extends Record<string, any>>(searchList: T[], searchText: string, options: SearchMode = {}): T[] {
  if (!searchText) return [];

  const { matchCase = false, matchWholeWord = false, useRegex = false, searchFields = "$all$" } = options;

  let regex: RegExp | null = null;
  let pattern = searchText;

  if (useRegex) {
    try {
      regex = new RegExp(pattern, matchCase ? "" : "i");
    } catch (e) {
      console.error("정규식 오류:", (e as Error).message);
      return [];
    }
  } else {
    if (!matchCase) {
      pattern = pattern.toLowerCase();
    }
  }

  const fieldsToSearch = (item: T): string[] => (searchFields === "$all$" ? Object.keys(item).filter((key) => typeof item[key] === "string") : Array.isArray(searchFields) ? searchFields : [searchFields]);

  return searchList.filter((item) => {
    return fieldsToSearch(item).some((field) => {
      const value = item[field];
      if (typeof value !== "string") return false;

      let target = value;
      if (!matchCase && !useRegex) target = target.toLowerCase();

      if (useRegex) {
        return regex!.test(value);
      } else if (matchWholeWord) {
        return target === pattern;
      } else {
        return target.includes(pattern);
      }
    });
  });
}
