import { AddItemPosition, SearchDirection } from '../constants';
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
 * 검색 결과
 */
export type SearchResult = {
  isOriginal: boolean;
  items: ViewItem[];
  matchCount: number;
};
/**
 * 검색 모드 옵션
 */
export type SearchMode = {
  // 검색어 대소문자 구분 여부
  matchCase: boolean;
  // 검색어 전체가 일치하는지 여부
  matchWholeWord: boolean;
  // 검색어를 정규식으로 해석하여 검색할지 여부
  useRegex: boolean;
  // 검색 대상 필드 (string 또는 string 배열, ALL_SELECT_VALUE인 경우 모든 필드 검색)
  searchFields?: SearchFields;
  // 검색어 전체가 일차 체크 정규식
  matchWholeRegex: RegExp;
  // 검색어가 포함되지 않은 행 숨김 여부
  hideNonMatched?: boolean;
  // 검색 방향
  direction: SearchDirection;
  // 검색 완료 후 실행
  postProcess?: (isMatched: boolean, item: any, viewItem?: ViewItem) => void;
};

export type SearchFields = string | string[] | ALL_SELECT_VALUE;

export type MatchedField = {
  fieldName: string;
  originalValue: string;
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
  position?: AddItemPosition;
};

export interface ViewItem {
  id: RowId;
  sortOrder: number;
  sortValues?: any[];
  matchedFields?: MatchedField[];
  matchCount?: number;
  isCurrentMatch?: boolean;
}

export interface TreeViewItem extends ViewItem {
  id: RowId;
  pid: RowId;
  children: TreeViewItem[];
  isLeaf: boolean;
  expanded: number;
  depth: number;
}

export type CURRENT_MATCH_INFO = {
  id: RowId;
  rowIndex: number;
  cellIndex: number;
  matchedFields: MatchedField[];
};

export interface SearchMatchInfo {
  // 검색 match count
  matchCount: number;

  // match cell index
  cellIndex: number;

  // row index
  rowIndex: number;

  // 현재 match item index
  currentMatchIndex: number;

  // match uid
  id: RowId;
}

/**
 * 행 선택 옵션
 */
export interface RowSelectOptions {
  /**
   * 선택할 필드명
   */
  fieldName?: string;

  /**
   * 선택한 행이 화면에 보이도록 스크롤할지 여부
   * @default true
   */
  scrollIntoView?: boolean;
}

export interface ValuesInfo {
  labelField: string;
  valueField: string;
  multiple?: boolean;
  delimiter: string;
  list: any[] | OptionCallback;
  orientation: ORIENTATION_TYPE;
  labelOnly?: boolean;
  includeAllOption?: boolean;
}
