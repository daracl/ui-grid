function isArray(value) {
  return Array.isArray(value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null || prototype === Object.prototype) return true;
  if (Object.getPrototypeOf(prototype) !== null) return false;
  const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
  return isFunction(constructor) && Object.getOwnPropertyDescriptor(constructor, "prototype")?.value === prototype && Function.prototype.toString.call(constructor) === Function.prototype.toString.call(Object);
}
function copyProperties(source, target, context) {
  for (const key of Reflect.ownKeys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
    Object.defineProperty(target, key, {
      value: copy(source[key], context),
      enumerable: true,
      writable: true,
      configurable: true
    });
  }
}
function copy(source, context) {
  if (!isObject(source) || isFunction(source)) return source;
  if (context.seen.has(source)) return context.seen.get(source);
  let result;
  if (isArray(source)) {
    result = new Array(source.length);
  } else if (source instanceof Date) {
    result = new Date(Date.prototype.getTime.call(source));
  } else if (source instanceof RegExp) {
    result = new RegExp(source.source, source.flags);
    result.lastIndex = source.lastIndex;
  } else if (source instanceof Map) {
    result = /* @__PURE__ */ new Map();
    context.tasks.push(() => Map.prototype.forEach.call(source, (item, key) => result.set(copy(key, context), copy(item, context))));
  } else if (source instanceof Set) {
    result = /* @__PURE__ */ new Set();
    context.tasks.push(() => Set.prototype.forEach.call(source, (item) => result.add(copy(item, context))));
  } else {
    const prototype = Object.getPrototypeOf(source);
    if (!isPlainObject(source)) return source;
    result = Object.create(prototype === null ? null : Object.prototype);
  }
  context.seen.set(source, result);
  context.tasks.push(() => copyProperties(source, result, context));
  return result;
}
const deepCopy = (value, seen = /* @__PURE__ */ new WeakMap()) => {
  const context = { seen, tasks: [] };
  const result = copy(value, context);
  while (context.tasks.length) context.tasks.pop()();
  return result;
};
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
function setOwn(target, key, value) {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}
function mergeSource(target, source, excludeKeys, replaceArrays = false) {
  const copies = /* @__PURE__ */ new WeakMap();
  const tasks = [];
  function copy2(value, current) {
    if (value === null || typeof value !== "object") return value;
    if (copies.has(value)) return copies.get(value);
    let result;
    if (isArray(value)) {
      result = replaceArrays || !isArray(current) ? [] : current;
      tasks.push(() => replaceArrays ? value.forEach((item) => result.push(copy2(item))) : mergeArray(result, value));
    } else if (isPlainObject(value)) {
      result = isPlainObject(current) ? current : Object.create(Object.getPrototypeOf(value));
      tasks.push(() => mergeObject(result, value));
    } else if (value instanceof Date) {
      result = new Date(value.getTime());
    } else if (value instanceof RegExp) {
      result = new RegExp(value.source, value.flags);
      result.lastIndex = value.lastIndex;
    } else if (value instanceof Map) {
      result = /* @__PURE__ */ new Map();
      tasks.push(() => value.forEach((item, key) => result.set(copy2(key), copy2(item))));
    } else if (value instanceof Set) {
      result = /* @__PURE__ */ new Set();
      tasks.push(() => value.forEach((item) => result.add(copy2(item))));
    } else {
      return value;
    }
    copies.set(value, result);
    return result;
  }
  function mergeObject(dst, src) {
    for (const key of Object.keys(src)) {
      if (excludeKeys.has(key) || key === "__proto__" || key === "constructor" || key === "prototype") continue;
      const value = src[key];
      if (value === void 0) continue;
      setOwn(dst, key, copy2(value, hasOwn(dst, key) ? dst[key] : void 0));
    }
  }
  function mergeArray(dst, src) {
    const seen = new Set(dst);
    for (const value of src) {
      const item = copy2(value);
      if (value !== null && typeof value === "object" || Number.isNaN(item) || !seen.has(item)) {
        seen.add(item);
        dst.push(item);
      }
    }
  }
  copies.set(source, target);
  if (isArray(source) && isArray(target)) tasks.push(() => mergeArray(target, source));
  else tasks.push(() => mergeObject(target, source));
  while (tasks.length) tasks.pop()();
}
function objectDeepMerge(...values) {
  if (values.length < 1) {
    return values;
  }
  let excludeKeys = /* @__PURE__ */ new Set();
  let replaceArrays = false;
  let sources = values;
  const last = values[values.length - 1];
  const hasExcludeKeys = isPlainObject(last) && hasOwn(last, "_excludeKeys") && isArray(last._excludeKeys);
  const hasArrayMode = isPlainObject(last) && hasOwn(last, "_arrays") && (last._arrays === "replace" || last._arrays === "merge");
  if (hasExcludeKeys || hasArrayMode) {
    if (hasExcludeKeys) excludeKeys = new Set(last._excludeKeys.map(String));
    replaceArrays = hasArrayMode && last._arrays === "replace";
    sources = values.slice(0, -1);
  }
  let result = {};
  for (let index = 0; index < sources.length; index++) {
    const value = sources[index];
    if (isArray(value) || isPlainObject(value)) {
      mergeSource(result, value, index === 0 ? /* @__PURE__ */ new Set() : excludeKeys, replaceArrays);
    }
  }
  return result;
}
function arrayDeepMerge(...values) {
  if (values.length < 1) {
    return values;
  }
  let source = [];
  let excludeKeys = /* @__PURE__ */ new Set();
  for (let value of values) {
    if (!isArray(value)) continue;
    mergeSource(source, value, excludeKeys);
  }
  return source;
}
function hasProperty(obj, prop) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
}
function isString(value) {
  return typeof value === "string";
}
function isBlank(value) {
  return value === null || value === void 0 || isString(value) && value.trim() === "";
}
function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}
function isNil(value) {
  return value === null || value === void 0;
}
function isEmpty(value) {
  if (isNil(value)) {
    return true;
  }
  if (isString(value)) {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (value instanceof Date) {
    return false;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}
function isNumeric(value, typeIgnore = false) {
  if (typeIgnore === true) return (typeof value === "number" || isString(value) && value.trim() !== "") && !Number.isNaN(Number(value));
  return (typeof value === "number" || isString(value) && value.trim() !== "" && !isNaN(parseFloat(value))) && isFinite(Number(value));
}
function isUndefined(value) {
  return value === void 0;
}
function objectToQueryString(param) {
  return Object.keys(param).map((key) => {
    const val = param[key];
    if (val !== void 0 && val !== null) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(val instanceof Date && !isNaN(val.getTime()) ? val.toISOString() : isObject(val) ? JSON.stringify(val) : String(val))}`;
    }
  }).filter(Boolean).join("&");
}
const ABSOLUTE_URL = /^([a-z][a-z\d+\-.]*:)?\/\//i;
function joinUrl(baseUrl2, url) {
  if (!baseUrl2 || ABSOLUTE_URL.test(url)) return url;
  if (!url) return baseUrl2;
  if (url[0] === "?" || url[0] === "#") return baseUrl2 + url;
  return `${baseUrl2.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
function replaceParameter(template, param) {
  const objectParam = isPlainObject(param);
  return template.replace(/#.*?#/g, (placeholder) => {
    const key = placeholder.slice(1, -1);
    const value = objectParam ? Object.prototype.hasOwnProperty.call(param, key) ? param[key] ?? "" : "" : param;
    return isObject(value) ? JSON.stringify(value) : String(value);
  });
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const MAX_UNBOUNDED_QUANTIFIERS = 3;
const UNBOUNDED_BRACE = /^\{\d+,\d*\}/;
const TEXT_LENGTH_LIMITS = [1e4, 1e4, 1e3, 200];
function maxRegexTextLength(pattern) {
  const { risky, unbounded } = analyzeRegex(pattern);
  return risky ? 0 : TEXT_LENGTH_LIMITS[unbounded];
}
function analyzeRegex(pattern) {
  let unbounded = 0;
  let inClass = false;
  const groups = [];
  const markInner = () => {
    if (groups.length) groups[groups.length - 1].inner = true;
  };
  for (let index = 0; index < pattern.length; index++) {
    const char = pattern[index];
    if (char === "\\") {
      if (/[1-9k]/.test(pattern[index + 1] ?? "")) return { risky: true, unbounded };
      index++;
      continue;
    }
    if (inClass) {
      if (char === "]") inClass = false;
      continue;
    }
    if (char === "[") {
      inClass = true;
      continue;
    }
    if (char === "(") {
      groups.push({ inner: false });
      continue;
    }
    if (char === "|") {
      markInner();
      continue;
    }
    if (char === ")") {
      const group = groups.pop();
      const rest = pattern.slice(index + 1);
      const quantified = rest[0] === "*" || rest[0] === "+" || UNBOUNDED_BRACE.test(rest);
      if (group) {
        if (quantified && group.inner) return { risky: true, unbounded };
        if (quantified || group.inner) markInner();
      }
      continue;
    }
    if (char === "*" || char === "+") {
      unbounded++;
      markInner();
      continue;
    }
    if (char === "{") {
      const match = UNBOUNDED_BRACE.exec(pattern.slice(index));
      if (match) {
        unbounded++;
        markInner();
        index += match[0].length - 1;
      }
    }
  }
  return { risky: unbounded > MAX_UNBOUNDED_QUANTIFIERS, unbounded };
}
const xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const charsToReplace = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&#34;",
  "'": "&#39;"
};
function trim(s) {
  return s.replace(/^\s+|\s+$/g, "");
}
function leftTrim(s) {
  return s.replace(/^\s+/g, "");
}
function rightTrim(s) {
  return s.replace(/\s+$/g, "");
}
function allTrim(s) {
  return s.replace(/\s+/g, "");
}
function matchCount(str, matchString) {
  if (isBlank(str)) return 0;
  let re;
  try {
    re = new RegExp(str.length <= maxRegexTextLength(matchString) ? matchString : escapeRegExp(matchString), "ig");
  } catch {
    re = new RegExp(escapeRegExp(matchString), "ig");
  }
  const resultArray = str.match(re);
  return resultArray == null ? 0 : resultArray.length;
}
function leftPad(str, len, ch = "0") {
  return pad(str, len, ch, "l");
}
function leftPadClamp(str, len, ch = "0") {
  return pad(str, len, ch, "l", true);
}
function rightPad(str, len, ch = "0") {
  return pad(str, len, ch, "r");
}
function rightPadClamp(str, len, ch = "0") {
  return pad(str, len, ch, "r", true);
}
function escapeHTML(html) {
  const fn = (tag) => {
    return charsToReplace[tag] || tag;
  };
  return html.replace(/[&<>"']/g, fn);
}
function xss(inputText) {
  let returnText = inputText;
  if (returnText) {
    Object.keys(xssFilter).forEach((key) => {
      returnText = returnText.replaceAll(key, xssFilter[key]);
    });
  }
  return returnText;
}
function unXss(inputText) {
  let returnText = inputText;
  if (returnText) {
    Object.keys(xssFilter).reverse().forEach((key) => {
      returnText = returnText.replaceAll(xssFilter[key], key);
    });
  }
  return returnText;
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function upperCase(str) {
  return (str || "").toUpperCase();
}
function lowerCase(str) {
  return (str || "").toLowerCase();
}
function pad(orginStr, size, ch, type = "l", clamp2 = false) {
  let str = "";
  if (isEmpty(orginStr) && !(isString(orginStr) && orginStr.length > 0)) {
    str = "";
  } else {
    str = isString(orginStr) ? orginStr : `${orginStr}`;
  }
  const strLength = str.length;
  if (strLength > size) {
    return clamp2 ? str.slice(0, size) : str;
  }
  const len = size - strLength;
  if (len < 1) return str;
  const padStr = ch.repeat(len);
  return type === "l" ? padStr + str : str + padStr;
}
function convertHtmlToText(html) {
  if (!html) return "";
  return html.replaceAll(/<br\s*\/?>/gi, "\n").replaceAll(/<\/(p|div|li|h[1-6])>/gi, "\n").replaceAll(/<[^>]*>/g, "").replaceAll("&nbsp;", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&amp;", "&").replaceAll(/\n{3,}/g, "\n\n").trim();
}
function uuid(dashRemoveFlag = true) {
  const value = createUuid();
  return dashRemoveFlag ? value : value.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}
function createUuid() {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") return cryptoObj.randomUUID().replace(/-/g, "");
  const bytes = new Uint8Array(16);
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index++) bytes[index] = Math.floor(Math.random() * 256);
  }
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function isFormData(data) {
  if (!data) return false;
  return typeof FormData !== "undefined" && data instanceof FormData;
}
function baseUrl() {
  return typeof document !== "undefined" && document.baseURI ? document.baseURI : "http://localhost/";
}
function getURLParams(checkUrl) {
  const url = new URL(checkUrl, baseUrl());
  const params = {};
  for (const [key, value] of url.searchParams) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      params[key].push(value);
    } else {
      Object.defineProperty(params, key, { value: [value], enumerable: true, configurable: true, writable: true });
    }
  }
  return params;
}
function getURLParam(checkUrl, paramKey) {
  const url = new URL(checkUrl, baseUrl());
  return url.searchParams.get(paramKey);
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function isThenable(value) {
  return isObject(value) && isFunction(value.then);
}
function isElement(value) {
  return value !== null && typeof value === "object" && value.nodeType === 1;
}
function isHTMLElement(value) {
  if (!isElement(value)) return false;
  const constructor = value.ownerDocument?.defaultView?.HTMLElement ?? (typeof HTMLElement === "undefined" ? void 0 : HTMLElement);
  return !!constructor && value instanceof constructor;
}
const NUMERIC_TEXT = /^[+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function toNumber(value) {
  if (isNumber(value)) return Number.isFinite(value) ? value : null;
  if (!isString(value)) return null;
  const text = value.trim();
  if (!NUMERIC_TEXT.test(text)) return null;
  const number = Number(text.replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
}
function intValue(value) {
  return Number.parseInt(String(value), 10);
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function formatNumber(value, pattern) {
  const decimals = (pattern.split(".")[1] ?? "").replace(/[^0#]/g, "").length;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: pattern.split(".")[0].includes(",")
  });
}
function toTimestamp(value) {
  if (isDate(value)) return value.getTime();
  if (isNumber(value)) return Number.isFinite(value) ? value : null;
  if (!isString(value) || value.trim() === "") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}
function removeItem(array, item) {
  const index = array.indexOf(item);
  return index < 0 ? [...array] : [...array.slice(0, index), ...array.slice(index + 1)];
}
function arrayCopy(array, start, end) {
  return isArray(array) ? array.slice(start, end) : [];
}
function insertToArray(targetArray, values, isBefore = false, rowIndex, limit = Infinity) {
  const items = isArray(values) ? values : [values];
  if (rowIndex === void 0) {
    if (isBefore) targetArray.unshift(...items);
    else targetArray.push(...items);
  } else {
    const position = Number.isFinite(rowIndex) ? Math.floor(isBefore ? rowIndex - 1 : rowIndex) : targetArray.length;
    targetArray.splice(Math.min(Math.max(position, 0), targetArray.length), 0, ...items);
  }
  if (Number.isFinite(limit) && targetArray.length > Math.max(0, limit)) {
    targetArray.splice(0, targetArray.length - Math.max(0, Math.floor(limit)));
  }
  return targetArray;
}
function moveItem(array, fromIndex, toIndex) {
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) return array;
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  return array;
}
function isSequential(array) {
  if (!array.length) return false;
  const values = /* @__PURE__ */ new Set();
  let min = Infinity;
  let max = -Infinity;
  for (const value of array) {
    if (!Number.isInteger(value) || values.has(value)) return false;
    values.add(value);
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  return max - min + 1 === array.length;
}
function arrayEquals(a, b, ignoreOrder = false, selector) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  const select = selector ?? ((item) => item);
  if (!ignoreOrder) return a.every((item, index) => select(item) === select(b[index]));
  const counts = /* @__PURE__ */ new Map();
  for (const item of a) {
    const value = select(item);
    if (typeof value === "number" && Number.isNaN(value)) return false;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  for (const item of b) {
    const value = select(item);
    const count = counts.get(value);
    if (!count) return false;
    if (count === 1) counts.delete(value);
    else counts.set(value, count - 1);
  }
  return counts.size === 0;
}
function toListValue(value, delimiter = ",") {
  if (isNil(value)) return [];
  if (isArray(value)) return value;
  return String(value).split(delimiter || ",").map((item) => item.trim()).filter(Boolean);
}
function isSameValue(a, b) {
  return isNil(a) && isNil(b) || String(a) === String(b);
}
function getHashCode(value) {
  if (!value.length) return 0;
  let hash = 0;
  for (let index = 0; index < value.length; index++) hash = (hash << 5) - hash + value.charCodeAt(index) | 0;
  return String(hash).replace(/-/g, "_");
}
function camelToUnderscore(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}
function camelToKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function stringSplit(value, delimiter) {
  return (value || "").split(delimiter);
}
function addValueIfMissing(currentValue, addValue, shouldSort = false, delimiter = ",", originValues = []) {
  if (!addValue) return [];
  let items = stringSplit(currentValue, delimiter).map(trim).filter(Boolean);
  if (originValues.length) {
    const allowed = new Set(originValues.map(trim));
    items = items.filter((item) => allowed.has(item));
  }
  const values = new Set(items);
  if (values.has(addValue)) values.delete(addValue);
  else values.add(addValue);
  const result = [...values];
  return shouldSort ? result.sort() : result;
}
function renderTemplate(template, data) {
  const get = (key) => hasProperty(data, key) ? data[key] : void 0;
  const result = template.replace(/{{if\(([^)]+)\)}}([\s\S]*?){{\/if}}/g, (_match, condition, content) => {
    const booleanKey = /^\s*(\w+)\s*$/.exec(condition);
    if (booleanKey) return get(booleanKey[1]) ? content : "";
    const comparison = /^\s*(\w+)\s*(==|!=|>=|<=|>|<)\s*(\d+)\s*$/.exec(condition);
    if (!comparison) return "";
    const left = get(comparison[1]);
    const right = Number(comparison[3]);
    const numeric = Number(left);
    const matched = comparison[2] === "==" ? left == right : comparison[2] === "!=" ? left != right : comparison[2] === ">=" ? numeric >= right : comparison[2] === "<=" ? numeric <= right : comparison[2] === ">" ? numeric > right : numeric < right;
    return matched ? content : "";
  });
  return result.replace(/{{\s*(\w+)\s*}}/g, (_match, key) => String(get(key) ?? ""));
}
function assertScope(scope) {
  if (!/^[a-z][a-z0-9-]*$/i.test(scope)) throw new Error(`Invalid scope: ${scope}`);
  return scope;
}
function toDataAttribute(key, reserved = []) {
  const kebab = camelToKebab(key);
  return /^[a-z][a-z0-9-]*$/.test(kebab) && !reserved.includes(kebab) ? `data-${kebab}` : void 0;
}
function cloneJson(value) {
  return isUndefined(value) ? value : JSON.parse(JSON.stringify(value));
}
function cloneConfig(value) {
  if (isFunction(value)) return value;
  if (isArray(value)) return value.filter((item) => !isUndefined(item)).map((item) => cloneConfig(item));
  if (isPlainObject(value)) {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      if (isUndefined(item)) continue;
      Object.defineProperty(result, key, { value: cloneConfig(item), enumerable: true, configurable: true, writable: true });
    }
    return result;
  }
  return cloneJson(value);
}
function jsonEqual(a, b) {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}
function sameValue(a, b) {
  const seen = /* @__PURE__ */ new WeakMap();
  const compare = (left, right) => {
    if (Object.is(left, right)) return true;
    const arrays = isArray(left) && isArray(right);
    if (!arrays && !(isPlainObject(left) && isPlainObject(right))) return false;
    const l = left, r = right;
    if (seen.get(l)?.has(r)) return true;
    if (!seen.has(l)) seen.set(l, /* @__PURE__ */ new WeakSet());
    seen.get(l).add(r);
    if (arrays) {
      const la = left, ra = right;
      return la.length === ra.length && la.every((item, index) => compare(item, ra[index]));
    }
    const lo = left, ro = right;
    return [.../* @__PURE__ */ new Set([...Object.keys(lo), ...Object.keys(ro)])].every((key) => compare(
      Object.prototype.hasOwnProperty.call(lo, key) ? lo[key] : void 0,
      Object.prototype.hasOwnProperty.call(ro, key) ? ro[key] : void 0
    ));
  };
  return compare(a, b);
}
function parseConfigString(value) {
  if (!isString(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function toOptionObject(value) {
  if (isBoolean(value)) return { enabled: value };
  return isPlainObject(value) ? deepCopy(value) : {};
}
function debounce(callback, delay) {
  let timer;
  const cancel = () => {
    clearTimeout(timer);
    timer = void 0;
  };
  const debounced = function(...args) {
    cancel();
    if (delay < 1) {
      callback.apply(this, args);
      return;
    }
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(this, args);
    }, delay);
  };
  debounced.cancel = cancel;
  return debounced;
}
function compareValues(a, b, ascending = true, nullsLast = false) {
  const nullA = isNil(a);
  const nullB = isNil(b);
  if (nullA !== nullB) return nullsLast ? nullA ? 1 : -1 : ascending ? nullA ? 1 : -1 : nullA ? -1 : 1;
  if (nullA) return 0;
  const result = isNumber(a) && isNumber(b) ? a - b : String(a).localeCompare(String(b));
  return ascending ? result : -result;
}
function sortRows(rows, sorts, nullsLast = false) {
  return [...rows].sort((a, b) => {
    for (const sort of sorts) {
      const result = compareValues(a[sort.field], b[sort.field], sort.direction === "asc", nullsLast);
      if (result !== 0) return result;
    }
    return 0;
  });
}
function createMatcher(keyword, options = {}) {
  const boundary = `[\\s.,;:!?()\\[\\]{}"']`;
  const build = (source) => new RegExp(options.matchWholeWord ? `(?:^|${boundary})(?:${source})(?=$|${boundary})` : source, options.matchCase ? "" : "i");
  const literal = build(escapeRegExp(keyword));
  let regexp = literal;
  let maxTextLength = 0;
  if (options.useRegex && keyword.length <= 200) {
    try {
      regexp = build(keyword);
      maxTextLength = maxRegexTextLength(keyword);
    } catch {
    }
  }
  return (text) => (maxTextLength > 0 && text.length <= maxTextLength ? regexp : literal).test(text);
}
function matchRow(row, fields, matcher) {
  return fields.some((field) => {
    const value = row[field];
    return !isNil(value) && matcher(String(value));
  });
}
function highlightSingleMatch(text, match, highlightTag = "mark") {
  if (!["mark", "span", "b", "strong", "em", "i"].includes(highlightTag)) throw new TypeError("Invalid highlight tag");
  const start = Math.max(0, Math.min(text.length, Math.floor(match.start)));
  const end = Math.max(start, Math.min(text.length, Math.floor(match.end)));
  return `${escapeHTML(text.slice(0, start))}<${highlightTag}>${escapeHTML(text.slice(start, end))}</${highlightTag}>${escapeHTML(text.slice(end))}`;
}
function formatDate(date, pattern) {
  const pad2 = (value) => leftPad(value, 2);
  const tokens = { YYYY: String(date.getFullYear()), MM: pad2(date.getMonth() + 1), DD: pad2(date.getDate()), HH: pad2(date.getHours()), mm: pad2(date.getMinutes()), ss: pad2(date.getSeconds()) };
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => tokens[token]);
}
function formatValue(value, format) {
  if (isNil(value) || value === "") return "";
  if (!format) return String(value);
  const prefix = format.prefix ?? "";
  const suffix = format.suffix ?? "";
  if (format.type === "date") {
    const date = value instanceof Date ? value : new Date(isNumber(value) ? value : String(value));
    return Number.isNaN(date.getTime()) ? String(value) : `${prefix}${formatDate(date, format.format ?? "YYYY-MM-DD")}${suffix}`;
  }
  const number = toNumber(value);
  if (number === null) return String(value);
  const text = format.type === "currency" ? new Intl.NumberFormat(format.locale, { style: "currency", currency: format.format ?? "KRW" }).format(number) : formatNumber(number, format.format ?? "0,0");
  return `${prefix}${text}${suffix}`;
}
function computeSummary(rows, field, expression) {
  if (isFunction(expression)) return expression(rows);
  if (expression === "count") return rows.length;
  let sum = 0, min = Infinity, max = -Infinity, count = 0;
  for (const row of rows) {
    const value = row[field];
    if (!isNumber(value)) continue;
    count++;
    sum += value;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }
  return !count ? null : expression === "min" ? min : expression === "max" ? max : expression === "average" ? sum / count : sum;
}
function calcSummary(items, mode, itemKey) {
  if (!["count", "min", "max", "sum", "avg"].includes(mode)) return `${mode} not valid`;
  return computeSummary(items, itemKey, mode === "avg" ? "average" : mode) ?? "not valid";
}
function escapeCellValue(value) {
  return isString(value) && /["\n\r\t]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
function parseClipboard(text) {
  const rows = [];
  let row = [], cell = "", inQuotes = false, rowEnded = false;
  text = text.replace(/(\r?\n){2}$/, "\n");
  for (let index = 0; index < text.length; index++) {
    const char = text[index], next = text[index + 1];
    rowEnded = false;
    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index++;
      } else inQuotes = !inQuotes;
    } else if (!inQuotes && char === "	") {
      row.push(cell);
      cell = "";
    } else if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      rowEnded = true;
    } else cell += char;
  }
  if (!rowEnded) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
function toTsv(rows, fields) {
  return rows.map((row) => fields.map((field) => {
    const value = row[field];
    return isNil(value) ? "" : String(value).replace(/[\t\n\r]/g, " ");
  }).join("	")).join("\n");
}
function parseTsv(text) {
  return text.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n").map((line) => line.split("	"));
}
function isNode(value) {
  return value !== null && typeof value === "object" && typeof value.nodeType === "number";
}
function $querySelectorList(el) {
  if (isBlank(el)) {
    return [];
  }
  if (isString(el)) {
    return Array.from(document.querySelectorAll(el));
  }
  if (isArray(el)) {
    return el.filter(isNode);
  }
  if (el instanceof Document) {
    return [el];
  }
  if (el instanceof Element) {
    return [el];
  }
  if (el instanceof NodeList) {
    return Array.from(el);
  }
  return [];
}
function $querySelector(el) {
  if (isBlank(el)) {
    return null;
  }
  if (el instanceof Document) {
    return el;
  }
  if (el instanceof Element) {
    return el;
  }
  if (isString(el)) {
    return document.querySelector(el);
  }
  if (isArray(el) || el instanceof NodeList) {
    return $querySelectorList(el).find((node) => node.nodeType === 1 || node.nodeType === 9) ?? null;
  }
  return null;
}
function getElementRect(el, includeScroll = false) {
  if (!el) {
    throw new Error("유효하지 않은 요소입니다.");
  }
  const rect = el.getBoundingClientRect();
  const scrollX = includeScroll ? window.scrollX : 0;
  const scrollY = includeScroll ? window.scrollY : 0;
  return {
    top: rect.top + scrollY,
    left: rect.left + scrollX,
    bottom: rect.bottom + scrollY,
    right: rect.right + scrollX,
    width: rect.width,
    height: rect.height
  };
}
function before(el, renderElements) {
  insertAdjacentHTML($querySelectorList(el), "beforebegin", renderElements);
}
function after(el, renderElements) {
  insertAdjacentHTML($querySelectorList(el), "afterend", renderElements);
}
function prepend(el, renderElements) {
  insertAdjacentHTML($querySelectorList(el), "afterbegin", renderElements);
}
function append(el, renderElements) {
  insertAdjacentHTML($querySelectorList(el), "beforeend", renderElements);
}
function canInsert(el, insertPosition) {
  if (el.nodeType !== 1) return false;
  if (insertPosition === "beforebegin" || insertPosition === "afterend") {
    return !!el.parentNode && el.parentNode.nodeType !== 9;
  }
  return true;
}
function insertAdjacentHTML(elements, insertPosition, renderElements) {
  const targets = elements.filter((el) => canInsert(el, insertPosition));
  if (isString(renderElements)) {
    targets.forEach((el) => {
      el.insertAdjacentHTML(insertPosition, renderElements);
    });
  } else {
    targets.forEach((el, index) => {
      el.insertAdjacentElement(insertPosition, index === 0 ? renderElements : renderElements.cloneNode(true));
    });
  }
}
function findClosest(el, check) {
  if (!el) return null;
  if (typeof check === "string") {
    return el.closest(check);
  }
  let current = el;
  while (current) {
    if (current === check) return current;
    current = current.parentElement;
  }
  return null;
}
const styleClassSplit = (styleClass) => {
  return styleClass.trim().split(/\s+/).filter(Boolean);
};
function addClass(element, styleClass) {
  if (!element) return;
  const elements = $querySelectorList(element);
  const addStyles = styleClassSplit(styleClass);
  elements.forEach((el) => {
    el.classList.add(...addStyles);
  });
}
function removeClass(element, classNames) {
  if (!element || typeof classNames !== "string") return;
  const elements = $querySelectorList(element);
  const styleClasses = styleClassSplit(classNames);
  for (const el of elements) {
    el.classList.remove(...styleClasses);
  }
}
function toggleClass(element, classNames) {
  if (!element || typeof classNames !== "string") return;
  const elements = $querySelectorList(element);
  const styleClasses = styleClassSplit(classNames);
  for (const el of elements) {
    styleClasses.forEach((cls) => {
      el.classList.toggle(cls);
    });
  }
}
function addStyleCss(element, styles) {
  for (const key in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, key)) {
      element.style.setProperty(key, styles[key]);
    }
  }
}
function hasClass(element, className) {
  return styleClassSplit(className).some((name) => element.classList.contains(name));
}
function isVisible(element) {
  return !!(element.offsetHeight || element.offsetWidth) && getComputedStyle(element).visibility !== "hidden";
}
function createHTMLElement(tagName, className, attrs = {}, text) {
  const element = document.createElement(tagName);
  if (className) addClass(element, className);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === void 0) continue;
    if (key === "style" && value !== null && typeof value === "object") {
      const styles = {};
      for (const [name, item] of Object.entries(value)) styles[camelToKebab(name)] = item;
      addStyleCss(element, styles);
    } else if (key === "dataset" && value !== null && typeof value === "object") {
      for (const [name, item] of Object.entries(value)) element.setAttribute(`data-${camelToKebab(name)}`, String(item));
    } else element.setAttribute(key, value !== null && typeof value === "object" ? JSON.stringify(value) : String(value));
  }
  if (text !== void 0) element.textContent = text;
  return element;
}
function templateToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}
function normalizeCssLength(value) {
  return !value ? "" : typeof value === "number" || /^\d+$/.test(value) ? `${value}px` : value;
}
function resolveClassName(value, params) {
  if (!value) return [];
  return styleClassSplit(isFunction(value) ? value(params) : value);
}
function getBrowserSize(usableSize = true) {
  return usableSize ? { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight } : { width: window.innerWidth, height: window.innerHeight };
}
function getScrollPosition() {
  return {
    top: window.pageYOffset ?? (document.documentElement.scrollTop || document.body.scrollTop || 0),
    left: window.pageXOffset ?? (document.documentElement.scrollLeft || document.body.scrollLeft || 0)
  };
}
function outerLayerPosition(layer, position) {
  const scroll = getScrollPosition(), rect = getElementRect(layer), view = getBrowserSize();
  const bottom = scroll.top + view.height, right = scroll.left + view.width;
  return {
    top: Math.max(0, position.y + rect.height + 5 > bottom ? bottom - rect.height - 5 : position.y),
    left: Math.max(0, position.x + rect.width > right ? position.x - rect.width : position.x)
  };
}
function innerLayerPosition(container, target, layer, margin = 2) {
  const parent = getElementRect(container), rect = getElementRect(target);
  const height = Math.min(layer.offsetHeight || getElementRect(layer).height, Math.max(rect.top - margin, window.innerHeight - rect.bottom - margin, 0));
  const top = rect.bottom + height > window.innerHeight ? rect.top - height - margin : rect.bottom;
  return { top: top - parent.top, left: rect.left - parent.left, height, width: rect.width };
}
const isPageRoot = (element) => element === document.body || element === document.documentElement;
function resolveScrollElement(container, option) {
  let found;
  if (isHTMLElement(option)) found = option;
  else if (typeof option === "string" && option) {
    try {
      found = container.closest(option) ?? void 0;
    } catch {
    }
  }
  if (found) return isPageRoot(found) ? void 0 : found;
  for (let element = container; element && !isPageRoot(element); element = element.parentElement) {
    if (["auto", "scroll", "overlay"].includes(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight) return element;
  }
  return void 0;
}
function measureScrollTarget(element) {
  if (!element) return { top: 0, bottom: window.innerHeight };
  const rect = getElementRect(element);
  return { element, top: clamp(rect.top, 0, window.innerHeight), bottom: clamp(rect.bottom, 0, window.innerHeight) };
}
function resolveScrollTarget(container, option) {
  return measureScrollTarget(resolveScrollElement(container, option));
}
function isEsc(event) {
  return event.key === "Escape" || event.key === "Esc";
}
function isPrimaryPointer(event) {
  if (typeof PointerEvent !== "undefined" && event instanceof PointerEvent) return event.isPrimary && event.button === 0;
  if (typeof MouseEvent !== "undefined" && event instanceof MouseEvent) return event.button === 0;
  return typeof TouchEvent !== "undefined" && event instanceof TouchEvent;
}
function isMouseMoved(start, current, threshold = 5) {
  return (current.x - start.x) ** 2 + (current.y - start.y) ** 2 > threshold ** 2;
}
function isSafeUrl(url) {
  const value = url.trim().replace(/[\u0000-\u001F\u007F\s]+/g, "");
  if (!value) return false;
  const match = /^([a-z][a-z0-9+.-]*):/i.exec(value);
  if (!match) return true;
  if (match[1].toLowerCase() === "data") return /^data:image\/(?:png|gif|jpe?g|webp|avif|bmp)(?:;|,)/i.test(value);
  return ["http", "https", "mailto", "tel"].includes(match[1].toLowerCase());
}
function createClassNamer(prefix) {
  return (...names) => names.flatMap(styleClassSplit).map((name) => `${prefix}-${name}`).join(" ");
}
async function writeClipboard(text) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  if (typeof document === "undefined" || !document.body || !document.execCommand) return false;
  const active = document.activeElement;
  const textarea = createHTMLElement("textarea", void 0, { style: { position: "fixed", top: "-9999px", left: "-9999px" } });
  textarea.value = text;
  document.body.appendChild(textarea);
  try {
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
    active?.focus?.();
  }
}
function downloadUrl(url, fileName) {
  const link = createHTMLElement("a", void 0, { href: url, download: fileName, style: { display: "none" } });
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
  }
}
const REVOKE_DELAY_MS = 1e4;
function downloadText(fileName, text, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  try {
    downloadUrl(url, fileName);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  }
}
function svgToDataURL(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function serializeSvg(svg) {
  const clone = svg.cloneNode(true);
  if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}
const getPagingParamToPagingInfo = (pagingParam, rowLength) => {
  const page = pagingParam?.page || 1;
  const totalCount = pagingParam?.totalCount ?? rowLength;
  const pageSize = pagingParam?.pageSize || 10;
  const unitPage = pagingParam?.unitPage || 10;
  return getPagingInfo(totalCount > 0 ? totalCount : rowLength, page, pageSize, unitPage);
};
const getPagingInfo = (totalCount, page, pageSize, unitPage) => {
  pageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.max(1, Math.floor(pageSize)) : 10;
  unitPage = Number.isFinite(unitPage) && unitPage > 0 ? Math.max(1, Math.floor(unitPage)) : 10;
  totalCount = Number.isFinite(totalCount) ? Math.max(0, Math.floor(totalCount)) : 0;
  page = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  if (totalCount < 1) {
    return {
      page: 0,
      pageSize,
      unitPage,
      totalCount: 0,
      totalPages: 0,
      currStartPage: 0,
      currEndPage: 0,
      prePage: 0,
      nextPage: 0,
      prePage_is: false,
      nextPage_is: false
    };
  }
  const totalPages = totalCount % pageSize == 0 ? totalCount / pageSize : Math.floor(totalCount / pageSize) + 1;
  if (totalPages < page) {
    page = totalPages;
  }
  let currStartPage;
  let currEndPage;
  if (totalPages <= unitPage) {
    currEndPage = totalPages;
    currStartPage = 1;
  } else {
    let halfUnitPage = unitPage;
    if (page == unitPage || page > unitPage && totalPages - (page - 1) >= unitPage) {
      halfUnitPage = Math.floor(unitPage / 2);
    }
    if (page <= halfUnitPage) {
      currEndPage = unitPage;
      currStartPage = 1;
    } else if (page + halfUnitPage < totalPages) {
      currEndPage = page + halfUnitPage;
      currStartPage = currEndPage - unitPage + 1;
    } else {
      currEndPage = page + halfUnitPage;
      if (currEndPage > totalPages) {
        currEndPage = totalPages;
      }
      currStartPage = currEndPage - unitPage + 1;
    }
  }
  if (currEndPage > totalPages) currEndPage = totalPages;
  let prePage = 0;
  let prePage_is = false;
  if (currStartPage != 1) {
    prePage_is = true;
    prePage = currStartPage - 1;
  }
  let nextPage = 0;
  let nextPage_is = false;
  if (currEndPage != totalPages) {
    nextPage_is = true;
    nextPage = currEndPage + 1;
  }
  return {
    page,
    unitPage,
    prePage,
    prePage_is,
    nextPage,
    nextPage_is,
    currStartPage,
    currEndPage,
    pageSize,
    totalCount,
    totalPages
  };
};
const DROP_TAGS = /* @__PURE__ */ new Set([
  "script",
  "style",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "link",
  "meta",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "svg",
  "math",
  "template",
  "noscript",
  "title"
]);
const ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "ins",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
]);
const ALLOWED_ATTRS = /* @__PURE__ */ new Set([
  "class",
  "style",
  "title",
  "alt",
  "href",
  "src",
  "target",
  "width",
  "height",
  "colspan",
  "rowspan",
  "align",
  "valign",
  "dir",
  "lang"
]);
const URL_ATTRS = /* @__PURE__ */ new Set(["href", "src"]);
const UNSAFE_STYLE = /url\s*\(|expression\s*\(|javascript:|@import|behavior\s*:|-moz-binding|position\s*:\s*(?:fixed|absolute|sticky)|\\|\/\*/i;
function sanitizeElement(el) {
  Array.from(el.attributes).forEach((attr) => {
    const name = attr.name.toLowerCase();
    const value = attr.value;
    const keep = ALLOWED_ATTRS.has(name) && (!URL_ATTRS.has(name) || isSafeUrl(value)) && (name !== "style" || !UNSAFE_STYLE.test(value)) && (name !== "target" || value === "_blank" || value === "_self");
    if (!keep) el.removeAttribute(attr.name);
  });
  if (el.tagName === "A" && el.getAttribute("target") === "_blank") {
    el.setAttribute("rel", "noopener noreferrer");
  }
}
function sanitizeChildren(parent) {
  Array.from(parent.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }
    const el = node;
    const tag = el.tagName.toLowerCase();
    if (DROP_TAGS.has(tag)) {
      el.remove();
      return;
    }
    sanitizeChildren(el);
    if (ALLOWED_TAGS.has(tag)) {
      sanitizeElement(el);
    } else {
      el.replaceWith(...Array.from(el.childNodes));
    }
  });
}
function sanitizeHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;
  sanitizeChildren(fragment);
  return document.importNode(fragment, true);
}
const copyObject = (value) => isPlainObject(value) ? { ...value } : {};
const isUnsafe = (path) => path.some((key) => ["__proto__", "constructor", "prototype"].includes(key));
function toObjectForm(value, stringKey) {
  if (isBoolean(value)) return { enabled: value };
  if (isString(value)) return stringKey ? { [stringKey]: value } : {};
  return copyObject(value);
}
function setIn(target, path, value, options = {}) {
  if (!path.length || isUnsafe(path)) throw new TypeError("Invalid object path");
  const nodes = [target];
  let node = target;
  for (const key of path.slice(0, -1)) {
    const current = hasProperty(node, key) ? node[key] : void 0;
    const next = (options.toObject ?? copyObject)(current);
    node[key] = next;
    nodes.push(next);
    node = next;
  }
  const last = path[path.length - 1];
  if (value === void 0) delete node[last];
  else node[last] = value;
  if (options.prune) {
    for (let index = nodes.length - 1; index > 0 && !Object.keys(nodes[index]).length; index--) delete nodes[index - 1][path[index - 1]];
  }
}
function getIn(target, path, toObject) {
  if (isUnsafe(path)) return void 0;
  let node = target;
  for (const key of path) {
    if (toObject && !isPlainObject(node)) node = toObject(node);
    if (!isPlainObject(node) || !hasProperty(node, key)) return void 0;
    node = node[key];
  }
  return node;
}
function fieldsOf(rows, limit = 100) {
  const fields = /* @__PURE__ */ new Set();
  for (const row of (rows ?? []).slice(0, Math.max(0, limit))) {
    if (isPlainObject(row)) Object.keys(row).forEach((key) => fields.add(key));
  }
  return [...fields];
}
function fieldDisplayName(field, label) {
  return label && label !== field ? `${label}(${field})` : field;
}
const FUNCTION_REF_PREFIX = "@fn:";
function createErrorFactory(prefix) {
  return (message) => new Error(`${prefix} ${message}`);
}
function parseJson(json, createError = (message) => new Error(message)) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw createError(`invalid JSON : ${error.message}`);
  }
}
function walkConfig(value, visitor, startPath = "") {
  const active = /* @__PURE__ */ new WeakSet();
  const walk = (node, path) => {
    const result = visitor(node, path);
    if (result.handled) return result.value;
    if (!isArray(node) && !isPlainObject(node)) return node;
    if (active.has(node)) throw new TypeError(`Cyclic config: ${path}`);
    active.add(node);
    try {
      if (isArray(node)) return node.map((item, index) => walk(item, `${path}[${index}]`));
      const out = {};
      for (const [key, value2] of Object.entries(node)) {
        const next = walk(value2, path ? `${path}.${key}` : key);
        if (next !== void 0) Object.defineProperty(out, key, { value: next, enumerable: true, configurable: true, writable: true });
      }
      return out;
    } finally {
      active.delete(node);
    }
  };
  return walk(value, startPath);
}
function stringifyWithFunctions(value, functions = {}) {
  const names = new Map(Object.entries(functions).map(([name, fn]) => [fn, name]));
  const omitted = [];
  const converted = walkConfig(value, (node, path) => {
    if (!isFunction(node)) return { handled: false };
    const name = names.get(node);
    if (name !== void 0) return { handled: true, value: `${FUNCTION_REF_PREFIX}${name}` };
    omitted.push(path);
    return { handled: true, value: void 0 };
  });
  return { json: JSON.stringify(converted, null, 2), omitted };
}
function restoreFunctions(value, functions = {}, createError = (message) => new Error(message), path = "") {
  return walkConfig(value, (node, at) => {
    if (!isString(node) || !node.startsWith(FUNCTION_REF_PREFIX)) return { handled: false };
    const name = node.slice(FUNCTION_REF_PREFIX.length);
    if (!hasProperty(functions, name) || !isFunction(functions[name])) throw createError(`${at || "value"} : function "${name}" is not registered`);
    return { handled: true, value: functions[name] };
  }, path);
}
function parseConfigJson(json, functions = {}, createError = (message) => new Error(message)) {
  const config = restoreFunctions(parseJson(json, createError), functions, createError);
  if (!isPlainObject(config)) throw createError("config JSON must be an object");
  return config;
}
function readTextFile(file) {
  return file.text();
}
const NAVIGATING_NAMES = /* @__PURE__ */ new Set(["_self", "_parent", "_top"]);
function serializeValue(value) {
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
function popupPosition(width, height, tr = 2, lr = 2, ieDualCenter = false) {
  const integer = (value) => parseInt(String(value), 10);
  const popupWidth = integer(width);
  const popupHeight = integer(height);
  const topRatio = integer(tr) || 2;
  const leftRatio = integer(lr) || 2;
  const screen = window.screen;
  const isIE = /MSIE|Trident\//.test(window.navigator.userAgent);
  if (isIE && ieDualCenter) {
    const left = window.screenLeft ?? screen.left ?? 0;
    const top2 = window.screenTop ?? screen.top ?? 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
    return { left: (viewportWidth - popupWidth) / 2 + left, top: (viewportHeight - popupHeight) / 2 + top2 };
  }
  const availableWidth = screen.availWidth || window.innerWidth;
  const availableHeight = screen.availHeight || window.innerHeight;
  const top = (availableHeight - popupHeight) / topRatio;
  return {
    top: isIE ? Math.max(0, top) : top + (screen.availTop ?? 0),
    left: (availableWidth - popupWidth) / leftRatio + (isIE ? 0 : screen.availLeft ?? 0)
  };
}
function popupFeatures(options) {
  const features = /* @__PURE__ */ new Map();
  for (const item of (options.viewOption ?? "").split(",")) {
    const [key, ...value] = item.trim().split("=");
    if (key) features.set(key.toLowerCase(), value.join("=").trim() || "yes");
  }
  const numeric = (key, fallback) => {
    const value = features.get(key);
    if (value === void 0 || !/^-?\d+(?:\.\d+)?(?:px)?$/i.test(value)) return fallback;
    return parseFloat(value);
  };
  const position = typeof options.position === "string" ? { align: options.position } : options.position ?? {};
  const screen = window.screen;
  const originLeft = screen.availLeft !== void 0 && Number.isFinite(screen.availLeft) ? screen.availLeft : 0;
  const originTop = screen.availTop !== void 0 && Number.isFinite(screen.availTop) ? screen.availTop : 0;
  const availableWidth = screen.availWidth || window.innerWidth;
  const availableHeight = screen.availHeight || window.innerHeight;
  const width = Math.max(1, numeric("width", 1050));
  const height = Math.max(1, numeric("height", availableHeight - 80));
  const align = position.align ?? (features.has("height") ? "center" : "top");
  let { left, top } = popupPosition(width, height, position.top, position.left, position.ieDualCenter);
  if (align === "top") top = originTop;
  if (align === "bottom") top = originTop + availableHeight - height;
  if (align === "left") left = originLeft;
  if (align === "right") left = originLeft + availableWidth - width;
  features.set("width", String(Math.round(width)));
  features.set("height", String(Math.round(height)));
  features.set("top", String(Math.round(numeric("top", top + (position.topMargin ?? (align === "top" ? 10 : 0))))));
  features.set("left", String(Math.round(numeric("left", left + (position.leftMargin ?? 0)))));
  if (!features.has("scrollbars")) features.set("scrollbars", "yes");
  if (!features.has("resizable")) features.set("resizable", "yes");
  return Array.from(features, ([key, value]) => `${key}=${value}`).join(",");
}
function popup(url, options = {}) {
  const method = (options.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "POST") throw new TypeError("popup method must be GET or POST");
  const destination = new URL(url, document.baseURI);
  if (destination.protocol !== "http:" && destination.protocol !== "https:") throw new TypeError("popup URL must use HTTP or HTTPS");
  if (options.name && NAVIGATING_NAMES.has(options.name.trim().toLowerCase())) throw new TypeError("popup name must not be _self, _parent or _top");
  const entries = Object.entries(options.param ?? {}).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => [key, serializeValue(value)]);
  const name = options.name ? encodeURIComponent(options.name) : "daracl_" + uuid();
  if (method === "GET") {
    for (const [key, value] of entries) destination.searchParams.set(key, value);
  }
  const opened = window.open(method === "GET" ? destination.href : "about:blank", name, popupFeatures(options));
  if (!opened) return null;
  if (options.noopener ?? destination.origin !== window.location.origin) {
    try {
      opened.opener = null;
    } catch {
    }
  }
  if (method === "POST") {
    const form = document.createElement("form");
    form.method = "post";
    form.action = destination.href;
    form.target = name;
    form.acceptCharset = "UTF-8";
    form.hidden = true;
    for (const [key, value] of entries) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    try {
      (document.body ?? document.documentElement).appendChild(form);
      HTMLFormElement.prototype.submit.call(form);
    } finally {
      form.remove();
    }
  }
  try {
    opened.focus();
  } catch {
  }
  return opened;
}
const THEMES = ["auto", "light", "dark"];
function isSafeImageUrl(url) {
  const value = url.trim().replace(/[\u0000-\u001F\u007F\s]+/g, "");
  if (!value) return false;
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(value);
  if (!scheme) return true;
  const name = scheme[1].toLowerCase();
  return name === "http" || name === "https" || name === "blob" || name === "data" && /^data:image\//i.test(value);
}
const instanceMap = {};
const loadingGroups = /* @__PURE__ */ new WeakMap();
let G_LOADING_IDX = 0;
let defaultOptions = {
  //  사라지는 시간
  timeout: -1,
  // 시간 표시 여부
  enableTime: false,
  enableRequestCount: false,
  requestCount: 0,
  // 표시 내용
  content: "",
  // background color
  bgColor: "var(--daracl-loading-backdrop, #ffffff)",
  theme: "auto",
  // z-index
  zIndex: 9999,
  // opacity
  opacity: "0.3",
  // 이미지 경로 및 base64 코드
  loadingImg: "",
  // css cursor
  cursor: "wait",
  // 취소 버튼 활성화 여부
  enableCancelButton: false,
  // 취소 벼튼 활성화시  callback 메소드
  callback: (param) => {
    return true;
  }
};
class Loading {
  constructor(selector, options = {}) {
    this.orginStylePosition = "";
    this.startedAt = 0;
    if (isBlank(selector)) {
      selector = "body";
    }
    if (selector instanceof HTMLElement) {
      this.containerNode = selector;
      this.selector = "";
    } else {
      selector = selector || "body";
      try {
        this.containerNode = document.querySelector(selector);
      } catch {
        this.containerNode = null;
      }
      this.selector = selector;
    }
    if (!this.containerNode) return;
    this.options = objectDeepMerge(defaultOptions, options);
    if (this.selector) instanceMap[this.selector] = this;
    this.show();
  }
  static create(selector, options) {
    return new Loading(selector, options);
  }
  static instance(selector) {
    return instanceMap[selector];
  }
  static setOptions(options) {
    defaultOptions = Object.assign({}, defaultOptions, options);
  }
  cancelHandler() {
    let failed = false;
    let failure;
    for (const member of Array.from(this.group?.members ?? [this])) {
      try {
        if (member.options.callback?.(member.options) !== false) member.hide();
      } catch (error) {
        member.hide();
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    if (failed) throw failure;
  }
  startTimeout() {
    this.startedAt = Date.now();
    if (this.options.timeout > 0) this.timeoutId = window.setTimeout(() => this.hide(), this.options.timeout);
  }
  updateSharedOptions() {
    const group = this.group;
    const renderer = group?.renderer;
    const element = renderer?.loadingElement;
    if (!group || !renderer || !element) return;
    const members = Array.from(group.members);
    const image = element.querySelector(".daracl-cl-image");
    const enableTime = members.some((member) => member.options.enableTime);
    let time = element.querySelector(".daracl-cl-time");
    if (enableTime && !time) {
      time = document.createElement("div");
      time.className = "daracl-cl-time";
      time.setAttribute("aria-label", "경과 시간(초)");
      image?.insertAdjacentElement("beforebegin", time);
    }
    if (enableTime && time) {
      const counter = time;
      const update = () => {
        const start = Math.min(...members.filter((member) => member.options.enableTime).map((member) => member.startedAt));
        counter.textContent = String(Math.floor((Date.now() - start) / 1e3));
      };
      window.clearInterval(renderer.intervalId);
      update();
      renderer.intervalId = window.setInterval(update, 1e3);
    } else {
      time?.remove();
      window.clearInterval(renderer.intervalId);
      renderer.intervalId = void 0;
    }
    const button = element.querySelector(".daracl-cl-btn");
    if (members.some((member) => member.options.enableCancelButton)) {
      if (!button) {
        const wrapper = document.createElement("div");
        wrapper.className = "daracl-cl-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "daracl-cl-btn";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", () => renderer.cancelHandler());
        wrapper.appendChild(cancel);
        image?.parentElement?.appendChild(wrapper);
      }
    } else button?.parentElement?.remove();
    const content = members.filter((member) => member.options.content).pop()?.options.content ?? "";
    if (content) renderer.renderContent(content);
    else element.querySelector(".daracl-cl-content")?.remove();
  }
  /**
   * 이 인스턴스의 요청 수를 갱신하고 공유 화면에 합계를 표시합니다.
   * @param count 진행 중인 요청 수
   * @returns 없음
   */
  setRequestCount(count) {
    if (!this.options) return;
    this.options.requestCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
    this.updateRequestCount();
  }
  updateRequestCount() {
    const group = this.group;
    const element = group?.renderer.loadingElement;
    if (!group || !element) return;
    let count = 0;
    let enabled = false;
    for (const member of group.members) {
      enabled = enabled || member.options.enableRequestCount;
      count += Number.isFinite(member.options.requestCount) ? Math.max(0, Math.floor(member.options.requestCount)) : 0;
    }
    let counter = element.querySelector(".daracl-cl-request-count");
    if (!enabled) {
      counter?.remove();
      return;
    }
    if (!counter) {
      counter = document.createElement("div");
      counter.className = "daracl-cl-request-count";
      counter.setAttribute("role", "status");
      element.querySelector(".daracl-cl-image")?.insertAdjacentElement("afterend", counter);
    }
    counter.textContent = `진행 중 요청: ${count}`;
  }
  /**
   * show loading module
   * @public
   */
  show() {
    const containerNode = this.containerNode;
    if (!containerNode) return;
    const existingGroup = loadingGroups.get(containerNode);
    if (existingGroup) {
      if (existingGroup.members.has(this)) return;
      this.group = existingGroup;
      existingGroup.members.add(this);
      if (this.selector) instanceMap[this.selector] = this;
      this.startTimeout();
      this.updateRequestCount();
      this.updateSharedOptions();
      return;
    }
    if (containerNode.querySelector(":scope >.daracl-cl")) return;
    this.orginStylePosition = containerNode.style.position;
    const computedStyle = getComputedStyle(containerNode);
    if (!["absolute", "relative", "fixed", "sticky"].includes(computedStyle.position)) {
      containerNode.style.position = "relative";
    }
    const opts = this.options;
    let zIndex = opts.zIndex;
    if (defaultOptions.zIndex == opts.zIndex) {
      zIndex += ++G_LOADING_IDX;
    }
    const root = document.createElement("div");
    root.className = "daracl-cl";
    root.setAttribute("data-loading-theme", THEMES.includes(opts.theme) ? opts.theme : "auto");
    root.setAttribute("aria-label", "로딩 중");
    root.style.setProperty("cursor", String(opts.cursor));
    root.style.setProperty("z-index", String(zIndex));
    const backdrop = document.createElement("div");
    backdrop.className = "daracl-cl-backdrop";
    backdrop.style.setProperty("background", String(opts.bgColor));
    backdrop.style.setProperty("opacity", String(opts.opacity));
    const panel = document.createElement("div");
    panel.className = "daracl-cl-panel";
    if (opts.loadingImg && isSafeImageUrl(opts.loadingImg)) {
      const image = document.createElement("img");
      image.className = "daracl-cl-image";
      image.setAttribute("src", opts.loadingImg);
      image.setAttribute("alt", "로딩 중");
      panel.appendChild(image);
    } else {
      const spinner = document.createElement("span");
      spinner.className = "daracl-cl-image daracl-cl-spinner";
      spinner.setAttribute("role", "img");
      spinner.setAttribute("aria-label", "로딩 중");
      panel.appendChild(spinner);
    }
    root.append(backdrop, panel);
    containerNode.insertAdjacentElement("afterbegin", root);
    this.loadingElement = root;
    this.group = { renderer: this, members: /* @__PURE__ */ new Set([this]) };
    loadingGroups.set(containerNode, this.group);
    if (this.selector) instanceMap[this.selector] = this;
    this.startTimeout();
    this.updateRequestCount();
    this.updateSharedOptions();
  }
  /**
   * set display content
   *
   * @public
   * @param {string} content 
   */
  setContent(content) {
    if (!this.containerNode) return;
    this.options.content = content;
    this.renderContent(content);
  }
  renderContent(content) {
    const loadingElement = this.group?.renderer.loadingElement ?? this.loadingElement;
    if (!loadingElement) return;
    let existing = loadingElement.querySelector(".daracl-cl-content");
    if (!existing) {
      existing = document.createElement("div");
      existing.className = "daracl-cl-content";
      const image = loadingElement.querySelector(".daracl-cl-image");
      if (!image) return;
      image.insertAdjacentElement("afterend", existing);
    }
    existing.replaceChildren(sanitizeHtml(content));
  }
  /**
   * hide loading module
   *
   * @public
   * @param {?boolean} [flag] 
   */
  hide(flag) {
    const group = this.group;
    if (!group || !group.members.delete(this)) return;
    window.clearTimeout(this.timeoutId);
    this.timeoutId = void 0;
    if (flag !== false && instanceMap[this.selector] === this) {
      delete instanceMap[this.selector];
      const replacement = Array.from(group?.members ?? []).find((member) => member.selector === this.selector);
      if (replacement) instanceMap[this.selector] = replacement;
    }
    if (group?.members.size) {
      this.updateRequestCount();
      this.updateSharedOptions();
      if (this !== group.renderer) this.group = void 0;
      return;
    }
    const renderer = group?.renderer ?? this;
    window.clearInterval(renderer.intervalId);
    window.clearTimeout(renderer.timeoutId);
    renderer.intervalId = void 0;
    renderer.timeoutId = void 0;
    if (renderer.containerNode && renderer.loadingElement) {
      renderer.containerNode.style.position = renderer.orginStylePosition || "";
      renderer.loadingElement.remove();
      renderer.loadingElement = null;
    }
    if (renderer.containerNode) loadingGroups.delete(renderer.containerNode);
    this.group = void 0;
    renderer.group = void 0;
  }
  /**
   * destroy loading instance
   *
   * @public
   * @static
   * @param {string} selector 
   */
  static destroy(selector) {
    if (instanceMap[selector]) {
      const instance = instanceMap[selector];
      for (const member of Array.from(instance.group?.members ?? [instance])) member.hide();
      delete instanceMap[selector];
    }
  }
}
function defaultMessage(type, status, error) {
  switch (type) {
    case "http":
      return `Request failed with status code ${status}`;
    case "timeout":
      return "timeout exceeded";
    case "abort":
      return "Request aborted";
    case "method":
      return "Invalid HTTP method";
    case "parse":
      return "Failed to parse response body";
    case "callback":
      return error?.message || "Request callback failed";
    default:
      return error?.message || "Network Error";
  }
}
class AjaxError extends Error {
  constructor(init) {
    super(init.message ?? defaultMessage(init.type, init.status, init.error));
    Object.setPrototypeOf(this, AjaxError.prototype);
    this.name = "AjaxError";
    this.type = init.type;
    this.status = init.status ?? 0;
    this.statusText = init.statusText ?? "";
    this.responseText = init.responseText ?? "";
    this.error = init.error ?? null;
    this.xhr = init.xhr;
    this.loadingInstance = init.loadingInstance;
    this.response = init.response;
  }
}
class AjaxAbstract {
  constructor(options) {
    this.options = options;
  }
  // 객체 내부에 File/Blob/FileList가 있는지 재귀 검사
  containsFile(data, seen = /* @__PURE__ */ new WeakSet()) {
    if (!data) return false;
    if (typeof File !== "undefined" && (data instanceof File || data instanceof Blob)) return true;
    if (typeof FileList !== "undefined" && data instanceof FileList) return true;
    if (this.isRawBody(data)) return false;
    if (typeof data === "object") {
      if (seen.has(data)) return false;
      seen.add(data);
    }
    if (isArray(data)) {
      for (const item of data) {
        if (this.containsFile(item, seen)) return true;
      }
      return false;
    }
    if (isObject(data)) {
      for (const key of Object.keys(data)) {
        if (this.containsFile(data[key], seen)) return true;
      }
    }
    return false;
  }
  // JSON으로 직렬화하면 안 되는 본문(URLSearchParams, ArrayBuffer, typed array)인지 검사
  isRawBody(data) {
    return typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams || typeof ArrayBuffer !== "undefined" && (data instanceof ArrayBuffer || ArrayBuffer.isView(data));
  }
  // 훅(beforeRequest) 이후의 opts 로 최종 URL 과 전송 데이터를 만든다. Fetch/XHR 공통이다.
  buildRequestData(url, method, opts) {
    this.assertNoFileInGet(method, opts.data);
    this.assertRawBody(method, opts);
    const hasFormData = isFormData(opts.data);
    const containsFile = !hasFormData && !opts.rawBody && this.containsFile(opts.data);
    const preparedData = containsFile ? this.buildFormDataFromObject(opts.data) : opts.data;
    return { finalUrl: this.getRequestUrl(url, method, preparedData, opts.params, opts.paramsSerializer), preparedData, isForm: hasFormData || containsFile };
  }
  // rawBody 는 그대로 보낼 수 있는 본문(File/Blob, ArrayBuffer·typed array, 문자열, URLSearchParams, FormData)만 허용한다.
  assertRawBody(method, opts) {
    const data = opts.data;
    if (!opts.rawBody || data == null || this.isBodylessMethod(method)) return;
    const allowed = typeof data === "string" || isFormData(data) || this.isRawBody(data) || typeof Blob !== "undefined" && data instanceof Blob;
    if (!allowed) throw new TypeError("rawBody 는 File/Blob, ArrayBuffer, typed array, 문자열, URLSearchParams, FormData 만 보낼 수 있습니다. 일반 객체는 rawBody 를 끄세요.");
  }
  /** 업로드 진행률 표시 대상인지 판단한다: 파일이 든 본문 또는 rawBody 본문. */
  isUploadProgressTarget(opts, method) {
    return this.hasFileData(opts.data) || !!opts.rawBody && opts.data != null && !this.isBodylessMethod(method);
  }
  // beforeRequest 에서 opts.url 을 바꿨으면 baseUrl 을 적용해 새 URL 을 쓰고, 그대로면 기존 URL 을 쓴다.
  resolveUrl(url, originalUrl, opts) {
    return opts.url !== originalUrl ? joinUrl(this.options.baseUrl, opts.url || "") : url;
  }
  getRequestUrl(url, method, data, params, serializer) {
    const withData = this.getUrlWithData(url, method, data);
    if (!params) return withData;
    return this.appendQuery(withData, serializer ? serializer(params) : objectToQueryString(params));
  }
  // 오류 객체를 생성합니다. Fetch/XHR 공통이며 AjaxError 로 던져 Error 로 처리할 수 있게 합니다.
  createError(params) {
    const { type, opts, xhr, error, loadingInstance } = params;
    const status = params.status ?? xhr?.status ?? 0;
    const statusText = params.statusText ?? xhr?.statusText ?? "";
    const responseText = params.responseText ?? this.readResponseText(xhr);
    let response;
    if (type === "http" || type === "parse") {
      let data = responseText;
      if (opts.responseType === "json") {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = void 0;
        }
      }
      response = { status, statusText, data, headers: params.headers ?? {} };
    }
    const message = type === "timeout" && opts.timeout && opts.timeout > 0 ? `timeout of ${opts.timeout}ms exceeded` : void 0;
    return new AjaxError({ type, message, status, statusText, responseText, error, xhr, loadingInstance, response });
  }
  // blob/arraybuffer 로 받는 XHR 은 responseText 접근이 예외를 던지므로 빈 문자열로 대체한다.
  readResponseText(xhr) {
    try {
      return xhr?.responseText ?? "";
    } catch {
      return "";
    }
  }
  // GET/HEAD 는 본문을 보낼 수 없다. data 는 쿼리로 붙이고 기본 Content-Type 도 붙이지 않는다.
  isBodylessMethod(method) {
    return method === "GET" || method === "HEAD";
  }
  // blob/arraybuffer 응답을 문자열로 디코드한다. 오류 응답 본문(JSON 메시지 등)을 읽는 데 사용하며, 읽을 수 없으면 빈 문자열이다.
  async binaryToText(value) {
    try {
      if (typeof Blob !== "undefined" && value instanceof Blob) {
        if (typeof value.text === "function") return await value.text();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.onerror = () => reject(reader.error);
          reader.readAsText(value);
        });
      }
      if (typeof TextDecoder !== "undefined" && Object.prototype.toString.call(value) === "[object ArrayBuffer]") return new TextDecoder().decode(value);
    } catch {
    }
    return "";
  }
  isBinaryType(responseType) {
    return responseType === "blob" || responseType === "arraybuffer";
  }
  isSuccess(status, opts) {
    return opts.validateStatus ? opts.validateStatus(status) : status >= 200 && status < 300;
  }
  // GET용: URL에 데이터를 쿼리 스트링으로 추가합니다.
  getUrlWithData(url, method, data) {
    if (!this.isBodylessMethod(method)) return url;
    if (!data) return url;
    let qs;
    if (isFormData(data)) qs = this.formDataToQuery(data);
    else if (typeof data === "string") qs = data.replace(/^\?/, "");
    else if (typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams) qs = data.toString();
    else qs = objectToQueryString(data);
    return this.appendQuery(url, qs);
  }
  // GET 은 본문을 보내지 않으므로 파일이 든 data 는 조용히 버려지는 대신 오류로 알린다.
  assertNoFileInGet(method, data) {
    if (!this.isBodylessMethod(method)) return;
    if (this.hasFileData(data)) {
      throw new TypeError("GET/HEAD 요청은 파일을 전송할 수 없습니다. POST/PUT 을 사용하세요.");
    }
  }
  /** 본문에 파일(File/Blob/FileList 또는 파일이 든 FormData)이 있는지 검사한다. */
  hasFileData(data) {
    return isFormData(data) ? this.formDataHasFile(data) : this.containsFile(data);
  }
  /** showProgress 로 로더에 진행률을 표시할 요청인지 판단한다: 파일 업로드(rawBody 포함) 또는 blob/arraybuffer 다운로드. */
  needsLoaderProgress(opts, method) {
    return !!opts.showProgress && !!opts.loaderContainer && (this.isBinaryType(opts.responseType) || this.isUploadProgressTarget(opts, method));
  }
  formDataHasFile(data) {
    let found = false;
    data.forEach((value) => {
      if (typeof value !== "string") found = true;
    });
    return found;
  }
  // GET 은 FormData 본문을 보낼 수 없으므로 문자열 항목을 쿼리로 펼친다. 파일 항목은 assertNoFileInGet 에서 이미 거절된다.
  formDataToQuery(data) {
    const search = new URLSearchParams();
    data.forEach((value, key) => search.append(key, value));
    return search.toString();
  }
  // 성공 응답 본문을 JSON 으로 파싱한다. 빈 본문(204 등)은 null, 파싱 실패는 type "parse" AjaxError 로 던진다.
  parseJsonBody(text, ctx) {
    if (!text || !text.trim()) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      throw this.createError({ type: "parse", responseText: text, error: e, ...ctx });
    }
  }
  // 값이 없는(undefined/null/빈 문자열) 헤더를 제외한다. 0, false 는 유효한 값으로 보낸다.
  // 헤더 이름은 대소문자를 구분하지 않으므로 철자만 다른 키는 나중 값 하나만 남기고(요청 값이 전역 값을 대체),
  // 나중 값이 비어 있으면 앞의 값도 제거한다. Fetch/XHR 이 같은 헤더를 보내도록 공통으로 사용한다.
  cleanHeaders(headers) {
    const result = {};
    if (!headers) return result;
    const keyByLower = /* @__PURE__ */ new Map();
    for (const key of Object.keys(headers)) {
      const lower = key.toLowerCase();
      const previous = keyByLower.get(lower);
      if (previous !== void 0) {
        delete result[previous];
        keyByLower.delete(lower);
      }
      const value = headers[key];
      if (value !== void 0 && value !== null && value !== "") {
        result[key] = String(value);
        keyByLower.set(lower, key);
      }
    }
    return result;
  }
  // URL 의 해시(#) 앞에 쿼리 스트링을 붙입니다.
  appendQuery(url, qs) {
    qs = qs.replace(/^[?&]+/, "");
    if (!qs) return url;
    const hashIndex = url.indexOf("#");
    const base = hashIndex < 0 ? url : url.slice(0, hashIndex);
    const hash = hashIndex < 0 ? "" : url.slice(hashIndex);
    return base + (base.includes("?") ? "&" : "?") + qs + hash;
  }
  isFileLike(value) {
    return typeof File !== "undefined" && (value instanceof File || value instanceof Blob) || typeof FileList !== "undefined" && value instanceof FileList;
  }
  // 단순 객체(파일 포함 가능)를 FormData로 변환
  buildFormDataFromObject(obj) {
    const form = new FormData();
    const appendValue = (key, value) => {
      if (value === null || value === void 0) {
        return;
      }
      if (value instanceof Date) {
        form.append(key, isNaN(value.getTime()) ? String(value) : value.toISOString());
        return;
      }
      if (isArray(value) ? value.some((v) => v !== null && typeof v === "object" && !this.isFileLike(v) && this.containsFile(v)) : isObject(value) && !this.isFileLike(value) && this.containsFile(value)) {
        for (const k of Object.keys(value)) appendValue(`${key}[${k}]`, value[k]);
        return;
      }
      if (typeof File !== "undefined" && (value instanceof File || value instanceof Blob)) {
        form.append(key, value);
        return;
      }
      if (typeof FileList !== "undefined" && value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          form.append(key + (key.endsWith("[]") ? "" : "[]"), value[i]);
        }
        return;
      }
      if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof File !== "undefined" && (v instanceof File || v instanceof Blob)) {
            form.append(key + (key.endsWith("[]") ? "" : "[]"), v);
          } else {
            form.append(key + (key.endsWith("[]") ? "" : "[]"), v instanceof Date && !isNaN(v.getTime()) ? v.toISOString() : typeof v === "object" ? JSON.stringify(v) : String(v));
          }
        }
        return;
      }
      if (isObject(value)) {
        form.append(key, JSON.stringify(value));
        return;
      }
      form.append(key, String(value));
    };
    if (isObject(obj) && !this.isFileLike(obj)) {
      for (const k of Object.keys(obj)) {
        appendValue(k, obj[k]);
      }
    } else {
      appendValue("file", obj);
    }
    return form;
  }
}
class FetchAjax extends AjaxAbstract {
  constructor(options) {
    super(options);
  }
  // Fetch 요청을 처리합니다.
  // beforeRequest 훅을 먼저 실행하고, 훅이 바꾼 opts(url, params, data, headers, timeout 등)로 요청을 만든다.
  async request(url, method, opts) {
    this.assertNoFileInGet(method, opts.data);
    this.assertRawBody(method, opts);
    if (opts.signal?.aborted) {
      return Promise.reject(this.createError({ type: "abort", opts, error: Object.assign(new Error("Request aborted"), { name: "AbortError" }) }));
    }
    const originalUrl = opts.url;
    const { loadingInstance, abortController } = this.prepareRequest(opts);
    let timeoutId;
    let isTimeout = false;
    const onAbort = () => abortController?.abort();
    opts.signal?.addEventListener("abort", onAbort, { once: true });
    if (opts.signal?.aborted) onAbort();
    try {
      const { finalUrl, preparedData, isForm } = this.buildRequestData(this.resolveUrl(url, originalUrl, opts), method, opts);
      const fetchHeaders = this.cleanHeaders(opts.headers);
      const hasContentType = () => Object.keys(fetchHeaders).some((k) => k.toLowerCase() === "content-type");
      let body = void 0;
      if (!this.isBodylessMethod(method)) {
        if (isForm) {
          body = preparedData;
          Object.keys(fetchHeaders).forEach((k) => {
            if (k.toLowerCase() === "content-type") delete fetchHeaders[k];
          });
        } else if (opts.rawBody) {
          body = preparedData ?? void 0;
        } else if (isObject(preparedData) && !this.isRawBody(preparedData)) {
          const contentTypeKey = Object.keys(fetchHeaders).find((k) => k.toLowerCase() === "content-type");
          const contentType = contentTypeKey ? fetchHeaders[contentTypeKey].toLowerCase() : "";
          if (contentType.includes("application/x-www-form-urlencoded")) {
            body = objectToQueryString(preparedData);
          } else {
            if (!contentTypeKey) {
              fetchHeaders["Content-Type"] = "application/json";
            }
            body = JSON.stringify(preparedData);
          }
        } else if (preparedData != null) {
          body = preparedData;
          if (typeof preparedData === "string" && !hasContentType()) {
            fetchHeaders["Content-Type"] = "application/x-www-form-urlencoded";
          }
        }
      }
      const fetchOptions = {
        method,
        headers: fetchHeaders,
        body,
        signal: abortController?.signal ?? opts.signal,
        credentials: opts.credentials
      };
      if (opts.timeout && opts.timeout > 0 && abortController) {
        timeoutId = setTimeout(() => {
          isTimeout = true;
          abortController.abort();
        }, opts.timeout);
      }
      if (fetchOptions.signal?.aborted) throw Object.assign(new Error("Request aborted"), { name: "AbortError" });
      const response = await fetch(finalUrl, fetchOptions);
      if (!this.isSuccess(response.status, opts)) {
        const errorText = await response.text();
        return Promise.reject(
          this.createError({
            type: "http",
            opts,
            status: response.status,
            statusText: response.statusText,
            responseText: errorText,
            xhr: response,
            headers: this.parseFetchHeaders(response),
            loadingInstance
          })
        );
      }
      const headers = this.parseFetchHeaders(response);
      const binary = this.isBinaryType(opts.responseType);
      const text = binary ? "" : await response.text();
      const data = binary ? await (opts.responseType === "blob" ? response.blob() : response.arrayBuffer()) : opts.responseType === "json" ? this.parseJsonBody(text, { opts, xhr: response, status: response.status, statusText: response.statusText, headers, loadingInstance }) : text;
      const result = {
        data,
        status: response.status,
        responseText: text,
        config: opts,
        xhr: response,
        headers,
        loadingInstance
      };
      try {
        opts.beforeResponse?.(result, response, loadingInstance);
      } catch (error) {
        throw this.createError({ type: "callback", opts, error, xhr: response, status: response.status, statusText: response.statusText, loadingInstance });
      }
      return result;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (err instanceof AjaxError) return Promise.reject(err);
      let errorType = "network";
      if (abortController?.signal.aborted || opts.signal?.aborted || err?.name === "AbortError") {
        errorType = isTimeout ? "timeout" : "abort";
      }
      return Promise.reject(
        this.createError({
          type: errorType,
          opts,
          error: err,
          loadingInstance
        })
      );
    } finally {
      opts.signal?.removeEventListener("abort", onAbort);
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
  // 요청 준비를 처리합니다.
  prepareRequest(opts) {
    let loadingInstance = null;
    let abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
    const loaderSelector = opts.enableLoader === false ? null : opts.loaderContainer;
    if (loaderSelector) {
      if (opts.loaderOption?.enableCancelButton && typeof AbortController !== "undefined") {
        const originalCallback = opts.loaderOption.callback;
        opts.loaderOption = { ...opts.loaderOption, callback: () => {
          abortController.abort();
          return originalCallback?.(opts);
        } };
      }
      loadingInstance = new Loading(loaderSelector, { ...opts.loaderOption, requestCount: 1 });
    }
    try {
      opts.beforeRequest?.(opts, null, loadingInstance);
    } catch (error) {
      loadingInstance?.hide();
      throw this.createError({ type: "callback", opts, error, loadingInstance });
    }
    return { loadingInstance, abortController };
  }
  // 응답 headers를 파싱합니다.
  parseFetchHeaders(response) {
    const headersObj = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    return headersObj;
  }
}
class XHRAjax extends AjaxAbstract {
  constructor(options) {
    super(options);
  }
  // beforeRequest 훅은 열린 xhr 을 받으므로 먼저 open 한 뒤 실행한다. 훅 이후 opts(url, params, data, headers, timeout 등)를 다시 읽어 요청에 반영한다.
  async request(url, method, opts) {
    if (opts.credentials === "omit") {
      throw new TypeError('credentials="omit" requires fetch; XHR cannot omit same-origin cookies.');
    }
    let cleanup = () => {
    };
    return new Promise((resolve, reject) => {
      const sync = opts.async === false;
      const binaryNotAllowed = () => new TypeError(`responseType="${opts.responseType}" 는 async:false 와 함께 쓸 수 없습니다.`);
      if (sync && this.isBinaryType(opts.responseType)) throw binaryNotAllowed();
      const originalUrl = opts.url;
      const initial = this.buildRequestData(url, method, opts);
      const xhr = new XMLHttpRequest();
      xhr.open(method, initial.finalUrl, !sync);
      let loadingInstance = null;
      let settled = false;
      const fail = (type, error, responseText) => {
        if (settled) return;
        settled = true;
        reject(this.createError({ type, opts, xhr, loadingInstance, error, responseText, headers: type === "http" ? this.getResponseHeaders(xhr) : void 0 }));
      };
      const onAbort = () => {
        xhr.abort();
        fail("abort");
      };
      cleanup = () => opts.signal?.removeEventListener("abort", onAbort);
      opts.signal?.addEventListener("abort", onAbort, { once: true });
      xhr.onreadystatechange = () => {
        if (settled || xhr.readyState !== XMLHttpRequest.DONE || xhr.status === 0) return;
        if (!this.isSuccess(xhr.status, opts)) {
          if (this.isBinaryType(opts.responseType)) this.binaryToText(xhr.response).then((text) => fail("http", void 0, text));
          else fail("http");
          return;
        }
        let result;
        try {
          result = { ...this.parseResponse(xhr, opts, loadingInstance), xhr, config: opts, loadingInstance };
        } catch (error) {
          settled = true;
          reject(error instanceof AjaxError ? error : this.createError({ type: "network", opts, xhr, loadingInstance, error }));
          return;
        }
        try {
          opts.beforeResponse?.(result, xhr, loadingInstance);
        } catch (error) {
          fail("callback", error);
          return;
        }
        settled = true;
        resolve(result);
      };
      xhr.onerror = () => fail("network");
      xhr.ontimeout = () => fail("timeout");
      xhr.onabort = () => fail("abort");
      let progressUpload = false;
      const showProgress = (ev, phase) => {
        if (!opts.showProgress || !loadingInstance || !ev.lengthComputable || ev.total <= 0) return;
        if (phase === "upload" ? !progressUpload : !this.isBinaryType(opts.responseType)) return;
        loadingInstance.setContent(`${Math.min(100, Math.floor(ev.loaded / ev.total * 100))}%`);
      };
      if ((opts.onUploadProgress || opts.showProgress) && xhr.upload) {
        xhr.upload.onprogress = (ev) => {
          showProgress(ev, "upload");
          opts.onUploadProgress?.({ xhr, ev });
        };
      }
      if (opts.onDownloadProgress || opts.showProgress) {
        xhr.onprogress = (ev) => {
          showProgress(ev, "download");
          opts.onDownloadProgress?.({ xhr, ev });
        };
      }
      try {
        if (opts.signal?.aborted) {
          fail("abort");
          return;
        }
        loadingInstance = this.prepareRequest(opts, xhr).loadingInstance;
        const recorded = [];
        const nativeSetRequestHeader = xhr.setRequestHeader;
        xhr.setRequestHeader = function(name, value) {
          recorded.push([name, value]);
          return nativeSetRequestHeader.call(xhr, name, value);
        };
        try {
          opts.beforeRequest?.(opts, xhr, loadingInstance);
        } catch (error) {
          fail("callback", error);
          return;
        } finally {
          delete xhr.setRequestHeader;
        }
        if (opts.signal?.aborted || settled) {
          fail("abort");
          return;
        }
        const built = this.buildRequestData(this.resolveUrl(url, originalUrl, opts), method, opts);
        if (built.finalUrl !== initial.finalUrl) {
          xhr.open(method, built.finalUrl, !sync);
          for (const [name, value] of recorded) xhr.setRequestHeader(name, value);
        }
        if (this.isBinaryType(opts.responseType)) {
          if (sync) throw binaryNotAllowed();
          xhr.responseType = opts.responseType;
        }
        if (!sync && opts.timeout && opts.timeout > 0) xhr.timeout = opts.timeout;
        if (opts.credentials !== void 0) xhr.withCredentials = opts.credentials === "include";
        progressUpload = !!opts.showProgress && this.isUploadProgressTarget(opts, method);
        if (progressUpload || opts.showProgress && this.isBinaryType(opts.responseType)) loadingInstance?.setContent("0%");
        const headers = this.cleanHeaders(opts.headers);
        this.setHeaders(xhr, method, headers, built.isForm, opts.rawBody ? null : built.preparedData);
        const preparedData = built.preparedData;
        if (this.isBodylessMethod(method) || preparedData == null) {
          xhr.send();
        } else if (isFormData(preparedData) || opts.rawBody) {
          xhr.send(preparedData);
        } else if (isObject(preparedData) && !this.isRawBody(preparedData)) {
          const contentType = Object.entries(headers).find(([key]) => key.toLowerCase() === "content-type")?.[1] || "";
          xhr.send(contentType.toLowerCase().includes("application/x-www-form-urlencoded") ? objectToQueryString(preparedData) : JSON.stringify(preparedData));
        } else {
          xhr.send(preparedData);
        }
      } catch (error) {
        fail("network", error);
      }
    }).finally(() => cleanup());
  }
  parseResponse(xhr, opts, loadingInstance) {
    const binary = this.isBinaryType(opts.responseType);
    const responseText = binary ? "" : xhr.responseText;
    const headers = this.getResponseHeaders(xhr);
    const data = binary ? xhr.response : opts.responseType === "json" ? this.parseJsonBody(responseText, { opts, xhr, status: xhr.status, statusText: xhr.statusText, headers, loadingInstance }) : responseText;
    return {
      data,
      status: xhr.status,
      readyState: xhr.readyState,
      responseText,
      headers
    };
  }
  // 응답 headers를 파싱합니다.
  getResponseHeaders(xhr) {
    const headersObj = {};
    const allHeaders = xhr.getAllResponseHeaders();
    const lines = allHeaders.trim().split(/[\r\n]+/);
    for (const line of lines) {
      const parts = line.split(": ");
      const key = parts.shift();
      const value = parts.join(": ");
      if (key) headersObj[key] = value;
    }
    return headersObj;
  }
  // 요청 headers를 설정합니다.
  // isFormData가 true이면 Content-Type을 설정하지 않아 브라우저가 boundary 포함한 적절한 헤더를 생성하도록 함
  setHeaders(xhr, method, requestHeaders, isFormData2 = false, body) {
    const headers = { ...requestHeaders };
    if (!isFormData2) {
      if (!this.isBodylessMethod(method) && body != null && !this.isRawBody(body) && !Object.keys(headers).some((key) => key.toLowerCase() === "content-type")) {
        headers["Content-Type"] = isObject(body) ? "application/json" : "application/x-www-form-urlencoded";
      }
      for (const key of Object.keys(headers)) {
        if (headers[key]) xhr.setRequestHeader(key, headers[key]);
      }
    } else {
      for (const key of Object.keys(headers)) {
        if (key.toLowerCase() === "content-type") continue;
        if (headers[key]) xhr.setRequestHeader(key, headers[key]);
      }
    }
  }
  // 요청 준비를 처리합니다.
  prepareRequest(opts, xhr) {
    let loadingInstance = null;
    const loaderSelector = opts.enableLoader === false ? null : opts.loaderContainer;
    if (loaderSelector) {
      if (opts.loaderOption?.enableCancelButton) {
        const originalCallback = opts.loaderOption.callback;
        opts.loaderOption = { ...opts.loaderOption, callback: () => {
          xhr.abort();
          return originalCallback?.(opts);
        } };
      }
      loadingInstance = new Loading(loaderSelector, { ...opts.loaderOption, requestCount: 1 });
    }
    return { loadingInstance };
  }
}
class Ajax {
  constructor(options) {
    this.pendingRequestMap = /* @__PURE__ */ new Map();
    this.nextRequestId = 0;
    this.options = objectDeepMerge(this.createGlobalAjaxOptions(), options || {}, { _excludeKeys: ["signal", "params", "loaderContainer"] });
    if (options?.validMethods) this.options.validMethods = options.validMethods.map((m) => String(m).toUpperCase());
    this.options.signal = options?.signal;
    this.options.params = options?.params;
    this.options.loaderContainer = options?.loaderContainer;
    this.fetchAjax = new FetchAjax(this.options);
    this.xhrAjax = new XHRAjax(this.options);
    this.isFetchSupported = typeof window !== "undefined" && "fetch" in window;
  }
  /**
   * 진행 중인 요청의 스냅샷을 반환합니다. 동일 URL 요청도 별도 ID로 구분합니다.
   * @returns 진행 중인 요청 Map의 복사본
   */
  get pendingRequests() {
    return new Map(this.pendingRequestMap);
  }
  /** 전역 옵션의 기본값을 만듭니다. 내부용이며 기존 호환을 위해 공개로 유지합니다. */
  createGlobalAjaxOptions() {
    return {
      baseUrl: "",
      method: "POST",
      timeout: -1,
      responseType: "json",
      headers: { "X-Client-Type": "Web" },
      loaderContainer: "",
      enableDefaultLoader: false,
      loaderOption: {},
      validMethods: ["GET", "POST", "PUT", "DELETE"],
      errorAlertView: false,
      fetchMode: "xhr"
    };
  }
  /** 요청 옵션의 기본값(전역 옵션 반영)을 만듭니다. 내부용이며 기존 호환을 위해 공개로 유지합니다. */
  createDefaultOptions() {
    const opts = this.options;
    return {
      url: "",
      signal: opts.signal,
      credentials: opts.credentials,
      params: opts.params,
      enableLoader: opts.enableLoader,
      showProgress: opts.showProgress,
      rawBody: opts.rawBody,
      fetchMode: opts.fetchMode,
      validateStatus: opts.validateStatus,
      paramsSerializer: opts.paramsSerializer,
      beforeRequest: opts.beforeRequest,
      beforeResponse: opts.beforeResponse,
      method: opts.method,
      timeout: opts.timeout,
      responseType: opts.responseType,
      headers: opts.headers,
      loaderContainer: opts.loaderContainer,
      loaderOption: opts.loaderOption,
      errorAlertView: opts.errorAlertView
    };
  }
  /**
   * Ajax 인스턴스를 생성합니다.
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @returns {Ajax} Ajax 인스턴스
   */
  static create(options) {
    return new Ajax(options);
  }
  // 두 signal 중 하나라도 취소되면 취소되는 signal 을 만든다. 하나뿐이면 그대로 사용한다.
  combineSignals(a, b) {
    if (!a || !b || a === b) return { signal: a ?? b, dispose: () => {
    } };
    const controller = new AbortController();
    const first = a.aborted ? a : b.aborted ? b : null;
    if (first) {
      controller.abort(first.reason);
      return { signal: controller.signal, dispose: () => {
      } };
    }
    const onA = () => controller.abort(a.reason);
    const onB = () => controller.abort(b.reason);
    a.addEventListener("abort", onA, { once: true });
    b.addEventListener("abort", onB, { once: true });
    return {
      signal: controller.signal,
      dispose: () => {
        a.removeEventListener("abort", onA);
        b.removeEventListener("abort", onB);
      }
    };
  }
  async _request(url, method, options, useFetch = true) {
    url = joinUrl(this.options.baseUrl, url);
    const data = options?.data;
    const opts = objectDeepMerge({ ...this.createDefaultOptions(), signal: void 0, params: void 0, loaderContainer: void 0 }, options || {}, { _excludeKeys: ["data", "signal", "params", "loaderContainer"] });
    opts.data = data;
    opts.params = { ...this.options.params, ...options?.params };
    opts.loaderContainer = options?.loaderContainer ?? this.options.loaderContainer;
    const ajaxMethod = (method || opts.method || "GET").toUpperCase();
    if (!this.options.validMethods?.includes(ajaxMethod)) {
      return Promise.reject(
        new AjaxError({
          type: "method",
          status: 405,
          statusText: "Invalid Method",
          responseText: `Invalid HTTP method: ${ajaxMethod}`,
          message: `Invalid HTTP method: ${ajaxMethod}`,
          xhr: null,
          loadingInstance: null
        })
      );
    }
    opts.loaderContainer = opts.enableLoader === false ? null : opts.loaderContainer || (opts.enableLoader === true || this.options.enableDefaultLoader ? "body" : null);
    const usesFetch = useFetch && this.isFetchSupported && opts.fetchMode === "fetch";
    if (usesFetch && (opts.onUploadProgress || opts.onDownloadProgress || this.xhrAjax.needsLoaderProgress(opts, ajaxMethod))) {
      return Promise.reject(new TypeError('fetchMode "fetch" 는 onUploadProgress/onDownloadProgress/showProgress(파일 업로드·blob/arraybuffer 다운로드) 를 지원하지 않습니다. fetchMode: "xhr" 를 사용하세요.'));
    }
    const id = ++this.nextRequestId;
    this.pendingRequestMap.set(id, Object.freeze({ id, url, method: ajaxMethod, startedAt: Date.now() }));
    let loadingInstance = null;
    const beforeRequest = opts.beforeRequest;
    opts.beforeRequest = (value, xhr, loading) => {
      loadingInstance = loading ?? null;
      beforeRequest?.(value, xhr, loading);
    };
    const combined = this.combineSignals(options?.signal, this.options.signal);
    opts.signal = combined.signal;
    try {
      const response = await (usesFetch ? this.fetchAjax.request(url, ajaxMethod, opts) : this.xhrAjax.request(url, ajaxMethod, opts));
      loadingInstance = loadingInstance ?? response?.loadingInstance ?? null;
      return response;
    } catch (error) {
      loadingInstance = loadingInstance ?? error?.loadingInstance;
      throw error;
    } finally {
      combined.dispose();
      this.pendingRequestMap.delete(id);
      loadingInstance?.hide();
    }
  }
  /**
   * 요청을 보냅니다. URL 과 메서드는 options.url, options.method 로 지정합니다.
   *
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 을 사용합니다. true 여도 fetchMode 가 "fetch" 일 때만 Fetch 를 사용합니다(기본 fetchMode 는 "xhr").
   * @returns {*}
   */
  request(options, useFetch = true) {
    const url = options?.url || "";
    return this._request(url, options?.method, options, useFetch);
  }
  /**
   * get 요청을 보냅니다.
   *
   * @param {string} url api URL
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
   * @returns {*}
   */
  get(url, options, useFetch = true) {
    return this._request(url, "GET", options, useFetch);
  }
  /**
   * post 요청을 보냅니다.
   *
   * @param {string} url api URL
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
   * @returns {*}
   */
  post(url, options, useFetch = true) {
    return this._request(url, "POST", options, useFetch);
  }
  /**
   * put 요청을 보냅니다.
   *
   * @param {string} url api URL
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
   * @returns {*}
   */
  put(url, options, useFetch = true) {
    return this._request(url, "PUT", options, useFetch);
  }
  /**
   * DELETE 요청을 보냅니다.
   *
   * @param {string} url api URL
   * @param {?AjaxOptions} [options]  ajax 옵션
   * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
   * @returns {*}
   */
  delete(url, options, useFetch = true) {
    return this._request(url, "DELETE", options, useFetch);
  }
}
function eqAttributeValue(element, attr, value) {
  return element.getAttribute(attr) == value;
}
function addAttr(el, attrs) {
  for (let key in attrs) {
    if (attrs[key] === null || attrs[key] === void 0) continue;
    el.setAttribute(key, attrs[key]);
  }
}
function removeAttr(element, ...attrKey) {
  for (const ele of $querySelectorList(element)) {
    for (const attr of attrKey) {
      ele.removeAttribute(attr);
    }
  }
}
function keyboardEventKey(e) {
  return (e.key || "").toLowerCase();
}
function eventKeyCode(e) {
  const evt = e;
  if (typeof evt.keyCode === "number" && evt.keyCode > 0) {
    return evt.keyCode;
  }
  if (typeof evt.which === "number" && evt.which > 0) {
    return evt.which;
  }
  return void 0;
}
function isShiftKey(evt) {
  return !!evt.shiftKey;
}
function isCtrlKey(evt) {
  return !!evt.ctrlKey;
}
function isSpacebar(evt) {
  const event = evt;
  if (event.key === " " || event.code === "Space") {
    return true;
  }
  return false;
}
function isEnter(evt) {
  const event = evt;
  if (event.key === "Enter" || event.code === "Enter") {
    return true;
  }
  return false;
}
function stopPreventCancel(e) {
  e.preventDefault();
  e.stopPropagation();
}
function eventPosition(e) {
  let evt;
  if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent && (e.touches.length > 0 || e.changedTouches.length > 0)) {
    evt = e.touches[0] ?? e.changedTouches[0];
  } else if (e instanceof MouseEvent) {
    evt = e;
  } else {
    evt = { pageX: 0, pageY: 0 };
  }
  return {
    x: evt.pageX,
    y: evt.pageY
  };
}
function isClickEvent(e) {
  if (e.type === "touchstart") {
    return true;
  }
  if (e instanceof MouseEvent) {
    return e.button === 0;
  }
  return false;
}
function parseEventType(type) {
  const [name, ...namespaces] = type.split(".");
  return { name, namespaces: namespaces.filter(Boolean) };
}
function matchesEventType(target, registered) {
  if (target.name && target.name !== registered.name) return false;
  return target.namespaces.every((namespace) => registered.namespaces.includes(namespace));
}
class EventManager {
  constructor() {
    this.registrations = /* @__PURE__ */ new WeakMap();
    this.targets = /* @__PURE__ */ new Set();
    this.refs = /* @__PURE__ */ new WeakMap();
    this.finalizer = typeof FinalizationRegistry === "function" ? new FinalizationRegistry((ref) => {
      this.targets.delete(ref);
    }) : void 0;
  }
  on(el, type, listener, selector, fnOpts) {
    if (el == null || typeof listener !== "function") return;
    for (const target of $querySelectorList(el)) {
      for (const eventType of type.trim().split(/\s+/).filter(Boolean)) {
        const handler = (event) => {
          let matched;
          if (typeof selector === "string" && selector.trim()) {
            const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
            matched = origin?.closest(selector) ?? void 0;
            if (!matched || !target.contains(matched)) return;
          }
          if (listener(event, matched ?? target) === false) {
            event.stopImmediatePropagation();
            event.preventDefault();
          }
        };
        const capture = typeof fnOpts === "boolean" ? fnOpts : !!fnOpts?.capture;
        target.addEventListener(eventType.split(".")[0], handler, fnOpts);
        const entries = this.registrations.get(target) ?? [];
        entries.push({ type: eventType, handler, capture });
        this.registrations.set(target, entries);
        this.track(target);
      }
    }
  }
  /**
   * 등록한 이벤트를 제거합니다. "click" 은 네임스페이스와 관계없이 click 을 모두 제거하고,
   * "click.ns" 는 해당 네임스페이스만, ".ns" 는 이벤트 이름과 관계없이 해당 네임스페이스를 제거합니다.
   */
  off(el, type) {
    if (el == null) return el;
    const types = type.trim().split(/\s+/).filter(Boolean).map(parseEventType);
    for (const target of $querySelectorList(el)) {
      const remaining = (this.registrations.get(target) ?? []).filter((entry) => {
        const registered = parseEventType(entry.type);
        if (!types.some((item) => matchesEventType(item, registered))) return true;
        target.removeEventListener(registered.name, entry.handler, entry.capture);
        return false;
      });
      if (remaining.length) this.registrations.set(target, remaining);
      else this.untrack(target);
    }
  }
  offAll() {
    for (const ref of this.targets) {
      const target = ref.deref();
      if (!target) continue;
      for (const entry of this.registrations.get(target) ?? []) {
        target.removeEventListener(entry.type.split(".")[0], entry.handler, entry.capture);
      }
      this.registrations.delete(target);
      this.refs.delete(target);
      this.finalizer?.unregister(ref);
    }
    this.targets.clear();
  }
  // offAll 이 순회할 요소 목록을 약한 참조로 보관한다(WeakRef 가 없으면 강한 참조로 대체)
  track(target) {
    if (this.refs.has(target)) return;
    const weak = typeof WeakRef === "function";
    const ref = weak ? new WeakRef(target) : { deref: () => target };
    this.refs.set(target, ref);
    this.targets.add(ref);
    if (weak) this.finalizer?.register(target, ref, ref);
  }
  untrack(target) {
    this.registrations.delete(target);
    const ref = this.refs.get(target);
    if (ref) {
      this.targets.delete(ref);
      this.finalizer?.unregister(ref);
    }
    this.refs.delete(target);
  }
}
function formatMessage(msgFormat, msgParam) {
  if (!msgParam) return msgFormat;
  return msgFormat.replace(/\{([A-Za-z0-9_.]+)\}/g, (match, key, offset) => {
    const previous = msgFormat[offset - 1];
    if (previous === "$" || previous === "\\") return match;
    const inherited = key in msgParam && Object.prototype.hasOwnProperty.call(Object.prototype, key) && !Object.prototype.hasOwnProperty.call(msgParam, key) && msgParam[key] === Object.prototype[key];
    return key in msgParam && !inherited ? String(msgParam[key]) : match;
  });
}
const VERSION = `${"0.0.13"}`;
export {
  $querySelector,
  $querySelectorList,
  Ajax,
  AjaxError,
  EventManager,
  FUNCTION_REF_PREFIX,
  Loading,
  VERSION,
  addAttr,
  addClass,
  addStyleCss,
  addValueIfMissing,
  after,
  allTrim,
  append,
  arrayCopy,
  arrayDeepMerge,
  arrayEquals,
  assertScope,
  before,
  calcSummary,
  camelToKebab,
  camelToUnderscore,
  capitalize,
  clamp,
  cloneConfig,
  cloneJson,
  compareValues,
  computeSummary,
  convertHtmlToText,
  createClassNamer,
  createErrorFactory,
  createHTMLElement,
  createMatcher,
  createUuid,
  debounce,
  deepCopy,
  downloadText,
  downloadUrl,
  eqAttributeValue,
  escapeCellValue,
  escapeHTML,
  eventKeyCode,
  eventPosition,
  fieldDisplayName,
  fieldsOf,
  findClosest,
  formatDate,
  formatMessage,
  formatNumber,
  formatValue,
  getBrowserSize,
  getElementRect,
  getHashCode,
  getIn,
  getPagingInfo,
  getPagingParamToPagingInfo,
  getScrollPosition,
  getURLParam,
  getURLParams,
  hasClass,
  hasProperty,
  highlightSingleMatch,
  innerLayerPosition,
  insertToArray,
  intValue,
  isArray,
  isBlank,
  isBoolean,
  isClickEvent,
  isCtrlKey,
  isDate,
  isElement,
  isEmpty,
  isEnter,
  isEsc,
  isFormData,
  isFunction,
  isHTMLElement,
  isMouseMoved,
  isNil,
  isNumber,
  isNumeric,
  isObject,
  isPlainObject,
  isPrimaryPointer,
  isSafeUrl,
  isSameValue,
  isSequential,
  isShiftKey,
  isSpacebar,
  isString,
  isThenable,
  isUndefined,
  isVisible,
  joinUrl,
  jsonEqual,
  keyboardEventKey,
  leftPad,
  leftPadClamp,
  leftTrim,
  lowerCase,
  matchCount,
  matchRow,
  measureScrollTarget,
  moveItem,
  normalizeCssLength,
  objectDeepMerge,
  objectToQueryString,
  outerLayerPosition,
  parseClipboard,
  parseConfigJson,
  parseConfigString,
  parseJson,
  parseTsv,
  popup,
  popupPosition,
  prepend,
  readTextFile,
  removeAttr,
  removeClass,
  removeItem,
  renderTemplate,
  replaceParameter,
  resolveClassName,
  resolveScrollElement,
  resolveScrollTarget,
  restoreFunctions,
  rightPad,
  rightPadClamp,
  rightTrim,
  sameValue,
  sanitizeHtml,
  serializeSvg,
  setIn,
  sortRows,
  stopPreventCancel,
  stringSplit,
  stringifyWithFunctions,
  styleClassSplit,
  svgToDataURL,
  templateToElement,
  toDataAttribute,
  toListValue,
  toNumber,
  toObjectForm,
  toOptionObject,
  toTimestamp,
  toTsv,
  toggleClass,
  trim,
  unXss,
  upperCase,
  uuid,
  writeClipboard,
  xss
};
//# sourceMappingURL=index.js.map
