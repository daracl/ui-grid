import { FieldItem } from "@t/GridField";
import { ADD_ROW_POSITION } from "src/constants";

const xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
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
  return obj.hasOwnProperty(key);
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
  return "";
};
export const isBlank = (value: any): boolean => {
  if (value === null) return true;
  if (value === "") return true;
  if (typeof value === "undefined") return true;
  if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;

  return false;
};

export const isVisible = (elm: HTMLElement): boolean => {
  if (!elm.offsetHeight && !elm.offsetWidth) {
    return false;
  }
  if (getComputedStyle(elm).visibility === "hidden") {
    return false;
  }
  return true;
};

export const isUndefined = (value: any): value is undefined => {
  return typeof value === "undefined";
};

export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};

export const isString = (value: any): value is string => {
  return typeof value === "string";
};
export const isNumber = (value: any): value is number => {
  if (isBlank(value)) {
    return false;
  }
  value = +value;
  return !isNaN(value);
};

export const intValue = (val: any): number => {
  return parseInt(val, 10);
};

export const isArray = (value: any): value is Array<any> => {
  return Array.isArray(value);
};

export const copyStringToClipboard = (copyText: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        fallbackCopyToClipboard(copyText);
      });
  } else {
    fallbackCopyToClipboard(copyText);
  }
};

export function debounce<T extends (...args: any[]) => void>(f: T, delay: number): (...args: Parameters<T>) => void {
  let timer: number | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      f.apply(this, args);
    }, delay);
  };
}

function fallbackCopyToClipboard(copyText: string) {
  const copyAreaElement = document.createElement("textarea") as HTMLTextAreaElement;
  copyAreaElement.setAttribute("style", "top:-9999px;left:-9999px;position:fixed;z-index:9999;");
  document.body.appendChild(copyAreaElement);

  copyAreaElement.value = copyText;
  copyAreaElement.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }

  document.body.removeChild(copyAreaElement);
}

/**
 * hidden type check
 *
 * @export
 * @param {FieldItem} field field item
 * @returns {boolean} type hidden true , false
 */
export function isHiddenField(field: FieldItem): boolean {
  return field.hidden;
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
    let tmpChar = str.charCodeAt(i);
    hash = (hash << 5) - hash + tmpChar;
    hash = hash & hash;
  }
  return String(hash).replaceAll(/-/g, "_");
};

/**
 * replace message format
 *
 * @param {string} logicCode logic code
 * @param {*} param replace parameter
 * @returns {*}
 */
export const replaceMesasgeFormat = (template: string, data: any) => {
  // 1. 조건부 블록 처리
  template = template.replace(/{{if\(([^)]+)\)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
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
        case "==":
          result = left == right;
          break;
        case "!=":
          result = left != right;
          break;
        case ">":
          result = left > right;
          break;
        case ">=":
          result = left >= right;
          break;
        case "<":
          result = left < right;
          break;
        case "<=":
          result = left <= right;
          break;
      }
    }

    return result ? content : "";
  });

  // 2. 변수 치환
  template = template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : "";
  });

  return template;
};

export const templateToElement = (htmlTemplate: string): Element | null => {
  const template = document.createElement("template");
  template.innerHTML = htmlTemplate;
  return template.content.firstElementChild;
};

export function isPlainObject(obj: any) {
  // 객체가 아닌 경우 또는 null인 경우 false 반환
  if (typeof obj !== "object" || obj === null) {
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
 * @export
 * @param {string} str
 * @returns {*}
 */
export function camelToUnderscore(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(); // 전체를 소문자로
}

/**
 * camel-> Kebab
 *
 * @export
 * @param {string} str
 * @returns {*}
 */
export function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * 다중 키 기준으로 JSON 배열 정렬 (null/undefined 처리 포함)
 * @param {Array<Object>} data - 정렬할 JSON 배열
 * @param {Array<{ key: string, ascOrder?: boolean }>} sortKeys - 정렬 기준 키 배열
 * @returns {Array<Object>} 정렬된 JSON 배열
 */
export function multiSort(data: any[], sortKeys = [], emptyValueLast?: boolean) {
  const sortArr = Array.from(sortKeys);

  return data.slice().sort((a, b) => {
    for (let { key, ascOrder = true } of sortArr) {
      const valA = a[key];
      const valB = b[key];

      const isNullishA = valA === null || valA === undefined;
      const isNullishB = valB === null || valB === undefined;

      // null/undefined 우선 정렬 처리
      if (isNullishA && !isNullishB) return ascOrder ? 1 : -1;
      if (!isNullishA && isNullishB) return ascOrder ? -1 : 1;
      if (isNullishA && isNullishB) continue;

      let comparison;
      if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      if (comparison !== 0) {
        return ascOrder ? comparison : -comparison;
      }
    }
    return 0;
  });
}

export function arrayCopy(orginArray: any[]) {
  return isArray(orginArray) ? Array.from(orginArray) : [];
}

function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDate(value: any) {
  return value instanceof Date && !isNaN(value.valueOf());
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
export function insertToArray<T>(targetArray: T[], values: T | T[], isBefore: boolean = false, rowIndex?: number, limit: number = Infinity): T[] {
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
    let reval = [];
    for (let value of copyValue) {
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

export function trim(s: string): string {
  return s.replace(/^\s+|\s+$/g, "");
}

function cloneDeep(dst: any, src: any): any {
  if (isArray(src)) {
    return cloneArrayDeep(dst, src);
  }

  if (isDate(src)) {
    return new src.constructor(src);
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
