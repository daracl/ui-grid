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
export {
  FUNCTION_REF_PREFIX,
  addValueIfMissing,
  allTrim,
  arrayCopy,
  arrayDeepMerge,
  arrayEquals,
  assertScope,
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
  escapeCellValue,
  escapeHTML,
  fieldDisplayName,
  fieldsOf,
  formatDate,
  formatNumber,
  formatValue,
  getBrowserSize,
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
  isDate,
  isElement,
  isEmpty,
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
  isString,
  isThenable,
  isUndefined,
  isVisible,
  joinUrl,
  jsonEqual,
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
  readTextFile,
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
  stringSplit,
  stringifyWithFunctions,
  svgToDataURL,
  templateToElement,
  toDataAttribute,
  toListValue,
  toNumber,
  toObjectForm,
  toOptionObject,
  toTimestamp,
  toTsv,
  trim,
  unXss,
  upperCase,
  uuid,
  writeClipboard,
  xss
};
//# sourceMappingURL=utils.js.map
