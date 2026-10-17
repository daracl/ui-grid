/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
function be(t, e, s, n) {
  const o = URL.createObjectURL(t), l = document.createElement("a"), i = e.trim() || s;
  l.href = o, l.download = i.toLowerCase().endsWith(`.${n}`) ? i : `${i}.${n}`, l.style.display = "none";
  try {
    document.body.appendChild(l), l.click();
  } finally {
    l.remove(), setTimeout(() => URL.revokeObjectURL(o), 0);
  }
}
function D(t) {
  return t == null ? "" : t instanceof Date ? t.toISOString() : typeof t == "object" ? JSON.stringify(t) : String(t);
}
const Z = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
}, $e = "$all$", de = (t) => t === null || t === "" || typeof t > "u" || typeof t == "string" && (t === "" || t.replace(/\s/g, "") === ""), Ce = (t) => t === void 0, j = (t) => typeof t == "function", G = (t) => typeof t == "string", he = (t) => Number.parseInt(t, 10), Fe = (t) => Array.isArray(t), Me = (t) => Ce(t) || t == null, ke = (t, e) => (t || "").split(e), Se = (t, e) => {
  const s = Ve(e), n = t.scroll.startIdx + s.r, o = s.c, l = t.dataManager.getViewItems()[n];
  return {
    r: s.r,
    c: o,
    rowIndex: n,
    field: t.currentFields[s.c],
    item: t.dataManager.getRowItem(l.id),
    viewItem: l
  };
}, Ve = (t) => {
  const e = (Le(t) ?? "").split(",");
  return {
    r: he(e[0]),
    c: he(e[1])
  };
}, Le = (t) => t.dataset.cellPosition, Re = (t, e, s) => {
  const n = t.dataManager, o = n.getViewItems(), l = e.header.resize.maxWidth;
  let i = 0;
  const r = t.canvasContext, d = t.scroll.startIdx;
  let a = 0;
  for (let c = d, p = Math.min(t.dataInfo.rowLength, d + 100); c < p; c++) {
    const v = s.$renderer.getValue(n.getRowItem(o[c].id));
    if (Me(v)) continue;
    const x = r.measureText(v);
    if (a = Math.max(x.width, a), l > 0 && a >= l)
      return l;
    i = Math.max(i, a);
  }
  return i + 16;
}, Ie = (t) => {
  var e;
  return ((e = t == null ? void 0 : t.listItem) == null ? void 0 : e.valueField) ?? "value";
}, Te = (t) => {
  var e;
  return ((e = t == null ? void 0 : t.listItem) == null ? void 0 : e.labelField) ?? "label";
};
function b(t, ...e) {
  return t.reduce((s, n, o) => {
    const l = e[o];
    return s + n + (l == null ? "" : String(l));
  }, "");
}
b`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`, b`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`, b`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`, b`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`, b`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`, b`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`, b`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`;
function pe(t, e, s) {
  const n = /* @__PURE__ */ new Map(), o = G(t[0]), l = [];
  for (const i of t) {
    let r, d;
    if (o) {
      r = i, d = i;
      const a = {};
      a[s] = i, a[e] = i, l.push(a);
    } else
      r = (i == null ? void 0 : i[s]) ?? "", d = (i == null ? void 0 : i[e]) ?? "", l.push(i);
    n.set(r, d);
  }
  return { list: l, map: n };
}
function Ee(t, e, s) {
  const n = new Set(G(t) ? ke(t || "", e) : t);
  if (n.has($e))
    return [...s.values()];
  const o = [];
  for (const l of n) {
    const i = s.get(l);
    i !== void 0 && o.push(i);
  }
  return o;
}
function Pe(t, e) {
  const n = /[0,.]+/.exec(e);
  if (!n) return e;
  const o = n[0], l = e.slice(0, e.indexOf(o)), i = e.slice(e.indexOf(o) + o.length), [r, d] = o.split("."), a = r.includes(",");
  let c = "";
  if (d) {
    const p = t.toFixed(d.length), [v, x] = p.split("."), w = x.replace(/0+$/, "");
    c = a ? ge(v) : v, w.length > 0 && (c += "." + w);
  } else {
    const p = Math.round(t).toString();
    c = a ? ge(p) : p;
  }
  return `${l}${c}${i}`;
}
function ge(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Be(t, e) {
  return e.type == "number" && !isNaN(t) ? Pe(t, e.format ?? "0,0") : t;
}
class He {
  constructor(e, s) {
    this.field = e, this.fieldName = e.name, this.gridMain = s, this.language = this.gridMain.i18n(), this.enabledTooltip = s.options().enabledTooltip;
  }
  getClosestCellElement(e) {
    return e.closest(".dg-cell");
  }
  supportsInteraction() {
    return !1;
  }
  bindEvents(e, s, n) {
    return !1;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return Z.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @param checkWidth
   * @returns
   */
  getMinWidth(e, s) {
    return Re(e, s, this.field);
  }
  applyRendererRefState(e, s) {
    const n = (s == null ? void 0 : s.hide) ?? !1, o = e.classList;
    if (o.contains("dg-hide") !== n && o.toggle("dg-hide", n), n) return !1;
    const l = (s == null ? void 0 : s.disabled) ?? !1;
    o.contains("dg-disabled") !== l && o.toggle("dg-disabled", l);
  }
}
class me extends He {
  constructor(e, s) {
    super(e, s), this.isClick = !1, this.cfg = this.gridMain.config();
    const n = e.renderer.refValue;
    this.isRefFunction = j(n), this.isRefString = G(n), this.isVauleFunction = j(e.getValue), this.isRefString || this.isRefFunction ? this.refValue = n : this.refValue = n ?? {}, this.isClick = j(this.field.renderer.click);
  }
  getRefValue(e, s) {
    return this.isRefFunction ? this.refValue.call(null, this.field, e, s) : this.isRefString ? { label: this.refValue } : this.refValue[e];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(e) {
    var n, o;
    const s = e[this.fieldName];
    return this.isVauleFunction ? (o = (n = this.field).getValue) == null ? void 0 : o.call(n, { field: this.field, item: e }) : this.field.displayFormat ? Be(s, this.field.displayFormat) : de(s) && !de(this.field.defaultValue) ? this.field.defaultValue : s;
  }
  tooltip(e, s) {
    this.enabledTooltip && e.setAttribute("title", s);
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(e, s, n) {
    var o;
    this.isClick && ((o = this.field.renderer.click) == null || o.call(null, n));
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
class Ne extends me {
  constructor(e, s) {
    var i, r;
    super(e, s), this.listItems = [];
    const n = this.field.editRenderer, o = Te(n), l = Ie(n);
    if (n != null && n.listItem) {
      this.valueDelimiter = ((i = n.listItem) == null ? void 0 : i.delimiter) ?? ",";
      const d = (r = n.listItem) == null ? void 0 : r.list;
      if (Fe(d)) {
        const a = pe(d, o, l);
        this.listItems = a.list, this.valueLabelMap = a.map;
      } else j(d) && d({ init: !0 }, (a) => {
        const c = pe(a, o, l);
        this.listItems = c.list, this.valueLabelMap = c.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(e, s) {
    const n = e.item, o = this.getValue(n), l = this.getRefValue(o, n);
    let i = s.firstElementChild;
    if (!i) {
      i = document.createElement("div"), i.className = "dg-cell-content";
      const a = document.createElement("div");
      a.className = "dg-cell-content-label " + this.field.$alignStyle;
      const c = document.createElement("div");
      c.className = "dg-cell-content-icon", i.appendChild(a), i.appendChild(c), s.appendChild(i), this.initEvent(i);
    }
    const r = i.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(i, l) === !1)
      return;
    let d = "";
    if (l)
      d = l.label ?? (G(l) ? l : "");
    else {
      let a = o;
      if (this.valueLabelMap.size > 0) {
        let c = this.getLabel(o);
        c.length < 1 && this.field.defaultValue && (c = this.getLabel(this.field.defaultValue)), a = c.join(this.valueDelimiter);
      }
      d = a;
    }
    this.tooltip(r, d), r.textContent = d;
  }
  getLabel(e) {
    return Ee(e, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(e) {
    this.cfg.eventManager.on({ el: e, type: "click" }, (s) => {
      const n = s.target, o = this.getClosestCellElement(n), l = Se(this.cfg, o);
      this.click(s, o, l);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(e, s, n) {
    this.field.$editRenderer.render(n, s);
  }
  supportsEdit() {
    return !0;
  }
  alignStyle() {
    return Z.center;
  }
  getMinWidth(e, s) {
    return 70;
  }
}
function Ue(t, e) {
  return t.map((s) => {
    var l, i, r, d, a;
    const n = s.$renderer;
    if (((l = s.renderer) == null ? void 0 : l.type) === "password") return "********";
    if (((i = s.renderer) == null ? void 0 : i.type) === "hidden") return "";
    const o = n.getValue(e);
    if (n instanceof me && ["dropdown", "link", "button"].includes((r = s.renderer) == null ? void 0 : r.type)) {
      const c = n.getRefValue(o, e);
      if (typeof c == "string") return c;
      if (c != null && c.hide) return "";
      if ((c == null ? void 0 : c.label) !== void 0) return D(c.label);
      if (n instanceof Ne) {
        let p = n.getLabel(o);
        if (p.length === 0 && s.defaultValue && (p = n.getLabel(s.defaultValue)), p.length > 0) return p.join(((a = (d = s.editRenderer) == null ? void 0 : d.listItem) == null ? void 0 : a.delimiter) ?? ",");
      }
    }
    return D(o);
  });
}
class fe {
  constructor(e) {
    this.context = e;
  }
  render() {
    const { fields: e, viewItems: s } = this.context, n = {
      columns: [...this.context.lineNumberField ? [this.context.lineNumberField] : [], ...e].map((l) => ({
        name: l.name,
        label: l.label,
        width: l.$width,
        align: l.align ?? (l.$alignStyle === Z.right ? "right" : l.$alignStyle === Z.center ? "center" : "left")
      })),
      rows: s.map((l, i) => {
        const r = this.renderRow(l);
        return this.context.lineNumberField ? [String((this.context.lineNumberStart ?? 0) + i + 1), ...r] : r;
      })
    };
    this.context.tableBorders && (n.tableBorders = this.context.tableBorders);
    const o = this.context.getCellStyles;
    if (o) {
      const l = s.map((r, d) => o(r, d)), i = l.map((r) => r.backgrounds);
      i.some((r) => r.some((d) => d !== void 0)) && (n.cellBackgrounds = i), n.cellBorders = l.map((r) => r.borders), n.cellTextColors = l.map((r) => r.textColors ?? []);
    }
    if (this.context.getCellCharts) {
      const l = s.map((i, r) => {
        var d, a;
        return ((a = (d = this.context).getCellCharts) == null ? void 0 : a.call(d, i, r)) ?? [];
      });
      n.cellCharts = l.map((i) => this.context.lineNumberField ? [void 0, ...i] : i);
    }
    if (this.context.getHeaderCellBorders && (n.headerCellBorders = this.context.getHeaderCellBorders()), this.context.getHeaderCellStyles) {
      const l = this.context.getHeaderCellStyles();
      n.headerBackgrounds = l.backgrounds, n.headerTextColors = l.textColors, n.headerGradients = l.gradients;
    }
    return n;
  }
  renderRow(e) {
    if (e.groupRowType)
      return this.context.fields.map(() => "");
    const s = this.context.getRowItem(e.id);
    return this.renderDataRow(s);
  }
  renderDataRow(e) {
    return Ue(this.context.fields, e);
  }
}
class De extends fe {
  render() {
    return this.previousDataItem = void 0, super.render();
  }
  renderRow(e) {
    const { fields: s, getRowItem: n } = this.context;
    if (!e.groupRowType) {
      const r = n(e.id), d = this.renderDataRow(r), a = this.groupingFields();
      return a.forEach((c, p) => {
        const v = s.find((w) => w.name === c), x = this.previousDataItem !== void 0 && a.slice(0, p + 1).every((w) => {
          var f;
          return Object.is(r[w], (f = this.previousDataItem) == null ? void 0 : f[w]);
        });
        v && x && (d[s.indexOf(v)] = "");
      }), this.previousDataItem = r, d;
    }
    const o = super.renderRow(e), l = new Set(this.context.sumFields), i = s.find((r) => !l.has(r.name)) ?? s[0];
    if (e.groupRowType === "group") {
      const r = s.find((d) => d.name === e.groupField) ?? s[0];
      return r && (o[s.indexOf(r)] = `${e.groupField}: ${D(e.groupValue)}`), o;
    }
    if (e.groupRowType === "groupSummary") {
      const r = e.groupField ? s.find((d) => d.name === e.groupField) ?? i : i;
      r && (o[s.indexOf(r)] = e.groupField ? `${D(e.groupValue)} 합계` : "Subtotal");
    } else i && (o[s.indexOf(i)] = "Grand Total");
    for (const [r, d] of Object.entries(e.groupSums ?? {})) {
      const a = s.findIndex((c) => c.name === r);
      a >= 0 && (o[a] = D(d));
    }
    return o;
  }
  groupingFields() {
    return this.context.groupingFields;
  }
}
class ze extends fe {
}
function U(t) {
  let e = "";
  for (let s = t + 1; s > 0; s = Math.floor((s - 1) / 26))
    e = String.fromCharCode(65 + (s - 1) % 26) + e;
  return e;
}
function Ge(t, e = []) {
  var c;
  const n = (t.groupingFields.length ? new De(t) : new ze(t)).render(), o = t.lineNumberField ? 1 : 0, l = t.fields.some((p) => {
    var v;
    return ((v = p.renderer) == null ? void 0 : v.type) === "tree";
  }), i = t.viewItems.map((p) => Math.max(0, Math.floor(p.depth ?? 0))), r = l ? t.viewItems.map((p, v) => [
    ...o ? [0] : [],
    ...t.fields.map((x) => {
      var w;
      return ((w = x.renderer) == null ? void 0 : w.type) === "tree" ? Math.min(250, i[v]) : 0;
    })
  ]) : void 0, d = n.rows.map((p, v) => {
    const x = [...p], w = t.viewItems[v];
    return o && (x[0] = (t.lineNumberStart ?? 0) + v + 1), t.fields.forEach((f, k) => {
      var V, F;
      if (w.groupRowType) {
        const $ = (V = w.groupSums) == null ? void 0 : V[f.name];
        $ !== void 0 && t.sumFields.includes(f.name) && p[k + o] === String($) && (x[k + o] = $);
      } else if (!f.displayFormat && ["text", "number"].includes(((F = f.renderer) == null ? void 0 : F.type) ?? "text")) {
        const $ = f.$renderer.getValue(t.getRowItem(w.id));
        (typeof $ == "number" && Number.isFinite($) || typeof $ == "boolean") && p[k + o] === String($) && (x[k + o] = $);
      }
    }), x;
  }), a = [];
  return (c = n.cellCharts) == null || c.forEach(
    (p, v) => p.forEach((x, w) => {
      x && (d[v][w] = "");
    })
  ), e.forEach((p, v) => {
    var w;
    const x = t.fields.findIndex((f) => f.name === p);
    if (!(x < 0))
      for (let f = 0; f < t.viewItems.length; ) {
        const k = t.viewItems[f];
        if (k.groupRowType) {
          f++;
          continue;
        }
        const V = t.getRowItem(k.id);
        let F = f + 1;
        for (; F < t.viewItems.length && !t.viewItems[F].groupRowType && e.slice(0, v + 1).every(($) => Object.is(V[$], t.getRowItem(t.viewItems[F].id)[$])); )
          F++;
        if (F - f > 1) {
          const $ = U(x + o);
          a.push(`${$}${f + 2}:${$}${F + 1}`);
          for (let L = f + 1; L < F; L++)
            d[L][x + o] = "", (w = n.cellCharts) != null && w[L] && (n.cellCharts[L][x + o] = void 0);
        }
        f = F;
      }
  }), {
    ...n,
    rows: d,
    merges: a,
    cellIndents: r,
    outlineLevels: l ? i.map((p) => Math.min(7, p)) : void 0,
    rowHeight: t.rowHeight
  };
}
const ue = new TextEncoder(), Ae = Uint32Array.from({ length: 256 }, (t, e) => {
  let s = e;
  for (let n = 0; n < 8; n++) s = s >>> 1 ^ (s & 1 ? 3988292384 : 0);
  return s >>> 0;
});
function Oe(t) {
  const e = Object.entries(t).map(([a, c]) => ({
    name: ue.encode(a),
    data: ue.encode(c)
  })), s = e.reduce((a, c) => a + c.data.length + c.name.length * 2 + 76, 22);
  if (e.length > 65535 || s > 4294967295) throw new RangeError("XLSX exceeds ZIP32 limits");
  const n = new Uint8Array(s), o = new DataView(n.buffer), l = [], i = [];
  let r = 0;
  for (const a of e) {
    let c = 4294967295;
    for (const p of a.data) c = c >>> 8 ^ Ae[(c ^ p) & 255];
    c = (c ^ 4294967295) >>> 0, l.push(r), i.push(c), o.setUint32(r, 67324752, !0), o.setUint16(r + 4, 20, !0), o.setUint16(r + 6, 2048, !0), o.setUint16(r + 12, 33, !0), o.setUint32(r + 14, c, !0), o.setUint32(r + 18, a.data.length, !0), o.setUint32(r + 22, a.data.length, !0), o.setUint16(r + 26, a.name.length, !0), n.set(a.name, r + 30), n.set(a.data, r + 30 + a.name.length), r += 30 + a.name.length + a.data.length;
  }
  const d = r;
  return e.forEach((a, c) => {
    o.setUint32(r, 33639248, !0), o.setUint16(r + 4, 20, !0), o.setUint16(r + 6, 20, !0), o.setUint16(r + 8, 2048, !0), o.setUint16(r + 14, 33, !0), o.setUint32(r + 16, i[c], !0), o.setUint32(r + 20, a.data.length, !0), o.setUint32(r + 24, a.data.length, !0), o.setUint16(r + 28, a.name.length, !0), o.setUint32(r + 42, l[c], !0), n.set(a.name, r + 46), r += 46 + a.name.length;
  }), o.setUint32(r, 101010256, !0), o.setUint16(r + 8, e.length, !0), o.setUint16(r + 10, e.length, !0), o.setUint32(r + 12, r - d, !0), o.setUint32(r + 16, d, !0), n;
}
function je(t, e, s, n = 1) {
  var d;
  const o = [];
  let l = 1;
  const i = (a, c = "FF222222") => e(a, c).slice(2), r = (a) => Math.round(a);
  return (d = t.cellCharts) == null || d.forEach(
    (a, c) => a.forEach((p, v) => {
      var L, N;
      if (!p || !t.columns[v]) return;
      const x = Math.max(12, t.columns[v].width ?? 100), w = Math.max(12, t.rowHeight ?? 26), f = x - 8, k = w - 8, V = [], F = (y, C, M, S) => `<a:xfrm><a:off x="${r(y)}" y="${r(C)}"/><a:ext cx="${Math.max(1, r(M))}" cy="${Math.max(
        1,
        r(S)
      )}"/></a:xfrm>`, $ = (y, C, M, S, T, h) => {
        V.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${l++}" name="${y} ${l}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${F(
            C,
            M,
            S,
            T
          )}<a:prstGeom prst="${y}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${h}"/></a:solidFill><a:ln><a:noFill/></a:ln></xdr:spPr></xdr:sp>`
        );
      };
      if (p.type === "bar") {
        if (![p.value, p.minimum, p.maximum].every(Number.isFinite)) return;
        const y = Math.min(p.minimum, p.maximum), C = Math.max(p.minimum, p.maximum), M = C - y || 1, S = Math.max(y, Math.min(C, p.value)), T = y < 0 && C > 0 ? -y / M * f : y >= 0 ? 0 : f, h = y < 0 && C > 0 ? Math.abs(S) / M * f : y >= 0 ? (S - y) / M * f : Math.abs(S - C) / M * f;
        h > 0 && $("rect", 4 + T - (y < 0 && S < 0 || C <= 0 ? h : 0), 4, h, k, i(p.color));
        const g = i((N = (L = t.cellTextColors) == null ? void 0 : L[c]) == null ? void 0 : N[v]);
        V.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${l++}" name="Bar label"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr>${F(
            0,
            0,
            x,
            w
          )}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="ko-KR" sz="900"><a:solidFill><a:srgbClr val="${g}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${s(
            p.label
          )}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></xdr:txBody></xdr:sp>`
        );
      } else {
        const y = p.values;
        if (!y.length || !y.every(Number.isFinite)) return;
        let C = 1 / 0, M = -1 / 0;
        for (const h of y)
          C = Math.min(C, h), M = Math.max(M, h);
        const S = M - C || 1, T = (h, g) => h === M ? "28A745" : h === C ? "DC3545" : g === 0 || g === y.length - 1 ? "0000FF" : "FF9900";
        if (p.type === "sparklineBar") {
          const h = f / y.length;
          y.forEach((g, u) => {
            const m = (g - C) / S * k;
            m > 0 && $(
              "rect",
              4 + u * h + Math.min(1, h / 4),
              4 + k - m,
              Math.max(0.5, h - 2),
              m,
              T(g, u)
            );
          });
        } else {
          const h = y.map((u, m) => ({
            x: 4 + (y.length > 1 ? m / (y.length - 1) * f : f / 2),
            y: 4 + (1 - (u - C) / S) * k
          })), g = h.map(
            (u, m) => `<a:${m ? "lnTo" : "moveTo"}><a:pt x="${r(u.x)}" y="${r(u.y)}"/></a:${m ? "lnTo" : "moveTo"}>`
          ).join("");
          V.push(
            `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${l++}" name="Sparkline"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${F(
              0,
              0,
              x,
              w
            )}<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${r(
              x
            )}" h="${r(
              w
            )}" fill="none">${g}</a:path></a:pathLst></a:custGeom><a:noFill/><a:ln w="7144"><a:solidFill><a:srgbClr val="007ACC"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>`
          ), h.forEach(
            (u, m) => $("ellipse", u.x - 1.875, u.y - 1.875, 3.75, 3.75, T(y[m], m))
          );
        }
      }
      V.length && o.push(
        `<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${v}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c + n}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${v + 1}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c + n + 1}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="${l++}" name="Cell chart ${c + n + 1}-${v + 1}"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${r(
          x * 9525
        )}" cy="${r(w * 9525)}"/><a:chOff x="0" y="0"/><a:chExt cx="${r(x)}" cy="${r(
          w
        )}"/></a:xfrm></xdr:grpSpPr>${V.join("")}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>`
      );
    })
  ), o.length ? `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${o.join(
    ""
  )}</xdr:wsDr>` : void 0;
}
const Ze = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", _ = "http://schemas.openxmlformats.org/spreadsheetml/2006/main", B = "http://schemas.openxmlformats.org/officeDocument/2006/relationships", O = (t) => Array.from(t).filter((e) => {
  const s = e.codePointAt(0);
  return s === 9 || s === 10 || s === 13 || s >= 32 && s <= 55295 || s >= 57344 && s <= 65533 || s >= 65536;
}).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function H(t, e) {
  if (!t) return e;
  const s = t.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (s) return "FF" + (s[1].length === 3 ? [...s[1]].map((r) => r + r).join("") : s[1]).toUpperCase();
  const n = t.match(/^rgba?\(([^)]+)\)$/i);
  if (!n) return e;
  const o = n[1].split(/[,\s/]+/).filter(Boolean), l = o[3] === void 0 ? 1 : Math.min(1, Math.max(0, parseFloat(o[3]) / (o[3].endsWith("%") ? 100 : 1))), i = o.slice(0, 3).map((r) => Math.max(0, Math.min(255, parseFloat(r) * (r.endsWith("%") ? 2.55 : 1))));
  return i.length !== 3 || i.some((r) => !Number.isFinite(r)) || !Number.isFinite(l) ? e : "FF" + i.map(
    (r) => Math.round(r * l + 255 * (1 - l)).toString(16).padStart(2, "0")
  ).join("").toUpperCase();
}
class _e {
  convert(e, s = {}) {
    var M, S, T;
    const n = ((M = e.headerRows) == null ? void 0 : M.length) || 1;
    if (!e.columns.length || e.columns.length > 16384 || e.rows.length + n > 1048576)
      throw new RangeError("Invalid XLSX worksheet dimensions");
    const o = s.sheetName ?? "Grid";
    if (!o.trim() || o.length > 31 || /[\\/*?:\[\]]/.test(o) || /^'|'$/.test(o))
      throw new Error("Invalid Excel sheet name");
    const l = ['<font><sz val="11"/><color rgb="FF222222"/><name val="Calibri"/></font>'], i = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>'
    ], r = ["<border><left/><right/><top/><bottom/><diagonal/></border>"], d = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'], a = /* @__PURE__ */ new Map(), c = (h, g) => {
      const u = h.indexOf(g);
      return u >= 0 ? u : (h.push(g), h.length - 1);
    }, p = (h, g, u, m) => {
      var Y, Q, ee, te, se, re, ne, oe, le, ie, ae, ce;
      const R = H(
        h ? (m == null ? void 0 : m.textColor) ?? ((Y = e.headerTextColors) == null ? void 0 : Y[g]) : (ee = (Q = e.cellTextColors) == null ? void 0 : Q[u]) == null ? void 0 : ee[g],
        "FF222222"
      ), P = h ? (m == null ? void 0 : m.background) ?? ((te = e.headerBackgrounds) == null ? void 0 : te[g]) ?? "#e9edf2" : (re = (se = e.cellBackgrounds) == null ? void 0 : se[u]) == null ? void 0 : re[g], E = h ? (m == null ? void 0 : m.gradient) ?? ((ne = e.headerGradients) == null ? void 0 : ne[g]) : void 0, W = (h ? (m == null ? void 0 : m.borders) ?? ((oe = e.headerCellBorders) == null ? void 0 : oe[g]) : (ie = (le = e.cellBorders) == null ? void 0 : le[u]) == null ? void 0 : ie[g]) ?? {
        right: { color: "#cdcdcd", width: 1 },
        bottom: { color: "#cdcdcd", width: 1 }
      }, z = h ? 0 : Math.max(0, Math.min(250, Math.floor(((ce = (ae = e.cellIndents) == null ? void 0 : ae[u]) == null ? void 0 : ce[g]) ?? 0))), X = z ? "left" : h ? "center" : e.columns[g].align ?? "left", K = JSON.stringify([h, R, P, E, W, X, z]), q = a.get(K);
      if (q !== void 0) return q;
      const xe = c(
        l,
        `<font><sz val="11"/><color rgb="${R}"/><name val="Calibri"/>${h ? "<b/>" : ""}</font>`
      ), ve = E ? c(
        i,
        `<fill><gradientFill degree="90"><stop position="0"><color rgb="${H(
          E.startColor,
          "FFFFFFFF"
        )}"/></stop><stop position="1"><color rgb="${H(
          E.endColor,
          "FFF1F1F1"
        )}"/></stop></gradientFill></fill>`
      ) : P ? c(
        i,
        `<fill><patternFill patternType="solid"><fgColor rgb="${H(
          P,
          "FFFFFFFF"
        )}"/><bgColor indexed="64"/></patternFill></fill>`
      ) : 0, we = c(
        r,
        "<border>" + ["left", "right", "top", "bottom"].map((A) => {
          const I = W[A];
          if (!I || !Number.isFinite(I.width) || I.width <= 0) return `<${A}/>`;
          const ye = I.style === "dashed" || I.style === "dotted" || I.style === "double" ? I.style : I.width >= 3 ? "thick" : I.width >= 2 ? "medium" : "thin";
          return `<${A} style="${ye}"><color rgb="${H(I.color, "FFCDCDCD")}"/></${A}>`;
        }).join("") + "<diagonal/></border>"
      ), J = d.length;
      return d.push(
        `<xf numFmtId="0" fontId="${xe}" fillId="${ve}" borderId="${we}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${X}" vertical="center" wrapText="1"${z ? ` indent="${z}"` : ""}/></xf>`
      ), a.set(K, J), J;
    }, v = (h, g, u) => {
      var E;
      const m = `${U(u)}${g + 1}`, R = `r="${m}" s="${p(
        g < n,
        u,
        g - n,
        (E = w[g]) == null ? void 0 : E[u]
      )}"`;
      if (typeof h == "number" && Number.isFinite(h)) return `<c ${R}><v>${h}</v></c>`;
      if (typeof h == "boolean") return `<c ${R} t="b"><v>${h ? 1 : 0}</v></c>`;
      const P = String(h ?? "");
      if (P.length > 32767) throw new RangeError(`Excel cell ${m} exceeds 32767 characters`);
      return `<c ${R} t="inlineStr"><is><t xml:space="preserve">${O(P)}</t></is></c>`;
    }, x = Array.from({ length: n }, () => e.columns.map(() => "")), w = Array.from({ length: n }, () => []), f = [];
    (S = e.headerRows) != null && S.length ? e.headerRows.forEach(
      (h, g) => h.forEach((u) => {
        x[g][u.column] = u.label;
        for (let m = g; m < g + u.rowSpan; m++)
          for (let R = u.column; R < u.column + u.colSpan; R++) w[m][R] = u;
        (u.rowSpan > 1 || u.colSpan > 1) && f.push(
          `${U(u.column)}${g + 1}:${U(u.column + u.colSpan - 1)}${g + u.rowSpan}`
        );
      })
    ) : x[0] = e.columns.map((h) => h.label ?? "");
    const k = Math.max(12, e.rowHeight ?? 26) * 0.75, V = [...x, ...e.rows].map(
      (h, g) => `<row r="${g + 1}" ht="${k}" customHeight="1"${g >= n && e.outlineLevels ? ` outlineLevel="${e.outlineLevels[g - n]}"` : ""}>${e.columns.map((u, m) => v(h[m] ?? "", g, m)).join("")}</row>`
    ).join(""), F = `${U(e.columns.length - 1)}${e.rows.length + n}`, $ = s.mergeCells === !1 ? [] : [
      ...f,
      ...e.merges.map(
        (h) => h.replace(/([A-Z]+)(\d+)/g, (g, u, m) => `${u}${Number(m) + n - 1}`)
      )
    ], L = je(e, H, O, n), N = ((T = e.outlineLevels) == null ? void 0 : T.reduce((h, g) => Math.max(h, g), 0)) ?? 0, y = `<worksheet xmlns="${_}" xmlns:r="${B}">${e.outlineLevels ? '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' : ""}<dimension ref="A1:${F}"/><sheetViews><sheetView workbookViewId="0">${s.freezeHeader === !1 ? "" : `<pane ySplit="${n}" topLeftCell="A${n + 1}" activePane="bottomLeft" state="frozen"/>`}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="${k}"${N ? ` outlineLevelRow="${N}"` : ""}/><cols>${e.columns.map(
      (h, g) => `<col min="${g + 1}" max="${g + 1}" width="${Math.min(
        255,
        Math.max(1, ((h.width ?? 100) - 5) / 7)
      ).toFixed(2)}" customWidth="1"/>`
    ).join("")}</cols><sheetData>${V}</sheetData>${s.autoFilter ? `<autoFilter ref="A${n}:${F}"/>` : ""}${$.length ? `<mergeCells count="${$.length}">${$.map((h) => `<mergeCell ref="${O(h)}"/>`).join("")}</mergeCells>` : ""}${L ? '<drawing r:id="rId1"/>' : ""}</worksheet>`, C = {
      "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${B}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<workbook xmlns="${_}" xmlns:r="${B}"><sheets><sheet name="${O(
        o
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${B}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${B}/styles" Target="styles.xml"/></Relationships>`,
      "xl/styles.xml": `<styleSheet xmlns="${_}"><fonts count="${l.length}">${l.join(
        ""
      )}</fonts><fills count="${i.length}">${i.join("")}</fills><borders count="${r.length}">${r.join(
        ""
      )}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${d.length}">${d.join(
        ""
      )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      "xl/worksheets/sheet1.xml": y
    };
    return L && (C["[Content_Types].xml"] = C["[Content_Types].xml"].replace(
      "</Types>",
      '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'
    ), C["xl/drawings/drawing1.xml"] = L, C["xl/worksheets/_rels/sheet1.xml.rels"] = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${B}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`), new Blob([Oe(C)], { type: Ze });
  }
  download(e, s = "grid-export.xlsx") {
    be(e, s, "grid-export.xlsx", "xlsx");
  }
}
export {
  _e as ExcelConverter,
  Ge as createExcelData
};
