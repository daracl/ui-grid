function downloadExport(blob, fileName, defaultFileName, extension) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const name = fileName.trim() || defaultFileName;
  anchor.href = url;
  anchor.download = name.toLowerCase().endsWith(`.${extension}`) ? name : `${name}.${extension}`;
  anchor.style.display = "none";
  try {
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
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
const TEXT_ALIGN_STYLE = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
};
const ALL_SELECT_VALUE = "$all$";
const isBlank = (value) => {
  if (value === null) return true;
  if (value === "") return true;
  if (typeof value === "undefined") return true;
  if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;
  return false;
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
const intValue = (val) => {
  return Number.parseInt(val, 10);
};
const isArray = (value) => {
  return Array.isArray(value);
};
const isEmpty = (value) => isUndefined(value) || value == null;
const stringSplit = (value, delimiter) => {
  return (value || "").split(delimiter);
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
const valuesValueKey = (rendererInfo) => {
  var _a;
  return ((_a = rendererInfo == null ? void 0 : rendererInfo.listItem) == null ? void 0 : _a.valueField) ?? "value";
};
const valuesLabelKey = (rendererInfo) => {
  var _a;
  return ((_a = rendererInfo == null ? void 0 : rendererInfo.listItem) == null ? void 0 : _a.labelField) ?? "label";
};
function html(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i];
    return result + str + (value == null ? "" : String(value));
  }, "");
}
({
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
  </svg>`
});
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
class DropdownRenderer extends ViewCellRenderer {
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
      if (renderer instanceof DropdownRenderer) {
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
function columnName(index) {
  let name = "";
  for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(65 + (value - 1) % 26) + name;
  }
  return name;
}
function createExcelData(context, rowSpanFields = []) {
  var _a;
  const renderer = context.groupingFields.length ? new GroupPdfRenderer(context) : new SimplePdfRenderer(context);
  const table = renderer.render();
  const offset = context.lineNumberField ? 1 : 0;
  const hasTree = context.fields.some((field) => {
    var _a2;
    return ((_a2 = field.renderer) == null ? void 0 : _a2.type) === "tree";
  });
  const depths = context.viewItems.map((item) => Math.max(0, Math.floor(item.depth ?? 0)));
  const cellIndents = hasTree ? context.viewItems.map((_, index) => [
    ...offset ? [0] : [],
    ...context.fields.map((field) => {
      var _a2;
      return ((_a2 = field.renderer) == null ? void 0 : _a2.type) === "tree" ? Math.min(250, depths[index]) : 0;
    })
  ]) : void 0;
  const rows = table.rows.map((row, rowIndex) => {
    const values = [...row];
    const viewItem = context.viewItems[rowIndex];
    if (offset) values[0] = (context.lineNumberStart ?? 0) + rowIndex + 1;
    context.fields.forEach((field, index) => {
      var _a2, _b;
      if (viewItem.groupRowType) {
        const sum = (_a2 = viewItem.groupSums) == null ? void 0 : _a2[field.name];
        if (sum !== void 0 && context.sumFields.includes(field.name) && row[index + offset] === String(sum)) {
          values[index + offset] = sum;
        }
      } else if (!field.displayFormat && ["text", "number"].includes(((_b = field.renderer) == null ? void 0 : _b.type) ?? "text")) {
        const value = field.$renderer.getValue(context.getRowItem(viewItem.id));
        if ((typeof value === "number" && Number.isFinite(value) || typeof value === "boolean") && row[index + offset] === String(value)) {
          values[index + offset] = value;
        }
      }
    });
    return values;
  });
  const merges = [];
  (_a = table.cellCharts) == null ? void 0 : _a.forEach(
    (charts, row) => charts.forEach((chart, column) => {
      if (chart) rows[row][column] = "";
    })
  );
  rowSpanFields.forEach((name, level) => {
    var _a2;
    const column = context.fields.findIndex((field) => field.name === name);
    if (column < 0) return;
    for (let start = 0; start < context.viewItems.length; ) {
      const first = context.viewItems[start];
      if (first.groupRowType) {
        start++;
        continue;
      }
      const item = context.getRowItem(first.id);
      let end = start + 1;
      while (end < context.viewItems.length && !context.viewItems[end].groupRowType && rowSpanFields.slice(0, level + 1).every((key) => Object.is(item[key], context.getRowItem(context.viewItems[end].id)[key])))
        end++;
      if (end - start > 1) {
        const letter = columnName(column + offset);
        merges.push(`${letter}${start + 2}:${letter}${end + 1}`);
        for (let index = start + 1; index < end; index++) {
          rows[index][column + offset] = "";
          if ((_a2 = table.cellCharts) == null ? void 0 : _a2[index]) table.cellCharts[index][column + offset] = void 0;
        }
      }
      start = end;
    }
  });
  return {
    ...table,
    rows,
    merges,
    cellIndents,
    outlineLevels: hasTree ? depths.map((depth) => Math.min(7, depth)) : void 0,
    rowHeight: context.rowHeight
  };
}
const encoder = new TextEncoder();
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value >>> 1 ^ (value & 1 ? 3988292384 : 0);
  return value >>> 0;
});
function createZip(files) {
  const entries = Object.entries(files).map(([name, text]) => ({
    name: encoder.encode(name),
    data: encoder.encode(text)
  }));
  const size = entries.reduce((total, entry) => total + entry.data.length + entry.name.length * 2 + 76, 22);
  if (entries.length > 65535 || size > 4294967295) throw new RangeError("XLSX exceeds ZIP32 limits");
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  const offsets = [];
  const checksums = [];
  let offset = 0;
  for (const entry of entries) {
    let crc = 4294967295;
    for (const byte of entry.data) crc = crc >>> 8 ^ crcTable[(crc ^ byte) & 255];
    crc = (crc ^ 4294967295) >>> 0;
    offsets.push(offset);
    checksums.push(crc);
    view.setUint32(offset, 67324752, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 2048, true);
    view.setUint16(offset + 12, 33, true);
    view.setUint32(offset + 14, crc, true);
    view.setUint32(offset + 18, entry.data.length, true);
    view.setUint32(offset + 22, entry.data.length, true);
    view.setUint16(offset + 26, entry.name.length, true);
    bytes.set(entry.name, offset + 30);
    bytes.set(entry.data, offset + 30 + entry.name.length);
    offset += 30 + entry.name.length + entry.data.length;
  }
  const directoryOffset = offset;
  entries.forEach((entry, index) => {
    view.setUint32(offset, 33639248, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 2048, true);
    view.setUint16(offset + 14, 33, true);
    view.setUint32(offset + 16, checksums[index], true);
    view.setUint32(offset + 20, entry.data.length, true);
    view.setUint32(offset + 24, entry.data.length, true);
    view.setUint16(offset + 28, entry.name.length, true);
    view.setUint32(offset + 42, offsets[index], true);
    bytes.set(entry.name, offset + 46);
    offset += 46 + entry.name.length;
  });
  view.setUint32(offset, 101010256, true);
  view.setUint16(offset + 8, entries.length, true);
  view.setUint16(offset + 10, entries.length, true);
  view.setUint32(offset + 12, offset - directoryOffset, true);
  view.setUint32(offset + 16, directoryOffset, true);
  return bytes;
}
function createChartDrawing(data, color2, xml2, headerCount = 1) {
  var _a;
  const anchors = [];
  let id = 1;
  const rgb = (value, fallback = "FF222222") => color2(value, fallback).slice(2);
  const integer = (value) => Math.round(value);
  (_a = data.cellCharts) == null ? void 0 : _a.forEach(
    (charts, row) => charts.forEach((chart, column) => {
      var _a2, _b;
      if (!chart || !data.columns[column]) return;
      const width = Math.max(12, data.columns[column].width ?? 100);
      const height = Math.max(12, data.rowHeight ?? 26);
      const w = width - 8, h = height - 8;
      const shapes = [];
      const transform = (x, y, cx, cy) => `<a:xfrm><a:off x="${integer(x)}" y="${integer(y)}"/><a:ext cx="${Math.max(1, integer(cx))}" cy="${Math.max(
        1,
        integer(cy)
      )}"/></a:xfrm>`;
      const shape = (geometry, x, y, cx, cy, fill) => {
        shapes.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="${geometry} ${id}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${transform(
            x,
            y,
            cx,
            cy
          )}<a:prstGeom prst="${geometry}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:noFill/></a:ln></xdr:spPr></xdr:sp>`
        );
      };
      if (chart.type === "bar") {
        if (![chart.value, chart.minimum, chart.maximum].every(Number.isFinite)) return;
        const min = Math.min(chart.minimum, chart.maximum), max = Math.max(chart.minimum, chart.maximum);
        const range = max - min || 1;
        const value = Math.max(min, Math.min(max, chart.value));
        const zero = min < 0 && max > 0 ? -min / range * w : min >= 0 ? 0 : w;
        const extent = min < 0 && max > 0 ? Math.abs(value) / range * w : min >= 0 ? (value - min) / range * w : Math.abs(value - max) / range * w;
        if (extent > 0)
          shape("rect", 4 + zero - (min < 0 && value < 0 || max <= 0 ? extent : 0), 4, extent, h, rgb(chart.color));
        const textColor = rgb((_b = (_a2 = data.cellTextColors) == null ? void 0 : _a2[row]) == null ? void 0 : _b[column]);
        shapes.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="Bar label"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr>${transform(
            0,
            0,
            width,
            height
          )}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="ko-KR" sz="900"><a:solidFill><a:srgbClr val="${textColor}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${xml2(
            chart.label
          )}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></xdr:txBody></xdr:sp>`
        );
      } else {
        const values = chart.values;
        if (!values.length || !values.every(Number.isFinite)) return;
        let min = Infinity, max = -Infinity;
        for (const value of values) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
        const range = max - min || 1;
        const pointColor = (value, index) => value === max ? "28A745" : value === min ? "DC3545" : index === 0 || index === values.length - 1 ? "0000FF" : "FF9900";
        if (chart.type === "sparklineBar") {
          const step = w / values.length;
          values.forEach((value, index) => {
            const barHeight = (value - min) / range * h;
            if (barHeight > 0)
              shape(
                "rect",
                4 + index * step + Math.min(1, step / 4),
                4 + h - barHeight,
                Math.max(0.5, step - 2),
                barHeight,
                pointColor(value, index)
              );
          });
        } else {
          const points = values.map((value, index) => ({
            x: 4 + (values.length > 1 ? index / (values.length - 1) * w : w / 2),
            y: 4 + (1 - (value - min) / range) * h
          }));
          const path = points.map(
            (point, index) => `<a:${index ? "lnTo" : "moveTo"}><a:pt x="${integer(point.x)}" y="${integer(point.y)}"/></a:${index ? "lnTo" : "moveTo"}>`
          ).join("");
          shapes.push(
            `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${id++}" name="Sparkline"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${transform(
              0,
              0,
              width,
              height
            )}<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${integer(
              width
            )}" h="${integer(
              height
            )}" fill="none">${path}</a:path></a:pathLst></a:custGeom><a:noFill/><a:ln w="7144"><a:solidFill><a:srgbClr val="007ACC"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>`
          );
          points.forEach(
            (point, index) => shape("ellipse", point.x - 1.875, point.y - 1.875, 3.75, 3.75, pointColor(values[index], index))
          );
        }
      }
      if (!shapes.length) return;
      anchors.push(
        `<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${column}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${row + headerCount}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${column + 1}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${row + headerCount + 1}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="${id++}" name="Cell chart ${row + headerCount + 1}-${column + 1}"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${integer(
          width * 9525
        )}" cy="${integer(height * 9525)}"/><a:chOff x="0" y="0"/><a:chExt cx="${integer(width)}" cy="${integer(
          height
        )}"/></a:xfrm></xdr:grpSpPr>${shapes.join("")}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>`
      );
    })
  );
  return anchors.length ? `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${anchors.join(
    ""
  )}</xdr:wsDr>` : void 0;
}
const MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const xml = (value) => Array.from(value).filter((char) => {
  const code = char.codePointAt(0);
  return code === 9 || code === 10 || code === 13 || code >= 32 && code <= 55295 || code >= 57344 && code <= 65533 || code >= 65536;
}).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function color(value, fallback) {
  if (!value) return fallback;
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) return "FF" + (hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1]).toUpperCase();
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgb) return fallback;
  const parts = rgb[1].split(/[,\s/]+/).filter(Boolean);
  const alpha = parts[3] === void 0 ? 1 : Math.min(1, Math.max(0, parseFloat(parts[3]) / (parts[3].endsWith("%") ? 100 : 1)));
  const channels = parts.slice(0, 3).map((part) => Math.max(0, Math.min(255, parseFloat(part) * (part.endsWith("%") ? 2.55 : 1))));
  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel)) || !Number.isFinite(alpha))
    return fallback;
  return "FF" + channels.map(
    (channel) => Math.round(channel * alpha + 255 * (1 - alpha)).toString(16).padStart(2, "0")
  ).join("").toUpperCase();
}
class ExcelConverter {
  convert(data, options = {}) {
    var _a, _b, _c;
    const headerCount = ((_a = data.headerRows) == null ? void 0 : _a.length) || 1;
    if (!data.columns.length || data.columns.length > 16384 || data.rows.length + headerCount > 1048576)
      throw new RangeError("Invalid XLSX worksheet dimensions");
    const sheetName = options.sheetName ?? "Grid";
    if (!sheetName.trim() || sheetName.length > 31 || /[\\/*?:\[\]]/.test(sheetName) || /^'|'$/.test(sheetName))
      throw new Error("Invalid Excel sheet name");
    const fonts = ['<font><sz val="11"/><color rgb="FF222222"/><name val="Calibri"/></font>'];
    const fills = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>'
    ];
    const borders = ["<border><left/><right/><top/><bottom/><diagonal/></border>"];
    const xfs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
    const styleCache = /* @__PURE__ */ new Map();
    const register = (list, value) => {
      const found = list.indexOf(value);
      if (found >= 0) return found;
      list.push(value);
      return list.length - 1;
    };
    const style = (header, column, row, headerCell) => {
      var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      const foreground = color(
        header ? (headerCell == null ? void 0 : headerCell.textColor) ?? ((_a2 = data.headerTextColors) == null ? void 0 : _a2[column]) : (_c2 = (_b2 = data.cellTextColors) == null ? void 0 : _b2[row]) == null ? void 0 : _c2[column],
        "FF222222"
      );
      const background = header ? (headerCell == null ? void 0 : headerCell.background) ?? ((_d = data.headerBackgrounds) == null ? void 0 : _d[column]) ?? "#e9edf2" : (_f = (_e = data.cellBackgrounds) == null ? void 0 : _e[row]) == null ? void 0 : _f[column];
      const gradient = header ? (headerCell == null ? void 0 : headerCell.gradient) ?? ((_g = data.headerGradients) == null ? void 0 : _g[column]) : void 0;
      const sides = (header ? (headerCell == null ? void 0 : headerCell.borders) ?? ((_h = data.headerCellBorders) == null ? void 0 : _h[column]) : (_j = (_i = data.cellBorders) == null ? void 0 : _i[row]) == null ? void 0 : _j[column]) ?? {
        right: { color: "#cdcdcd", width: 1 },
        bottom: { color: "#cdcdcd", width: 1 }
      };
      const indent = header ? 0 : Math.max(0, Math.min(250, Math.floor(((_l = (_k = data.cellIndents) == null ? void 0 : _k[row]) == null ? void 0 : _l[column]) ?? 0)));
      const align = indent ? "left" : header ? "center" : data.columns[column].align ?? "left";
      const key = JSON.stringify([header, foreground, background, gradient, sides, align, indent]);
      const cached = styleCache.get(key);
      if (cached !== void 0) return cached;
      const font = register(
        fonts,
        `<font><sz val="11"/><color rgb="${foreground}"/><name val="Calibri"/>${header ? "<b/>" : ""}</font>`
      );
      const fill = gradient ? register(
        fills,
        `<fill><gradientFill degree="90"><stop position="0"><color rgb="${color(
          gradient.startColor,
          "FFFFFFFF"
        )}"/></stop><stop position="1"><color rgb="${color(
          gradient.endColor,
          "FFF1F1F1"
        )}"/></stop></gradientFill></fill>`
      ) : background ? register(
        fills,
        `<fill><patternFill patternType="solid"><fgColor rgb="${color(
          background,
          "FFFFFFFF"
        )}"/><bgColor indexed="64"/></patternFill></fill>`
      ) : 0;
      const border = register(
        borders,
        "<border>" + ["left", "right", "top", "bottom"].map((side) => {
          const value = sides[side];
          if (!value || !Number.isFinite(value.width) || value.width <= 0) return `<${side}/>`;
          const kind = value.style === "dashed" || value.style === "dotted" || value.style === "double" ? value.style : value.width >= 3 ? "thick" : value.width >= 2 ? "medium" : "thin";
          return `<${side} style="${kind}"><color rgb="${color(value.color, "FFCDCDCD")}"/></${side}>`;
        }).join("") + "<diagonal/></border>"
      );
      const index = xfs.length;
      xfs.push(
        `<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${align}" vertical="center" wrapText="1"${indent ? ` indent="${indent}"` : ""}/></xf>`
      );
      styleCache.set(key, index);
      return index;
    };
    const cell = (value, row, column) => {
      var _a2;
      const reference = `${columnName(column)}${row + 1}`;
      const attrs = `r="${reference}" s="${style(
        row < headerCount,
        column,
        row - headerCount,
        (_a2 = headerOwners[row]) == null ? void 0 : _a2[column]
      )}"`;
      if (typeof value === "number" && Number.isFinite(value)) return `<c ${attrs}><v>${value}</v></c>`;
      if (typeof value === "boolean") return `<c ${attrs} t="b"><v>${value ? 1 : 0}</v></c>`;
      const text = String(value ?? "");
      if (text.length > 32767) throw new RangeError(`Excel cell ${reference} exceeds 32767 characters`);
      return `<c ${attrs} t="inlineStr"><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
    };
    const headers = Array.from({ length: headerCount }, () => data.columns.map(() => ""));
    const headerOwners = Array.from({ length: headerCount }, () => []);
    const headerMerges = [];
    if ((_b = data.headerRows) == null ? void 0 : _b.length) {
      data.headerRows.forEach(
        (cells, row) => cells.forEach((item) => {
          headers[row][item.column] = item.label;
          for (let r = row; r < row + item.rowSpan; r++) {
            for (let c = item.column; c < item.column + item.colSpan; c++) headerOwners[r][c] = item;
          }
          if (item.rowSpan > 1 || item.colSpan > 1) {
            headerMerges.push(
              `${columnName(item.column)}${row + 1}:${columnName(item.column + item.colSpan - 1)}${row + item.rowSpan}`
            );
          }
        })
      );
    } else headers[0] = data.columns.map((column) => column.label ?? "");
    const rowHeight = Math.max(12, data.rowHeight ?? 26) * 0.75;
    const sheetRows = [...headers, ...data.rows].map(
      (row, rowIndex) => `<row r="${rowIndex + 1}" ht="${rowHeight}" customHeight="1"${rowIndex >= headerCount && data.outlineLevels ? ` outlineLevel="${data.outlineLevels[rowIndex - headerCount]}"` : ""}>${data.columns.map((_, column) => cell(row[column] ?? "", rowIndex, column)).join("")}</row>`
    ).join("");
    const end = `${columnName(data.columns.length - 1)}${data.rows.length + headerCount}`;
    const merges = options.mergeCells === false ? [] : [
      ...headerMerges,
      ...data.merges.map(
        (ref) => ref.replace(/([A-Z]+)(\d+)/g, (_, column, row) => `${column}${Number(row) + headerCount - 1}`)
      )
    ];
    const drawing = createChartDrawing(data, color, xml, headerCount);
    const outlineLevel = ((_c = data.outlineLevels) == null ? void 0 : _c.reduce((max, level) => Math.max(max, level), 0)) ?? 0;
    const worksheet = `<worksheet xmlns="${NS}" xmlns:r="${REL}">${data.outlineLevels ? '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' : ""}<dimension ref="A1:${end}"/><sheetViews><sheetView workbookViewId="0">${options.freezeHeader === false ? "" : `<pane ySplit="${headerCount}" topLeftCell="A${headerCount + 1}" activePane="bottomLeft" state="frozen"/>`}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="${rowHeight}"${outlineLevel ? ` outlineLevelRow="${outlineLevel}"` : ""}/><cols>${data.columns.map(
      (column, index) => `<col min="${index + 1}" max="${index + 1}" width="${Math.min(
        255,
        Math.max(1, ((column.width ?? 100) - 5) / 7)
      ).toFixed(2)}" customWidth="1"/>`
    ).join("")}</cols><sheetData>${sheetRows}</sheetData>${options.autoFilter ? `<autoFilter ref="A${headerCount}:${end}"/>` : ""}${merges.length ? `<mergeCells count="${merges.length}">${merges.map((ref) => `<mergeCell ref="${xml(ref)}"/>`).join("")}</mergeCells>` : ""}${drawing ? '<drawing r:id="rId1"/>' : ""}</worksheet>`;
    const files = {
      "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<workbook xmlns="${NS}" xmlns:r="${REL}"><sheets><sheet name="${xml(
        sheetName
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${REL}/styles" Target="styles.xml"/></Relationships>`,
      "xl/styles.xml": `<styleSheet xmlns="${NS}"><fonts count="${fonts.length}">${fonts.join(
        ""
      )}</fonts><fills count="${fills.length}">${fills.join("")}</fills><borders count="${borders.length}">${borders.join(
        ""
      )}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join(
        ""
      )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      "xl/worksheets/sheet1.xml": worksheet
    };
    if (drawing) {
      files["[Content_Types].xml"] = files["[Content_Types].xml"].replace(
        "</Types>",
        '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'
      );
      files["xl/drawings/drawing1.xml"] = drawing;
      files["xl/worksheets/_rels/sheet1.xml.rels"] = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`;
    }
    return new Blob([createZip(files)], { type: MIME });
  }
  download(blob, fileName = "grid-export.xlsx") {
    downloadExport(blob, fileName, "grid-export.xlsx", "xlsx");
  }
}
export {
  ExcelConverter,
  createExcelData
};
//# sourceMappingURL=daracl.grid.excel.mjs.map
