import { FieldItem } from "@t/GridField";

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

export const copyStringToClipboard = (prefix: string, copyText: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(copyText)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        fallbackCopyToClipboard(prefix, copyText);
      });
  } else {
    fallbackCopyToClipboard(prefix, copyText);
  }
};

function fallbackCopyToClipboard(prefix: string, copyText: string) {
  try {
    const _id = prefix + "_pubGridCopyArea";
    let copyArea = document.getElementById(_id) as HTMLTextAreaElement;

    if (copyArea != null) {
      copyArea.value = copyText;
      copyArea.select();

      function handler(event: any) {
        document.removeEventListener("copy", handler);
      }
      document.addEventListener("copy", handler);

      document.execCommand("copy");

      copyArea.value = "";
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * hidden type check
 *
 * @export
 * @param {FieldItem} field field item
 * @returns {boolean} type hidden true , false
 */
export function isHiddenField(field: FieldItem): boolean {
  return field.dataType == "hidden";
}

/**
 * 값있는지 여부 체크.
 *
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value: any): boolean => isUndefined(value) || value == null; //_isEmpty(value);

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
export const replaceMesasgeFormat = (logicCode: string, param: any) => {
  return logicCode.replace(/{{(.+?)}}/gi, function (word) {
    const key = word.replace(/[\{\}]/g, "");
    return param[key];
  });
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

function isObject(value: any) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDate(value: any) {
  return value instanceof Date && !isNaN(value.valueOf());
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

function trim(s: string): string {
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
