import { DataManager } from '../service/DataManager.js';
import { ViewItem } from '../types/Common.js';
import { FieldSortInfo } from '../types/Header.js';
import { FieldItem } from '../types/GridField.js';
export declare const replaceXss: (inputText: string) => string;
export declare const hasOwnProp: (obj: any, key: string) => boolean;
export declare const unReplace: (inputText: string) => string;
export declare const unFieldName: (fieldName: string) => string;
export declare const isBlank: (value: any) => boolean;
export declare const isVisible: (elm: HTMLElement) => boolean;
export declare const isUndefined: (value: any) => value is undefined;
export declare const isFunction: <T extends (...args: any[]) => any>(value: unknown) => value is T;
export declare const isString: (value: any) => value is string;
export declare const isNumber: (value: unknown) => value is number;
export declare const intValue: (val: any) => number;
export declare const isArray: (value: any) => value is Array<any>;
/**
 * 배열에서 지정한 항목을 제거한 새로운 배열을 반환합니다.
 *
 * 원본 배열은 변경되지 않습니다.
 *
 * @template T 배열 요소의 타입
 * @param array 대상 배열
 * @param item 제거할 항목
 * @returns 지정한 항목이 제거된 새로운 배열.
 *          항목이 존재하지 않으면 원본과 동일한 요소를 가진 새로운 배열을 반환합니다.
 */
export declare const removeItem: <T>(array: T[], item: T) => T[];
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
 * 두 값의 타입과 관계없이 동일한 값인지 비교
 *
 * 예:
 * - 1과 '1' → true
 * - true와 'true' → true
 * - null과 undefined → true
 *
 * @param value1 비교할 첫 번째 값
 * @param value2 비교할 두 번째 값
 * @returns 두 값이 동일하면 true, 그렇지 않으면 false
 */
export declare function isSameValue(value1: any, value2: any): boolean;
/**
 * 값있는지 여부 체크.
 *
 * @param {*} value
 * @returns {boolean}
 */
export declare const isEmpty: (value: any) => boolean;
export declare const getHashCode: (str: string) => string | number;
/**
 * replace message format
 *
 * @param {string} logicCode logic code
 * @param {*} param replace parameter
 * @returns {*}
 */
export declare const replaceMesasgeFormat: (pTmplate: string, data: any) => string;
export declare const templateToElement: (htmlTemplate: string) => Element | null;
export declare function isPlainObject(obj: any): boolean;
/**
 * camel-> underscore
 *
 * @param {string} str
 * @returns {*}
 */
export declare function camelToUnderscore(str: string): string;
/**
 * camel-> Kebab
 *
 * @param {string} str
 * @returns {*}
 */
export declare function camelToKebab(str: string): string;
/**
 * 다중 키 기준으로 JSON 배열 정렬 (null/undefined 처리 포함)
 * @param {Array<Object>} data - 정렬할 JSON 배열
 * @param {Array<{ name: string, ascOrder?: boolean }>} sortInfos - 정렬 기준 키 배열
 * @returns {Array<Object>} 정렬된 JSON 배열
 */
export declare function multiSort(data: ViewItem[], dataManager: DataManager, sortInfos?: FieldSortInfo[], emptyValueLast?: boolean): ViewItem[];
export declare function compareCachedValue(valA: any, valB: any, ascOrder: boolean, emptyValueLast?: boolean): number;
export declare function arrayCopy<T>(array: T[], start?: number, end?: number): T[];
export declare function isObject(value: any): boolean;
/**
 * 배열에 값을 삽입하고, 지정된 길이를 초과할 경우 오래된 항목을 제거합니다.
 *
 * @template T 배열 요소 타입
 * @param targetArray 수정할 대상 배열
 * @param values 삽입할 값 또는 값들의 배열
 * @param options 삽입 위치, 인덱스, 최대 길이 등 옵션
 * @returns 수정된 원본 배열 (targetArray)
 */
export declare function insertToArray<T>(targetArray: T[], values: T | T[], isBefore?: boolean, rowIndex?: number, limit?: number): T[];
/**
 * deep copy
 * @param copyValue copy object
 * @returns any
 */
export declare const deepCopy: (copyValue: any) => any;
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
export declare const stringSplit: (value: string, delimiter: string) => string[];
/**
 * 문자열을 delimiter로 분리하여 특정 값을 포함하지 않으면 추가하고,
 * 필요 시 정렬 후 다시 문자열로 반환합니다.
 *
 * @param {string} currentValue - 원본 문자열 (예: "a,b,c")
 * @param {string} addValue - 추가할 값 (중복되면 추가하지 않음)
 * @param {boolean} shouldSort - true일 경우 정렬함 (기본값: false)
 * @param {string} delimiter - 분리 기준 문자 (기본값: ',')
 * @returns {string} 결과 문자열
 */
export declare const addValueIfMissing: (currentValue: string, addValue: string | null, shouldSort?: boolean, delimiter?: string, originValues?: string[]) => string[];
export declare const trim: (s: string) => string;
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
