import { DataManager } from '@/service/DataManager';
import { ViewItem } from '@/types/Common';
import { FieldSortInfo } from '@/types/Header';
import { FieldItem } from '@t/GridField';

const xssFilter = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // eslint-disable-next-line quotes
  "'": '&#39;',
} as any;

export const replaceXss = (inputText: string): string => {
  let returnText = inputText;
  if (returnText) {
    Object.keys(xssFilter).forEach((key) => {
      returnText = returnText.replaceAll(key, xssFilter[key]);
    });
  }
  return returnText;
};

export const hasOwnProp = (obj: any, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export const unReplace = (inputText: string): string => {
  let returnText = inputText;

  if (returnText) {
    Object.keys(xssFilter).forEach((key) => {
      returnText = returnText.replaceAll(xssFilter[key], key);
    });
  }
  return returnText;
};

export const unFieldName = (fieldName: string): string => {
  if (fieldName) {
    return unReplace(fieldName).replaceAll('"', '\\"');
  }
  return '';
};
export const isBlank = (value: any): boolean => {
  if (value === null) return true;
  if (value === '') return true;
  if (typeof value === 'undefined') return true;
  if (typeof value === 'string' && (value === '' || value.replace(/\s/g, '') === '')) return true;

  return false;
};

export const isVisible = (elm: HTMLElement): boolean => {
  if (!elm.offsetHeight && !elm.offsetWidth) {
    return false;
  }
  if (getComputedStyle(elm).visibility === 'hidden') {
    return false;
  }
  return true;
};

export const isUndefined = (value: any): value is undefined => {
  return value === undefined;
};

/* old
export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
}; 
*/
export const isFunction = <T extends (...args: any[]) => any>(value: unknown): value is T => {
  return typeof value === 'function';
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};
export const isNumber = (value: unknown): value is number => {
  if (isBlank(value)) {
    return false;
  }

  const num = Number(value);
  return !Number.isNaN(num);
};

export const intValue = (val: any): number => {
  return Number.parseInt(val, 10);
};

export const isArray = (value: any): value is Array<any> => {
  return Array.isArray(value);
};

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
export const removeItem = <T>(array: T[], item: T): T[] => {
  const index = array.indexOf(item);

  if (index === -1) {
    return [...array];
  }

  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const copyStringToClipboard = (copyText: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => void 0)
      .catch((err) => {
        //console.log(err);
        fallbackCopyToClipboard(copyText);
      });
  } else {
    fallbackCopyToClipboard(copyText);
  }
};

export function debounce<T extends (...args: any[]) => void>(f: T, delay: number): (...args: Parameters<T>) => void {
  let timer: number | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (delay < 1) {
      f.apply(this, args);
      return;
    }

    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      f.apply(this, args);
    }, delay);
  };
}

function fallbackCopyToClipboard(copyText: string) {
  const copyAreaElement = document.createElement('textarea') as HTMLTextAreaElement;
  copyAreaElement.setAttribute('style', 'top:-9999px;left:-9999px;position:fixed;z-index:9999;');
  document.body.appendChild(copyAreaElement);

  copyAreaElement.value = copyText;
  copyAreaElement.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }

  document.body.removeChild(copyAreaElement);
}

/**
 * hidden type check
 *
 * @param {FieldItem} field field item
 * @returns {boolean} type hidden true , false
 */
export function isHiddenField(field: FieldItem): boolean {
  return field.hidden;
}

/**
 * html 인지 여부 체크
 * @param target html element
 * @returns
 */
export function isHTMLElement(target: any): target is HTMLElement {
  return target instanceof HTMLElement;
}

/**
 * 값있는지 여부 체크.
 *
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value: any): boolean => isUndefined(value) || value == null;

export const getHashCode = (str: string) => {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const tmpChar = str.charCodeAt(i);
    hash = (hash << 5) - hash + tmpChar;
    hash = hash & hash;
  }
  return String(hash).replaceAll(/-/g, '_');
};

/**
 * replace message format
 *
 * @param {string} logicCode logic code
 * @param {*} param replace parameter
 * @returns {*}
 */
export const replaceMesasgeFormat = (pTmplate: string, data: any) => {
  // 1. 조건부 블록 처리
  let template = pTmplate.replace(/{{if\(([^)]+)\)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    const booleanConditionRegex = /^\s*(\w+)\s*$/;
    const comparisonConditionRegex = /^\s*(\w+)\s*(==|!=|>|>=|<|<=)\s*(\d+)\s*$/;

    let result = false;

    if (booleanConditionRegex.test(condition)) {
      const [, key] = condition.match(booleanConditionRegex);
      result = Boolean(data[key]);
    } else if (comparisonConditionRegex.test(condition)) {
      const [, key, operator, numberStr] = condition.match(comparisonConditionRegex);
      const left = data[key];
      const right = Number(numberStr);

      switch (operator) {
        case '==':
          result = left == right;
          break;
        case '!=':
          result = left != right;
          break;
        case '>':
          result = left > right;
          break;
        case '>=':
          result = left >= right;
          break;
        case '<':
          result = left < right;
          break;
        case '<=':
          result = left <= right;
          break;
      }
    }

    return result ? content : '';
  });

  // 2. 변수 치환
  template = template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
  });

  return template;
};

export const templateToElement = (htmlTemplate: string): Element | null => {
  const template = document.createElement('template');
  template.innerHTML = htmlTemplate;
  return template.content.firstElementChild;
};

export function isPlainObject(obj: any) {
  // 객체가 아닌 경우 또는 null인 경우 false 반환
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 프로토타입 체인을 따라 Object 생성자를 찾음
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  // Object 생성자의 prototype과 같으면 Plain Object로 판단
  return Object.getPrototypeOf(obj) === proto;
}

/**
 * camel-> underscore
 *
 * @param {string} str
 * @returns {*}
 */
export function camelToUnderscore(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase(); // 전체를 소문자로
}

/**
 * camel-> Kebab
 *
 * @param {string} str
 * @returns {*}
 */
export function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 다중 키 기준으로 JSON 배열 정렬 (null/undefined 처리 포함)
 * @param {Array<Object>} data - 정렬할 JSON 배열
 * @param {Array<{ name: string, ascOrder?: boolean }>} sortInfos - 정렬 기준 키 배열
 * @returns {Array<Object>} 정렬된 JSON 배열
 */
export function multiSort(
  data: ViewItem[],
  dataManager: DataManager,
  sortInfos: FieldSortInfo[] = [],
  emptyValueLast = false,
): ViewItem[] {
  if (sortInfos.length === 0) {
    data.sort((a, b) => a.sortOrder - b.sortOrder);
    return data;
  }

  const sortInfoLength = sortInfos.length;

  data.forEach((viewItem) => {
    const item = dataManager.getRowItem(viewItem.id);

    viewItem.sortValues = sortInfos.map(({ name, field, isValue }) =>
      isValue ? field.$renderer.getValue({ field, item }) : item[name],
    );
  });

  data.sort((a, b) => {
    const aValues = a.sortValues!;
    const bValues = b.sortValues!;
    for (let i = 0; i < sortInfoLength; i++) {
      const result = compareCachedValue(aValues[i], bValues[i], sortInfos[i].ascOrder ?? true, emptyValueLast);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });

  return data;
}

export function compareCachedValue(valA: any, valB: any, ascOrder: boolean, emptyValueLast = false): number {
  const isNullishA = valA == null;
  const isNullishB = valB == null;

  if (isNullishA !== isNullishB) {
    if (emptyValueLast) {
      return isNullishA ? 1 : -1;
    }

    return ascOrder ? (isNullishA ? 1 : -1) : isNullishA ? -1 : 1;
  }

  if (isNullishA) {
    return 0;
  }

  let result: number;

  if (typeof valA === 'number' && typeof valB === 'number') {
    result = valA - valB;
  } else {
    result = String(valA).localeCompare(String(valB));
  }

  return ascOrder ? result : -result;
}

export function arrayCopy<T>(array: T[], start?: number, end?: number): T[] {
  if (!Array.isArray(array)) return [];

  if (start === undefined && end === undefined) {
    // 시작과 끝이 모두 없는 경우: 전체 복사
    return [...array];
  }

  // slice는 start, end가 undefined인 경우 자동으로 처리함
  return array.slice(start, end);
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * 배열에 값을 삽입하고, 지정된 길이를 초과할 경우 오래된 항목을 제거합니다.
 *
 * @template T 배열 요소 타입
 * @param targetArray 수정할 대상 배열
 * @param values 삽입할 값 또는 값들의 배열
 * @param options 삽입 위치, 인덱스, 최대 길이 등 옵션
 * @returns 수정된 원본 배열 (targetArray)
 */
export function insertToArray<T>(
  targetArray: T[],
  values: T | T[],
  isBefore = false,
  rowIndex?: number,
  limit = Infinity,
): T[] {
  const items: T[] = Array.isArray(values) ? values : [values];

  if (isUndefined(rowIndex)) {
    if (isBefore) {
      targetArray.unshift(...items);
    } else {
      targetArray.push(...items);
    }
  } else {
    const insertIndex = isBefore ? rowIndex - 1 : rowIndex;
    targetArray.splice(insertIndex, 0, ...items);
  }

  // limit 초과 시 오래된 값 제거 (FIFO)
  const overflow = targetArray.length - limit;
  if (limit < Infinity && overflow > 0) {
    targetArray.splice(0, overflow);
  }

  return targetArray;
}

/**
 * deep copy
 * @param copyValue copy object
 * @returns any
 */
export const deepCopy = (copyValue: any): any => {
  if (isArray(copyValue)) {
    const reval = [];
    for (const value of copyValue) {
      if (isPlainObject(value)) {
        reval.push(merge({}, value));
      } else {
        reval.push(value);
      }
    }
    return reval;
  } else {
    return merge({}, copyValue);
  }
};

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
export const merge = (...value: any[]): any => {
  let reval = value[0];

  if (!isPlainObject(reval) || isEmpty(reval)) {
    return reval;
  }

  let i = 1;
  if (Object.keys(reval).length > 0) {
    i = 0;
    reval = isArray(reval) ? [] : {};
  }
  const argLen = value.length;
  for (; i < argLen; i += 1) {
    cloneDeep(reval, value[i]);
  }

  return reval;
};

export const stringSplit = (value: string, delimiter: string): string[] => {
  return (value || '').split(delimiter);
};

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
export const addValueIfMissing = (
  currentValue: string,
  addValue: string | null,
  shouldSort = false,
  delimiter = ',',
  originValues: string[] = [],
) => {
  if (!addValue) return [];

  const value = (currentValue || '') + '';

  // 1. split + trim + filter out empty values
  let items = stringSplit(value, delimiter)
    .map((item) => item.trim())
    .filter((item) => item);

  // 2. originValues 기준으로 필터링
  if (originValues.length > 0) {
    const originSet = new Set(originValues.map((v) => v.trim()));
    items = items.filter((item) => originSet.has(item));
  }

  const uniqueItems = new Set(items);

  // 3. toggle 로직
  if (uniqueItems.has(addValue)) {
    uniqueItems.delete(addValue);
  } else {
    uniqueItems.add(addValue);
  }

  const result = Array.from(uniqueItems);

  if (shouldSort) {
    result.sort();
  }

  return result;
};

export const trim = (s: string): string => {
  return s.replace(/^\s+|\s+$/g, '');
};

function cloneDeep(dst: any, src: any): any {
  if (isArray(src)) {
    return cloneArrayDeep(dst, src);
  }

  if (isDate(src)) {
    return new Date(src.getTime());
  }

  if (src instanceof RegExp) {
    // RegExp 인스턴스는 복제해서 반환
    return new RegExp(src.source, src.flags);
  }

  if (isObject(src)) {
    return cloneObjectDeep(dst, src);
  }

  return src;
}

/*eslint no-param-reassign: "error"*/
function cloneObjectDeep(dst: any, src: any): object {
  if (isFunction(src)) {
    return src;
  }

  for (const key of Object.keys(src)) {
    const val = (src as any)[key];

    if (isUndefined(val)) {
      continue;
    }

    if (val === null) {
      dst[key] = val;
    } else if (isFunction(val)) {
      dst[key] = val;
    } else if (val instanceof RegExp) {
      dst[key] = new RegExp(val.source, val.flags);
    } else if (isEmpty(dst[key])) {
      dst[key] = cloneDeep(isArray(val) ? [] : {}, val);
    } else if (!isObject(val)) {
      dst[key] = val;
    } else {
      if (!isObject(dst[key])) {
        dst[key] = {};
      }

      cloneDeep(dst[key], val);
    }
  }
  return dst;
}

function cloneArrayDeep(dst: any, src: any[]) {
  const isObj = isPlainObject(dst);

  for (let i = 0; i < src.length; i += 1) {
    const val = src[i];
    let newVal;

    if (val == null) {
      newVal = val;
    } else if (val instanceof RegExp) {
      newVal = new RegExp(val.source, val.flags);
    } else {
      newVal = cloneDeep(isArray(val) ? [] : {}, val);
    }

    if (isObj) {
      (dst as any)[i] = newVal;
    } else {
      dst.push(newVal);
    }
  }
  return dst;
}

/**
 * 두 배열이 동일한지 비교한다.
 *
 * @param a 비교할 첫 번째 배열
 * @param b 비교할 두 번째 배열
 * @param ignoreOrder true이면 요소의 순서를 무시하고 비교한다.
 * @param selector 비교에 사용할 값을 반환하는 선택 함수
 * @returns 두 배열이 동일하면 true, 그렇지 않으면 false
 */
export function arrayEquals<T, U = T>(a: T[], b: T[], ignoreOrder = false, selector?: (item: T) => U): boolean {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  const getValue = selector ?? ((item: T) => item as unknown as U);

  if (ignoreOrder) {
    const sortedA = [...a].sort((x, y) => compare(getValue(x), getValue(y)));
    const sortedB = [...b].sort((x, y) => compare(getValue(x), getValue(y)));

    return sortedA.every((item, index) => getValue(item) === getValue(sortedB[index]));
  }

  return a.every((item, index) => getValue(item) === getValue(b[index]));
}

/**
 * 정렬을 위한 기본 비교 함수
 */
function compare<T>(a: T, b: T): number {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}
