"use strict";
const INSTANCE_ATTR_KEY = "daracl-grid-id";
const SelectionModeMap = {
  cell: "cell",
  multiCell: "multiCell",
  row: "row",
  multiRow: "multiRow",
  none: "none"
};
const HoverModeMap = {
  cell: "cell",
  row: "row",
  none: "none"
};
const AlignStyleMap = {
  left: "dg-left",
  center: "dg-center",
  right: "dg-right"
};
const RULES = {
  NAN: "nan",
  MIN: "minimum",
  EXCLUSIVE_MIN: "exclusiveMinimum",
  MAX: "maximum",
  EXCLUSIVE_MAX: "exclusiveMaximum",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  BETWEEN: "between",
  BETWEEN_EXCLUSIVE_MIN: "betweenExclusiveMin",
  BETWEEN_EXCLUSIVE_MAX: "betweenExclusiveMax",
  BETWEEN_EXCLUSIVE_MINMAX: "betweenExclusiveMinMax",
  REQUIRED: "required"
};
const FIELD_PREFIX = "dg";
const ItemStatusMap = {
  // 생성
  CREATE: "C",
  // 수정
  MODIFY: "U",
  // 삭제
  DELETE: "D",
  // 읽기
  READ: "R"
};
const MovePositionMap = {
  BEFORE: "before",
  AFTER: "after"
};
const CELL_PADDING = {
  horizontal: 10,
  // left/right padding
  vertical: 5
  // top/bottom padding
};
const MOUSE_MOVE_THRESHOLD = 5;
const TOOLBAR_HEIGHT = 35;
const DEFAULT_LINE_NUMBER_WIDTH = 40;
const DEFAULT_ROW_CHECK_WIDTH = 27;
const FOOTER_HEIGHT = 35;
const ROW_KEY_PREFIX = "_dg";
const LINE_NUMBER_NAME = "$lineNumber";
const ROW_CHECK_NAME = "$rowCheck";
const ROW_FIELD = {
  ID: `${ROW_KEY_PREFIX}$rowid`,
  DEPTH: `${ROW_KEY_PREFIX}$depth`,
  HEIGHT: `${ROW_KEY_PREFIX}$rowHeight`,
  CUD: "_$CUD"
};
const ALL_SELECT_VALUE = "$all$";
const ROW_DRAG_HANDLE_NAME = "$rowDragHandle";
const LAYER_ATTR_NAME = "data-dg-grid-layer";
const FIELD_LAYER_CLASS = "dg-field-layer";
const CHUNK_SIZE = 1e3;
const HIDDEN_ELEMENT_SELECTOR = ".dg-hidden-layers";
const PointerStateMap = {
  IDLE: "IDLE",
  PRESSED: "PRESSED",
  DRAGGING: "DRAGGING"
};
const SCROLL_THUMB_MIN_SIZE = 18;
const SCROLL_INSET = 4;
const ScrollDirectionXMap = {
  LEFT: "L",
  RIGHT: "R"
};
const ScrollDirectionYMap = {
  UP: "U",
  DOWN: "D"
};
const BodyCellStyleMap = {
  SELECTION: "dg-selection",
  START_CELL: "dg-start-cell"
};
const MATCH_WHOLE_REGEX = /[ㄱ-ㅎ가-힣a-zA-Z0-9_]+/g;
const SearchDirectionMap = {
  PREV: "prev",
  NEXT: "next"
};
function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    return result + str + (value == null ? "" : String(value));
  }, "");
}
const ALL_ICONS = {
  search: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
      />
    </svg>
  `,
  refresh: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z"
      />
    </svg>
  `,
  save: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z"
      />
    </svg>
  `,
  add: html`
    <svg viewBox="0 0 24 24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  `,
  delete: html`
    <svg viewBox="0 0 24 24">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  `,
  edit: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  `,
  copy: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"
      />
    </svg>
  `,
  move: html`
    <svg viewBox="0 0 24 24">
      <path
        d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z"
      />
    </svg>
  `,
  cut: html`<svg viewBox="0 0 24 24">
    <path
      class="dg-icon-fill"
      d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z"
    />

    <!-- Top blade tip -->
    <path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" />
  </svg>`,
  upload: html`
    <svg viewBox="0 0 24 24">
      <!-- Excel file -->
      <path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />

      <!-- File corner -->
      <path class="dg-icon-fill icon-corner" d="M14 2V8H20" />

      <!-- Upload arrow -->
      <path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" />

      <path
        class="dg-icon-fill-stroke"
        d="M9.5 13.5L12 11L14.5 13.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  download: html`
    <svg viewBox="0 0 24 24">
      <!-- Excel file -->
      <path
        class="dg-icon-fill"
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      ></path>

      <!-- File corner -->
      <path class="dg-icon-fill icon-corner" d="M14 2V8H20" />

      <!-- Download arrow -->
      <path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path>

      <path
        class="dg-icon-fill-stroke"
        d="M9.5 13.5L12 16L14.5 13.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  `,
  mapping: html`
    <svg viewBox="0 0 16 16">
      <!-- Left -->
      <rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" />

      <!-- Right Top -->
      <rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" />

      <!-- Right Bottom -->
      <rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" />

      <!-- Connection -->
      <path
        class="dg-icon-stroke"
        d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Arrow -->
      <path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />

      <path
        class="dg-icon-stroke"
        d="M9 6.8L10.5 8L9 9.2"
        stroke-width="1.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  preview: html`
    <svg viewBox="0 0 24 24">
      <!-- Eye -->
      <path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" />

      <!-- Iris -->
      <circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" />

      <!-- Pupil -->
      <circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" />
    </svg>
  `,
  permission: html`
    <svg viewBox="0 0 24 24">
      <!-- User -->
      <circle class="dg-icon-fill" cx="8" cy="9" r="3" />

      <path
        class="dg-icon-fill"
        d="
      M3 19
      c0-2.8 2.3-5 5-5
      s5 2.2 5 5
      Z
    "
      />

      <!-- Shield -->
      <path
        class="dg-icon-fill"
        d="
      M17 3
      l4 1.5
      V10
      c0 3.4-2.1 6-5 7.5
      c-2.9-1.5-5-4.1-5-7.5
      V4.5
      Z
    "
      />

      <!-- Check -->
      <path
        class="dg-icon-stroke"
        d="
      M15.6 9.5
      l1.2 1.2
      l2.4-2.4
    "
        fill="none"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  parameter: html`
    <svg viewBox="0 0 24 24">
      <!-- Left brace -->
      <path
        d="
        M10 3
        H8
        C6.9 3 6 3.9 6 5
        V8
        C6 9.2 5.4 10 4 10
        V14
        C5.4 14 6 14.8 6 16
        V19
        C6 20.1 6.9 21 8 21
        H10
        V19
        H8V16
        C8 14.8 7.4 13.8 6.3 13.2
        C7.4 12.6 8 11.6 8 10.4
        V5H10
        Z"
      />

      <rect x="10" y="10" width="4" height="1.8" rx=".9" />
      <rect x="10" y="13" width="4" height="1.8" rx=".9" />

      <!-- Right brace -->
      <path
        d="
        M14 3
        H16
        C17.1 3 18 3.9 18 5
        V8
        C18 9.2 18.6 10 20 10
        V14
        C18.6 14 18 14.8 18 16
        V19
        C18 20.1 17.1 21 16 21
        H14
        V19
        H16V16
        C16 14.8 16.6 13.8 17.7 13.2
        C16.6 12.6 16 11.6 16 10.4
        V5H14
        Z"
      />
    </svg>
  `,
  start: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
        M8.5 5.5
        C8.5 4.9 9.2 4.5 9.8 4.9
        L18 10.3
        C18.7 10.8 18.7 13.2 18 13.7
        L9.8 19.1
        C9.2 19.5 8.5 19.1 8.5 18.5
        Z
      "
      />
    </svg>
  `,
  stop: html`
    <svg viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  `,
  pause: html`
    <svg viewBox="0 0 24 24">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  `,
  restart: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
      M12 4
      c-4.42 0-8 3.58-8 8
      s3.58 8 8 8
      c3.73 0 6.86-2.55 7.74-6H17.6
      c-.77 2.3-2.94 4-5.6 4
      a6 6 0 1 1 4.24-10.24
      L13 11h7V4l-2.34 2.34
      A7.95 7.95 0 0 0 12 4Z"
      />
    </svg>
  `,
  terminate: html`
    <svg viewBox="0 0 24 24">
      <path
        d="
      M13 3v8h-2V3h2Zm5.7 2.3
      1.4 1.4A8.97 8.97 0 0 1 21 12
      a9 9 0 1 1-18 0
      c0-2.5 1-4.8 2.9-6.4
      l1.4 1.4
      A7 7 0 1 0 17.3 7
      l1.4-1.7Z"
      />
    </svg>
  `,
  help: html`<svg class="dg-header-help" viewBox="0 0 100 100">
    <g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g>
  </svg>`,
  scrollUp: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path>
  </svg>`,
  scrollDown: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path>
  </svg>`,
  scrollLeft: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path>
  </svg>`,
  scrollRight: html`<svg viewBox="0 0 1024 1024" style="fill: currentColor;">
    <path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path>
  </svg>`,
  headerSort: html`<svg width="12" height="12" viewBox="0 0 12 12">
    <path
      class="dg-asc"
      d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z"
    />
    <path
      class="dg-desc"
      d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z"
    />
  </svg>`,
  sortup: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="50,0 0,100 100,100" fill="#737171"></polygon></g></svg>',
  sortdown: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="0,0 100,0 50,90" fill="#737171"></polygon></g></svg>'
};
const xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  // eslint-disable-next-line quotes
  "'": "&#39;"
};
const replaceXss = (inputText) => {
  let returnText = inputText;
  if (returnText) {
    Object.keys(xssFilter).forEach((key) => {
      returnText = returnText.replaceAll(key, xssFilter[key]);
    });
  }
  return returnText;
};
const hasOwnProp = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
const isBlank = (value) => {
  if (value === null) return true;
  if (value === "") return true;
  if (typeof value === "undefined") return true;
  if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;
  return false;
};
const isVisible = (elm) => {
  if (!elm.offsetHeight && !elm.offsetWidth) {
    return false;
  }
  if (getComputedStyle(elm).visibility === "hidden") {
    return false;
  }
  return true;
};
const isUndefined = (value) => {
  return value === void 0;
};
const isFunction = (value) => {
  return typeof value === "function";
};
const isString = (value) => {
  return typeof value === "string";
};
const isNumber = (value) => {
  if (isBlank(value)) {
    return false;
  }
  const num = Number(value);
  return !Number.isNaN(num);
};
const intValue = (val) => {
  return Number.parseInt(val, 10);
};
const isArray = (value) => {
  return Array.isArray(value);
};
const copyStringToClipboard = (copyText) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(copyText).then(() => void 0).catch((err) => {
      fallbackCopyToClipboard(copyText);
    });
  } else {
    fallbackCopyToClipboard(copyText);
  }
};
function debounce(f, delay) {
  let timer;
  return function(...args) {
    if (delay < 1) {
      f.apply(this, args);
      return;
    }
    if (timer !== void 0) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      f.apply(this, args);
    }, delay);
  };
}
function fallbackCopyToClipboard(copyText) {
  const copyAreaElement = document.createElement("textarea");
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
function isHTMLElement(target) {
  return target instanceof HTMLElement;
}
function isSameValue(value1, value2) {
  if (value1 == null && value2 == null) {
    return true;
  }
  return String(value1) === String(value2);
}
const isEmpty = (value) => isUndefined(value) || value == null;
const replaceMesasgeFormat = (pTmplate, data) => {
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
  template = template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : "";
  });
  return template;
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function multiSort(data, dataManager, sortInfos = [], emptyValueLast = false) {
  if (sortInfos.length === 0) {
    data.sort((a, b) => a.sortOrder - b.sortOrder);
    return data;
  }
  const sortInfoLength = sortInfos.length;
  data.forEach((viewItem) => {
    const item = dataManager.getRowItem(viewItem.id);
    viewItem.sortValues = sortInfos.map(
      ({ name, field, isValue }) => isValue ? field.$renderer.getValue(item) : item[name]
    );
  });
  data.sort((a, b) => {
    const aValues = a.sortValues;
    const bValues = b.sortValues;
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
function compareCachedValue(valA, valB, ascOrder, emptyValueLast = false) {
  const isNullishA = valA == null;
  const isNullishB = valB == null;
  if (isNullishA !== isNullishB) {
    if (emptyValueLast) {
      return isNullishA ? 1 : -1;
    }
    return ascOrder ? isNullishA ? 1 : -1 : isNullishA ? -1 : 1;
  }
  if (isNullishA) {
    return 0;
  }
  let result;
  if (typeof valA === "number" && typeof valB === "number") {
    result = valA - valB;
  } else {
    result = String(valA).localeCompare(String(valB));
  }
  return ascOrder ? result : -result;
}
function arrayCopy(array, start, end) {
  if (!Array.isArray(array)) return [];
  if (start === void 0 && end === void 0) {
    return [...array];
  }
  return array.slice(start, end);
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
const deepCopy = (copyValue) => {
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
const merge = (...value) => {
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
const stringSplit = (value, delimiter) => {
  return (value || "").split(delimiter);
};
function cloneDeep(dst, src) {
  if (isArray(src)) {
    return cloneArrayDeep(dst, src);
  }
  if (isDate(src)) {
    return new Date(src.getTime());
  }
  if (src instanceof RegExp) {
    return new RegExp(src.source, src.flags);
  }
  if (isObject(src)) {
    return cloneObjectDeep(dst, src);
  }
  return src;
}
const PROTO_POLLUTION_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function cloneObjectDeep(dst, src) {
  if (isFunction(src)) {
    return src;
  }
  for (const key of Object.keys(src)) {
    if (PROTO_POLLUTION_KEYS.has(key)) {
      continue;
    }
    const val = src[key];
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
function cloneArrayDeep(dst, src) {
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
      dst[i] = newVal;
    } else {
      dst.push(newVal);
    }
  }
  return dst;
}
function arrayEquals(a, b, ignoreOrder = false, selector) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  const getValue2 = (item) => item;
  if (ignoreOrder) {
    const sortedA = [...a].sort((x, y) => compare(getValue2(x), getValue2(y)));
    const sortedB = [...b].sort((x, y) => compare(getValue2(x), getValue2(y)));
    return sortedA.every((item, index) => getValue2(item) === getValue2(sortedB[index]));
  }
  return a.every((item, index) => getValue2(item) === getValue2(b[index]));
}
function compare(a, b) {
  if (a === b) return 0;
  return a > b ? 1 : -1;
}
const GRID_THEME = {
  light: "dg-light",
  dark: "dg-dark"
};
const BODY_STYLE = {
  default: "default",
  striped: "striped",
  borderless: "borderless",
  rows: "rows",
  cells: "cells",
  stripedRows: "striped-rows",
  stripedCells: "striped-cells"
};
const TEXT_ALIGN_STYLE = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
};
const WHITE_SPACE = {
  pre: "pre",
  wrap: "pre-wrap",
  line: "pre-line",
  normal: "normal"
};
const SELECTED_STYLE_CLASS = "dg-selected";
const RENDERER_VARIANTS = {
  /** Progress Bar Renderer */
  bar: {},
  /** Button Renderer */
  button: {
    primary: "dg-primary",
    secondary: "dg-secondary",
    info: "dg-info",
    success: "dg-success",
    warning: "dg-warning",
    danger: "dg-danger"
  },
  /** Checkbox Renderer */
  checkbox: {},
  /** Choice Renderer */
  choice: {},
  /** Custom Renderer */
  custom: {},
  /** Date Renderer */
  date: {},
  /** Dropdown Renderer */
  dropdown: {},
  /** Hidden Renderer */
  hidden: {},
  /** HTML Renderer */
  html: {},
  /** Image Renderer */
  image: {},
  /** Link Renderer */
  link: {},
  /** Number Renderer */
  number: {},
  /** Password Renderer */
  password: {},
  /** Range Renderer */
  range: {},
  /** Search Renderer */
  search: {},
  /** Sparkline Renderer */
  sparkline: {},
  /** Sparkline Bar Renderer */
  sparklineBar: {},
  /** Switch Renderer */
  switch: {
    box: "dg-box",
    round: "dg-round"
  },
  /** Text Renderer */
  text: {},
  /** TextArea Renderer */
  textarea: {},
  /** Tree Renderer */
  tree: {}
};
const styleClassSplit = (classNames) => {
  if (!classNames) {
    return [];
  }
  return classNames.match(/\S+/g) ?? [];
};
function addClass(element, ...classes) {
  if (!element) return;
  const elements = $getElements(element);
  elements.forEach((el) => {
    el.classList.add(...classes);
  });
}
function removeClass(element, ...classNames) {
  if (!element || classNames.length < 1) return;
  const elements = $getElements(element);
  for (const el of elements) {
    el.classList.remove(...classNames);
  }
}
function toggleClass(element, classNames) {
  if (!element || typeof classNames !== "string") return;
  const elements = $getElements(element);
  const classes = styleClassSplit(classNames);
  for (const el of elements) {
    classes.forEach((cls) => {
      el.classList.toggle(cls);
    });
  }
}
function normalizeCssLength(value) {
  if (!value) return "";
  return typeof value === "number" || /^\d+$/.test(value) ? `${value}px` : value;
}
const resolveClassName = (className, params) => {
  if (!className) {
    return [];
  }
  let reval;
  if (isFunction(className)) {
    reval = className(params);
  } else {
    reval = className + "";
  }
  return styleClassSplit(reval);
};
const getWhiteSpaceInfo = (field) => {
  if (!field.whiteSpace) {
    return {
      style: "",
      className: ""
    };
  }
  const value = WHITE_SPACE[field.whiteSpace];
  if (!value) {
    return {
      style: "",
      className: ""
    };
  }
  return {
    style: `white-space: ${value}`,
    className: "dg-white-space"
  };
};
const getRendererVariantClass = (renderer) => {
  var _a;
  const variant = renderer.variant;
  if (!variant) return "";
  const rendererType = renderer.type;
  return ((_a = RENDERER_VARIANTS[rendererType]) == null ? void 0 : _a[variant]) ?? "";
};
function hasClass(element, className) {
  const classNames = styleClassSplit(className);
  for (const item of classNames) {
    if (element.classList.contains(item)) {
      return true;
    }
  }
  return false;
}
function eqAttributeValue(element, attr, value) {
  return element.getAttribute(attr) == value;
}
function getElementRect(el, includeScroll = false) {
  if (!el) {
    throw new Error("Invalid element.");
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
function addAttr(el, attrs) {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
function removeAttr(element, ...attrKey) {
  let elements;
  if (element instanceof HTMLElement) {
    elements = [element];
  } else {
    elements = element;
  }
  elements.forEach((ele) => {
    for (const attr of attrKey) {
      ele.removeAttribute(attr);
    }
  });
}
function $getElements(el) {
  if (!el) return [];
  if (Array.isArray(el)) {
    return el;
  }
  if (el instanceof Element) {
    return [el];
  }
  if (el instanceof NodeList) {
    return Array.from(el);
  }
  return Array.from(document.querySelectorAll(el));
}
function createHTMLElement(tagName, className, attrs = {}) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === "object" && value !== null) {
      if (key === "style") {
        Object.assign(element.style, value);
      } else if (key === "dataset") {
        Object.assign(element.dataset, value);
      } else {
        element.setAttribute(key, JSON.stringify(value));
      }
    } else {
      element.setAttribute(key, String(value));
    }
  }
  return element;
}
function getLayerElement(tagName, className, layerName) {
  return createHTMLElement(tagName, className, { [LAYER_ATTR_NAME]: layerName });
}
function innerLayerPosition(renderContainer, targetElement, layerElement, margin = 2) {
  const rendererContainer = getElementRect(renderContainer);
  const elementRect = getElementRect(targetElement);
  let layerHeight = layerElement.offsetHeight || getElementRect(layerElement).height;
  const windowBottom = window.innerHeight;
  const gridTop = rendererContainer.top - elementRect.top;
  const menuOffsetBottom = elementRect.bottom + layerHeight;
  const shouldOpenUpward = menuOffsetBottom > windowBottom;
  let top = elementRect.top - (layerHeight - margin);
  if (shouldOpenUpward) {
    top = elementRect.top - (layerHeight - margin);
    if (top < 0) {
      layerHeight = layerHeight - 5 + top;
    }
    if (windowBottom - elementRect.bottom > layerHeight) {
      layerHeight = windowBottom - elementRect.bottom - margin;
      top = elementRect.bottom - rendererContainer.top;
    } else {
      top = -(layerHeight + margin) - gridTop;
    }
  } else {
    top = elementRect.bottom - rendererContainer.top;
  }
  return {
    top,
    left: elementRect.left - rendererContainer.left,
    height: layerHeight,
    width: elementRect.width
  };
}
function outerLayerPosition(layerEl, evtPosition) {
  const scrollPostion = getScrollPosition();
  const scrollTop = scrollPostion.top;
  const scrollLeft = scrollPostion.left;
  const rect = getElementRect(layerEl);
  const layerWidth = rect.width;
  const layerHeight = rect.height;
  const browserSize = getBrowserSize();
  const targetX = evtPosition.x;
  const targetY = evtPosition.y;
  const bottom = scrollTop + browserSize.height, right = scrollLeft + browserSize.width;
  const layerBottomMargin = 5;
  let top = targetY + layerHeight + layerBottomMargin > bottom ? bottom - (layerHeight + layerBottomMargin) : targetY;
  top = Math.max(top, 0);
  let left = targetX + layerWidth > right ? targetX - layerWidth : targetX;
  left = Math.max(left, 0);
  return { top, left };
}
function getBrowserSize(usableSize = true) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let scrollbarWidth = 0;
  let scrollbarHeight = 0;
  if (usableSize) {
    const documentElement = document.documentElement;
    scrollbarWidth = windowWidth - documentElement.clientWidth;
    scrollbarHeight = windowHeight - documentElement.clientHeight;
  }
  return {
    width: windowWidth - scrollbarWidth,
    height: windowHeight - scrollbarHeight
  };
}
function getIcon(name) {
  return ALL_ICONS[name] ?? "";
}
function getScrollPosition() {
  const top = window.pageYOffset ?? (document.documentElement.scrollTop || document.body.scrollTop || 0);
  const left = window.pageXOffset ?? (document.documentElement.scrollLeft || document.body.scrollLeft || 0);
  return { top, left };
}
let localeMessage = {
  required: "필수 입력사항 입니다.",
  selection: "선택",
  string: {
    minLength: "{minLength} 글자 이상으로 입력하세요.",
    maxLength: "{maxLength} 글자 이하로 입력하세요.",
    between: "{minLength} ~ {maxLength} 사이의 글자를 입력하세요."
  },
  number: {
    nan: "숫자만 입력 가능 합니다.",
    minimum: "{minimum} 값과 같거나 커야 합니다",
    exclusiveMinimum: "{minimum} 보다 커야 합니다",
    maximum: "{maximum} 값과 같거나 작아야 합니다",
    exclusiveMaximum: "{maximum} 보다 작아야 합니다.",
    between: "{minimum}~{maximum} 사이의 값을 입력하세요.",
    betweenExclusiveMin: "{minimum} 보다 크고 {maximum} 보다 같거나 작아야 합니다",
    betweenExclusiveMax: "{minimum} 보다 같거나 크고 {maximum} 보다 작아야 합니다",
    betweenExclusiveMinMax: "{minimum} 보다 크고 {maximum} 보다 작아야 합니다"
  },
  regexp: {
    mobile: "핸드폰 번호가 유효하지 않습니다.",
    email: "이메일이 유효하지 않습니다.",
    url: "URL이 유효하지 않습니다.",
    alpha: "영문만 입력 가능 합니다.",
    "alpha-num": "영문과 숫자만 입력 가능 합니다.",
    number: "숫자만 입력 가능 합니다.",
    variable: "값이 유효하지 않습니다.",
    "number-char": "숫자, 문자 각각 하나 이상 포함 되어야 합니다.",
    "upper-char": "대문자가 하나 이상 포함 되어야 합니다.",
    "upper-char-special": "대문자,소문자,특수문자 각각 하나 이상 포함 되어야 합니다.",
    "upper-char-special-number": "대문자,소문자,특수문자,숫자 각각 하나 이상 포함 되어야합니다."
  },
  "search.label": "Find",
  "no.data": "No Data",
  "select.all": "전체선택",
  all: "전체",
  select: "선택",
  search: "검색",
  prev: "이전",
  next: "다음",
  row: "행",
  column: "열"
};
class Language {
  constructor() {
    this.lang = localeMessage;
  }
  static setGlobalMessage(lang) {
    localeMessage = merge(localeMessage, lang);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  setMessage(lang) {
    this.lang = merge(this.lang, lang);
  }
  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  getMessage(messageKey) {
    return this.lang[messageKey];
  }
  /**
   * ValidResult 값을 메시지로 변경.
   *
   * @public
   * @param {FieldItem} field
   * @param {ValidResult} validResult
   * @returns {string[]}
   */
  validMessage(field, validResult) {
    var _a;
    let messageFormat = "";
    const messageFormats = [];
    if (validResult.regexp) {
      messageFormat = this.lang.regexp[validResult.regexp];
      messageFormats.push(messageFormat);
    }
    (validResult.constraints ?? []).forEach((constraint) => {
      var _a2;
      if (constraint === RULES.REQUIRED) {
        messageFormat = message(this.lang.required, field);
        messageFormats.push(messageFormat);
      }
      const rendererType = (_a2 = field.editRenderer) == null ? void 0 : _a2.type;
      if (rendererType == "number" || rendererType == "range") {
        messageFormat = this.lang.number[constraint];
        messageFormats.push(messageFormat);
      } else {
        messageFormat = this.lang.string[constraint];
        messageFormats.push(messageFormat);
      }
    });
    const reMessage = [];
    const msgParam = Object.assign({}, { name: field.name, label: field.label }, (_a = field.editRenderer) == null ? void 0 : _a.rule);
    messageFormats.forEach((msgFormat) => {
      if (msgFormat) {
        reMessage.push(message(msgFormat, msgParam));
      }
    });
    if (validResult.validator) {
      reMessage.push(validResult.validator.message);
    }
    return reMessage;
  }
}
const TOKEN_REGEX = /\{([A-Za-z0-9_.]+)\}/g;
function getValue(obj, path) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current == null) return void 0;
    current = current[parts[i]];
  }
  return current;
}
function message(format, params) {
  return format.replace(TOKEN_REGEX, (match, key) => {
    const value = getValue(params, key);
    return value === void 0 || value === null ? match : String(value);
  });
}
function isShiftKey(evt) {
  return evt.shiftKey;
}
function isCtrlKey(evt) {
  return evt.ctrlKey;
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
  return event.key === "Enter" || event.code === "Enter";
}
function isEsc(evt) {
  const event = evt;
  return event.key === "Escape" || // 표준
  event.key === "Esc" || // 구형 브라우저
  event.code === "Escape";
}
const stopPreventCancel = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const eventCodeValue = (e) => {
  return e.code;
};
const eventPosition = (e) => {
  var _a, _b, _c;
  if (typeof PointerEvent !== "undefined" && e instanceof PointerEvent) {
    return {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    };
  }
  if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
    const touch = ((_a = e.changedTouches) == null ? void 0 : _a[0]) || ((_b = e.touches) == null ? void 0 : _b[0]) || ((_c = e.targetTouches) == null ? void 0 : _c[0]);
    if (touch) {
      return {
        x: touch.pageX,
        y: touch.pageY,
        clientX: touch.clientX,
        clientY: touch.clientY
      };
    }
  }
  if (e instanceof MouseEvent) {
    return {
      x: e.pageX,
      y: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY
    };
  }
  return {
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0
  };
};
function isClickEvent(e) {
  if (e.type.startsWith("touch")) {
    return true;
  }
  if (e instanceof MouseEvent) {
    return e.button === 0;
  }
  return false;
}
function initPointerSession(e, startCellInfo, clickManager, el) {
  const targetElement = e.currentTarget;
  const evtPosition = eventPosition(e);
  return {
    state: PointerStateMap.PRESSED,
    event: e,
    startPos: evtPosition,
    currentPos: evtPosition,
    cellInfo: startCellInfo,
    startTime: Date.now(),
    lastClickTime: 0,
    cellEl: el ?? targetElement,
    clickManager
  };
}
const isPrimaryPointer = (e) => {
  if (e instanceof PointerEvent) {
    return e.isPrimary && e.button === 0;
  }
  if (e instanceof MouseEvent) {
    return e.button === 0;
  }
  if (e instanceof TouchEvent) {
    return true;
  }
  return false;
};
function getEventTargets(el) {
  if (!el) return [];
  if (Array.isArray(el)) {
    return el;
  }
  if (el instanceof Document || el instanceof Element) {
    return [el];
  }
  if (el instanceof NodeList) {
    return Array.from(el);
  }
  return Array.from(document.querySelectorAll(el));
}
class EventManager {
  constructor() {
    this.EVENT_HANDLER_MAP = /* @__PURE__ */ new WeakMap();
    this.ELEMENTS = /* @__PURE__ */ new Set();
  }
  addEventInfo(el, eventType, listener, capture) {
    if (!this.EVENT_HANDLER_MAP.has(el)) {
      this.EVENT_HANDLER_MAP.set(el, {});
    }
    const store = this.EVENT_HANDLER_MAP.get(el);
    if (store) {
      (store[eventType] ?? (store[eventType] = [])).push({ listener, capture });
    }
    this.ELEMENTS.add(el);
  }
  on(opts, listener, fnOpts) {
    const el = opts.el;
    if (!el) return;
    const type = opts.type;
    const selector = opts.selector;
    const eventTypes = type.replaceAll(/\s+/g, " ").split(" ");
    const elements = getEventTargets(el);
    let fn;
    if (selector && typeof selector === "string") {
      fn = (e) => {
        const target = e.target;
        const matched = target.closest(selector);
        if (!matched) return;
        const valid = elements.some((parent) => parent.contains(matched));
        if (!valid) return;
        if (listener(e, matched) === false) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
    } else {
      fn = (e) => {
        if (listener(e, el) === false) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      };
    }
    for (const eventType of eventTypes) {
      const event = eventType.split(".")[0];
      elements.forEach((target) => {
        this.addEventInfo(target, eventType, fn, (fnOpts == null ? void 0 : fnOpts.capture) ?? false);
        target.addEventListener(event, fn, fnOpts ?? {});
      });
    }
  }
  off(el, type) {
    if (!el) return;
    const eventTypes = type.replaceAll(/\s+/g, " ").split(" ");
    const elements = getEventTargets(el);
    for (const target of elements) {
      const store = this.EVENT_HANDLER_MAP.get(target);
      if (!store) continue;
      let hasHandler = false;
      for (const eventType of eventTypes) {
        const handler = store[eventType];
        if (!handler) continue;
        const event = eventType.split(".")[0];
        for (const entry of handler) target.removeEventListener(event, entry.listener, entry.capture);
        store[eventType] = void 0;
        hasHandler = true;
      }
      if (hasHandler) {
        let isEmpty2 = true;
        for (const key in store) {
          if (store[key] !== void 0) {
            isEmpty2 = false;
            break;
          }
        }
        if (isEmpty2) {
          this.EVENT_HANDLER_MAP.delete(target);
          this.ELEMENTS.delete(target);
        }
      }
    }
  }
  /**
   * 제거
   */
  destroy() {
    this.ELEMENTS.forEach((el) => {
      const store = this.EVENT_HANDLER_MAP.get(el);
      if (!store) return;
      for (const type in store) {
        const event = type.split(".")[0];
        for (const entry of store[type] ?? []) el.removeEventListener(event, entry.listener, entry.capture);
      }
      this.EVENT_HANDLER_MAP.delete(el);
    });
    this.ELEMENTS.clear();
  }
}
const getPagingParamToPagingInfo = (pagingParam, rowLength) => {
  const page = (pagingParam == null ? void 0 : pagingParam.page) || 1;
  const totalCount = (pagingParam == null ? void 0 : pagingParam.totalCount) ?? rowLength;
  const pageSize = (pagingParam == null ? void 0 : pagingParam.pageSize) || 10;
  const unitPage = (pagingParam == null ? void 0 : pagingParam.unitPage) || 10;
  return getPagingInfo(totalCount > 0 ? totalCount : rowLength, page, pageSize, unitPage);
};
const getPagingInfo = (totalCount, page, pageSize, unitPage) => {
  pageSize = pageSize || 10;
  unitPage = unitPage || 10;
  if (totalCount < 1) {
    return {
      page: 0,
      unitPage: 0,
      totalCount: 0,
      totalPages: 0
    };
  }
  if (totalCount < pageSize) {
    pageSize = totalCount;
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
function initConfig(opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const pagingInfo = getPagingParamToPagingInfo(
    isPlainObject(opts.paging) ? opts.paging : {},
    opts.items.length
  );
  let rowIdField = ROW_FIELD.ID;
  if (opts.rowIdField) {
    rowIdField = opts.rowIdField;
  } else if (opts.tree) {
    rowIdField = opts.tree.idField || "id";
  }
  return {
    rowIdField,
    dataManager: {},
    eventManager: new EventManager(),
    theme: "",
    checkOnRowSelect: ((_b = (_a = opts.aside) == null ? void 0 : _a.rowCheckbox) == null ? void 0 : _b.checkOnRowSelect) === true,
    enabledHeaderHelpButton: (_d = (_c = opts.header) == null ? void 0 : _c.help) == null ? void 0 : _d.enabled,
    dimensions: {
      width: 0,
      height: 0,
      toolbarHeight: 0,
      footerHeight: 0,
      mainInsideWidth: 0,
      mainHeaderHeight: 0,
      mainBodyHeight: 0,
      mainSummaryHeight: 0,
      mainHeight: 0,
      mainLeftWidth: 0,
      mainCenterWidth: 0,
      mainRightWidth: 0,
      mainTotalWidth: 0,
      mainCenterOverWidth: 0,
      mainCenterViewWidth: 0,
      fieldTotalWidth: 0
    },
    summary: {
      heights: []
    },
    fontFamily: "Noto Sans KR",
    fontSize: "12px",
    enabledCellEdit: opts.editable ?? false,
    isRowAllowMultiSelect: ((_f = (_e = opts.aside) == null ? void 0 : _e.rowCheckbox) == null ? void 0 : _f.allowMultiSelect) ?? true,
    searchEnabled: false,
    searchParameter: {
      matchCase: false,
      matchWholeWord: false,
      useRegex: false,
      searchFields: ALL_SELECT_VALUE,
      searchText: ""
    },
    searchMatchInfo: {
      currentMatchIndex: -1,
      matchCount: -1,
      rowIndex: -1,
      cellIndex: -1,
      id: ""
    },
    fieldHeaderGroup: defaultFieldGroupInfo(),
    footer: { height: 0, width: 0 },
    navi: { height: 0, width: 0 },
    toolbar: { height: 0, width: 0 },
    initSettingFlag: false,
    template: {},
    isHeaderResize: false,
    isOpenLayer: false,
    currentFields: [],
    allFieldMap: /* @__PURE__ */ new Map(),
    dataInfo: {
      colLength: 0,
      rowLength: 0,
      asideLength: 0,
      startCol: 0,
      lastRow: 0,
      orginLeafHeaders: [],
      orginLeafHeaderKeyMap: {}
    },
    cellWidths: [],
    rowHeight: Math.max(opts.body.row.height ?? 26, 26),
    enabledSortButton: (_g = opts.header) == null ? void 0 : _g.sort.enabled,
    sort: { orders: [] },
    paging: pagingInfo,
    selection: {},
    focus: false,
    isMoveRow: false,
    isBodyDragging: false,
    isHeaderDragging: false,
    mouseEnter: false,
    currentClickInfo: {},
    allCheck: false,
    settingConfig: {
      viewInitFlag: true,
      filterTemplate: "",
      filterOperatorTemplate: {},
      // filter html template
      searchCheckItem: false,
      // 검색 정규식
      filterCheckItem: false
      // filter info {checkFn, check condition}
    },
    fixedLeftIndex: Math.max(opts.fixedLeftIndex, 0),
    fixedRightIndex: Math.max(opts.fixedRightIndex, 0),
    scroll: initScrollInfo(),
    scrollbarSize: opts.scroll.width ?? 12,
    disableVerticalScroll: ((_i = (_h = opts.scroll) == null ? void 0 : _h.vertical) == null ? void 0 : _i.enabled) === false,
    disableHorizontalScroll: ((_k = (_j = opts.scroll) == null ? void 0 : _j.horizontal) == null ? void 0 : _k.enabled) === false,
    edit: initEditInfo(),
    canvasContext: void 0,
    activeComponent: ""
  };
}
function initSelectionInfo() {
  return {
    id: "",
    range: initSelectionRange(),
    allRange: /* @__PURE__ */ new Map(),
    isSelect: false,
    isMouseDown: false,
    all: false,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
    startCell: { startIdx: -1, startCol: -1 }
  };
}
function initSelectionRange() {
  return {
    modifierKey: -1,
    type: "cell",
    mode: "",
    startIdx: -1,
    endIdx: -1,
    startCol: -1,
    endCol: -1,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1
  };
}
function initScrollInfo() {
  return {
    centerLeftPosition: 0,
    before: {
      startIdx: 0,
      viewRow: 0,
      startCol: 0,
      endCol: 0,
      hideLastRow: false
    },
    top: 0,
    left: 0,
    startCol: 0,
    endCol: 0,
    insideStartCol: 0,
    insideEndCol: 0,
    viewRow: 0,
    insideViewRow: 0,
    startIdx: 0,
    oneColMove: 0,
    oneRowMove: 0,
    vHeight: 0,
    vBarPosition: 0,
    vThumbHeight: 0,
    vTrackHeight: 0,
    hWidth: 0,
    hBarPosition: 0,
    hThumbWidth: 0,
    hTrackWidth: 0,
    enabledVertical: false,
    enabledHorizontal: false,
    verticalScrollTimer: -1,
    horizontalScrollTimer: -1,
    mouseDown: false
  };
}
function defaultFieldGroupInfo() {
  return {
    left: [],
    center: [],
    right: [],
    leaf: [],
    leafLeft: [],
    leafCenter: [],
    leafRight: [],
    heights: [],
    depth: 1
  };
}
function initEditInfo() {
  return {
    enabled: false,
    cell: {
      r: -1,
      c: -1,
      field: {},
      item: {},
      rowIndex: -1
    }
  };
}
const isFixedLeftPostion = (cfg, idx) => {
  return idx < cfg.fixedLeftIndex;
};
const isFixedRightPostion = (cfg, idx) => {
  return cfg.fixedRightIndex > 0 && idx >= cfg.fixedRightIndex;
};
const isMultipleSelectionMode = (selectionMode) => {
  return selectionMode == SelectionModeMap.multiRow || selectionMode == SelectionModeMap.multiCell;
};
const isSingleSelectionMode = (selectionMode) => {
  return selectionMode == SelectionModeMap.cell || selectionMode == SelectionModeMap.row;
};
const isMultipleCellSelectionMode = (selectionMode) => {
  return selectionMode == SelectionModeMap.multiCell;
};
const isRowSelectionMode = (selectionMode) => {
  return selectionMode == SelectionModeMap.multiRow || selectionMode == SelectionModeMap.row;
};
const isCellSelectionMode = (selectionMode) => {
  return selectionMode == SelectionModeMap.multiCell || selectionMode == SelectionModeMap.cell;
};
const getCellInfo = (cfg, cellElement) => {
  const posInfo = getCellPosition(cellElement);
  const rowIndex = cfg.scroll.startIdx + posInfo.r;
  const col = posInfo.c;
  const viewItem = cfg.dataManager.getViewItems()[rowIndex];
  return {
    r: posInfo.r,
    c: col,
    rowIndex,
    field: cfg.currentFields[posInfo.c],
    item: cfg.dataManager.getRowItem(viewItem.id),
    viewItem
  };
};
const getCellPosition = (cellElement) => {
  const posInfo = (getCellPositionAttr(cellElement) ?? "").split(",");
  return {
    r: intValue(posInfo[0]),
    c: intValue(posInfo[1])
  };
};
const getCellPositionAttr = (cellElement) => {
  return cellElement.dataset.cellPosition;
};
const getHeaderCellInfo = (cfg, cellElement) => {
  const col = getHeaderCellPosition(cellElement);
  return {
    c: col,
    field: cfg.currentFields[col]
  };
};
const getHeaderResizeCellInfo = (cfg, cellElement) => {
  const col = intValue(cellElement.dataset.resizeIdx ?? "-1");
  return {
    c: col,
    field: cfg.currentFields[col]
  };
};
const getHeaderCellPosition = (cellElement) => {
  return intValue(cellElement.dataset.headerCellPosition ?? "-1");
};
const getTextWidth = (cfg, text, padding = 10) => {
  var _a;
  if (!text) return padding;
  const metrics = (_a = cfg.canvasContext) == null ? void 0 : _a.measureText(text);
  return ((metrics == null ? void 0 : metrics.width) ?? 0) + padding;
};
const getMaxColumnSize = (cfg, opts, field) => {
  const dataManager = cfg.dataManager;
  const items = dataManager.getViewItems();
  const maxWidth = opts.header.resize.maxWidth;
  let returnMaxWidth = 0;
  const context = cfg.canvasContext;
  const startIdx = cfg.scroll.startIdx;
  let checkWidth = 0;
  for (let i = startIdx, len = Math.min(cfg.dataInfo.rowLength, startIdx + 100); i < len; i++) {
    const tmpVal = field.$renderer.getValue(dataManager.getRowItem(items[i].id));
    if (isEmpty(tmpVal)) continue;
    const metrics = context.measureText(tmpVal);
    checkWidth = Math.max(metrics.width, checkWidth);
    if (maxWidth > 0 && checkWidth >= maxWidth) {
      return maxWidth;
    }
    returnMaxWidth = Math.max(returnMaxWidth, checkWidth);
  }
  return returnMaxWidth + 16;
};
const getCenterContentLeft = (cfg, scrollLeft) => {
  if (scrollLeft < 1) {
    return 0;
  }
  return cfg.dimensions.mainCenterOverWidth * (scrollLeft / (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth) * 100) / 100;
};
const getHorizontalScrollPosition = (cfg, centerGridLeft, direction) => {
  if (centerGridLeft < 1) {
    return 0;
  }
  if (cfg.dimensions.mainCenterOverWidth <= 0) {
    return 0;
  }
  let left;
  if (direction === ScrollDirectionXMap.RIGHT) {
    left = centerGridLeft - cfg.dimensions.mainCenterViewWidth;
  } else {
    left = centerGridLeft - 2;
  }
  return left / cfg.dimensions.mainCenterOverWidth * 100 * (cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth) / 100;
};
const isInputField = (tagName) => {
  return tagName.search(/(input|select|textarea)/i) > -1;
};
const dragVerticalMovePosition = (cfg, moveY, rowHeight, startCellInfo, _t, _b) => {
  const scroll = cfg.scroll;
  const dataInfo = cfg.dataInfo;
  const startIdx = scroll.startIdx;
  const insideViewRow = scroll.insideViewRow;
  const viewRow = scroll.viewRow;
  const rowLength = dataInfo.rowLength;
  let scrollDirectionY = null;
  let rowIdx = -1;
  if (moveY < _t) {
    if (startIdx > 0) {
      scrollDirectionY = ScrollDirectionYMap.UP;
      rowIdx = startIdx - 1;
    } else {
      rowIdx = 0;
    }
    return { scrollDirectionY, rowIdx, viewRowIdx: 0 };
  }
  if (moveY > _b) {
    if (startIdx + insideViewRow < rowLength) {
      scrollDirectionY = ScrollDirectionYMap.DOWN;
      rowIdx = startIdx + insideViewRow + 1;
    } else {
      rowIdx = rowLength - 1;
    }
    return { scrollDirectionY, rowIdx, viewRowIdx: insideViewRow };
  }
  const relativeY = moveY - _t;
  const invRowHeight = 1 / rowHeight;
  const viewRowIdx = relativeY * invRowHeight | 0;
  if (viewRowIdx < viewRow) {
    rowIdx = startIdx + viewRowIdx;
  }
  return { scrollDirectionY, rowIdx, viewRowIdx };
};
const dragHorizontalMovePosition = (cfg, moveX, positionX, _l, _r, beforeEndCol) => {
  let scrollDirectionX = null;
  let overCell = -1;
  const currentFields = cfg.currentFields;
  const totalCells = currentFields.length;
  const startCol = cfg.selection.startCell.startCol;
  let startCellIdx = 0;
  let endCellIdx = totalCells;
  let centerMovePageX = 0;
  let contentLeftVal = 0;
  const { fixedLeftIndex, fixedRightIndex } = cfg;
  if (moveX < _l) {
    centerMovePageX = moveX - positionX;
    endCellIdx = fixedLeftIndex;
    scrollDirectionX = ScrollDirectionXMap.LEFT;
  } else if (moveX > _r) {
    startCellIdx = fixedRightIndex;
    if (startCellIdx > 0) {
      centerMovePageX = moveX - _r;
    } else {
      overCell = totalCells - 1;
    }
    scrollDirectionX = ScrollDirectionXMap.RIGHT;
  } else {
    centerMovePageX = moveX - _l;
    startCellIdx = fixedLeftIndex;
    contentLeftVal = getCenterContentLeft(cfg, cfg.scroll.left);
  }
  if (!(startCellIdx < 1 && scrollDirectionX === ScrollDirectionXMap.RIGHT)) {
    if (centerMovePageX <= 0) {
      overCell = 0;
    } else if (overCell === -1) {
      let leftSum = 0;
      let passedContentLeft = false;
      for (let i = startCellIdx; i < endCellIdx; i++) {
        const colWidth = currentFields[i].$width;
        leftSum += colWidth;
        if ((contentLeftVal <= 0 || passedContentLeft) && leftSum > centerMovePageX) {
          overCell = i;
          break;
        }
        if (!passedContentLeft && leftSum >= contentLeftVal) {
          passedContentLeft = true;
          leftSum = contentLeftVal > 0 && leftSum > contentLeftVal ? leftSum - contentLeftVal : leftSum;
        }
      }
      if (overCell === -1 && leftSum < centerMovePageX) {
        overCell = endCellIdx;
      }
    }
  }
  if (scrollDirectionX === ScrollDirectionXMap.LEFT && (isFixedLeftPostion(cfg, startCol) || cfg.scroll.left == 0) || scrollDirectionX === ScrollDirectionXMap.RIGHT && (isFixedRightPostion(cfg, startCol) || totalCells - (fixedRightIndex > 0 ? totalCells - fixedRightIndex : 0) - 1 == cfg.scroll.insideEndCol)) {
    scrollDirectionX = null;
  }
  overCell = Math.max(overCell, cfg.dataInfo.startCol);
  return { scrollDirectionX, overCell };
};
const getCheckboxMode = (checkLeneth, itemLength) => {
  if (checkLeneth == 0) return "none";
  if (checkLeneth == itemLength) return "all";
  return "partial";
};
const valuesValueKey = (rendererInfo) => {
  var _a;
  return ((_a = rendererInfo == null ? void 0 : rendererInfo.listItem) == null ? void 0 : _a.valueField) ?? "value";
};
const valuesLabelKey = (rendererInfo) => {
  var _a;
  return ((_a = rendererInfo == null ? void 0 : rendererInfo.listItem) == null ? void 0 : _a.labelField) ?? "label";
};
const heightOptionValue = (heightOption, defaultHeight) => {
  let height;
  let heights = [];
  if (isArray(heightOption) && heightOption.length > 0) {
    height = heightOption[0];
    heights = heightOption;
  } else {
    height = !isNumber(heightOption) ? 28 : heightOption;
  }
  return { height, heights };
};
const isSequential = (arr) => {
  const set = new Set(arr);
  if (set.size !== arr.length) return false;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return max - min + 1 === arr.length;
};
const isMouseMoved = (startPos, currentPos, threshold = 5) => {
  const dx = currentPos.x - startPos.x;
  const dy = currentPos.y - startPos.y;
  return dx * dx + dy * dy > threshold * threshold;
};
const escapeCellValue = (value) => {
  if (typeof value !== "string") return value;
  const hasSpecial = /["\n\r\t]/.test(value);
  if (hasSpecial) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
const parseClipboard = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  text = text.replace(/(\r?\n){2}$/, "\n");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && char === "	") {
      row.push(cell);
      cell = "";
    } else if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
};
const isFieldEditable = (cfg, field) => {
  if (!field) return false;
  return field.editable === true || cfg.enabledCellEdit && field.editable !== false;
};
const gridAvailableWidth = (cfg) => {
  const centerMargin = cfg.fixedRightIndex > 0 ? 1 : 2;
  const verticalScrollWidth = cfg.scroll.enabledVertical ? cfg.scrollbarSize + centerMargin : 0;
  return cfg.dimensions.width - verticalScrollWidth - 1;
};
const SCROLL_DIRECTION_CODE = {
  NONE: -1,
  UP: 1,
  DOWN: 2,
  LEFT: 10,
  RIGHT: 20
};
const getScrollDirectionCode = (cfg, scrollInfo, moveRowIdx, moveColIdx) => {
  let directionCode = SCROLL_DIRECTION_CODE.NONE;
  if (moveRowIdx < scrollInfo.startIdx) {
    directionCode = SCROLL_DIRECTION_CODE.UP;
  } else if (moveRowIdx > scrollInfo.startIdx + scrollInfo.viewRow) {
    directionCode = SCROLL_DIRECTION_CODE.DOWN;
  }
  if (!isFixedLeftPostion(cfg, moveColIdx) && !isFixedRightPostion(cfg, moveColIdx)) {
    if (moveColIdx < scrollInfo.insideStartCol) {
      directionCode = Math.max(directionCode, 0) + SCROLL_DIRECTION_CODE.LEFT;
    } else if (moveColIdx > scrollInfo.insideEndCol) {
      directionCode = Math.max(directionCode, 0) + SCROLL_DIRECTION_CODE.RIGHT;
    }
  }
  return directionCode;
};
const getListItemValue = (value, valueDelimiter) => {
  if (isArray(value)) {
    return value;
  } else if (isString(value)) {
    return stringSplit(value, valueDelimiter);
  } else {
    return [String(value)];
  }
};
class CellRenderer {
  constructor(field, gridMain) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
    this.enabledTooltip = gridMain.options().enabledTooltip;
  }
  getClosestCellElement(target) {
    return target.closest(".dg-cell");
  }
  supportsInteraction() {
    return false;
  }
  bindEvents(eventType, cellInfo, element) {
    return false;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return TEXT_ALIGN_STYLE.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @param checkWidth
   * @returns
   */
  getMinWidth(cfg, opts) {
    return getMaxColumnSize(cfg, opts, this.field);
  }
  applyRendererRefState(contentElement, refValue) {
    const isHide = (refValue == null ? void 0 : refValue.hide) ?? false;
    const classList = contentElement.classList;
    if (classList.contains("dg-hide") !== isHide) {
      classList.toggle("dg-hide", isHide);
    }
    if (isHide) return false;
    const isDisabled = (refValue == null ? void 0 : refValue.disabled) ?? false;
    if (classList.contains("dg-disabled") !== isDisabled) {
      classList.toggle("dg-disabled", isDisabled);
    }
  }
}
class EditCellRenderer extends CellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.rendererContainer = this.gridMain.getRendererLayerElement();
    this._editable = isFieldEditable(this.gridMain.config(), field);
  }
  isEditable() {
    return this._editable;
  }
  /**
   * 값 얻기
   *
   * @param {any} value row item
   * @returns {any} field value
   */
  getValue(item, inputValue) {
    return inputValue ?? item[this.field.name] ?? "";
  }
  completeEdit() {
    this.gridMain.setGridFocusIn();
  }
  /**
   * 값 셋팅
   *
   * @public
   * @param {HTMLElement} element cell element
   * @param {any} value row value
   */
  setValue(e, item, value, refresh = true) {
    if (!this.valid(value)) {
      return false;
    }
    if (this.changeEventCall(e, item, value)) {
      const result = this.gridMain.config().dataManager.setChangeValue(item, this.field, value);
      if (!result) {
        return false;
      }
      if (refresh) {
        this.gridMain.getBody().dataDraw("dataChange");
      }
    }
  }
  changeEventCall(e, item, value) {
    const field = this.field;
    const fieldValue = value;
    if (field.editRenderer.change) {
      const changeInfo = {
        field,
        evt: e,
        item: merge({}, item),
        //oldValue: field.$value,
        value: fieldValue
      };
      if (changeInfo.oldValue !== changeInfo.value && field.editRenderer.change.call(null, changeInfo) === false) {
        return false;
      }
    }
    return true;
  }
  tooltip(element, value) {
    if (this.enabledTooltip) {
      element.setAttribute("title", value);
    }
  }
  /**
   * 유효성 검증 html element
   * @returns div element
   */
  getValidatorElement() {
    if (this.validatorElement) {
      return this.validatorElement;
    }
    const div = getLayerElement("div", "dg-validator-message " + FIELD_LAYER_CLASS, "validator");
    this.validatorElement = div;
    this.rendererContainer.appendChild(div);
    return div;
  }
  /**
   * 유효성 메시지 보이기
   *
   * @param result 유효성 검증 결과
   * @param cellElement cell element
   * @returns
   */
  showInvalidMessage(result, cellElement) {
    if (!this.gridMain.config().isOpenLayer) return true;
    const message2 = this.language.validMessage(this.field, result);
    if (message2.length > 0) {
      const element = this.getValidatorElement();
      element.textContent = message2[0];
      const cellRect = getElementRect(cellElement);
      const rendererContainer = getElementRect(this.rendererContainer);
      const style = element.style;
      this.gridMain.openLayer(element);
      style.top = `${cellRect.top - rendererContainer.top - element.offsetHeight}px`;
      style.left = `${cellRect.left - rendererContainer.left}px`;
      return true;
    }
    return false;
  }
  supportsEdit() {
    return true;
  }
}
class CheckboxRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
    this.showLabel = rendererInfo.showLabel ?? false;
  }
  render(cellInfo, element) {
    var _a, _b;
    const val = this.getValue(cellInfo.item, cellInfo.inputValue);
    let choiceElement = element.firstElementChild;
    if (!choiceElement) {
      choiceElement = createHTMLElement("div", "dg-choice", "");
      const itemElement = createHTMLElement("div", "dg-choice-item  dg-checkbox", {
        role: "presentation"
      });
      itemElement.appendChild(createHTMLElement("div", "dg-indicator ", ""));
      choiceElement.appendChild(itemElement);
      if (this.showLabel) {
        const textLabel = document.createElement("span");
        textLabel.className = "dg-cell-content-label dg-ellipsis";
        itemElement.appendChild(textLabel);
      }
      element.appendChild(choiceElement);
      if (this.isEditable()) {
        this.initClick(choiceElement);
      }
    }
    if (val === this.trueValue) {
      (_a = choiceElement.firstElementChild) == null ? void 0 : _a.classList.add(SELECTED_STYLE_CLASS);
    } else {
      (_b = choiceElement.firstElementChild) == null ? void 0 : _b.classList.remove(SELECTED_STYLE_CLASS);
    }
    this.tooltip(choiceElement, val);
    if (this.showLabel) {
      const labelElement = element.querySelector(".dg-cell-content-label");
      if (labelElement) labelElement.textContent = val;
    }
  }
  initClick(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "click" }, (e) => {
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);
      const item = cellInfo.item;
      const val = this.getValue(item, cellInfo.inputValue);
      const checked = val === this.trueValue;
      this.setValue(e, item, !checked ? this.trueValue : this.falseValue);
      this.render(cellInfo, cellElement);
    });
  }
  valid(value) {
    return true;
  }
  supportsInteraction() {
    return true;
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  getMinWidth(cfg, opts) {
    return 50;
  }
}
class CustomEditRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    element.innerHTML = '<input type="text">';
    this.getValue(item, cellInfo.inputValue);
  }
  valid(element) {
    return true;
  }
}
const regexp = {
  mobile: /^\d{3}-\d{3,4}-\d{4}$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  url: /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
  number: /\d$/,
  alpha: /^[a-zA-Z]+$/,
  "alpha-num": /^[a-zA-Z0-9]+$/,
  variable: /^[a-zA-Z0-9_$][a-zA-Z0-9_$]*$/,
  "number-char": /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
  "upper-char": /^(?=.*?[A-Z])(?=.*?[a-z])/,
  "upper-char-special": /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-])/,
  "upper-char-special-number": /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/
};
const regexpValidator = (value, field, result) => {
  var _a;
  if (typeof result === "undefined") {
    result = { name: field.name, constraints: [] };
  }
  const regexpType = (_a = field.editRenderer) == null ? void 0 : _a.regexpType;
  if (regexpType) {
    if (!regexp[regexpType].test(value)) {
      result.regexp = regexpType;
      return result;
    }
  }
  return result;
};
const validator = (value, field, rowItem, gridConfig, result) => {
  var _a, _b;
  const editRenderer = field.editRenderer;
  if (!editRenderer) return null;
  if (editRenderer.validator) {
    result.validator = editRenderer == null ? void 0 : editRenderer.validator(field, rowItem);
    if (typeof result.validator === "object") {
      return result;
    }
  }
  result = regexpValidator(value, field, result);
  if (result.regexp) {
    return result;
  }
  if (editRenderer.different) {
    const diffFieldName = editRenderer.different.field;
    if (gridConfig.allFieldMap.has(diffFieldName) && value == ((_a = gridConfig.allFieldMap.get(diffFieldName)) == null ? void 0 : _a.$renderer.getValue(rowItem))) {
      result.message = editRenderer.different.message;
      return result;
    }
  }
  if (editRenderer.identical) {
    const diffFieldName = editRenderer.identical.field;
    if (gridConfig.allFieldMap.has(diffFieldName) && value == ((_b = gridConfig.allFieldMap.get(diffFieldName)) == null ? void 0 : _b.$renderer.getValue(rowItem))) {
      result.message = editRenderer.identical.message;
      return result;
    }
  }
  return null;
};
const stringValidator = (value, field, rowItem, gridConfig) => {
  const result = { name: field.name, constraints: [] };
  const editRenderer = field.editRenderer;
  if (!editRenderer) {
    return null;
  }
  if (editRenderer.required && isBlank(value)) {
    result.constraints.push(RULES.REQUIRED);
    return result;
  }
  const validResult = validator(value, field, rowItem, gridConfig, result);
  if (validResult !== null) {
    return validResult;
  }
  const rule = editRenderer.rule;
  if (rule) {
    const valueLength = value.length;
    const isMinNumber = isNumber(rule.minLength), isMaxNumber = isNumber(rule.maxLength);
    let minRule = false, maxRule = false;
    if (isMinNumber && valueLength < rule.minLength) {
      minRule = true;
    }
    if (isMaxNumber && valueLength > rule.maxLength) {
      maxRule = true;
    }
    if (isMinNumber && isMaxNumber && (minRule || maxRule)) {
      result.constraints.push(RULES.BETWEEN);
    } else {
      if (minRule) {
        result.constraints.push(RULES.MIN_LENGTH);
      }
      if (maxRule) {
        result.constraints.push(RULES.MAX_LENGTH);
      }
    }
    if (result.constraints.length > 0) {
      return result;
    }
  }
  return null;
};
class TextAbstractRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  initEvt(editElement, item) {
    const { eventManager } = this.gridMain.config();
    eventManager.on({ el: editElement, type: "blur" }, (e) => {
      if (this.isShow) {
        this.setChangeValue(e);
      }
    });
    eventManager.on({ el: editElement, type: "keydown" }, (e) => {
      var _a;
      const key = e.key;
      if (key === "Enter" && ((_a = this.field.editRenderer) == null ? void 0 : _a.type) !== "textarea") {
        this.setChangeValue(e);
      } else if (key === "Escape") {
        this.setChangeValue(e, true);
      }
    });
  }
  getElementValue() {
    return this.editElement.value;
  }
  setChangeValue(e, cancelFlag = false) {
    this.isShow = false;
    if (!cancelFlag) {
      const value = this.getElementValue();
      if (this.setValue(e, this.item, value) === false) {
        this.isShow = true;
        return false;
      }
    }
    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild);
    this.gridMain.hideLayer();
    this.completeEdit();
  }
  valid(value) {
    const result = stringValidator(value, this.field, this.item, this.gridMain.config());
    if (result == null) {
      return true;
    }
    return !this.showInvalidMessage(result, this.cellElement);
  }
  textRender(cellInfo, element, type) {
    const item = cellInfo.item;
    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;
    let editElement = this.editElement;
    if (!editElement) {
      editElement = getLayerElement("input", "dg-edit-input " + FIELD_LAYER_CLASS, cellInfo.c + "");
      editElement.type = type;
      editElement.name = this.field.$uid;
      editElement.setAttribute("autocomplete", "off");
      this.rendererContainer.appendChild(editElement);
      this.editElement = editElement;
      this.initEvt(editElement, item);
    }
    const style = editElement.style;
    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);
    this.isShow = true;
    this.gridMain.openLayer(editElement);
    style.top = `${cellRect.top - rendererContainer.top}px`;
    style.left = `${cellRect.left - rendererContainer.left}px`;
    style.width = `${cellRect.width}px`;
    style.height = `${cellRect.height}px`;
    const value = this.getValue(item, cellInfo.inputValue);
    editElement.value = value;
    editElement.focus();
  }
}
let DateRenderer$1 = class DateRenderer extends TextAbstractRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    this.textRender(cellInfo, element, "date");
  }
};
function normalizeChoiceOptions(list, labelKey, valueKey) {
  const valueLabelMap = /* @__PURE__ */ new Map();
  const isStringValue = isString(list[0]);
  const newList = [];
  for (const item of list) {
    let val;
    let label;
    if (isStringValue) {
      val = item;
      label = item;
      const newItem = {};
      newItem[valueKey] = item;
      newItem[labelKey] = item;
      newList.push(newItem);
    } else {
      val = (item == null ? void 0 : item[valueKey]) ?? "";
      label = (item == null ? void 0 : item[labelKey]) ?? "";
      newList.push(item);
    }
    valueLabelMap.set(val, label);
  }
  return { list: newList, map: valueLabelMap };
}
function bindHideOnBlur(element, eventManager, callback) {
  element.tabIndex = 0;
  element.focus();
  eventManager.off(element, "focusout");
  eventManager.on({ el: element, type: "focusout" }, (e) => {
    element.style.display = "none";
  });
}
function uniqueListItem(list, valueKey) {
  const seen = /* @__PURE__ */ new Set();
  const uniqueArr = list.filter((item) => {
    if (seen.has(item[valueKey])) return false;
    seen.add(item[valueKey]);
    return true;
  });
  return uniqueArr;
}
function updateSelectValues(selectedValues, clickedValue, isMultiple, enabledValues, required) {
  if (!isMultiple) {
    if (required) {
      return [clickedValue];
    }
    return selectedValues.includes(clickedValue) ? [] : [clickedValue];
  }
  if (clickedValue === ALL_SELECT_VALUE) {
    return selectedValues.includes(ALL_SELECT_VALUE) ? [] : [ALL_SELECT_VALUE];
  }
  const enabledSet = new Set(enabledValues);
  const hasAll = enabledSet.has(ALL_SELECT_VALUE);
  const nextValues = selectedValues.includes(ALL_SELECT_VALUE) ? enabledValues.filter((value) => value !== ALL_SELECT_VALUE) : selectedValues.filter((value) => enabledSet.has(value));
  const index = nextValues.indexOf(clickedValue);
  if (index >= 0) {
    nextValues.splice(index, 1);
  } else {
    nextValues.push(clickedValue);
  }
  const selectableCount = hasAll ? enabledValues.length - 1 : enabledValues.length;
  if (nextValues.length === selectableCount) {
    return hasAll ? [ALL_SELECT_VALUE] : [...nextValues];
  }
  return nextValues;
}
function updateDropdownSelection(dropdownElement, listItems, values, valueKey, isAll) {
  var _a;
  if (isAll) {
    addClass(dropdownElement.querySelectorAll(".dg-dropdown-item:not(.disabled)"), SELECTED_STYLE_CLASS);
    return;
  }
  removeClass(dropdownElement.querySelectorAll(`.dg-dropdown-item.${SELECTED_STYLE_CLASS}`), SELECTED_STYLE_CLASS);
  const selectedSet = new Set(values);
  for (let i = 0; i < listItems.length; i++) {
    if (!selectedSet.has(listItems[i][valueKey])) {
      continue;
    }
    (_a = dropdownElement.querySelector(`.dg-dropdown-item[data-index="${i}"]`)) == null ? void 0 : _a.classList.add(SELECTED_STYLE_CLASS);
  }
}
function getLabelsByValue(value, valueDelimiter, valueLabelMap) {
  const valueSet = new Set(isString(value) ? stringSplit(value || "", valueDelimiter) : value);
  if (valueSet.has(ALL_SELECT_VALUE)) {
    return [...valueLabelMap.values()];
  }
  const labels = [];
  for (const val of valueSet) {
    const label = valueLabelMap.get(val);
    if (label !== void 0) {
      labels.push(label);
    }
  }
  return labels;
}
class DropdownEditRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    var _a, _b, _c;
    super(field, gridMain);
    this.listItems = [];
    const rendererInfo = this.field.editRenderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    if (rendererInfo == null ? void 0 : rendererInfo.listItem) {
      this.isMultiple = ((_a = rendererInfo.listItem) == null ? void 0 : _a.multiple) ?? false;
      this.valueDelimiter = ((_b = rendererInfo.listItem) == null ? void 0 : _b.delimiter) ?? ",";
    } else {
      this.valueDelimiter = ",";
      this.isMultiple = false;
    }
    this.required = this.field.editRenderer.required ?? false;
    this.useIncludeAllOption = this.isMultiple && (((_c = rendererInfo.listItem) == null ? void 0 : _c.includeAllOption) ?? true);
  }
  valid(value) {
    return true;
  }
  render(cellInfo, cellElement) {
    var _a;
    if (this.currentEditRow == cellInfo.rowIndex) {
      if (window.getComputedStyle(this.dropdownElement).display == "block") {
        this.dropdownElement.style.display = "none";
        return;
      }
    }
    this.currentCellInfo = cellInfo;
    const colIdx = String(cellInfo.c);
    this.gridMain.config().activeComponent = colIdx;
    this.currentEditRow = cellInfo.rowIndex;
    const eventElement = cellElement.querySelector(".dg-cell-renderer");
    let dropdownElement = this.dropdownElement;
    if (!dropdownElement) {
      const variantClass = getRendererVariantClass(this.field.editRenderer);
      dropdownElement = getLayerElement("div", `dg-dropdown-menu ${FIELD_LAYER_CLASS} ${variantClass}`, colIdx);
      this.rendererContainer.appendChild(dropdownElement);
      this.dropdownElement = dropdownElement;
      this.initDropdownEvt();
    }
    const rendererInfo = this.field.editRenderer;
    const list = (_a = rendererInfo.listItem) == null ? void 0 : _a.list;
    const { labelKey, valueKey } = this;
    const renderDropdown = (items) => {
      const { list: list2 } = normalizeChoiceOptions(items, labelKey, valueKey);
      const listItems = uniqueListItem(list2, valueKey);
      this.listItems = listItems;
      if (this.useIncludeAllOption && listItems.filter((item) => item[valueKey] == ALL_SELECT_VALUE).length < 1) {
        const allItem = {};
        allItem[this.valueKey] = ALL_SELECT_VALUE;
        allItem[this.labelKey] = this.language.getMessage("select.all");
        listItems.unshift(allItem);
      }
      dropdownElement.innerHTML = this.dropdownMenuTemplate(listItems);
      this.openMenu(dropdownElement, eventElement);
      this.setDropItemCheck(this.getValue(cellInfo.item, cellInfo.inputValue));
    };
    if (Array.isArray(list)) {
      renderDropdown(list);
    } else if (isFunction(list)) {
      list(cellInfo, renderDropdown);
    }
  }
  initDropdownEvt() {
    const cfg = this.gridMain.config();
    const dropdownElement = this.dropdownElement;
    const { valueKey, valueDelimiter, isMultiple, required } = this;
    cfg.eventManager.on({ el: dropdownElement, type: "click", selector: ".dg-dropdown-item" }, (e) => {
      const target = e.target;
      const addItemIndex = Number(target.dataset.index || "0");
      if (target.classList.contains("disabled")) {
        return;
      }
      const listItems = this.listItems;
      const cellInfo = this.currentCellInfo;
      const enabledItems = listItems.filter((item) => !item.disabled);
      const enabledValues = enabledItems.map((item) => {
        return item[valueKey];
      });
      const itemValue = this.getValue(cellInfo.item, cellInfo.inputValue);
      const currentValues = getListItemValue(itemValue, valueDelimiter);
      const addItemValue = listItems[addItemIndex][valueKey];
      const selectValues = updateSelectValues(currentValues, addItemValue, isMultiple, enabledValues, required);
      this.setValue(e, cellInfo.item, selectValues.join(valueDelimiter));
      this.setDropItemCheck(selectValues);
      if (!isMultiple) {
        dropdownElement.style.display = "none";
      }
      this.completeEdit();
    });
  }
  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  openMenu(dropdownElement, eventElement) {
    const elementRect = getElementRect(eventElement);
    const menuStyle = dropdownElement.style;
    menuStyle.height = "auto";
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;
    const openPosition = innerLayerPosition(this.rendererContainer, eventElement, dropdownElement);
    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;
  }
  setDropItemCheck(value = "") {
    const values = getListItemValue(value, this.valueDelimiter);
    let isAll = false;
    if (this.useIncludeAllOption) {
      if (values.includes(ALL_SELECT_VALUE)) {
        isAll = true;
      }
    }
    updateDropdownSelection(this.dropdownElement, this.listItems, values, this.valueKey, isAll);
  }
  dropdownMenuTemplate(list) {
    if (!isArray(list) || list.length === 0) return "";
    const { valueKey, labelKey } = this;
    const html2 = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let className = "dg-dropdown-item";
      if (item.disabled) {
        className += " disabled";
      }
      if (item[valueKey] === ALL_SELECT_VALUE) {
        className += " dg-all";
      }
      const labelValue = item[labelKey] ?? "";
      html2.push(`<div data-index="${i}" class="${className}">${replaceXss(String(labelValue))}</div>`);
    }
    return html2.join("");
  }
}
const numberValidator = (value, field, rowItem, gridConfig) => {
  const result = { name: field.name, constraints: [] };
  const numValue = Number(value);
  const editRenderer = field.editRenderer;
  if (!editRenderer) {
    return null;
  }
  if (editRenderer.required && isBlank(value)) {
    result.constraints.push(RULES.REQUIRED);
    return result;
  }
  if (!isNumber(value)) {
    result.constraints.push(RULES.NAN);
    return result;
  }
  if (validator(value, field, rowItem, gridConfig, result) !== null) {
    return result;
  }
  const rule = editRenderer.rule;
  if (rule) {
    const isMinimum = isNumber(rule.minimum), isMaximum = isNumber(rule.maximum);
    let minRule = false, minExclusive = false, maxRule = false, maxExclusive = false;
    if (isMinimum) {
      if (rule.exclusiveMinimum && numValue <= rule.minimum) {
        minExclusive = true;
      } else if (numValue < rule.minimum) {
        minRule = true;
      }
    }
    if (isMaximum) {
      if (rule.exclusiveMaximum && numValue >= rule.maximum) {
        maxExclusive = true;
      } else if (numValue > rule.maximum) {
        maxRule = true;
      }
    }
    if (isMinimum && isMaximum && (minRule || minExclusive || maxRule || maxExclusive)) {
      if (rule.exclusiveMinimum && rule.exclusiveMaximum && (minExclusive || maxExclusive)) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MINMAX);
      } else if (minExclusive) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MIN);
      } else if (maxExclusive) {
        result.constraints.push(RULES.BETWEEN_EXCLUSIVE_MAX);
      } else {
        result.constraints.push(RULES.BETWEEN);
      }
    } else {
      if (minExclusive) {
        result.constraints.push(RULES.EXCLUSIVE_MIN);
      }
      if (maxExclusive) {
        result.constraints.push(RULES.EXCLUSIVE_MAX);
      }
      if (minRule) {
        result.constraints.push(RULES.MIN);
      }
      if (maxRule) {
        result.constraints.push(RULES.MAX);
      }
    }
  }
  if (result.constraints.length > 0) {
    return result;
  }
  return null;
};
class NumberEditRenderer extends TextAbstractRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.editRendererInfo = field.editRenderer ?? {};
  }
  render(cellInfo, element) {
    var _a, _b, _c, _d;
    const item = cellInfo.item;
    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;
    let editElement = this.editElement;
    if (!editElement) {
      editElement = getLayerElement("input", "dg-edit-input " + FIELD_LAYER_CLASS, cellInfo.c + "");
      editElement.type = "number";
      editElement.name = this.field.$uid;
      editElement.setAttribute("autocomplete", "off");
      if ((_a = this.editRendererInfo.rule) == null ? void 0 : _a.minimum) {
        editElement.min = ((_b = this.editRendererInfo.rule) == null ? void 0 : _b.minimum) + "";
      }
      if ((_c = this.editRendererInfo.rule) == null ? void 0 : _c.maximum) {
        editElement.max = ((_d = this.editRendererInfo.rule) == null ? void 0 : _d.maximum) + "";
      }
      this.rendererContainer.appendChild(editElement);
      this.editElement = editElement;
      this.initEvt(editElement, item);
    }
    const style = editElement.style;
    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);
    this.isShow = true;
    this.gridMain.openLayer(editElement);
    style.top = `${cellRect.top - rendererContainer.top}px`;
    style.left = `${cellRect.left - rendererContainer.left}px`;
    style.width = `${cellRect.width}px`;
    style.height = `${cellRect.height}px`;
    editElement.value = this.getValue(item, cellInfo.inputValue);
    editElement.focus();
  }
  valid(value) {
    const result = numberValidator(value, this.field, this.item, this.gridMain.config());
    if (result == null) {
      return true;
    }
    return !this.showInvalidMessage(result, this.cellElement);
  }
}
class PasswordEditRenderer extends TextAbstractRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    this.textRender(cellInfo, element, "password");
  }
}
class RangeRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    element.innerHTML = '<input type="range">';
    this.getValue(item, cellInfo.inputValue);
  }
  valid(element) {
    return true;
  }
}
let SwitchRenderer$1 = class SwitchRenderer extends EditCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
    this.showLabel = rendererInfo.showLabel ?? false;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }
  render(cellInfo, element) {
    const val = this.getValue(cellInfo.item, cellInfo.inputValue);
    let slider = element.firstElementChild;
    if (!slider) {
      slider = document.createElement("div");
      slider.className = "dg-slider";
      if (this.showLabel) {
        const label = document.createElement("span");
        label.className = "dg-slider-label";
        slider.appendChild(label);
      }
      element.appendChild(slider);
      if (this.isEditable()) {
        this.initClick(slider);
      }
    }
    this.tooltip(slider, val);
    this.toggle(slider, val);
  }
  toggle(sliderElement, value) {
    const checked = value === this.trueValue;
    if (this.showLabel) {
      const labelElement = sliderElement.querySelector(".dg-slider-label");
      if (labelElement) labelElement.textContent = (checked ? this.trueValue : this.falseValue) + "";
    }
    sliderElement.classList.toggle("dg-checked", checked);
  }
  initClick(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "click" }, (e) => {
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);
      const checked = !hasClass(contentElement, "dg-checked");
      this.toggle(contentElement, checked);
      const item = cellInfo.item;
      this.setValue(e, item, checked ? this.trueValue : this.falseValue);
      this.render(cellInfo, cellElement);
    });
  }
  valid(value) {
    return true;
  }
  supportsInteraction() {
    return true;
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  getMinWidth(cfg, opts) {
    return 50;
  }
};
class TextAreaRenderer extends TextAbstractRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.editRendererInfo = field.editRenderer ?? {};
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;
    let textareaElement = this.textareaElement;
    if (!textareaElement) {
      textareaElement = getLayerElement(
        "textarea",
        "dg-edit-textarea " + FIELD_LAYER_CLASS,
        cellInfo.c + ""
      );
      textareaElement.rows = 3;
      textareaElement.name = this.field.$uid;
      this.rendererContainer.appendChild(textareaElement);
      this.textareaElement = textareaElement;
      this.initEvt(textareaElement, item);
    }
    const style = textareaElement.style;
    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);
    this.isShow = true;
    this.gridMain.openLayer(textareaElement);
    style.top = `${cellRect.top - rendererContainer.top}px`;
    style.left = `${cellRect.left - rendererContainer.left}px`;
    style.width = `${cellRect.width}px`;
    style.height = `${cellRect.height}px`;
    const value = this.getValue(item, cellInfo.inputValue);
    textareaElement.value = value;
    textareaElement.focus();
  }
  getElementValue() {
    return this.textareaElement.value;
  }
  valid(value) {
    return true;
  }
}
class TextEditRenderer extends TextAbstractRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    this.textRender(cellInfo, element, "text");
  }
}
function formatNumber(value, format) {
  const numberPatternRegex = /[0,.]+/;
  const numberPatternMatch = numberPatternRegex.exec(format);
  if (!numberPatternMatch) return format;
  const numberPattern = numberPatternMatch[0];
  const prefix = format.slice(0, format.indexOf(numberPattern));
  const suffix = format.slice(format.indexOf(numberPattern) + numberPattern.length);
  const [intFmt, decFmt] = numberPattern.split(".");
  const useComma = intFmt.includes(",");
  let result = "";
  if (decFmt) {
    const rounded = value.toFixed(decFmt.length);
    const [intPart, decPart] = rounded.split(".");
    const trimmedDec = decPart.replace(/0+$/, "");
    result = useComma ? addComma(intPart) : intPart;
    if (trimmedDec.length > 0) {
      result += "." + trimmedDec;
    }
  } else {
    const rounded = Math.round(value).toString();
    result = useComma ? addComma(rounded) : rounded;
  }
  return `${prefix}${result}${suffix}`;
}
function addComma(numStr) {
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatValue(value, displayFormat) {
  const type = displayFormat.type;
  if (type == "number" && !isNaN(value)) {
    return formatNumber(value, displayFormat.format ?? "0,0");
  }
  return value;
}
class ViewCellRenderer extends CellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.isClick = false;
    this.cfg = this.gridMain.config();
    const refValue = field.renderer.refValue;
    this.isRefFunction = isFunction(refValue);
    this.isRefString = isString(refValue);
    this.isVauleFunction = isFunction(field.getValue);
    if (this.isRefString || this.isRefFunction) {
      this.refValue = refValue;
    } else {
      this.refValue = refValue ?? {};
    }
    this.isClick = isFunction(this.field.renderer.click);
  }
  getRefValue(value, rowItem) {
    if (this.isRefFunction) {
      return this.refValue.call(null, this.field, value, rowItem);
    }
    if (this.isRefString) return { label: this.refValue };
    return this.refValue[value];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(rowItem) {
    var _a, _b;
    const val = rowItem[this.fieldName];
    if (this.isVauleFunction) {
      return (_b = (_a = this.field).getValue) == null ? void 0 : _b.call(_a, { field: this.field, item: rowItem });
    }
    if (this.field.displayFormat) {
      return formatValue(val, this.field.displayFormat);
    }
    if (isBlank(val) && !isBlank(this.field.defaultValue)) {
      return this.field.defaultValue;
    }
    return val;
  }
  tooltip(element, value) {
    if (this.enabledTooltip) {
      element.setAttribute("title", value);
    }
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(e, eventElement, cellInfo) {
    var _a;
    if (this.isClick) {
      (_a = this.field.renderer.click) == null ? void 0 : _a.call(null, cellInfo);
    }
  }
  /**
   * 랜더러가 editor 랜더러 인지 여부
   *
   * @returns {boolean}
   */
  supportsEdit() {
    return false;
  }
  isClickEnabled() {
    return this.isClick;
  }
}
class AsideLineNumberRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    var _a;
    const viewItem = cellInfo.viewItem;
    if (this.cfg.dataManager.getDataType() === "group" && viewItem) {
      const viewItems = this.cfg.dataManager.getViewItems();
      const viewItemIndex = viewItems.findIndex((item) => item.id === viewItem.id);
      if (viewItemIndex > -1) {
        const pagingStartIdx = ((_a = this.gridMain.options().footer.paging) == null ? void 0 : _a.enabled) ? (this.cfg.paging.page - 1) * this.cfg.paging.pageSize : 0;
        element.textContent = String(pagingStartIdx + viewItemIndex + 1);
        return;
      }
    }
    element.textContent = String(cellInfo.rowIndex + 1);
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
}
class AsideModifyInfoRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const cudValue = item[ROW_FIELD.CUD];
    if (cudValue == ItemStatusMap.CREATE) {
      element.textContent = "C";
      return;
    }
    if (cudValue == ItemStatusMap.MODIFY) {
      element.textContent = "M";
      return;
    }
    if (cudValue == ItemStatusMap.DELETE) {
      element.textContent = "D";
      return;
    }
    element.textContent = "";
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
}
class AsideRowCheckRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    var _a, _b, _c;
    super(field, gridMain);
    this.allowMultiSelect = ((_c = (_b = (_a = this.gridMain.options()) == null ? void 0 : _a.aside) == null ? void 0 : _b.rowCheckbox) == null ? void 0 : _c.allowMultiSelect) ?? true;
  }
  render(cellInfo, element) {
    var _a, _b;
    const item = cellInfo.item;
    const isMulti = this.allowMultiSelect;
    let choiceElement = element.firstElementChild;
    if (!choiceElement) {
      choiceElement = createHTMLElement("div", "dg-choice", "");
      const itemElement = createHTMLElement("div", "dg-choice-item " + (isMulti ? "dg-checkbox" : "dg-radio"), {
        role: "presentation"
      });
      itemElement.appendChild(createHTMLElement("div", "dg-indicator ", ""));
      choiceElement.appendChild(itemElement);
      element.appendChild(choiceElement);
      this.initClick(itemElement);
    }
    if (this.cfg.dataManager.isItemChecked(item[ROW_FIELD.ID])) {
      (_a = choiceElement.firstElementChild) == null ? void 0 : _a.classList.add(SELECTED_STYLE_CLASS);
    } else {
      (_b = choiceElement.firstElementChild) == null ? void 0 : _b.classList.remove(SELECTED_STYLE_CLASS);
    }
  }
  initClick(contentElement) {
    var _a, _b;
    const cfg = this.gridMain.config();
    const allowMultiSelect = this.allowMultiSelect;
    const clickFn = (_b = (_a = this.gridMain.options().aside) == null ? void 0 : _a.rowCheckbox) == null ? void 0 : _b.click;
    cfg.eventManager.on({ el: contentElement, type: "click" }, (e) => {
      var _a2;
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);
      const checked = cfg.dataManager.isItemChecked(((_a2 = cellInfo.viewItem) == null ? void 0 : _a2.id) ?? "");
      if (clickFn && clickFn(checked) === false) {
        return;
      }
      if (allowMultiSelect) {
        this.multipleRowCheck(contentElement, cellInfo, checked);
      } else {
        this.singleRowCheck(contentElement, cellInfo, checked);
      }
    });
  }
  /**
   * 단일 선택(Row Checkbox) 처리
   *
   * 다른 Row의 체크를 모두 해제한 후 현재 Row만 체크
   *
   * @param contentElement 체크박스 요소
   * @param cellInfo 현재 Cell 정보
   * @param currentChecked 현재 체크 여부
   */
  singleRowCheck(contentElement, cellInfo, currentChecked) {
    var _a;
    this.gridMain.getBody().setItemChecked(((_a = cellInfo.viewItem) == null ? void 0 : _a.id) ?? "", true);
  }
  /**
   * 다중 선택(Row Checkbox) 처리
   *
   * 현재 Row의 체크 상태를 토글
   *
   * @param contentElement 체크박스 요소
   * @param cellInfo 현재 Cell 정보
   * @param currentChecked 현재 체크 여부
   */
  multipleRowCheck(contentElement, cellInfo, currentChecked) {
    var _a;
    const checked = !currentChecked;
    this.gridMain.getBody().addItemChecked(((_a = cellInfo.viewItem) == null ? void 0 : _a.id) ?? "", checked);
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
}
class AsideRowDragHandleRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    if (!element.classList.contains("dg-row-drag-handle")) {
      element.classList.add("dg-row-drag-handle");
    }
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  supportsEdit() {
    return false;
  }
}
class BarRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    var _a, _b;
    super(field, gridMain);
    this.min = ((_a = field.renderer.rule) == null ? void 0 : _a.minimum) ?? 0;
    this.max = ((_b = field.renderer.rule) == null ? void 0 : _b.maximum) ?? 100;
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const fieldValue = this.getValue(item);
    const refValue = this.getRefValue(fieldValue, item);
    const min = this.min;
    const max = this.max;
    let percent = fieldValue;
    let label = fieldValue;
    if (refValue) {
      percent = (refValue == null ? void 0 : refValue.percent) ?? 0;
      label = refValue == null ? void 0 : refValue.label;
    }
    let text = element.querySelector(".dg-bar-label");
    let bar = element.querySelector(".dg-bar-fill");
    if (!text) {
      text = document.createElement("span");
      text.className = "dg-bar-label";
      element.appendChild(text);
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "dg-bar-fill";
      element.appendChild(bar);
    }
    bar.classList.remove("dg-positive", "dg-negative");
    if (percent > 0) {
      bar.classList.add("dg-positive");
    } else if (percent < 0) {
      bar.classList.add("dg-negative");
    }
    let width = 0;
    let left = 0;
    if (min < 0 && max > 0) {
      const total = Math.abs(min) + Math.abs(max);
      const p = Math.max(min, Math.min(max, percent));
      const zeroPoint = Math.abs(min) / total * 100;
      width = Math.abs(p) / total * 100;
      left = p >= 0 ? zeroPoint : zeroPoint - width;
    } else if (min >= 0) {
      const range = max - min;
      const p = Math.max(min, Math.min(max, percent));
      width = (p - min) / range * 100;
      left = 0;
    } else {
      const range = Math.abs(min - max);
      const p = Math.max(min, Math.min(max, percent));
      width = Math.abs(p - max) / range * 100;
      left = 100 - width;
    }
    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;
    if (text.textContent !== label) {
      text.textContent = label;
    }
  }
  getMinWidth(cfg, opts) {
    return 50;
  }
}
const viewRendererClickEvent = (cfg, contentElement, context) => {
  if (!context.isClickEnabled()) return;
  cfg.eventManager.on({ el: contentElement, type: "pointerdown" }, (e) => {
    stopPreventCancel(e);
    const eventElement = e.target;
    const cellElement = context.getClosestCellElement(eventElement);
    const cellInfo = getCellInfo(cfg, cellElement);
    context.click(e, cellElement, cellInfo);
  });
};
let ButtonRenderer$1 = class ButtonRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    let btnElement = element.firstElementChild;
    if (!btnElement) {
      btnElement = document.createElement("span");
      btnElement.className = "dg-cell-content";
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    if (this.applyRendererRefState(btnElement, refValue) === false) {
      return;
    }
    let buttonLabel;
    if (refValue) {
      buttonLabel = (refValue == null ? void 0 : refValue.label) ?? refValue;
    } else {
      buttonLabel = value;
    }
    if (btnElement.textContent !== buttonLabel) {
      btnElement.textContent = buttonLabel;
    }
  }
  initEvent(contentElement) {
    viewRendererClickEvent(this.gridMain.config(), contentElement, this);
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  supportsEdit() {
    return false;
  }
};
let DropdownRenderer$1 = class DropdownRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    var _a, _b;
    super(field, gridMain);
    this.listItems = [];
    const editInfo = this.field.editRenderer;
    const labelKey = valuesLabelKey(editInfo);
    const valueKey = valuesValueKey(editInfo);
    if (editInfo == null ? void 0 : editInfo.listItem) {
      this.valueDelimiter = ((_a = editInfo.listItem) == null ? void 0 : _a.delimiter) ?? ",";
      const list = (_b = editInfo.listItem) == null ? void 0 : _b.list;
      if (isArray(list)) {
        const reval = normalizeChoiceOptions(list, labelKey, valueKey);
        this.listItems = reval.list;
        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result) => {
          const reval = normalizeChoiceOptions(result, labelKey, valueKey);
          this.listItems = reval.list;
          this.valueLabelMap = reval.map;
        });
      }
    } else {
      this.valueDelimiter = ",";
      this.valueLabelMap = /* @__PURE__ */ new Map();
    }
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    let contentElement = element.firstElementChild;
    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.className = "dg-cell-content";
      const text = document.createElement("div");
      text.className = "dg-cell-content-label " + this.field.$alignStyle;
      const icon = document.createElement("div");
      icon.className = "dg-cell-content-icon";
      contentElement.appendChild(text);
      contentElement.appendChild(icon);
      element.appendChild(contentElement);
      this.initEvent(contentElement);
    }
    const textElement = contentElement.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(contentElement, refValue) === false) {
      return;
    }
    let textContent = "";
    if (refValue) {
      textContent = refValue.label ?? (isString(refValue) ? refValue : "");
    } else {
      let viewLabel = value;
      if (this.valueLabelMap.size > 0) {
        let labels = this.getLabel(value);
        if (labels.length < 1 && this.field.defaultValue) {
          labels = this.getLabel(this.field.defaultValue);
        }
        viewLabel = labels.join(this.valueDelimiter);
      }
      textContent = viewLabel;
    }
    this.tooltip(textElement, textContent);
    textElement.textContent = textContent;
  }
  getLabel(value) {
    return getLabelsByValue(value, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(contentElement) {
    this.cfg.eventManager.on({ el: contentElement, type: "click" }, (e) => {
      const eventElement = e.target;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(this.cfg, cellElement);
      this.click(e, cellElement, cellInfo);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(e, cellElement, cellInfo) {
    this.field.$editRenderer.render(cellInfo, cellElement);
  }
  supportsEdit() {
    return true;
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  getMinWidth(cfg, opts) {
    return 70;
  }
};
let HiddenRenderer$1 = class HiddenRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
  }
};
let HtmlRenderer$1 = class HtmlRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    if (refValue) {
      const template = refValue;
      if (isHTMLElement(template)) {
        const oldEl = element.firstChild;
        if (oldEl) {
          element.replaceChild(template, oldEl);
        } else {
          element.appendChild(template);
        }
      } else {
        element.innerHTML = template;
      }
    } else {
      element.innerHTML = value;
    }
  }
  getMinWidth(cfg, opts) {
    return 60;
  }
};
class ImageRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    const labelText = (refValue == null ? void 0 : refValue.label) ?? null;
    const src = (refValue == null ? void 0 : refValue.src) ?? value;
    const alt = (refValue == null ? void 0 : refValue.alt) ?? "";
    let img = element.querySelector("img.dg-cell-content");
    let label = element.querySelector("span.dg-cell-content-label");
    if (!img) {
      img = document.createElement("img");
      img.className = "dg-cell-content";
      element.appendChild(img);
    }
    if (img.src !== src) img.src = src;
    if (alt && img.alt !== alt) img.alt = alt;
    if (labelText) {
      if (!label) {
        label = document.createElement("span");
        label.className = "dg-cell-content-label";
        element.appendChild(label);
      }
      if (label.textContent !== labelText) {
        label.textContent = labelText;
        this.tooltip(element, labelText);
      }
    } else if (label) {
      label.remove();
      this.tooltip(element, "");
    }
  }
  getMinWidth(cfg, opts) {
    return 60;
  }
}
let LinkRenderer$1 = class LinkRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    let aElement = element.firstElementChild;
    if (!aElement) {
      aElement = document.createElement("a");
      aElement.className = "dg-cell-content";
      element.appendChild(aElement);
      this.initEvent(aElement);
    }
    aElement.href = "javascript:void(0);";
    const href = (refValue == null ? void 0 : refValue.href) ?? value;
    const target = (refValue == null ? void 0 : refValue.target) ?? "_blank";
    const label = (refValue == null ? void 0 : refValue.label) ?? value;
    if (this.applyRendererRefState(aElement, refValue) === false) {
      return;
    }
    if (!this.isClick && refValue) {
      aElement.href = href;
      aElement.target = target;
    } else {
      aElement.removeAttribute("target");
    }
    aElement.textContent = label;
    this.tooltip(aElement, label);
  }
  initEvent(contentElement) {
    viewRendererClickEvent(this.gridMain.config(), contentElement, this);
  }
};
let NumberRenderer$1 = class NumberRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const renderValue = this.getValue(item);
    if (element.textContent !== renderValue) {
      element.textContent = renderValue;
      this.tooltip(element, renderValue);
    }
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.right;
  }
  supportsEdit() {
    return true;
  }
};
class PasswordRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    const masked = "********";
    if (element.textContent !== masked) {
      element.textContent = masked;
    }
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.center;
  }
  supportsEdit() {
    return true;
  }
}
class SparklineRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.rendererTooltip = null;
    this.rendererTooltipStates = /* @__PURE__ */ new WeakMap();
    this.dataIds = /* @__PURE__ */ new WeakMap();
    this.dataIdSequence = 0;
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    const data = refValue.value;
    if (!Array.isArray(data) || data.length === 0) {
      const canvas2 = element.firstElementChild;
      if (canvas2) {
        canvas2.remove();
      }
      this.hideTooltip();
      return;
    }
    const cellElement = this.getClosestCellElement(element);
    const rect = getElementRect(cellElement);
    const width = Math.max(0, Math.floor(rect.width - CELL_PADDING.horizontal));
    const height = Math.max(0, Math.floor(rect.height - CELL_PADDING.vertical));
    if (width <= 0 || height <= 0) {
      return;
    }
    let canvas = element.firstElementChild;
    if (!canvas || canvas.tagName !== "CANVAS") {
      canvas = document.createElement("canvas");
      element.replaceChildren(canvas);
    }
    const resized = canvas.width !== width || canvas.height !== height;
    if (resized) {
      canvas.width = width;
      canvas.height = height;
    }
    this.bindTooltip(canvas, data, width);
    const state = canvas.dataset;
    const dataId = this.getDataId(data);
    if (!resized && state.dataId === dataId && state.dataLength === String(data.length)) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    let min = data[0];
    let max = data[0];
    for (let i = 1; i < data.length; i++) {
      const value2 = data[i];
      if (value2 < min) {
        min = value2;
      }
      if (value2 > max) {
        max = value2;
      }
    }
    const range = max - min || 1;
    const xPadding = 5;
    const yPadding = 5;
    const graphWidth = Math.max(0, width - xPadding * 2);
    const graphHeight = Math.max(0, height - yPadding * 2);
    const lastIndex = data.length - 1;
    const step = lastIndex > 0 ? graphWidth / lastIndex : 0;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#007acc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      const x = xPadding + i * step;
      const y = yPadding + (1 - (val - min) / range) * graphHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      const x = xPadding + i * step;
      const y = yPadding + (1 - (val - min) / range) * graphHeight;
      if (val === max) {
        ctx.fillStyle = "#28a745";
      } else if (val === min) {
        ctx.fillStyle = "#dc3545";
      } else if (i === 0 || i === lastIndex) {
        ctx.fillStyle = "#0000ff";
      } else {
        ctx.fillStyle = "#ff9900";
      }
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    state.dataId = dataId;
    state.dataLength = String(data.length);
  }
  /**
   * Canvas에 tooltip 이벤트를 한 번만 등록한다.
   *
   * Canvas가 Grid에 의해 재사용되는 경우에도
   * 최신 data를 사용하도록 TooltipState를 갱신한다.
   */
  bindTooltip(canvas, data, width) {
    let state = this.rendererTooltipStates.get(canvas);
    if (!state) {
      state = {
        data,
        width
      };
      this.rendererTooltipStates.set(canvas, state);
      canvas.addEventListener("mousemove", (event) => {
        this.handleTooltipMouseMove(canvas, event);
      });
      canvas.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
      return;
    }
    state.data = data;
    state.width = width;
  }
  /**
   * Tooltip mouse move 처리
   */
  handleTooltipMouseMove(canvas, event) {
    const state = this.rendererTooltipStates.get(canvas);
    if (!state || state.data.length === 0) {
      this.hideTooltip();
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const xPadding = 5;
    const graphWidth = state.width - xPadding * 2;
    if (graphWidth <= 0) {
      this.hideTooltip();
      return;
    }
    if (mouseX < xPadding || mouseX > state.width - xPadding) {
      this.hideTooltip();
      return;
    }
    const ratio = (mouseX - xPadding) / graphWidth;
    const lastIndex = state.data.length - 1;
    const index = Math.max(0, Math.min(lastIndex, Math.round(ratio * lastIndex)));
    const value = state.data[index];
    this.showTooltip(event.clientX, event.clientY, String(value));
  }
  /**
   * Tooltip 표시
   *
   * Renderer당 tooltip DOM 하나만 생성하여 재사용한다.
   */
  showTooltip(x, y, value) {
    if (!this.rendererTooltip) {
      this.rendererTooltip = document.createElement("div");
      this.rendererTooltip.style.cssText = `
        position: fixed;
        z-index: 99999;
        padding: 4px 7px;
        background: #333;
        color: #fff;
        border-radius: 3px;
        font-size: 12px;
        line-height: 1.2;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      `;
      document.body.appendChild(this.rendererTooltip);
    }
    this.rendererTooltip.textContent = value;
    this.rendererTooltip.style.left = `${x + 10}px`;
    this.rendererTooltip.style.top = `${y + 10}px`;
    this.rendererTooltip.style.display = "block";
  }
  /**
   * Tooltip 숨김
   */
  hideTooltip() {
    if (this.rendererTooltip) {
      this.rendererTooltip.style.display = "none";
    }
  }
  getDataId(data) {
    let id = this.dataIds.get(data);
    if (!id) {
      id = String(++this.dataIdSequence);
      this.dataIds.set(data, id);
    }
    return id;
  }
  getMinWidth(cfg, opts) {
    return 60;
  }
}
class SparklineRendererBar extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.rendererTooltip = null;
    this.rendererTooltipStates = /* @__PURE__ */ new WeakMap();
    this.dataIds = /* @__PURE__ */ new WeakMap();
    this.dataIdSequence = 0;
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    const data = refValue == null ? void 0 : refValue.value;
    if (!Array.isArray(data) || data.length === 0) {
      element.replaceChildren();
      this.hideTooltip();
      return;
    }
    const cellElement = this.getClosestCellElement(element);
    const rect = getElementRect(cellElement);
    const width = Math.max(0, Math.floor(rect.width - CELL_PADDING.horizontal));
    const height = Math.max(0, Math.floor(rect.height - CELL_PADDING.vertical));
    if (width <= 0 || height <= 0) {
      return;
    }
    let canvas = element.firstElementChild;
    if (!canvas || canvas.tagName !== "CANVAS") {
      canvas = document.createElement("canvas");
      element.replaceChildren(canvas);
    }
    const resized = canvas.width !== width || canvas.height !== height;
    if (resized) {
      canvas.width = width;
      canvas.height = height;
    }
    const barWidth = width / data.length;
    this.bindTooltip(canvas, data, width, barWidth);
    const state = canvas.dataset;
    const dataId = this.getDataId(data);
    if (!resized && state.dataId === dataId && state.dataLength === String(data.length)) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    let min = data[0];
    let max = data[0];
    for (let i = 1; i < data.length; i++) {
      const value2 = data[i];
      if (value2 < min) {
        min = value2;
      }
      if (value2 > max) {
        max = value2;
      }
    }
    const range = max - min || 1;
    const yPadding = 5;
    const graphHeight = Math.max(0, height - yPadding * 2);
    ctx.clearRect(0, 0, width, height);
    const lastIndex = data.length - 1;
    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      const x = i * barWidth;
      const barHeight = (val - min) / range * graphHeight;
      const y = height - barHeight - yPadding;
      if (val === max) {
        ctx.fillStyle = "#28a745";
      } else if (val === min) {
        ctx.fillStyle = "#dc3545";
      } else if (i === 0 || i === lastIndex) {
        ctx.fillStyle = "#0000ff";
      } else {
        ctx.fillStyle = "#ff9900";
      }
      const drawWidth = Math.max(1, barWidth - 2);
      ctx.fillRect(x + 1, y, drawWidth, barHeight);
    }
    state.dataId = dataId;
    state.dataLength = String(data.length);
  }
  /**
   * Canvas tooltip 이벤트 등록
   *
   * Canvas가 재사용되어도 이벤트를 중복 등록하지 않는다.
   */
  bindTooltip(canvas, data, width, barWidth) {
    let state = this.rendererTooltipStates.get(canvas);
    if (!state) {
      state = {
        data,
        width,
        barWidth
      };
      this.rendererTooltipStates.set(canvas, state);
      canvas.addEventListener("mousemove", (event) => {
        this.handleTooltipMouseMove(canvas, event);
      });
      canvas.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
      return;
    }
    state.data = data;
    state.width = width;
    state.barWidth = barWidth;
  }
  /**
   * Bar tooltip 처리
   */
  handleTooltipMouseMove(canvas, event) {
    const state = this.rendererTooltipStates.get(canvas);
    if (!state || state.data.length === 0) {
      this.hideTooltip();
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    if (mouseX < 0 || mouseX > state.width) {
      this.hideTooltip();
      return;
    }
    const index = Math.floor(mouseX / state.barWidth);
    if (index < 0 || index >= state.data.length) {
      this.hideTooltip();
      return;
    }
    const value = state.data[index];
    this.showTooltip(event.clientX, event.clientY, String(value));
  }
  /**
   * Tooltip 표시
   */
  showTooltip(x, y, value) {
    if (!this.rendererTooltip) {
      this.rendererTooltip = document.createElement("div");
      this.rendererTooltip.style.cssText = `
        position: fixed;
        z-index: 99999;
        padding: 4px 7px;
        background: #333;
        color: #fff;
        border-radius: 3px;
        font-size: 12px;
        line-height: 1.2;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      `;
      document.body.appendChild(this.rendererTooltip);
    }
    this.rendererTooltip.textContent = value;
    this.rendererTooltip.style.left = `${x + 10}px`;
    this.rendererTooltip.style.top = `${y + 10}px`;
    this.rendererTooltip.style.display = "block";
  }
  /**
   * Tooltip 숨김
   */
  hideTooltip() {
    if (this.rendererTooltip) {
      this.rendererTooltip.style.display = "none";
    }
  }
  /**
   * Array reference 기반 ID
   *
   * 같은 배열 reference를 사용하는 동안
   * Canvas redraw를 방지한다.
   *
   * 주의:
   * 배열 자체를 mutate하는 경우에는
   * 변경을 감지하지 못한다.
   */
  getDataId(data) {
    let id = this.dataIds.get(data);
    if (!id) {
      id = String(++this.dataIdSequence);
      this.dataIds.set(data, id);
    }
    return id;
  }
  getMinWidth(cfg, opts) {
    return 60;
  }
}
let TextRenderer$1 = class TextRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.initializedElements = /* @__PURE__ */ new WeakSet();
  }
  render(cellInfo, element) {
    const item = cellInfo.item;
    const renderValue = this.getValue(item);
    if (element.textContent !== renderValue) {
      element.textContent = renderValue;
      this.tooltip(element, renderValue);
    }
    if (!this.initializedElements.has(element)) {
      this.initEvent(element);
      this.initializedElements.add(element);
    }
  }
  supportsEdit() {
    return true;
  }
  initEvent(contentElement) {
    viewRendererClickEvent(this.gridMain.config(), contentElement, this);
  }
};
class TreeRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    var _a;
    super(field, gridMain);
    this.iconState = /* @__PURE__ */ new WeakMap();
    const opts = this.gridMain.options();
    this.treeNodeIconClass = (_a = opts.tree) == null ? void 0 : _a.treeNodeIconClass;
    this.treeDataManager = this.cfg.dataManager;
  }
  /**
   * 트리 노드를 렌더링합니다.
   * @param cellInfo 셀 정보
   * @param element 셀 엘리먼트
   */
  render(cellInfo, element) {
    const viewItem = cellInfo.viewItem;
    const item = cellInfo.item;
    const renderValue = this.getValue(item);
    const depth = viewItem.depth;
    const hasChildren = !viewItem.isLeaf;
    const expanded = viewItem.expanded > 0;
    let contentElement = element.firstElementChild;
    let expander = element.querySelector(".dg-cell-content-expander");
    let icon = element.querySelector(".dg-cell-content-icon");
    let title = element.querySelector(".dg-cell-content-title");
    if (!contentElement) {
      contentElement = createHTMLElement("div", "dg-cell-content");
      expander = createHTMLElement("span", "dg-cell-content-expander dg-icon");
      icon = createHTMLElement("span", "dg-cell-content-icon dg-icon");
      title = createHTMLElement("span", "dg-cell-content-title");
      contentElement.appendChild(expander);
      contentElement.appendChild(icon);
      contentElement.appendChild(title);
      element.appendChild(contentElement);
      this.initExpanderEvent(expander);
    }
    const expanderClassList = expander.classList;
    const iconClassList = icon.classList;
    if (hasChildren) {
      iconClassList.remove("dg-file");
      iconClassList.add("dg-folder");
      expanderClassList.remove("dg-invisible");
      expanderClassList.toggle("expanded", expanded);
    } else {
      iconClassList.remove("dg-folder");
      iconClassList.add("dg-file");
      expanderClassList.add("dg-invisible");
    }
    if (this.treeNodeIconClass) {
      const next = this.treeNodeIconClass(item, renderValue) ?? "";
      const prev = this.iconState.get(icon) ?? "";
      if (prev !== next) {
        if (prev) iconClassList.remove(...prev.split(/\s+/));
        if (next) iconClassList.add(...next.split(/\s+/));
        this.iconState.set(icon, next);
      }
    }
    contentElement.style.paddingLeft = `${depth * 16}px`;
    title.textContent = renderValue;
    this.tooltip(element, renderValue);
  }
  initExpanderEvent(expander) {
    const cfg = this.cfg;
    cfg.eventManager.on({ el: expander, type: "pointerdown" }, (e) => {
      const eventElement = e.target;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(cfg, cellElement);
      this.toggle(cellInfo);
    });
  }
  toggle(cellInfo) {
    this.treeDataManager.toggleRow(cellInfo.item[ROW_FIELD.ID]);
    this.gridMain.refreshBody(true, "treeExpander");
  }
  bindEvents(eventType, cellInfo, element) {
    if (!this.treeDataManager.getViewItems()[cellInfo.rowIndex].isLeaf) {
      this.toggle(cellInfo);
      return true;
    }
    return false;
  }
  alignStyle() {
    return TEXT_ALIGN_STYLE.left;
  }
  supportsEdit() {
    return true;
  }
  getMinWidth(cfg, opts) {
    return 80;
  }
}
class ViewCustomRenderer extends ViewCellRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(cellInfo, element) {
    element.innerHTML = '<input type="text">';
  }
}
class ToolBarRenderer {
  constructor(field, gridMain) {
    this.isClick = false;
    this.enabledView = true;
    this.isInit = false;
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
    this.cfg = this.gridMain.config();
    this.isClick = isFunction(this.field.click);
    this.rendererContainer = this.gridMain.getRendererLayerElement();
  }
  /**
   * event class
   *
   * @public
   * @param {string} addClass
   * @returns {string}
   */
  getRendererClassName(addClass2) {
    const rendererVariant = getRendererVariantClass(this.field.renderer);
    let className = addClass2;
    if (rendererVariant) {
      className = addClass2 + " " + rendererVariant;
    }
    const classNames = resolveClassName(this.field.rendererClassName);
    if (classNames.length < 1) {
      return className;
    }
    return className + " " + classNames.join(" ");
  }
  afterRender() {
    this.isInit = true;
  }
  textRender(element, type) {
    const attr = {
      type,
      autocomplete: "off",
      placeholder: this.field.placeholder ?? ""
    };
    const editElement = createHTMLElement(
      "input",
      this.getRendererClassName("dg-edit-" + type),
      attr
    );
    editElement.value = this.field.defaultValue ?? "";
    element.appendChild(editElement);
    return editElement;
  }
  initTextEvt(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "input" }, (e) => {
      this.changeValue(this.getValue());
    });
    cfg.eventManager.on({ el: contentElement, type: "keydown" }, (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.search(e);
      }
    });
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   */
  click(e, eventElement) {
    var _a;
    if (this.isClick) {
      (_a = this.field.click) == null ? void 0 : _a.call(null, { evt: e, field: this.field, element: eventElement });
    }
  }
  changeValue(newValue) {
    if (this.beforeValue == newValue) return;
    this.beforeValue = newValue;
    if (!this.isInit) return;
    if (this.field.change) {
      const toolbarValues = this.gridMain.getToolbarValues();
      this.field.change.call(null, {
        field: this.field,
        value: newValue,
        values: toolbarValues
      });
    }
    this.gridMain.getToolbar().refreshConditionFields();
  }
  search(e) {
    if (this.field.search) {
      const toolbarValues = this.gridMain.getToolbarValues();
      this.field.search.call(null, {
        evt: e,
        field: this.field,
        values: toolbarValues
      });
    }
  }
  getToolbarValues() {
    if (!this.isInit) return {};
    return this.gridMain.getToolbarValues();
  }
  getControlElement(fieldElement) {
    return fieldElement.querySelector(".dg-control");
  }
  supportsEdit() {
    return true;
  }
  isEnabledView() {
    return this.enabledView;
  }
  getFieldElement() {
    if (!this.fieldElement) {
      this.fieldElement = this.gridMain.getToolbar().getToolbarElement().querySelector('[data-uid="' + this.field.$uid + '"]');
    }
    return this.fieldElement;
  }
  show() {
    this.enabledView = true;
    this.getFieldElement().classList.remove("dg-hide");
  }
  hide() {
    this.enabledView = false;
    this.getFieldElement().classList.add("dg-hide");
  }
  setDisabled(disabled) {
    this.getFieldElement().classList.toggle("dg-disabled", disabled);
  }
  refreshCondition() {
    this.isVisible() ? this.show() : this.hide();
    this.setDisabled(this.isDisabled());
  }
  evaluateCondition(condition, defaultValue) {
    if (condition === void 0) {
      return defaultValue;
    }
    if (typeof condition === "function") {
      return condition({
        field: this.field,
        values: this.gridMain.getToolbarValues()
      });
    }
    return condition;
  }
  isVisible() {
    var _a;
    return this.evaluateCondition((_a = this.field.condition) == null ? void 0 : _a.visible, true);
  }
  isDisabled() {
    var _a;
    return this.evaluateCondition((_a = this.field.condition) == null ? void 0 : _a.disabled, false);
  }
}
class ChoiceRenderer extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    this.listItems = [];
    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    this.selectValues = stringSplit(this.field.defaultValue || "", this.valueDelimiter);
    const listItem = rendererInfo == null ? void 0 : rendererInfo.listItem;
    this.labelOnly = true;
    if (listItem) {
      this.labelOnly = listItem.labelOnly !== false;
      this.isMultiple = listItem.multiple ?? true;
      this.valueDelimiter = listItem.delimiter ?? ",";
      const list = listItem.list;
      if (isArray(list)) {
        const reval = normalizeChoiceOptions(list, this.labelKey, this.valueKey);
        this.listItems = uniqueListItem(reval.list, this.valueKey);
        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result) => {
          const reval = normalizeChoiceOptions(result, this.labelKey, this.valueKey);
          this.listItems = uniqueListItem(reval.list, this.valueKey);
          this.valueLabelMap = reval.map;
        });
      }
    } else {
      this.valueDelimiter = ",";
      this.isMultiple = true;
      this.listItems = [];
      this.valueLabelMap = /* @__PURE__ */ new Map();
    }
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const choiceContainer = createHTMLElement("div", this.getRendererClassName("dg-choice"), "");
    choiceContainer.innerHTML = this.template(this.listItems);
    controlElement.appendChild(choiceContainer);
    this.choiceContainer = choiceContainer;
    this.setValue(this.field.defaultValue ?? "");
    this.initTextEvt(choiceContainer);
  }
  initTextEvt(contentElement) {
    const cfg = this.gridMain.config();
    const isMultiple = this.isMultiple;
    const choiceElements = contentElement.querySelectorAll(".dg-choice-item");
    cfg.eventManager.on({ el: choiceElements, type: "click" }, (e) => {
      const choiceElement = e.currentTarget;
      if (isMultiple) {
        if (choiceElement.classList.contains(SELECTED_STYLE_CLASS)) {
          choiceElement.classList.remove(SELECTED_STYLE_CLASS);
        } else {
          choiceElement.classList.add(SELECTED_STYLE_CLASS);
        }
      } else {
        choiceElements.forEach((element) => {
          if (element != choiceElement) {
            element.classList.remove(SELECTED_STYLE_CLASS);
          }
        });
        if (!choiceElement.classList.contains(SELECTED_STYLE_CLASS)) {
          choiceElement.classList.add(SELECTED_STYLE_CLASS);
        }
      }
      this.selectValues = this.getValue();
      if (this.selectValues.length < 1) {
        this.setValue(this.field.defaultValue ?? "");
      } else {
        this.setValue(this.selectValues);
      }
    });
  }
  getValue() {
    const values = Array.from(
      this.choiceContainer.querySelectorAll(".dg-choice-item." + SELECTED_STYLE_CLASS)
    ).map((ele) => {
      const index = ele.dataset.index;
      if (index) return this.listItems[intValue(index)][this.valueKey];
    });
    if (values.length < 1) {
      return [];
    }
    if (this.isMultiple) {
      return values;
    } else {
      return values[0];
    }
  }
  setValue(value) {
    let values = getListItemValue(value, this.valueDelimiter);
    if (!this.isMultiple && values.length > 1) {
      values = values.slice(0, 1);
    }
    const listItems = this.listItems;
    const valueKey = this.valueKey;
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      const element = this.choiceContainer.querySelector(`.dg-choice-item[data-index="${i}"]`);
      if (element) {
        if (values.includes(listItem[valueKey])) {
          element.classList.add(SELECTED_STYLE_CLASS);
        } else {
          element.classList.remove(SELECTED_STYLE_CLASS);
        }
      }
    }
    this.changeValue(this.selectValues);
  }
  template(list) {
    if (!isArray(list) || list.length === 0) return "";
    const templateParts = [];
    const inputType = this.isMultiple ? "dg-checkbox" : "dg-radio";
    const isLabelOnly = this.labelOnly;
    for (let itemIdx = 0; itemIdx < list.length; itemIdx++) {
      const item = list[itemIdx];
      const label = (item == null ? void 0 : item[this.labelKey]) ?? "";
      const isDisabled = !!(item == null ? void 0 : item.disabled);
      const classes = [isDisabled ? "disabled" : "", isLabelOnly ? "dg-label-only" : "", inputType].filter((item2) => item2).join(" ");
      const checkTemplate = `<div class="dg-choice-item ${classes}" data-index="${itemIdx}">
        ${isLabelOnly ? "" : '<div class="dg-indicator"></div>'}
        <span class="dg-label dg-ellipsis">${replaceXss(String(label))}</span>
      </div>`;
      templateParts.push(checkTemplate);
    }
    return templateParts.join("");
  }
  valid(value) {
    return true;
  }
}
class ButtonRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const btnElement = createHTMLElement("button", this.getRendererClassName("dg-button"));
    if (this.field.renderer.icon) {
      const iconElement = createHTMLElement("span", "dg-icon");
      iconElement.innerHTML = getIcon(this.field.renderer.icon);
      btnElement.appendChild(iconElement);
    } else if (this.field.renderer.iconStyle) {
      const iconElement = createHTMLElement("span", "dg-icon " + this.field.renderer.iconStyle);
      btnElement.appendChild(iconElement);
    }
    if (this.field.label) {
      const btnLabelElement = createHTMLElement("span", "dg-button-label");
      btnLabelElement.textContent = this.field.label ?? "";
      btnElement.appendChild(btnLabelElement);
    }
    controlElement.appendChild(btnElement);
    this.initEvent(btnElement);
  }
  initEvent(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "pointerdown" }, (e) => {
      stopPreventCancel(e);
      this.click(e, contentElement);
    });
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return false;
  }
  setValue(value) {
  }
}
class DropdownRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    var _a, _b, _c;
    super(field, gridMain);
    this.listItems = [];
    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    if (rendererInfo == null ? void 0 : rendererInfo.listItem) {
      this.isMultiple = ((_a = rendererInfo.listItem) == null ? void 0 : _a.multiple) ?? false;
      this.valueDelimiter = ((_b = rendererInfo.listItem) == null ? void 0 : _b.delimiter) ?? ",";
      this.getListItems();
    } else {
      this.valueDelimiter = ",";
      this.isMultiple = false;
      this.valueLabelMap = /* @__PURE__ */ new Map();
    }
    this.required = rendererInfo.required ?? false;
    this.selectValues = [];
    this.useIncludeAllOption = this.isMultiple && (((_c = this.field.renderer.listItem) == null ? void 0 : _c.includeAllOption) ?? false);
  }
  getListItems() {
    var _a;
    const rendererInfo = this.field.renderer;
    const list = (_a = rendererInfo.listItem) == null ? void 0 : _a.list;
    const renderDropdown = (items) => {
      const { list: list2, map } = normalizeChoiceOptions(items, this.labelKey, this.valueKey);
      this.listItems = uniqueListItem(list2, this.valueKey);
      this.valueLabelMap = map;
    };
    if (Array.isArray(list)) {
      renderDropdown(list);
    } else if (isFunction(list)) {
      list({ init: true, values: this.getToolbarValues() }, renderDropdown);
    }
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const buttonElement = document.createElement("button");
    buttonElement.className = this.getRendererClassName("dg-dropdown-button");
    const text = createHTMLElement("div", "dg-dropdown-label");
    const icon = createHTMLElement("div", "dg-dropdown-icon");
    buttonElement.appendChild(text);
    buttonElement.appendChild(icon);
    controlElement.appendChild(buttonElement);
    this.selectLabelElement = text;
    const dropdownElement = getLayerElement("div", "dg-dropdown-menu dg-toolbar " + FIELD_LAYER_CLASS, this.field.$uid);
    this.rendererContainer.appendChild(dropdownElement);
    this.dropdownElement = dropdownElement;
    this.initEvent(buttonElement);
    this.setValue(stringSplit(this.field.defaultValue || "", this.valueDelimiter));
  }
  initEvent(buttonElement) {
    const { eventManager } = this.gridMain.config();
    eventManager.on({ el: buttonElement, type: "click" }, (e) => {
      this.click(e, buttonElement);
      this.editRender(buttonElement);
    });
    const { valueKey, isMultiple, required } = this;
    eventManager.on({ el: this.dropdownElement, type: "click", selector: ".dg-dropdown-item" }, (e) => {
      const target = e.target;
      const addItemIndex = Number(target.dataset.index || "0");
      if (target.classList.contains("disabled")) {
        return;
      }
      const enabledItems = this.listItems.filter((item) => !item.disabled);
      const enabledValues = enabledItems.map((item) => {
        return item[valueKey];
      });
      const addItemValue = this.listItems[addItemIndex][valueKey];
      const selectValues = updateSelectValues(this.selectValues, addItemValue, isMultiple, enabledValues, required);
      if (!arrayEquals(this.selectValues, selectValues)) {
        this.setValue(selectValues);
      }
      if (!isMultiple) {
        this.dropdownElement.style.display = "none";
      }
    });
  }
  valid(value) {
    return true;
  }
  editRender(buttonElement) {
    const layerId = this.field.$uid;
    const cfg = this.gridMain.config();
    cfg.activeComponent = layerId;
    this.getListItems();
    const list = this.listItems;
    if (this.useIncludeAllOption && list.filter((item) => item[this.valueKey] == ALL_SELECT_VALUE).length < 1) {
      const allItem = {};
      allItem[this.valueKey] = ALL_SELECT_VALUE;
      allItem[this.labelKey] = this.language.getMessage("select.all");
      list.unshift(allItem);
    }
    const dropdownElement = this.dropdownElement;
    dropdownElement.innerHTML = this.dropdownMenuTemplate(list);
    this.setValue(this.selectValues);
    this.openMenu(buttonElement, dropdownElement);
  }
  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} buttonElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  openMenu(buttonElement, dropdownElement) {
    const elementRect = getElementRect(buttonElement);
    const menuStyle = dropdownElement.style;
    menuStyle.height = "auto";
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;
    const openPosition = innerLayerPosition(this.rendererContainer, buttonElement, dropdownElement);
    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;
    bindHideOnBlur(dropdownElement, this.gridMain.config().eventManager);
  }
  setValue(value) {
    const values = getListItemValue(value, this.valueDelimiter);
    const listItems = this.listItems;
    const valueKey = this.valueKey;
    let isAll = false;
    if (this.useIncludeAllOption) {
      if (values.includes(ALL_SELECT_VALUE)) {
        isAll = true;
      }
    }
    this.selectValues = values;
    this.selectLabelElement.textContent = getLabelsByValue(values, this.valueDelimiter, this.valueLabelMap).join(
      this.valueDelimiter
    );
    this.changeValue(values);
    if (!this.dropdownElement) {
      return;
    }
    updateDropdownSelection(this.dropdownElement, listItems, values, valueKey, isAll);
  }
  dropdownMenuTemplate(list) {
    if (!isArray(list) || list.length === 0) return "";
    const { valueKey, labelKey } = this;
    const html2 = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let className = "dg-dropdown-item";
      if (item.disabled) {
        className += " disabled";
      }
      if (item[valueKey] === ALL_SELECT_VALUE) {
        className += " dg-all";
      }
      const labelValue = item[labelKey] ?? "";
      html2.push(`<div data-index="${i}" class="${className}">${replaceXss(String(labelValue))}</div>`);
    }
    return html2.join("");
  }
  getValue() {
    return this.selectValues;
  }
}
class HtmlRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    controlElement.classList.add(this.getRendererClassName("dg-html"));
    const defaultValue = this.field.defaultValue;
    if (!defaultValue) return;
    if (isFunction(defaultValue)) {
      controlElement.innerHTML = defaultValue(this.field);
    } else {
      controlElement.innerHTML = defaultValue;
    }
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return false;
  }
  setValue(value) {
  }
}
class LinkRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const defaultValue = this.field.defaultValue;
    if (!defaultValue) return;
    const refValue = isFunction(defaultValue) ? defaultValue(this.field) : defaultValue;
    const aElement = document.createElement("a");
    aElement.className = this.getRendererClassName("dg-link");
    controlElement.appendChild(aElement);
    this.initEvent(aElement);
    aElement.href = "javascript:void(0);";
    if (refValue == null ? void 0 : refValue.href) {
      aElement.href = refValue.href;
      if (refValue.target) {
        aElement.target = refValue.target;
      }
    }
    aElement.textContent = refValue.label ?? this.field.label;
  }
  initEvent(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "pointerdown" }, (e) => {
      this.click(e, contentElement);
    });
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return false;
  }
  setValue(value) {
  }
}
class NumberRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const editElement = this.textRender(controlElement, "number");
    this.editElement = editElement;
    this.initTextEvt(editElement);
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(value) {
    this.editElement.value = value;
  }
}
class TextRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const editElement = this.textRender(controlElement, "text");
    this.editElement = editElement;
    this.initTextEvt(editElement);
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(value) {
    this.editElement.value = value;
  }
}
class CustomRenderer extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  getValue() {
    return "";
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    controlElement.innerHTML = '<input type="text">';
  }
  valid(element) {
    return true;
  }
  setValue(values) {
  }
}
class DateRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const editElement = this.textRender(controlElement, "date");
    this.editElement = editElement;
    this.initTextEvt(editElement);
  }
  setValue(value) {
    this.editElement.value = value;
    this.changeValue(value);
  }
  getValue() {
    return this.editElement.value;
  }
}
class HiddenRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    this.value = this.field.defaultValue;
    this.afterRender();
  }
  getValue() {
    return this.value;
  }
  supportsEdit() {
    return true;
  }
  setValue(value) {
    this.value = value;
    this.changeValue(this.value);
  }
}
class SearchRenderer extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const wrapperElement = createHTMLElement("div", "dg-search");
    const editElement = createHTMLElement("input", this.getRendererClassName("dg-search-text"), {
      type: "text",
      autocomplete: "off",
      placeholder: this.field.placeholder ?? ""
    });
    wrapperElement.appendChild(editElement);
    const btnElement = createHTMLElement("button", "dg-button dg-search-btn");
    const iconElement = createHTMLElement("span", "dg-icon");
    iconElement.innerHTML = getIcon("search");
    btnElement.appendChild(iconElement);
    wrapperElement.appendChild(btnElement);
    controlElement.appendChild(wrapperElement);
    this.editElement = editElement;
    this.setValue(this.field.defaultValue ?? "");
    this.initEvt(editElement, btnElement);
  }
  initEvt(contentElement, btnElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "input" }, (e) => {
      this.changeValue(this.getValue());
    });
    cfg.eventManager.on({ el: contentElement, type: "keydown" }, (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.search(e);
      }
    });
    cfg.eventManager.on({ el: btnElement, type: "click" }, (e) => {
      this.search(e);
    });
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(value) {
    this.editElement.value = value;
  }
}
class SwitchRenderer2 extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.renderer;
    this.showLabel = rendererInfo.showLabel ?? false;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }
  render(element) {
    const controlElement = this.getControlElement(element);
    const contentElement = document.createElement("div");
    contentElement.className = this.getRendererClassName("dg-switch");
    const slider = document.createElement("div");
    slider.className = "dg-slider";
    if (this.showLabel) {
      const label = document.createElement("span");
      label.className = "dg-slider-label";
      slider.appendChild(label);
      this.labelElement = label;
    }
    contentElement.appendChild(slider);
    controlElement.appendChild(contentElement);
    this.sliderElement = slider;
    this.setValue(this.field.defaultValue);
    this.initClick(contentElement);
  }
  initClick(contentElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: "click" }, (e) => {
      this.click(e, contentElement);
      this.setChecked(!this.checked);
    });
  }
  getValue() {
    return this.checked ? this.trueValue : this.falseValue;
  }
  setValue(value) {
    this.setChecked(value === this.trueValue);
  }
  setChecked(checked) {
    if (this.checked === checked) {
      return;
    }
    if (this.showLabel) {
      this.labelElement.textContent = (checked ? this.trueValue : this.falseValue) + "";
    }
    this.checked = checked;
    this.changeValue(this.getValue());
    this.sliderElement.classList.toggle("dg-checked", checked);
  }
}
class LabelRenderer extends ToolBarRenderer {
  constructor(field, gridMain) {
    super(field, gridMain);
  }
  render(element) {
    var _a;
    const controlElement = this.getControlElement(element);
    let className = "";
    const rendererClassName = (_a = this.field) == null ? void 0 : _a.rendererClassName;
    if (rendererClassName) {
      if (isFunction(rendererClassName)) {
        className = rendererClassName(this.field);
      } else {
        className = rendererClassName;
      }
    }
    const spanElement = createHTMLElement("span", className, {});
    spanElement.textContent = this.field.label || "";
    controlElement.appendChild(spanElement);
  }
  getValue() {
    return "";
  }
  setValue(value) {
  }
}
const ASIDE_RENDERER = {
  lineNumber: AsideLineNumberRenderer,
  modifyInfo: AsideModifyInfoRenderer,
  rowCheckbox: AsideRowCheckRenderer,
  rowDragHandle: AsideRowDragHandleRenderer
};
const VIEW_RENDERER = {
  dropdown: DropdownRenderer$1,
  bar: BarRenderer,
  button: ButtonRenderer$1,
  hidden: HiddenRenderer$1,
  html: HtmlRenderer$1,
  image: ImageRenderer,
  link: LinkRenderer$1,
  number: NumberRenderer$1,
  text: TextRenderer$1,
  password: PasswordRenderer,
  sparkline: SparklineRenderer,
  sparklineBar: SparklineRendererBar,
  tree: TreeRenderer,
  // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: ViewCustomRenderer
};
const EDIT_RENDERER = {
  date: DateRenderer$1,
  custom: CustomEditRenderer,
  text: TextEditRenderer,
  number: NumberEditRenderer,
  dropdown: DropdownEditRenderer,
  switch: SwitchRenderer$1,
  checkbox: CheckboxRenderer,
  password: PasswordEditRenderer,
  range: RangeRenderer,
  textarea: TextAreaRenderer
};
const TOOLBAR_RENDERER = {
  button: ButtonRenderer2,
  choice: ChoiceRenderer,
  custom: CustomRenderer,
  date: DateRenderer2,
  dropdown: DropdownRenderer2,
  number: NumberRenderer2,
  switch: SwitchRenderer2,
  text: TextRenderer2,
  textarea: TextRenderer2,
  html: HtmlRenderer2,
  link: LinkRenderer2,
  search: SearchRenderer,
  hidden: HiddenRenderer2,
  label: LabelRenderer
};
function initGridOptions(options) {
  var _a, _b;
  const opts = merge({}, DEFAULT_OPTIONS, options);
  if (opts.height != "auto" && !isNumber(opts.height)) throw new Error("invalid height : " + opts.height);
  if (opts.width != "auto" && !isNumber(opts.width)) throw new Error("invalid width : " + opts.width);
  if (opts.tree && (((_a = opts.groupingFields) == null ? void 0 : _a.length) || ((_b = opts.rowSpanFields) == null ? void 0 : _b.length))) {
    throw new Error("tree cannot be used together with groupingFields or rowSpanFields");
  }
  if (!options.hoverMode) {
    opts.hoverMode = isRowSelectionMode(opts.selectionMode) ? "row" : "cell";
  }
  return opts;
}
function setDefaultOptions(options) {
  DEFAULT_OPTIONS = merge({}, DEFAULT_OPTIONS, options);
}
let DEFAULT_OPTIONS = {
  /**
   * 행을 구분하기 위한 고유 ID 필드명
   */
  rowIdField: "",
  /**
   * 그리드 테마
   *
   * 기본값은 "지정 안 함"이다. 지정하지 않으면 그리드는 상위 요소의 `data-daracl-theme` 속성
   * (예: <html data-daracl-theme="dark">)을 따르고, 속성도 없으면 기본 테마(light)로 표시된다.
   * 값을 지정하면 그 그리드만 해당 테마로 고정된다.
   *
   * @default undefined
   */
  theme: void 0,
  /**
   * 그리드 높이
   *
   * `auto`, 숫자(px), CSS 크기
   *
   * @default 'auto'
   */
  height: "auto",
  /**
   * 그리드 너비
   *
   * `auto`, 숫자(px), CSS 크기
   *
   * @default 'auto'
   */
  width: "auto",
  /**
   * 브라우저 리사이즈 이벤트 처리 지연 시간(ms)
   *
   * @default 50
   */
  windowResizeDelay: 50,
  /**
   * 왼쪽 고정 컬럼의 마지막 인덱스
   *
   * `-1`이면 고정 컬럼을 사용하지 않음
   */
  fixedLeftIndex: -1,
  /**
   * 오른쪽 고정 컬럼의 시작 인덱스
   *
   * `-1`이면 고정 컬럼을 사용하지 않음
   */
  fixedRightIndex: -1,
  /**
   * 그리드 스타일 프리셋
   */
  style: BODY_STYLE.default,
  /**
   * 컬럼 너비를 고정할지 여부
   */
  enabledWidthFixed: false,
  /**
   * 데이터 타입별 기본 포맷터 사용 여부
   */
  useDefaultFormatter: true,
  /**
   * 셀 편집 기능 활성화 여부
   */
  editable: false,
  /**
   * 선택 모드
   *
   * - row
   * - cell
   * - multiRow
   * - multiCell
   */
  selectionMode: SelectionModeMap.row,
  /**
   * hover mode
   * cell, row, none
   */
  hoverMode: HoverModeMap.cell,
  /**
   * delete mode
   * hard, soft
   */
  deleteMode: "hard",
  /**
   * 툴팁 사용 여부
   */
  enabledTooltip: false,
  /**
   * 추가 시 유지할 최대 행 개수
   *
   * `-1`이면 제한이 없습니다.
   */
  addLimitRow: -1,
  /**
   * 값 필터 함수 사용 여부
   */
  valueFilter: false,
  /**
   * 데이터 타입별 기본 포맷터 설정
   */
  dataTypeFormatter: {
    /**
     * 금액 포맷 설정
     */
    money: {
      /**
       * 앞에 붙는 문자열
       */
      prefix: "$",
      /**
       * 뒤에 붙는 문자열
       */
      suffix: "원",
      /**
       * 소수점 자리수
       */
      fixed: 0
    },
    /**
     * 숫자 포맷 설정
     */
    number: {
      prefix: "",
      suffix: "",
      fixed: 0
    }
  },
  /**
   * 헤더 영역 설정
   */
  header: {
    /**
     * 헤더 표시 여부
     */
    view: true,
    /**
     * 헤더 높이(px)
     */
    height: 28,
    /**
     * 정렬 설정
     */
    sort: {
      /**
       * 정렬 기능 활성화 여부
       */
      enabled: true,
      /**
       * null 값을 항상 마지막에 배치할지 여부
       */
      nullsLast: false,
      /**
       * 사용자 정의 정렬 함수
       */
      customSorting: void 0
    },
    /**
     * 컬럼 리사이즈 설정
     */
    resize: {
      /**
       * 리사이즈 활성화 여부
       */
      enabled: true,
      /**
       * 리사이즈 중 즉시 너비를 적용할지 여부
       */
      update: false,
      /**
       * 최소 컬럼 너비(px)
       */
      minWidth: 10,
      /**
       * 최대 컬럼 너비(px)
       */
      maxWidth: 1500
    },
    /**
     * 전체 컬럼 선택 기능 사용 여부
     */
    enabledAllColumnSelection: true,
    /**
     * 마우스 휠로 가로 스크롤 이동 여부
     */
    enabledScroll: true,
    /**
     * 모든 라벨 표시 여부
     */
    enabledViewAllLabel: false,
    /**
     * 헤더 도움말 버튼 설정
     */
    help: {
      /**
       * 도움말 버튼 활성화 여부
       */
      enabled: false,
      /**
       * 도움말 내용
       */
      content: "",
      /**
       * 클릭 이벤트 콜백
       */
      click: void 0,
      /**
       * 툴팁 표시 지연 시간(ms)
       */
      showDelay: 300
    },
    /**
     * 컬럼 드래그 설정
     */
    drag: {
      /**
       * 드래그 기능 활성화 여부
       */
      enabled: false,
      /**
       * 드롭 대상 셀렉터
       */
      dropSelector: "",
      /**
       * 드롭 전에 호출되는 콜백
       *
       * `false`를 반환하면 드롭을 취소
       */
      dropCallback: (colItem) => true
    }
  },
  /**
   * 검색 영역 설정
   */
  search: {
    /**
     * 검색 기능 활성화 여부
     */
    enabled: false,
    /**
     * 검색 UI 모드
     *
     * - simple
     * - full
     */
    mode: "simple",
    /**
     * 검색 처리를 외부에서 직접 수행할지 여부
     */
    click: false,
    /**
     * 닫기 버튼만 표시할지 여부
     */
    onlyCloseButton: false,
    /**
     * 검색어를 로컬 스토리지에 저장할지 여부
     */
    useRememberValue: false,
    /**
     * 검색 영역 너비(px)
     */
    width: 250,
    /**
     * 검색 영역 높이(px)
     */
    height: 30,
    callback: false,
    rememberValue: {
      field: "",
      keyword: ""
    }
  },
  /**
   * 툴바 설정
   */
  toolbar: {
    enabled: false,
    arrowEnabled: false,
    scrollbarEnabled: false,
    height: TOOLBAR_HEIGHT,
    /**
     * 툴바 아이템 목록
     */
    items: []
  },
  /**
   * 왼쪽 보조 영역 설정
   */
  aside: {
    /**
     * 라인 번호 컬럼 설정
     */
    lineNumber: {
      enabled: true,
      label: "",
      order: 0,
      width: DEFAULT_LINE_NUMBER_WIDTH
    },
    /**
     * 행 체크박스 컬럼 설정
     */
    rowCheckbox: {
      enabled: false,
      /**
       * 다중 선택 허용 여부
       */
      allowMultiSelect: true,
      width: DEFAULT_ROW_CHECK_WIDTH,
      order: 1,
      /**
       * 체크박스 클릭 시 호출
       *
       * `false`를 반환하면 체크되지 않음
       */
      click: (rowInfo) => {
      }
    },
    /**
     * 수정 여부 표시 컬럼 설정
     */
    modifyInfo: {
      enabled: false,
      order: 3,
      label: "",
      width: 20
    }
  },
  /**
   * 본문(body) 영역 설정
   */
  body: {
    /**
     * 셀 더블클릭 이벤트 핸들러
     */
    cellDblClick: void 0,
    /**
     * 셀 클릭 이벤트 핸들러
     */
    cellClick: void 0,
    /**
     * 방향키 이동 핸들러
     */
    keyNavHandler: void 0,
    /**
     * 붙여넣기 전 호출되는 콜백
     */
    pasteBefore: void 0,
    /**
     * 붙여넣기 후 호출되는 콜백
     */
    pasteAfter: void 0,
    /**
     * 행(row) 설정
     */
    row: {
      /**
       * 행 높이(px)
       */
      height: 26,
      /**
       * 추가 스타일 함수 사용 여부
       */
      addStyle: false,
      /**
       * 행 더블클릭 이벤트 사용 여부
       */
      dblClick: false
    },
    /**
     * 행 이동(Drag & Drop) 설정
     */
    rowMove: {
      /**
       * 행 이동 기능 활성화 여부
       */
      enabled: false,
      /**
       * 드래그 핸들  field name
       *
       */
      dragHandle: void 0,
      /**
       * 트리 구조에서 부모 변경 허용 여부
       */
      allowChangeParent: false,
      /**
       * 드래그 가능 여부를 결정하는 함수
       */
      draggable: void 0,
      dragStart: void 0,
      dragOver: void 0,
      drop: void 0,
      dragEnd: void 0,
      /**
       * 드래그 중 표시할 템플릿
       */
      dragTemplate: void 0
    }
  },
  /**
   * 요약 영역 설정
   */
  summary: {
    height: 28,
    position: "bottom",
    items: []
  },
  /**
   * 스크롤 설정
   */
  scroll: {
    /**
     * 그리드 내부에서만 휠 스크롤을 사용할지 여부
     */
    enabledWheelInContainer: false,
    /**
     * 세로 스크롤바 너비(px)
     */
    width: 12,
    /**
     * 세로 스크롤 설정
     */
    vertical: {
      enabled: true,
      /**
       * 스크롤 속도(행 단위)
       */
      speed: 3,
      /**
       * 스크롤 위치 변경 시 호출
       */
      onUpdate: () => true,
      /**
       * 아이템 수 툴팁 표시 여부
       */
      enabledTooltip: false
    },
    /**
     * 가로 스크롤 설정
     */
    horizontal: {
      enabled: true,
      /**
       * 스크롤 속도
       */
      speed: 1,
      /**
       * 마우스 휠로 가로 스크롤 이동 여부
       */
      enabledWheel: false,
      onUpdate: false
    }
  },
  /**
   * 컬럼 정의 목록
   */
  fields: [],
  /**
   * 그리드 데이터 목록
   */
  items: [],
  /**
   * 푸터 영역 설정
   */
  footer: {
    enabled: false,
    height: FOOTER_HEIGHT,
    /**
     * 페이징 표시 설정
     */
    paging: {
      enabled: false,
      position: "center",
      formatPosition: "right",
      format: "{{start}} - {{end}} of {{total}}"
    },
    /**
     * 선택 정보 표시 설정
     */
    selection: {
      position: "left",
      format: "Count : {{count}} {{if(enabledSummary)}} Avg : {{avg}} Min : {{min}} Max : {{max}} Sum : {{sum}}{{/if}}"
    }
  },
  /**
   * 페이징 정보
   */
  paging: {
    totalCount: 0,
    page: 1,
    pageSize: 10,
    unitPage: 5
  },
  /**
   * 다국어 리소스
   */
  i18n: {
    empty: "no data",
    "search.label": "Find",
    "search.button": "Search",
    "setting.speed.label": "Scroll Speed",
    "setting.column.fixed.label": "Fixed Column",
    "setting.column.fixed.notused": "Not Used"
  },
  /**
   * 사용자 정의 연산자 목록
   */
  operators: {},
  /**
   * 트리 설정
   *
   * `undefined`이면 트리 모드를 사용하지 않음
   */
  tree: void 0,
  groupingFields: [],
  rowSpanFields: [],
  sumFields: [],
  showGroupSum: true,
  showGrandSum: true
};
const DEFAULT_RENDERER_INFO = {
  type: "text"
};
const DEFAULT_EDIT_RENDERER_INFO = {
  type: "text",
  trueValue: true,
  falseValue: false,
  showLabel: false
};
const DEFAULT_TOOLBAR_FIELD_INFO = {
  name: "",
  label: "",
  width: 0,
  renderer: {
    type: "text",
    trueValue: true,
    falseValue: false
  },
  $renderer: EDIT_RENDERER["text"],
  $uid: "",
  $width: 0
};
class DaraElement {
  constructor(element) {
    if (element != null) {
      this.element = element;
    }
  }
  findDaraElement(selector) {
    const element = this.element.querySelector(selector);
    if (element) {
      return new DaraElement(element);
    }
    return element;
  }
  find(selector) {
    return this.element.querySelector(selector);
  }
  finds(selector) {
    return Array.from(this.element.querySelectorAll(selector));
  }
  before(renderElements) {
    this.insertAdjacentHTML("beforebegin", renderElements);
  }
  after(renderElements) {
    this.insertAdjacentHTML("afterend", renderElements);
  }
  prepend(renderElements) {
    this.insertAdjacentHTML("afterbegin", renderElements);
  }
  append(renderElements) {
    this.insertAdjacentHTML("beforeend", renderElements);
  }
  text(text) {
    if (isUndefined(text)) {
      return this.element.textContent;
    }
    this.element.textContent = text;
  }
  html(text) {
    if (isUndefined(text)) {
      return this.element.outerHTML;
    }
    this.empty();
    if (isBlank(text)) return;
    this.element.innerHTML = text;
  }
  getElement() {
    return this.element;
  }
  empty() {
    if (this.element == null) return this;
    this.element.replaceChildren();
    return this;
  }
  /**
   * 보더, 패딩, 스크롤바를 포함한 전체 크기
   *
   * @returns {number} height
   */
  height() {
    return this.element.getBoundingClientRect().height;
  }
  setHeight(height) {
    this.element.style.height = height + "px";
  }
  /**
   * 패딩을 포함한 콘텐츠 영역의 높이
   *
   * @returns {number} height
   */
  clientHeight() {
    return this.element.clientHeight;
  }
  show() {
    this.element.style.display = "block";
    return this;
  }
  hide() {
    this.element.style.display = "none";
    return this;
  }
  /**
   * 패딩과 보더를 포함한 전체 높이
   *
   * @returns {number} height
   */
  offsetHeight() {
    return this.element.offsetHeight;
  }
  /**
   * 보더, 패딩, 스크롤바를 포함한 전체 크기
   *
   * @returns {number} width
   */
  width() {
    return this.element.getBoundingClientRect().width;
  }
  /**
   * 패딩을 포함한 콘텐츠 영역의 넓이
   *
   * @returns {number} width
   */
  clientWidth() {
    return this.element.clientWidth;
  }
  /**
   * 패딩과 보더를 포함한 전체 넓이
   *
   * @returns {number} width
   */
  offsetWidth() {
    return this.element.offsetWidth;
  }
  /**
   * element css class check
   *
   * @param {string} checkClass check css class
   * @returns {boolean} contains = true, flase
   */
  hasClass(checkClass) {
    if (this.element.classList.contains(checkClass)) {
      return true;
    }
    return false;
  }
  /**
   * add element css class
   *
   * @param {string} addClasses css class
   */
  addClass(...addClasses) {
    const classList = this.element.classList;
    for (const className of addClasses) {
      if (!classList.contains(className)) {
        classList.add(className);
      }
    }
  }
  /**
   * remove element css class
   *
   * @param {string} removeClasses css class
   */
  removeClass(...removeClasses) {
    this.element.classList.remove(...removeClasses);
  }
  insertAdjacentHTML(insertPosition, renderElements) {
    if (isString(renderElements)) {
      this.element.insertAdjacentHTML(insertPosition, renderElements);
    } else {
      this.element.insertAdjacentElement(insertPosition, renderElements);
    }
  }
  /**
   * get attribute value
   *
   * @param {string} attrKey attribute key
   * @returns {*} attribute value
   */
  getAttr(attrKey) {
    return this.element.getAttribute(attrKey);
  }
  /**
   * set attribute
   * @param attrs element attribute object
   * @returns DaraElement
   */
  setAttr(attrs) {
    for (const key in attrs) {
      this.element.setAttribute(key, attrs[key]);
    }
    return this;
  }
  /**
   * remove attribute
   * @param attrKey element attribute keys ["class","style"]
   * @returns this
   */
  removeAttr(...attrKey) {
    for (const key of attrKey) {
      this.element.removeAttribute(key);
    }
    return this;
  }
  /**
   * css
   *
   * @param cssValueObject  css value object
   * @returns
   */
  css(attrs) {
    for (const key in attrs) {
      if (hasOwnProp(attrs, key)) {
        this.element.style.setProperty(key, attrs[key]);
      }
    }
    return this;
  }
  /**
   * css
   *
   * @param cssValueObject  css value object
   * @returns
   */
  removeCss(csskeys) {
    for (const key of csskeys) {
      this.element.style.removeProperty(key);
    }
    return this;
  }
}
class SelectionInfo {
  constructor(gridMain, options, config) {
    this.reversedAllRanges = [];
    this.rowLine = /* @__PURE__ */ new Set();
    this.columnLine = /* @__PURE__ */ new Set();
    this.serialNumber = 0;
    this.gridMain = gridMain;
    this.options = options;
    this.config = config;
  }
  initSelection() {
    this.config.selection = initSelectionInfo();
    this.setReverseAllRange();
    this.gridMain.getHeader().clearAnchorCell();
    this.rowLine.clear();
    this.columnLine.clear();
  }
  setSelectionRangeInfo(changeSelection, initFlag, cellSelectFlag) {
    if (initFlag !== true && this.isAllSelect()) {
      return;
    }
    const cfg = this.config;
    const { dataInfo } = cfg;
    if (dataInfo.rowLength < 1) {
      return;
    }
    const changeRangeInfo = changeSelection.range;
    if (initFlag) {
      this.serialNumber = 0;
      this.initSelection();
    }
    if (isUndefined(changeRangeInfo)) return;
    const currentSelection = this.setSelectionInfo(initFlag, cfg.selection, changeSelection);
    const lastRowIdx = dataInfo.lastRow;
    const lastCol = dataInfo.colLength - 1;
    let rangeInfo = this.clampRange(currentSelection.range, lastRowIdx, lastCol);
    rangeInfo = this.setRangeMinMaxInfo(rangeInfo);
    currentSelection.allRange.set(currentSelection.id, rangeInfo);
    this.setReverseAllRange();
    this.computeEffectiveSelectionRange(this.reversedAllRanges, currentSelection);
    if (cellSelectFlag) {
      this.setCellSelection();
    }
    this.selectAnchorCell();
    if (cfg.checkOnRowSelect) {
      this.gridMain.getBody().setItemsChecked(this.getRowIds(), true);
    }
    this.gridMain.getFooter().setSelectionStatus();
  }
  /**
   * 주어진 SelectionRange의 행/열 인덱스를 실제 데이터 범위 내로 제한합니다.
   *
   * @param range - 현재 선택된 범위 객체
   * @param maxRow - 데이터의 최대 행 인덱스
   * @param maxCol - 데이터의 최대 열 인덱스
   * @returns 유효한 인덱스 범위로 조정된 새로운 SelectionRange
   */
  clampRange(range, maxRow, maxCol) {
    return {
      ...range,
      startIdx: Math.min(Math.max(range.startIdx, 0), maxRow),
      endIdx: Math.min(Math.max(range.endIdx, 0), maxRow),
      startCol: Math.min(Math.max(range.startCol, 0), maxCol),
      endCol: Math.min(Math.max(range.endCol, 0), maxCol)
    };
  }
  /**
   * 주어진 SelectionRange 목록에서 'remove' 모드 범위를 제외한
   * 실질적인 최소/최대 행 및 열 범위를 계산합니다.
   *
   * @param ranges - 정렬된 SelectionRange 목록 (보통 역순으로 되어 있음)
   * @returns 실제 선택된 셀의 최소/최대 행, 열 인덱스 정보
   */
  computeEffectiveSelectionRange(ranges, currentSelection) {
    let minIdx = Infinity, maxIdx = -1;
    let minCol = Infinity, maxCol = -1;
    const removeRangesLen = ranges.length;
    const removeRanges = [];
    for (let i = 0; i < removeRangesLen; i++) {
      const range = ranges[i];
      if (range.mode === "remove") {
        removeRanges.push(range);
        continue;
      }
      let rMinIdx = range.minIdx;
      let rMaxIdx = range.maxIdx;
      let rMinCol = range.minCol;
      let rMaxCol = range.maxCol;
      const removeLen = removeRanges.length;
      if (removeLen > 0) {
        for (let j = 0; j < removeLen; j++) {
          const rem = removeRanges[j];
          if (isRowRange(rem, rMinIdx, rMinCol, rMaxCol)) {
            rMinIdx = rem.maxIdx;
          }
          if (isRowRange(rem, rMaxIdx, rMinCol, rMaxCol)) {
            rMaxIdx = rem.minIdx;
          }
          if (isCellRange(rem, rMinCol, rMinIdx, rMaxIdx)) {
            rMinCol = rem.maxCol + 1;
          }
          if (isCellRange(rem, rMaxCol, rMinIdx, rMaxIdx)) {
            rMaxCol = rem.minCol;
          }
        }
      }
      if (rMinIdx <= rMaxIdx && rMinCol <= rMaxCol) {
        if (rMinIdx < minIdx) minIdx = rMinIdx;
        if (rMaxIdx > maxIdx) maxIdx = rMaxIdx;
        if (rMinCol < minCol) minCol = rMinCol;
        if (rMaxCol > maxCol) maxCol = rMaxCol;
      }
    }
    currentSelection.minIdx = minIdx;
    currentSelection.maxIdx = maxIdx;
    currentSelection.minCol = minCol;
    currentSelection.maxCol = maxCol;
    this.getSelectedRowsAndCols(ranges);
  }
  /**
   * selection row col
   *
   * @private
   * @param {SelectionRange[]} ranges info
   */
  getSelectedRowsAndCols(ranges) {
    const NEED_WIDE = ranges.some((r) => r.maxIdx >= 1e6);
    const COL_BITS = 12;
    const COL_MASK = (1 << COL_BITS) - 1;
    const ROW_OFFSET = 1e5;
    const encode = NEED_WIDE ? (row, col) => row * ROW_OFFSET + col : (row, col) => row << COL_BITS | col;
    const decodeRow = NEED_WIDE ? (v) => v / ROW_OFFSET | 0 : (v) => v >>> COL_BITS;
    const decodeCol = NEED_WIDE ? (v) => v % ROW_OFFSET : (v) => v & COL_MASK;
    const processed = /* @__PURE__ */ new Set();
    const selected = /* @__PURE__ */ new Set();
    for (const r of ranges) {
      for (let row = r.minIdx; row <= r.maxIdx; row++) {
        for (let col = r.minCol; col <= r.maxCol; col++) {
          const key = encode(row, col);
          if (processed.has(key)) continue;
          processed.add(key);
          if (r.mode === "add") selected.add(key);
        }
      }
    }
    this.rowLine.clear();
    this.columnLine.clear();
    const rows = this.rowLine;
    const cols = this.columnLine;
    selected.forEach((v) => {
      rows.add(decodeRow(v));
      cols.add(decodeCol(v));
    });
  }
  setReverseAllRange() {
    this.reversedAllRanges = Array.from(this.config.selection.allRange.values()).reverse();
  }
  setRangeMinMaxInfo(rangeInfo) {
    rangeInfo.minIdx = Math.min(rangeInfo.startIdx, rangeInfo.endIdx);
    rangeInfo.maxIdx = Math.max(rangeInfo.endIdx, rangeInfo.startIdx);
    rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
    rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);
    return rangeInfo;
  }
  /**
   * set selection info
   *
   * @public
   * @param {Selection} currentSelection change selection info
   * @param {SelectionRange} changeSelection changeRangeInfo
   * @returns {*}
   */
  setSelectionInfo(initFlag, currentSelection, changeSelection) {
    const allRange = currentSelection.allRange;
    const selectionInfo = merge(currentSelection, changeSelection);
    selectionInfo.allRange = allRange;
    const newRange = changeSelection.range;
    let mode = "";
    if (!isEmpty(newRange.startCol) && newRange.modifierKey != 2) {
      let selectionFlag = false;
      if (newRange.type == "column") {
        selectionFlag = this.isColumnSelection(newRange);
      } else {
        selectionFlag = this.isSelection(newRange.startIdx, newRange.startCol);
      }
      newRange.mode = initFlag || !selectionFlag ? "add" : "remove";
      mode = newRange.mode;
      selectionInfo.id = this.getSelectionId(mode);
      selectionInfo.range = merge(selectionInfo.range, newRange);
    }
    this.config.selection = selectionInfo;
    return selectionInfo;
  }
  /**
   * is all cell selection
   *
   * @public
   * @returns {*} boolean
   */
  isAllSelect() {
    return this.config.selection.all;
  }
  /**
   * cell all selection
   *
   * @public
   * @param {boolean} flag all selection true|false
   */
  setAllSelection(flag) {
    this.config.selection.all = flag;
    this.setCellSelection();
    this.gridMain.getFooter().setSelectionStatus();
    this.selectAnchorCell();
  }
  /**
   * clear anchor cell
   *
   */
  clearAnchorCell() {
    const bodyElement = this.gridMain.getBody().getBodyElement();
    this.removeStartAnchorCell();
    removeClass(bodyElement.finds(".dg-cell." + BodyCellStyleMap.SELECTION), BodyCellStyleMap.SELECTION);
  }
  selectAnchorCell() {
    this.gridMain.getHeader().selectColumnAnchorCell();
    this.gridMain.getBody().selectRowAnchorCell();
  }
  removeStartAnchorCell() {
    const bodyElement = this.gridMain.getBody().getStartCellElement();
    removeClass(bodyElement, BodyCellStyleMap.START_CELL);
  }
  /**
   * @method selectionData
   * @description select data 구하기.
   */
  selectionData(dataType = "text", isSummary = false) {
    var _a;
    const { dataManager, currentFields, selection, dataInfo } = this.config;
    const viewItems = dataManager.getViewItems();
    const isJson = dataType === "json";
    if (dataInfo.rowLength < 1) return isJson ? {} : "";
    const isAll = this.isAllSelect();
    const startCol = isAll ? 0 : selection.minCol;
    const endCol = isAll ? dataInfo.colLength - 1 : selection.maxCol;
    const startIdx = isAll ? 0 : selection.minIdx;
    const endIdx = isAll ? dataInfo.lastRow : selection.maxIdx;
    if (startIdx < 0 || endIdx < 0) return isJson ? {} : "";
    const result = [];
    const keyInfoMap = /* @__PURE__ */ new Map();
    const summary = { count: 0, numbers: [] };
    const sumFields = new Set(this.options.sumFields ?? []);
    const firstDataField = currentFields.find((field) => !field.$isAside);
    const summaryLabelField = currentFields.find((field) => !field.$isAside && !sumFields.has(field.name)) ?? firstDataField;
    for (let i = startIdx; i <= endIdx; i++) {
      const viewItem = viewItems[i];
      if (!viewItem) continue;
      const isGroupRow = !!viewItem.groupRowType;
      const item = dataManager.getRowItem(viewItem.id);
      const rowOutput = isJson ? {} : [];
      let hasSelection = false;
      for (let j = startCol; j <= endCol; j++) {
        const field = currentFields[j];
        if (field.hidden || field.$isAside) continue;
        const colName = field.name;
        const selected = isAll || this.isSelection(i, j);
        let cellValue = "";
        if (selected) {
          if ((viewItem.groupRowType === "groupSummary" || viewItem.groupRowType === "group") && viewItem.groupField && field.name === viewItem.groupField) {
            cellValue = viewItem.groupRowType === "group" ? `${viewItem.groupField}: ${String(viewItem.groupValue ?? "")}` : `${String(viewItem.groupValue ?? "")} 합계`;
          } else if (viewItem.groupRowType === "groupSummary" && field === summaryLabelField) {
            cellValue = "Subtotal";
          } else if (viewItem.groupRowType === "grandSummary" && field === summaryLabelField) {
            cellValue = "Grand Total";
          } else if (viewItem.groupRowType && viewItem.groupRowType !== "group" && sumFields.has(field.name)) {
            cellValue = ((_a = viewItem.groupSums) == null ? void 0 : _a[field.name]) ?? "";
          } else if (!isGroupRow) {
            cellValue = field.$renderer.getValue(item);
          }
          hasSelection = true;
          if (!keyInfoMap.has(j)) keyInfoMap.set(j, field);
          if (!isGroupRow && !isBlank(cellValue)) {
            summary.count++;
            if (isNumber(cellValue)) {
              summary.numbers.push(Number(cellValue));
            }
          }
        }
        if (isJson) {
          rowOutput[colName] = cellValue;
        } else {
          rowOutput.push(escapeCellValue(cellValue));
        }
      }
      if (hasSelection) {
        result.push(isJson ? rowOutput : rowOutput.join("	"));
      }
    }
    if (!isJson) return result.join("\n");
    const headers = Array.from(keyInfoMap.values());
    if (isSummary && summary.numbers.length > 0) {
      const summaryInfo = {
        count: summary.count,
        numFieldCount: summary.numbers.length,
        min: -1,
        max: -1,
        avg: "",
        sum: -1
      };
      const nums = summary.numbers;
      const total = nums.reduce((a, b) => a + b, 0);
      summaryInfo.min = Math.min(...nums);
      summaryInfo.max = Math.max(...nums);
      summaryInfo.sum = total;
      summaryInfo.avg = (total / nums.length).toFixed(1);
      return {
        header: headers,
        data: result,
        summary: summaryInfo
      };
    }
    return {
      header: headers,
      data: result
    };
  }
  selectionRows() {
    const { dataManager, selection, dataInfo } = this.config;
    const viewItems = dataManager.getViewItems();
    if (dataInfo.rowLength < 1) {
      return [];
    }
    const startIdx = selection.minIdx;
    const endIdx = selection.maxIdx;
    if (startIdx < 0 || endIdx < 0) {
      return [];
    }
    const result = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const viewItem = viewItems[i];
      if (viewItem.groupRowType) continue;
      const item = dataManager.getRowItem(viewItem.id);
      result.push(item);
    }
    return result;
  }
  selectionRowIds() {
    const { dataManager, selection, dataInfo } = this.config;
    const viewItems = dataManager.getViewItems();
    if (dataInfo.rowLength < 1) {
      return [];
    }
    const itemLength = viewItems.length;
    const startIdx = selection.minIdx;
    const endIdx = selection.maxIdx;
    if (startIdx < 0 || endIdx < 0 || startIdx >= itemLength) {
      return [];
    }
    const result = [];
    for (let i = startIdx; i <= endIdx; i++) {
      if (viewItems[i] && !viewItems[i].groupRowType) result.push(viewItems[i].id);
    }
    return result;
  }
  /**
   * selection check
   *
   * @public
   * @param {number} rowIdx row index
   * @param {number} col cell index
   * @returns {boolean} selection return
   */
  isSelection(rowIdx, col) {
    const reversedRanges = this.reversedAllRanges;
    for (const range of reversedRanges) {
      if (this.isCellSelectionRange(range, rowIdx, col)) {
        return range.mode != "remove";
      }
    }
    return false;
  }
  /**
   * column selection check
   *
   * @public
   * @param {*} chackRange check column range info
   * @returns {boolean} true = selection, false = not selection
   */
  isColumnSelection(chackRange) {
    const reversedRanges = this.reversedAllRanges;
    const { startIdx, startCol, endIdx, endCol } = chackRange;
    for (const range of reversedRanges) {
      if (this.isCellSelectionRange(range, startIdx, startCol) && this.isCellSelectionRange(range, endIdx, endCol)) {
        return range.mode != "remove";
      }
    }
    return false;
  }
  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  isCellSelectionRange(range, rowIdx, col) {
    return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol <= col && col <= range.maxCol;
  }
  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  isCellSelection(range, rowIdx, col) {
    return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol == col && col == range.maxCol;
  }
  /**
   * cell select
   *
   * @public
   * @param {boolean} initFlag
   */
  setCellSelection() {
    const cfg = this.config;
    const { selection, scroll, dataInfo, fixedLeftIndex, fixedRightIndex } = cfg;
    const gridStartCol = cfg.dataInfo.startCol;
    const isAllSelection = this.isAllSelect();
    const startRow = 0;
    const endRow = scroll.viewRow;
    const startCol = isAllSelection ? gridStartCol : selection.minCol;
    const endCol = isAllSelection ? dataInfo.colLength : selection.maxCol;
    const scrollStartIdx = scroll.startIdx;
    const scrollStartCol = scroll.startCol;
    const {
      left: leftElements,
      center: centerElements,
      right: rightElements
    } = this.gridMain.getBody().getBodyCellElements();
    const enabledLeftField = fixedLeftIndex > 0 && fixedLeftIndex > startCol;
    const enabledRightField = fixedRightIndex > 0 && fixedRightIndex <= endCol;
    const { startIdx: startCellIdx, startCol: startCellCol } = selection.startCell;
    const minFixedLeftCol = Math.min(fixedLeftIndex - 1, endCol);
    const minScrollEndCol = Math.min(scroll.endCol, endCol);
    this.clearAnchorCell();
    for (let i = startRow; i < endRow; i++) {
      const currRow = scrollStartIdx + i;
      if (enabledLeftField) {
        for (let j = gridStartCol; j <= minFixedLeftCol; j++) {
          this.updateCellSelectionClass(leftElements[i][j], currRow, j, startCellIdx, startCellCol);
        }
      }
      for (let j = scrollStartCol; j <= minScrollEndCol; j++) {
        this.updateCellSelectionClass(centerElements[i][j], currRow, j, startCellIdx, startCellCol);
      }
      if (enabledRightField) {
        for (let j = fixedRightIndex; j <= endCol; j++) {
          this.updateCellSelectionClass(rightElements[i][j], currRow, j, startCellIdx, startCellCol);
        }
      }
    }
  }
  /**
   
   */
  getColumnLine() {
    return this.columnLine;
  }
  getRowLine() {
    return this.rowLine;
  }
  getRowIds() {
    const dataManager = this.config.dataManager;
    const viewItems = dataManager.getViewItems();
    const rowIds = [];
    this.rowLine.forEach((rowIdx) => {
      const viewItem = viewItems[rowIdx];
      rowIds.push(viewItem.id);
    });
    return rowIds;
  }
  /**
   * add cell selection style class
   * @param cellElement cell htmlelement
   * @param rowIdx row index
   * @param col col
   * @param startIdx start row index
   * @param startCol start cell
   * @returns
   */
  updateCellSelectionClass(cellElement, rowIdx, col, startIdx, startCol) {
    const classList = cellElement.classList;
    if (startIdx == rowIdx && startCol == col) {
      classList.add(BodyCellStyleMap.START_CELL);
    }
    if (this.isAllSelect() || this.isSelection(rowIdx, col)) {
      if (!classList.contains(BodyCellStyleMap.SELECTION)) classList.add(BodyCellStyleMap.SELECTION);
      return true;
    }
    if (classList.contains(BodyCellStyleMap.SELECTION)) classList.remove(BodyCellStyleMap.SELECTION);
    return false;
  }
  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  getSelectionRangeInfo() {
    const rangeInfo = this.config.selection.range;
    const selectionStartIdx = rangeInfo.minIdx, selectionEndIdx = rangeInfo.maxIdx;
    let startRow = -1, endRow = -1;
    if (this.config.scroll.startIdx >= selectionStartIdx) {
      startRow = 0;
    } else {
      startRow = selectionStartIdx - this.config.scroll.startIdx;
    }
    if (this.config.scroll.startIdx + this.config.scroll.viewRow <= selectionEndIdx) {
      endRow = this.config.scroll.viewRow;
    } else {
      endRow = selectionEndIdx - this.config.scroll.startIdx;
    }
    return {
      startRow,
      endRow,
      startCol: rangeInfo.minCol,
      endCol: rangeInfo.maxCol
    };
  }
  /**
   * selection mode col info
   *
   * @public
   * @param {string} selectionMode selection mode
   * @param {number} col col
   * @param {*} dataInfo
   * @param {boolean} isMouseDown
   * @returns {{ startCol: number; endCol: number; }}
   */
  getSelectionModeColInfo(selectionMode, col, cfg, cellElement, isMouseDown) {
    let startCol = col, endCol = col;
    if (isRowSelectionMode(selectionMode)) {
      startCol = cfg.dataInfo.startCol;
      endCol = cfg.dataInfo.colLength - 1;
    } else if (selectionMode == SelectionModeMap.multiCell) {
      if (isMouseDown) {
        startCol = -1;
      } else if (hasClass(cellElement, "dg-line-number")) {
        startCol = cfg.dataInfo.startCol;
        endCol = cfg.dataInfo.colLength - 1;
      } else {
        startCol = col;
      }
    }
    return { startCol, endCol };
  }
  /**
   * set range info
   *
   * @public
   * @param {number} evtCode event key
   * @param {Event} evt event
   * @param {number} endIdx end row index
   * @param {number} moveCol  move cell position
   */
  setRangeInfo(evtCode, evt, endIdx, moveCol) {
    let startCol = moveCol, endCol = moveCol;
    if (isRowSelectionMode(this.options.selectionMode)) {
      startCol = 0;
      endCol = this.config.dataInfo.colLength - 1;
    }
    const multipleFlag = isMultipleSelectionMode(this.options.selectionMode);
    if (multipleFlag && evtCode != "Tab" && isShiftKey(evt)) {
      this.setSelectionRangeInfo(
        {
          range: { endIdx, endCol },
          startCell: { startIdx: endIdx, startCol: moveCol }
        },
        false,
        true
      );
    } else {
      this.setSelectionRangeInfo(
        {
          range: { startIdx: endIdx, endIdx, startCol, endCol },
          startCell: { startIdx: endIdx, startCol: moveCol }
        },
        true,
        true
      );
    }
  }
  /**
   * selection id
   *
   * @public
   * @param {?string} [type] selection type
   * @returns {string} selection id
   */
  getSelectionId(type) {
    if (type) {
      return type + ++this.serialNumber;
    }
    return "auto" + ++this.serialNumber;
  }
  /**
   * set start cell row index
   * @param {number} rowIdx row index
   */
  setStartCellRowIdx(rowIdx) {
    this.config.selection.startCell.startIdx = rowIdx;
  }
}
function isRowRange(range, rowIdx, minCol, maxCol) {
  return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol <= minCol && range.maxCol >= maxCol;
}
function isCellRange(range, col, minIdx, maxIdx) {
  return range.minCol <= col && col <= range.maxCol && range.minIdx <= minIdx && range.maxIdx >= maxIdx;
}
const _HistoryManager = class _HistoryManager {
  constructor(maxCount = _HistoryManager.DEFAULT_MAX_COUNT) {
    this.undoStack = [];
    this.redoStack = [];
    this.currentEntry = null;
    this.suspended = false;
    this.maxCount = this.normalizeMaxCount(maxCount);
  }
  /**
   * 최대 History Entry 개수를 변경합니다.
   *
   * 새로 설정한 개수보다 현재 History가 많으면
   * 가장 오래된 Entry부터 제거합니다.
   */
  setMaxCount(maxCount) {
    this.maxCount = this.normalizeMaxCount(maxCount);
    this.trimStack(this.undoStack);
    this.trimStack(this.redoStack);
  }
  /**
   * 현재 최대 History Entry 개수입니다.
   */
  getMaxCount() {
    return this.maxCount;
  }
  normalizeMaxCount(maxCount) {
    if (!Number.isFinite(maxCount)) {
      return _HistoryManager.DEFAULT_MAX_COUNT;
    }
    return Math.max(0, Math.floor(maxCount));
  }
  /**
   * 최대 개수를 초과한 가장 오래된 History를 제거합니다.
   */
  trimStack(stack) {
    if (stack.length <= this.maxCount) {
      return;
    }
    stack.splice(0, stack.length - this.maxCount);
  }
  pushUndo(entry) {
    if (this.maxCount === 0) {
      return;
    }
    this.undoStack.push(entry);
    this.trimStack(this.undoStack);
  }
  /**
   * Transaction을 시작합니다.
   */
  begin(beforeSelection) {
    if (this.suspended || this.currentEntry) {
      return;
    }
    this.currentEntry = {
      changes: [],
      beforeSelection
    };
  }
  /**
   * 현재 Transaction을 Undo Stack에 등록합니다.
   */
  commit(afterSelection) {
    if (this.suspended) {
      return;
    }
    const entry = this.currentEntry;
    this.currentEntry = null;
    if (!entry || entry.changes.length === 0) {
      return;
    }
    entry.afterSelection = afterSelection;
    this.pushUndo(entry);
    this.redoStack.length = 0;
  }
  /**
   * 아직 commit되지 않은 Transaction을 폐기합니다.
   * 실제 데이터는 되돌리지 않습니다.
   */
  rollback() {
    this.currentEntry = null;
  }
  /**
   * 변경 정보를 등록합니다.
   * Transaction 중이면 현재 Entry에 추가하고,
   * 그렇지 않으면 단일 Entry로 등록합니다.
   */
  add(change, beforeSelection, afterSelection) {
    if (this.suspended) {
      return;
    }
    if (this.currentEntry) {
      this.currentEntry.changes.push(change);
      return;
    }
    this.pushUndo({
      changes: [change],
      beforeSelection,
      afterSelection: afterSelection ?? beforeSelection
    });
    this.redoStack.length = 0;
  }
  /**
   * Undo 가능한지 반환합니다.
   */
  canUndo() {
    return this.undoStack.length > 0;
  }
  /**
   * Redo 가능한지 반환합니다.
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
  /**
   * Undo Entry를 꺼내고 Redo Stack으로 이동합니다.
   */
  undo() {
    if (this.currentEntry) {
      this.commit();
    }
    const entry = this.undoStack.pop();
    if (!entry) {
      return void 0;
    }
    if (this.maxCount > 0) {
      this.redoStack.push(entry);
      this.trimStack(this.redoStack);
    }
    return entry;
  }
  /**
   * Redo Entry를 꺼내고 Undo Stack으로 이동합니다.
   */
  redo() {
    const entry = this.redoStack.pop();
    if (!entry) {
      return void 0;
    }
    this.pushUndo(entry);
    return entry;
  }
  /**
   * History 기록을 일시 중지합니다.
   * 반환값은 호출 전 상태입니다.
   */
  suspend() {
    const previous = this.suspended;
    this.suspended = true;
    return previous;
  }
  /**
   * History 기록을 재개합니다.
   */
  resume(previous = false) {
    this.suspended = previous;
  }
  /**
   * History 전체를 초기화합니다.
   */
  clear() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.currentEntry = null;
  }
  getUndoCount() {
    return this.undoStack.length;
  }
  getRedoCount() {
    return this.redoStack.length;
  }
};
_HistoryManager.DEFAULT_MAX_COUNT = 100;
let HistoryManager = _HistoryManager;
class DataManager {
  constructor(opts, gridMain, type) {
    this.opts = opts;
    this.gridMain = gridMain;
    this.type = type;
    this.originalItems = [];
    this.originalViewItems = [];
    this.viewItems = [];
    this.sortBaseItems = [];
    this.sortOrders = [];
    this.searchMap = /* @__PURE__ */ new Map();
    this.rowMap = /* @__PURE__ */ new Map();
    this.rowCheckSet = /* @__PURE__ */ new Set();
    this.matchOffsetMap = /* @__PURE__ */ new Map();
    this.beforeDataRowLength = -1;
    this.cfg = gridMain.config();
    this.rowHeight = this.cfg.rowHeight;
    this.rowIdField = this.cfg.rowIdField;
    this.history = new HistoryManager();
  }
  /**
   * UUID
   * @returns
   */
  generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxx-xxxx-xxxx-xxxx".replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
  }
  /**
   * CUD 모드 변경.
   * new = create, modify = update, remove = delete
   */
  setChangeValue(rowItem, field, newValue, applyValue) {
    const fieldName = field.name;
    const beforeValue = rowItem[fieldName];
    const beforeStatus = rowItem[ROW_FIELD.CUD];
    if (applyValue) {
      const result = applyValue(rowItem, field, newValue);
      if (result === false) {
        return false;
      }
    } else {
      rowItem[fieldName] = newValue;
    }
    const afterValue = rowItem[fieldName];
    if (isSameValue(beforeValue, afterValue)) {
      return false;
    }
    if (rowItem[ROW_FIELD.CUD] === ItemStatusMap.READ) {
      this.setItemStatus(rowItem, ItemStatusMap.MODIFY);
    }
    const afterStatus = rowItem[ROW_FIELD.CUD];
    const rowId = rowItem[ROW_FIELD.ID];
    const changeSelection = this.createHistorySelectionByChange(rowId, field);
    this.history.add(
      {
        type: "update",
        rowId,
        fieldName,
        beforeValue,
        afterValue,
        beforeStatus,
        afterStatus
      },
      changeSelection,
      changeSelection
    );
    return true;
  }
  /**
   * item 상태값 변경.
   *
   * @param item row item
   * @param status item status
   */
  setItemStatus(item, status) {
    const beforeValue = item[ROW_FIELD.CUD];
    item[ROW_FIELD.CUD] = status;
    if (status === ItemStatusMap.DELETE) {
      const deleteHistory = {
        type: "update",
        rowId: item[ROW_FIELD.ID],
        fieldName: ROW_FIELD.CUD,
        beforeValue,
        afterValue: ItemStatusMap.DELETE,
        beforeStatus: beforeValue,
        afterStatus: ItemStatusMap.DELETE
      };
      this.history.add(deleteHistory);
    }
  }
  removeSoftItem(ids) {
    this.beginHistory();
    try {
      for (const rowId of ids) {
        this.setItemStatus(this.getRowItem(rowId), ItemStatusMap.DELETE);
      }
      this.commitHistory();
    } catch (error) {
      this.rollbackHistory();
      throw error;
    }
  }
  /**
   * 변경된 아이템 얻기
   *
   * @returns 변경된 row items
   */
  getChangedItems() {
    const originalItems = this.originalViewItems;
    const results = [];
    for (const viewItem of originalItems) {
      const item = this.getRowItem(viewItem.id);
      if (item[ROW_FIELD.CUD] == ItemStatusMap.READ) {
        continue;
      }
      results.push(this.filterRowItem(item, false));
    }
    return results;
  }
  /**
   * 전체 체크 설정
   */
  setAllCheck() {
    for (const viewItem of this.getViewItems()) {
      this.rowCheckSet.add(viewItem.id);
    }
  }
  /**
   * 체크된 아이템 초기화
   */
  clearAllCheck() {
    this.rowCheckSet.clear();
  }
  /**
   *  체크된 아이템 설정
   * @param cellInfo 체크된 셀 정보
   * @param checked 체크 여부
   */
  setItemChecked(id, checked) {
    if (checked) {
      this.rowCheckSet.add(id);
    } else {
      this.rowCheckSet.delete(id);
    }
  }
  /**
   * 특정 아이템이 체크되어 있는지 여부 반환
   * @param item 체크 여부를 확인할 아이템
   * @returns 체크 여부
   */
  isItemChecked(id) {
    return this.rowCheckSet.has(id);
  }
  getCheckedCount() {
    return this.rowCheckSet.size;
  }
  /**
   * 데이터 세팅
   * @param items
   */
  setItems(items) {
    this.history.clear();
    this.clearAllCheck();
    this.originalItems = items;
  }
  createItem(item, addOpts) {
    return this.cfg.dataManager.addItems([item], addOpts, ItemStatusMap.CREATE);
  }
  getSortBaseItems() {
    return this.sortBaseItems;
  }
  setSortBaseItems(items) {
    this.sortBaseItems = items;
  }
  dataSort(sortOrders, sortOpts) {
    const sortArr = Array.from(sortOrders);
    this.sortOrders = sortOrders;
    this.sortOpts = sortOpts;
    sortArr.forEach((item) => {
      if (item.field.getValue) {
        item.isValue = true;
      }
    });
    if (this.opts.header.sort.customSorting) {
      this.setViewItems(this.opts.header.sort.customSorting(this.getAllRowItems(true), sortArr, sortOpts));
      return;
    }
    const sortData = this.getSortData(sortArr, sortOpts);
    this.setViewItems(sortData);
  }
  initializeRowItem(item, depth = 0, status = ItemStatusMap.READ) {
    const rowIdField = this.rowIdField;
    const rowId = item[rowIdField] ?? this.generateUUID();
    if (!item[rowIdField]) {
      item[rowIdField] = rowId;
    }
    if (this.rowIdField != ROW_FIELD.ID) {
      item[ROW_FIELD.ID] = rowId;
    }
    item[ROW_FIELD.DEPTH] = depth;
    item[ROW_FIELD.CUD] = status;
    item[ROW_FIELD.HEIGHT] = this.rowHeight;
    return item;
  }
  getViewItemIndex(id) {
    const viewItems = this.viewItems;
    for (let idx = 0; idx < viewItems.length; idx++) {
      if (viewItems[idx].id === id) return idx;
    }
    return -1;
  }
  /**
   * grid view에 보여지는 item의 id 배열 반환
   * @returns
   */
  getViewItems() {
    return this.viewItems;
  }
  /**
   *  grid view에 보여지는 item의 id 배열 설정
   * @param ids item id 배열
   * @param start start index
   * @param end end index
   */
  setViewItems(ids) {
    var _a;
    const viewItemIds = ids;
    this.viewItems = viewItemIds;
    const dataInfo = this.cfg.dataInfo;
    dataInfo.rowLength = viewItemIds.length;
    dataInfo.lastRow = dataInfo.rowLength > 0 ? dataInfo.rowLength - 1 : 0;
    if (this.beforeDataRowLength != -1 && this.beforeDataRowLength !== dataInfo.rowLength) {
      this.gridMain.selectionInfo.initSelection();
      this.gridMain.calcBody();
      this.gridMain.refreshBody(false, "setViewItems");
    }
    this.beforeDataRowLength = dataInfo.rowLength;
    (_a = this.gridMain.getSummary()) == null ? void 0 : _a.drawData();
  }
  convertViewItemsToRowItems() {
    const results = [];
    for (const viewItem of this.getViewItems()) {
      const item = this.getRowItem(viewItem.id);
      results.push(item);
    }
    return results;
  }
  getRowItem(rowId) {
    return this.rowMap.get(rowId);
  }
  deleteRowItem(rowId) {
    this.rowMap.delete(rowId);
    this.rowCheckSet.delete(rowId);
    this.searchMap.delete(rowId);
    this.matchOffsetMap.delete(rowId);
  }
  getAllRowItems(rowIdInclude = false) {
    const viewItems = this.getViewItems();
    const results = new Array(viewItems.length);
    for (let i = 0; i < viewItems.length; i++) {
      const item = this.getRowItem(viewItems[i].id);
      results[i] = this.filterRowItem(item, rowIdInclude);
    }
    return results;
  }
  /**
   * 행 데이터에서 Grid 내부 관리용 필드를 제외하고 반환
   *
   *
   * @param item item
   * @param rowIdInclude 행 ID 포함 여부
   * @returns 내부 관리용 필드가 제외된 행 데이터
   */
  filterRowItem(item, rowIdInclude) {
    const filteredItem = {};
    for (const key in item) {
      if (key.indexOf(ROW_KEY_PREFIX) === 0) {
        if (rowIdInclude && key === ROW_FIELD.ID) {
          filteredItem[key] = item[key];
        }
        continue;
      }
      filteredItem[key] = item[key];
    }
    return filteredItem;
  }
  getDataType() {
    return this.type;
  }
  /**
   * 지정한 row id의 행을 선택
   * @param rowId 선택할 row id
   * @param opts 포커스 이동, 스크롤 여부 등의 행 선택 옵션
   */
  selectRowById(rowId, opts) {
    const index = this.getRowIndexById(rowId);
    if (index > -1) {
      let col = 1;
      if (opts == null ? void 0 : opts.fieldName) {
        const fieldInfo = this.cfg.allFieldMap.get(opts == null ? void 0 : opts.fieldName);
        if (fieldInfo == null ? void 0 : fieldInfo.$colSeq) col = fieldInfo == null ? void 0 : fieldInfo.$colSeq;
      } else {
        col = this.cfg.dataInfo.startCol;
      }
      this.gridMain.selectionInfo.setSelectionRangeInfo(
        {
          range: {
            type: "cell",
            startIdx: index,
            endIdx: index,
            startCol: col,
            endCol: col
          },
          isSelect: true,
          startCell: { startIdx: index, startCol: col }
        },
        true,
        true
      );
      if ((opts == null ? void 0 : opts.scrollIntoView) !== false) {
        this.gridMain.getScroll().moveVerticalScroll({ rowIdx: index, drawFlag: true });
      }
    }
  }
  /**
   * 원본 데이터 얻기
   * @returns
   */
  getOriginalItems() {
    return this.originalItems;
  }
  setOriginalViewItems(items) {
    this.originalViewItems = items;
  }
  /**
   * 현재 데이터 얻기
   * @returns
   */
  getOriginalViewItems() {
    return this.originalViewItems;
  }
  clearRowMap() {
    this.rowMap.clear();
  }
  /**
   *clear search match map
   */
  clearSearchMap() {
    this.searchMap.clear();
  }
  addSearchMapItem(id, viewItem) {
    this.searchMap.set(id, viewItem);
  }
  getSearchMapItem(rowId) {
    return this.searchMap.get(rowId);
  }
  hasSearchMapItem(rowId) {
    return this.searchMap.has(rowId);
  }
  getSearchMapItemLength() {
    return this.searchMap.size;
  }
  setRowItem(rowId, item) {
    this.rowMap.set(rowId, item);
  }
  // ============================================================
  // History
  // ============================================================
  getHistoryManager() {
    return this.history;
  }
  beginHistory() {
    this.history.begin(this.createHistorySelection());
  }
  commitHistory() {
    this.history.commit(this.createHistorySelection());
  }
  rollbackHistory() {
    this.history.rollback();
  }
  canUndo() {
    return this.history.canUndo();
  }
  canRedo() {
    return this.history.canRedo();
  }
  clearHistory() {
    this.history.clear();
  }
  /**
   * 현재 View Selection을 History에서 사용하는 형태로 변환합니다.
   *
   * row index는 저장하지 않고 rowId를 저장합니다.
   */
  createHistorySelection() {
    var _a, _b;
    const selection = this.cfg.selection;
    if (!(selection == null ? void 0 : selection.range)) {
      return void 0;
    }
    const range = selection.range;
    const startIdx = range.startIdx;
    const endIdx = range.endIdx;
    if (startIdx < 0 || endIdx < 0 || startIdx >= this.viewItems.length || endIdx >= this.viewItems.length) {
      return void 0;
    }
    const startRowId = (_a = this.viewItems[startIdx]) == null ? void 0 : _a.id;
    const endRowId = (_b = this.viewItems[endIdx]) == null ? void 0 : _b.id;
    if (startRowId === void 0 || startRowId === null || endRowId === void 0 || endRowId === null) {
      return void 0;
    }
    return {
      startRowId,
      endRowId,
      startCol: range.startCol,
      endCol: range.endCol
    };
  }
  /**
   * 실제로 변경된 row와 field를 기준으로 Selection을 만듭니다.
   * 일반 셀 수정의 History Selection에 사용합니다.
   */
  createHistorySelectionByChange(rowId, field) {
    const rowIndex = this.getViewItemIndex(rowId);
    const colSeq = field.$colSeq;
    if (rowIndex < 0 || colSeq === void 0 || colSeq === null) {
      return void 0;
    }
    return {
      startRowId: rowId,
      endRowId: rowId,
      startCol: colSeq,
      endCol: colSeq
    };
  }
  /**
   * History Entry 최대 보관 개수를 설정합니다.
   *
   * 예: 100으로 설정하면 가장 최근 100개의 Undo 단위만 보관합니다.
   * 0으로 설정하면 새로운 History를 저장하지 않습니다.
   */
  setHistoryMaxCount(maxCount) {
    this.history.setMaxCount(maxCount);
  }
  /**
   * 현재 History Entry 최대 보관 개수를 반환합니다.
   */
  getHistoryMaxCount() {
    return this.history.getMaxCount();
  }
  /**
   * 현재 Undo History 개수를 반환합니다.
   */
  getUndoHistoryCount() {
    return this.history.getUndoCount();
  }
  /**
   * 현재 Redo History 개수를 반환합니다.
   */
  getRedoHistoryCount() {
    return this.history.getRedoCount();
  }
  undo() {
    const entry = this.history.undo();
    if (!entry) {
      return false;
    }
    const previousSuspended = this.history.suspend();
    try {
      for (let i = entry.changes.length - 1; i >= 0; i--) {
        this.applyHistoryChange(entry.changes[i], true);
      }
    } finally {
      this.history.resume(previousSuspended);
    }
    this.refreshAfterHistory(entry, true);
    this.restoreHistorySelection(entry.beforeSelection);
    return true;
  }
  redo() {
    const entry = this.history.redo();
    if (!entry) {
      return false;
    }
    const previousSuspended = this.history.suspend();
    try {
      for (let i = 0; i < entry.changes.length; i++) {
        this.applyHistoryChange(entry.changes[i], false);
      }
    } finally {
      this.history.resume(previousSuspended);
    }
    this.refreshAfterHistory(entry, false);
    this.restoreHistorySelection(entry.afterSelection);
    return true;
  }
  /**
   * History에 저장된 Selection을 현재 View 기준으로 복원합니다.
   * rowId로 현재 index를 다시 계산하기 때문에 정렬/검색/필터로
   * row 위치가 변경되어도 동일한 row를 선택할 수 있습니다.
   */
  restoreHistorySelection(selection) {
    if (!selection) {
      return;
    }
    const startIdx = this.getViewItemIndex(selection.startRowId);
    const endIdx = this.getViewItemIndex(selection.endRowId);
    if (startIdx < 0 || endIdx < 0) {
      return;
    }
    this.gridMain.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: "cell",
          startIdx,
          endIdx,
          startCol: selection.startCol,
          endCol: selection.endCol
        },
        isSelect: true,
        startCell: {
          startIdx,
          startCol: selection.startCol
        }
      },
      true,
      true
    );
  }
  applyHistoryChange(change, undo) {
    switch (change.type) {
      case "update":
        this.applyUpdateHistory(change, undo);
        break;
      case "add":
        this.applyAddHistory(change, undo);
        break;
      case "remove":
        this.applyRemoveHistory(change, undo);
        break;
    }
  }
  applyUpdateHistory(change, undo) {
    const item = this.getRowItem(change.rowId);
    if (!item) {
      return;
    }
    item[change.fieldName] = undo ? change.beforeValue : change.afterValue;
    item[ROW_FIELD.CUD] = undo ? change.beforeStatus : change.afterStatus;
  }
  /**
   * 신규 row History 적용
   *
   * add의 의미:
   * - undo : row 제거
   * - redo : row 복원
   *
   * View 위치는 History에서 관리하지 않습니다.
   */
  applyAddHistory(change, undo) {
    if (undo) {
      this.rowMap.delete(change.rowId);
      this.removeViewItemById(change.rowId);
      return;
    }
    this.rowMap.set(change.rowId, change.item);
  }
  addHistory(rowId, item) {
    this.history.add({
      type: "add",
      rowId,
      item
    });
  }
  /**
   * 삭제된 row History 적용
   *
   * remove의 의미:
   * - undo : row 복원
   * - redo : row 제거
   *
   * View 위치는 History에서 관리하지 않습니다.
   */
  applyRemoveHistory(change, undo) {
    if (undo) {
      this.rowMap.set(change.rowId, change.item);
      return;
    }
    this.rowMap.delete(change.rowId);
    this.removeViewItemById(change.rowId);
  }
  /**
   * View에서 특정 row를 제거합니다.
   */
  removeViewItemById(rowId) {
    const index = this.getViewItemIndex(rowId);
    if (index < 0) {
      return;
    }
    this.viewItems.splice(index, 1);
  }
  /**
   * History 적용이 끝난 후 현재 View를 갱신합니다.
   *
   * History는 데이터 변경만 관리하고 View의 index는 관리하지 않습니다.
   * 현재 정렬 상태라면 현재 데이터 기준으로 다시 정렬합니다.
   */
  refreshAfterHistory(entry, undo) {
    var _a;
    this.syncHistoryViewItems(entry, undo);
    if (this.sortOrders.length > 0) {
      this.dataSort(this.sortOrders, this.sortOpts);
    } else {
      this.setViewItems(this.viewItems);
    }
    const cfg = this.cfg;
    const moveRowIdx = this.getViewItemIndex(entry.changes[0].rowId);
    const isMoveScroll = getScrollDirectionCode(cfg, cfg.scroll, moveRowIdx, -1) > 0;
    this.gridMain.refreshBody(!isMoveScroll, "history");
    if (isMoveScroll) {
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: this.getViewItemIndex(entry.changes[0].rowId) });
    }
    (_a = this.gridMain.getSummary()) == null ? void 0 : _a.drawData();
  }
  /**
   * 정렬이 없는 상태에서 History로 추가/삭제된 row를 현재 View에 반영합니다.
   *
   * 복원 위치는 History에서 관리하지 않습니다.
   * 현재 View의 마지막에 추가하며, 정렬 상태에서는 dataSort()로 재배치합니다.
   */
  syncHistoryViewItems(entry, undo) {
    for (const change of entry.changes) {
      if (change.type === "update") {
        continue;
      }
      const shouldExist = change.type === "add" ? !undo : undo;
      for (const items of /* @__PURE__ */ new Set([this.originalViewItems, this.viewItems])) {
        const viewIndex = items.findIndex((item) => item.id === change.rowId);
        if (shouldExist) {
          if (viewIndex === -1) {
            items.push({ id: change.rowId, sortOrder: items.length });
          }
        } else if (viewIndex > -1) {
          items.splice(viewIndex, 1);
        }
      }
    }
  }
  search(keyword, options) {
    const keys = ["matchCase", "matchWholeWord", "useRegex", "searchFields"];
    let isSameSearchOpts = this.beforeKeyword == keyword;
    if (this.beforeSearchMode) {
      for (const key of keys) {
        if (key === "searchFields") {
          const optsSearchFields = options.searchFields;
          const beforeOptsSearchFields = this.beforeSearchMode.searchFields;
          if (isArray(optsSearchFields) && JSON.stringify(optsSearchFields) != JSON.stringify(beforeOptsSearchFields) || !isArray(optsSearchFields) && optsSearchFields != beforeOptsSearchFields) {
            isSameSearchOpts = false;
            break;
          }
        } else {
          if (this.beforeSearchMode[key] !== options[key]) {
            isSameSearchOpts = false;
            break;
          }
        }
      }
    } else {
      isSameSearchOpts = false;
    }
    let searchMatchInfo;
    let searchResult;
    let searchItems;
    let isNewSearch = false;
    if (this.beforeKeyword == keyword && isSameSearchOpts) {
      searchMatchInfo = this.cfg.searchMatchInfo;
      searchItems = this.getViewItems();
    } else {
      isNewSearch = true;
      searchMatchInfo = this.clearSearchInfo();
      searchResult = this.getSearchData(keyword, options);
      searchMatchInfo.matchCount = searchResult.matchCount;
      searchItems = searchResult.items;
    }
    if (isNewSearch) {
      this.setViewItems(searchItems);
    }
    if (this.sortOrders.length > 0) {
      const currentSortState = JSON.stringify(
        this.sortOrders.map(({ name, ascOrder, sortCell }) => ({
          name,
          ascOrder,
          sortCell
        }))
      );
      if (isNewSearch || this.beforeSearchSortInfo !== currentSortState) {
        this.dataSort(this.sortOrders, this.sortOpts);
        this.beforeSearchSortInfo = currentSortState;
      }
    }
    this.beforeKeyword = keyword;
    this.beforeSearchMode = merge({}, options);
    if (searchMatchInfo.matchCount < 1) {
      this.setCurrentMatchInfo(0, {
        id: "",
        rowIndex: -1,
        cellIndex: -1
      });
      return;
    }
    const matchInfo = this.getMatchInfo(searchMatchInfo, isNewSearch, options);
    const { rowIndex: matchRowIndex, cellIndex: itemIndex } = matchInfo;
    const { startIdx, insideViewRow, insideStartCol, insideEndCol } = this.cfg.scroll;
    if (startIdx + insideViewRow <= matchRowIndex || matchRowIndex < startIdx) {
      let moveScrollRowIdx = -1;
      if (matchRowIndex < insideViewRow) {
        moveScrollRowIdx = 0;
      } else {
        moveScrollRowIdx = matchRowIndex - (insideViewRow - Math.ceil(insideViewRow / 2));
      }
      if (moveScrollRowIdx > -1) {
        this.gridMain.getScroll().moveVerticalScroll({ rowIdx: moveScrollRowIdx, drawFlag: false });
      }
    }
    if (itemIndex > -1) {
      const matchedInfo = matchInfo.matchedFields[itemIndex];
      const matchFieldInfo = this.cfg.allFieldMap.get(matchedInfo.fieldName);
      if (matchFieldInfo) {
        const colSeq = matchFieldInfo.$colSeq;
        if (matchFieldInfo.$panel == "center" && (colSeq < insideStartCol || insideEndCol < colSeq)) {
          this.gridMain.getScroll().moveHorizontalScroll({ colIdx: colSeq, drawFlag: false });
        }
      }
    }
  }
  clearSearchInfo() {
    this.clearSearchMap();
    const searchMatchInfo = {
      id: "",
      rowIndex: -1,
      currentMatchIndex: -1,
      cellIndex: -1,
      matchCount: 0
    };
    this.cfg.searchMatchInfo = searchMatchInfo;
    return searchMatchInfo;
  }
  /**
   * 현재 검색 포커스 cell 정보
   *
   * @param items check item list
   * @param matchId
   * @returns
   */
  setCurrentMatchInfo(currentMatchIndex, currentMatchInfo) {
    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.currentMatchIndex = currentMatchIndex + currentMatchInfo.cellIndex + 1;
    searchMatchInfo.id = currentMatchInfo.id;
    searchMatchInfo.cellIndex = currentMatchInfo.cellIndex;
    searchMatchInfo.rowIndex = currentMatchInfo.rowIndex;
    this.gridMain.getDataSearch().setMatchCountText();
  }
  getCurrentMatchIndex(matchRowId) {
    return this.matchOffsetMap.get(matchRowId) ?? 0;
  }
  /**
   * resolveCellIndex
   *
   * 현재 row 내부에서 next/prev 검색 시 이동할 cell index를 계산한다.
   *
   * - row 이동 로직은 포함하지 않는다.
   * - 오직 "같은 row 안에서 몇 번째 match로 이동할지"만 결정한다.
   * - 결과가 -1이면 해당 row에서는 더 이상 이동할 match가 없음을 의미한다.
   *   (호출자가 다음/이전 row로 이동 처리해야 함)
   */
  resolveCellIndex(isNext, sameRow, matchFieldLength, cellIdx, searchRowLength) {
    if (!sameRow || cellIdx === -1) {
      return isNext ? 0 : matchFieldLength - 1;
    }
    const nextIndex = isNext ? cellIdx + 1 : cellIdx - 1;
    const outOfRange = isNext ? nextIndex >= matchFieldLength : nextIndex < 0;
    if (!outOfRange) {
      return nextIndex;
    }
    if (searchRowLength === 1) {
      return isNext ? 0 : matchFieldLength - 1;
    }
    return -1;
  }
  findMatch(isNext, checkMatchIndex, searchMatchInfo, searchResult) {
    var _a;
    const resultLength = searchResult.length;
    const currentCellIdx = searchMatchInfo.cellIndex;
    const searchRowLength = this.getSearchMapItemLength();
    for (let i = 0; i < resultLength; i++) {
      const searchRowIdx = isNext ? (checkMatchIndex + i) % resultLength : (checkMatchIndex - i + resultLength) % resultLength;
      const item = searchResult[searchRowIdx];
      const matchFields = (_a = this.getSearchMapItem(item.id)) == null ? void 0 : _a.matchedFields;
      if (!(matchFields == null ? void 0 : matchFields.length)) continue;
      const sameRow = searchRowIdx === checkMatchIndex;
      const cellIndex = this.resolveCellIndex(isNext, sameRow, matchFields.length, currentCellIdx, searchRowLength);
      if (cellIndex < 0) continue;
      return this.createMatchInfo(item.id, searchRowIdx, cellIndex, matchFields);
    }
    return this.createFallbackMatch(resultLength, isNext, searchMatchInfo);
  }
  createFallbackMatch(resultLength, isNext, searchMatchInfo) {
    return {
      id: "",
      rowIndex: -1,
      cellIndex: -1,
      matchedFields: []
    };
  }
}
const MAX_REGEX_PATTERN_LENGTH = 200;
function gridDataSearch(searchList, dataManager, searchText, options) {
  const results = [];
  const postProcess = options.postProcess;
  const searchListLength = searchList.length;
  if (!searchText.trim()) {
    for (let i = 0; i < searchListLength; i++) {
      const item = searchList[i];
      item.matchCount = void 0;
      item.matchedFields = void 0;
      item.isCurrentMatch = false;
      results.push(item);
      if (postProcess) {
        postProcess(false, item);
      }
    }
    return { isOriginal: true, matchCount: 0, items: results };
  }
  const { matchCase, matchWholeWord, useRegex, searchFields, hideNonMatched } = options;
  let matchWholeRegex = options.matchWholeRegex;
  const fieldsToSearch = getSearchFields(searchList, dataManager, searchFields);
  const normalizedSearchText = matchCase ? searchText : searchText.toLowerCase();
  if (matchWholeWord && !matchWholeRegex) {
    matchWholeRegex = MATCH_WHOLE_REGEX;
  }
  let compiledRegex = null;
  let wordBoundaryRegex = null;
  if (useRegex) {
    if (searchText.length > MAX_REGEX_PATTERN_LENGTH) {
      console.warn("Search pattern too long, falling back to text search.");
    } else if (isPotentiallyCatastrophicRegex(searchText)) {
      console.warn("Search pattern looks unsafe (possible catastrophic backtracking), falling back to text search.");
    } else {
      try {
        const flags = matchCase ? "" : "i";
        compiledRegex = new RegExp(searchText, flags);
      } catch (error) {
        console.warn("Invalid regex, falling back to text search:", error);
      }
    }
  } else if (matchWholeWord) {
    const flags = matchCase ? "" : "i";
    wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(normalizedSearchText)}\\b`, flags);
  }
  let matchCount = 0;
  for (let i = 0; i < searchListLength; i++) {
    const viewItem = searchList[i];
    const item = dataManager.getRowItem(viewItem.id);
    const matchedFields = findFirstMatchInItemOptimized(
      item,
      searchText,
      normalizedSearchText,
      matchCase,
      matchWholeWord,
      compiledRegex,
      wordBoundaryRegex,
      fieldsToSearch,
      matchWholeRegex
    );
    const matchLength = matchedFields.length;
    const matched = matchLength > 0;
    viewItem.isCurrentMatch = false;
    if (matched) {
      matchCount += matchLength;
      viewItem.matchedFields = matchedFields;
      viewItem.matchCount = matchLength;
      results.push(viewItem);
    } else {
      viewItem.matchCount = void 0;
      viewItem.matchedFields = void 0;
      if (!hideNonMatched) {
        results.push(viewItem);
      }
    }
    if (postProcess) {
      postProcess(matched, item, viewItem);
    }
  }
  return { isOriginal: false, matchCount, items: results };
}
function getSearchFields(searchList, dataManager, searchFields) {
  if (searchFields === ALL_SELECT_VALUE) {
    return searchList.length > 0 ? Object.keys(dataManager.getRowItem(searchList[0].id)) : [];
  }
  return Array.isArray(searchFields) ? arrayCopy(searchFields) : [searchFields];
}
function findFirstMatchInItemOptimized(item, searchText, normalizedSearchText, matchCase, matchWholeWord, compiledRegex, wordBoundaryRegex, fieldsToSearch, matchWholeRegex) {
  const matchedFields = [];
  for (const field of fieldsToSearch) {
    if (!hasOwnProp(item, field)) continue;
    const fieldValue = String(item[field]);
    if (!fieldValue) continue;
    const firstMatch = findFirstMatchInTextOptimized(
      fieldValue,
      searchText,
      normalizedSearchText,
      matchCase,
      matchWholeWord,
      compiledRegex,
      wordBoundaryRegex,
      matchWholeRegex
    );
    if (firstMatch) {
      matchedFields.push({
        fieldName: field,
        originalValue: fieldValue,
        matchCount: 1,
        matchPositions: [firstMatch]
      });
    }
  }
  return matchedFields;
}
function findFirstMatchInTextOptimized(text, searchText, normalizedSearchText, matchCase, matchWholeWord, compiledRegex, wordBoundaryRegex, matchWholeRegex) {
  try {
    if (compiledRegex) {
      const match = compiledRegex.exec(text);
      if (match) {
        return {
          start: match.index,
          end: match.index + match[0].length
        };
      }
    } else if (matchWholeWord && wordBoundaryRegex) {
      return findWholePhraseMatchES6(text, searchText, matchCase, matchWholeRegex);
    } else {
      const targetText = matchCase ? text : text.toLowerCase();
      const index = targetText.indexOf(normalizedSearchText);
      if (index !== -1) {
        return {
          start: index,
          end: index + normalizedSearchText.length
        };
      }
    }
  } catch (error) {
    console.warn("Search error:", error);
    const targetText = matchCase ? text : text.toLowerCase();
    const index = targetText.indexOf(normalizedSearchText);
    if (index !== -1) {
      return {
        start: index,
        end: index + normalizedSearchText.length
      };
    }
  }
  return null;
}
function isPotentiallyCatastrophicRegex(pattern) {
  const nestedQuantifier = /\([^()]*[+*][^()]*\)[+*]/;
  const nestedAlternationQuantifier = /\([^()]*\|[^()]*\)[+*]/;
  return nestedQuantifier.test(pattern) || nestedAlternationQuantifier.test(pattern);
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitTokensES6(text, matchWholeRegex) {
  return text.match(matchWholeRegex) || [];
}
function findWholePhraseMatchES6(text, phrase, matchCase, matchWholeRegex) {
  if (!matchCase) {
    text = text.toLowerCase();
    phrase = phrase.toLowerCase();
  }
  const textTokens = splitTokensES6(text, matchWholeRegex);
  const phraseTokens = splitTokensES6(phrase, matchWholeRegex);
  if (phraseTokens.length === 0) return null;
  if (phraseTokens.length > textTokens.length) return null;
  for (let i = 0; i <= textTokens.length - phraseTokens.length; i++) {
    let hit = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      if (textTokens[i + j] !== phraseTokens[j]) {
        hit = false;
        break;
      }
    }
    if (hit) {
      let cnt = 0;
      let offset = 0;
      while (cnt < i && offset < text.length) {
        const token = splitTokensES6(text.slice(offset), matchWholeRegex)[0];
        if (!token) break;
        offset = text.indexOf(token, offset) + token.length;
        cnt++;
      }
      const firstToken = splitTokensES6(text.slice(offset), matchWholeRegex)[0];
      const start = text.indexOf(firstToken, offset);
      let endOffset = start;
      for (let k = 0; k < phraseTokens.length; k++) {
        const token = splitTokensES6(text.slice(endOffset), matchWholeRegex)[0];
        endOffset = text.indexOf(token, endOffset) + token.length;
      }
      const matchedText = text.substring(start, endOffset);
      if (splitTokensES6(matchedText, matchWholeRegex).join(" ") === phraseTokens.join(" ")) {
        return { start, end: endOffset };
      }
    }
  }
  return null;
}
class ListDataManager extends DataManager {
  constructor(opts, gridMain, type = "list") {
    super(opts, gridMain, type);
  }
  /**
   * init item
   * @param items items
   * @param depth depth
   * @returns
   */
  initItems(items, depth = 0) {
    let orderIdx = 0;
    const viewItems = [];
    this.clearRowMap();
    items.forEach((item) => {
      this.initializeRowItem(item, depth, ItemStatusMap.READ);
      const rowId = item[ROW_FIELD.ID];
      viewItems.push({
        id: rowId,
        sortOrder: orderIdx++
      });
      this.setRowItem(rowId, item);
    });
    return viewItems;
  }
  setItems(items) {
    const viewItemIds = this.initItems(items);
    super.setItems(items);
    super.setOriginalViewItems(viewItemIds);
    this.updatePagingAndViewItems(viewItemIds);
  }
  /**
   * 페이징 옵션 여부에 따라 현재 ViewItems 및 페이징 정보를 업데이트합니다.
   */
  updatePagingAndViewItems(viewItemIds) {
    var _a;
    const footerOpts = this.opts.footer;
    if ((footerOpts == null ? void 0 : footerOpts.enabled) && ((_a = footerOpts.paging) == null ? void 0 : _a.enabled)) {
      const itemLength = viewItemIds.length;
      const pagingParam = this.opts.paging;
      const pagingInfo = getPagingParamToPagingInfo(pagingParam ?? {}, itemLength);
      this.gridMain.setPaging(pagingInfo);
      if (itemLength < pagingInfo.pageSize) {
        this.setViewItems(viewItemIds);
      } else {
        const pageSize = pagingInfo.pageSize;
        const startIdx = (pagingInfo.page - 1) * pageSize;
        const viewItems = arrayCopy(viewItemIds, startIdx, startIdx + pageSize);
        this.setViewItems(viewItems);
      }
    } else {
      this.setViewItems(viewItemIds);
    }
  }
  getSearchData(keyword, options) {
    const items = this.getOriginalViewItems();
    this.matchOffsetMap.clear();
    let firstMatchId = "";
    let offset = 0;
    options.postProcess = (isMatched, item, viewItem) => {
      var _a;
      if (!isMatched || !viewItem) return;
      const id = viewItem.id;
      if (!firstMatchId) {
        firstMatchId = viewItem.id;
      }
      this.matchOffsetMap.set(id, offset);
      offset += ((_a = viewItem.matchedFields) == null ? void 0 : _a.length) ?? 0;
      this.addSearchMapItem(viewItem.id, viewItem);
    };
    const result = gridDataSearch(items, this.cfg.dataManager, keyword, options);
    if (firstMatchId) {
      const firstItem = this.getSearchMapItem(firstMatchId);
      if (firstItem) firstItem.isCurrentMatch = true;
    }
    return result;
  }
  getSortData(sortOrders, sortOpts) {
    var _a;
    const sortData = multiSort(this.getViewItems(), this.cfg.dataManager, sortOrders, sortOpts.nullsLast);
    if (!this.cfg.searchEnabled) {
      return sortData;
    }
    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? "";
    let currentMatchIndex = 0;
    let matchRowIndex = -1;
    this.matchOffsetMap.clear();
    let offset = 0;
    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;
      const matchViewItem = this.getSearchMapItem(id);
      if (matchViewItem) {
        this.matchOffsetMap.set(id, offset);
        offset += ((_a = matchViewItem.matchedFields) == null ? void 0 : _a.length) ?? 0;
      }
      if (matchRowIndex != -1) {
        continue;
      }
      if (id == matchId) {
        matchRowIndex = i;
      }
    }
    currentMatchIndex = this.getCurrentMatchIndex(matchId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: searchMatchInfo.cellIndex
    });
    return sortData;
  }
  getMatchInfo(searchMatchInfo, isNew, options) {
    const isNext = options.direction === SearchDirectionMap.NEXT;
    const searchResult = this.getViewItems();
    const viewItem = this.getSearchMapItem(searchMatchInfo.id);
    if (viewItem) {
      viewItem.isCurrentMatch = false;
    }
    let checkMatchIndex = searchMatchInfo.rowIndex ?? -1;
    checkMatchIndex = checkMatchIndex < 0 ? this.cfg.scroll.startIdx : checkMatchIndex;
    const currentMatchInfo = this.findMatch(isNext, checkMatchIndex, searchMatchInfo, searchResult);
    const matchRowId = currentMatchInfo.id;
    const matchViewItem = this.getSearchMapItem(matchRowId);
    if (matchViewItem) {
      matchViewItem.isCurrentMatch = true;
      currentMatchInfo.matchedFields = matchViewItem.matchedFields ?? [];
    }
    const currentMatchIndex = this.getCurrentMatchIndex(matchRowId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchRowId,
      rowIndex: currentMatchInfo.rowIndex,
      cellIndex: currentMatchInfo.cellIndex
    });
    return currentMatchInfo;
  }
  createMatchInfo(matchId, rowIndex, cellIndex, matchedFields) {
    return {
      id: matchId,
      rowIndex,
      cellIndex,
      matchedFields
    };
  }
  getRowIndexById(rowId) {
    return this.getViewItemIndex(rowId);
  }
  /**
   * 신규 행 아이템들을 지정된 기준 위치(rowId, position)에 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts AddRowOptions { rowId?, position? }
   */
  addItems(items, addOpts = { position: "after" }, status = ItemStatusMap.READ) {
    if (!items || items.length === 0) return -1;
    const originalViewItems = [...this.getOriginalViewItems()];
    let targetIndex = originalViewItems.length;
    const isPositionBefore = (addOpts == null ? void 0 : addOpts.position) === "before";
    const addRowId = addOpts == null ? void 0 : addOpts.rowId;
    if (addRowId !== void 0) {
      const foundIdx = originalViewItems.findIndex((v) => v.id === addRowId);
      if (foundIdx !== -1) {
        if (isPositionBefore) {
          targetIndex = foundIdx;
        } else {
          targetIndex = foundIdx + 1;
        }
      }
    } else if (isPositionBefore) {
      targetIndex = 0;
    }
    const newViewItems = items.map((item) => {
      this.initializeRowItem(item, 0, status);
      const rowId = item[ROW_FIELD.ID];
      this.setRowItem(rowId, item);
      this.addHistory(rowId, item);
      return {
        id: rowId,
        sortOrder: 0
      };
    });
    originalViewItems.splice(targetIndex, 0, ...newViewItems);
    originalViewItems.forEach((vItem, idx) => {
      vItem.sortOrder = idx;
    });
    this.setOriginalViewItems(originalViewItems);
    this.updatePagingAndViewItems(originalViewItems);
    return targetIndex;
  }
  /**
   * ID 목록에 해당하는 행들을 삭제
   *
   * @param ids 삭제할 행 ID 배열
   * @returns 실제 삭제된 행 ID 배열
   */
  removeItems(ids) {
    if (!ids || ids.length === 0) return [];
    const removeSet = new Set(ids);
    const originalViewItems = this.getOriginalViewItems();
    const removedIds = [];
    const remainingViewItems = [];
    if (this.opts.deleteMode == "soft") {
      this.removeSoftItem(ids);
    } else {
      originalViewItems.forEach((viewItem) => {
        const rowId = viewItem.id;
        if (removeSet.has(rowId)) {
          removedIds.push(rowId);
          this.deleteRowItem(rowId);
        } else {
          remainingViewItems.push(viewItem);
        }
      });
    }
    if (removedIds.length === 0) return [];
    remainingViewItems.forEach((vItem, idx) => {
      vItem.sortOrder = idx;
    });
    this.setOriginalViewItems(remainingViewItems);
    this.updatePagingAndViewItems(remainingViewItems);
    return removedIds;
  }
  expandRow(rowId) {
  }
}
const EXPAND_TYPE = {
  USER: 1,
  SEARCH: 2
};
class TreeDataManager extends DataManager {
  constructor(opts, gridMain) {
    super(opts, gridMain, "tree");
    this.idViewItemMap = /* @__PURE__ */ new Map();
    this.originalTreeItems = [];
    this.viewTreeItems = [];
    this.flatViewTreeItems = [];
    this.visibleIndexMap = /* @__PURE__ */ new Map();
    const tree = opts.tree;
    this.idKey = (tree == null ? void 0 : tree.idField) ?? "id";
    this.pidKey = (tree == null ? void 0 : tree.parentIdField) ?? "pid";
    this.childrenKey = (tree == null ? void 0 : tree.childrenField) ?? "children";
  }
  /**
   * 트리 노드 렌더링을 위한 데이터 초기화
   * @param items 원본 데이터 배열
   */
  setItems(items) {
    var _a;
    let treeItems;
    if ((_a = this.opts.tree) == null ? void 0 : _a.isFlatData) {
      treeItems = this.buildTree(items);
    } else {
      treeItems = items;
    }
    const itemInfo = this.convertOriginalTreeToTreeViewItems(treeItems);
    super.setItems(itemInfo.flatItems);
    this.originalTreeItems = itemInfo.treeViewItems;
    this.viewTreeItems = itemInfo.treeViewItems;
    this.buildViewItems();
  }
  convertOriginalTreeToTreeViewItems(treeItems) {
    var _a, _b;
    let expandDepth = ((_a = this.opts.tree) == null ? void 0 : _a.expandDepth) ?? 0;
    expandDepth = expandDepth - 1;
    const childrenKey = this.childrenKey;
    const expandedIdSet = new Set(((_b = this.opts.tree) == null ? void 0 : _b.defaultExpandedIds) ?? []);
    const rootNodes = [];
    const flatItems = [];
    const dfs = (list, depth, parentId, target) => {
      let orderIdx = 0;
      for (const item of list) {
        this.initializeRowItem(item, depth, ItemStatusMap.READ);
        const rowId = item[ROW_FIELD.ID];
        this.setRowItem(rowId, item);
        const treeViewItem = {
          id: rowId,
          pid: parentId,
          sortOrder: orderIdx++,
          depth,
          isLeaf: true,
          expanded: depth < expandDepth || expandedIdSet.has(item[this.idKey]) ? EXPAND_TYPE.USER : 0
        };
        target.push(treeViewItem);
        flatItems.push(item);
        const children = item[childrenKey];
        if ((children == null ? void 0 : children.length) && children.length > 0) {
          treeViewItem.children = [];
          treeViewItem.isLeaf = false;
          dfs(children, depth + 1, rowId, treeViewItem.children);
          item[childrenKey] = null;
        }
      }
    };
    dfs(treeItems, 0, "dg$root", rootNodes);
    return { flatItems, treeViewItems: rootNodes };
  }
  /**
   * flat → tree
   * @param flatItems items
   * @returns
   */
  buildTree(flatItems) {
    const idKey = this.idKey;
    const pidKey = this.pidKey;
    const childrenKey = this.childrenKey;
    const map = /* @__PURE__ */ new Map();
    const roots = [];
    for (const item of flatItems) {
      item[childrenKey] = [];
      map.set(item[idKey], item);
    }
    for (const item of flatItems) {
      const parentId = item[pidKey];
      if (parentId == null) {
        roots.push(item);
        continue;
      }
      const parent = map.get(parentId);
      if (parent) {
        parent[childrenKey].push(item);
      } else {
        roots.push(item);
      }
    }
    return roots;
  }
  /**
   * viewItems
   * @param items items
   */
  buildViewItems() {
    this.setViewItems(this.getTreeToList(this.viewTreeItems));
  }
  /** 현재 정렬 순서를 유지하면서 접힌 하위 행까지 반환한다. */
  getAllTreeViewItems() {
    return this.flatViewTreeItems.slice();
  }
  getTreeToList(items) {
    this.visibleIndexMap.clear();
    this.idViewItemMap.clear();
    this.matchOffsetMap.clear();
    const result = [];
    const flatList = [];
    const searchEnabled = this.cfg.searchEnabled;
    let offset = 0;
    const dfs = (list, parentExpanded) => {
      var _a;
      for (const item of list) {
        const treeItem = item;
        const rowId = treeItem.id;
        if (searchEnabled) {
          const matchViewItem = this.getSearchMapItem(rowId);
          if (matchViewItem) {
            this.matchOffsetMap.set(rowId, offset);
            offset += ((_a = matchViewItem.matchedFields) == null ? void 0 : _a.length) ?? 0;
          }
        }
        this.idViewItemMap.set(rowId, treeItem);
        flatList.push(treeItem);
        if (parentExpanded) {
          this.visibleIndexMap.set(rowId, result.length);
          result.push(treeItem);
        }
        const children = treeItem.children;
        if (children && children.length > 0) {
          dfs(children, parentExpanded && treeItem.expanded > 0);
        }
      }
    };
    dfs(items, true);
    this.flatViewTreeItems = flatList;
    return result;
  }
  /**
   * toggle row expand/collapse
   * @param rowId 행의 ID
   */
  toggleRow(rowId) {
    const viewItem = this.idViewItemMap.get(rowId);
    if (viewItem) {
      viewItem.expanded = (viewItem == null ? void 0 : viewItem.expanded) > 0 ? 0 : EXPAND_TYPE.USER;
      this.buildViewItems();
    }
  }
  /**
   * 모든 행을 접음
   */
  collapseAll() {
    this.allToggle(false);
  }
  /**
   * 모든 행을 펼침
   */
  expandAll() {
    this.allToggle(true);
  }
  allToggle(flag) {
    function dfs(items) {
      var _a;
      for (const item of items) {
        if (((_a = item.children) == null ? void 0 : _a.length) > 0) {
          item.expanded = flag ? EXPAND_TYPE.USER : 0;
          dfs(item.children);
        }
      }
    }
    dfs(this.viewTreeItems);
    this.buildViewItems();
  }
  /**
   * 특정 행을 펼침
   * @param rowId 펼칠 행의 ID
   * @returns
   */
  expandRow(rowId) {
    const treeViewItem = this.idViewItemMap.get(rowId);
    if (!treeViewItem) return;
    this.expandParents(treeViewItem);
    this.buildViewItems();
  }
  expandParents(item, mode = 1) {
    let changed = false;
    let current = item;
    while (current) {
      if (current.expanded < 1) {
        changed = true;
        current.expanded = mode;
      }
      current = this.idViewItemMap.get(current.pid);
    }
    return changed;
  }
  /**
   * 검색
   *
   * @param keyword 검색어
   * @param options 검색 옵션
   * @returns
   */
  getSearchData(keyword, options) {
    const originalTreeItems = this.originalTreeItems;
    const searchMatchInfo = this.cfg.searchMatchInfo;
    searchMatchInfo.matchCount = 0;
    const hideNonMatched = options.hideNonMatched;
    options.postProcess = (isMatched, item, viewItem) => {
      var _a;
      if (!viewItem) return;
      const treeViewItem = viewItem;
      if (isMatched) {
        this.addSearchMapItem(treeViewItem.id, treeViewItem);
        searchMatchInfo.matchCount += ((_a = treeViewItem.matchedFields) == null ? void 0 : _a.length) ?? 0;
      } else {
        treeViewItem.expanded = treeViewItem.expanded % 2 > 0 ? EXPAND_TYPE.USER : 0;
      }
    };
    const dataManager = this.cfg.dataManager;
    const matchItemSet = /* @__PURE__ */ new Set();
    const searchTree = (nodes, depth) => {
      var _a;
      const matchResult2 = gridDataSearch(nodes, dataManager, keyword, options);
      if (matchResult2.isOriginal) {
        return matchResult2;
      }
      const resultNodes = [];
      for (const node of nodes) {
        const children = node.children ?? [];
        let childResult = {};
        if (children.length > 0) {
          childResult = searchTree(children);
        }
        const pid = node.pid;
        const isMatched = ((_a = node.matchedFields) == null ? void 0 : _a.length) || childResult.matchCount > 0 || matchItemSet.has(node.id);
        if (!hideNonMatched) {
          if (isMatched) {
            node.expanded = isMatched ? EXPAND_TYPE.SEARCH : node.expanded;
            if (!matchItemSet.has(pid)) {
              matchItemSet.add(pid);
            }
          }
          resultNodes.push(node);
          continue;
        }
        if (isMatched) {
          const newNode = {
            ...node,
            children: childResult.items ?? []
          };
          newNode.expanded = EXPAND_TYPE.SEARCH;
          resultNodes.push(newNode);
          if (!matchItemSet.has(pid)) {
            matchItemSet.add(pid);
          }
        }
      }
      return {
        ...matchResult2,
        items: resultNodes
      };
    };
    const matchResult = searchTree(originalTreeItems);
    this.viewTreeItems = matchResult.items;
    matchResult.items = this.getTreeToList(matchResult.items);
    matchResult.matchCount = searchMatchInfo.matchCount;
    return matchResult;
  }
  getMatchInfo(searchMatchInfo, isNew, options) {
    const isNext = options.direction === SearchDirectionMap.NEXT;
    const searchResult = this.flatViewTreeItems;
    const viewItem = this.getSearchMapItem(searchMatchInfo.id);
    if (viewItem) {
      viewItem.isCurrentMatch = false;
    }
    let checkMatchIndex = searchMatchInfo.rowIndex ?? -1;
    checkMatchIndex = checkMatchIndex < 0 ? this.cfg.scroll.startIdx : checkMatchIndex;
    const viewItems = this.getViewItems();
    if (viewItems.length <= checkMatchIndex) {
      checkMatchIndex = 0;
    }
    const viewRowId = viewItems[checkMatchIndex].id;
    checkMatchIndex = searchResult.findIndex((item) => item.id == viewRowId);
    const currentMatchInfo = this.findMatch(isNext, checkMatchIndex, searchMatchInfo, searchResult);
    const matchRowId = currentMatchInfo.id;
    const matchViewItem = this.getSearchMapItem(matchRowId);
    if (matchViewItem) {
      matchViewItem.isCurrentMatch = true;
      currentMatchInfo.matchedFields = matchViewItem.matchedFields ?? [];
    }
    const currentMatchIndex = this.getCurrentMatchIndex(matchRowId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchRowId,
      rowIndex: currentMatchInfo.rowIndex,
      cellIndex: currentMatchInfo.cellIndex
    });
    return currentMatchInfo;
  }
  createMatchInfo(matchId, rowIndex, cellIndex, matchedFields) {
    const matchItem = this.getSearchMapItem(matchId);
    if (matchItem && this.expandParents(matchItem, EXPAND_TYPE.SEARCH)) {
      this.buildViewItems();
    }
    return {
      id: matchId,
      rowIndex: this.visibleIndexMap.get(matchId) ?? -1,
      cellIndex,
      matchedFields
    };
  }
  /**
   * 정렬
   *
   * @param sortOrders 정렬 정보
   * @param sortOpts 정렬 옵션
   * @returns
   */
  getSortData(sortOrders, sortOpts) {
    const dataManager = this.cfg.dataManager;
    function sortTree(nodes) {
      nodes = multiSort(nodes, dataManager, sortOrders, sortOpts.nullsLast);
      for (const node of nodes) {
        const treeViewItem = node;
        const children = treeViewItem.children;
        if (children && children.length > 0) {
          sortTree(children);
        }
      }
      return nodes;
    }
    const sortedTree = sortTree(this.viewTreeItems);
    const result = this.getTreeToList(sortedTree);
    if (!this.cfg.searchEnabled) {
      return result;
    }
    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id;
    const currentMatchIndex = this.getCurrentMatchIndex(matchId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: this.cfg.scroll.startIdx,
      cellIndex: searchMatchInfo.cellIndex
    });
    return result;
  }
  getRowIndexById(rowId) {
    this.expandRow(rowId);
    return this.getViewItemIndex(rowId);
  }
  /**
   * 트리 구조에 신규 행 아이템들을 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts 추가 옵션 { rowId?, position? ('before' | 'after' | 'inside') }
   */
  addItems(items, addOpts = {}, status = ItemStatusMap.READ) {
    if (!items || items.length === 0) return -1;
    let parentId = "dg$root";
    let depth = 0;
    let targetSiblings = this.viewTreeItems;
    let insertIndex = targetSiblings.length;
    if ((addOpts == null ? void 0 : addOpts.rowId) !== void 0) {
      const targetNode = this.idViewItemMap.get(addOpts.rowId);
      if (targetNode) {
        if (addOpts.position === "inside") {
          parentId = targetNode.id;
          depth = targetNode.depth + 1;
          if (!targetNode.children) {
            targetNode.children = [];
          }
          targetNode.isLeaf = false;
          targetNode.expanded = EXPAND_TYPE.USER;
          targetSiblings = targetNode.children;
          insertIndex = targetSiblings.length;
        } else {
          parentId = targetNode.pid;
          depth = targetNode.depth;
          if (parentId === "dg$root" || !parentId) {
            targetSiblings = this.viewTreeItems;
          } else {
            const parentNode = this.idViewItemMap.get(parentId);
            targetSiblings = (parentNode == null ? void 0 : parentNode.children) ?? this.viewTreeItems;
          }
          const foundIdx = targetSiblings.findIndex((node) => node.id === targetNode.id);
          if (foundIdx !== -1) {
            insertIndex = addOpts.position === "before" ? foundIdx : foundIdx + 1;
          }
        }
      }
    } else if ((addOpts == null ? void 0 : addOpts.position) === "before") {
      insertIndex = 0;
    }
    const createTreeViewNodes = (list, currentDepth, currentPid) => {
      let orderIdx = 0;
      const nodes = [];
      for (const item of list) {
        this.initializeRowItem(item, currentDepth, status);
        const newRowId = item[ROW_FIELD.ID];
        item[this.pidKey] = currentPid;
        this.setRowItem(newRowId, item);
        const children = item[this.childrenKey];
        const hasChildren = Array.isArray(children) && children.length > 0;
        const treeNode = {
          id: newRowId,
          pid: currentPid,
          sortOrder: orderIdx++,
          depth: currentDepth,
          isLeaf: !hasChildren,
          expanded: 0,
          children: []
        };
        if (hasChildren) {
          treeNode.children = createTreeViewNodes(children, currentDepth + 1, newRowId);
          item[this.childrenKey] = null;
        }
        nodes.push(treeNode);
      }
      return nodes;
    };
    const newTreeNodes = createTreeViewNodes(items, depth, parentId);
    targetSiblings.splice(insertIndex, 0, ...newTreeNodes);
    targetSiblings.forEach((node, idx) => {
      node.sortOrder = idx;
    });
    this.buildViewItems();
    return insertIndex;
  }
  /**
   * 행 삭제 구현
   * @param ids 삭제할 행의 ID 배열
   * @returns 삭제된 행 ID 배열
   */
  removeItems(ids) {
    if (!ids || ids.length === 0) return [];
    const removeSet = new Set(ids);
    const removedIds = [];
    const collectAndClean = (node) => {
      removedIds.push(node.id);
      if (typeof this.deleteRowItem === "function") {
        this.deleteRowItem(node.id);
      } else if (typeof this.removeRowItem === "function") {
        this.removeRowItem(node.id);
      }
      this.idViewItemMap.delete(node.id);
      this.visibleIndexMap.delete(node.id);
      this.matchOffsetMap.delete(node.id);
      if (node.children && node.children.length > 0) {
        node.children.forEach(collectAndClean);
      }
    };
    const filterNodes = (nodes) => {
      const result = [];
      for (const node of nodes) {
        if (removeSet.has(node.id)) {
          collectAndClean(node);
        } else {
          if (node.children && node.children.length > 0) {
            node.children = filterNodes(node.children);
            if (node.children.length === 0) {
              node.isLeaf = true;
            }
          }
          result.push(node);
        }
      }
      result.forEach((node, idx) => {
        node.sortOrder = idx;
      });
      return result;
    };
    this.viewTreeItems = filterNodes(this.viewTreeItems);
    this.originalTreeItems = filterNodes(this.originalTreeItems);
    this.buildViewItems();
    return removedIds;
  }
}
class GroupDataManager extends ListDataManager {
  constructor(opts, gridMain) {
    super(opts, gridMain, "group");
    this.groupRows = /* @__PURE__ */ new Map();
    this.sourceViewItems = [];
    this.groupRowId = 0;
    this.historyBatchDepth = 0;
    this.groupingRefreshPending = false;
  }
  setViewItems(items) {
    var _a;
    const dataItems = items.filter((item) => !item.groupRowType);
    this.sourceViewItems = dataItems;
    const groupFields = this.opts.groupingFields ?? [];
    this.groupRows.clear();
    if (groupFields.length === 0) {
      super.setViewItems(dataItems);
      return;
    }
    const groupedItems = [];
    const dataRows = dataItems.map((viewItem) => ({
      viewItem,
      item: super.getRowItem(viewItem.id)
    }));
    const appendGroups = (rows, fieldIndex, groupValues) => {
      var _a2, _b;
      const fieldName = groupFields[fieldIndex];
      const groups = /* @__PURE__ */ new Map();
      for (const row of rows) {
        const value = (_a2 = row.item) == null ? void 0 : _a2[fieldName];
        const group = groups.get(value);
        if (group) {
          group.push(row);
        } else {
          groups.set(value, [row]);
        }
      }
      for (const [value, groupRows] of groups) {
        const currentGroupValues = [...groupValues, value];
        if (fieldIndex + 1 < groupFields.length) {
          appendGroups(groupRows, fieldIndex + 1, currentGroupValues);
        } else {
          groupedItems.push(...groupRows.map(({ viewItem }) => viewItem));
          if (this.opts.showGroupSum !== false && (((_b = this.opts.sumFields) == null ? void 0 : _b.length) ?? 0) > 0) {
            groupedItems.push(
              this.createGroupRow({
                groupRowType: "groupSummary",
                groupDepth: fieldIndex,
                groupField: fieldName,
                groupValue: value,
                groupValues: currentGroupValues,
                groupSums: this.sumRows(groupRows)
              })
            );
          }
        }
      }
    };
    if (dataRows.length > 0) {
      appendGroups(dataRows, 0, []);
    }
    if (this.opts.showGrandSum !== false && (((_a = this.opts.sumFields) == null ? void 0 : _a.length) ?? 0) > 0 && dataRows.length > 0) {
      groupedItems.push(
        this.createGroupRow({
          groupRowType: "grandSummary",
          groupSums: this.sumRows(dataRows)
        })
      );
    }
    super.setViewItems(groupedItems);
  }
  setChangeValue(rowItem, field, newValue, applyValue) {
    const changed = super.setChangeValue(rowItem, field, newValue, applyValue);
    if (changed && ((this.opts.groupingFields ?? []).includes(field.name) || (this.opts.sumFields ?? []).includes(field.name))) {
      this.groupingRefreshPending = true;
      this.refreshGroupingIfReady();
    }
    return changed;
  }
  beginHistory() {
    super.beginHistory();
    this.historyBatchDepth++;
  }
  commitHistory() {
    super.commitHistory();
    this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1);
    this.refreshGroupingIfReady();
  }
  rollbackHistory() {
    super.rollbackHistory();
    this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1);
    this.refreshGroupingIfReady();
  }
  getSortData(sortOrders, sortOpts) {
    var _a;
    const sortData = multiSort(this.sourceViewItems, this.cfg.dataManager, sortOrders, sortOpts.nullsLast);
    if (!this.cfg.searchEnabled) {
      return sortData;
    }
    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? "";
    let matchRowIndex = -1;
    let offset = 0;
    this.matchOffsetMap.clear();
    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;
      const matchViewItem = this.getSearchMapItem(id);
      if (matchViewItem) {
        this.matchOffsetMap.set(id, offset);
        offset += ((_a = matchViewItem.matchedFields) == null ? void 0 : _a.length) ?? 0;
      }
      if (matchRowIndex === -1 && id === matchId) {
        matchRowIndex = i;
      }
    }
    const currentMatchIndex = this.getCurrentMatchIndex(matchId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: searchMatchInfo.cellIndex
    });
    return sortData;
  }
  refreshAfterHistory(entry, undo) {
    this.sourceViewItems = this.sourceViewItems.filter((viewItem) => super.getRowItem(viewItem.id) !== void 0);
    for (const change of entry.changes) {
      const restored = change.type === "add" && !undo || change.type === "remove" && undo;
      if (restored && !this.sourceViewItems.some((viewItem) => viewItem.id === change.rowId)) {
        const viewItem = this.getOriginalViewItems().find((candidate) => candidate.id === change.rowId);
        this.sourceViewItems.push(viewItem ?? { id: change.rowId, sortOrder: this.sourceViewItems.length });
      }
    }
    super.refreshAfterHistory(entry, undo);
  }
  getRowItem(rowId) {
    return this.groupRows.get(rowId) ?? super.getRowItem(rowId);
  }
  getAllRowItems(rowIdInclude = false) {
    return this.getViewItems().filter((viewItem) => !viewItem.groupRowType).map((viewItem) => {
      const item = super.getRowItem(viewItem.id);
      if (rowIdInclude) {
        return item;
      }
      const result = {};
      for (const key in item) {
        if (key.indexOf(ROW_KEY_PREFIX) !== 0) {
          result[key] = item[key];
        }
      }
      return result;
    });
  }
  convertViewItemsToRowItems() {
    return this.getViewItems().filter((viewItem) => !viewItem.groupRowType).map((viewItem) => super.getRowItem(viewItem.id));
  }
  setAllCheck() {
    for (const viewItem of this.getViewItems()) {
      if (!viewItem.groupRowType) {
        this.setItemChecked(viewItem.id, true);
      }
    }
  }
  setItemChecked(id, checked) {
    if (this.groupRows.has(id)) {
      return;
    }
    super.setItemChecked(id, checked);
  }
  createGroupRow(info) {
    let id;
    do {
      id = `dg$group$${++this.groupRowId}`;
    } while (this.sourceViewItems.some((item) => item.id === id));
    const viewItem = {
      id,
      sortOrder: this.groupRowId,
      ...info
    };
    this.groupRows.set(id, { [ROW_FIELD.ID]: id, [ROW_FIELD.CUD]: ItemStatusMap.READ });
    return viewItem;
  }
  sumRows(rows) {
    const sums = {};
    for (const field of this.opts.sumFields ?? []) {
      sums[field] = rows.reduce((total, { item }) => {
        const value = item == null ? void 0 : item[field];
        if (value === null || value === void 0 || value === "") {
          return total;
        }
        const numericValue = Number(value);
        return Number.isFinite(numericValue) ? total + numericValue : total;
      }, 0);
    }
    return sums;
  }
  refreshGroupingIfReady() {
    if (this.groupingRefreshPending && this.historyBatchDepth === 0) {
      this.groupingRefreshPending = false;
      this.setViewItems(this.sourceViewItems.slice());
    }
  }
}
class ToolbarRenderer {
  constructor(gridMain, toolbarElement, toolbarOpts) {
    this.toolbarFields = [];
    this.conditionFields = [];
    this.fieldElements = /* @__PURE__ */ new Map();
    this.toolbarLayouts = [];
    this.gridMain = gridMain;
    this.toolbarElement = toolbarElement;
    this.toolbarOpts = toolbarOpts;
  }
  init() {
    this.initRenderer();
    this.createTemplate();
  }
  getLayouts() {
    return this.toolbarLayouts;
  }
  getFields() {
    return this.toolbarFields;
  }
  getConditionFields() {
    return this.conditionFields;
  }
  setValues(values) {
    for (const field of this.toolbarFields) {
      if (!field.name || !field.$renderer.supportsEdit()) continue;
      const value = values[field.name];
      if (value !== void 0) {
        field.$renderer.setValue(value);
      }
    }
  }
  getValues() {
    const values = {};
    for (const field of this.toolbarFields) {
      if (!field.name || !field.$renderer.supportsEdit()) continue;
      values[field.name] = field.$renderer.getValue();
    }
    return values;
  }
  refreshConditionFields() {
    this.conditionFields.forEach((field) => {
      field.$renderer.refreshCondition();
    });
  }
  refreshLayout() {
    const rows = Array.from(this.toolbarElement.querySelectorAll(".dg-toolbar-row"));
    this.toolbarLayouts.forEach((rowLayout, rowIndex) => {
      const rowElement = rows[rowIndex];
      if (!rowElement) return;
      const sections = rowElement.querySelectorAll(".dg-toolbar-section");
      rowLayout.forEach((item, index) => {
        const section = sections[index];
        if (section) {
          this.buildSectionLayout(section, item);
        }
      });
    });
    this.refreshRowWidths(rows);
  }
  initRenderer() {
    const items = this.toolbarOpts.items || [];
    const defaultValues = this.toolbarOpts.defaultValues ?? {};
    const mainUid = this.gridMain.uid();
    this.toolbarLayouts = items.map(
      (row, rowIndex) => row.map((item, itemIndex) => ({
        ...item,
        children: item.children.map(
          (field, fieldIndex) => this.createToolbarField(field, mainUid, rowIndex, itemIndex, fieldIndex, defaultValues)
        )
      }))
    );
  }
  createToolbarField(field, mainUid, rowIndex, itemIndex, fieldIndex, defaultValues) {
    const toolbarField = merge({}, DEFAULT_TOOLBAR_FIELD_INFO, field);
    toolbarField.$uid = `${mainUid}_${rowIndex}_${itemIndex}_${fieldIndex}`;
    toolbarField.renderer = typeof toolbarField.renderer === "string" ? {
      ...DEFAULT_EDIT_RENDERER_INFO,
      type: toolbarField.renderer
    } : merge({}, DEFAULT_EDIT_RENDERER_INFO, toolbarField.renderer);
    if (defaultValues[toolbarField.name] !== void 0 && !toolbarField.defaultValue) {
      toolbarField.defaultValue = defaultValues[toolbarField.name];
    }
    const Renderer = TOOLBAR_RENDERER[toolbarField.renderer.type] ?? TOOLBAR_RENDERER.text;
    toolbarField.$renderer = new Renderer(toolbarField, this.gridMain);
    this.toolbarFields.push(toolbarField);
    if (toolbarField.condition) {
      this.conditionFields.push(toolbarField);
    }
    return toolbarField;
  }
  createTemplate() {
    const scrollContainer = this.toolbarElement.querySelector(".dg-toolbar-scroll");
    if (!scrollContainer) return;
    const measureContainer = document.createElement("div");
    measureContainer.style.cssText = "position: absolute; visibility: hidden; display: flex;";
    this.toolbarElement.appendChild(measureContainer);
    const fragment = document.createDocumentFragment();
    this.toolbarLayouts.forEach((row) => {
      fragment.appendChild(this.createRow(row, measureContainer));
    });
    scrollContainer.appendChild(fragment);
    measureContainer.remove();
  }
  createRow(items, measureContainer) {
    const row = document.createElement("div");
    if (items.length === 0) return row;
    row.className = "dg-toolbar-row";
    row.style.height = `${items[0].height}px`;
    const fragment = document.createDocumentFragment();
    const layoutColumns = ["0px"];
    const positions = ["left", "center", "right"];
    const validGroups = positions.map((position) => ({
      position,
      list: items.filter((item) => item.position === position)
    })).filter((group) => group.list.length > 0);
    validGroups.forEach((group, index) => {
      const groupItem = group.list[0];
      if (groupItem == null ? void 0 : groupItem.width) {
        const width = normalizeCssLength(groupItem.width);
        const targetColumnIndex = layoutColumns.length + 2;
        layoutColumns.push("auto", width, "auto");
        group.list.forEach((item) => {
          this.createSection(item, targetColumnIndex, fragment, measureContainer);
        });
      } else {
        const targetColumnIndex = layoutColumns.length + 1;
        let sectionWidth = 0;
        group.list.forEach((item) => {
          sectionWidth = this.createSection(item, targetColumnIndex, fragment, measureContainer);
        });
        layoutColumns.push(`minmax(${sectionWidth}px, 1fr)`);
      }
      if (index < validGroups.length - 1) {
        layoutColumns.push("2px", "2px");
      }
    });
    layoutColumns.push("0px");
    row.style.gridTemplateColumns = layoutColumns.join(" ");
    row.appendChild(fragment);
    return row;
  }
  createSection(item, layoutColIndex, parentFragment, measureContainer) {
    const section = document.createElement("div");
    section.className = `dg-toolbar-section dg-grid-area-${item.position}`;
    section.style.gridArea = `1 / ${layoutColIndex} / span 1 / span 1`;
    this.setWidth(section, item.width ?? "");
    const fragment = document.createDocumentFragment();
    const fieldsToMeasure = [];
    item.children.forEach((field) => {
      if (!field) return;
      if (field.renderer.type === "hidden") {
        field.$renderer.render(createHTMLElement("div"));
        return;
      }
      const element = this.createField(field, 0);
      fragment.appendChild(element);
      fieldsToMeasure.push({
        field,
        el: element
      });
    });
    if (fieldsToMeasure.length > 0) {
      const measureFragment = document.createDocumentFragment();
      const clones = [];
      fieldsToMeasure.forEach(({ field, el }) => {
        const clone = el.cloneNode(true);
        measureFragment.appendChild(clone);
        clones.push({
          field,
          clone
        });
      });
      measureContainer.appendChild(measureFragment);
      clones.forEach(({ field, clone }) => {
        field.$width = clone.getBoundingClientRect().width;
      });
      measureContainer.innerHTML = "";
    }
    section.appendChild(fragment);
    const totalWidth = this.buildSectionLayout(section, item);
    parentFragment.appendChild(section);
    return totalWidth;
  }
  buildSectionLayout(sectionElement, item) {
    const columns = ["0px"];
    let currentColumnIndex = 2;
    let totalWidth = 0;
    item.children.forEach((field, index) => {
      if (!field || field.renderer.type === "hidden") {
        return;
      }
      const fieldElement = this.fieldElements.get(field.$uid);
      if (!fieldElement || fieldElement.classList.contains("dg-hide")) {
        return;
      }
      let beforeGap = 0;
      let afterGap = 0;
      if (isArray(field.gap)) {
        if (field.gap.length === 1) {
          afterGap = field.gap[0] ?? 0;
        } else {
          beforeGap = field.gap[0] ?? 0;
          afterGap = field.gap[1] ?? 0;
        }
      } else if (isNumber(field.gap)) {
        afterGap = field.gap;
      } else {
        const hasNextVisibleField = item.children.slice(index + 1).some((nextField) => {
          if (nextField.renderer.type === "hidden") {
            return false;
          }
          const element = this.fieldElements.get(nextField.$uid);
          return element && !element.classList.contains("dg-hide");
        });
        if (hasNextVisibleField) {
          afterGap = 4;
        }
      }
      if (beforeGap > 0) {
        columns.push(`${beforeGap}px`);
        currentColumnIndex++;
        totalWidth += beforeGap;
      }
      const trackWidth = field.width ? normalizeCssLength(field.width) : field.renderer.type === "button" ? "max-content" : "1fr";
      columns.push(trackWidth);
      fieldElement.style.gridArea = `1 / ${currentColumnIndex} / span 1 / span 1`;
      currentColumnIndex++;
      totalWidth += field.$width ?? 0;
      if (afterGap > 0) {
        columns.push(`${afterGap}px`);
        currentColumnIndex++;
        totalWidth += afterGap;
      }
    });
    columns.push("0px");
    sectionElement.style.gridTemplateColumns = columns.join(" ");
    return totalWidth;
  }
  createField(field, colIndex) {
    const element = document.createElement("div");
    const { type: rendererType, required: isRequired } = field.renderer;
    const hasLabel = isRequired === true || rendererType !== "label" && rendererType !== "button" && !!field.label;
    element.className = `dg-toolbar-field dg-type-${rendererType} ${hasLabel ? "dg-group" : ""}`;
    element.style.gridArea = `1 / ${colIndex} / span 1 / span 1`;
    element.dataset.uid = field.$uid;
    element.innerHTML = hasLabel ? `
          <span class="dg-label ${isRequired ? "dg-required" : ""}">${field.label}</span>
          <div class="dg-control"></div>
        ` : '<div class="dg-control"></div>';
    field.$renderer.render(element);
    this.setWidth(element, field.width ?? "auto");
    this.fieldElements.set(field.$uid, element);
    field.$renderer.afterRender();
    return element;
  }
  setWidth(element, width) {
    if (!width) return;
    const value = normalizeCssLength(width);
    element.style.width = value;
    if (width !== "auto") {
      element.style.minWidth = value;
      element.style.maxWidth = value;
    } else {
      element.style.minWidth = "initial";
      element.style.maxWidth = "initial";
    }
  }
  refreshRowWidths(rows) {
    const rowsScrollWidths = rows.map((row) => {
      const sections = Array.from(row.querySelectorAll(".dg-toolbar-section"));
      return sections.map((section) => section.scrollWidth);
    });
    rows.forEach((row, rowIndex) => {
      const widths = rowsScrollWidths[rowIndex];
      const columns = ["0px"];
      widths.forEach((width, index) => {
        columns.push(`minmax(${width}px, 1fr)`);
        if (index < widths.length - 1) {
          columns.push("2px", "2px");
        }
      });
      columns.push("0px");
      row.style.gridTemplateColumns = columns.join(" ");
    });
  }
}
class ToolbarScroll {
  constructor(gridMain, toolbarElement, toolbarOpts) {
    this.arrowScrollFrame = null;
    this.gridMain = gridMain;
    this.toolbarElement = toolbarElement;
    this.toolbarOpts = toolbarOpts;
  }
  init() {
    this.initWheelEvent();
    this.initArrowEvents();
    if (this.toolbarOpts.scrollbarEnabled === true) {
      this.toolbarElement.classList.add("dg-has-scrollbar");
    }
  }
  resizeArrowVisibility() {
    var _a;
    if (!((_a = this.toolbarOpts) == null ? void 0 : _a.enabled)) {
      return;
    }
    if (this.toolbarOpts.arrowEnabled === false) {
      this.toolbarElement.classList.remove("dg-has-arrow");
      return;
    }
    const scrollElement = this.getScrollElement();
    if (!scrollElement) return;
    const hasScroll = scrollElement.scrollWidth > scrollElement.clientWidth;
    if (hasScroll) {
      this.toolbarElement.classList.add("dg-has-arrow");
    } else {
      this.toolbarElement.classList.remove("dg-has-arrow");
      scrollElement.scrollLeft = 0;
    }
  }
  destroy() {
    this.stopArrowScrolling();
  }
  initWheelEvent() {
    const scrollElement = this.getScrollElement();
    if (!scrollElement) return;
    const { eventManager } = this.gridMain.config();
    eventManager.off(scrollElement, "wheel DOMMouseScroll");
    eventManager.on(
      { el: scrollElement, type: "wheel DOMMouseScroll" },
      (evt) => {
        if (scrollElement.scrollWidth <= scrollElement.clientWidth) return;
        const delta = evt.deltaY;
        if (isEmpty(delta) || isShiftKey(evt)) return;
        stopPreventCancel(evt);
        this.gridMain.hideLayer();
        scrollElement.scrollLeft += delta;
      },
      { passive: false }
    );
  }
  initArrowEvents() {
    const arrowContainer = this.toolbarElement.querySelector(".dg-toolbar-arrow");
    if (!arrowContainer) return;
    const leftButton = arrowContainer.querySelector('[data-direction="left"]');
    const rightButton = arrowContainer.querySelector('[data-direction="right"]');
    if (leftButton) {
      this.bindArrowEvents(leftButton, "left");
    }
    if (rightButton) {
      this.bindArrowEvents(rightButton, "right");
    }
  }
  bindArrowEvents(button, direction) {
    const { eventManager } = this.gridMain.config();
    eventManager.on({ el: button, type: "mousedown touchstart" }, () => this.startArrowScrolling(direction));
    eventManager.on({ el: button, type: "mouseup mouseleave touchend touchcancel" }, () => this.stopArrowScrolling());
  }
  startArrowScrolling(direction) {
    this.stopArrowScrolling();
    const scroll = () => {
      this.scrollByDirection(direction);
      this.arrowScrollFrame = requestAnimationFrame(scroll);
    };
    scroll();
  }
  stopArrowScrolling() {
    if (this.arrowScrollFrame === null) return;
    cancelAnimationFrame(this.arrowScrollFrame);
    this.arrowScrollFrame = null;
  }
  scrollByDirection(direction) {
    const scrollElement = this.getScrollElement();
    if (!scrollElement) return;
    const moveOffset = 50;
    scrollElement.scrollLeft += direction === "left" ? -moveOffset : moveOffset;
  }
  getScrollElement() {
    return this.toolbarElement.querySelector(".dg-toolbar-scroll");
  }
}
class Toolbar {
  /**
   * Toolbar 생성
   *
   * @param gridMain GridMain 인스턴스
   */
  constructor(gridMain) {
    this.toolbarEnabled = false;
    this.gridMain = gridMain;
    this.config = gridMain.config();
    this.toolbarOpts = gridMain.options().toolbar;
  }
  /**
   * Toolbar를 초기화
   *
   * Toolbar가 비활성화되어 있는 경우 DOM을 제거후 종료
   *
   * 초기화 순서
   *
   * 1. Toolbar DOM 설정
   * 2. ToolbarRenderer 초기화
   * 3. ToolbarScroll 초기화
   * 4. Condition Field 갱신
   */
  init() {
    var _a;
    const toolbarDataElement = this.gridMain.element().findDaraElement(".dg-toolbar");
    if (!((_a = this.toolbarOpts) == null ? void 0 : _a.enabled)) {
      toolbarDataElement.getElement().remove();
      return;
    }
    this.toolbarEnabled = true;
    toolbarDataElement.css({
      display: "block",
      height: `${this.config.dimensions.toolbarHeight}px`
    });
    this.toolbarElement = toolbarDataElement.getElement();
    this.toolbarRenderer = new ToolbarRenderer(this.gridMain, this.toolbarElement, this.toolbarOpts);
    this.toolbarScroll = new ToolbarScroll(this.gridMain, this.toolbarElement, this.toolbarOpts);
    this.toolbarRenderer.init();
    this.toolbarScroll.init();
    this.refreshConditionFields();
  }
  /**
   * Toolbar DOM Element를 반환
   *
   * @returns Toolbar DOM Element
   */
  getToolbarElement() {
    return this.toolbarElement;
  }
  /**
   * Toolbar Field의 값을 설정
   *
   * 실제 값 설정은 ToolbarRenderer에서 처리
   *
   * @param values Field 이름과 값의 객체
   */
  setValues(values) {
    this.toolbarRenderer.setValues(values);
  }
  /**
   * Toolbar Field의 현재 값을 반환
   *
   * @returns Field 이름과 값의 객체
   */
  getValues() {
    return this.toolbarRenderer.getValues();
  }
  /**
   * Condition Field를 갱신
   *
   */
  refreshConditionFields() {
    this.toolbarRenderer.refreshConditionFields();
    requestAnimationFrame(() => {
      this.refreshToolbarLayout();
    });
  }
  /**
   * Toolbar Layout을 계산
   */
  refreshToolbarLayout() {
    this.toolbarRenderer.refreshLayout();
    this.resizeArrowVisibility();
  }
  resizeArrowVisibility() {
    if (!this.toolbarEnabled) return;
    this.toolbarScroll.resizeArrowVisibility();
  }
  /**
   * Toolbar를 정리
   *
   * Scroll Controller에서 사용 중인 Animation Frame 및
   * 기타 리소스를 정리합니다.
   */
  destroy() {
    var _a;
    (_a = this.toolbarScroll) == null ? void 0 : _a.destroy();
  }
}
const SUMMARY_BORDER_MAX = 2;
const LARGE_DATA_THRESHOLD = 1e5;
class DimensionCalculator {
  /**
   * DimensionCalculator 생성
   *
   * @param opts 그리드 옵션
   * @param gridMain 그리드 메인
   * @param fieldWidthCalculator 필드 width 계산기
   */
  constructor(opts, gridMain, fieldWidthCalculator) {
    this.opts = opts;
    this.gridMain = gridMain;
    this.fieldWidthCalculator = fieldWidthCalculator;
  }
  /**
   * 그리드 dimension 계산
   */
  calcGridDimension() {
    this.calculateToolbarDimension();
    this.calculateFooterDimension();
    this.calculateSummaryDimension();
  }
  /**
   * Body layout 계산
   *
   * @param width 그리드 width
   * @param height 그리드 height
   */
  calculateBodyLayout(width, height) {
    const cfg = this.gridMain.config();
    const { dimensions, rowHeight, dataInfo, currentFields: fields, scroll } = cfg;
    const gridElement = this.gridMain.element();
    const minHeightSize = dimensions.toolbarHeight + dimensions.footerHeight + dimensions.mainHeaderHeight + rowHeight;
    let changeHeight = height < 0 ? gridElement.height() : height;
    changeHeight = Math.max(minHeightSize, changeHeight);
    dimensions.height = changeHeight;
    dimensions.width = width < 0 ? gridElement.clientWidth() : width;
    this.adjustLineNumberWidth();
    let fieldTotalWidth = 0;
    for (const field of fields) {
      fieldTotalWidth += cfg.isHeaderResize ? field.$width : field.width;
    }
    dimensions.fieldTotalWidth = fieldTotalWidth;
    this.fieldWidthCalculator.calculateHorizontalScroll(fieldTotalWidth);
    const nonMainAreaHeight = dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (scroll.enabledHorizontal ? cfg.scrollbarSize : 0);
    if (cfg.disableVerticalScroll) {
      scroll.enabledVertical = false;
      dimensions.mainHeight = rowHeight * dataInfo.rowLength + nonMainAreaHeight + 1;
      dimensions.mainBodyHeight = rowHeight * dataInfo.rowLength;
      dimensions.height = dimensions.mainHeight + dimensions.toolbarHeight + dimensions.footerHeight;
    } else {
      const bodyMainHeight = changeHeight - (dimensions.toolbarHeight + dimensions.footerHeight);
      dimensions.mainHeight = bodyMainHeight;
      dimensions.mainBodyHeight = bodyMainHeight - nonMainAreaHeight - 1;
      scroll.enabledVertical = rowHeight * dataInfo.rowLength > dimensions.mainBodyHeight;
    }
    this.fieldWidthCalculator.calculateHorizontalScroll(fieldTotalWidth);
    const originViewRow = dimensions.mainBodyHeight / rowHeight;
    const viewRow = Math.min(Math.max(1, Math.ceil(originViewRow)), dataInfo.rowLength);
    scroll.insideViewRow = viewRow - (viewRow > 1 && viewRow > Math.floor(originViewRow) ? 1 : 0);
    scroll.viewRow = viewRow;
    this.fieldWidthCalculator.distributeWidths(fields, fieldTotalWidth, cfg.isHeaderResize);
  }
  /**
   * Toolbar height 계산
   */
  calculateToolbarDimension() {
    var _a;
    const { toolbar } = this.opts;
    if (!(toolbar == null ? void 0 : toolbar.enabled) || !((_a = toolbar.items) == null ? void 0 : _a.length)) return;
    const toolbarHeight = isNumber(toolbar.height) ? toolbar.height : TOOLBAR_HEIGHT;
    let totHeight = 0;
    toolbar.items.forEach((row) => {
      if (row.length > 0) {
        const rowHeight = isNumber(row[0].height) ? row[0].height : toolbarHeight;
        row[0].height = rowHeight;
        totHeight += rowHeight;
      }
    });
    this.gridMain.config().dimensions.toolbarHeight = totHeight;
  }
  /**
   * Footer height 계산
   */
  calculateFooterDimension() {
    const { footer } = this.opts;
    if (footer == null ? void 0 : footer.enabled) {
      this.gridMain.config().dimensions.footerHeight = isNumber(footer.height) ? footer.height : FOOTER_HEIGHT;
    }
  }
  /**
   * Summary height 계산
   */
  calculateSummaryDimension() {
    const { summary } = this.opts;
    if (!summary || !summary.items || summary.items.length === 0) return;
    const cfg = this.gridMain.config();
    const len = summary.items.length;
    const { height, heights } = heightOptionValue(summary.height);
    cfg.summary.heights = new Array(len);
    let totalHeight = 0;
    for (let i = 0; i < len; i++) {
      let summaryHeight = heights.length > i ? heights[i] : height;
      summaryHeight = summaryHeight > 0 ? summaryHeight : height;
      totalHeight += summaryHeight;
      cfg.summary.heights[i] = summaryHeight;
    }
    cfg.dimensions.mainSummaryHeight = totalHeight + Math.min(totalHeight, SUMMARY_BORDER_MAX);
  }
  /**
   * Line Number width 계산
   */
  adjustLineNumberWidth() {
    var _a;
    const cfg = this.gridMain.config();
    const { dataInfo, currentFields: fields, allFieldMap } = cfg;
    const lineNumberCol = (_a = allFieldMap.get(LINE_NUMBER_NAME)) == null ? void 0 : _a.$colSeq;
    if (isUndefined(lineNumberCol)) return;
    const numberField = fields[lineNumberCol];
    if (!numberField) return;
    let targetWidth;
    if (dataInfo.rowLength >= LARGE_DATA_THRESHOLD) {
      const textWidth = getTextWidth(cfg, String(dataInfo.rowLength));
      targetWidth = textWidth || (this.opts.aside.lineNumber.width ?? DEFAULT_LINE_NUMBER_WIDTH);
    } else {
      targetWidth = this.opts.aside.lineNumber.width ?? DEFAULT_LINE_NUMBER_WIDTH;
    }
    numberField.width = targetWidth;
    numberField.$width = targetWidth;
  }
}
class FieldBuilder {
  constructor(opts, gridMain, rendererFactory) {
    this.opts = opts;
    this.gridMain = gridMain;
    this.rendererFactory = rendererFactory;
    const headerOpts = opts.header;
    this.cellMinWidth = headerOpts.resize.minWidth;
    this.enabledViewAllLabel = headerOpts.enabledViewAllLabel === true;
  }
  buildFields() {
    const cfg = this.gridMain.config();
    const opts = this.opts;
    const fields = deepCopy(opts.fields);
    cfg.fieldHeaderGroup = defaultFieldGroupInfo();
    const asideOrder = this.buildAsideFields(opts);
    const asideLength = asideOrder.length;
    cfg.dataInfo.asideLength = asideLength;
    cfg.dataInfo.startCol = asideLength;
    const fixedLeftIndex = asideLength + cfg.fixedLeftIndex - 1;
    let fixedRightIndex = cfg.fixedRightIndex < 1 ? 0 : asideLength + cfg.fixedRightIndex;
    fixedRightIndex = fixedRightIndex > fixedLeftIndex + 1 ? fixedRightIndex : 0;
    fields.unshift(...asideOrder);
    let fieldIndex = 0;
    for (const field of fields) {
      this.buildFieldGroup(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, `${fieldIndex++}`);
    }
    cfg.fieldHeaderGroup.depth = cfg.fieldHeaderGroup.center.length;
    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
    cfg.fixedLeftIndex = fixedLeftIndex + 1;
    cfg.fixedRightIndex = fixedRightIndex > cfg.currentFields.length ? 0 : fixedRightIndex;
    cfg.dataInfo.colLength = cfg.currentFields.length;
    if (opts.header.view === false) return;
    const { height: defaultHeight, heights } = heightOptionValue(opts.header.height);
    const groupDepth = cfg.fieldHeaderGroup.depth;
    cfg.fieldHeaderGroup.heights = new Array(groupDepth);
    let mainHeaderHeight = 0;
    for (let i = 0; i < groupDepth; i++) {
      const customHeight = heights.length > i ? heights[i] : 0;
      const currentHeaderHeight = customHeight > 0 ? customHeight : defaultHeight;
      mainHeaderHeight += currentHeaderHeight;
      cfg.fieldHeaderGroup.heights[i] = currentHeaderHeight;
    }
    cfg.dimensions.mainHeaderHeight = mainHeaderHeight;
  }
  /**
   * aside 옵션
   *
   * @param opts 옵션
   * @returns
   */
  buildAsideFields(opts) {
    var _a, _b;
    const asideItems = [];
    if (opts.aside.lineNumber.enabled === true) {
      asideItems.push({
        field: merge({}, opts.aside.lineNumber, {
          name: LINE_NUMBER_NAME,
          renderer: { type: "lineNumber" },
          $isAside: true
        }),
        order: opts.aside.lineNumber.order ?? 0
      });
    }
    if (opts.aside.rowCheckbox.enabled === true) {
      asideItems.push({
        field: merge({ width: DEFAULT_ROW_CHECK_WIDTH }, opts.aside.rowCheckbox, {
          name: ROW_CHECK_NAME,
          renderer: { type: "rowCheckbox" },
          $isAside: true
        }),
        order: opts.aside.rowCheckbox.order ?? 1
      });
    }
    if (((_a = opts.body.rowMove) == null ? void 0 : _a.enabled) === true && ((_b = opts.body.rowMove) == null ? void 0 : _b.enabledDragHandle) !== false) {
      asideItems.push({
        field: merge(
          {},
          {
            name: ROW_DRAG_HANDLE_NAME,
            width: 32,
            renderer: { type: "rowDragHandle" },
            $isAside: true
          }
        ),
        order: 2
        // Drag Handle의 기본 order
      });
    }
    if (opts.aside.modifyInfo.enabled === true) {
      asideItems.push({
        field: merge({}, opts.aside.modifyInfo, {
          name: "$modifyInfo",
          renderer: { type: "modifyInfo" },
          $isAside: true
        }),
        order: opts.aside.modifyInfo.order ?? 2
      });
    }
    return asideItems.sort((a, b) => a.order - b.order).map((item) => item.field);
  }
  buildFieldGroup(field, depth, fieldGroupInfo, fixedLeftIndex, fixedRightIndex, fieldIndex) {
    if (field.hidden) {
      field.$colspan = -1;
      return field;
    }
    const children = field.children;
    if (children && children.length > 0) {
      let colspan = 0;
      let childFieldIndex = 0;
      for (const childNode of children) {
        this.buildFieldGroup(
          childNode,
          depth + 1,
          fieldGroupInfo,
          fixedLeftIndex,
          fixedRightIndex,
          `${fieldIndex}_${childFieldIndex++}`
          //  템플릿 리터럴 적용
        );
        colspan += childNode.$colspan;
      }
      field.$colspan = colspan;
    }
    field = this.initFieldMeta(field, depth, fieldIndex, fieldGroupInfo);
    if (isUndefined(fieldGroupInfo.left[depth])) fieldGroupInfo.left[depth] = [];
    if (isUndefined(fieldGroupInfo.center[depth])) fieldGroupInfo.center[depth] = [];
    if (isUndefined(fieldGroupInfo.right[depth])) fieldGroupInfo.right[depth] = [];
    if (field.$childLength > 0 && fixedLeftIndex > field.$resizeIdx - field.$colspan || field.$childLength < 1 && fixedLeftIndex >= field.$resizeIdx) {
      if (field.$colspan <= 1) {
        fieldGroupInfo.left[depth].push(field);
      } else {
        const leftNode = cloneFieldMeta(field);
        if (leftNode.$resizeIdx > fixedLeftIndex) {
          leftNode.$colspan = fixedLeftIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedLeftIndex;
        }
        fieldGroupInfo.left[depth].push(leftNode);
        if (fixedLeftIndex < field.$resizeIdx) {
          const bodyNode = cloneFieldMeta(field);
          bodyNode.$colspan = field.$resizeIdx - fixedLeftIndex;
          fieldGroupInfo.center[depth].push(bodyNode);
        }
      }
      field.$panel = "left";
      if (field.$isLeaf) fieldGroupInfo.leafLeft.push(field);
    }
    if (fixedRightIndex > 0 && fixedRightIndex <= field.$resizeIdx) {
      if (field.$colspan == 1) {
        fieldGroupInfo.right[depth].push(field);
      } else {
        let rightColspan = field.$colspan;
        const bodyFieldColspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;
        if (fixedRightIndex <= field.$resizeIdx && bodyFieldColspan > 0) {
          const bodyNode = cloneFieldMeta(field);
          bodyNode.$colspan = bodyFieldColspan;
          bodyNode.$resizeIdx = fixedRightIndex - 1;
          rightColspan = rightColspan - bodyNode.$colspan;
          const idx = fieldGroupInfo.center[depth].findIndex((value) => value.$uid === bodyNode.$uid);
          if (idx > -1) {
            fieldGroupInfo.center[depth][idx] = bodyNode;
          } else {
            fieldGroupInfo.center[depth].push(bodyNode);
          }
        }
        const rightNode = cloneFieldMeta(field);
        rightNode.$colspan = rightColspan;
        rightNode.$resizeIdx = field.$resizeIdx;
        fieldGroupInfo.right[depth].push(rightNode);
      }
      field.$panel = "right";
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    }
    if (isUndefined(field.$panel)) {
      fieldGroupInfo.center[depth].push(field);
      field.$panel = "center";
      if (field.$isLeaf) fieldGroupInfo.leafCenter.push(field);
    }
    return field;
  }
  initFieldMeta(field, depth, fieldIndex, fieldGroupInfo) {
    var _a;
    const cfg = this.gridMain.config();
    const enableHelp = !isUndefined(field.headerHelp);
    if (!cfg.enabledHeaderHelpButton && enableHelp) cfg.enabledHeaderHelpButton = true;
    if (!cfg.enabledSortButton && field.sort) cfg.enabledSortButton = true;
    const children = field.children;
    const childrenLen = isArray(children) ? children.length : 0;
    let isLeaf = false;
    if (childrenLen < 1) {
      isLeaf = true;
      field.$colspan = field.colspan ?? 1;
    } else {
      field.$colspan = field.$colspan ?? 1;
    }
    field.$isLeaf = isLeaf;
    field.$resizeIdx = fieldGroupInfo.leaf.length - (isLeaf ? 0 : 1);
    field.$childLength = childrenLen;
    field.$rowspan = field.rowspan ?? 1;
    field.$depth = depth;
    field.$uid = `${this.gridMain.uid()}_${field.$depth}_${fieldIndex}`;
    field.$enabledHelp = enableHelp;
    if (isLeaf) {
      let width = isNumber(field.width) ? field.width : this.cellMinWidth;
      if (this.enabledViewAllLabel) {
        width = Math.max(width, getTextWidth(cfg, field.label, 20));
      }
      if (!field.$isAside) {
        width = Math.max(width, this.cellMinWidth);
      }
      field = this.rendererFactory.createRenderer(field);
      field.$colSeq = fieldGroupInfo.leaf.length;
      field.width = width;
      field.$width = width;
      field.$alignStyle = TEXT_ALIGN_STYLE[field.align] ?? (((_a = field.$renderer) == null ? void 0 : _a.alignStyle()) || TEXT_ALIGN_STYLE.left);
      fieldGroupInfo.leaf.push(field);
      cfg.allFieldMap.set(field.name, field);
    }
    return field;
  }
}
function cloneFieldMeta(field) {
  const result = {};
  const cloneKeys = [
    "name",
    "label",
    "$colspan",
    "$rowspan",
    "$depth",
    "$isLeaf",
    "$childLength",
    "$resizeIdx",
    "$width",
    "$alignStyle",
    "$isAside",
    "$panel",
    "$uid",
    "$colSeq",
    "$enabledHelp"
  ];
  for (const key of cloneKeys) {
    result[key] = field[key];
  }
  return result;
}
class FieldWidthCalculator {
  constructor(opts, gridMain) {
    this.opts = opts;
    this.gridMain = gridMain;
    this.cellMinWidth = opts.header.resize.minWidth;
  }
  /**
   * 컬럼 width 변경
   *
   * disableHorizontalScroll이 true인 경우
   * isHeaderResize 여부와 관계없이 항상
   * dimensions.width에 맞게 전체 컬럼을 재분배
   *
   * @public
   * @param idx column index
   * @param w column width
   */
  setColumnWidth(idx, w) {
    const cfg = this.gridMain.config();
    const field = cfg.currentFields[idx];
    if (!field) return;
    cfg.isHeaderResize = true;
    const { maxWidth } = this.gridMain.options().header.resize;
    let targetWidth = w;
    if (this.cellMinWidth !== -1) {
      targetWidth = Math.max(targetWidth, this.cellMinWidth);
    }
    if (maxWidth !== -1) {
      targetWidth = Math.min(targetWidth, maxWidth);
    }
    const oldWidth = field.$width ?? field.width;
    if (targetWidth === oldWidth) return;
    field.$width = targetWidth;
    if (cfg.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths();
    }
    this.gridMain.resizeDraw();
  }
  /**
   * disableHorizontalScroll 상태에서
   * 전체 일반 컬럼의 width를 dimensions.width에 맞게 설정
   *
   * @private
   */
  normalizeDisabledHorizontalWidths() {
    const cfg = this.gridMain.config();
    const { dimensions, currentFields: fields } = cfg;
    if (dimensions.width <= 0 || fields.length === 0) return;
    const targetWidth = gridAvailableWidth(cfg);
    if (targetWidth <= 0) return;
    this.ensureAllMinimumWidths(fields);
    let asideWidth = 0;
    let currentNormalWidth = 0;
    const normalFields = [];
    for (const field of fields) {
      const w = field.$width ?? field.width;
      if (field.$isAside) {
        field.$width = w;
        asideWidth += w;
      } else {
        normalFields.push(field);
        currentNormalWidth += w;
      }
    }
    if (normalFields.length === 0) return;
    const availableWidth = targetWidth - asideWidth;
    if (availableWidth <= 0) return;
    const diff = availableWidth - currentNormalWidth;
    if (diff > 0) {
      this.expandFields(normalFields, diff);
    } else if (diff < 0) {
      this.shrinkFields(normalFields, -diff);
    }
  }
  /**
   * 컬럼 minWidth 체크
   *
   * @private
   * @param fields 컬럼 목록
   */
  ensureAllMinimumWidths(fields) {
    const minWidth = this.cellMinWidth;
    if (minWidth === -1) return;
    for (const field of fields) {
      field.$width = Math.max(field.$width ?? field.width, minWidth);
    }
  }
  /**
   * 컬럼의 width를 축소
   *
   * @private
   * @param fields width를 줄일 컬럼 목록
   * @param amount 줄여야 하는 전체 width
   */
  shrinkFields(fields, amount) {
    if (amount <= 0 || fields.length === 0) return;
    this.ensureAllMinimumWidths(fields);
    const sortedFields = [...fields].sort((a, b) => (b.$width ?? b.width) - (a.$width ?? a.width));
    const minWidth = this.cellMinWidth;
    const totalShrinkableWidth = sortedFields.reduce(
      (acc, field) => acc + Math.max(0, (field.$width ?? field.width) - minWidth),
      0
    );
    let remainWidth = Math.min(amount, totalShrinkableWidth);
    if (remainWidth <= 0) return;
    while (remainWidth > 0) {
      const shrinkableFields = sortedFields.filter((f) => (f.$width ?? f.width) > minWidth);
      if (shrinkableFields.length === 0) break;
      const shrinkPerField = Math.max(1, Math.floor(remainWidth / shrinkableFields.length));
      for (const field of shrinkableFields) {
        if (remainWidth <= 0) break;
        const currentWidth = field.$width ?? field.width;
        const actualShrink = Math.min(currentWidth - minWidth, shrinkPerField, remainWidth);
        if (actualShrink > 0) {
          field.$width = currentWidth - actualShrink;
          remainWidth -= actualShrink;
        }
      }
    }
  }
  /**
   * 컬럼의 width를 증가
   *
   * @private
   * @param fields width를 증가시킬 컬럼 목록
   * @param amount 증가시켜야 하는 전체 width
   */
  expandFields(fields, amount) {
    if (amount <= 0 || fields.length === 0) return;
    this.ensureAllMinimumWidths(fields);
    const count = fields.length;
    const baseWidth = Math.floor(amount / count);
    const remainder = amount % count;
    for (let i = 0; i < count; i++) {
      const field = fields[i];
      field.$width = (field.$width ?? field.width) + baseWidth + (i < remainder ? 1 : 0);
    }
  }
  /**
   * 가로 스크롤 활성화 여부 체크
   *
   * @param fieldTotalWidth 모든 필드의 총 넓이
   */
  calculateHorizontalScroll(fieldTotalWidth) {
    const cfg = this.gridMain.config();
    if (cfg.disableHorizontalScroll) {
      cfg.scroll.enabledHorizontal = false;
      return;
    }
    const availableWidth = gridAvailableWidth(cfg);
    cfg.scroll.enabledHorizontal = fieldTotalWidth > availableWidth;
  }
  /**
   * 각 필드의 최종 width를 계산하고
   * 좌/중앙/우측 패널별 width 및 레이아웃 치수를 계산
   *
   * @param fields 현재 그리드 필드
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   * @param isHeaderResize 헤더 resize 여부
   */
  distributeWidths(fields, fieldTotalWidth, isHeaderResize) {
    const cfg = this.gridMain.config();
    const availableWidth = gridAvailableWidth(cfg);
    if (cfg.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths();
      this.calculatePanelWidths(fields, availableWidth);
      return;
    }
    const { remainderWidth, lastSpaceW, isAddSpaceWidth } = this.calculateFieldSpace(fieldTotalWidth, availableWidth);
    let remainSpaceWidth = lastSpaceW;
    for (const field of fields) {
      if (field.$isAside) {
        field.$width = isHeaderResize ? field.$width : field.width;
        continue;
      }
      let fieldWidth = isHeaderResize ? field.$width : field.width;
      if (!isHeaderResize && !this.opts.enabledWidthFixed) {
        fieldWidth += remainderWidth;
        if (remainSpaceWidth > 0) {
          const addSpaceW = Math.min(remainSpaceWidth, 1);
          fieldWidth += (isAddSpaceWidth ? 1 : -1) * addSpaceW;
          remainSpaceWidth -= addSpaceW;
        }
        if (this.cellMinWidth !== -1) {
          fieldWidth = Math.max(fieldWidth, this.cellMinWidth);
        }
      }
      field.$width = fieldWidth;
    }
    this.calculatePanelWidths(fields, availableWidth);
  }
  /**
   * 좌/중앙/우측 패널 width 및 layout 치수를 계산
   *
   * @private
   */
  calculatePanelWidths(fields, availableWidth) {
    const cfg = this.gridMain.config();
    const dimensions = cfg.dimensions;
    let leftWidth = 0;
    let centerWidth = 0;
    let rightWidth = 0;
    for (const field of fields) {
      const width = field.$width ?? field.width;
      if (field.$panel === "left") {
        leftWidth += width;
      } else if (field.$panel === "right") {
        rightWidth += width;
      } else {
        centerWidth += width;
      }
    }
    dimensions.mainLeftWidth = leftWidth;
    dimensions.mainCenterWidth = centerWidth;
    dimensions.mainRightWidth = rightWidth;
    dimensions.mainTotalWidth = leftWidth + centerWidth + rightWidth;
    dimensions.mainInsideWidth = availableWidth;
    dimensions.mainCenterOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth;
    dimensions.mainCenterViewWidth = dimensions.mainInsideWidth - (leftWidth + rightWidth);
  }
  /**
   * 컬럼의 여분 넓이를 계산
   *
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param verticalScrollWidth 세로 스크롤바 width
   */
  calculateFieldSpace(fieldTotalWidth, availableWidth) {
    const cfg = this.gridMain.config();
    const { dataInfo, currentFields: fields, scroll } = cfg;
    if (cfg.disableHorizontalScroll || scroll.enabledHorizontal) {
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: true };
    }
    const resizeFieldCount = fields.length - dataInfo.asideLength;
    if (resizeFieldCount <= 0) {
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: true };
    }
    const overWidth = availableWidth - fieldTotalWidth;
    const absOverWidth = Math.abs(overWidth);
    return {
      remainderWidth: (overWidth < 0 ? -1 : 1) * Math.floor(absOverWidth / resizeFieldCount),
      lastSpaceW: absOverWidth % resizeFieldCount,
      // 곱셈/뺄셈 대신 나머지 연산(%) 활용
      isAddSpaceWidth: overWidth >= 0
    };
  }
}
class RendererFactory {
  constructor(gridMain) {
    this.gridMain = gridMain;
  }
  /**
   * field renderer 생성
   *
   * @param {FieldItem} field field 정보
   * @returns {FieldItem} renderer 정보가 추가된 field
   */
  createRenderer(field) {
    if (field.$isAside) {
      field.$renderer = new ASIDE_RENDERER[field.renderer.type](field, this.gridMain);
      return field;
    }
    const cfg = this.gridMain.config();
    const editable = isFieldEditable(cfg, field);
    let editRenderer;
    if (!isUndefined(field.editRenderer)) {
      editRenderer = this.getEditRenderer(field, field.editRenderer, "");
      field.$editRenderer = editRenderer;
      if (editRenderer.supportsInteraction()) {
        field.$renderer = editRenderer;
        field.renderer = merge({}, DEFAULT_RENDERER_INFO, {
          type: field.editRenderer.type
        });
      }
    }
    if (!field.$renderer) {
      field = this.getViewRenderer(field);
    }
    if (editable && !field.$editRenderer) {
      field.$editRenderer = this.getEditRenderer(field, field.editRenderer, field.renderer.type);
    }
    return field;
  }
  getViewRenderer(field) {
    let renderInfo = { type: "text" };
    if (isPlainObject(field.renderer)) {
      renderInfo = merge({}, field.renderer);
    } else if (isString(field.renderer)) {
      renderInfo = { type: field.renderer };
    }
    const render = VIEW_RENDERER[renderInfo.type];
    if (isUndefined(render)) {
      renderInfo.type = "text";
    }
    field.renderer = merge({}, DEFAULT_RENDERER_INFO, renderInfo);
    field.$renderer = new VIEW_RENDERER[field.renderer.type](field, this.gridMain);
    return field;
  }
  getEditRenderer(field, editRendererInfo, rendererType) {
    if (isString(editRendererInfo)) {
      editRendererInfo = { type: editRendererInfo };
    }
    if (isUndefined(editRendererInfo) || isUndefined(editRendererInfo.type)) {
      editRendererInfo = { type: rendererType };
    }
    field.editRenderer = merge({}, DEFAULT_EDIT_RENDERER_INFO, editRendererInfo);
    let type = "text";
    const editType = editRendererInfo == null ? void 0 : editRendererInfo.type;
    if (editType && EDIT_RENDERER[editType]) {
      type = editType;
    } else if (EDIT_RENDERER[rendererType]) {
      type = rendererType;
    }
    return new EDIT_RENDERER[type](field, this.gridMain);
  }
}
class StructureBuilder {
  constructor(opts, gridMain) {
    this.opts = opts;
    this.gridMain = gridMain;
    this.rendererFactory = new RendererFactory(gridMain);
    this.fieldWidthCalculator = new FieldWidthCalculator(opts, gridMain);
    this.dimensionCalculator = new DimensionCalculator(opts, gridMain, this.fieldWidthCalculator);
    this.fieldBuilder = new FieldBuilder(opts, gridMain, this.rendererFactory);
  }
  /**
   * 사이즈 계산 후
   */
  calcGridDimension() {
    this.dimensionCalculator.calcGridDimension();
  }
  /**
   * body layout 계산
   *
   * @param {number} width 너비
   * @param {number} height 높이
   * @returns {void}
   */
  calculateBodyLayout(width, height) {
    this.dimensionCalculator.calculateBodyLayout(width, height);
  }
  /**
   * field 구조 생성
   *
   * @returns {void}
   */
  buildFields() {
    this.fieldBuilder.buildFields();
  }
  /**
   * 특정 컬럼의 너비를 조절;
   *
   * @public
   * @param {number} idx 컬럼 인덱스
   * @param {number} w 컬럼 너비
   */
  setColumnWidth(idx, w) {
    this.fieldWidthCalculator.setColumnWidth(idx, w);
  }
}
class Footer {
  constructor(gridMain) {
    var _a;
    this.footerOpts = gridMain.options().footer;
    this.gridMain = gridMain;
    this._isActive = ((_a = this.footerOpts) == null ? void 0 : _a.enabled) ?? false;
    if (!this._isActive) {
      return;
    }
    this.selectionInfo = gridMain.selectionInfo;
    this.cfg = this.gridMain.config();
    this.isSelectionInfo = !isUndefined(this.footerOpts.selection);
  }
  /**
   * init footer event
   */
  init() {
    var _a, _b, _c, _d;
    const footerElement = this.gridMain.element().findDaraElement(".dg-footer");
    if (!this.isEnabled()) {
      footerElement.getElement().remove();
      return;
    }
    this.footerElement = footerElement;
    this.selectionStatusElement = footerElement.findDaraElement(".dg-selection-status");
    footerElement.css({ height: `${this.cfg.dimensions.footerHeight}px` });
    footerElement.findDaraElement(".dg-status").addClass(AlignStyleMap[((_a = this.footerOpts.selection) == null ? void 0 : _a.position) ?? "center"]);
    if ((_b = this.footerOpts.paging) == null ? void 0 : _b.enabled) {
      this.paingElement = footerElement.findDaraElement(".dg-paging");
      this.pagingInfoElement = footerElement.findDaraElement(".dg-paging-info");
      this.paingElement.addClass(AlignStyleMap[((_c = this.footerOpts.paging) == null ? void 0 : _c.position) ?? "center"]);
      this.pagingInfoElement.addClass(AlignStyleMap[((_d = this.footerOpts.paging) == null ? void 0 : _d.formatPosition) ?? "center"]);
      this.setPagingTemplate(this.cfg.paging);
      this.initPagingEvent();
    }
  }
  isEnabled() {
    return this._isActive;
  }
  /**
   * init paging event
   */
  initPagingEvent() {
    var _a;
    const pagingCallback = (_a = this.footerOpts.paging) == null ? void 0 : _a.callback;
    const pagingElement = this.paingElement.getElement();
    this.cfg.eventManager.on({ el: pagingElement, type: "click", selector: ".dg-page-num" }, (e) => {
      const pageNumElement = e.target.closest(".dg-page-num");
      const pageNum = intValue(pageNumElement == null ? void 0 : pageNumElement.dataset.pageNo) ?? "1";
      if (pagingCallback) {
        pagingCallback(pageNum);
      } else {
        this.goPage(pageNum, true);
      }
      return true;
    });
  }
  goPage(pageNum, drawFlag = true) {
    if (isUndefined(this.footerOpts.paging)) {
      throw new Error("Paging is not enabled");
    }
    const pagingInfo = this.cfg.paging;
    pagingInfo.page = pageNum;
    pagingInfo.totalCount = pagingInfo.totalCount > 0 ? pagingInfo.totalCount : this.cfg.dataInfo.rowLength;
    if (pagingInfo.totalCount < 1) {
      this.setPagingInfo({ totalCount: 0 });
      this.paingElement.empty();
      return;
    }
    const pagingViewInfo = getPagingInfo(
      pagingInfo.totalCount,
      pagingInfo.page,
      pagingInfo.pageSize,
      pagingInfo.unitPage
    );
    this.setPagingTemplate(pagingViewInfo);
    const pageSize = pagingViewInfo == null ? void 0 : pagingViewInfo.pageSize;
    const startIdx = ((pagingViewInfo == null ? void 0 : pagingViewInfo.page) - 1) * pageSize;
    const viewItems = arrayCopy(this.cfg.dataManager.getOriginalViewItems(), startIdx, startIdx + pageSize);
    this.cfg.dataManager.setViewItems(viewItems);
    if (drawFlag) {
      this.gridMain.selectionInfo.setSelectionRangeInfo({}, true);
      this.gridMain.getScroll().moveVerticalScroll({ rowIdx: 0 });
      this.gridMain.refreshBody(drawFlag, "footer draw");
    }
  }
  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  setSelectionStatus(dataInfo) {
    var _a, _b, _c;
    if (this.isSelectionInfo && this.footerOpts.enabled && ((_a = this.footerOpts.selection) == null ? void 0 : _a.showSummary)) {
      const dataInfo2 = this.selectionInfo.selectionData("json", true);
      if (!isUndefined(dataInfo2) && ((_b = dataInfo2 == null ? void 0 : dataInfo2.summary) == null ? void 0 : _b.count) > 1) {
        const selectionFormat = (_c = this.footerOpts.selection) == null ? void 0 : _c.format;
        let statusText = "";
        if (isString(selectionFormat)) {
          dataInfo2.summary.enabledSummary = dataInfo2.summary.numFieldCount > 0;
          statusText = replaceMesasgeFormat(selectionFormat, dataInfo2.summary);
        } else if (isFunction(selectionFormat)) {
          statusText = selectionFormat(dataInfo2);
        }
        this.selectionStatusElement.text(statusText);
      } else {
        this.selectionStatusElement.text("");
      }
    }
  }
  /**
   * set paging info
   *
   * @param pagingInfo paging info
   */
  setPagingInfo(pagingInfo) {
    var _a, _b;
    if ((_a = this.footerOpts.paging) == null ? void 0 : _a.enabled) {
      const pageSize = pagingInfo.pageSize;
      const start = (pagingInfo.page - 1) * pageSize;
      const statusInfo = {
        start: start + 1,
        end: start + pageSize,
        total: pagingInfo.totalCount
      };
      statusInfo.end = statusInfo.end > pagingInfo.totalCount ? pagingInfo.totalCount : statusInfo.end;
      if (pagingInfo.totalCount > 0) {
        const pagingFormat = (_b = this.footerOpts.paging) == null ? void 0 : _b.format;
        let pagingText = "";
        if (isString(pagingFormat)) {
          pagingText = replaceMesasgeFormat(pagingFormat, statusInfo);
        } else if (isFunction(pagingFormat)) {
          pagingText = pagingFormat(statusInfo);
        }
        this.pagingInfoElement.text(pagingText);
      } else {
        this.pagingInfoElement.text("");
      }
    }
  }
  /**
   * paging
   *
   * @public
   * @param {PagingInfo} pagingInfo paging info
   * @returns {this}
   */
  setPagingTemplate(pagingInfo) {
    this.cfg.paging = pagingInfo;
    this.setPagingInfo(pagingInfo);
    let currentPage = pagingInfo.page;
    if (currentPage == 0) currentPage = 1;
    const preP_is = pagingInfo.prePage_is;
    const currS = pagingInfo.currStartPage;
    let currE = pagingInfo.currEndPage;
    if (currE == 0) currE = 1;
    const nextO = 1 * currentPage + 1;
    const preO = currentPage - 1;
    const strHTML = [];
    strHTML.push("<ul >");
    if (currentPage <= 1) {
      strHTML.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>');
    } else {
      strHTML.push(
        ' <li><a href="javascript:" class="dg-page-num page-icon" data-page-no="' + preO + '">&laquo;</a></li>'
      );
    }
    if (preP_is && currE - pagingInfo.unitPage >= 0) {
      strHTML.push(' <li class="dg-page-num" data-page-no="1"><a href="javascript:" >1...</a></li>');
    }
    let no = 0;
    for (no = currS * 1; no <= currE * 1; no++) {
      if (no == currentPage) {
        strHTML.push(' <li class="active"><a href="javascript:">' + no + "</a></li>");
      } else {
        strHTML.push(' <li class="dg-page-num" data-page-no="' + no + '"><a href="javascript:" >' + no + "</a></li>");
      }
    }
    if (currS + pagingInfo.unitPage < pagingInfo.totalPages) {
      strHTML.push(
        html`<li class="dg-page-num" data-page-no="${pagingInfo.totalPages}">
          ...<a href="javascript:">${pagingInfo.totalPages}</a>
        </li>`
      );
    }
    if (currentPage == currE) {
      strHTML.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>');
    } else {
      strHTML.push(` <li><a href="javascript:" class="dg-page-num page-icon" data-page-no="${nextO}">&raquo;</a></li>`);
    }
    strHTML.push("</ul>");
    this.paingElement.html(strHTML.join(""));
  }
}
const DBLCLICK_DELAY = 300;
class ClickManager {
  constructor(delay = DBLCLICK_DELAY) {
    this.lastClickTime = 0;
    this.clickCount = 0;
    this.clickDelay = delay;
    this.resetClick();
  }
  getClickCount() {
    return this.clickCount;
  }
  resetClick() {
    this.clickCount = 0;
    this.currentPointerPosition = { x: 0, y: 0, clientX: 0, clientY: 0 };
  }
  conserveClick(pointerPosition) {
    this.currentPointerPosition = pointerPosition;
    this.clickCount = 1;
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => this.resetClick(), this.clickDelay);
  }
  processClick(session, handler) {
    var _a, _b;
    const now = Date.now();
    if (now - this.lastClickTime < DBLCLICK_DELAY) {
      this.clickCount++;
    }
    this.lastClickTime = now;
    if (this.clickCount === 2) {
      if (!isMouseMoved(session.startPos, this.currentPointerPosition, 5)) {
        (_a = handler.onDoubleClick) == null ? void 0 : _a.call(handler, session);
        this.resetClick();
        return;
      }
    }
    this.conserveClick(session.startPos);
    (_b = handler.onClick) == null ? void 0 : _b.call(handler, session);
  }
}
class BasePointerHandler {
  constructor(context) {
    this.priority = 0;
    this.context = context;
    this.cfg = context.gridMain.config();
    this.opts = context.gridMain.options();
  }
  canHandle(session) {
    return true;
  }
}
class CellClickHandler extends BasePointerHandler {
  constructor(context, bodyEvent) {
    var _a;
    super(context);
    this.priority = 5;
    this.bodyDragDelay = 150;
    this.moveRange = { endIdx: -1, endCol: -1 };
    this.beforeEndIdx = -1;
    this.beforeEndCol = -1;
    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
    this.dragAnimationId = 0;
    this.lastScrollTime = 0;
    this.selectionInfo = context.gridMain.selectionInfo;
    this.bodyElement = (_a = context.body) == null ? void 0 : _a.getBodyElement().getElement();
    this.selectionMode = this.opts.selectionMode;
    this.multipleFlag = isMultipleSelectionMode(this.selectionMode);
    this.cellClickFn = this.opts.body.cellClick;
    const { rowHeight, enabledCellEdit } = this.cfg;
    this.rowHeight = rowHeight;
    this.cellDblClick = this.opts.body.cellDblClick;
    this.isCellDbClickEvent = enabledCellEdit || isFunction(this.cellDblClick);
  }
  onPointerDown(session) {
    var _a;
    this.cellElement = session.cellEl;
    this.startCellInfo = session.cellInfo;
    this.currentSelectionMode = this.selectionMode;
    if (this.startCellInfo.rowIndex > -1) {
      this.cfg.searchMatchInfo.rowIndex = this.startCellInfo.rowIndex;
    }
    if (this.multipleFlag && ((_a = session.cellInfo) == null ? void 0 : _a.field.name) == LINE_NUMBER_NAME) {
      this.currentSelectionMode = SelectionModeMap.multiRow;
    }
  }
  onActivate(session) {
    const cfg = this.cfg;
    const position = getElementRect(this.bodyElement, true);
    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;
    this.gridBounds = {
      gridLeft: position.left,
      gridRight: position.left + cfg.dimensions.mainTotalWidth,
      mainLeft: position.left + mainLeftWidth,
      mainRight: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight
    };
    this.bodyPosition = position;
    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
    this.beforeEndIdx = -1;
    this.beforeEndCol = -1;
  }
  onPointerMove(session) {
    if (!this.multipleFlag) return;
    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x, y } = session.currentPos;
    const moveRange = this.moveRange;
    moveRange.endCol = -1;
    moveRange.endIdx = -1;
    let hasMove = false;
    const moveXInfo = dragHorizontalMovePosition(
      cfg,
      x,
      this.bodyPosition.left,
      bounds.mainLeft,
      bounds.mainRight
    );
    if (moveXInfo.overCell > -1) {
      hasMove = true;
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(
        this.currentSelectionMode,
        moveXInfo.overCell,
        cfg,
        this.cellElement,
        cfg.selection.isMouseDown
      ).endCol;
    }
    const moveYInfo = dragVerticalMovePosition(cfg, y, this.rowHeight, this.startCellInfo, bounds.top, bounds.bottom);
    if (moveYInfo.rowIdx > -1) {
      hasMove = true;
      moveRange.endIdx = moveYInfo.rowIdx;
    }
    this.scrollDirectionX = moveXInfo.scrollDirectionX;
    this.scrollDirectionY = moveYInfo.scrollDirectionY;
    if (this.beforeEndIdx === moveRange.endIdx && this.beforeEndCol === moveRange.endCol) return;
    if (hasMove) {
      this.selectionInfo.setSelectionRangeInfo(
        { range: moveRange },
        false,
        this.scrollDirectionX === null && this.scrollDirectionY === null
      );
    }
    this.beforeEndCol = moveRange.endCol ?? -1;
    this.beforeEndIdx = moveRange.endIdx ?? -1;
    if ((this.scrollDirectionX || this.scrollDirectionY) && this.dragAnimationId === 0) {
      this.startAutoScroll();
    }
  }
  startAutoScroll(selection = true) {
    if (this.dragAnimationId) return;
    this.lastScrollTime = 0;
    const cfg = this.cfg;
    const beforeMovePosition = { col: -1, rowIdx: -1 };
    const gridMain = this.context.gridMain;
    const scroll = gridMain.getScroll();
    const body = this.context.gridMain.getBody();
    const loop = (time) => {
      const scrollDirectionX = this.scrollDirectionX;
      const scrollDirectionY = this.scrollDirectionY;
      if (scrollDirectionX === null && scrollDirectionY === null) {
        this.stopAutoScroll();
        return;
      }
      if (time - this.lastScrollTime < this.bodyDragDelay) {
        this.dragAnimationId = requestAnimationFrame(loop);
        return;
      }
      this.lastScrollTime = time;
      let isDraw = false;
      const moveRangeInfo = {};
      if (scrollDirectionX !== null) {
        const isRight = scrollDirectionX === ScrollDirectionXMap.RIGHT;
        const endCol = isRight ? cfg.scroll.insideEndCol + 3 : cfg.scroll.insideStartCol - 3;
        if (beforeMovePosition.col !== endCol) {
          if (isRight && cfg.fixedRightIndex === 0 || !isRight && cfg.fixedLeftIndex === 0) {
            moveRangeInfo.endCol = endCol;
          }
          scroll.moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });
          beforeMovePosition.col = endCol;
          isDraw = true;
        }
      }
      if (scrollDirectionY !== null) {
        const endIdx = scrollDirectionY === ScrollDirectionYMap.DOWN ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1 : cfg.scroll.startIdx - 1;
        if (beforeMovePosition.rowIdx !== endIdx) {
          moveRangeInfo.endIdx = endIdx;
          scroll.moveVerticalScroll({ direction: scrollDirectionY, drawFlag: false });
          beforeMovePosition.rowIdx = endIdx;
          isDraw = true;
        }
      }
      if (isDraw) {
        if (selection) {
          this.selectionInfo.setSelectionRangeInfo({ range: moveRangeInfo }, false, false);
        }
        body.dataDraw("dragscroll");
      }
      this.dragAnimationId = requestAnimationFrame(loop);
    };
    this.dragAnimationId = requestAnimationFrame(loop);
  }
  stopAutoScroll() {
    if (this.dragAnimationId !== 0) {
      cancelAnimationFrame(this.dragAnimationId);
      this.dragAnimationId = 0;
    }
  }
  onPointerUp(session) {
    this.stopAutoScroll();
  }
  onClick(session) {
    var _a, _b, _c;
    const isGroupRow = !!((_b = (_a = this.startCellInfo) == null ? void 0 : _a.viewItem) == null ? void 0 : _b.groupRowType);
    if (this.selectionMode != SelectionModeMap.none) {
      this.setCellClick(
        session.event,
        this.startCellInfo,
        this.multipleFlag,
        this.currentSelectionMode,
        this.cellElement
      );
    }
    if (!isGroupRow) {
      (_c = this.cellClickFn) == null ? void 0 : _c.call(this, this.startCellInfo);
    }
  }
  onDoubleClick(session) {
    var _a;
    if (!this.isCellDbClickEvent) return;
    const cellInfo = session.cellInfo;
    if ((_a = cellInfo.viewItem) == null ? void 0 : _a.groupRowType) return;
    const field = cellInfo.field;
    if (this.cellDblClick) {
      this.cellDblClick(this.startCellInfo);
    }
    if (!field.$isAside && isFieldEditable(this.cfg, field)) {
      setTimeout(() => {
        field.$editRenderer.render(cellInfo, session.cellEl);
      }, 10);
      return;
    }
  }
  setCellClick(e, cellInfo, multipleFlag, selectionMode, cellElement) {
    var _a;
    const context = this.context;
    const cfg = context.gridMain.config();
    const gridMain = context.gridMain;
    if (!(cellInfo.field.renderer.type == "dropdown" && cellInfo.c == +cfg.activeComponent)) {
      gridMain.hideLayer();
    }
    const rowIndex = cellInfo.rowIndex, cellIdx = cellInfo.c;
    if (!isFixedLeftPostion(cfg, cellIdx) && !isFixedRightPostion(cfg, cellIdx)) {
      if (cellIdx < cfg.scroll.insideStartCol) {
        gridMain.getScroll().moveHorizontalScroll({ direction: ScrollDirectionXMap.LEFT, colIdx: cellIdx });
      } else if (cellIdx > cfg.scroll.insideEndCol) {
        gridMain.getScroll().moveHorizontalScroll({ direction: ScrollDirectionXMap.RIGHT, colIdx: cellIdx });
      }
    }
    const keyMode = (isShiftKey(e) ? 2 : 0) + (isCtrlKey(e) ? 1 : 0);
    const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(
      selectionMode,
      cellIdx,
      cfg,
      cellElement,
      multipleFlag && keyMode == 2
    );
    if (multipleFlag && keyMode != 2 || !multipleFlag) {
      gridMain.selectionInfo.removeStartAnchorCell();
    }
    const rangeType = isRowSelectionMode(selectionMode) ? "row" : "cell";
    if (multipleFlag && keyMode >= 2) {
      const rangeInfo = { endIdx: rowIndex, endCol: selectRangeInfo.endCol, modifierKey: 2 };
      if (selectRangeInfo.startCol > -1) {
        rangeInfo.startCol = selectRangeInfo.startCol;
      }
      rangeInfo.type = rangeType;
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: rangeInfo,
          isMouseDown: true
        },
        false,
        true
      );
    } else if (multipleFlag && keyMode == 1) {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: {
            type: rangeType,
            startIdx: rowIndex,
            endIdx: rowIndex,
            startCol: selectRangeInfo.startCol,
            endCol: selectRangeInfo.endCol,
            modifierKey: 1
          },
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: selectRangeInfo.startCol }
        },
        false,
        true
      );
    } else {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: {
            type: rangeType,
            startIdx: rowIndex,
            endIdx: rowIndex,
            startCol: selectRangeInfo.startCol,
            endCol: selectRangeInfo.endCol
          },
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: cellIdx }
        },
        true,
        true
      );
    }
    (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
  }
}
class KeydownEvent {
  constructor(gridMain, body, selectionInfo) {
    this.pendingScroll = null;
    this.scrollRafId = null;
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;
  }
  /**
   * keydown event
   */
  init() {
    this.pasteElement = new DaraElement(this.gridMain.element().find(".dg-paste-area"));
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    const selectionMode = opts.selectionMode;
    const isMultiple = isMultipleSelectionMode(selectionMode);
    const searchEnabledd = opts.search.enabled;
    const pasteElement = this.pasteElement.getElement();
    const gridKeyInputElement = this.gridMain.getGridKeyInputElement();
    cfg.eventManager.off(gridKeyInputElement, "keydown");
    cfg.eventManager.on(
      {
        el: gridKeyInputElement,
        type: "keydown"
      },
      (e) => {
        this.gridMain.hideLayer();
        if (isEsc(e)) {
          return;
        }
        const code = eventCodeValue(e);
        if (isCtrlKey(e)) {
          if (code === "KeyC") {
            if (selectionMode === "none") {
              return;
            }
            this.body.copyData();
            return;
          }
          if (code === "KeyA") {
            if (isMultiple) {
              this.selectionInfo.setAllSelection(true);
            }
            return false;
          }
          if (code === "KeyV") {
            pasteElement.focus();
            requestAnimationFrame(() => {
              this.gridMain.setGridFocusIn();
            });
            return true;
          }
          if (code === "KeyF") {
            stopPreventCancel(e);
            if (searchEnabledd) {
              this.gridMain.getDataSearch().openSearch();
            }
            return true;
          }
          if (code === "KeyZ") {
            stopPreventCancel(e);
            if (e.shiftKey) {
              cfg.dataManager.redo();
            } else {
              cfg.dataManager.undo();
            }
            return true;
          }
          if (code === "KeyY") {
            stopPreventCancel(e);
            cfg.dataManager.redo();
            return true;
          }
        }
        if (this.isNavigationKey(code)) {
          stopPreventCancel(e);
          this.selectionInfo.setAllSelection(false);
          this.arrowKeydownEvent(e, code);
          return;
        }
        const startCell = cfg.selection.startCell;
        const field = cfg.currentFields[startCell.startCol];
        if (!field) {
          return;
        }
        const isSpace = isSpacebar(e);
        if (isSpace) {
          stopPreventCancel(e);
          if (field.renderer.type === "tree") {
            const startElement = this.gridMain.getBody().getStartCellElement();
            const cellInfo = getCellInfo(cfg, startElement);
            if (field.$renderer.bindEvents("space", cellInfo, startElement)) {
              return true;
            }
          }
        }
        if (isFieldEditable(cfg, field) && (isSpace || code.startsWith("Key") || code.startsWith("Digit"))) {
          this.insideScrollCheck(code, e, cfg.scroll, startCell.startIdx, startCell.startCol);
          const startElement = this.gridMain.getBody().getStartCellElement();
          const cellInfo = getCellInfo(cfg, startElement);
          if (!isSpace) {
            cellInfo.inputValue = "";
          }
          field.$editRenderer.render(cellInfo, startElement);
          return;
        }
      }
    );
  }
  /**
   * navigation key 여부
   */
  isNavigationKey(code) {
    return code.startsWith("Arrow") || code === "Home" || code === "End" || code === "PageUp" || code === "PageDown" || code === "Enter" || code === "Tab";
  }
  /**
   * 방향키 navigation
   */
  arrowKeydownEvent(evt, evtCode) {
    const cfg = this.gridMain.config();
    const scrollInfo = cfg.scroll;
    const dataInfo = cfg.dataInfo;
    const startCell = cfg.selection.startCell;
    this.selectionInfo.removeStartAnchorCell();
    const currentRowIdx = startCell.startIdx;
    const currentColIdx = startCell.startCol;
    const insideViewRow = Math.max(scrollInfo.insideViewRow - 1, 0);
    const gridStartCol = dataInfo.startCol;
    const isCtrl = isCtrlKey(evt);
    switch (evtCode) {
      case "PageDown":
      case "Enter":
      case "ArrowDown": {
        const moveRowIdx = this.getDownRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow, dataInfo.rowLength);
        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx)) {
          return;
        }
        if (moveRowIdx >= scrollInfo.startIdx + insideViewRow) {
          this.scheduleVerticalScroll(moveRowIdx - insideViewRow, ScrollDirectionYMap.DOWN);
        }
        return;
      }
      case "PageUp":
      case "ArrowUp": {
        const moveRowIdx = this.getUpRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow);
        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx)) {
          return;
        }
        if (moveRowIdx < scrollInfo.startIdx) {
          this.scheduleVerticalScroll(moveRowIdx, ScrollDirectionYMap.UP);
        }
        return;
      }
      case "Home":
      case "ArrowLeft": {
        const moveColIdx = this.getLeftColumnIndex(evtCode, isCtrl, currentColIdx, gridStartCol);
        if (this.insideScrollCheck(evtCode, evt, scrollInfo, currentRowIdx, moveColIdx)) {
          return;
        }
        if (!isFixedLeftPostion(cfg, moveColIdx) && moveColIdx < scrollInfo.insideStartCol) {
          this.scheduleHorizontalScroll(moveColIdx, ScrollDirectionXMap.LEFT);
        }
        return;
      }
      case "End":
      case "Tab":
      case "ArrowRight": {
        const moveColIdx = this.getRightColumnIndex(evtCode, isCtrl, currentColIdx, dataInfo.colLength);
        if (this.insideScrollCheck(evtCode, evt, scrollInfo, currentRowIdx, moveColIdx)) {
          return;
        }
        if (!isFixedRightPostion(cfg, moveColIdx) && moveColIdx > scrollInfo.insideEndCol) {
          this.scheduleHorizontalScroll(moveColIdx, ScrollDirectionXMap.RIGHT);
        }
        return;
      }
      default:
        return;
    }
  }
  /**
   * Down row index
   */
  getDownRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow, rowLength) {
    if (evtCode === "ArrowDown" && isCtrl) {
      return Math.max(rowLength - 1, 0);
    }
    const step = evtCode === "PageDown" ? insideViewRow : 1;
    return Math.min(currentRowIdx + step, Math.max(rowLength - 1, 0));
  }
  /**
   * Up row index
   */
  getUpRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow) {
    if (evtCode === "ArrowUp" && isCtrl) {
      return 0;
    }
    const step = evtCode === "PageUp" ? insideViewRow : 1;
    return Math.max(currentRowIdx - step, 0);
  }
  /**
   * Left column index
   */
  getLeftColumnIndex(evtCode, isCtrl, currentColIdx, gridStartCol) {
    if (evtCode === "ArrowLeft" && isCtrl) {
      return gridStartCol;
    }
    if (evtCode === "Home") {
      return gridStartCol;
    }
    return Math.max(currentColIdx - 1, gridStartCol);
  }
  /**
   * Right column index
   */
  getRightColumnIndex(evtCode, isCtrl, currentColIdx, colLength) {
    const lastColIdx = Math.max(colLength - 1, 0);
    if (evtCode === "ArrowRight" && isCtrl) {
      return lastColIdx;
    }
    if (evtCode === "End") {
      return lastColIdx;
    }
    return Math.min(currentColIdx + 1, lastColIdx);
  }
  /**
   * 현재 이동 위치가 viewport 밖인지 확인
   */
  insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, moveColIdx) {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    const keyNavHandler = opts.body.keyNavHandler;
    if (isFunction(keyNavHandler)) {
      const dataManager = cfg.dataManager;
      const viewItems = dataManager.getViewItems();
      const viewItem = viewItems[moveRowIdx];
      const item = viewItem ? dataManager.getRowItem(viewItem.id) : void 0;
      if (keyNavHandler({
        code: evtCode,
        moveCol: moveColIdx,
        moveRow: moveRowIdx,
        item,
        evt
      }) === false) {
        return true;
      }
    }
    this.selectionInfo.setRangeInfo(evtCode, evt, moveRowIdx, moveColIdx);
    const checkCode = getScrollDirectionCode(cfg, scrollInfo, moveRowIdx, moveColIdx);
    if (checkCode <= 0) {
      return false;
    }
    const horizontal = Math.floor(checkCode / 10);
    const vertical = checkCode % 10;
    if (horizontal > 0) {
      const direction = horizontal === 1 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT;
      this.scheduleHorizontalScroll(moveColIdx, direction);
    }
    if (vertical > 0) {
      const direction = vertical === 1 ? ScrollDirectionYMap.DOWN : ScrollDirectionYMap.UP;
      const rowIdx = moveRowIdx - (vertical === 1 ? 0 : Math.max(scrollInfo.insideViewRow - 1, 0));
      this.scheduleVerticalScroll(rowIdx, direction);
    }
    return true;
  }
  /**
   * Vertical scroll cache
   */
  scheduleVerticalScroll(rowIdx, direction) {
    if (!this.pendingScroll) {
      this.pendingScroll = {};
    }
    this.pendingScroll.vertical = {
      rowIdx,
      direction
    };
    if (this.pendingScroll.horizontal) {
      this.pendingScroll.horizontal = {
        ...this.pendingScroll.horizontal
      };
    }
    this.scheduleScrollFrame();
  }
  /**
   * Horizontal scroll cache
   */
  scheduleHorizontalScroll(colIdx, direction) {
    if (!this.pendingScroll) {
      this.pendingScroll = {};
    }
    this.pendingScroll.horizontal = {
      colIdx,
      direction
    };
    this.scheduleScrollFrame();
  }
  /**
   * scroll 실행
   */
  scheduleScrollFrame() {
    if (this.scrollRafId !== null) {
      return;
    }
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      const pending = this.pendingScroll;
      this.pendingScroll = null;
      if (!pending) {
        return;
      }
      const scrollCtrl = this.gridMain.getScroll();
      const horizontal = pending.horizontal;
      const vertical = pending.vertical;
      if (horizontal) {
        scrollCtrl.moveHorizontalScroll({
          direction: horizontal.direction,
          colIdx: horizontal.colIdx,
          drawFlag: !vertical
        });
      }
      if (vertical) {
        scrollCtrl.moveVerticalScroll({
          rowIdx: vertical.rowIdx,
          direction: vertical.direction
        });
      }
    });
  }
  destroy() {
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    this.pendingScroll = null;
  }
}
class PasteEvent {
  constructor(gridMain, selectionInfo) {
    this.gridMain = gridMain;
    this.selectionInfo = selectionInfo;
  }
  /**
   * init paste event
   */
  init() {
    this.pasteElement = new DaraElement(this.gridMain.element().find(".dg-paste-area"));
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = isFunction(pasteBeforeFn);
    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = isFunction(pasteAfterFn);
    const pasteElement = this.pasteElement.getElement();
    cfg.eventManager.on(
      {
        el: pasteElement,
        type: "paste"
      },
      (event) => {
        var _a;
        this.gridMain.setGridFocusIn();
        const clipboardData = event.clipboardData;
        if (!clipboardData) {
          throw new Error("paste clipboard not found");
        }
        let pastedText = clipboardData.getData("text");
        if (pasteBeforeFnFlag) {
          pastedText = pasteBeforeFn(pastedText);
        }
        if (!pastedText) {
          return;
        }
        const parsed = parseClipboard(pastedText);
        const startCellInfo = cfg.selection.startCell;
        const { currentFields, dataInfo, dataManager } = cfg;
        const startIdx = startCellInfo.startIdx;
        const startCol = startCellInfo.startCol;
        const headerItemsLength = currentFields.length;
        let itemLength = dataInfo.rowLength;
        let maxCol = startCol;
        let pasteResultItems = dataManager.getViewItems();
        dataManager.beginHistory();
        try {
          if (startIdx + parsed.length > itemLength) {
            const addCount = startIdx + parsed.length - itemLength;
            for (let i = 0; i < addCount; i++) {
              dataManager.createItem({});
            }
            pasteResultItems = dataManager.getViewItems();
            itemLength = pasteResultItems.length;
          }
          for (let i = 0; i < parsed.length; i++) {
            const rowIdx = startIdx + i;
            if (rowIdx >= itemLength) {
              break;
            }
            const viewItem = pasteResultItems[rowIdx];
            if (viewItem.groupRowType) {
              continue;
            }
            const row = parsed[i];
            const rowItem = dataManager.getRowItem(viewItem.id);
            if (!rowItem) {
              continue;
            }
            for (let j = 0; j < row.length; j++) {
              const colIdx = startCol + j;
              if (colIdx >= headerItemsLength) {
                continue;
              }
              maxCol = Math.max(maxCol, colIdx);
              let value = row[j];
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
              }
              if (/^=/.test(value)) {
                value = `'${value}`;
              }
              const field = currentFields[colIdx];
              const rendererResult = (_a = field.$editRenderer) == null ? void 0 : _a.setValue(event, rowItem, value, false);
              if (rendererResult === false) {
                return false;
              }
            }
          }
          this.gridMain.refreshBody(false, "paste");
          this.selectionInfo.setSelectionRangeInfo(
            {
              range: {
                startIdx,
                endIdx: startIdx + parsed.length - 1,
                startCol,
                endCol: maxCol
              },
              startCell: startCellInfo
            },
            true,
            false
          );
          dataManager.commitHistory();
        } catch (error) {
          dataManager.rollbackHistory();
          throw error;
        }
        this.gridMain.getBody().dataDraw("reDraw_paste");
        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      }
    );
  }
}
class RowMoveHandler extends CellClickHandler {
  constructor(context, bodyEvent) {
    super(context, bodyEvent);
    this.priority = 10;
    this.ROW_DRAG_RATIO = 2;
    this.dropRowIdx = -1;
    this.moveRowIndexs = [];
    this.moveViewItems = [];
    this.isDropForbidden = true;
    this.isMoveRowSequential = false;
    this.language = context.gridMain.i18n();
    this.rowMoveOptions = this.opts.body.rowMove;
    this.isSelectionRowMode = isRowSelectionMode(this.selectionMode);
    this.rowMoveDropHelperElement = context.gridMain.element().findDaraElement(".dg-drop-indicator").getElement();
    this.initTemplate();
  }
  initTemplate() {
    var _a;
    const rowMoveElement = document.createElement("div");
    rowMoveElement.className = "dg-row-move-helper";
    rowMoveElement.style.cssText = `height: ${this.rowHeight}px; display: none;`;
    const statusElement = document.createElement("div");
    statusElement.className = "dg-row-move-status dg-icon";
    rowMoveElement.appendChild(statusElement);
    const helperElement = document.createElement("div");
    helperElement.className = "dg-row-move-content";
    rowMoveElement.appendChild(helperElement);
    (_a = document.querySelector(HIDDEN_ELEMENT_SELECTOR)) == null ? void 0 : _a.appendChild(rowMoveElement);
    this.rowMoveElement = rowMoveElement;
  }
  canHandle(session) {
    var _a, _b;
    const moveRowItem = session.cellInfo;
    if ((_a = moveRowItem.viewItem) == null ? void 0 : _a.groupRowType) {
      return false;
    }
    const rowMoveOptions = this.rowMoveOptions;
    const fieldName = (_b = moveRowItem.field) == null ? void 0 : _b.name;
    const dragHandle = rowMoveOptions == null ? void 0 : rowMoveOptions.dragHandle;
    if (dragHandle !== "ALL" && dragHandle !== fieldName && !((rowMoveOptions == null ? void 0 : rowMoveOptions.enabledDragHandle) !== false && fieldName === ROW_DRAG_HANDLE_NAME)) {
      return false;
    }
    this.moveRowIndexs.length = 0;
    this.moveViewItems.length = 0;
    this.dropRowIdx = -1;
    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
    this.isDropForbidden = true;
    return true;
  }
  onClick(session) {
  }
  onActivate(session) {
    var _a, _b;
    const cfg = this.cfg;
    const opts = this.opts;
    const moveStartItem = session.cellInfo;
    const rowMoveOptions = opts.body.rowMove;
    const allRange = this.cfg.selection.allRange;
    const moveRowIndexs = [];
    if (allRange.size > 0) {
      const col = moveStartItem.field.$colSeq;
      if (this.isSelectionRowMode) {
        const { colLength, startCol } = this.cfg.dataInfo;
        const lastCol = colLength - 1;
        for (const [key, range] of allRange) {
          const { minIdx, maxIdx } = range;
          if (range.minCol == startCol && lastCol == range.maxCol) {
            for (let idx = minIdx; idx <= maxIdx; idx++) {
              if (range.mode == "remove") {
                const removeIdx = moveRowIndexs.indexOf(idx);
                if (removeIdx !== -1) {
                  moveRowIndexs.splice(removeIdx, 1);
                }
              } else {
                moveRowIndexs.push(idx);
              }
            }
          } else {
            moveRowIndexs.length = 0;
            break;
          }
        }
      } else if (col > -1) {
        for (const [key, range] of allRange) {
          const { minIdx, maxIdx } = range;
          let breakFlag = false;
          for (let idx = minIdx; idx <= maxIdx; idx++) {
            if (this.selectionInfo.isCellSelection(range, idx, col)) {
              if (range.mode == "remove") {
                const removeIdx = moveRowIndexs.indexOf(idx);
                if (removeIdx !== -1) {
                  moveRowIndexs.splice(removeIdx, 1);
                }
              } else {
                moveRowIndexs.push(idx);
              }
            } else {
              breakFlag = true;
            }
          }
          if (breakFlag) {
            moveRowIndexs.length = 0;
            break;
          }
        }
      }
    }
    const moveItems = [];
    if (moveRowIndexs.length > 0) {
      const viewItems = cfg.dataManager.getViewItems();
      if (moveRowIndexs.includes(moveStartItem.rowIndex)) {
        moveRowIndexs.sort((a, b) => a - b);
        for (const rowIdx of moveRowIndexs) {
          moveItems.push(cfg.dataManager.getRowItem(viewItems[rowIdx].id));
        }
      } else {
        moveRowIndexs.length = 0;
      }
    }
    if (moveRowIndexs.length < 1) {
      this.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, session.cellEl);
      moveRowIndexs.push(moveStartItem.rowIndex);
      moveItems.push(moveStartItem.item);
    }
    if (((_a = rowMoveOptions == null ? void 0 : rowMoveOptions.dragStart) == null ? void 0 : _a.call(rowMoveOptions, { moveItems })) === false) {
      return false;
    }
    this.moveRowIndexs = moveRowIndexs;
    this.moveViewItems = moveItems;
    this.isMoveRowSequential = isSequential(moveRowIndexs);
    this.moveStartItem = moveStartItem;
    const position = getElementRect(this.context.gridMain.getBody().getBodyElement().getElement(), true);
    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;
    this.gridBounds = {
      gridLeft: position.left,
      gridRight: position.left + cfg.dimensions.mainTotalWidth,
      mainLeft: position.left + mainLeftWidth,
      mainRight: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight
    };
    this.bodyPosition = position;
    const helperTemplate = (_b = rowMoveOptions == null ? void 0 : rowMoveOptions.dragTemplate) == null ? void 0 : _b.call(rowMoveOptions, { moveItems: this.moveViewItems });
    const helperContent = this.rowMoveElement.querySelector(".dg-row-move-content");
    if (helperTemplate) {
      helperContent.innerHTML = helperTemplate;
    } else {
      helperContent.textContent = `${this.moveViewItems.length} ${this.language.getMessage("row")}`;
    }
    this.rowMoveElement.style.display = "flex";
  }
  /** move 중 */
  onPointerMove(session) {
    var _a, _b;
    if (session.state != PointerStateMap.DRAGGING) return;
    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x, y } = session.currentPos;
    this.rowMoveElement.style.transform = `translate(${x}px, ${y}px)`;
    const rowMoveDropHelperElement = this.rowMoveDropHelperElement;
    if (x < bounds.gridLeft - 3 || x > bounds.gridRight + 3 || y < bounds.top - 30 || y > bounds.bottom + 30) {
      this.stopAutoScroll();
      this.preventDrop();
      return;
    }
    const rowHeight = this.rowHeight;
    const verticalMovePosition = dragVerticalMovePosition(
      cfg,
      y,
      rowHeight,
      this.startCellInfo,
      bounds.top,
      bounds.bottom
    );
    this.scrollDirectionY = verticalMovePosition.scrollDirectionY;
    if (this.scrollDirectionY && this.dragAnimationId === 0) {
      this.startAutoScroll(false);
    }
    const viewRowIdx = verticalMovePosition.viewRowIdx;
    const moveViewRowY = y - this.bodyPosition.top;
    const offsetInRow = moveViewRowY - viewRowIdx * rowHeight;
    const isMoveUp = offsetInRow < rowHeight / this.ROW_DRAG_RATIO;
    const isMoveDown = rowHeight - offsetInRow < rowHeight / this.ROW_DRAG_RATIO;
    let helperViewIndex = this.dropRowIdx === -1 ? viewRowIdx : verticalMovePosition.rowIdx - cfg.scroll.startIdx;
    if (isMoveUp) {
      helperViewIndex = viewRowIdx;
    } else if (isMoveDown) {
      helperViewIndex = viewRowIdx + 1;
    }
    helperViewIndex = Math.max(0, Math.min(helperViewIndex, cfg.scroll.insideViewRow));
    const currentDropRowIdx = cfg.scroll.startIdx + helperViewIndex;
    if (this.dropRowIdx === currentDropRowIdx) {
      return;
    }
    const classlist = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    classlist.remove("dg-drop-invalid");
    classlist.add("dg-drop-valid");
    this.isDropForbidden = false;
    const moveRowIndexs = this.moveRowIndexs;
    if (this.isMoveRowSequential) {
      if (moveRowIndexs.includes(currentDropRowIdx) || moveRowIndexs[moveRowIndexs.length - 1] < currentDropRowIdx && moveRowIndexs.includes(currentDropRowIdx - 1)) {
        this.preventDrop();
        return;
      }
    }
    this.dropRowIdx = currentDropRowIdx;
    rowMoveDropHelperElement.style.transform = `translateY(${helperViewIndex * rowHeight}px)`;
    rowMoveDropHelperElement.style.display = "block";
    const moveStartItem = this.moveStartItem;
    let position = MovePositionMap.BEFORE;
    let dropItemIdx = currentDropRowIdx;
    if (moveStartItem.rowIndex < currentDropRowIdx) {
      position = MovePositionMap.AFTER;
      dropItemIdx = currentDropRowIdx - 1;
    }
    if (((_b = (_a = this.rowMoveOptions).dragOver) == null ? void 0 : _b.call(_a, {
      moveItems: this.moveViewItems,
      dropItemIdx,
      position
    })) === false) {
      this.preventDrop();
    }
  }
  /**
   * drop 금지 시, 드롭 위치에 X 표시, 허용 시 O 표시
   */
  preventDrop() {
    const classlist = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    classlist.remove("dg-drop-valid");
    classlist.add("dg-drop-invalid");
    this.isDropForbidden = true;
    this.rowMoveDropHelperElement.style.display = "none";
  }
  onPointerUp(session) {
    var _a, _b;
    this.stopAutoScroll();
    let dropRowIdx = this.dropRowIdx;
    this.rowMoveDropHelperElement.style.display = "none";
    this.rowMoveElement.style.display = "none";
    if (this.isDropForbidden || dropRowIdx === -1) {
      if (!this.cfg.isBodyDragging && session.clickManager.getClickCount() === 1) {
        this.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, session.cellEl);
      }
      return;
    }
    const cfg = this.cfg;
    const rowMoveOptions = this.rowMoveOptions;
    const moveItems = this.moveViewItems;
    const moveStartItem = this.moveStartItem;
    let position = MovePositionMap.BEFORE;
    if (moveStartItem.rowIndex < dropRowIdx) {
      position = MovePositionMap.AFTER;
    }
    if (((_a = rowMoveOptions == null ? void 0 : rowMoveOptions.drop) == null ? void 0 : _a.call(rowMoveOptions, {
      moveItems,
      dropItemIdx: position == MovePositionMap.AFTER ? dropRowIdx - 1 : dropRowIdx,
      position
    })) === false) {
      return;
    }
    const moveRowIndexs = this.moveRowIndexs;
    const ids = cfg.dataManager.getViewItems();
    for (let idx = moveRowIndexs.length - 1; idx >= 0; idx--) {
      const rowIndex = moveRowIndexs[idx];
      if (dropRowIdx > rowIndex) {
        --dropRowIdx;
      }
      ids.splice(rowIndex, 1);
    }
    const moveViewItems = this.moveViewItems.map((item) => ({ id: item[ROW_FIELD.ID] }));
    ids.splice(dropRowIdx, 0, ...moveViewItems);
    cfg.dataManager.setViewItems(ids);
    let startCol = cfg.dataInfo.startCol;
    let endCol = cfg.dataInfo.colLength - 1;
    if (isCellSelectionMode(this.selectionMode)) {
      startCol = cfg.selection.range.startCol;
      endCol = startCol;
    }
    const moveRange = {
      startIdx: dropRowIdx,
      startCol,
      endCol,
      endIdx: dropRowIdx + moveRowIndexs.length - 1
    };
    this.selectionInfo.setSelectionRangeInfo(
      {
        range: moveRange
      },
      true,
      true
    );
    this.context.gridMain.getBody().dataDraw("dragmove_redraw");
    (_b = rowMoveOptions == null ? void 0 : rowMoveOptions.dragEnd) == null ? void 0 : _b.call(rowMoveOptions, { moveItems, dropItemIdx: dropRowIdx, position });
  }
}
class BodyEvent {
  constructor(gridMain, body, selectionInfo) {
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;
    this.bodyElement = body.getBodyElement();
    this.handlers = [];
    const rowMoveOptions = gridMain.options().body.rowMove;
    if ((rowMoveOptions == null ? void 0 : rowMoveOptions.enabled) === true) {
      this.handlers.push(new RowMoveHandler({ gridMain, body }, this));
    }
    this.handlers.push(new CellClickHandler({ gridMain, body }, this));
  }
  init() {
    this.initMouseOver();
    this.initPointerEvent();
    this.initMobileTouch();
    const opts = this.gridMain.options();
    if (this.gridMain.config().enabledCellEdit === true) {
      new PasteEvent(this.gridMain, this.selectionInfo).init();
    }
    if (opts.body.disableKeydown !== true && opts.selectionMode !== SelectionModeMap.none) {
      new KeydownEvent(this.gridMain, this.body, this.selectionInfo).init();
    }
  }
  /**
   * init mobile touch event
   */
  initMobileTouch() {
    const cfg = this.gridMain.config();
    const { scroll, rowHeight, dataInfo, eventManager } = cfg;
    const opts = this.gridMain.options();
    const scrollInfo = this.gridMain.getScroll();
    const bodyElement = this.gridMain.getMainElement().getElement().querySelector(".dg-body");
    let animationId;
    let lastX;
    let lastY;
    eventManager.off(bodyElement, "touchstart");
    eventManager.on(
      { el: bodyElement, type: "touchstart" },
      (evt) => {
        lastX = evt.touches[0].clientX;
        lastY = evt.touches[0].clientY;
      },
      { passive: true }
    );
    eventManager.off(bodyElement, "touchmove touchend touchcancel");
    eventManager.on(
      { el: bodyElement, type: "touchmove" },
      (evt) => {
        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;
        const dx = lastX - x;
        const dy = lastY - y;
        if (cfg.isMoveRow) {
          return;
        }
        if (scroll.enabledHorizontal && Math.abs(dx) > Math.abs(dy)) {
          const upFlag = dx > 0;
          cancelAnimationFrame(animationId);
          if (upFlag && scroll.left != 0 || !upFlag && scroll.left != scroll.hTrackWidth - scroll.hThumbWidth) {
            stopPreventCancel(evt);
          } else {
            animationId = 0;
            return;
          }
          animationId = requestAnimationFrame(() => {
            scrollInfo.moveHorizontalScroll({
              direction: upFlag ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT,
              speed: opts.scroll.horizontal.speed
            });
          });
        } else if (scroll.enabledVertical) {
          const startIdx = scroll.startIdx;
          const upFlag = dy < 0;
          cancelAnimationFrame(animationId);
          if (upFlag && startIdx !== 0 || !upFlag && startIdx + scroll.insideViewRow < dataInfo.rowLength) {
            if (evt.cancelable) {
              stopPreventCancel(evt);
            }
          } else {
            animationId = 0;
            return;
          }
          animationId = requestAnimationFrame(() => {
            const speed = Math.abs(dy) / rowHeight;
            const pageCount = Math.ceil(dataInfo.rowLength / scroll.viewRow);
            scrollInfo.moveVerticalScroll({
              direction: upFlag ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN,
              speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed
            });
          });
        }
        lastX = x;
        lastY = y;
      },
      { passive: false }
    );
    eventManager.on({ el: bodyElement, type: "touchend touchcancel" }, () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    });
  }
  initMouseOver() {
    if (this.gridMain.options().hoverMode !== "row") {
      return;
    }
    const cfg = this.gridMain.config();
    const bodyElement = this.bodyElement.getElement();
    const eventManager = cfg.eventManager;
    const hoverClassName = "dg-row-hover";
    eventManager.on(
      { el: bodyElement, selector: ".dg-row", type: "mouseover.cell" },
      (e, rowElement) => {
        const rowIdx = rowElement.dataset.row;
        addClass(bodyElement.querySelectorAll(`.dg-row[data-row="${rowIdx}"]`), hoverClassName);
      }
    );
    eventManager.on(
      { el: bodyElement, selector: ".dg-row", type: "mouseout.cell" },
      (e, rowElement) => {
        if (!rowElement) return;
        const rowIdx = rowElement.dataset.row;
        removeClass(bodyElement.querySelectorAll(`.dg-row[data-row="${rowIdx}"]`), hoverClassName);
      }
    );
  }
  /**
   * init pointer event
   * cell click , cell drag, row move event
   */
  initPointerEvent() {
    const cfg = this.gridMain.config();
    const bodyElement = this.bodyElement.getElement();
    const eventManager = cfg.eventManager;
    let session;
    const editable = cfg.enabledCellEdit;
    const clickManager = new ClickManager();
    const dragThreshold = MOUSE_MOVE_THRESHOLD;
    const cleanupDragEvents = () => {
      eventManager.off(
        document,
        "touchmove.cellclick mousemove.cellclick touchend.cellclick touchcancel.cellclick mouseup.cellclick"
      );
      cfg.isBodyDragging = false;
      cfg.isMoveRow = false;
    };
    eventManager.on(
      { el: bodyElement, selector: ".dg-cell", type: "mousedown.cellclick touchstart.cellclick" },
      (e) => {
        var _a;
        if (!isPrimaryPointer(e)) {
          return true;
        }
        const eventElement = e.target;
        if (eventElement.closest("a")) return;
        if (isInputField(eventElement.tagName)) {
          return true;
        }
        const cellElement = eventElement.closest(".dg-cell");
        if (cellElement == null) {
          this.gridMain.hideLayer();
          return;
        }
        const startCellInfo = getCellInfo(cfg, cellElement);
        if (startCellInfo.field.$isAside && startCellInfo.field.name !== LINE_NUMBER_NAME && startCellInfo.field.name !== ROW_DRAG_HANDLE_NAME) {
          this.gridMain.hideLayer();
          return;
        }
        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);
        session = initPointerSession(e, startCellInfo, clickManager, cellElement);
        let handlerPriority = -1;
        for (const handler2 of this.handlers) {
          if (handler2.canHandle(session)) {
            if (handlerPriority > handler2.priority) {
              continue;
            }
            handlerPriority = handler2.priority;
            session.handler = handler2;
          }
        }
        const handler = session.handler;
        if (!handler) return;
        if (handler instanceof RowMoveHandler) {
          e.preventDefault();
          cfg.isMoveRow = true;
        }
        (_a = handler.onPointerDown) == null ? void 0 : _a.call(handler, session);
        if (handler.onPointerMove) {
          let isStarted = false;
          eventManager.on({ el: document, type: "touchmove.cellclick mousemove.cellclick" }, (moveEvt) => {
            var _a2, _b;
            session.currentPos = eventPosition(moveEvt);
            if (!isStarted) {
              if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
                return;
              }
              isStarted = true;
              cfg.isBodyDragging = true;
              if (((_a2 = handler.onActivate) == null ? void 0 : _a2.call(handler, session)) === false) {
                cleanupDragEvents();
                return;
              }
            }
            session.state = PointerStateMap.DRAGGING;
            (_b = handler.onPointerMove) == null ? void 0 : _b.call(handler, session);
          });
          eventManager.on(
            { el: document, type: "touchend.cellclick touchcancel.cellclick mouseup.cellclick" },
            (moveEvt) => {
              var _a2;
              cleanupDragEvents();
              session.state = PointerStateMap.IDLE;
              session.currentPos = eventPosition(moveEvt);
              (_a2 = handler.onPointerUp) == null ? void 0 : _a2.call(handler, session);
              cfg.isBodyDragging = false;
              cfg.isMoveRow = false;
            }
          );
        }
        if (editable === true) {
          if (clickManager.getClickCount() == 0) {
            cfg.edit.enabled = false;
          }
        }
        clickManager.processClick(session, handler);
      },
      { passive: false }
    );
    eventManager.on({ el: bodyElement, type: "mouseup.cellclick touchend.cellclick" }, (e) => {
      cfg.selection.isMouseDown = false;
      cfg.isBodyDragging = false;
      cfg.isMoveRow = false;
    });
  }
  destroy() {
  }
}
const CELL_HIGHLIGHT_CLASS = "dg-search-highlight";
const CELL_MATCH_CLASS = "dg-search-match";
class BodyCell {
  /**
   * Body Cell 생성
   *
   * @param context Body Context
   */
  constructor(context) {
    this.context = context;
  }
  /** Center Element Style 설정 */
  setCenterElementStyle(styleCss) {
    this.context.centerElement.css(styleCss);
  }
  /** 시작 Cell Element 반환 */
  getStartCellElement() {
    return this.context.bodyElement.find(".dg-cell." + BodyCellStyleMap.START_CELL);
  }
  /**
   * Grid 영역 너비 설정
   *
   * @param leftWidth Left 영역 너비
   * @param centerWidth Center 영역 너비
   * @param rightWidth Right 영역 너비
   */
  setGridPanelWidth(leftWidth, centerWidth, rightWidth) {
    this.context.leftElement.css({ width: leftWidth + "px" });
    this.context.centerElement.css({
      "margin-left": leftWidth + "px",
      width: centerWidth + "px"
    });
    this.context.rightElement.css({
      width: rightWidth + "px"
    });
  }
  /**
   * Cell 동적 Class 설정
   *
   * 기존 동적 Class를 제거하고 새로운 Class를 적용
   *
   * @param cellEle Cell Element
   * @param rowIdx View Row Index
   * @param col Column Index
   * @param field Field 정보
   * @param item Row 데이터
   */
  setCellClassName(cellEle, rowIdx, col, field, item) {
    if (!field.cellClassName) return;
    const prevClasses = this.context.cellClassNameCache.get(cellEle);
    if (prevClasses == null ? void 0 : prevClasses.length) {
      cellEle.classList.remove(...prevClasses);
    }
    const newClasses = resolveClassName(field.cellClassName, {
      rowIdx,
      col,
      field,
      item
    });
    if (newClasses.length > 0) {
      cellEle.classList.add(...newClasses);
      this.context.cellClassNameCache.set(cellEle, newClasses);
    } else {
      this.context.cellClassNameCache.delete(cellEle);
    }
  }
  /**
   * Cell Style 및 상태 갱신
   *
   * Cell 높이, 동적 Class, Search, Selection 상태를 갱신
   *
   * @param startCellInfo Selection 시작 Cell 정보
   * @param rowIdx View Row Index
   * @param col Column Index
   * @param cellElement Cell Element
   * @param field Field 정보
   * @param item Row 데이터
   * @param matchInfo Search Match 정보
   */
  setCellStyle(startCellInfo, rowIdx, col, cellElement, field, item, matchInfo) {
    var _a;
    const contentEleStyle = cellElement.firstElementChild.style;
    const heightPixel = `${item[ROW_FIELD.HEIGHT] - 5}px`;
    contentEleStyle.maxHeight = heightPixel;
    this.setCellClassName(cellElement, rowIdx, col, field, item);
    if (field.$isAside) return;
    if (matchInfo.searchEnabled) {
      const classList = cellElement.classList;
      const matchedFields = matchInfo.searchMatchedFields ?? [];
      if (matchedFields.length > 0) {
        const fieldName = field.name;
        const isMatch = ((_a = matchInfo.matchViewItem) == null ? void 0 : _a.isCurrentMatch) && matchedFields[matchInfo.cellIndex] === fieldName;
        if (isMatch) {
          classList.add(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
        } else {
          const highlightFlag = matchedFields.includes(fieldName);
          classList.remove(CELL_MATCH_CLASS);
          classList.toggle(CELL_HIGHLIGHT_CLASS, highlightFlag);
        }
      } else {
        classList.remove(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
      }
    }
    this.context.selectionInfo.updateCellSelectionClass(
      cellElement,
      rowIdx,
      col,
      startCellInfo.startIdx,
      startCellInfo.startCol
    );
  }
  /** Search Highlight 제거 */
  clearSearchHighlight() {
    const bodyElement = this.context.bodyElement;
    removeClass(bodyElement.finds(".dg-cell." + CELL_HIGHLIGHT_CLASS), CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
  }
  /**
   * 수정된 Cell 다시 렌더링
   *
   * @param cell 수정된 Cell 정보
   */
  refreshEditedCell(cell) {
    const cfg = this.context.gridMain.config();
    let fieldMapElement = this.context.allCellElements.center;
    if (isFixedLeftPostion(cfg, cell.c)) {
      fieldMapElement = this.context.allCellElements.left;
    } else if (isFixedRightPostion(cfg, cell.c)) {
      fieldMapElement = this.context.allCellElements.right;
    }
    const cellEle = fieldMapElement[cell.r][cell.c];
    this.setCellClassName(cellEle, cell.rowIndex, cell.c, cell.field, cell.item);
    cell.field.$renderer.render(cell, cellEle.firstElementChild);
  }
  /** Cell 상태 정리 */
  destroy() {
    this.context.cellClassNameCache = /* @__PURE__ */ new WeakMap();
  }
}
class BodyContext {
  constructor(gridMain) {
    this.allRowElements = {};
    this.allCellElements = {};
    this.cellClassNameCache = /* @__PURE__ */ new WeakMap();
    this.gridMain = gridMain;
    this.selectionInfo = gridMain.selectionInfo;
    this.bodyElement = gridMain.element().findDaraElement(".dg-body");
    this.leftElement = this.bodyElement.findDaraElement('.dg-region[data-region="left"]');
    this.centerElement = this.bodyElement.findDaraElement('.dg-region[data-region="center"]');
    this.rightElement = this.bodyElement.findDaraElement('.dg-region[data-region="right"]');
  }
  resetCellState() {
    this.cellClassNameCache = /* @__PURE__ */ new WeakMap();
    this.allRowElements = {};
    this.allCellElements = {};
  }
}
class BodyRenderer {
  constructor(context, cell, template) {
    this.context = context;
    this.cell = cell;
    this.template = template;
  }
  drawData(mode, renderSpecialRow) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const opts = this.context.gridMain.options();
    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();
    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;
    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;
    const enabledLeftField = leftFields.length > 0;
    const enabledRightField = rightFields.length > 0;
    const fieldGroups = [
      {
        name: "left",
        fields: leftFields,
        element: this.context.leftElement,
        startCol: 0
      },
      {
        name: "center",
        fields: centerFields,
        element: this.context.centerElement,
        startCol: fixedLeftIndex
      },
      {
        name: "right",
        fields: rightFields,
        element: this.context.rightElement,
        startCol: fixedRightIndex
      }
    ];
    const viewRow = cfg.scroll.viewRow;
    let startIdx = cfg.scroll.startIdx;
    const maxRow = cfg.dataInfo.rowLength - startIdx;
    let currentViewRow = Math.min(viewRow, maxRow);
    if (maxRow === 0 && cfg.dimensions.mainBodyHeight < cfg.rowHeight) {
      startIdx = cfg.dataInfo.rowLength - 1;
      this.context.gridMain.getScroll().moveVerticalScroll({
        rowIdx: startIdx,
        drawFlag: false
      });
      currentViewRow = 1;
    }
    this.updateRowTemplates(fieldGroups, viewRow);
    this.context.bodyElement.setAttr({ "data-view-mode": viewItems.length < 1 ? "empty" : "grid" });
    if (currentViewRow < 1) {
      return;
    }
    this.updateLastRowVisibility(fieldGroups, currentViewRow, viewRow);
    this.context.gridMain.hideLayer(mode);
    const bodyClassList = this.context.bodyElement.getElement().classList;
    if (startIdx % 2 === 0) {
      bodyClassList.remove("dg-body-odd");
      bodyClassList.add("dg-body-even");
    } else {
      bodyClassList.remove("dg-body-even");
      bodyClassList.add("dg-body-odd");
    }
    const startCell = cfg.selection.startCell;
    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;
    this.context.selectionInfo.removeStartAnchorCell();
    const pagingStartIdx = ((_a = opts.footer.paging) == null ? void 0 : _a.enabled) ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0;
    const leafAllFields = cfg.currentFields;
    const leftElements = this.context.allCellElements.left;
    const centerElements = this.context.allCellElements.center;
    const rightElements = this.context.allCellElements.right;
    const searchEnabled = cfg.searchEnabled;
    const searchMatchInfo = cfg.searchMatchInfo;
    const matchInfo = {
      searchEnabled,
      cellIndex: searchMatchInfo.cellIndex,
      matchViewItem: void 0,
      searchMatchedFields: void 0
    };
    const rowCellInfo = {
      rowIndex: -1,
      r: -1,
      item: null,
      viewItem: void 0,
      c: -1
    };
    const allRowElements = this.context.allRowElements;
    const deleteRowClassName = "dg-status-delete";
    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      const viewItem = viewItems[viewRowIdx];
      if (!viewItem) {
        break;
      }
      if (renderSpecialRow(viewItem, i)) {
        continue;
      }
      for (const rowElement of [(_b = allRowElements.left) == null ? void 0 : _b[i], (_c = allRowElements.center) == null ? void 0 : _c[i], (_d = allRowElements.right) == null ? void 0 : _d[i]]) {
        rowElement == null ? void 0 : rowElement.classList.remove("dg-group-row", "dg-group-header", "dg-group-summary", "dg-grand-summary");
      }
      const item = dataManager.getRowItem(viewItem.id);
      const rowIdx = pagingStartIdx + viewRowIdx;
      for (const rowElement of [(_e = allRowElements.left) == null ? void 0 : _e[i], (_f = allRowElements.center) == null ? void 0 : _f[i], (_g = allRowElements.right) == null ? void 0 : _g[i]]) {
        rowElement == null ? void 0 : rowElement.classList.toggle(deleteRowClassName, item[ROW_FIELD.CUD] === ItemStatusMap.DELETE);
      }
      matchInfo.matchViewItem = void 0;
      matchInfo.searchMatchedFields = void 0;
      if (searchEnabled) {
        const matchViewItem = dataManager.getSearchMapItem(viewItem.id);
        matchInfo.matchViewItem = matchViewItem;
        matchInfo.searchMatchedFields = (_h = matchViewItem == null ? void 0 : matchViewItem.matchedFields) == null ? void 0 : _h.map((f) => f.fieldName);
      }
      rowCellInfo.rowIndex = rowIdx;
      rowCellInfo.r = viewRowIdx;
      rowCellInfo.item = item;
      rowCellInfo.viewItem = viewItem;
      if (enabledLeftField) {
        const rowCells = leftElements[i];
        for (let j = 0; j < leftFields.length; j++) {
          const field = leftFields[j];
          const cell = rowCells[j];
          cell.classList.remove("dg-group-cell");
          cell.firstElementChild.style.removeProperty("padding-left");
          rowCellInfo.c = j;
          this.cell.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);
          field.$renderer.render(rowCellInfo, cell.firstElementChild);
        }
      }
      const rowCenterCells = centerElements == null ? void 0 : centerElements[i];
      for (let j = startCol; rowCenterCells && j <= endCol; j++) {
        const field = leafAllFields[j];
        const cell = rowCenterCells[j];
        cell.classList.remove("dg-group-cell");
        cell.firstElementChild.style.removeProperty("padding-left");
        this.cell.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);
        rowCellInfo.c = j;
        field.$renderer.render(rowCellInfo, cell.firstElementChild);
      }
      if (enabledRightField) {
        const rowCells = rightElements[i];
        for (let j = 0; j < rightFields.length; j++) {
          const field = rightFields[j];
          const cellIdx = fixedRightIndex + j;
          const cell = rowCells[cellIdx];
          cell.classList.remove("dg-group-cell");
          cell.firstElementChild.style.removeProperty("padding-left");
          rowCellInfo.c = cellIdx;
          this.cell.setCellStyle(startCell, viewRowIdx, cellIdx, cell, field, item, matchInfo);
          field.$renderer.render(rowCellInfo, cell.firstElementChild);
        }
      }
    }
    this.selectRowAnchorCell();
  }
  updateRowTemplates(fieldGroups, viewRow) {
    var _a;
    const cfg = this.context.gridMain.config();
    const beforeViewRow = cfg.scroll.before.viewRow;
    if (beforeViewRow > 0 && beforeViewRow > viewRow) {
      for (let i = viewRow; i < beforeViewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }
          const rowEl = element.find(`.dg-row[data-row="${i}"]`);
          (_a = rowEl == null ? void 0 : rowEl.parentNode) == null ? void 0 : _a.removeChild(rowEl);
        }
      }
      this.refreshCellElements(fieldGroups, viewRow);
      cfg.scroll.before.viewRow = viewRow;
      return;
    }
    if (beforeViewRow < viewRow) {
      const rowHeight = cfg.rowHeight;
      const addRowTemplateCount = viewRow - beforeViewRow;
      for (const { fields, element, startCol } of fieldGroups) {
        if (fields.length === 0) {
          continue;
        }
        element.find(".dg-body-table > tbody").appendChild(this.template.rowTemplate(beforeViewRow, addRowTemplateCount, rowHeight, fields, startCol));
      }
      this.refreshCellElements(fieldGroups, viewRow);
      cfg.scroll.before.viewRow = viewRow;
    }
  }
  updateLastRowVisibility(fieldGroups, currentViewRow, viewRow) {
    const cfg = this.context.gridMain.config();
    if (currentViewRow < viewRow) {
      const hideRowIdx = viewRow - 1;
      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }
          if (i === hideRowIdx) {
            element.find(`.dg-row[data-row="${hideRowIdx}"]`).style.display = "none";
            continue;
          }
          const style = element.find(`.dg-row[data-row="${i}"]`).style;
          if (style.display === "none") {
            style.removeProperty("display");
          }
        }
      }
      cfg.scroll.before.hideLastRow = true;
      return;
    }
    if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }
          const style = element.find(`.dg-row[data-row="${i}"]`).style;
          if (style.display) {
            style.removeProperty("display");
          }
        }
      }
    }
  }
  refreshCellElements(fieldGroups, viewRow) {
    const allCellMap = {};
    const allRowMap = {};
    for (const group of fieldGroups) {
      const { name, element } = group;
      if (group.fields.length === 0) {
        continue;
      }
      const cellElements = new Array(viewRow);
      const rowElements = new Array(viewRow);
      for (let i = 0; i < viewRow; i++) {
        cellElements[i] = [];
      }
      const rows = element.getElement().querySelectorAll(".dg-body-table > tbody > .dg-row");
      for (let rowIndex = 0; rowIndex < viewRow; rowIndex++) {
        const row = rows[rowIndex];
        rowElements[rowIndex] = row;
        const cells = row.children;
        for (let colIndex = 0; colIndex < cells.length; colIndex++) {
          cellElements[rowIndex][group.startCol + colIndex] = cells[colIndex];
        }
      }
      allRowMap[name] = rowElements;
      allCellMap[name] = cellElements;
    }
    this.context.allRowElements = allRowMap;
    this.context.allCellElements = allCellMap;
  }
  selectRowAnchorCell() {
    var _a, _b, _c;
    const cfg = this.context.gridMain.config();
    const leafLeft = cfg.fieldHeaderGroup.leafLeft;
    if (!((_a = leafLeft == null ? void 0 : leafLeft[0]) == null ? void 0 : _a.$isAside)) {
      return;
    }
    const leftElements = this.context.allCellElements.left;
    const startIdx = cfg.scroll.startIdx;
    const viewRow = cfg.scroll.viewRow;
    const selectionClass = BodyCellStyleMap.SELECTION;
    const isAll = this.context.selectionInfo.isAllSelect();
    const viewItems = cfg.dataManager.getViewItems();
    if (!leftElements) {
      return;
    }
    if (isAll) {
      for (let i = 0; i < viewRow; i++) {
        (_b = leftElements[i][0]) == null ? void 0 : _b.classList.toggle(selectionClass, !!viewItems[startIdx + i]);
      }
      return;
    }
    const rowLine = this.context.selectionInfo.getRowLine();
    for (let i = 0; i < viewRow; i++) {
      (_c = leftElements[i][0]) == null ? void 0 : _c.classList.toggle(selectionClass, !!viewItems[startIdx + i] && rowLine.has(i + startIdx));
    }
  }
  destroy() {
    this.context.allRowElements = {};
    this.context.allCellElements = {};
  }
}
class GroupBodyRenderer extends BodyRenderer {
  dataDraw(mode) {
    this.drawData(mode, (viewItem, rowIndex) => this.renderGroupRow(viewItem, rowIndex));
    this.hideRepeatedGroupValues();
    this.applyRowSpans();
  }
  hideRepeatedGroupValues() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const groupingFields = this.context.gridMain.options().groupingFields ?? [];
    if (groupingFields.length === 0) {
      return;
    }
    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();
    const startIdx = cfg.scroll.startIdx;
    const visibleRowCount = Math.min(cfg.scroll.viewRow, cfg.dataInfo.rowLength - startIdx);
    const fields = groupingFields.map((name) => cfg.currentFields.find((field) => field.name === name));
    let previousDataItem;
    for (let rowIndex = 0; rowIndex < visibleRowCount; rowIndex++) {
      const viewItem = viewItems[startIdx + rowIndex];
      if (!viewItem || viewItem.groupRowType) {
        continue;
      }
      for (const field of fields) {
        if (!field) {
          continue;
        }
        const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
        (_c = (_b = (_a = this.context.allCellElements[region]) == null ? void 0 : _a[rowIndex]) == null ? void 0 : _b[field.$colSeq]) == null ? void 0 : _c.classList.remove("dg-group-continuation");
      }
      const item = dataManager.getRowItem(viewItem.id);
      if (previousDataItem) {
        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
          const field = fields[fieldIndex];
          const sameGroup = fields.slice(0, fieldIndex + 1).every((groupField) => groupField && Object.is(item[groupField.name], previousDataItem[groupField.name]));
          if (!field || !sameGroup) {
            continue;
          }
          const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
          const cell = (_e = (_d = this.context.allCellElements[region]) == null ? void 0 : _d[rowIndex]) == null ? void 0 : _e[field.$colSeq];
          if (cell) {
            cell.firstElementChild.textContent = "";
            cell.classList.add("dg-group-continuation");
          }
        }
      }
      previousDataItem = item;
    }
    const lastVisibleRowIndex = visibleRowCount - 1;
    if (lastVisibleRowIndex >= 0) {
      for (const field of fields) {
        if (!field) {
          continue;
        }
        const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
        (_h = (_g = (_f = this.context.allCellElements[region]) == null ? void 0 : _f[lastVisibleRowIndex]) == null ? void 0 : _g[field.$colSeq]) == null ? void 0 : _h.classList.remove(
          "dg-group-continuation"
        );
      }
    }
  }
  applyRowSpans() {
    var _a, _b, _c, _d;
    const options = this.context.gridMain.options();
    const rowSpanFields = options.rowSpanFields ?? [];
    if (rowSpanFields.length === 0) {
      return;
    }
    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();
    const startIdx = cfg.scroll.startIdx;
    const visibleRowCount = Math.max(0, Math.min(cfg.scroll.viewRow, cfg.dataInfo.rowLength - startIdx));
    const cellElements = this.context.allCellElements;
    const fields = rowSpanFields.map((name) => cfg.currentFields.find((field) => field.name === name)).filter((field) => field !== void 0);
    for (const field of fields) {
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
      const colIndex = field.$colSeq;
      const cells = Array.from(
        { length: visibleRowCount },
        (_, rowIndex) => {
          var _a2, _b2;
          return (_b2 = (_a2 = cellElements[region]) == null ? void 0 : _a2[rowIndex]) == null ? void 0 : _b2[colIndex];
        }
      );
      for (const cell of cells) {
        if (cell) {
          cell.rowSpan = 1;
          cell.style.removeProperty("display");
        }
      }
    }
    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      const field = fields[fieldIndex];
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
      const colIndex = field.$colSeq;
      let rowIndex = 0;
      while (rowIndex < visibleRowCount) {
        const viewItem = viewItems[startIdx + rowIndex];
        if (!viewItem || viewItem.groupRowType) {
          rowIndex++;
          continue;
        }
        const item = dataManager.getRowItem(viewItem.id);
        let span = 1;
        while (rowIndex + span < visibleRowCount) {
          const nextViewItem = viewItems[startIdx + rowIndex + span];
          if (!nextViewItem || nextViewItem.groupRowType) {
            break;
          }
          const nextItem = dataManager.getRowItem(nextViewItem.id);
          const sameGroup = fields.slice(0, fieldIndex + 1).every((groupField) => {
            return Object.is(item[groupField.name], nextItem[groupField.name]);
          });
          if (!sameGroup) {
            break;
          }
          span++;
        }
        if (span > 1) {
          const firstCell = (_b = (_a = cellElements[region]) == null ? void 0 : _a[rowIndex]) == null ? void 0 : _b[colIndex];
          if (firstCell) {
            firstCell.rowSpan = span;
          }
          for (let hiddenIndex = rowIndex + 1; hiddenIndex < rowIndex + span; hiddenIndex++) {
            const cell = (_d = (_c = cellElements[region]) == null ? void 0 : _c[hiddenIndex]) == null ? void 0 : _d[colIndex];
            if (cell) {
              cell.style.display = "none";
            }
          }
        }
        rowIndex += span;
      }
    }
  }
  renderGroupRow(viewItem, rowIndex) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!viewItem.groupRowType) {
      return false;
    }
    const cfg = this.context.gridMain.config();
    const rowElements = this.context.allRowElements;
    const cellElements = this.context.allCellElements;
    const rowClass = viewItem.groupRowType === "group" ? "dg-group-header" : viewItem.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary";
    const firstDataField = cfg.currentFields.find((field) => !field.$isAside);
    const sumFields = new Set(this.context.gridMain.options().sumFields ?? []);
    const summaryLabelField = (viewItem.groupRowType === "groupSummary" || viewItem.groupRowType === "group") && viewItem.groupField ? cfg.currentFields.find((field) => field.name === viewItem.groupField) : cfg.currentFields.find((field) => !field.$isAside && !sumFields.has(field.name)) ?? firstDataField;
    for (const region of ["left", "center", "right"]) {
      const rowElement = (_a = rowElements[region]) == null ? void 0 : _a[rowIndex];
      rowElement == null ? void 0 : rowElement.classList.remove("dg-group-header", "dg-group-summary", "dg-grand-summary", "dg-status-delete");
      rowElement == null ? void 0 : rowElement.classList.add("dg-group-row", rowClass);
    }
    for (const field of cfg.currentFields) {
      const colIndex = field.$colSeq;
      let cell;
      if (cfg.fieldHeaderGroup.leafLeft.includes(field)) {
        cell = (_c = (_b = cellElements.left) == null ? void 0 : _b[rowIndex]) == null ? void 0 : _c[colIndex];
      } else if (cfg.fieldHeaderGroup.leafRight.includes(field)) {
        cell = (_e = (_d = cellElements.right) == null ? void 0 : _d[rowIndex]) == null ? void 0 : _e[colIndex];
      } else {
        cell = (_g = (_f = cellElements.center) == null ? void 0 : _f[rowIndex]) == null ? void 0 : _g[colIndex];
      }
      if (!cell) {
        continue;
      }
      const previousClasses = this.context.cellClassNameCache.get(cell);
      if (previousClasses == null ? void 0 : previousClasses.length) cell.classList.remove(...previousClasses);
      this.context.cellClassNameCache.delete(cell);
      cell.classList.remove(
        "dg-group-continuation",
        "dg-search-highlight",
        "dg-search-match",
        BodyCellStyleMap.SELECTION,
        BodyCellStyleMap.START_CELL
      );
      cell.classList.add("dg-group-cell");
      const renderer = cell.firstElementChild;
      renderer.textContent = "";
      const { startIdx, startCol } = cfg.selection.startCell;
      this.context.selectionInfo.updateCellSelectionClass(
        cell,
        cfg.scroll.startIdx + rowIndex,
        colIndex,
        startIdx,
        startCol
      );
      if (field.name === LINE_NUMBER_NAME) {
        const pagingStartIdx = ((_h = this.context.gridMain.options().footer.paging) == null ? void 0 : _h.enabled) ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0;
        const cellInfo = {
          r: cfg.scroll.startIdx + rowIndex,
          c: colIndex,
          rowIndex: pagingStartIdx + cfg.scroll.startIdx + rowIndex,
          field,
          item: cfg.dataManager.getRowItem(viewItem.id),
          viewItem
        };
        field.$renderer.render(cellInfo, renderer);
      } else if (!field.$isAside && viewItem.groupRowType === "group" && field === summaryLabelField) {
        renderer.textContent = `${viewItem.groupField}: ${String(viewItem.groupValue ?? "")}`;
        renderer.style.paddingLeft = `${(viewItem.groupDepth ?? 0) * 16}px`;
      } else if (!field.$isAside && viewItem.groupRowType !== "group" && field === summaryLabelField) {
        renderer.textContent = viewItem.groupRowType === "grandSummary" ? "Grand Total" : viewItem.groupField ? `${String(viewItem.groupValue ?? "")} 합계` : "Subtotal";
        renderer.style.paddingLeft = `${(viewItem.groupDepth ?? 0) * 16}px`;
      } else if (viewItem.groupRowType !== "group" && sumFields.has(field.name)) {
        const sum = (_i = viewItem.groupSums) == null ? void 0 : _i[field.name];
        renderer.textContent = sum === void 0 ? "" : String(sum);
        renderer.style.paddingLeft = "";
      } else {
        renderer.style.paddingLeft = "";
      }
    }
    return true;
  }
}
class SimpleBodyRenderer extends BodyRenderer {
  dataDraw(mode) {
    this.drawData(mode, (_viewItem) => false);
  }
}
class BodySelection {
  /**
   * Body Selection 생성
   *
   * @param context Body Context
   * @param renderer Body Renderer
   */
  constructor(context, renderer) {
    this.context = context;
    this.renderer = renderer;
  }
  init() {
  }
  /**
   * 체크된 항목의 필드값 반환
   *
   * @param name 필드명
   */
  getCheckedItemByName(name) {
    const { dataManager } = this.context.gridMain.config();
    const result = [];
    const items = dataManager.getViewItems();
    for (const viewItem of items) {
      if (dataManager.isItemChecked(viewItem.id)) {
        result.push(dataManager.getRowItem(viewItem.id)[name]);
      }
    }
    return result;
  }
  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  setAllCheckItem(checked) {
    const dataManager = this.context.gridMain.config().dataManager;
    if (checked) {
      dataManager.setAllCheck();
    } else {
      dataManager.clearAllCheck();
    }
    this.renderer.dataDraw("allCheck");
  }
  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  setItemChecked(rowId, checked) {
    this.setItemsChecked([rowId], checked);
  }
  /**
   * 여러 Row 체크 상태 설정
   *
   * 기존 체크 상태를 초기화한 후 지정한 Row를 체크
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  setItemsChecked(rowIds, checked) {
    this.context.gridMain.config().dataManager.clearAllCheck();
    this.addItemsChecked(rowIds, checked);
  }
  /**
   * Row 체크 상태 추가
   *
   * 기존 체크 상태를 유지
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  addItemChecked(rowId, checked) {
    this.addItemsChecked([rowId], checked);
  }
  /**
   * 여러 Row의 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  addItemsChecked(rowIds, checked) {
    const { isRowAllowMultiSelect, dataManager } = this.context.gridMain.config();
    if (!isRowAllowMultiSelect) {
      dataManager.clearAllCheck();
      const rowId = rowIds[0];
      if (rowId !== void 0) {
        dataManager.setItemChecked(rowId, checked);
        this.setFieldRefresh(ROW_CHECK_NAME);
      }
      return;
    }
    rowIds.forEach((rowId) => {
      dataManager.setItemChecked(rowId, checked);
    });
    this.setFieldRefresh(ROW_CHECK_NAME);
    const detailItems = dataManager.getViewItems().filter((item) => !item.groupRowType);
    this.context.gridMain.getHeader().setCheckboxStyle(
      getCheckboxMode(detailItems.filter((item) => dataManager.isItemChecked(item.id)).length, detailItems.length)
    );
  }
  /**
   * 지정한 Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  setFieldRefresh(fieldName) {
    var _a, _b;
    const cfg = this.context.gridMain.config();
    const { scroll, paging, dataManager, currentFields } = cfg;
    const refreshField = currentFields.find((field) => field.name === fieldName);
    if (!refreshField) {
      return;
    }
    const opts = this.context.gridMain.options();
    const viewItems = dataManager.getViewItems();
    const currentViewRow = scroll.viewRow;
    const startIdx = scroll.startIdx;
    const pagingStartIdx = ((_a = opts.footer.paging) == null ? void 0 : _a.enabled) ? (paging.page - 1) * paging.pageSize : 0;
    const colSeq = refreshField.$colSeq;
    let fieldMapElement = this.context.allCellElements.center;
    if (colSeq < cfg.fixedLeftIndex) {
      fieldMapElement = this.context.allCellElements.left;
    } else if (colSeq >= cfg.fixedRightIndex) {
      fieldMapElement = this.context.allCellElements.right;
    }
    const rowCellInfo = { rowIndex: -1, r: -1, item: null, viewItem: void 0, c: -1, field: refreshField };
    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      const viewItem = viewItems[viewRowIdx];
      if (!viewItem) {
        break;
      }
      if (viewItem.groupRowType) {
        continue;
      }
      const item = dataManager.getRowItem(viewItem.id);
      const rowIdx = pagingStartIdx + viewRowIdx;
      rowCellInfo.rowIndex = rowIdx;
      rowCellInfo.r = viewRowIdx;
      rowCellInfo.item = item;
      rowCellInfo.viewItem = viewItem;
      rowCellInfo.c = colSeq;
      const cell = (_b = fieldMapElement[i]) == null ? void 0 : _b[colSeq];
      if (!cell) {
        continue;
      }
      refreshField.$renderer.render(rowCellInfo, cell.firstElementChild);
    }
  }
  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  setCheckedItemByValue(name, values) {
    const { dataManager, isRowAllowMultiSelect } = this.context.gridMain.config();
    const checkValueSet = new Set(isArray(values) ? values : [values]);
    const viewItems = dataManager.getViewItems();
    const rowIdsToCheck = [];
    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);
        if (!isRowAllowMultiSelect) {
          break;
        }
      }
    }
    this.setItemsChecked(rowIdsToCheck, true);
  }
  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  addCheckedItemByValue(name, values) {
    const { dataManager } = this.context.gridMain.config();
    const checkValueSet = new Set(isArray(values) ? values : [values]);
    const viewItems = dataManager.getViewItems();
    const rowIdsToCheck = [];
    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);
      }
    }
    this.addItemsChecked(rowIdsToCheck, true);
  }
  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  unCheckedItemByValue(name, values) {
    const { dataManager } = this.context.gridMain.config();
    const checkValueSet = new Set(isArray(values) ? values : [values]);
    const viewItems = dataManager.getViewItems();
    const rowIdsToCheck = [];
    for (const viewItem of viewItems) {
      if (checkValueSet.has(dataManager.getRowItem(viewItem.id)[name])) {
        rowIdsToCheck.push(viewItem.id);
      }
    }
    this.addItemsChecked(rowIdsToCheck, false);
  }
  /** 선택 데이터 클립보드 복사 */
  copyData() {
    const selectData = this.context.selectionInfo.selectionData();
    try {
      copyStringToClipboard(selectData);
    } catch (e) {
      console.log("Unable to copy", e);
    }
  }
  /** Row Anchor Cell 선택 상태 갱신 */
  selectRowAnchorCell() {
    var _a, _b;
    const cfg = this.context.gridMain.config();
    const leafLeft = cfg.fieldHeaderGroup.leafLeft;
    if (leafLeft && !leafLeft[0].$isAside) {
      return;
    }
    const leftElements = this.context.allCellElements.left;
    const startIdx = cfg.scroll.startIdx;
    const viewRow = cfg.scroll.viewRow;
    const selectionClass = BodyCellStyleMap.SELECTION;
    const viewItems = cfg.dataManager.getViewItems();
    const isAll = this.context.selectionInfo.isAllSelect();
    if (!leftElements) {
      return;
    }
    if (isAll) {
      for (let i = 0; i < viewRow; i++) {
        (_a = leftElements[i][0]) == null ? void 0 : _a.classList.toggle(selectionClass, !!viewItems[startIdx + i]);
      }
      return;
    }
    const rowLine = this.context.selectionInfo.getRowLine();
    for (let i = 0; i < viewRow; i++) {
      (_b = leftElements[i][0]) == null ? void 0 : _b.classList.toggle(selectionClass, !!viewItems[startIdx + i] && rowLine.has(i + startIdx));
    }
  }
  /** Selection 상태 정리 */
  destroy() {
  }
}
class BodyTemplate {
  /**
   * Body Context
   *
   * @param context Body Context
   */
  constructor(context) {
    this.context = context;
  }
  /**
   * Body 영역별 table template 생성
   */
  create() {
    this.context.leftElement.html(this.createTemplate("left"));
    this.context.centerElement.html(this.createTemplate("center"));
    this.context.rightElement.html(this.createTemplate("right"));
  }
  /**
   * HTML table template 생성
   *
   * @param type Horizontal 영역
   */
  createTemplate(type) {
    const cfg = this.context.gridMain.config();
    let startGroupIdx = 0;
    let leafFields;
    if (type === "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type === "right") {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }
    const colGroupHtml = new Array(leafFields.length);
    for (let i = 0; i < leafFields.length; i++) {
      const field = leafFields[i];
      colGroupHtml[i] = `<th data-col-idx="${startGroupIdx + i}" 
        style="border:0;margin:0 !important; padding:0 !important;font-size:0 !important;
        line-height:0 !important;height:0;width:${field.$width}px;"></th>`;
    }
    return html`<table class="dg-body-table">
        <thead>
          <tr>
            ${colGroupHtml.join("")}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      ${type === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
  /**
   * 가상화된 Row DOM 생성
   *
   * @param viewRow 시작 View Row
   * @param rowTemplateCount Row Template 개수
   * @param rowHeight Row 높이
   * @param fields Field 목록
   * @param startCol 시작 Column Index
   */
  rowTemplate(viewRow, rowTemplateCount, rowHeight, fields, startCol) {
    const fragment = document.createDocumentFragment();
    if (rowTemplateCount <= 0 || fields.length === 0) {
      return fragment;
    }
    const templates = this.createFieldTemplates(fields, startCol);
    const rowHeightCss = `${rowHeight}px`;
    for (let i = 0; i < rowTemplateCount; i++) {
      const rowIdx = viewRow + i;
      const tr = document.createElement("tr");
      tr.className = "dg-row";
      tr.dataset.row = String(rowIdx);
      tr.style.height = rowHeightCss;
      for (const template of templates) {
        const td = document.createElement("td");
        td.className = template.cellClassName;
        td.dataset.cellPosition = `${rowIdx},${template.col}`;
        const div = document.createElement("div");
        div.className = template.rendererClassName;
        if (template.rendererStyle) {
          div.style.cssText = template.rendererStyle;
        }
        td.appendChild(div);
        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    return fragment;
  }
  /**
   * Field별 정적 Template 정보 생성
   *
   * @param fields Field 목록
   * @param startCol 시작 Column Index
   */
  createFieldTemplates(fields, startCol) {
    const templates = new Array(fields.length);
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const col = startCol + i;
      if (field.$isAside) {
        templates[i] = {
          col,
          cellClassName: `dg-cell dg-aside dg-${camelToKebab(field.name).replace("$", "")}`,
          rendererClassName: `dg-cell-renderer ${field.$alignStyle || ""}`.trim(),
          rendererStyle: ""
        };
        continue;
      }
      const { style: whiteSpaceStyle, className: whiteSpaceClass } = getWhiteSpaceInfo(field);
      const renderer = field.$renderer;
      const variantClass = renderer.supportsInteraction() ? getRendererVariantClass(field.editRenderer) : getRendererVariantClass(field.renderer);
      templates[i] = {
        col,
        cellClassName: "dg-cell",
        rendererClassName: [
          "dg-cell-renderer",
          "dg-ellipsis",
          `dg-${field.renderer.type}`,
          field.$alignStyle,
          whiteSpaceClass,
          variantClass
        ].filter(Boolean).join(" "),
        rendererStyle: whiteSpaceStyle || ""
      };
    }
    return templates;
  }
}
class Body {
  /**
   * Body 생성
   *
   * @param gridMain GridMain
   */
  constructor(gridMain) {
    var _a, _b;
    this.gridMain = gridMain;
    this.context = new BodyContext(gridMain);
    this.templateManager = new BodyTemplate(this.context);
    this.cellManager = new BodyCell(this.context);
    this.renderer = ((_a = gridMain.options().groupingFields) == null ? void 0 : _a.length) || ((_b = gridMain.options().rowSpanFields) == null ? void 0 : _b.length) ? new GroupBodyRenderer(this.context, this.cellManager, this.templateManager) : new SimpleBodyRenderer(this.context, this.cellManager, this.templateManager);
    this.selectionManager = new BodySelection(this.context, this.renderer);
    this.templateManager.create();
    this.bodyEvent = new BodyEvent(gridMain, this, this.context.selectionInfo);
  }
  /** Body 초기화 */
  init() {
    this.bodyEvent.init();
  }
  /** Body Element 반환 */
  getBodyElement() {
    return this.context.bodyElement;
  }
  /** Body Cell Element 반환 */
  getBodyCellElements() {
    return this.context.allCellElements;
  }
  /**
   * 체크된 항목의 필드값 반환
   *
   * @param name 필드명
   */
  getCheckedItemByName(name) {
    return this.selectionManager.getCheckedItemByName(name);
  }
  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  setAllCheckItem(checked) {
    this.selectionManager.setAllCheckItem(checked);
  }
  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  setItemChecked(rowId, checked) {
    this.selectionManager.setItemChecked(rowId, checked);
  }
  /**
   * 여러 Row 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  setItemsChecked(rowIds, checked) {
    this.selectionManager.setItemsChecked(rowIds, checked);
  }
  /**
   * Row 체크 상태 추가
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  addItemChecked(rowId, checked) {
    this.selectionManager.addItemChecked(rowId, checked);
  }
  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 필드명
   * @param values 필드값
   */
  setCheckedItemByValue(name, values) {
    this.selectionManager.setCheckedItemByValue(name, values);
  }
  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 필드명
   * @param values 필드값
   */
  addCheckedItemByValue(name, values) {
    this.selectionManager.addCheckedItemByValue(name, values);
  }
  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 필드명
   * @param values 필드값
   */
  unCheckedItemByValue(name, values) {
    this.selectionManager.unCheckedItemByValue(name, values);
  }
  /**
   * Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  setFieldRefresh(fieldName) {
    this.selectionManager.setFieldRefresh(fieldName);
  }
  /**
   * Center Element Style 설정
   *
   * @param styleCss CSS Style
   */
  setCenterElementStyle(styleCss) {
    this.cellManager.setCenterElementStyle(styleCss);
  }
  /**
   * Row Anchor Cell 갱신
   */
  selectRowAnchorCell() {
    this.selectionManager.selectRowAnchorCell();
  }
  /**
   * 선택 데이터 복사
   */
  copyData() {
    this.selectionManager.copyData();
  }
  /** 시작 Cell Element 반환 */
  getStartCellElement() {
    return this.cellManager.getStartCellElement();
  }
  /**
   * Grid 영역 너비 설정
   *
   * @param mainLeftWidth Left 영역 너비
   * @param mainCenterWidth Center 영역 너비
   * @param mainRightWidth Right 영역 너비
   */
  setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth) {
    this.cellManager.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
  }
  /**
   * Body 데이터 렌더링
   *
   * @param mode 렌더링 모드
   */
  dataDraw(mode) {
    this.renderer.dataDraw(mode);
  }
  /**
   * Search Highlight 제거
   *
   */
  clearSearchHighlight() {
    this.cellManager.clearSearchHighlight();
  }
  /**
   * Body 리소스 정리
   */
  destroy() {
    this.bodyEvent.destroy();
    this.renderer.destroy();
    this.selectionManager.destroy();
    this.cellManager.destroy();
    this.context.resetCellState();
  }
}
const CONTEXT_MENU_ON = "dg-on";
class ContextMenu {
  constructor(gridMain) {
    this._isActive = false;
    this.contextData = /* @__PURE__ */ new Map();
    this.gridMain = gridMain;
    const contextOpts = this.gridMain.options().contextMenu;
    if (!contextOpts) {
      return;
    }
    this._isActive = true;
    this.contextOpts = contextOpts;
  }
  init() {
    if (!this._isActive) return;
    this.create();
    this.initEvent();
  }
  create() {
    var _a;
    const contextElement = document.createElement("ul");
    contextElement.dataset.gridLayerId = this.gridMain.uid();
    contextElement.className = "dg-contextmenu dg-contextmenu-top dg-outer-layer";
    contextElement.setAttribute("draggable", "false");
    contextElement.setAttribute("onselectstart", "return false");
    const htmlTemplate = [];
    if (this.contextOpts.enabledHeader) {
      htmlTemplate.push('<li><a class="dg-contextmenu-header" tabindex="-1">-</a></li>');
      htmlTemplate.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
    }
    htmlTemplate.push(this.template(this.contextOpts.items, "top", 0));
    contextElement.innerHTML = htmlTemplate.join("");
    (_a = document.querySelector(HIDDEN_ELEMENT_SELECTOR)) == null ? void 0 : _a.appendChild(contextElement);
    this.contextElement = new DaraElement(contextElement);
    this.gridMain.config().eventManager.on({ el: contextElement, type: "contextmenu" }, (e) => {
      stopPreventCancel(e);
    });
  }
  initEvent() {
    const cfg = this.gridMain.config();
    const contextOpts = this.contextOpts;
    const gridElement = this.gridMain.getMainElement().getElement();
    const isDisableItemKeyFn = isFunction(contextOpts.disableItem);
    const isBeforeActivateFn = isFunction(contextOpts.beforeActivate);
    let selectElement;
    const eventManager = this.gridMain.config().eventManager;
    eventManager.off(gridElement, "contextmenu");
    eventManager.on({ el: gridElement, type: "contextmenu" }, (e) => {
      stopPreventCancel(e);
      this.gridMain.hideLayer();
      removeClass(this.contextElement.finds(".dg-submenu-item." + CONTEXT_MENU_ON), CONTEXT_MENU_ON);
      if (isDisableItemKeyFn) {
        const disableItem = contextOpts.disableItem(contextOpts.items);
        if (disableItem) {
          const disableItemLen = disableItem.length;
          let item;
          if (disableItemLen > 0) {
            for (let i = 0; i < disableItemLen; i++) {
              item = disableItem[i];
              addClass(this.contextElement.find('[context-key="' + item.depth + "_" + item.key + '"]'), "disabled");
            }
          }
        }
      }
      const targetElement = e.target;
      selectElement = targetElement.closest(".dg-contextmenu-item");
      addClass(selectElement, "dg-select");
      if (isBeforeActivateFn) {
        const cellElement = targetElement.closest(".dg-cell");
        if (cellElement) {
          const cellInfo = getCellInfo(cfg, cellElement);
          contextOpts.beforeActivate(cellInfo, { evt: e, element: targetElement });
        } else {
          contextOpts.beforeActivate({ evt: e, element: targetElement });
        }
      }
      const evtPosition = eventPosition(e);
      const orginContextElement = this.contextElement.getElement();
      this.gridMain.openLayer(orginContextElement);
      const position = outerLayerPosition(orginContextElement, evtPosition);
      this.contextElement.css({ top: position.top + "px", left: position.left + "px" });
    });
    this.initItemClickEvent();
    this.initSubmenuEvent();
  }
  initItemClickEvent() {
    const contextItemElements = this.contextElement.finds(".dg-contextmenu-item");
    const fnContextCallback = this.contextOpts.callback;
    const isContextCallback = isFunction(fnContextCallback);
    const eventManager = this.gridMain.config().eventManager;
    eventManager.off(contextItemElements, "pointerdown");
    eventManager.on({ el: contextItemElements, type: "pointerdown" }, (e) => {
      const itemElement = e.currentTarget;
      if (hasClass(itemElement, "dg-submenu-item")) {
        return;
      }
      const parentElement = itemElement.closest(".dg-contextmenu");
      const checkboxes = parentElement.querySelectorAll('input[type="checkbox"]');
      const result = {};
      checkboxes.forEach((checkbox) => {
        var _a, _b;
        if ((_a = checkbox == null ? void 0 : checkbox.dataset) == null ? void 0 : _a.itemKey) {
          result[(_b = checkbox == null ? void 0 : checkbox.dataset) == null ? void 0 : _b.itemKey] = checkbox.checked;
        }
      });
      const itemKey = itemElement.dataset.itemKey || "";
      const clickItem = this.contextData.get(itemKey);
      this.gridMain.hideLayer();
      if (clickItem == null ? void 0 : clickItem.callback) {
        clickItem.callback(clickItem, result);
        return;
      }
      if (isContextCallback) {
        fnContextCallback(clickItem, result);
      }
    });
  }
  initSubmenuEvent() {
    const contextItemElements = this.contextElement.finds(".dg-contextmenu-item > a");
    let submenuTimer;
    const eventManager = this.gridMain.config().eventManager;
    eventManager.off(contextItemElements, "mouseenter");
    eventManager.on({ el: contextItemElements, type: "mouseenter" }, (e) => {
      const targetElement = e.currentTarget;
      const itemElement = targetElement.closest(".dg-contextmenu-item");
      const parentElement = itemElement.closest(".dg-contextmenu");
      clearTimeout(submenuTimer);
      if (!hasClass(itemElement, "dg-submenu-item")) {
        removeClass(parentElement.querySelectorAll(":scope >.dg-contextmenu-item." + CONTEXT_MENU_ON), CONTEXT_MENU_ON);
        return;
      }
      if (!hasClass(itemElement, CONTEXT_MENU_ON)) {
        removeClass(parentElement.querySelectorAll(":scope >.dg-contextmenu-item." + CONTEXT_MENU_ON), CONTEXT_MENU_ON);
      }
      submenuTimer = setTimeout(() => {
        addClass(itemElement, CONTEXT_MENU_ON);
        const browserSize = getBrowserSize();
        const itemRect = getElementRect(itemElement);
        const subMenuElement = itemElement.querySelector(".dg-contextmenu-submenu");
        const submenuElement = new DaraElement(subMenuElement);
        submenuElement.css({ left: "", top: "" });
        const submenuRect = getElementRect(subMenuElement);
        const submenuWidth = submenuRect.width;
        const submenuHeight = submenuRect.height;
        const willOverflowRight = submenuWidth + itemRect.left + itemRect.width > browserSize.width;
        if (willOverflowRight) {
          const shiftLeftPercent = submenuWidth / (itemRect.width + 3) * 100;
          submenuElement.css({ left: `-${shiftLeftPercent}%` });
        }
        const overflowBottom = itemRect.top + submenuHeight - browserSize.height;
        if (overflowBottom > 0) {
          submenuElement.css({ top: `-${overflowBottom}px` });
        }
      }, 450);
    });
  }
  /**
   * change header label
   *
   * @public
   * @param {string} label header label
   */
  changeHeader(label) {
    this.contextElement.find(".dg-contextmenu-header").textContent = label;
  }
  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(data, id, depth) {
    const htmlTemplate = [];
    const dateLen = data.length;
    let itemKey, classNames;
    for (let i = 0; i < dateLen; i++) {
      const item = data[i];
      if (isUndefined(item)) continue;
      classNames = resolveClassName(item.itemClass, { item }).join(" ") + (item.disabled === true ? " disabled" : "");
      itemKey = depth + "_" + (item.key || "");
      if (item.divider === true) {
        htmlTemplate.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
        continue;
      }
      if (item.checkbox === true) {
        htmlTemplate.push(html`<li class="dg-contextmenu-check ${classNames}">
          <a tabindex="-1">
            <label
              ><input type="checkbox" data-item-key="${replaceXss(String(item.key ?? ""))}" />
              <span>${replaceXss(String(item.label ?? ""))}</span>
            </label></a
          >
        </li>`);
        continue;
      }
      this.contextData.set(itemKey, item);
      if (!isUndefined(item.children)) {
        htmlTemplate.push(html`<li class="dg-contextmenu-item dg-submenu-item ${classNames}" data-item-key="${replaceXss(itemKey)}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${replaceXss(String(item.label ?? ""))}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>
          <ul class="dg-contextmenu dg-contextmenu-submenu">
            ${this.template(item.children, id, depth + 1)}
          </ul>
        </li>`);
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey) ? `<span class="dg-contextmenu-hotkey">${replaceXss(String(item.hotkey))}</span>` : "";
        htmlTemplate.push(html`<li class="dg-contextmenu-item ${classNames}" data-item-key="${replaceXss(itemKey)}">
          <a tabindex="-1"> <span class="dg-contextmenu-label">${replaceXss(String(item.label ?? ""))}</span>${hotkeyHtm} </a>
        </li>`);
      }
      htmlTemplate.push("</li>");
    }
    return htmlTemplate.join("");
  }
}
class HeaderCellClickHandler extends BasePointerHandler {
  constructor(context, headerEvent) {
    var _a;
    super(context);
    this.priority = 5;
    this.dragDelay = 150;
    this.beforeEndCol = -1;
    this.startCellIdx = 0;
    this.scrollDirectionX = null;
    this.dragAnimationId = 0;
    this.lastScrollTime = 0;
    this.selectionInfo = context.gridMain.selectionInfo;
    this.headerElement = (_a = context.header) == null ? void 0 : _a.getHeaderElement().getElement();
    this.multipleFlag = isMultipleCellSelectionMode(this.opts.selectionMode);
  }
  canHandle(session) {
    var _a, _b;
    const field = (_a = session.cellInfo) == null ? void 0 : _a.field;
    if (field == null ? void 0 : field.$isAside) {
      return false;
    }
    this.startCellIdx = ((_b = session.cellInfo) == null ? void 0 : _b.c) ?? 0;
    return true;
  }
  onPointerDown(session) {
  }
  onActivate(session) {
    if (!this.multipleFlag) return false;
    const cfg = this.cfg;
    const position = getElementRect(this.headerElement, true);
    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;
    this.gridBounds = {
      gridLeft: position.left,
      gridRight: position.left + cfg.dimensions.mainTotalWidth,
      mainLeft: position.left + mainLeftWidth,
      mainRight: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight
    };
    this.headerPosition = position;
    this.scrollDirectionX = null;
    this.beforeEndCol = -1;
    if (hasClass(session.cellEl, "dg-line-number")) {
      this.currentSelectionMode = SelectionModeMap.multiRow;
    }
  }
  onPointerMove(session) {
    if (!this.multipleFlag) return;
    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x } = session.currentPos;
    const moveRange = {};
    let hasMove = false;
    const moveXInfo = dragHorizontalMovePosition(
      cfg,
      x,
      this.headerPosition.left,
      bounds.mainLeft,
      bounds.mainRight
    );
    if (moveXInfo.overCell > -1) {
      hasMove = true;
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(
        this.currentSelectionMode,
        moveXInfo.overCell,
        cfg,
        session.cellEl,
        cfg.selection.isMouseDown
      ).endCol;
    }
    this.scrollDirectionX = moveXInfo.scrollDirectionX;
    if (this.beforeEndCol === moveRange.endCol) return;
    if (hasMove) {
      this.selectionInfo.setSelectionRangeInfo(
        {
          id: cfg.selection.id,
          range: moveRange
        },
        false,
        this.scrollDirectionX === null
      );
    }
    this.beforeEndCol = moveRange.endCol ?? -1;
    if (this.scrollDirectionX && this.dragAnimationId === 0) {
      this.startAutoScroll();
    }
  }
  startAutoScroll(selection = true) {
    if (this.dragAnimationId) return;
    this.lastScrollTime = 0;
    const cfg = this.cfg;
    const beforeMovePosition = { col: -1 };
    const gridMain = this.context.gridMain;
    const scroll = gridMain.getScroll();
    const body = this.context.gridMain.getBody();
    const loop = (time) => {
      const scrollDirectionX = this.scrollDirectionX;
      if (scrollDirectionX === null) {
        this.stopAutoScroll();
        return;
      }
      if (time - this.lastScrollTime < this.dragDelay) {
        this.dragAnimationId = requestAnimationFrame(loop);
        return;
      }
      this.lastScrollTime = time;
      let isDraw = false;
      const moveRangeInfo = {};
      if (scrollDirectionX !== null) {
        const isRight = scrollDirectionX === ScrollDirectionXMap.RIGHT;
        const endCol = isRight ? cfg.scroll.insideEndCol + 1 : cfg.scroll.insideStartCol - 1;
        if (beforeMovePosition.col !== endCol) {
          if (isRight && cfg.fixedRightIndex === 0 || !isRight && cfg.fixedLeftIndex === 0) {
            moveRangeInfo.endCol = endCol;
            this.selectionInfo.setSelectionRangeInfo({ range: moveRangeInfo }, false, false);
          }
        }
        scroll.moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });
        beforeMovePosition.col = endCol;
        isDraw = true;
      }
      if (isDraw) {
        body.dataDraw("drageHeadScroll");
      }
      this.dragAnimationId = requestAnimationFrame(loop);
    };
    this.dragAnimationId = requestAnimationFrame(loop);
  }
  stopAutoScroll() {
    if (this.dragAnimationId !== 0) {
      cancelAnimationFrame(this.dragAnimationId);
      this.dragAnimationId = 0;
    }
  }
  onPointerUp(session) {
    this.stopAutoScroll();
  }
  onClick(session) {
    const cfg = this.cfg;
    let initFlag = cfg.selection.id == "";
    const startCellIdx = this.startCellIdx;
    const range = {
      type: "column",
      startIdx: 0,
      endIdx: cfg.dataInfo.lastRow,
      startCol: startCellIdx,
      endCol: startCellIdx
    };
    const e = session.event;
    if (isCtrlKey(e)) {
      range.modifierKey = 1;
    } else if (isShiftKey(e)) {
      range.modifierKey = 2;
      range.startCol = initFlag ? startCellIdx : cfg.selection.range.startCol;
      range.endCol = startCellIdx;
    } else {
      initFlag = true;
    }
    if (!this.multipleFlag) return;
    this.selectionInfo.setSelectionRangeInfo(
      {
        range,
        isSelect: true,
        startCell: { startCol: startCellIdx }
      },
      initFlag,
      true
    );
  }
}
class HelpButtonEvent {
  constructor(gridMain, header) {
    this.gridMain = gridMain;
    this.header = header;
    this.helpOpts = gridMain.options().header;
  }
  /**
   * keydown event
   *
   */
  init() {
    const helpOpts = this.helpOpts.help;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    const helpElements = this.header.getHeaderElement().finds(".dg-header-help");
    if (isFunction(helpOpts.click)) {
      const helpClickFn = helpOpts.click ?? (() => void 0);
      eventManager.off(helpElements, "pointerdown");
      eventManager.on(
        { el: helpElements, type: "pointerdown" },
        (e) => {
          if (!isClickEvent(e)) {
            return;
          }
          stopPreventCancel(e);
          const currentElement = e.currentTarget;
          const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);
          helpClickFn(cellInfo);
          return false;
        },
        { passive: false }
      );
    }
    let helpLayerElement;
    const delay = helpOpts.showDelay;
    const renderContainer = this.gridMain.getRendererLayerElement();
    let delayTimer;
    eventManager.off(helpElements, "mouseenter");
    eventManager.on({ el: helpElements, type: "mouseenter" }, (e) => {
      const currentElement = e.currentTarget;
      const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);
      const field = cellInfo.field;
      const helpValue = (field == null ? void 0 : field.headerHelp) ?? helpOpts.content;
      if (!helpValue) return false;
      if (!helpLayerElement) {
        helpLayerElement = getLayerElement("div", "dg-header-help-tooltip", "help-tooltip");
        renderContainer.appendChild(helpLayerElement);
      }
      delayTimer = setTimeout(() => {
        let viewContent;
        if (isFunction(helpValue)) {
          viewContent = helpValue(cellInfo);
        } else {
          viewContent = helpValue;
        }
        helpLayerElement.innerHTML = viewContent;
        const layerStyle = helpLayerElement.style;
        layerStyle.height = "auto";
        layerStyle.display = "block";
        layerStyle.width = "auto";
        const openPosition = innerLayerPosition(renderContainer, currentElement, helpLayerElement);
        layerStyle.top = `${openPosition.top}px`;
        layerStyle.left = `${openPosition.left + 2}px`;
        layerStyle.height = `${openPosition.height}px`;
      }, delay);
      return false;
    });
    eventManager.on({ el: helpElements, type: "mouseleave" }, (e) => {
      clearTimeout(delayTimer);
      if (helpLayerElement == null ? void 0 : helpLayerElement.style) {
        helpLayerElement.style.display = "none";
      }
      return false;
    });
  }
  getHeaderHelpCellInfo(cfg, currentElement) {
    var _a, _b;
    let cell;
    let field;
    const groupCellElement = currentElement.closest(".dg-header-group-cell");
    if (groupCellElement) {
      const groupPosition = (_a = groupCellElement.dataset.headerGroupPosition) == null ? void 0 : _a.split(",");
      if (groupPosition && groupPosition.length > 0) {
        const row = intValue(groupPosition[0]);
        const idx = intValue(groupPosition[1]);
        let fieldGroups;
        if (groupCellElement.closest('.dg-region[data-region="left"]')) {
          fieldGroups = cfg.fieldHeaderGroup.left;
        } else if (groupCellElement.closest('.dg-region[data-region="right"]')) {
          fieldGroups = cfg.fieldHeaderGroup.right;
        } else {
          fieldGroups = cfg.fieldHeaderGroup.center;
        }
        field = fieldGroups[row][idx];
        cell = idx;
      }
    } else {
      cell = intValue(((_b = currentElement.closest(".dg-header-cell")) == null ? void 0 : _b.dataset.headerCellPosition) ?? "0");
      field = cfg.currentFields[cell];
    }
    return { c: cell, field };
  }
}
class ResizeHandler extends BasePointerHandler {
  constructor(context, headerEvent) {
    super(context);
    this.priority = 1;
    this.resizeIdx = 0;
    this.resizeMoveX = 0;
    this.positionLeft = 0;
    const resizeOpts = this.opts.header.resize;
    this.resizeOpts = resizeOpts;
    this.resizeUpdate = isFunction(resizeOpts.update) ? resizeOpts.update : void 0;
    this.resizerHelperElement = context.gridMain.element().findDaraElement(".dg-resize-helper");
  }
  onPointerDown(session) {
    var _a;
    this.resizeIdx = ((_a = session.cellInfo) == null ? void 0 : _a.c) || 0;
  }
  onActivate(session) {
    const cfg = this.cfg;
    const resizeIdx = this.resizeIdx;
    const isLeftContent = isFixedLeftPostion(cfg, resizeIdx);
    const isRightContent = isFixedRightPostion(cfg, resizeIdx);
    let posLeft = 0;
    if (isRightContent) {
      for (let i = cfg.fixedRightIndex; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.positionLeft = cfg.dimensions.mainInsideWidth - cfg.dimensions.mainRightWidth + posLeft;
    } else if (isLeftContent) {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.positionLeft = posLeft;
    } else {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.positionLeft = posLeft - cfg.scroll.centerLeftPosition;
    }
    this.resizerHelperElement.addClass("active");
  }
  onPointerMove(session) {
    const resizeMoveX = session.currentPos.x - session.startPos.x;
    const moveLeftPosition = this.positionLeft + resizeMoveX;
    this.resizeMoveX = resizeMoveX;
    this.resizerHelperElement.css({ left: moveLeftPosition + "px" });
  }
  onPointerUp(session) {
    if (this.resizerHelperElement.hasClass("active")) {
      this.resizerHelperElement.removeClass("active");
      document.documentElement.removeAttribute("onselectstart");
      this.headerColumnResize(this.resizeIdx, this.resizeMoveX);
    }
  }
  /**
   * header column resize
   *
   * @public
   * @param {number} resizeIdx resize index
   * @param {number} resizeWidth resize width
   */
  headerColumnResize(resizeIdx, resizeWidth) {
    const cfg = this.cfg;
    const currentFireld = cfg.currentFields[resizeIdx];
    const w = currentFireld.$width + resizeWidth;
    this.context.gridMain.getStructureBuilder().setColumnWidth(resizeIdx, w);
    if (this.resizeUpdate) {
      this.resizeUpdate.call(null, { index: this.resizeIdx, width: w });
    }
  }
  onDoubleClick(session) {
    const resizeIdx = this.resizeIdx;
    const field = this.cfg.currentFields[resizeIdx];
    const resizeW = field.$renderer.getMinWidth(this.cfg, this.opts);
    this.context.gridMain.getStructureBuilder().setColumnWidth(resizeIdx, resizeW);
  }
}
class SortButtonEvent {
  constructor(gridMain, header) {
    this.gridMain = gridMain;
    this.header = header;
    this.sortOpts = gridMain.options().header.sort;
  }
  /**
   * init
   *
   */
  init() {
    const sortOpts = this.sortOpts;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    const sortOrders = cfg.sort.orders;
    const dataManager = cfg.dataManager;
    const headerElement = this.header.getHeaderElement();
    const sortElements = headerElement.finds(".dg-sort-icon");
    const headerCellElements = this.header.getHeaderCellElements();
    let beforeSortOrderLength = 0;
    eventManager.off(sortElements, "pointerdown");
    eventManager.on(
      { el: sortElements, type: "pointerdown" },
      (e) => {
        var _a, _b;
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);
        this.gridMain.hideLayer();
        const currentElement = e.currentTarget;
        const sortCell = intValue(
          ((_a = currentElement.closest(".dg-header-cell")) == null ? void 0 : _a.dataset.headerCellPosition) ?? "0"
        );
        const sortField = cfg.currentFields[sortCell];
        const sortName = sortField.name;
        const isShift = isShiftKey(e);
        if (!isShift) {
          removeAttr(headerElement.finds("[data-dg-sort]"), "data-dg-sort");
          if (sortOrders.length > 1 || !sortOrders.some((item) => item.name === sortName)) {
            sortOrders.forEach((item) => {
              var _a2;
              (_a2 = headerCellElements[item.sortCell].querySelector(".dg-sort-num")) == null ? void 0 : _a2.replaceChildren();
            });
            sortOrders.length = 0;
            beforeSortOrderLength = 0;
          }
        }
        const currentSortItem = sortOrders.find((item) => item.name === sortName);
        if (currentSortItem) {
          if (currentSortItem.ascOrder) {
            addAttr(currentElement, { "data-dg-sort": "desc" });
            currentSortItem.ascOrder = !currentSortItem.ascOrder;
          } else {
            const index = sortOrders.findIndex((item) => item.name === sortName);
            if (index !== -1) {
              sortOrders.splice(index, 1);
            }
            (_b = currentElement.querySelector(".dg-sort-num")) == null ? void 0 : _b.replaceChildren();
            removeAttr(currentElement, "data-dg-sort");
          }
        } else {
          addAttr(currentElement, { "data-dg-sort": "asc" });
          sortOrders.push({ name: sortName, field: sortField, ascOrder: true, sortCell });
        }
        if (sortOrders.length > 0) {
          if (beforeSortOrderLength >= 1 && beforeSortOrderLength != sortOrders.length) {
            sortOrders.forEach((item, index) => {
              var _a2;
              (_a2 = headerCellElements[item.sortCell].querySelector(".dg-sort-num")) == null ? void 0 : _a2.replaceChildren(index + 1 + "");
            });
          }
        }
        dataManager.dataSort(sortOrders, sortOpts);
        beforeSortOrderLength = sortOrders.length;
        this.gridMain.selectionInfo.initSelection();
        this.gridMain.getBody().dataDraw("sort");
      },
      { passive: false }
    );
  }
}
class HeaderEvent {
  constructor(gridMain, header) {
    this.cfg = gridMain.config();
    this.gridMain = gridMain;
    this.header = header;
    this.headerElement = this.header.getHeaderElement();
    this.headerCellElements = this.header.getHeaderCellElements();
    this.headerOpts = gridMain.options().header;
  }
  init() {
    if (this.gridMain.options().search.enabled === true) {
      this.initSearchButton();
    }
    if (this.gridMain.config().enabledHeaderHelpButton) {
      new HelpButtonEvent(this.gridMain, this.header).init();
    }
    if (this.gridMain.config().enabledSortButton) {
      new SortButtonEvent(this.gridMain, this.header).init();
    }
    this.initPointerEvent();
    this.initResizeEvent();
    this.initHeaderCheckbox();
  }
  /**
   * 검색 버튼
   */
  initSearchButton() {
    const searchIconElement = this.headerElement.find(".dg-search-icon");
    const eventManager = this.cfg.eventManager;
    eventManager.off(searchIconElement, "click");
    eventManager.on({ el: searchIconElement, type: "click" }, (e) => {
      stopPreventCancel(e);
      this.gridMain.getDataSearch().openSearch();
      return false;
    });
  }
  /**
   * init header selection event
   */
  initPointerEvent() {
    const selectionMode = this.gridMain.options().selectionMode;
    const allHandlers = [];
    if (this.headerOpts.enabledAllColumnSelection && !isSingleSelectionMode(selectionMode)) {
      allHandlers.push(new HeaderCellClickHandler({ gridMain: this.gridMain, header: this.header }, this));
    }
    if (allHandlers.length < 1) return;
    const cfg = this.cfg;
    const eventManager = cfg.eventManager;
    const headerCellElements = this.headerCellElements;
    let session;
    const clickManager = new ClickManager();
    const dragThreshold = MOUSE_MOVE_THRESHOLD;
    const cleanupDragEvents = () => {
      eventManager.off(
        document,
        "touchmove.header.selection mousemove.header.selection touchend.header.selection touchcancel.header.selection mouseup.header.selection"
      );
    };
    eventManager.off(headerCellElements, "mousedown.header.selection touchstart.header.selection");
    eventManager.on(
      { el: headerCellElements, type: "mousedown.header.selection touchstart.header.selection" },
      (e) => {
        if (!isPrimaryPointer(e)) {
          return true;
        }
        this.gridMain.hideLayer();
        const targetElement = e.currentTarget;
        const startCellInfo = getHeaderCellInfo(cfg, targetElement);
        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);
        session = initPointerSession(e, startCellInfo, clickManager);
        let handlerPriority = -1;
        for (const handler2 of allHandlers) {
          if (handler2.canHandle(session)) {
            if (handlerPriority > handler2.priority) {
              continue;
            }
            handlerPriority = handler2.priority;
            session.handler = handler2;
          }
        }
        const handler = session.handler;
        if (!handler) return;
        if (handler.onPointerMove) {
          let isStarted = false;
          eventManager.on(
            { el: document, type: "touchmove.header.selection mousemove.header.selection" },
            (moveEvt) => {
              var _a, _b;
              session.currentPos = eventPosition(moveEvt);
              if (!isStarted) {
                if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
                  return;
                }
                isStarted = true;
                if (((_a = handler.onActivate) == null ? void 0 : _a.call(handler, session)) === false) {
                  cleanupDragEvents();
                  return;
                }
              }
              session.state = PointerStateMap.DRAGGING;
              (_b = handler.onPointerMove) == null ? void 0 : _b.call(handler, session);
            }
          );
          eventManager.on(
            { el: document, type: "touchend.header.selection touchcancel.header.selection  mouseup.header.selection" },
            (moveEvt) => {
              var _a;
              cleanupDragEvents();
              session.state = PointerStateMap.IDLE;
              session.currentPos = eventPosition(moveEvt);
              (_a = handler.onPointerUp) == null ? void 0 : _a.call(handler, session);
            }
          );
        }
        clickManager.processClick(session, handler);
      },
      { passive: true }
    );
  }
  /**
   * resize event
   *
   * @private
   */
  initResizeEvent() {
    const opts = this.gridMain.options();
    if (opts.header.resize.enabled === false) return;
    const cfg = this.cfg;
    const eventManager = cfg.eventManager;
    const resizerElements = this.headerElement.finds(".dg-header-resizer");
    const resizeHandler = new ResizeHandler({ gridMain: this.gridMain, header: this.header }, this);
    let session;
    const clickManager = new ClickManager();
    const dragThreshold = MOUSE_MOVE_THRESHOLD;
    eventManager.off(resizerElements, "mousedown.resizerclick touchstart.resizerclick");
    eventManager.on(
      { el: resizerElements, type: "mousedown.resizerclick touchstart.resizerclick" },
      (e) => {
        var _a;
        if (!isPrimaryPointer(e)) {
          return true;
        }
        if (e.cancelable) {
          stopPreventCancel(e);
        }
        this.gridMain.hideLayer();
        const targetElement = e.currentTarget;
        const startCellInfo = getHeaderResizeCellInfo(cfg, targetElement);
        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);
        session = initPointerSession(e, startCellInfo, clickManager);
        session.handler = resizeHandler;
        (_a = resizeHandler.onPointerDown) == null ? void 0 : _a.call(resizeHandler, session);
        if (resizeHandler.onPointerMove) {
          let isStarted = false;
          eventManager.on({ el: document, type: "touchmove.resizerclick mousemove.resizerclick" }, (moveEvt) => {
            var _a2, _b;
            session.currentPos = eventPosition(moveEvt);
            if (!isStarted) {
              if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
                return;
              }
              isStarted = true;
              (_a2 = resizeHandler.onActivate) == null ? void 0 : _a2.call(resizeHandler, session);
            }
            session.state = PointerStateMap.DRAGGING;
            (_b = resizeHandler.onPointerMove) == null ? void 0 : _b.call(resizeHandler, session);
          });
          eventManager.on({ el: document, type: "touchend.resizerclick mouseup.resizerclick" }, (moveEvt) => {
            var _a2;
            eventManager.off(
              document,
              "touchmove.resizerclick mousemove.resizerclick touchend.resizerclick mouseup.resizerclick"
            );
            session.state = PointerStateMap.IDLE;
            session.currentPos = eventPosition(moveEvt);
            (_a2 = resizeHandler.onPointerUp) == null ? void 0 : _a2.call(resizeHandler, session);
          });
        }
        clickManager.processClick(session, resizeHandler);
      },
      { passive: false }
    );
  }
  /**
   * header all check
   *
   */
  initHeaderCheckbox() {
    const dgRowAllCheckElement = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all");
    this.cfg.eventManager.on({ el: dgRowAllCheckElement, type: "click" }, (e) => {
      const eventElement = e.currentTarget;
      this.header.setAllCheckItem(!hasClass(eventElement, SELECTED_STYLE_CLASS), eventElement);
    });
  }
}
const CHECK_INDETERMINATE = "dg-indeterminate";
class Header {
  constructor(gridMain) {
    this.enabled = true;
    this.gridMain = gridMain;
    this.headerOpts = gridMain.options().header;
    this.headerElement = gridMain.element().findDaraElement(".dg-header");
    if (this.headerOpts.view === false) {
      this.enabled = false;
      this.headerElement.getElement().remove();
      return;
    }
    this.initHeader();
    this.headerEvent = new HeaderEvent(gridMain, this);
    this.headerEvent.init();
  }
  initHeader() {
    this.createTemplate();
    this.setHeight(this.gridMain.config().dimensions.mainHeaderHeight);
  }
  isEnabled() {
    return this.enabled;
  }
  getHeaderCellElements() {
    return this.headerCellElements;
  }
  getHeaderElement() {
    return this.headerElement;
  }
  /**
   * all item check
   *
   * @public
   * @param {boolean} checked
   * @param {?HTMLInputElement} [allCheckedElement]
   */
  setAllCheckItem(checked, allCheckedElement) {
    if (!allCheckedElement) {
      allCheckedElement = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all");
    }
    if (checked) {
      addClass(allCheckedElement, SELECTED_STYLE_CLASS);
    } else {
      removeClass(allCheckedElement, SELECTED_STYLE_CLASS);
    }
    removeClass(allCheckedElement, CHECK_INDETERMINATE);
    this.gridMain.getBody().setAllCheckItem(checked);
  }
  /**
   * set check box style
   *
   * @public
   * @param {number} idx
   * @param {("all" | "none" | "partial")} mode
   */
  setCheckboxStyle(mode) {
    if (!this.gridMain.config().isRowAllowMultiSelect) return;
    const checkEle = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all");
    const classList = checkEle == null ? void 0 : checkEle.classList;
    if (!classList) return;
    if (mode == "partial") {
      classList.remove(SELECTED_STYLE_CLASS);
      if (!classList.contains(CHECK_INDETERMINATE)) classList.add(CHECK_INDETERMINATE);
    } else {
      classList.toggle(SELECTED_STYLE_CLASS, mode === "all");
      if (classList.contains(CHECK_INDETERMINATE)) classList.remove(CHECK_INDETERMINATE);
    }
  }
  /**
   * set header height
   *
   * @param {number} header height
   */
  setHeight(height) {
    this.headerElement.setHeight(height);
  }
  /**
   * set header panel width
   *
   * @public
   * @param {number} mainLeftWidth
   * @param {number} mainCenterWidth
   * @param {number} mainRightWidth
   */
  setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth) {
    if (!this.enabled) return;
    this.leftElement.css({ width: mainLeftWidth + "px" });
    this.centerElement.css({ "margin-left": mainLeftWidth + "px", width: mainCenterWidth + "px" });
    this.rightElement.css({ width: mainRightWidth + "px" });
  }
  setCenterElementStyle(styleCss) {
    if (!this.enabled) return;
    this.centerElement.css(styleCss);
  }
  setSearchIcon(searchDataFlag) {
    const searchIconElement = this.headerElement.find(".dg-search-icon");
    if (searchDataFlag) {
      addClass(searchIconElement, "dg-on");
    } else {
      removeClass(searchIconElement, "dg-on");
    }
  }
  createTemplate() {
    this.headerElement.css({ height: `${this.gridMain.config().dimensions.mainHeaderHeight}px` });
    this.leftElement = this.headerElement.findDaraElement('.dg-region[data-region="left"]');
    this.centerElement = this.headerElement.findDaraElement('.dg-region[data-region="center"]');
    this.rightElement = this.headerElement.findDaraElement('.dg-region[data-region="right"]');
    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
    this.headerCellElements = [];
    this.headerElement.finds(".dg-header-cell").forEach((node) => {
      const ele = node;
      const cellIdx = intValue(ele.dataset.headerCellPosition || "0");
      this.headerCellElements[cellIdx] = node;
    });
  }
  /**
   *  set column line selection style
   * @param columnLine  selected column line set
   * @param isAll all select flag
   * @returns
   */
  selectColumnAnchorCell() {
    if (!this.enabled) return;
    const dataInfo = this.gridMain.config().dataInfo;
    const headerObj = this.gridMain.getHeader();
    const headerCellElements = headerObj.getHeaderCellElements();
    const isAll = this.gridMain.selectionInfo.isAllSelect();
    const columnLine = this.gridMain.selectionInfo.getColumnLine();
    for (let col = dataInfo.startCol; col < dataInfo.colLength; col++) {
      const headerEle = headerCellElements[col];
      const classList = headerEle.classList;
      if (isAll || columnLine.has(col)) {
        if (!classList.contains(BodyCellStyleMap.SELECTION)) {
          classList.add(BodyCellStyleMap.SELECTION);
        }
      } else if (classList.contains(BodyCellStyleMap.SELECTION)) {
        classList.remove(BodyCellStyleMap.SELECTION);
      }
    }
  }
  clearAnchorCell() {
    removeClass(this.getHeaderCellElements(), BodyCellStyleMap.SELECTION);
  }
  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(type) {
    var _a;
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    let headerGroups, leafGroup;
    const currentFields = cfg.currentFields;
    if (type == "left") {
      headerGroups = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      headerGroups = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      headerGroups = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }
    if (!(headerGroups == null ? void 0 : headerGroups.length) || !((_a = headerGroups[0]) == null ? void 0 : _a.length)) return "";
    const rowsHtml = [];
    const searchEnabledd = opts.search.enabled;
    const helpEnabled = opts.header.help.enabled;
    const headerGroupLength = headerGroups.length;
    const resizeEnabled = this.headerOpts.resize.enabled;
    const sortEnabled = opts.header.sort.enabled;
    const searchIcon = searchEnabledd ? html`<div class="dg-search-icon">${ALL_ICONS.search}</div>` : "";
    headerGroups.forEach((headerGroup, rowIndex) => {
      const trHeight = cfg.fieldHeaderGroup.heights[rowIndex];
      const rowHtml = [`<tr class="dg-header-row" style="height:${trHeight}px">`];
      headerGroup.forEach((headerItem, colIndex) => {
        if (headerItem.$isLeaf && headerItem.$depth < headerGroupLength) {
          headerItem.$rowspan = headerGroupLength - headerItem.$depth;
        }
        let classes = "";
        let cellIdx = "";
        if (headerItem.$isLeaf) {
          classes = "dg-header-cell";
          cellIdx = ` data-header-cell-position="${headerItem.$resizeIdx}"`;
        } else {
          classes = "dg-header-group-cell";
          cellIdx = ` data-header-group-position="${rowIndex},${colIndex}"`;
        }
        const colspan = headerItem.$colspan > 1 ? ` colspan="${headerItem.$colspan}" scope="colgroup"` : "";
        const rowspan = headerItem.$rowspan > 1 ? ` rowspan="${headerItem.$rowspan}"` : "";
        const sortIcons = headerItem.$isLeaf && !headerItem.$isAside && (sortEnabled || headerItem.sort === true) ? html`<div class="dg-sort-icon"><span class="dg-sort-num"></span>${ALL_ICONS.headerSort}</div>` : "";
        const isheaderHelp = headerItem.$enabledHelp;
        const helpIcon = !headerItem.$isAside && (helpEnabled || isheaderHelp !== false) ? html`<div class="dg-header-help-button">${ALL_ICONS.help}</div>` : "";
        const label = headerItem.$isAside && headerItem.name == ROW_CHECK_NAME && cfg.isRowAllowMultiSelect ? html`<div class="dg-choice">
                <div class="dg-choice-item dg-checkbox dg-all">
                  <div class="dg-indicator"></div>
                  ${headerItem.label ? `<span class="dg-label dg-ellipsis">${headerItem.label}</span>` : ""}
                </div>
              </div>` : `<div class="centered">${headerItem.label ?? ""}</div>`;
        const searchHtml = headerItem.$isAside && headerItem.name == LINE_NUMBER_NAME ? searchIcon : "";
        const labelHtml = html` ${helpIcon}
          <div class="dg-label-wrapper">
            <div class="dg-header-label ${headerItem.sort ? "sort-header" : ""}">
              <div class="dg-inner">${label}</div>
              ${sortIcons}
            </div>
          </div>`;
        const resizerHtml = !resizeEnabled || headerItem.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${headerItem.$resizeIdx}"></div>`;
        rowHtml.push(html` <th class="${classes}" ${colspan}${rowspan}${cellIdx}>
          ${searchHtml} ${labelHtml} ${resizerHtml}
        </th>`);
      });
      rowHtml.push("</tr>");
      rowsHtml.push(rowHtml.join(""));
    });
    const colGroupHtml = [];
    for (const leaf of leafGroup) {
      const colSeq = leaf.$colSeq;
      colGroupHtml.push(
        `<th data-col-idx="${colSeq}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${currentFields[colSeq].$width}px;"></th>`
      );
    }
    return html` <table class="dg-header-table">
        <thead>
          <tr>
            ${colGroupHtml.join("")}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join("")}
        </tbody>
      </table>
      ${type === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
}
class HorizontalScroll {
  constructor(gridMain, scroll, horizontalElement) {
    this.gridMain = gridMain;
    this.scrollOpts = this.gridMain.options().scroll;
    this.horizontalElement = horizontalElement;
    this.horizontalTrackElement = horizontalElement.findDaraElement(".dg-scroll-track");
    this.horizontalThumbElement = horizontalElement.findDaraElement(".dg-scroll-thumb");
  }
  /**
   * horizontal event 초기화
   *
   */
  init() {
    const scrollSize = this.scrollOpts.width;
    this.horizontalElement.css({ height: `${scrollSize}px` });
    this.horizontalThumbElement.css({
      height: `${scrollSize - SCROLL_INSET}px`,
      margin: `1px ${scrollSize}px`
    });
    const scrollButtonElements = this.horizontalElement.finds(".dg-scroll-button > svg");
    scrollButtonElements.forEach((el) => {
      el.style.width = `${scrollSize - SCROLL_INSET}px`;
      el.style.height = `${scrollSize - SCROLL_INSET}px`;
    });
    this.initHorizontalTrack();
    this.initHorizontalThumb();
    this.initHorizontalButton();
  }
  /**
   * 가로 스크롤 계산
   * @returns
   */
  calculate() {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;
    if (!scroll.enabledHorizontal) {
      scroll.left = 0;
      this.setHorizontalPosition(cfg);
      return;
    }
    const dimensions = cfg.dimensions;
    const arrowButtonSize = cfg.scrollbarSize * 2;
    const totalColWidth = dimensions.mainTotalWidth;
    const hWidth = dimensions.width - (scroll.enabledVertical ? cfg.scrollbarSize : 0) - 2;
    const hTrackWidth = hWidth - arrowButtonSize;
    let thumbWidth = hTrackWidth * (hTrackWidth / totalColWidth * 100) / 100;
    thumbWidth = Math.max(thumbWidth, SCROLL_THUMB_MIN_SIZE);
    this.horizontalElement.css({ width: hWidth + "px" });
    this.horizontalThumbElement.css({ width: thumbWidth + "px" });
    scroll.oneColMove = totalColWidth / cfg.dataInfo.colLength;
    scroll.hWidth = hWidth;
    scroll.hTrackWidth = hTrackWidth;
    scroll.hThumbWidth = thumbWidth;
    if (scroll.left + thumbWidth > hTrackWidth) {
      scroll.left = hTrackWidth - thumbWidth;
      this.setHorizontalPosition(cfg);
    } else {
      this.calcViewCol(cfg, scroll.centerLeftPosition);
    }
  }
  /**
   * init horizontal thumb drag event
   *
   * @private
   */
  initHorizontalThumb() {
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    let dragging = false;
    let lastX = 0;
    let startX = 0;
    let initialLeft = 0;
    let animationFrameId = null;
    const horizontalThumbElement = this.horizontalThumbElement;
    const moveHorizontalScroll = this.moveHorizontalScroll.bind(this);
    const cleanup = () => {
      cfg.eventManager.off(document, "touchmove mousemove touchend touchcancel mouseup");
    };
    const onMove = (e) => {
      if (!dragging) return;
      lastX = eventPosition(e).x;
    };
    const onEnd = (e) => {
      if (!dragging) return;
      dragging = false;
      horizontalThumbElement.removeClass("active");
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      const endX = eventPosition(e).x;
      moveHorizontalScroll({ position: initialLeft + (endX - startX) });
      cleanup();
    };
    const loop = () => {
      if (!dragging) return;
      const delta = lastX - startX;
      moveHorizontalScroll({ position: initialLeft + delta });
      animationFrameId = requestAnimationFrame(loop);
    };
    const orginHorizontalThumbElement = horizontalThumbElement.getElement();
    eventManager.off(orginHorizontalThumbElement, "mousedown touchstart touchend touchcancel mouseup");
    eventManager.on(
      { el: orginHorizontalThumbElement, type: "mousedown touchstart" },
      (e) => {
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);
        this.gridMain.hideLayer();
        dragging = true;
        startX = eventPosition(e).x;
        lastX = startX;
        initialLeft = cfg.scroll.left;
        horizontalThumbElement.addClass("active");
        eventManager.on({ el: document, type: "touchmove mousemove" }, onMove);
        eventManager.on({ el: document, type: "touchend touchcancel mouseup" }, onEnd);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(loop);
        return true;
      },
      { passive: false }
    );
  }
  /**
   * init horizontal track event
   *
   * @private
   */
  initHorizontalTrack() {
    const scrollOpts = this.scrollOpts;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    let bgMoveMode = 0;
    let leftFlag = false;
    let startEventX = 0;
    let oneColMove = 0;
    let bgMoveCol = 0;
    let horizontalScrollTimer;
    const horizontalTrackElement = this.horizontalTrackElement.getElement();
    eventManager.off(horizontalTrackElement, "mousedown touchstart mouseup touchend touchcancel mouseleave");
    eventManager.on(
      { el: horizontalTrackElement, type: "mousedown touchstart" },
      (e) => {
        if (!isClickEvent(e)) {
          return;
        }
        this.gridMain.hideLayer();
        bgMoveMode = 1;
        startEventX = eventPosition(e).clientX - horizontalTrackElement.getBoundingClientRect().left;
        oneColMove = cfg.scroll.oneColMove;
        bgMoveCol = oneColMove * scrollOpts.horizontal.speed * 2;
        leftFlag = startEventX < cfg.scroll.left;
        horizontalScrollTimer = setInterval(() => {
          bgMoveMode = 2;
          this.moveHorizontalScroll({
            position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol)
          });
        }, 100);
      },
      { passive: false }
    );
    eventManager.on({ el: horizontalTrackElement, type: "mouseup touchend touchcancel mouseleave" }, (e) => {
      if (bgMoveMode == 0) return;
      stopPreventCancel(e);
      clearTimeout(horizontalScrollTimer);
      if (bgMoveMode == 1) {
        this.moveHorizontalScroll({
          position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol)
        });
      }
      bgMoveMode = 0;
    });
  }
  /**
   * init horizontal button event
   *
   * @private
   */
  initHorizontalButton() {
    let scrollBtnTimer;
    const vBtnDelay = 100;
    let buttonMoveMode = 0;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    const scrollButtonElements = this.horizontalElement.finds(".dg-scroll-button");
    eventManager.off(scrollButtonElements, "mousedown touchstart mouseup touchcancel touchend mouseleave");
    eventManager.on(
      { el: scrollButtonElements, type: "mousedown touchstart" },
      (e) => {
        const mode = eqAttributeValue(e.currentTarget, "data-dg-mode", "left");
        buttonMoveMode = 1;
        this.gridMain.hideLayer();
        scrollBtnTimer = setInterval(() => {
          buttonMoveMode = 2;
          this.moveHorizontalScroll({ direction: mode ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT });
        }, vBtnDelay);
      },
      { passive: false }
    );
    eventManager.on({ el: scrollButtonElements, type: "mouseup touchend touchcancel mouseleave" }, (e) => {
      if (buttonMoveMode == 1) {
        const mode = eqAttributeValue(e.currentTarget, "data-dg-mode", "left");
        this.moveHorizontalScroll({ direction: mode ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT });
      }
      clearInterval(scrollBtnTimer);
      buttonMoveMode = 0;
    });
  }
  /**
   *
   * @param cfg 설정 정보
   * @param startEventY start event y
   * @param oneRowMove row move value
   * @param upFlag up down flag up = true
   * @param bgMoveCol
   * @returns
   */
  getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol) {
    let leftPosition = cfg.scroll.left + (leftFlag ? -1 : 1) * bgMoveCol;
    if (leftFlag) {
      if (startEventX >= leftPosition) {
        leftPosition = startEventX - oneColMove;
      }
    } else if (startEventX <= leftPosition + cfg.scroll.hThumbWidth) {
      leftPosition = startEventX - cfg.scroll.hThumbWidth + oneColMove * 2;
    }
    return leftPosition;
  }
  /**
   * @method moveHorizontalScroll
   * @param  moveObj.position {Integer} left position
   * @param  moveObj.direction {String} 'L' or 'R'
   * @param  moveObj.drawFlag {boolean} redraw flag
   * @param  moveObj.speed {Integer} row move count
   * @description 가로 스크롤 이동.
   */
  moveHorizontalScroll(moveObj) {
    const cfg = this.gridMain.config();
    if (!cfg.scroll.enabledHorizontal) {
      if (cfg.scroll.left > 0) {
        this.moveHorizontalScrollPosition(0, moveObj.drawFlag);
      }
    }
    let leftVal = 0;
    if (isNumber(moveObj.position)) {
      leftVal = moveObj.position;
    } else if (isNumber(moveObj.colIdx)) {
      let colIdx = moveObj.colIdx;
      if (colIdx > 0) {
        colIdx = Math.min(colIdx, cfg.dataInfo.colLength - 1);
      } else {
        colIdx = 0;
      }
      for (let i = cfg.fixedLeftIndex; i < colIdx; i++) {
        leftVal += cfg.currentFields[i].$width;
      }
      if (moveObj.direction == "R") {
        leftVal = leftVal + cfg.currentFields[colIdx].$width;
      }
      leftVal = getHorizontalScrollPosition(cfg, leftVal, moveObj.direction);
    } else if (isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      leftVal = cfg.scroll.left + (moveObj.direction == ScrollDirectionXMap.LEFT ? -1 : 1) * speed * cfg.scroll.oneColMove;
    }
    this.moveHorizontalScrollPosition(leftVal, moveObj.drawFlag);
  }
  /**
   * @method moveHorizontalScrollPosition
   * @param leftVal {Integer} body left position
   * @param drawFlag {Boolean} draw flag
   * @param updateChkFlag {Boolean} 업데이트 여부.
   * @description 가로 스크롤바 위치 이동
   */
  moveHorizontalScrollPosition(leftVal, drawFlag = true, updateChkFlag) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;
    if (leftVal >= scroll.hTrackWidth - scroll.hThumbWidth) {
      leftVal = scroll.hTrackWidth - scroll.hThumbWidth;
    } else if (leftVal <= 0) {
      leftVal = 0;
    }
    if (scroll.left == leftVal) {
      return;
    }
    scroll.left = leftVal;
    if (updateChkFlag !== false) {
      const onUpdateFn = this.scrollOpts.horizontal.onUpdate;
      if (drawFlag !== false && isFunction(onUpdateFn)) {
        if (onUpdateFn({
          scrollLeft: leftVal,
          width: scroll.hTrackWidth,
          barPosition: scroll.hBarPosition
        }) === false) {
          return;
        }
      }
    }
    this.setHorizontalPosition(cfg);
    if (drawFlag === false) {
      return;
    }
    this.gridMain.getBody().dataDraw("hscroll");
  }
  /**
   * 가로 스크롤 위치 셋팅
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} contLeftVal scroll position
   */
  setHorizontalPosition(cfg) {
    const scroll = cfg.scroll;
    const centerLeftPosition = getCenterContentLeft(cfg, scroll.left);
    cfg.scroll.centerLeftPosition = centerLeftPosition;
    this.calcViewCol(cfg, centerLeftPosition);
    this.horizontalThumbElement.css({ left: scroll.left + "px" });
    const leftCss = { left: "-" + centerLeftPosition + "px" };
    this.gridMain.getHeader().setCenterElementStyle(leftCss);
    this.gridMain.getBody().setCenterElementStyle(leftCss);
    this.gridMain.getSummary().setCenterElementStyle(leftCss);
  }
  /**
   * view col 위치 구하기.
   *
   * @param {Config} cfg 설정 정보
   */
  calcViewCol(cfg, centerLeftPosition) {
    const scroll = cfg.scroll;
    const dimensions = cfg.dimensions;
    const mainInsideWidth = dimensions.mainInsideWidth;
    const mainViewWidth = mainInsideWidth - (dimensions.mainLeftWidth + dimensions.mainRightWidth);
    const fields = cfg.fieldHeaderGroup.leafCenter;
    let itemLeftVal = 0;
    let startCol = 0, endCol = fields.length - 1;
    let startFlag = true, inSideStartFlag = true;
    for (let i = 0; i < fields.length; i++) {
      if (inSideStartFlag && itemLeftVal >= centerLeftPosition) {
        scroll.insideStartCol = i;
        inSideStartFlag = false;
      }
      itemLeftVal += fields[i].$width;
      if (startFlag && itemLeftVal >= centerLeftPosition) {
        startCol = i;
        startFlag = false;
        continue;
      }
      if (itemLeftVal - centerLeftPosition >= mainViewWidth) {
        endCol = i;
        break;
      }
    }
    scroll.before.startCol = scroll.startCol;
    scroll.before.endCol = scroll.endCol;
    scroll.insideStartCol = cfg.fixedLeftIndex + scroll.insideStartCol;
    scroll.startCol = cfg.fixedLeftIndex + Math.max(startCol, 0);
    scroll.endCol = cfg.fixedLeftIndex + Math.min(endCol, fields.length);
    const colValue = getHorizontalScrollPosition(cfg, itemLeftVal, "R") != scroll.left ? -1 : 0;
    scroll.insideEndCol = scroll.endCol + colValue;
  }
}
class VerticalScroll {
  constructor(gridMain, scroll, verticalElement) {
    this.bodyDrawPending = false;
    this.bodyDrawAnimationId = 0;
    this.lastThumbTop = -1;
    this.gridMain = gridMain;
    this.scrollOpts = this.gridMain.options().scroll;
    this.verticalElement = verticalElement;
    this.verticalTrackElement = verticalElement.findDaraElement(".dg-scroll-track");
    this.verticalThumbElement = verticalElement.findDaraElement(".dg-scroll-thumb");
  }
  /**
   * vertical event 초기화
   *
   */
  init() {
    const scrollSize = this.scrollOpts.width;
    this.verticalElement.css({ width: `${scrollSize}px` });
    this.verticalThumbElement.css({ width: `${scrollSize - SCROLL_INSET}px`, margin: `${scrollSize}px 0px` });
    const scrollButtonElements = this.verticalElement.finds(".dg-scroll-button > svg");
    scrollButtonElements.forEach((el) => {
      el.style.width = `${scrollSize - SCROLL_INSET}px`;
      el.style.height = `${scrollSize - SCROLL_INSET}px`;
    });
    this.initVerticalTrack();
    this.initVerticalThumb();
    this.initVerticalButton();
  }
  /**
   * 세로 스크롤 계산
   * @returns
   */
  calculate() {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;
    if (!scroll.enabledVertical) {
      this.setVerticalPosition(scroll, 0);
      return;
    }
    const dimensions = cfg.dimensions;
    this.gridMain.options();
    const arrowButtonSize = cfg.scrollbarSize * 2;
    const rowHeight = cfg.rowHeight;
    const totalRows = cfg.dataInfo.rowLength;
    const verticalHeight = dimensions.mainHeight - (scroll.enabledHorizontal ? cfg.scrollbarSize : 0);
    const vHeight = verticalHeight - 2;
    const vTrackHeight = vHeight - arrowButtonSize;
    const totalScrollableRows = Math.max(0, totalRows - scroll.insideViewRow);
    const totalRowHeight = rowHeight * totalRows;
    let thumbHeight = 0;
    if (vTrackHeight >= SCROLL_THUMB_MIN_SIZE && totalRowHeight > 0) {
      thumbHeight = vTrackHeight * (dimensions.mainBodyHeight / totalRowHeight);
      thumbHeight = Math.max(SCROLL_THUMB_MIN_SIZE, Math.min(thumbHeight, vTrackHeight));
    }
    if (totalScrollableRows > 0) {
      scroll.oneRowMove = (vTrackHeight - thumbHeight) / totalScrollableRows;
    } else {
      scroll.oneRowMove = 0;
    }
    scroll.vHeight = vHeight;
    scroll.vTrackHeight = vTrackHeight;
    scroll.vThumbHeight = thumbHeight;
    this.verticalElement.css({ height: `${vHeight}px` });
    this.verticalThumbElement.css({ height: `${thumbHeight}px` });
    if (totalScrollableRows === 0) {
      this.setVerticalPosition(scroll, 0);
      return;
    }
    const maxStartIdx = totalScrollableRows;
    const startIdx = Math.min(Math.max(0, scroll.startIdx), maxStartIdx);
    this.setVerticalPosition(scroll, startIdx * scroll.oneRowMove);
  }
  /**
   * init vertical track event
   *
   * @private
   */
  initVerticalTrack() {
    const scrollOpts = this.scrollOpts;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    let bgMoveMode = 0;
    let upFlag = false;
    let oneRowMove = 0;
    let bgMoveRow = 0;
    let startEventY = 0;
    let verticalScrollTimer;
    const verticalTrackElement = this.verticalTrackElement.getElement();
    eventManager.off(verticalTrackElement, "mousedown touchstart mouseup touchend mouseleave");
    eventManager.on(
      { el: verticalTrackElement, type: "mousedown touchstart" },
      (e) => {
        if (!isClickEvent(e)) {
          return;
        }
        this.gridMain.hideLayer();
        bgMoveMode = 1;
        startEventY = eventPosition(e).clientY - verticalTrackElement.getBoundingClientRect().top;
        oneRowMove = cfg.scroll.oneRowMove;
        bgMoveRow = oneRowMove * scrollOpts.vertical.speed * 5;
        upFlag = startEventY < cfg.scroll.top;
        const vthumHeightHalf = cfg.scroll.vThumbHeight / 2;
        verticalScrollTimer = setInterval(() => {
          bgMoveMode = 2;
          this.moveVerticalScroll({
            position: this.getVerticalBgMovePostion(
              cfg,
              startEventY - (upFlag ? vthumHeightHalf : 0),
              oneRowMove,
              upFlag,
              bgMoveRow
            )
          });
        }, 100);
      },
      { passive: false }
    );
    eventManager.on({ el: verticalTrackElement, type: "mouseup touchend mouseleave" }, (e) => {
      if (bgMoveMode == 0) return;
      clearInterval(verticalScrollTimer);
      stopPreventCancel(e);
      if (bgMoveMode == 1) {
        this.moveVerticalScroll({
          position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow)
        });
      }
      bgMoveMode = 0;
    });
  }
  initVerticalButton() {
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    let scrollBtnTimer;
    const vBtnDelay = 100;
    const scrollButtonElements = this.verticalElement.finds(".dg-scroll-button");
    let buttonMoveMode = 0;
    eventManager.off(scrollButtonElements, "mousedown touchstart mouseup touchend mouseleave");
    eventManager.on(
      { el: scrollButtonElements, type: "mousedown touchstart" },
      (e) => {
        const mode = eqAttributeValue(e.currentTarget, "data-dg-mode", "up");
        this.gridMain.hideLayer();
        buttonMoveMode = 1;
        scrollBtnTimer = setInterval(() => {
          buttonMoveMode = 2;
          this.moveVerticalScroll({ direction: mode ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN });
        }, vBtnDelay);
      },
      { passive: false }
    );
    eventManager.on({ el: scrollButtonElements, type: "mouseup touchend mouseleave" }, (e) => {
      if (buttonMoveMode == 1) {
        const mode = eqAttributeValue(e.currentTarget, "data-dg-mode", "up");
        this.moveVerticalScroll({ direction: mode ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN });
      }
      clearInterval(scrollBtnTimer);
      buttonMoveMode = 0;
    });
  }
  initVerticalThumb() {
    const scrollOpts = this.scrollOpts;
    const cfg = this.gridMain.config();
    const tooltipFlag = scrollOpts.vertical.enabledTooltip;
    const tooltipEle = this.verticalElement.findDaraElement(".dg-vscroll-bar-tip");
    const verticalThumbElement = this.verticalThumbElement;
    let dragging = false;
    let lastY = 0;
    let animationFrameId = null;
    let initialTop = 0;
    let startY = 0;
    const onMove = (e) => {
      if (!dragging) return;
      lastY = eventPosition(e).y;
    };
    const onEnd = (e) => {
      if (!dragging) return;
      dragging = false;
      verticalThumbElement.removeClass("active");
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      const endY = eventPosition(e).y;
      this.moveVerticalScroll({ position: initialTop + (endY - startY) });
      cfg.eventManager.off(document, "touchmove mousemove touchcancel touchend mouseup");
      if (tooltipFlag) {
        tooltipEle.hide();
      }
    };
    const loop = () => {
      if (!dragging) return;
      const delta = lastY - startY;
      this.moveVerticalScroll({ position: initialTop + delta });
      if (tooltipFlag) {
        tooltipEle.text(cfg.scroll.viewRow + 1);
        tooltipEle.show();
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    const orginVerticalThumbElement = this.verticalThumbElement.getElement();
    cfg.eventManager.off(orginVerticalThumbElement, "mousedown touchstart");
    cfg.eventManager.on(
      { el: orginVerticalThumbElement, type: "mousedown touchstart" },
      (e) => {
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);
        this.gridMain.hideLayer();
        dragging = true;
        initialTop = cfg.scroll.top;
        startY = eventPosition(e).y;
        lastY = startY;
        verticalThumbElement.addClass("active");
        cfg.eventManager.on({ el: document, type: "touchmove mousemove" }, onMove);
        cfg.eventManager.on({ el: document, type: "touchend touchcancel mouseup" }, onEnd);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(loop);
        return true;
      },
      { passive: false }
    );
  }
  /**
   *
   * @param cfg 설정 정보
   * @param startEventY start event y
   * @param oneRowMove row move value
   * @param upFlag up down flag up = true
   * @param bgMoveRow
   * @returns
   */
  getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow) {
    const scroll = cfg.scroll;
    let scrollTop = scroll.top + (upFlag ? -1 : 1) * bgMoveRow;
    if (upFlag) {
      if (scrollTop < 0) {
        scrollTop = startEventY - scroll.vThumbHeight;
      } else if (startEventY >= scrollTop) {
        scrollTop = startEventY - oneRowMove * 2;
      }
    } else if (startEventY <= scrollTop + scroll.vThumbHeight) {
      scrollTop = startEventY - scroll.vThumbHeight + oneRowMove * 2;
    }
    return scrollTop;
  }
  /**
   * 세로 스크롤 이동.
   *
   * @param  moveObj.position {Integer} top position
   * @param  moveObj.direction {String} 'U' or 'D'
   * @param  moveObj.drawFlag {boolean} redraw flag
   * @param  moveObj.speed {Integer} row move count
   * @param  moveObj.rowIdx {Integer} move row idx
   */
  moveVerticalScroll(moveObj) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;
    if (!scroll.enabledVertical) {
      scroll.startIdx = 0;
      return;
    }
    let topVal = 0;
    if (isNumber(moveObj.position)) {
      topVal = moveObj.position;
    } else if (isNumber(moveObj.rowIdx)) {
      topVal = moveObj.rowIdx * scroll.oneRowMove;
    } else if (isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      topVal = scroll.top + (moveObj.direction == ScrollDirectionYMap.UP ? -1 : 1) * speed * scroll.oneRowMove;
    }
    this.moveVerticalScrollPosition(topVal, moveObj.drawFlag);
  }
  /**
   *세로 스크롤 위치 이동.
   */
  moveVerticalScrollPosition(topVal, drawFlag = true, updateChkFlag) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;
    const maxTop = Math.max(0, scroll.vTrackHeight - scroll.vThumbHeight);
    if (topVal > maxTop) {
      topVal = maxTop;
    } else if (topVal < 0) {
      topVal = 0;
    }
    if (scroll.top == topVal) {
      return;
    }
    if (updateChkFlag !== false) {
      const onUpdateFn = this.gridMain.options().scroll.vertical.onUpdate;
      if (drawFlag !== false && isFunction(onUpdateFn)) {
        if (onUpdateFn({ scrollTop: topVal, height: scroll.vTrackHeight }) === false) {
          return;
        }
      }
    }
    const beforeStartIdx = scroll.startIdx;
    this.setVerticalPosition(scroll, topVal);
    if (drawFlag === false || scroll.startIdx == beforeStartIdx) return;
    this.scheduleBodyDraw();
  }
  scheduleBodyDraw() {
    this.bodyDrawPending = true;
    if (this.bodyDrawAnimationId !== 0) {
      return;
    }
    this.bodyDrawAnimationId = requestAnimationFrame(() => {
      this.bodyDrawAnimationId = 0;
      if (!this.bodyDrawPending) {
        return;
      }
      this.bodyDrawPending = false;
      this.gridMain.getBody().dataDraw("vscroll");
    });
  }
  destroy() {
    if (this.bodyDrawAnimationId !== 0) cancelAnimationFrame(this.bodyDrawAnimationId);
    this.bodyDrawAnimationId = 0;
    this.bodyDrawPending = false;
  }
  /**
   * 세로 스크롤 위치 설정
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} topVal 스크롤 바 포지션
   */
  setVerticalPosition(scroll, topVal) {
    if (topVal < 0) {
      topVal = 0;
    }
    if (scroll.top === topVal) {
      return;
    }
    scroll.top = topVal;
    const roundedTop = Math.round(topVal);
    if (this.lastThumbTop !== roundedTop) {
      this.lastThumbTop = roundedTop;
      this.verticalThumbElement.css({ top: topVal + "px" });
    }
    let startIdx = 0;
    if (scroll.oneRowMove > 0 && topVal > 0) {
      startIdx = Math.round(topVal / scroll.oneRowMove);
    }
    const totalRows = this.gridMain.config().dataInfo.rowLength;
    const maxStartIdx = Math.max(0, totalRows - scroll.insideViewRow);
    scroll.before.startIdx = scroll.startIdx;
    scroll.startIdx = Math.min(startIdx, maxStartIdx);
  }
}
const _Scroll = class _Scroll {
  constructor(gridMain) {
    this.wheelAnimationId = 0;
    this.pendingVerticalDelta = 0;
    this.pendingHorizontalDelta = 0;
    this.verticalWheelDirection = null;
    this.horizontalWheelDirection = null;
    this.verticalDirectionChanged = false;
    this.horizontalDirectionChanged = false;
    this.gridMain = gridMain;
    this.opts = this.gridMain.options();
    this.horizontalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-horizontal");
    this.verticalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-vertical");
  }
  destroy() {
    var _a;
    if (this.wheelAnimationId !== 0) cancelAnimationFrame(this.wheelAnimationId);
    this.wheelAnimationId = 0;
    this.pendingVerticalDelta = 0;
    this.pendingHorizontalDelta = 0;
    (_a = this.verticalScroll) == null ? void 0 : _a.destroy();
  }
  /**
   * 스크롤을 초기화한다.
   */
  init() {
    this.verticalScroll = new VerticalScroll(this.gridMain, this, this.verticalElement);
    this.horizontalScroll = new HorizontalScroll(this.gridMain, this, this.horizontalElement);
    const scrollbarSize = this.gridMain.config().scrollbarSize;
    const edge = this.gridMain.getMainElement().findDaraElement(".dg-scroll-corner");
    edge.css({ width: `${scrollbarSize}px`, height: `${scrollbarSize}px` });
    this.calculate();
    this.initMouseWheel();
    if (!this.gridMain.config().disableVerticalScroll) {
      this.verticalScroll.init();
    }
    this.horizontalScroll.init();
  }
  /**
   * 스크롤 크기와 위치를 계산한다.
   */
  calculate() {
    this.horizontalScroll.calculate();
    this.verticalScroll.calculate();
  }
  /**
   * 마우스 휠 이벤트를 초기화한다.
   */
  initMouseWheel() {
    const { scroll, eventManager } = this.gridMain.config();
    const mainElement = this.gridMain.getMainElement().getElement();
    const disableVerticalScroll = this.gridMain.config().disableVerticalScroll;
    eventManager.off(mainElement, "wheel DOMMouseScroll");
    eventManager.on(
      {
        el: mainElement,
        type: "wheel DOMMouseScroll"
      },
      (evt) => {
        const delta = this.normalizeWheelDelta(evt);
        if (delta === 0) {
          return;
        }
        const isHorizontal = scroll.enabledHorizontal && isShiftKey(evt);
        if (!disableVerticalScroll && this.opts.scroll.enabledWheelInContainer) {
          stopPreventCancel(evt);
        }
        if (!this.canScroll(scroll, delta, isHorizontal, disableVerticalScroll)) {
          return;
        }
        stopPreventCancel(evt);
        if (isHorizontal) {
          this.addHorizontalWheel(delta);
        } else {
          this.addVerticalWheel(delta);
        }
        this.requestWheelAnimation();
      },
      { passive: false }
    );
  }
  /**
   * 현재 wheel 방향으로 스크롤할 수 있는지 확인한다.
   */
  canScroll(scroll, delta, isHorizontal, disableVerticalScroll) {
    if (isHorizontal) {
      const maxLeft = scroll.hTrackWidth - scroll.hThumbWidth;
      if (delta < 0) {
        return scroll.left > 0;
      }
      return scroll.left < maxLeft;
    }
    if (disableVerticalScroll) {
      return false;
    }
    const rowLength = this.gridMain.config().dataInfo.rowLength;
    if (delta < 0) {
      return scroll.startIdx > 0;
    }
    return scroll.startIdx + scroll.insideViewRow < rowLength;
  }
  /**
   * 세로 wheel delta를 누적한다.
   */
  addVerticalWheel(delta) {
    const direction = delta < 0 ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN;
    if (this.verticalWheelDirection !== null && this.verticalWheelDirection !== direction) {
      this.pendingVerticalDelta = delta;
      this.verticalDirectionChanged = true;
    } else {
      this.pendingVerticalDelta += delta;
    }
    this.verticalWheelDirection = direction;
  }
  /**
   * 가로 wheel delta를 누적한다.
   */
  addHorizontalWheel(delta) {
    const direction = delta < 0 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT;
    if (this.horizontalWheelDirection !== null && this.horizontalWheelDirection !== direction) {
      this.pendingHorizontalDelta = delta;
      this.horizontalDirectionChanged = true;
    } else {
      this.pendingHorizontalDelta += delta;
    }
    this.horizontalWheelDirection = direction;
  }
  /**
   * wheel animation frame을 예약한다.
   */
  requestWheelAnimation() {
    if (this.wheelAnimationId !== 0) {
      return;
    }
    this.wheelAnimationId = requestAnimationFrame(() => {
      this.wheelAnimationId = 0;
      this.processWheel();
      if (this.hasPendingWheel()) {
        this.requestWheelAnimation();
      }
    });
  }
  /**
   * 누적된 vertical/horizontal wheel을 처리한다.
   */
  processWheel() {
    if (this.pendingVerticalDelta !== 0) {
      this.processVerticalWheel();
    }
    if (this.pendingHorizontalDelta !== 0) {
      this.processHorizontalWheel();
    }
  }
  /**
   * 지정된 방향으로 세로 스크롤 이동이 가능한지 확인합니다.
   *
   * @param direction - 세로 스크롤 이동 방향
   * @param scroll - 현재 스크롤 위치 및 표시 영역 정보
   * @param rowLength - 전체 행의 개수
   * @returns 해당 방향으로 이동할 수 있으면 true, 그렇지 않으면 false
   */
  canMoveVertical(direction, scroll, rowLength) {
    return direction === ScrollDirectionYMap.UP ? scroll.startIdx > 0 : scroll.startIdx + scroll.insideViewRow < rowLength;
  }
  /**
   * 누적된 세로 wheel을 처리한다.
   */
  processVerticalWheel() {
    const { scroll, dataInfo } = this.gridMain.config();
    if (this.pendingVerticalDelta === 0 || this.verticalWheelDirection === null) {
      return;
    }
    const direction = this.verticalWheelDirection;
    const rowLength = dataInfo.rowLength;
    const canMove = this.canMoveVertical(direction, scroll, rowLength);
    if (!canMove) {
      this.clearVerticalWheel();
      return;
    }
    const ticks = this.getWheelTicks(this.pendingVerticalDelta, this.verticalDirectionChanged);
    if (ticks <= 0) {
      return;
    }
    const speed = this.getVerticalWheelSpeed();
    this.moveVerticalScroll({
      direction,
      speed: speed * ticks
    });
    this.consumeVerticalDelta(ticks);
    this.verticalDirectionChanged = false;
    const nextCanMove = this.canMoveVertical(direction, scroll, rowLength);
    if (!nextCanMove) {
      this.clearVerticalWheel();
    }
  }
  canMoveHorizontal(direction, scroll, maxLeft) {
    return direction === ScrollDirectionXMap.LEFT ? scroll.left > 0 : scroll.left < maxLeft;
  }
  /**
   * 누적된 가로 wheel을 처리한다.
   */
  processHorizontalWheel() {
    const { scroll } = this.gridMain.config();
    if (this.pendingHorizontalDelta === 0 || this.horizontalWheelDirection === null) {
      return;
    }
    const direction = this.horizontalWheelDirection;
    const maxLeft = scroll.hTrackWidth - scroll.hThumbWidth;
    const canMove = this.canMoveHorizontal(direction, scroll, maxLeft);
    if (!canMove) {
      this.clearHorizontalWheel();
      return;
    }
    const ticks = this.getWheelTicks(this.pendingHorizontalDelta, this.horizontalDirectionChanged);
    if (ticks <= 0) {
      return;
    }
    const speed = this.getHorizontalWheelSpeed();
    this.moveHorizontalScroll({
      direction,
      speed: speed * ticks
    });
    this.consumeHorizontalDelta(ticks);
    this.horizontalDirectionChanged = false;
    const nextCanMove = this.canMoveHorizontal(direction, scroll, maxLeft);
    if (!nextCanMove) {
      this.clearHorizontalWheel();
    }
  }
  /**
   * wheel delta를 tick으로 변환한다.
   */
  getWheelTicks(delta, directionChanged) {
    const ticks = Math.floor(Math.abs(delta) / _Scroll.WHEEL_TICK);
    if (ticks > 0) {
      return Math.min(ticks, _Scroll.MAX_TICKS_PER_FRAME);
    }
    if (directionChanged) {
      return 1;
    }
    return 0;
  }
  /**
   * 세로 wheel의 row 이동 속도를 반환한다.
   */
  getVerticalWheelSpeed() {
    const speed = this.opts.scroll.vertical.speed;
    return speed > 0 ? speed : _Scroll.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 가로 wheel의 이동 속도를 반환한다.
   */
  getHorizontalWheelSpeed() {
    const speed = this.opts.scroll.horizontal.speed;
    return speed > 0 ? speed : _Scroll.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 처리한 세로 wheel delta를 소비한다.
   */
  consumeVerticalDelta(ticks) {
    const consumed = ticks * _Scroll.WHEEL_TICK;
    if (this.pendingVerticalDelta < 0) {
      this.pendingVerticalDelta += consumed;
    } else {
      this.pendingVerticalDelta -= consumed;
    }
    if (Math.abs(this.pendingVerticalDelta) < _Scroll.WHEEL_TICK) {
      this.pendingVerticalDelta = 0;
    }
  }
  /**
   * 처리한 가로 wheel delta를 소비한다.
   */
  consumeHorizontalDelta(ticks) {
    const consumed = ticks * _Scroll.WHEEL_TICK;
    if (this.pendingHorizontalDelta < 0) {
      this.pendingHorizontalDelta += consumed;
    } else {
      this.pendingHorizontalDelta -= consumed;
    }
    if (Math.abs(this.pendingHorizontalDelta) < _Scroll.WHEEL_TICK) {
      this.pendingHorizontalDelta = 0;
    }
  }
  /**
   * 세로 wheel 상태를 초기화한다.
   */
  clearVerticalWheel() {
    this.pendingVerticalDelta = 0;
    this.verticalWheelDirection = null;
    this.verticalDirectionChanged = false;
  }
  /**
   * 가로 wheel 상태를 초기화한다.
   */
  clearHorizontalWheel() {
    this.pendingHorizontalDelta = 0;
    this.horizontalWheelDirection = null;
    this.horizontalDirectionChanged = false;
  }
  /**
   * 처리할 wheel이 남아있는지 확인한다.
   */
  hasPendingWheel() {
    return Math.abs(this.pendingVerticalDelta) >= _Scroll.WHEEL_TICK || Math.abs(this.pendingHorizontalDelta) >= _Scroll.WHEEL_TICK || this.verticalDirectionChanged || this.horizontalDirectionChanged;
  }
  /**
   * 브라우저별 wheel delta를 동일한 기준으로 변환한다.
   */
  normalizeWheelDelta(evt) {
    let delta = evt.deltaY;
    if (!Number.isFinite(delta) || delta === 0) {
      return 0;
    }
    if (evt.deltaMode === 1) {
      delta *= 16;
    } else if (evt.deltaMode === 2) {
      delta *= this.gridMain.config().dimensions.mainHeight;
    }
    return delta;
  }
  /**
   * 세로 스크롤을 이동한다.
   */
  moveVerticalScroll(moveObj) {
    this.verticalScroll.moveVerticalScroll(moveObj);
  }
  /**
   * 가로 스크롤을 이동한다.
   */
  moveHorizontalScroll(moveObj) {
    this.horizontalScroll.moveHorizontalScroll(moveObj);
  }
};
_Scroll.WHEEL_TICK = 100;
_Scroll.DEFAULT_WHEEL_SPEED = 3;
_Scroll.MAX_TICKS_PER_FRAME = 2;
let Scroll = _Scroll;
function calcSummary(items, mode, itemKey) {
  if (mode !== "min" && mode !== "max" && mode !== "sum" && mode !== "average") {
    return `${mode} not valid`;
  }
  let count = 0;
  let result = mode === "min" ? Infinity : mode === "max" ? -Infinity : 0;
  const total = items.length;
  for (let start = 0; start < total; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE, total);
    const chunk = items.slice(start, end);
    for (let i = 0; i < chunk.length; i++) {
      const val = chunk[i][itemKey];
      if (typeof val !== "number") continue;
      switch (mode) {
        case "min":
          if (val < result) result = val;
          break;
        case "max":
          if (val > result) result = val;
          break;
        default:
          result += val;
          break;
      }
      count++;
    }
  }
  if (count === 0) return "not valid";
  return mode === "average" ? result / count : result;
}
class SummaryRenderer {
  constructor(field, gridMain, summaryItem) {
    this.isClick = false;
    this.cellClassNameCache = /* @__PURE__ */ new WeakMap();
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
    this.cfg = this.gridMain.config();
    this.isVauleFunction = isFunction(field.getValue);
    this.hasCellClassName = !!summaryItem.cellClassName;
    this.summaryItem = summaryItem;
  }
  getCol() {
    return this.field.$colSeq;
  }
  getFieldInfo() {
    return this.field;
  }
  getSummaryItem() {
    return this.summaryItem;
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue() {
    var _a;
    const summaryItem = this.summaryItem;
    const displayFormat = summaryItem.displayFormat ?? ((_a = this.field) == null ? void 0 : _a.displayFormat);
    const dataManager = this.cfg.dataManager;
    const items = dataManager.getAllRowItems();
    const expression = summaryItem.expression;
    const summaryValue = { formatValue: "" };
    if (items.length > 0) {
      if (expression) {
        if (isFunction(expression)) {
          summaryValue.value = expression(items);
        } else if (expression === "count") {
          summaryValue.value = items.length || 0;
        } else {
          summaryValue.value = calcSummary(items, expression, summaryItem.name);
        }
        summaryValue.formatValue = summaryValue.value;
        if (displayFormat) {
          summaryValue.formatValue = formatValue(summaryValue.value, displayFormat);
        }
      } else if (summaryItem.label) {
        summaryValue.formatValue = summaryItem.label;
      }
    }
    return summaryValue;
  }
  setCellClassName(renderValue, element) {
    if (!this.hasCellClassName) return;
    const prev = this.cellClassNameCache.get(element);
    const classNames = resolveClassName(this.summaryItem.cellClassName, renderValue);
    if (prev == null ? void 0 : prev.length) {
      element.classList.remove(...prev);
    }
    if (classNames.length > 0) {
      element.classList.add(...classNames);
      this.cellClassNameCache.set(element, classNames);
    } else {
      this.cellClassNameCache.delete(element);
    }
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return TEXT_ALIGN_STYLE.right;
  }
}
class SummaryTextRenderer extends SummaryRenderer {
  constructor(field, gridMain, summaryItem) {
    super(field, gridMain, summaryItem);
  }
  render(cellInfo, element) {
    const summaryValue = this.getValue();
    this.setCellClassName(summaryValue.value, element);
    const renderElement = element.firstElementChild;
    const formatValue2 = summaryValue.formatValue;
    if (renderElement.textContent !== formatValue2) {
      renderElement.textContent = formatValue2;
    }
    renderElement.classList.remove("single-line", "multi-line");
    if (isString(formatValue2) && formatValue2.includes("\n")) {
      renderElement.classList.add("multi-line");
    } else {
      renderElement.classList.add("single-line");
    }
  }
}
class Summary {
  constructor(gridMain) {
    var _a;
    this.gridMain = gridMain;
    this.cfg = gridMain.config();
    const opts = gridMain.options();
    const summaryItems = ((_a = opts.summary) == null ? void 0 : _a.items) ?? [];
    this._isActive = (summaryItems == null ? void 0 : summaryItems.length) > 0;
    if (!this._isActive) {
      return;
    }
    this.summaryOpts = opts.summary ?? {};
  }
  init() {
    this.summaryElement = this.gridMain.element().findDaraElement(".dg-summary");
    if (!this._isActive) {
      this.summaryElement.getElement().remove();
      return;
    }
    this.initRenderer();
    this.createTemplate();
    this.drawData();
  }
  initRenderer() {
    const allSummaryRenders = [];
    const allFieldMap = this.cfg.allFieldMap;
    for (const items of this.summaryOpts.items) {
      const summaryRenders = [];
      for (const item of items) {
        const fieldName = item.name;
        const fieldInfo = allFieldMap.get(fieldName) ?? merge({}, item);
        item.$alignStyle = TEXT_ALIGN_STYLE[item.align] ?? (fieldInfo.$alignStyle || TEXT_ALIGN_STYLE.left);
        summaryRenders.push(new SummaryTextRenderer(fieldInfo, this.gridMain, item));
      }
      allSummaryRenders.push(summaryRenders);
    }
    this.allSummaryRenders = allSummaryRenders;
  }
  isEnabled() {
    return this._isActive;
  }
  getElement() {
    return this.summaryElement;
  }
  setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth) {
    if (!this.isEnabled()) return;
    this.leftElement.css({ width: mainLeftWidth + "px" });
    this.centerElement.css({ "margin-left": mainLeftWidth + "px", width: mainCenterWidth + "px" });
    this.rightElement.css({ width: mainRightWidth + "px" });
  }
  setCenterElementStyle(styleCss) {
    if (!this.isEnabled()) return;
    this.centerElement.css(styleCss);
  }
  drawData() {
    if (!this.isEnabled()) return;
    const summaryItems = this.allSummaryRenders;
    const summaryElement = this.summaryElement;
    for (let rowIdx = 0; rowIdx < summaryItems.length; rowIdx++) {
      for (const renderer of summaryItems[rowIdx]) {
        const col = renderer.getCol();
        if (col) {
          const cellElement = summaryElement.find(`[data-cell-position="${rowIdx},${col}"]`);
          if (cellElement.firstElementChild) {
            const cellInfo = {
              r: rowIdx,
              c: col
            };
            renderer.render(cellInfo, cellElement);
          }
        }
      }
    }
  }
  createTemplate() {
    const cfg = this.cfg;
    const summaryElement = this.summaryElement;
    summaryElement.css({ height: `${cfg.dimensions.mainSummaryHeight}px` });
    if (this.summaryOpts.position === "top") {
      summaryElement.addClass("dg-top");
      const container = this.gridMain.element().find(".dg-panels");
      container == null ? void 0 : container.insertBefore(summaryElement.getElement(), container.querySelector(".dg-body"));
    }
    this.leftElement = summaryElement.findDaraElement('.dg-region[data-region="left"]');
    this.centerElement = summaryElement.findDaraElement('.dg-region[data-region="center"]');
    this.rightElement = summaryElement.findDaraElement('.dg-region[data-region="right"]');
    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
    const { fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, summary } = cfg;
    const leftFields = fieldHeaderGroup.leafLeft;
    const centerFields = fieldHeaderGroup.leafCenter;
    const rightFields = fieldHeaderGroup.leafRight;
    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: "center", fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: "right", fields: rightFields, element: this.rightElement, startCol: fixedRightIndex }
    ];
    fieldGroups.forEach(({ fields, element, startCol }) => {
      if (fields.length === 0) return;
      element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(summary, fields, startCol));
    });
  }
  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(type) {
    const cfg = this.gridMain.config();
    let leafFields;
    let startGroupIdx = 0;
    if (type == "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }
    const colGroupHtm = [];
    let colGroupIdx = startGroupIdx;
    for (const leafNode of leafFields) {
      const nodeWidth = leafNode.$width;
      colGroupHtm.push(
        `<th data-col-idx="${colGroupIdx++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${nodeWidth}px;"></th>`
      );
    }
    return html`<table class="dg-body-table">
        <thead>
          <tr>
            ${colGroupHtm.join("")}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      ${type == "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
  /**
   * row template
   *
   * @private
   * @param {number} rowIdx row index
   * @param {number} rowHeight row height
   * @param {FieldItem[]} fields fields 정보
   * @returns {string} template
   */
  rowTemplate(summaryConfig, fields, startCol) {
    const returnTemplate = [];
    const rowHeights = summaryConfig.heights;
    const allSummaryRenders = this.allSummaryRenders;
    const rowCount = allSummaryRenders.length;
    const rowspan = {};
    for (let i = 0; i < rowCount; i++) {
      const rowIdx = i;
      const rendererItems = allSummaryRenders[i];
      const cellTemplate = [];
      let colspan = 0;
      const rowHeight = rowHeights[i];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        const rendererItem = rendererItems.find((renderer) => renderer.getFieldInfo().name === field.name);
        if (rendererItem) {
          field = rendererItem.getSummaryItem();
        }
        if (colspan > 0) {
          --colspan;
          continue;
        }
        if (rowspan[j] > 0) {
          rowspan[j] = rowspan[j] - 1;
          continue;
        }
        const spanAttr = [];
        if (field.colspan) {
          colspan = field.colspan - 1;
          spanAttr.push(` colspan="${field.colspan}" scope="colgroup" `);
        }
        if (field.rowspan) {
          rowspan[j] = field.rowspan - 1;
          spanAttr.push(` rowspan="${field.rowspan}" `);
        }
        if (field.$isAside) {
          cellTemplate.push(html`<td
            scope="col"
            class="dg-cell dg-aside"
            ${spanAttr.join("")}
            data-cell-position="${rowIdx},${startCol + j}"
          >
            <div role="presentation" class="dg-cell-renderer ${field.$alignStyle}"></div>
          </td>`);
        } else {
          const { style: whiteSpaceStyle, className: whiteSpaceClass } = getWhiteSpaceInfo(field);
          cellTemplate.push(html`<td
            scope="col"
            class="dg-cell"
            ${spanAttr.join(" ")}
            data-cell-position="${rowIdx},${startCol + j}"
          >
            <div
              role="presentation"
              style="height:${rowHeight - 2}px;max-height:${rowHeight - 2}px;${whiteSpaceStyle}"
              class="dg-cell-renderer dg-ellipsis 
              dg-text ${field.$alignStyle} ${whiteSpaceClass}"
            ></div>
          </td>`);
        }
      }
      returnTemplate.push(html`<tr class="dg-row" data-row="${rowIdx}" style="height:${rowHeight}px">
        ${cellTemplate.join("")}
      </tr>`);
    }
    return returnTemplate.join("");
  }
}
class DataSearch {
  constructor(gridMain) {
    this.allFieldNames = [];
    this.cfg = gridMain.config();
    this.searchOpts = gridMain.options().search;
    this.gridMain = gridMain;
    const searchOpts = this.searchOpts;
    const allFieldNames = [];
    for (const field of this.cfg.currentFields) {
      if (!field.$isAside) allFieldNames.push(field.name);
    }
    this.allFieldNames = allFieldNames;
    this.defaultSearchOpts = merge(
      {
        matchCase: false,
        matchWholeWord: false,
        useRegex: false,
        searchFields: ALL_SELECT_VALUE,
        matchWholeRegex: MATCH_WHOLE_REGEX,
        hideNonMatched: false,
        direction: SearchDirectionMap.NEXT
      },
      {
        matchWholeRegex: searchOpts.matchWholeRegex ?? false,
        hideNonMatched: searchOpts.hideNonMatched ?? false
      }
    );
  }
}
class ApiDataSearch extends DataSearch {
  constructor(gridMain) {
    super(gridMain);
  }
  openSearch() {
    return true;
  }
  search(searchText, opts) {
    const cfg = this.gridMain.config();
    const options = merge({}, this.defaultSearchOpts, opts);
    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.allFieldNames;
    }
    if (searchText == "") {
      cfg.searchEnabled = false;
      this.setMatchCountText(true);
      this.gridMain.getBody().clearSearchHighlight();
    } else {
      cfg.searchEnabled = true;
    }
    cfg.dataManager.search(searchText, options);
    this.gridMain.refreshBody(true, "search");
    const searchMatchInfo = this.cfg.searchMatchInfo;
    return { count: searchMatchInfo.matchCount, matchIndex: searchMatchInfo.currentMatchIndex };
  }
  setMatchCountText(clear = false) {
    return;
  }
}
class SimpleDataSearch extends DataSearch {
  constructor(gridMain) {
    super(gridMain);
    this.createTemplate();
  }
  openSearch() {
    const gridMain = this.gridMain;
    const rendererContainer = gridMain.getRendererLayerElement();
    const searchElement = this.searchElement;
    const searchStyle = searchElement.style;
    const searchIconElement = gridMain.getHeader().getHeaderElement().find(".dg-search-icon");
    const openPosition = innerLayerPosition(rendererContainer, searchIconElement, searchElement);
    searchStyle.top = `${openPosition.top - 5}px`;
    searchStyle.left = `${openPosition.left + 12}px`;
    gridMain.openLayer(searchElement);
    this.searchTextElement.focus();
    return true;
  }
  createTemplate() {
    const searchOpts = this.searchOpts;
    if (searchOpts.mode != "full") {
      this.simpleTemplate();
    }
  }
  /**
   * simple search template
   *
   * @private
   */
  simpleTemplate() {
    const gridMain = this.gridMain;
    const rendererContainer = gridMain.getRendererLayerElement();
    const fields = this.cfg.currentFields;
    let searchElement = this.searchElement;
    if (!searchElement) {
      const template = [];
      searchElement = getLayerElement("div", "dg-search-simple", "help-tooltip");
      template.push(
        `<select class="dg-search-field"><option value="${ALL_SELECT_VALUE}">${gridMain.i18n().getMessage("all")}</option>`
      );
      for (const field of fields) {
        if (field.$isAside) continue;
        template.push(`<option value="${field.name}">${field.label}</option>`);
      }
      template.push("</select>");
      template.push(html`<div class="dg-search-container">
          <input type="text" class="dg-search-text" placeholder="Search" />
          <div class="dg-search-icons">
            <button class="dg-icon-button" type="button" data-search-type="mc" title="Match Case">Aa</button>
            <button class="dg-icon-button" type="button" data-search-type="mww" title="Match Whole Word">
              <span class="dg-whole-word-icon">ab</span>
            </button>
            <button class="dg-icon-button" type="button" data-search-type="regex" title="Use Regex">.*</button>
          </div>
        </div>
        <span class="dg-search-btn">
          <span class="dg-btn dg-search-prev" title="${gridMain.i18n().getMessage("prev")}"></span>
          <span class="dg-btn dg-search-next" title="${gridMain.i18n().getMessage("next")}"></span>
        </span>
        <span class="dgMatchCount"></span>`);
      searchElement.innerHTML = template.join("");
      rendererContainer.appendChild(searchElement);
      this.searchElement = searchElement;
    }
    this.searchTextElement = searchElement.querySelector(".dg-search-text");
    this.searchFieldElement = searchElement.querySelector(".dg-search-field");
    this.matchCountElement = searchElement.querySelector(".dgMatchCount");
    this.initSimpleModeEvent();
  }
  /**
   *  init simple search event
   */
  initSimpleModeEvent() {
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    const searchParameter = cfg.searchParameter;
    const searchTextElement = this.searchTextElement;
    eventManager.off(searchTextElement, "keydown");
    eventManager.on({ el: searchTextElement, type: "keydown" }, (e) => {
      e.stopPropagation();
      if (e.isComposing) return;
      if (isEnter(e)) {
        e.preventDefault();
        this.simpleSearch(SearchDirectionMap.NEXT);
      } else if (isEsc(e)) {
        this.gridMain.hideLayer(this.searchElement);
      }
    });
    const searchPrevBtnElement = this.searchElement.querySelector(".dg-search-prev");
    eventManager.off(searchPrevBtnElement, "pointerdown");
    eventManager.on({ el: searchPrevBtnElement, type: "pointerdown" }, (e) => {
      stopPreventCancel(e);
      this.simpleSearch(SearchDirectionMap.PREV);
    });
    const searchNextBtnElement = this.searchElement.querySelector(".dg-search-next");
    eventManager.off(searchNextBtnElement, "pointerdown");
    eventManager.on({ el: searchNextBtnElement, type: "pointerdown" }, (e) => {
      stopPreventCancel(e);
      this.simpleSearch(SearchDirectionMap.NEXT);
    });
    const searchIconElement = this.searchElement.querySelectorAll(".dg-icon-button");
    eventManager.off(searchIconElement, "pointerdown");
    eventManager.on({ el: searchIconElement, type: "pointerdown" }, (e) => {
      stopPreventCancel(e);
      const evtElement = e.currentTarget;
      const dataSearchType = evtElement.dataset.searchType;
      const activeFlag = !hasClass(evtElement, "on");
      if (dataSearchType == "mc") {
        searchParameter.matchCase = activeFlag;
      } else if (dataSearchType == "mww") {
        searchParameter.matchWholeWord = activeFlag;
      } else if (dataSearchType == "regex") {
        searchParameter.useRegex = activeFlag;
      }
      toggleClass(evtElement, "on");
    });
  }
  search(searchText, opts) {
    const cfg = this.gridMain.config();
    const options = merge({}, this.defaultSearchOpts, opts);
    if (options.searchFields == ALL_SELECT_VALUE) {
      options.searchFields = this.allFieldNames;
    }
    this.searchTextElement.value = searchText;
    if (searchText == "") {
      cfg.searchEnabled = false;
      this.setMatchCountText(true);
      this.gridMain.getBody().clearSearchHighlight();
    } else {
      cfg.searchEnabled = true;
    }
    cfg.dataManager.search(searchText, options);
    this.gridMain.refreshBody(true, "search");
    this.gridMain.getHeader().setSearchIcon(cfg.searchEnabled);
    const searchMatchInfo = this.cfg.searchMatchInfo;
    return { count: searchMatchInfo.matchCount, matchIndex: searchMatchInfo.currentMatchIndex };
  }
  simpleSearch(direction) {
    const searchText = this.searchTextElement.value;
    const searchField = this.searchFieldElement.value || ALL_SELECT_VALUE;
    const cfg = this.gridMain.config();
    const searchParameter = cfg.searchParameter;
    searchParameter.searchText = searchText;
    searchParameter.searchFields = searchField;
    this.search(searchText, {
      matchCase: searchParameter.matchCase,
      matchWholeWord: searchParameter.matchWholeWord,
      useRegex: searchParameter.useRegex,
      searchFields: searchField,
      direction
    });
  }
  setMatchCountText(clear = false) {
    if (clear) {
      this.matchCountElement.textContent = "";
      return;
    }
    const searchMatchInfo = this.cfg.searchMatchInfo;
    if (searchMatchInfo.matchCount > 0) {
      this.matchCountElement.textContent = searchMatchInfo.currentMatchIndex + "/" + searchMatchInfo.matchCount;
    } else {
      this.matchCountElement.textContent = "0/0";
    }
  }
}
const SCROLL_MODE = ["none", "horizontal", "vertical", "both"];
let DARA_GRID_SEQ = 0;
let INIT_GRID_GLOBAL_EVNET = false;
const ALL_INSTANCE = /* @__PURE__ */ new Map();
const GRID_TEMPLATE = getGridTemplate();
class GridMain {
  constructor(grid, element, options, message2) {
    var _a, _b;
    this.openLayers = [];
    this.destroyed = false;
    const opts = initGridOptions(options);
    this.grid = grid;
    this.language = new Language();
    if (message2) this.language.setMessage(message2);
    this.cfg = initConfig(opts);
    if ((_a = opts.groupingFields) == null ? void 0 : _a.length) {
      this.cfg.dataManager = new GroupDataManager(opts, this);
    } else if (opts.tree) {
      this.cfg.dataManager = new TreeDataManager(opts, this);
    } else {
      this.cfg.dataManager = new ListDataManager(opts, this);
    }
    this.structureBuilder = new StructureBuilder(opts, this);
    this.opts = opts;
    const beforeUid = element.getAttribute(INSTANCE_ATTR_KEY);
    if (beforeUid && ALL_INSTANCE.get(beforeUid)) {
      (_b = ALL_INSTANCE.get(beforeUid)) == null ? void 0 : _b.destroy();
    }
    this.$instanceId = beforeUid ?? `${FIELD_PREFIX}${++DARA_GRID_SEQ}`;
    this.orginStyle = element.style.cssText;
    element.setAttribute(INSTANCE_ATTR_KEY, this.$instanceId);
    this.gridElement = new DaraElement(element);
    ALL_INSTANCE.set(this.$instanceId, this);
  }
  init() {
    const opts = this.opts;
    this.initGridSize = {
      height: opts.height == "auto" ? -1 : opts.height,
      width: opts.width == "auto" ? -1 : opts.width
    };
    this.initElement();
    this.calculation();
    this.initMainView();
    this.initEvent();
    this.initDocumentGlobalEvent();
  }
  /**
   * grid 전체 이벤트
   */
  initDocumentGlobalEvent() {
    if (INIT_GRID_GLOBAL_EVNET) return;
    INIT_GRID_GLOBAL_EVNET = true;
    document.addEventListener("pointerdown", (e) => {
      const path = e.composedPath();
      ALL_INSTANCE.forEach((grid, id) => {
        const gridElement = grid.gridElement.getElement();
        if (!path.includes(gridElement)) {
          grid.setGridFocusOut(e);
        }
      });
    });
  }
  static getInstance(eleOrId) {
    var _a;
    let id;
    if (isString(eleOrId)) {
      id = eleOrId;
    } else {
      id = eleOrId instanceof HTMLElement ? eleOrId == null ? void 0 : eleOrId.getAttribute(INSTANCE_ATTR_KEY) : "";
    }
    if (id) {
      return ((_a = ALL_INSTANCE.get(id)) == null ? void 0 : _a.grid) ?? null;
    }
    return null;
  }
  static allInstance() {
    return ALL_INSTANCE;
  }
  element() {
    return this.gridElement;
  }
  getGridKeyInputElement() {
    return this.gridKeyInput;
  }
  config() {
    return this.cfg;
  }
  options() {
    return this.opts;
  }
  i18n() {
    return this.language;
  }
  /**
   * init grid element
   */
  initElement() {
    const cfg = this.cfg;
    const opts = this.opts;
    const gridElement = GRID_TEMPLATE.content.firstElementChild.cloneNode(true);
    const emptyText = gridElement.querySelector(".empty-text");
    if (emptyText) {
      emptyText.textContent = this.i18n().getMessage("no.data");
    }
    this.gridElement.getElement().appendChild(gridElement);
    this.gridKeyInput = gridElement.querySelector(".dg-text-editor");
    this.gridKeyInput.id = "dg_text_" + this.$instanceId;
    if (this.cfg.disableVerticalScroll) {
      gridElement.classList.add("dg-auto-height");
    }
    this.layoutElement = new DaraElement(this.gridElement.find(".daracl-grid .dg-layout"));
    this.setGridStyle(this.opts.style);
    this.rendererLayerElement = this.gridElement.find(".dg-layers");
    this.mainElement = new DaraElement(this.gridElement.find(".dg-main"));
    const hoverClassName = opts.hoverMode ? HoverModeMap[opts.hoverMode] ?? HoverModeMap.cell : HoverModeMap.cell;
    this.mainElement.addClass(
      opts.selectionMode === "none" ? "dg-select" : "dg-noselect",
      "dg-body-hover-" + hoverClassName
    );
    this.setTheme(this.opts.theme);
    const style = window.getComputedStyle(this.mainElement.getElement());
    cfg.fontFamily = style.fontFamily;
    cfg.fontSize = style.fontSize;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = style.fontSize + " " + style.fontFamily;
    cfg.canvasContext = context;
  }
  /**
   * init main object viewer
   *
   * @private
   */
  initMainView() {
    const opts = this.opts;
    this.toolbar = new Toolbar(this);
    this.selectionInfo = new SelectionInfo(this, opts, this.cfg);
    this.header = new Header(this);
    this.body = new Body(this);
    this.summary = new Summary(this);
    if (opts.search.enabled) {
      this.dataSearch = new SimpleDataSearch(this);
    } else {
      this.dataSearch = new ApiDataSearch(this);
    }
    this.scroll = new Scroll(this);
    this.footer = new Footer(this);
    this.contextMenu = new ContextMenu(this);
    this.toolbar.init();
    this.selectionInfo.initSelection();
    this.body.init();
    this.summary.init();
    this.footer.init();
    this.scroll.init();
    this.contextMenu.init();
    this.refreshBody(true, "init");
  }
  getRendererLayerElement() {
    return this.rendererLayerElement;
  }
  uid() {
    return this.$instanceId;
  }
  /**
   * init event
   *
   * @public
   */
  initEvent() {
    const opts = this.opts;
    const cfg = this.cfg;
    if (opts.width === "auto" || opts.height === "auto") {
      this.initResizeEvent();
    }
    const rendererLayerElement = this.rendererLayerElement;
    cfg.eventManager.on({ el: this.mainElement.getElement(), type: "mousedown" }, (e) => {
      const path = e.composedPath();
      if (path.includes(rendererLayerElement)) {
        return;
      }
      e == null ? void 0 : e.preventDefault();
      this.setGridFocusIn(e);
    });
    const dgLayersElement = rendererLayerElement;
    const layerSelector = `[${LAYER_ATTR_NAME}]`;
    cfg.eventManager.off(dgLayersElement, "wheel DOMMouseScroll");
    cfg.eventManager.on(
      { el: dgLayersElement, type: "wheel DOMMouseScroll" },
      (evt) => {
        const targetElement = evt.target;
        const el = targetElement.closest(layerSelector);
        if (el == null) return;
        const delta = evt.deltaY;
        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
        evt.stopPropagation();
        if (delta < 0 && atTop || delta > 0 && atBottom) {
          evt.preventDefault();
        }
        return true;
      },
      { passive: false }
    );
  }
  /**
   * set focus in
   *
   * @public
   * @param {Event} e event
   */
  setGridFocusIn(e) {
    if (e) {
      const targetElement = e.target;
      if (targetElement.closest(".dg-empty-overlay") != null || targetElement.closest(".dg-body") == null && targetElement.closest(".dg-layers") == null) {
        this.hideLayer();
      }
    }
    if (document.activeElement != this.gridKeyInput) {
      this.gridKeyInput.focus();
    }
    this.cfg.focus = true;
  }
  /**
   * grid focus out
   *
   * @public
   * @param {Event} e event
   */
  setGridFocusOut(e) {
    if (!this.cfg.focus) return;
    if (!e) {
      this.cfg.focus = false;
      this.hideLayer();
      return;
    }
    if (e.button !== 2) {
      const gridKeyInputElement = this.gridKeyInput;
      let targetElement;
      if (e.type.startsWith("focus")) {
        targetElement = e.relatedTarget;
      } else {
        targetElement = e.target;
      }
      if ((targetElement == null ? void 0 : targetElement.closest(".dg-hidden-layers")) !== null) {
        const outerLayerElement = targetElement.closest(".dg-outer-layer");
        if ((outerLayerElement == null ? void 0 : outerLayerElement.dataset.gridLayerId) == this.$instanceId) {
          requestAnimationFrame(() => {
            gridKeyInputElement.focus();
          });
          return;
        }
      }
      this.cfg.focus = false;
      this.hideLayer();
    }
  }
  openLayer(layerElement) {
    layerElement.style.display = "block";
    this.cfg.isOpenLayer = true;
    this.openLayers.push(layerElement);
  }
  hideLayer(hideElement) {
    if (hideElement != "all") {
      if (ALL_INSTANCE.size > 1) {
        ALL_INSTANCE.forEach((grid, id) => {
          if (id != this.$instanceId) {
            grid.setGridFocusOut();
          }
        });
      }
    }
    if (this.openLayers.length < 1) return;
    if (hideElement) {
      let checkLayerClass;
      if (hideElement == "vscroll" || hideElement == "hscroll") {
        checkLayerClass = FIELD_LAYER_CLASS;
      }
      for (let idx = this.openLayers.length - 1; idx >= 0; idx--) {
        const layerElement = this.openLayers[idx];
        if (checkLayerClass && layerElement.classList.contains(checkLayerClass)) {
          layerElement.style.display = "none";
          this.openLayers.splice(idx, 1);
        } else if (hideElement == layerElement) {
          layerElement.style.display = "none";
          this.openLayers.splice(idx, 1);
          break;
        }
      }
      this.cfg.isOpenLayer = this.openLayers.length > 0;
      return;
    }
    this.cfg.isOpenLayer = false;
    for (let idx = this.openLayers.length - 1; idx >= 0; idx--) {
      const layerElement = this.openLayers[idx];
      layerElement.style.display = "none";
      this.openLayers.splice(idx, 1);
    }
    this.cfg.activeComponent = "";
  }
  /**
   * resize event
   *
   * @private
   */
  initResizeEvent() {
    const opts = this.opts;
    const threshold = opts.windowResizeDelay ?? 50;
    const el = this.gridElement;
    if (typeof ResizeObserver !== "undefined") {
      let resizeScheduled = false;
      const mainElement = el.getElement();
      const resizeObserver = new ResizeObserver(() => {
        if (resizeScheduled) {
          return;
        }
        resizeScheduled = true;
        requestAnimationFrame(() => {
          resizeScheduled = false;
          this.resize(el);
        });
      });
      resizeObserver.observe(mainElement);
      this.resizeObserver = resizeObserver;
    } else {
      const handler = debounce(() => {
        this.resize(el);
      }, threshold);
      this.windowResizeHandler = handler;
      window.addEventListener("resize", handler);
    }
  }
  /**
   * resize event 처리
   *
   * @param el grid element
   */
  resize(el) {
    if (this.destroyed) return;
    const initGridSize = this.initGridSize;
    const isWidthResize = initGridSize.width < 0;
    const isHeightResize = initGridSize.height < 0;
    const disableVerticalScroll = this.cfg.disableVerticalScroll;
    requestAnimationFrame(() => {
      if (this.destroyed) return;
      if (!isVisible(el.getElement())) return;
      const newOffset = {
        width: isWidthResize ? disableVerticalScroll ? el.clientWidth() : el.width() : initGridSize.width,
        height: isHeightResize ? el.height() : initGridSize.height
      };
      if (this.currentSize.height !== newOffset.height || this.currentSize.width !== newOffset.width) {
        this.setSize(newOffset.width, newOffset.height, true);
        if (this.toolbar) {
          this.toolbar.resizeArrowVisibility();
        }
      }
    });
  }
  /**
   * grid size 및 field 정보 계산
   */
  calculation() {
    this.structureBuilder.buildFields();
    this.cfg.dataManager.setItems(this.opts.items);
    this.setSize(this.initGridSize.width, this.initGridSize.height, false);
    this.structureBuilder.calcGridDimension();
    this.calcBody();
  }
  calcBody() {
    this.structureBuilder.calculateBodyLayout(this.currentSize.width, this.currentSize.height);
  }
  /**
   * main element
   *
   * @public
   * @returns {DaraElement} main element
   */
  getMainElement() {
    return this.mainElement;
  }
  getDataSearch() {
    return this.dataSearch;
  }
  /**
   * body object
   *
   * @public
   * @returns {Body} body object
   */
  getBody() {
    return this.body;
  }
  getStructureBuilder() {
    return this.structureBuilder;
  }
  /**
   * contextmenu object
   *
   * @returns {ContextMenu}
   */
  getContextMenu() {
    return this.contextMenu;
  }
  /**
   * summary object
   *
   * @public
   * @returns {Summary}
   */
  getSummary() {
    return this.summary;
  }
  /**
   * footer object
   *
   * @public
   * @returns {Footer}
   */
  getFooter() {
    return this.footer;
  }
  /**
   * header object
   *
   * @public
   * @returns {Header} header object
   */
  getHeader() {
    return this.header;
  }
  /**
   * scroll object
   *
   * @public
   * @returns {Scroll} object
   */
  getScroll() {
    return this.scroll;
  }
  getCurrentSize() {
    return this.currentSize;
  }
  /**
   * set size
   *
   * @public
   * @param {?number} [width] 넓이
   * @param {?number} [height] 높이
   */
  setSize(width, height, drawFlag = false) {
    this.currentSize = { width, height };
    if (drawFlag) {
      this.resizeDraw();
    }
  }
  resizeDraw() {
    this.calcBody();
    this.refreshBody(false, "resizeDraw");
  }
  /**
   * cell size 설정
   */
  fieldResize() {
    this.updateFieldWidth();
  }
  /**
   * update field width
   */
  updateFieldWidth() {
    const fields = this.cfg.currentFields;
    const headerElement = this.header.getHeaderElement();
    const bodyElement = this.body.getBodyElement();
    const summaryElement = this.summary.getElement();
    const shouldResizeHeader = this.header.isEnabled();
    const shouldResizeBody = this.cfg.dataInfo.rowLength > 0;
    const shouldResizeSummary = this.summary.isEnabled();
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const selector = `th[data-col-idx="${j}"]`;
      const width = `${field.$width}px`;
      if (shouldResizeHeader) {
        headerElement.find(selector).style.width = width;
      }
      if (shouldResizeBody) {
        bodyElement.find(selector).style.width = width;
      }
      if (shouldResizeSummary) {
        summaryElement.find(selector).style.width = width;
      }
    }
  }
  setElementDimensions() {
    const cfg = this.cfg;
    const dimensions = cfg.dimensions;
    this.mainElement.setHeight(dimensions.mainHeight);
    this.mainElement.findDaraElement(".dg-body").setHeight(dimensions.mainBodyHeight);
    this.layoutElement.css({
      width: dimensions.width + "px",
      height: dimensions.height + "px"
    });
    const mainSize = {};
    if (this.initGridSize.width > 0) {
      mainSize.width = dimensions.width + "px";
    }
    if (this.initGridSize.height > 0) {
      mainSize.height = dimensions.height + "px";
    }
    this.gridElement.css(mainSize);
    const mainLeftWidth = dimensions.mainLeftWidth;
    const mainCenterWidth = dimensions.mainCenterWidth;
    const mainRightWidth = dimensions.mainRightWidth;
    this.header.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.body.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.summary.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.changeScrollMode();
  }
  /**
   * change scroll mode
   *
   * @param mode scroll mode
   */
  changeScrollMode() {
    const cfg = this.cfg;
    const scrollbarSize = cfg.scrollbarSize;
    const scrollMode = (cfg.scroll.enabledHorizontal ? 1 : 0) + (cfg.scroll.enabledVertical ? 2 : 0);
    const mainPanelStyle = this.mainElement.find(".dg-panels").style;
    mainPanelStyle.removeProperty("height");
    mainPanelStyle.removeProperty("width");
    if (cfg.scroll.enabledHorizontal) {
      mainPanelStyle.height = `calc(100% - ${scrollbarSize})`;
    }
    if (cfg.scroll.enabledVertical) {
      mainPanelStyle.width = `calc(100% - ${scrollbarSize})`;
    }
    if (scrollMode == 0) {
      this.mainElement.removeAttr("data-scroll");
    } else {
      this.mainElement.setAttr({ "data-scroll": SCROLL_MODE[scrollMode] });
    }
  }
  /**
   * set data
   *
   * @param {any[]} items
   */
  setItems(items) {
    var _a;
    this.cfg.dataManager.setItems(items);
    (_a = this.header) == null ? void 0 : _a.setCheckboxStyle("none");
    this.scroll.moveVerticalScroll({ rowIdx: 0 });
    this.refreshBody(true, "setItems");
  }
  refreshBody(drawFlag, mode) {
    this.scroll.calculate();
    this.setElementDimensions();
    this.fieldResize();
    if (drawFlag) {
      this.getBody().dataDraw("refreshBody-" + mode);
      return;
    }
    if (mode == "resizeDraw") {
      const scroll = this.cfg.scroll;
      if (scroll.before.startIdx !== scroll.startIdx || scroll.before.viewRow !== scroll.viewRow || scroll.before.startCol !== scroll.startCol || scroll.before.endCol !== scroll.endCol) {
        this.getBody().dataDraw("refreshBody-" + mode);
      }
    }
  }
  /**
   * 데이터를 추가
   *
   * @param items - 추가할 행 데이터 배열
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   * @returns void
   */
  addItems(items, addOpts) {
    const rowIdx = this.cfg.dataManager.addItems(items, addOpts, ItemStatusMap.READ);
    if (rowIdx > -1) {
      this.scroll.moveVerticalScroll({ rowIdx, drawFlag: false });
      this.getBody().dataDraw("refreshBody-addItems");
    }
  }
  /**
   * 새로운 item을 Grid에 추가합니다.
   *
   * item을 데이터 매니저에 추가하면서 신규 생성 상태(CREATE)를 설정하고,
   * 정상적으로 추가된 경우 해당 row 위치로 스크롤을 이동한 후 body를 갱신합니다.
   *
   * @param item 추가할 item
   * @param addOpts item 추가 옵션
   */
  createItem(item, addOpts) {
    const rowIdx = this.cfg.dataManager.createItem(item, addOpts);
    if (rowIdx > -1) {
      this.scroll.moveVerticalScroll({ rowIdx, drawFlag: false });
      this.getBody().dataDraw("refreshBody-addItems");
    }
  }
  /**
   * item을 삭제
   *
   * @param {any[]} ids rowId
   */
  removeItems(ids) {
    const cfg = this.cfg;
    cfg.dataManager.removeItems(ids);
    this.refreshBody(true, "removeItems");
  }
  /**
   * all items clear
   *
   * @public
   */
  clearItems() {
    this.setItems([]);
  }
  /**
   * get checked items
   *
   * @param names filed names
   * @returns {array} checked item array
   */
  getCheckedItems(names) {
    const { dataManager } = this.cfg;
    const viewItems = dataManager.getViewItems();
    const checkItems = [];
    let exportNames = [];
    let isAll = false;
    if (isUndefined(names)) {
      isAll = true;
    } else if (isArray(names)) {
      exportNames = names;
    } else {
      exportNames = [names];
    }
    for (const viewItem of viewItems) {
      const rowId = viewItem.id;
      if (dataManager.isItemChecked(rowId)) {
        const rowItem = dataManager.getRowItem(rowId);
        let checkItem;
        if (isAll) {
          checkItem = rowItem;
        } else {
          checkItem = {};
          for (const name of exportNames) {
            checkItem[name] = rowItem[name];
          }
        }
        checkItems.push(checkItem);
      }
    }
    return checkItems;
  }
  /**
   * get check items
   *
   * @public
   * @param {string} name field name
   * @returns {*} name 값만 리턴
   */
  getCheckedItemByName(name) {
    return this.getBody().getCheckedItemByName(name);
  }
  getCheckedIds() {
    return this.getBody().getCheckedItemByName(ROW_FIELD.ID);
  }
  /**
   * all check
   *
   * @public
   * @param {boolean} checked
   */
  setAllCheckedItems(checked) {
    if (!this.cfg.isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getHeader().setAllCheckItem(checked);
  }
  /**
   * name value item check
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  setCheckedItemByValue(name, values) {
    this.getBody().setCheckedItemByValue(name, values);
  }
  /**
   * add check item
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  addCheckedItemByValue(name, values) {
    if (!this.cfg.isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getBody().addCheckedItemByValue(name, values);
  }
  /**
   * un checked
   *
   * @public
   * @param {string} name field name
   * @param {*} values field values
   */
  unCheckedItemByValue(name, values) {
    this.getBody().unCheckedItemByValue(name, values);
  }
  /**
   * 변경된 아이템 얻기
   */
  getChangedItems() {
    return this.cfg.dataManager.getChangedItems();
  }
  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (예: 'light', 'dark').
   *                    생략하거나 빈 값이면 그리드별 테마 지정을 해제한다.
   *                    (해제되면 상위 요소의 data-daracl-theme 속성, 없으면 기본 테마를 따른다.)
   */
  setTheme(themeName) {
    const theme = themeName ? GRID_THEME[themeName] : "";
    if (themeName && !theme) return;
    const cfg = this.cfg;
    if (cfg.theme === theme) return;
    const classList = this.layoutElement.getElement().classList;
    if (cfg.theme && classList.contains(cfg.theme)) classList.remove(cfg.theme);
    cfg.theme = theme;
    if (theme && !classList.contains(theme)) classList.add(theme);
  }
  /**
   * 그리드 스타일 변경
   *
   *  BodyStyle 스타일
   *  ex) default, striped, borderless, list
   *
   * @param styleName 적용할 그리드 스타일
   *
   */
  setGridStyle(styleName) {
    if (!BODY_STYLE[styleName]) {
      return;
    }
    const values = Object.values(BODY_STYLE).filter((value) => value !== styleName).map((value) => `dg-style-${value}`);
    const layoutElement = this.layoutElement;
    const newStyle = "dg-style-" + BODY_STYLE[styleName];
    layoutElement.removeClass(...values);
    if (!layoutElement.hasClass(newStyle)) {
      layoutElement.addClass(newStyle);
    }
  }
  /**
   * tree 확장
   * @param id id
   */
  expandRow(id) {
    const cfg = this.cfg;
    cfg.dataManager.expandRow(id);
  }
  expandAll() {
    const dataManager = this.cfg.dataManager;
    if (dataManager instanceof TreeDataManager) {
      dataManager.expandAll();
      this.refreshBody(true, "expandAll");
    }
  }
  collapseAll() {
    const dataManager = this.cfg.dataManager;
    if (dataManager instanceof TreeDataManager) {
      dataManager.collapseAll();
      this.refreshBody(true, "collapseAll");
    }
  }
  setPaging(paging) {
    this.opts.paging = paging;
    this.cfg.paging = paging;
    if (this.footer) {
      this.footer.setPagingTemplate(paging);
    }
  }
  getToolbar() {
    return this.toolbar;
  }
  /**
   * toolbar value
   * @returns [] toolbar value
   */
  getToolbarValues() {
    return this.toolbar.getValues();
  }
  setToolbarValues(val) {
    return this.toolbar.setValues(val);
  }
  destroy() {
    var _a, _b;
    if (this.destroyed) return;
    this.destroyed = true;
    const gridElement = this.gridElement;
    const uid = this.$instanceId;
    const cfg = this.cfg;
    (_a = this.scroll) == null ? void 0 : _a.destroy();
    (_b = this.toolbar) == null ? void 0 : _b.destroy();
    this.body.destroy();
    cfg.eventManager.destroy();
    gridElement.removeAttr(INSTANCE_ATTR_KEY);
    const el = gridElement.getElement();
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(el);
      this.resizeObserver.disconnect();
    } else if (this.windowResizeHandler) {
      window.removeEventListener("resize", this.windowResizeHandler);
    }
    el.style.cssText = this.orginStyle;
    while (el.firstChild) {
      if (typeof el.firstChild.remove === "function") {
        el.firstChild.remove();
      } else {
        el.removeChild(el.firstChild);
      }
    }
    ALL_INSTANCE.delete(uid);
  }
}
function getGridTemplate() {
  const GRID_TEMPLATE2 = document.createElement("template");
  GRID_TEMPLATE2.innerHTML = html`
    <div class="daracl-grid">
      <div class="dg-layers"></div>
      <div class="dg-viewport">
        <input type="text" class="dg-text-editor" inputmode="none" />
        <div class="dg-layout" style="user-select:none;touch-action:manipulation;">
          <div class="dg-toolbar dg-select" role="presentation">
            <div class="dg-toolbar-scroll"></div>
            <div class="dg-toolbar-arrow dg-noselect">
              <button type="button" class="dg-button" data-direction="left">${ALL_ICONS.scrollLeft}</button>
              <button type="button" class="dg-button" data-direction="right">${ALL_ICONS.scrollRight}</button>
            </div>
          </div>

          <div class="dg-main" data-scroll="none">
            <div class="dg-panels">
              <div class="dg-panel dg-header">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>
              </div>

              <div class="dg-panel dg-body">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>

                <div class="dg-empty-overlay">
                  <span class="dg-empty-message">
                    <i class="dg-icon-info"></i>
                    <span class="empty-text"></span>
                  </span>
                </div>

                <div class="dg-drop-indicator"></div>
              </div>

              <div class="dg-panel dg-summary">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>
              </div>
            </div>

            <div class="dg-resize-helper"></div>

            <div class="dg-scroll-container">
              <div class="dg-scroll dg-vertical">
                <div class="dg-scroll-track"></div>
                <div class="dg-scroll-thumb"></div>
                <div class="dg-scroll-button" data-dg-mode="up" style="top:0px;">${ALL_ICONS.scrollUp}</div>
                <div class="dg-scroll-button" data-dg-mode="down" style="bottom:0px;">${ALL_ICONS.scrollDown}</div>
              </div>

              <div class="dg-scroll dg-horizontal">
                <div class="dg-scroll-track"></div>
                <div class="dg-scroll-thumb"></div>
                <div class="dg-scroll-button" data-dg-mode="left" style="left:0px;">${ALL_ICONS.scrollLeft}</div>
                <div class="dg-scroll-button" data-dg-mode="right" style="right:0px;">${ALL_ICONS.scrollRight}</div>
              </div>
              <div class="dg-scroll-corner"></div>

              <div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;">
                <textarea class="dg-paste-area"></textarea>
              </div>
            </div>
          </div>

          <div class="dg-footer" role="presentation">
            <span class="dg-status">
              <span class="dg-selection-status"></span>
            </span>

            <span class="dg-paging"></span>

            <span class="dg-paging-info"></span>
          </div>
        </div>
      </div>
    </div>
  `;
  return GRID_TEMPLATE2;
}
function normalizeExportValue(value) {
  if (value === null || value === void 0) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
function loadPdfModule() {
  return Promise.resolve().then(() => require("./PdfConverter-BBw2s2aY.js"));
}
function getExportCellValues(fields, item) {
  return fields.map((field) => {
    var _a, _b, _c, _d, _e;
    const renderer = field.$renderer;
    if (((_a = field.renderer) == null ? void 0 : _a.type) === "password") return "********";
    if (((_b = field.renderer) == null ? void 0 : _b.type) === "hidden") return "";
    const value = renderer.getValue(item);
    if (renderer instanceof ViewCellRenderer && ["dropdown", "link", "button"].includes((_c = field.renderer) == null ? void 0 : _c.type)) {
      const ref = renderer.getRefValue(value, item);
      if (typeof ref === "string") return ref;
      if (ref == null ? void 0 : ref.hide) return "";
      if ((ref == null ? void 0 : ref.label) !== void 0) return normalizeExportValue(ref.label);
      if (renderer instanceof DropdownRenderer$1) {
        let labels = renderer.getLabel(value);
        if (labels.length === 0 && field.defaultValue) labels = renderer.getLabel(field.defaultValue);
        if (labels.length > 0) return labels.join(((_e = (_d = field.editRenderer) == null ? void 0 : _d.listItem) == null ? void 0 : _e.delimiter) ?? ",");
      }
    }
    return normalizeExportValue(value);
  });
}
class PdfRenderer {
  constructor(context) {
    this.context = context;
  }
  render() {
    const { fields, viewItems } = this.context;
    const data = {
      columns: [...this.context.lineNumberField ? [this.context.lineNumberField] : [], ...fields].map((field) => ({
        name: field.name,
        label: field.label,
        width: field.$width,
        align: field.align ?? (field.$alignStyle === TEXT_ALIGN_STYLE.right ? "right" : field.$alignStyle === TEXT_ALIGN_STYLE.center ? "center" : "left")
      })),
      rows: viewItems.map((viewItem, rowIndex) => {
        const row = this.renderRow(viewItem);
        return this.context.lineNumberField ? [String((this.context.lineNumberStart ?? 0) + rowIndex + 1), ...row] : row;
      })
    };
    if (this.context.tableBorders) data.tableBorders = this.context.tableBorders;
    const getCellStyles = this.context.getCellStyles;
    if (getCellStyles) {
      const cellStyles = viewItems.map((viewItem, rowIndex) => getCellStyles(viewItem, rowIndex));
      const cellBackgrounds = cellStyles.map((style) => style.backgrounds);
      if (cellBackgrounds.some((row) => row.some((background) => background !== void 0))) {
        data.cellBackgrounds = cellBackgrounds;
      }
      data.cellBorders = cellStyles.map((style) => style.borders);
      data.cellTextColors = cellStyles.map((style) => style.textColors ?? []);
    }
    if (this.context.getCellCharts) {
      const charts = viewItems.map((viewItem, rowIndex) => {
        var _a, _b;
        return ((_b = (_a = this.context).getCellCharts) == null ? void 0 : _b.call(_a, viewItem, rowIndex)) ?? [];
      });
      data.cellCharts = charts.map((row) => this.context.lineNumberField ? [void 0, ...row] : row);
    }
    if (this.context.getHeaderCellBorders) {
      data.headerCellBorders = this.context.getHeaderCellBorders();
    }
    if (this.context.getHeaderCellStyles) {
      const styles = this.context.getHeaderCellStyles();
      data.headerBackgrounds = styles.backgrounds;
      data.headerTextColors = styles.textColors;
      data.headerGradients = styles.gradients;
    }
    return data;
  }
  renderRow(viewItem) {
    if (viewItem.groupRowType) {
      return this.context.fields.map(() => "");
    }
    const item = this.context.getRowItem(viewItem.id);
    return this.renderDataRow(item);
  }
  renderDataRow(item) {
    return getExportCellValues(this.context.fields, item);
  }
}
class GroupPdfRenderer extends PdfRenderer {
  render() {
    this.previousDataItem = void 0;
    return super.render();
  }
  renderRow(viewItem) {
    const { fields, getRowItem } = this.context;
    if (!viewItem.groupRowType) {
      const item = getRowItem(viewItem.id);
      const row2 = this.renderDataRow(item);
      const groupingFields = this.groupingFields();
      groupingFields.forEach((fieldName, groupIndex) => {
        const field = fields.find((candidate) => candidate.name === fieldName);
        const sameGroup = this.previousDataItem !== void 0 && groupingFields.slice(0, groupIndex + 1).every((name) => {
          var _a;
          return Object.is(item[name], (_a = this.previousDataItem) == null ? void 0 : _a[name]);
        });
        if (field && sameGroup) {
          row2[fields.indexOf(field)] = "";
        }
      });
      this.previousDataItem = item;
      return row2;
    }
    const row = super.renderRow(viewItem);
    const sumFields = new Set(this.context.sumFields);
    const summaryLabelField = fields.find((field) => !sumFields.has(field.name)) ?? fields[0];
    if (viewItem.groupRowType === "group") {
      const groupField = fields.find((field) => field.name === viewItem.groupField) ?? fields[0];
      if (groupField) {
        row[fields.indexOf(groupField)] = `${viewItem.groupField}: ${normalizeExportValue(viewItem.groupValue)}`;
      }
      return row;
    }
    if (viewItem.groupRowType === "groupSummary") {
      const labelField = viewItem.groupField ? fields.find((field) => field.name === viewItem.groupField) ?? summaryLabelField : summaryLabelField;
      if (labelField) {
        row[fields.indexOf(labelField)] = viewItem.groupField ? `${normalizeExportValue(viewItem.groupValue)} 합계` : "Subtotal";
      }
    } else if (summaryLabelField) {
      row[fields.indexOf(summaryLabelField)] = "Grand Total";
    }
    for (const [fieldName, sum] of Object.entries(viewItem.groupSums ?? {})) {
      const columnIndex = fields.findIndex((field) => field.name === fieldName);
      if (columnIndex >= 0) {
        row[columnIndex] = normalizeExportValue(sum);
      }
    }
    return row;
  }
  groupingFields() {
    return this.context.groupingFields;
  }
}
class SimplePdfRenderer extends PdfRenderer {
}
function createPdfHeaderRows(roots, fields, data) {
  const paths = /* @__PURE__ */ new Map();
  const visit = (nodes, parents) => {
    var _a;
    for (const node of nodes) {
      if (node.hidden) continue;
      const path = [...parents, node];
      if ((_a = node.children) == null ? void 0 : _a.length) visit(node.children, path);
      else paths.set(node.name, path);
    }
  };
  visit(roots, []);
  const columns = fields.map((field) => paths.get(field.name) ?? [field]);
  const depth = Math.max(1, ...columns.map((path) => path.length));
  if (depth === 1) return void 0;
  return Array.from({ length: depth }, (_, level) => {
    var _a, _b, _c, _d;
    const cells = [];
    for (let column = 0; column < columns.length; ) {
      const path = columns[column];
      if (level >= path.length) {
        column++;
        continue;
      }
      const node = path[level];
      let end = column + 1;
      while (end < columns.length && columns[end][level] === node) end++;
      cells.push({
        label: node.label ?? "",
        column,
        colSpan: end - column,
        rowSpan: level === path.length - 1 ? depth - level : 1,
        background: (_a = data.headerBackgrounds) == null ? void 0 : _a[column],
        textColor: (_b = data.headerTextColors) == null ? void 0 : _b[column],
        gradient: (_c = data.headerGradients) == null ? void 0 : _c[column],
        borders: (_d = data.headerCellBorders) == null ? void 0 : _d[column]
      });
      column = end;
    }
    return cells;
  });
}
function loadExcelModule() {
  return Promise.resolve().then(() => require("./ExcelExport-DBL50aq9.js"));
}
function loadCsvModule() {
  return Promise.resolve().then(() => require("./CsvExport-CX5zaYDi.js"));
}
function loadJsonModule() {
  return Promise.resolve().then(() => require("./JsonExport-DkvyexxI.js"));
}
let HIDDEN_ELEMENT = null;
const _DaraGrid = class _DaraGrid {
  constructor(gridElement, options, message2) {
    if (gridElement == null || isUndefined(gridElement)) {
      throw new Error(`${gridElement} grid element not found`);
    }
    this.createGrid(gridElement, options, message2);
  }
  initGlobalConfig() {
    if (HIDDEN_ELEMENT === null) {
      const hiddenElement = createHTMLElement("div", HIDDEN_ELEMENT_SELECTOR.replace(".", ""));
      document.body.appendChild(hiddenElement);
      HIDDEN_ELEMENT = hiddenElement;
    }
  }
  static create(gridElement, options, message2) {
    return new _DaraGrid(gridElement, options, message2);
  }
  static message(message2) {
    Language.setGlobalMessage(message2);
  }
  static setDefaultOptions(options) {
    setDefaultOptions(options);
  }
  createGrid(gridElement, opts, message2) {
    this.initGlobalConfig();
    this.gridMain = new GridMain(this, gridElement, opts, message2);
    this.gridMain.init();
  }
  getOptions() {
    return this.gridMain.options();
  }
  instanceId() {
    return this.gridMain.uid();
  }
  /**
   * grid instance 구하기
   *
   * @param {(HTMLElement | string)} eleOrId grid element, grid uid
   * @returns {DaraGrid} 그리드 object
   */
  static instance(eleOrId) {
    return GridMain.getInstance(eleOrId);
  }
  /**
   * 모든 field 얻기
   */
  getFields() {
    return this.gridMain.config().currentFields;
  }
  /**
   * 그리드의 전체 행 데이터를 반환한다.
   *
   * @returns 전체 행 데이터 배열
   */
  getItems() {
    return this.gridMain.config().dataManager.getAllRowItems();
  }
  /**
   * 내보내기 가능한 현재 뷰의 모든 행을 PDF로 다운로드합니다.
   *
   * 사용자 정의 글꼴은 fetch 등의 방법으로 읽은 ArrayBuffer 또는 Uint8Array로 전달합니다.
   */
  async exportPdf(options = {}) {
    var _a;
    const { PdfConverter } = await loadPdfModule();
    const cfg = this.gridMain.config();
    const fields = cfg.currentFields.filter((field) => !field.hidden && !field.$isAside);
    const lineNumberField = cfg.currentFields.find((field) => field.name === LINE_NUMBER_NAME && !field.hidden);
    const displayFields = lineNumberField ? [lineNumberField, ...fields] : fields;
    const gridOptions = this.gridMain.options();
    const cellStyleProbe = this.createPdfCellStyleResolver(displayFields, fields);
    const rendererContext = {
      fields,
      lineNumberField,
      lineNumberStart: ((_a = gridOptions.footer.paging) == null ? void 0 : _a.enabled) ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0,
      viewItems: cfg.dataManager.getViewItems(),
      groupingFields: gridOptions.groupingFields ?? [],
      sumFields: gridOptions.sumFields ?? [],
      getRowItem: (id) => cfg.dataManager.getRowItem(id),
      getCellStyles: cellStyleProbe.getCellStyles,
      getCellCharts: (viewItem) => {
        if (viewItem.groupRowType) {
          return fields.map(() => void 0);
        }
        const item = cfg.dataManager.getRowItem(viewItem.id);
        return fields.map((field) => this.getPdfCellChart(field, item));
      },
      getHeaderCellBorders: cellStyleProbe.getHeaderCellBorders,
      getHeaderCellStyles: cellStyleProbe.getHeaderCellStyles,
      tableBorders: cellStyleProbe.tableBorders
    };
    const renderer = rendererContext.groupingFields.length ? new GroupPdfRenderer(rendererContext) : new SimplePdfRenderer(rendererContext);
    const converter = new PdfConverter();
    let tableData;
    try {
      tableData = renderer.render();
      tableData.firstPageHeader = createPdfHeaderRows(gridOptions.fields, displayFields, tableData);
    } finally {
      cellStyleProbe.destroy();
    }
    const blob = await converter.convert(tableData, options);
    converter.download(blob, options.fileName);
    return blob;
  }
  /** CSV를 필요한 시점에 로드하여 실제 데이터 행을 다운로드한다. */
  async exportCsv(options = {}) {
    const { CsvConverter, createCsvData } = await loadCsvModule();
    const data = createCsvData(this.createDataExportContext(options), options);
    const converter = new CsvConverter();
    const blob = converter.convert(data.headers, data.rows, options);
    converter.download(blob, options.fileName);
    return blob;
  }
  /** JSON 모듈을 필요한 시점에 로드하고 필드명을 키로 하는 행 배열을 다운로드한다. */
  async exportJson(options = {}) {
    const { JsonConverter, createJsonData } = await loadJsonModule();
    const data = createJsonData(this.createDataExportContext(options), options);
    const converter = new JsonConverter();
    const blob = converter.convert(data, options);
    converter.download(blob, options.fileName);
    return blob;
  }
  /** CSV·JSON의 대상 행과 열을 선택하며 화면·선택 상태는 유지한다. */
  createDataExportContext(options) {
    const cfg = this.gridMain.config();
    const manager = cfg.dataManager;
    let viewItems = options.visibleOnly ? manager.getViewItems() : manager instanceof TreeDataManager ? manager.getAllTreeViewItems() : manager.getOriginalViewItems();
    if (options.selectedOnly) {
      const selected = new Set(this.getSelectedRowIds());
      viewItems = viewItems.filter((item) => selected.has(item.id));
    }
    let fields = cfg.currentFields.filter((field) => !field.$isAside && !field.hidden);
    if (options.includeHiddenColumns) {
      const factory = new RendererFactory(this.gridMain);
      const visible = new Map(fields.map((field) => [field.name, field]));
      const flatten = (items) => items.flatMap(
        (field) => {
          var _a;
          return ((_a = field.children) == null ? void 0 : _a.length) ? flatten(field.children) : [visible.get(field.name) ?? factory.createRenderer({ ...field })];
        }
      );
      fields = flatten(this.gridMain.options().fields);
    }
    return {
      fields,
      viewItems,
      groupingFields: [],
      sumFields: [],
      getRowItem: (id) => manager.getRowItem(id)
    };
  }
  /** 현재 뷰의 표시 값·그룹 합계·셀 병합을 XLSX로 다운로드한다. */
  async exportExcel(options = {}) {
    var _a;
    const { ExcelConverter, createExcelData } = await loadExcelModule();
    const cfg = this.gridMain.config();
    const gridOptions = this.gridMain.options();
    const fields = cfg.currentFields.filter((field) => !field.hidden && !field.$isAside);
    const lineNumberField = options.includeRowNumber === false ? void 0 : cfg.currentFields.find((field) => field.name === LINE_NUMBER_NAME && !field.hidden);
    const displayFields = lineNumberField ? [lineNumberField, ...fields] : fields;
    const probe = this.createPdfCellStyleResolver(displayFields, fields);
    const converter = new ExcelConverter();
    let blob;
    try {
      const data = createExcelData(
        {
          fields,
          lineNumberField,
          lineNumberStart: ((_a = gridOptions.footer.paging) == null ? void 0 : _a.enabled) ? (cfg.paging.page - 1) * cfg.paging.pageSize : 0,
          viewItems: cfg.dataManager instanceof TreeDataManager && options.includeCollapsed !== false ? cfg.dataManager.getAllTreeViewItems() : cfg.dataManager.getViewItems(),
          groupingFields: gridOptions.groupingFields ?? [],
          sumFields: gridOptions.sumFields ?? [],
          getRowItem: (id) => cfg.dataManager.getRowItem(id),
          getCellStyles: probe.getCellStyles,
          getHeaderCellBorders: probe.getHeaderCellBorders,
          getHeaderCellStyles: probe.getHeaderCellStyles,
          rowHeight: cfg.rowHeight,
          getCellCharts: (viewItem) => viewItem.groupRowType ? fields.map(() => void 0) : fields.map((field) => this.getPdfCellChart(field, cfg.dataManager.getRowItem(viewItem.id)))
        },
        options.mergeCells === false ? [] : gridOptions.rowSpanFields ?? []
      );
      data.headerRows = createPdfHeaderRows(gridOptions.fields, displayFields, data);
      blob = converter.convert(data, options);
    } finally {
      probe.destroy();
    }
    converter.download(blob, options.fileName);
    return blob;
  }
  createPdfCellStyleResolver(displayFields, dataFields) {
    const cfg = this.gridMain.config();
    const gridOptions = this.gridMain.options();
    const viewItems = cfg.dataManager.getViewItems();
    const gridElement = this.gridMain.element().getElement();
    const opaqueBackground = (...elements) => elements.map((element) => window.getComputedStyle(element).backgroundColor).find((color) => color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)");
    const body = gridElement.querySelector(".dg-body");
    const headerGradient = (cell) => {
      var _a;
      for (let element = cell; element && gridElement.contains(element); element = element.parentElement) {
        const style = window.getComputedStyle(element);
        const colors = ((_a = style.backgroundImage) == null ? void 0 : _a.startsWith("linear-gradient(")) ? style.backgroundImage.match(/rgba?\([^)]+\)/g) : void 0;
        if ((colors == null ? void 0 : colors.length) === 2) return { startColor: colors[0], endColor: colors[1] };
        if (opaqueBackground(element)) return void 0;
      }
      return void 0;
    };
    const tableBody = (body == null ? void 0 : body.querySelector('.dg-region[data-region="center"] .dg-body-table tbody')) ?? (body == null ? void 0 : body.querySelector(".dg-body-table tbody"));
    if (!body || !tableBody) {
      throw new Error("Unable to resolve grid cell styles for PDF export");
    }
    const probeRow = document.createElement("tr");
    probeRow.className = "dg-row";
    probeRow.style.visibility = "hidden";
    probeRow.style.height = "0";
    probeRow.setAttribute("aria-hidden", "true");
    const probeCells = displayFields.map(() => {
      const cell = document.createElement("td");
      cell.className = "dg-cell";
      probeRow.appendChild(cell);
      return cell;
    });
    tableBody.appendChild(probeRow);
    const headerCells = displayFields.map((field) => {
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field) ? "left" : cfg.fieldHeaderGroup.leafRight.includes(field) ? "right" : "center";
      return gridElement.querySelector(
        `.dg-header .dg-region[data-region="${region}"] [data-header-cell-position="${field.$resizeIdx}"]`
      ) ?? void 0;
    });
    return {
      tableBorders: this.getPdfCellBorders(gridElement.querySelector(".dg-main") ?? gridElement),
      getCellStyles: (viewItem, rowIndex) => {
        const rowClasses = ["dg-row"];
        if (viewItem.groupRowType) {
          rowClasses.push(
            "dg-group-row",
            viewItem.groupRowType === "group" ? "dg-group-header" : viewItem.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary"
          );
        }
        probeRow.className = rowClasses.join(" ");
        const item = viewItem.groupRowType ? void 0 : cfg.dataManager.getRowItem(viewItem.id);
        const rowBackground = window.getComputedStyle(probeRow).backgroundColor;
        let previousDataItem;
        if (!viewItem.groupRowType && rowIndex > 0) {
          for (let previousIndex = rowIndex - 1; previousIndex >= 0; previousIndex--) {
            const previousViewItem = viewItems[previousIndex];
            if (previousViewItem && !previousViewItem.groupRowType) {
              previousDataItem = cfg.dataManager.getRowItem(previousViewItem.id);
              break;
            }
          }
        }
        const styles = displayFields.map((field, fieldIndex) => {
          const cell = probeCells[fieldIndex];
          const classes = ["dg-cell"];
          if (field.name === LINE_NUMBER_NAME) {
            classes.push("dg-aside", "dg-line-number");
          }
          if (viewItem.groupRowType) {
            classes.push("dg-group-cell");
          } else if (item) {
            if (field.cellClassName && dataFields.includes(field)) {
              classes.push(
                ...resolveClassName(field.cellClassName, {
                  rowIdx: rowIndex,
                  col: field.$colSeq,
                  field,
                  item
                })
              );
            }
            const groupingFieldIndex = (gridOptions.groupingFields ?? []).indexOf(field.name);
            const sameGroup = groupingFieldIndex >= 0 && previousDataItem !== void 0 && (gridOptions.groupingFields ?? []).slice(0, groupingFieldIndex + 1).every((name) => Object.is(item[name], previousDataItem == null ? void 0 : previousDataItem[name]));
            if (sameGroup && rowIndex < viewItems.length - 1) {
              classes.push("dg-group-continuation");
            }
          }
          cell.className = classes.join(" ");
          const cellBackground = window.getComputedStyle(cell).backgroundColor;
          const background = cellBackground && cellBackground !== "transparent" && cellBackground !== "rgba(0, 0, 0, 0)" ? cellBackground : rowBackground && rowBackground !== "transparent" && rowBackground !== "rgba(0, 0, 0, 0)" ? rowBackground : opaqueBackground(body, gridElement);
          return { background, borders: this.getPdfCellBorders(cell), textColor: window.getComputedStyle(cell).color };
        });
        const backgrounds = styles.map((style) => style.background);
        const borders = styles.map((style) => style.borders);
        return { backgrounds, borders, textColors: styles.map((style) => style.textColor || void 0) };
      },
      getHeaderCellBorders: () => headerCells.map((cell) => cell ? this.getPdfCellBorders(cell) : void 0),
      getHeaderCellStyles: () => ({
        gradients: headerCells.map((cell) => cell ? headerGradient(cell) : void 0),
        backgrounds: headerCells.map(
          (cell) => cell ? opaqueBackground(cell, cell.parentElement ?? gridElement, gridElement) : void 0
        ),
        borders: headerCells.map((cell) => cell ? this.getPdfCellBorders(cell) : void 0),
        textColors: headerCells.map((cell) => cell ? window.getComputedStyle(cell).color || void 0 : void 0)
      }),
      destroy: () => probeRow.remove()
    };
  }
  getPdfCellBorders(cell) {
    const style = window.getComputedStyle(cell);
    const styleValues = [
      style.borderTopWidth,
      style.borderRightWidth,
      style.borderBottomWidth,
      style.borderLeftWidth,
      style.borderTopStyle,
      style.borderRightStyle,
      style.borderBottomStyle,
      style.borderLeftStyle
    ];
    if (styleValues.every((value) => value === "")) {
      return void 0;
    }
    const readSide = (width, color, borderStyle) => {
      const numericWidth = Number.parseFloat(width);
      if (!Number.isFinite(numericWidth) || numericWidth <= 0 || borderStyle === "none" || borderStyle === "hidden" || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
        return void 0;
      }
      const style2 = ["dashed", "dotted", "double"].includes(borderStyle) ? borderStyle : void 0;
      return { width: numericWidth, color, ...style2 ? { style: style2 } : {} };
    };
    return {
      top: readSide(style.borderTopWidth, style.borderTopColor, style.borderTopStyle),
      right: readSide(style.borderRightWidth, style.borderRightColor, style.borderRightStyle),
      bottom: readSide(style.borderBottomWidth, style.borderBottomColor, style.borderBottomStyle),
      left: readSide(style.borderLeftWidth, style.borderLeftColor, style.borderLeftStyle)
    };
  }
  getPdfCellChart(field, item) {
    var _a, _b;
    const rendererType = field.renderer.type;
    const value = field.$renderer.getValue(item);
    if (rendererType === "bar" && field.$renderer instanceof BarRenderer) {
      const refValue = field.$renderer.getRefValue(value, item);
      const chartValue = Number((refValue == null ? void 0 : refValue.percent) ?? value);
      if (!Number.isFinite(chartValue)) {
        return void 0;
      }
      const positiveColor = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue("--bar-positive-bg").trim();
      const negativeColor = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue("--bar-negative-bg").trim();
      return {
        type: "bar",
        value: chartValue,
        minimum: ((_a = field.renderer.rule) == null ? void 0 : _a.minimum) ?? 0,
        maximum: ((_b = field.renderer.rule) == null ? void 0 : _b.maximum) ?? 100,
        label: normalizeExportValue((refValue == null ? void 0 : refValue.label) ?? value),
        color: chartValue < 0 ? negativeColor || "#ff8989" : positiveColor || "#77c0fc"
      };
    }
    if (rendererType === "sparkline" && field.$renderer instanceof SparklineRenderer || rendererType === "sparklineBar" && field.$renderer instanceof SparklineRendererBar) {
      const refValue = field.$renderer.getRefValue(value, item);
      const values = (refValue == null ? void 0 : refValue.value) ?? value;
      if (!Array.isArray(values) || !values.every((entry) => typeof entry === "number" && Number.isFinite(entry))) {
        return void 0;
      }
      return { type: rendererType, values: [...values] };
    }
    return void 0;
  }
  /**
   * 현재 표시 중인 모든 레이어(드롭다운, 팝업 등)를 숨긴다.
   */
  hideLayer() {
    this.gridMain.hideLayer("all");
  }
  /**
   * 그리드에 focusout 처리를 설정한다.
   *
   * 포커스를 잃었을 때 필요한 UI 처리(예: 레이어 닫기)를 수행한다.
   */
  setFocusOut() {
    this.gridMain.setGridFocusOut();
  }
  /**
   * 툴바에 설정된 현재 값을 반환한다.
   *
   * @returns 툴바 값 객체
   */
  getToolbarValues() {
    return this.gridMain.getToolbarValues();
  }
  /**
   * 툴바 값을 설정한다.
   *
   * @param values - 설정할 툴바 값 객체
   */
  setToolbarValues(values) {
    this.gridMain.setToolbarValues(values);
  }
  /**
   * item index 값으로 item 얻기
   *
   * @param {number[]} indexs index
   * @returns {{}}
   */
  getItemsByIndexs(indexs) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    const viewItems = dataManager.getViewItems();
    for (const index of indexs) {
      const viewItem = viewItems[index];
      if (viewItem) {
        result.push(dataManager.getRowItem(viewItem.id));
      }
    }
    return result;
  }
  selectRowById(rowId, opts) {
    return this.gridMain.config().dataManager.selectRowById(rowId, opts);
  }
  /**
   * 지정한 행 ID에 해당하는 데이터를 반환합니다.
   *
   * @param rowId 조회할 행의 ID
   * @returns 행 ID에 해당하는 데이터 객체
   */
  getItemById(rowId) {
    return this.gridMain.config().dataManager.getRowItem(rowId);
  }
  /**
   * 지정한 행 ID 목록에 해당하는 데이터들을 반환합니다.
   *
   * 반환되는 배열의 순서는 전달된 rowIds의 순서와 동일합니다.
   *
   * @param rowIds 조회할 행 ID 목록
   * @returns 행 ID 목록에 해당하는 데이터 객체 배열
   */
  getItemsByIds(rowIds) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    for (const rowId of rowIds) {
      result.push(dataManager.getRowItem(rowId));
    }
    return result;
  }
  setPaging(paging) {
    this.gridMain.setPaging(paging);
  }
  /**
   * set items
   *
   * @param {any[]} items
   */
  setItems(items) {
    this.gridMain.setItems(items);
  }
  clearItems() {
    this.gridMain.clearItems();
  }
  /**
   * 행 데이터를 추가
   *
   * @param items - 추가할 행 데이터 배열
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   *
   * @example
   * // 기본 추가
   * grid.addItems(items, {});
   *
   * @example
   * // 특정 행의 앞에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'before',
   * });
   *
   * @example
   * // 특정 행의 뒤에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'after',
   * });
   *
   * @example
   * // 특정 행의 내부에 추가
   * grid.addItems(items, {
   *   rowId: targetRowId,
   *   position: 'inside',
   * });
   */
  addItems(items, addOpts) {
    this.gridMain.addItems(items, addOpts);
  }
  /**
   * 새로운 item을 Grid에 추가
   *
   *
   * @param item 추가할 item
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   * @example
   * // 특정 행의 내부에 생성
   * grid.createItem(item, {
   *   rowId: targetRowId,
   *   position: 'before'|'after'|'inside', <-- inside 트리 형식일때 사용.
   * });
   */
  createItem(item, addOpts) {
    this.gridMain.createItem(item, addOpts);
  }
  /**
   * remove row item
   *
   * @param {any[]} ids rowid
   */
  removeItems(ids) {
    this.gridMain.removeItems(ids);
  }
  setSize(width, height) {
    this.gridMain.setSize(width, height, true);
  }
  /**
   * 현재 선택된 정보를 반환
   *
   * header field 정보와 선택 모드에 따라 선택된 Row 또는 Cell 정보
   * 필요 시 숫자 필드의 합계 정보
   *
   * @param numberFieldSummary 숫자 필드의 정보를 포함할지 여부
   * @returns 선택 정보
   */
  getSelection(numberFieldSummary = false) {
    return this.gridMain.selectionInfo.selectionData("json", numberFieldSummary);
  }
  /**
   * 현재 선택된 row 를 반환
   * @returns 선택 row
   */
  getSelectedRows() {
    return this.gridMain.selectionInfo.selectionRows();
  }
  /**
   * 현재 선택된 row ids 를 반환
   * @returns 선택된 row id 배열
   */
  getSelectedRowIds() {
    return this.gridMain.selectionInfo.selectionRowIds();
  }
  /**
   * get checked items
   *
   * @returns {*}
   */
  getCheckedItems(names) {
    return this.gridMain.getCheckedItems(names);
  }
  /**
   * get checked items
   *
   * @returns {*}
   */
  getCheckedIds() {
    return this.gridMain.getCheckedIds();
  }
  /**
   * 현재 체크된 항목들에서 지정한 필드(`name`)의 값을 배열로 반환합니다.
   *
   * @param name - 반환할 필드명 (예: 'id', 'code', 'name' 등)
   * @returns 체크된 항목들의 해당 필드값 배열
   *
   * 예시:
   * - name이 "id"인 경우 → 체크된 row들의 id만 추출하여 배열로 반환
   */
  getCheckedItemByName(name) {
    return this.gridMain.getCheckedItemByName(name);
  }
  /**
   * set all check items
   *
   * @param {boolean} checked
   */
  setAllCheckedItems(checked) {
    this.gridMain.setAllCheckedItems(checked);
  }
  /**
   * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   *
   */
  setCheckedItemByValue(name, values) {
    this.gridMain.setCheckedItemByValue(name, values);
  }
  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  addCheckedItemByValue(name, values) {
    this.gridMain.addCheckedItemByValue(name, values);
  }
  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  unCheckedItemByValue(name, values) {
    this.gridMain.unCheckedItemByValue(name, values);
  }
  /**
   * 변경된 행 데이터를 반환
   *
   * 추가, 수정, 삭제 등 데이터 변경 상태가 있는 item만 반환
   *
   * @returns 변경된 행 데이터 배열
   */
  getChangedItems() {
    return this.gridMain.getChangedItems();
  }
  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (예: 'light', 'dark').
   *                    생략하거나 빈 값이면 그리드별 테마 지정을 해제하고 상위 요소의 data-daracl-theme 를 따른다.
   */
  setTheme(themeName) {
    this.gridMain.setTheme(themeName);
  }
  /**
   * 그리드 스타일 변경
   *
   *  BodyStyle 스타일
   *  ex) default, striped, borderless, list
   *
   * @param styleName 적용할 그리드 스타일
   *
   */
  setStyle(styleName) {
    this.gridMain.setGridStyle(styleName);
  }
  /**
   * grid height
   *
   * @public
   * @returns {*}
   */
  getGridHeight() {
    return this.gridMain.getCurrentSize().height;
  }
  copyData() {
    this.gridMain.getBody().copyData();
  }
  changeContextMenuHeader(label) {
    this.gridMain.getContextMenu().changeHeader(label);
  }
  expandAll() {
    this.gridMain.expandAll();
  }
  collapseAll() {
    this.gridMain.collapseAll();
  }
  search(searchText, opts) {
    return this.gridMain.getDataSearch().search(searchText, opts ?? {});
  }
  static setIcons(icons) {
    Object.assign(ALL_ICONS, icons);
  }
  /**
   * grid destroy
   *
   * @public
   */
  destroy() {
    this.gridMain.destroy();
  }
};
_DaraGrid.VERSION = `${"0.0.20"}`;
let DaraGrid = _DaraGrid;
exports.DaraGrid = DaraGrid;
exports.GroupPdfRenderer = GroupPdfRenderer;
exports.SimplePdfRenderer = SimplePdfRenderer;
exports.getExportCellValues = getExportCellValues;
exports.normalizeExportValue = normalizeExportValue;
//# sourceMappingURL=index-B5B90UkQ.js.map
