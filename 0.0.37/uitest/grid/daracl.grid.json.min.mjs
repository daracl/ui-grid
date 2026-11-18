const y = {
  left: "dg-text-al",
  center: "dg-text-ac"
};
function b(e) {
  return Array.isArray(e);
}
function p(e) {
  return typeof e == "function";
}
function f(e) {
  return typeof e == "string";
}
function V(e) {
  return e == null || f(e) && e.trim() === "";
}
function k(e) {
  return e == null;
}
function E(e, t) {
  return (e || "").split(t);
}
const R = "$all$", w = (e) => Number.parseInt(e, 10), H = (e) => k(e), I = (e, t) => {
  const i = B(t), s = e.scroll.startIdx + i.r, r = i.c, n = e.dataManager.getViewItems()[s];
  return {
    r: i.r,
    c: r,
    rowIndex: s,
    field: e.currentFields[i.c],
    item: e.dataManager.getRowItem(n.id),
    viewItem: n
  };
}, B = (e) => {
  const t = (S(e) ?? "").split(",");
  return {
    r: w(t[0]),
    c: w(t[1])
  };
}, S = (e) => e.dataset.cellPosition, z = (e, t, i) => {
  const s = e.dataManager, r = s.getViewItems(), n = t.header.resize.maxWidth;
  let l = 0;
  const a = e.canvasContext, c = e.scroll.startIdx;
  let d = 0;
  for (let h = c, u = Math.min(e.dataInfo.rowLength, c + 100); h < u; h++) {
    const g = i.$renderer.getValue(s.getRowItem(r[h].id));
    if (H(g)) continue;
    const v = a.measureText(g);
    if (d = Math.max(v.width, d), n > 0 && d >= n)
      return n;
    l = Math.max(l, d);
  }
  return l + 16;
}, A = (e) => e?.listItem?.valueField ?? "value", Z = (e) => e?.listItem?.labelField ?? "label";
function o(e, ...t) {
  return e.reduce((i, s, r) => {
    const n = t[r];
    return i + s + (n == null ? "" : String(n));
  }, "");
}
o`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`, o`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`, o`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`, o`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`, o`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`, o`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`, o`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, o`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`, o`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`, o`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`, o`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`, o`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`, o`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`, o`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`, o`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`, o`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`, o`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`, o`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`;
function C(e, t, i) {
  const s = /* @__PURE__ */ new Map(), r = f(e[0]), n = [];
  for (const l of e) {
    let a, c;
    if (r) {
      a = l, c = l;
      const d = {};
      d[i] = l, d[t] = l, n.push(d);
    } else
      a = l?.[i] ?? "", c = l?.[t] ?? "", n.push(l);
    s.set(a, c);
  }
  return { list: n, map: s };
}
function j(e, t, i) {
  const s = f(e) ? E(e || "", t) : Array.isArray(e) ? e : [e], r = new Set(s.map(String));
  if (r.has(R))
    return [...i.values()];
  const n = [];
  for (const l of r) {
    const a = i.get(l);
    a !== void 0 && n.push(a);
  }
  return n;
}
function F(e, t) {
  const s = /[0,.]+/.exec(t);
  if (!s) return t;
  const r = s[0], n = t.slice(0, t.indexOf(r)), l = t.slice(t.indexOf(r) + r.length), [a, c] = r.split("."), d = a.includes(",");
  let h = "";
  if (c) {
    const u = e.toFixed(c.length), [g, v] = u.split("."), m = v.replace(/0+$/, "");
    h = d ? x(g) : g, m.length > 0 && (h += "." + m);
  } else {
    const u = Math.round(e).toString();
    h = d ? x(u) : u;
  }
  return `${n}${h}${l}`;
}
function x(e) {
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function N(e, t) {
  return t.type == "number" && !isNaN(e) ? F(e, t.format ?? "0,0") : e;
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
  /**
   * 그리드를 파괴할 때 호출된다. 그리드 바깥(document 등)에 만든 요소가 있으면 여기서 제거한다.
   */
  destroy() {
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
   * @returns
   */
  getMinWidth(t, i) {
    return z(t, i, this.field);
  }
  applyRendererRefState(t, i) {
    const s = i?.hide ?? !1, r = t.classList;
    if (r.contains("dg-hide") !== s && r.toggle("dg-hide", s), s) return !1;
    const n = i?.disabled ?? !1;
    r.contains("dg-disabled") !== n && r.toggle("dg-disabled", n);
  }
}
class L extends T {
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
    const i = t[this.fieldName];
    return this.isVauleFunction ? this.field.getValue?.({ field: this.field, item: t }) : this.field.displayFormat ? N(i, this.field.displayFormat) : V(i) && !V(this.field.defaultValue) ? this.field.defaultValue : i;
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
    this.isClick && this.field.renderer.click?.call(null, s);
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
  constructor(t, i) {
    super(t, i), this.listItems = [];
    const s = this.field.editRenderer, r = Z(s), n = A(s);
    if (s?.listItem) {
      this.valueDelimiter = s.listItem?.delimiter ?? ",";
      const l = s.listItem?.list;
      if (b(l)) {
        const a = C(l, r, n);
        this.listItems = a.list, this.valueLabelMap = a.map;
      } else p(l) && l({ init: !0 }, (a) => {
        const c = C(a, r, n);
        this.listItems = c.list, this.valueLabelMap = c.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(t, i) {
    const s = t.item, r = this.getValue(s), n = this.getRefValue(r, s);
    let l = i.firstElementChild;
    if (!l) {
      l = document.createElement("div"), l.className = "dg-cell-content";
      const d = document.createElement("div");
      d.className = "dg-cell-content-label " + this.field.$alignStyle;
      const h = document.createElement("div");
      h.className = "dg-cell-content-icon", l.appendChild(d), l.appendChild(h), i.appendChild(l), this.initEvent(l);
    }
    const a = l.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(l, n) === !1)
      return;
    let c = "";
    if (n)
      c = n.label ?? (f(n) ? n : "");
    else {
      let d = r;
      if (this.valueLabelMap.size > 0) {
        let h = this.getLabel(r);
        h.length < 1 && this.field.defaultValue && (h = this.getLabel(this.field.defaultValue)), d = h.join(this.valueDelimiter);
      }
      c = d;
    }
    this.tooltip(a, c), a.textContent = c;
  }
  getLabel(t) {
    return j(t, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(t) {
    this.cfg.eventManager.on({ el: t, type: "click" }, (i) => {
      const s = i.target, r = this.getClosestCellElement(s), n = I(this.cfg, r);
      this.click(i, r, n);
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
function M(e) {
  return e == null ? "" : e instanceof Date ? e.toISOString() : typeof e == "object" ? JSON.stringify(e) : String(e);
}
function D(e, t) {
  return e.map((i) => {
    const s = i.$renderer;
    if (i.renderer?.type === "password") return "********";
    if (i.renderer?.type === "hidden") return "";
    const r = s.getValue(t);
    if (s instanceof L && ["dropdown", "link", "button"].includes(i.renderer?.type)) {
      const n = s.getRefValue(r, t);
      if (typeof n == "string") return n;
      if (n?.hide) return "";
      if (n?.label !== void 0) return M(n.label);
      if (s instanceof $) {
        let l = s.getLabel(r);
        if (l.length === 0 && i.defaultValue && (l = s.getLabel(i.defaultValue)), l.length > 0) return l.join(i.editRenderer?.listItem?.delimiter ?? ",");
      }
    }
    return M(r);
  });
}
const O = 1e4;
function P(e, t, i, s) {
  const r = URL.createObjectURL(e), n = document.createElement("a"), l = t.trim() || i;
  n.href = r, n.download = l.toLowerCase().endsWith(`.${s}`) ? l : `${l}.${s}`, n.style.display = "none";
  try {
    document.body.appendChild(n), n.click();
  } finally {
    n.remove(), setTimeout(() => URL.revokeObjectURL(r), O);
  }
}
class U {
  convert(t, i = {}) {
    const s = i.space ?? 2;
    if (!Number.isInteger(s) || s < 0 || s > 10)
      throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");
    return new Blob([JSON.stringify(t, null, s)], { type: "application/json;charset=utf-8" });
  }
  download(t, i = "export.json") {
    P(t, i, "export.json", "json");
  }
}
function W(e, t = {}) {
  return e.viewItems.filter((i) => !i.groupRowType).map((i) => {
    const s = e.getRowItem(i.id), r = t.useFormatter ? D(e.fields, s) : void 0;
    return Object.fromEntries(
      e.fields.map((n, l) => [n.name, r ? r[l] : s[n.name] ?? null])
    );
  });
}
export {
  U as JsonConverter,
  W as createJsonData
};
