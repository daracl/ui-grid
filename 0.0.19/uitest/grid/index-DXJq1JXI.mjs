import { isArray as F, isNil as ps, isDate as ws, isBlank as Le, arrayCopy as ys, sanitizeHtml as Is, isFunction as A, isUndefined as B, writeClipboard as vs, isString as le, stringSplit as Mt, xss as j, hasClass as be, isSafeUrl as jt, isSameValue as Vt, joinUrl as xs, normalizeCssLength as At, deepCopy as Cs, isMouseMoved as gt, parseClipboard as Es, camelToKebab as Ms, outerLayerPosition as bs, getBrowserSize as Ss, debounce as Rs, isVisible as Ts } from "./core/utils.js";
import { Ajax as Ls } from "./core/index.js";
function Vs(a, e) {
  const i = /[0,.]+/.exec(e);
  if (!i) return e;
  const s = i[0], n = e.slice(0, e.indexOf(s)), r = e.slice(e.indexOf(s) + s.length), [o, l] = s.split("."), c = o.includes(",");
  let d = "";
  if (l) {
    const h = a.toFixed(l.length), [u, g] = h.split("."), f = g.replace(/0+$/, "");
    d = c ? ri(u) : u, f.length > 0 && (d += "." + f);
  } else {
    const h = Math.round(a).toString();
    d = c ? ri(h) : h;
  }
  return `${n}${d}${r}`;
}
function ri(a) {
  return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function Xt(a, e) {
  return e.type == "number" && !isNaN(a) ? Vs(a, e.format ?? "0,0") : a;
}
const rt = "daracl-grid-id", oe = {
  cell: "cell",
  multiCell: "multiCell",
  row: "row",
  multiRow: "multiRow",
  none: "none"
}, ct = {
  cell: "cell",
  row: "row",
  none: "none"
}, Dt = {
  left: "dg-left",
  center: "dg-center",
  right: "dg-right"
}, re = {
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
}, As = "dg", V = {
  // 생성
  CREATE: "C",
  // 수정
  MODIFY: "U",
  // 삭제
  DELETE: "D",
  // 읽기
  READ: "R"
}, _e = {
  BEFORE: "before",
  AFTER: "after"
}, ft = {
  horizontal: 10,
  // left/right padding
  vertical: 5
  // top/bottom padding
}, $t = 5, Ti = 35, Nt = 40, Li = 27, Vi = 35, je = "_dg", ye = "$lineNumber", mt = "$rowCheck", R = {
  ID: `${je}$rowid`,
  DEPTH: `${je}$depth`,
  HEIGHT: `${je}$rowHeight`,
  CUD: "_$CUD"
}, P = "$all$", Yt = "$rowDragHandle", Ai = "data-dg-grid-layer", Ae = "dg-field-layer", oi = 1e3, Zt = ".dg-hidden-layers", Me = {
  IDLE: "IDLE",
  PRESSED: "PRESSED",
  DRAGGING: "DRAGGING"
}, zt = 18, He = 4, O = {
  LEFT: "L",
  RIGHT: "R"
}, ee = {
  UP: "U",
  DOWN: "D"
}, Z = {
  SELECTION: "dg-selection",
  START_CELL: "dg-start-cell"
}, Di = /[ㄱ-ㅎ가-힣a-zA-Z0-9_]+/g, Fe = {
  PREV: "prev",
  NEXT: "next"
};
function Ds(a, e, t) {
  if (e === "count") return a.length;
  if (e !== "min" && e !== "max" && e !== "sum" && e !== "avg")
    return `${e} not valid`;
  let i = 0, s = e === "min" ? 1 / 0 : e === "max" ? -1 / 0 : 0;
  const n = a.length;
  for (let r = 0; r < n; r += oi) {
    const o = Math.min(r + oi, n), l = a.slice(r, o);
    for (let c = 0; c < l.length; c++) {
      const d = l[c][t];
      if (typeof d == "number") {
        switch (e) {
          case "min":
            d < s && (s = d);
            break;
          case "max":
            d > s && (s = d);
            break;
          default:
            s += d;
            break;
        }
        i++;
      }
    }
  }
  return i === 0 ? "not valid" : e === "avg" ? s / i : s;
}
function Se(a) {
  return a.field ?? a.name ?? "";
}
function ki(a, e, t) {
  const i = e?.displayFormat ?? t.displayFormat;
  return String(i ? Xt(a, i) : a);
}
function ke(a) {
  return a.groupSummaryFields ?? [];
}
function Je(a) {
  return ke(a).map((e) => Se(e));
}
function Hi(a, e) {
  if (typeof e.expression == "function") {
    const n = e.expression(a);
    if (typeof n != "number" || !Number.isFinite(n))
      throw new TypeError(`Group summary callback for ${e.field} must return a finite number`);
    return n;
  }
  if (e.expression === "count") return a.length;
  const t = e.expression;
  if (!t || !["sum", "avg", "min", "max"].includes(t))
    throw new Error(`Unsupported group summary expression: ${t}`);
  const i = a.flatMap((n) => {
    const r = n[Se(e)];
    if (r == null || r === "") return [];
    const o = Number(r);
    return Number.isFinite(o) ? [{ [Se(e)]: o }] : [];
  }), s = i.length ? Ds(i, t, Se(e)) : 0;
  return typeof s == "number" ? s : 0;
}
function S(a, ...e) {
  return a.reduce((t, i, s) => {
    const n = e[s];
    return t + i + (n == null ? "" : String(n));
  }, "");
}
const he = {
  search: S`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`,
  refresh: S`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`,
  save: S`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`,
  add: S`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`,
  delete: S`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`,
  edit: S`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`,
  copy: S`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`,
  move: S`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`,
  cut: S`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`,
  upload: S`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  download: S`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`,
  mapping: S`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  preview: S`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`,
  permission: S`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  parameter: S`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`,
  start: S`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`,
  stop: S`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`,
  pause: S`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`,
  restart: S`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`,
  terminate: S`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`,
  help: S`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`,
  scrollUp: S`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`,
  scrollDown: S`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`,
  scrollLeft: S`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`,
  scrollRight: S`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`,
  headerSort: S`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`,
  sortup: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="50,0 0,100 100,100" fill="#737171"></polygon></g></svg>',
  sortdown: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="0,0 100,0 50,90" fill="#737171"></polygon></g></svg>'
};
function pt(a, e, t) {
  return a.getAttribute(e) == t;
}
function ie(a, e = !1) {
  if (!a)
    throw new Error("Invalid element.");
  const t = a.getBoundingClientRect(), i = e ? window.scrollX : 0, s = e ? window.scrollY : 0;
  return {
    top: t.top + s,
    left: t.left + i,
    bottom: t.bottom + s,
    right: t.right + i,
    width: t.width,
    height: t.height
  };
}
function li(a, e) {
  for (const t in e)
    a.setAttribute(t, e[t]);
}
function ai(a, ...e) {
  let t;
  a instanceof HTMLElement ? t = [a] : t = a, t.forEach((i) => {
    for (const s of e)
      i.removeAttribute(s);
  });
}
function Jt(a) {
  return a ? Array.isArray(a) ? a : a instanceof Element ? [a] : a instanceof NodeList ? Array.from(a) : Array.from(document.querySelectorAll(a)) : [];
}
function k(a, e, t = {}) {
  const i = document.createElement(a);
  e && (i.className = e);
  for (const [s, n] of Object.entries(t))
    typeof n == "object" && n !== null ? s === "style" ? Object.assign(i.style, n) : s === "dataset" ? Object.assign(i.dataset, n) : i.setAttribute(s, JSON.stringify(n)) : i.setAttribute(s, String(n));
  return i;
}
function Re(a, e, t) {
  return k(a, e, { [Ai]: t });
}
function bt(a, e, t, i = 2) {
  const s = ie(a), n = ie(e);
  let r = t.offsetHeight || ie(t).height;
  const o = window.innerHeight, l = s.top - n.top, d = n.bottom + r > o;
  let h = n.top - (r - i);
  return d ? (h = n.top - (r - i), h < 0 && (r = r - 5 + h), o - n.bottom > r ? (r = o - n.bottom - i, h = n.bottom - s.top) : h = -(r + i) - l) : h = n.bottom - s.top, {
    top: h,
    left: n.left - s.left,
    height: r,
    width: n.width
  };
}
function Qt(a) {
  return he[a] ?? "";
}
const Fi = (a, e) => Object.prototype.hasOwnProperty.call(a, e), J = (a) => {
  if (Le(a))
    return !1;
  const e = Number(a);
  return !Number.isNaN(e);
}, ks = (a) => {
  vs(a);
};
function Hs(a) {
  return a instanceof HTMLElement;
}
const ci = (a, e) => {
  let t = a.replace(/{{if\(([^)]+)\)}}([\s\S]*?){{\/if}}/g, (i, s, n) => {
    const r = /^\s*(\w+)\s*$/, o = /^\s*(\w+)\s*(==|!=|>|>=|<|<=)\s*(\d+)\s*$/;
    let l = !1;
    if (r.test(s)) {
      const [, c] = s.match(r);
      l = !!e[c];
    } else if (o.test(s)) {
      const [, c, d, h] = s.match(o), u = e[c], g = Number(h);
      switch (d) {
        case "==":
          l = u == g;
          break;
        case "!=":
          l = u != g;
          break;
        case ">":
          l = u > g;
          break;
        case ">=":
          l = u >= g;
          break;
        case "<":
          l = u < g;
          break;
        case "<=":
          l = u <= g;
          break;
      }
    }
    return l ? n : "";
  });
  return t = t.replace(/{{\s*(\w+)\s*}}/g, (i, s) => Object.prototype.hasOwnProperty.call(e, s) ? e[s] : ""), t;
};
function St(a) {
  if (typeof a != "object" || a === null)
    return !1;
  let e = a;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(a) === e;
}
function Ot(a, e, t) {
  const i = a.getRowItem(e.id);
  return t.map(({ name: s, field: n, isValue: r }) => r ? n.$renderer.getValue(i) : i[s]);
}
function Fs(a, e, t = [], i = !1) {
  if (t.length === 0)
    return a.sort((n, r) => n.sortOrder - r.sortOrder), a;
  const s = t.length;
  return a.forEach((n) => {
    n.sortValues = Ot(e, n, t);
  }), a.sort((n, r) => {
    const o = n.sortValues, l = r.sortValues;
    for (let c = 0; c < s; c++) {
      const d = $i(o[c], l[c], t[c].ascOrder ?? !0, i);
      if (d !== 0)
        return d;
    }
    return 0;
  }), a;
}
function $i(a, e, t, i = !1) {
  const s = a == null, n = e == null;
  if (s !== n)
    return i || t ? s ? 1 : -1 : s ? -1 : 1;
  if (s)
    return 0;
  let r;
  return typeof a == "number" && typeof e == "number" ? r = a - e : r = String(a).localeCompare(String(e)), t ? r : -r;
}
function Pt(a) {
  return typeof a == "object" && a !== null && !Array.isArray(a);
}
const G = (...a) => {
  let e = a[0];
  if (!St(e) || tt(e))
    return e;
  let t = 1;
  Object.keys(e).length > 0 && (t = 0, e = F(e) ? [] : {});
  const i = a.length;
  for (; t < i; t += 1)
    wt(e, a[t]);
  return e;
};
function wt(a, e) {
  return F(e) ? zs(a, e) : ws(e) ? new Date(e.getTime()) : e instanceof RegExp ? new RegExp(e.source, e.flags) : Pt(e) ? Ns(a, e) : e;
}
const $s = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function Ns(a, e) {
  if (A(e))
    return e;
  for (const t of Object.keys(e)) {
    if ($s.has(t))
      continue;
    const i = e[t];
    B(i) || (i === null || A(i) ? a[t] = i : i instanceof RegExp ? a[t] = new RegExp(i.source, i.flags) : tt(a[t]) ? a[t] = wt(F(i) ? [] : {}, i) : Pt(i) ? (Pt(a[t]) || (a[t] = {}), wt(a[t], i)) : a[t] = i);
  }
  return a;
}
function zs(a, e) {
  const t = St(a);
  for (let i = 0; i < e.length; i += 1) {
    const s = e[i];
    let n;
    s == null ? n = s : s instanceof RegExp ? n = new RegExp(s.source, s.flags) : n = wt(F(s) ? [] : {}, s), t ? a[i] = n : a.push(n);
  }
  return a;
}
function Os(a, e, t = !1, i) {
  if (a === e)
    return !0;
  if (a.length !== e.length)
    return !1;
  const s = ((n) => n);
  if (t) {
    const n = [...a].sort((o, l) => di(s(o), s(l))), r = [...e].sort((o, l) => di(s(o), s(l)));
    return n.every((o, l) => s(o) === s(r[l]));
  }
  return a.every((n, r) => s(n) === s(e[r]));
}
function di(a, e) {
  return a === e ? 0 : a > e ? 1 : -1;
}
const ue = (a) => Number.parseInt(a, 10), tt = (a) => ps(a);
function ei(a, e, t) {
  const i = ys(a, e, t);
  return e === void 0 && t === void 0 ? [...i] : i;
}
function $e(a, e) {
  const t = e == null ? "" : String(e);
  if (!/[<&]/.test(t)) {
    a.textContent = t;
    return;
  }
  a.replaceChildren(Is(t));
}
let kt = {
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
  column: "열",
  "export.format": "내보내기 형식",
  "context.copy": "Copy",
  "context.exportFile": "Export file",
  "export.download": "다운로드",
  "export.creating": "파일 생성 중",
  "export.completed": "다운로드 완료",
  "export.failed": "다운로드 실패",
  "export.unsupportedFormat": "내보내기 형식을 선택하세요. 지원 형식: excel, xlsx, csv, json, pdf"
};
class Ni {
  constructor() {
    this.lang = kt;
  }
  static setGlobalMessage(e) {
    kt = G(kt, e);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  setMessage(e) {
    this.lang = G(this.lang, e);
  }
  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  getMessage(e) {
    return this.lang[e];
  }
  /**
   * ValidResult 값을 메시지로 변경.
   *
   * @public
   * @param {FieldItem} field
   * @param {ValidResult} validResult
   * @returns {string[]}
   */
  validMessage(e, t) {
    let i = "";
    const s = [];
    t.regexp && (i = this.lang.regexp[t.regexp], s.push(i)), (t.constraints ?? []).forEach((o) => {
      o === re.REQUIRED && (i = hi(this.lang.required, e), s.push(i));
      const l = e.editRenderer?.type;
      l == "number" || l == "range" ? (i = this.lang.number[o], s.push(i)) : (i = this.lang.string[o], s.push(i));
    });
    const n = [], r = Object.assign({}, { name: e.name, label: e.label }, e.editRenderer?.rule);
    return s.forEach((o) => {
      o && n.push(hi(o, r));
    }), t.validator && n.push(t.validator.message), n;
  }
}
const Ps = /\{([A-Za-z0-9_.]+)\}/g;
function Bs(a, e) {
  const t = e.split(".");
  let i = a;
  for (let s = 0; s < t.length; s++) {
    if (i == null) return;
    i = i[t[s]];
  }
  return i;
}
function hi(a, e) {
  return a.replace(Ps, (t, i) => {
    const s = Bs(e, i);
    return s == null ? t : String(s);
  });
}
const Ws = {
  light: "light",
  dark: "dark"
}, dt = {
  default: "default",
  striped: "striped",
  borderless: "borderless",
  rows: "rows",
  cells: "cells",
  stripedRows: "striped-rows",
  stripedCells: "striped-cells"
}, X = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
}, Gs = {
  pre: "pre",
  wrap: "pre-wrap",
  line: "pre-line",
  normal: "normal"
}, W = "dg-selected", _s = {
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
}, zi = (a) => a ? a.match(/\S+/g) ?? [] : [];
function Te(a, ...e) {
  if (!a) return;
  Jt(a).forEach((i) => {
    i.classList.add(...e);
  });
}
function ce(a, ...e) {
  if (!a || e.length < 1) return;
  const t = Jt(a);
  for (const i of t)
    i.classList.remove(...e);
}
function Us(a, e) {
  if (!a || typeof e != "string") return;
  const t = Jt(a), i = zi(e);
  for (const s of t)
    i.forEach((n) => {
      s.classList.toggle(n);
    });
}
const it = (a, e) => {
  if (!a)
    return [];
  let t;
  return A(a) ? t = a(e) : t = a + "", zi(t);
}, Oi = (a) => {
  if (!a.whiteSpace)
    return {
      style: "",
      className: ""
    };
  const e = Gs[a.whiteSpace];
  return e ? {
    style: `white-space: ${e}`,
    className: "dg-white-space"
  } : {
    style: "",
    className: ""
  };
}, yt = (a) => {
  const e = a.variant;
  if (!e) return "";
  const t = a.type;
  return _s[t]?.[e] ?? "";
};
function Oe(a) {
  return a.shiftKey;
}
function It(a) {
  return a.ctrlKey;
}
function qs(a) {
  const e = a;
  return e.key === " " || e.code === "Space";
}
function Ks(a) {
  const e = a;
  return e.key === "Enter" || e.code === "Enter";
}
function Pi(a) {
  const e = a;
  return e.key === "Escape" || // 표준
  e.key === "Esc" || // 구형 브라우저
  e.code === "Escape";
}
const $ = (a) => {
  a.preventDefault(), a.stopPropagation();
}, js = (a) => a.code, se = (a) => {
  if (typeof PointerEvent < "u" && a instanceof PointerEvent)
    return {
      x: a.pageX,
      y: a.pageY,
      clientX: a.clientX,
      clientY: a.clientY
    };
  if (typeof TouchEvent < "u" && a instanceof TouchEvent) {
    const e = a.changedTouches?.[0] || a.touches?.[0] || a.targetTouches?.[0];
    if (e)
      return {
        x: e.pageX,
        y: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY
      };
  }
  return a instanceof MouseEvent ? {
    x: a.pageX,
    y: a.pageY,
    clientX: a.clientX,
    clientY: a.clientY
  } : {
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0
  };
};
function Ne(a) {
  return a.type.startsWith("touch") ? !0 : a instanceof MouseEvent ? a.button === 0 : !1;
}
function Bt(a, e, t, i) {
  const s = a.currentTarget, n = se(a);
  return {
    state: Me.PRESSED,
    event: a,
    startPos: n,
    currentPos: n,
    cellInfo: e,
    startTime: Date.now(),
    lastClickTime: 0,
    cellEl: i ?? s,
    clickManager: t
  };
}
const vt = (a) => a instanceof PointerEvent ? a.isPrimary && a.button === 0 : a instanceof MouseEvent ? a.button === 0 : a instanceof TouchEvent;
function ui(a) {
  return a ? Array.isArray(a) ? a : a instanceof Document || a instanceof Element ? [a] : a instanceof NodeList ? Array.from(a) : Array.from(document.querySelectorAll(a)) : [];
}
class Xs {
  constructor() {
    this.EVENT_HANDLER_MAP = /* @__PURE__ */ new WeakMap(), this.ELEMENTS = /* @__PURE__ */ new Set();
  }
  addEventInfo(e, t, i, s) {
    this.EVENT_HANDLER_MAP.has(e) || this.EVENT_HANDLER_MAP.set(e, {});
    const n = this.EVENT_HANDLER_MAP.get(e);
    n && (n[t] ??= []).push({ listener: i, capture: s }), this.ELEMENTS.add(e);
  }
  on(e, t, i) {
    const s = e.el;
    if (!s) return;
    const n = e.type, r = e.selector, o = n.replaceAll(/\s+/g, " ").split(" "), l = ui(s);
    let c;
    r && typeof r == "string" ? c = (d) => {
      const u = d.target.closest(r);
      !u || !l.some((f) => f.contains(u)) || t(d, u) === !1 && (d.stopImmediatePropagation(), d.preventDefault());
    } : c = (d) => {
      t(d, s) === !1 && (d.stopImmediatePropagation(), d.preventDefault());
    };
    for (const d of o) {
      const h = d.split(".")[0];
      l.forEach((u) => {
        this.addEventInfo(u, d, c, i?.capture ?? !1), u.addEventListener(h, c, i ?? {});
      });
    }
  }
  off(e, t) {
    if (!e) return;
    const i = t.replaceAll(/\s+/g, " ").split(" "), s = ui(e);
    for (const n of s) {
      const r = this.EVENT_HANDLER_MAP.get(n);
      if (!r) continue;
      let o = !1;
      for (const l of i) {
        const c = r[l];
        if (!c) continue;
        const d = l.split(".")[0];
        for (const h of c) n.removeEventListener(d, h.listener, h.capture);
        r[l] = void 0, o = !0;
      }
      if (o) {
        let l = !0;
        for (const c in r)
          if (r[c] !== void 0) {
            l = !1;
            break;
          }
        l && (this.EVENT_HANDLER_MAP.delete(n), this.ELEMENTS.delete(n));
      }
    }
  }
  /**
   * 제거
   */
  destroy() {
    this.ELEMENTS.forEach((e) => {
      const t = this.EVENT_HANDLER_MAP.get(e);
      if (t) {
        for (const i in t) {
          const s = i.split(".")[0];
          for (const n of t[i] ?? []) e.removeEventListener(s, n.listener, n.capture);
        }
        this.EVENT_HANDLER_MAP.delete(e);
      }
    }), this.ELEMENTS.clear();
  }
}
const Bi = (a, e) => {
  const t = a?.page || 1, i = a?.totalCount ?? e, s = a?.pageSize || 10, n = a?.unitPage || 10;
  return ti(i > 0 ? i : e, t, s, n);
}, ti = (a, e, t, i) => {
  if (t = t || 10, i = i || 10, a < 1)
    return {
      page: 0,
      pageSize: t,
      unitPage: i,
      totalCount: 0,
      totalPages: 0,
      currStartPage: 0,
      currEndPage: 0,
      prePage: 0,
      nextPage: 0,
      prePage_is: !1,
      nextPage_is: !1
    };
  const s = a % t == 0 ? a / t : Math.floor(a / t) + 1;
  s < e && (e = s);
  let n, r;
  if (s <= i)
    r = s, n = 1;
  else {
    let h = i;
    (e == i || e > i && s - (e - 1) >= i) && (h = Math.floor(i / 2)), e <= h ? (r = i, n = 1) : e + h < s ? (r = e + h, n = r - i + 1) : (r = e + h, r > s && (r = s), n = r - i + 1);
  }
  r > s && (r = s);
  let o = 0, l = !1;
  n != 1 && (l = !0, o = n - 1);
  let c = 0, d = !1;
  return r != s && (d = !0, c = r + 1), {
    page: e,
    unitPage: i,
    prePage: o,
    prePage_is: l,
    nextPage: c,
    nextPage_is: d,
    currStartPage: n,
    currEndPage: r,
    pageSize: t,
    totalCount: a,
    totalPages: s
  };
};
function Ys(a) {
  const e = Bi(
    St(a.paging) ? a.paging : {},
    a.items.length
  );
  let t = R.ID;
  return a.rowIdField ? t = a.rowIdField : a.tree && (t = a.tree.idField || "id"), {
    rowIdField: t,
    dataManager: {},
    eventManager: new Xs(),
    theme: "",
    checkOnRowSelect: a.aside?.rowCheckbox?.checkOnRowSelect === !0,
    enabledHeaderHelpButton: a.header?.help?.enabled,
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
    enabledCellEdit: a.editable ?? !1,
    isRowAllowMultiSelect: a.aside?.rowCheckbox?.allowMultiSelect ?? !0,
    searchEnabled: !1,
    searchParameter: {
      matchCase: !1,
      matchWholeWord: !1,
      useRegex: !1,
      searchFields: P,
      searchText: ""
    },
    searchMatchInfo: {
      currentMatchIndex: -1,
      matchCount: -1,
      rowIndex: -1,
      cellIndex: -1,
      id: ""
    },
    fieldHeaderGroup: Wi(),
    footer: { height: 0, width: 0 },
    navi: { height: 0, width: 0 },
    toolbar: { height: 0, width: 0 },
    initSettingFlag: !1,
    template: {},
    isHeaderResize: !1,
    isOpenLayer: !1,
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
    rowHeight: Math.max(a.body.row.height ?? 26, 26),
    enabledSortButton: a.header?.sort.enabled,
    sort: { orders: [] },
    paging: e,
    selection: {},
    focus: !1,
    isMoveRow: !1,
    isBodyDragging: !1,
    isHeaderDragging: !1,
    mouseEnter: !1,
    currentClickInfo: {},
    allCheck: !1,
    settingConfig: {
      viewInitFlag: !0,
      filterTemplate: "",
      filterOperatorTemplate: {},
      // filter html template
      searchCheckItem: !1,
      // 검색 정규식
      filterCheckItem: !1
      // filter info {checkFn, check condition}
    },
    fixedLeftIndex: Math.max(a.fixedLeftIndex, 0),
    fixedRightIndex: Math.max(a.fixedRightIndex, 0),
    scroll: Qs(),
    scrollbarSize: a.scroll.width ?? 12,
    disableVerticalScroll: a.scroll?.vertical?.enabled === !1,
    disableHorizontalScroll: a.scroll?.horizontal?.enabled === !1,
    edit: en(),
    canvasContext: void 0,
    activeComponent: ""
  };
}
function Zs() {
  return {
    id: "",
    range: Js(),
    allRange: /* @__PURE__ */ new Map(),
    isSelect: !1,
    isMouseDown: !1,
    all: !1,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
    startCell: { startIdx: -1, startCol: -1 }
  };
}
function Js() {
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
function Qs() {
  return {
    centerLeftPosition: 0,
    before: {
      startIdx: 0,
      viewRow: 0,
      startCol: 0,
      endCol: 0,
      hideLastRow: !1
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
    enabledVertical: !1,
    enabledHorizontal: !1,
    verticalScrollTimer: -1,
    horizontalScrollTimer: -1,
    mouseDown: !1
  };
}
function Wi() {
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
function en() {
  return {
    enabled: !1,
    cell: {
      r: -1,
      c: -1,
      field: {},
      item: {},
      rowIndex: -1
    }
  };
}
const Pe = (a, e) => e < a.fixedLeftIndex, Be = (a, e) => a.fixedRightIndex > 0 && e >= a.fixedRightIndex, ii = (a) => a == oe.multiRow || a == oe.multiCell, tn = (a) => a == oe.cell || a == oe.row, sn = (a) => a == oe.multiCell, Qe = (a) => a == oe.multiRow || a == oe.row, nn = (a) => a == oe.multiCell || a == oe.cell, me = (a, e) => {
  const t = rn(e), i = a.scroll.startIdx + t.r, s = t.c, n = a.dataManager.getViewItems()[i];
  return {
    r: t.r,
    c: s,
    rowIndex: i,
    field: a.currentFields[t.c],
    item: a.dataManager.getRowItem(n.id),
    viewItem: n
  };
}, rn = (a) => {
  const e = (on(a) ?? "").split(",");
  return {
    r: ue(e[0]),
    c: ue(e[1])
  };
}, on = (a) => a.dataset.cellPosition, ln = (a, e) => {
  const t = cn(e);
  return {
    c: t,
    field: a.currentFields[t]
  };
}, an = (a, e) => {
  const t = ue(e.dataset.resizeIdx ?? "-1");
  return {
    c: t,
    field: a.currentFields[t]
  };
}, cn = (a) => ue(a.dataset.headerCellPosition ?? "-1"), Gi = (a, e, t = 10) => e ? (a.canvasContext?.measureText(e)?.width ?? 0) + t : t, dn = (a, e, t) => {
  const i = a.dataManager, s = i.getViewItems(), n = e.header.resize.maxWidth;
  let r = 0;
  const o = a.canvasContext, l = a.scroll.startIdx;
  let c = 0;
  for (let d = l, h = Math.min(a.dataInfo.rowLength, l + 100); d < h; d++) {
    const u = t.$renderer.getValue(i.getRowItem(s[d].id));
    if (tt(u)) continue;
    const g = o.measureText(u);
    if (c = Math.max(g.width, c), n > 0 && c >= n)
      return n;
    r = Math.max(r, c);
  }
  return r + 16;
}, _i = (a, e) => e < 1 ? 0 : a.dimensions.mainCenterOverWidth * (e / (a.scroll.hTrackWidth - a.scroll.hThumbWidth) * 100) / 100, gi = (a, e, t) => {
  if (e < 1 || a.dimensions.mainCenterOverWidth <= 0)
    return 0;
  let i;
  return t === O.RIGHT ? i = e - a.dimensions.mainCenterViewWidth : i = e - 2, i / a.dimensions.mainCenterOverWidth * 100 * (a.scroll.hTrackWidth - a.scroll.hThumbWidth) / 100;
}, hn = (a) => a.search(/(input|select|textarea)/i) > -1, Ui = (a, e, t, i, s, n) => {
  const r = a.scroll, o = a.dataInfo, l = r.startIdx, c = r.insideViewRow, d = r.viewRow, h = o.rowLength;
  let u = null, g = -1;
  if (e < s)
    return l > 0 ? (u = ee.UP, g = l - 1) : g = 0, { scrollDirectionY: u, rowIdx: g, viewRowIdx: 0 };
  if (e > n)
    return l + c < h ? (u = ee.DOWN, g = l + c + 1) : g = h - 1, { scrollDirectionY: u, rowIdx: g, viewRowIdx: c };
  const f = e - s, m = 1 / t, p = f * m | 0;
  return p < d && (g = l + p), { scrollDirectionY: u, rowIdx: g, viewRowIdx: p };
}, qi = (a, e, t, i, s, n) => {
  let r = null, o = -1;
  const l = a.currentFields, c = l.length, d = a.selection.startCell.startCol;
  let h = 0, u = c, g = 0, f = 0;
  const { fixedLeftIndex: m, fixedRightIndex: p } = a;
  if (e < i ? (g = e - t, u = m, r = O.LEFT) : e > s ? (h = p, h > 0 ? g = e - s : o = c - 1, r = O.RIGHT) : (g = e - i, h = m, f = _i(a, a.scroll.left)), !(h < 1 && r === O.RIGHT)) {
    if (g <= 0)
      o = 0;
    else if (o === -1) {
      let y = 0, I = !1;
      for (let w = h; w < u; w++) {
        const v = l[w].$width;
        if (y += v, (f <= 0 || I) && y > g) {
          o = w;
          break;
        }
        !I && y >= f && (I = !0, y = f > 0 && y > f ? y - f : y);
      }
      o === -1 && y < g && (o = u);
    }
  }
  return (r === O.LEFT && (Pe(a, d) || a.scroll.left == 0) || r === O.RIGHT && (Be(a, d) || c - (p > 0 ? c - p : 0) - 1 == a.scroll.insideEndCol)) && (r = null), o = Math.max(o, a.dataInfo.startCol), { scrollDirectionX: r, overCell: o };
}, Ki = (a, e) => a == 0 ? "none" : a == e ? "all" : "partial", Rt = (a) => a?.listItem?.valueField ?? "value", Tt = (a) => a?.listItem?.labelField ?? "label", ji = (a, e) => {
  let t, i = [];
  return F(a) && a.length > 0 ? (t = a[0], i = a) : t = J(a) ? a : 28, { height: t, heights: i };
}, un = (a) => {
  if (new Set(a).size !== a.length) return !1;
  const t = Math.min(...a);
  return Math.max(...a) - t + 1 === a.length;
}, gn = (a) => typeof a != "string" ? a : /["\n\r\t]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a, Lt = (a, e) => e ? e.editable === !0 || a.enabledCellEdit && e.editable !== !1 : !1, Ht = (a) => {
  const e = a.fixedRightIndex > 0 ? 1 : 2, t = a.scroll.enabledVertical ? a.scrollbarSize + e : 0;
  return a.dimensions.width - t - 1;
}, Ue = {
  NONE: -1,
  UP: 1,
  DOWN: 2,
  LEFT: 10,
  RIGHT: 20
}, Xi = (a, e, t, i) => {
  let s = Ue.NONE;
  return t < e.startIdx ? s = Ue.UP : t > e.startIdx + e.viewRow && (s = Ue.DOWN), !Pe(a, i) && !Be(a, i) && (i < e.insideStartCol ? s = Math.max(s, 0) + Ue.LEFT : i > e.insideEndCol && (s = Math.max(s, 0) + Ue.RIGHT)), s;
}, xt = (a, e) => F(a) ? a : le(a) ? Mt(a, e) : [String(a)];
class Yi {
  constructor(e, t) {
    this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.enabledTooltip = t.options().enabledTooltip;
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
  bindEvents(e, t, i) {
    return !1;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return X.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @returns
   */
  getMinWidth(e, t) {
    return dn(e, t, this.field);
  }
  applyRendererRefState(e, t) {
    const i = t?.hide ?? !1, s = e.classList;
    if (s.contains("dg-hide") !== i && s.toggle("dg-hide", i), i) return !1;
    const n = t?.disabled ?? !1;
    s.contains("dg-disabled") !== n && s.toggle("dg-disabled", n);
  }
}
class We extends Yi {
  constructor(e, t) {
    super(e, t), this.rendererContainer = this.gridMain.getRendererLayerElement(), this._editable = Lt(this.gridMain.config(), e);
  }
  isEditable() {
    return this._editable;
  }
  /** 편집 값을 유지하면서 현재 셀 위치에 맞춰 레이어를 배치합니다. */
  openCellLayer(e, t) {
    this.gridMain.openLayer(e, () => {
      if (!t.isConnected) return;
      const i = ie(t), s = ie(this.rendererContainer);
      Object.assign(e.style, {
        top: `${i.top - s.top}px`,
        left: `${i.left - s.left}px`,
        width: `${i.width}px`,
        height: `${i.height}px`
      });
    });
  }
  /**
   * 값 얻기
   *
   @param {any} item row item
   * @returns {any} field value
   */
  getValue(e, t) {
    return t ?? e[this.field.name] ?? "";
  }
  completeEdit() {
    this.gridMain.setGridFocusIn();
  }
  /**
   * 값 셋팅
   *
   * @public
   @param {Event} e event object
   * @param {any} value row value
   */
  setValue(e, t, i, s = !0) {
    if (!this.valid(i))
      return !1;
    if (this.changeEventCall(e, t, i)) {
      if (!this.gridMain.config().dataManager.setChangeValue(t, this.field, i))
        return !1;
      s && this.gridMain.getBody().dataDraw("dataChange");
    }
  }
  changeEventCall(e, t, i) {
    const s = this.field, n = i;
    if (s.editRenderer.change) {
      const r = {
        field: s,
        evt: e,
        item: G({}, t),
        //oldValue: field.$value,
        value: n
      };
      if (r.oldValue !== r.value && s.editRenderer.change.call(null, r) === !1)
        return !1;
    }
    return !0;
  }
  tooltip(e, t) {
    this.enabledTooltip && e.setAttribute("title", t);
  }
  /**
   * 유효성 검증 html element
   * @returns div element
   */
  getValidatorElement() {
    if (this.validatorElement)
      return this.validatorElement;
    const e = Re("div", "dg-validator-message " + Ae, "validator");
    return this.validatorElement = e, this.rendererContainer.appendChild(e), e;
  }
  /**
   * 유효성 메시지 보이기
   *
   * @param result 유효성 검증 결과
   * @param cellElement cell element
   * @returns
   */
  showInvalidMessage(e, t) {
    if (!this.gridMain.config().isOpenLayer) return !0;
    const i = this.language.validMessage(this.field, e);
    if (i.length > 0) {
      const s = this.getValidatorElement();
      s.textContent = i[0];
      const n = s.style;
      return this.gridMain.openLayer(s, () => {
        if (!t.isConnected) return;
        const r = ie(t), o = ie(this.rendererContainer);
        n.top = `${r.top - o.top - s.offsetHeight}px`, n.left = `${r.left - o.left}px`;
      }), !0;
    }
    return !1;
  }
  supportsEdit() {
    return !0;
  }
}
class fn extends We {
  constructor(e, t) {
    super(e, t);
    const i = this.field.editRenderer;
    this.trueValue = i.trueValue ?? !0, this.falseValue = i.falseValue ?? !1, this.showLabel = i.showLabel ?? !1;
  }
  render(e, t) {
    const i = this.getValue(e.item, e.inputValue);
    let s = t.firstElementChild;
    if (!s) {
      s = k("div", "dg-choice", "");
      const n = k("div", "dg-choice-item  dg-checkbox", {
        role: "presentation"
      });
      if (n.appendChild(k("div", "dg-indicator ", "")), s.appendChild(n), this.showLabel) {
        const r = document.createElement("span");
        r.className = "dg-cell-content-label dg-ellipsis", n.appendChild(r);
      }
      t.appendChild(s), this.isEditable() && this.initClick(s);
    }
    if (i === this.trueValue ? s.firstElementChild?.classList.add(W) : s.firstElementChild?.classList.remove(W), this.tooltip(s, i), this.showLabel) {
      const n = t.querySelector(".dg-cell-content-label");
      n && (n.textContent = i);
    }
  }
  initClick(e) {
    const t = this.gridMain.config();
    t.eventManager.on({ el: e, type: "click" }, (i) => {
      const s = this.getClosestCellElement(e), n = me(t, s), r = n.item, l = this.getValue(r, n.inputValue) === this.trueValue;
      this.setValue(i, r, l ? this.falseValue : this.trueValue), this.render(n, s);
    });
  }
  valid(e) {
    return !0;
  }
  supportsInteraction() {
    return !0;
  }
  alignStyle() {
    return X.center;
  }
  getMinWidth(e, t) {
    return 50;
  }
}
class mn extends We {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item;
    t.innerHTML = '<input type="text">', this.getValue(i, e.inputValue);
  }
  valid(e) {
    return !0;
  }
}
const pn = {
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
}, wn = (a, e, t) => {
  typeof t > "u" && (t = { name: e.name, constraints: [] });
  const i = e.editRenderer?.regexpType;
  return i && !pn[i].test(a) && (t.regexp = i), t;
}, Zi = (a, e, t, i, s) => {
  const n = e.editRenderer;
  if (!n) return null;
  if (n.validator && (s.validator = n?.validator(e, t), typeof s.validator == "object") || (s = wn(a, e, s), s.regexp))
    return s;
  if (n.different) {
    const r = n.different.field;
    if (i.allFieldMap.has(r) && a == i.allFieldMap.get(r)?.$renderer.getValue(t))
      return s.message = n.different.message, s;
  }
  if (n.identical) {
    const r = n.identical.field;
    if (i.allFieldMap.has(r) && a == i.allFieldMap.get(r)?.$renderer.getValue(t))
      return s.message = n.identical.message, s;
  }
  return null;
}, yn = (a, e, t, i) => {
  const s = { name: e.name, constraints: [] }, n = e.editRenderer;
  if (!n)
    return null;
  if (n.required && Le(a))
    return s.constraints.push(re.REQUIRED), s;
  const r = Zi(a, e, t, i, s);
  if (r !== null)
    return r;
  const o = n.rule;
  if (o) {
    const l = a.length, c = J(o.minLength), d = J(o.maxLength);
    let h = !1, u = !1;
    if (c && l < o.minLength && (h = !0), d && l > o.maxLength && (u = !0), c && d && (h || u) ? s.constraints.push(re.BETWEEN) : (h && s.constraints.push(re.MIN_LENGTH), u && s.constraints.push(re.MAX_LENGTH)), s.constraints.length > 0)
      return s;
  }
  return null;
};
class st extends We {
  constructor(e, t) {
    super(e, t);
  }
  initEvt(e, t) {
    const { eventManager: i } = this.gridMain.config();
    i.on({ el: e, type: "blur" }, (s) => {
      this.isShow && this.setChangeValue(s);
    }), i.on({ el: e, type: "keydown" }, (s) => {
      const n = s.key;
      n === "Enter" && this.field.editRenderer?.type !== "textarea" ? this.setChangeValue(s) : n === "Escape" && this.setChangeValue(s, !0);
    });
  }
  getElementValue() {
    return this.editElement.value;
  }
  setChangeValue(e, t = !1) {
    if (this.isShow = !1, !t) {
      const i = this.getElementValue();
      if (this.setValue(e, this.item, i) === !1)
        return this.isShow = !0, !1;
    }
    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild), this.gridMain.hideLayer(), this.completeEdit();
  }
  valid(e) {
    const t = yn(e, this.field, this.item, this.gridMain.config());
    return t == null ? !0 : !this.showInvalidMessage(t, this.cellElement);
  }
  textRender(e, t, i) {
    const s = e.item;
    this.cellInfo = e, this.item = s, this.cellElement = t;
    let n = this.editElement;
    n || (n = Re("input", "dg-edit-input " + Ae, e.c + ""), n.type = i, n.name = this.field.$uid, n.setAttribute("autocomplete", "off"), this.rendererContainer.appendChild(n), this.editElement = n, this.initEvt(n, s)), this.isShow = !0, this.openCellLayer(n, t);
    const r = this.getValue(s, e.inputValue);
    n.value = r, n.focus();
  }
}
let In = class extends st {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "date");
  }
};
function ze(a, e, t) {
  const i = /* @__PURE__ */ new Map(), s = le(a[0]), n = [];
  for (const r of a) {
    let o, l;
    if (s) {
      o = r, l = r;
      const c = {};
      c[t] = r, c[e] = r, n.push(c);
    } else
      o = r?.[t] ?? "", l = r?.[e] ?? "", n.push(r);
    i.set(o, l);
  }
  return { list: n, map: i };
}
function vn(a, e, t) {
  a.tabIndex = 0, a.focus(), e.off(a, "focusout"), e.on({ el: a, type: "focusout" }, (i) => {
    a.style.display = "none";
  });
}
function Ct(a, e) {
  const t = /* @__PURE__ */ new Set();
  return a.filter((s) => t.has(s[e]) ? !1 : (t.add(s[e]), !0));
}
function Ji(a, e, t, i, s) {
  if (!t)
    return s ? [e] : a.includes(e) ? [] : [e];
  if (e === P)
    return a.includes(P) ? [] : [P];
  const n = new Set(i), r = n.has(P), o = a.includes(P) ? i.filter((d) => d !== P) : a.filter((d) => n.has(d)), l = o.indexOf(e);
  l >= 0 ? o.splice(l, 1) : o.push(e);
  const c = r ? i.length - 1 : i.length;
  return o.length === c ? r ? [P] : [...o] : o;
}
function Qi(a, e, t, i, s) {
  if (s) {
    Te(a.querySelectorAll(".dg-dropdown-item:not(.disabled)"), W);
    return;
  }
  ce(a.querySelectorAll(`.dg-dropdown-item.${W}`), W);
  const n = new Set(t);
  for (let r = 0; r < e.length; r++)
    n.has(e[r][i]) && a.querySelector(`.dg-dropdown-item[data-index="${r}"]`)?.classList.add(W);
}
function es(a, e, t) {
  const i = le(a) ? Mt(a || "", e) : Array.isArray(a) ? a : [a], s = new Set(i.map(String));
  if (s.has(P))
    return [...t.values()];
  const n = [];
  for (const r of s) {
    const o = t.get(r);
    o !== void 0 && n.push(o);
  }
  return n;
}
class xn extends We {
  constructor(e, t) {
    super(e, t), this.listItems = [];
    const i = this.field.editRenderer;
    this.labelKey = Tt(i), this.valueKey = Rt(i), i?.listItem ? (this.isMultiple = i.listItem?.multiple ?? !1, this.valueDelimiter = i.listItem?.delimiter ?? ",") : (this.valueDelimiter = ",", this.isMultiple = !1), this.required = this.field.editRenderer.required ?? !1, this.useIncludeAllOption = this.isMultiple && (i.listItem?.includeAllOption ?? !0);
  }
  valid(e) {
    return !0;
  }
  render(e, t) {
    if (this.currentEditRow == e.rowIndex && window.getComputedStyle(this.dropdownElement).display == "block") {
      this.dropdownElement.style.display = "none";
      return;
    }
    this.currentCellInfo = e;
    const i = String(e.c);
    this.gridMain.config().activeComponent = i, this.currentEditRow = e.rowIndex;
    const s = t.querySelector(".dg-cell-renderer");
    let n = this.dropdownElement;
    if (!n) {
      const h = yt(this.field.editRenderer);
      n = Re("div", `dg-dropdown-menu ${Ae} ${h}`, i), this.rendererContainer.appendChild(n), this.dropdownElement = n, this.initDropdownEvt();
    }
    const o = this.field.editRenderer.listItem?.list, { labelKey: l, valueKey: c } = this, d = (h) => {
      const { list: u } = ze(h, l, c), g = Ct(u, c);
      if (this.listItems = g, this.useIncludeAllOption && g.filter((f) => f[c] == P).length < 1) {
        const f = {};
        f[this.valueKey] = P, f[this.labelKey] = this.language.getMessage("select.all"), g.unshift(f);
      }
      n.innerHTML = this.dropdownMenuTemplate(g), this.openMenu(n, s), this.setDropItemCheck(this.getValue(e.item, e.inputValue));
    };
    Array.isArray(o) ? d(o) : A(o) && o(e, d);
  }
  initDropdownEvt() {
    const e = this.gridMain.config(), t = this.dropdownElement, { valueKey: i, valueDelimiter: s, isMultiple: n, required: r } = this;
    e.eventManager.on({ el: t, type: "click", selector: ".dg-dropdown-item" }, (o) => {
      const l = o.target, c = Number(l.dataset.index || "0");
      if (l.classList.contains("disabled"))
        return;
      const d = this.listItems, h = this.currentCellInfo, g = d.filter((I) => !I.disabled).map((I) => I[i]), f = this.getValue(h.item, h.inputValue), m = xt(f, s), p = d[c][i], y = Ji(m, p, n, g, r);
      this.setValue(o, h.item, y.join(s)), this.setDropItemCheck(y), n || (t.style.display = "none"), this.completeEdit();
    });
  }
  /**
   * dropdown list open
   *
   * @private
   @param {HTMLElement} eventElement 이벤트가 발생한 element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  openMenu(e, t) {
    const i = e.style;
    this.gridMain.openLayer(e, () => {
      if (!t.isConnected) return;
      i.height = "auto", i.width = `${ie(t).width}px`;
      const s = bt(this.rendererContainer, t, e);
      i.top = `${s.top}px`, i.left = `${s.left}px`, i.height = `${s.height}px`;
    });
  }
  setDropItemCheck(e = "") {
    const t = xt(e, this.valueDelimiter);
    let i = !1;
    this.useIncludeAllOption && t.includes(P) && (i = !0), Qi(this.dropdownElement, this.listItems, t, this.valueKey, i);
  }
  dropdownMenuTemplate(e) {
    if (!F(e) || e.length === 0) return "";
    const { valueKey: t, labelKey: i } = this, s = [];
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      let o = "dg-dropdown-item";
      r.disabled && (o += " disabled"), r[t] === P && (o += " dg-all");
      const l = r[i] ?? "";
      s.push(`<div data-index="${n}" class="${o}">${j(String(l))}</div>`);
    }
    return s.join("");
  }
}
const Cn = (a, e, t, i) => {
  const s = { name: e.name, constraints: [] }, n = Number(a), r = e.editRenderer;
  if (!r)
    return null;
  if (r.required && Le(a))
    return s.constraints.push(re.REQUIRED), s;
  if (!J(a))
    return s.constraints.push(re.NAN), s;
  if (Zi(a, e, t, i, s) !== null)
    return s;
  const o = r.rule;
  if (o) {
    const l = J(o.minimum), c = J(o.maximum);
    let d = !1, h = !1, u = !1, g = !1;
    l && (o.exclusiveMinimum && n <= o.minimum ? h = !0 : n < o.minimum && (d = !0)), c && (o.exclusiveMaximum && n >= o.maximum ? g = !0 : n > o.maximum && (u = !0)), l && c && (d || h || u || g) ? o.exclusiveMinimum && o.exclusiveMaximum && (h || g) ? s.constraints.push(re.BETWEEN_EXCLUSIVE_MINMAX) : h ? s.constraints.push(re.BETWEEN_EXCLUSIVE_MIN) : g ? s.constraints.push(re.BETWEEN_EXCLUSIVE_MAX) : s.constraints.push(re.BETWEEN) : (h && s.constraints.push(re.EXCLUSIVE_MIN), g && s.constraints.push(re.EXCLUSIVE_MAX), d && s.constraints.push(re.MIN), u && s.constraints.push(re.MAX));
  }
  return s.constraints.length > 0 ? s : null;
};
class En extends st {
  constructor(e, t) {
    super(e, t), this.editRendererInfo = e.editRenderer ?? {};
  }
  render(e, t) {
    const i = e.item;
    this.cellInfo = e, this.item = i, this.cellElement = t;
    let s = this.editElement;
    s || (s = Re("input", "dg-edit-input " + Ae, e.c + ""), s.type = "number", s.name = this.field.$uid, s.setAttribute("autocomplete", "off"), this.editRendererInfo.rule?.minimum && (s.min = this.editRendererInfo.rule?.minimum + ""), this.editRendererInfo.rule?.maximum && (s.max = this.editRendererInfo.rule?.maximum + ""), this.rendererContainer.appendChild(s), this.editElement = s, this.initEvt(s, i)), this.isShow = !0, this.openCellLayer(s, t), s.value = this.getValue(i, e.inputValue), s.focus();
  }
  valid(e) {
    const t = Cn(e, this.field, this.item, this.gridMain.config());
    return t == null ? !0 : !this.showInvalidMessage(t, this.cellElement);
  }
}
class Mn extends st {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "password");
  }
}
class bn extends We {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item;
    t.innerHTML = '<input type="range">', this.getValue(i, e.inputValue);
  }
  valid(e) {
    return !0;
  }
}
let Sn = class extends We {
  constructor(e, t) {
    super(e, t);
    const i = this.field.editRenderer;
    this.showLabel = i.showLabel ?? !1, this.trueValue = i.trueValue ?? !0, this.falseValue = i.falseValue ?? !1;
  }
  render(e, t) {
    const i = this.getValue(e.item, e.inputValue);
    let s = t.firstElementChild;
    if (!s) {
      if (s = document.createElement("div"), s.className = "dg-slider", this.showLabel) {
        const n = document.createElement("span");
        n.className = "dg-slider-label", s.appendChild(n);
      }
      t.appendChild(s), this.isEditable() && this.initClick(s);
    }
    this.tooltip(s, i), this.toggle(s, i);
  }
  toggle(e, t) {
    const i = t === this.trueValue;
    if (this.showLabel) {
      const s = e.querySelector(".dg-slider-label");
      s && (s.textContent = (i ? this.trueValue : this.falseValue) + "");
    }
    e.classList.toggle("dg-checked", i);
  }
  initClick(e) {
    const t = this.gridMain.config();
    t.eventManager.on({ el: e, type: "click" }, (i) => {
      const s = this.getClosestCellElement(e), n = me(t, s), r = !be(e, "dg-checked");
      this.toggle(e, r);
      const o = n.item;
      this.setValue(i, o, r ? this.trueValue : this.falseValue), this.render(n, s);
    });
  }
  valid(e) {
    return !0;
  }
  supportsInteraction() {
    return !0;
  }
  alignStyle() {
    return X.center;
  }
  getMinWidth(e, t) {
    return 50;
  }
};
class Rn extends st {
  constructor(e, t) {
    super(e, t), this.editRendererInfo = e.editRenderer ?? {};
  }
  render(e, t) {
    const i = e.item;
    this.cellInfo = e, this.item = i, this.cellElement = t;
    let s = this.textareaElement;
    s || (s = Re(
      "textarea",
      "dg-edit-textarea " + Ae,
      e.c + ""
    ), s.rows = 3, s.name = this.field.$uid, this.rendererContainer.appendChild(s), this.textareaElement = s, this.initEvt(s, i)), this.isShow = !0, this.openCellLayer(s, t);
    const n = this.getValue(i, e.inputValue);
    s.value = n, s.focus();
  }
  getElementValue() {
    return this.textareaElement.value;
  }
  valid(e) {
    return !0;
  }
}
class Tn extends st {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "text");
  }
}
class Y extends Yi {
  constructor(e, t) {
    super(e, t), this.isClick = !1, this.cfg = this.gridMain.config();
    const i = e.renderer.refValue;
    this.isRefFunction = A(i), this.isRefString = le(i), this.isVauleFunction = A(e.getValue), this.isRefString || this.isRefFunction ? this.refValue = i : this.refValue = i ?? {}, this.isClick = A(this.field.renderer.click);
  }
  getRefValue(e, t) {
    return this.isRefFunction ? this.refValue.call(null, this.field, e, t) : this.isRefString ? { label: this.refValue } : this.refValue[e];
  }
  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  getValue(e) {
    const t = e[this.fieldName];
    return this.isVauleFunction ? this.field.getValue?.({ field: this.field, item: e }) : this.field.displayFormat ? Xt(t, this.field.displayFormat) : Le(t) && !Le(this.field.defaultValue) ? this.field.defaultValue : t;
  }
  tooltip(e, t) {
    this.enabledTooltip && e.setAttribute("title", t);
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  click(e, t, i) {
    this.isClick && this.field.renderer.click?.call(null, i);
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
class Ln extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.viewItem;
    if (this.cfg.dataManager.getDataType() === "group" && i) {
      const n = this.cfg.dataManager.getViewItems().findIndex((r) => r.id === i.id);
      if (n > -1) {
        const r = this.gridMain.options().footer.paging?.enabled ? (this.cfg.paging.page - 1) * this.cfg.paging.pageSize : 0;
        t.textContent = String(r + n + 1);
        return;
      }
    }
    t.textContent = String(e.rowIndex + 1);
  }
  alignStyle() {
    return X.center;
  }
}
class Vn extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const s = e.item[R.CUD];
    if (s == V.CREATE) {
      t.textContent = "C";
      return;
    }
    if (s == V.MODIFY) {
      t.textContent = "M";
      return;
    }
    if (s == V.DELETE) {
      t.textContent = "D";
      return;
    }
    t.textContent = "";
  }
  alignStyle() {
    return X.center;
  }
}
class An extends Y {
  constructor(e, t) {
    super(e, t), this.allowMultiSelect = this.gridMain.options()?.aside?.rowCheckbox?.allowMultiSelect ?? !0;
  }
  render(e, t) {
    const i = e.item, s = this.allowMultiSelect;
    let n = t.firstElementChild;
    if (!n) {
      n = k("div", "dg-choice", "");
      const r = k("div", "dg-choice-item " + (s ? "dg-checkbox" : "dg-radio"), {
        role: "presentation"
      });
      r.appendChild(k("div", "dg-indicator ", "")), n.appendChild(r), t.appendChild(n), this.initClick(r);
    }
    this.cfg.dataManager.isItemChecked(i[R.ID]) ? n.firstElementChild?.classList.add(W) : n.firstElementChild?.classList.remove(W);
  }
  initClick(e) {
    const t = this.gridMain.config(), i = this.allowMultiSelect, s = this.gridMain.options().aside?.rowCheckbox?.click;
    t.eventManager.on({ el: e, type: "click" }, (n) => {
      const r = this.getClosestCellElement(e), o = me(t, r), l = t.dataManager.isItemChecked(o.viewItem?.id ?? "");
      s && s(l) === !1 || (i ? this.multipleRowCheck(e, o, l) : this.singleRowCheck(e, o, l));
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
  singleRowCheck(e, t, i) {
    this.gridMain.getBody().setItemChecked(t.viewItem?.id ?? "", !0);
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
  multipleRowCheck(e, t, i) {
    const s = !i;
    this.gridMain.getBody().addItemChecked(t.viewItem?.id ?? "", s);
  }
  alignStyle() {
    return X.center;
  }
}
class Dn extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    t.classList.contains("dg-row-drag-handle") || t.classList.add("dg-row-drag-handle");
  }
  alignStyle() {
    return X.center;
  }
  supportsEdit() {
    return !1;
  }
}
class ts extends Y {
  constructor(e, t) {
    super(e, t), this.min = e.renderer.rule?.minimum ?? 0, this.max = e.renderer.rule?.maximum ?? 100;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i), r = this.min, o = this.max;
    let l = s, c = s;
    n && (l = n?.percent ?? 0, c = n?.label);
    let d = t.querySelector(".dg-bar-label"), h = t.querySelector(".dg-bar-fill");
    d || (d = document.createElement("span"), d.className = "dg-bar-label", t.appendChild(d)), h || (h = document.createElement("div"), h.className = "dg-bar-fill", t.appendChild(h)), h.classList.remove("dg-positive", "dg-negative"), l > 0 ? h.classList.add("dg-positive") : l < 0 && h.classList.add("dg-negative");
    let u = 0, g = 0;
    if (r < 0 && o > 0) {
      const f = Math.abs(r) + Math.abs(o), m = Math.max(r, Math.min(o, l)), p = Math.abs(r) / f * 100;
      u = Math.abs(m) / f * 100, g = m >= 0 ? p : p - u;
    } else if (r >= 0) {
      const f = o - r;
      u = (Math.max(r, Math.min(o, l)) - r) / f * 100, g = 0;
    } else {
      const f = Math.abs(r - o), m = Math.max(r, Math.min(o, l));
      u = Math.abs(m - o) / f * 100, g = 100 - u;
    }
    h.style.left = `${g}%`, h.style.width = `${u}%`, d.textContent !== c && (d.textContent = c);
  }
  getMinWidth(e, t) {
    return 50;
  }
}
const si = (a, e, t) => {
  t.isClickEnabled() && a.eventManager.on({ el: e, type: "pointerdown" }, (i) => {
    $(i);
    const s = i.target, n = t.getClosestCellElement(s), r = me(a, n);
    t.click(i, n, r);
  });
};
let kn = class extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    let i = t.firstElementChild;
    i || (i = document.createElement("span"), i.className = "dg-cell-content", t.appendChild(i), this.initEvent(i));
    const s = e.item, n = this.getValue(s), r = this.getRefValue(n, s);
    if (this.applyRendererRefState(i, r) === !1)
      return;
    let o;
    r ? o = r?.label ?? r : o = n, i.textContent !== o && (i.textContent = o);
  }
  initEvent(e) {
    si(this.gridMain.config(), e, this);
  }
  alignStyle() {
    return X.center;
  }
  supportsEdit() {
    return !1;
  }
}, is = class extends Y {
  constructor(e, t) {
    super(e, t), this.listItems = [];
    const i = this.field.editRenderer, s = Tt(i), n = Rt(i);
    if (i?.listItem) {
      this.valueDelimiter = i.listItem?.delimiter ?? ",";
      const r = i.listItem?.list;
      if (F(r)) {
        const o = ze(r, s, n);
        this.listItems = o.list, this.valueLabelMap = o.map;
      } else A(r) && r({ init: !0 }, (o) => {
        const l = ze(o, s, n);
        this.listItems = l.list, this.valueLabelMap = l.map;
      });
    } else
      this.valueDelimiter = ",", this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i);
    let r = t.firstElementChild;
    if (!r) {
      r = document.createElement("div"), r.className = "dg-cell-content";
      const c = document.createElement("div");
      c.className = "dg-cell-content-label " + this.field.$alignStyle;
      const d = document.createElement("div");
      d.className = "dg-cell-content-icon", r.appendChild(c), r.appendChild(d), t.appendChild(r), this.initEvent(r);
    }
    const o = r.querySelector(".dg-cell-content-label");
    if (this.applyRendererRefState(r, n) === !1)
      return;
    let l = "";
    if (n)
      l = n.label ?? (le(n) ? n : "");
    else {
      let c = s;
      if (this.valueLabelMap.size > 0) {
        let d = this.getLabel(s);
        d.length < 1 && this.field.defaultValue && (d = this.getLabel(this.field.defaultValue)), c = d.join(this.valueDelimiter);
      }
      l = c;
    }
    this.tooltip(o, l), o.textContent = l;
  }
  getLabel(e) {
    return es(e, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(e) {
    this.cfg.eventManager.on({ el: e, type: "click" }, (t) => {
      const i = t.target, s = this.getClosestCellElement(i), n = me(this.cfg, s);
      this.click(t, s, n);
    });
  }
  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  click(e, t, i) {
    this.field.$editRenderer.render(i, t);
  }
  supportsEdit() {
    return !0;
  }
  alignStyle() {
    return X.center;
  }
  getMinWidth(e, t) {
    return 70;
  }
}, Hn = class extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
  }
}, Fn = class extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i);
    if (n) {
      const r = n;
      if (Hs(r)) {
        const o = t.firstChild;
        o ? t.replaceChild(r, o) : t.appendChild(r);
      } else
        $e(t, r);
    } else
      $e(t, s);
  }
  getMinWidth(e, t) {
    return 60;
  }
};
class $n extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i), r = n?.label ?? null, o = n?.src ?? s, l = n?.alt ?? "";
    let c = t.querySelector("img.dg-cell-content"), d = t.querySelector("span.dg-cell-content-label");
    c || (c = document.createElement("img"), c.className = "dg-cell-content", t.appendChild(c)), typeof o == "string" && jt(o) ? c.src !== o && (c.src = o) : c.getAttribute("src") && c.removeAttribute("src"), l && c.alt !== l && (c.alt = l), r ? (d || (d = document.createElement("span"), d.className = "dg-cell-content-label", t.appendChild(d)), d.textContent !== r && (d.textContent = r, this.tooltip(t, r))) : d && (d.remove(), this.tooltip(t, ""));
  }
  getMinWidth(e, t) {
    return 60;
  }
}
let Nn = class extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i);
    let r = t.firstElementChild;
    r || (r = document.createElement("a"), r.className = "dg-cell-content", t.appendChild(r), this.initEvent(r)), r.href = "javascript:void(0);";
    const o = n?.href ?? s, l = n?.target ?? "_blank", c = n?.label ?? s;
    this.applyRendererRefState(r, n) !== !1 && (!this.isClick && n ? (typeof o == "string" && jt(o) && (r.href = o), r.target = l, r.rel = "noopener noreferrer") : r.removeAttribute("target"), r.textContent = c, this.tooltip(r, c));
  }
  initEvent(e) {
    si(this.gridMain.config(), e, this);
  }
}, zn = class extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i);
    t.textContent !== s && (t.textContent = s, this.tooltip(t, s));
  }
  alignStyle() {
    return X.right;
  }
  supportsEdit() {
    return !0;
  }
};
class On extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = "********";
    t.textContent !== i && (t.textContent = i);
  }
  alignStyle() {
    return X.center;
  }
  supportsEdit() {
    return !0;
  }
}
class ss extends Y {
  constructor(e, t) {
    super(e, t), this.rendererTooltip = null, this.rendererTooltipStates = /* @__PURE__ */ new WeakMap(), this.dataIds = /* @__PURE__ */ new WeakMap(), this.dataIdSequence = 0;
  }
  /** document.body에 만든 툴팁 요소를 제거한다. */
  destroy() {
    this.rendererTooltip?.remove(), this.rendererTooltip = null;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), r = this.getRefValue(s, i)?.value;
    if (!Array.isArray(r) || r.length === 0) {
      t.replaceChildren(), this.hideTooltip();
      return;
    }
    const o = this.getClosestCellElement(t), l = ie(o), c = Math.max(0, Math.floor(l.width - ft.horizontal)), d = Math.max(0, Math.floor(l.height - ft.vertical));
    if (c <= 0 || d <= 0)
      return;
    let h = t.firstElementChild;
    (!h || h.tagName !== "CANVAS") && (h = document.createElement("canvas"), t.replaceChildren(h));
    const u = h.width !== c || h.height !== d;
    u && (h.width = c, h.height = d), this.bindTooltip(h, r, c);
    const g = h.dataset, f = this.getDataId(r);
    if (!u && g.dataId === f && g.dataLength === String(r.length))
      return;
    const m = h.getContext("2d");
    if (!m)
      return;
    let p = r[0], y = r[0];
    for (let E = 1; E < r.length; E++) {
      const M = r[E];
      M < p && (p = M), M > y && (y = M);
    }
    const I = y - p || 1, w = 5, v = 5, x = Math.max(0, c - w * 2), C = Math.max(0, d - v * 2), T = r.length - 1, L = T > 0 ? x / T : 0;
    m.clearRect(0, 0, c, d), m.strokeStyle = "#007acc", m.lineWidth = 1, m.beginPath();
    for (let E = 0; E < r.length; E++) {
      const M = r[E], N = w + E * L, H = v + (1 - (M - p) / I) * C;
      E === 0 ? m.moveTo(N, H) : m.lineTo(N, H);
    }
    m.stroke();
    for (let E = 0; E < r.length; E++) {
      const M = r[E], N = w + E * L, H = v + (1 - (M - p) / I) * C;
      M === y ? m.fillStyle = "#28a745" : M === p ? m.fillStyle = "#dc3545" : E === 0 || E === T ? m.fillStyle = "#0000ff" : m.fillStyle = "#ff9900", m.beginPath(), m.arc(N, H, 2.5, 0, Math.PI * 2), m.fill();
    }
    g.dataId = f, g.dataLength = String(r.length);
  }
  /**
   * Canvas에 tooltip 이벤트를 한 번만 등록한다.
   *
   * Canvas가 Grid에 의해 재사용되는 경우에도
   * 최신 data를 사용하도록 TooltipState를 갱신한다.
   */
  bindTooltip(e, t, i) {
    let s = this.rendererTooltipStates.get(e);
    if (!s) {
      s = {
        data: t,
        width: i
      }, this.rendererTooltipStates.set(e, s), e.addEventListener("mousemove", (n) => {
        this.handleTooltipMouseMove(e, n);
      }), e.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
      return;
    }
    s.data = t, s.width = i;
  }
  /**
   * Tooltip mouse move 처리
   */
  handleTooltipMouseMove(e, t) {
    const i = this.rendererTooltipStates.get(e);
    if (!i || i.data.length === 0) {
      this.hideTooltip();
      return;
    }
    const s = e.getBoundingClientRect(), n = t.clientX - s.left, r = 5, o = i.width - r * 2;
    if (o <= 0) {
      this.hideTooltip();
      return;
    }
    if (n < r || n > i.width - r) {
      this.hideTooltip();
      return;
    }
    const l = (n - r) / o, c = i.data.length - 1, d = Math.max(0, Math.min(c, Math.round(l * c))), h = i.data[d];
    this.showTooltip(t.clientX, t.clientY, String(h));
  }
  /**
   * Tooltip 표시
   *
   * Renderer당 tooltip DOM 하나만 생성하여 재사용한다.
   */
  showTooltip(e, t, i) {
    this.rendererTooltip || (this.rendererTooltip = document.createElement("div"), this.rendererTooltip.style.cssText = `
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
      `, document.body.appendChild(this.rendererTooltip)), this.rendererTooltip.textContent = i, this.rendererTooltip.style.left = `${e + 10}px`, this.rendererTooltip.style.top = `${t + 10}px`, this.rendererTooltip.style.display = "block";
  }
  /**
   * Tooltip 숨김
   */
  hideTooltip() {
    this.rendererTooltip && (this.rendererTooltip.style.display = "none");
  }
  getDataId(e) {
    let t = this.dataIds.get(e);
    return t || (t = String(++this.dataIdSequence), this.dataIds.set(e, t)), t;
  }
  getMinWidth(e, t) {
    return 60;
  }
}
class ns extends Y {
  constructor(e, t) {
    super(e, t), this.rendererTooltip = null, this.rendererTooltipStates = /* @__PURE__ */ new WeakMap(), this.dataIds = /* @__PURE__ */ new WeakMap(), this.dataIdSequence = 0;
  }
  /** document.body에 만든 툴팁 요소를 제거한다. */
  destroy() {
    this.rendererTooltip?.remove(), this.rendererTooltip = null;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), r = this.getRefValue(s, i)?.value;
    if (!Array.isArray(r) || r.length === 0) {
      t.replaceChildren(), this.hideTooltip();
      return;
    }
    const o = this.getClosestCellElement(t), l = ie(o), c = Math.max(0, Math.floor(l.width - ft.horizontal)), d = Math.max(0, Math.floor(l.height - ft.vertical));
    if (c <= 0 || d <= 0)
      return;
    let h = t.firstElementChild;
    (!h || h.tagName !== "CANVAS") && (h = document.createElement("canvas"), t.replaceChildren(h));
    const u = h.width !== c || h.height !== d;
    u && (h.width = c, h.height = d);
    const g = c / r.length;
    this.bindTooltip(h, r, c, g);
    const f = h.dataset, m = this.getDataId(r);
    if (!u && f.dataId === m && f.dataLength === String(r.length))
      return;
    const p = h.getContext("2d");
    if (!p)
      return;
    let y = r[0], I = r[0];
    for (let T = 1; T < r.length; T++) {
      const L = r[T];
      L < y && (y = L), L > I && (I = L);
    }
    const w = I - y || 1, v = 5, x = Math.max(0, d - v * 2);
    p.clearRect(0, 0, c, d);
    const C = r.length - 1;
    for (let T = 0; T < r.length; T++) {
      const L = r[T], E = T * g, M = (L - y) / w * x, N = d - M - v;
      L === I ? p.fillStyle = "#28a745" : L === y ? p.fillStyle = "#dc3545" : T === 0 || T === C ? p.fillStyle = "#0000ff" : p.fillStyle = "#ff9900";
      const H = Math.max(1, g - 2);
      p.fillRect(E + 1, N, H, M);
    }
    f.dataId = m, f.dataLength = String(r.length);
  }
  /**
   * Canvas tooltip 이벤트 등록
   *
   * Canvas가 재사용되어도 이벤트를 중복 등록하지 않는다.
   */
  bindTooltip(e, t, i, s) {
    let n = this.rendererTooltipStates.get(e);
    if (!n) {
      n = {
        data: t,
        width: i,
        barWidth: s
      }, this.rendererTooltipStates.set(e, n), e.addEventListener("mousemove", (r) => {
        this.handleTooltipMouseMove(e, r);
      }), e.addEventListener("mouseleave", () => {
        this.hideTooltip();
      });
      return;
    }
    n.data = t, n.width = i, n.barWidth = s;
  }
  /**
   * Bar tooltip 처리
   */
  handleTooltipMouseMove(e, t) {
    const i = this.rendererTooltipStates.get(e);
    if (!i || i.data.length === 0) {
      this.hideTooltip();
      return;
    }
    const s = e.getBoundingClientRect(), n = t.clientX - s.left;
    if (n < 0 || n > i.width) {
      this.hideTooltip();
      return;
    }
    const r = Math.floor(n / i.barWidth);
    if (r < 0 || r >= i.data.length) {
      this.hideTooltip();
      return;
    }
    const o = i.data[r];
    this.showTooltip(t.clientX, t.clientY, String(o));
  }
  /**
   * Tooltip 표시
   */
  showTooltip(e, t, i) {
    this.rendererTooltip || (this.rendererTooltip = document.createElement("div"), this.rendererTooltip.style.cssText = `
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
      `, document.body.appendChild(this.rendererTooltip)), this.rendererTooltip.textContent = i, this.rendererTooltip.style.left = `${e + 10}px`, this.rendererTooltip.style.top = `${t + 10}px`, this.rendererTooltip.style.display = "block";
  }
  /**
   * Tooltip 숨김
   */
  hideTooltip() {
    this.rendererTooltip && (this.rendererTooltip.style.display = "none");
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
  getDataId(e) {
    let t = this.dataIds.get(e);
    return t || (t = String(++this.dataIdSequence), this.dataIds.set(e, t)), t;
  }
  getMinWidth(e, t) {
    return 60;
  }
}
let Pn = class extends Y {
  constructor(e, t) {
    super(e, t), this.initializedElements = /* @__PURE__ */ new WeakSet();
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i);
    t.textContent !== s && (t.textContent = s, this.tooltip(t, s)), this.initializedElements.has(t) || (this.initEvent(t), this.initializedElements.add(t));
  }
  supportsEdit() {
    return !0;
  }
  initEvent(e) {
    si(this.gridMain.config(), e, this);
  }
};
class Bn extends Y {
  constructor(e, t) {
    super(e, t), this.iconState = /* @__PURE__ */ new WeakMap();
    const i = this.gridMain.options();
    this.treeNodeIconClass = i.tree?.treeNodeIconClass, this.treeDataManager = this.cfg.dataManager;
  }
  /**
   * 트리 노드를 렌더링합니다.
   * @param cellInfo 셀 정보
   * @param element 셀 엘리먼트
   */
  render(e, t) {
    const i = e.viewItem, s = e.item, n = this.getValue(s), r = i.depth, o = !i.isLeaf, l = i.expanded > 0;
    let c = t.firstElementChild, d = t.querySelector(".dg-cell-content-expander"), h = t.querySelector(".dg-cell-content-icon"), u = t.querySelector(".dg-cell-content-title");
    c || (c = k("div", "dg-cell-content"), d = k("span", "dg-cell-content-expander dg-icon"), h = k("span", "dg-cell-content-icon dg-icon"), u = k("span", "dg-cell-content-title"), c.appendChild(d), c.appendChild(h), c.appendChild(u), t.appendChild(c), this.initExpanderEvent(d));
    const g = d.classList, f = h.classList;
    if (o ? (f.remove("dg-file"), f.add("dg-folder"), g.remove("dg-invisible"), g.toggle("expanded", l)) : (f.remove("dg-folder"), f.add("dg-file"), g.add("dg-invisible")), this.treeNodeIconClass) {
      const m = this.treeNodeIconClass(s, n) ?? "", p = this.iconState.get(h) ?? "";
      p !== m && (p && f.remove(...p.split(/\s+/)), m && f.add(...m.split(/\s+/)), this.iconState.set(h, m));
    }
    c.style.paddingLeft = `${r * 16}px`, u.textContent = n, this.tooltip(t, n);
  }
  initExpanderEvent(e) {
    const t = this.cfg;
    t.eventManager.on({ el: e, type: "pointerdown" }, (i) => {
      const s = i.target, n = this.getClosestCellElement(s), r = me(t, n);
      this.toggle(r);
    });
  }
  toggle(e) {
    this.treeDataManager.toggleRow(e.item[R.ID]), this.gridMain.refreshBody(!0, "treeExpander");
  }
  bindEvents(e, t, i) {
    return this.treeDataManager.getViewItems()[t.rowIndex].isLeaf ? !1 : (this.toggle(t), !0);
  }
  alignStyle() {
    return X.left;
  }
  supportsEdit() {
    return !0;
  }
  getMinWidth(e, t) {
    return 80;
  }
}
class Wn extends Y {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    t.innerHTML = '<input type="text">';
  }
}
class ae {
  constructor(e, t) {
    this.isClick = !1, this.enabledView = !0, this.isInit = !1, this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.cfg = this.gridMain.config(), this.isClick = A(this.field.click), this.rendererContainer = this.gridMain.getRendererLayerElement();
  }
  /**
   * event class
   *
   * @public
   * @param {string} addClass
   * @returns {string}
   */
  getRendererClassName(e) {
    const t = yt(this.field.renderer);
    let i = e;
    t && (i = e + " " + t);
    const s = it(this.field.rendererClassName);
    return s.length < 1 ? i : i + " " + s.join(" ");
  }
  afterRender() {
    this.isInit = !0;
  }
  textRender(e, t) {
    const i = {
      type: t,
      autocomplete: "off",
      placeholder: this.field.placeholder ?? ""
    }, s = k(
      "input",
      this.getRendererClassName("dg-edit-" + t),
      i
    );
    return s.value = this.field.defaultValue ?? "", e.appendChild(s), s;
  }
  initTextEvt(e) {
    const t = this.gridMain.config();
    t.eventManager.on({ el: e, type: "input" }, (i) => {
      this.changeValue(this.getValue());
    }), t.eventManager.on({ el: e, type: "keydown" }, (i) => {
      i.key === "Enter" && (i.preventDefault(), this.search(i));
    });
  }
  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   */
  click(e, t) {
    this.isClick && this.field.click?.call(null, { evt: e, field: this.field, element: t });
  }
  changeValue(e) {
    if (this.beforeValue != e && (this.beforeValue = e, !!this.isInit)) {
      if (this.field.change) {
        const t = this.gridMain.getToolbarValues();
        this.field.change.call(null, {
          field: this.field,
          value: e,
          values: t
        });
      }
      this.isSearchInput() || this.gridMain.searchByToolbar("change"), this.gridMain.getToolbar().refreshConditionFields();
    }
  }
  search(e) {
    if (this.field.search) {
      const t = this.gridMain.getToolbarValues();
      if (this.field.search.call(null, {
        evt: e,
        field: this.field,
        values: t
      }) === !1) return;
    }
    this.gridMain.searchByToolbar("search");
  }
  /** 입력 중 값이 바뀌는 검색어 필드인지 여부. change 트리거에서 제외한다. */
  isSearchInput() {
    return !1;
  }
  getToolbarValues() {
    return this.isInit ? this.gridMain.getToolbarValues() : {};
  }
  getControlElement(e) {
    return e.querySelector(".dg-control");
  }
  supportsEdit() {
    return !0;
  }
  isEnabledView() {
    return this.enabledView;
  }
  getFieldElement() {
    return this.fieldElement || (this.fieldElement = this.gridMain.getToolbar().getToolbarElement().querySelector('[data-uid="' + this.field.$uid + '"]')), this.fieldElement;
  }
  show() {
    this.enabledView = !0, this.getFieldElement().classList.remove("dg-hide");
  }
  hide() {
    this.enabledView = !1, this.getFieldElement().classList.add("dg-hide");
  }
  setDisabled(e) {
    this.getFieldElement().classList.toggle("dg-disabled", e);
  }
  refreshCondition() {
    this.isVisible() ? this.show() : this.hide(), this.setDisabled(this.isDisabled());
  }
  evaluateCondition(e, t) {
    return e === void 0 ? t : typeof e == "function" ? e({
      field: this.field,
      values: this.gridMain.getToolbarValues()
    }) : e;
  }
  isVisible() {
    return this.evaluateCondition(this.field.condition?.visible, !0);
  }
  isDisabled() {
    return this.evaluateCondition(this.field.condition?.disabled, !1);
  }
}
class Gn extends ae {
  constructor(e, t) {
    super(e, t), this.listItems = [];
    const i = this.field.renderer;
    this.labelKey = Tt(i), this.valueKey = Rt(i), this.selectValues = Mt(this.field.defaultValue || "", this.valueDelimiter);
    const s = i?.listItem;
    if (this.labelOnly = !0, s) {
      this.labelOnly = s.labelOnly !== !1, this.isMultiple = s.multiple ?? !0, this.valueDelimiter = s.delimiter ?? ",";
      const n = s.list;
      if (F(n)) {
        const r = ze(n, this.labelKey, this.valueKey);
        this.listItems = Ct(r.list, this.valueKey), this.valueLabelMap = r.map;
      } else A(n) && n({ init: !0 }, (r) => {
        const o = ze(r, this.labelKey, this.valueKey);
        this.listItems = Ct(o.list, this.valueKey), this.valueLabelMap = o.map;
      });
    } else
      this.valueDelimiter = ",", this.isMultiple = !0, this.listItems = [], this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(e) {
    const t = this.getControlElement(e), i = k("div", this.getRendererClassName("dg-choice"), "");
    i.innerHTML = this.template(this.listItems), t.appendChild(i), this.choiceContainer = i, this.setValue(this.field.defaultValue ?? ""), this.initTextEvt(i);
  }
  initTextEvt(e) {
    const t = this.gridMain.config(), i = this.isMultiple, s = e.querySelectorAll(".dg-choice-item");
    t.eventManager.on({ el: s, type: "click" }, (n) => {
      const r = n.currentTarget;
      i ? r.classList.contains(W) ? r.classList.remove(W) : r.classList.add(W) : (s.forEach((o) => {
        o != r && o.classList.remove(W);
      }), r.classList.contains(W) || r.classList.add(W)), this.selectValues = this.getValue(), this.selectValues.length < 1 ? this.setValue(this.field.defaultValue ?? "") : this.setValue(this.selectValues);
    });
  }
  getValue() {
    const e = Array.from(
      this.choiceContainer.querySelectorAll(".dg-choice-item." + W)
    ).map((t) => {
      const i = t.dataset.index;
      if (i) return this.listItems[ue(i)][this.valueKey];
    });
    return e.length < 1 ? [] : this.isMultiple ? e : e[0];
  }
  setValue(e) {
    let t = xt(e, this.valueDelimiter);
    !this.isMultiple && t.length > 1 && (t = t.slice(0, 1));
    const i = this.listItems, s = this.valueKey;
    for (let n = 0; n < i.length; n++) {
      const r = i[n], o = this.choiceContainer.querySelector(`.dg-choice-item[data-index="${n}"]`);
      o && (t.includes(r[s]) ? o.classList.add(W) : o.classList.remove(W));
    }
    this.changeValue(this.selectValues);
  }
  template(e) {
    if (!F(e) || e.length === 0) return "";
    const t = [], i = this.isMultiple ? "dg-checkbox" : "dg-radio", s = this.labelOnly;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], o = r?.[this.labelKey] ?? "", d = `<div class="dg-choice-item ${[!!r?.disabled ? "disabled" : "", s ? "dg-label-only" : "", i].filter((h) => h).join(" ")}" data-index="${n}">
        ${s ? "" : '<div class="dg-indicator"></div>'}
        <span class="dg-label dg-ellipsis">${j(String(o))}</span>
      </div>`;
      t.push(d);
    }
    return t.join("");
  }
  valid(e) {
    return !0;
  }
}
class _n extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = k("button", this.getRendererClassName("dg-button"));
    if (this.field.renderer.icon) {
      const s = k("span", "dg-icon");
      s.innerHTML = Qt(this.field.renderer.icon), i.appendChild(s);
    } else if (this.field.renderer.iconStyle) {
      const s = k("span", "dg-icon " + this.field.renderer.iconStyle);
      i.appendChild(s);
    }
    if (this.field.label) {
      const s = k("span", "dg-button-label");
      s.textContent = this.field.label ?? "", i.appendChild(s);
    }
    t.appendChild(i), this.initEvent(i);
  }
  initEvent(e) {
    this.gridMain.config().eventManager.on({ el: e, type: "pointerdown" }, (i) => {
      $(i), this.click(i, e);
    });
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return !1;
  }
  setValue(e) {
  }
}
class rs extends ae {
  constructor(e, t) {
    super(e, t), this.listItems = [];
    const i = this.field.renderer;
    this.labelKey = Tt(i), this.valueKey = Rt(i), i?.listItem ? (this.isMultiple = i.listItem?.multiple ?? !1, this.valueDelimiter = i.listItem?.delimiter ?? ",", this.getListItems()) : (this.valueDelimiter = ",", this.isMultiple = !1, this.valueLabelMap = /* @__PURE__ */ new Map()), this.required = i.required ?? !1, this.selectValues = [], this.useIncludeAllOption = this.isMultiple && (this.field.renderer.listItem?.includeAllOption ?? !1);
  }
  getListItems() {
    const t = this.field.renderer.listItem?.list, i = (s) => {
      const { list: n, map: r } = ze(s, this.labelKey, this.valueKey);
      this.listItems = Ct(n, this.valueKey), this.valueLabelMap = r;
    };
    Array.isArray(t) ? i(t) : A(t) && t({ init: !0, values: this.getToolbarValues() }, i);
  }
  render(e) {
    const t = this.getControlElement(e), i = document.createElement("button");
    i.className = this.getRendererClassName("dg-dropdown-button");
    const s = k("div", "dg-dropdown-label"), n = k("div", "dg-dropdown-icon");
    i.appendChild(s), i.appendChild(n), t.appendChild(i), this.selectLabelElement = s;
    const r = Re("div", "dg-dropdown-menu dg-toolbar " + Ae, this.field.$uid);
    this.rendererContainer.appendChild(r), this.dropdownElement = r, this.initEvent(i), this.setValue(Mt(this.field.defaultValue || "", this.valueDelimiter));
  }
  initEvent(e) {
    const { eventManager: t } = this.gridMain.config();
    t.on({ el: e, type: "click" }, (r) => {
      this.click(r, e), this.editRender(e);
    });
    const { valueKey: i, isMultiple: s, required: n } = this;
    t.on({ el: this.dropdownElement, type: "click", selector: ".dg-dropdown-item" }, (r) => {
      const o = r.target, l = Number(o.dataset.index || "0");
      if (o.classList.contains("disabled"))
        return;
      const d = this.listItems.filter((g) => !g.disabled).map((g) => g[i]), h = this.listItems[l][i], u = Ji(this.selectValues, h, s, d, n);
      Os(this.selectValues, u) || this.setValue(u), s || (this.dropdownElement.style.display = "none");
    });
  }
  valid(e) {
    return !0;
  }
  editRender(e) {
    const t = this.field.$uid, i = this.gridMain.config();
    i.activeComponent = t, this.getListItems();
    const s = this.listItems;
    if (this.useIncludeAllOption && s.filter((r) => r[this.valueKey] == P).length < 1) {
      const r = {};
      r[this.valueKey] = P, r[this.labelKey] = this.language.getMessage("select.all"), s.unshift(r);
    }
    const n = this.dropdownElement;
    n.innerHTML = this.dropdownMenuTemplate(s), this.setValue(this.selectValues), this.openMenu(e, n);
  }
  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} buttonElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  openMenu(e, t) {
    const i = ie(e), s = t.style;
    s.height = "auto", this.gridMain.openLayer(t), s.width = `${i.width}px`;
    const n = bt(this.rendererContainer, e, t);
    s.top = `${n.top}px`, s.left = `${n.left}px`, s.height = `${n.height}px`, vn(t, this.gridMain.config().eventManager);
  }
  setValue(e) {
    const t = xt(e, this.valueDelimiter), i = this.listItems, s = this.valueKey;
    let n = !1;
    this.useIncludeAllOption && t.includes(P) && (n = !0), this.selectValues = t, this.selectLabelElement.textContent = es(t, this.valueDelimiter, this.valueLabelMap).join(
      this.valueDelimiter
    ), this.changeValue(t), this.dropdownElement && Qi(this.dropdownElement, i, t, s, n);
  }
  dropdownMenuTemplate(e) {
    if (!F(e) || e.length === 0) return "";
    const { valueKey: t, labelKey: i } = this, s = [];
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      let o = "dg-dropdown-item";
      r.disabled && (o += " disabled"), r[t] === P && (o += " dg-all");
      const l = r[i] ?? "";
      s.push(`<div data-index="${n}" class="${o}">${j(String(l))}</div>`);
    }
    return s.join("");
  }
  getValue() {
    return this.selectValues;
  }
}
function os(a, e, t, i) {
  const s = (n) => ({
    ...n,
    fileName: n?.fileName?.trim() ? n.fileName : a.getOptions().title?.trim() || void 0
  });
  switch (e.toLowerCase()) {
    case "excel":
    case "xlsx":
      return a.exportExcel(s(t?.excel));
    case "csv":
      return a.exportCsv(s(t?.csv));
    case "json":
      return a.exportJson(s(t?.json));
    case "pdf":
      return a.exportPdf(s(t?.pdf));
    default:
      throw new Error(i);
  }
}
class Un extends rs {
  constructor(e, t) {
    e.renderer = { ...e.renderer }, e.renderer.listItem && (e.renderer.listItem = { ...e.renderer.listItem, multiple: !1, includeAllOption: !1 }), super(e, t);
  }
  render(e) {
    super.render(e);
    const t = this.getControlElement(e), i = t.querySelector(".dg-dropdown-button");
    i.type = "button", i.setAttribute("aria-label", this.field.label || this.language.getMessage("export.format"));
    const s = k("div", "dg-export-file"), n = document.createElement("button");
    n.type = "button", n.className = this.getRendererClassName("dg-button dg-export-download");
    const r = this.field.renderer.downloadLabel ?? this.language.getMessage("export.download"), o = k("span", "dg-button-label");
    if (o.textContent = r, this.field.renderer.icon || this.field.renderer.iconStyle) {
      const d = k("span", "dg-icon " + (this.field.renderer.iconStyle ?? ""));
      this.field.renderer.icon && (d.innerHTML = Qt(this.field.renderer.icon)), n.appendChild(d);
    }
    n.appendChild(o);
    const l = k("span", "dg-export-status");
    l.setAttribute("role", "status"), l.setAttribute("aria-live", "polite"), s.append(i, n, l), t.appendChild(s);
    let c = !1;
    this.gridMain.config().eventManager.on({ el: n, type: "click" }, async (d) => {
      if (d.preventDefault(), c || e.closest(".dg-disabled")) return;
      const h = this.getValue(), u = String(Array.isArray(h) ? h[0] ?? "" : h).toLowerCase(), g = Ve.getInstance(this.gridMain.element().getElement());
      if (g) {
        c = !0, n.disabled = i.disabled = !0, n.setAttribute("aria-busy", "true"), l.textContent = this.language.getMessage("export.creating"), o.textContent = r, n.removeAttribute("title");
        try {
          this.click(d, n), await os(
            g,
            u,
            this.field.renderer.exportOptions,
            this.language.getMessage("export.unsupportedFormat")
          ), l.textContent = this.language.getMessage("export.completed");
        } catch (f) {
          const m = f instanceof Error ? f.message : String(f);
          l.textContent = `${this.language.getMessage("export.failed")}: ${m}`, o.textContent = this.language.getMessage("export.failed"), n.title = m;
        } finally {
          c = !1, n.disabled = i.disabled = !1, n.removeAttribute("aria-busy");
        }
      }
    });
  }
}
class qn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e);
    t.classList.add(this.getRendererClassName("dg-html"));
    const i = this.field.defaultValue;
    i && (A(i) ? $e(t, i(this.field)) : $e(t, i));
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return !1;
  }
  setValue(e) {
  }
}
class Kn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = this.field.defaultValue;
    if (!i) return;
    const s = A(i) ? i(this.field) : i, n = document.createElement("a");
    n.className = this.getRendererClassName("dg-link"), t.appendChild(n), this.initEvent(n), n.href = "javascript:void(0);", s?.href && (typeof s.href == "string" && jt(s.href) && (n.href = s.href), s.target && (n.target = s.target, n.rel = "noopener noreferrer")), n.textContent = s.label ?? this.field.label;
  }
  initEvent(e) {
    this.gridMain.config().eventManager.on({ el: e, type: "pointerdown" }, (i) => {
      this.click(i, e);
    });
  }
  getValue() {
    return "";
  }
  supportsEdit() {
    return !1;
  }
  setValue(e) {
  }
}
class jn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = this.textRender(t, "number");
    this.editElement = i, this.initTextEvt(i);
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(e) {
    this.editElement.value = e;
  }
}
class fi extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = this.textRender(t, "text");
    this.editElement = i, this.initTextEvt(i);
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(e) {
    this.editElement.value = e;
  }
}
class Xn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  getValue() {
    return "";
  }
  render(e) {
    const t = this.getControlElement(e);
    t.innerHTML = '<input type="text">';
  }
  valid(e) {
    return !0;
  }
  setValue(e) {
  }
}
class Yn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = this.textRender(t, "date");
    this.editElement = i, this.initTextEvt(i);
  }
  setValue(e) {
    this.editElement.value = e, this.changeValue(e);
  }
  getValue() {
    return this.editElement.value;
  }
}
class Zn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    this.value = this.field.defaultValue, this.afterRender();
  }
  getValue() {
    return this.value;
  }
  supportsEdit() {
    return !0;
  }
  setValue(e) {
    this.value = e, this.changeValue(this.value);
  }
}
class Jn extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = k("div", "dg-search"), s = k("input", this.getRendererClassName("dg-search-text"), {
      type: "text",
      autocomplete: "off",
      placeholder: this.field.placeholder ?? ""
    });
    i.appendChild(s);
    const n = k("button", "dg-button dg-search-btn"), r = k("span", "dg-icon");
    r.innerHTML = Qt("search"), n.appendChild(r), i.appendChild(n), t.appendChild(i), this.editElement = s, this.setValue(this.field.defaultValue ?? ""), this.initEvt(s, n);
  }
  initEvt(e, t) {
    const i = this.gridMain.config();
    i.eventManager.on({ el: e, type: "input" }, (s) => {
      this.changeValue(this.getValue());
    }), i.eventManager.on({ el: e, type: "keydown" }, (s) => {
      s.key === "Enter" && (s.preventDefault(), this.search(s));
    }), i.eventManager.on({ el: t, type: "click" }, (s) => {
      this.search(s);
    });
  }
  isSearchInput() {
    return !0;
  }
  getValue() {
    return this.editElement.value;
  }
  setValue(e) {
    this.editElement.value = e;
  }
}
class Qn extends ae {
  constructor(e, t) {
    super(e, t);
    const i = this.field.renderer;
    this.showLabel = i.showLabel ?? !1, this.trueValue = i.trueValue ?? !0, this.falseValue = i.falseValue ?? !1;
  }
  render(e) {
    const t = this.getControlElement(e), i = document.createElement("div");
    i.className = this.getRendererClassName("dg-switch");
    const s = document.createElement("div");
    if (s.className = "dg-slider", this.showLabel) {
      const n = document.createElement("span");
      n.className = "dg-slider-label", s.appendChild(n), this.labelElement = n;
    }
    i.appendChild(s), t.appendChild(i), this.sliderElement = s, this.setValue(this.field.defaultValue), this.initClick(i);
  }
  initClick(e) {
    this.gridMain.config().eventManager.on({ el: e, type: "click" }, (i) => {
      this.click(i, e), this.setChecked(!this.checked);
    });
  }
  getValue() {
    return this.checked ? this.trueValue : this.falseValue;
  }
  setValue(e) {
    this.setChecked(e === this.trueValue);
  }
  setChecked(e) {
    this.checked !== e && (this.showLabel && (this.labelElement.textContent = (e ? this.trueValue : this.falseValue) + ""), this.checked = e, this.changeValue(this.getValue()), this.sliderElement.classList.toggle("dg-checked", e));
  }
}
class er extends ae {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e);
    let i = "";
    const s = this.field?.rendererClassName;
    s && (A(s) ? i = s(this.field) : i = s);
    const n = k("span", i, {});
    n.textContent = this.field.label || "", t.appendChild(n);
  }
  getValue() {
    return "";
  }
  setValue(e) {
  }
}
const tr = {
  lineNumber: Ln,
  modifyInfo: Vn,
  rowCheckbox: An,
  rowDragHandle: Dn
}, mi = {
  dropdown: is,
  bar: ts,
  button: kn,
  hidden: Hn,
  html: Fn,
  image: $n,
  link: Nn,
  number: zn,
  text: Pn,
  password: On,
  sparkline: ss,
  sparklineBar: ns,
  tree: Bn,
  // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: Wn
}, ht = {
  date: In,
  custom: mn,
  text: Tn,
  number: En,
  dropdown: xn,
  switch: Sn,
  checkbox: fn,
  password: Mn,
  range: bn,
  textarea: Rn
}, pi = {
  button: _n,
  choice: Gn,
  custom: Xn,
  date: Yn,
  dropdown: rs,
  exportFile: Un,
  number: jn,
  switch: Qn,
  text: fi,
  textarea: fi,
  html: qn,
  link: Kn,
  search: Jn,
  hidden: Zn,
  label: er
};
function ir(a) {
  const e = G({}, Wt, a);
  if (e.height != "auto" && !J(e.height)) throw new Error("invalid height : " + e.height);
  if (e.width != "auto" && !J(e.width)) throw new Error("invalid width : " + e.width);
  if (e.tree && (e.groupingFields?.length || e.rowSpanFields?.length))
    throw new Error("tree cannot be used together with groupingFields or rowSpanFields");
  return a.hoverMode || (e.hoverMode = Qe(e.selectionMode) ? "row" : "cell"), e;
}
function sr(a) {
  Wt = G({}, Wt, a);
}
let Wt = {
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
  style: dt.default,
  /**
   * 컬럼 너비를 고정할지 여부
   */
  enabledWidthFixed: !1,
  /**
   * 데이터 타입별 기본 포맷터 사용 여부
   */
  useDefaultFormatter: !0,
  /**
   * 셀 편집 기능 활성화 여부
   */
  editable: !1,
  /**
   * 선택 모드
   *
   * - row
   * - cell
   * - multiRow
   * - multiCell
   */
  selectionMode: oe.row,
  /**
   * hover mode
   * cell, row, none
   */
  hoverMode: ct.cell,
  /**
   * delete mode
   * hard, soft
   */
  deleteMode: "hard",
  /**
   * 서버 연동(AJAX) 설정
   *
   * 지정하지 않으면 로컬 데이터만 사용한다. `save`를 지정하면 deleteMode 기본값은 soft이다.
   */
  dataSource: void 0,
  /**
   * 툴팁 사용 여부
   */
  enabledTooltip: !1,
  /**
   * 추가 시 유지할 최대 행 개수
   *
   * `-1`이면 제한이 없습니다.
   */
  addLimitRow: -1,
  /**
   * 값 필터 함수 사용 여부
   */
  valueFilter: !1,
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
    view: !0,
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
      enabled: !0,
      /**
       * null 값을 항상 마지막에 배치할지 여부
       */
      nullsLast: !1,
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
      enabled: !0,
      /**
       * 리사이즈 중 즉시 너비를 적용할지 여부
       */
      update: !1,
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
    enabledAllColumnSelection: !0,
    /**
     * 마우스 휠로 가로 스크롤 이동 여부
     */
    enabledScroll: !0,
    /**
     * 모든 라벨 표시 여부
     */
    enabledViewAllLabel: !1,
    /**
     * 헤더 도움말 버튼 설정
     */
    help: {
      /**
       * 도움말 버튼 활성화 여부
       */
      enabled: !1,
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
      enabled: !1,
      /**
       * 드롭 대상 셀렉터
       */
      dropSelector: "",
      /**
       * 드롭 전에 호출되는 콜백
       *
       * `false`를 반환하면 드롭을 취소
       */
      dropCallback: (a) => !0
    }
  },
  /**
   * 검색 영역 설정
   */
  search: {
    /**
     * 검색 기능 활성화 여부
     */
    enabled: !1,
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
    click: !1,
    /**
     * 닫기 버튼만 표시할지 여부
     */
    onlyCloseButton: !1,
    /**
     * 검색어를 로컬 스토리지에 저장할지 여부
     */
    useRememberValue: !1,
    /**
     * 검색 영역 너비(px)
     */
    width: 250,
    /**
     * 검색 영역 높이(px)
     */
    height: 30,
    callback: !1,
    rememberValue: {
      field: "",
      keyword: ""
    }
  },
  /**
   * 툴바 설정
   */
  toolbar: {
    enabled: !1,
    arrowEnabled: !1,
    scrollbarEnabled: !1,
    height: Ti,
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
      enabled: !0,
      label: "",
      order: 0,
      width: Nt
    },
    /**
     * 행 체크박스 컬럼 설정
     */
    rowCheckbox: {
      enabled: !1,
      /**
       * 다중 선택 허용 여부
       */
      allowMultiSelect: !0,
      width: Li,
      order: 1,
      /**
       * 체크박스 클릭 시 호출
       *
       * `false`를 반환하면 체크되지 않음
       */
      click: (a) => {
      }
    },
    /**
     * 수정 여부 표시 컬럼 설정
     */
    modifyInfo: {
      enabled: !1,
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
      addStyle: !1,
      /**
       * 행 더블클릭 이벤트 사용 여부
       */
      dblClick: !1
    },
    /**
     * 행 이동(Drag & Drop) 설정
     */
    rowMove: {
      /**
       * 행 이동 기능 활성화 여부
       */
      enabled: !1,
      /**
       * 드래그 핸들  field name
       *
       */
      dragHandle: void 0,
      /**
       * 트리 구조에서 부모 변경 허용 여부
       */
      allowChangeParent: !1,
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
    enabledWheelInContainer: !1,
    /**
     * 세로 스크롤바 너비(px)
     */
    width: 12,
    /**
     * 세로 스크롤 설정
     */
    vertical: {
      enabled: !0,
      /**
       * 스크롤 속도(행 단위)
       */
      speed: 3,
      /**
       * 스크롤 위치 변경 시 호출
       */
      onUpdate: () => !0,
      /**
       * 아이템 수 툴팁 표시 여부
       */
      enabledTooltip: !1
    },
    /**
     * 가로 스크롤 설정
     */
    horizontal: {
      enabled: !0,
      /**
       * 스크롤 속도
       */
      speed: 1,
      /**
       * 마우스 휠로 가로 스크롤 이동 여부
       */
      enabledWheel: !1,
      onUpdate: !1
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
    enabled: !1,
    height: Vi,
    /**
     * 페이징 표시 설정
     */
    paging: {
      enabled: !1,
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
  groupSummaryFields: [],
  showGroupSummary: !0,
  showGrandSummary: !0
};
const wi = {
  type: "text"
}, Gt = {
  type: "text",
  trueValue: !0,
  falseValue: !1,
  showLabel: !1
}, nr = {
  name: "",
  label: "",
  width: 0,
  renderer: {
    type: "text",
    trueValue: !0,
    falseValue: !1
  },
  $renderer: ht.text,
  $uid: "",
  $width: 0
};
class Ie {
  constructor(e) {
    e != null && (this.element = e);
  }
  findDaraElement(e) {
    const t = this.element.querySelector(e);
    return t && new Ie(t);
  }
  find(e) {
    return this.element.querySelector(e);
  }
  finds(e) {
    return Array.from(this.element.querySelectorAll(e));
  }
  before(e) {
    this.insertAdjacentHTML("beforebegin", e);
  }
  after(e) {
    this.insertAdjacentHTML("afterend", e);
  }
  prepend(e) {
    this.insertAdjacentHTML("afterbegin", e);
  }
  append(e) {
    this.insertAdjacentHTML("beforeend", e);
  }
  text(e) {
    if (B(e))
      return this.element.textContent;
    this.element.textContent = e;
  }
  html(e) {
    if (B(e))
      return this.element.outerHTML;
    this.empty(), !Le(e) && (this.element.innerHTML = e);
  }
  getElement() {
    return this.element;
  }
  empty() {
    return this.element == null ? this : (this.element.replaceChildren(), this);
  }
  /**
   * 보더, 패딩, 스크롤바를 포함한 전체 크기
   *
   * @returns {number} height
   */
  height() {
    return this.element.getBoundingClientRect().height;
  }
  setHeight(e) {
    this.element.style.height = e + "px";
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
    return this.element.style.display = "block", this;
  }
  hide() {
    return this.element.style.display = "none", this;
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
  hasClass(e) {
    return !!this.element.classList.contains(e);
  }
  /**
   * add element css class
   *
   * @param {string} addClasses css class
   */
  addClass(...e) {
    const t = this.element.classList;
    for (const i of e)
      t.contains(i) || t.add(i);
  }
  /**
   * remove element css class
   *
   * @param {string} removeClasses css class
   */
  removeClass(...e) {
    this.element.classList.remove(...e);
  }
  insertAdjacentHTML(e, t) {
    le(t) ? this.element.insertAdjacentHTML(e, t) : this.element.insertAdjacentElement(e, t);
  }
  /**
   * get attribute value
   *
   * @param {string} attrKey attribute key
   * @returns {*} attribute value
   */
  getAttr(e) {
    return this.element.getAttribute(e);
  }
  /**
   * set attribute
   * @param attrs element attribute object
   * @returns DaraElement
   */
  setAttr(e) {
    for (const t in e)
      this.element.setAttribute(t, e[t]);
    return this;
  }
  /**
   * remove attribute
   * @param attrKey element attribute keys ["class","style"]
   * @returns this
   */
  removeAttr(...e) {
    for (const t of e)
      this.element.removeAttribute(t);
    return this;
  }
  /**
   * css
   *
   @param attrs css value object
   * @returns
   */
  css(e) {
    for (const t in e)
      Fi(e, t) && this.element.style.setProperty(t, e[t]);
    return this;
  }
  /**
   * css
   *
   @param csskeys 제거할 css key 배열
   * @returns
   */
  removeCss(e) {
    for (const t of e)
      this.element.style.removeProperty(t);
    return this;
  }
}
class rr {
  constructor(e, t, i) {
    this.reversedAllRanges = [], this.rowLine = /* @__PURE__ */ new Set(), this.columnLine = /* @__PURE__ */ new Set(), this.serialNumber = 0, this.gridMain = e, this.options = t, this.config = i;
  }
  initSelection() {
    this.config.selection = Zs(), this.setReverseAllRange(), this.gridMain.getHeader().clearAnchorCell(), this.rowLine.clear(), this.columnLine.clear();
  }
  setSelectionRangeInfo(e, t, i) {
    if (t !== !0 && this.isAllSelect())
      return;
    const s = this.config, { dataInfo: n } = s;
    if (n.rowLength < 1)
      return;
    const r = e.range;
    if (t && (this.serialNumber = 0, this.initSelection()), B(r)) return;
    const o = this.setSelectionInfo(t, s.selection, e), l = n.lastRow, c = n.colLength - 1;
    let d = this.clampRange(o.range, l, c);
    d = this.setRangeMinMaxInfo(d), o.allRange.set(o.id, d), this.setReverseAllRange(), this.computeEffectiveSelectionRange(this.reversedAllRanges, o), i && this.setCellSelection(), this.selectAnchorCell(), s.checkOnRowSelect && this.gridMain.getBody().setItemsChecked(this.getRowIds(), !0), this.gridMain.getFooter().setSelectionStatus();
  }
  /**
   * 주어진 SelectionRange의 행/열 인덱스를 실제 데이터 범위 내로 제한합니다.
   *
   * @param range - 현재 선택된 범위 객체
   * @param maxRow - 데이터의 최대 행 인덱스
   * @param maxCol - 데이터의 최대 열 인덱스
   * @returns 유효한 인덱스 범위로 조정된 새로운 SelectionRange
   */
  clampRange(e, t, i) {
    return {
      ...e,
      startIdx: Math.min(Math.max(e.startIdx, 0), t),
      endIdx: Math.min(Math.max(e.endIdx, 0), t),
      startCol: Math.min(Math.max(e.startCol, 0), i),
      endCol: Math.min(Math.max(e.endCol, 0), i)
    };
  }
  /**
   * 주어진 SelectionRange 목록에서 'remove' 모드 범위를 제외한
   * 실질적인 최소/최대 행 및 열 범위를 계산합니다.
   *
   * @param ranges - 정렬된 SelectionRange 목록 (보통 역순으로 되어 있음)
   * @returns 실제 선택된 셀의 최소/최대 행, 열 인덱스 정보
   */
  computeEffectiveSelectionRange(e, t) {
    let i = 1 / 0, s = -1, n = 1 / 0, r = -1;
    const o = e.length, l = [];
    for (let c = 0; c < o; c++) {
      const d = e[c];
      if (d.mode === "remove") {
        l.push(d);
        continue;
      }
      let h = d.minIdx, u = d.maxIdx, g = d.minCol, f = d.maxCol;
      const m = l.length;
      if (m > 0)
        for (let p = 0; p < m; p++) {
          const y = l[p];
          yi(y, h, g, f) && (h = y.maxIdx), yi(y, u, g, f) && (u = y.minIdx), Ii(y, g, h, u) && (g = y.maxCol + 1), Ii(y, f, h, u) && (f = y.minCol);
        }
      h <= u && g <= f && (h < i && (i = h), u > s && (s = u), g < n && (n = g), f > r && (r = f));
    }
    t.minIdx = i, t.maxIdx = s, t.minCol = n, t.maxCol = r, this.getSelectedRowsAndCols(e);
  }
  /**
   * selection row col
   *
   * @private
   * @param {SelectionRange[]} ranges info
   */
  getSelectedRowsAndCols(e) {
    const t = e.some((g) => g.maxIdx >= 1e6), i = 12, s = (1 << i) - 1, n = 1e5, r = t ? (g, f) => g * n + f : (g, f) => g << i | f, o = t ? (g) => g / n | 0 : (g) => g >>> i, l = t ? (g) => g % n : (g) => g & s, c = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
    for (const g of e)
      for (let f = g.minIdx; f <= g.maxIdx; f++)
        for (let m = g.minCol; m <= g.maxCol; m++) {
          const p = r(f, m);
          c.has(p) || (c.add(p), g.mode === "add" && d.add(p));
        }
    this.rowLine.clear(), this.columnLine.clear();
    const h = this.rowLine, u = this.columnLine;
    d.forEach((g) => {
      h.add(o(g)), u.add(l(g));
    });
  }
  setReverseAllRange() {
    this.reversedAllRanges = Array.from(this.config.selection.allRange.values()).reverse();
  }
  setRangeMinMaxInfo(e) {
    return e.minIdx = Math.min(e.startIdx, e.endIdx), e.maxIdx = Math.max(e.endIdx, e.startIdx), e.minCol = Math.min(e.endCol, e.startCol), e.maxCol = Math.max(e.endCol, e.startCol), e;
  }
  /**
   * set selection info
   *
   * @public
   * @param {Selection} currentSelection change selection info
   * @param {SelectionRange} changeSelection changeRangeInfo
   * @returns {*}
   */
  setSelectionInfo(e, t, i) {
    const s = t.allRange, n = G(t, i);
    n.allRange = s;
    const r = i.range;
    let o = "";
    if (!tt(r.startCol) && r.modifierKey != 2) {
      let l = !1;
      r.type == "column" ? l = this.isColumnSelection(r) : l = this.isSelection(r.startIdx, r.startCol), r.mode = e || !l ? "add" : "remove", o = r.mode, n.id = this.getSelectionId(o), n.range = G(n.range, r);
    }
    return this.config.selection = n, n;
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
  setAllSelection(e) {
    this.config.selection.all = e, this.setCellSelection(), this.gridMain.getFooter().setSelectionStatus(), this.selectAnchorCell();
  }
  /**
   * clear anchor cell
   *
   */
  clearAnchorCell() {
    const e = this.gridMain.getBody().getBodyElement();
    this.removeStartAnchorCell(), ce(e.finds(".dg-cell." + Z.SELECTION), Z.SELECTION);
  }
  selectAnchorCell() {
    this.gridMain.getHeader().selectColumnAnchorCell(), this.gridMain.getBody().selectRowAnchorCell();
  }
  removeStartAnchorCell() {
    const e = this.gridMain.getBody().getStartCellElement();
    ce(e, Z.START_CELL);
  }
  /**
   * @method selectionData
   * @description select data 구하기.
   */
  selectionData(e = "text", t = !1) {
    const { dataManager: i, currentFields: s, selection: n, dataInfo: r } = this.config, o = i.getViewItems(), l = e === "json";
    if (r.rowLength < 1) return l ? {} : "";
    const c = this.isAllSelect(), d = c ? 0 : n.minCol, h = c ? r.colLength - 1 : n.maxCol, u = c ? 0 : n.minIdx, g = c ? r.lastRow : n.maxIdx;
    if (u < 0 || g < 0) return l ? {} : "";
    const f = [], m = /* @__PURE__ */ new Map(), p = { count: 0, numbers: [] }, y = new Set(Je(this.options)), I = s.find((x) => !x.$isAside), w = s.find((x) => !x.$isAside && !y.has(x.name)) ?? I;
    for (let x = u; x <= g; x++) {
      const C = o[x];
      if (!C) continue;
      const T = !!C.groupRowType, L = i.getRowItem(C.id), E = l ? {} : [];
      let M = !1;
      for (let N = d; N <= h; N++) {
        const H = s[N];
        if (H.hidden || H.$isAside) continue;
        const de = H.name, _ = c || this.isSelection(x, N);
        let D = "";
        _ && ((C.groupRowType === "groupSummary" || C.groupRowType === "group") && C.groupField && H.name === C.groupField ? D = C.groupRowType === "group" ? `${C.groupField}: ${String(C.groupValue ?? "")}` : `${String(C.groupValue ?? "")} 합계` : C.groupRowType === "groupSummary" && H === w ? D = "Subtotal" : C.groupRowType === "grandSummary" && H === w ? D = "Grand Total" : C.groupRowType && C.groupRowType !== "group" && y.has(H.name) ? D = C.groupSums?.[H.name] ?? "" : T || (D = H.$renderer.getValue(L)), M = !0, m.has(N) || m.set(N, H), !T && !Le(D) && (p.count++, J(D) && p.numbers.push(Number(D)))), l ? E[de] = D : E.push(gn(D));
      }
      M && f.push(l ? E : E.join("	"));
    }
    if (!l) return f.join(`
`);
    const v = Array.from(m.values());
    if (t && p.numbers.length > 0) {
      const x = {
        count: p.count,
        numFieldCount: p.numbers.length,
        min: -1,
        max: -1,
        avg: "",
        sum: -1
      }, C = p.numbers, T = C.reduce((L, E) => L + E, 0);
      return x.min = Math.min(...C), x.max = Math.max(...C), x.sum = T, x.avg = (T / C.length).toFixed(1), {
        header: v,
        data: f,
        summary: x
      };
    }
    return {
      header: v,
      data: f
    };
  }
  selectionRows() {
    const { dataManager: e, selection: t, dataInfo: i } = this.config, s = e.getViewItems();
    if (i.rowLength < 1)
      return [];
    const n = t.minIdx, r = t.maxIdx;
    if (n < 0 || r < 0)
      return [];
    const o = [];
    for (let l = n; l <= r; l++) {
      const c = s[l];
      if (c.groupRowType) continue;
      const d = e.getRowItem(c.id);
      o.push(d);
    }
    return o;
  }
  selectionRowIds() {
    const { dataManager: e, selection: t, dataInfo: i } = this.config, s = e.getViewItems();
    if (i.rowLength < 1)
      return [];
    const n = s.length, r = t.minIdx, o = t.maxIdx;
    if (r < 0 || o < 0 || r >= n)
      return [];
    const l = [];
    for (let c = r; c <= o; c++)
      s[c] && !s[c].groupRowType && l.push(s[c].id);
    return l;
  }
  /**
   * selection check
   *
   * @public
   * @param {number} rowIdx row index
   * @param {number} col cell index
   * @returns {boolean} selection return
   */
  isSelection(e, t) {
    const i = this.reversedAllRanges;
    for (const s of i)
      if (this.isCellSelectionRange(s, e, t))
        return s.mode != "remove";
    return !1;
  }
  /**
   * column selection check
   *
   * @public
   * @param {*} chackRange check column range info
   * @returns {boolean} true = selection, false = not selection
   */
  isColumnSelection(e) {
    const t = this.reversedAllRanges, { startIdx: i, startCol: s, endIdx: n, endCol: r } = e;
    for (const o of t)
      if (this.isCellSelectionRange(o, i, s) && this.isCellSelectionRange(o, n, r))
        return o.mode != "remove";
    return !1;
  }
  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  isCellSelectionRange(e, t, i) {
    return e.minIdx <= t && t <= e.maxIdx && e.minCol <= i && i <= e.maxCol;
  }
  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  isCellSelection(e, t, i) {
    return e.minIdx <= t && t <= e.maxIdx && e.minCol == i && i == e.maxCol;
  }
  /**
   * cell select
   *
   * @public
   */
  setCellSelection() {
    const e = this.config, { selection: t, scroll: i, dataInfo: s, fixedLeftIndex: n, fixedRightIndex: r } = e, o = e.dataInfo.startCol, l = this.isAllSelect(), c = 0, d = i.viewRow, h = l ? o : t.minCol, u = l ? s.colLength : t.maxCol, g = i.startIdx, f = i.startCol, {
      left: m,
      center: p,
      right: y
    } = this.gridMain.getBody().getBodyCellElements(), I = n > 0 && n > h, w = r > 0 && r <= u, { startIdx: v, startCol: x } = t.startCell, C = Math.min(n - 1, u), T = Math.min(i.endCol, u);
    this.clearAnchorCell();
    for (let L = c; L < d; L++) {
      const E = g + L;
      if (I)
        for (let M = o; M <= C; M++)
          this.updateCellSelectionClass(m[L][M], E, M, v, x);
      for (let M = f; M <= T; M++)
        this.updateCellSelectionClass(p[L][M], E, M, v, x);
      if (w)
        for (let M = r; M <= u; M++)
          this.updateCellSelectionClass(y[L][M], E, M, v, x);
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
    const t = this.config.dataManager.getViewItems(), i = [];
    return this.rowLine.forEach((s) => {
      const n = t[s];
      i.push(n.id);
    }), i;
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
  updateCellSelectionClass(e, t, i, s, n) {
    const r = e.classList;
    return s == t && n == i && r.add(Z.START_CELL), this.isAllSelect() || this.isSelection(t, i) ? (r.contains(Z.SELECTION) || r.add(Z.SELECTION), !0) : (r.contains(Z.SELECTION) && r.remove(Z.SELECTION), !1);
  }
  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  getSelectionRangeInfo() {
    const e = this.config.selection.range, t = e.minIdx, i = e.maxIdx;
    let s = -1, n = -1;
    return this.config.scroll.startIdx >= t ? s = 0 : s = t - this.config.scroll.startIdx, this.config.scroll.startIdx + this.config.scroll.viewRow <= i ? n = this.config.scroll.viewRow : n = i - this.config.scroll.startIdx, {
      startRow: s,
      endRow: n,
      startCol: e.minCol,
      endCol: e.maxCol
    };
  }
  /**
   * selection mode col info
   *
   * @public
   * @param {string} selectionMode selection mode
   * @param {number} col col
   * @param {boolean} isMouseDown
   * @returns {{ startCol: number; endCol: number; }}
   */
  getSelectionModeColInfo(e, t, i, s, n) {
    let r = t, o = t;
    return Qe(e) ? (r = i.dataInfo.startCol, o = i.dataInfo.colLength - 1) : e == oe.multiCell && (n ? r = -1 : be(s, "dg-line-number") ? (r = i.dataInfo.startCol, o = i.dataInfo.colLength - 1) : r = t), { startCol: r, endCol: o };
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
  setRangeInfo(e, t, i, s) {
    let n = s, r = s;
    Qe(this.options.selectionMode) && (n = 0, r = this.config.dataInfo.colLength - 1), ii(this.options.selectionMode) && e != "Tab" && Oe(t) ? this.setSelectionRangeInfo(
      {
        range: { endIdx: i, endCol: r },
        startCell: { startIdx: i, startCol: s }
      },
      !1,
      !0
    ) : this.setSelectionRangeInfo(
      {
        range: { startIdx: i, endIdx: i, startCol: n, endCol: r },
        startCell: { startIdx: i, startCol: s }
      },
      !0,
      !0
    );
  }
  /**
   * selection id
   *
   * @public
   * @param {?string} [type] selection type
   * @returns {string} selection id
   */
  getSelectionId(e) {
    return e ? e + ++this.serialNumber : "auto" + ++this.serialNumber;
  }
  /**
   * set start cell row index
   * @param {number} rowIdx row index
   */
  setStartCellRowIdx(e) {
    this.config.selection.startCell.startIdx = e;
  }
}
function yi(a, e, t, i) {
  return a.minIdx <= e && e <= a.maxIdx && a.minCol <= t && a.maxCol >= i;
}
function Ii(a, e, t, i) {
  return a.minCol <= e && e <= a.maxCol && a.minIdx <= t && a.maxIdx >= i;
}
const Ye = class Ye {
  constructor(e = Ye.DEFAULT_MAX_COUNT) {
    this.undoStack = [], this.redoStack = [], this.currentEntry = null, this.suspended = !1, this.maxCount = this.normalizeMaxCount(e);
  }
  /**
   * 최대 History Entry 개수를 변경합니다.
   *
   * 새로 설정한 개수보다 현재 History가 많으면
   * 가장 오래된 Entry부터 제거합니다.
   */
  setMaxCount(e) {
    this.maxCount = this.normalizeMaxCount(e), this.trimStack(this.undoStack), this.trimStack(this.redoStack);
  }
  /**
   * 현재 최대 History Entry 개수입니다.
   */
  getMaxCount() {
    return this.maxCount;
  }
  normalizeMaxCount(e) {
    return Number.isFinite(e) ? Math.max(0, Math.floor(e)) : Ye.DEFAULT_MAX_COUNT;
  }
  /**
   * 최대 개수를 초과한 가장 오래된 History를 제거합니다.
   */
  trimStack(e) {
    e.length <= this.maxCount || e.splice(0, e.length - this.maxCount);
  }
  pushUndo(e) {
    this.maxCount !== 0 && (this.undoStack.push(e), this.trimStack(this.undoStack));
  }
  /**
   * Transaction을 시작합니다.
   */
  begin(e) {
    this.suspended || this.currentEntry || (this.currentEntry = {
      changes: [],
      beforeSelection: e
    });
  }
  isRecording() {
    return this.currentEntry !== null;
  }
  /**
   * 현재 Transaction을 Undo Stack에 등록합니다.
   */
  commit(e) {
    if (this.suspended)
      return;
    const t = this.currentEntry;
    this.currentEntry = null, !(!t || t.changes.length === 0) && (t.afterSelection = e, this.pushUndo(t), this.redoStack.length = 0);
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
  add(e, t, i) {
    if (!this.suspended) {
      if (this.currentEntry) {
        this.currentEntry.changes.push(e);
        return;
      }
      this.pushUndo({
        changes: [e],
        beforeSelection: t,
        afterSelection: i ?? t
      }), this.redoStack.length = 0;
    }
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
    this.currentEntry && this.commit();
    const e = this.undoStack.pop();
    if (e)
      return this.maxCount > 0 && (this.redoStack.push(e), this.trimStack(this.redoStack)), e;
  }
  /**
   * Redo Entry를 꺼내고 Undo Stack으로 이동합니다.
   */
  redo() {
    const e = this.redoStack.pop();
    if (e)
      return this.pushUndo(e), e;
  }
  /**
   * History 기록을 일시 중지합니다.
   * 반환값은 호출 전 상태입니다.
   */
  suspend() {
    const e = this.suspended;
    return this.suspended = !0, e;
  }
  /**
   * History 기록을 재개합니다.
   */
  resume(e = !1) {
    this.suspended = e;
  }
  /**
   * History 전체를 초기화합니다.
   */
  clear() {
    this.undoStack.length = 0, this.redoStack.length = 0, this.currentEntry = null;
  }
  getUndoCount() {
    return this.undoStack.length;
  }
  getRedoCount() {
    return this.redoStack.length;
  }
};
Ye.DEFAULT_MAX_COUNT = 100;
let _t = Ye;
const or = 64;
class ls {
  constructor(e, t, i) {
    this.opts = e, this.gridMain = t, this.type = i, this.originalItems = [], this.originalViewItems = [], this.viewItems = [], this.sortBaseItems = [], this.searchDirty = !0, this.sortOrders = [], this.fullSortCache = null, this.searchMap = /* @__PURE__ */ new Map(), this.rowMap = /* @__PURE__ */ new Map(), this.rowCheckSet = /* @__PURE__ */ new Set(), this.createdRowIds = /* @__PURE__ */ new Set(), this.matchOffsetMap = /* @__PURE__ */ new Map(), this.beforeDataRowLength = -1, this.cfg = t.config(), this.rowHeight = this.cfg.rowHeight, this.rowIdField = this.cfg.rowIdField, this.history = new _t();
  }
  /**
   * UUID
   * @returns
   */
  generateUUID() {
    return typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : "xxxx-xxxx-xxxx-xxxx".replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
  }
  /**
   * CUD 모드 변경.
   * new = create, modify = update, remove = delete
   */
  setChangeValue(e, t, i, s) {
    const n = t.name, r = e[n], o = e[R.CUD];
    if (s) {
      if (s(e, t, i) === !1)
        return !1;
    } else
      e[n] = i;
    const l = e[n];
    if (Vt(r, l))
      return !1;
    e[R.CUD] === V.READ && this.setItemStatus(e, V.MODIFY);
    const c = e[R.CUD], d = e[R.ID], h = this.createHistorySelectionByChange(d, t);
    return this.history.add(
      {
        type: "update",
        rowId: d,
        fieldName: n,
        beforeValue: r,
        afterValue: l,
        beforeStatus: o,
        afterStatus: c
      },
      h,
      h
    ), !0;
  }
  /**
   * item 상태값 변경.
   *
   * @param item row item
   * @param status item status
   */
  setItemStatus(e, t) {
    const i = e[R.CUD];
    if (i !== t && (e[R.CUD] = t, t === V.DELETE)) {
      const s = {
        type: "update",
        rowId: e[R.ID],
        fieldName: R.CUD,
        beforeValue: i,
        afterValue: V.DELETE,
        beforeStatus: i,
        afterStatus: V.DELETE
      };
      this.history.add(s);
    }
  }
  removeSoftItem(e) {
    const i = [...new Set(e)].map((n) => {
      const r = this.getRowItem(n);
      if (!r) throw new Error(`Row not found: ${n}`);
      return r;
    }).filter((n) => n[R.CUD] !== V.DELETE), s = !this.history.isRecording();
    s && this.beginHistory();
    try {
      for (const n of i)
        this.setItemStatus(n, V.DELETE);
      s && this.commitHistory();
    } catch (n) {
      throw s && this.rollbackHistory(), n;
    }
    return i.map((n) => n[R.ID]);
  }
  /**
   * 변경된 아이템 얻기
   *
   * @returns 변경된 row items
   */
  getChangedItems() {
    const e = this.originalViewItems, t = [];
    for (const i of e) {
      const s = this.getRowItem(i.id);
      s[R.CUD] != V.READ && t.push(this.filterRowItem(s, !1));
    }
    return t;
  }
  /**
   * 저장되지 않은 변경(C/U/D)이 있는지 확인한다.
   */
  hasChanges() {
    for (const e of this.originalViewItems) {
      const t = this.getRowItem(e.id);
      if (t && !e.groupRowType && t[R.CUD] !== V.READ) return !0;
    }
    return !1;
  }
  /**
   * 서버 저장용 변경 행 스냅샷을 만든다. 원본 순서(트리는 부모 → 자식)를 유지한다.
   */
  getChangeSnapshot() {
    const e = [];
    for (const t of this.originalViewItems) {
      const i = this.getRowItem(t.id);
      if (!i || t.groupRowType || i[R.CUD] === V.READ) continue;
      const s = this.createSnapshotEntry(t.id, i);
      s.localOnly = s.localOnly && s.status === V.DELETE, e.push(s);
    }
    return e;
  }
  /**
   * 지정한 행의 스냅샷을 만든다. 상태와 무관하게 포함하며 그룹 가상 행과 없는 ID는 제외한다.
   */
  getRowSnapshots(e) {
    const t = new Set(
      this.originalViewItems.filter((s) => !s.groupRowType).map((s) => s.id)
    ), i = [];
    for (const s of e) {
      const n = t.has(s) ? this.getRowItem(s) : void 0;
      n && i.push(this.createSnapshotEntry(s, n));
    }
    return i;
  }
  createSnapshotEntry(e, t) {
    return {
      rowId: e,
      status: t[R.CUD],
      data: this.getSnapshotData(t),
      key: t[this.rowIdField],
      localOnly: this.createdRowIds.has(e)
    };
  }
  /** 서버로 보낼 행 데이터. 내부 관리 필드와 행 상태(_$CUD)는 제외한다. */
  getSnapshotData(e) {
    const t = this.filterRowItem(e, !1);
    return delete t[R.CUD], t;
  }
  /**
   * 서버 저장 결과를 반영한다.
   *
   * 스냅샷 이후 다시 편집된 행은 변경 상태를 유지하고, 그 외 행은 확정(READ)한다.
   * 삭제가 확정된 행은 제거한다. Undo/Redo 이력은 서버 상태와 맞지 않게 되므로 초기화한다.
   *
   * @param entries 저장 요청에 사용한 스냅샷
   * @param failedKeys 저장에 실패한 행의 ID 필드 값
   * @param idMap 신규 행의 요청 ID → 서버 ID
   * @returns 확정되어 제거된 행 ID 배열
   */
  acceptChanges(e, t = /* @__PURE__ */ new Set(), i = {}) {
    const s = [], n = this.rowIdField;
    for (const r of e) {
      if (!r.localOnly && t.has(r.key)) continue;
      const o = this.getRowItem(r.rowId);
      if (!o) continue;
      const l = this.getSnapshotData(o), c = o[R.CUD] !== r.status || Object.keys({ ...r.data, ...l }).some((h) => !Vt(r.data[h], l[h]));
      if (this.createdRowIds.delete(r.rowId), r.status === V.DELETE) {
        c || s.push(r.rowId);
        continue;
      }
      c ? r.status === V.CREATE && o[R.CUD] === V.CREATE && (o[R.CUD] = V.MODIFY) : o[R.CUD] = V.READ;
      const d = i[String(r.key)];
      d !== void 0 && n !== R.ID && (o[n] = d);
    }
    return s.length > 0 && this.purgeItems(s), this.history.clear(), s;
  }
  /**
   * 행을 삭제 모드·이력과 무관하게 제거한다. 서버 반영이 끝난 삭제에 사용하며 Undo/Redo 이력은 초기화한다.
   */
  purgeItems(e) {
    const t = this.opts.deleteMode, i = this.history.suspend();
    this.opts.deleteMode = "hard";
    try {
      return this.removeItems(e);
    } finally {
      this.opts.deleteMode = t, this.history.resume(i), this.history.clear();
    }
  }
  /**
   * 전체 체크 설정
   */
  setAllCheck() {
    for (const e of this.getViewItems())
      this.rowCheckSet.add(e.id);
  }
  /**
   * 체크된 아이템 초기화
   */
  clearAllCheck() {
    this.rowCheckSet.clear();
  }
  /**
   *  체크된 아이템 설정
   @param id 체크 설정할 row id
   * @param checked 체크 여부
   */
  setItemChecked(e, t) {
    t ? this.rowCheckSet.add(e) : this.rowCheckSet.delete(e);
  }
  /**
   * 특정 아이템이 체크되어 있는지 여부 반환
   @param id 체크 여부를 확인할 row id
   * @returns 체크 여부
   */
  isItemChecked(e) {
    return this.rowCheckSet.has(e);
  }
  getCheckedCount() {
    return this.rowCheckSet.size;
  }
  /**
   * 데이터 세팅
   * @param items
   */
  setItems(e) {
    this.history.clear(), this.clearAllCheck(), this.createdRowIds.clear(), this.originalItems = e, this.searchDirty = !0;
  }
  /**
   * 서버에서 받은 행을 목록 끝에 붙인다. 조회 데이터이므로 READ 상태로 추가하고 Undo 이력은 남기지 않는다.
   *
   * @returns 추가된 첫 행의 index. 추가할 행이 없으면 -1
   */
  appendItems(e) {
    const t = this.history.suspend();
    try {
      return this.addItems(e, { position: "after" }, V.READ);
    } finally {
      this.history.resume(t);
    }
  }
  createItem(e, t) {
    return this.cfg.dataManager.addItems([e], t, V.CREATE);
  }
  /**
   * 화면에서 옮긴 행 순서를 원본 순서에도 반영한다. 이렇게 하지 않으면 이후 행 추가·삭제·검색 해제 등으로
   * 목록이 다시 만들어질 때 이동한 순서가 사라진다.
   *
   * 화면 순서가 곧 원본 순서인 경우에만 반영한다. 정렬·검색·페이징이 있으면(화면이 원본의 일부이거나 파생 순서)
   * 이동을 화면에만 적용해야 하므로 Tree·Group과 함께 false를 돌려준다.
   *
   * @param movedItems 이동 후 화면의 ViewItem 순서(원본 행 전체)
   * @returns 반영했으면 true(화면 목록도 새 순서로 갱신), 반영하지 않았으면 false
   */
  applyMovedOrder(e) {
    const t = this.opts.footer, i = this.originalViewItems;
    if (this.type !== "list" || this.sortOrders.length > 0 || this.cfg.searchEnabled || t?.enabled && t.paging?.enabled || e.length !== i.length)
      return !1;
    const s = new Map(i.map((r) => [r.id, r])), n = [];
    for (const r of e) {
      const o = s.get(r.id);
      if (!o) return !1;
      n.push(o);
    }
    return new Set(n).size !== n.length ? !1 : (n.forEach((r, o) => {
      r.sortOrder = o;
    }), this.setOriginalViewItems(n), this.searchDirty = !0, this.applyViewItems(n.slice()), !0);
  }
  getSortBaseItems() {
    return this.sortBaseItems;
  }
  setSortBaseItems(e) {
    this.sortBaseItems = e;
  }
  dataSort(e, t) {
    const i = Array.from(e);
    i.forEach((o) => {
      o.field.getValue && (o.isValue = !0);
    });
    const s = this.isOriginalOrder(this.getPagingViewItems()), n = this.reuseFullSort(i, t), r = n ?? this.getSortData(i, t);
    this.sortOrders = e, this.sortOpts = t, this.applyViewItems(r), !n && s && this.cacheFullSort(i, t, r);
  }
  getSortSignature(e, t) {
    return JSON.stringify([e.map(({ name: i, ascOrder: s, isValue: n }) => [i, s, n]), t.nullsLast]);
  }
  /** 전체 행이 원래 순서로 정렬 입력이 되는 경우에만 캐시를 사용·저장한다. 검색·사용자 정렬 함수·페이징과는 함께 쓰지 않는다. */
  isFullSortCacheable(e) {
    const t = this.opts.footer;
    return this.type === "list" && !e.customSorting && !this.cfg.searchEnabled && !(t?.enabled && t.paging?.enabled);
  }
  isOriginalOrder(e) {
    const t = this.originalViewItems;
    if (e.length !== t.length) return !1;
    for (let i = 0; i < e.length; i++)
      if (e[i] !== t[i]) return !1;
    return !0;
  }
  cacheFullSort(e, t, i) {
    if (!this.isFullSortCacheable(t) || i.length !== this.originalViewItems.length)
      return;
    const s = i.map((n) => n.sortValues);
    s.some((n) => !n) || (this.fullSortCache = {
      signature: this.getSortSignature(e, t),
      items: i.slice(),
      values: s
    });
  }
  /**
   * 정렬 입력이 전체 행(원래 순서)이고 행 구성과 정렬 기준 값이 정렬 당시와 같으면 이전 정렬 결과를 돌려준다.
   * 값을 다시 읽어 비교하므로 셀 수정·행 추가·삭제로 달라졌으면 캐시를 쓰지 않고 새로 정렬한다.
   */
  reuseFullSort(e, t) {
    const i = this.fullSortCache;
    if (!i || !this.isFullSortCacheable(t) || i.signature !== this.getSortSignature(e, t) || !this.isOriginalOrder(this.getPagingViewItems()) || i.items.length !== this.originalViewItems.length) return null;
    const s = new Set(this.originalViewItems);
    for (let n = 0; n < i.items.length; n++) {
      const r = i.items[n];
      if (!s.has(r)) return null;
      const o = i.values[n], l = Ot(this, r, e);
      for (let c = 0; c < l.length; c++)
        if (!Vt(o[c], l[c])) return null;
    }
    return i.items.forEach((n, r) => {
      n.sortValues = i.values[r];
    }), i.items.slice();
  }
  /**
   * 정렬이 켜져 있을 때 소량의 행 추가와 삭제를 전체 재정렬 없이 반영한다.
   *
   * 정렬된 목록에서 삭제는 순서가 유지되고, 추가는 이진 탐색으로 자리를 찾는다. 같은 값은 원래 순서(sortOrder)를 따르므로
   * 전체를 다시 정렬한 결과와 같다. 검색·페이징·사용자 정렬 함수·Tree·Group이거나 추가 행이 많으면 반영하지 않고 false를 돌려준다.
   * 호출 전에 원본 목록(originalViewItems)이 이미 갱신되어 있어야 한다.
   *
   * @param added 새로 추가된 ViewItem
   * @param removedIds 삭제된 행 ID
   * @returns 반영했으면 true, 전체 재정렬이 필요하면 false
   */
  applyIncrementalMutation(e, t) {
    const i = this.sortOrders, s = this.sortOpts, n = this.opts.footer;
    if (this.type !== "list" || i.length === 0 || !s || s.customSorting || this.cfg.searchEnabled || n?.enabled && n.paging?.enabled || e.length > or)
      return !1;
    const r = this.getPagingViewItems(), o = t && t.size > 0 ? r.filter((d) => !t.has(d.id)) : r.slice(), l = s.nullsLast === !0, c = (d, h) => {
      for (let u = 0; u < i.length; u++) {
        const g = $i(d.sortValues[u], h.sortValues[u], i[u].ascOrder ?? !0, l);
        if (g !== 0) return g;
      }
      return d.sortOrder - h.sortOrder;
    };
    for (const d of e) {
      d.sortValues = Ot(this, d, i);
      let h = 0, u = o.length;
      for (; h < u; ) {
        const g = h + u >>> 1, f = o[g];
        if (!f.sortValues) return !1;
        c(f, d) > 0 ? u = g : h = g + 1;
      }
      o.splice(h, 0, d);
    }
    return o.length !== this.originalViewItems.length ? !1 : (this.searchDirty = !0, this.applyViewItems(o), this.cacheFullSort(i, s, o), !0);
  }
  /** 사용자 정렬 결과를 원래 ViewItem에 연결하여 트리·그룹 메타데이터를 보존한다. */
  sortItems(e, t, i) {
    if (i.customSorting) {
      const s = e.map((c) => this.filterRowItem(this.getRowItem(c.id), !0)), n = i.customSorting(s, t, i), r = new Map(e.map((c) => [c.id, c])), o = /* @__PURE__ */ new Set();
      if (!Array.isArray(n) || n.length !== e.length)
        throw new Error("customSorting must return every input row exactly once");
      return n.map((c) => {
        const d = c?.[R.ID] ?? c?.id, h = r.get(d);
        if (!h || o.has(d)) throw new Error("customSorting returned an unknown or duplicate row ID");
        return o.add(d), h;
      });
    }
    return Fs(e, this, t, i.nullsLast);
  }
  initializeRowItem(e, t = 0, i = V.READ) {
    const s = this.rowIdField, n = e[s] ?? this.generateUUID();
    return e[s] || (e[s] = n), this.rowIdField != R.ID && (e[R.ID] = n), e[R.DEPTH] = t, e[R.CUD] = i, e[R.HEIGHT] = this.rowHeight, i === V.CREATE && this.createdRowIds.add(n), e;
  }
  getViewItemIndex(e) {
    const t = this.viewItems;
    for (let i = 0; i < t.length; i++)
      if (t[i].id === e) return i;
    return -1;
  }
  /**
   * grid view에 보여지는 item의 id 배열 반환
   * @returns
   */
  getViewItems() {
    return this.viewItems;
  }
  /** 페이징 전의 현재 검색·정렬 대상이다. */
  getPagingViewItems() {
    return this.getViewItems();
  }
  applyViewItems(e) {
    this.setViewItems(e);
  }
  getUnfilteredViewItems() {
    return this.getOriginalViewItems().slice();
  }
  /** 데이터 변경 후 현재 검색·정렬·페이징을 다시 적용한다. */
  refreshViewAfterMutation() {
    this.searchDirty = !0, this.cfg.searchEnabled && this.beforeSearchMode && this.beforeKeyword ? this.search(this.beforeKeyword, { ...this.beforeSearchMode }) : (this.applyViewItems(this.getUnfilteredViewItems()), this.sortOrders.length > 0 && this.dataSort(this.sortOrders, this.sortOpts));
  }
  /**
   *  grid view에 보여지는 item의 id 배열 설정
   @param ids 화면에 보여질 ViewItem 배열
   */
  setViewItems(e) {
    const t = e;
    this.viewItems = t;
    const i = this.cfg.dataInfo;
    i.rowLength = t.length, i.lastRow = i.rowLength > 0 ? i.rowLength - 1 : 0, this.beforeDataRowLength != -1 && this.beforeDataRowLength !== i.rowLength && (this.gridMain.selectionInfo.initSelection(), this.gridMain.calcBody(), this.gridMain.refreshBody(!1, "setViewItems")), this.beforeDataRowLength = i.rowLength, this.gridMain.getSummary()?.drawData();
  }
  convertViewItemsToRowItems() {
    const e = [];
    for (const t of this.getViewItems()) {
      const i = this.getRowItem(t.id);
      e.push(i);
    }
    return e;
  }
  getRowItem(e) {
    return this.rowMap.get(e);
  }
  deleteRowItem(e) {
    this.rowMap.delete(e), this.createdRowIds.delete(e), this.rowCheckSet.delete(e), this.searchMap.delete(e), this.matchOffsetMap.delete(e);
  }
  getAllRowItems(e = !1) {
    const t = this.getViewItems(), i = new Array(t.length);
    for (let s = 0; s < t.length; s++) {
      const n = this.getRowItem(t[s].id);
      i[s] = this.filterRowItem(n, e);
    }
    return i;
  }
  /** 검색·페이징·트리 펼침 상태와 무관한 전체 원본 행의 얕은 복사본이다. */
  getSourceRowItems() {
    return this.getOriginalViewItems().filter((e) => !e.groupRowType).map((e) => this.filterRowItem(this.getRowItem(e.id), !1));
  }
  /**
   * 행 데이터에서 Grid 내부 관리용 필드를 제외하고 반환
   *
   *
   * @param item item
   * @param rowIdInclude 행 ID 포함 여부
   * @returns 내부 관리용 필드가 제외된 행 데이터
   */
  filterRowItem(e, t) {
    const i = {};
    for (const s in e) {
      if (s.indexOf(je) === 0) {
        t && s === R.ID && (i[s] = e[s]);
        continue;
      }
      i[s] = e[s];
    }
    return i;
  }
  getDataType() {
    return this.type;
  }
  /**
   * 지정한 row id의 행을 선택
   * @param rowId 선택할 row id
   * @param opts 포커스 이동, 스크롤 여부 등의 행 선택 옵션
   */
  selectRowById(e, t) {
    const i = this.getRowIndexById(e);
    if (i > -1) {
      let s = 1;
      if (t?.fieldName) {
        const n = this.cfg.allFieldMap.get(t?.fieldName);
        n?.$colSeq && (s = n?.$colSeq);
      } else
        s = this.cfg.dataInfo.startCol;
      this.gridMain.selectionInfo.setSelectionRangeInfo(
        {
          range: {
            type: "cell",
            startIdx: i,
            endIdx: i,
            startCol: s,
            endCol: s
          },
          isSelect: !0,
          startCell: { startIdx: i, startCol: s }
        },
        !0,
        !0
      ), t?.scrollIntoView !== !1 && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: i, drawFlag: !0 });
    }
  }
  /**
   * 원본 데이터 얻기
   * @returns
   */
  getOriginalItems() {
    return this.originalItems;
  }
  setOriginalViewItems(e) {
    this.originalViewItems = e;
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
  addSearchMapItem(e, t) {
    this.searchMap.set(e, t);
  }
  getSearchMapItem(e) {
    return this.searchMap.get(e);
  }
  hasSearchMapItem(e) {
    return this.searchMap.has(e);
  }
  getSearchMapItemLength() {
    return this.searchMap.size;
  }
  setRowItem(e, t) {
    this.rowMap.set(e, t);
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
    const e = this.cfg.selection;
    if (!e?.range)
      return;
    const t = e.range, i = t.startIdx, s = t.endIdx;
    if (i < 0 || s < 0 || i >= this.viewItems.length || s >= this.viewItems.length)
      return;
    const n = this.viewItems[i]?.id, r = this.viewItems[s]?.id;
    if (!(n == null || r === void 0 || r === null))
      return {
        startRowId: n,
        endRowId: r,
        startCol: t.startCol,
        endCol: t.endCol
      };
  }
  /**
   * 실제로 변경된 row와 field를 기준으로 Selection을 만듭니다.
   * 일반 셀 수정의 History Selection에 사용합니다.
   */
  createHistorySelectionByChange(e, t) {
    const i = this.getViewItemIndex(e), s = t.$colSeq;
    if (!(i < 0 || s === void 0 || s === null))
      return {
        startRowId: e,
        endRowId: e,
        startCol: s,
        endCol: s
      };
  }
  /**
   * History Entry 최대 보관 개수를 설정합니다.
   *
   * 예: 100으로 설정하면 가장 최근 100개의 Undo 단위만 보관합니다.
   * 0으로 설정하면 새로운 History를 저장하지 않습니다.
   */
  setHistoryMaxCount(e) {
    this.history.setMaxCount(e);
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
    const e = this.history.undo();
    if (!e)
      return !1;
    const t = this.history.suspend();
    try {
      for (let i = e.changes.length - 1; i >= 0; i--)
        this.applyHistoryChange(e.changes[i], !0);
    } finally {
      this.history.resume(t);
    }
    return this.refreshAfterHistory(e, !0), this.restoreHistorySelection(e.beforeSelection), !0;
  }
  redo() {
    const e = this.history.redo();
    if (!e)
      return !1;
    const t = this.history.suspend();
    try {
      for (let i = 0; i < e.changes.length; i++)
        this.applyHistoryChange(e.changes[i], !1);
    } finally {
      this.history.resume(t);
    }
    return this.refreshAfterHistory(e, !1), this.restoreHistorySelection(e.afterSelection), !0;
  }
  /**
   * History에 저장된 Selection을 현재 View 기준으로 복원합니다.
   * rowId로 현재 index를 다시 계산하기 때문에 정렬/검색/필터로
   * row 위치가 변경되어도 동일한 row를 선택할 수 있습니다.
   */
  restoreHistorySelection(e) {
    if (!e)
      return;
    const t = this.getViewItemIndex(e.startRowId), i = this.getViewItemIndex(e.endRowId);
    t < 0 || i < 0 || this.gridMain.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: "cell",
          startIdx: t,
          endIdx: i,
          startCol: e.startCol,
          endCol: e.endCol
        },
        isSelect: !0,
        startCell: {
          startIdx: t,
          startCol: e.startCol
        }
      },
      !0,
      !0
    );
  }
  applyHistoryChange(e, t) {
    switch (e.type) {
      case "update":
        this.applyUpdateHistory(e, t);
        break;
      case "add":
        this.applyAddHistory(e, t);
        break;
      case "remove":
        this.applyRemoveHistory(e, t);
        break;
    }
  }
  applyUpdateHistory(e, t) {
    const i = this.getRowItem(e.rowId);
    i && (i[e.fieldName] = t ? e.beforeValue : e.afterValue, i[R.CUD] = t ? e.beforeStatus : e.afterStatus);
  }
  /**
   * 신규 row History 적용
   *
   * add의 의미:
   * - undo : row 제거
   * - redo : row 복원
   *
   * 신규 행의 Redo 위치는 View 동기화 단계에서 정합니다.
   */
  applyAddHistory(e, t) {
    if (t) {
      this.rowMap.delete(e.rowId), this.removeViewItemById(e.rowId);
      return;
    }
    this.rowMap.set(e.rowId, e.item);
  }
  addHistory(e, t) {
    this.history.add({
      type: "add",
      rowId: e,
      item: t
    });
  }
  removeHistory(e, t, i) {
    this.history.add({
      type: "remove",
      rowId: e,
      item: this.getRowItem(e),
      viewItem: { ...t },
      index: i,
      checked: this.isItemChecked(e)
    });
  }
  /**
   * 삭제된 row History 적용
   *
   * remove의 의미:
   * - undo : row 복원
   * - redo : row 제거
   *
   * 삭제 이력에 저장된 위치는 View 동기화 단계에서 복원합니다.
   */
  applyRemoveHistory(e, t) {
    if (t) {
      this.rowMap.set(e.rowId, e.item), e.checked && this.rowCheckSet.add(e.rowId);
      return;
    }
    this.deleteRowItem(e.rowId), this.removeViewItemById(e.rowId);
  }
  /**
   * View에서 특정 row를 제거합니다.
   */
  removeViewItemById(e) {
    const t = this.getViewItemIndex(e);
    t < 0 || this.viewItems.splice(t, 1);
  }
  /**
   * History 적용이 끝난 후 현재 View를 갱신합니다.
   *
   * History는 데이터 변경만 관리하고 View의 index는 관리하지 않습니다.
   * 현재 정렬 상태라면 현재 데이터 기준으로 다시 정렬합니다.
   */
  refreshAfterHistory(e, t) {
    this.syncHistoryViewItems(e, t), this.refreshViewAfterMutation();
    const i = this.cfg, s = this.getViewItemIndex(e.changes[0].rowId), n = s >= 0 && Xi(i, i.scroll, s, -1) > 0;
    this.gridMain.refreshBody(!n, "history"), n && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: this.getViewItemIndex(e.changes[0].rowId) }), this.gridMain.getSummary()?.drawData();
  }
  /**
   * 삭제 행은 변경 당시의 위치에 복원하고, 추가 행의 Redo는 마지막에 배치합니다.
   * 이후 현재 검색·정렬·페이징을 다시 적용합니다.
   */
  syncHistoryViewItems(e, t) {
    const i = t ? e.changes.slice().reverse() : e.changes;
    for (const s of i) {
      if (s.type === "update")
        continue;
      const n = s.type === "add" ? !t : t;
      for (const r of /* @__PURE__ */ new Set([this.originalViewItems, this.viewItems])) {
        const o = r.findIndex((l) => l.id === s.rowId);
        if (n) {
          if (o === -1) {
            const l = s.type === "remove" ? s.viewItem : void 0, c = s.type === "remove" ? s.index ?? r.length : r.length;
            r.splice(c, 0, l ?? { id: s.rowId, sortOrder: c });
          }
        } else o > -1 && r.splice(o, 1);
      }
    }
    this.originalViewItems.forEach((s, n) => {
      s.sortOrder = n;
    });
  }
  search(e, t) {
    const i = [
      "matchCase",
      "matchWholeWord",
      "useRegex",
      "searchFields",
      "hideNonMatched",
      "matchWholeRegex"
    ];
    let s = this.beforeKeyword == e;
    if (this.beforeSearchMode)
      for (const p of i)
        if (p === "searchFields") {
          const y = t.searchFields, I = this.beforeSearchMode.searchFields;
          if (F(y) && JSON.stringify(y) != JSON.stringify(I) || !F(y) && y != I) {
            s = !1;
            break;
          }
        } else {
          const y = this.beforeSearchMode[p], I = t[p];
          if (y instanceof RegExp && I instanceof RegExp ? String(y) !== String(I) : y !== I) {
            s = !1;
            break;
          }
        }
    else
      s = !1;
    let n, r, o, l = !1;
    if (!this.searchDirty && this.beforeKeyword == e && s ? (n = this.cfg.searchMatchInfo, o = this.getViewItems()) : (l = !0, n = this.clearSearchInfo(), r = this.getSearchData(e, t), n.matchCount = r.matchCount, o = r.items), l && this.applyViewItems(o), this.sortOrders.length > 0) {
      const p = JSON.stringify(
        this.sortOrders.map(({ name: y, ascOrder: I, sortCell: w }) => ({
          name: y,
          ascOrder: I,
          sortCell: w
        }))
      );
      (l || this.beforeSearchSortInfo !== p) && (this.dataSort(this.sortOrders, this.sortOpts), this.beforeSearchSortInfo = p);
    }
    if (this.beforeKeyword = e, this.beforeSearchMode = G({}, t), this.searchDirty = !1, n.matchCount < 1) {
      this.setCurrentMatchInfo(0, {
        id: "",
        rowIndex: -1,
        cellIndex: -1
      });
      return;
    }
    const c = this.getMatchInfo(n, l, t), { rowIndex: d, cellIndex: h } = c, { startIdx: u, insideViewRow: g, insideStartCol: f, insideEndCol: m } = this.cfg.scroll;
    if (u + g <= d || d < u) {
      let p = -1;
      d < g ? p = 0 : p = d - (g - Math.ceil(g / 2)), p > -1 && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: p, drawFlag: !1 });
    }
    if (h > -1) {
      const p = c.matchedFields[h], y = this.cfg.allFieldMap.get(p.fieldName);
      if (y) {
        const I = y.$colSeq;
        y.$panel == "center" && (I < f || m < I) && this.gridMain.getScroll().moveHorizontalScroll({ colIdx: I, drawFlag: !1 });
      }
    }
  }
  clearSearchInfo() {
    this.clearSearchMap();
    const e = {
      id: "",
      rowIndex: -1,
      currentMatchIndex: -1,
      cellIndex: -1,
      matchCount: 0
    };
    return this.cfg.searchMatchInfo = e, e;
  }
  /**
   * 현재 검색 포커스 cell 정보
   *
   @param currentMatchIndex 현재 행 이전까지의 누적 match 수
   @param currentMatchInfo 현재 match 위치 정보
   * @returns
   */
  setCurrentMatchInfo(e, t) {
    const i = this.cfg.searchMatchInfo;
    i.currentMatchIndex = e + t.cellIndex + 1, i.id = t.id, i.cellIndex = t.cellIndex, i.rowIndex = t.rowIndex, this.gridMain.getDataSearch().setMatchCountText();
  }
  getCurrentMatchIndex(e) {
    return this.matchOffsetMap.get(e) ?? 0;
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
  resolveCellIndex(e, t, i, s, n) {
    if (!t || s === -1)
      return e ? 0 : i - 1;
    const r = e ? s + 1 : s - 1;
    return (e ? r >= i : r < 0) ? n === 1 ? e ? 0 : i - 1 : -1 : r;
  }
  findMatch(e, t, i, s) {
    const n = s.length, r = i.cellIndex, o = this.getSearchMapItemLength();
    for (let l = 0; l < n; l++) {
      const c = e ? (t + l) % n : (t - l + n) % n, d = s[c], h = this.getSearchMapItem(d.id)?.matchedFields;
      if (!h?.length) continue;
      const u = c === t, g = this.resolveCellIndex(e, u, h.length, r, o);
      if (!(g < 0))
        return this.createMatchInfo(d.id, c, g, h);
    }
    return this.createFallbackMatch(n, e, i);
  }
  createFallbackMatch(e, t, i) {
    return {
      id: "",
      rowIndex: -1,
      cellIndex: -1,
      matchedFields: []
    };
  }
}
const lr = 200;
function as(a, e, t, i) {
  const s = [], n = i.postProcess, r = a.length;
  if (!t.trim()) {
    for (let I = 0; I < r; I++) {
      const w = a[I];
      w.matchCount = void 0, w.matchedFields = void 0, w.isCurrentMatch = !1, s.push(w), n && n(!1, w);
    }
    return { isOriginal: !0, matchCount: 0, items: s };
  }
  const { matchCase: o, matchWholeWord: l, useRegex: c, searchFields: d, hideNonMatched: h } = i;
  let u = i.matchWholeRegex;
  const g = ar(a, e, d), f = o ? t : t.toLowerCase();
  l && !u && (u = Di);
  let m = null, p = null;
  if (c)
    if (t.length > lr)
      console.warn("Search pattern too long, falling back to text search.");
    else if (hr(t))
      console.warn("Search pattern looks unsafe (possible catastrophic backtracking), falling back to text search.");
    else
      try {
        const I = o ? "" : "i";
        m = new RegExp(t, I);
      } catch (I) {
        console.warn("Invalid regex, falling back to text search:", I);
      }
  else if (l) {
    const I = o ? "" : "i";
    p = new RegExp(`\\b${ur(f)}\\b`, I);
  }
  let y = 0;
  for (let I = 0; I < r; I++) {
    const w = a[I], v = e.getRowItem(w.id), x = cr(
      v,
      t,
      f,
      o,
      l,
      m,
      p,
      g,
      u
    ), C = x.length, T = C > 0;
    w.isCurrentMatch = !1, T ? (y += C, w.matchedFields = x, w.matchCount = C, s.push(w)) : (w.matchCount = void 0, w.matchedFields = void 0, h || s.push(w)), n && n(T, v, w);
  }
  return { isOriginal: !1, matchCount: y, items: s };
}
function ar(a, e, t) {
  return t === P ? a.length > 0 ? Object.keys(e.getRowItem(a[0].id)) : [] : Array.isArray(t) ? ei(t) : [t];
}
function cr(a, e, t, i, s, n, r, o, l) {
  const c = [];
  for (const d of o) {
    if (!Fi(a, d)) continue;
    const h = String(a[d]);
    if (!h) continue;
    const u = dr(
      h,
      e,
      t,
      i,
      s,
      n,
      r,
      l
    );
    u && c.push({
      fieldName: d,
      originalValue: h,
      matchCount: 1,
      matchPositions: [u]
    });
  }
  return c;
}
function dr(a, e, t, i, s, n, r, o) {
  try {
    if (n) {
      const l = n.exec(a);
      if (l)
        return {
          start: l.index,
          end: l.index + l[0].length
        };
    } else {
      if (s && r)
        return gr(a, e, i, o);
      {
        const c = (i ? a : a.toLowerCase()).indexOf(t);
        if (c !== -1)
          return {
            start: c,
            end: c + t.length
          };
      }
    }
  } catch (l) {
    console.warn("Search error:", l);
    const d = (i ? a : a.toLowerCase()).indexOf(t);
    if (d !== -1)
      return {
        start: d,
        end: d + t.length
      };
  }
  return null;
}
function hr(a) {
  const e = [];
  let t = { hasUnbounded: !1, hasAlternation: !1 };
  const i = (s) => {
    const n = a[s];
    if (n === "+" || n === "*") return 1;
    if (n === "{") {
      const r = /^\{\d+,\}/.exec(a.slice(s));
      return r ? r[0].length : 0;
    }
    return 0;
  };
  for (let s = 0; s < a.length; s++) {
    const n = a[s];
    if (n === "\\") {
      s++;
      continue;
    }
    if (n === "[") {
      for (s++; s < a.length && a[s] !== "]"; s++)
        a[s] === "\\" && s++;
      continue;
    }
    if (n === "(") {
      if (e.push(t), t = { hasUnbounded: !1, hasAlternation: !1 }, a[s + 1] === "?")
        if (s += 2, a[s] === "<" && a[s + 1] !== "=" && a[s + 1] !== "!")
          for (; s < a.length && a[s] !== ">"; ) s++;
        else a[s] === "<" && s++;
      continue;
    }
    if (n === ")") {
      const o = t;
      t = e.pop() ?? { hasUnbounded: !1, hasAlternation: !1 };
      const l = i(s + 1);
      if (l > 0) {
        if (o.hasUnbounded || o.hasAlternation) return !0;
        t.hasUnbounded = !0, s += l;
      } else
        o.hasUnbounded && (t.hasUnbounded = !0), o.hasAlternation && (t.hasAlternation = !0);
      continue;
    }
    if (n === "|") {
      t.hasAlternation = !0;
      continue;
    }
    const r = i(s);
    r > 0 && (t.hasUnbounded = !0, s += r - 1);
  }
  return !1;
}
function ur(a) {
  return a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function De(a, e) {
  return a.match(e) || [];
}
function gr(a, e, t, i) {
  t || (a = a.toLowerCase(), e = e.toLowerCase());
  const s = De(a, i), n = De(e, i);
  if (n.length === 0 || n.length > s.length) return null;
  for (let r = 0; r <= s.length - n.length; r++) {
    let o = !0;
    for (let l = 0; l < n.length; l++)
      if (s[r + l] !== n[l]) {
        o = !1;
        break;
      }
    if (o) {
      let l = 0, c = 0;
      for (; l < r && c < a.length; ) {
        const f = De(a.slice(c), i)[0];
        if (!f) break;
        c = a.indexOf(f, c) + f.length, l++;
      }
      const d = De(a.slice(c), i)[0], h = a.indexOf(d, c);
      let u = h;
      for (let f = 0; f < n.length; f++) {
        const m = De(a.slice(u), i)[0];
        u = a.indexOf(m, u) + m.length;
      }
      const g = a.substring(h, u);
      if (De(g, i).join(" ") === n.join(" "))
        return { start: h, end: u };
    }
  }
  return null;
}
class cs extends ls {
  constructor(e, t, i = "list") {
    super(e, t, i), this.pagingViewItems = [];
  }
  /**
   * init item
   * @param items items
   * @param depth depth
   * @returns
   */
  initItems(e, t = 0) {
    let i = 0;
    const s = [];
    return this.clearRowMap(), e.forEach((n) => {
      this.initializeRowItem(n, t, V.READ);
      const r = n[R.ID];
      s.push({
        id: r,
        sortOrder: i++
      }), this.setRowItem(r, n);
    }), s;
  }
  setItems(e) {
    const t = this.initItems(e);
    super.setItems(e), super.setOriginalViewItems(t), this.applyViewItems(t);
  }
  getPagingViewItems() {
    return this.pagingViewItems;
  }
  applyViewItems(e) {
    this.pagingViewItems = e.slice(), this.updatePagingAndViewItems(this.pagingViewItems);
  }
  /**
   * 페이징 옵션 여부에 따라 현재 ViewItems 및 페이징 정보를 업데이트합니다.
   */
  updatePagingAndViewItems(e) {
    const t = this.opts.footer;
    if (t?.enabled && t.paging?.enabled) {
      const i = e.length, s = this.opts.paging, n = !!t.paging.callback, r = Bi(
        {
          ...s,
          page: this.cfg.paging?.page ?? s?.page,
          totalCount: n ? s?.totalCount ?? i : i
        },
        i
      );
      if (this.gridMain.setPaging(r), n)
        this.setViewItems(e);
      else {
        const o = r.pageSize, l = (r.page - 1) * o, c = ei(e, l, l + o);
        this.setViewItems(c);
      }
    } else
      this.setViewItems(e);
  }
  getSearchData(e, t) {
    const i = this.getOriginalViewItems();
    this.matchOffsetMap.clear();
    let s, n = 0;
    t.postProcess = (o, l, c) => {
      if (!o || !c) return;
      const d = c.id;
      s === void 0 && (s = c.id), this.matchOffsetMap.set(d, n), n += c.matchedFields?.length ?? 0, this.addSearchMapItem(c.id, c);
    };
    const r = as(i, this.cfg.dataManager, e, t);
    if (s !== void 0) {
      const o = this.getSearchMapItem(s);
      o && (o.isCurrentMatch = !0);
    }
    return r;
  }
  getSortData(e, t) {
    const i = this.sortItems(this.getPagingViewItems(), e, t);
    if (!this.cfg.searchEnabled)
      return i;
    const s = this.cfg.searchMatchInfo, n = s.id ?? "";
    let r = 0, o = -1;
    this.matchOffsetMap.clear();
    let l = 0;
    for (let c = 0; c < i.length; c++) {
      const d = i[c].id, h = this.getSearchMapItem(d);
      h && (this.matchOffsetMap.set(d, l), l += h.matchedFields?.length ?? 0), o == -1 && n !== "" && d == n && (o = c);
    }
    return r = this.getCurrentMatchIndex(n), this.setCurrentMatchInfo(r, {
      id: n,
      rowIndex: o,
      cellIndex: s.cellIndex
    }), i;
  }
  getMatchInfo(e, t, i) {
    const s = i.direction === Fe.NEXT, n = this.getViewItems(), r = this.getSearchMapItem(e.id);
    r && (r.isCurrentMatch = !1);
    let o = e.rowIndex ?? -1;
    o = o < 0 ? this.cfg.scroll.startIdx : o;
    const l = this.findMatch(s, o, e, n), c = l.id, d = this.getSearchMapItem(c);
    d && (d.isCurrentMatch = !0, l.matchedFields = d.matchedFields ?? []);
    const h = this.getCurrentMatchIndex(c);
    return this.setCurrentMatchInfo(h, {
      id: c,
      rowIndex: l.rowIndex,
      cellIndex: l.cellIndex
    }), l;
  }
  createMatchInfo(e, t, i, s) {
    return {
      id: e,
      rowIndex: t,
      cellIndex: i,
      matchedFields: s
    };
  }
  getRowIndexById(e) {
    return this.getViewItemIndex(e);
  }
  /**
   * 신규 행 아이템들을 지정된 기준 위치(rowId, position)에 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts AddRowOptions { rowId?, position? }
   */
  addItems(e, t = { position: "after" }, i = V.READ) {
    if (!e || e.length === 0) return -1;
    const s = [...this.getOriginalViewItems()];
    let n = s.length;
    const r = t?.position === "before", o = t?.rowId;
    if (o !== void 0) {
      const c = s.findIndex((d) => d.id === o);
      c !== -1 && (r ? n = c : n = c + 1);
    } else r && (n = 0);
    const l = e.map((c) => {
      this.initializeRowItem(c, 0, i);
      const d = c[R.ID];
      return this.setRowItem(d, c), this.addHistory(d, c), {
        id: d,
        sortOrder: 0
      };
    });
    return s.splice(n, 0, ...l), s.forEach((c, d) => {
      c.sortOrder = d;
    }), this.setOriginalViewItems(s), this.applyIncrementalMutation(l) || this.refreshViewAfterMutation(), n;
  }
  /**
   * ID 목록에 해당하는 행들을 삭제
   *
   * @param ids 삭제할 행 ID 배열
   * @returns 실제 삭제된 행 ID 배열
   */
  removeItems(e) {
    if (!e || e.length === 0) return [];
    const t = new Set(e), i = this.getOriginalViewItems(), s = [], n = [];
    if (this.opts.deleteMode == "soft")
      return this.removeSoftItem(e);
    {
      const r = !this.getHistoryManager().isRecording();
      r && this.beginHistory(), i.forEach((o, l) => {
        const c = o.id;
        t.has(c) ? (this.removeHistory(c, o, l - s.length), s.push(c), this.deleteRowItem(c)) : n.push(o);
      }), r && this.commitHistory();
    }
    return s.length === 0 ? [] : (n.forEach((r, o) => {
      r.sortOrder = o;
    }), this.setOriginalViewItems(n), this.applyIncrementalMutation([], new Set(s)) || this.refreshViewAfterMutation(), s);
  }
  expandRow(e) {
  }
}
const Ce = {
  USER: 1,
  SEARCH: 2
}, Ut = "dg$root", fr = (a) => a == null || a === Ut || typeof a == "string" && a.trim() === "";
class Xe extends ls {
  constructor(e, t) {
    super(e, t, "tree"), this.idViewItemMap = /* @__PURE__ */ new Map(), this.originalTreeItems = [], this.viewTreeItems = [], this.flatViewTreeItems = [], this.visibleIndexMap = /* @__PURE__ */ new Map();
    const i = e.tree;
    this.idKey = i?.idField ?? "id", this.pidKey = i?.parentIdField ?? "pid", this.childrenKey = i?.childrenField ?? "children";
  }
  /**
   * 트리 노드 렌더링을 위한 데이터 초기화
   * @param items 원본 데이터 배열
   */
  setItems(e) {
    let t;
    this.opts.tree?.isFlatData ? t = this.buildTree(e) : t = e;
    const i = this.convertOriginalTreeToTreeViewItems(t);
    super.setItems(i.flatItems), this.originalTreeItems = i.treeViewItems, this.viewTreeItems = i.treeViewItems, this.setOriginalViewItems(this.getOriginalTreeViewItems()), this.buildViewItems();
  }
  getOriginalTreeViewItems() {
    const e = [], t = (i) => {
      for (const s of i)
        e.push(s), t(s.children ?? []);
    };
    return t(this.originalTreeItems), e;
  }
  getUnfilteredViewItems() {
    return this.getTreeToList(this.originalTreeItems);
  }
  refreshViewAfterMutation() {
    this.viewTreeItems = this.originalTreeItems, super.refreshViewAfterMutation();
  }
  syncHistoryViewItems(e, t) {
    const i = (n) => n.filter((r) => this.getRowItem(r.id) ? (r.children = i(r.children ?? []), !0) : !1);
    if (this.originalTreeItems = i(this.originalTreeItems), t) {
      const n = e.changes.slice().reverse().filter(
        (o) => o.type === "remove" && o.viewItem !== void 0
      );
      n.sort((o, l) => o.viewItem.depth - l.viewItem.depth);
      const r = new Map(this.getOriginalTreeViewItems().map((o) => [o.id, o]));
      for (const o of n) {
        if (!o.viewItem || r.has(o.rowId)) continue;
        const l = { ...o.viewItem, children: [] }, c = r.get(l.pid), d = c ? c.children : this.originalTreeItems;
        d.splice(o.index ?? d.length, 0, l), r.set(l.id, l);
      }
    }
    const s = (n) => n.forEach((r, o) => {
      r.sortOrder = o, r.isLeaf = !r.children?.length, s(r.children ?? []);
    });
    s(this.originalTreeItems), this.setOriginalViewItems(this.getOriginalTreeViewItems());
  }
  convertOriginalTreeToTreeViewItems(e) {
    let t = this.opts.tree?.expandDepth ?? 0;
    t = t - 1;
    const i = this.childrenKey, s = new Set(this.opts.tree?.defaultExpandedIds ?? []), n = [], r = [], o = (l, c, d, h) => {
      let u = 0;
      for (const g of l) {
        this.initializeRowItem(g, c, V.READ);
        const f = g[R.ID];
        this.setRowItem(f, g);
        const m = {
          id: f,
          pid: d,
          sortOrder: u++,
          depth: c,
          isLeaf: !0,
          expanded: c < t || s.has(g[this.idKey]) ? Ce.USER : 0
        };
        h.push(m), r.push(g);
        const p = g[i];
        p?.length && p.length > 0 && (m.children = [], m.isLeaf = !1, o(p, c + 1, f, m.children), g[i] = null);
      }
    };
    return o(e, 0, Ut, n), { flatItems: r, treeViewItems: n };
  }
  /**
   * flat → tree
   * @param flatItems items
   * @returns
   */
  buildTree(e) {
    const t = this.idKey, i = this.pidKey, s = this.childrenKey, n = /* @__PURE__ */ new Map(), r = [];
    for (const o of e)
      o[s] = [], n.set(o[t], o);
    for (const o of e) {
      const l = o[i];
      if (l == null) {
        r.push(o);
        continue;
      }
      const c = n.get(l);
      c ? c[s].push(o) : r.push(o);
    }
    return r;
  }
  /**
   * viewItems
   */
  buildViewItems() {
    this.setViewItems(this.getTreeToList(this.viewTreeItems));
  }
  /** 현재 정렬 순서를 유지하면서 접힌 하위 행까지 반환한다. */
  getAllTreeViewItems() {
    return this.flatViewTreeItems.slice();
  }
  getTreeToList(e) {
    this.visibleIndexMap.clear(), this.idViewItemMap.clear(), this.matchOffsetMap.clear();
    const t = [], i = [], s = this.cfg.searchEnabled;
    let n = 0;
    const r = (o, l) => {
      for (const c of o) {
        const d = c, h = d.id;
        if (s) {
          const g = this.getSearchMapItem(h);
          g && (this.matchOffsetMap.set(h, n), n += g.matchedFields?.length ?? 0);
        }
        this.idViewItemMap.set(h, d), i.push(d), l && (this.visibleIndexMap.set(h, t.length), t.push(d));
        const u = d.children;
        u && u.length > 0 && r(u, l && d.expanded > 0);
      }
    };
    return r(e, !0), this.flatViewTreeItems = i, t;
  }
  /**
   * toggle row expand/collapse
   * @param rowId 행의 ID
   */
  toggleRow(e) {
    const t = this.idViewItemMap.get(e);
    t && (t.expanded = t?.expanded > 0 ? 0 : Ce.USER, this.buildViewItems());
  }
  /**
   * 모든 행을 접음
   */
  collapseAll() {
    this.allToggle(!1);
  }
  /**
   * 모든 행을 펼침
   */
  expandAll() {
    this.allToggle(!0);
  }
  allToggle(e) {
    function t(i) {
      for (const s of i)
        s.children?.length > 0 && (s.expanded = e ? Ce.USER : 0, t(s.children));
    }
    t(this.viewTreeItems), this.buildViewItems();
  }
  /**
   * 특정 행을 펼침
   * @param rowId 펼칠 행의 ID
   * @returns
   */
  expandRow(e) {
    const t = this.idViewItemMap.get(e);
    t && (this.expandParents(t), this.buildViewItems());
  }
  expandParents(e, t = 1) {
    let i = !1, s = e;
    for (; s; )
      s.expanded < 1 && (i = !0, s.expanded = t), s = this.idViewItemMap.get(s.pid);
    return i;
  }
  /**
   * 검색
   *
   * @param keyword 검색어
   * @param options 검색 옵션
   * @returns
   */
  getSearchData(e, t) {
    const i = this.originalTreeItems, s = this.cfg.searchMatchInfo;
    s.matchCount = 0;
    const n = t.hideNonMatched;
    t.postProcess = (d, h, u) => {
      if (!u) return;
      const g = u;
      d ? (this.addSearchMapItem(g.id, g), s.matchCount += g.matchedFields?.length ?? 0) : g.expanded = g.expanded % 2 > 0 ? Ce.USER : 0;
    };
    const r = this.cfg.dataManager, o = /* @__PURE__ */ new Set(), l = (d, h) => {
      const u = as(d, r, e, t);
      if (u.isOriginal)
        return u;
      const g = [];
      for (const f of d) {
        const m = f.children ?? [];
        let p = {};
        m.length > 0 && (p = l(m));
        const y = f.pid, I = f.matchedFields?.length || p.matchCount > 0 || o.has(f.id);
        if (!n) {
          I && (f.expanded = I ? Ce.SEARCH : f.expanded, o.has(y) || o.add(y)), g.push(f);
          continue;
        }
        if (I) {
          const w = {
            ...f,
            children: p.items ?? []
          };
          w.expanded = Ce.SEARCH, g.push(w), o.has(y) || o.add(y);
        }
      }
      return {
        ...u,
        items: g
      };
    }, c = l(i);
    return this.viewTreeItems = c.items, c.items = this.getTreeToList(c.items), c.matchCount = s.matchCount, c;
  }
  getMatchInfo(e, t, i) {
    const s = i.direction === Fe.NEXT, n = this.flatViewTreeItems, r = this.getSearchMapItem(e.id);
    r && (r.isCurrentMatch = !1);
    let o = e.rowIndex ?? -1;
    o = o < 0 ? this.cfg.scroll.startIdx : o;
    const l = this.getViewItems();
    l.length <= o && (o = 0);
    const c = l[o].id;
    o = n.findIndex((f) => f.id == c);
    const d = this.findMatch(s, o, e, n), h = d.id, u = this.getSearchMapItem(h);
    u && (u.isCurrentMatch = !0, d.matchedFields = u.matchedFields ?? []);
    const g = this.getCurrentMatchIndex(h);
    return this.setCurrentMatchInfo(g, {
      id: h,
      rowIndex: d.rowIndex,
      cellIndex: d.cellIndex
    }), d;
  }
  createMatchInfo(e, t, i, s) {
    const n = this.getSearchMapItem(e);
    return n && this.expandParents(n, Ce.SEARCH) && this.buildViewItems(), {
      id: e,
      rowIndex: this.visibleIndexMap.get(e) ?? -1,
      cellIndex: i,
      matchedFields: s
    };
  }
  /**
   * 정렬
   *
   * @param sortOrders 정렬 정보
   * @param sortOpts 정렬 옵션
   * @returns
   */
  getSortData(e, t) {
    const i = (c) => {
      c = this.sortItems(c, e, t);
      for (const d of c) {
        const h = d, u = h.children;
        u && u.length > 0 && (h.children = i(u));
      }
      return c;
    }, s = i(this.viewTreeItems);
    this.viewTreeItems = s;
    const n = this.getTreeToList(s);
    if (!this.cfg.searchEnabled)
      return n;
    const r = this.cfg.searchMatchInfo, o = r.id, l = this.getCurrentMatchIndex(o);
    return this.setCurrentMatchInfo(l, {
      id: o,
      rowIndex: this.cfg.scroll.startIdx,
      cellIndex: r.cellIndex
    }), n;
  }
  getRowIndexById(e) {
    return this.expandRow(e), this.getViewItemIndex(e);
  }
  /**
   * 트리 구조에 신규 행 아이템들을 추가
   *
   * @param items 추가할 아이템 배열
   * @param addOpts 추가 옵션 { rowId?, position? ('before' | 'after' | 'inside') }
   */
  addItems(e, t = {}, i = V.READ) {
    if (!e || e.length === 0) return -1;
    let s = Ut, n = 0, r = this.originalTreeItems, o = r.length;
    if (t?.rowId !== void 0) {
      const d = this.getOriginalTreeViewItems().find((h) => h.id === t.rowId);
      if (d)
        if (t.position === "inside")
          s = d.id, n = d.depth + 1, d.children || (d.children = []), d.isLeaf = !1, d.expanded = Ce.USER, r = d.children, o = r.length;
        else {
          s = d.pid, n = d.depth, fr(s) ? r = this.originalTreeItems : r = this.getOriginalTreeViewItems().find((g) => g.id === s)?.children ?? this.originalTreeItems;
          const h = r.findIndex((u) => u.id === d.id);
          h !== -1 && (o = t.position === "before" ? h : h + 1);
        }
    } else t?.position === "before" && (o = 0);
    const l = (d, h, u) => {
      let g = 0;
      const f = [];
      for (const m of d) {
        this.initializeRowItem(m, h, i);
        const p = m[R.ID];
        m[this.pidKey] = u, this.setRowItem(p, m);
        const y = m[this.childrenKey], I = Array.isArray(y) && y.length > 0, w = {
          id: p,
          pid: u,
          sortOrder: g++,
          depth: h,
          isLeaf: !I,
          expanded: 0,
          children: []
        };
        I && (w.children = l(y, h + 1, p), m[this.childrenKey] = null), f.push(w);
      }
      return f;
    }, c = l(e, n, s);
    return r.splice(o, 0, ...c), r.forEach((d, h) => {
      d.sortOrder = h;
    }), this.setOriginalViewItems(this.getOriginalTreeViewItems()), this.refreshViewAfterMutation(), o;
  }
  /**
   * 행 삭제 구현
   * @param ids 삭제할 행의 ID 배열
   * @returns 삭제된 행 ID 배열
   */
  removeItems(e) {
    if (!e || e.length === 0) return [];
    const t = this.getOriginalTreeViewItems();
    if (this.opts.deleteMode === "soft") {
      for (const o of e)
        if (!t.some((l) => l.id === o)) throw new Error(`Row not found: ${o}`);
    }
    const i = new Set(e), s = [], n = (o, l = !1) => {
      let c = 0;
      o.forEach((d, h) => {
        const u = l || i.has(d.id);
        u && (s.push(d.id), this.opts.deleteMode !== "soft" && this.removeHistory(d.id, d, h - c), c++), n(d.children ?? [], u);
      });
    };
    if (this.opts.deleteMode === "soft")
      return n(this.originalTreeItems), this.removeSoftItem(s);
    const r = !this.getHistoryManager().isRecording();
    r && this.beginHistory(), n(this.originalTreeItems);
    for (const o of s) this.deleteRowItem(o);
    return r && this.commitHistory(), s.length ? (this.syncHistoryViewItems({ changes: [] }, !1), this.refreshViewAfterMutation(), s) : [];
  }
}
class mr extends cs {
  constructor(e, t) {
    super(e, t, "group"), this.groupRows = /* @__PURE__ */ new Map(), this.sourceViewItems = [], this.groupRowId = 0, this.historyBatchDepth = 0, this.groupingRefreshPending = !1;
  }
  setViewItems(e) {
    const t = e.filter((o) => !o.groupRowType);
    this.sourceViewItems = t;
    const i = this.opts.groupingFields ?? [];
    if (this.groupRows.clear(), i.length === 0) {
      super.setViewItems(t);
      return;
    }
    const s = [], n = t.map((o) => ({
      viewItem: o,
      item: super.getRowItem(o.id)
    })), r = (o, l, c) => {
      const d = i[l], h = /* @__PURE__ */ new Map();
      for (const u of o) {
        const g = u.item?.[d], f = h.get(g);
        f ? f.push(u) : h.set(g, [u]);
      }
      for (const [u, g] of h) {
        const f = [...c, u];
        l + 1 < i.length ? r(g, l + 1, f) : (s.push(...g.map(({ viewItem: m }) => m)), this.opts.showGroupSummary !== !1 && ke(this.opts).length > 0 && s.push(
          this.createGroupRow({
            groupRowType: "groupSummary",
            groupDepth: l,
            groupField: d,
            groupValue: u,
            groupValues: f,
            groupSums: this.sumRows(g)
          })
        ));
      }
    };
    n.length > 0 && r(n, 0, []), this.opts.showGrandSummary !== !1 && ke(this.opts).length > 0 && n.length > 0 && s.push(
      this.createGroupRow({
        groupRowType: "grandSummary",
        groupSums: this.sumRows(n)
      })
    ), super.setViewItems(s);
  }
  setChangeValue(e, t, i, s) {
    const n = super.setChangeValue(e, t, i, s);
    return n && ((this.opts.groupingFields ?? []).includes(t.name) || Je(this.opts).includes(t.name) || ke(this.opts).some((r) => typeof r.expression == "function")) && (this.groupingRefreshPending = !0, this.refreshGroupingIfReady()), n;
  }
  beginHistory() {
    super.beginHistory(), this.historyBatchDepth++;
  }
  commitHistory() {
    super.commitHistory(), this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1), this.refreshGroupingIfReady();
  }
  rollbackHistory() {
    super.rollbackHistory(), this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1), this.refreshGroupingIfReady();
  }
  getSortData(e, t) {
    const i = this.sortItems(this.getPagingViewItems(), e, t);
    if (!this.cfg.searchEnabled)
      return i;
    const s = this.cfg.searchMatchInfo, n = s.id ?? "";
    let r = -1, o = 0;
    this.matchOffsetMap.clear();
    for (let c = 0; c < i.length; c++) {
      const d = i[c].id, h = this.getSearchMapItem(d);
      h && (this.matchOffsetMap.set(d, o), o += h.matchedFields?.length ?? 0), r === -1 && d === n && (r = c);
    }
    const l = this.getCurrentMatchIndex(n);
    return this.setCurrentMatchInfo(l, {
      id: n,
      rowIndex: r,
      cellIndex: s.cellIndex
    }), i;
  }
  getRowItem(e) {
    return this.groupRows.get(e) ?? super.getRowItem(e);
  }
  getAllRowItems(e = !1) {
    return this.getViewItems().filter((t) => !t.groupRowType).map((t) => {
      const i = super.getRowItem(t.id);
      if (e)
        return i;
      const s = {};
      for (const n in i)
        n.indexOf(je) !== 0 && (s[n] = i[n]);
      return s;
    });
  }
  convertViewItemsToRowItems() {
    return this.getViewItems().filter((e) => !e.groupRowType).map((e) => super.getRowItem(e.id));
  }
  setAllCheck() {
    for (const e of this.getViewItems())
      e.groupRowType || this.setItemChecked(e.id, !0);
  }
  setItemChecked(e, t) {
    this.groupRows.has(e) || super.setItemChecked(e, t);
  }
  createGroupRow(e) {
    let t;
    do
      t = `dg$group$${++this.groupRowId}`;
    while (this.sourceViewItems.some((s) => s.id === t));
    const i = {
      id: t,
      sortOrder: this.groupRowId,
      ...e
    };
    return this.groupRows.set(t, { [R.ID]: t, [R.CUD]: V.READ }), i;
  }
  sumRows(e) {
    const t = {}, i = e.map(({ item: s }) => s);
    for (const s of ke(this.opts))
      t[Se(s)] = Hi(i, s);
    return t;
  }
  refreshGroupingIfReady() {
    this.groupingRefreshPending && this.historyBatchDepth === 0 && (this.groupingRefreshPending = !1, this.setViewItems(this.sourceViewItems.slice()));
  }
}
class b extends Error {
  constructor(e, t, i, s, n) {
    super(t), this.code = e, this.status = i, this.response = s, this.cause = n, this.name = "DataSourceError", Object.setPrototypeOf(this, b.prototype);
  }
}
function ut(a) {
  if (a instanceof b) return a;
  const e = a;
  return e?.type === "http" ? new b("HTTP", `HTTP ${e.status} ${e.statusText ?? ""}`.trim(), e.status, e.responseText, a) : e?.type === "timeout" ? new b("TIMEOUT", "Request timeout", void 0, void 0, a) : e?.type === "abort" || e?.name === "AbortError" ? new b("ABORT", "Request aborted", void 0, void 0, a) : e?.type === "network" ? new b("NETWORK", "Network error", void 0, void 0, a) : e?.type === "parse" ? new b("INVALID_RESPONSE", e.message || "Failed to parse response body", e.status, e.responseText, a) : e?.type === "method" ? new b("CONFIG", e.message || "Invalid HTTP method", e.status, void 0, a) : new b("NETWORK", e?.message || "Request failed", void 0, void 0, a);
}
const vi = ["GET", "POST", "PUT", "PATCH", "DELETE"];
class pr {
  constructor(e, t) {
    this.opts = e, this.defaultLoaderContainer = t;
  }
  /**
   * 엔드포인트로 요청을 보내고 (responseFilter·errorFilter·responseMap이 적용된) 응답을 반환한다.
   */
  async send(e, t, i, s) {
    const n = (t.method ?? (e === "load" ? "GET" : "POST")).toUpperCase();
    if (!vi.includes(n))
      throw new b("CONFIG", `Unsupported HTTP method: ${n}`);
    if (n === "GET" && e !== "load")
      throw new b("CONFIG", `${e} cannot use the GET method`);
    const r = {
      url: xs(this.opts.baseUrl, t.url),
      method: n,
      headers: await this.resolveHeaders(n, t),
      data: this.opts.requestMap ? this.opts.requestMap(i, e) : i,
      signal: s,
      credentials: t.credentials ?? this.opts.credentials,
      timeout: t.timeout ?? this.opts.timeout,
      ...this.resolveLoader(e)
    };
    let o, l = { ok: !0, status: 200 }, c = !1;
    try {
      const d = this.opts.request ? { data: await this.opts.request(r) } : await this.sendByAjax(r);
      o = d.data, l = { ok: !0, status: d.status ?? 200, headers: d.headers };
    } catch (d) {
      const h = ut(d);
      if (h.code === "ABORT") throw h;
      if (this.opts.errorFilter)
        o = await this.runErrorFilter(this.opts.errorFilter, h, d, e), c = !0;
      else if (h.code === "HTTP" && this.opts.responseFilter)
        o = Ci(h.response), l = {
          ok: !1,
          status: h.status ?? 0,
          statusText: d?.statusText,
          headers: xi(d),
          error: h
        };
      else
        throw h;
    }
    try {
      this.opts.responseFilter && !c && (o = await this.opts.responseFilter(o, e, l));
    } catch (d) {
      throw d instanceof b ? d : new b("INVALID_RESPONSE", d?.message || "Response rejected by responseFilter", void 0, o, d);
    }
    return this.opts.responseMap ? this.opts.responseMap(o, e) : o;
  }
  /**
   * errorFilter를 호출한다. 값을 반환하면 오류 복구, 던지면 그 오류를 전달한다.
   * DataSourceError가 아닌 오류는 원래 오류의 code·status·response를 유지한 채 메시지만 바꿔 정규화한다.
   */
  async runErrorFilter(e, t, i, s) {
    const n = {
      status: t.status,
      statusText: i?.statusText,
      headers: xi(i),
      data: t.code === "HTTP" ? Ci(t.response) : void 0
    };
    try {
      return await e(t, s, n);
    } catch (r) {
      throw r instanceof b ? r : new b(
        t.code,
        r?.message || t.message,
        t.status,
        t.response,
        r
      );
    }
  }
  /** 코어 Ajax의 loaderContainer·loaderOption 값을 구한다. */
  resolveLoader(e) {
    const t = this.opts.loader;
    return t === !1 || !(t?.operations ?? ["load"]).includes(e) ? {} : {
      loaderContainer: t?.container ?? this.defaultLoaderContainer,
      loaderOption: t?.options
    };
  }
  async resolveHeaders(e, t) {
    const i = this.opts.headers;
    return {
      Accept: "application/json",
      ...e !== "GET" ? { "Content-Type": "application/json" } : {},
      ...typeof i == "function" ? await i() : i,
      ...t.headers
    };
  }
  sendByAjax(e) {
    this.ajax || (this.ajax = Ls.create({ validMethods: vi, fetchMode: this.opts.fetchMode }));
    const t = e.method === "GET";
    return this.ajax.request({
      url: e.url,
      method: e.method,
      headers: e.headers,
      responseType: "json",
      params: t ? e.data : void 0,
      data: t ? void 0 : e.data,
      signal: e.signal,
      credentials: e.credentials,
      timeout: e.timeout,
      enableLoader: !!e.loaderContainer,
      loaderContainer: e.loaderContainer,
      loaderOption: e.loaderOption
    }).then((i) => ({ data: i?.data, status: i?.status, headers: i?.headers }));
  }
}
function xi(a) {
  const e = a, t = {}, i = e?.xhr?.getAllResponseHeaders?.();
  if (typeof i == "string")
    for (const n of i.trim().split(/[\r\n]+/)) {
      const r = n.indexOf(":");
      r > 0 && (t[n.slice(0, r).trim().toLowerCase()] = n.slice(r + 1).trim());
    }
  if (e?.xhr?.headers?.forEach?.((n, r) => {
    t[r.toLowerCase()] = n;
  }), e?.headers && typeof e.headers == "object")
    for (const [n, r] of Object.entries(e.headers))
      t[n.toLowerCase()] = String(r);
  return Object.keys(t).length > 0 ? t : void 0;
}
function Ci(a) {
  if (typeof a != "string" || a === "") return a;
  try {
    return JSON.parse(a);
  } catch {
    return a;
  }
}
function wr(a, e) {
  const t = new pr(a, e), i = {}, { load: s, save: n, remove: r } = a;
  return A(s) ? i.load = (o, l) => s(o, l) : s && (i.load = async (o, l) => ds(await t.send("load", s, o, l))), A(n) ? i.save = async (o, l) => Ei(await n(o, l)) : n && (i.save = async (o, l) => Ei(await t.send("save", n, o, l))), A(r) ? i.remove = (o, l) => r(o, l) : r && (i.remove = async (o, l) => {
    await t.send("remove", r, o, l);
  }), i;
}
function ds(a) {
  const e = a, t = F(a) ? a : e?.items;
  if (!F(t) || t.some((s) => s === null || typeof s != "object" || F(s)))
    throw new b("INVALID_RESPONSE", "Load response must be an array or { items: object[] }", void 0, a);
  const i = F(a) ? void 0 : e?.total;
  if (i != null && (typeof i != "number" || !Number.isFinite(i) || i < 0))
    throw new b("INVALID_RESPONSE", "Load response total must be a non-negative number", void 0, a);
  return { items: t, total: i ?? void 0 };
}
function Ei(a) {
  const e = a;
  if (e === null || typeof e != "object" || F(e)) return {};
  if (e.failed !== void 0 && !F(e.failed))
    throw new b("INVALID_RESPONSE", "Save response failed must be an array", void 0, a);
  if (e.idMap !== void 0 && (e.idMap === null || typeof e.idMap != "object" || F(e.idMap)))
    throw new b("INVALID_RESPONSE", "Save response idMap must be an object", void 0, a);
  return { idMap: e.idMap, failed: e.failed };
}
function yr(a, e, t) {
  const i = a.dataSource;
  if (a.toolbar?.remote) {
    if (!i?.load)
      throw new b("CONFIG", "toolbar.remote requires dataSource.load");
    if (!a.toolbar.enabled)
      throw new b("CONFIG", "toolbar.remote requires toolbar.enabled");
    if (i.toolbarParams === !1)
      throw new b("CONFIG", "toolbar.remote cannot be used with dataSource.toolbarParams false");
  }
  if (i) {
    if (i.autoLoad && !i.load)
      throw new b("CONFIG", "dataSource.autoLoad requires dataSource.load");
    if (i.sorting?.mode === "server" && (a.tree || a.groupingFields?.length))
      throw new b("UNSUPPORTED", "server sorting cannot be used with tree or groupingFields");
    if (i.filtering?.mode === "server")
      throw new b("UNSUPPORTED", 'dataSource.filtering.mode "server" is not supported yet');
    if (i.save) {
      if (e.deleteMode === "hard")
        throw new b("CONFIG", 'dataSource.save requires deleteMode "soft" to track deleted rows');
      a.deleteMode = "soft";
    }
    if (i.paging?.mode === "infinite") {
      if (a.tree || a.groupingFields?.length)
        throw new b("UNSUPPORTED", "infinite paging cannot be used with tree or groupingFields");
      if (a.footer?.paging?.enabled)
        throw new b("CONFIG", "infinite paging does not use footer.paging; disable footer.paging.enabled");
      i.paging.pageSize && (a.paging = { ...a.paging, pageSize: i.paging.pageSize });
    }
    if (i.paging?.mode === "server") {
      if (a.tree || a.groupingFields?.length)
        throw new b("UNSUPPORTED", "server paging cannot be used with tree or groupingFields");
      if (!a.footer?.enabled || !a.footer.paging?.enabled)
        throw new b("CONFIG", "server paging requires footer.enabled and footer.paging.enabled");
      if (a.footer.paging.callback)
        throw new b("CONFIG", 'footer.paging.callback is managed by dataSource.paging when mode is "server"');
      a.footer.paging.callback = t, i.paging.pageSize && (a.paging = { ...a.paging, pageSize: i.paging.pageSize });
    }
  }
}
class Ir {
  constructor(e, t) {
    this.gridMain = e, this.grid = t, this.loadedCount = 0, this.hasMore = !1, this.retryAfter = 0, this.lastParams = {}, this.queried = !1, this.page = 1, this.loadSeq = 0, this.loadAbort = null, this.loadActive = 0, this.loadTicket = 0, this.approvedTicket = 0, this.mutationAbort = null, this.loading = !1, this.destroyed = !1;
    const i = e.options().dataSource;
    if (!i) throw new b("CONFIG", "dataSource option is required");
    this.source = wr(i, e.element().getElement()), this.events = i.events ?? {}, this.serverPaging = i.paging?.mode === "server", this.serverSorting = i.sorting?.mode === "server", this.infinite = i.paging?.mode === "infinite", this.threshold = Math.max(0, Math.floor(i.paging?.threshold ?? 5));
  }
  /**
   * infinite 페이징에서 다음 페이지를 조회해 기존 데이터 뒤에 붙인다.
   * 다른 조회·저장·삭제가 진행 중이거나 더 받을 데이터가 없으면 요청하지 않고 null을 반환한다.
   */
  async loadMore() {
    if (this.assertReady("load"), !this.infinite) throw new b("CONFIG", 'loadMore requires dataSource.paging.mode "infinite"');
    if (!this.queried) throw new b("CONFIG", "Call load() before loadMore()");
    return !this.hasMore || this.loadActive > 0 || this.mutationAbort ? null : this.fetch(this.lastParams, this.page + 1, {}, !0);
  }
  /**
   * 본문을 그린 뒤 호출되어, 화면 끝에서 threshold행 이내이면 다음 페이지를 자동 조회한다.
   * 조회 실패는 loadError 이벤트로 알리며 스스로 재시도하지 않는다. 다음 스크롤에서 다시 확인하고,
   * 이미 끝에 있어 위치가 바뀌지 않는 입력(idleScroll)은 실패 직후 요청이 몰리지 않도록 1초 뒤부터 재시도한다.
   */
  checkLoadMore(e = !1) {
    if (!this.infinite || !this.hasMore || !this.queried || this.destroyed || this.loadActive > 0 || this.mutationAbort || e && Date.now() < this.retryAfter) return;
    const t = this.gridMain.config();
    t.scroll.startIdx + t.scroll.viewRow + this.threshold < t.dataInfo.rowLength || this.loadMore().catch(() => {
    });
  }
  /** 헤더 정렬을 서버 조회로 처리하는지 여부 */
  isServerSorting() {
    return this.serverSorting;
  }
  /** 지금 조회할 수 없는 상태(미저장 변경 또는 저장·삭제 진행 중)인지 여부. 정렬 상태를 바꾸기 전에 확인한다. */
  isLoadBlocked() {
    return this.mutationAbort !== null || this.gridMain.config().dataManager.hasChanges();
  }
  /**
   * 헤더에서 바뀐 정렬 상태로 첫 페이지부터 다시 조회한다. 마지막 조회 조건은 유지한다.
   * 조회할 수 없는 상태이면 loadError 이벤트로 알리고 reject 한다.
   */
  sortRemote(e) {
    return this.load(void 0, e);
  }
  /** 헤더 정렬 상태를 서버 조회 조건으로 변환한다. 정렬이 없으면 빈 배열이다. */
  getSortParams() {
    return this.gridMain.config().sort.orders.map((e) => ({ field: e.name, order: e.ascOrder ? "asc" : "desc" }));
  }
  isLoading() {
    return this.loading;
  }
  // ============================================================
  // 조회
  // ============================================================
  /**
   * 서버 데이터를 조회한다. 조회 조건을 지정하면 마지막 조건이 교체되고 첫 페이지부터 조회한다.
   * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
   * 조건을 생략하면 이전 조회가 있을 때는 마지막 조건을, 없으면 툴바 값만 사용한다.
   *
   * @returns 반영한 조회 결과. before 이벤트로 취소되었거나 더 새로운 요청에 밀렸으면 null
   */
  load(e, t) {
    const i = e ?? (this.queried ? this.lastParams : {});
    return this.fetch(e || !this.queried ? { ...this.getToolbarParams(), ...i } : i, 1, t);
  }
  /**
   * 검색 조건을 적용하여 첫 페이지부터 서버 조회한다.
   * 툴바가 활성화되어 있으면 툴바 필드 값을 함께 전달한다(같은 이름은 params가 우선).
   */
  searchRemote(e, t) {
    return this.fetch({ ...this.getToolbarParams(), ...e }, 1, t);
  }
  /**
   * toolbar.remote 설정에 따라 툴바 값으로 서버 조회를 자동 실행한다.
   * 실패는 loadError 이벤트로 알리므로 처리되지 않은 Promise 오류를 만들지 않는다.
   */
  searchByToolbar(e) {
    const t = this.gridMain.options().toolbar?.remote;
    if (!t || this.destroyed) return;
    const i = t === !0 ? {} : t;
    if (!(i.trigger ?? ["search"]).includes(e)) return;
    const n = () => {
      this.toolbarTimer = void 0, this.searchRemote({}, { discardChanges: i.discardChanges === !0 }).catch(() => {
      });
    };
    clearTimeout(this.toolbarTimer);
    const r = e === "change" ? i.debounce ?? 300 : i.debounce ?? 0;
    e === "change" && r > 0 ? this.toolbarTimer = setTimeout(n, r) : n();
  }
  getToolbarParams() {
    const e = this.gridMain.options();
    return e.dataSource?.toolbarParams === !1 || !e.toolbar?.enabled ? {} : this.gridMain.getToolbarValues();
  }
  /** 마지막 조회 조건과 현재 페이지로 다시 조회한다. */
  reload(e) {
    return this.fetch(this.lastParams, this.infinite ? 1 : this.page, e);
  }
  /** 서버 페이징에서 지정 페이지를 마지막 조회 조건으로 조회한다. */
  goToPage(e) {
    return this.fetch(this.lastParams, Math.max(1, Math.floor(e) || 1)).catch((t) => {
      if (!(t instanceof b)) throw t;
      return null;
    });
  }
  /**
   * @param append true이면 결과를 기존 데이터 뒤에 붙인다(infinite 다음 페이지). 미저장 변경이 있어도 조회할 수 있다.
   */
  async fetch(e, t, i = {}, s = !1) {
    if (this.assertReady("load"), !this.source.load) throw new b("CONFIG", "dataSource.load is not configured");
    this.mutationAbort && this.reject("loadError", "load", new b("BUSY", "Cannot load while saving or removing"));
    const n = i.discardChanges === !0, r = this.gridMain.config().dataManager;
    !s && !n && r.hasChanges() && this.reject(
      "loadError",
      "load",
      new b("UNSAVED_CHANGES", "Unsaved changes exist. Save them or pass { discardChanges: true }")
    );
    const o = new AbortController();
    let l = 0;
    const c = ++this.loadTicket;
    this.loadActive++, this.updateLoading("load");
    const d = { ...e };
    if ((this.serverPaging || this.infinite) && (d.page = t, d.pageSize = this.getPageSize()), this.serverSorting) {
      const u = this.getSortParams();
      u.length > 0 ? d.sort = u : delete d.sort;
    }
    const h = () => !this.destroyed && (l === 0 || l === this.loadSeq);
    try {
      if (!await this.emitBefore("beforeLoad", { operation: "load", params: d }) || !h() || c < this.approvedTicket) return null;
      this.approvedTicket = c, this.loadAbort?.abort(), l = ++this.loadSeq, this.loadAbort = o;
      const u = ds(await this.source.load(d, o.signal));
      if (!h()) return null;
      if (!s && !n && r.hasChanges())
        throw new b("UNSAVED_CHANGES", "Unsaved changes were made while loading; the result was discarded");
      if (this.lastParams = { ...e }, this.queried = !0, this.page = t, this.infinite) {
        this.loadedCount = s ? this.loadedCount + u.items.length : u.items.length;
        const g = u.total !== void 0 ? this.loadedCount >= u.total : u.items.length < this.getPageSize();
        this.hasMore = u.items.length > 0 && !g;
      }
      return s ? this.gridMain.appendItems(u.items) : this.applyLoadResult(u, t), this.emit("load", { operation: "load", params: d, items: u.items, total: u.total ?? u.items.length }), this.infinite && Promise.resolve().then(() => this.checkLoadMore()), u;
    } catch (u) {
      const g = ut(u);
      if (!h() || g.code === "ABORT" && o.signal.aborted) return null;
      throw s && (this.retryAfter = Date.now() + 1e3), this.emit("loadError", { operation: "load", error: g }), g;
    } finally {
      this.loadAbort === o && (this.loadAbort = null), this.loadActive--, this.updateLoading("load");
    }
  }
  applyLoadResult(e, t) {
    const i = this.gridMain;
    if (this.serverPaging) {
      const s = i.options(), n = e.total ?? e.items.length, r = ti(n, t, this.getPageSize(), s.paging?.unitPage ?? 5);
      this.page = r.page || 1, i.setPaging(r);
    }
    i.setItems(e.items);
  }
  getPageSize() {
    return this.gridMain.options().paging?.pageSize || 10;
  }
  // ============================================================
  // 저장
  // ============================================================
  /**
   * 변경된 행(C/U/D)을 서버에 저장한다. 변경이 없으면 요청하지 않는다.
   *
   * @returns 저장 요약. before 이벤트로 취소되면 null
   */
  async save() {
    const e = await this.saveChanges();
    return e && e.failed === 0 && e.created + e.updated + e.deleted > 0 && await this.reloadAfterMutation(), e;
  }
  async saveChanges() {
    if (this.assertReady("save"), !this.source.save) throw new b("CONFIG", "dataSource.save is not configured");
    this.assertIdle("saveError", "save");
    const e = this.gridMain.config().dataManager, t = e.getChangeSnapshot(), i = t.filter((r) => !r.localOnly);
    if (i.length === 0)
      return t.length > 0 && (e.acceptChanges(t), this.refreshAfterSave()), { created: 0, updated: 0, deleted: 0, failed: 0 };
    const s = this.toChangeSet(i), n = new AbortController();
    this.mutationAbort = n, this.updateLoading("save");
    try {
      if (!await this.emitBefore("beforeSave", { operation: "save", changes: s }) || this.destroyed) return null;
      const r = await this.source.save(s, n.signal);
      if (this.destroyed) return null;
      const o = new Set(r.failed ?? []), l = r.idMap ?? {};
      e.acceptChanges(t, o, l), this.refreshAfterSave();
      const c = i.filter((u) => o.has(u.key)), d = (u) => i.filter((g) => g.status === u).length - c.filter((g) => g.status === u).length, h = {
        created: d(V.CREATE),
        updated: d(V.MODIFY),
        deleted: d(V.DELETE),
        failed: c.length
      };
      return this.emit("save", { operation: "save", changes: s, summary: h }), h;
    } catch (r) {
      if (this.destroyed) return null;
      const o = ut(r);
      throw this.emit("saveError", { operation: "save", error: o }), o;
    } finally {
      this.endMutation(n, "save");
    }
  }
  /** 스냅샷을 서버 저장 포맷으로 변환한다. 삭제는 부모보다 자식을 먼저 보내도록 역순으로 담는다. */
  toChangeSet(e) {
    const t = { created: [], updated: [], deleted: [] };
    for (const i of e)
      i.status === V.CREATE ? t.created.push(i.data) : i.status === V.MODIFY ? t.updated.push(i.data) : i.status === V.DELETE && t.deleted.push(i.data);
    return t.deleted.reverse(), t;
  }
  refreshAfterSave() {
    this.gridMain.refreshBody(!0, "remoteSave"), this.gridMain.getHeader()?.setCheckboxStyle("none");
  }
  // ============================================================
  // 삭제
  // ============================================================
  /**
   * 선택된 행(또는 options.rowIds)을 서버에서 삭제한다.
   * 서버에 저장된 적 없는 신규 행은 요청 없이 로컬에서만 제거한다.
   *
   * @returns 삭제 요약. before 이벤트로 취소되면 null
   */
  async removeRemote(e = {}) {
    const t = await this.removeRows(e);
    return t && t.removed > 0 && await this.reloadAfterMutation(), t;
  }
  async removeRows(e) {
    if (this.assertReady("remove"), !this.source.remove) throw new b("CONFIG", "dataSource.remove is not configured");
    this.assertIdle("removeError", "remove");
    const t = this.gridMain, i = t.config().dataManager, s = [...new Set(e.rowIds ?? t.selectionInfo.selectionRowIds())], n = i.getRowSnapshots(s), r = n.filter((d) => d.localOnly).map((d) => d.rowId), o = n.filter((d) => !d.localOnly);
    if (o.length === 0)
      return r.length > 0 && (i.purgeItems(r), t.refreshBody(!0, "remoteRemove")), { removed: 0, discarded: r.length };
    const l = { deleted: o.map((d) => d.data) }, c = new AbortController();
    this.mutationAbort = c, this.updateLoading("remove");
    try {
      if (!await this.emitBefore("beforeRemove", { operation: "remove", request: l }) || this.destroyed || (await this.source.remove(l, c.signal), this.destroyed)) return null;
      t.config().dataManager.purgeItems([...o.map((h) => h.rowId), ...r]), t.refreshBody(!0, "remoteRemove");
      const d = { removed: o.length, discarded: r.length };
      return this.emit("remove", { operation: "remove", request: l, summary: d }), d;
    } catch (d) {
      if (this.destroyed) return null;
      const h = ut(d);
      throw this.emit("removeError", { operation: "remove", error: h }), h;
    } finally {
      this.endMutation(c, "remove");
    }
  }
  /**
   * infinite 페이징에서 서버 저장·삭제가 끝나면 첫 페이지부터 다시 조회한다.
   * 이미 받은 페이지는 서버에서 행이 바뀌면 offset이 어긋나 누락·중복이 생기기 때문이다.
   *
   * 다른 미저장 변경이 남아 있으면 그 변경을 버리게 되므로 다시 조회하지 않는다.
   * 조회 실패는 loadError 이벤트로 알리며 저장·삭제 결과에는 영향을 주지 않는다.
   */
  async reloadAfterMutation() {
    if (!(!this.infinite || this.destroyed) && !this.gridMain.config().dataManager.hasChanges())
      try {
        await this.fetch(this.lastParams, 1);
      } catch {
      }
  }
  endMutation(e, t) {
    this.mutationAbort === e && (this.mutationAbort = null, this.updateLoading(t));
  }
  // ============================================================
  // 상태·이벤트
  // ============================================================
  assertReady(e) {
    if (this.destroyed) throw new b("DESTROYED", `Cannot ${e}: grid is destroyed`);
  }
  /** save·remove는 진행 중인 다른 save·remove나 조회와 겹치지 않아야 한다. */
  assertIdle(e, t) {
    (this.mutationAbort || this.loadActive > 0) && this.reject(e, t, new b("BUSY", "Another remote operation is in progress"));
  }
  /** 사전 조건 오류를 error 이벤트로 알리고 던진다. */
  reject(e, t, i) {
    throw this.emit(e, { operation: t, error: i }), i;
  }
  updateLoading(e) {
    const t = this.loadActive > 0 || this.mutationAbort !== null;
    t !== this.loading && (this.loading = t, this.emit("loadingChange", { operation: e, loading: t }));
  }
  /** before 이벤트를 호출한다. false를 반환하면 작업을 취소한다. */
  async emitBefore(e, t) {
    const i = this.events[e];
    return i ? await i({ ...t, grid: this.grid }) !== !1 : !0;
  }
  /** 알림 이벤트를 호출한다. destroy 이후에는 호출하지 않고, 핸들러 오류는 작업 결과에 영향을 주지 않는다. */
  emit(e, t) {
    const i = this.events[e];
    if (!(!i || this.destroyed))
      try {
        i({ ...t, grid: this.grid });
      } catch (s) {
        console.error(`[daracl-grid] dataSource.events.${e} handler error`, s);
      }
  }
  /** 진행 중인 요청을 취소하고 이후 이벤트·결과 반영을 막는다. */
  destroy() {
    this.destroyed || (this.destroyed = !0, clearTimeout(this.toolbarTimer), this.loadAbort?.abort(), this.mutationAbort?.abort(), this.loadAbort = null, this.mutationAbort = null);
  }
}
class vr {
  constructor(e, t, i) {
    this.toolbarFields = [], this.conditionFields = [], this.fieldElements = /* @__PURE__ */ new Map(), this.toolbarLayouts = [], this.gridMain = e, this.toolbarElement = t, this.toolbarOpts = i;
  }
  init() {
    this.initRenderer(), this.createTemplate();
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
  setValues(e) {
    for (const t of this.toolbarFields) {
      if (!t.name || !t.$renderer.supportsEdit()) continue;
      const i = e[t.name];
      i !== void 0 && t.$renderer.setValue(i);
    }
  }
  getValues() {
    const e = {};
    for (const t of this.toolbarFields)
      !t.name || !t.$renderer.supportsEdit() || (e[t.name] = t.$renderer.getValue());
    return e;
  }
  refreshConditionFields() {
    this.conditionFields.forEach((e) => {
      e.$renderer.refreshCondition();
    });
  }
  refreshLayout() {
    const e = Array.from(this.toolbarElement.querySelectorAll(".dg-toolbar-row"));
    this.toolbarLayouts.forEach((t, i) => {
      const s = e[i];
      if (!s) return;
      const n = s.querySelectorAll(".dg-toolbar-section");
      t.forEach((r, o) => {
        const l = n[o];
        l && this.buildSectionLayout(l, r);
      });
    }), this.refreshRowWidths(e);
  }
  initRenderer() {
    const e = this.toolbarOpts.items || [], t = this.toolbarOpts.defaultValues ?? {}, i = this.gridMain.uid();
    this.toolbarLayouts = e.map(
      (s, n) => s.map((r, o) => ({
        ...r,
        children: r.children.map(
          (l, c) => this.createToolbarField(l, i, n, o, c, t)
        )
      }))
    );
  }
  createToolbarField(e, t, i, s, n, r) {
    const o = G({}, nr, e);
    o.$uid = `${t}_${i}_${s}_${n}`, o.renderer = typeof o.renderer == "string" ? {
      ...Gt,
      type: o.renderer
    } : G({}, Gt, o.renderer), r[o.name] !== void 0 && !o.defaultValue && (o.defaultValue = r[o.name]);
    const l = pi[o.renderer.type] ?? pi.text;
    return o.$renderer = new l(o, this.gridMain), this.toolbarFields.push(o), o.condition && this.conditionFields.push(o), o;
  }
  createTemplate() {
    const e = this.toolbarElement.querySelector(".dg-toolbar-scroll");
    if (!e) return;
    const t = document.createElement("div");
    t.style.cssText = "position: absolute; visibility: hidden; display: flex;", this.toolbarElement.appendChild(t);
    const i = document.createDocumentFragment();
    this.toolbarLayouts.forEach((s) => {
      i.appendChild(this.createRow(s, t));
    }), e.appendChild(i), t.remove();
  }
  createRow(e, t) {
    const i = document.createElement("div");
    if (e.length === 0) return i;
    i.className = "dg-toolbar-row", i.style.height = `${e[0].height}px`;
    const s = document.createDocumentFragment(), n = ["0px"], o = ["left", "center", "right"].map((l) => ({
      position: l,
      list: e.filter((c) => c.position === l)
    })).filter((l) => l.list.length > 0);
    return o.forEach((l, c) => {
      const d = l.list[0];
      if (d?.width) {
        const h = At(d.width), u = n.length + 2;
        n.push("auto", h, "auto"), l.list.forEach((g) => {
          this.createSection(g, u, s, t);
        });
      } else {
        const h = n.length + 1;
        let u = 0;
        l.list.forEach((g) => {
          u = this.createSection(g, h, s, t);
        }), n.push(`minmax(${u}px, 1fr)`);
      }
      c < o.length - 1 && n.push("2px", "2px");
    }), n.push("0px"), i.style.gridTemplateColumns = n.join(" "), i.appendChild(s), i;
  }
  createSection(e, t, i, s) {
    const n = document.createElement("div");
    n.className = `dg-toolbar-section dg-grid-area-${e.position}`, n.style.gridArea = `1 / ${t} / span 1 / span 1`, this.setWidth(n, e.width ?? "");
    const r = document.createDocumentFragment(), o = [];
    if (e.children.forEach((c) => {
      if (!c) return;
      if (c.renderer.type === "hidden") {
        c.$renderer.render(k("div"));
        return;
      }
      const d = this.createField(c, 0);
      r.appendChild(d), o.push({
        field: c,
        el: d
      });
    }), o.length > 0) {
      const c = document.createDocumentFragment(), d = [];
      o.forEach(({ field: h, el: u }) => {
        const g = u.cloneNode(!0);
        c.appendChild(g), d.push({
          field: h,
          clone: g
        });
      }), s.appendChild(c), d.forEach(({ field: h, clone: u }) => {
        h.$width = u.getBoundingClientRect().width;
      }), s.innerHTML = "";
    }
    n.appendChild(r);
    const l = this.buildSectionLayout(n, e);
    return i.appendChild(n), l;
  }
  buildSectionLayout(e, t) {
    const i = ["0px"];
    let s = 2, n = 0;
    return t.children.forEach((r, o) => {
      if (!r || r.renderer.type === "hidden")
        return;
      const l = this.fieldElements.get(r.$uid);
      if (!l || l.classList.contains("dg-hide"))
        return;
      let c = 0, d = 0;
      F(r.gap) ? r.gap.length === 1 ? d = r.gap[0] ?? 0 : (c = r.gap[0] ?? 0, d = r.gap[1] ?? 0) : J(r.gap) ? d = r.gap : t.children.slice(o + 1).some((g) => {
        if (g.renderer.type === "hidden")
          return !1;
        const f = this.fieldElements.get(g.$uid);
        return f && !f.classList.contains("dg-hide");
      }) && (d = 4), c > 0 && (i.push(`${c}px`), s++, n += c);
      const h = r.width ? At(r.width) : r.renderer.type === "button" ? "max-content" : "1fr";
      i.push(h), l.style.gridArea = `1 / ${s} / span 1 / span 1`, s++, n += r.$width ?? 0, d > 0 && (i.push(`${d}px`), s++, n += d);
    }), i.push("0px"), e.style.gridTemplateColumns = i.join(" "), n;
  }
  createField(e, t) {
    const i = document.createElement("div"), { type: s, required: n } = e.renderer, r = n === !0 || s !== "label" && s !== "button" && !!e.label;
    return i.className = `dg-toolbar-field dg-type-${s} ${r ? "dg-group" : ""}`, i.style.gridArea = `1 / ${t} / span 1 / span 1`, i.dataset.uid = e.$uid, i.innerHTML = r ? `
          <span class="dg-label ${n ? "dg-required" : ""}">${j(String(e.label))}</span>
          <div class="dg-control"></div>
        ` : '<div class="dg-control"></div>', e.$renderer.render(i), this.setWidth(i, e.width ?? "auto"), this.fieldElements.set(e.$uid, i), e.$renderer.afterRender(), i;
  }
  setWidth(e, t) {
    if (!t) return;
    const i = At(t);
    e.style.width = i, t !== "auto" ? (e.style.minWidth = i, e.style.maxWidth = i) : (e.style.minWidth = "initial", e.style.maxWidth = "initial");
  }
  refreshRowWidths(e) {
    const t = e.map((i) => Array.from(i.querySelectorAll(".dg-toolbar-section")).map((n) => n.scrollWidth));
    e.forEach((i, s) => {
      const n = t[s], r = ["0px"];
      n.forEach((o, l) => {
        r.push(`minmax(${o}px, 1fr)`), l < n.length - 1 && r.push("2px", "2px");
      }), r.push("0px"), i.style.gridTemplateColumns = r.join(" ");
    });
  }
}
class xr {
  constructor(e, t, i) {
    this.arrowScrollFrame = null, this.gridMain = e, this.toolbarElement = t, this.toolbarOpts = i;
  }
  init() {
    this.initWheelEvent(), this.initArrowEvents(), this.toolbarOpts.scrollbarEnabled === !0 && this.toolbarElement.classList.add("dg-has-scrollbar");
  }
  resizeArrowVisibility() {
    if (!this.toolbarOpts?.enabled)
      return;
    if (this.toolbarOpts.arrowEnabled === !1) {
      this.toolbarElement.classList.remove("dg-has-arrow");
      return;
    }
    const e = this.getScrollElement();
    if (!e) return;
    e.scrollWidth > e.clientWidth ? this.toolbarElement.classList.add("dg-has-arrow") : (this.toolbarElement.classList.remove("dg-has-arrow"), e.scrollLeft = 0);
  }
  destroy() {
    this.stopArrowScrolling();
  }
  initWheelEvent() {
    const e = this.getScrollElement();
    if (!e) return;
    const { eventManager: t } = this.gridMain.config();
    t.off(e, "wheel DOMMouseScroll"), t.on(
      { el: e, type: "wheel DOMMouseScroll" },
      (i) => {
        if (e.scrollWidth <= e.clientWidth) return;
        const s = i.deltaY;
        tt(s) || Oe(i) || ($(i), this.gridMain.hideLayer(), e.scrollLeft += s);
      },
      { passive: !1 }
    );
  }
  initArrowEvents() {
    const e = this.toolbarElement.querySelector(".dg-toolbar-arrow");
    if (!e) return;
    const t = e.querySelector('[data-direction="left"]'), i = e.querySelector('[data-direction="right"]');
    t && this.bindArrowEvents(t, "left"), i && this.bindArrowEvents(i, "right");
  }
  bindArrowEvents(e, t) {
    const { eventManager: i } = this.gridMain.config();
    i.on({ el: e, type: "mousedown touchstart" }, () => this.startArrowScrolling(t)), i.on({ el: e, type: "mouseup mouseleave touchend touchcancel" }, () => this.stopArrowScrolling());
  }
  startArrowScrolling(e) {
    this.stopArrowScrolling();
    const t = () => {
      this.scrollByDirection(e), this.arrowScrollFrame = requestAnimationFrame(t);
    };
    t();
  }
  stopArrowScrolling() {
    this.arrowScrollFrame !== null && (cancelAnimationFrame(this.arrowScrollFrame), this.arrowScrollFrame = null);
  }
  scrollByDirection(e) {
    const t = this.getScrollElement();
    if (!t) return;
    const i = 50;
    t.scrollLeft += e === "left" ? -i : i;
  }
  getScrollElement() {
    return this.toolbarElement.querySelector(".dg-toolbar-scroll");
  }
}
class Cr {
  /**
   * Toolbar 생성
   *
   * @param gridMain GridMain 인스턴스
   */
  constructor(e) {
    this.toolbarEnabled = !1, this.gridMain = e, this.config = e.config(), this.toolbarOpts = e.options().toolbar;
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
    const e = this.gridMain.element().findDaraElement(".dg-toolbar");
    if (!this.toolbarOpts?.enabled) {
      e.getElement().remove();
      return;
    }
    this.toolbarEnabled = !0, e.css({
      display: "block",
      height: `${this.config.dimensions.toolbarHeight}px`
    }), this.toolbarElement = e.getElement(), this.toolbarRenderer = new vr(this.gridMain, this.toolbarElement, this.toolbarOpts), this.toolbarScroll = new xr(this.gridMain, this.toolbarElement, this.toolbarOpts), this.toolbarRenderer.init(), this.toolbarScroll.init(), this.refreshConditionFields();
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
  setValues(e) {
    this.toolbarRenderer.setValues(e);
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
    this.toolbarRenderer.refreshConditionFields(), requestAnimationFrame(() => {
      this.refreshToolbarLayout();
    });
  }
  /**
   * Toolbar Layout을 계산
   */
  refreshToolbarLayout() {
    this.toolbarRenderer.refreshLayout(), this.resizeArrowVisibility();
  }
  resizeArrowVisibility() {
    this.toolbarEnabled && this.toolbarScroll.resizeArrowVisibility();
  }
  /**
   * Toolbar를 정리
   *
   * Scroll Controller에서 사용 중인 Animation Frame 및
   * 기타 리소스를 정리합니다.
   */
  destroy() {
    this.toolbarScroll?.destroy();
  }
}
const Er = 2, Mr = 1e5;
class br {
  /**
   * DimensionCalculator 생성
   *
   * @param opts 그리드 옵션
   * @param gridMain 그리드 메인
   * @param fieldWidthCalculator 필드 width 계산기
   */
  constructor(e, t, i) {
    this.opts = e, this.gridMain = t, this.fieldWidthCalculator = i;
  }
  /**
   * 그리드 dimension 계산
   */
  calcGridDimension() {
    this.calculateToolbarDimension(), this.calculateFooterDimension(), this.calculateSummaryDimension();
  }
  /**
   * Body layout 계산
   *
   * @param width 그리드 width
   * @param height 그리드 height
   */
  calculateBodyLayout(e, t) {
    const i = this.gridMain.config(), { dimensions: s, rowHeight: n, dataInfo: r, currentFields: o, scroll: l } = i, c = this.gridMain.element(), d = s.toolbarHeight + s.footerHeight + s.mainHeaderHeight + n;
    let h = t < 0 ? c.height() : t;
    h = Math.max(d, h), s.height = h, s.width = e < 0 ? c.clientWidth() : e, this.adjustLineNumberWidth();
    let u = 0;
    for (const p of o)
      u += i.isHeaderResize ? p.$width : p.width;
    s.fieldTotalWidth = u, this.fieldWidthCalculator.calculateHorizontalScroll(u);
    const g = s.mainHeaderHeight + s.mainSummaryHeight + (l.enabledHorizontal ? i.scrollbarSize : 0);
    if (i.disableVerticalScroll)
      l.enabledVertical = !1, s.mainHeight = n * r.rowLength + g + 1, s.mainBodyHeight = n * r.rowLength, s.height = s.mainHeight + s.toolbarHeight + s.footerHeight;
    else {
      const p = h - (s.toolbarHeight + s.footerHeight);
      s.mainHeight = p, s.mainBodyHeight = p - g - 1, l.enabledVertical = n * r.rowLength > s.mainBodyHeight;
    }
    this.fieldWidthCalculator.calculateHorizontalScroll(u);
    const f = s.mainBodyHeight / n, m = Math.min(Math.max(1, Math.ceil(f)), r.rowLength);
    l.insideViewRow = m - (m > 1 && m > Math.floor(f) ? 1 : 0), l.viewRow = m, this.fieldWidthCalculator.distributeWidths(o, u, i.isHeaderResize);
  }
  /**
   * Toolbar height 계산
   */
  calculateToolbarDimension() {
    const { toolbar: e } = this.opts;
    if (!e?.enabled || !e.items?.length) return;
    const t = J(e.height) ? e.height : Ti;
    let i = 0;
    e.items.forEach((s) => {
      if (s.length > 0) {
        const n = J(s[0].height) ? s[0].height : t;
        s[0].height = n, i += n;
      }
    }), this.gridMain.config().dimensions.toolbarHeight = i;
  }
  /**
   * Footer height 계산
   */
  calculateFooterDimension() {
    const { footer: e } = this.opts;
    e?.enabled && (this.gridMain.config().dimensions.footerHeight = J(e.height) ? e.height : Vi);
  }
  /**
   * Summary height 계산
   */
  calculateSummaryDimension() {
    const { summary: e } = this.opts;
    if (!e || !e.items || e.items.length === 0) return;
    const t = this.gridMain.config(), i = e.items.length, { height: s, heights: n } = ji(e.height);
    t.summary.heights = new Array(i);
    let r = 0;
    for (let o = 0; o < i; o++) {
      let l = n.length > o ? n[o] : s;
      l = l > 0 ? l : s, r += l, t.summary.heights[o] = l;
    }
    t.dimensions.mainSummaryHeight = r + Math.min(r, Er);
  }
  /**
   * Line Number width 계산
   */
  adjustLineNumberWidth() {
    const e = this.gridMain.config(), { dataInfo: t, currentFields: i, allFieldMap: s } = e, n = s.get(ye)?.$colSeq;
    if (B(n)) return;
    const r = i[n];
    if (!r) return;
    let o;
    t.rowLength >= Mr ? o = Gi(e, String(t.rowLength)) || (this.opts.aside.lineNumber.width ?? Nt) : o = this.opts.aside.lineNumber.width ?? Nt, r.width = o, r.$width = o;
  }
}
class Sr {
  constructor(e, t, i) {
    this.opts = e, this.gridMain = t, this.rendererFactory = i;
    const s = e.header;
    this.cellMinWidth = s.resize.minWidth, this.enabledViewAllLabel = s.enabledViewAllLabel === !0;
  }
  buildFields() {
    const e = this.gridMain.config(), t = this.opts, i = Cs(t.fields);
    e.fieldHeaderGroup = Wi();
    const s = this.buildAsideFields(t), n = s.length;
    e.dataInfo.asideLength = n, e.dataInfo.startCol = n;
    const r = n + e.fixedLeftIndex - 1;
    let o = e.fixedRightIndex < 1 ? 0 : n + e.fixedRightIndex;
    o = o > r + 1 ? o : 0, i.unshift(...s);
    let l = 0;
    for (const g of i)
      this.buildFieldGroup(g, 0, e.fieldHeaderGroup, r, o, `${l++}`);
    if (e.fieldHeaderGroup.depth = e.fieldHeaderGroup.center.length, e.currentFields = e.fieldHeaderGroup.leaf, e.fixedLeftIndex = r + 1, e.fixedRightIndex = o > e.currentFields.length ? 0 : o, e.dataInfo.colLength = e.currentFields.length, t.header.view === !1) return;
    const { height: c, heights: d } = ji(t.header.height), h = e.fieldHeaderGroup.depth;
    e.fieldHeaderGroup.heights = new Array(h);
    let u = 0;
    for (let g = 0; g < h; g++) {
      const f = d.length > g ? d[g] : 0, m = f > 0 ? f : c;
      u += m, e.fieldHeaderGroup.heights[g] = m;
    }
    e.dimensions.mainHeaderHeight = u;
  }
  /**
   * aside 옵션
   *
   * @param opts 옵션
   * @returns
   */
  buildAsideFields(e) {
    const t = [];
    return e.aside.lineNumber.enabled === !0 && t.push({
      field: G({}, e.aside.lineNumber, {
        name: ye,
        renderer: { type: "lineNumber" },
        $isAside: !0
      }),
      order: e.aside.lineNumber.order ?? 0
    }), e.aside.rowCheckbox.enabled === !0 && t.push({
      field: G({ width: Li }, e.aside.rowCheckbox, {
        name: mt,
        renderer: { type: "rowCheckbox" },
        $isAside: !0
      }),
      order: e.aside.rowCheckbox.order ?? 1
    }), e.body.rowMove?.enabled === !0 && e.body.rowMove?.enabledDragHandle !== !1 && t.push({
      field: G(
        {},
        {
          name: Yt,
          width: 32,
          renderer: { type: "rowDragHandle" },
          $isAside: !0
        }
      ),
      order: 2
      // Drag Handle의 기본 order
    }), e.aside.modifyInfo.enabled === !0 && t.push({
      field: G({}, e.aside.modifyInfo, {
        name: "$modifyInfo",
        renderer: { type: "modifyInfo" },
        $isAside: !0
      }),
      order: e.aside.modifyInfo.order ?? 2
    }), t.sort((i, s) => i.order - s.order).map((i) => i.field);
  }
  buildFieldGroup(e, t, i, s, n, r) {
    if (e.hidden)
      return e.$colspan = -1, e;
    const o = e.children;
    if (o && o.length > 0) {
      let l = 0, c = 0;
      for (const d of o)
        this.buildFieldGroup(
          d,
          t + 1,
          i,
          s,
          n,
          `${r}_${c++}`
          //  템플릿 리터럴 적용
        ), l += d.$colspan;
      e.$colspan = l;
    }
    if (e = this.initFieldMeta(e, t, r, i), B(i.left[t]) && (i.left[t] = []), B(i.center[t]) && (i.center[t] = []), B(i.right[t]) && (i.right[t] = []), e.$childLength > 0 && s > e.$resizeIdx - e.$colspan || e.$childLength < 1 && s >= e.$resizeIdx) {
      if (e.$colspan <= 1)
        i.left[t].push(e);
      else {
        const l = ot(e);
        if (l.$resizeIdx > s && (l.$colspan = s - (l.$resizeIdx - l.$colspan), l.$resizeIdx = s), i.left[t].push(l), s < e.$resizeIdx) {
          const c = ot(e);
          c.$colspan = e.$resizeIdx - s, i.center[t].push(c);
        }
      }
      e.$panel = "left", e.$isLeaf && i.leafLeft.push(e);
    }
    if (n > 0 && n <= e.$resizeIdx) {
      if (e.$colspan == 1)
        i.right[t].push(e);
      else {
        let l = e.$colspan;
        const c = e.$colspan - (e.$resizeIdx - n) - 1;
        if (n <= e.$resizeIdx && c > 0) {
          const h = ot(e);
          h.$colspan = c, h.$resizeIdx = n - 1, l = l - h.$colspan;
          const u = i.center[t].findIndex((g) => g.$uid === h.$uid);
          u > -1 ? i.center[t][u] = h : i.center[t].push(h);
        }
        const d = ot(e);
        d.$colspan = l, d.$resizeIdx = e.$resizeIdx, i.right[t].push(d);
      }
      e.$panel = "right", e.$isLeaf && i.leafRight.push(e);
    }
    return B(e.$panel) && (i.center[t].push(e), e.$panel = "center", e.$isLeaf && i.leafCenter.push(e)), e;
  }
  initFieldMeta(e, t, i, s) {
    const n = this.gridMain.config(), r = !B(e.headerHelp);
    !n.enabledHeaderHelpButton && r && (n.enabledHeaderHelpButton = !0), !n.enabledSortButton && e.sort && (n.enabledSortButton = !0);
    const o = e.children, l = F(o) ? o.length : 0;
    let c = !1;
    if (l < 1 ? (c = !0, e.$colspan = e.colspan ?? 1) : e.$colspan = e.$colspan ?? 1, e.$isLeaf = c, e.$resizeIdx = s.leaf.length - (c ? 0 : 1), e.$childLength = l, e.$rowspan = e.rowspan ?? 1, e.$depth = t, e.$uid = `${this.gridMain.uid()}_${e.$depth}_${i}`, e.$enabledHelp = r, c) {
      let d = J(e.width) ? e.width : this.cellMinWidth;
      this.enabledViewAllLabel && (d = Math.max(d, Gi(n, e.label, 20))), e.$isAside || (d = Math.max(d, this.cellMinWidth)), e = this.rendererFactory.createRenderer(e), e.$colSeq = s.leaf.length, e.width = d, e.$width = d, e.$alignStyle = X[e.align] ?? (e.$renderer?.alignStyle() || X.left), s.leaf.push(e), n.allFieldMap.set(e.name, e);
    }
    return e;
  }
}
function ot(a) {
  const e = {}, t = [
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
  for (const i of t)
    e[i] = a[i];
  return e;
}
class Rr {
  constructor(e, t) {
    this.opts = e, this.gridMain = t, this.cellMinWidth = e.header.resize.minWidth;
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
  setColumnWidth(e, t) {
    const i = this.gridMain.config(), s = i.currentFields[e];
    if (!s) return;
    i.isHeaderResize = !0;
    const { maxWidth: n } = this.gridMain.options().header.resize;
    let r = t;
    this.cellMinWidth !== -1 && (r = Math.max(r, this.cellMinWidth)), n !== -1 && (r = Math.min(r, n));
    const o = s.$width ?? s.width;
    r !== o && (s.$width = r, i.disableHorizontalScroll && this.normalizeDisabledHorizontalWidths(), this.gridMain.resizeDraw());
  }
  /**
   * disableHorizontalScroll 상태에서
   * 전체 일반 컬럼의 width를 dimensions.width에 맞게 설정
   *
   * @private
   */
  normalizeDisabledHorizontalWidths() {
    const e = this.gridMain.config(), { dimensions: t, currentFields: i } = e;
    if (t.width <= 0 || i.length === 0) return;
    const s = Ht(e);
    if (s <= 0) return;
    this.ensureAllMinimumWidths(i);
    let n = 0, r = 0;
    const o = [];
    for (const d of i) {
      const h = d.$width ?? d.width;
      d.$isAside ? (d.$width = h, n += h) : (o.push(d), r += h);
    }
    if (o.length === 0) return;
    const l = s - n;
    if (l <= 0) return;
    const c = l - r;
    c > 0 ? this.expandFields(o, c) : c < 0 && this.shrinkFields(o, -c);
  }
  /**
   * 컬럼 minWidth 체크
   *
   * @private
   * @param fields 컬럼 목록
   */
  ensureAllMinimumWidths(e) {
    const t = this.cellMinWidth;
    if (t !== -1)
      for (const i of e)
        i.$width = Math.max(i.$width ?? i.width, t);
  }
  /**
   * 컬럼의 width를 축소
   *
   * @private
   * @param fields width를 줄일 컬럼 목록
   * @param amount 줄여야 하는 전체 width
   */
  shrinkFields(e, t) {
    if (t <= 0 || e.length === 0) return;
    this.ensureAllMinimumWidths(e);
    const i = [...e].sort((o, l) => (l.$width ?? l.width) - (o.$width ?? o.width)), s = this.cellMinWidth, n = i.reduce(
      (o, l) => o + Math.max(0, (l.$width ?? l.width) - s),
      0
    );
    let r = Math.min(t, n);
    if (!(r <= 0))
      for (; r > 0; ) {
        const o = i.filter((c) => (c.$width ?? c.width) > s);
        if (o.length === 0) break;
        const l = Math.max(1, Math.floor(r / o.length));
        for (const c of o) {
          if (r <= 0) break;
          const d = c.$width ?? c.width, h = Math.min(d - s, l, r);
          h > 0 && (c.$width = d - h, r -= h);
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
  expandFields(e, t) {
    if (t <= 0 || e.length === 0) return;
    this.ensureAllMinimumWidths(e);
    const i = e.length, s = Math.floor(t / i), n = t % i;
    for (let r = 0; r < i; r++) {
      const o = e[r];
      o.$width = (o.$width ?? o.width) + s + (r < n ? 1 : 0);
    }
  }
  /**
   * 가로 스크롤 활성화 여부 체크
   *
   * @param fieldTotalWidth 모든 필드의 총 넓이
   */
  calculateHorizontalScroll(e) {
    const t = this.gridMain.config();
    if (t.disableHorizontalScroll) {
      t.scroll.enabledHorizontal = !1;
      return;
    }
    const i = Ht(t);
    t.scroll.enabledHorizontal = e > i;
  }
  /**
   * 각 필드의 최종 width를 계산하고
   * 좌/중앙/우측 패널별 width 및 레이아웃 치수를 계산
   *
   * @param fields 현재 그리드 필드
   * @param fieldTotalWidth 모든 필드의 총 width
   * @param isHeaderResize 헤더 resize 여부
   */
  distributeWidths(e, t, i) {
    const s = this.gridMain.config(), n = Ht(s);
    if (s.disableHorizontalScroll) {
      this.normalizeDisabledHorizontalWidths(), this.calculatePanelWidths(e, n);
      return;
    }
    const { remainderWidth: r, lastSpaceW: o, isAddSpaceWidth: l } = this.calculateFieldSpace(t, n);
    let c = o;
    for (const d of e) {
      if (d.$isAside) {
        d.$width = i ? d.$width : d.width;
        continue;
      }
      let h = i ? d.$width : d.width;
      if (!i && !this.opts.enabledWidthFixed) {
        if (h += r, c > 0) {
          const u = Math.min(c, 1);
          h += (l ? 1 : -1) * u, c -= u;
        }
        this.cellMinWidth !== -1 && (h = Math.max(h, this.cellMinWidth));
      }
      d.$width = h;
    }
    this.calculatePanelWidths(e, n);
  }
  /**
   * 좌/중앙/우측 패널 width 및 layout 치수를 계산
   *
   * @private
   */
  calculatePanelWidths(e, t) {
    const s = this.gridMain.config().dimensions;
    let n = 0, r = 0, o = 0;
    for (const l of e) {
      const c = l.$width ?? l.width;
      l.$panel === "left" ? n += c : l.$panel === "right" ? o += c : r += c;
    }
    s.mainLeftWidth = n, s.mainCenterWidth = r, s.mainRightWidth = o, s.mainTotalWidth = n + r + o, s.mainInsideWidth = t, s.mainCenterOverWidth = s.mainTotalWidth - s.mainInsideWidth, s.mainCenterViewWidth = s.mainInsideWidth - (n + o);
  }
  /**
   * 컬럼의 여분 넓이를 계산
   *
   * @param fieldTotalWidth 모든 필드의 총 width
   @param availableWidth 사용 가능한 width
   */
  calculateFieldSpace(e, t) {
    const i = this.gridMain.config(), { dataInfo: s, currentFields: n, scroll: r } = i;
    if (i.disableHorizontalScroll || r.enabledHorizontal)
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: !0 };
    const o = n.length - s.asideLength;
    if (o <= 0)
      return { remainderWidth: 0, lastSpaceW: 0, isAddSpaceWidth: !0 };
    const l = t - e, c = Math.abs(l);
    return {
      remainderWidth: (l < 0 ? -1 : 1) * Math.floor(c / o),
      lastSpaceW: c % o,
      // 곱셈/뺄셈 대신 나머지 연산(%) 활용
      isAddSpaceWidth: l >= 0
    };
  }
}
class hs {
  constructor(e) {
    this.gridMain = e;
  }
  /**
   * field renderer 생성
   *
   * @param {FieldItem} field field 정보
   * @returns {FieldItem} renderer 정보가 추가된 field
   */
  createRenderer(e) {
    if (e.$isAside)
      return e.$renderer = new tr[e.renderer.type](e, this.gridMain), e;
    const t = this.gridMain.config(), i = Lt(t, e);
    let s;
    return B(e.editRenderer) || (s = this.getEditRenderer(e, e.editRenderer, ""), e.$editRenderer = s, s.supportsInteraction() && (e.$renderer = s, e.renderer = G({}, wi, {
      type: e.editRenderer.type
    }))), e.$renderer || (e = this.getViewRenderer(e)), i && !e.$editRenderer && (e.$editRenderer = this.getEditRenderer(e, e.editRenderer, e.renderer.type)), e;
  }
  getViewRenderer(e) {
    let t = { type: "text" };
    St(e.renderer) ? t = G({}, e.renderer) : le(e.renderer) && (t = { type: e.renderer });
    const i = mi[t.type];
    return B(i) && (t.type = "text"), e.renderer = G({}, wi, t), e.$renderer = new mi[e.renderer.type](e, this.gridMain), e;
  }
  getEditRenderer(e, t, i) {
    le(t) && (t = { type: t }), (B(t) || B(t.type)) && (t = { type: i }), e.editRenderer = G({}, Gt, t);
    let s = "text";
    const n = t?.type;
    return n && ht[n] ? s = n : ht[i] && (s = i), new ht[s](e, this.gridMain);
  }
}
class Tr {
  constructor(e, t) {
    this.opts = e, this.gridMain = t, this.rendererFactory = new hs(t), this.fieldWidthCalculator = new Rr(e, t), this.dimensionCalculator = new br(e, t, this.fieldWidthCalculator), this.fieldBuilder = new Sr(e, t, this.rendererFactory);
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
  calculateBodyLayout(e, t) {
    this.dimensionCalculator.calculateBodyLayout(e, t);
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
  setColumnWidth(e, t) {
    this.fieldWidthCalculator.setColumnWidth(e, t);
  }
}
class Lr {
  constructor(e) {
    this.footerOpts = e.options().footer, this.gridMain = e, this._isActive = this.footerOpts?.enabled ?? !1, this._isActive && (this.selectionInfo = e.selectionInfo, this.cfg = this.gridMain.config(), this.isSelectionInfo = !B(this.footerOpts.selection));
  }
  /**
   * init footer event
   */
  init() {
    const e = this.gridMain.element().findDaraElement(".dg-footer");
    if (!this.isEnabled()) {
      e.getElement().remove();
      return;
    }
    this.footerElement = e, this.selectionStatusElement = e.findDaraElement(".dg-selection-status"), e.css({ height: `${this.cfg.dimensions.footerHeight}px` }), e.findDaraElement(".dg-status").addClass(Dt[this.footerOpts.selection?.position ?? "center"]), this.footerOpts.paging?.enabled && (this.paingElement = e.findDaraElement(".dg-paging"), this.pagingInfoElement = e.findDaraElement(".dg-paging-info"), this.paingElement.addClass(Dt[this.footerOpts.paging?.position ?? "center"]), this.pagingInfoElement.addClass(Dt[this.footerOpts.paging?.formatPosition ?? "center"]), this.setPagingTemplate(this.cfg.paging), this.initPagingEvent());
  }
  isEnabled() {
    return this._isActive;
  }
  /**
   * init paging event
   */
  initPagingEvent() {
    const e = this.footerOpts.paging?.callback, t = this.paingElement.getElement();
    this.cfg.eventManager.on({ el: t, type: "click", selector: ".dg-page-num" }, (i) => {
      const s = i.target.closest(".dg-page-num"), n = ue(s?.dataset.pageNo) ?? "1";
      return e ? e(n) : this.goPage(n, !0), !0;
    });
  }
  goPage(e, t = !0) {
    if (B(this.footerOpts.paging))
      throw new Error("Paging is not enabled");
    const i = this.cfg.paging;
    if (i.page = e, i.totalCount = i.totalCount > 0 ? i.totalCount : this.cfg.dataInfo.rowLength, i.totalCount < 1) {
      this.setPagingInfo({ totalCount: 0 }), this.paingElement.empty();
      return;
    }
    const s = ti(
      i.totalCount,
      i.page,
      i.pageSize,
      i.unitPage
    );
    this.setPagingTemplate(s);
    const n = s?.pageSize, r = (s?.page - 1) * n, o = ei(this.cfg.dataManager.getPagingViewItems(), r, r + n);
    this.cfg.dataManager.setViewItems(o), t && (this.gridMain.selectionInfo.setSelectionRangeInfo({}, !0), this.gridMain.getScroll().moveVerticalScroll({ rowIdx: 0 }), this.gridMain.refreshBody(t, "footer draw"));
  }
  /**
   * selection status info
   *
   * @public
   @param {*} dataInfo selection info
   */
  setSelectionStatus(e) {
    if (this.isSelectionInfo && this.footerOpts.enabled && this.footerOpts.selection?.showSummary) {
      const t = this.selectionInfo.selectionData("json", !0);
      if (!B(t) && t?.summary?.count > 1) {
        const i = this.footerOpts.selection?.format;
        let s = "";
        le(i) ? (t.summary.enabledSummary = t.summary.numFieldCount > 0, s = ci(i, t.summary)) : A(i) && (s = i(t)), this.selectionStatusElement.text(s);
      } else
        this.selectionStatusElement.text("");
    }
  }
  /**
   * set paging info
   *
   * @param pagingInfo paging info
   */
  setPagingInfo(e) {
    if (this.footerOpts.paging?.enabled) {
      const t = e.pageSize, i = (e.page - 1) * t, s = {
        start: i + 1,
        end: i + t,
        total: e.totalCount
      };
      if (s.end = s.end > e.totalCount ? e.totalCount : s.end, e.totalCount > 0) {
        const n = this.footerOpts.paging?.format;
        let r = "";
        le(n) ? r = ci(n, s) : A(n) && (r = n(s)), this.pagingInfoElement.text(r);
      } else
        this.pagingInfoElement.text("");
    }
  }
  /**
   * paging
   *
   * @public
   * @param {PagingInfo} pagingInfo paging info
   * @returns {this}
   */
  setPagingTemplate(e) {
    this.cfg.paging = e, this.setPagingInfo(e);
    let t = e.page;
    t == 0 && (t = 1);
    const i = e.prePage_is, s = e.currStartPage;
    let n = e.currEndPage;
    n == 0 && (n = 1);
    const r = 1 * t + 1, o = t - 1, l = [];
    l.push("<ul >"), t <= 1 ? l.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>') : l.push(
      ' <li><a href="javascript:" class="dg-page-num page-icon" data-page-no="' + o + '">&laquo;</a></li>'
    ), i && n - e.unitPage >= 0 && l.push(' <li class="dg-page-num" data-page-no="1"><a href="javascript:" >1...</a></li>');
    let c = 0;
    for (c = s * 1; c <= n * 1; c++)
      c == t ? l.push(' <li class="active"><a href="javascript:">' + c + "</a></li>") : l.push(' <li class="dg-page-num" data-page-no="' + c + '"><a href="javascript:" >' + c + "</a></li>");
    s + e.unitPage < e.totalPages && l.push(
      S`<li class="dg-page-num" data-page-no="${e.totalPages}">...<a href="javascript:">${e.totalPages}</a></li>`
    ), t == n ? l.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>') : l.push(` <li><a href="javascript:" class="dg-page-num page-icon" data-page-no="${r}">&raquo;</a></li>`), l.push("</ul>"), this.paingElement.html(l.join(""));
  }
}
const Mi = 300;
class qt {
  constructor(e = Mi) {
    this.lastClickTime = 0, this.clickCount = 0, this.clickDelay = e, this.resetClick();
  }
  getClickCount() {
    return this.clickCount;
  }
  resetClick() {
    this.clickCount = 0, this.currentPointerPosition = { x: 0, y: 0, clientX: 0, clientY: 0 };
  }
  conserveClick(e) {
    this.currentPointerPosition = e, this.clickCount = 1, clearTimeout(this.clickTimer), this.clickTimer = setTimeout(() => this.resetClick(), this.clickDelay);
  }
  processClick(e, t) {
    const i = Date.now();
    if (i - this.lastClickTime < Mi && this.clickCount++, this.lastClickTime = i, this.clickCount === 2 && !gt(e.startPos, this.currentPointerPosition, 5)) {
      t.onDoubleClick?.(e), this.resetClick();
      return;
    }
    this.conserveClick(e.startPos), t.onClick?.(e);
  }
}
class ni {
  constructor(e) {
    this.priority = 0, this.context = e, this.cfg = e.gridMain.config(), this.opts = e.gridMain.options();
  }
  canHandle(e) {
    return !0;
  }
}
class us extends ni {
  constructor(e, t) {
    super(e), this.priority = 5, this.bodyDragDelay = 150, this.moveRange = { endIdx: -1, endCol: -1 }, this.beforeEndIdx = -1, this.beforeEndCol = -1, this.scrollDirectionX = null, this.scrollDirectionY = null, this.dragAnimationId = 0, this.lastScrollTime = 0, this.selectionInfo = e.gridMain.selectionInfo, this.bodyElement = e.body?.getBodyElement().getElement(), this.selectionMode = this.opts.selectionMode, this.multipleFlag = ii(this.selectionMode), this.cellClickFn = this.opts.body.cellClick;
    const { rowHeight: i, enabledCellEdit: s } = this.cfg;
    this.rowHeight = i, this.cellDblClick = this.opts.body.cellDblClick, this.isCellDbClickEvent = s || A(this.cellDblClick);
  }
  onPointerDown(e) {
    this.cellElement = e.cellEl, this.startCellInfo = e.cellInfo, this.currentSelectionMode = this.selectionMode, this.startCellInfo.rowIndex > -1 && (this.cfg.searchMatchInfo.rowIndex = this.startCellInfo.rowIndex), this.multipleFlag && e.cellInfo?.field.name == ye && (this.currentSelectionMode = oe.multiRow);
  }
  onActivate(e) {
    const t = this.cfg, i = ie(this.bodyElement, !0), { mainLeftWidth: s, mainInsideWidth: n, mainRightWidth: r, mainBodyHeight: o } = t.dimensions;
    this.gridBounds = {
      gridLeft: i.left,
      gridRight: i.left + t.dimensions.mainTotalWidth,
      mainLeft: i.left + s,
      mainRight: i.left + n - r,
      top: i.top,
      bottom: i.top + o
    }, this.bodyPosition = i, this.scrollDirectionX = null, this.scrollDirectionY = null, this.beforeEndIdx = -1, this.beforeEndCol = -1;
  }
  onPointerMove(e) {
    if (!this.multipleFlag) return;
    const t = this.cfg, i = this.gridBounds, { x: s, y: n } = e.currentPos, r = this.moveRange;
    r.endCol = -1, r.endIdx = -1;
    let o = !1;
    const l = qi(
      t,
      s,
      this.bodyPosition.left,
      i.mainLeft,
      i.mainRight
    );
    l.overCell > -1 && (o = !0, r.endCol = this.selectionInfo.getSelectionModeColInfo(
      this.currentSelectionMode,
      l.overCell,
      t,
      this.cellElement,
      t.selection.isMouseDown
    ).endCol);
    const c = Ui(t, n, this.rowHeight, this.startCellInfo, i.top, i.bottom);
    c.rowIdx > -1 && (o = !0, r.endIdx = c.rowIdx), this.scrollDirectionX = l.scrollDirectionX, this.scrollDirectionY = c.scrollDirectionY, !(this.beforeEndIdx === r.endIdx && this.beforeEndCol === r.endCol) && (o && this.selectionInfo.setSelectionRangeInfo(
      { range: r },
      !1,
      this.scrollDirectionX === null && this.scrollDirectionY === null
    ), this.beforeEndCol = r.endCol ?? -1, this.beforeEndIdx = r.endIdx ?? -1, (this.scrollDirectionX || this.scrollDirectionY) && this.dragAnimationId === 0 && this.startAutoScroll());
  }
  startAutoScroll(e = !0) {
    if (this.dragAnimationId) return;
    this.lastScrollTime = 0;
    const t = this.cfg, i = { col: -1, rowIdx: -1 }, n = this.context.gridMain.getScroll(), r = this.context.gridMain.getBody(), o = (l) => {
      const c = this.scrollDirectionX, d = this.scrollDirectionY;
      if (c === null && d === null) {
        this.stopAutoScroll();
        return;
      }
      if (l - this.lastScrollTime < this.bodyDragDelay) {
        this.dragAnimationId = requestAnimationFrame(o);
        return;
      }
      this.lastScrollTime = l;
      let h = !1;
      const u = {};
      if (c !== null) {
        const g = c === O.RIGHT, f = g ? t.scroll.insideEndCol + 3 : t.scroll.insideStartCol - 3;
        i.col !== f && ((g && t.fixedRightIndex === 0 || !g && t.fixedLeftIndex === 0) && (u.endCol = f), n.moveHorizontalScroll({ direction: c, colIdx: f, drawFlag: !1 }), i.col = f, h = !0);
      }
      if (d !== null) {
        const g = d === ee.DOWN ? t.scroll.startIdx + t.scroll.insideViewRow + 1 : t.scroll.startIdx - 1;
        i.rowIdx !== g && (u.endIdx = g, n.moveVerticalScroll({ direction: d, drawFlag: !1 }), i.rowIdx = g, h = !0);
      }
      h && (e && this.selectionInfo.setSelectionRangeInfo({ range: u }, !1, !1), r.dataDraw("dragscroll")), this.dragAnimationId = requestAnimationFrame(o);
    };
    this.dragAnimationId = requestAnimationFrame(o);
  }
  /** 드래그 자동 스크롤이 남아 있으면 멈춘다. */
  destroy() {
    this.stopAutoScroll();
  }
  stopAutoScroll() {
    this.dragAnimationId !== 0 && (cancelAnimationFrame(this.dragAnimationId), this.dragAnimationId = 0);
  }
  onPointerUp(e) {
    this.stopAutoScroll();
  }
  onClick(e) {
    const t = !!this.startCellInfo?.viewItem?.groupRowType;
    this.selectionMode != oe.none && this.setCellClick(
      e.event,
      this.startCellInfo,
      this.multipleFlag,
      this.currentSelectionMode,
      this.cellElement
    ), t || this.cellClickFn?.(this.startCellInfo);
  }
  onDoubleClick(e) {
    if (!this.isCellDbClickEvent) return;
    const t = e.cellInfo;
    if (t.viewItem?.groupRowType) return;
    const i = t.field;
    if (this.cellDblClick && this.cellDblClick(this.startCellInfo), !i.$isAside && Lt(this.cfg, i)) {
      setTimeout(() => {
        i.$editRenderer.render(t, e.cellEl);
      }, 10);
      return;
    }
  }
  setCellClick(e, t, i, s, n) {
    const r = this.context, o = r.gridMain.config(), l = r.gridMain;
    t.field.renderer.type == "dropdown" && t.c == +o.activeComponent || l.hideLayer();
    const c = t.rowIndex, d = t.c;
    !Pe(o, d) && !Be(o, d) && (d < o.scroll.insideStartCol ? l.getScroll().moveHorizontalScroll({ direction: O.LEFT, colIdx: d }) : d > o.scroll.insideEndCol && l.getScroll().moveHorizontalScroll({ direction: O.RIGHT, colIdx: d }));
    const h = (Oe(e) ? 2 : 0) + (It(e) ? 1 : 0), u = this.selectionInfo.getSelectionModeColInfo(
      s,
      d,
      o,
      n,
      i && h == 2
    );
    (i && h != 2 || !i) && l.selectionInfo.removeStartAnchorCell();
    const g = Qe(s) ? "row" : "cell";
    if (i && h >= 2) {
      const f = { endIdx: c, endCol: u.endCol, modifierKey: 2 };
      u.startCol > -1 && (f.startCol = u.startCol), f.type = g, this.selectionInfo.setSelectionRangeInfo(
        {
          range: f,
          isMouseDown: !0
        },
        !1,
        !0
      );
    } else i && h == 1 ? this.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: g,
          startIdx: c,
          endIdx: c,
          startCol: u.startCol,
          endCol: u.endCol,
          modifierKey: 1
        },
        isSelect: !0,
        isMouseDown: !0,
        startCell: { startIdx: c, startCol: u.startCol }
      },
      !1,
      !0
    ) : this.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: g,
          startIdx: c,
          endIdx: c,
          startCol: u.startCol,
          endCol: u.endCol
        },
        isSelect: !0,
        isMouseDown: !0,
        startCell: { startIdx: c, startCol: d }
      },
      !0,
      !0
    );
    window.getSelection()?.removeAllRanges();
  }
}
class Vr {
  constructor(e, t, i) {
    this.pendingScroll = null, this.scrollRafId = null, this.gridMain = e, this.body = t, this.selectionInfo = i;
  }
  /**
   * keydown event
   */
  init() {
    this.pasteElement = new Ie(this.gridMain.element().find(".dg-paste-area"));
    const e = this.gridMain.config(), t = this.gridMain.options(), i = t.selectionMode, s = ii(i), n = t.search.enabled, r = this.pasteElement.getElement(), o = this.gridMain.getGridKeyInputElement();
    e.eventManager.off(o, "keydown"), e.eventManager.on(
      {
        el: o,
        type: "keydown"
      },
      (l) => {
        if (this.gridMain.hideLayer(), Pi(l))
          return;
        const c = js(l);
        if (It(l)) {
          if (c === "KeyC") {
            if (i === "none")
              return;
            this.body.copyData();
            return;
          }
          if (c === "KeyA")
            return s && this.selectionInfo.setAllSelection(!0), !1;
          if (c === "KeyV")
            return r.focus(), requestAnimationFrame(() => {
              this.gridMain.setGridFocusIn();
            }), !0;
          if (c === "KeyF")
            return $(l), n && this.gridMain.getDataSearch().openSearch(), !0;
          if (c === "KeyZ")
            return $(l), l.shiftKey ? e.dataManager.redo() : e.dataManager.undo(), !0;
          if (c === "KeyY")
            return $(l), e.dataManager.redo(), !0;
        }
        if (this.isNavigationKey(c)) {
          $(l), this.selectionInfo.setAllSelection(!1), this.arrowKeydownEvent(l, c);
          return;
        }
        const d = e.selection.startCell, h = e.currentFields[d.startCol];
        if (!h)
          return;
        const u = qs(l);
        if (u && ($(l), h.renderer.type === "tree")) {
          const g = this.gridMain.getBody().getStartCellElement(), f = me(e, g);
          if (h.$renderer.bindEvents("space", f, g))
            return !0;
        }
        if (Lt(e, h) && (u || c.startsWith("Key") || c.startsWith("Digit"))) {
          this.insideScrollCheck(c, l, e.scroll, d.startIdx, d.startCol);
          const g = this.gridMain.getBody().getStartCellElement(), f = me(e, g);
          u || (f.inputValue = ""), h.$editRenderer.render(f, g);
          return;
        }
      }
    );
  }
  /**
   * navigation key 여부
   */
  isNavigationKey(e) {
    return e.startsWith("Arrow") || e === "Home" || e === "End" || e === "PageUp" || e === "PageDown" || e === "Enter" || e === "Tab";
  }
  /**
   * 방향키 navigation
   */
  arrowKeydownEvent(e, t) {
    const i = this.gridMain.config(), s = i.scroll, n = i.dataInfo, r = i.selection.startCell;
    this.selectionInfo.removeStartAnchorCell();
    const o = r.startIdx, l = r.startCol, c = Math.max(s.insideViewRow - 1, 0), d = n.startCol, h = It(e);
    switch (t) {
      //Down
      case "PageDown":
      case "Enter":
      case "ArrowDown": {
        const u = this.getDownRowIndex(t, h, o, c, n.rowLength);
        if (this.insideScrollCheck(t, e, s, u, l))
          return;
        u >= s.startIdx + c && this.scheduleVerticalScroll(u - c, ee.DOWN);
        return;
      }
      //Up
      case "PageUp":
      case "ArrowUp": {
        const u = this.getUpRowIndex(t, h, o, c);
        if (this.insideScrollCheck(t, e, s, u, l))
          return;
        u < s.startIdx && this.scheduleVerticalScroll(u, ee.UP);
        return;
      }
      //Left
      case "Home":
      case "ArrowLeft": {
        const u = this.getLeftColumnIndex(t, h, l, d);
        if (this.insideScrollCheck(t, e, s, o, u))
          return;
        !Pe(i, u) && u < s.insideStartCol && this.scheduleHorizontalScroll(u, O.LEFT);
        return;
      }
      //Right
      case "End":
      case "Tab":
      case "ArrowRight": {
        const u = this.getRightColumnIndex(t, h, l, n.colLength);
        if (this.insideScrollCheck(t, e, s, o, u))
          return;
        !Be(i, u) && u > s.insideEndCol && this.scheduleHorizontalScroll(u, O.RIGHT);
        return;
      }
      default:
        return;
    }
  }
  /**
   * Down row index
   */
  getDownRowIndex(e, t, i, s, n) {
    return e === "ArrowDown" && t ? Math.max(n - 1, 0) : Math.min(i + (e === "PageDown" ? s : 1), Math.max(n - 1, 0));
  }
  /**
   * Up row index
   */
  getUpRowIndex(e, t, i, s) {
    return e === "ArrowUp" && t ? 0 : Math.max(i - (e === "PageUp" ? s : 1), 0);
  }
  /**
   * Left column index
   */
  getLeftColumnIndex(e, t, i, s) {
    return e === "ArrowLeft" && t || e === "Home" ? s : Math.max(i - 1, s);
  }
  /**
   * Right column index
   */
  getRightColumnIndex(e, t, i, s) {
    const n = Math.max(s - 1, 0);
    return e === "ArrowRight" && t || e === "End" ? n : Math.min(i + 1, n);
  }
  /**
   * 현재 이동 위치가 viewport 밖인지 확인
   */
  insideScrollCheck(e, t, i, s, n) {
    const r = this.gridMain.config(), l = this.gridMain.options().body.keyNavHandler;
    if (A(l)) {
      const u = r.dataManager, f = u.getViewItems()[s], m = f ? u.getRowItem(f.id) : void 0;
      if (l({
        code: e,
        moveCol: n,
        moveRow: s,
        item: m,
        evt: t
      }) === !1)
        return !0;
    }
    this.selectionInfo.setRangeInfo(e, t, s, n);
    const c = Xi(r, i, s, n);
    if (c <= 0)
      return !1;
    const d = Math.floor(c / 10), h = c % 10;
    if (d > 0) {
      const u = d === 1 ? O.LEFT : O.RIGHT;
      this.scheduleHorizontalScroll(n, u);
    }
    if (h > 0) {
      const u = h === 1 ? ee.DOWN : ee.UP, g = s - (h === 1 ? 0 : Math.max(i.insideViewRow - 1, 0));
      this.scheduleVerticalScroll(g, u);
    }
    return !0;
  }
  /**
   * Vertical scroll cache
   */
  scheduleVerticalScroll(e, t) {
    this.pendingScroll || (this.pendingScroll = {}), this.pendingScroll.vertical = {
      rowIdx: e,
      direction: t
    }, this.pendingScroll.horizontal && (this.pendingScroll.horizontal = {
      ...this.pendingScroll.horizontal
    }), this.scheduleScrollFrame();
  }
  /**
   * Horizontal scroll cache
   */
  scheduleHorizontalScroll(e, t) {
    this.pendingScroll || (this.pendingScroll = {}), this.pendingScroll.horizontal = {
      colIdx: e,
      direction: t
    }, this.scheduleScrollFrame();
  }
  /**
   * scroll 실행
   */
  scheduleScrollFrame() {
    this.scrollRafId === null && (this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      const e = this.pendingScroll;
      if (this.pendingScroll = null, !e)
        return;
      const t = this.gridMain.getScroll(), i = e.horizontal, s = e.vertical;
      i && t.moveHorizontalScroll({
        direction: i.direction,
        colIdx: i.colIdx,
        drawFlag: !s
      }), s && t.moveVerticalScroll({
        rowIdx: s.rowIdx,
        direction: s.direction
      });
    }));
  }
  destroy() {
    this.scrollRafId !== null && (cancelAnimationFrame(this.scrollRafId), this.scrollRafId = null), this.pendingScroll = null;
  }
}
class Ar {
  constructor(e, t) {
    this.gridMain = e, this.selectionInfo = t;
  }
  /**
   * init paste event
   */
  init() {
    this.pasteElement = new Ie(this.gridMain.element().find(".dg-paste-area"));
    const e = this.gridMain.config(), t = this.gridMain.options(), i = t.body.pasteBefore, s = A(i), n = t.body.pasteAfter, r = A(n), o = this.pasteElement.getElement();
    e.eventManager.on(
      {
        el: o,
        type: "paste"
      },
      (l) => {
        this.gridMain.setGridFocusIn();
        const c = l.clipboardData;
        if (!c)
          throw new Error("paste clipboard not found");
        let d = c.getData("text");
        if (s && (d = i(d)), !d)
          return;
        const h = Es(d), u = e.selection.startCell, { currentFields: g, dataInfo: f, dataManager: m } = e, p = u.startIdx, y = u.startCol, I = g.length;
        let w = f.rowLength, v = y, x = m.getViewItems(), C = !1, T = p, L = !1;
        m.beginHistory();
        try {
          if (p + h.length > w) {
            const E = p + h.length - w;
            for (let M = 0; M < E; M++)
              m.createItem({});
            x = m.getViewItems(), w = x.length, L = !0;
          }
          e: for (let E = 0; E < h.length; E++) {
            const M = p + E;
            if (M >= w)
              break;
            T = M;
            const N = x[M];
            if (N.groupRowType)
              continue;
            const H = h[E], de = m.getRowItem(N.id);
            if (de)
              for (let _ = 0; _ < H.length; _++) {
                const D = y + _;
                if (D >= I)
                  continue;
                v = Math.max(v, D);
                let q = H[_];
                if (q.startsWith('"') && q.endsWith('"') && (q = q.slice(1, -1).replace(/""/g, '"')), /^=/.test(q) && (q = `'${q}`), g[D].$editRenderer?.setValue(l, de, q, !1) === !1) {
                  C = !0;
                  break e;
                }
              }
          }
          this.gridMain.refreshBody(L, "paste"), this.selectionInfo.setSelectionRangeInfo(
            {
              range: {
                startIdx: p,
                endIdx: C ? T : p + h.length - 1,
                startCol: y,
                endCol: v
              },
              startCell: u
            },
            !0,
            !1
          ), m.commitHistory();
        } catch (E) {
          throw m.rollbackHistory(), E;
        }
        if (this.gridMain.getBody().dataDraw("reDraw_paste"), C)
          return !1;
        r && n(d);
      }
    );
  }
}
class bi extends us {
  constructor(e, t) {
    super(e, t), this.priority = 10, this.ROW_DRAG_RATIO = 2, this.dropRowIdx = -1, this.moveRowIndexs = [], this.moveViewItems = [], this.isDropForbidden = !0, this.isMoveRowSequential = !1, this.language = e.gridMain.i18n(), this.rowMoveOptions = this.opts.body.rowMove, this.isSelectionRowMode = Qe(this.selectionMode), this.rowMoveDropHelperElement = e.gridMain.element().findDaraElement(".dg-drop-indicator").getElement(), this.initTemplate();
  }
  initTemplate() {
    const e = document.createElement("div");
    e.className = "dg-row-move-helper", e.style.cssText = `height: ${this.rowHeight}px; display: none;`;
    const t = document.createElement("div");
    t.className = "dg-row-move-status dg-icon", e.appendChild(t);
    const i = document.createElement("div");
    i.className = "dg-row-move-content", e.appendChild(i), document.querySelector(Zt)?.appendChild(e), this.rowMoveElement = e;
  }
  canHandle(e) {
    const t = e.cellInfo;
    if (t.viewItem?.groupRowType)
      return !1;
    const i = this.rowMoveOptions, s = t.field?.name, n = i?.dragHandle;
    return n !== "ALL" && n !== s && !(i?.enabledDragHandle !== !1 && s === Yt) ? !1 : (this.moveRowIndexs.length = 0, this.moveViewItems.length = 0, this.dropRowIdx = -1, this.scrollDirectionX = null, this.scrollDirectionY = null, this.isDropForbidden = !0, !0);
  }
  /** 숨김 컨테이너에 붙여 둔 드래그 도우미 요소를 제거한다. */
  destroy() {
    super.destroy(), this.rowMoveElement?.remove();
  }
  onClick(e) {
  }
  onActivate(e) {
    const t = this.cfg, i = this.opts, s = e.cellInfo, n = i.body.rowMove, r = this.cfg.selection.allRange, o = [];
    if (r.size > 0) {
      const p = s.field.$colSeq;
      if (this.isSelectionRowMode) {
        const { colLength: y, startCol: I } = this.cfg.dataInfo, w = y - 1;
        for (const [v, x] of r) {
          const { minIdx: C, maxIdx: T } = x;
          if (x.minCol == I && w == x.maxCol)
            for (let L = C; L <= T; L++)
              if (x.mode == "remove") {
                const E = o.indexOf(L);
                E !== -1 && o.splice(E, 1);
              } else
                o.push(L);
          else {
            o.length = 0;
            break;
          }
        }
      } else if (p > -1)
        for (const [y, I] of r) {
          const { minIdx: w, maxIdx: v } = I;
          let x = !1;
          for (let C = w; C <= v; C++)
            if (this.selectionInfo.isCellSelection(I, C, p))
              if (I.mode == "remove") {
                const T = o.indexOf(C);
                T !== -1 && o.splice(T, 1);
              } else
                o.push(C);
            else
              x = !0;
          if (x) {
            o.length = 0;
            break;
          }
        }
    }
    const l = [];
    if (o.length > 0) {
      const p = t.dataManager.getViewItems();
      if (o.includes(s.rowIndex)) {
        o.sort((y, I) => y - I);
        for (const y of o)
          l.push(t.dataManager.getRowItem(p[y].id));
      } else
        o.length = 0;
    }
    if (o.length < 1 && (this.setCellClick(e.event, this.startCellInfo, this.multipleFlag, this.selectionMode, e.cellEl), o.push(s.rowIndex), l.push(s.item)), n?.dragStart?.({ moveItems: l }) === !1)
      return !1;
    this.moveRowIndexs = o, this.moveViewItems = l, this.isMoveRowSequential = un(o), this.moveStartItem = s;
    const c = ie(this.context.gridMain.getBody().getBodyElement().getElement(), !0), { mainLeftWidth: d, mainInsideWidth: h, mainRightWidth: u, mainBodyHeight: g } = t.dimensions;
    this.gridBounds = {
      gridLeft: c.left,
      gridRight: c.left + t.dimensions.mainTotalWidth,
      mainLeft: c.left + d,
      mainRight: c.left + h - u,
      top: c.top,
      bottom: c.top + g
    }, this.bodyPosition = c;
    const f = n?.dragTemplate?.({ moveItems: this.moveViewItems }), m = this.rowMoveElement.querySelector(".dg-row-move-content");
    f ? $e(m, f) : m.textContent = `${this.moveViewItems.length} ${this.language.getMessage("row")}`, this.rowMoveElement.style.display = "flex";
  }
  /** move 중 */
  onPointerMove(e) {
    if (e.state != Me.DRAGGING) return;
    const t = this.cfg, i = this.gridBounds, { x: s, y: n } = e.currentPos;
    this.rowMoveElement.style.transform = `translate(${s}px, ${n}px)`;
    const r = this.rowMoveDropHelperElement;
    if (s < i.gridLeft - 3 || s > i.gridRight + 3 || n < i.top - 30 || n > i.bottom + 30) {
      this.stopAutoScroll(), this.preventDrop();
      return;
    }
    const o = this.rowHeight, l = Ui(
      t,
      n,
      o,
      this.startCellInfo,
      i.top,
      i.bottom
    );
    this.scrollDirectionY = l.scrollDirectionY, this.scrollDirectionY && this.dragAnimationId === 0 && this.startAutoScroll(!1);
    const c = l.viewRowIdx, h = n - this.bodyPosition.top - c * o, u = h < o / this.ROW_DRAG_RATIO, g = o - h < o / this.ROW_DRAG_RATIO;
    let f = this.dropRowIdx === -1 ? c : l.rowIdx - t.scroll.startIdx;
    u ? f = c : g && (f = c + 1), f = Math.max(0, Math.min(f, t.scroll.insideViewRow));
    const m = t.scroll.startIdx + f;
    if (this.dropRowIdx === m)
      return;
    const p = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    p.remove("dg-drop-invalid"), p.add("dg-drop-valid"), this.isDropForbidden = !1;
    const y = this.moveRowIndexs;
    if (this.isMoveRowSequential && (y.includes(m) || y[y.length - 1] < m && y.includes(m - 1))) {
      this.preventDrop();
      return;
    }
    this.dropRowIdx = m, r.style.transform = `translateY(${f * o}px)`, r.style.display = "block";
    const I = this.moveStartItem;
    let w = _e.BEFORE, v = m;
    I.rowIndex < m && (w = _e.AFTER, v = m - 1), this.rowMoveOptions.dragOver?.({
      moveItems: this.moveViewItems,
      dropItemIdx: v,
      position: w
    }) === !1 && this.preventDrop();
  }
  /**
   * drop 금지 시, 드롭 위치에 X 표시, 허용 시 O 표시
   */
  preventDrop() {
    const e = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    e.remove("dg-drop-valid"), e.add("dg-drop-invalid"), this.isDropForbidden = !0, this.rowMoveDropHelperElement.style.display = "none";
  }
  onPointerUp(e) {
    this.stopAutoScroll();
    let t = this.dropRowIdx;
    if (this.rowMoveDropHelperElement.style.display = "none", this.rowMoveElement.style.display = "none", this.isDropForbidden || t === -1) {
      !this.cfg.isBodyDragging && e.clickManager.getClickCount() === 1 && this.setCellClick(e.event, this.startCellInfo, this.multipleFlag, this.selectionMode, e.cellEl);
      return;
    }
    const i = this.cfg, s = this.rowMoveOptions, n = this.moveViewItems, r = this.moveStartItem;
    let o = _e.BEFORE;
    if (r.rowIndex < t && (o = _e.AFTER), s?.drop?.({
      moveItems: n,
      dropItemIdx: o == _e.AFTER ? t - 1 : t,
      position: o
    }) === !1)
      return;
    const l = this.moveRowIndexs, c = i.dataManager.getViewItems();
    for (let f = l.length - 1; f >= 0; f--) {
      const m = l[f];
      t > m && --t, c.splice(m, 1);
    }
    const d = this.moveViewItems.map((f) => ({ id: f[R.ID] }));
    c.splice(t, 0, ...d), i.dataManager.applyMovedOrder(c) || i.dataManager.setViewItems(c);
    let h = i.dataInfo.startCol, u = i.dataInfo.colLength - 1;
    nn(this.selectionMode) && (h = i.selection.range.startCol, u = h);
    const g = {
      startIdx: t,
      startCol: h,
      endCol: u,
      endIdx: t + l.length - 1
    };
    this.selectionInfo.setSelectionRangeInfo(
      {
        range: g
      },
      !0,
      !0
    ), this.context.gridMain.getBody().dataDraw("dragmove_redraw"), s?.dragEnd?.({ moveItems: n, dropItemIdx: t, position: o });
  }
}
class Dr {
  constructor(e, t, i) {
    this.gridMain = e, this.body = t, this.selectionInfo = i, this.bodyElement = t.getBodyElement(), this.handlers = [], e.options().body.rowMove?.enabled === !0 && this.handlers.push(new bi({ gridMain: e, body: t }, this)), this.handlers.push(new us({ gridMain: e, body: t }, this));
  }
  init() {
    this.initMouseOver(), this.initPointerEvent(), this.initMobileTouch();
    const e = this.gridMain.options();
    this.gridMain.config().enabledCellEdit === !0 && new Ar(this.gridMain, this.selectionInfo).init(), e.body.disableKeydown !== !0 && e.selectionMode !== oe.none && new Vr(this.gridMain, this.body, this.selectionInfo).init();
  }
  /**
   * init mobile touch event
   */
  initMobileTouch() {
    const e = this.gridMain.config(), { scroll: t, rowHeight: i, dataInfo: s, eventManager: n } = e, r = this.gridMain.options(), o = this.gridMain.getScroll(), l = this.gridMain.getMainElement().getElement().querySelector(".dg-body");
    let c, d, h;
    n.off(l, "touchstart"), n.on(
      { el: l, type: "touchstart" },
      (u) => {
        d = u.touches[0].clientX, h = u.touches[0].clientY;
      },
      { passive: !0 }
    ), n.off(l, "touchmove touchend touchcancel"), n.on(
      { el: l, type: "touchmove" },
      (u) => {
        const g = u.touches[0].clientX, f = u.touches[0].clientY, m = d - g, p = h - f;
        if (!e.isMoveRow) {
          if (t.enabledHorizontal && Math.abs(m) > Math.abs(p)) {
            const y = m > 0;
            if (cancelAnimationFrame(c), y && t.left != 0 || !y && t.left != t.hTrackWidth - t.hThumbWidth)
              $(u);
            else {
              c = 0;
              return;
            }
            c = requestAnimationFrame(() => {
              o.moveHorizontalScroll({
                direction: y ? O.LEFT : O.RIGHT,
                speed: r.scroll.horizontal.speed
              });
            });
          } else if (t.enabledVertical) {
            const y = t.startIdx, I = p < 0;
            if (cancelAnimationFrame(c), I && y !== 0 || !I && y + t.insideViewRow < s.rowLength)
              u.cancelable && $(u);
            else {
              c = 0;
              return;
            }
            c = requestAnimationFrame(() => {
              const w = Math.abs(p) / i, v = Math.ceil(s.rowLength / t.viewRow);
              o.moveVerticalScroll({
                direction: I ? ee.UP : ee.DOWN,
                speed: v < 2 ? 1 : r.scroll.vertical.speed * w
              });
            });
          }
          d = g, h = f;
        }
      },
      { passive: !1 }
    ), n.on({ el: l, type: "touchend touchcancel" }, () => {
      cancelAnimationFrame(c), c = 0;
    });
  }
  initMouseOver() {
    if (this.gridMain.options().hoverMode !== "row")
      return;
    const e = this.gridMain.config(), t = this.bodyElement.getElement(), i = e.eventManager, s = "dg-row-hover";
    i.on(
      { el: t, selector: ".dg-row", type: "mouseover.cell" },
      (n, r) => {
        const o = r.dataset.row;
        Te(t.querySelectorAll(`.dg-row[data-row="${o}"]`), s);
      }
    ), i.on(
      { el: t, selector: ".dg-row", type: "mouseout.cell" },
      (n, r) => {
        if (!r) return;
        const o = r.dataset.row;
        ce(t.querySelectorAll(`.dg-row[data-row="${o}"]`), s);
      }
    );
  }
  /**
   * init pointer event
   * cell click , cell drag, row move event
   */
  initPointerEvent() {
    const e = this.gridMain.config(), t = this.bodyElement.getElement(), i = e.eventManager;
    let s;
    const n = e.enabledCellEdit, r = new qt(), o = $t, l = () => {
      i.off(
        document,
        "touchmove.cellclick mousemove.cellclick touchend.cellclick touchcancel.cellclick mouseup.cellclick"
      ), e.isBodyDragging = !1, e.isMoveRow = !1;
    };
    i.on(
      { el: t, selector: ".dg-cell", type: "mousedown.cellclick touchstart.cellclick" },
      (c) => {
        if (!vt(c))
          return !0;
        const d = c.target;
        if (d.closest("a")) return;
        if (hn(d.tagName))
          return !0;
        const h = d.closest(".dg-cell");
        if (h == null) {
          this.gridMain.hideLayer();
          return;
        }
        const u = me(e, h);
        if (u.field.$isAside && u.field.name !== ye && u.field.name !== Yt) {
          this.gridMain.hideLayer();
          return;
        }
        u.c = Math.max(u.c, e.dataInfo.startCol), s = Bt(c, u, r, h);
        let g = -1;
        for (const m of this.handlers)
          if (m.canHandle(s)) {
            if (g > m.priority)
              continue;
            g = m.priority, s.handler = m;
          }
        const f = s.handler;
        if (f) {
          if (f instanceof bi && (c.preventDefault(), e.isMoveRow = !0), f.onPointerDown?.(s), f.onPointerMove) {
            let m = !1;
            i.on({ el: document, type: "touchmove.cellclick mousemove.cellclick" }, (p) => {
              if (s.currentPos = se(p), !m) {
                if (!gt(s.startPos, s.currentPos, o))
                  return;
                if (m = !0, e.isBodyDragging = !0, f.onActivate?.(s) === !1) {
                  l();
                  return;
                }
              }
              s.state = Me.DRAGGING, f.onPointerMove?.(s);
            }), i.on(
              { el: document, type: "touchend.cellclick touchcancel.cellclick mouseup.cellclick" },
              (p) => {
                l(), s.state = Me.IDLE, s.currentPos = se(p), f.onPointerUp?.(s), e.isBodyDragging = !1, e.isMoveRow = !1;
              }
            );
          }
          n === !0 && r.getClickCount() == 0 && (e.edit.enabled = !1), r.processClick(s, f);
        }
      },
      { passive: !1 }
    ), i.on(
      { el: t, type: "mousedown.bodyclick touchstart.bodyclick" },
      (c) => {
        if (!vt(c))
          return !0;
        c.target.closest(".dg-cell") || this.gridMain.hideLayer();
      },
      { passive: !1 }
    ), i.on({ el: t, type: "mouseup.cellclick touchend.cellclick" }, (c) => {
      e.selection.isMouseDown = !1, e.isBodyDragging = !1, e.isMoveRow = !1;
    });
  }
  destroy() {
    for (const e of this.handlers)
      e.destroy?.();
  }
}
const qe = "dg-search-highlight", lt = "dg-search-match";
class kr {
  /**
   * Body Cell 생성
   *
   * @param context Body Context
   */
  constructor(e) {
    this.context = e;
  }
  /** Center Element Style 설정 */
  setCenterElementStyle(e) {
    this.context.centerElement.css(e);
  }
  /** 시작 Cell Element 반환 */
  getStartCellElement() {
    return this.context.bodyElement.find(".dg-cell." + Z.START_CELL);
  }
  /**
   * Grid 영역 너비 설정
   *
   * @param leftWidth Left 영역 너비
   * @param centerWidth Center 영역 너비
   * @param rightWidth Right 영역 너비
   */
  setGridPanelWidth(e, t, i) {
    this.context.leftElement.css({ width: e + "px" }), this.context.centerElement.css({
      "margin-left": e + "px",
      width: t + "px"
    }), this.context.rightElement.css({
      width: i + "px"
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
  setCellClassName(e, t, i, s, n) {
    if (!s.cellClassName) return;
    const r = this.context.cellClassNameCache.get(e);
    r?.length && e.classList.remove(...r);
    const o = it(s.cellClassName, {
      rowIdx: t,
      col: i,
      field: s,
      item: n
    });
    o.length > 0 ? (e.classList.add(...o), this.context.cellClassNameCache.set(e, o)) : this.context.cellClassNameCache.delete(e);
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
  setCellStyle(e, t, i, s, n, r, o) {
    const l = s.firstElementChild.style, c = `${r[R.HEIGHT] - 5}px`;
    if (l.maxHeight = c, this.setCellClassName(s, t, i, n, r), !n.$isAside) {
      if (o.searchEnabled) {
        const d = s.classList, h = o.searchMatchedFields ?? [];
        if (h.length > 0) {
          const u = n.name;
          if (o.matchViewItem?.isCurrentMatch && h[o.cellIndex] === u)
            d.add(qe, lt);
          else {
            const f = h.includes(u);
            d.remove(lt), d.toggle(qe, f);
          }
        } else
          d.remove(qe, lt);
      }
      this.context.selectionInfo.updateCellSelectionClass(
        s,
        t,
        i,
        e.startIdx,
        e.startCol
      );
    }
  }
  /** Search Highlight 제거 */
  clearSearchHighlight() {
    const e = this.context.bodyElement;
    ce(e.finds(".dg-cell." + qe), qe, lt);
  }
  /**
   * 수정된 Cell 다시 렌더링
   *
   * @param cell 수정된 Cell 정보
   */
  refreshEditedCell(e) {
    const t = this.context.gridMain.config();
    let i = this.context.allCellElements.center;
    Pe(t, e.c) ? i = this.context.allCellElements.left : Be(t, e.c) && (i = this.context.allCellElements.right);
    const s = i[e.r][e.c];
    this.setCellClassName(s, e.rowIndex, e.c, e.field, e.item), e.field.$renderer.render(e, s.firstElementChild);
  }
  /** Cell 상태 정리 */
  destroy() {
    this.context.cellClassNameCache = /* @__PURE__ */ new WeakMap();
  }
}
class Hr {
  constructor(e) {
    this.allRowElements = {}, this.allCellElements = {}, this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.gridMain = e, this.selectionInfo = e.selectionInfo, this.bodyElement = e.element().findDaraElement(".dg-body"), this.leftElement = this.bodyElement.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = this.bodyElement.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = this.bodyElement.findDaraElement('.dg-region[data-region="right"]');
  }
  resetCellState() {
    this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.allRowElements = {}, this.allCellElements = {};
  }
}
class gs {
  constructor(e, t, i) {
    this.context = e, this.cell = t, this.template = i;
  }
  drawData(e, t) {
    const i = this.context.gridMain.options(), s = this.context.gridMain.config(), n = s.dataManager, r = n.getViewItems(), o = s.fieldHeaderGroup.leafLeft, l = s.fieldHeaderGroup.leafCenter, c = s.fieldHeaderGroup.leafRight, d = s.fixedLeftIndex, h = s.fixedRightIndex, u = o.length > 0, g = c.length > 0, f = [
      {
        name: "left",
        fields: o,
        element: this.context.leftElement,
        startCol: 0
      },
      {
        name: "center",
        fields: l,
        element: this.context.centerElement,
        startCol: d
      },
      {
        name: "right",
        fields: c,
        element: this.context.rightElement,
        startCol: h
      }
    ], m = s.scroll.viewRow;
    let p = s.scroll.startIdx;
    const y = s.dataInfo.rowLength - p;
    let I = Math.min(m, y);
    if (y === 0 && s.dimensions.mainBodyHeight < s.rowHeight && (p = s.dataInfo.rowLength - 1, this.context.gridMain.getScroll().moveVerticalScroll({
      rowIdx: p,
      drawFlag: !1
    }), I = 1), this.updateRowTemplates(f, m), this.context.bodyElement.setAttr({ "data-view-mode": r.length < 1 ? "empty" : "grid" }), I < 1)
      return;
    this.updateLastRowVisibility(f, I, m), this.context.gridMain.hideLayer(e);
    const w = this.context.bodyElement.getElement().classList;
    p % 2 === 0 ? (w.remove("dg-body-odd"), w.add("dg-body-even")) : (w.remove("dg-body-even"), w.add("dg-body-odd"));
    const v = s.selection.startCell, x = s.scroll.startCol, C = s.scroll.endCol;
    this.context.selectionInfo.removeStartAnchorCell();
    const T = i.footer.paging?.enabled ? (s.paging.page - 1) * s.paging.pageSize : 0, L = s.currentFields, E = this.context.allCellElements.left, M = this.context.allCellElements.center, N = this.context.allCellElements.right, H = s.searchEnabled, de = s.searchMatchInfo, _ = {
      searchEnabled: H,
      cellIndex: de.cellIndex,
      matchViewItem: void 0,
      searchMatchedFields: void 0
    }, D = {
      rowIndex: -1,
      r: -1,
      item: null,
      viewItem: void 0,
      c: -1
    }, q = this.context.allRowElements, Ge = "dg-status-delete";
    for (let Q = 0; Q < I; Q++) {
      const pe = p + Q, z = r[pe];
      if (!z)
        break;
      if (t(z, Q))
        continue;
      for (const U of [q.left?.[Q], q.center?.[Q], q.right?.[Q]])
        U?.classList.remove("dg-group-row", "dg-group-header", "dg-group-summary", "dg-grand-summary");
      const K = n.getRowItem(z.id), we = T + pe;
      for (const U of [q.left?.[Q], q.center?.[Q], q.right?.[Q]])
        U?.classList.toggle(Ge, K[R.CUD] === V.DELETE);
      if (_.matchViewItem = void 0, _.searchMatchedFields = void 0, H) {
        const U = n.getSearchMapItem(z.id);
        _.matchViewItem = U, _.searchMatchedFields = U?.matchedFields?.map((te) => te.fieldName);
      }
      if (D.rowIndex = we, D.r = pe, D.item = K, D.viewItem = z, u) {
        const U = E[Q];
        for (let te = 0; te < o.length; te++) {
          const ge = o[te], xe = U[te];
          xe.classList.remove("dg-group-cell"), xe.firstElementChild.style.removeProperty("padding-left"), D.c = te, this.cell.setCellStyle(v, pe, te, xe, ge, K, _), ge.$renderer.render(D, xe.firstElementChild);
        }
      }
      const ve = M?.[Q];
      for (let U = x; ve && U <= C; U++) {
        const te = L[U], ge = ve[U];
        ge.classList.remove("dg-group-cell"), ge.firstElementChild.style.removeProperty("padding-left"), this.cell.setCellStyle(v, pe, U, ge, te, K, _), D.c = U, te.$renderer.render(D, ge.firstElementChild);
      }
      if (g) {
        const U = N[Q];
        for (let te = 0; te < c.length; te++) {
          const ge = c[te], xe = h + te, nt = U[xe];
          nt.classList.remove("dg-group-cell"), nt.firstElementChild.style.removeProperty("padding-left"), D.c = xe, this.cell.setCellStyle(v, pe, xe, nt, ge, K, _), ge.$renderer.render(D, nt.firstElementChild);
        }
      }
    }
    this.selectRowAnchorCell();
  }
  updateRowTemplates(e, t) {
    const i = this.context.gridMain.config(), s = i.scroll.before.viewRow;
    if (s > 0 && s > t) {
      for (let n = t; n < s; n++)
        for (const { fields: r, element: o } of e) {
          if (r.length === 0)
            continue;
          const l = o.find(`.dg-row[data-row="${n}"]`);
          l?.parentNode?.removeChild(l);
        }
      this.refreshCellElements(e, t), i.scroll.before.viewRow = t;
      return;
    }
    if (s < t) {
      const n = i.rowHeight, r = t - s;
      for (const { fields: o, element: l, startCol: c } of e)
        o.length !== 0 && l.find(".dg-body-table > tbody").appendChild(this.template.rowTemplate(s, r, n, o, c));
      this.refreshCellElements(e, t), i.scroll.before.viewRow = t;
    }
  }
  updateLastRowVisibility(e, t, i) {
    const s = this.context.gridMain.config();
    if (t < i) {
      const n = i - 1;
      for (let r = 0; r < i; r++)
        for (const { fields: o, element: l } of e) {
          if (o.length === 0)
            continue;
          if (r === n) {
            l.find(`.dg-row[data-row="${n}"]`).style.display = "none";
            continue;
          }
          const c = l.find(`.dg-row[data-row="${r}"]`).style;
          c.display === "none" && c.removeProperty("display");
        }
      s.scroll.before.hideLastRow = !0;
      return;
    }
    if (s.scroll.before.hideLastRow) {
      s.scroll.before.hideLastRow = !1;
      for (let n = 0; n < i; n++)
        for (const { fields: r, element: o } of e) {
          if (r.length === 0)
            continue;
          const l = o.find(`.dg-row[data-row="${n}"]`).style;
          l.display && l.removeProperty("display");
        }
    }
  }
  refreshCellElements(e, t) {
    const i = {}, s = {};
    for (const n of e) {
      const { name: r, element: o } = n;
      if (n.fields.length === 0)
        continue;
      const l = new Array(t), c = new Array(t);
      for (let h = 0; h < t; h++)
        l[h] = [];
      const d = o.getElement().querySelectorAll(".dg-body-table > tbody > .dg-row");
      for (let h = 0; h < t; h++) {
        const u = d[h];
        c[h] = u;
        const g = u.children;
        for (let f = 0; f < g.length; f++)
          l[h][n.startCol + f] = g[f];
      }
      s[r] = c, i[r] = l;
    }
    this.context.allRowElements = s, this.context.allCellElements = i;
  }
  selectRowAnchorCell() {
    const e = this.context.gridMain.config();
    if (!e.fieldHeaderGroup.leafLeft?.[0]?.$isAside)
      return;
    const i = this.context.allCellElements.left, s = e.scroll.startIdx, n = e.scroll.viewRow, r = Z.SELECTION, o = this.context.selectionInfo.isAllSelect(), l = e.dataManager.getViewItems();
    if (!i)
      return;
    if (o) {
      for (let d = 0; d < n; d++)
        i[d][0]?.classList.toggle(r, !!l[s + d]);
      return;
    }
    const c = this.context.selectionInfo.getRowLine();
    for (let d = 0; d < n; d++)
      i[d][0]?.classList.toggle(r, !!l[s + d] && c.has(d + s));
  }
  destroy() {
    this.context.allRowElements = {}, this.context.allCellElements = {};
  }
}
class Fr extends gs {
  dataDraw(e) {
    this.drawData(e, (t, i) => this.renderGroupRow(t, i)), this.hideRepeatedGroupValues(), this.applyRowSpans();
  }
  hideRepeatedGroupValues() {
    const e = this.context.gridMain.options().groupingFields ?? [];
    if (e.length === 0)
      return;
    const t = this.context.gridMain.config(), i = t.dataManager, s = i.getViewItems(), n = t.scroll.startIdx, r = Math.min(t.scroll.viewRow, t.dataInfo.rowLength - n), o = e.map((d) => t.currentFields.find((h) => h.name === d));
    let l;
    for (let d = 0; d < r; d++) {
      const h = s[n + d];
      if (!h || h.groupRowType)
        continue;
      for (const g of o) {
        if (!g)
          continue;
        const f = t.fieldHeaderGroup.leafLeft.includes(g) ? "left" : t.fieldHeaderGroup.leafRight.includes(g) ? "right" : "center";
        this.context.allCellElements[f]?.[d]?.[g.$colSeq]?.classList.remove("dg-group-continuation");
      }
      const u = i.getRowItem(h.id);
      if (l)
        for (let g = 0; g < o.length; g++) {
          const f = o[g], m = o.slice(0, g + 1).every((I) => I && Object.is(u[I.name], l[I.name]));
          if (!f || !m)
            continue;
          const p = t.fieldHeaderGroup.leafLeft.includes(f) ? "left" : t.fieldHeaderGroup.leafRight.includes(f) ? "right" : "center", y = this.context.allCellElements[p]?.[d]?.[f.$colSeq];
          y && (y.firstElementChild.textContent = "", y.classList.add("dg-group-continuation"));
        }
      l = u;
    }
    const c = r - 1;
    if (c >= 0)
      for (const d of o) {
        if (!d)
          continue;
        const h = t.fieldHeaderGroup.leafLeft.includes(d) ? "left" : t.fieldHeaderGroup.leafRight.includes(d) ? "right" : "center";
        this.context.allCellElements[h]?.[c]?.[d.$colSeq]?.classList.remove(
          "dg-group-continuation"
        );
      }
  }
  applyRowSpans() {
    const t = this.context.gridMain.options().rowSpanFields ?? [];
    if (t.length === 0)
      return;
    const i = this.context.gridMain.config(), s = i.dataManager, n = s.getViewItems(), r = i.scroll.startIdx, o = Math.max(0, Math.min(i.scroll.viewRow, i.dataInfo.rowLength - r)), l = this.context.allCellElements, c = t.map((d) => i.currentFields.find((h) => h.name === d)).filter((d) => d !== void 0);
    for (const d of c) {
      const h = i.fieldHeaderGroup.leafLeft.includes(d) ? "left" : i.fieldHeaderGroup.leafRight.includes(d) ? "right" : "center", u = d.$colSeq, g = Array.from(
        { length: o },
        (f, m) => l[h]?.[m]?.[u]
      );
      for (const f of g)
        f && (f.rowSpan = 1, f.style.removeProperty("display"));
    }
    for (let d = 0; d < c.length; d++) {
      const h = c[d], u = i.fieldHeaderGroup.leafLeft.includes(h) ? "left" : i.fieldHeaderGroup.leafRight.includes(h) ? "right" : "center", g = h.$colSeq;
      let f = 0;
      for (; f < o; ) {
        const m = n[r + f];
        if (!m || m.groupRowType) {
          f++;
          continue;
        }
        const p = s.getRowItem(m.id);
        let y = 1;
        for (; f + y < o; ) {
          const I = n[r + f + y];
          if (!I || I.groupRowType)
            break;
          const w = s.getRowItem(I.id);
          if (!c.slice(0, d + 1).every((x) => Object.is(p[x.name], w[x.name])))
            break;
          y++;
        }
        if (y > 1) {
          const I = l[u]?.[f]?.[g];
          I && (I.rowSpan = y);
          for (let w = f + 1; w < f + y; w++) {
            const v = l[u]?.[w]?.[g];
            v && (v.style.display = "none");
          }
        }
        f += y;
      }
    }
  }
  renderGroupRow(e, t) {
    if (!e.groupRowType)
      return !1;
    const i = this.context.gridMain.config(), s = this.context.allRowElements, n = this.context.allCellElements, r = e.groupRowType === "group" ? "dg-group-header" : e.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary", o = i.currentFields.find((d) => !d.$isAside), l = new Set(Je(this.context.gridMain.options())), c = (e.groupRowType === "groupSummary" || e.groupRowType === "group") && e.groupField ? i.currentFields.find((d) => d.name === e.groupField) : i.currentFields.find((d) => !d.$isAside && !l.has(d.name)) ?? o;
    for (const d of ["left", "center", "right"]) {
      const h = s[d]?.[t];
      h?.classList.remove("dg-group-header", "dg-group-summary", "dg-grand-summary", "dg-status-delete"), h?.classList.add("dg-group-row", r);
    }
    for (const d of i.currentFields) {
      const h = d.$colSeq;
      let u;
      if (i.fieldHeaderGroup.leafLeft.includes(d) ? u = n.left?.[t]?.[h] : i.fieldHeaderGroup.leafRight.includes(d) ? u = n.right?.[t]?.[h] : u = n.center?.[t]?.[h], !u)
        continue;
      const g = this.context.cellClassNameCache.get(u);
      g?.length && u.classList.remove(...g), this.context.cellClassNameCache.delete(u), u.classList.remove(
        "dg-group-continuation",
        "dg-search-highlight",
        "dg-search-match",
        Z.SELECTION,
        Z.START_CELL
      ), u.classList.add("dg-group-cell");
      const f = u.firstElementChild;
      f.textContent = "";
      const { startIdx: m, startCol: p } = i.selection.startCell;
      if (this.context.selectionInfo.updateCellSelectionClass(
        u,
        i.scroll.startIdx + t,
        h,
        m,
        p
      ), d.name === ye) {
        const y = this.context.gridMain.options().footer.paging?.enabled ? (i.paging.page - 1) * i.paging.pageSize : 0, I = {
          r: i.scroll.startIdx + t,
          c: h,
          rowIndex: y + i.scroll.startIdx + t,
          field: d,
          item: i.dataManager.getRowItem(e.id),
          viewItem: e
        };
        d.$renderer.render(I, f);
      } else if (!d.$isAside && e.groupRowType === "group" && d === c)
        f.textContent = `${e.groupField}: ${String(e.groupValue ?? "")}`, f.style.paddingLeft = `${(e.groupDepth ?? 0) * 16}px`;
      else if (!d.$isAside && e.groupRowType !== "group" && d === c)
        f.textContent = e.groupRowType === "grandSummary" ? "Grand Total" : e.groupField ? `${String(e.groupValue ?? "")} 합계` : "Subtotal", f.style.paddingLeft = `${(e.groupDepth ?? 0) * 16}px`;
      else if (e.groupRowType !== "group" && l.has(d.name)) {
        const y = e.groupSums?.[d.name];
        f.textContent = y === void 0 ? "" : ki(y, ke(this.context.gridMain.options()).find((I) => Se(I) === d.name), d), f.style.paddingLeft = "";
      } else
        f.style.paddingLeft = "";
    }
    return !0;
  }
}
class $r extends gs {
  dataDraw(e) {
    this.drawData(e, (t) => !1);
  }
}
class Nr {
  /**
   * Body Selection 생성
   *
   * @param context Body Context
   * @param renderer Body Renderer
   */
  constructor(e, t) {
    this.context = e, this.renderer = t;
  }
  init() {
  }
  /**
   * 체크된 항목의 필드값 반환
   *
   * @param name 필드명
   */
  getCheckedItemByName(e) {
    const { dataManager: t } = this.context.gridMain.config(), i = [], s = t.getViewItems();
    for (const n of s)
      t.isItemChecked(n.id) && i.push(t.getRowItem(n.id)[e]);
    return i;
  }
  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  setAllCheckItem(e) {
    const t = this.context.gridMain.config().dataManager;
    e ? t.setAllCheck() : t.clearAllCheck(), this.renderer.dataDraw("allCheck");
  }
  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  setItemChecked(e, t) {
    this.setItemsChecked([e], t);
  }
  /**
   * 여러 Row 체크 상태 설정
   *
   * 기존 체크 상태를 초기화한 후 지정한 Row를 체크
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  setItemsChecked(e, t) {
    this.context.gridMain.config().dataManager.clearAllCheck(), this.addItemsChecked(e, t);
  }
  /**
   * Row 체크 상태 추가
   *
   * 기존 체크 상태를 유지
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  addItemChecked(e, t) {
    this.addItemsChecked([e], t);
  }
  /**
   * 여러 Row의 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  addItemsChecked(e, t) {
    const { isRowAllowMultiSelect: i, dataManager: s } = this.context.gridMain.config();
    if (!i) {
      s.clearAllCheck();
      const r = e[0];
      r !== void 0 && (s.setItemChecked(r, t), this.setFieldRefresh(mt));
      return;
    }
    e.forEach((r) => {
      s.setItemChecked(r, t);
    }), this.setFieldRefresh(mt);
    const n = s.getViewItems().filter((r) => !r.groupRowType);
    this.context.gridMain.getHeader().setCheckboxStyle(
      Ki(n.filter((r) => s.isItemChecked(r.id)).length, n.length)
    );
  }
  /**
   * 지정한 Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  setFieldRefresh(e) {
    const t = this.context.gridMain.config(), { scroll: i, paging: s, dataManager: n, currentFields: r } = t, o = r.find((p) => p.name === e);
    if (!o)
      return;
    const l = this.context.gridMain.options(), c = n.getViewItems(), d = i.viewRow, h = i.startIdx, u = l.footer.paging?.enabled ? (s.page - 1) * s.pageSize : 0, g = o.$colSeq;
    let f = this.context.allCellElements.center;
    g < t.fixedLeftIndex ? f = this.context.allCellElements.left : g >= t.fixedRightIndex && (f = this.context.allCellElements.right);
    const m = { rowIndex: -1, r: -1, item: null, viewItem: void 0, c: -1, field: o };
    for (let p = 0; p < d; p++) {
      const y = h + p, I = c[y];
      if (!I)
        break;
      if (I.groupRowType)
        continue;
      const w = n.getRowItem(I.id), v = u + y;
      m.rowIndex = v, m.r = y, m.item = w, m.viewItem = I, m.c = g;
      const x = f[p]?.[g];
      x && o.$renderer.render(m, x.firstElementChild);
    }
  }
  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  setCheckedItemByValue(e, t) {
    const { dataManager: i, isRowAllowMultiSelect: s } = this.context.gridMain.config(), n = new Set(F(t) ? t : [t]), r = i.getViewItems(), o = [];
    for (const l of r)
      if (n.has(i.getRowItem(l.id)[e]) && (o.push(l.id), !s))
        break;
    this.setItemsChecked(o, !0);
  }
  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  addCheckedItemByValue(e, t) {
    const { dataManager: i } = this.context.gridMain.config(), s = new Set(F(t) ? t : [t]), n = i.getViewItems(), r = [];
    for (const o of n)
      s.has(i.getRowItem(o.id)[e]) && r.push(o.id);
    this.addItemsChecked(r, !0);
  }
  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  unCheckedItemByValue(e, t) {
    const { dataManager: i } = this.context.gridMain.config(), s = new Set(F(t) ? t : [t]), n = i.getViewItems(), r = [];
    for (const o of n)
      s.has(i.getRowItem(o.id)[e]) && r.push(o.id);
    this.addItemsChecked(r, !1);
  }
  /** 선택 데이터 클립보드 복사 */
  copyData() {
    const e = this.context.selectionInfo.selectionData();
    try {
      ks(e);
    } catch (t) {
      console.log("Unable to copy", t);
    }
  }
  /** Row Anchor Cell 선택 상태 갱신 */
  selectRowAnchorCell() {
    const e = this.context.gridMain.config(), t = e.fieldHeaderGroup.leafLeft;
    if (t && !t[0].$isAside)
      return;
    const i = this.context.allCellElements.left, s = e.scroll.startIdx, n = e.scroll.viewRow, r = Z.SELECTION, o = e.dataManager.getViewItems(), l = this.context.selectionInfo.isAllSelect();
    if (!i)
      return;
    if (l) {
      for (let d = 0; d < n; d++)
        i[d][0]?.classList.toggle(r, !!o[s + d]);
      return;
    }
    const c = this.context.selectionInfo.getRowLine();
    for (let d = 0; d < n; d++)
      i[d][0]?.classList.toggle(r, !!o[s + d] && c.has(d + s));
  }
  /** Selection 상태 정리 */
  destroy() {
  }
}
class zr {
  /**
   * Body Context
   *
   * @param context Body Context
   */
  constructor(e) {
    this.context = e;
  }
  /**
   * Body 영역별 table template 생성
   */
  create() {
    this.context.leftElement.html(this.createTemplate("left")), this.context.centerElement.html(this.createTemplate("center")), this.context.rightElement.html(this.createTemplate("right"));
  }
  /**
   * HTML table template 생성
   *
   * @param type Horizontal 영역
   */
  createTemplate(e) {
    const t = this.context.gridMain.config();
    let i = 0, s;
    e === "left" ? s = t.fieldHeaderGroup.leafLeft : e === "right" ? (i = t.fixedRightIndex, s = t.fieldHeaderGroup.leafRight) : (i = t.fixedLeftIndex, s = t.fieldHeaderGroup.leafCenter);
    const n = new Array(s.length);
    for (let r = 0; r < s.length; r++) {
      const o = s[r];
      n[r] = `<th data-col-idx="${i + r}" 
        style="border:0;margin:0 !important; padding:0 !important;font-size:0 !important;
        line-height:0 !important;height:0;width:${o.$width}px;"></th>`;
    }
    return S`<table class="dg-body-table"><thead><tr>${n.join("")}</tr></thead><tbody></tbody></table>${e === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
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
  rowTemplate(e, t, i, s, n) {
    const r = document.createDocumentFragment();
    if (t <= 0 || s.length === 0)
      return r;
    const o = this.createFieldTemplates(s, n), l = `${i}px`;
    for (let c = 0; c < t; c++) {
      const d = e + c, h = document.createElement("tr");
      h.className = "dg-row", h.dataset.row = String(d), h.style.height = l;
      for (const u of o) {
        const g = document.createElement("td");
        g.className = u.cellClassName, g.dataset.cellPosition = `${d},${u.col}`;
        const f = document.createElement("div");
        f.className = u.rendererClassName, u.rendererStyle && (f.style.cssText = u.rendererStyle), g.appendChild(f), h.appendChild(g);
      }
      r.appendChild(h);
    }
    return r;
  }
  /**
   * Field별 정적 Template 정보 생성
   *
   * @param fields Field 목록
   * @param startCol 시작 Column Index
   */
  createFieldTemplates(e, t) {
    const i = new Array(e.length);
    for (let s = 0; s < e.length; s++) {
      const n = e[s], r = t + s;
      if (n.$isAside) {
        i[s] = {
          col: r,
          cellClassName: `dg-cell dg-aside dg-${Ms(n.name).replace("$", "")}`,
          rendererClassName: `dg-cell-renderer ${n.$alignStyle || ""}`.trim(),
          rendererStyle: ""
        };
        continue;
      }
      const { style: o, className: l } = Oi(n), d = n.$renderer.supportsInteraction() ? yt(n.editRenderer) : yt(n.renderer);
      i[s] = {
        col: r,
        cellClassName: "dg-cell",
        rendererClassName: [
          "dg-cell-renderer",
          "dg-ellipsis",
          `dg-${n.renderer.type}`,
          n.$alignStyle,
          l,
          d
        ].filter(Boolean).join(" "),
        rendererStyle: o || ""
      };
    }
    return i;
  }
}
class Or {
  /**
   * Body 생성
   *
   * @param gridMain GridMain
   */
  constructor(e) {
    this.gridMain = e, this.context = new Hr(e), this.templateManager = new zr(this.context), this.cellManager = new kr(this.context), this.renderer = e.options().groupingFields?.length || e.options().rowSpanFields?.length ? new Fr(this.context, this.cellManager, this.templateManager) : new $r(this.context, this.cellManager, this.templateManager), this.selectionManager = new Nr(this.context, this.renderer), this.templateManager.create(), this.bodyEvent = new Dr(e, this, this.context.selectionInfo);
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
  getCheckedItemByName(e) {
    return this.selectionManager.getCheckedItemByName(e);
  }
  /**
   * 전체 Row 체크 상태 설정
   *
   * @param checked 체크 여부
   */
  setAllCheckItem(e) {
    this.selectionManager.setAllCheckItem(e);
  }
  /**
   * Row 체크 상태 설정
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  setItemChecked(e, t) {
    this.selectionManager.setItemChecked(e, t);
  }
  /**
   * 여러 Row 체크 상태 설정
   *
   * @param rowIds Row ID 목록
   * @param checked 체크 여부
   */
  setItemsChecked(e, t) {
    this.selectionManager.setItemsChecked(e, t);
  }
  /**
   * Row 체크 상태 추가
   *
   * @param rowId Row ID
   * @param checked 체크 여부
   */
  addItemChecked(e, t) {
    this.selectionManager.addItemChecked(e, t);
  }
  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 필드명
   * @param values 필드값
   */
  setCheckedItemByValue(e, t) {
    this.selectionManager.setCheckedItemByValue(e, t);
  }
  /**
   * 필드값으로 Row 체크 추가
   *
   * @param name 필드명
   * @param values 필드값
   */
  addCheckedItemByValue(e, t) {
    this.selectionManager.addCheckedItemByValue(e, t);
  }
  /**
   * 필드값으로 Row 체크 해제
   *
   * @param name 필드명
   * @param values 필드값
   */
  unCheckedItemByValue(e, t) {
    this.selectionManager.unCheckedItemByValue(e, t);
  }
  /**
   * Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  setFieldRefresh(e) {
    this.selectionManager.setFieldRefresh(e);
  }
  /**
   * Center Element Style 설정
   *
   * @param styleCss CSS Style
   */
  setCenterElementStyle(e) {
    this.cellManager.setCenterElementStyle(e);
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
  setGridPanelWidth(e, t, i) {
    this.cellManager.setGridPanelWidth(e, t, i);
  }
  /**
   * Body 데이터 렌더링
   *
   * @param mode 렌더링 모드
   */
  dataDraw(e) {
    this.renderer.dataDraw(e), this.gridMain.checkLoadMore();
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
    this.bodyEvent.destroy(), this.renderer.destroy(), this.selectionManager.destroy(), this.cellManager.destroy(), this.context.resetCellState();
  }
}
const Ee = "dg-on";
class Pr {
  constructor(e) {
    this._isActive = !1, this.contextData = /* @__PURE__ */ new Map(), this.exportBusy = !1, this.gridMain = e;
    const t = this.gridMain.options().contextMenu;
    t && (this._isActive = !0, this.contextOpts = t);
  }
  init() {
    this._isActive && (this.create(), this.initEvent());
  }
  /** 숨김 컨테이너에 붙여 둔 메뉴 요소를 제거한다. */
  destroy() {
    this.contextElement?.getElement().remove();
  }
  create() {
    const e = document.createElement("ul");
    e.dataset.gridLayerId = this.gridMain.uid(), e.className = "dg-contextmenu dg-contextmenu-top dg-outer-layer", e.setAttribute("draggable", "false"), e.setAttribute("onselectstart", "return false");
    const t = [];
    this.contextOpts.enabledHeader && t.push(`<li><a class="dg-contextmenu-header" tabindex="-1">-</a></li>
        <li><a class="dg-divider" tabindex="-1"></a></li>
      `), t.push(this.template(this.createItems(this.contextOpts.items), "top", 0)), e.innerHTML = t.join(""), document.querySelector(Zt)?.appendChild(e), this.contextElement = new Ie(e), this.gridMain.config().eventManager.on({ el: e, type: "contextmenu" }, (i) => {
      $(i);
    });
  }
  initEvent() {
    const e = this.gridMain.config(), t = this.contextOpts, i = this.gridMain.getMainElement().getElement(), s = A(t.disableItem), n = A(t.beforeActivate);
    let r;
    const o = this.gridMain.config().eventManager;
    o.off(i, "contextmenu"), o.on({ el: i, type: "contextmenu" }, (l) => {
      if ($(l), this.gridMain.hideLayer(), ce(this.contextElement.finds(".dg-submenu-item." + Ee), Ee), s) {
        const g = t.disableItem(t.items);
        if (g) {
          const f = g.length;
          let m;
          if (f > 0)
            for (let p = 0; p < f; p++)
              m = g[p], Te(this.contextElement.find('[context-key="' + m.depth + "_" + m.key + '"]'), "disabled");
        }
      }
      const c = l.target;
      if (r = c.closest(".dg-contextmenu-item"), Te(r, "dg-select"), n) {
        const g = c.closest(".dg-cell");
        if (g) {
          const f = me(e, g);
          t.beforeActivate(f, { evt: l, element: c });
        } else
          t.beforeActivate({ evt: l, element: c });
      }
      const d = se(l), h = this.contextElement.getElement();
      this.gridMain.openLayer(h);
      const u = bs(h, d);
      this.contextElement.css({ top: u.top + "px", left: u.left + "px" });
    }), this.initItemClickEvent(), this.initSubmenuEvent();
  }
  initItemClickEvent() {
    const e = this.contextElement.finds(".dg-contextmenu-item"), t = this.contextOpts.callback, i = A(t), s = this.gridMain.config().eventManager;
    s.off(e, "pointerdown"), s.on({ el: e, type: "pointerdown" }, (n) => {
      const r = n.currentTarget;
      if (r.closest(".disabled") || be(r, "dg-submenu-item"))
        return;
      const l = r.closest(".dg-contextmenu").querySelectorAll('input[type="checkbox"]'), c = {};
      l.forEach((u) => {
        u?.dataset?.itemKey && (c[u?.dataset?.itemKey] = u.checked);
      });
      const d = r.dataset.itemKey || "", h = this.contextData.get(d);
      if (this.gridMain.hideLayer(), h?.callback) {
        h.callback(h, c);
        return;
      }
      i && t(h, c);
    });
  }
  /** 키 전용 설정에 기본 라벨·콜백을 채워 기존 메뉴 실행 경로에 전달한다. */
  createItems(e, t) {
    const i = this.gridMain.i18n();
    return e.filter((s) => !B(s)).map((s) => {
      const n = { ...s }, r = n.key ?? "";
      let o = t;
      if (r === "exportFile" || t) {
        o = { ...t };
        for (const c of ["excel", "csv", "json", "pdf"])
          n.exportOptions?.[c] && (o[c] = { ...o[c], ...n.exportOptions[c] });
      }
      const l = {
        copy: i.getMessage("context.copy"),
        exportFile: i.getMessage("context.exportFile"),
        excel: "Excel",
        xlsx: "Excel",
        csv: "CSV",
        pdf: "PDF",
        json: "JSON"
      };
      return n.label = n.label ?? (r === "copy" || r === "exportFile" || t ? l[r] : void 0) ?? r, !n.callback && r === "copy" ? n.callback = () => Ve.getInstance(this.gridMain.element().getElement())?.copyData() : !n.callback && t && ["excel", "xlsx", "csv", "pdf", "json"].includes(r.toLowerCase()) && (n.callback = async () => {
        if (this.exportBusy) return;
        const c = Ve.getInstance(this.gridMain.element().getElement());
        if (c) {
          this.exportBusy = !0;
          try {
            await os(c, r, o, i.getMessage("export.unsupportedFormat"));
          } catch (d) {
            console.error(i.getMessage("export.failed"), d);
          } finally {
            this.exportBusy = !1;
          }
        }
      }), n.children && (n.children = this.createItems(n.children, o)), n;
    });
  }
  initSubmenuEvent() {
    const e = this.contextElement.finds(".dg-contextmenu-item > a");
    let t;
    const i = this.gridMain.config().eventManager;
    i.off(e, "mouseenter"), i.on({ el: e, type: "mouseenter" }, (s) => {
      const r = s.currentTarget.closest(".dg-contextmenu-item"), o = r.closest(".dg-contextmenu");
      if (clearTimeout(t), !be(r, "dg-submenu-item")) {
        ce(o.querySelectorAll(":scope >.dg-contextmenu-item." + Ee), Ee);
        return;
      }
      be(r, Ee) || ce(o.querySelectorAll(":scope >.dg-contextmenu-item." + Ee), Ee), t = setTimeout(() => {
        Te(r, Ee);
        const l = Ss(), c = ie(r), d = r.querySelector(".dg-contextmenu-submenu"), h = new Ie(d);
        h.css({ left: "", top: "" });
        const u = ie(d), g = u.width, f = u.height;
        if (g + c.left + c.width > l.width) {
          const y = g / (c.width + 3) * 100;
          h.css({ left: `-${y}%` });
        }
        const p = c.top + f - l.height;
        p > 0 && h.css({ top: `-${p}px` });
      }, 450);
    });
  }
  /**
   * change header label
   *
   * @public
   * @param {string} label header label
   */
  changeHeader(e) {
    this.contextElement.find(".dg-contextmenu-header").textContent = e;
  }
  /**
   * html template
   *
   * @public
   @param {string} id menu id
   @param {number} depth menu depth
   * @returns {string} template string
   */
  template(e, t, i) {
    const s = [], n = e.length;
    let r, o;
    for (let l = 0; l < n; l++) {
      const c = e[l];
      if (!B(c)) {
        if (o = j(it(c.itemClass, { item: c }).join(" ")) + (c.disabled === !0 ? " disabled" : ""), r = (t === "top" ? "" : t + "_") + i + "_" + (c.key || ""), c.divider === !0) {
          s.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
          continue;
        }
        if (c.checkbox === !0) {
          s.push(S`<li class="dg-contextmenu-check ${o}"><a tabindex="-1"><label ><input type="checkbox" data-item-key="${j(String(c.key ?? ""))}" /><span>${j(String(c.label ?? ""))}</span></label></a ></li>`);
          continue;
        }
        if (this.contextData.set(r, c), !B(c.children))
          s.push(S`<li class="dg-contextmenu-item dg-submenu-item ${o}" data-item-key="${j(r)}" ><a tabindex="-1"><span class="dg-contextmenu-label">${j(String(c.label ?? ""))}</span><span class="dg-contextmenu-hotkey-empty"></span></a><ul class="dg-contextmenu dg-contextmenu-submenu">${this.template(c.children, r, i + 1)}</ul></li>`);
        else {
          const d = B(c.hotkey) ? "" : `<span class="dg-contextmenu-hotkey">${j(String(c.hotkey))}</span>`;
          s.push(S`<li class="dg-contextmenu-item ${o}" data-item-key="${j(r)}"><a tabindex="-1"><span class="dg-contextmenu-label">${j(String(c.label ?? ""))}</span>${d}</a></li>`);
        }
        s.push("</li>");
      }
    }
    return s.join("");
  }
}
class Br extends ni {
  constructor(e, t) {
    super(e), this.priority = 5, this.dragDelay = 150, this.beforeEndCol = -1, this.startCellIdx = 0, this.scrollDirectionX = null, this.dragAnimationId = 0, this.lastScrollTime = 0, this.selectionInfo = e.gridMain.selectionInfo, this.headerElement = e.header?.getHeaderElement().getElement(), this.multipleFlag = sn(this.opts.selectionMode);
  }
  canHandle(e) {
    return e.cellInfo?.field?.$isAside ? !1 : (this.startCellIdx = e.cellInfo?.c ?? 0, !0);
  }
  onPointerDown(e) {
  }
  onActivate(e) {
    if (!this.multipleFlag) return !1;
    const t = this.cfg, i = ie(this.headerElement, !0), { mainLeftWidth: s, mainInsideWidth: n, mainRightWidth: r, mainBodyHeight: o } = t.dimensions;
    this.gridBounds = {
      gridLeft: i.left,
      gridRight: i.left + t.dimensions.mainTotalWidth,
      mainLeft: i.left + s,
      mainRight: i.left + n - r,
      top: i.top,
      bottom: i.top + o
    }, this.headerPosition = i, this.scrollDirectionX = null, this.beforeEndCol = -1, be(e.cellEl, "dg-line-number") && (this.currentSelectionMode = oe.multiRow);
  }
  onPointerMove(e) {
    if (!this.multipleFlag) return;
    const t = this.cfg, i = this.gridBounds, { x: s } = e.currentPos, n = {};
    let r = !1;
    const o = qi(
      t,
      s,
      this.headerPosition.left,
      i.mainLeft,
      i.mainRight
    );
    o.overCell > -1 && (r = !0, n.endCol = this.selectionInfo.getSelectionModeColInfo(
      this.currentSelectionMode,
      o.overCell,
      t,
      e.cellEl,
      t.selection.isMouseDown
    ).endCol), this.scrollDirectionX = o.scrollDirectionX, this.beforeEndCol !== n.endCol && (r && this.selectionInfo.setSelectionRangeInfo(
      {
        id: t.selection.id,
        range: n
      },
      !1,
      this.scrollDirectionX === null
    ), this.beforeEndCol = n.endCol ?? -1, this.scrollDirectionX && this.dragAnimationId === 0 && this.startAutoScroll());
  }
  startAutoScroll(e = !0) {
    if (this.dragAnimationId) return;
    this.lastScrollTime = 0;
    const t = this.cfg, i = { col: -1 }, n = this.context.gridMain.getScroll(), r = this.context.gridMain.getBody(), o = (l) => {
      const c = this.scrollDirectionX;
      if (c === null) {
        this.stopAutoScroll();
        return;
      }
      if (l - this.lastScrollTime < this.dragDelay) {
        this.dragAnimationId = requestAnimationFrame(o);
        return;
      }
      this.lastScrollTime = l;
      let d = !1;
      const h = {};
      if (c !== null) {
        const u = c === O.RIGHT, g = u ? t.scroll.insideEndCol + 1 : t.scroll.insideStartCol - 1;
        i.col !== g && (u && t.fixedRightIndex === 0 || !u && t.fixedLeftIndex === 0) && (h.endCol = g, this.selectionInfo.setSelectionRangeInfo({ range: h }, !1, !1)), n.moveHorizontalScroll({ direction: c, colIdx: g, drawFlag: !1 }), i.col = g, d = !0;
      }
      d && r.dataDraw("drageHeadScroll"), this.dragAnimationId = requestAnimationFrame(o);
    };
    this.dragAnimationId = requestAnimationFrame(o);
  }
  stopAutoScroll() {
    this.dragAnimationId !== 0 && (cancelAnimationFrame(this.dragAnimationId), this.dragAnimationId = 0);
  }
  onPointerUp(e) {
    this.stopAutoScroll();
  }
  onClick(e) {
    const t = this.cfg;
    let i = t.selection.id == "";
    const s = this.startCellIdx, n = {
      type: "column",
      startIdx: 0,
      endIdx: t.dataInfo.lastRow,
      startCol: s,
      endCol: s
    }, r = e.event;
    It(r) ? n.modifierKey = 1 : Oe(r) ? (n.modifierKey = 2, n.startCol = i ? s : t.selection.range.startCol, n.endCol = s) : i = !0, this.multipleFlag && this.selectionInfo.setSelectionRangeInfo(
      {
        range: n,
        isSelect: !0,
        startCell: { startCol: s }
      },
      i,
      !0
    );
  }
}
class Wr {
  constructor(e, t) {
    this.gridMain = e, this.header = t, this.helpOpts = e.options().header;
  }
  /**
   * keydown event
   *
   */
  init() {
    const e = this.helpOpts.help, t = this.gridMain.config(), i = t.eventManager, s = this.header.getHeaderElement().finds(".dg-header-help");
    if (A(e.click)) {
      const c = e.click ?? (() => {
      });
      i.off(s, "pointerdown"), i.on(
        { el: s, type: "pointerdown" },
        (d) => {
          if (!Ne(d))
            return;
          $(d);
          const h = d.currentTarget, u = this.getHeaderHelpCellInfo(t, h);
          return c(u), !1;
        },
        { passive: !1 }
      );
    }
    let n;
    const r = e.showDelay, o = this.gridMain.getRendererLayerElement();
    let l;
    i.off(s, "mouseenter"), i.on({ el: s, type: "mouseenter" }, (c) => {
      const d = c.currentTarget, h = this.getHeaderHelpCellInfo(t, d), g = h.field?.headerHelp ?? e.content;
      return g && (n || (n = Re("div", "dg-header-help-tooltip", "help-tooltip"), o.appendChild(n)), l = setTimeout(() => {
        let f;
        A(g) ? f = g(h) : f = g, $e(n, f);
        const m = n.style;
        m.height = "auto", m.display = "block", m.width = "auto";
        const p = bt(o, d, n);
        m.top = `${p.top}px`, m.left = `${p.left + 2}px`, m.height = `${p.height}px`;
      }, r)), !1;
    }), i.on({ el: s, type: "mouseleave" }, (c) => (clearTimeout(l), n?.style && (n.style.display = "none"), !1));
  }
  getHeaderHelpCellInfo(e, t) {
    let i, s;
    const n = t.closest(".dg-header-group-cell");
    if (n) {
      const r = n.dataset.headerGroupPosition?.split(",");
      if (r && r.length > 0) {
        const o = ue(r[0]), l = ue(r[1]);
        let c;
        n.closest('.dg-region[data-region="left"]') ? c = e.fieldHeaderGroup.left : n.closest('.dg-region[data-region="right"]') ? c = e.fieldHeaderGroup.right : c = e.fieldHeaderGroup.center, s = c[o][l], i = l;
      }
    } else
      i = ue(t.closest(".dg-header-cell")?.dataset.headerCellPosition ?? "0"), s = e.currentFields[i];
    return { c: i, field: s };
  }
}
class Gr extends ni {
  constructor(e, t) {
    super(e), this.priority = 1, this.resizeIdx = 0, this.resizeMoveX = 0, this.positionLeft = 0;
    const i = this.opts.header.resize;
    this.resizeOpts = i, this.resizeUpdate = A(i.update) ? i.update : void 0, this.resizerHelperElement = e.gridMain.element().findDaraElement(".dg-resize-helper");
  }
  onPointerDown(e) {
    this.resizeIdx = e.cellInfo?.c || 0;
  }
  onActivate(e) {
    const t = this.cfg, i = this.resizeIdx, s = Pe(t, i), n = Be(t, i);
    let r = 0;
    if (n) {
      for (let o = t.fixedRightIndex; o <= i; o++)
        r += t.currentFields[o].$width;
      this.positionLeft = t.dimensions.mainInsideWidth - t.dimensions.mainRightWidth + r;
    } else if (s) {
      for (let o = 0; o <= i; o++)
        r += t.currentFields[o].$width;
      this.positionLeft = r;
    } else {
      for (let o = 0; o <= i; o++)
        r += t.currentFields[o].$width;
      this.positionLeft = r - t.scroll.centerLeftPosition;
    }
    this.resizerHelperElement.addClass("active");
  }
  onPointerMove(e) {
    const t = e.currentPos.x - e.startPos.x, i = this.positionLeft + t;
    this.resizeMoveX = t, this.resizerHelperElement.css({ left: i + "px" });
  }
  onPointerUp(e) {
    this.resizerHelperElement.hasClass("active") && (this.resizerHelperElement.removeClass("active"), document.documentElement.removeAttribute("onselectstart"), this.headerColumnResize(this.resizeIdx, this.resizeMoveX));
  }
  /**
   * header column resize
   *
   * @public
   * @param {number} resizeIdx resize index
   * @param {number} resizeWidth resize width
   */
  headerColumnResize(e, t) {
    const n = this.cfg.currentFields[e].$width + t;
    this.context.gridMain.getStructureBuilder().setColumnWidth(e, n), this.resizeUpdate && this.resizeUpdate.call(null, { index: this.resizeIdx, width: n });
  }
  onDoubleClick(e) {
    const t = this.resizeIdx, s = this.cfg.currentFields[t].$renderer.getMinWidth(this.cfg, this.opts);
    this.context.gridMain.getStructureBuilder().setColumnWidth(t, s);
  }
}
class _r {
  constructor(e, t) {
    this.gridMain = e, this.header = t, this.sortOpts = e.options().header.sort;
  }
  /**
   * init
   *
   */
  init() {
    const e = this.sortOpts, t = this.gridMain.config(), i = t.eventManager, s = t.sort.orders, n = t.dataManager, r = this.header.getHeaderElement(), o = r.finds(".dg-sort-icon"), l = this.header.getHeaderCellElements();
    let c = 0;
    i.off(o, "pointerdown"), i.on(
      { el: o, type: "pointerdown" },
      (d) => {
        if (!Ne(d))
          return;
        $(d), this.gridMain.hideLayer();
        const h = d.currentTarget, u = this.gridMain.options().dataSource?.sorting?.mode === "server" ? this.gridMain.getRemote() : null;
        if (u?.isLoadBlocked()) {
          u.sortRemote().catch(() => {
          });
          return;
        }
        const g = ue(
          h.closest(".dg-header-cell")?.dataset.headerCellPosition ?? "0"
        ), f = t.currentFields[g], m = f.name;
        Oe(d) || (ai(r.finds("[data-dg-sort]"), "data-dg-sort"), (s.length > 1 || !s.some((I) => I.name === m)) && (s.forEach((I) => {
          l[I.sortCell].querySelector(".dg-sort-num")?.replaceChildren();
        }), s.length = 0, c = 0));
        const y = s.find((I) => I.name === m);
        if (y)
          if (y.ascOrder)
            li(h, { "data-dg-sort": "desc" }), y.ascOrder = !y.ascOrder;
          else {
            const I = s.findIndex((w) => w.name === m);
            I !== -1 && s.splice(I, 1), h.querySelector(".dg-sort-num")?.replaceChildren(), ai(h, "data-dg-sort");
          }
        else
          li(h, { "data-dg-sort": "asc" }), s.push({ name: m, field: f, ascOrder: !0, sortCell: g });
        if (s.length > 0 && c >= 1 && c != s.length && s.forEach((I, w) => {
          l[I.sortCell].querySelector(".dg-sort-num")?.replaceChildren(w + 1 + "");
        }), c = s.length, u) {
          u.sortRemote().catch(() => {
          });
          return;
        }
        n.dataSort(s, e), this.gridMain.selectionInfo.initSelection(), this.gridMain.getBody().dataDraw("sort");
      },
      { passive: !1 }
    );
  }
}
class Ur {
  constructor(e, t) {
    this.cfg = e.config(), this.gridMain = e, this.header = t, this.headerElement = this.header.getHeaderElement(), this.headerCellElements = this.header.getHeaderCellElements(), this.headerOpts = e.options().header;
  }
  init() {
    this.gridMain.options().search.enabled === !0 && this.initSearchButton(), this.gridMain.config().enabledHeaderHelpButton && new Wr(this.gridMain, this.header).init(), this.gridMain.config().enabledSortButton && new _r(this.gridMain, this.header).init(), this.initPointerEvent(), this.initResizeEvent(), this.initHeaderCheckbox();
  }
  /**
   * 검색 버튼
   */
  initSearchButton() {
    const e = this.headerElement.find(".dg-search-icon"), t = this.cfg.eventManager;
    t.off(e, "click"), t.on({ el: e, type: "click" }, (i) => ($(i), this.gridMain.getDataSearch().openSearch(), !1));
  }
  /**
   * init header selection event
   */
  initPointerEvent() {
    const e = this.gridMain.options().selectionMode, t = [];
    if (this.headerOpts.enabledAllColumnSelection && !tn(e) && t.push(new Br({ gridMain: this.gridMain, header: this.header }, this)), t.length < 1) return;
    const i = this.cfg, s = i.eventManager, n = this.headerCellElements;
    let r;
    const o = new qt(), l = $t, c = () => {
      s.off(
        document,
        "touchmove.header.selection mousemove.header.selection touchend.header.selection touchcancel.header.selection mouseup.header.selection"
      );
    };
    s.off(n, "mousedown.header.selection touchstart.header.selection"), s.on(
      { el: n, type: "mousedown.header.selection touchstart.header.selection" },
      (d) => {
        if (!vt(d))
          return !0;
        this.gridMain.hideLayer();
        const h = d.currentTarget, u = ln(i, h);
        u.c = Math.max(u.c, i.dataInfo.startCol), r = Bt(d, u, o);
        let g = -1;
        for (const m of t)
          if (m.canHandle(r)) {
            if (g > m.priority)
              continue;
            g = m.priority, r.handler = m;
          }
        const f = r.handler;
        if (f) {
          if (f.onPointerMove) {
            let m = !1;
            s.on(
              { el: document, type: "touchmove.header.selection mousemove.header.selection" },
              (p) => {
                if (r.currentPos = se(p), !m) {
                  if (!gt(r.startPos, r.currentPos, l))
                    return;
                  if (m = !0, f.onActivate?.(r) === !1) {
                    c();
                    return;
                  }
                }
                r.state = Me.DRAGGING, f.onPointerMove?.(r);
              }
            ), s.on(
              { el: document, type: "touchend.header.selection touchcancel.header.selection  mouseup.header.selection" },
              (p) => {
                c(), r.state = Me.IDLE, r.currentPos = se(p), f.onPointerUp?.(r);
              }
            );
          }
          o.processClick(r, f);
        }
      },
      { passive: !0 }
    );
  }
  /**
   * resize event
   *
   * @private
   */
  initResizeEvent() {
    if (this.gridMain.options().header.resize.enabled === !1) return;
    const t = this.cfg, i = t.eventManager, s = this.headerElement.finds(".dg-header-resizer"), n = new Gr({ gridMain: this.gridMain, header: this.header }, this);
    let r;
    const o = new qt(), l = $t;
    i.off(s, "mousedown.resizerclick touchstart.resizerclick"), i.on(
      { el: s, type: "mousedown.resizerclick touchstart.resizerclick" },
      (c) => {
        if (!vt(c))
          return !0;
        c.cancelable && $(c), this.gridMain.hideLayer();
        const d = c.currentTarget, h = an(t, d);
        if (h.c = Math.max(h.c, t.dataInfo.startCol), r = Bt(c, h, o), r.handler = n, n.onPointerDown?.(r), n.onPointerMove) {
          let u = !1;
          i.on({ el: document, type: "touchmove.resizerclick mousemove.resizerclick" }, (g) => {
            if (r.currentPos = se(g), !u) {
              if (!gt(r.startPos, r.currentPos, l))
                return;
              u = !0, n.onActivate?.(r);
            }
            r.state = Me.DRAGGING, n.onPointerMove?.(r);
          }), i.on({ el: document, type: "touchend.resizerclick mouseup.resizerclick" }, (g) => {
            i.off(
              document,
              "touchmove.resizerclick mousemove.resizerclick touchend.resizerclick mouseup.resizerclick"
            ), r.state = Me.IDLE, r.currentPos = se(g), n.onPointerUp?.(r);
          });
        }
        o.processClick(r, n);
      },
      { passive: !1 }
    );
  }
  /**
   * header all check
   *
   */
  initHeaderCheckbox() {
    const e = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all");
    this.cfg.eventManager.on({ el: e, type: "click" }, (t) => {
      const i = t.currentTarget;
      this.header.setAllCheckItem(!be(i, W), i);
    });
  }
}
const Ke = "dg-indeterminate";
class qr {
  constructor(e) {
    if (this.enabled = !0, this.gridMain = e, this.headerOpts = e.options().header, this.headerElement = e.element().findDaraElement(".dg-header"), this.headerOpts.view === !1) {
      this.enabled = !1, this.headerElement.getElement().remove();
      return;
    }
    this.initHeader(), this.headerEvent = new Ur(e, this), this.headerEvent.init();
  }
  initHeader() {
    this.createTemplate(), this.setHeight(this.gridMain.config().dimensions.mainHeaderHeight);
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
  setAllCheckItem(e, t) {
    t || (t = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all")), e ? Te(t, W) : ce(t, W), ce(t, Ke), this.gridMain.getBody().setAllCheckItem(e);
  }
  /**
   * set check box style
   *
   * @public
   * @param {("all" | "none" | "partial")} mode
   */
  setCheckboxStyle(e) {
    if (!this.gridMain.config().isRowAllowMultiSelect) return;
    const i = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all")?.classList;
    i && (e == "partial" ? (i.remove(W), i.contains(Ke) || i.add(Ke)) : (i.toggle(W, e === "all"), i.contains(Ke) && i.remove(Ke)));
  }
  /**
   * set header height
   *
   @param {number} height header height
   */
  setHeight(e) {
    this.headerElement.setHeight(e);
  }
  /**
   * set header panel width
   *
   * @public
   * @param {number} mainLeftWidth
   * @param {number} mainCenterWidth
   * @param {number} mainRightWidth
   */
  setGridPanelWidth(e, t, i) {
    this.enabled && (this.leftElement.css({ width: e + "px" }), this.centerElement.css({ "margin-left": e + "px", width: t + "px" }), this.rightElement.css({ width: i + "px" }));
  }
  setCenterElementStyle(e) {
    this.enabled && this.centerElement.css(e);
  }
  setSearchIcon(e) {
    const t = this.headerElement.find(".dg-search-icon");
    e ? Te(t, "dg-on") : ce(t, "dg-on");
  }
  createTemplate() {
    this.headerElement.css({ height: `${this.gridMain.config().dimensions.mainHeaderHeight}px` }), this.leftElement = this.headerElement.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = this.headerElement.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = this.headerElement.findDaraElement('.dg-region[data-region="right"]'), this.leftElement.html(this.template("left")), this.centerElement.html(this.template("center")), this.rightElement.html(this.template("right")), this.headerCellElements = [], this.headerElement.finds(".dg-header-cell").forEach((e) => {
      const i = ue(e.dataset.headerCellPosition || "0");
      this.headerCellElements[i] = e;
    });
  }
  /**
   *  set column line selection style
   * @returns
   */
  selectColumnAnchorCell() {
    if (!this.enabled) return;
    const e = this.gridMain.config().dataInfo, i = this.gridMain.getHeader().getHeaderCellElements(), s = this.gridMain.selectionInfo.isAllSelect(), n = this.gridMain.selectionInfo.getColumnLine();
    for (let r = e.startCol; r < e.colLength; r++) {
      const l = i[r].classList;
      s || n.has(r) ? l.contains(Z.SELECTION) || l.add(Z.SELECTION) : l.contains(Z.SELECTION) && l.remove(Z.SELECTION);
    }
  }
  clearAnchorCell() {
    ce(this.getHeaderCellElements(), Z.SELECTION);
  }
  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(e) {
    const t = this.gridMain.config(), i = this.gridMain.options();
    let s, n;
    const r = t.currentFields;
    if (e == "left" ? (s = t.fieldHeaderGroup.left, n = t.fieldHeaderGroup.leafLeft) : e == "right" ? (s = t.fieldHeaderGroup.right, n = t.fieldHeaderGroup.leafRight) : (s = t.fieldHeaderGroup.center, n = t.fieldHeaderGroup.leafCenter), !s?.length || !s[0]?.length) return "";
    const o = [], l = i.search.enabled, c = i.header.help.enabled, d = s.length, h = this.headerOpts.resize.enabled, u = i.header.sort.enabled, g = l ? S`<div class="dg-search-icon">${he.search}</div>` : "";
    s.forEach((m, p) => {
      const I = [`<tr class="dg-header-row" style="height:${t.fieldHeaderGroup.heights[p]}px">`];
      m.forEach((w, v) => {
        w.$isLeaf && w.$depth < d && (w.$rowspan = d - w.$depth);
        let x = "", C = "";
        w.$isLeaf ? (x = "dg-header-cell", C = ` data-header-cell-position="${w.$resizeIdx}"`) : (x = "dg-header-group-cell", C = ` data-header-group-position="${p},${v}"`);
        const T = w.$colspan > 1 ? ` colspan="${w.$colspan}" scope="colgroup"` : "", L = w.$rowspan > 1 ? ` rowspan="${w.$rowspan}"` : "", E = w.$isLeaf && !w.$isAside && (u || w.sort === !0) ? S`<div class="dg-sort-icon"><span class="dg-sort-num"></span>${he.headerSort}</div>` : "", M = w.$enabledHelp, N = !w.$isAside && (c || M !== !1) ? S`<div class="dg-header-help-button">${he.help}</div>` : "", H = w.$isAside && w.name == mt && t.isRowAllowMultiSelect ? S`<div class="dg-choice"><div class="dg-choice-item dg-checkbox dg-all"><div class="dg-indicator"></div>${w.label ? `<span class="dg-label dg-ellipsis">${j(String(w.label))}</span>` : ""}</div></div>` : `<div class="centered">${j(String(w.label ?? ""))}</div>`, de = w.$isAside && w.name == ye ? g : "", _ = S`${N}<div class="dg-label-wrapper"><div class="dg-header-label ${w.sort ? "sort-header" : ""}"><div class="dg-inner">${H}</div>${E}</div></div>`, D = !h || w.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${w.$resizeIdx}"></div>`;
        I.push(S`<th class="${x}" ${T}${L}${C}>${de} ${_} ${D}</th>`);
      }), I.push("</tr>"), o.push(I.join(""));
    });
    const f = [];
    for (const m of n) {
      const p = m.$colSeq;
      f.push(
        `<th data-col-idx="${p}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${r[p].$width}px;"></th>`
      );
    }
    return S`<table class="dg-header-table"><thead><tr>${f.join("")}</tr></thead><tbody>${o.join("")}</tbody></table>${e === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
}
class Kr {
  constructor(e, t, i) {
    this.gridMain = e, this.scrollOpts = this.gridMain.options().scroll, this.horizontalElement = i, this.horizontalTrackElement = i.findDaraElement(".dg-scroll-track"), this.horizontalThumbElement = i.findDaraElement(".dg-scroll-thumb");
  }
  /**
   * horizontal event 초기화
   *
   */
  init() {
    const e = this.scrollOpts.width;
    this.horizontalElement.css({ height: `${e}px` }), this.horizontalThumbElement.css({
      height: `${e - He}px`,
      margin: `1px ${e}px`
    }), this.horizontalElement.finds(".dg-scroll-button > svg").forEach((i) => {
      i.style.width = `${e - He}px`, i.style.height = `${e - He}px`;
    }), this.initHorizontalTrack(), this.initHorizontalThumb(), this.initHorizontalButton();
  }
  /**
   * 가로 스크롤 계산
   * @returns
   */
  calculate() {
    const e = this.gridMain.config(), t = e.scroll;
    if (!t.enabledHorizontal) {
      t.left = 0, this.setHorizontalPosition(e);
      return;
    }
    const i = e.dimensions, s = e.scrollbarSize * 2, n = i.mainTotalWidth, r = i.width - (t.enabledVertical ? e.scrollbarSize : 0) - 2, o = r - s;
    let l = o * (o / n * 100) / 100;
    l = Math.max(l, zt), this.horizontalElement.css({ width: r + "px" }), this.horizontalThumbElement.css({ width: l + "px" }), t.oneColMove = n / e.dataInfo.colLength, t.hWidth = r, t.hTrackWidth = o, t.hThumbWidth = l, t.left + l > o ? (t.left = o - l, this.setHorizontalPosition(e)) : this.calcViewCol(e, t.centerLeftPosition);
  }
  /**
   * init horizontal thumb drag event
   *
   * @private
   */
  initHorizontalThumb() {
    const e = this.gridMain.config(), t = e.eventManager;
    let i = !1, s = 0, n = 0, r = 0, o = null;
    const l = this.horizontalThumbElement, c = this.moveHorizontalScroll.bind(this), d = () => {
      e.eventManager.off(document, "touchmove mousemove touchend touchcancel mouseup");
    }, h = (m) => {
      i && (s = se(m).x);
    }, u = (m) => {
      if (!i) return;
      i = !1, l.removeClass("active"), o !== null && (cancelAnimationFrame(o), o = null);
      const p = se(m).x;
      c({ position: r + (p - n) }), d();
    }, g = () => {
      if (!i) return;
      const m = s - n;
      c({ position: r + m }), o = requestAnimationFrame(g);
    }, f = l.getElement();
    t.off(f, "mousedown touchstart touchend touchcancel mouseup"), t.on(
      { el: f, type: "mousedown touchstart" },
      (m) => {
        if (Ne(m))
          return $(m), this.gridMain.hideLayer(), i = !0, n = se(m).x, s = n, r = e.scroll.left, l.addClass("active"), t.on({ el: document, type: "touchmove mousemove" }, h), t.on({ el: document, type: "touchend touchcancel mouseup" }, u), o !== null && cancelAnimationFrame(o), o = requestAnimationFrame(g), !0;
      },
      { passive: !1 }
    );
  }
  /**
   * init horizontal track event
   *
   * @private
   */
  initHorizontalTrack() {
    const e = this.scrollOpts, t = this.gridMain.config(), i = t.eventManager;
    let s = 0, n = !1, r = 0, o = 0, l = 0, c;
    const d = this.horizontalTrackElement.getElement();
    i.off(d, "mousedown touchstart mouseup touchend touchcancel mouseleave"), i.on(
      { el: d, type: "mousedown touchstart" },
      (h) => {
        Ne(h) && (this.gridMain.hideLayer(), s = 1, r = se(h).clientX - d.getBoundingClientRect().left, o = t.scroll.oneColMove, l = o * e.horizontal.speed * 2, n = r < t.scroll.left, c = setInterval(() => {
          s = 2, this.moveHorizontalScroll({
            position: this.getHorizontalBgMovePostion(t, r, o, n, l)
          });
        }, 100));
      },
      { passive: !1 }
    ), i.on({ el: d, type: "mouseup touchend touchcancel mouseleave" }, (h) => {
      s != 0 && ($(h), clearTimeout(c), s == 1 && this.moveHorizontalScroll({
        position: this.getHorizontalBgMovePostion(t, r, o, n, l)
      }), s = 0);
    });
  }
  /**
   * init horizontal button event
   *
   * @private
   */
  initHorizontalButton() {
    let e, i = 0;
    const n = this.gridMain.config().eventManager, r = this.horizontalElement.finds(".dg-scroll-button");
    n.off(r, "mousedown touchstart mouseup touchcancel touchend mouseleave"), n.on(
      { el: r, type: "mousedown touchstart" },
      (o) => {
        const l = pt(o.currentTarget, "data-dg-mode", "left");
        i = 1, this.gridMain.hideLayer(), e = setInterval(() => {
          i = 2, this.moveHorizontalScroll({ direction: l ? O.LEFT : O.RIGHT });
        }, 100);
      },
      { passive: !1 }
    ), n.on({ el: r, type: "mouseup touchend touchcancel mouseleave" }, (o) => {
      if (i == 1) {
        const l = pt(o.currentTarget, "data-dg-mode", "left");
        this.moveHorizontalScroll({ direction: l ? O.LEFT : O.RIGHT });
      }
      clearInterval(e), i = 0;
    });
  }
  /**
   *
   * @param cfg 설정 정보
   @param startEventX start event x
   @param oneColMove col move value
   @param leftFlag left move flag left = true
   * @param bgMoveCol
   * @returns
   */
  getHorizontalBgMovePostion(e, t, i, s, n) {
    let r = e.scroll.left + (s ? -1 : 1) * n;
    return s ? t >= r && (r = t - i) : t <= r + e.scroll.hThumbWidth && (r = t - e.scroll.hThumbWidth + i * 2), r;
  }
  /**
   * @method moveHorizontalScroll
   * @param  moveObj.position {Integer} left position
   * @param  moveObj.direction {String} 'L' or 'R'
   * @param  moveObj.drawFlag {boolean} redraw flag
   * @param  moveObj.speed {Integer} row move count
   * @description 가로 스크롤 이동.
   */
  moveHorizontalScroll(e) {
    const t = this.gridMain.config();
    t.scroll.enabledHorizontal || t.scroll.left > 0 && this.moveHorizontalScrollPosition(0, e.drawFlag);
    let i = 0;
    if (J(e.position))
      i = e.position;
    else if (J(e.colIdx)) {
      let s = e.colIdx;
      s > 0 ? s = Math.min(s, t.dataInfo.colLength - 1) : s = 0;
      for (let n = t.fixedLeftIndex; n < s; n++)
        i += t.currentFields[n].$width;
      e.direction == "R" && (i = i + t.currentFields[s].$width), i = gi(t, i, e.direction);
    } else if (le(e.direction)) {
      const s = e.speed || 1;
      i = t.scroll.left + (e.direction == O.LEFT ? -1 : 1) * s * t.scroll.oneColMove;
    }
    this.moveHorizontalScrollPosition(i, e.drawFlag);
  }
  /**
   * @method moveHorizontalScrollPosition
   * @param leftVal {Integer} body left position
   * @param drawFlag {Boolean} draw flag
   * @param updateChkFlag {Boolean} 업데이트 여부.
   * @description 가로 스크롤바 위치 이동
   */
  moveHorizontalScrollPosition(e, t = !0, i) {
    const s = this.gridMain.config(), n = s.scroll;
    if (e >= n.hTrackWidth - n.hThumbWidth ? e = n.hTrackWidth - n.hThumbWidth : e <= 0 && (e = 0), n.left != e) {
      if (n.left = e, i !== !1) {
        const r = this.scrollOpts.horizontal.onUpdate;
        if (t !== !1 && A(r) && r({
          scrollLeft: e,
          width: n.hTrackWidth,
          barPosition: n.hBarPosition
        }) === !1)
          return;
      }
      this.setHorizontalPosition(s), t !== !1 && this.gridMain.getBody().dataDraw("hscroll");
    }
  }
  /**
   * 가로 스크롤 위치 셋팅
   *
   * @private
   * @param {Config} cfg 설정값
   */
  setHorizontalPosition(e) {
    const t = e.scroll, i = _i(e, t.left);
    e.scroll.centerLeftPosition = i, this.calcViewCol(e, i), this.horizontalThumbElement.css({ left: t.left + "px" });
    const s = { left: "-" + i + "px" };
    this.gridMain.getHeader().setCenterElementStyle(s), this.gridMain.getBody().setCenterElementStyle(s), this.gridMain.getSummary().setCenterElementStyle(s);
  }
  /**
   * view col 위치 구하기.
   *
   * @param {Config} cfg 설정 정보
   */
  calcViewCol(e, t) {
    const i = e.scroll, s = e.dimensions, r = s.mainInsideWidth - (s.mainLeftWidth + s.mainRightWidth), o = e.fieldHeaderGroup.leafCenter;
    let l = 0, c = 0, d = o.length - 1, h = !0, u = !0;
    for (let f = 0; f < o.length; f++) {
      if (u && l >= t && (i.insideStartCol = f, u = !1), l += o[f].$width, h && l >= t) {
        c = f, h = !1;
        continue;
      }
      if (l - t >= r) {
        d = f;
        break;
      }
    }
    i.before.startCol = i.startCol, i.before.endCol = i.endCol, i.insideStartCol = e.fixedLeftIndex + i.insideStartCol, i.startCol = e.fixedLeftIndex + Math.max(c, 0), i.endCol = e.fixedLeftIndex + Math.min(d, o.length);
    const g = gi(e, l, "R") != i.left ? -1 : 0;
    i.insideEndCol = i.endCol + g;
  }
}
class jr {
  constructor(e, t, i) {
    this.bodyDrawPending = !1, this.bodyDrawAnimationId = 0, this.lastThumbTop = -1, this.gridMain = e, this.scrollOpts = this.gridMain.options().scroll, this.verticalElement = i, this.verticalTrackElement = i.findDaraElement(".dg-scroll-track"), this.verticalThumbElement = i.findDaraElement(".dg-scroll-thumb");
  }
  /**
   * vertical event 초기화
   *
   */
  init() {
    const e = this.scrollOpts.width;
    this.verticalElement.css({ width: `${e}px` }), this.verticalThumbElement.css({ width: `${e - He}px`, margin: `${e}px 0px` }), this.verticalElement.finds(".dg-scroll-button > svg").forEach((i) => {
      i.style.width = `${e - He}px`, i.style.height = `${e - He}px`;
    }), this.initVerticalTrack(), this.initVerticalThumb(), this.initVerticalButton();
  }
  /**
   * 세로 스크롤 계산
   * @returns
   */
  calculate() {
    const e = this.gridMain.config(), t = e.scroll;
    if (!t.enabledVertical) {
      this.setVerticalPosition(t, 0);
      return;
    }
    const i = e.dimensions;
    this.gridMain.options();
    const s = e.scrollbarSize * 2, n = e.rowHeight, r = e.dataInfo.rowLength, l = i.mainHeight - (t.enabledHorizontal ? e.scrollbarSize : 0) - 2, c = l - s, d = Math.max(0, r - t.insideViewRow), h = n * r;
    let u = 0;
    if (c >= zt && h > 0 && (u = c * (i.mainBodyHeight / h), u = Math.max(zt, Math.min(u, c))), d > 0 ? t.oneRowMove = (c - u) / d : t.oneRowMove = 0, t.vHeight = l, t.vTrackHeight = c, t.vThumbHeight = u, this.verticalElement.css({ height: `${l}px` }), this.verticalThumbElement.css({ height: `${u}px` }), d === 0) {
      this.setVerticalPosition(t, 0);
      return;
    }
    const g = d, f = Math.min(Math.max(0, t.startIdx), g);
    this.setVerticalPosition(t, f * t.oneRowMove);
  }
  /**
   * init vertical track event
   *
   * @private
   */
  initVerticalTrack() {
    const e = this.scrollOpts, t = this.gridMain.config(), i = t.eventManager;
    let s = 0, n = !1, r = 0, o = 0, l = 0, c;
    const d = this.verticalTrackElement.getElement();
    i.off(d, "mousedown touchstart mouseup touchend mouseleave"), i.on(
      { el: d, type: "mousedown touchstart" },
      (h) => {
        if (!Ne(h))
          return;
        this.gridMain.hideLayer(), s = 1, l = se(h).clientY - d.getBoundingClientRect().top, r = t.scroll.oneRowMove, o = r * e.vertical.speed * 5, n = l < t.scroll.top;
        const u = t.scroll.vThumbHeight / 2;
        c = setInterval(() => {
          s = 2, this.moveVerticalScroll({
            position: this.getVerticalBgMovePostion(
              t,
              l - (n ? u : 0),
              r,
              n,
              o
            )
          });
        }, 100);
      },
      { passive: !1 }
    ), i.on({ el: d, type: "mouseup touchend mouseleave" }, (h) => {
      s != 0 && (clearInterval(c), $(h), s == 1 && this.moveVerticalScroll({
        position: this.getVerticalBgMovePostion(t, l, r, n, o)
      }), s = 0);
    });
  }
  initVerticalButton() {
    const t = this.gridMain.config().eventManager;
    let i;
    const s = 100, n = this.verticalElement.finds(".dg-scroll-button");
    let r = 0;
    t.off(n, "mousedown touchstart mouseup touchend mouseleave"), t.on(
      { el: n, type: "mousedown touchstart" },
      (o) => {
        const l = pt(o.currentTarget, "data-dg-mode", "up");
        this.gridMain.hideLayer(), r = 1, i = setInterval(() => {
          r = 2, this.moveVerticalScroll({ direction: l ? ee.UP : ee.DOWN });
        }, s);
      },
      { passive: !1 }
    ), t.on({ el: n, type: "mouseup touchend mouseleave" }, (o) => {
      if (r == 1) {
        const l = pt(o.currentTarget, "data-dg-mode", "up");
        this.moveVerticalScroll({ direction: l ? ee.UP : ee.DOWN });
      }
      clearInterval(i), r = 0;
    });
  }
  initVerticalThumb() {
    const e = this.scrollOpts, t = this.gridMain.config(), i = e.vertical.enabledTooltip, s = this.verticalElement.findDaraElement(".dg-vscroll-bar-tip"), n = this.verticalThumbElement;
    let r = !1, o = 0, l = null, c = 0, d = 0;
    const h = (m) => {
      r && (o = se(m).y);
    }, u = (m) => {
      if (!r) return;
      r = !1, n.removeClass("active"), l !== null && (cancelAnimationFrame(l), l = null);
      const p = se(m).y;
      this.moveVerticalScroll({ position: c + (p - d) }), t.eventManager.off(document, "touchmove mousemove touchcancel touchend mouseup"), i && s.hide();
    }, g = () => {
      if (!r) return;
      const m = o - d;
      this.moveVerticalScroll({ position: c + m }), i && (s.text(t.scroll.viewRow + 1), s.show()), l = requestAnimationFrame(g);
    }, f = this.verticalThumbElement.getElement();
    t.eventManager.off(f, "mousedown touchstart"), t.eventManager.on(
      { el: f, type: "mousedown touchstart" },
      (m) => {
        if (Ne(m))
          return $(m), this.gridMain.hideLayer(), r = !0, c = t.scroll.top, d = se(m).y, o = d, n.addClass("active"), t.eventManager.on({ el: document, type: "touchmove mousemove" }, h), t.eventManager.on({ el: document, type: "touchend touchcancel mouseup" }, u), l !== null && cancelAnimationFrame(l), l = requestAnimationFrame(g), !0;
      },
      { passive: !1 }
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
  getVerticalBgMovePostion(e, t, i, s, n) {
    const r = e.scroll;
    let o = r.top + (s ? -1 : 1) * n;
    return s ? o < 0 ? o = t - r.vThumbHeight : t >= o && (o = t - i * 2) : t <= o + r.vThumbHeight && (o = t - r.vThumbHeight + i * 2), o;
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
  moveVerticalScroll(e) {
    const i = this.gridMain.config().scroll;
    if (!i.enabledVertical) {
      i.startIdx = 0;
      return;
    }
    let s = 0;
    if (J(e.position))
      s = e.position;
    else if (J(e.rowIdx))
      s = e.rowIdx * i.oneRowMove;
    else if (le(e.direction)) {
      const n = e.speed || 1;
      s = i.top + (e.direction == ee.UP ? -1 : 1) * n * i.oneRowMove;
    }
    this.moveVerticalScrollPosition(s, e.drawFlag);
  }
  /**
   *세로 스크롤 위치 이동.
   */
  moveVerticalScrollPosition(e, t = !0, i) {
    const n = this.gridMain.config().scroll, r = Math.max(0, n.vTrackHeight - n.vThumbHeight);
    if (e > r ? e = r : e < 0 && (e = 0), n.top == e) {
      t !== !1 && this.gridMain.checkLoadMore(!0);
      return;
    }
    if (i !== !1) {
      const l = this.gridMain.options().scroll.vertical.onUpdate;
      if (t !== !1 && A(l) && l({ scrollTop: e, height: n.vTrackHeight }) === !1)
        return;
    }
    const o = n.startIdx;
    this.setVerticalPosition(n, e), !(t === !1 || n.startIdx == o) && this.scheduleBodyDraw();
  }
  scheduleBodyDraw() {
    this.bodyDrawPending = !0, this.bodyDrawAnimationId === 0 && (this.bodyDrawAnimationId = requestAnimationFrame(() => {
      this.bodyDrawAnimationId = 0, this.bodyDrawPending && (this.bodyDrawPending = !1, this.gridMain.getBody().dataDraw("vscroll"));
    }));
  }
  destroy() {
    this.bodyDrawAnimationId !== 0 && cancelAnimationFrame(this.bodyDrawAnimationId), this.bodyDrawAnimationId = 0, this.bodyDrawPending = !1;
  }
  /**
   * 세로 스크롤 위치 설정
   *
   * @private
   @param {ScrollInfo} scroll 스크롤 정보
   * @param {number} topVal 스크롤 바 포지션
   */
  setVerticalPosition(e, t) {
    if (t < 0 && (t = 0), e.top === t)
      return;
    e.top = t;
    const i = Math.round(t);
    this.lastThumbTop !== i && (this.lastThumbTop = i, this.verticalThumbElement.css({ top: t + "px" }));
    let s = 0;
    e.oneRowMove > 0 && t > 0 && (s = Math.round(t / e.oneRowMove));
    const n = this.gridMain.config().dataInfo.rowLength, r = Math.max(0, n - e.insideViewRow);
    e.before.startIdx = e.startIdx, e.startIdx = Math.min(s, r);
  }
}
const ne = class ne {
  constructor(e) {
    this.wheelAnimationId = 0, this.pendingVerticalDelta = 0, this.pendingHorizontalDelta = 0, this.verticalWheelDirection = null, this.horizontalWheelDirection = null, this.verticalDirectionChanged = !1, this.horizontalDirectionChanged = !1, this.gridMain = e, this.opts = this.gridMain.options(), this.horizontalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-horizontal"), this.verticalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-vertical");
  }
  destroy() {
    this.wheelAnimationId !== 0 && cancelAnimationFrame(this.wheelAnimationId), this.wheelAnimationId = 0, this.pendingVerticalDelta = 0, this.pendingHorizontalDelta = 0, this.verticalScroll?.destroy();
  }
  /**
   * 스크롤을 초기화한다.
   */
  init() {
    this.verticalScroll = new jr(this.gridMain, this, this.verticalElement), this.horizontalScroll = new Kr(this.gridMain, this, this.horizontalElement);
    const e = this.gridMain.config().scrollbarSize;
    this.gridMain.getMainElement().findDaraElement(".dg-scroll-corner").css({ width: `${e}px`, height: `${e}px` }), this.calculate(), this.initMouseWheel(), this.gridMain.config().disableVerticalScroll || this.verticalScroll.init(), this.horizontalScroll.init();
  }
  /**
   * 스크롤 크기와 위치를 계산한다.
   */
  calculate() {
    this.horizontalScroll.calculate(), this.verticalScroll.calculate();
  }
  /**
   * 마우스 휠 이벤트를 초기화한다.
   */
  initMouseWheel() {
    const { scroll: e, eventManager: t } = this.gridMain.config(), i = this.gridMain.getMainElement().getElement(), s = this.gridMain.config().disableVerticalScroll;
    t.off(i, "wheel DOMMouseScroll"), t.on(
      {
        el: i,
        type: "wheel DOMMouseScroll"
      },
      (n) => {
        const r = this.normalizeWheelDelta(n);
        if (r === 0)
          return;
        const o = e.enabledHorizontal && Oe(n);
        !s && this.opts.scroll.enabledWheelInContainer && $(n), this.canScroll(e, r, o, s) && ($(n), o ? this.addHorizontalWheel(r) : this.addVerticalWheel(r), this.requestWheelAnimation());
      },
      { passive: !1 }
    );
  }
  /**
   * 현재 wheel 방향으로 스크롤할 수 있는지 확인한다.
   */
  canScroll(e, t, i, s) {
    if (i) {
      const r = e.hTrackWidth - e.hThumbWidth;
      return t < 0 ? e.left > 0 : e.left < r;
    }
    if (s)
      return !1;
    const n = this.gridMain.config().dataInfo.rowLength;
    return t < 0 ? e.startIdx > 0 : e.startIdx + e.insideViewRow < n;
  }
  /**
   * 세로 wheel delta를 누적한다.
   */
  addVerticalWheel(e) {
    const t = e < 0 ? ee.UP : ee.DOWN;
    this.verticalWheelDirection !== null && this.verticalWheelDirection !== t ? (this.pendingVerticalDelta = e, this.verticalDirectionChanged = !0) : this.pendingVerticalDelta += e, this.verticalWheelDirection = t;
  }
  /**
   * 가로 wheel delta를 누적한다.
   */
  addHorizontalWheel(e) {
    const t = e < 0 ? O.LEFT : O.RIGHT;
    this.horizontalWheelDirection !== null && this.horizontalWheelDirection !== t ? (this.pendingHorizontalDelta = e, this.horizontalDirectionChanged = !0) : this.pendingHorizontalDelta += e, this.horizontalWheelDirection = t;
  }
  /**
   * wheel animation frame을 예약한다.
   */
  requestWheelAnimation() {
    this.wheelAnimationId === 0 && (this.wheelAnimationId = requestAnimationFrame(() => {
      this.wheelAnimationId = 0, this.processWheel(), this.hasPendingWheel() && this.requestWheelAnimation();
    }));
  }
  /**
   * 누적된 vertical/horizontal wheel을 처리한다.
   */
  processWheel() {
    this.pendingVerticalDelta !== 0 && this.processVerticalWheel(), this.pendingHorizontalDelta !== 0 && this.processHorizontalWheel();
  }
  /**
   * 지정된 방향으로 세로 스크롤 이동이 가능한지 확인합니다.
   *
   * @param direction - 세로 스크롤 이동 방향
   * @param scroll - 현재 스크롤 위치 및 표시 영역 정보
   * @param rowLength - 전체 행의 개수
   * @returns 해당 방향으로 이동할 수 있으면 true, 그렇지 않으면 false
   */
  canMoveVertical(e, t, i) {
    return e === ee.UP ? t.startIdx > 0 : t.startIdx + t.insideViewRow < i;
  }
  /**
   * 누적된 세로 wheel을 처리한다.
   */
  processVerticalWheel() {
    const { scroll: e, dataInfo: t } = this.gridMain.config();
    if (this.pendingVerticalDelta === 0 || this.verticalWheelDirection === null)
      return;
    const i = this.verticalWheelDirection, s = t.rowLength;
    if (!this.canMoveVertical(i, e, s)) {
      this.clearVerticalWheel();
      return;
    }
    const r = this.getWheelTicks(this.pendingVerticalDelta, this.verticalDirectionChanged);
    if (r <= 0)
      return;
    const o = this.getVerticalWheelSpeed();
    this.moveVerticalScroll({
      direction: i,
      speed: o * r
    }), this.consumeVerticalDelta(r), this.verticalDirectionChanged = !1, this.canMoveVertical(i, e, s) || this.clearVerticalWheel();
  }
  canMoveHorizontal(e, t, i) {
    return e === O.LEFT ? t.left > 0 : t.left < i;
  }
  /**
   * 누적된 가로 wheel을 처리한다.
   */
  processHorizontalWheel() {
    const { scroll: e } = this.gridMain.config();
    if (this.pendingHorizontalDelta === 0 || this.horizontalWheelDirection === null)
      return;
    const t = this.horizontalWheelDirection, i = e.hTrackWidth - e.hThumbWidth;
    if (!this.canMoveHorizontal(t, e, i)) {
      this.clearHorizontalWheel();
      return;
    }
    const n = this.getWheelTicks(this.pendingHorizontalDelta, this.horizontalDirectionChanged);
    if (n <= 0)
      return;
    const r = this.getHorizontalWheelSpeed();
    this.moveHorizontalScroll({
      direction: t,
      speed: r * n
    }), this.consumeHorizontalDelta(n), this.horizontalDirectionChanged = !1, this.canMoveHorizontal(t, e, i) || this.clearHorizontalWheel();
  }
  /**
   * wheel delta를 tick으로 변환한다.
   */
  getWheelTicks(e, t) {
    const i = Math.floor(Math.abs(e) / ne.WHEEL_TICK);
    return i > 0 ? Math.min(i, ne.MAX_TICKS_PER_FRAME) : t ? 1 : 0;
  }
  /**
   * 세로 wheel의 row 이동 속도를 반환한다.
   */
  getVerticalWheelSpeed() {
    const e = this.opts.scroll.vertical.speed;
    return e > 0 ? e : ne.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 가로 wheel의 이동 속도를 반환한다.
   */
  getHorizontalWheelSpeed() {
    const e = this.opts.scroll.horizontal.speed;
    return e > 0 ? e : ne.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 처리한 세로 wheel delta를 소비한다.
   */
  consumeVerticalDelta(e) {
    const t = e * ne.WHEEL_TICK;
    this.pendingVerticalDelta < 0 ? this.pendingVerticalDelta += t : this.pendingVerticalDelta -= t, Math.abs(this.pendingVerticalDelta) < ne.WHEEL_TICK && (this.pendingVerticalDelta = 0);
  }
  /**
   * 처리한 가로 wheel delta를 소비한다.
   */
  consumeHorizontalDelta(e) {
    const t = e * ne.WHEEL_TICK;
    this.pendingHorizontalDelta < 0 ? this.pendingHorizontalDelta += t : this.pendingHorizontalDelta -= t, Math.abs(this.pendingHorizontalDelta) < ne.WHEEL_TICK && (this.pendingHorizontalDelta = 0);
  }
  /**
   * 세로 wheel 상태를 초기화한다.
   */
  clearVerticalWheel() {
    this.pendingVerticalDelta = 0, this.verticalWheelDirection = null, this.verticalDirectionChanged = !1;
  }
  /**
   * 가로 wheel 상태를 초기화한다.
   */
  clearHorizontalWheel() {
    this.pendingHorizontalDelta = 0, this.horizontalWheelDirection = null, this.horizontalDirectionChanged = !1;
  }
  /**
   * 처리할 wheel이 남아있는지 확인한다.
   */
  hasPendingWheel() {
    return Math.abs(this.pendingVerticalDelta) >= ne.WHEEL_TICK || Math.abs(this.pendingHorizontalDelta) >= ne.WHEEL_TICK || this.verticalDirectionChanged || this.horizontalDirectionChanged;
  }
  /**
   * 브라우저별 wheel delta를 동일한 기준으로 변환한다.
   */
  normalizeWheelDelta(e) {
    let t = e.deltaY;
    return !Number.isFinite(t) || t === 0 ? 0 : (e.deltaMode === 1 ? t *= 16 : e.deltaMode === 2 && (t *= this.gridMain.config().dimensions.mainHeight), t);
  }
  /**
   * 세로 스크롤을 이동한다.
   */
  moveVerticalScroll(e) {
    this.verticalScroll.moveVerticalScroll(e);
  }
  /**
   * 가로 스크롤을 이동한다.
   */
  moveHorizontalScroll(e) {
    this.horizontalScroll.moveHorizontalScroll(e);
  }
};
ne.WHEEL_TICK = 100, ne.DEFAULT_WHEEL_SPEED = 3, ne.MAX_TICKS_PER_FRAME = 2;
let Kt = ne;
class Xr {
  constructor(e, t, i) {
    this.isClick = !1, this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.cfg = this.gridMain.config(), this.isVauleFunction = A(e.getValue), this.hasCellClassName = !!i.cellClassName, this.summaryItem = i;
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
   * @returns
   */
  getValue() {
    const e = this.summaryItem, t = e.displayFormat ?? this.field?.displayFormat, s = this.cfg.dataManager.getAllRowItems(), n = e.expression, r = { formatValue: "" };
    return s.length > 0 && (n ? (r.value = A(n) ? n(s) : Hi(s, e), r.formatValue = r.value, t && (r.formatValue = Xt(r.value, t))) : e.label && (r.formatValue = e.label)), r;
  }
  setCellClassName(e, t) {
    if (!this.hasCellClassName) return;
    const i = this.cellClassNameCache.get(t), s = it(this.summaryItem.cellClassName, e);
    i?.length && t.classList.remove(...i), s.length > 0 ? (t.classList.add(...s), this.cellClassNameCache.set(t, s)) : this.cellClassNameCache.delete(t);
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return X.right;
  }
}
class Yr extends Xr {
  constructor(e, t, i) {
    super(e, t, i);
  }
  render(e, t) {
    const i = this.getValue();
    this.setCellClassName(i.value, t);
    const s = t.firstElementChild, n = i.formatValue;
    s.textContent !== n && (s.textContent = n), s.classList.remove("single-line", "multi-line"), le(n) && n.includes(`
`) ? s.classList.add("multi-line") : s.classList.add("single-line");
  }
}
class Zr {
  constructor(e) {
    this.gridMain = e, this.cfg = e.config();
    const t = e.options(), i = t.summary?.items ?? [];
    this._isActive = i?.length > 0, this._isActive && (this.summaryOpts = t.summary ?? {});
  }
  init() {
    if (this.summaryElement = this.gridMain.element().findDaraElement(".dg-summary"), !this._isActive) {
      this.summaryElement.getElement().remove();
      return;
    }
    this.initRenderer(), this.createTemplate(), this.drawData();
  }
  initRenderer() {
    const e = [], t = this.cfg.allFieldMap;
    for (const i of this.summaryOpts.items) {
      const s = [];
      for (const n of i) {
        const r = Se(n), o = t.get(r) ?? G({}, n, { name: r });
        n.$alignStyle = X[n.align ?? o.align] ?? (o.$alignStyle || X.left), s.push(new Yr(o, this.gridMain, n));
      }
      e.push(s);
    }
    this.allSummaryRenders = e;
  }
  isEnabled() {
    return this._isActive;
  }
  getElement() {
    return this.summaryElement;
  }
  setGridPanelWidth(e, t, i) {
    this.isEnabled() && (this.leftElement.css({ width: e + "px" }), this.centerElement.css({ "margin-left": e + "px", width: t + "px" }), this.rightElement.css({ width: i + "px" }));
  }
  setCenterElementStyle(e) {
    this.isEnabled() && this.centerElement.css(e);
  }
  drawData() {
    if (!this.isEnabled()) return;
    const e = this.allSummaryRenders, t = this.summaryElement;
    for (let i = 0; i < e.length; i++)
      for (const s of e[i]) {
        const n = s.getCol();
        if (n) {
          const r = t.find(`[data-cell-position="${i},${n}"]`);
          if (r.firstElementChild) {
            const o = {
              r: i,
              c: n
            };
            s.render(o, r);
          }
        }
      }
  }
  createTemplate() {
    const e = this.cfg, t = this.summaryElement;
    if (t.css({ height: `${e.dimensions.mainSummaryHeight}px` }), this.summaryOpts.position === "top") {
      t.addClass("dg-top");
      const h = this.gridMain.element().find(".dg-panels");
      h?.insertBefore(t.getElement(), h.querySelector(".dg-body"));
    }
    this.leftElement = t.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = t.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = t.findDaraElement('.dg-region[data-region="right"]'), this.leftElement.html(this.template("left")), this.centerElement.html(this.template("center")), this.rightElement.html(this.template("right"));
    const { fieldHeaderGroup: i, fixedLeftIndex: s, fixedRightIndex: n, summary: r } = e, o = i.leafLeft, l = i.leafCenter, c = i.leafRight;
    [
      { name: "left", fields: o, element: this.leftElement, startCol: 0 },
      { name: "center", fields: l, element: this.centerElement, startCol: s },
      { name: "right", fields: c, element: this.rightElement, startCol: n }
    ].forEach(({ fields: h, element: u, startCol: g }) => {
      h.length !== 0 && u.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(r, h, g));
    });
  }
  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(e) {
    const t = this.gridMain.config();
    let i, s = 0;
    e == "left" ? i = t.fieldHeaderGroup.leafLeft : e == "right" ? (s = t.fixedRightIndex, i = t.fieldHeaderGroup.leafRight) : (s = t.fixedLeftIndex, i = t.fieldHeaderGroup.leafCenter);
    const n = [];
    let r = s;
    for (const o of i) {
      const l = o.$width;
      n.push(
        `<th data-col-idx="${r++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${l}px;"></th>`
      );
    }
    return S`<table class="dg-body-table"><thead><tr>${n.join("")}</tr></thead><tbody></tbody></table>${e == "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
  /**
   * row template
   *
   * @private
   @param {SummaryConfig} summaryConfig summary 설정
   @param {number} startCol 시작 col
   * @param {FieldItem[]} fields fields 정보
   * @returns {string} template
   */
  rowTemplate(e, t, i) {
    const s = [], n = e.heights, r = this.allSummaryRenders, o = r.length, l = {};
    for (let c = 0; c < o; c++) {
      const d = c, h = r[c], u = [];
      let g = 0;
      const f = n[c];
      for (let m = 0; m < t.length; m++) {
        let p = t[m];
        const y = h.find((w) => w.getFieldInfo().name === p.name);
        if (y && (p = { ...p, ...y.getSummaryItem(), name: p.name }), g > 0) {
          --g;
          continue;
        }
        if (l[m] > 0) {
          l[m] = l[m] - 1;
          continue;
        }
        const I = [];
        if (p.colspan && (g = p.colspan - 1, I.push(` colspan="${p.colspan}" scope="colgroup" `)), p.rowspan && (l[m] = p.rowspan - 1, I.push(` rowspan="${p.rowspan}" `)), p.$isAside)
          u.push(S`<td scope="col" class="dg-cell dg-aside" ${I.join("")} data-cell-position="${d},${i + m}" ><div role="presentation" class="dg-cell-renderer ${p.$alignStyle}"></div></td>`);
        else {
          const { style: w, className: v } = Oi(p);
          u.push(S`<td scope="col" class="dg-cell" ${I.join(" ")} data-cell-position="${d},${i + m}" ><div role="presentation" style="height:${f - 2}px;max-height:${f - 2}px;${w}" class="dg-cell-renderer dg-ellipsis dg-text ${p.$alignStyle} ${v}" ></div></td>`);
        }
      }
      s.push(S`<tr class="dg-row" data-row="${d}" style="height:${f}px">${u.join("")}</tr>`);
    }
    return s.join("");
  }
}
class fs {
  constructor(e) {
    this.allFieldNames = [], this.cfg = e.config(), this.searchOpts = e.options().search, this.gridMain = e;
    const t = this.searchOpts, i = [];
    for (const s of this.cfg.currentFields)
      s.$isAside || i.push(s.name);
    this.allFieldNames = i, this.defaultSearchOpts = G(
      {
        matchCase: !1,
        matchWholeWord: !1,
        useRegex: !1,
        searchFields: P,
        matchWholeRegex: Di,
        hideNonMatched: !1,
        direction: Fe.NEXT
      },
      {
        matchWholeRegex: t.matchWholeRegex ?? !1,
        hideNonMatched: t.hideNonMatched ?? !1
      }
    );
  }
}
class Jr extends fs {
  constructor(e) {
    super(e);
  }
  openSearch() {
    return !0;
  }
  search(e, t) {
    const i = this.gridMain.config(), s = G({}, this.defaultSearchOpts, t);
    s.searchFields == P && (s.searchFields = this.allFieldNames), e == "" ? (i.searchEnabled = !1, this.setMatchCountText(!0), this.gridMain.getBody().clearSearchHighlight()) : i.searchEnabled = !0, i.dataManager.search(e, s), this.gridMain.refreshBody(!0, "search");
    const n = this.cfg.searchMatchInfo;
    return { count: n.matchCount, matchIndex: n.currentMatchIndex };
  }
  setMatchCountText(e = !1) {
  }
}
class Qr extends fs {
  constructor(e) {
    super(e), this.createTemplate();
  }
  openSearch() {
    const e = this.gridMain, t = e.getRendererLayerElement(), i = this.searchElement, s = i.style, n = e.getHeader().getHeaderElement().find(".dg-search-icon"), r = bt(t, n, i);
    return s.top = `${r.top - 5}px`, s.left = `${r.left + 12}px`, e.openLayer(i), this.searchTextElement.focus(), !0;
  }
  createTemplate() {
    this.searchOpts.mode != "full" && this.simpleTemplate();
  }
  /**
   * simple search template
   *
   * @private
   */
  simpleTemplate() {
    const e = this.gridMain, t = e.getRendererLayerElement(), i = this.cfg.currentFields;
    let s = this.searchElement;
    if (!s) {
      const n = [];
      s = Re("div", "dg-search-simple", "help-tooltip"), n.push(
        `<select class="dg-search-field"><option value="${P}">${j(e.i18n().getMessage("all"))}</option>`
      );
      for (const r of i)
        r.$isAside || n.push(`<option value="${j(String(r.name))}">${j(String(r.label ?? ""))}</option>`);
      n.push("</select>"), n.push(S`<div class="dg-search-container"><input type="text" class="dg-search-text" placeholder="Search" /><div class="dg-search-icons"><button class="dg-icon-button" type="button" data-search-type="mc" title="Match Case">Aa</button><button class="dg-icon-button" type="button" data-search-type="mww" title="Match Whole Word"><span class="dg-whole-word-icon">ab</span></button><button class="dg-icon-button" type="button" data-search-type="regex" title="Use Regex">.*</button></div></div><span class="dg-search-btn"><span class="dg-btn dg-search-prev" title="${j(e.i18n().getMessage("prev"))}"></span><span class="dg-btn dg-search-next" title="${j(e.i18n().getMessage("next"))}"></span></span><span class="dgMatchCount"></span>`), s.innerHTML = n.join(""), t.appendChild(s), this.searchElement = s;
    }
    this.searchTextElement = s.querySelector(".dg-search-text"), this.searchFieldElement = s.querySelector(".dg-search-field"), this.matchCountElement = s.querySelector(".dgMatchCount"), this.initSimpleModeEvent();
  }
  /**
   *  init simple search event
   */
  initSimpleModeEvent() {
    const e = this.gridMain.config(), t = e.eventManager, i = e.searchParameter, s = this.searchTextElement;
    t.off(s, "keydown"), t.on({ el: s, type: "keydown" }, (l) => {
      l.stopPropagation(), !l.isComposing && (Ks(l) ? (l.preventDefault(), this.simpleSearch(Fe.NEXT)) : Pi(l) && this.gridMain.hideLayer(this.searchElement));
    });
    const n = this.searchElement.querySelector(".dg-search-prev");
    t.off(n, "pointerdown"), t.on({ el: n, type: "pointerdown" }, (l) => {
      $(l), this.simpleSearch(Fe.PREV);
    });
    const r = this.searchElement.querySelector(".dg-search-next");
    t.off(r, "pointerdown"), t.on({ el: r, type: "pointerdown" }, (l) => {
      $(l), this.simpleSearch(Fe.NEXT);
    });
    const o = this.searchElement.querySelectorAll(".dg-icon-button");
    t.off(o, "pointerdown"), t.on({ el: o, type: "pointerdown" }, (l) => {
      $(l);
      const c = l.currentTarget, d = c.dataset.searchType, h = !be(c, "on");
      d == "mc" ? i.matchCase = h : d == "mww" ? i.matchWholeWord = h : d == "regex" && (i.useRegex = h), Us(c, "on");
    });
  }
  search(e, t) {
    const i = this.gridMain.config(), s = G({}, this.defaultSearchOpts, t);
    s.searchFields == P && (s.searchFields = this.allFieldNames), this.searchTextElement.value = e, e == "" ? (i.searchEnabled = !1, this.setMatchCountText(!0), this.gridMain.getBody().clearSearchHighlight()) : i.searchEnabled = !0, i.dataManager.search(e, s), this.gridMain.refreshBody(!0, "search"), this.gridMain.getHeader().setSearchIcon(i.searchEnabled);
    const n = this.cfg.searchMatchInfo;
    return { count: n.matchCount, matchIndex: n.currentMatchIndex };
  }
  simpleSearch(e) {
    const t = this.searchTextElement.value, i = this.searchFieldElement.value || P, n = this.gridMain.config().searchParameter;
    n.searchText = t, n.searchFields = i, this.search(t, {
      matchCase: n.matchCase,
      matchWholeWord: n.matchWholeWord,
      useRegex: n.useRegex,
      searchFields: i,
      direction: e
    });
  }
  setMatchCountText(e = !1) {
    if (e) {
      this.matchCountElement.textContent = "";
      return;
    }
    const t = this.cfg.searchMatchInfo;
    t.matchCount > 0 ? this.matchCountElement.textContent = t.currentMatchIndex + "/" + t.matchCount : this.matchCountElement.textContent = "0/0";
  }
}
const eo = ["none", "horizontal", "vertical", "both"];
let to = 0, at = !1;
const fe = /* @__PURE__ */ new Map(), io = so(), Ze = class Ze {
  constructor(e, t, i, s) {
    this.openLayers = [], this.layerPositions = /* @__PURE__ */ new Map(), this.resizeFrame = null, this.destroyed = !1;
    const n = ir(i);
    yr(n, i, (o) => {
      this.remote?.goToPage(o);
    }), this.grid = e, this.language = new Ni(), s && this.language.setMessage(s), this.cfg = Ys(n), n.groupingFields?.length ? this.cfg.dataManager = new mr(n, this) : n.tree ? this.cfg.dataManager = new Xe(n, this) : this.cfg.dataManager = new cs(n, this), this.structureBuilder = new Tr(n, this), this.opts = n;
    const r = t.getAttribute(rt);
    r && fe.get(r) && fe.get(r)?.destroy(), this.$instanceId = r ?? `${As}${++to}`, this.orginStyle = t.style.cssText, t.setAttribute(rt, this.$instanceId), this.gridElement = new Ie(t), fe.set(this.$instanceId, this), n.dataSource && (this.remote = new Ir(this, e));
  }
  /**
   * 서버 연동 컨트롤러. dataSource 옵션이 없으면 오류를 던진다.
   */
  /** toolbar.remote 설정에 따른 자동 서버 조회. dataSource가 없으면 무시한다. */
  searchByToolbar(e) {
    this.remote?.searchByToolbar(e);
  }
  getRemote() {
    if (!this.remote) throw new b("CONFIG", "dataSource option is not configured");
    return this.remote;
  }
  init() {
    const e = this.opts;
    if (this.initGridSize = {
      height: e.height == "auto" ? -1 : e.height,
      width: e.width == "auto" ? -1 : e.width
    }, this.initElement(), this.calculation(), this.initMainView(), this.initEvent(), this.initDocumentGlobalEvent(), e.dataSource?.autoLoad) {
      const t = this.remote;
      Promise.resolve().then(() => t?.load()).catch(() => {
      });
    }
  }
  /**
   * grid 전체 이벤트
   */
  initDocumentGlobalEvent() {
    at || (at = !0, document.addEventListener("pointerdown", Ze.globalPointerDownHandler));
  }
  static getInstance(e) {
    let t;
    return le(e) ? t = e : t = e instanceof HTMLElement ? e?.getAttribute(rt) : "", t ? fe.get(t)?.grid ?? null : null;
  }
  static allInstance() {
    return fe;
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
    const e = this.cfg, t = this.opts, i = io.content.firstElementChild.cloneNode(!0), s = i.querySelector(".empty-text");
    s && (s.textContent = this.i18n().getMessage("no.data")), this.gridElement.getElement().appendChild(i), this.gridKeyInput = i.querySelector(".dg-text-editor"), this.gridKeyInput.id = "dg_text_" + this.$instanceId, this.cfg.disableVerticalScroll && i.classList.add("dg-auto-height"), this.layoutElement = new Ie(this.gridElement.find(".daracl-grid .dg-layout")), this.setGridStyle(this.opts.style), this.rendererLayerElement = this.gridElement.find(".dg-layers"), this.mainElement = new Ie(this.gridElement.find(".dg-main"));
    const n = t.hoverMode ? ct[t.hoverMode] ?? ct.cell : ct.cell;
    this.mainElement.addClass(
      t.selectionMode === "none" ? "dg-select" : "dg-noselect",
      "dg-body-hover-" + n
    ), this.setTheme(this.opts.theme);
    const r = window.getComputedStyle(this.mainElement.getElement());
    e.fontFamily = r.fontFamily, e.fontSize = r.fontSize;
    const l = document.createElement("canvas").getContext("2d");
    l.font = r.fontSize + " " + r.fontFamily, e.canvasContext = l;
  }
  /**
   * init main object viewer
   *
   * @private
   */
  initMainView() {
    const e = this.opts;
    this.toolbar = new Cr(this), this.selectionInfo = new rr(this, e, this.cfg), this.header = new qr(this), this.body = new Or(this), this.summary = new Zr(this), e.search.enabled ? this.dataSearch = new Qr(this) : this.dataSearch = new Jr(this), this.scroll = new Kt(this), this.footer = new Lr(this), this.contextMenu = new Pr(this), this.toolbar.init(), this.selectionInfo.initSelection(), this.body.init(), this.summary.init(), this.footer.init(), this.scroll.init(), this.contextMenu.init(), this.refreshBody(!0, "init");
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
    const e = this.cfg;
    this.initResizeEvent();
    const t = this.rendererLayerElement;
    e.eventManager.on({ el: this.mainElement.getElement(), type: "mousedown" }, (n) => {
      n.composedPath().includes(t) || (n?.preventDefault(), this.setGridFocusIn(n));
    });
    const i = t, s = `[${Ai}]`;
    e.eventManager.off(i, "wheel DOMMouseScroll"), e.eventManager.on(
      { el: i, type: "wheel DOMMouseScroll" },
      (n) => {
        const o = n.target.closest(s);
        if (o == null) return;
        const l = n.deltaY, c = o.scrollTop === 0, d = o.scrollTop + o.clientHeight >= o.scrollHeight;
        return n.stopPropagation(), (l < 0 && c || l > 0 && d) && n.preventDefault(), !0;
      },
      { passive: !1 }
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
      const t = e.target;
      (t.closest(".dg-empty-overlay") != null || t.closest(".dg-body") == null && t.closest(".dg-layers") == null) && this.hideLayer();
    }
    document.activeElement != this.gridKeyInput && this.gridKeyInput.focus(), this.cfg.focus = !0;
  }
  /**
   * grid focus out
   *
   * @public
   * @param {Event} e event
   */
  setGridFocusOut(e) {
    if (this.cfg.focus) {
      if (!e) {
        this.cfg.focus = !1, this.hideLayer();
        return;
      }
      if (e.button !== 2) {
        const t = this.gridKeyInput;
        let i;
        if (e.type.startsWith("focus") ? i = e.relatedTarget : i = e.target, i?.closest(".dg-hidden-layers") !== null && i.closest(".dg-outer-layer")?.dataset.gridLayerId == this.$instanceId) {
          requestAnimationFrame(() => {
            t.focus();
          });
          return;
        }
        this.cfg.focus = !1, this.hideLayer();
      }
    }
  }
  openLayer(e, t) {
    e.style.display = "block", this.cfg.isOpenLayer = !0, this.openLayers.includes(e) || this.openLayers.push(e), t ? (this.layerPositions.set(e, t), t()) : this.layerPositions.delete(e);
  }
  hideLayer(e) {
    if (e != "all" && fe.size > 1 && fe.forEach((t, i) => {
      i != this.$instanceId && t.setGridFocusOut();
    }), !(this.openLayers.length < 1)) {
      if (e) {
        let t;
        (e == "vscroll" || e == "hscroll") && (t = Ae);
        for (let i = this.openLayers.length - 1; i >= 0; i--) {
          const s = this.openLayers[i];
          if (t && s.classList.contains(t))
            this.layerPositions.delete(s), s.style.display = "none", this.openLayers.splice(i, 1);
          else if (e == s) {
            this.layerPositions.delete(s), s.style.display = "none", this.openLayers.splice(i, 1);
            break;
          }
        }
        this.cfg.isOpenLayer = this.openLayers.length > 0;
        return;
      }
      this.cfg.isOpenLayer = !1, this.layerPositions.clear();
      for (let t = this.openLayers.length - 1; t >= 0; t--) {
        const i = this.openLayers[t];
        i.style.display = "none", this.openLayers.splice(t, 1);
      }
      this.cfg.activeComponent = "";
    }
  }
  /**
   * resize event
   *
   * @private
   */
  initResizeEvent() {
    const e = this.opts, t = e.windowResizeDelay ?? 50, i = this.gridElement, s = e.width === "auto" || e.height === "auto";
    if (s && typeof ResizeObserver < "u") {
      const o = i.getElement(), l = new ResizeObserver(() => {
        this.resize(i);
      });
      l.observe(o), this.resizeObserver = l;
    }
    const n = Rs(() => this.resize(i), t), r = () => {
      (this.layerPositions.size > 0 || s && !this.resizeObserver) && n();
    };
    this.cancelWindowResize = n.cancel, this.windowResizeHandler = r, window.addEventListener("resize", r);
  }
  /**
   * resize event 처리
   *
   * @param el grid element
   */
  resize(e) {
    if (this.destroyed || this.resizeFrame !== null) return;
    const t = this.initGridSize, i = t.width < 0, s = t.height < 0, n = this.cfg.disableVerticalScroll;
    this.resizeFrame = requestAnimationFrame(() => {
      if (this.resizeFrame = null, this.destroyed || !Ts(e.getElement())) return;
      const r = {
        width: i ? n ? e.clientWidth() : e.width() : t.width,
        height: s ? e.height() : t.height
      };
      (this.currentSize.height !== r.height || this.currentSize.width !== r.width) && (this.setSize(r.width, r.height, !0), this.toolbar && this.toolbar.resizeArrowVisibility());
      for (const [o, l] of this.layerPositions)
        o.isConnected && o.style.display !== "none" && l();
    });
  }
  /**
   * grid size 및 field 정보 계산
   */
  calculation() {
    this.structureBuilder.buildFields(), this.cfg.dataManager.setItems(this.opts.items), this.setSize(this.initGridSize.width, this.initGridSize.height, !1), this.structureBuilder.calcGridDimension(), this.calcBody();
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
  setSize(e, t, i = !1) {
    this.currentSize = { width: e, height: t }, i && this.resizeDraw();
  }
  resizeDraw() {
    this.calcBody(), this.refreshBody(!1, "resizeDraw");
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
    const e = this.cfg.currentFields, t = this.header.getHeaderElement(), i = this.body.getBodyElement(), s = this.summary.getElement(), n = this.header.isEnabled(), r = this.cfg.dataInfo.rowLength > 0, o = this.summary.isEnabled();
    for (let l = 0; l < e.length; l++) {
      const c = e[l], d = `th[data-col-idx="${l}"]`, h = `${c.$width}px`;
      n && (t.find(d).style.width = h), r && (i.find(d).style.width = h), o && (s.find(d).style.width = h);
    }
  }
  setElementDimensions() {
    const t = this.cfg.dimensions;
    this.mainElement.setHeight(t.mainHeight), this.mainElement.findDaraElement(".dg-body").setHeight(t.mainBodyHeight), this.layoutElement.css({
      width: t.width + "px",
      height: t.height + "px"
    });
    const i = {};
    this.initGridSize.width > 0 && (i.width = t.width + "px"), this.initGridSize.height > 0 && (i.height = t.height + "px"), this.gridElement.css(i);
    const s = t.mainLeftWidth, n = t.mainCenterWidth, r = t.mainRightWidth;
    this.header.setGridPanelWidth(s, n, r), this.body.setGridPanelWidth(s, n, r), this.summary.setGridPanelWidth(s, n, r), this.changeScrollMode();
  }
  /**
   * change scroll mode
   *
   */
  changeScrollMode() {
    const e = this.cfg, t = e.scrollbarSize, i = (e.scroll.enabledHorizontal ? 1 : 0) + (e.scroll.enabledVertical ? 2 : 0), s = this.mainElement.find(".dg-panels").style;
    s.removeProperty("height"), s.removeProperty("width"), e.scroll.enabledHorizontal && (s.height = `calc(100% - ${t})`), e.scroll.enabledVertical && (s.width = `calc(100% - ${t})`), i == 0 ? this.mainElement.removeAttr("data-scroll") : this.mainElement.setAttr({ "data-scroll": eo[i] });
  }
  /**
   * set data
   *
   * @param {any[]} items
   */
  setItems(e) {
    this.cfg.dataManager.setItems(e), this.header?.setCheckboxStyle("none"), this.scroll.moveVerticalScroll({ rowIdx: 0 }), this.refreshBody(!0, "setItems");
  }
  refreshBody(e, t) {
    if (this.scroll.calculate(), this.setElementDimensions(), this.fieldResize(), e) {
      this.getBody().dataDraw("refreshBody-" + t);
      return;
    }
    if (t == "resizeDraw") {
      const i = this.cfg.scroll;
      (i.before.startIdx !== i.startIdx || i.before.viewRow !== i.viewRow || i.before.startCol !== i.startCol || i.before.endCol !== i.endCol) && this.getBody().dataDraw("refreshBody-" + t);
    }
  }
  /**
   * 데이터를 추가
   *
   * @param items - 추가할 행 데이터 배열
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   * @returns void
   */
  addItems(e, t) {
    const i = this.cfg.dataManager.addItems(e, t, V.READ);
    i > -1 && (this.scroll.moveVerticalScroll({ rowIdx: i, drawFlag: !1 }), this.getBody().dataDraw("refreshBody-addItems"));
  }
  /**
   * 서버에서 받은 데이터를 목록 끝에 붙입니다(infinite 페이징). 스크롤 위치는 유지하고 Undo 이력은 남기지 않습니다.
   *
   * @param items 추가할 행 데이터 배열
   */
  appendItems(e) {
    this.cfg.dataManager.appendItems(e) > -1 && (this.refreshBody(!0, "appendItems"), this.refreshCheckboxStyle());
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
  createItem(e, t) {
    const i = this.cfg.dataManager.createItem(e, t);
    i > -1 && (this.scroll.moveVerticalScroll({ rowIdx: i, drawFlag: !1 }), this.getBody().dataDraw("refreshBody-addItems"));
  }
  /**
   * item을 삭제
   *
   * @param {any[]} ids rowId
   */
  removeItems(e) {
    this.cfg.dataManager.removeItems(e), this.refreshBody(!0, "removeItems");
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
  getCheckedItems(e) {
    const { dataManager: t } = this.cfg, i = t.getViewItems(), s = [];
    let n = [], r = !1;
    B(e) ? r = !0 : F(e) ? n = e : n = [e];
    for (const o of i) {
      const l = o.id;
      if (t.isItemChecked(l)) {
        const c = t.getRowItem(l);
        let d;
        if (r)
          d = c;
        else {
          d = {};
          for (const h of n)
            d[h] = c[h];
        }
        s.push(d);
      }
    }
    return s;
  }
  /**
   * get check items
   *
   * @public
   * @param {string} name field name
   * @returns {*} name 값만 리턴
   */
  getCheckedItemByName(e) {
    return this.getBody().getCheckedItemByName(e);
  }
  getCheckedIds() {
    return this.getBody().getCheckedItemByName(R.ID);
  }
  /**
   * all check
   *
   * @public
   * @param {boolean} checked
   */
  setAllCheckedItems(e) {
    if (!this.cfg.isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getHeader().setAllCheckItem(e);
  }
  /**
   * name value item check
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  setCheckedItemByValue(e, t) {
    this.getBody().setCheckedItemByValue(e, t);
  }
  /**
   * add check item
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  addCheckedItemByValue(e, t) {
    if (!this.cfg.isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getBody().addCheckedItemByValue(e, t);
  }
  /**
   * un checked
   *
   * @public
   * @param {string} name field name
   * @param {*} values field values
   */
  unCheckedItemByValue(e, t) {
    this.getBody().unCheckedItemByValue(e, t);
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
  setTheme(e) {
    const t = e ? Ws[e] : "";
    if (e && !t) return;
    const i = this.cfg;
    if (i.theme === t) return;
    i.theme = t;
    const s = this.layoutElement.getElement().closest(".daracl-grid");
    s && (t ? s.setAttribute("data-daracl-theme", t) : s.removeAttribute("data-daracl-theme"));
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
  setGridStyle(e) {
    if (!dt[e])
      return;
    const t = Object.values(dt).filter((n) => n !== e).map((n) => `dg-style-${n}`), i = this.layoutElement, s = "dg-style-" + dt[e];
    i.removeClass(...t), i.hasClass(s) || i.addClass(s);
  }
  /**
   * tree 확장
   * @param id id
   */
  expandRow(e) {
    this.cfg.dataManager.expandRow(e);
  }
  expandAll() {
    const e = this.cfg.dataManager;
    e instanceof Xe && (e.expandAll(), this.refreshBody(!0, "expandAll"));
  }
  collapseAll() {
    const e = this.cfg.dataManager;
    e instanceof Xe && (e.collapseAll(), this.refreshBody(!0, "collapseAll"));
  }
  setPaging(e) {
    this.opts.paging = e, this.cfg.paging = e, this.footer && this.footer.setPagingTemplate(e);
  }
  /**
   * 헤더 전체 체크박스를 현재 체크 상태에 맞춥니다. 행이 추가돼 체크된 행의 비율이 바뀐 뒤에 호출합니다.
   * 체크된 행이 없으면 계산하지 않고 'none'으로 둡니다.
   */
  refreshCheckboxStyle() {
    const e = this.cfg.dataManager;
    if (e.getCheckedCount() === 0) {
      this.header?.setCheckboxStyle("none");
      return;
    }
    const t = e.getViewItems().filter((s) => !s.groupRowType), i = t.filter((s) => e.isItemChecked(s.id)).length;
    this.header?.setCheckboxStyle(Ki(i, t.length));
  }
  /**
   * infinite 페이징의 다음 페이지 조회 조건을 확인합니다.
   *
   * @param idleScroll 스크롤 위치가 바뀌지 않은 입력(이미 끝에서 더 스크롤)이면 true
   */
  checkLoadMore(e = !1) {
    this.remote?.checkLoadMore(e);
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
  setToolbarValues(e) {
    return this.toolbar.setValues(e);
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = !0, this.resizeFrame !== null && (cancelAnimationFrame(this.resizeFrame), this.resizeFrame = null), this.cancelWindowResize?.(), this.layerPositions.clear(), this.remote?.destroy();
    const e = this.gridElement, t = this.$instanceId, i = this.cfg;
    this.scroll?.destroy(), this.toolbar?.destroy(), this.body.destroy(), this.contextMenu?.destroy(), i.allFieldMap.forEach((n) => {
      n.$renderer?.destroy(), n.$editRenderer?.destroy();
    }), i.eventManager.destroy(), e.removeAttr(rt);
    const s = e.getElement();
    for (this.resizeObserver && (this.resizeObserver.unobserve(s), this.resizeObserver.disconnect()), this.windowResizeHandler && window.removeEventListener("resize", this.windowResizeHandler), s.style.cssText = this.orginStyle; s.firstChild; )
      typeof s.firstChild.remove == "function" ? s.firstChild.remove() : s.removeChild(s.firstChild);
    fe.delete(t), fe.size === 0 && at && (document.removeEventListener("pointerdown", Ze.globalPointerDownHandler), at = !1);
  }
};
Ze.globalPointerDownHandler = (e) => {
  const t = e.composedPath();
  fe.forEach((i) => {
    const s = i.gridElement.getElement();
    t.includes(s) || i.setGridFocusOut(e);
  });
};
let Ve = Ze;
function so() {
  const a = document.createElement("template");
  return a.innerHTML = S`<div class="daracl-grid"><div class="dg-layers"></div><div class="dg-viewport"><input type="text" class="dg-text-editor" inputmode="none" /><div class="dg-layout" style="user-select:none;touch-action:manipulation;"><div class="dg-toolbar dg-select" role="presentation"><div class="dg-toolbar-scroll"></div><div class="dg-toolbar-arrow dg-noselect"><button type="button" class="dg-button" data-direction="left">${he.scrollLeft}</button><button type="button" class="dg-button" data-direction="right">${he.scrollRight}</button></div></div><div class="dg-main" data-scroll="none"><div class="dg-panels"><div class="dg-panel dg-header"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div></div><div class="dg-panel dg-body"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div><div class="dg-empty-overlay"><span class="dg-empty-message"><i class="dg-icon-info"></i><span class="empty-text"></span></span></div><div class="dg-drop-indicator"></div></div><div class="dg-panel dg-summary"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div></div></div><div class="dg-resize-helper"></div><div class="dg-scroll-container"><div class="dg-scroll dg-vertical"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button" data-dg-mode="up" style="top:0px;">${he.scrollUp}</div><div class="dg-scroll-button" data-dg-mode="down" style="bottom:0px;">${he.scrollDown}</div></div><div class="dg-scroll dg-horizontal"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button" data-dg-mode="left" style="left:0px;">${he.scrollLeft}</div><div class="dg-scroll-button" data-dg-mode="right" style="right:0px;">${he.scrollRight}</div></div><div class="dg-scroll-corner"></div><div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;"><textarea class="dg-paste-area"></textarea></div></div></div><div class="dg-footer" role="presentation"><span class="dg-status"><span class="dg-selection-status"></span></span><span class="dg-paging"></span><span class="dg-paging-info"></span></div></div></div></div>`, a;
}
function et(a) {
  return a == null ? "" : a instanceof Date ? a.toISOString() : typeof a == "object" ? JSON.stringify(a) : String(a);
}
function no() {
  return import("./PdfConverter-xne3njiQ.mjs");
}
function ro(a, e) {
  return a.map((t) => {
    const i = t.$renderer;
    if (t.renderer?.type === "password") return "********";
    if (t.renderer?.type === "hidden") return "";
    const s = i.getValue(e);
    if (i instanceof Y && ["dropdown", "link", "button"].includes(t.renderer?.type)) {
      const n = i.getRefValue(s, e);
      if (typeof n == "string") return n;
      if (n?.hide) return "";
      if (n?.label !== void 0) return et(n.label);
      if (i instanceof is) {
        let r = i.getLabel(s);
        if (r.length === 0 && t.defaultValue && (r = i.getLabel(t.defaultValue)), r.length > 0) return r.join(t.editRenderer?.listItem?.delimiter ?? ",");
      }
    }
    return et(s);
  });
}
class ms {
  constructor(e) {
    this.context = e;
  }
  render() {
    const { fields: e, viewItems: t } = this.context, i = {
      columns: [...this.context.lineNumberField ? [this.context.lineNumberField] : [], ...e].map((n) => ({
        name: n.name,
        label: n.label,
        width: n.$width,
        align: n.align ?? (n.$alignStyle === X.right ? "right" : n.$alignStyle === X.center ? "center" : "left")
      })),
      rows: t.map((n, r) => {
        const o = this.renderRow(n);
        return this.context.lineNumberField ? [String((this.context.lineNumberStart ?? 0) + r + 1), ...o] : o;
      })
    };
    this.context.tableBorders && (i.tableBorders = this.context.tableBorders);
    const s = this.context.getCellStyles;
    if (s) {
      const n = t.map((o, l) => s(o, l)), r = n.map((o) => o.backgrounds);
      r.some((o) => o.some((l) => l !== void 0)) && (i.cellBackgrounds = r), i.cellBorders = n.map((o) => o.borders), i.cellTextColors = n.map((o) => o.textColors ?? []);
    }
    if (this.context.getCellCharts) {
      const n = t.map((r, o) => this.context.getCellCharts?.(r, o) ?? []);
      i.cellCharts = n.map((r) => this.context.lineNumberField ? [void 0, ...r] : r);
    }
    if (this.context.getHeaderCellBorders && (i.headerCellBorders = this.context.getHeaderCellBorders()), this.context.getHeaderCellStyles) {
      const n = this.context.getHeaderCellStyles();
      i.headerBackgrounds = n.backgrounds, i.headerTextColors = n.textColors, i.headerGradients = n.gradients;
    }
    return i;
  }
  renderRow(e) {
    if (e.groupRowType)
      return this.context.fields.map(() => "");
    const t = this.context.getRowItem(e.id);
    return this.renderDataRow(t);
  }
  renderDataRow(e) {
    return ro(this.context.fields, e);
  }
}
class oo extends ms {
  render() {
    return this.previousDataItem = void 0, super.render();
  }
  renderRow(e) {
    const { fields: t, getRowItem: i } = this.context;
    if (!e.groupRowType) {
      const o = i(e.id), l = this.renderDataRow(o), c = this.groupingFields();
      return c.forEach((d, h) => {
        const u = t.find((f) => f.name === d), g = this.previousDataItem !== void 0 && c.slice(0, h + 1).every((f) => Object.is(o[f], this.previousDataItem?.[f]));
        u && g && (l[t.indexOf(u)] = "");
      }), this.previousDataItem = o, l;
    }
    const s = super.renderRow(e), n = new Set(this.context.summaryFieldNames), r = t.find((o) => !n.has(o.name)) ?? t[0];
    if (e.groupRowType === "group") {
      const o = t.find((l) => l.name === e.groupField) ?? t[0];
      return o && (s[t.indexOf(o)] = `${e.groupField}: ${et(e.groupValue)}`), s;
    }
    if (e.groupRowType === "groupSummary") {
      const o = e.groupField ? t.find((l) => l.name === e.groupField) ?? r : r;
      o && (s[t.indexOf(o)] = e.groupField ? `${et(e.groupValue)} 합계` : "Subtotal");
    } else r && (s[t.indexOf(r)] = "Grand Total");
    for (const [o, l] of Object.entries(e.groupSums ?? {})) {
      const c = t.findIndex((d) => d.name === o);
      c >= 0 && (s[c] = ki(l, this.context.summaryItems?.find((d) => Se(d) === o), t[c]));
    }
    return s;
  }
  groupingFields() {
    return this.context.groupingFields;
  }
}
class lo extends ms {
}
function Si(a, e, t) {
  const i = /* @__PURE__ */ new Map(), s = (o, l) => {
    for (const c of o) {
      if (c.hidden) continue;
      const d = [...l, c];
      c.children?.length ? s(c.children, d) : i.set(c.name, d);
    }
  };
  s(a, []);
  const n = e.map((o) => i.get(o.name) ?? [o]), r = Math.max(1, ...n.map((o) => o.length));
  if (r !== 1)
    return Array.from({ length: r }, (o, l) => {
      const c = [];
      for (let d = 0; d < n.length; ) {
        const h = n[d];
        if (l >= h.length) {
          d++;
          continue;
        }
        const u = h[l];
        let g = d + 1;
        for (; g < n.length && n[g][l] === u; ) g++;
        c.push({
          label: u.label ?? "",
          column: d,
          colSpan: g - d,
          rowSpan: l === h.length - 1 ? r - l : 1,
          background: t.headerBackgrounds?.[d],
          textColor: t.headerTextColors?.[d],
          gradient: t.headerGradients?.[d],
          borders: t.headerCellBorders?.[d]
        }), d = g;
      }
      return c;
    });
}
function ao() {
  return import("./ExcelExport-B3DYfdmT.mjs");
}
function co() {
  return import("./CsvExport-Jfqxygda.mjs");
}
function ho() {
  return import("./JsonExport-BQc31G09.mjs");
}
let Ft = null;
const uo = 5e3, Et = class Et {
  constructor(e, t, i) {
    if (this.pdfBarColors = null, e == null || B(e))
      throw new Error(`${e} grid element not found`);
    this.createGrid(e, t, i);
  }
  initGlobalConfig() {
    if (Ft === null || !Ft.isConnected) {
      const e = k("div", Zt.replace(".", ""));
      document.body.appendChild(e), Ft = e;
    }
  }
  static create(e, t, i) {
    return new Et(e, t, i);
  }
  static message(e) {
    Ni.setGlobalMessage(e);
  }
  static setDefaultOptions(e) {
    sr(e);
  }
  createGrid(e, t, i) {
    this.initGlobalConfig(), this.gridMain = new Ve(this, e, t, i), this.gridMain.init();
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
  static instance(e) {
    return Ve.getInstance(e);
  }
  /**
   * 모든 field 얻기
   */
  getFields() {
    return this.gridMain.config().currentFields;
  }
  /**
   * 현재 표시 대상의 실제 행 데이터를 반환한다.
   * 페이징은 현재 페이지, 검색은 검색 결과, 트리는 펼친 행만 포함한다.
   * 그룹 소계·총계와 내부 관리 필드는 제외한다.
   *
   * @returns 현재 표시 대상 행의 얕은 복사본 배열
   */
  getItems() {
    return this.gridMain.config().dataManager.getAllRowItems();
  }
  /**
   * 검색·페이징·트리 펼침 상태와 무관하게 로드된 전체 원본 행을 반환한다.
   * 트리는 자손을 포함한 평탄한 배열이며, soft 삭제 행도 포함한다.
   * 그룹 가상 행과 내부 관리 필드는 제외한다. 외부 페이징은 로드된 행만 반환한다.
   *
   * @returns 전체 원본 행의 얕은 복사본 배열
   */
  getAllItems() {
    return this.gridMain.config().dataManager.getSourceRowItems();
  }
  /**
   * 내보내기 가능한 현재 뷰의 모든 행을 PDF로 다운로드합니다.
   *
   * 사용자 정의 글꼴은 fetch 등의 방법으로 읽은 ArrayBuffer 또는 Uint8Array로 전달합니다.
   */
  async exportPdf(e = {}) {
    const { PdfConverter: t } = await no(), i = this.gridMain.config(), s = i.currentFields.filter((f) => !f.hidden && !f.$isAside), n = i.currentFields.find((f) => f.name === ye && !f.hidden), r = n ? [n, ...s] : s, o = this.gridMain.options(), l = this.createPdfCellStyleResolver(r, s), c = {
      fields: s,
      lineNumberField: n,
      lineNumberStart: o.footer.paging?.enabled ? (i.paging.page - 1) * i.paging.pageSize : 0,
      viewItems: i.dataManager.getViewItems(),
      groupingFields: o.groupingFields ?? [],
      summaryFieldNames: Je(o),
      summaryItems: o.groupSummaryFields,
      getRowItem: (f) => i.dataManager.getRowItem(f),
      getCellStyles: l.getCellStyles,
      getCellCharts: (f) => {
        if (f.groupRowType)
          return s.map(() => {
          });
        const m = i.dataManager.getRowItem(f.id);
        return s.map((p) => this.getPdfCellChart(p, m));
      },
      getHeaderCellBorders: l.getHeaderCellBorders,
      getHeaderCellStyles: l.getHeaderCellStyles,
      tableBorders: l.tableBorders
    }, d = c.groupingFields.length ? new oo(c) : new lo(c), h = new t();
    let u;
    try {
      u = d.render(), u.firstPageHeader = Si(o.fields, r, u);
    } finally {
      l.destroy();
    }
    const g = await h.convert(u, {
      ...e,
      fontUrl: e.fontUrl ?? o.pdfFontUrl
    });
    return h.download(g, e.fileName), g;
  }
  /** CSV를 필요한 시점에 로드하여 실제 데이터 행을 다운로드한다. */
  async exportCsv(e = {}) {
    const { CsvConverter: t, createCsvData: i } = await co(), s = i(this.createDataExportContext(e), e), n = new t(), r = n.convert(s.headers, s.rows, e);
    return n.download(r, e.fileName), r;
  }
  /** JSON 모듈을 필요한 시점에 로드하고 필드명을 키로 하는 행 배열을 다운로드한다. */
  async exportJson(e = {}) {
    const { JsonConverter: t, createJsonData: i } = await ho(), s = i(this.createDataExportContext(e), e), n = new t(), r = n.convert(s, e);
    return n.download(r, e.fileName), r;
  }
  /** CSV·JSON의 대상 행과 열을 선택하며 화면·선택 상태는 유지한다. */
  createDataExportContext(e) {
    const t = this.gridMain.config(), i = t.dataManager;
    let s = e.visibleOnly ? i.getViewItems() : i instanceof Xe ? i.getAllTreeViewItems() : i.getOriginalViewItems();
    if (e.selectedOnly) {
      const r = new Set(this.getSelectedRowIds());
      s = s.filter((o) => r.has(o.id));
    }
    let n = t.currentFields.filter((r) => !r.$isAside && !r.hidden);
    if (e.includeHiddenColumns) {
      const r = new hs(this.gridMain), o = new Map(n.map((c) => [c.name, c])), l = (c) => c.flatMap(
        (d) => d.children?.length ? l(d.children) : [o.get(d.name) ?? r.createRenderer({ ...d })]
      );
      n = l(this.gridMain.options().fields);
    }
    return {
      fields: n,
      viewItems: s,
      groupingFields: [],
      summaryFieldNames: [],
      getRowItem: (r) => i.getRowItem(r)
    };
  }
  /** 현재 뷰의 표시 값·그룹 합계·셀 병합을 XLSX로 다운로드한다. */
  async exportExcel(e = {}) {
    const { ExcelConverter: t, createExcelData: i } = await ao(), s = this.gridMain.config(), n = this.gridMain.options(), r = s.currentFields.filter((u) => !u.hidden && !u.$isAside), o = e.includeRowNumber === !1 ? void 0 : s.currentFields.find((u) => u.name === ye && !u.hidden), l = o ? [o, ...r] : r, c = this.createPdfCellStyleResolver(l, r), d = new t();
    let h;
    try {
      const u = i(
        {
          fields: r,
          lineNumberField: o,
          lineNumberStart: n.footer.paging?.enabled ? (s.paging.page - 1) * s.paging.pageSize : 0,
          viewItems: s.dataManager instanceof Xe && e.includeCollapsed !== !1 ? s.dataManager.getAllTreeViewItems() : s.dataManager.getViewItems(),
          groupingFields: n.groupingFields ?? [],
          summaryFieldNames: Je(n),
          summaryItems: n.groupSummaryFields,
          getRowItem: (g) => s.dataManager.getRowItem(g),
          getCellStyles: c.getCellStyles,
          getHeaderCellBorders: c.getHeaderCellBorders,
          getHeaderCellStyles: c.getHeaderCellStyles,
          rowHeight: s.rowHeight,
          getCellCharts: (g) => g.groupRowType ? r.map(() => {
          }) : r.map((f) => this.getPdfCellChart(f, s.dataManager.getRowItem(g.id)))
        },
        e.mergeCells === !1 ? [] : n.rowSpanFields ?? []
      );
      u.headerRows = Si(n.fields, l, u), h = d.convert(u, e);
    } finally {
      c.destroy();
    }
    return d.download(h, e.fileName), h;
  }
  createPdfCellStyleResolver(e, t) {
    const i = this.gridMain.config(), s = this.gridMain.options(), n = i.dataManager.getViewItems(), r = this.gridMain.element().getElement(), o = (...w) => w.map((v) => window.getComputedStyle(v).backgroundColor).find((v) => v && v !== "transparent" && v !== "rgba(0, 0, 0, 0)"), l = r.querySelector(".dg-body"), c = /* @__PURE__ */ new Map();
    this.pdfBarColors = null;
    const d = (w) => {
      for (let v = w; v && r.contains(v); v = v.parentElement) {
        const x = window.getComputedStyle(v), C = x.backgroundImage?.startsWith("linear-gradient(") ? x.backgroundImage.match(/rgba?\([^)]+\)/g) : void 0;
        if (C?.length === 2) return { startColor: C[0], endColor: C[1] };
        if (o(v)) return;
      }
    }, h = l?.querySelector('.dg-region[data-region="center"] .dg-body-table tbody') ?? l?.querySelector(".dg-body-table tbody");
    if (!l || !h)
      throw new Error("Unable to resolve grid cell styles for PDF export");
    const u = document.createElement("tr");
    u.className = "dg-row", u.style.visibility = "hidden", u.style.height = "0", u.setAttribute("aria-hidden", "true"), e.forEach(() => {
      const w = document.createElement("td");
      w.className = "dg-cell", u.appendChild(w);
    });
    const g = l.cloneNode(!1);
    g.classList.remove("dg-body-odd"), g.classList.add("dg-body-even"), g.style.position = "absolute", g.style.visibility = "hidden", g.style.pointerEvents = "none", g.style.height = "0", g.style.overflow = "hidden", g.setAttribute("aria-hidden", "true");
    let f = g;
    const m = [];
    for (let w = h; w && w !== l; w = w.parentElement)
      m.unshift(w);
    for (const w of m) {
      const v = w.cloneNode(!1);
      f.appendChild(v), f = v;
    }
    const p = u.cloneNode(!0);
    f.appendChild(u), f.appendChild(p), l.parentElement.appendChild(g);
    const y = e.map((w) => {
      const v = i.fieldHeaderGroup.leafLeft.includes(w) ? "left" : i.fieldHeaderGroup.leafRight.includes(w) ? "right" : "center";
      return r.querySelector(
        `.dg-header .dg-region[data-region="${v}"] [data-header-cell-position="${w.$resizeIdx}"]`
      ) ?? void 0;
    }), I = (w, v) => {
      const x = this.getPdfCellBorders(w);
      return v === e.length - 1 && r.querySelector(".dg-layout.dg-style-striped-cells") ? { ...x, right: void 0 } : x;
    };
    return {
      tableBorders: this.getPdfCellBorders(r.querySelector(".dg-main") ?? r),
      getCellStyles: (w, v) => {
        const x = v % 2, C = x === 0 ? u : p, T = C.cells, L = ["dg-row"];
        w.groupRowType && L.push(
          "dg-group-row",
          w.groupRowType === "group" ? "dg-group-header" : w.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary"
        );
        const E = L.join(" "), M = w.groupRowType ? void 0 : i.dataManager.getRowItem(w.id);
        let N;
        if (!w.groupRowType && v > 0)
          for (let z = v - 1; z >= 0; z--) {
            const K = n[z];
            if (K && !K.groupRowType) {
              N = i.dataManager.getRowItem(K.id);
              break;
            }
          }
        const H = e.map((z) => {
          const K = ["dg-cell"];
          if (z.name === ye && K.push("dg-aside", "dg-line-number"), w.groupRowType)
            K.push("dg-group-cell");
          else if (M) {
            z.cellClassName && t.includes(z) && K.push(
              ...it(z.cellClassName, {
                rowIdx: v,
                col: z.$colSeq,
                field: z,
                item: M
              })
            );
            const we = (s.groupingFields ?? []).indexOf(z.name);
            we >= 0 && N !== void 0 && (s.groupingFields ?? []).slice(0, we + 1).every((U) => Object.is(M[U], N?.[U])) && v < n.length - 1 && K.push("dg-group-continuation");
          }
          return K.join(" ");
        }), de = `${x}${E}${H.join("")}`, _ = c.get(de);
        if (_)
          return {
            backgrounds: _.backgrounds.slice(),
            borders: _.borders.slice(),
            textColors: _.textColors.slice()
          };
        C.className = E;
        const D = window.getComputedStyle(C).backgroundColor, q = e.map((z, K) => {
          const we = T[K];
          we.className = H[K];
          const ve = window.getComputedStyle(we).backgroundColor;
          return { background: ve && ve !== "transparent" && ve !== "rgba(0, 0, 0, 0)" ? ve : D && D !== "transparent" && D !== "rgba(0, 0, 0, 0)" ? D : o(l, r), borders: I(we, K), textColor: window.getComputedStyle(we).color };
        }), Ge = q.map((z) => z.background), Q = q.map((z) => z.borders), pe = q.map((z) => z.textColor || void 0);
        return c.size < uo && c.set(de, { backgrounds: Ge, borders: Q, textColors: pe }), { backgrounds: Ge.slice(), borders: Q.slice(), textColors: pe.slice() };
      },
      getHeaderCellBorders: () => y.map((w, v) => w ? I(w, v) : void 0),
      getHeaderCellStyles: () => ({
        gradients: y.map((w) => w ? d(w) : void 0),
        backgrounds: y.map(
          (w) => w ? o(w, w.parentElement ?? r, r) : void 0
        ),
        borders: y.map((w, v) => w ? I(w, v) : void 0),
        textColors: y.map((w) => w && window.getComputedStyle(w).color || void 0)
      }),
      destroy: () => g.remove()
    };
  }
  getPdfCellBorders(e) {
    const t = window.getComputedStyle(e);
    if ([
      t.borderTopWidth,
      t.borderRightWidth,
      t.borderBottomWidth,
      t.borderLeftWidth,
      t.borderTopStyle,
      t.borderRightStyle,
      t.borderBottomStyle,
      t.borderLeftStyle
    ].every((n) => n === ""))
      return;
    const s = (n, r, o) => {
      const l = Number.parseFloat(n);
      if (!Number.isFinite(l) || l <= 0 || o === "none" || o === "hidden" || r === "transparent" || r === "rgba(0, 0, 0, 0)")
        return;
      const c = ["dashed", "dotted", "double"].includes(o) ? o : void 0;
      return { width: l, color: r, ...c ? { style: c } : {} };
    };
    return {
      top: s(t.borderTopWidth, t.borderTopColor, t.borderTopStyle),
      right: s(t.borderRightWidth, t.borderRightColor, t.borderRightStyle),
      bottom: s(t.borderBottomWidth, t.borderBottomColor, t.borderBottomStyle),
      left: s(t.borderLeftWidth, t.borderLeftColor, t.borderLeftStyle)
    };
  }
  getPdfCellChart(e, t) {
    const i = e.renderer.type, s = e.$renderer.getValue(t);
    if (i === "bar" && e.$renderer instanceof ts) {
      const n = e.$renderer.getRefValue(s, t), r = Number(n?.percent ?? s);
      if (!Number.isFinite(r))
        return;
      if (!this.pdfBarColors) {
        const c = window.getComputedStyle(this.gridMain.element().getElement());
        this.pdfBarColors = {
          positive: c.getPropertyValue("--dui-bar-positive-bg").trim(),
          negative: c.getPropertyValue("--dui-bar-negative-bg").trim()
        };
      }
      const { positive: o, negative: l } = this.pdfBarColors;
      return {
        type: "bar",
        value: r,
        minimum: e.renderer.rule?.minimum ?? 0,
        maximum: e.renderer.rule?.maximum ?? 100,
        label: et(n?.label ?? s),
        color: r < 0 ? l || "#ff8989" : o || "#77c0fc"
      };
    }
    if (i === "sparkline" && e.$renderer instanceof ss || i === "sparklineBar" && e.$renderer instanceof ns) {
      const r = e.$renderer.getRefValue(s, t)?.value ?? s;
      return !Array.isArray(r) || !r.every((o) => typeof o == "number" && Number.isFinite(o)) ? void 0 : { type: i, values: [...r] };
    }
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
  setToolbarValues(e) {
    this.gridMain.setToolbarValues(e);
  }
  /**
   * item index 값으로 item 얻기
   *
   * @param {number[]} indexs index
   * @returns {{}}
   */
  getItemsByIndexs(e) {
    const t = [], i = this.gridMain.config().dataManager, s = i.getViewItems();
    for (const n of e) {
      const r = s[n];
      r && t.push(i.getRowItem(r.id));
    }
    return t;
  }
  selectRowById(e, t) {
    return this.gridMain.config().dataManager.selectRowById(e, t);
  }
  /**
   * 지정한 행 ID에 해당하는 데이터를 반환합니다.
   *
   * @param rowId 조회할 행의 ID
   * @returns 행 ID에 해당하는 데이터 객체
   */
  getItemById(e) {
    return this.gridMain.config().dataManager.getRowItem(e);
  }
  /**
   * 지정한 행 ID 목록에 해당하는 데이터들을 반환합니다.
   *
   * 반환되는 배열의 순서는 전달된 rowIds의 순서와 동일합니다.
   *
   * @param rowIds 조회할 행 ID 목록
   * @returns 행 ID 목록에 해당하는 데이터 객체 배열
   */
  getItemsByIds(e) {
    const t = [], i = this.gridMain.config().dataManager;
    for (const s of e)
      t.push(i.getRowItem(s));
    return t;
  }
  setPaging(e) {
    this.gridMain.setPaging(e);
  }
  /**
   * set items
   *
   * @param {any[]} items
   */
  setItems(e) {
    this.gridMain.setItems(e);
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
  addItems(e, t) {
    this.gridMain.addItems(e, t);
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
  createItem(e, t) {
    this.gridMain.createItem(e, t);
  }
  /**
   * remove row item
   *
   * @param {any[]} ids rowid
   */
  removeItems(e) {
    this.gridMain.removeItems(e);
  }
  setSize(e, t) {
    this.gridMain.setSize(e, t, !0);
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
  getSelection(e = !1) {
    return this.gridMain.selectionInfo.selectionData("json", e);
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
  getCheckedItems(e) {
    return this.gridMain.getCheckedItems(e);
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
  getCheckedItemByName(e) {
    return this.gridMain.getCheckedItemByName(e);
  }
  /**
   * set all check items
   *
   * @param {boolean} checked
   */
  setAllCheckedItems(e) {
    this.gridMain.setAllCheckedItems(e);
  }
  /**
   * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   *
   */
  setCheckedItemByValue(e, t) {
    this.gridMain.setCheckedItemByValue(e, t);
  }
  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  addCheckedItemByValue(e, t) {
    this.gridMain.addCheckedItemByValue(e, t);
  }
  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  unCheckedItemByValue(e, t) {
    this.gridMain.unCheckedItemByValue(e, t);
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
  setTheme(e) {
    this.gridMain.setTheme(e);
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
  setStyle(e) {
    this.gridMain.setGridStyle(e);
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
  changeContextMenuHeader(e) {
    this.gridMain.getContextMenu().changeHeader(e);
  }
  expandAll() {
    this.gridMain.expandAll();
  }
  collapseAll() {
    this.gridMain.collapseAll();
  }
  search(e, t) {
    return this.gridMain.getDataSearch().search(e, t ?? {});
  }
  /**
   * dataSource.load로 서버 데이터를 조회한다. 조회 조건을 생략하면 마지막 조건을 사용한다.
   *
   * 미저장 변경이 있으면 UNSAVED_CHANGES 오류로 거부한다. 변경을 버리려면 `{ discardChanges: true }`를 전달한다.
   *
   * @param params 서버 조회 조건
   * @param options 조회 옵션
   * @returns 조회 결과. before 이벤트로 취소되었거나 더 새로운 조회에 밀렸으면 null
   * @example
   * await grid.load({ status: 'ACTIVE' });
   */
  load(e, t) {
    return this.remote((i) => i.load(e, t));
  }
  /**
   * 검색 조건을 적용하여 서버에서 조회한다. 서버 페이징이면 첫 페이지부터 조회한다.
   * 클라이언트 검색(`search()`)과는 별개이다.
   */
  searchRemote(e, t) {
    return this.remote((i) => i.searchRemote(e, t));
  }
  /**
   * infinite 페이징에서 다음 페이지를 조회해 기존 데이터 뒤에 붙인다. 보통은 스크롤이 끝에 가까워지면 자동 호출된다.
   * 다른 조회·저장·삭제가 진행 중이거나 더 받을 데이터가 없으면 요청하지 않고 null을 반환한다.
   *
   * @returns 이번에 받은 페이지 결과. 요청하지 않았거나 취소되었으면 null
   */
  loadMore() {
    return this.remote((e) => e.loadMore());
  }
  /**
   * 마지막 조회 조건(과 현재 페이지)으로 다시 조회한다. infinite 페이징은 첫 페이지부터 다시 조회한다.
   */
  reload(e) {
    return this.remote((t) => t.reload(e));
  }
  /**
   * 변경된 행(추가·수정·삭제)을 dataSource.save로 저장한다. 변경이 없으면 요청하지 않는다.
   * 성공하면 변경 상태를 확정하고 Undo/Redo 이력을 초기화한다.
   *
   * @returns 저장 요약. before 이벤트로 취소되면 null
   */
  save() {
    return this.remote((e) => e.save());
  }
  /**
   * 선택된 행(또는 `options.rowIds`)을 dataSource.remove로 서버에서 삭제한다.
   * 저장된 적 없는 신규 행은 요청 없이 로컬에서만 제거한다.
   */
  removeRemote(e) {
    return this.remote((t) => t.removeRemote(e));
  }
  /** dataSource가 없으면 동기 예외 대신 reject된 Promise를 반환한다. */
  remote(e) {
    try {
      return e(this.gridMain.getRemote());
    } catch (t) {
      return Promise.reject(t);
    }
  }
  static setIcons(e) {
    Object.assign(he, e);
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
Et.VERSION = "0.0.29";
let Ri = Et;
export {
  Ri as D,
  oo as G,
  lo as S,
  b as a,
  ro as g,
  et as n
};
//# sourceMappingURL=index-DXJq1JXI.mjs.map
