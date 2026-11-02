function ie(t, e, r, n) {
  const l = URL.createObjectURL(t), o = document.createElement("a"), i = e.trim() || r;
  o.href = l, o.download = i.toLowerCase().endsWith(`.${n}`) ? i : `${i}.${n}`, o.style.display = "none";
  try {
    document.body.appendChild(o), o.click();
  } finally {
    o.remove(), setTimeout(() => URL.revokeObjectURL(l), 1e4);
  }
}
function ae(t, e) {
  const n = /[0,.]+/.exec(e);
  if (!n) return e;
  const l = n[0], o = e.slice(0, e.indexOf(l)), i = e.slice(e.indexOf(l) + l.length), [s, h] = l.split("."), c = s.includes(",");
  let a = "";
  if (h) {
    const x = t.toFixed(h.length), [u, f] = x.split("."), v = f.replace(/0+$/, "");
    a = c ? K(u) : u, v.length > 0 && (a += "." + v);
  } else {
    const x = Math.round(t).toString();
    a = c ? K(x) : x;
  }
  return `${o}${a}${i}`;
}
function K(t) {
  return t.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function ee(t, e) {
  return e.type == "number" && !isNaN(t) ? ae(t, e.format ?? "0,0") : t;
}
const ce = "$all$";
function de(t) {
  return t.field ?? t.name ?? "";
}
function he(t, e, r) {
  const n = e?.displayFormat ?? r.displayFormat;
  return String(n ? ee(t, n) : t);
}
function O(t) {
  return t == null ? "" : t instanceof Date ? t.toISOString() : typeof t == "object" ? JSON.stringify(t) : String(t);
}
const z = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
};
function pe(t) {
  return Array.isArray(t);
}
function U(t) {
  return typeof t == "function";
}
function B(t) {
  return typeof t == "string";
}
function Y(t) {
  return t == null || B(t) && t.trim() === "";
}
function me(t) {
  return t == null;
}
function fe(t, e) {
  return (t || "").split(e);
}
const q = (t) => Number.parseInt(t, 10), ue = (t) => me(t), ge = (t, e) => {
  const r = xe(e), n = t.scroll.startIdx + r.r, l = r.c, o = t.dataManager.getViewItems()[n];
  return {
    r: r.r,
    c: l,
    rowIndex: n,
    field: t.currentFields[r.c],
    item: t.dataManager.getRowItem(o.id),
    viewItem: o
  };
}, xe = (t) => {
  const e = (ve(t) ?? "").split(",");
  return {
    r: q(e[0]),
    c: q(e[1])
  };
}, ve = (t) => t.dataset.cellPosition, we = (t, e, r) => {
  const n = t.dataManager, l = n.getViewItems(), o = e.header.resize.maxWidth;
  let i = 0;
  const s = t.canvasContext, h = t.scroll.startIdx;
  let c = 0;
  for (let a = h, x = Math.min(t.dataInfo.rowLength, h + 100); a < x; a++) {
    const u = r.$renderer.getValue(n.getRowItem(l[a].id));
    if (ue(u)) continue;
    const f = s.measureText(u);
    if (c = Math.max(f.width, c), o > 0 && c >= o)
      return o;
    i = Math.max(i, c);
  }
  return i + 16;
}, ye = (t) => t?.listItem?.valueField ?? "value", be = (t) => t?.listItem?.labelField ?? "label";
function b(t, ...e) {
  return t.reduce((r, n, l) => {
    const o = e[l];
    return r + n + (o == null ? "" : String(o));
  }, "");
}
b`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`, b`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`, b`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`, b`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`, b`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`, b`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`, b`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`, b`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`, b`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`, b`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`;
function J(t, e, r) {
  const n = /* @__PURE__ */ new Map(), l = B(t[0]), o = [];
  for (const i of t) {
    let s, h;
    if (l) {
      s = i, h = i;
      const c = {};
      c[r] = i, c[e] = i, o.push(c);
    } else
      s = i?.[r] ?? "", h = i?.[e] ?? "", o.push(i);
    n.set(s, h);
  }
  return { list: o, map: n };
}
function $e(t, e, r) {
  const n = B(t) ? fe(t || "", e) : Array.isArray(t) ? t : [t], l = new Set(n.map(String));
  if (l.has(ce))
    return [...r.values()];
  const o = [];
  for (const i of l) {
    const s = r.get(i);
    s !== void 0 && o.push(s);
  }
  return o;
}
class Ce {
  constructor(e, r) {
    this.field = e, this.fieldName = e.name, this.gridMain = r, this.language = this.gridMain.i18n(), this.enabledTooltip = r.options().enabledTooltip;
  }
  getClosestCellElement(e) {
    return e.closest(".dg-cell");
  }
  supportsInteraction() {
    return !1;
  }
  /**
   * 그리드를 파괴할 때 호출된다. 그리드 바깥(document 등)에 만든 요소가 있으면 여기서 제거한다.
   */
  destroy() {
  }
  bindEvents(e, r, n) {
    return !1;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return z.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @returns
   */
  getMinWidth(e, r) {
    return we(e, r, this.field);
  }
  applyRendererRefState(e, r) {
    const n = r?.hide ?? !1, l = e.classList;
    if (l.contains("dg-hide") !== n && l.toggle("dg-hide", n), n) return !1;
    const o = r?.disabled ?? !1;
    l.contains("dg-disabled") !== o && l.toggle("dg-disabled", o);
  }
}
class te extends Ce {
  constructor(e, r) {
    super(e, r), this.isClick = !1, this.cfg = this.gridMain.config();
    const n = e.renderer.refValue;
    this.isRefFunction = U(n), this.isRefString = B(n), this.isVauleFunction = U(e.getValue), this.isRefString || this.isRefFunction ? this.refValue = n : this.refValue = n ?? {}, this.isClick = U(this.field.renderer.click);
  }
  getRefValue(e, r) {
    return this.isRefFunction ? this.refValue.call(null, this.field, e, r) : this.isRefString ? { label: this.refValue } : this.refValue[e];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(e) {
    const r = e[this.fieldName];
    return this.isVauleFunction ? this.field.getValue?.({ field: this.field, item: e }) : this.field.displayFormat ? ee(r, this.field.displayFormat) : Y(r) && !Y(this.field.defaultValue) ? this.field.defaultValue : r;
  }
  tooltip(e, r) {
    this.enabledTooltip && e.setAttribute("title", r);
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(e, r, n) {
    this.isClick && this.field.renderer.click?.call(null, n);
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
class Fe extends te {
  constructor(e, r) {
    super(e, r), this.listItems = [];
    const n = this.field.editRenderer, l = be(n), o = ye(n);
    if (n?.listItem) {
      this.valueDelimiter = n.listItem?.delimiter ?? ",";
      const i = n.listItem?.list;
      if (pe(i)) {
        const s = J(i, l, o);
        this.listItems = s.list, this.valueLabelMap = s.map;
      } else U(i) && i({ init: !0 }, (s) => {
        const h = J(s, l, o);
        this.listItems = h.list, this.valueLabelMap = h.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(e, r) {
    const n = e.item, l = this.getValue(n), o = this.getRefValue(l, n);
    let i = r.firstElementChild;
    if (!i) {
      i = document.createElement("div"), i.className = "dg-cell-content";
      const c = document.createElement("div");
      c.className = "dg-cell-content-label " + this.field.$alignStyle;
      const a = document.createElement("div");
      a.className = "dg-cell-content-icon", i.appendChild(c), i.appendChild(a), r.appendChild(i), this.initEvent(i);
    }
    const s = i.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(i, o) === !1)
      return;
    let h = "";
    if (o)
      h = o.label ?? (B(o) ? o : "");
    else {
      let c = l;
      if (this.valueLabelMap.size > 0) {
        let a = this.getLabel(l);
        a.length < 1 && this.field.defaultValue && (a = this.getLabel(this.field.defaultValue)), c = a.join(this.valueDelimiter);
      }
      h = c;
    }
    this.tooltip(s, h), s.textContent = h;
  }
  getLabel(e) {
    return $e(e, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(e) {
    this.cfg.eventManager.on({ el: e, type: "click" }, (r) => {
      const n = r.target, l = this.getClosestCellElement(n), o = ge(this.cfg, l);
      this.click(r, l, o);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(e, r, n) {
    this.field.$editRenderer.render(n, r);
  }
  supportsEdit() {
    return !0;
  }
  alignStyle() {
    return z.center;
  }
  getMinWidth(e, r) {
    return 70;
  }
}
function Me(t, e) {
  return t.map((r) => {
    const n = r.$renderer;
    if (r.renderer?.type === "password") return "********";
    if (r.renderer?.type === "hidden") return "";
    const l = n.getValue(e);
    if (n instanceof te && ["dropdown", "link", "button"].includes(r.renderer?.type)) {
      const o = n.getRefValue(l, e);
      if (typeof o == "string") return o;
      if (o?.hide) return "";
      if (o?.label !== void 0) return O(o.label);
      if (n instanceof Fe) {
        let i = n.getLabel(l);
        if (i.length === 0 && r.defaultValue && (i = n.getLabel(r.defaultValue)), i.length > 0) return i.join(r.editRenderer?.listItem?.delimiter ?? ",");
      }
    }
    return O(l);
  });
}
class re {
  constructor(e) {
    this.context = e;
  }
  render() {
    const { fields: e, viewItems: r } = this.context, n = {
      columns: [...this.context.lineNumberField ? [this.context.lineNumberField] : [], ...e].map((o) => ({
        name: o.name,
        label: o.label,
        width: o.$width,
        align: o.align ?? (o.$alignStyle === z.right ? "right" : o.$alignStyle === z.center ? "center" : "left")
      })),
      rows: r.map((o, i) => {
        const s = this.renderRow(o);
        return this.context.lineNumberField ? [String((this.context.lineNumberStart ?? 0) + i + 1), ...s] : s;
      })
    };
    this.context.tableBorders && (n.tableBorders = this.context.tableBorders);
    const l = this.context.getCellStyles;
    if (l) {
      const o = r.map((s, h) => l(s, h)), i = o.map((s) => s.backgrounds);
      i.some((s) => s.some((h) => h !== void 0)) && (n.cellBackgrounds = i), n.cellBorders = o.map((s) => s.borders), n.cellTextColors = o.map((s) => s.textColors ?? []);
    }
    if (this.context.getCellCharts) {
      const o = r.map((i, s) => this.context.getCellCharts?.(i, s) ?? []);
      n.cellCharts = o.map((i) => this.context.lineNumberField ? [void 0, ...i] : i);
    }
    if (this.context.getHeaderCellBorders && (n.headerCellBorders = this.context.getHeaderCellBorders()), this.context.getHeaderCellStyles) {
      const o = this.context.getHeaderCellStyles();
      n.headerBackgrounds = o.backgrounds, n.headerTextColors = o.textColors, n.headerGradients = o.gradients;
    }
    return n;
  }
  renderRow(e) {
    if (e.groupRowType)
      return this.context.fields.map(() => "");
    const r = this.context.getRowItem(e.id);
    return this.renderDataRow(r);
  }
  renderDataRow(e) {
    return Me(this.context.fields, e);
  }
}
class ke extends re {
  render() {
    return this.previousDataItem = void 0, super.render();
  }
  renderRow(e) {
    const { fields: r, getRowItem: n } = this.context;
    if (!e.groupRowType) {
      const s = n(e.id), h = this.renderDataRow(s), c = this.groupingFields();
      return c.forEach((a, x) => {
        const u = r.find((v) => v.name === a), f = this.previousDataItem !== void 0 && c.slice(0, x + 1).every((v) => Object.is(s[v], this.previousDataItem?.[v]));
        u && f && (h[r.indexOf(u)] = "");
      }), this.previousDataItem = s, h;
    }
    const l = super.renderRow(e), o = new Set(this.context.summaryFieldNames), i = r.find((s) => !o.has(s.name)) ?? r[0];
    if (e.groupRowType === "group") {
      const s = r.find((h) => h.name === e.groupField) ?? r[0];
      return s && (l[r.indexOf(s)] = `${e.groupField}: ${O(e.groupValue)}`), l;
    }
    if (e.groupRowType === "groupSummary") {
      const s = e.groupField ? r.find((h) => h.name === e.groupField) ?? i : i;
      s && (l[r.indexOf(s)] = e.groupField ? `${O(e.groupValue)} 합계` : "Subtotal");
    } else i && (l[r.indexOf(i)] = "Grand Total");
    for (const [s, h] of Object.entries(e.groupSums ?? {})) {
      const c = r.findIndex((a) => a.name === s);
      c >= 0 && (l[c] = he(h, this.context.summaryItems?.find((a) => de(a) === s), r[c]));
    }
    return l;
  }
  groupingFields() {
    return this.context.groupingFields;
  }
}
class Ve extends re {
}
function P(t) {
  let e = "";
  for (let r = t + 1; r > 0; r = Math.floor((r - 1) / 26))
    e = String.fromCharCode(65 + (r - 1) % 26) + e;
  return e;
}
function Ee(t, e = []) {
  const n = (t.groupingFields.length ? new ke(t) : new Ve(t)).render(), l = t.lineNumberField ? 1 : 0, o = t.fields.some((a) => a.renderer?.type === "tree"), i = t.viewItems.map((a) => Math.max(0, Math.floor(a.depth ?? 0))), s = o ? t.viewItems.map((a, x) => [
    ...l ? [0] : [],
    ...t.fields.map((u) => u.renderer?.type === "tree" ? Math.min(250, i[x]) : 0)
  ]) : void 0, h = n.rows.map((a, x) => {
    const u = [...a], f = t.viewItems[x];
    return l && (u[0] = (t.lineNumberStart ?? 0) + x + 1), t.fields.forEach((v, F) => {
      if (f.groupRowType) {
        const y = f.groupSums?.[v.name];
        y !== void 0 && t.summaryFieldNames.includes(v.name) && a[F + l] === String(y) && (u[F + l] = y);
      } else if (!v.displayFormat && ["text", "number"].includes(v.renderer?.type ?? "text")) {
        const y = v.$renderer.getValue(t.getRowItem(f.id));
        (typeof y == "number" && Number.isFinite(y) || typeof y == "boolean") && a[F + l] === String(y) && (u[F + l] = y);
      }
    }), u;
  }), c = [];
  return n.cellCharts?.forEach(
    (a, x) => a.forEach((u, f) => {
      u && (h[x][f] = "");
    })
  ), e.forEach((a, x) => {
    const u = t.fields.findIndex((f) => f.name === a);
    if (!(u < 0))
      for (let f = 0; f < t.viewItems.length; ) {
        const v = t.viewItems[f];
        if (v.groupRowType) {
          f++;
          continue;
        }
        const F = t.getRowItem(v.id);
        let y = f + 1;
        for (; y < t.viewItems.length && !t.viewItems[y].groupRowType && e.slice(0, x + 1).every((S) => Object.is(F[S], t.getRowItem(t.viewItems[y].id)[S])); )
          y++;
        if (y - f > 1) {
          const S = P(u + l);
          c.push(`${S}${f + 2}:${S}${y + 1}`);
          for (let k = f + 1; k < y; k++)
            h[k][u + l] = "", n.cellCharts?.[k] && (n.cellCharts[k][u + l] = void 0);
        }
        f = y;
      }
  }), {
    ...n,
    rows: h,
    merges: c,
    cellIndents: s,
    outlineLevels: o ? i.map((a) => Math.min(7, a)) : void 0,
    rowHeight: t.rowHeight
  };
}
const Q = new TextEncoder(), Se = Uint32Array.from({ length: 256 }, (t, e) => {
  let r = e;
  for (let n = 0; n < 8; n++) r = r >>> 1 ^ (r & 1 ? 3988292384 : 0);
  return r >>> 0;
});
function Le(t) {
  const e = Object.entries(t).map(([c, a]) => ({
    name: Q.encode(c),
    data: Q.encode(a)
  })), r = e.reduce((c, a) => c + a.data.length + a.name.length * 2 + 76, 22);
  if (e.length > 65535 || r > 4294967295) throw new RangeError("XLSX exceeds ZIP32 limits");
  const n = new Uint8Array(r), l = new DataView(n.buffer), o = [], i = [];
  let s = 0;
  for (const c of e) {
    let a = 4294967295;
    for (const x of c.data) a = a >>> 8 ^ Se[(a ^ x) & 255];
    a = (a ^ 4294967295) >>> 0, o.push(s), i.push(a), l.setUint32(s, 67324752, !0), l.setUint16(s + 4, 20, !0), l.setUint16(s + 6, 2048, !0), l.setUint16(s + 12, 33, !0), l.setUint32(s + 14, a, !0), l.setUint32(s + 18, c.data.length, !0), l.setUint32(s + 22, c.data.length, !0), l.setUint16(s + 26, c.name.length, !0), n.set(c.name, s + 30), n.set(c.data, s + 30 + c.name.length), s += 30 + c.name.length + c.data.length;
  }
  const h = s;
  return e.forEach((c, a) => {
    l.setUint32(s, 33639248, !0), l.setUint16(s + 4, 20, !0), l.setUint16(s + 6, 20, !0), l.setUint16(s + 8, 2048, !0), l.setUint16(s + 14, 33, !0), l.setUint32(s + 16, i[a], !0), l.setUint32(s + 20, c.data.length, !0), l.setUint32(s + 24, c.data.length, !0), l.setUint16(s + 28, c.name.length, !0), l.setUint32(s + 42, o[a], !0), n.set(c.name, s + 46), s += 46 + c.name.length;
  }), l.setUint32(s, 101010256, !0), l.setUint16(s + 8, e.length, !0), l.setUint16(s + 10, e.length, !0), l.setUint32(s + 12, s - h, !0), l.setUint32(s + 16, h, !0), n;
}
function Re(t, e, r, n = 1) {
  const l = [];
  let o = 1;
  const i = (h, c = "FF222222") => e(h, c).slice(2), s = (h) => Math.round(h);
  return t.cellCharts?.forEach(
    (h, c) => h.forEach((a, x) => {
      if (!a || !t.columns[x]) return;
      const u = Math.max(12, t.columns[x].width ?? 100), f = Math.max(12, t.rowHeight ?? 26), v = u - 8, F = f - 8, y = [], S = (g, $, C, M) => `<a:xfrm><a:off x="${s(g)}" y="${s($)}"/><a:ext cx="${Math.max(1, s(C))}" cy="${Math.max(
        1,
        s(M)
      )}"/></a:xfrm>`, k = (g, $, C, M, V, d) => {
        y.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${o++}" name="${g} ${o}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${S(
            $,
            C,
            M,
            V
          )}<a:prstGeom prst="${g}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${d}"/></a:solidFill><a:ln><a:noFill/></a:ln></xdr:spPr></xdr:sp>`
        );
      };
      if (a.type === "bar") {
        if (![a.value, a.minimum, a.maximum].every(Number.isFinite)) return;
        const g = Math.min(a.minimum, a.maximum), $ = Math.max(a.minimum, a.maximum), C = $ - g || 1, M = Math.max(g, Math.min($, a.value)), V = g < 0 && $ > 0 ? -g / C * v : g >= 0 ? 0 : v, d = g < 0 && $ > 0 ? Math.abs(M) / C * v : g >= 0 ? (M - g) / C * v : Math.abs(M - $) / C * v;
        d > 0 && k("rect", 4 + V - (g < 0 && M < 0 || $ <= 0 ? d : 0), 4, d, F, i(a.color));
        const p = i(t.cellTextColors?.[c]?.[x]);
        y.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${o++}" name="Bar label"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr>${S(
            0,
            0,
            u,
            f
          )}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="ko-KR" sz="900"><a:solidFill><a:srgbClr val="${p}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${r(
            a.label
          )}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></xdr:txBody></xdr:sp>`
        );
      } else {
        const g = a.values;
        if (!g.length || !g.every(Number.isFinite)) return;
        let $ = 1 / 0, C = -1 / 0;
        for (const d of g)
          $ = Math.min($, d), C = Math.max(C, d);
        const M = C - $ || 1, V = (d, p) => d === C ? "28A745" : d === $ ? "DC3545" : p === 0 || p === g.length - 1 ? "0000FF" : "FF9900";
        if (a.type === "sparklineBar") {
          const d = v / g.length;
          g.forEach((p, m) => {
            const w = (p - $) / M * F;
            w > 0 && k(
              "rect",
              4 + m * d + Math.min(1, d / 4),
              4 + F - w,
              Math.max(0.5, d - 2),
              w,
              V(p, m)
            );
          });
        } else {
          const d = g.map((m, w) => ({
            x: 4 + (g.length > 1 ? w / (g.length - 1) * v : v / 2),
            y: 4 + (1 - (m - $) / M) * F
          })), p = d.map(
            (m, w) => `<a:${w ? "lnTo" : "moveTo"}><a:pt x="${s(m.x)}" y="${s(m.y)}"/></a:${w ? "lnTo" : "moveTo"}>`
          ).join("");
          y.push(
            `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${o++}" name="Sparkline"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${S(
              0,
              0,
              u,
              f
            )}<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${s(
              u
            )}" h="${s(
              f
            )}" fill="none">${p}</a:path></a:pathLst></a:custGeom><a:noFill/><a:ln w="7144"><a:solidFill><a:srgbClr val="007ACC"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>`
          ), d.forEach(
            (m, w) => k("ellipse", m.x - 1.875, m.y - 1.875, 3.75, 3.75, V(g[w], w))
          );
        }
      }
      y.length && l.push(
        `<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${x}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c + n}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${x + 1}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${c + n + 1}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="${o++}" name="Cell chart ${c + n + 1}-${x + 1}"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${s(
          u * 9525
        )}" cy="${s(f * 9525)}"/><a:chOff x="0" y="0"/><a:chExt cx="${s(u)}" cy="${s(
          f
        )}"/></a:xfrm></xdr:grpSpPr>${y.join("")}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>`
      );
    })
  ), l.length ? `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${l.join(
    ""
  )}</xdr:wsDr>` : void 0;
}
const Ie = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", j = "http://schemas.openxmlformats.org/spreadsheetml/2006/main", E = "http://schemas.openxmlformats.org/officeDocument/2006/relationships", D = (t) => Array.from(t).filter((e) => {
  const r = e.codePointAt(0);
  return r === 9 || r === 10 || r === 13 || r >= 32 && r <= 55295 || r >= 57344 && r <= 65533 || r >= 65536;
}).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function T(t, e) {
  if (!t) return e;
  const r = t.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (r) return "FF" + (r[1].length === 3 ? [...r[1]].map((s) => s + s).join("") : r[1]).toUpperCase();
  const n = t.match(/^rgba?\(([^)]+)\)$/i);
  if (!n) return e;
  const l = n[1].split(/[,\s/]+/).filter(Boolean), o = l[3] === void 0 ? 1 : Math.min(1, Math.max(0, parseFloat(l[3]) / (l[3].endsWith("%") ? 100 : 1))), i = l.slice(0, 3).map((s) => Math.max(0, Math.min(255, parseFloat(s) * (s.endsWith("%") ? 2.55 : 1))));
  return i.length !== 3 || i.some((s) => !Number.isFinite(s)) || !Number.isFinite(o) ? e : "FF" + i.map(
    (s) => Math.round(s * o + 255 * (1 - o)).toString(16).padStart(2, "0")
  ).join("").toUpperCase();
}
class Te {
  convert(e, r = {}) {
    const n = e.headerRows?.length || 1;
    if (!e.columns.length || e.columns.length > 16384 || e.rows.length + n > 1048576)
      throw new RangeError("Invalid XLSX worksheet dimensions");
    const l = r.sheetName ?? "Grid";
    if (!l.trim() || l.length > 31 || /[\\/*?:[\]]/.test(l) || /^'|'$/.test(l))
      throw new Error("Invalid Excel sheet name");
    const o = ['<font><sz val="11"/><color rgb="FF222222"/><name val="Calibri"/></font>'], i = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>'
    ], s = ["<border><left/><right/><top/><bottom/><diagonal/></border>"], h = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'], c = /* @__PURE__ */ new Map(), a = (d, p) => {
      const m = d.indexOf(p);
      return m >= 0 ? m : (d.push(p), d.length - 1);
    }, x = (d, p, m, w) => {
      const L = T(
        d ? w?.textColor ?? e.headerTextColors?.[p] : e.cellTextColors?.[m]?.[p],
        "FF222222"
      ), I = d ? w?.background ?? e.headerBackgrounds?.[p] ?? "#e9edf2" : e.cellBackgrounds?.[m]?.[p], N = d ? w?.gradient ?? e.headerGradients?.[p] : void 0, Z = (d ? w?.borders ?? e.headerCellBorders?.[p] : e.cellBorders?.[m]?.[p]) ?? {
        right: { color: "#cdcdcd", width: 1 },
        bottom: { color: "#cdcdcd", width: 1 }
      }, H = d ? 0 : Math.max(0, Math.min(250, Math.floor(e.cellIndents?.[m]?.[p] ?? 0))), _ = H ? "left" : d ? "center" : e.columns[p].align ?? "left", G = JSON.stringify([d, L, I, N, Z, _, H]), W = c.get(G);
      if (W !== void 0) return W;
      const se = a(
        o,
        `<font><sz val="11"/><color rgb="${L}"/><name val="Calibri"/>${d ? "<b/>" : ""}</font>`
      ), ne = N ? a(
        i,
        `<fill><gradientFill degree="90"><stop position="0"><color rgb="${T(
          N.startColor,
          "FFFFFFFF"
        )}"/></stop><stop position="1"><color rgb="${T(
          N.endColor,
          "FFF1F1F1"
        )}"/></stop></gradientFill></fill>`
      ) : I ? a(
        i,
        `<fill><patternFill patternType="solid"><fgColor rgb="${T(
          I,
          "FFFFFFFF"
        )}"/><bgColor indexed="64"/></patternFill></fill>`
      ) : 0, le = a(
        s,
        "<border>" + ["left", "right", "top", "bottom"].map((A) => {
          const R = Z[A];
          if (!R || !Number.isFinite(R.width) || R.width <= 0) return `<${A}/>`;
          const oe = R.style === "dashed" || R.style === "dotted" || R.style === "double" ? R.style : R.width >= 3 ? "thick" : R.width >= 2 ? "medium" : "thin";
          return `<${A} style="${oe}"><color rgb="${T(R.color, "FFCDCDCD")}"/></${A}>`;
        }).join("") + "<diagonal/></border>"
      ), X = h.length;
      return h.push(
        `<xf numFmtId="0" fontId="${se}" fillId="${ne}" borderId="${le}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${_}" vertical="center" wrapText="1"${H ? ` indent="${H}"` : ""}/></xf>`
      ), c.set(G, X), X;
    }, u = (d, p, m) => {
      const w = `${P(m)}${p + 1}`, L = `r="${w}" s="${x(
        p < n,
        m,
        p - n,
        v[p]?.[m]
      )}"`;
      if (typeof d == "number" && Number.isFinite(d)) return `<c ${L}><v>${d}</v></c>`;
      if (typeof d == "boolean") return `<c ${L} t="b"><v>${d ? 1 : 0}</v></c>`;
      const I = String(d ?? "");
      if (I.length > 32767) throw new RangeError(`Excel cell ${w} exceeds 32767 characters`);
      return `<c ${L} t="inlineStr"><is><t xml:space="preserve">${D(I)}</t></is></c>`;
    }, f = Array.from({ length: n }, () => e.columns.map(() => "")), v = Array.from({ length: n }, () => []), F = [];
    e.headerRows?.length ? e.headerRows.forEach(
      (d, p) => d.forEach((m) => {
        f[p][m.column] = m.label;
        for (let w = p; w < p + m.rowSpan; w++)
          for (let L = m.column; L < m.column + m.colSpan; L++) v[w][L] = m;
        (m.rowSpan > 1 || m.colSpan > 1) && F.push(
          `${P(m.column)}${p + 1}:${P(m.column + m.colSpan - 1)}${p + m.rowSpan}`
        );
      })
    ) : f[0] = e.columns.map((d) => d.label ?? "");
    const y = Math.max(12, e.rowHeight ?? 26) * 0.75, S = [...f, ...e.rows].map(
      (d, p) => `<row r="${p + 1}" ht="${y}" customHeight="1"${p >= n && e.outlineLevels ? ` outlineLevel="${e.outlineLevels[p - n]}"` : ""}>${e.columns.map((m, w) => u(d[w] ?? "", p, w)).join("")}</row>`
    ).join(""), k = `${P(e.columns.length - 1)}${e.rows.length + n}`, g = r.mergeCells === !1 ? [] : [
      ...F,
      ...e.merges.map(
        (d) => d.replace(/([A-Z]+)(\d+)/g, (p, m, w) => `${m}${Number(w) + n - 1}`)
      )
    ], $ = Re(e, T, D, n), C = e.outlineLevels?.reduce((d, p) => Math.max(d, p), 0) ?? 0, M = `<worksheet xmlns="${j}" xmlns:r="${E}">${e.outlineLevels ? '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' : ""}<dimension ref="A1:${k}"/><sheetViews><sheetView workbookViewId="0">${r.freezeHeader === !1 ? "" : `<pane ySplit="${n}" topLeftCell="A${n + 1}" activePane="bottomLeft" state="frozen"/>`}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="${y}"${C ? ` outlineLevelRow="${C}"` : ""}/><cols>${e.columns.map(
      (d, p) => `<col min="${p + 1}" max="${p + 1}" width="${Math.min(
        255,
        Math.max(1, ((d.width ?? 100) - 5) / 7)
      ).toFixed(2)}" customWidth="1"/>`
    ).join("")}</cols><sheetData>${S}</sheetData>${r.autoFilter ? `<autoFilter ref="A${n}:${k}"/>` : ""}${g.length ? `<mergeCells count="${g.length}">${g.map((d) => `<mergeCell ref="${D(d)}"/>`).join("")}</mergeCells>` : ""}${$ ? '<drawing r:id="rId1"/>' : ""}</worksheet>`, V = {
      "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${E}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<workbook xmlns="${j}" xmlns:r="${E}"><sheets><sheet name="${D(
        l
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${E}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${E}/styles" Target="styles.xml"/></Relationships>`,
      "xl/styles.xml": `<styleSheet xmlns="${j}"><fonts count="${o.length}">${o.join(
        ""
      )}</fonts><fills count="${i.length}">${i.join("")}</fills><borders count="${s.length}">${s.join(
        ""
      )}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${h.length}">${h.join(
        ""
      )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      "xl/worksheets/sheet1.xml": M
    };
    return $ && (V["[Content_Types].xml"] = V["[Content_Types].xml"].replace(
      "</Types>",
      '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'
    ), V["xl/drawings/drawing1.xml"] = $, V["xl/worksheets/_rels/sheet1.xml.rels"] = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${E}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`), new Blob([Le(V)], { type: Ie });
  }
  download(e, r = "grid-export.xlsx") {
    ie(e, r, "grid-export.xlsx", "xlsx");
  }
}
export {
  Te as ExcelConverter,
  Ee as createExcelData
};
