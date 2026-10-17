/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
const y = {
  left: "dg-text-al",
  center: "dg-text-ac"
}, L = "$all$", C = (e) => e === null || e === "" || typeof e > "u" || typeof e == "string" && (e === "" || e.replace(/\s/g, "") === ""), k = (e) => e === void 0, p = (e) => typeof e == "function", f = (e) => typeof e == "string", x = (e) => Number.parseInt(e, 10), E = (e) => Array.isArray(e), R = (e) => k(e) || e == null, H = (e, t) => (e || "").split(t), B = (e, t) => {
  const i = S(t), s = e.scroll.startIdx + i.r, n = i.c, l = e.dataManager.getViewItems()[s];
  return {
    r: i.r,
    c: n,
    rowIndex: s,
    field: e.currentFields[i.c],
    item: e.dataManager.getRowItem(l.id),
    viewItem: l
  };
}, S = (e) => {
  const t = (z(e) ?? "").split(",");
  return {
    r: x(t[0]),
    c: x(t[1])
  };
}, z = (e) => e.dataset.cellPosition, I = (e, t, i) => {
  const s = e.dataManager, n = s.getViewItems(), l = t.header.resize.maxWidth;
  let r = 0;
  const d = e.canvasContext, c = e.scroll.startIdx;
  let o = 0;
  for (let a = c, u = Math.min(e.dataInfo.rowLength, c + 100); a < u; a++) {
    const g = i.$renderer.getValue(s.getRowItem(n[a].id));
    if (R(g)) continue;
    const v = d.measureText(g);
    if (o = Math.max(v.width, o), l > 0 && o >= l)
      return l;
    r = Math.max(r, o);
  }
  return r + 16;
}, A = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.listItem) == null ? void 0 : t.valueField) ?? "value";
}, F = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.listItem) == null ? void 0 : t.labelField) ?? "label";
};
function h(e, ...t) {
  return e.reduce((i, s, n) => {
    const l = t[n];
    return i + s + (l == null ? "" : String(l));
  }, "");
}
h`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`, h`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`, h`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`, h`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`, h`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`, h`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`, h`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, h`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`, h`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`, h`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`, h`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`, h`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`, h`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`, h`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`, h`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`, h`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`, h`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`, h`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`;
function V(e, t, i) {
  const s = /* @__PURE__ */ new Map(), n = f(e[0]), l = [];
  for (const r of e) {
    let d, c;
    if (n) {
      d = r, c = r;
      const o = {};
      o[i] = r, o[t] = r, l.push(o);
    } else
      d = (r == null ? void 0 : r[i]) ?? "", c = (r == null ? void 0 : r[t]) ?? "", l.push(r);
    s.set(d, c);
  }
  return { list: l, map: s };
}
function Z(e, t, i) {
  const s = new Set(f(e) ? H(e || "", t) : e);
  if (s.has(L))
    return [...i.values()];
  const n = [];
  for (const l of s) {
    const r = i.get(l);
    r !== void 0 && n.push(r);
  }
  return n;
}
function $(e, t) {
  const s = /[0,.]+/.exec(t);
  if (!s) return t;
  const n = s[0], l = t.slice(0, t.indexOf(n)), r = t.slice(t.indexOf(n) + n.length), [d, c] = n.split("."), o = d.includes(",");
  let a = "";
  if (c) {
    const u = e.toFixed(c.length), [g, v] = u.split("."), w = v.replace(/0+$/, "");
    a = o ? M(g) : g, w.length > 0 && (a += "." + w);
  } else {
    const u = Math.round(e).toString();
    a = o ? M(u) : u;
  }
  return `${l}${a}${r}`;
}
function M(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function j(e, t) {
  return t.type == "number" && !isNaN(e) ? $(e, t.format ?? "0,0") : e;
}
class T {
  constructor(t, i) {
    this.field = t, this.fieldName = t.name, this.gridMain = i, this.language = this.gridMain.i18n(), this.enabledTooltip = i.options().enabledTooltip;
  }
  getClosestCellElement(t) {
    return t.closest(".dg-cell");
  }
  supportsInteraction() {
    return !1;
  }
  bindEvents(t, i, s) {
    return !1;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return y.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @param checkWidth
   * @returns
   */
  getMinWidth(t, i) {
    return I(t, i, this.field);
  }
  applyRendererRefState(t, i) {
    const s = (i == null ? void 0 : i.hide) ?? !1, n = t.classList;
    if (n.contains("dg-hide") !== s && n.toggle("dg-hide", s), s) return !1;
    const l = (i == null ? void 0 : i.disabled) ?? !1;
    n.contains("dg-disabled") !== l && n.toggle("dg-disabled", l);
  }
}
class b extends T {
  constructor(t, i) {
    super(t, i), this.isClick = !1, this.cfg = this.gridMain.config();
    const s = t.renderer.refValue;
    this.isRefFunction = p(s), this.isRefString = f(s), this.isVauleFunction = p(t.getValue), this.isRefString || this.isRefFunction ? this.refValue = s : this.refValue = s ?? {}, this.isClick = p(this.field.renderer.click);
  }
  getRefValue(t, i) {
    return this.isRefFunction ? this.refValue.call(null, this.field, t, i) : this.isRefString ? { label: this.refValue } : this.refValue[t];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(t) {
    var s, n;
    const i = t[this.fieldName];
    return this.isVauleFunction ? (n = (s = this.field).getValue) == null ? void 0 : n.call(s, { field: this.field, item: t }) : this.field.displayFormat ? j(i, this.field.displayFormat) : C(i) && !C(this.field.defaultValue) ? this.field.defaultValue : i;
  }
  tooltip(t, i) {
    this.enabledTooltip && t.setAttribute("title", i);
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(t, i, s) {
    var n;
    this.isClick && ((n = this.field.renderer.click) == null || n.call(null, s));
  }
  /**
   * 랜더러가 editor 랜더러 인지 여부
   *
   * @returns {boolean}
   */
  supportsEdit() {
    return !1;
  }
  isClickEnabled() {
    return this.isClick;
  }
}
class D extends b {
  constructor(t, i) {
    var r, d;
    super(t, i), this.listItems = [];
    const s = this.field.editRenderer, n = F(s), l = A(s);
    if (s != null && s.listItem) {
      this.valueDelimiter = ((r = s.listItem) == null ? void 0 : r.delimiter) ?? ",";
      const c = (d = s.listItem) == null ? void 0 : d.list;
      if (E(c)) {
        const o = V(c, n, l);
        this.listItems = o.list, this.valueLabelMap = o.map;
      } else p(c) && c({ init: !0 }, (o) => {
        const a = V(o, n, l);
        this.listItems = a.list, this.valueLabelMap = a.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(t, i) {
    const s = t.item, n = this.getValue(s), l = this.getRefValue(n, s);
    let r = i.firstElementChild;
    if (!r) {
      r = document.createElement("div"), r.className = "dg-cell-content";
      const o = document.createElement("div");
      o.className = "dg-cell-content-label " + this.field.$alignStyle;
      const a = document.createElement("div");
      a.className = "dg-cell-content-icon", r.appendChild(o), r.appendChild(a), i.appendChild(r), this.initEvent(r);
    }
    const d = r.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(r, l) === !1)
      return;
    let c = "";
    if (l)
      c = l.label ?? (f(l) ? l : "");
    else {
      let o = n;
      if (this.valueLabelMap.size > 0) {
        let a = this.getLabel(n);
        a.length < 1 && this.field.defaultValue && (a = this.getLabel(this.field.defaultValue)), o = a.join(this.valueDelimiter);
      }
      c = o;
    }
    this.tooltip(d, c), d.textContent = c;
  }
  getLabel(t) {
    return Z(t, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(t) {
    this.cfg.eventManager.on({ el: t, type: "click" }, (i) => {
      const s = i.target, n = this.getClosestCellElement(s), l = B(this.cfg, n);
      this.click(i, n, l);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(t, i, s) {
    this.field.$editRenderer.render(s, i);
  }
  supportsEdit() {
    return !0;
  }
  alignStyle() {
    return y.center;
  }
  getMinWidth(t, i) {
    return 70;
  }
}
function m(e) {
  return e == null ? "" : e instanceof Date ? e.toISOString() : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function N(e, t) {
  return e.map((i) => {
    var l, r, d, c, o;
    const s = i.$renderer;
    if (((l = i.renderer) == null ? void 0 : l.type) === "password") return "********";
    if (((r = i.renderer) == null ? void 0 : r.type) === "hidden") return "";
    const n = s.getValue(t);
    if (s instanceof b && ["dropdown", "link", "button"].includes((d = i.renderer) == null ? void 0 : d.type)) {
      const a = s.getRefValue(n, t);
      if (typeof a == "string") return a;
      if (a != null && a.hide) return "";
      if ((a == null ? void 0 : a.label) !== void 0) return m(a.label);
      if (s instanceof D) {
        let u = s.getLabel(n);
        if (u.length === 0 && i.defaultValue && (u = s.getLabel(i.defaultValue)), u.length > 0) return u.join(((o = (c = i.editRenderer) == null ? void 0 : c.listItem) == null ? void 0 : o.delimiter) ?? ",");
      }
    }
    return m(n);
  });
}
function P(e, t, i, s) {
  const n = URL.createObjectURL(e), l = document.createElement("a"), r = t.trim() || i;
  l.href = n, l.download = r.toLowerCase().endsWith(`.${s}`) ? r : `${r}.${s}`, l.style.display = "none";
  try {
    document.body.appendChild(l), l.click();
  } finally {
    l.remove(), setTimeout(() => URL.revokeObjectURL(n), 0);
  }
}
class U {
  serialize(t, i, s = {}) {
    const n = s.delimiter ?? ",", l = s.quote ?? '"', r = s.lineEnding ?? `\r
`;
    if (!n || /[\r\n]/.test(n) || !l || Array.from(l).length !== 1 || /[\r\n]/.test(l) || n.includes(l))
      throw new RangeError("CSV delimiter 또는 quote 옵션이 올바르지 않습니다.");
    if (![`\r
`, `
`, "\r"].includes(r)) throw new RangeError("CSV lineEnding 옵션이 올바르지 않습니다.");
    const d = (c) => {
      let o = c == null ? s.nullValue ?? "" : m(c);
      return s.escapeFormula !== !1 && typeof c != "number" && (/^\s*[=+\-@]/.test(o) || /^[\t\r\n]/.test(o)) && (o = `'${o}`), o.includes(n) || o.includes(l) || /[\r\n]/.test(o) ? l + o.split(l).join(l + l) + l : o;
    };
    return [...s.includeHeader === !1 ? [] : [t], ...i].map((c) => c.map(d).join(n)).join(r);
  }
  convert(t, i, s = {}) {
    const n = s.encoding ?? "utf-8";
    if (n !== "utf-8" && n !== "utf-16le") throw new RangeError("지원하지 않는 CSV encoding입니다.");
    const l = (s.bom === !1 ? "" : "\uFEFF") + this.serialize(t, i, s);
    if (n === "utf-16le") {
      const r = new Uint8Array(l.length * 2);
      for (let d = 0; d < l.length; d++)
        r[d * 2] = l.charCodeAt(d) & 255, r[d * 2 + 1] = l.charCodeAt(d) >>> 8;
      return new Blob([r], { type: `text/csv;charset=${n}` });
    }
    return new Blob([l], { type: `text/csv;charset=${n}` });
  }
  download(t, i = "export.csv") {
    P(t, i, "export.csv", "csv");
  }
}
function O(e, t = {}) {
  const i = e.viewItems.filter((n) => !n.groupRowType), s = t.useFormatter !== !1;
  return {
    headers: e.fields.map((n) => n.label ?? n.name),
    rows: i.map((n) => {
      const l = e.getRowItem(n.id), r = s ? N(e.fields, l) : void 0;
      return e.fields.map((d, c) => {
        const o = l[d.name];
        if (o == null && (!r || !d.getValue && d.defaultValue == null))
          return t.nullValue ?? "";
        if (!r) return o;
        const a = r[c];
        return typeof o == "number" && a === String(o) ? o : a;
      });
    })
  };
}
export {
  U as CsvConverter,
  O as createCsvData
};
