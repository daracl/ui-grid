import { isFunction, deepCopy, xss as replaceXss, unXss as unReplace, isUndefined, isArray, removeItem, isVisible, isSameValue, getHashCode, templateToElement, camelToUnderscore, camelToKebab, stringSplit, addValueIfMissing, trim, isBlank, isString, sanitizeHtml, isSafeUrl, joinUrl } from '@daracl/core/utils';
export { isFunction, deepCopy, replaceXss, unReplace, isUndefined, isArray, removeItem, isVisible, isSameValue, getHashCode, templateToElement, camelToUnderscore, camelToKebab, stringSplit, addValueIfMissing, trim, isBlank, isString, sanitizeHtml, isSafeUrl, joinUrl, };
import { DataManager } from '../service/DataManager.js';
import { ViewItem } from '../types/Common.js';
import { FieldSortInfo } from '../types/Header.js';
import { FieldItem } from '../types/GridField.js';
export declare const hasOwnProp: (obj: any, key: string) => boolean;
export declare const unFieldName: (fieldName: string) => string;
export declare const isNumber: (value: unknown) => value is number;
export declare const copyStringToClipboard: (copyText: string) => void;
export declare function debounce<T extends (...args: any[]) => void>(f: T, delay: number): (...args: Parameters<T>) => void;
/**
 * hidden type check
 *
 * @param {FieldItem} field field item
 * @returns {boolean} type hidden true , false
 */
export declare function isHiddenField(field: FieldItem): boolean;
/**
 * html 인지 여부 체크
 * @param target html element
 * @returns
 */
export declare function isHTMLElement(target: any): target is HTMLElement;
/**
 * replace message format
 *
 @param {string} pTmplate message template
 @param {*} data replace parameter
 * @returns {*}
 */
export declare const replaceMesasgeFormat: (pTmplate: string, data: any) => string;
export declare function isPlainObject(obj: any): boolean;
/**
 * 다중 키 기준으로 JSON 배열 정렬 (null/undefined 처리 포함)
 * @param {Array<Object>} data - 정렬할 JSON 배열
 * @param {Array<{ name: string, ascOrder?: boolean }>} sortInfos - 정렬 기준 키 배열
 * @returns {Array<Object>} 정렬된 JSON 배열
 */
/** 행의 정렬 기준 값 목록을 구한다. 정렬 정보 순서와 같다. */
export declare function getSortValues(dataManager: DataManager, viewItem: ViewItem, sortInfos: FieldSortInfo[]): any[];
export declare function multiSort(data: ViewItem[], dataManager: DataManager, sortInfos?: FieldSortInfo[], emptyValueLast?: boolean): ViewItem[];
export declare function compareCachedValue(valA: any, valB: any, ascOrder: boolean, emptyValueLast?: boolean): number;
export declare function isObject(value: any): boolean;
/**
 * 배열에 값을 삽입하고, 지정된 길이를 초과할 경우 오래된 항목을 제거합니다.
 *
 * @template T 배열 요소 타입
 * @param targetArray 수정할 대상 배열
 * @param values 삽입할 값 또는 값들의 배열
 @param isBefore true이면 rowIndex 앞에 삽입
 @param rowIndex 삽입 기준 인덱스. 생략하면 끝에 삽입
 @param limit 최대 길이. 초과하면 오래된 항목을 제거
 * @returns 수정된 원본 배열 (targetArray)
 */
export declare function insertToArray<T>(targetArray: T[], values: T | T[], isBefore?: boolean, rowIndex?: number, limit?: number): T[];
/**
 * object merge
 *
 * @example
 ```
 merge({},{aaa:'bbb',ccc:'ddd'},{bbb:'bbb','aaa':'aaa'})) -> {"aaa": "aaa", "bbb": "bbb", "ccc": "ddd"}
 ```
 * @param {...any[]} value
 * @returns {object}
 */
export declare const merge: (...value: any[]) => any;
/**
 * 두 배열이 동일한지 비교한다.
 *
 * @param a 비교할 첫 번째 배열
 * @param b 비교할 두 번째 배열
 * @param ignoreOrder true이면 요소의 순서를 무시하고 비교한다.
 * @param selector 비교에 사용할 값을 반환하는 선택 함수
 * @returns 두 배열이 동일하면 true, 그렇지 않으면 false
 */
export declare function arrayEquals<T, U = T>(a: T[], b: T[], ignoreOrder?: boolean, selector?: (item: T) => U): boolean;
export declare const intValue: (val: any) => number;
export declare const isEmpty: (value: any) => boolean;
export declare function arrayCopy<T>(array: T[], start?: number, end?: number): T[];
/**
 * 허용 목록 기준으로 정리한 HTML 을 element 내용으로 설정합니다.
 *
 * @param element 대상 element
 * @param html html 문자열(null, undefined 는 빈 문자열로 처리)
 */
export declare function setSafeHtml(element: Element, html: unknown): void;
