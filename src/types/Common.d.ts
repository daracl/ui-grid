export interface OptionCallback {
  (...params: any[]): any;
}

/**
 *
 * @interface StringKeyMap
 * @typedef {StringKeyMap}
 */
export interface StringKeyMap {
  [key: string]: any;
}

/**
 *
 * @interface NumberKeyMap
 * @typedef {NumberKeyMap}
 */
export interface NumberKeyMap {
  [key: number]: any;
}

/**
 *
 * @interface AnyKeyMap
 * @typedef {AnyKeyMap}
 */
export interface AnyKeyMap {
  [key: any]: any;
}

interface StringArrayMap {
  [key: string]: string[];
}

export type SearchMode = {
  matchCase: boolean;
  matchWholeWord: boolean;
  useRegex: boolean;
  searchFields: string | string[] | "$all$";
};

export type MatchedField = {
  fieldName: string;
  originalValue: string;
  highlightedValue: string;
  matchCount: number;
  matchPositions: { start: number; end: number }[];
};

export type DisplayFormatOptions = {
  type: "number" | "date" | "currency";
  format: string;
  prefix: string;
  suffix: string;
  locale: string;
};
