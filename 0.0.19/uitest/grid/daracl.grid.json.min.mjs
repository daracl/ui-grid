/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
const y = {
  left: "dg-text-al",
  center: "dg-text-ac"
}, b = "$all$", w = (e) => e === null || e === "" || typeof e > "u" || typeof e == "string" && (e === "" || e.replace(/\s/g, "") === ""), k = (e) => e === void 0, p = (e) => typeof e == "function", f = (e) => typeof e == "string", C = (e) => Number.parseInt(e, 10), H = (e) => Array.isArray(e), R = (e) => k(e) || e == null, E = (e, t) => (e || "").split(t), B = (e, t) => {
  const s = S(t), i = e.scroll.startIdx + s.r, n = s.c, l = e.dataManager.getViewItems()[i];
  return {
    r: s.r,
    c: n,
    rowIndex: i,
    field: e.currentFields[s.c],
    item: e.dataManager.getRowItem(l.id),
    viewItem: l
  };
}, S = (e) => {
  const t = (z(e) ?? "").split(",");
  return {
    r: C(t[0]),
    c: C(t[1])
  };
}, z = (e) => e.dataset.cellPosition, I = (e, t, s) => {
  const i = e.dataManager, n = i.getViewItems(), l = t.header.resize.maxWidth;
  let r = 0;
  const h = e.canvasContext, d = e.scroll.startIdx;
  let c = 0;
  for (let o = d, u = Math.min(e.dataInfo.rowLength, d + 100); o < u; o++) {
    const g = s.$renderer.getValue(i.getRowItem(n[o].id));
    if (R(g)) continue;
    const v = h.measureText(g);
    if (c = Math.max(v.width, c), l > 0 && c >= l)
      return l;
    r = Math.max(r, c);
  }
  return r + 16;
}, Z = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.listItem) == null ? void 0 : t.valueField) ?? "value";
}, A = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.listItem) == null ? void 0 : t.labelField) ?? "label";
};
function a(e, ...t) {
  return e.reduce((s, i, n) => {
    const l = t[n];
    return s + i + (l == null ? "" : String(l));
  }, "");
}
a`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`, a`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`, a`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`, a`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`, a`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`, a`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`, a`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, a`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`, a`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`, a`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`, a`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`, a`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`, a`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`, a`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`, a`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`, a`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`, a`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`, a`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`;
function x(e, t, s) {
  const i = /* @__PURE__ */ new Map(), n = f(e[0]), l = [];
  for (const r of e) {
    let h, d;
    if (n) {
      h = r, d = r;
      const c = {};
      c[s] = r, c[t] = r, l.push(c);
    } else
      h = (r == null ? void 0 : r[s]) ?? "", d = (r == null ? void 0 : r[t]) ?? "", l.push(r);
    i.set(h, d);
  }
  return { list: l, map: i };
}
function j(e, t, s) {
  const i = new Set(f(e) ? E(e || "", t) : e);
  if (i.has(b))
    return [...s.values()];
  const n = [];
  for (const l of i) {
    const r = s.get(l);
    r !== void 0 && n.push(r);
  }
  return n;
}
function F(e, t) {
  const i = /[0,.]+/.exec(t);
  if (!i) return t;
  const n = i[0], l = t.slice(0, t.indexOf(n)), r = t.slice(t.indexOf(n) + n.length), [h, d] = n.split("."), c = h.includes(",");
  let o = "";
  if (d) {
    const u = e.toFixed(d.length), [g, v] = u.split("."), m = v.replace(/0+$/, "");
    o = c ? V(g) : g, m.length > 0 && (o += "." + m);
  } else {
    const u = Math.round(e).toString();
    o = c ? V(u) : u;
  }
  return `${l}${o}${r}`;
}
function V(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function N(e, t) {
  return t.type == "number" && !isNaN(e) ? F(e, t.format ?? "0,0") : e;
}
class T {
  constructor(t, s) {
    this.field = t, this.fieldName = t.name, this.gridMain = s, this.language = this.gridMain.i18n(), this.enabledTooltip = s.options().enabledTooltip;
  }
  getClosestCellElement(t) {
    return t.closest(".dg-cell");
  }
  supportsInteraction() {
    return !1;
  }
  bindEvents(t, s, i) {
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
  getMinWidth(t, s) {
    return I(t, s, this.field);
  }
  applyRendererRefState(t, s) {
    const i = (s == null ? void 0 : s.hide) ?? !1, n = t.classList;
    if (n.contains("dg-hide") !== i && n.toggle("dg-hide", i), i) return !1;
    const l = (s == null ? void 0 : s.disabled) ?? !1;
    n.contains("dg-disabled") !== l && n.toggle("dg-disabled", l);
  }
}
class L extends T {
  constructor(t, s) {
    super(t, s), this.isClick = !1, this.cfg = this.gridMain.config();
    const i = t.renderer.refValue;
    this.isRefFunction = p(i), this.isRefString = f(i), this.isVauleFunction = p(t.getValue), this.isRefString || this.isRefFunction ? this.refValue = i : this.refValue = i ?? {}, this.isClick = p(this.field.renderer.click);
  }
  getRefValue(t, s) {
    return this.isRefFunction ? this.refValue.call(null, this.field, t, s) : this.isRefString ? { label: this.refValue } : this.refValue[t];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(t) {
    var i, n;
    const s = t[this.fieldName];
    return this.isVauleFunction ? (n = (i = this.field).getValue) == null ? void 0 : n.call(i, { field: this.field, item: t }) : this.field.displayFormat ? N(s, this.field.displayFormat) : w(s) && !w(this.field.defaultValue) ? this.field.defaultValue : s;
  }
  tooltip(t, s) {
    this.enabledTooltip && t.setAttribute("title", s);
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(t, s, i) {
    var n;
    this.isClick && ((n = this.field.renderer.click) == null || n.call(null, i));
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
class $ extends L {
  constructor(t, s) {
    var r, h;
    super(t, s), this.listItems = [];
    const i = this.field.editRenderer, n = A(i), l = Z(i);
    if (i != null && i.listItem) {
      this.valueDelimiter = ((r = i.listItem) == null ? void 0 : r.delimiter) ?? ",";
      const d = (h = i.listItem) == null ? void 0 : h.list;
      if (H(d)) {
        const c = x(d, n, l);
        this.listItems = c.list, this.valueLabelMap = c.map;
      } else p(d) && d({ init: !0 }, (c) => {
        const o = x(c, n, l);
        this.listItems = o.list, this.valueLabelMap = o.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(t, s) {
    const i = t.item, n = this.getValue(i), l = this.getRefValue(n, i);
    let r = s.firstElementChild;
    if (!r) {
      r = document.createElement("div"), r.className = "dg-cell-content";
      const c = document.createElement("div");
      c.className = "dg-cell-content-label " + this.field.$alignStyle;
      const o = document.createElement("div");
      o.className = "dg-cell-content-icon", r.appendChild(c), r.appendChild(o), s.appendChild(r), this.initEvent(r);
    }
    const h = r.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(r, l) === !1)
      return;
    let d = "";
    if (l)
      d = l.label ?? (f(l) ? l : "");
    else {
      let c = n;
      if (this.valueLabelMap.size > 0) {
        let o = this.getLabel(n);
        o.length < 1 && this.field.defaultValue && (o = this.getLabel(this.field.defaultValue)), c = o.join(this.valueDelimiter);
      }
      d = c;
    }
    this.tooltip(h, d), h.textContent = d;
  }
  getLabel(t) {
    return j(t, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(t) {
    this.cfg.eventManager.on({ el: t, type: "click" }, (s) => {
      const i = s.target, n = this.getClosestCellElement(i), l = B(this.cfg, n);
      this.click(s, n, l);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(t, s, i) {
    this.field.$editRenderer.render(i, s);
  }
  supportsEdit() {
    return !0;
  }
  alignStyle() {
    return y.center;
  }
  getMinWidth(t, s) {
    return 70;
  }
}
function M(e) {
  return e == null ? "" : e instanceof Date ? e.toISOString() : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function D(e, t) {
  return e.map((s) => {
    var l, r, h, d, c;
    const i = s.$renderer;
    if (((l = s.renderer) == null ? void 0 : l.type) === "password") return "********";
    if (((r = s.renderer) == null ? void 0 : r.type) === "hidden") return "";
    const n = i.getValue(t);
    if (i instanceof L && ["dropdown", "link", "button"].includes((h = s.renderer) == null ? void 0 : h.type)) {
      const o = i.getRefValue(n, t);
      if (typeof o == "string") return o;
      if (o != null && o.hide) return "";
      if ((o == null ? void 0 : o.label) !== void 0) return M(o.label);
      if (i instanceof $) {
        let u = i.getLabel(n);
        if (u.length === 0 && s.defaultValue && (u = i.getLabel(s.defaultValue)), u.length > 0) return u.join(((c = (d = s.editRenderer) == null ? void 0 : d.listItem) == null ? void 0 : c.delimiter) ?? ",");
      }
    }
    return M(n);
  });
}
function O(e, t, s, i) {
  const n = URL.createObjectURL(e), l = document.createElement("a"), r = t.trim() || s;
  l.href = n, l.download = r.toLowerCase().endsWith(`.${i}`) ? r : `${r}.${i}`, l.style.display = "none";
  try {
    document.body.appendChild(l), l.click();
  } finally {
    l.remove(), setTimeout(() => URL.revokeObjectURL(n), 0);
  }
}
class P {
  convert(t, s = {}) {
    const i = s.space ?? 2;
    if (!Number.isInteger(i) || i < 0 || i > 10)
      throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");
    return new Blob([JSON.stringify(t, null, i)], { type: "application/json;charset=utf-8" });
  }
  download(t, s = "export.json") {
    O(t, s, "export.json", "json");
  }
}
function U(e, t = {}) {
  return e.viewItems.filter((s) => !s.groupRowType).map((s) => {
    const i = e.getRowItem(s.id), n = t.useFormatter ? D(e.fields, i) : void 0;
    return Object.fromEntries(
      e.fields.map((l, r) => [l.name, n ? n[r] : i[l.name] ?? null])
    );
  });
}
export {
  P as JsonConverter,
  U as createJsonData
};
