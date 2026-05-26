import { ADD_ITEM_POSITION, ALL_SELECT_VALUE } from '../constants';
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

/**
 * 검색 모드 옵션
 */
export type SearchMode = {
  // 검색어 대소문자 구분 여부
  matchCase?: boolean;
  // 검색어 전체가 일치하는지 여부
  matchWholeWord?: boolean;
  // 검색어를 정규식으로 해석하여 검색할지 여부
  useRegex?: boolean;
  // 검색 대상 필드 (string 또는 string 배열, ALL_SELECT_VALUE인 경우 모든 필드 검색)
  searchFields?: SearchFields;
  // 검색어 전체가 일치하는지 여부 (useRegex가 true인 경우에만 사용)
  matchWholeRegex?: RegExp;
  // 검색어가 포함되지 않은 행 숨김 여부
  hideNonMatched?: boolean;
  // 트리 형태로 검색 결과 표시 여부 (true인 경우 일치하는 항목과 그 부모 항목 모두 표시)
  displayMode?: 'tree' | 'list';
};

export type SearchFields = string | string[] | ALL_SELECT_VALUE;

export type MatchedField = {
  fieldName: string;
  originalValue: string;
  highlightedValue: string;
  matchCount: number;
  matchPositions: { start: number; end: number }[];
};

export type DisplayFormatOptions = {
  type: 'number' | 'date' | 'currency';
  format: string;
  prefix: string;
  suffix: string;
  locale: string;
};

export type RowId = string | number;

export type AddRowOptions = {
  rowId?: RowId;
  items: any | any[];
  position?: ADD_ITEM_POSITION;
};
