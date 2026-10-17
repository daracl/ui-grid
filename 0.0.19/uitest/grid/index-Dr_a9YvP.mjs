/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
const Ye = "daracl-grid-id", ie = {
  cell: "cell",
  multiCell: "multiCell",
  row: "row",
  multiRow: "multiRow",
  none: "none"
}, Qe = {
  cell: "cell",
  row: "row",
  none: "none"
}, wt = {
  left: "dg-left",
  center: "dg-center",
  right: "dg-right"
}, te = {
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
}, os = "dg", q = {
  // 생성
  CREATE: "C",
  // 수정
  MODIFY: "U",
  // 삭제
  DELETE: "D",
  // 읽기
  READ: "R"
}, ze = {
  BEFORE: "before",
  AFTER: "after"
}, it = {
  horizontal: 10,
  // left/right padding
  vertical: 5
  // top/bottom padding
}, Ct = 5, xi = 35, Et = 40, Ci = 27, Ei = 35, Pe = "_dg", ge = "$lineNumber", st = "$rowCheck", L = {
  ID: `${Pe}$rowid`,
  DEPTH: `${Pe}$depth`,
  HEIGHT: `${Pe}$rowHeight`,
  CUD: "_$CUD"
}, z = "$all$", At = "$rowDragHandle", Mi = "data-dg-grid-layer", Me = "dg-field-layer", Yt = 1e3, Dt = ".dg-hidden-layers", Ie = {
  IDLE: "IDLE",
  PRESSED: "PRESSED",
  DRAGGING: "DRAGGING"
}, Mt = 18, Se = 4, k = {
  LEFT: "L",
  RIGHT: "R"
}, Z = {
  UP: "U",
  DOWN: "D"
}, j = {
  SELECTION: "dg-selection",
  START_CELL: "dg-start-cell"
}, vi = /[ㄱ-ㅎ가-힣a-zA-Z0-9_]+/g, Re = {
  PREV: "prev",
  NEXT: "next"
};
function R(a, ...e) {
  return a.reduce((t, i, s) => {
    const n = e[s];
    return t + i + (n == null ? "" : String(n));
  }, "");
}
const le = {
  search: R`<svg viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.293 14l4.853 4.853 1.414-1.414-4.853-4.853A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" /></svg>`,
  refresh: R`<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7a5 5 0 015 5c0 2.76-2.24 5-5 5a5 5 0 01-4.9-4H5.02a7 7 0 006.98 6c3.87 0 7-3.13 7-7 0-1.93-.78-3.68-2.35-4.65z" /></svg>`,
  save: R`<svg viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zM6 5h8v4H6V5z" /></svg>`,
  add: R`<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>`,
  delete: R`<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" /></svg>`,
  edit: R`<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>`,
  copy: R`<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" /></svg>`,
  move: R`<svg viewBox="0 0 24 24"><path d="M13 5.83V2L8 7l5 5V8.17c3.39.49 6 3.42 6 6.83 0 .34-.03.67-.08 1h2.02c.04-.33.06-.66.06-1 0-4.52-3.51-8.25-8-8.17zM5.08 10H3.06c-.04.33-.06.66-.06 1 0 4.52 3.51 8.25 8 8.17V22l5-5-5-5v3.83c-3.39-.49-6-3.42-6-6.83 0-.34.03-.67.08-1z" /></svg>`,
  cut: R`<svg viewBox="0 0 24 24"><path class="dg-icon-fill" d="M9.64 7.64C9.87 7.14 10 6.59 10 6C10 3.79 8.21 2 6 2C3.79 2 2 3.79 2 6C2 8.21 3.79 10 6 10C6.59 10 7.14 9.87 7.64 9.64L10 12L7.64 14.36C7.14 14.13 6.59 14 6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 17.41 9.87 16.86 9.64 16.36L12 14L19 21H22V20L9.64 7.64ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM6 20C4.9 20 4 19.1 4 18C4 16.9 4.9 16 6 16C7.1 16 8 16.9 8 18C8 19.1 7.1 20 6 20Z" /><!-- Top blade tip --><path class="dg-icon-fill" d="M19 3L13 9L15 11L22 4V3H19Z" /></svg>`,
  upload: R`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" /><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Upload arrow --><path class="dg-icon-fill-stroke" d="M12 17V11" stroke-width="2" stroke-linecap="round" /><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 11L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  download: R`<svg viewBox="0 0 24 24"><!-- Excel file --><path class="dg-icon-fill" d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" ></path><!-- File corner --><path class="dg-icon-fill icon-corner" d="M14 2V8H20" /><!-- Download arrow --><path class="dg-icon-fill-stroke" d="M12 10V16" stroke-width="2" stroke-linecap="round"></path><path class="dg-icon-fill-stroke" d="M9.5 13.5L12 16L14.5 13.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`,
  mapping: R`<svg viewBox="0 0 16 16"><!-- Left --><rect class="dg-icon-stroke" x="1.5" y="6.5" width="3" height="3" /><!-- Right Top --><rect class="dg-icon-stroke" x="11.5" y="2" width="3" height="3" /><!-- Right Bottom --><rect class="dg-icon-stroke" x="11.5" y="11" width="3" height="3" /><!-- Connection --><path class="dg-icon-stroke" d="M4.5 8H8M8 8V3.5M8 8V12.5M8 3.5H11.5M8 12.5H11.5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><!-- Arrow --><path class="dg-icon-stroke" d="M7.5 8H10" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path class="dg-icon-stroke" d="M9 6.8L10.5 8L9 9.2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  preview: R`<svg viewBox="0 0 24 24"><!-- Eye --><path class="dg-icon-fill" d="M12 4C6.5 4 2 7.6 1 12c1 4.4 5.5 8 11 8s10-3.6 11-8c-1-4.4-5.5-8-11-8z" /><!-- Iris --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="4" /><!-- Pupil --><circle class="dg-icon-fill-stroke" cx="12" cy="12" r="1.5" /></svg>`,
  permission: R`<svg viewBox="0 0 24 24"><!-- User --><circle class="dg-icon-fill" cx="8" cy="9" r="3" /><path class="dg-icon-fill" d=" M3 19 c0-2.8 2.3-5 5-5 s5 2.2 5 5 Z " /><!-- Shield --><path class="dg-icon-fill" d=" M17 3 l4 1.5 V10 c0 3.4-2.1 6-5 7.5 c-2.9-1.5-5-4.1-5-7.5 V4.5 Z " /><!-- Check --><path class="dg-icon-stroke" d=" M15.6 9.5 l1.2 1.2 l2.4-2.4 " fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  parameter: R`<svg viewBox="0 0 24 24"><!-- Left brace --><path d=" M10 3 H8 C6.9 3 6 3.9 6 5 V8 C6 9.2 5.4 10 4 10 V14 C5.4 14 6 14.8 6 16 V19 C6 20.1 6.9 21 8 21 H10 V19 H8V16 C8 14.8 7.4 13.8 6.3 13.2 C7.4 12.6 8 11.6 8 10.4 V5H10 Z" /><rect x="10" y="10" width="4" height="1.8" rx=".9" /><rect x="10" y="13" width="4" height="1.8" rx=".9" /><!-- Right brace --><path d=" M14 3 H16 C17.1 3 18 3.9 18 5 V8 C18 9.2 18.6 10 20 10 V14 C18.6 14 18 14.8 18 16 V19 C18 20.1 17.1 21 16 21 H14 V19 H16V16 C16 14.8 16.6 13.8 17.7 13.2 C16.6 12.6 16 11.6 16 10.4 V5H14 Z" /></svg>`,
  start: R`<svg viewBox="0 0 24 24"><path d=" M8.5 5.5 C8.5 4.9 9.2 4.5 9.8 4.9 L18 10.3 C18.7 10.8 18.7 13.2 18 13.7 L9.8 19.1 C9.2 19.5 8.5 19.1 8.5 18.5 Z " /></svg>`,
  stop: R`<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5" /></svg>`,
  pause: R`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>`,
  restart: R`<svg viewBox="0 0 24 24"><path d=" M12 4 c-4.42 0-8 3.58-8 8 s3.58 8 8 8 c3.73 0 6.86-2.55 7.74-6H17.6 c-.77 2.3-2.94 4-5.6 4 a6 6 0 1 1 4.24-10.24 L13 11h7V4l-2.34 2.34 A7.95 7.95 0 0 0 12 4Z" /></svg>`,
  terminate: R`<svg viewBox="0 0 24 24"><path d=" M13 3v8h-2V3h2Zm5.7 2.3 1.4 1.4A8.97 8.97 0 0 1 21 12 a9 9 0 1 1-18 0 c0-2.5 1-4.8 2.9-6.4 l1.4 1.4 A7 7 0 1 0 17.3 7 l1.4-1.7Z" /></svg>`,
  help: R`<svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg>`,
  scrollUp: R`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path></svg>`,
  scrollDown: R`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path></svg>`,
  scrollLeft: R`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path></svg>`,
  scrollRight: R`<svg viewBox="0 0 1024 1024" style="fill: currentColor;"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path></svg>`,
  headerSort: R`<svg width="12" height="12" viewBox="0 0 12 12"><path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z" /><path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z" /></svg>`,
  sortup: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="50,0 0,100 100,100" fill="#737171"></polygon></g></svg>',
  sortdown: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="0,0 100,0 50,90" fill="#737171"></polygon></g></svg>'
}, Zt = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  // eslint-disable-next-line quotes
  "'": "&#39;"
}, de = (a) => {
  let e = a;
  return e && Object.keys(Zt).forEach((t) => {
    e = e.replaceAll(t, Zt[t]);
  }), e;
}, bi = (a, e) => Object.prototype.hasOwnProperty.call(a, e), Ee = (a) => a === null || a === "" || typeof a > "u" || typeof a == "string" && (a === "" || a.replace(/\s/g, "") === ""), ls = (a) => !(!a.offsetHeight && !a.offsetWidth || getComputedStyle(a).visibility === "hidden"), N = (a) => a === void 0, T = (a) => typeof a == "function", se = (a) => typeof a == "string", Y = (a) => {
  if (Ee(a))
    return !1;
  const e = Number(a);
  return !Number.isNaN(e);
}, ae = (a) => Number.parseInt(a, 10), G = (a) => Array.isArray(a), as = (a) => {
  navigator.clipboard ? navigator.clipboard.writeText(a).then(() => {
  }).catch((e) => {
    Jt(a);
  }) : Jt(a);
};
function cs(a, e) {
  let t;
  return function(...i) {
    if (e < 1) {
      a.apply(this, i);
      return;
    }
    t !== void 0 && clearTimeout(t), t = window.setTimeout(() => {
      a.apply(this, i);
    }, e);
  };
}
function Jt(a) {
  const e = document.createElement("textarea");
  e.setAttribute("style", "top:-9999px;left:-9999px;position:fixed;z-index:9999;"), document.body.appendChild(e), e.value = a, e.select();
  try {
    document.execCommand("copy");
  } catch (t) {
    console.error("Fallback copy failed:", t);
  }
  document.body.removeChild(e);
}
function ds(a) {
  return a instanceof HTMLElement;
}
function hs(a, e) {
  return a == null && e == null ? !0 : String(a) === String(e);
}
const qe = (a) => N(a) || a == null, Qt = (a, e) => {
  let t = a.replace(/{{if\(([^)]+)\)}}([\s\S]*?){{\/if}}/g, (i, s, n) => {
    const r = /^\s*(\w+)\s*$/, o = /^\s*(\w+)\s*(==|!=|>|>=|<|<=)\s*(\d+)\s*$/;
    let l = !1;
    if (r.test(s)) {
      const [, c] = s.match(r);
      l = !!e[c];
    } else if (o.test(s)) {
      const [, c, d, h] = s.match(o), u = e[c], f = Number(h);
      switch (d) {
        case "==":
          l = u == f;
          break;
        case "!=":
          l = u != f;
          break;
        case ">":
          l = u > f;
          break;
        case ">=":
          l = u >= f;
          break;
        case "<":
          l = u < f;
          break;
        case "<=":
          l = u <= f;
          break;
      }
    }
    return l ? n : "";
  });
  return t = t.replace(/{{\s*(\w+)\s*}}/g, (i, s) => Object.prototype.hasOwnProperty.call(e, s) ? e[s] : ""), t;
};
function Ue(a) {
  if (typeof a != "object" || a === null)
    return !1;
  let e = a;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(a) === e;
}
function us(a) {
  return a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function kt(a, e, t = [], i = !1) {
  if (t.length === 0)
    return a.sort((n, r) => n.sortOrder - r.sortOrder), a;
  const s = t.length;
  return a.forEach((n) => {
    const r = e.getRowItem(n.id);
    n.sortValues = t.map(
      ({ name: o, field: l, isValue: c }) => c ? l.$renderer.getValue(r) : r[o]
    );
  }), a.sort((n, r) => {
    const o = n.sortValues, l = r.sortValues;
    for (let c = 0; c < s; c++) {
      const d = gs(o[c], l[c], t[c].ascOrder ?? !0, i);
      if (d !== 0)
        return d;
    }
    return 0;
  }), a;
}
function gs(a, e, t, i = !1) {
  const s = a == null, n = e == null;
  if (s !== n)
    return i || t ? s ? 1 : -1 : s ? -1 : 1;
  if (s)
    return 0;
  let r;
  return typeof a == "number" && typeof e == "number" ? r = a - e : r = String(a).localeCompare(String(e)), t ? r : -r;
}
function $t(a, e, t) {
  return Array.isArray(a) ? e === void 0 && t === void 0 ? [...a] : a.slice(e, t) : [];
}
function vt(a) {
  return typeof a == "object" && a !== null && !Array.isArray(a);
}
function fs(a) {
  return a instanceof Date && !Number.isNaN(a.getTime());
}
const ms = (a) => {
  if (G(a)) {
    const e = [];
    for (const t of a)
      Ue(t) ? e.push($({}, t)) : e.push(t);
    return e;
  } else
    return $({}, a);
}, $ = (...a) => {
  let e = a[0];
  if (!Ue(e) || qe(e))
    return e;
  let t = 1;
  Object.keys(e).length > 0 && (t = 0, e = G(e) ? [] : {});
  const i = a.length;
  for (; t < i; t += 1)
    nt(e, a[t]);
  return e;
}, ut = (a, e) => (a || "").split(e);
function nt(a, e) {
  return G(e) ? Is(a, e) : fs(e) ? new Date(e.getTime()) : e instanceof RegExp ? new RegExp(e.source, e.flags) : vt(e) ? ws(a, e) : e;
}
const ps = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function ws(a, e) {
  if (T(e))
    return e;
  for (const t of Object.keys(e)) {
    if (ps.has(t))
      continue;
    const i = e[t];
    N(i) || (i === null || T(i) ? a[t] = i : i instanceof RegExp ? a[t] = new RegExp(i.source, i.flags) : qe(a[t]) ? a[t] = nt(G(i) ? [] : {}, i) : vt(i) ? (vt(a[t]) || (a[t] = {}), nt(a[t], i)) : a[t] = i);
  }
  return a;
}
function Is(a, e) {
  const t = Ue(a);
  for (let i = 0; i < e.length; i += 1) {
    const s = e[i];
    let n;
    s == null ? n = s : s instanceof RegExp ? n = new RegExp(s.source, s.flags) : n = nt(G(s) ? [] : {}, s), t ? a[i] = n : a.push(n);
  }
  return a;
}
function ys(a, e, t = !1, i) {
  if (a === e)
    return !0;
  if (a.length !== e.length)
    return !1;
  const s = (n) => n;
  if (t) {
    const n = [...a].sort((o, l) => ei(s(o), s(l))), r = [...e].sort((o, l) => ei(s(o), s(l)));
    return n.every((o, l) => s(o) === s(r[l]));
  }
  return a.every((n, r) => s(n) === s(e[r]));
}
function ei(a, e) {
  return a === e ? 0 : a > e ? 1 : -1;
}
const xs = {
  light: "dg-light",
  dark: "dg-dark"
}, et = {
  default: "default",
  striped: "striped",
  borderless: "borderless",
  rows: "rows",
  cells: "cells",
  stripedRows: "striped-rows",
  stripedCells: "striped-cells"
}, U = {
  left: "dg-text-al",
  center: "dg-text-ac",
  right: "dg-text-ar"
}, Cs = {
  pre: "pre",
  wrap: "pre-wrap",
  line: "pre-line",
  normal: "normal"
}, W = "dg-selected", Es = {
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
}, Ft = (a) => a ? a.match(/\S+/g) ?? [] : [];
function Ce(a, ...e) {
  if (!a) return;
  zt(a).forEach((i) => {
    i.classList.add(...e);
  });
}
function oe(a, ...e) {
  if (!a || e.length < 1) return;
  const t = zt(a);
  for (const i of t)
    i.classList.remove(...e);
}
function Ms(a, e) {
  if (!a || typeof e != "string") return;
  const t = zt(a), i = Ft(e);
  for (const s of t)
    i.forEach((n) => {
      s.classList.toggle(n);
    });
}
function It(a) {
  return a ? typeof a == "number" || /^\d+$/.test(a) ? `${a}px` : a : "";
}
const Ke = (a, e) => {
  if (!a)
    return [];
  let t;
  return T(a) ? t = a(e) : t = a + "", Ft(t);
}, Si = (a) => {
  if (!a.whiteSpace)
    return {
      style: "",
      className: ""
    };
  const e = Cs[a.whiteSpace];
  return e ? {
    style: `white-space: ${e}`,
    className: "dg-white-space"
  } : {
    style: "",
    className: ""
  };
}, rt = (a) => {
  var i;
  const e = a.variant;
  if (!e) return "";
  const t = a.type;
  return ((i = Es[t]) == null ? void 0 : i[e]) ?? "";
};
function ye(a, e) {
  const t = Ft(e);
  for (const i of t)
    if (a.classList.contains(i))
      return !0;
  return !1;
}
function ot(a, e, t) {
  return a.getAttribute(e) == t;
}
function O(a, e = !1) {
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
function ti(a, e) {
  for (const t in e)
    a.setAttribute(t, e[t]);
}
function ii(a, ...e) {
  let t;
  a instanceof HTMLElement ? t = [a] : t = a, t.forEach((i) => {
    for (const s of e)
      i.removeAttribute(s);
  });
}
function zt(a) {
  return a ? Array.isArray(a) ? a : a instanceof Element ? [a] : a instanceof NodeList ? Array.from(a) : Array.from(document.querySelectorAll(a)) : [];
}
function H(a, e, t = {}) {
  const i = document.createElement(a);
  e && (i.className = e);
  for (const [s, n] of Object.entries(t))
    typeof n == "object" && n !== null ? s === "style" ? Object.assign(i.style, n) : s === "dataset" ? Object.assign(i.dataset, n) : i.setAttribute(s, JSON.stringify(n)) : i.setAttribute(s, String(n));
  return i;
}
function xe(a, e, t) {
  return H(a, e, { [Mi]: t });
}
function gt(a, e, t, i = 2) {
  const s = O(a), n = O(e);
  let r = t.offsetHeight || O(t).height;
  const o = window.innerHeight, l = s.top - n.top, d = n.bottom + r > o;
  let h = n.top - (r - i);
  return d ? (h = n.top - (r - i), h < 0 && (r = r - 5 + h), o - n.bottom > r ? (r = o - n.bottom - i, h = n.bottom - s.top) : h = -(r + i) - l) : h = n.bottom - s.top, {
    top: h,
    left: n.left - s.left,
    height: r,
    width: n.width
  };
}
function vs(a, e) {
  const t = bs(), i = t.top, s = t.left, n = O(a), r = n.width, o = n.height, l = Ri(), c = e.x, d = e.y, h = i + l.height, u = s + l.width, f = 5;
  let g = d + o + f > h ? h - (o + f) : d;
  g = Math.max(g, 0);
  let m = c + r > u ? c - r : c;
  return m = Math.max(m, 0), { top: g, left: m };
}
function Ri(a = !0) {
  const e = window.innerWidth, t = window.innerHeight;
  let i = 0, s = 0;
  if (a) {
    const n = document.documentElement;
    i = e - n.clientWidth, s = t - n.clientHeight;
  }
  return {
    width: e - i,
    height: t - s
  };
}
function Li(a) {
  return le[a] ?? "";
}
function bs() {
  const a = window.pageYOffset ?? (document.documentElement.scrollTop || document.body.scrollTop || 0), e = window.pageXOffset ?? (document.documentElement.scrollLeft || document.body.scrollLeft || 0);
  return { top: a, left: e };
}
let yt = {
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
class Ti {
  constructor() {
    this.lang = yt;
  }
  static setGlobalMessage(e) {
    yt = $(yt, e);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  setMessage(e) {
    this.lang = $(this.lang, e);
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
    var o;
    let i = "";
    const s = [];
    t.regexp && (i = this.lang.regexp[t.regexp], s.push(i)), (t.constraints ?? []).forEach((l) => {
      var d;
      l === te.REQUIRED && (i = si(this.lang.required, e), s.push(i));
      const c = (d = e.editRenderer) == null ? void 0 : d.type;
      c == "number" || c == "range" ? (i = this.lang.number[l], s.push(i)) : (i = this.lang.string[l], s.push(i));
    });
    const n = [], r = Object.assign({}, { name: e.name, label: e.label }, (o = e.editRenderer) == null ? void 0 : o.rule);
    return s.forEach((l) => {
      l && n.push(si(l, r));
    }), t.validator && n.push(t.validator.message), n;
  }
}
const Ss = /\{([A-Za-z0-9_.]+)\}/g;
function Rs(a, e) {
  const t = e.split(".");
  let i = a;
  for (let s = 0; s < t.length; s++) {
    if (i == null) return;
    i = i[t[s]];
  }
  return i;
}
function si(a, e) {
  return a.replace(Ss, (t, i) => {
    const s = Rs(e, i);
    return s == null ? t : String(s);
  });
}
function He(a) {
  return a.shiftKey;
}
function lt(a) {
  return a.ctrlKey;
}
function Ls(a) {
  const e = a;
  return e.key === " " || e.code === "Space";
}
function Ts(a) {
  const e = a;
  return e.key === "Enter" || e.code === "Enter";
}
function Vi(a) {
  const e = a;
  return e.key === "Escape" || // 표준
  e.key === "Esc" || // 구형 브라우저
  e.code === "Escape";
}
const A = (a) => {
  a.preventDefault(), a.stopPropagation();
}, Vs = (a) => a.code, Q = (a) => {
  var e, t, i;
  if (typeof PointerEvent < "u" && a instanceof PointerEvent)
    return {
      x: a.pageX,
      y: a.pageY,
      clientX: a.clientX,
      clientY: a.clientY
    };
  if (typeof TouchEvent < "u" && a instanceof TouchEvent) {
    const s = ((e = a.changedTouches) == null ? void 0 : e[0]) || ((t = a.touches) == null ? void 0 : t[0]) || ((i = a.targetTouches) == null ? void 0 : i[0]);
    if (s)
      return {
        x: s.pageX,
        y: s.pageY,
        clientX: s.clientX,
        clientY: s.clientY
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
function Te(a) {
  return a.type.startsWith("touch") ? !0 : a instanceof MouseEvent ? a.button === 0 : !1;
}
function bt(a, e, t, i) {
  const s = a.currentTarget, n = Q(a);
  return {
    state: Ie.PRESSED,
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
const St = (a) => a instanceof PointerEvent ? a.isPrimary && a.button === 0 : a instanceof MouseEvent ? a.button === 0 : a instanceof TouchEvent;
function ni(a) {
  return a ? Array.isArray(a) ? a : a instanceof Document || a instanceof Element ? [a] : a instanceof NodeList ? Array.from(a) : Array.from(document.querySelectorAll(a)) : [];
}
class Hs {
  constructor() {
    this.EVENT_HANDLER_MAP = /* @__PURE__ */ new WeakMap(), this.ELEMENTS = /* @__PURE__ */ new Set();
  }
  addEventInfo(e, t, i, s) {
    this.EVENT_HANDLER_MAP.has(e) || this.EVENT_HANDLER_MAP.set(e, {});
    const n = this.EVENT_HANDLER_MAP.get(e);
    n && (n[t] ?? (n[t] = [])).push({ listener: i, capture: s }), this.ELEMENTS.add(e);
  }
  on(e, t, i) {
    const s = e.el;
    if (!s) return;
    const n = e.type, r = e.selector, o = n.replaceAll(/\s+/g, " ").split(" "), l = ni(s);
    let c;
    r && typeof r == "string" ? c = (d) => {
      const u = d.target.closest(r);
      !u || !l.some((g) => g.contains(u)) || t(d, u) === !1 && (d.stopImmediatePropagation(), d.preventDefault());
    } : c = (d) => {
      t(d, s) === !1 && (d.stopImmediatePropagation(), d.preventDefault());
    };
    for (const d of o) {
      const h = d.split(".")[0];
      l.forEach((u) => {
        this.addEventInfo(u, d, c, (i == null ? void 0 : i.capture) ?? !1), u.addEventListener(h, c, i ?? {});
      });
    }
  }
  off(e, t) {
    if (!e) return;
    const i = t.replaceAll(/\s+/g, " ").split(" "), s = ni(e);
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
const Hi = (a, e) => {
  const t = (a == null ? void 0 : a.page) || 1, i = (a == null ? void 0 : a.totalCount) ?? e, s = (a == null ? void 0 : a.pageSize) || 10, n = (a == null ? void 0 : a.unitPage) || 10;
  return Ai(i > 0 ? i : e, t, s, n);
}, Ai = (a, e, t, i) => {
  if (t = t || 10, i = i || 10, a < 1)
    return {
      page: 0,
      unitPage: 0,
      totalCount: 0,
      totalPages: 0
    };
  a < t && (t = a);
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
function As(a) {
  var i, s, n, r, o, l, c, d, h, u, f;
  const e = Hi(
    Ue(a.paging) ? a.paging : {},
    a.items.length
  );
  let t = L.ID;
  return a.rowIdField ? t = a.rowIdField : a.tree && (t = a.tree.idField || "id"), {
    rowIdField: t,
    dataManager: {},
    eventManager: new Hs(),
    theme: "",
    checkOnRowSelect: ((s = (i = a.aside) == null ? void 0 : i.rowCheckbox) == null ? void 0 : s.checkOnRowSelect) === !0,
    enabledHeaderHelpButton: (r = (n = a.header) == null ? void 0 : n.help) == null ? void 0 : r.enabled,
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
    isRowAllowMultiSelect: ((l = (o = a.aside) == null ? void 0 : o.rowCheckbox) == null ? void 0 : l.allowMultiSelect) ?? !0,
    searchEnabled: !1,
    searchParameter: {
      matchCase: !1,
      matchWholeWord: !1,
      useRegex: !1,
      searchFields: z,
      searchText: ""
    },
    searchMatchInfo: {
      currentMatchIndex: -1,
      matchCount: -1,
      rowIndex: -1,
      cellIndex: -1,
      id: ""
    },
    fieldHeaderGroup: Di(),
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
    enabledSortButton: (c = a.header) == null ? void 0 : c.sort.enabled,
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
    scroll: $s(),
    scrollbarSize: a.scroll.width ?? 12,
    disableVerticalScroll: ((h = (d = a.scroll) == null ? void 0 : d.vertical) == null ? void 0 : h.enabled) === !1,
    disableHorizontalScroll: ((f = (u = a.scroll) == null ? void 0 : u.horizontal) == null ? void 0 : f.enabled) === !1,
    edit: Fs(),
    canvasContext: void 0,
    activeComponent: ""
  };
}
function Ds() {
  return {
    id: "",
    range: ks(),
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
function ks() {
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
function $s() {
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
function Di() {
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
function Fs() {
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
const Ae = (a, e) => e < a.fixedLeftIndex, De = (a, e) => a.fixedRightIndex > 0 && e >= a.fixedRightIndex, Nt = (a) => a == ie.multiRow || a == ie.multiCell, zs = (a) => a == ie.cell || a == ie.row, Ns = (a) => a == ie.multiCell, Ge = (a) => a == ie.multiRow || a == ie.row, Ws = (a) => a == ie.multiCell || a == ie.cell, he = (a, e) => {
  const t = Bs(e), i = a.scroll.startIdx + t.r, s = t.c, n = a.dataManager.getViewItems()[i];
  return {
    r: t.r,
    c: s,
    rowIndex: i,
    field: a.currentFields[t.c],
    item: a.dataManager.getRowItem(n.id),
    viewItem: n
  };
}, Bs = (a) => {
  const e = (Ps(a) ?? "").split(",");
  return {
    r: ae(e[0]),
    c: ae(e[1])
  };
}, Ps = (a) => a.dataset.cellPosition, Os = (a, e) => {
  const t = Gs(e);
  return {
    c: t,
    field: a.currentFields[t]
  };
}, _s = (a, e) => {
  const t = ae(e.dataset.resizeIdx ?? "-1");
  return {
    c: t,
    field: a.currentFields[t]
  };
}, Gs = (a) => ae(a.dataset.headerCellPosition ?? "-1"), ki = (a, e, t = 10) => {
  var s;
  if (!e) return t;
  const i = (s = a.canvasContext) == null ? void 0 : s.measureText(e);
  return ((i == null ? void 0 : i.width) ?? 0) + t;
}, qs = (a, e, t) => {
  const i = a.dataManager, s = i.getViewItems(), n = e.header.resize.maxWidth;
  let r = 0;
  const o = a.canvasContext, l = a.scroll.startIdx;
  let c = 0;
  for (let d = l, h = Math.min(a.dataInfo.rowLength, l + 100); d < h; d++) {
    const u = t.$renderer.getValue(i.getRowItem(s[d].id));
    if (qe(u)) continue;
    const f = o.measureText(u);
    if (c = Math.max(f.width, c), n > 0 && c >= n)
      return n;
    r = Math.max(r, c);
  }
  return r + 16;
}, $i = (a, e) => e < 1 ? 0 : a.dimensions.mainCenterOverWidth * (e / (a.scroll.hTrackWidth - a.scroll.hThumbWidth) * 100) / 100, ri = (a, e, t) => {
  if (e < 1 || a.dimensions.mainCenterOverWidth <= 0)
    return 0;
  let i;
  return t === k.RIGHT ? i = e - a.dimensions.mainCenterViewWidth : i = e - 2, i / a.dimensions.mainCenterOverWidth * 100 * (a.scroll.hTrackWidth - a.scroll.hThumbWidth) / 100;
}, Us = (a) => a.search(/(input|select|textarea)/i) > -1, Fi = (a, e, t, i, s, n) => {
  const r = a.scroll, o = a.dataInfo, l = r.startIdx, c = r.insideViewRow, d = r.viewRow, h = o.rowLength;
  let u = null, f = -1;
  if (e < s)
    return l > 0 ? (u = Z.UP, f = l - 1) : f = 0, { scrollDirectionY: u, rowIdx: f, viewRowIdx: 0 };
  if (e > n)
    return l + c < h ? (u = Z.DOWN, f = l + c + 1) : f = h - 1, { scrollDirectionY: u, rowIdx: f, viewRowIdx: c };
  const g = e - s, m = 1 / t, p = g * m | 0;
  return p < d && (f = l + p), { scrollDirectionY: u, rowIdx: f, viewRowIdx: p };
}, zi = (a, e, t, i, s, n) => {
  let r = null, o = -1;
  const l = a.currentFields, c = l.length, d = a.selection.startCell.startCol;
  let h = 0, u = c, f = 0, g = 0;
  const { fixedLeftIndex: m, fixedRightIndex: p } = a;
  if (e < i ? (f = e - t, u = m, r = k.LEFT) : e > s ? (h = p, h > 0 ? f = e - s : o = c - 1, r = k.RIGHT) : (f = e - i, h = m, g = $i(a, a.scroll.left)), !(h < 1 && r === k.RIGHT)) {
    if (f <= 0)
      o = 0;
    else if (o === -1) {
      let w = 0, I = !1;
      for (let y = h; y < u; y++) {
        const x = l[y].$width;
        if (w += x, (g <= 0 || I) && w > f) {
          o = y;
          break;
        }
        !I && w >= g && (I = !0, w = g > 0 && w > g ? w - g : w);
      }
      o === -1 && w < f && (o = u);
    }
  }
  return (r === k.LEFT && (Ae(a, d) || a.scroll.left == 0) || r === k.RIGHT && (De(a, d) || c - (p > 0 ? c - p : 0) - 1 == a.scroll.insideEndCol)) && (r = null), o = Math.max(o, a.dataInfo.startCol), { scrollDirectionX: r, overCell: o };
}, Ks = (a, e) => a == 0 ? "none" : a == e ? "all" : "partial", ft = (a) => {
  var e;
  return ((e = a == null ? void 0 : a.listItem) == null ? void 0 : e.valueField) ?? "value";
}, mt = (a) => {
  var e;
  return ((e = a == null ? void 0 : a.listItem) == null ? void 0 : e.labelField) ?? "label";
}, Ni = (a, e) => {
  let t, i = [];
  return G(a) && a.length > 0 ? (t = a[0], i = a) : t = Y(a) ? a : 28, { height: t, heights: i };
}, Xs = (a) => {
  if (new Set(a).size !== a.length) return !1;
  const t = Math.min(...a);
  return Math.max(...a) - t + 1 === a.length;
}, at = (a, e, t = 5) => {
  const i = e.x - a.x, s = e.y - a.y;
  return i * i + s * s > t * t;
}, js = (a) => typeof a != "string" ? a : /["\n\r\t]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a, Ys = (a) => {
  const e = [];
  let t = [], i = "", s = !1;
  a = a.replace(/(\r?\n){2}$/, `
`);
  for (let n = 0; n < a.length; n++) {
    const r = a[n], o = a[n + 1];
    r === '"' ? s && o === '"' ? (i += '"', n++) : s = !s : !s && r === "	" ? (t.push(i), i = "") : !s && (r === `
` || r === "\r") ? (r === "\r" && o === `
` && n++, t.push(i), e.push(t), t = [], i = "") : i += r;
  }
  return t.push(i), e.push(t), e;
}, pt = (a, e) => e ? e.editable === !0 || a.enabledCellEdit && e.editable !== !1 : !1, xt = (a) => {
  const e = a.fixedRightIndex > 0 ? 1 : 2, t = a.scroll.enabledVertical ? a.scrollbarSize + e : 0;
  return a.dimensions.width - t - 1;
}, Ne = {
  NONE: -1,
  UP: 1,
  DOWN: 2,
  LEFT: 10,
  RIGHT: 20
}, Wi = (a, e, t, i) => {
  let s = Ne.NONE;
  return t < e.startIdx ? s = Ne.UP : t > e.startIdx + e.viewRow && (s = Ne.DOWN), !Ae(a, i) && !De(a, i) && (i < e.insideStartCol ? s = Math.max(s, 0) + Ne.LEFT : i > e.insideEndCol && (s = Math.max(s, 0) + Ne.RIGHT)), s;
}, ct = (a, e) => G(a) ? a : se(a) ? ut(a, e) : [String(a)];
class Bi {
  constructor(e, t) {
    this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.enabledTooltip = t.options().enabledTooltip;
  }
  getClosestCellElement(e) {
    return e.closest(".dg-cell");
  }
  supportsInteraction() {
    return !1;
  }
  bindEvents(e, t, i) {
    return !1;
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return U.left;
  }
  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @param checkWidth
   * @returns
   */
  getMinWidth(e, t) {
    return qs(e, t, this.field);
  }
  applyRendererRefState(e, t) {
    const i = (t == null ? void 0 : t.hide) ?? !1, s = e.classList;
    if (s.contains("dg-hide") !== i && s.toggle("dg-hide", i), i) return !1;
    const n = (t == null ? void 0 : t.disabled) ?? !1;
    s.contains("dg-disabled") !== n && s.toggle("dg-disabled", n);
  }
}
class ke extends Bi {
  constructor(e, t) {
    super(e, t), this.rendererContainer = this.gridMain.getRendererLayerElement(), this._editable = pt(this.gridMain.config(), e);
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
   * @param {HTMLElement} element cell element
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
        item: $({}, t),
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
    const e = xe("div", "dg-validator-message " + Me, "validator");
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
      const n = O(t), r = O(this.rendererContainer), o = s.style;
      return this.gridMain.openLayer(s), o.top = `${n.top - r.top - s.offsetHeight}px`, o.left = `${n.left - r.left}px`, !0;
    }
    return !1;
  }
  supportsEdit() {
    return !0;
  }
}
class Zs extends ke {
  constructor(e, t) {
    super(e, t);
    const i = this.field.editRenderer;
    this.trueValue = i.trueValue ?? !0, this.falseValue = i.falseValue ?? !1, this.showLabel = i.showLabel ?? !1;
  }
  render(e, t) {
    var n, r;
    const i = this.getValue(e.item, e.inputValue);
    let s = t.firstElementChild;
    if (!s) {
      s = H("div", "dg-choice", "");
      const o = H("div", "dg-choice-item  dg-checkbox", {
        role: "presentation"
      });
      if (o.appendChild(H("div", "dg-indicator ", "")), s.appendChild(o), this.showLabel) {
        const l = document.createElement("span");
        l.className = "dg-cell-content-label dg-ellipsis", o.appendChild(l);
      }
      t.appendChild(s), this.isEditable() && this.initClick(s);
    }
    if (i === this.trueValue ? (n = s.firstElementChild) == null || n.classList.add(W) : (r = s.firstElementChild) == null || r.classList.remove(W), this.tooltip(s, i), this.showLabel) {
      const o = t.querySelector(".dg-cell-content-label");
      o && (o.textContent = i);
    }
  }
  initClick(e) {
    const t = this.gridMain.config();
    t.eventManager.on({ el: e, type: "click" }, (i) => {
      const s = this.getClosestCellElement(e), n = he(t, s), r = n.item, l = this.getValue(r, n.inputValue) === this.trueValue;
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
    return U.center;
  }
  getMinWidth(e, t) {
    return 50;
  }
}
class Js extends ke {
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
const Qs = {
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
}, en = (a, e, t) => {
  var s;
  typeof t > "u" && (t = { name: e.name, constraints: [] });
  const i = (s = e.editRenderer) == null ? void 0 : s.regexpType;
  return i && !Qs[i].test(a) && (t.regexp = i), t;
}, Pi = (a, e, t, i, s) => {
  var r, o;
  const n = e.editRenderer;
  if (!n) return null;
  if (n.validator && (s.validator = n == null ? void 0 : n.validator(e, t), typeof s.validator == "object") || (s = en(a, e, s), s.regexp))
    return s;
  if (n.different) {
    const l = n.different.field;
    if (i.allFieldMap.has(l) && a == ((r = i.allFieldMap.get(l)) == null ? void 0 : r.$renderer.getValue(t)))
      return s.message = n.different.message, s;
  }
  if (n.identical) {
    const l = n.identical.field;
    if (i.allFieldMap.has(l) && a == ((o = i.allFieldMap.get(l)) == null ? void 0 : o.$renderer.getValue(t)))
      return s.message = n.identical.message, s;
  }
  return null;
}, tn = (a, e, t, i) => {
  const s = { name: e.name, constraints: [] }, n = e.editRenderer;
  if (!n)
    return null;
  if (n.required && Ee(a))
    return s.constraints.push(te.REQUIRED), s;
  const r = Pi(a, e, t, i, s);
  if (r !== null)
    return r;
  const o = n.rule;
  if (o) {
    const l = a.length, c = Y(o.minLength), d = Y(o.maxLength);
    let h = !1, u = !1;
    if (c && l < o.minLength && (h = !0), d && l > o.maxLength && (u = !0), c && d && (h || u) ? s.constraints.push(te.BETWEEN) : (h && s.constraints.push(te.MIN_LENGTH), u && s.constraints.push(te.MAX_LENGTH)), s.constraints.length > 0)
      return s;
  }
  return null;
};
class Xe extends ke {
  constructor(e, t) {
    super(e, t);
  }
  initEvt(e, t) {
    const { eventManager: i } = this.gridMain.config();
    i.on({ el: e, type: "blur" }, (s) => {
      this.isShow && this.setChangeValue(s);
    }), i.on({ el: e, type: "keydown" }, (s) => {
      var r;
      const n = s.key;
      n === "Enter" && ((r = this.field.editRenderer) == null ? void 0 : r.type) !== "textarea" ? this.setChangeValue(s) : n === "Escape" && this.setChangeValue(s, !0);
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
    const t = tn(e, this.field, this.item, this.gridMain.config());
    return t == null ? !0 : !this.showInvalidMessage(t, this.cellElement);
  }
  textRender(e, t, i) {
    const s = e.item;
    this.cellInfo = e, this.item = s, this.cellElement = t;
    let n = this.editElement;
    n || (n = xe("input", "dg-edit-input " + Me, e.c + ""), n.type = i, n.name = this.field.$uid, n.setAttribute("autocomplete", "off"), this.rendererContainer.appendChild(n), this.editElement = n, this.initEvt(n, s));
    const r = n.style, o = O(t), l = O(this.rendererContainer);
    this.isShow = !0, this.gridMain.openLayer(n), r.top = `${o.top - l.top}px`, r.left = `${o.left - l.left}px`, r.width = `${o.width}px`, r.height = `${o.height}px`;
    const c = this.getValue(s, e.inputValue);
    n.value = c, n.focus();
  }
}
let sn = class extends Xe {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "date");
  }
};
function Ve(a, e, t) {
  const i = /* @__PURE__ */ new Map(), s = se(a[0]), n = [];
  for (const r of a) {
    let o, l;
    if (s) {
      o = r, l = r;
      const c = {};
      c[t] = r, c[e] = r, n.push(c);
    } else
      o = (r == null ? void 0 : r[t]) ?? "", l = (r == null ? void 0 : r[e]) ?? "", n.push(r);
    i.set(o, l);
  }
  return { list: n, map: i };
}
function nn(a, e, t) {
  a.tabIndex = 0, a.focus(), e.off(a, "focusout"), e.on({ el: a, type: "focusout" }, (i) => {
    a.style.display = "none";
  });
}
function dt(a, e) {
  const t = /* @__PURE__ */ new Set();
  return a.filter((s) => t.has(s[e]) ? !1 : (t.add(s[e]), !0));
}
function Oi(a, e, t, i, s) {
  if (!t)
    return s ? [e] : a.includes(e) ? [] : [e];
  if (e === z)
    return a.includes(z) ? [] : [z];
  const n = new Set(i), r = n.has(z), o = a.includes(z) ? i.filter((d) => d !== z) : a.filter((d) => n.has(d)), l = o.indexOf(e);
  l >= 0 ? o.splice(l, 1) : o.push(e);
  const c = r ? i.length - 1 : i.length;
  return o.length === c ? r ? [z] : [...o] : o;
}
function _i(a, e, t, i, s) {
  var r;
  if (s) {
    Ce(a.querySelectorAll(".dg-dropdown-item:not(.disabled)"), W);
    return;
  }
  oe(a.querySelectorAll(`.dg-dropdown-item.${W}`), W);
  const n = new Set(t);
  for (let o = 0; o < e.length; o++)
    n.has(e[o][i]) && ((r = a.querySelector(`.dg-dropdown-item[data-index="${o}"]`)) == null || r.classList.add(W));
}
function Gi(a, e, t) {
  const i = new Set(se(a) ? ut(a || "", e) : a);
  if (i.has(z))
    return [...t.values()];
  const s = [];
  for (const n of i) {
    const r = t.get(n);
    r !== void 0 && s.push(r);
  }
  return s;
}
class rn extends ke {
  constructor(e, t) {
    var s, n, r;
    super(e, t), this.listItems = [];
    const i = this.field.editRenderer;
    this.labelKey = mt(i), this.valueKey = ft(i), i != null && i.listItem ? (this.isMultiple = ((s = i.listItem) == null ? void 0 : s.multiple) ?? !1, this.valueDelimiter = ((n = i.listItem) == null ? void 0 : n.delimiter) ?? ",") : (this.valueDelimiter = ",", this.isMultiple = !1), this.required = this.field.editRenderer.required ?? !1, this.useIncludeAllOption = this.isMultiple && (((r = i.listItem) == null ? void 0 : r.includeAllOption) ?? !0);
  }
  valid(e) {
    return !0;
  }
  render(e, t) {
    var h;
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
      const u = rt(this.field.editRenderer);
      n = xe("div", `dg-dropdown-menu ${Me} ${u}`, i), this.rendererContainer.appendChild(n), this.dropdownElement = n, this.initDropdownEvt();
    }
    const o = (h = this.field.editRenderer.listItem) == null ? void 0 : h.list, { labelKey: l, valueKey: c } = this, d = (u) => {
      const { list: f } = Ve(u, l, c), g = dt(f, c);
      if (this.listItems = g, this.useIncludeAllOption && g.filter((m) => m[c] == z).length < 1) {
        const m = {};
        m[this.valueKey] = z, m[this.labelKey] = this.language.getMessage("select.all"), g.unshift(m);
      }
      n.innerHTML = this.dropdownMenuTemplate(g), this.openMenu(n, s), this.setDropItemCheck(this.getValue(e.item, e.inputValue));
    };
    Array.isArray(o) ? d(o) : T(o) && o(e, d);
  }
  initDropdownEvt() {
    const e = this.gridMain.config(), t = this.dropdownElement, { valueKey: i, valueDelimiter: s, isMultiple: n, required: r } = this;
    e.eventManager.on({ el: t, type: "click", selector: ".dg-dropdown-item" }, (o) => {
      const l = o.target, c = Number(l.dataset.index || "0");
      if (l.classList.contains("disabled"))
        return;
      const d = this.listItems, h = this.currentCellInfo, f = d.filter((I) => !I.disabled).map((I) => I[i]), g = this.getValue(h.item, h.inputValue), m = ct(g, s), p = d[c][i], w = Oi(m, p, n, f, r);
      this.setValue(o, h.item, w.join(s)), this.setDropItemCheck(w), n || (t.style.display = "none"), this.completeEdit();
    });
  }
  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  openMenu(e, t) {
    const i = O(t), s = e.style;
    s.height = "auto", this.gridMain.openLayer(e), s.width = `${i.width}px`;
    const n = gt(this.rendererContainer, t, e);
    s.top = `${n.top}px`, s.left = `${n.left}px`, s.height = `${n.height}px`;
  }
  setDropItemCheck(e = "") {
    const t = ct(e, this.valueDelimiter);
    let i = !1;
    this.useIncludeAllOption && t.includes(z) && (i = !0), _i(this.dropdownElement, this.listItems, t, this.valueKey, i);
  }
  dropdownMenuTemplate(e) {
    if (!G(e) || e.length === 0) return "";
    const { valueKey: t, labelKey: i } = this, s = [];
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      let o = "dg-dropdown-item";
      r.disabled && (o += " disabled"), r[t] === z && (o += " dg-all");
      const l = r[i] ?? "";
      s.push(`<div data-index="${n}" class="${o}">${de(String(l))}</div>`);
    }
    return s.join("");
  }
}
const on = (a, e, t, i) => {
  const s = { name: e.name, constraints: [] }, n = Number(a), r = e.editRenderer;
  if (!r)
    return null;
  if (r.required && Ee(a))
    return s.constraints.push(te.REQUIRED), s;
  if (!Y(a))
    return s.constraints.push(te.NAN), s;
  if (Pi(a, e, t, i, s) !== null)
    return s;
  const o = r.rule;
  if (o) {
    const l = Y(o.minimum), c = Y(o.maximum);
    let d = !1, h = !1, u = !1, f = !1;
    l && (o.exclusiveMinimum && n <= o.minimum ? h = !0 : n < o.minimum && (d = !0)), c && (o.exclusiveMaximum && n >= o.maximum ? f = !0 : n > o.maximum && (u = !0)), l && c && (d || h || u || f) ? o.exclusiveMinimum && o.exclusiveMaximum && (h || f) ? s.constraints.push(te.BETWEEN_EXCLUSIVE_MINMAX) : h ? s.constraints.push(te.BETWEEN_EXCLUSIVE_MIN) : f ? s.constraints.push(te.BETWEEN_EXCLUSIVE_MAX) : s.constraints.push(te.BETWEEN) : (h && s.constraints.push(te.EXCLUSIVE_MIN), f && s.constraints.push(te.EXCLUSIVE_MAX), d && s.constraints.push(te.MIN), u && s.constraints.push(te.MAX));
  }
  return s.constraints.length > 0 ? s : null;
};
class ln extends Xe {
  constructor(e, t) {
    super(e, t), this.editRendererInfo = e.editRenderer ?? {};
  }
  render(e, t) {
    var l, c, d, h;
    const i = e.item;
    this.cellInfo = e, this.item = i, this.cellElement = t;
    let s = this.editElement;
    s || (s = xe("input", "dg-edit-input " + Me, e.c + ""), s.type = "number", s.name = this.field.$uid, s.setAttribute("autocomplete", "off"), (l = this.editRendererInfo.rule) != null && l.minimum && (s.min = ((c = this.editRendererInfo.rule) == null ? void 0 : c.minimum) + ""), (d = this.editRendererInfo.rule) != null && d.maximum && (s.max = ((h = this.editRendererInfo.rule) == null ? void 0 : h.maximum) + ""), this.rendererContainer.appendChild(s), this.editElement = s, this.initEvt(s, i));
    const n = s.style, r = O(t), o = O(this.rendererContainer);
    this.isShow = !0, this.gridMain.openLayer(s), n.top = `${r.top - o.top}px`, n.left = `${r.left - o.left}px`, n.width = `${r.width}px`, n.height = `${r.height}px`, s.value = this.getValue(i, e.inputValue), s.focus();
  }
  valid(e) {
    const t = on(e, this.field, this.item, this.gridMain.config());
    return t == null ? !0 : !this.showInvalidMessage(t, this.cellElement);
  }
}
class an extends Xe {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "password");
  }
}
class cn extends ke {
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
let dn = class extends ke {
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
      const s = this.getClosestCellElement(e), n = he(t, s), r = !ye(e, "dg-checked");
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
    return U.center;
  }
  getMinWidth(e, t) {
    return 50;
  }
};
class hn extends Xe {
  constructor(e, t) {
    super(e, t), this.editRendererInfo = e.editRenderer ?? {};
  }
  render(e, t) {
    const i = e.item;
    this.cellInfo = e, this.item = i, this.cellElement = t;
    let s = this.textareaElement;
    s || (s = xe(
      "textarea",
      "dg-edit-textarea " + Me,
      e.c + ""
    ), s.rows = 3, s.name = this.field.$uid, this.rendererContainer.appendChild(s), this.textareaElement = s, this.initEvt(s, i));
    const n = s.style, r = O(t), o = O(this.rendererContainer);
    this.isShow = !0, this.gridMain.openLayer(s), n.top = `${r.top - o.top}px`, n.left = `${r.left - o.left}px`, n.width = `${r.width}px`, n.height = `${r.height}px`;
    const l = this.getValue(i, e.inputValue);
    s.value = l, s.focus();
  }
  getElementValue() {
    return this.textareaElement.value;
  }
  valid(e) {
    return !0;
  }
}
class un extends Xe {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    this.textRender(e, t, "text");
  }
}
function gn(a, e) {
  const i = /[0,.]+/.exec(e);
  if (!i) return e;
  const s = i[0], n = e.slice(0, e.indexOf(s)), r = e.slice(e.indexOf(s) + s.length), [o, l] = s.split("."), c = o.includes(",");
  let d = "";
  if (l) {
    const h = a.toFixed(l.length), [u, f] = h.split("."), g = f.replace(/0+$/, "");
    d = c ? oi(u) : u, g.length > 0 && (d += "." + g);
  } else {
    const h = Math.round(a).toString();
    d = c ? oi(h) : h;
  }
  return `${n}${d}${r}`;
}
function oi(a) {
  return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function qi(a, e) {
  return e.type == "number" && !isNaN(a) ? gn(a, e.format ?? "0,0") : a;
}
class K extends Bi {
  constructor(e, t) {
    super(e, t), this.isClick = !1, this.cfg = this.gridMain.config();
    const i = e.renderer.refValue;
    this.isRefFunction = T(i), this.isRefString = se(i), this.isVauleFunction = T(e.getValue), this.isRefString || this.isRefFunction ? this.refValue = i : this.refValue = i ?? {}, this.isClick = T(this.field.renderer.click);
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
    var i, s;
    const t = e[this.fieldName];
    return this.isVauleFunction ? (s = (i = this.field).getValue) == null ? void 0 : s.call(i, { field: this.field, item: e }) : this.field.displayFormat ? qi(t, this.field.displayFormat) : Ee(t) && !Ee(this.field.defaultValue) ? this.field.defaultValue : t;
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
    var s;
    this.isClick && ((s = this.field.renderer.click) == null || s.call(null, i));
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
class fn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    var s;
    const i = e.viewItem;
    if (this.cfg.dataManager.getDataType() === "group" && i) {
      const r = this.cfg.dataManager.getViewItems().findIndex((o) => o.id === i.id);
      if (r > -1) {
        const o = (s = this.gridMain.options().footer.paging) != null && s.enabled ? (this.cfg.paging.page - 1) * this.cfg.paging.pageSize : 0;
        t.textContent = String(o + r + 1);
        return;
      }
    }
    t.textContent = String(e.rowIndex + 1);
  }
  alignStyle() {
    return U.center;
  }
}
class mn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const s = e.item[L.CUD];
    if (s == q.CREATE) {
      t.textContent = "C";
      return;
    }
    if (s == q.MODIFY) {
      t.textContent = "M";
      return;
    }
    if (s == q.DELETE) {
      t.textContent = "D";
      return;
    }
    t.textContent = "";
  }
  alignStyle() {
    return U.center;
  }
}
class pn extends K {
  constructor(e, t) {
    var i, s, n;
    super(e, t), this.allowMultiSelect = ((n = (s = (i = this.gridMain.options()) == null ? void 0 : i.aside) == null ? void 0 : s.rowCheckbox) == null ? void 0 : n.allowMultiSelect) ?? !0;
  }
  render(e, t) {
    var r, o;
    const i = e.item, s = this.allowMultiSelect;
    let n = t.firstElementChild;
    if (!n) {
      n = H("div", "dg-choice", "");
      const l = H("div", "dg-choice-item " + (s ? "dg-checkbox" : "dg-radio"), {
        role: "presentation"
      });
      l.appendChild(H("div", "dg-indicator ", "")), n.appendChild(l), t.appendChild(n), this.initClick(l);
    }
    this.cfg.dataManager.isItemChecked(i[L.ID]) ? (r = n.firstElementChild) == null || r.classList.add(W) : (o = n.firstElementChild) == null || o.classList.remove(W);
  }
  initClick(e) {
    var n, r;
    const t = this.gridMain.config(), i = this.allowMultiSelect, s = (r = (n = this.gridMain.options().aside) == null ? void 0 : n.rowCheckbox) == null ? void 0 : r.click;
    t.eventManager.on({ el: e, type: "click" }, (o) => {
      var h;
      const l = this.getClosestCellElement(e), c = he(t, l), d = t.dataManager.isItemChecked(((h = c.viewItem) == null ? void 0 : h.id) ?? "");
      s && s(d) === !1 || (i ? this.multipleRowCheck(e, c, d) : this.singleRowCheck(e, c, d));
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
    var s;
    this.gridMain.getBody().setItemChecked(((s = t.viewItem) == null ? void 0 : s.id) ?? "", !0);
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
    var n;
    const s = !i;
    this.gridMain.getBody().addItemChecked(((n = t.viewItem) == null ? void 0 : n.id) ?? "", s);
  }
  alignStyle() {
    return U.center;
  }
}
class wn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    t.classList.contains("dg-row-drag-handle") || t.classList.add("dg-row-drag-handle");
  }
  alignStyle() {
    return U.center;
  }
  supportsEdit() {
    return !1;
  }
}
class Ui extends K {
  constructor(e, t) {
    var i, s;
    super(e, t), this.min = ((i = e.renderer.rule) == null ? void 0 : i.minimum) ?? 0, this.max = ((s = e.renderer.rule) == null ? void 0 : s.maximum) ?? 100;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i), r = this.min, o = this.max;
    let l = s, c = s;
    n && (l = (n == null ? void 0 : n.percent) ?? 0, c = n == null ? void 0 : n.label);
    let d = t.querySelector(".dg-bar-label"), h = t.querySelector(".dg-bar-fill");
    d || (d = document.createElement("span"), d.className = "dg-bar-label", t.appendChild(d)), h || (h = document.createElement("div"), h.className = "dg-bar-fill", t.appendChild(h)), h.classList.remove("dg-positive", "dg-negative"), l > 0 ? h.classList.add("dg-positive") : l < 0 && h.classList.add("dg-negative");
    let u = 0, f = 0;
    if (r < 0 && o > 0) {
      const g = Math.abs(r) + Math.abs(o), m = Math.max(r, Math.min(o, l)), p = Math.abs(r) / g * 100;
      u = Math.abs(m) / g * 100, f = m >= 0 ? p : p - u;
    } else if (r >= 0) {
      const g = o - r;
      u = (Math.max(r, Math.min(o, l)) - r) / g * 100, f = 0;
    } else {
      const g = Math.abs(r - o), m = Math.max(r, Math.min(o, l));
      u = Math.abs(m - o) / g * 100, f = 100 - u;
    }
    h.style.left = `${f}%`, h.style.width = `${u}%`, d.textContent !== c && (d.textContent = c);
  }
  getMinWidth(e, t) {
    return 50;
  }
}
const Wt = (a, e, t) => {
  t.isClickEnabled() && a.eventManager.on({ el: e, type: "pointerdown" }, (i) => {
    A(i);
    const s = i.target, n = t.getClosestCellElement(s), r = he(a, n);
    t.click(i, n, r);
  });
};
let In = class extends K {
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
    r ? o = (r == null ? void 0 : r.label) ?? r : o = n, i.textContent !== o && (i.textContent = o);
  }
  initEvent(e) {
    Wt(this.gridMain.config(), e, this);
  }
  alignStyle() {
    return U.center;
  }
  supportsEdit() {
    return !1;
  }
}, Ki = class extends K {
  constructor(e, t) {
    var r, o;
    super(e, t), this.listItems = [];
    const i = this.field.editRenderer, s = mt(i), n = ft(i);
    if (i != null && i.listItem) {
      this.valueDelimiter = ((r = i.listItem) == null ? void 0 : r.delimiter) ?? ",";
      const l = (o = i.listItem) == null ? void 0 : o.list;
      if (G(l)) {
        const c = Ve(l, s, n);
        this.listItems = c.list, this.valueLabelMap = c.map;
      } else T(l) && l({ init: !0 }, (c) => {
        const d = Ve(c, s, n);
        this.listItems = d.list, this.valueLabelMap = d.map;
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
      l = n.label ?? (se(n) ? n : "");
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
    return Gi(e, this.valueDelimiter, this.valueLabelMap);
  }
  initEvent(e) {
    this.cfg.eventManager.on({ el: e, type: "click" }, (t) => {
      const i = t.target, s = this.getClosestCellElement(i), n = he(this.cfg, s);
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
    return U.center;
  }
  getMinWidth(e, t) {
    return 70;
  }
}, yn = class extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
  }
}, xn = class extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i);
    if (n) {
      const r = n;
      if (ds(r)) {
        const o = t.firstChild;
        o ? t.replaceChild(r, o) : t.appendChild(r);
      } else
        t.innerHTML = r;
    } else
      t.innerHTML = s;
  }
  getMinWidth(e, t) {
    return 60;
  }
};
class Cn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i), r = (n == null ? void 0 : n.label) ?? null, o = (n == null ? void 0 : n.src) ?? s, l = (n == null ? void 0 : n.alt) ?? "";
    let c = t.querySelector("img.dg-cell-content"), d = t.querySelector("span.dg-cell-content-label");
    c || (c = document.createElement("img"), c.className = "dg-cell-content", t.appendChild(c)), c.src !== o && (c.src = o), l && c.alt !== l && (c.alt = l), r ? (d || (d = document.createElement("span"), d.className = "dg-cell-content-label", t.appendChild(d)), d.textContent !== r && (d.textContent = r, this.tooltip(t, r))) : d && (d.remove(), this.tooltip(t, ""));
  }
  getMinWidth(e, t) {
    return 60;
  }
}
let En = class extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i);
    let r = t.firstElementChild;
    r || (r = document.createElement("a"), r.className = "dg-cell-content", t.appendChild(r), this.initEvent(r)), r.href = "javascript:void(0);";
    const o = (n == null ? void 0 : n.href) ?? s, l = (n == null ? void 0 : n.target) ?? "_blank", c = (n == null ? void 0 : n.label) ?? s;
    this.applyRendererRefState(r, n) !== !1 && (!this.isClick && n ? (r.href = o, r.target = l) : r.removeAttribute("target"), r.textContent = c, this.tooltip(r, c));
  }
  initEvent(e) {
    Wt(this.gridMain.config(), e, this);
  }
}, Mn = class extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i);
    t.textContent !== s && (t.textContent = s, this.tooltip(t, s));
  }
  alignStyle() {
    return U.right;
  }
  supportsEdit() {
    return !0;
  }
};
class vn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    const i = "********";
    t.textContent !== i && (t.textContent = i);
  }
  alignStyle() {
    return U.center;
  }
  supportsEdit() {
    return !0;
  }
}
class Xi extends K {
  constructor(e, t) {
    super(e, t), this.rendererTooltip = null, this.rendererTooltipStates = /* @__PURE__ */ new WeakMap(), this.dataIds = /* @__PURE__ */ new WeakMap(), this.dataIdSequence = 0;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), r = this.getRefValue(s, i).value;
    if (!Array.isArray(r) || r.length === 0) {
      const S = t.firstElementChild;
      S && S.remove(), this.hideTooltip();
      return;
    }
    const o = this.getClosestCellElement(t), l = O(o), c = Math.max(0, Math.floor(l.width - it.horizontal)), d = Math.max(0, Math.floor(l.height - it.vertical));
    if (c <= 0 || d <= 0)
      return;
    let h = t.firstElementChild;
    (!h || h.tagName !== "CANVAS") && (h = document.createElement("canvas"), t.replaceChildren(h));
    const u = h.width !== c || h.height !== d;
    u && (h.width = c, h.height = d), this.bindTooltip(h, r, c);
    const f = h.dataset, g = this.getDataId(r);
    if (!u && f.dataId === g && f.dataLength === String(r.length))
      return;
    const m = h.getContext("2d");
    if (!m)
      return;
    let p = r[0], w = r[0];
    for (let S = 1; S < r.length; S++) {
      const v = r[S];
      v < p && (p = v), v > w && (w = v);
    }
    const I = w - p || 1, y = 5, x = 5, E = Math.max(0, c - y * 2), M = Math.max(0, d - x * 2), C = r.length - 1, b = C > 0 ? E / C : 0;
    m.clearRect(0, 0, c, d), m.strokeStyle = "#007acc", m.lineWidth = 1, m.beginPath();
    for (let S = 0; S < r.length; S++) {
      const v = r[S], V = y + S * b, D = x + (1 - (v - p) / I) * M;
      S === 0 ? m.moveTo(V, D) : m.lineTo(V, D);
    }
    m.stroke();
    for (let S = 0; S < r.length; S++) {
      const v = r[S], V = y + S * b, D = x + (1 - (v - p) / I) * M;
      v === w ? m.fillStyle = "#28a745" : v === p ? m.fillStyle = "#dc3545" : S === 0 || S === C ? m.fillStyle = "#0000ff" : m.fillStyle = "#ff9900", m.beginPath(), m.arc(V, D, 2.5, 0, Math.PI * 2), m.fill();
    }
    f.dataId = g, f.dataLength = String(r.length);
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
class ji extends K {
  constructor(e, t) {
    super(e, t), this.rendererTooltip = null, this.rendererTooltipStates = /* @__PURE__ */ new WeakMap(), this.dataIds = /* @__PURE__ */ new WeakMap(), this.dataIdSequence = 0;
  }
  render(e, t) {
    const i = e.item, s = this.getValue(i), n = this.getRefValue(s, i), r = n == null ? void 0 : n.value;
    if (!Array.isArray(r) || r.length === 0) {
      t.replaceChildren(), this.hideTooltip();
      return;
    }
    const o = this.getClosestCellElement(t), l = O(o), c = Math.max(0, Math.floor(l.width - it.horizontal)), d = Math.max(0, Math.floor(l.height - it.vertical));
    if (c <= 0 || d <= 0)
      return;
    let h = t.firstElementChild;
    (!h || h.tagName !== "CANVAS") && (h = document.createElement("canvas"), t.replaceChildren(h));
    const u = h.width !== c || h.height !== d;
    u && (h.width = c, h.height = d);
    const f = c / r.length;
    this.bindTooltip(h, r, c, f);
    const g = h.dataset, m = this.getDataId(r);
    if (!u && g.dataId === m && g.dataLength === String(r.length))
      return;
    const p = h.getContext("2d");
    if (!p)
      return;
    let w = r[0], I = r[0];
    for (let C = 1; C < r.length; C++) {
      const b = r[C];
      b < w && (w = b), b > I && (I = b);
    }
    const y = I - w || 1, x = 5, E = Math.max(0, d - x * 2);
    p.clearRect(0, 0, c, d);
    const M = r.length - 1;
    for (let C = 0; C < r.length; C++) {
      const b = r[C], S = C * f, v = (b - w) / y * E, V = d - v - x;
      b === I ? p.fillStyle = "#28a745" : b === w ? p.fillStyle = "#dc3545" : C === 0 || C === M ? p.fillStyle = "#0000ff" : p.fillStyle = "#ff9900";
      const D = Math.max(1, f - 2);
      p.fillRect(S + 1, V, D, v);
    }
    g.dataId = m, g.dataLength = String(r.length);
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
let bn = class extends K {
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
    Wt(this.gridMain.config(), e, this);
  }
};
class Sn extends K {
  constructor(e, t) {
    var s;
    super(e, t), this.iconState = /* @__PURE__ */ new WeakMap();
    const i = this.gridMain.options();
    this.treeNodeIconClass = (s = i.tree) == null ? void 0 : s.treeNodeIconClass, this.treeDataManager = this.cfg.dataManager;
  }
  /**
   * 트리 노드를 렌더링합니다.
   * @param cellInfo 셀 정보
   * @param element 셀 엘리먼트
   */
  render(e, t) {
    const i = e.viewItem, s = e.item, n = this.getValue(s), r = i.depth, o = !i.isLeaf, l = i.expanded > 0;
    let c = t.firstElementChild, d = t.querySelector(".dg-cell-content-expander"), h = t.querySelector(".dg-cell-content-icon"), u = t.querySelector(".dg-cell-content-title");
    c || (c = H("div", "dg-cell-content"), d = H("span", "dg-cell-content-expander dg-icon"), h = H("span", "dg-cell-content-icon dg-icon"), u = H("span", "dg-cell-content-title"), c.appendChild(d), c.appendChild(h), c.appendChild(u), t.appendChild(c), this.initExpanderEvent(d));
    const f = d.classList, g = h.classList;
    if (o ? (g.remove("dg-file"), g.add("dg-folder"), f.remove("dg-invisible"), f.toggle("expanded", l)) : (g.remove("dg-folder"), g.add("dg-file"), f.add("dg-invisible")), this.treeNodeIconClass) {
      const m = this.treeNodeIconClass(s, n) ?? "", p = this.iconState.get(h) ?? "";
      p !== m && (p && g.remove(...p.split(/\s+/)), m && g.add(...m.split(/\s+/)), this.iconState.set(h, m));
    }
    c.style.paddingLeft = `${r * 16}px`, u.textContent = n, this.tooltip(t, n);
  }
  initExpanderEvent(e) {
    const t = this.cfg;
    t.eventManager.on({ el: e, type: "pointerdown" }, (i) => {
      const s = i.target, n = this.getClosestCellElement(s), r = he(t, n);
      this.toggle(r);
    });
  }
  toggle(e) {
    this.treeDataManager.toggleRow(e.item[L.ID]), this.gridMain.refreshBody(!0, "treeExpander");
  }
  bindEvents(e, t, i) {
    return this.treeDataManager.getViewItems()[t.rowIndex].isLeaf ? !1 : (this.toggle(t), !0);
  }
  alignStyle() {
    return U.left;
  }
  supportsEdit() {
    return !0;
  }
  getMinWidth(e, t) {
    return 80;
  }
}
class Rn extends K {
  constructor(e, t) {
    super(e, t);
  }
  render(e, t) {
    t.innerHTML = '<input type="text">';
  }
}
class re {
  constructor(e, t) {
    this.isClick = !1, this.enabledView = !0, this.isInit = !1, this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.cfg = this.gridMain.config(), this.isClick = T(this.field.click), this.rendererContainer = this.gridMain.getRendererLayerElement();
  }
  /**
   * event class
   *
   * @public
   * @param {string} addClass
   * @returns {string}
   */
  getRendererClassName(e) {
    const t = rt(this.field.renderer);
    let i = e;
    t && (i = e + " " + t);
    const s = Ke(this.field.rendererClassName);
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
    }, s = H(
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
    var i;
    this.isClick && ((i = this.field.click) == null || i.call(null, { evt: e, field: this.field, element: t }));
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
      this.gridMain.getToolbar().refreshConditionFields();
    }
  }
  search(e) {
    if (this.field.search) {
      const t = this.gridMain.getToolbarValues();
      this.field.search.call(null, {
        evt: e,
        field: this.field,
        values: t
      });
    }
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
    var e;
    return this.evaluateCondition((e = this.field.condition) == null ? void 0 : e.visible, !0);
  }
  isDisabled() {
    var e;
    return this.evaluateCondition((e = this.field.condition) == null ? void 0 : e.disabled, !1);
  }
}
class Ln extends re {
  constructor(e, t) {
    super(e, t), this.listItems = [];
    const i = this.field.renderer;
    this.labelKey = mt(i), this.valueKey = ft(i), this.selectValues = ut(this.field.defaultValue || "", this.valueDelimiter);
    const s = i == null ? void 0 : i.listItem;
    if (this.labelOnly = !0, s) {
      this.labelOnly = s.labelOnly !== !1, this.isMultiple = s.multiple ?? !0, this.valueDelimiter = s.delimiter ?? ",";
      const n = s.list;
      if (G(n)) {
        const r = Ve(n, this.labelKey, this.valueKey);
        this.listItems = dt(r.list, this.valueKey), this.valueLabelMap = r.map;
      } else T(n) && n({ init: !0 }, (r) => {
        const o = Ve(r, this.labelKey, this.valueKey);
        this.listItems = dt(o.list, this.valueKey), this.valueLabelMap = o.map;
      });
    } else
      this.valueDelimiter = ",", this.isMultiple = !0, this.listItems = [], this.valueLabelMap = /* @__PURE__ */ new Map();
  }
  render(e) {
    const t = this.getControlElement(e), i = H("div", this.getRendererClassName("dg-choice"), "");
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
      if (i) return this.listItems[ae(i)][this.valueKey];
    });
    return e.length < 1 ? [] : this.isMultiple ? e : e[0];
  }
  setValue(e) {
    let t = ct(e, this.valueDelimiter);
    !this.isMultiple && t.length > 1 && (t = t.slice(0, 1));
    const i = this.listItems, s = this.valueKey;
    for (let n = 0; n < i.length; n++) {
      const r = i[n], o = this.choiceContainer.querySelector(`.dg-choice-item[data-index="${n}"]`);
      o && (t.includes(r[s]) ? o.classList.add(W) : o.classList.remove(W));
    }
    this.changeValue(this.selectValues);
  }
  template(e) {
    if (!G(e) || e.length === 0) return "";
    const t = [], i = this.isMultiple ? "dg-checkbox" : "dg-radio", s = this.labelOnly;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], o = (r == null ? void 0 : r[this.labelKey]) ?? "", d = `<div class="dg-choice-item ${[!!(r != null && r.disabled) ? "disabled" : "", s ? "dg-label-only" : "", i].filter((h) => h).join(" ")}" data-index="${n}">
        ${s ? "" : '<div class="dg-indicator"></div>'}
        <span class="dg-label dg-ellipsis">${de(String(o))}</span>
      </div>`;
      t.push(d);
    }
    return t.join("");
  }
  valid(e) {
    return !0;
  }
}
class Tn extends re {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = H("button", this.getRendererClassName("dg-button"));
    if (this.field.renderer.icon) {
      const s = H("span", "dg-icon");
      s.innerHTML = Li(this.field.renderer.icon), i.appendChild(s);
    } else if (this.field.renderer.iconStyle) {
      const s = H("span", "dg-icon " + this.field.renderer.iconStyle);
      i.appendChild(s);
    }
    if (this.field.label) {
      const s = H("span", "dg-button-label");
      s.textContent = this.field.label ?? "", i.appendChild(s);
    }
    t.appendChild(i), this.initEvent(i);
  }
  initEvent(e) {
    this.gridMain.config().eventManager.on({ el: e, type: "pointerdown" }, (i) => {
      A(i), this.click(i, e);
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
class Vn extends re {
  constructor(e, t) {
    var s, n, r;
    super(e, t), this.listItems = [];
    const i = this.field.renderer;
    this.labelKey = mt(i), this.valueKey = ft(i), i != null && i.listItem ? (this.isMultiple = ((s = i.listItem) == null ? void 0 : s.multiple) ?? !1, this.valueDelimiter = ((n = i.listItem) == null ? void 0 : n.delimiter) ?? ",", this.getListItems()) : (this.valueDelimiter = ",", this.isMultiple = !1, this.valueLabelMap = /* @__PURE__ */ new Map()), this.required = i.required ?? !1, this.selectValues = [], this.useIncludeAllOption = this.isMultiple && (((r = this.field.renderer.listItem) == null ? void 0 : r.includeAllOption) ?? !1);
  }
  getListItems() {
    var s;
    const t = (s = this.field.renderer.listItem) == null ? void 0 : s.list, i = (n) => {
      const { list: r, map: o } = Ve(n, this.labelKey, this.valueKey);
      this.listItems = dt(r, this.valueKey), this.valueLabelMap = o;
    };
    Array.isArray(t) ? i(t) : T(t) && t({ init: !0, values: this.getToolbarValues() }, i);
  }
  render(e) {
    const t = this.getControlElement(e), i = document.createElement("button");
    i.className = this.getRendererClassName("dg-dropdown-button");
    const s = H("div", "dg-dropdown-label"), n = H("div", "dg-dropdown-icon");
    i.appendChild(s), i.appendChild(n), t.appendChild(i), this.selectLabelElement = s;
    const r = xe("div", "dg-dropdown-menu dg-toolbar " + Me, this.field.$uid);
    this.rendererContainer.appendChild(r), this.dropdownElement = r, this.initEvent(i), this.setValue(ut(this.field.defaultValue || "", this.valueDelimiter));
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
      const d = this.listItems.filter((f) => !f.disabled).map((f) => f[i]), h = this.listItems[l][i], u = Oi(this.selectValues, h, s, d, n);
      ys(this.selectValues, u) || this.setValue(u), s || (this.dropdownElement.style.display = "none");
    });
  }
  valid(e) {
    return !0;
  }
  editRender(e) {
    const t = this.field.$uid, i = this.gridMain.config();
    i.activeComponent = t, this.getListItems();
    const s = this.listItems;
    if (this.useIncludeAllOption && s.filter((r) => r[this.valueKey] == z).length < 1) {
      const r = {};
      r[this.valueKey] = z, r[this.labelKey] = this.language.getMessage("select.all"), s.unshift(r);
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
    const i = O(e), s = t.style;
    s.height = "auto", this.gridMain.openLayer(t), s.width = `${i.width}px`;
    const n = gt(this.rendererContainer, e, t);
    s.top = `${n.top}px`, s.left = `${n.left}px`, s.height = `${n.height}px`, nn(t, this.gridMain.config().eventManager);
  }
  setValue(e) {
    const t = ct(e, this.valueDelimiter), i = this.listItems, s = this.valueKey;
    let n = !1;
    this.useIncludeAllOption && t.includes(z) && (n = !0), this.selectValues = t, this.selectLabelElement.textContent = Gi(t, this.valueDelimiter, this.valueLabelMap).join(
      this.valueDelimiter
    ), this.changeValue(t), this.dropdownElement && _i(this.dropdownElement, i, t, s, n);
  }
  dropdownMenuTemplate(e) {
    if (!G(e) || e.length === 0) return "";
    const { valueKey: t, labelKey: i } = this, s = [];
    for (let n = 0; n < e.length; n++) {
      const r = e[n];
      let o = "dg-dropdown-item";
      r.disabled && (o += " disabled"), r[t] === z && (o += " dg-all");
      const l = r[i] ?? "";
      s.push(`<div data-index="${n}" class="${o}">${de(String(l))}</div>`);
    }
    return s.join("");
  }
  getValue() {
    return this.selectValues;
  }
}
class Hn extends re {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e);
    t.classList.add(this.getRendererClassName("dg-html"));
    const i = this.field.defaultValue;
    i && (T(i) ? t.innerHTML = i(this.field) : t.innerHTML = i);
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
class An extends re {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = this.field.defaultValue;
    if (!i) return;
    const s = T(i) ? i(this.field) : i, n = document.createElement("a");
    n.className = this.getRendererClassName("dg-link"), t.appendChild(n), this.initEvent(n), n.href = "javascript:void(0);", s != null && s.href && (n.href = s.href, s.target && (n.target = s.target)), n.textContent = s.label ?? this.field.label;
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
class Dn extends re {
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
class li extends re {
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
class kn extends re {
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
class $n extends re {
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
class Fn extends re {
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
class zn extends re {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    const t = this.getControlElement(e), i = H("div", "dg-search"), s = H("input", this.getRendererClassName("dg-search-text"), {
      type: "text",
      autocomplete: "off",
      placeholder: this.field.placeholder ?? ""
    });
    i.appendChild(s);
    const n = H("button", "dg-button dg-search-btn"), r = H("span", "dg-icon");
    r.innerHTML = Li("search"), n.appendChild(r), i.appendChild(n), t.appendChild(i), this.editElement = s, this.setValue(this.field.defaultValue ?? ""), this.initEvt(s, n);
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
  getValue() {
    return this.editElement.value;
  }
  setValue(e) {
    this.editElement.value = e;
  }
}
class Nn extends re {
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
class Wn extends re {
  constructor(e, t) {
    super(e, t);
  }
  render(e) {
    var r;
    const t = this.getControlElement(e);
    let i = "";
    const s = (r = this.field) == null ? void 0 : r.rendererClassName;
    s && (T(s) ? i = s(this.field) : i = s);
    const n = H("span", i, {});
    n.textContent = this.field.label || "", t.appendChild(n);
  }
  getValue() {
    return "";
  }
  setValue(e) {
  }
}
const Bn = {
  lineNumber: fn,
  modifyInfo: mn,
  rowCheckbox: pn,
  rowDragHandle: wn
}, ai = {
  dropdown: Ki,
  bar: Ui,
  button: In,
  hidden: yn,
  html: xn,
  image: Cn,
  link: En,
  number: Mn,
  text: bn,
  password: vn,
  sparkline: Xi,
  sparklineBar: ji,
  tree: Sn,
  // tree는 TextRenderer로 일단 처리. TreeRenderer는 별도 구현 필요
  custom: Rn
}, tt = {
  date: sn,
  custom: Js,
  text: un,
  number: ln,
  dropdown: rn,
  switch: dn,
  checkbox: Zs,
  password: an,
  range: cn,
  textarea: hn
}, ci = {
  button: Tn,
  choice: Ln,
  custom: kn,
  date: $n,
  dropdown: Vn,
  number: Dn,
  switch: Nn,
  text: li,
  textarea: li,
  html: Hn,
  link: An,
  search: zn,
  hidden: Fn,
  label: Wn
};
function Pn(a) {
  var t, i;
  const e = $({}, Rt, a);
  if (e.height != "auto" && !Y(e.height)) throw new Error("invalid height : " + e.height);
  if (e.width != "auto" && !Y(e.width)) throw new Error("invalid width : " + e.width);
  if (e.tree && ((t = e.groupingFields) != null && t.length || (i = e.rowSpanFields) != null && i.length))
    throw new Error("tree cannot be used together with groupingFields or rowSpanFields");
  return a.hoverMode || (e.hoverMode = Ge(e.selectionMode) ? "row" : "cell"), e;
}
function On(a) {
  Rt = $({}, Rt, a);
}
let Rt = {
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
  style: et.default,
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
  selectionMode: ie.row,
  /**
   * hover mode
   * cell, row, none
   */
  hoverMode: Qe.cell,
  /**
   * delete mode
   * hard, soft
   */
  deleteMode: "hard",
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
    height: xi,
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
      width: Et
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
      width: Ci,
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
    height: Ei,
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
  sumFields: [],
  showGroupSum: !0,
  showGrandSum: !0
};
const di = {
  type: "text"
}, Lt = {
  type: "text",
  trueValue: !0,
  falseValue: !1,
  showLabel: !1
}, _n = {
  name: "",
  label: "",
  width: 0,
  renderer: {
    type: "text",
    trueValue: !0,
    falseValue: !1
  },
  $renderer: tt.text,
  $uid: "",
  $width: 0
};
class fe {
  constructor(e) {
    e != null && (this.element = e);
  }
  findDaraElement(e) {
    const t = this.element.querySelector(e);
    return t && new fe(t);
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
    if (N(e))
      return this.element.textContent;
    this.element.textContent = e;
  }
  html(e) {
    if (N(e))
      return this.element.outerHTML;
    this.empty(), !Ee(e) && (this.element.innerHTML = e);
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
    se(t) ? this.element.insertAdjacentHTML(e, t) : this.element.insertAdjacentElement(e, t);
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
   * @param cssValueObject  css value object
   * @returns
   */
  css(e) {
    for (const t in e)
      bi(e, t) && this.element.style.setProperty(t, e[t]);
    return this;
  }
  /**
   * css
   *
   * @param cssValueObject  css value object
   * @returns
   */
  removeCss(e) {
    for (const t of e)
      this.element.style.removeProperty(t);
    return this;
  }
}
class Gn {
  constructor(e, t, i) {
    this.reversedAllRanges = [], this.rowLine = /* @__PURE__ */ new Set(), this.columnLine = /* @__PURE__ */ new Set(), this.serialNumber = 0, this.gridMain = e, this.options = t, this.config = i;
  }
  initSelection() {
    this.config.selection = Ds(), this.setReverseAllRange(), this.gridMain.getHeader().clearAnchorCell(), this.rowLine.clear(), this.columnLine.clear();
  }
  setSelectionRangeInfo(e, t, i) {
    if (t !== !0 && this.isAllSelect())
      return;
    const s = this.config, { dataInfo: n } = s;
    if (n.rowLength < 1)
      return;
    const r = e.range;
    if (t && (this.serialNumber = 0, this.initSelection()), N(r)) return;
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
      let h = d.minIdx, u = d.maxIdx, f = d.minCol, g = d.maxCol;
      const m = l.length;
      if (m > 0)
        for (let p = 0; p < m; p++) {
          const w = l[p];
          hi(w, h, f, g) && (h = w.maxIdx), hi(w, u, f, g) && (u = w.minIdx), ui(w, f, h, u) && (f = w.maxCol + 1), ui(w, g, h, u) && (g = w.minCol);
        }
      h <= u && f <= g && (h < i && (i = h), u > s && (s = u), f < n && (n = f), g > r && (r = g));
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
    const t = e.some((f) => f.maxIdx >= 1e6), i = 12, s = (1 << i) - 1, n = 1e5, r = t ? (f, g) => f * n + g : (f, g) => f << i | g, o = t ? (f) => f / n | 0 : (f) => f >>> i, l = t ? (f) => f % n : (f) => f & s, c = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set();
    for (const f of e)
      for (let g = f.minIdx; g <= f.maxIdx; g++)
        for (let m = f.minCol; m <= f.maxCol; m++) {
          const p = r(g, m);
          c.has(p) || (c.add(p), f.mode === "add" && d.add(p));
        }
    this.rowLine.clear(), this.columnLine.clear();
    const h = this.rowLine, u = this.columnLine;
    d.forEach((f) => {
      h.add(o(f)), u.add(l(f));
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
    const s = t.allRange, n = $(t, i);
    n.allRange = s;
    const r = i.range;
    let o = "";
    if (!qe(r.startCol) && r.modifierKey != 2) {
      let l = !1;
      r.type == "column" ? l = this.isColumnSelection(r) : l = this.isSelection(r.startIdx, r.startCol), r.mode = e || !l ? "add" : "remove", o = r.mode, n.id = this.getSelectionId(o), n.range = $(n.range, r);
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
    this.removeStartAnchorCell(), oe(e.finds(".dg-cell." + j.SELECTION), j.SELECTION);
  }
  selectAnchorCell() {
    this.gridMain.getHeader().selectColumnAnchorCell(), this.gridMain.getBody().selectRowAnchorCell();
  }
  removeStartAnchorCell() {
    const e = this.gridMain.getBody().getStartCellElement();
    oe(e, j.START_CELL);
  }
  /**
   * @method selectionData
   * @description select data 구하기.
   */
  selectionData(e = "text", t = !1) {
    var E;
    const { dataManager: i, currentFields: s, selection: n, dataInfo: r } = this.config, o = i.getViewItems(), l = e === "json";
    if (r.rowLength < 1) return l ? {} : "";
    const c = this.isAllSelect(), d = c ? 0 : n.minCol, h = c ? r.colLength - 1 : n.maxCol, u = c ? 0 : n.minIdx, f = c ? r.lastRow : n.maxIdx;
    if (u < 0 || f < 0) return l ? {} : "";
    const g = [], m = /* @__PURE__ */ new Map(), p = { count: 0, numbers: [] }, w = new Set(this.options.sumFields ?? []), I = s.find((M) => !M.$isAside), y = s.find((M) => !M.$isAside && !w.has(M.name)) ?? I;
    for (let M = u; M <= f; M++) {
      const C = o[M];
      if (!C) continue;
      const b = !!C.groupRowType, S = i.getRowItem(C.id), v = l ? {} : [];
      let V = !1;
      for (let D = d; D <= h; D++) {
        const B = s[D];
        if (B.hidden || B.$isAside) continue;
        const P = B.name, X = c || this.isSelection(M, D);
        let _ = "";
        X && ((C.groupRowType === "groupSummary" || C.groupRowType === "group") && C.groupField && B.name === C.groupField ? _ = C.groupRowType === "group" ? `${C.groupField}: ${String(C.groupValue ?? "")}` : `${String(C.groupValue ?? "")} 합계` : C.groupRowType === "groupSummary" && B === y ? _ = "Subtotal" : C.groupRowType === "grandSummary" && B === y ? _ = "Grand Total" : C.groupRowType && C.groupRowType !== "group" && w.has(B.name) ? _ = ((E = C.groupSums) == null ? void 0 : E[B.name]) ?? "" : b || (_ = B.$renderer.getValue(S)), V = !0, m.has(D) || m.set(D, B), !b && !Ee(_) && (p.count++, Y(_) && p.numbers.push(Number(_)))), l ? v[P] = _ : v.push(js(_));
      }
      V && g.push(l ? v : v.join("	"));
    }
    if (!l) return g.join(`
`);
    const x = Array.from(m.values());
    if (t && p.numbers.length > 0) {
      const M = {
        count: p.count,
        numFieldCount: p.numbers.length,
        min: -1,
        max: -1,
        avg: "",
        sum: -1
      }, C = p.numbers, b = C.reduce((S, v) => S + v, 0);
      return M.min = Math.min(...C), M.max = Math.max(...C), M.sum = b, M.avg = (b / C.length).toFixed(1), {
        header: x,
        data: g,
        summary: M
      };
    }
    return {
      header: x,
      data: g
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
   * @param {boolean} initFlag
   */
  setCellSelection() {
    const e = this.config, { selection: t, scroll: i, dataInfo: s, fixedLeftIndex: n, fixedRightIndex: r } = e, o = e.dataInfo.startCol, l = this.isAllSelect(), c = 0, d = i.viewRow, h = l ? o : t.minCol, u = l ? s.colLength : t.maxCol, f = i.startIdx, g = i.startCol, {
      left: m,
      center: p,
      right: w
    } = this.gridMain.getBody().getBodyCellElements(), I = n > 0 && n > h, y = r > 0 && r <= u, { startIdx: x, startCol: E } = t.startCell, M = Math.min(n - 1, u), C = Math.min(i.endCol, u);
    this.clearAnchorCell();
    for (let b = c; b < d; b++) {
      const S = f + b;
      if (I)
        for (let v = o; v <= M; v++)
          this.updateCellSelectionClass(m[b][v], S, v, x, E);
      for (let v = g; v <= C; v++)
        this.updateCellSelectionClass(p[b][v], S, v, x, E);
      if (y)
        for (let v = r; v <= u; v++)
          this.updateCellSelectionClass(w[b][v], S, v, x, E);
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
    return s == t && n == i && r.add(j.START_CELL), this.isAllSelect() || this.isSelection(t, i) ? (r.contains(j.SELECTION) || r.add(j.SELECTION), !0) : (r.contains(j.SELECTION) && r.remove(j.SELECTION), !1);
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
   * @param {*} dataInfo
   * @param {boolean} isMouseDown
   * @returns {{ startCol: number; endCol: number; }}
   */
  getSelectionModeColInfo(e, t, i, s, n) {
    let r = t, o = t;
    return Ge(e) ? (r = i.dataInfo.startCol, o = i.dataInfo.colLength - 1) : e == ie.multiCell && (n ? r = -1 : ye(s, "dg-line-number") ? (r = i.dataInfo.startCol, o = i.dataInfo.colLength - 1) : r = t), { startCol: r, endCol: o };
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
    Ge(this.options.selectionMode) && (n = 0, r = this.config.dataInfo.colLength - 1), Nt(this.options.selectionMode) && e != "Tab" && He(t) ? this.setSelectionRangeInfo(
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
function hi(a, e, t, i) {
  return a.minIdx <= e && e <= a.maxIdx && a.minCol <= t && a.maxCol >= i;
}
function ui(a, e, t, i) {
  return a.minCol <= e && e <= a.maxCol && a.minIdx <= t && a.maxIdx >= i;
}
const _e = class _e {
  constructor(e = _e.DEFAULT_MAX_COUNT) {
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
    return Number.isFinite(e) ? Math.max(0, Math.floor(e)) : _e.DEFAULT_MAX_COUNT;
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
_e.DEFAULT_MAX_COUNT = 100;
let Tt = _e;
class Yi {
  constructor(e, t, i) {
    this.opts = e, this.gridMain = t, this.type = i, this.originalItems = [], this.originalViewItems = [], this.viewItems = [], this.sortBaseItems = [], this.sortOrders = [], this.searchMap = /* @__PURE__ */ new Map(), this.rowMap = /* @__PURE__ */ new Map(), this.rowCheckSet = /* @__PURE__ */ new Set(), this.matchOffsetMap = /* @__PURE__ */ new Map(), this.beforeDataRowLength = -1, this.cfg = t.config(), this.rowHeight = this.cfg.rowHeight, this.rowIdField = this.cfg.rowIdField, this.history = new Tt();
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
    const n = t.name, r = e[n], o = e[L.CUD];
    if (s) {
      if (s(e, t, i) === !1)
        return !1;
    } else
      e[n] = i;
    const l = e[n];
    if (hs(r, l))
      return !1;
    e[L.CUD] === q.READ && this.setItemStatus(e, q.MODIFY);
    const c = e[L.CUD], d = e[L.ID], h = this.createHistorySelectionByChange(d, t);
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
    const i = e[L.CUD];
    if (e[L.CUD] = t, t === q.DELETE) {
      const s = {
        type: "update",
        rowId: e[L.ID],
        fieldName: L.CUD,
        beforeValue: i,
        afterValue: q.DELETE,
        beforeStatus: i,
        afterStatus: q.DELETE
      };
      this.history.add(s);
    }
  }
  removeSoftItem(e) {
    this.beginHistory();
    try {
      for (const t of e)
        this.setItemStatus(this.getRowItem(t), q.DELETE);
      this.commitHistory();
    } catch (t) {
      throw this.rollbackHistory(), t;
    }
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
      s[L.CUD] != q.READ && t.push(this.filterRowItem(s, !1));
    }
    return t;
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
   * @param cellInfo 체크된 셀 정보
   * @param checked 체크 여부
   */
  setItemChecked(e, t) {
    t ? this.rowCheckSet.add(e) : this.rowCheckSet.delete(e);
  }
  /**
   * 특정 아이템이 체크되어 있는지 여부 반환
   * @param item 체크 여부를 확인할 아이템
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
    this.history.clear(), this.clearAllCheck(), this.originalItems = e;
  }
  createItem(e, t) {
    return this.cfg.dataManager.addItems([e], t, q.CREATE);
  }
  getSortBaseItems() {
    return this.sortBaseItems;
  }
  setSortBaseItems(e) {
    this.sortBaseItems = e;
  }
  dataSort(e, t) {
    const i = Array.from(e);
    if (this.sortOrders = e, this.sortOpts = t, i.forEach((n) => {
      n.field.getValue && (n.isValue = !0);
    }), this.opts.header.sort.customSorting) {
      this.setViewItems(this.opts.header.sort.customSorting(this.getAllRowItems(!0), i, t));
      return;
    }
    const s = this.getSortData(i, t);
    this.setViewItems(s);
  }
  initializeRowItem(e, t = 0, i = q.READ) {
    const s = this.rowIdField, n = e[s] ?? this.generateUUID();
    return e[s] || (e[s] = n), this.rowIdField != L.ID && (e[L.ID] = n), e[L.DEPTH] = t, e[L.CUD] = i, e[L.HEIGHT] = this.rowHeight, e;
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
  /**
   *  grid view에 보여지는 item의 id 배열 설정
   * @param ids item id 배열
   * @param start start index
   * @param end end index
   */
  setViewItems(e) {
    var s;
    const t = e;
    this.viewItems = t;
    const i = this.cfg.dataInfo;
    i.rowLength = t.length, i.lastRow = i.rowLength > 0 ? i.rowLength - 1 : 0, this.beforeDataRowLength != -1 && this.beforeDataRowLength !== i.rowLength && (this.gridMain.selectionInfo.initSelection(), this.gridMain.calcBody(), this.gridMain.refreshBody(!1, "setViewItems")), this.beforeDataRowLength = i.rowLength, (s = this.gridMain.getSummary()) == null || s.drawData();
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
    this.rowMap.delete(e), this.rowCheckSet.delete(e), this.searchMap.delete(e), this.matchOffsetMap.delete(e);
  }
  getAllRowItems(e = !1) {
    const t = this.getViewItems(), i = new Array(t.length);
    for (let s = 0; s < t.length; s++) {
      const n = this.getRowItem(t[s].id);
      i[s] = this.filterRowItem(n, e);
    }
    return i;
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
      if (s.indexOf(Pe) === 0) {
        t && s === L.ID && (i[s] = e[s]);
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
      if (t != null && t.fieldName) {
        const n = this.cfg.allFieldMap.get(t == null ? void 0 : t.fieldName);
        n != null && n.$colSeq && (s = n == null ? void 0 : n.$colSeq);
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
      ), (t == null ? void 0 : t.scrollIntoView) !== !1 && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: i, drawFlag: !0 });
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
    var o, l;
    const e = this.cfg.selection;
    if (!(e != null && e.range))
      return;
    const t = e.range, i = t.startIdx, s = t.endIdx;
    if (i < 0 || s < 0 || i >= this.viewItems.length || s >= this.viewItems.length)
      return;
    const n = (o = this.viewItems[i]) == null ? void 0 : o.id, r = (l = this.viewItems[s]) == null ? void 0 : l.id;
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
    i && (i[e.fieldName] = t ? e.beforeValue : e.afterValue, i[L.CUD] = t ? e.beforeStatus : e.afterStatus);
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
  /**
   * 삭제된 row History 적용
   *
   * remove의 의미:
   * - undo : row 복원
   * - redo : row 제거
   *
   * View 위치는 History에서 관리하지 않습니다.
   */
  applyRemoveHistory(e, t) {
    if (t) {
      this.rowMap.set(e.rowId, e.item);
      return;
    }
    this.rowMap.delete(e.rowId), this.removeViewItemById(e.rowId);
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
    var r;
    this.syncHistoryViewItems(e, t), this.sortOrders.length > 0 ? this.dataSort(this.sortOrders, this.sortOpts) : this.setViewItems(this.viewItems);
    const i = this.cfg, s = this.getViewItemIndex(e.changes[0].rowId), n = Wi(i, i.scroll, s, -1) > 0;
    this.gridMain.refreshBody(!n, "history"), n && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: this.getViewItemIndex(e.changes[0].rowId) }), (r = this.gridMain.getSummary()) == null || r.drawData();
  }
  /**
   * 정렬이 없는 상태에서 History로 추가/삭제된 row를 현재 View에 반영합니다.
   *
   * 복원 위치는 History에서 관리하지 않습니다.
   * 현재 View의 마지막에 추가하며, 정렬 상태에서는 dataSort()로 재배치합니다.
   */
  syncHistoryViewItems(e, t) {
    for (const i of e.changes) {
      if (i.type === "update")
        continue;
      const s = i.type === "add" ? !t : t;
      for (const n of /* @__PURE__ */ new Set([this.originalViewItems, this.viewItems])) {
        const r = n.findIndex((o) => o.id === i.rowId);
        s ? r === -1 && n.push({ id: i.rowId, sortOrder: n.length }) : r > -1 && n.splice(r, 1);
      }
    }
  }
  search(e, t) {
    const i = ["matchCase", "matchWholeWord", "useRegex", "searchFields"];
    let s = this.beforeKeyword == e;
    if (this.beforeSearchMode) {
      for (const p of i)
        if (p === "searchFields") {
          const w = t.searchFields, I = this.beforeSearchMode.searchFields;
          if (G(w) && JSON.stringify(w) != JSON.stringify(I) || !G(w) && w != I) {
            s = !1;
            break;
          }
        } else if (this.beforeSearchMode[p] !== t[p]) {
          s = !1;
          break;
        }
    } else
      s = !1;
    let n, r, o, l = !1;
    if (this.beforeKeyword == e && s ? (n = this.cfg.searchMatchInfo, o = this.getViewItems()) : (l = !0, n = this.clearSearchInfo(), r = this.getSearchData(e, t), n.matchCount = r.matchCount, o = r.items), l && this.setViewItems(o), this.sortOrders.length > 0) {
      const p = JSON.stringify(
        this.sortOrders.map(({ name: w, ascOrder: I, sortCell: y }) => ({
          name: w,
          ascOrder: I,
          sortCell: y
        }))
      );
      (l || this.beforeSearchSortInfo !== p) && (this.dataSort(this.sortOrders, this.sortOpts), this.beforeSearchSortInfo = p);
    }
    if (this.beforeKeyword = e, this.beforeSearchMode = $({}, t), n.matchCount < 1) {
      this.setCurrentMatchInfo(0, {
        id: "",
        rowIndex: -1,
        cellIndex: -1
      });
      return;
    }
    const c = this.getMatchInfo(n, l, t), { rowIndex: d, cellIndex: h } = c, { startIdx: u, insideViewRow: f, insideStartCol: g, insideEndCol: m } = this.cfg.scroll;
    if (u + f <= d || d < u) {
      let p = -1;
      d < f ? p = 0 : p = d - (f - Math.ceil(f / 2)), p > -1 && this.gridMain.getScroll().moveVerticalScroll({ rowIdx: p, drawFlag: !1 });
    }
    if (h > -1) {
      const p = c.matchedFields[h], w = this.cfg.allFieldMap.get(p.fieldName);
      if (w) {
        const I = w.$colSeq;
        w.$panel == "center" && (I < g || m < I) && this.gridMain.getScroll().moveHorizontalScroll({ colIdx: I, drawFlag: !1 });
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
   * @param items check item list
   * @param matchId
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
    var l;
    const n = s.length, r = i.cellIndex, o = this.getSearchMapItemLength();
    for (let c = 0; c < n; c++) {
      const d = e ? (t + c) % n : (t - c + n) % n, h = s[d], u = (l = this.getSearchMapItem(h.id)) == null ? void 0 : l.matchedFields;
      if (!(u != null && u.length)) continue;
      const f = d === t, g = this.resolveCellIndex(e, f, u.length, r, o);
      if (!(g < 0))
        return this.createMatchInfo(h.id, d, g, u);
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
const qn = 200;
function Zi(a, e, t, i) {
  const s = [], n = i.postProcess, r = a.length;
  if (!t.trim()) {
    for (let I = 0; I < r; I++) {
      const y = a[I];
      y.matchCount = void 0, y.matchedFields = void 0, y.isCurrentMatch = !1, s.push(y), n && n(!1, y);
    }
    return { isOriginal: !0, matchCount: 0, items: s };
  }
  const { matchCase: o, matchWholeWord: l, useRegex: c, searchFields: d, hideNonMatched: h } = i;
  let u = i.matchWholeRegex;
  const f = Un(a, e, d), g = o ? t : t.toLowerCase();
  l && !u && (u = vi);
  let m = null, p = null;
  if (c)
    if (t.length > qn)
      console.warn("Search pattern too long, falling back to text search.");
    else if (jn(t))
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
    p = new RegExp(`\\b${Yn(g)}\\b`, I);
  }
  let w = 0;
  for (let I = 0; I < r; I++) {
    const y = a[I], x = e.getRowItem(y.id), E = Kn(
      x,
      t,
      g,
      o,
      l,
      m,
      p,
      f,
      u
    ), M = E.length, C = M > 0;
    y.isCurrentMatch = !1, C ? (w += M, y.matchedFields = E, y.matchCount = M, s.push(y)) : (y.matchCount = void 0, y.matchedFields = void 0, h || s.push(y)), n && n(C, x, y);
  }
  return { isOriginal: !1, matchCount: w, items: s };
}
function Un(a, e, t) {
  return t === z ? a.length > 0 ? Object.keys(e.getRowItem(a[0].id)) : [] : Array.isArray(t) ? $t(t) : [t];
}
function Kn(a, e, t, i, s, n, r, o, l) {
  const c = [];
  for (const d of o) {
    if (!bi(a, d)) continue;
    const h = String(a[d]);
    if (!h) continue;
    const u = Xn(
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
function Xn(a, e, t, i, s, n, r, o) {
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
        return Zn(a, e, i, o);
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
function jn(a) {
  const e = /\([^()]*[+*][^()]*\)[+*]/, t = /\([^()]*\|[^()]*\)[+*]/;
  return e.test(a) || t.test(a);
}
function Yn(a) {
  return a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function be(a, e) {
  return a.match(e) || [];
}
function Zn(a, e, t, i) {
  t || (a = a.toLowerCase(), e = e.toLowerCase());
  const s = be(a, i), n = be(e, i);
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
        const g = be(a.slice(c), i)[0];
        if (!g) break;
        c = a.indexOf(g, c) + g.length, l++;
      }
      const d = be(a.slice(c), i)[0], h = a.indexOf(d, c);
      let u = h;
      for (let g = 0; g < n.length; g++) {
        const m = be(a.slice(u), i)[0];
        u = a.indexOf(m, u) + m.length;
      }
      const f = a.substring(h, u);
      if (be(f, i).join(" ") === n.join(" "))
        return { start: h, end: u };
    }
  }
  return null;
}
class Ji extends Yi {
  constructor(e, t, i = "list") {
    super(e, t, i);
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
      this.initializeRowItem(n, t, q.READ);
      const r = n[L.ID];
      s.push({
        id: r,
        sortOrder: i++
      }), this.setRowItem(r, n);
    }), s;
  }
  setItems(e) {
    const t = this.initItems(e);
    super.setItems(e), super.setOriginalViewItems(t), this.updatePagingAndViewItems(t);
  }
  /**
   * 페이징 옵션 여부에 따라 현재 ViewItems 및 페이징 정보를 업데이트합니다.
   */
  updatePagingAndViewItems(e) {
    var i;
    const t = this.opts.footer;
    if (t != null && t.enabled && ((i = t.paging) != null && i.enabled)) {
      const s = e.length, n = this.opts.paging, r = Hi(n ?? {}, s);
      if (this.gridMain.setPaging(r), s < r.pageSize)
        this.setViewItems(e);
      else {
        const o = r.pageSize, l = (r.page - 1) * o, c = $t(e, l, l + o);
        this.setViewItems(c);
      }
    } else
      this.setViewItems(e);
  }
  getSearchData(e, t) {
    const i = this.getOriginalViewItems();
    this.matchOffsetMap.clear();
    let s = "", n = 0;
    t.postProcess = (o, l, c) => {
      var h;
      if (!o || !c) return;
      const d = c.id;
      s || (s = c.id), this.matchOffsetMap.set(d, n), n += ((h = c.matchedFields) == null ? void 0 : h.length) ?? 0, this.addSearchMapItem(c.id, c);
    };
    const r = Zi(i, this.cfg.dataManager, e, t);
    if (s) {
      const o = this.getSearchMapItem(s);
      o && (o.isCurrentMatch = !0);
    }
    return r;
  }
  getSortData(e, t) {
    var c;
    const i = kt(this.getViewItems(), this.cfg.dataManager, e, t.nullsLast);
    if (!this.cfg.searchEnabled)
      return i;
    const s = this.cfg.searchMatchInfo, n = s.id ?? "";
    let r = 0, o = -1;
    this.matchOffsetMap.clear();
    let l = 0;
    for (let d = 0; d < i.length; d++) {
      const h = i[d].id, u = this.getSearchMapItem(h);
      u && (this.matchOffsetMap.set(h, l), l += ((c = u.matchedFields) == null ? void 0 : c.length) ?? 0), o == -1 && h == n && (o = d);
    }
    return r = this.getCurrentMatchIndex(n), this.setCurrentMatchInfo(r, {
      id: n,
      rowIndex: o,
      cellIndex: s.cellIndex
    }), i;
  }
  getMatchInfo(e, t, i) {
    const s = i.direction === Re.NEXT, n = this.getViewItems(), r = this.getSearchMapItem(e.id);
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
  addItems(e, t = { position: "after" }, i = q.READ) {
    if (!e || e.length === 0) return -1;
    const s = [...this.getOriginalViewItems()];
    let n = s.length;
    const r = (t == null ? void 0 : t.position) === "before", o = t == null ? void 0 : t.rowId;
    if (o !== void 0) {
      const c = s.findIndex((d) => d.id === o);
      c !== -1 && (r ? n = c : n = c + 1);
    } else r && (n = 0);
    const l = e.map((c) => {
      this.initializeRowItem(c, 0, i);
      const d = c[L.ID];
      return this.setRowItem(d, c), this.addHistory(d, c), {
        id: d,
        sortOrder: 0
      };
    });
    return s.splice(n, 0, ...l), s.forEach((c, d) => {
      c.sortOrder = d;
    }), this.setOriginalViewItems(s), this.updatePagingAndViewItems(s), n;
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
    return this.opts.deleteMode == "soft" ? this.removeSoftItem(e) : i.forEach((r) => {
      const o = r.id;
      t.has(o) ? (s.push(o), this.deleteRowItem(o)) : n.push(r);
    }), s.length === 0 ? [] : (n.forEach((r, o) => {
      r.sortOrder = o;
    }), this.setOriginalViewItems(n), this.updatePagingAndViewItems(n), s);
  }
  expandRow(e) {
  }
}
const pe = {
  USER: 1,
  SEARCH: 2
};
class Oe extends Yi {
  constructor(e, t) {
    super(e, t, "tree"), this.idViewItemMap = /* @__PURE__ */ new Map(), this.originalTreeItems = [], this.viewTreeItems = [], this.flatViewTreeItems = [], this.visibleIndexMap = /* @__PURE__ */ new Map();
    const i = e.tree;
    this.idKey = (i == null ? void 0 : i.idField) ?? "id", this.pidKey = (i == null ? void 0 : i.parentIdField) ?? "pid", this.childrenKey = (i == null ? void 0 : i.childrenField) ?? "children";
  }
  /**
   * 트리 노드 렌더링을 위한 데이터 초기화
   * @param items 원본 데이터 배열
   */
  setItems(e) {
    var s;
    let t;
    (s = this.opts.tree) != null && s.isFlatData ? t = this.buildTree(e) : t = e;
    const i = this.convertOriginalTreeToTreeViewItems(t);
    super.setItems(i.flatItems), this.originalTreeItems = i.treeViewItems, this.viewTreeItems = i.treeViewItems, this.buildViewItems();
  }
  convertOriginalTreeToTreeViewItems(e) {
    var l, c;
    let t = ((l = this.opts.tree) == null ? void 0 : l.expandDepth) ?? 0;
    t = t - 1;
    const i = this.childrenKey, s = new Set(((c = this.opts.tree) == null ? void 0 : c.defaultExpandedIds) ?? []), n = [], r = [], o = (d, h, u, f) => {
      let g = 0;
      for (const m of d) {
        this.initializeRowItem(m, h, q.READ);
        const p = m[L.ID];
        this.setRowItem(p, m);
        const w = {
          id: p,
          pid: u,
          sortOrder: g++,
          depth: h,
          isLeaf: !0,
          expanded: h < t || s.has(m[this.idKey]) ? pe.USER : 0
        };
        f.push(w), r.push(m);
        const I = m[i];
        I != null && I.length && I.length > 0 && (w.children = [], w.isLeaf = !1, o(I, h + 1, p, w.children), m[i] = null);
      }
    };
    return o(e, 0, "dg$root", n), { flatItems: r, treeViewItems: n };
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
   * @param items items
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
      var c;
      for (const d of o) {
        const h = d, u = h.id;
        if (s) {
          const g = this.getSearchMapItem(u);
          g && (this.matchOffsetMap.set(u, n), n += ((c = g.matchedFields) == null ? void 0 : c.length) ?? 0);
        }
        this.idViewItemMap.set(u, h), i.push(h), l && (this.visibleIndexMap.set(u, t.length), t.push(h));
        const f = h.children;
        f && f.length > 0 && r(f, l && h.expanded > 0);
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
    t && (t.expanded = (t == null ? void 0 : t.expanded) > 0 ? 0 : pe.USER, this.buildViewItems());
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
      var s;
      for (const n of i)
        ((s = n.children) == null ? void 0 : s.length) > 0 && (n.expanded = e ? pe.USER : 0, t(n.children));
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
      var g;
      if (!u) return;
      const f = u;
      d ? (this.addSearchMapItem(f.id, f), s.matchCount += ((g = f.matchedFields) == null ? void 0 : g.length) ?? 0) : f.expanded = f.expanded % 2 > 0 ? pe.USER : 0;
    };
    const r = this.cfg.dataManager, o = /* @__PURE__ */ new Set(), l = (d, h) => {
      var g;
      const u = Zi(d, r, e, t);
      if (u.isOriginal)
        return u;
      const f = [];
      for (const m of d) {
        const p = m.children ?? [];
        let w = {};
        p.length > 0 && (w = l(p));
        const I = m.pid, y = ((g = m.matchedFields) == null ? void 0 : g.length) || w.matchCount > 0 || o.has(m.id);
        if (!n) {
          y && (m.expanded = y ? pe.SEARCH : m.expanded, o.has(I) || o.add(I)), f.push(m);
          continue;
        }
        if (y) {
          const x = {
            ...m,
            children: w.items ?? []
          };
          x.expanded = pe.SEARCH, f.push(x), o.has(I) || o.add(I);
        }
      }
      return {
        ...u,
        items: f
      };
    }, c = l(i);
    return this.viewTreeItems = c.items, c.items = this.getTreeToList(c.items), c.matchCount = s.matchCount, c;
  }
  getMatchInfo(e, t, i) {
    const s = i.direction === Re.NEXT, n = this.flatViewTreeItems, r = this.getSearchMapItem(e.id);
    r && (r.isCurrentMatch = !1);
    let o = e.rowIndex ?? -1;
    o = o < 0 ? this.cfg.scroll.startIdx : o;
    const l = this.getViewItems();
    l.length <= o && (o = 0);
    const c = l[o].id;
    o = n.findIndex((g) => g.id == c);
    const d = this.findMatch(s, o, e, n), h = d.id, u = this.getSearchMapItem(h);
    u && (u.isCurrentMatch = !0, d.matchedFields = u.matchedFields ?? []);
    const f = this.getCurrentMatchIndex(h);
    return this.setCurrentMatchInfo(f, {
      id: h,
      rowIndex: d.rowIndex,
      cellIndex: d.cellIndex
    }), d;
  }
  createMatchInfo(e, t, i, s) {
    const n = this.getSearchMapItem(e);
    return n && this.expandParents(n, pe.SEARCH) && this.buildViewItems(), {
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
    const i = this.cfg.dataManager;
    function s(d) {
      d = kt(d, i, e, t.nullsLast);
      for (const h of d) {
        const f = h.children;
        f && f.length > 0 && s(f);
      }
      return d;
    }
    const n = s(this.viewTreeItems), r = this.getTreeToList(n);
    if (!this.cfg.searchEnabled)
      return r;
    const o = this.cfg.searchMatchInfo, l = o.id, c = this.getCurrentMatchIndex(l);
    return this.setCurrentMatchInfo(c, {
      id: l,
      rowIndex: this.cfg.scroll.startIdx,
      cellIndex: o.cellIndex
    }), r;
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
  addItems(e, t = {}, i = q.READ) {
    if (!e || e.length === 0) return -1;
    let s = "dg$root", n = 0, r = this.viewTreeItems, o = r.length;
    if ((t == null ? void 0 : t.rowId) !== void 0) {
      const d = this.idViewItemMap.get(t.rowId);
      if (d)
        if (t.position === "inside")
          s = d.id, n = d.depth + 1, d.children || (d.children = []), d.isLeaf = !1, d.expanded = pe.USER, r = d.children, o = r.length;
        else {
          if (s = d.pid, n = d.depth, s === "dg$root" || !s)
            r = this.viewTreeItems;
          else {
            const u = this.idViewItemMap.get(s);
            r = (u == null ? void 0 : u.children) ?? this.viewTreeItems;
          }
          const h = r.findIndex((u) => u.id === d.id);
          h !== -1 && (o = t.position === "before" ? h : h + 1);
        }
    } else (t == null ? void 0 : t.position) === "before" && (o = 0);
    const l = (d, h, u) => {
      let f = 0;
      const g = [];
      for (const m of d) {
        this.initializeRowItem(m, h, i);
        const p = m[L.ID];
        m[this.pidKey] = u, this.setRowItem(p, m);
        const w = m[this.childrenKey], I = Array.isArray(w) && w.length > 0, y = {
          id: p,
          pid: u,
          sortOrder: f++,
          depth: h,
          isLeaf: !I,
          expanded: 0,
          children: []
        };
        I && (y.children = l(w, h + 1, p), m[this.childrenKey] = null), g.push(y);
      }
      return g;
    }, c = l(e, n, s);
    return r.splice(o, 0, ...c), r.forEach((d, h) => {
      d.sortOrder = h;
    }), this.buildViewItems(), o;
  }
  /**
   * 행 삭제 구현
   * @param ids 삭제할 행의 ID 배열
   * @returns 삭제된 행 ID 배열
   */
  removeItems(e) {
    if (!e || e.length === 0) return [];
    const t = new Set(e), i = [], s = (r) => {
      i.push(r.id), typeof this.deleteRowItem == "function" ? this.deleteRowItem(r.id) : typeof this.removeRowItem == "function" && this.removeRowItem(r.id), this.idViewItemMap.delete(r.id), this.visibleIndexMap.delete(r.id), this.matchOffsetMap.delete(r.id), r.children && r.children.length > 0 && r.children.forEach(s);
    }, n = (r) => {
      const o = [];
      for (const l of r)
        t.has(l.id) ? s(l) : (l.children && l.children.length > 0 && (l.children = n(l.children), l.children.length === 0 && (l.isLeaf = !0)), o.push(l));
      return o.forEach((l, c) => {
        l.sortOrder = c;
      }), o;
    };
    return this.viewTreeItems = n(this.viewTreeItems), this.originalTreeItems = n(this.originalTreeItems), this.buildViewItems(), i;
  }
}
class Jn extends Ji {
  constructor(e, t) {
    super(e, t, "group"), this.groupRows = /* @__PURE__ */ new Map(), this.sourceViewItems = [], this.groupRowId = 0, this.historyBatchDepth = 0, this.groupingRefreshPending = !1;
  }
  setViewItems(e) {
    var o;
    const t = e.filter((l) => !l.groupRowType);
    this.sourceViewItems = t;
    const i = this.opts.groupingFields ?? [];
    if (this.groupRows.clear(), i.length === 0) {
      super.setViewItems(t);
      return;
    }
    const s = [], n = t.map((l) => ({
      viewItem: l,
      item: super.getRowItem(l.id)
    })), r = (l, c, d) => {
      var f, g;
      const h = i[c], u = /* @__PURE__ */ new Map();
      for (const m of l) {
        const p = (f = m.item) == null ? void 0 : f[h], w = u.get(p);
        w ? w.push(m) : u.set(p, [m]);
      }
      for (const [m, p] of u) {
        const w = [...d, m];
        c + 1 < i.length ? r(p, c + 1, w) : (s.push(...p.map(({ viewItem: I }) => I)), this.opts.showGroupSum !== !1 && (((g = this.opts.sumFields) == null ? void 0 : g.length) ?? 0) > 0 && s.push(
          this.createGroupRow({
            groupRowType: "groupSummary",
            groupDepth: c,
            groupField: h,
            groupValue: m,
            groupValues: w,
            groupSums: this.sumRows(p)
          })
        ));
      }
    };
    n.length > 0 && r(n, 0, []), this.opts.showGrandSum !== !1 && (((o = this.opts.sumFields) == null ? void 0 : o.length) ?? 0) > 0 && n.length > 0 && s.push(
      this.createGroupRow({
        groupRowType: "grandSummary",
        groupSums: this.sumRows(n)
      })
    ), super.setViewItems(s);
  }
  setChangeValue(e, t, i, s) {
    const n = super.setChangeValue(e, t, i, s);
    return n && ((this.opts.groupingFields ?? []).includes(t.name) || (this.opts.sumFields ?? []).includes(t.name)) && (this.groupingRefreshPending = !0, this.refreshGroupingIfReady()), n;
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
    var c;
    const i = kt(this.sourceViewItems, this.cfg.dataManager, e, t.nullsLast);
    if (!this.cfg.searchEnabled)
      return i;
    const s = this.cfg.searchMatchInfo, n = s.id ?? "";
    let r = -1, o = 0;
    this.matchOffsetMap.clear();
    for (let d = 0; d < i.length; d++) {
      const h = i[d].id, u = this.getSearchMapItem(h);
      u && (this.matchOffsetMap.set(h, o), o += ((c = u.matchedFields) == null ? void 0 : c.length) ?? 0), r === -1 && h === n && (r = d);
    }
    const l = this.getCurrentMatchIndex(n);
    return this.setCurrentMatchInfo(l, {
      id: n,
      rowIndex: r,
      cellIndex: s.cellIndex
    }), i;
  }
  refreshAfterHistory(e, t) {
    this.sourceViewItems = this.sourceViewItems.filter((i) => super.getRowItem(i.id) !== void 0);
    for (const i of e.changes)
      if ((i.type === "add" && !t || i.type === "remove" && t) && !this.sourceViewItems.some((n) => n.id === i.rowId)) {
        const n = this.getOriginalViewItems().find((r) => r.id === i.rowId);
        this.sourceViewItems.push(n ?? { id: i.rowId, sortOrder: this.sourceViewItems.length });
      }
    super.refreshAfterHistory(e, t);
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
        n.indexOf(Pe) !== 0 && (s[n] = i[n]);
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
    return this.groupRows.set(t, { [L.ID]: t, [L.CUD]: q.READ }), i;
  }
  sumRows(e) {
    const t = {};
    for (const i of this.opts.sumFields ?? [])
      t[i] = e.reduce((s, { item: n }) => {
        const r = n == null ? void 0 : n[i];
        if (r == null || r === "")
          return s;
        const o = Number(r);
        return Number.isFinite(o) ? s + o : s;
      }, 0);
    return t;
  }
  refreshGroupingIfReady() {
    this.groupingRefreshPending && this.historyBatchDepth === 0 && (this.groupingRefreshPending = !1, this.setViewItems(this.sourceViewItems.slice()));
  }
}
class Qn {
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
    const o = $({}, _n, e);
    o.$uid = `${t}_${i}_${s}_${n}`, o.renderer = typeof o.renderer == "string" ? {
      ...Lt,
      type: o.renderer
    } : $({}, Lt, o.renderer), r[o.name] !== void 0 && !o.defaultValue && (o.defaultValue = r[o.name]);
    const l = ci[o.renderer.type] ?? ci.text;
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
      if (d != null && d.width) {
        const h = It(d.width), u = n.length + 2;
        n.push("auto", h, "auto"), l.list.forEach((f) => {
          this.createSection(f, u, s, t);
        });
      } else {
        const h = n.length + 1;
        let u = 0;
        l.list.forEach((f) => {
          u = this.createSection(f, h, s, t);
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
        c.$renderer.render(H("div"));
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
        const f = u.cloneNode(!0);
        c.appendChild(f), d.push({
          field: h,
          clone: f
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
      G(r.gap) ? r.gap.length === 1 ? d = r.gap[0] ?? 0 : (c = r.gap[0] ?? 0, d = r.gap[1] ?? 0) : Y(r.gap) ? d = r.gap : t.children.slice(o + 1).some((f) => {
        if (f.renderer.type === "hidden")
          return !1;
        const g = this.fieldElements.get(f.$uid);
        return g && !g.classList.contains("dg-hide");
      }) && (d = 4), c > 0 && (i.push(`${c}px`), s++, n += c);
      const h = r.width ? It(r.width) : r.renderer.type === "button" ? "max-content" : "1fr";
      i.push(h), l.style.gridArea = `1 / ${s} / span 1 / span 1`, s++, n += r.$width ?? 0, d > 0 && (i.push(`${d}px`), s++, n += d);
    }), i.push("0px"), e.style.gridTemplateColumns = i.join(" "), n;
  }
  createField(e, t) {
    const i = document.createElement("div"), { type: s, required: n } = e.renderer, r = n === !0 || s !== "label" && s !== "button" && !!e.label;
    return i.className = `dg-toolbar-field dg-type-${s} ${r ? "dg-group" : ""}`, i.style.gridArea = `1 / ${t} / span 1 / span 1`, i.dataset.uid = e.$uid, i.innerHTML = r ? `
          <span class="dg-label ${n ? "dg-required" : ""}">${e.label}</span>
          <div class="dg-control"></div>
        ` : '<div class="dg-control"></div>', e.$renderer.render(i), this.setWidth(i, e.width ?? "auto"), this.fieldElements.set(e.$uid, i), e.$renderer.afterRender(), i;
  }
  setWidth(e, t) {
    if (!t) return;
    const i = It(t);
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
class er {
  constructor(e, t, i) {
    this.arrowScrollFrame = null, this.gridMain = e, this.toolbarElement = t, this.toolbarOpts = i;
  }
  init() {
    this.initWheelEvent(), this.initArrowEvents(), this.toolbarOpts.scrollbarEnabled === !0 && this.toolbarElement.classList.add("dg-has-scrollbar");
  }
  resizeArrowVisibility() {
    var i;
    if (!((i = this.toolbarOpts) != null && i.enabled))
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
        qe(s) || He(i) || (A(i), this.gridMain.hideLayer(), e.scrollLeft += s);
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
class tr {
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
    var t;
    const e = this.gridMain.element().findDaraElement(".dg-toolbar");
    if (!((t = this.toolbarOpts) != null && t.enabled)) {
      e.getElement().remove();
      return;
    }
    this.toolbarEnabled = !0, e.css({
      display: "block",
      height: `${this.config.dimensions.toolbarHeight}px`
    }), this.toolbarElement = e.getElement(), this.toolbarRenderer = new Qn(this.gridMain, this.toolbarElement, this.toolbarOpts), this.toolbarScroll = new er(this.gridMain, this.toolbarElement, this.toolbarOpts), this.toolbarRenderer.init(), this.toolbarScroll.init(), this.refreshConditionFields();
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
    var e;
    (e = this.toolbarScroll) == null || e.destroy();
  }
}
const ir = 2, sr = 1e5;
class nr {
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
    const f = s.mainHeaderHeight + s.mainSummaryHeight + (l.enabledHorizontal ? i.scrollbarSize : 0);
    if (i.disableVerticalScroll)
      l.enabledVertical = !1, s.mainHeight = n * r.rowLength + f + 1, s.mainBodyHeight = n * r.rowLength, s.height = s.mainHeight + s.toolbarHeight + s.footerHeight;
    else {
      const p = h - (s.toolbarHeight + s.footerHeight);
      s.mainHeight = p, s.mainBodyHeight = p - f - 1, l.enabledVertical = n * r.rowLength > s.mainBodyHeight;
    }
    this.fieldWidthCalculator.calculateHorizontalScroll(u);
    const g = s.mainBodyHeight / n, m = Math.min(Math.max(1, Math.ceil(g)), r.rowLength);
    l.insideViewRow = m - (m > 1 && m > Math.floor(g) ? 1 : 0), l.viewRow = m, this.fieldWidthCalculator.distributeWidths(o, u, i.isHeaderResize);
  }
  /**
   * Toolbar height 계산
   */
  calculateToolbarDimension() {
    var s;
    const { toolbar: e } = this.opts;
    if (!(e != null && e.enabled) || !((s = e.items) != null && s.length)) return;
    const t = Y(e.height) ? e.height : xi;
    let i = 0;
    e.items.forEach((n) => {
      if (n.length > 0) {
        const r = Y(n[0].height) ? n[0].height : t;
        n[0].height = r, i += r;
      }
    }), this.gridMain.config().dimensions.toolbarHeight = i;
  }
  /**
   * Footer height 계산
   */
  calculateFooterDimension() {
    const { footer: e } = this.opts;
    e != null && e.enabled && (this.gridMain.config().dimensions.footerHeight = Y(e.height) ? e.height : Ei);
  }
  /**
   * Summary height 계산
   */
  calculateSummaryDimension() {
    const { summary: e } = this.opts;
    if (!e || !e.items || e.items.length === 0) return;
    const t = this.gridMain.config(), i = e.items.length, { height: s, heights: n } = Ni(e.height);
    t.summary.heights = new Array(i);
    let r = 0;
    for (let o = 0; o < i; o++) {
      let l = n.length > o ? n[o] : s;
      l = l > 0 ? l : s, r += l, t.summary.heights[o] = l;
    }
    t.dimensions.mainSummaryHeight = r + Math.min(r, ir);
  }
  /**
   * Line Number width 계산
   */
  adjustLineNumberWidth() {
    var l;
    const e = this.gridMain.config(), { dataInfo: t, currentFields: i, allFieldMap: s } = e, n = (l = s.get(ge)) == null ? void 0 : l.$colSeq;
    if (N(n)) return;
    const r = i[n];
    if (!r) return;
    let o;
    t.rowLength >= sr ? o = ki(e, String(t.rowLength)) || (this.opts.aside.lineNumber.width ?? Et) : o = this.opts.aside.lineNumber.width ?? Et, r.width = o, r.$width = o;
  }
}
class rr {
  constructor(e, t, i) {
    this.opts = e, this.gridMain = t, this.rendererFactory = i;
    const s = e.header;
    this.cellMinWidth = s.resize.minWidth, this.enabledViewAllLabel = s.enabledViewAllLabel === !0;
  }
  buildFields() {
    const e = this.gridMain.config(), t = this.opts, i = ms(t.fields);
    e.fieldHeaderGroup = Di();
    const s = this.buildAsideFields(t), n = s.length;
    e.dataInfo.asideLength = n, e.dataInfo.startCol = n;
    const r = n + e.fixedLeftIndex - 1;
    let o = e.fixedRightIndex < 1 ? 0 : n + e.fixedRightIndex;
    o = o > r + 1 ? o : 0, i.unshift(...s);
    let l = 0;
    for (const f of i)
      this.buildFieldGroup(f, 0, e.fieldHeaderGroup, r, o, `${l++}`);
    if (e.fieldHeaderGroup.depth = e.fieldHeaderGroup.center.length, e.currentFields = e.fieldHeaderGroup.leaf, e.fixedLeftIndex = r + 1, e.fixedRightIndex = o > e.currentFields.length ? 0 : o, e.dataInfo.colLength = e.currentFields.length, t.header.view === !1) return;
    const { height: c, heights: d } = Ni(t.header.height), h = e.fieldHeaderGroup.depth;
    e.fieldHeaderGroup.heights = new Array(h);
    let u = 0;
    for (let f = 0; f < h; f++) {
      const g = d.length > f ? d[f] : 0, m = g > 0 ? g : c;
      u += m, e.fieldHeaderGroup.heights[f] = m;
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
    var i, s;
    const t = [];
    return e.aside.lineNumber.enabled === !0 && t.push({
      field: $({}, e.aside.lineNumber, {
        name: ge,
        renderer: { type: "lineNumber" },
        $isAside: !0
      }),
      order: e.aside.lineNumber.order ?? 0
    }), e.aside.rowCheckbox.enabled === !0 && t.push({
      field: $({ width: Ci }, e.aside.rowCheckbox, {
        name: st,
        renderer: { type: "rowCheckbox" },
        $isAside: !0
      }),
      order: e.aside.rowCheckbox.order ?? 1
    }), ((i = e.body.rowMove) == null ? void 0 : i.enabled) === !0 && ((s = e.body.rowMove) == null ? void 0 : s.enabledDragHandle) !== !1 && t.push({
      field: $(
        {},
        {
          name: At,
          width: 32,
          renderer: { type: "rowDragHandle" },
          $isAside: !0
        }
      ),
      order: 2
      // Drag Handle의 기본 order
    }), e.aside.modifyInfo.enabled === !0 && t.push({
      field: $({}, e.aside.modifyInfo, {
        name: "$modifyInfo",
        renderer: { type: "modifyInfo" },
        $isAside: !0
      }),
      order: e.aside.modifyInfo.order ?? 2
    }), t.sort((n, r) => n.order - r.order).map((n) => n.field);
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
    if (e = this.initFieldMeta(e, t, r, i), N(i.left[t]) && (i.left[t] = []), N(i.center[t]) && (i.center[t] = []), N(i.right[t]) && (i.right[t] = []), e.$childLength > 0 && s > e.$resizeIdx - e.$colspan || e.$childLength < 1 && s >= e.$resizeIdx) {
      if (e.$colspan <= 1)
        i.left[t].push(e);
      else {
        const l = Ze(e);
        if (l.$resizeIdx > s && (l.$colspan = s - (l.$resizeIdx - l.$colspan), l.$resizeIdx = s), i.left[t].push(l), s < e.$resizeIdx) {
          const c = Ze(e);
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
          const h = Ze(e);
          h.$colspan = c, h.$resizeIdx = n - 1, l = l - h.$colspan;
          const u = i.center[t].findIndex((f) => f.$uid === h.$uid);
          u > -1 ? i.center[t][u] = h : i.center[t].push(h);
        }
        const d = Ze(e);
        d.$colspan = l, d.$resizeIdx = e.$resizeIdx, i.right[t].push(d);
      }
      e.$panel = "right", e.$isLeaf && i.leafRight.push(e);
    }
    return N(e.$panel) && (i.center[t].push(e), e.$panel = "center", e.$isLeaf && i.leafCenter.push(e)), e;
  }
  initFieldMeta(e, t, i, s) {
    var d;
    const n = this.gridMain.config(), r = !N(e.headerHelp);
    !n.enabledHeaderHelpButton && r && (n.enabledHeaderHelpButton = !0), !n.enabledSortButton && e.sort && (n.enabledSortButton = !0);
    const o = e.children, l = G(o) ? o.length : 0;
    let c = !1;
    if (l < 1 ? (c = !0, e.$colspan = e.colspan ?? 1) : e.$colspan = e.$colspan ?? 1, e.$isLeaf = c, e.$resizeIdx = s.leaf.length - (c ? 0 : 1), e.$childLength = l, e.$rowspan = e.rowspan ?? 1, e.$depth = t, e.$uid = `${this.gridMain.uid()}_${e.$depth}_${i}`, e.$enabledHelp = r, c) {
      let h = Y(e.width) ? e.width : this.cellMinWidth;
      this.enabledViewAllLabel && (h = Math.max(h, ki(n, e.label, 20))), e.$isAside || (h = Math.max(h, this.cellMinWidth)), e = this.rendererFactory.createRenderer(e), e.$colSeq = s.leaf.length, e.width = h, e.$width = h, e.$alignStyle = U[e.align] ?? (((d = e.$renderer) == null ? void 0 : d.alignStyle()) || U.left), s.leaf.push(e), n.allFieldMap.set(e.name, e);
    }
    return e;
  }
}
function Ze(a) {
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
class or {
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
    const s = xt(e);
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
    const i = xt(t);
    t.scroll.enabledHorizontal = e > i;
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
  distributeWidths(e, t, i) {
    const s = this.gridMain.config(), n = xt(s);
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
   * @param verticalScrollWidth 세로 스크롤바 width
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
class Qi {
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
      return e.$renderer = new Bn[e.renderer.type](e, this.gridMain), e;
    const t = this.gridMain.config(), i = pt(t, e);
    let s;
    return N(e.editRenderer) || (s = this.getEditRenderer(e, e.editRenderer, ""), e.$editRenderer = s, s.supportsInteraction() && (e.$renderer = s, e.renderer = $({}, di, {
      type: e.editRenderer.type
    }))), e.$renderer || (e = this.getViewRenderer(e)), i && !e.$editRenderer && (e.$editRenderer = this.getEditRenderer(e, e.editRenderer, e.renderer.type)), e;
  }
  getViewRenderer(e) {
    let t = { type: "text" };
    Ue(e.renderer) ? t = $({}, e.renderer) : se(e.renderer) && (t = { type: e.renderer });
    const i = ai[t.type];
    return N(i) && (t.type = "text"), e.renderer = $({}, di, t), e.$renderer = new ai[e.renderer.type](e, this.gridMain), e;
  }
  getEditRenderer(e, t, i) {
    se(t) && (t = { type: t }), (N(t) || N(t.type)) && (t = { type: i }), e.editRenderer = $({}, Lt, t);
    let s = "text";
    const n = t == null ? void 0 : t.type;
    return n && tt[n] ? s = n : tt[i] && (s = i), new tt[s](e, this.gridMain);
  }
}
class lr {
  constructor(e, t) {
    this.opts = e, this.gridMain = t, this.rendererFactory = new Qi(t), this.fieldWidthCalculator = new or(e, t), this.dimensionCalculator = new nr(e, t, this.fieldWidthCalculator), this.fieldBuilder = new rr(e, t, this.rendererFactory);
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
class ar {
  constructor(e) {
    var t;
    this.footerOpts = e.options().footer, this.gridMain = e, this._isActive = ((t = this.footerOpts) == null ? void 0 : t.enabled) ?? !1, this._isActive && (this.selectionInfo = e.selectionInfo, this.cfg = this.gridMain.config(), this.isSelectionInfo = !N(this.footerOpts.selection));
  }
  /**
   * init footer event
   */
  init() {
    var t, i, s, n;
    const e = this.gridMain.element().findDaraElement(".dg-footer");
    if (!this.isEnabled()) {
      e.getElement().remove();
      return;
    }
    this.footerElement = e, this.selectionStatusElement = e.findDaraElement(".dg-selection-status"), e.css({ height: `${this.cfg.dimensions.footerHeight}px` }), e.findDaraElement(".dg-status").addClass(wt[((t = this.footerOpts.selection) == null ? void 0 : t.position) ?? "center"]), (i = this.footerOpts.paging) != null && i.enabled && (this.paingElement = e.findDaraElement(".dg-paging"), this.pagingInfoElement = e.findDaraElement(".dg-paging-info"), this.paingElement.addClass(wt[((s = this.footerOpts.paging) == null ? void 0 : s.position) ?? "center"]), this.pagingInfoElement.addClass(wt[((n = this.footerOpts.paging) == null ? void 0 : n.formatPosition) ?? "center"]), this.setPagingTemplate(this.cfg.paging), this.initPagingEvent());
  }
  isEnabled() {
    return this._isActive;
  }
  /**
   * init paging event
   */
  initPagingEvent() {
    var i;
    const e = (i = this.footerOpts.paging) == null ? void 0 : i.callback, t = this.paingElement.getElement();
    this.cfg.eventManager.on({ el: t, type: "click", selector: ".dg-page-num" }, (s) => {
      const n = s.target.closest(".dg-page-num"), r = ae(n == null ? void 0 : n.dataset.pageNo) ?? "1";
      return e ? e(r) : this.goPage(r, !0), !0;
    });
  }
  goPage(e, t = !0) {
    if (N(this.footerOpts.paging))
      throw new Error("Paging is not enabled");
    const i = this.cfg.paging;
    if (i.page = e, i.totalCount = i.totalCount > 0 ? i.totalCount : this.cfg.dataInfo.rowLength, i.totalCount < 1) {
      this.setPagingInfo({ totalCount: 0 }), this.paingElement.empty();
      return;
    }
    const s = Ai(
      i.totalCount,
      i.page,
      i.pageSize,
      i.unitPage
    );
    this.setPagingTemplate(s);
    const n = s == null ? void 0 : s.pageSize, r = ((s == null ? void 0 : s.page) - 1) * n, o = $t(this.cfg.dataManager.getOriginalViewItems(), r, r + n);
    this.cfg.dataManager.setViewItems(o), t && (this.gridMain.selectionInfo.setSelectionRangeInfo({}, !0), this.gridMain.getScroll().moveVerticalScroll({ rowIdx: 0 }), this.gridMain.refreshBody(t, "footer draw"));
  }
  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  setSelectionStatus(e) {
    var t, i, s;
    if (this.isSelectionInfo && this.footerOpts.enabled && ((t = this.footerOpts.selection) != null && t.showSummary)) {
      const n = this.selectionInfo.selectionData("json", !0);
      if (!N(n) && ((i = n == null ? void 0 : n.summary) == null ? void 0 : i.count) > 1) {
        const r = (s = this.footerOpts.selection) == null ? void 0 : s.format;
        let o = "";
        se(r) ? (n.summary.enabledSummary = n.summary.numFieldCount > 0, o = Qt(r, n.summary)) : T(r) && (o = r(n)), this.selectionStatusElement.text(o);
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
    var t, i;
    if ((t = this.footerOpts.paging) != null && t.enabled) {
      const s = e.pageSize, n = (e.page - 1) * s, r = {
        start: n + 1,
        end: n + s,
        total: e.totalCount
      };
      if (r.end = r.end > e.totalCount ? e.totalCount : r.end, e.totalCount > 0) {
        const o = (i = this.footerOpts.paging) == null ? void 0 : i.format;
        let l = "";
        se(o) ? l = Qt(o, r) : T(o) && (l = o(r)), this.pagingInfoElement.text(l);
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
      R`<li class="dg-page-num" data-page-no="${e.totalPages}">...<a href="javascript:">${e.totalPages}</a></li>`
    ), t == n ? l.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>') : l.push(` <li><a href="javascript:" class="dg-page-num page-icon" data-page-no="${r}">&raquo;</a></li>`), l.push("</ul>"), this.paingElement.html(l.join(""));
  }
}
const gi = 300;
class Vt {
  constructor(e = gi) {
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
    var s, n;
    const i = Date.now();
    if (i - this.lastClickTime < gi && this.clickCount++, this.lastClickTime = i, this.clickCount === 2 && !at(e.startPos, this.currentPointerPosition, 5)) {
      (s = t.onDoubleClick) == null || s.call(t, e), this.resetClick();
      return;
    }
    this.conserveClick(e.startPos), (n = t.onClick) == null || n.call(t, e);
  }
}
class Bt {
  constructor(e) {
    this.priority = 0, this.context = e, this.cfg = e.gridMain.config(), this.opts = e.gridMain.options();
  }
  canHandle(e) {
    return !0;
  }
}
class es extends Bt {
  constructor(e, t) {
    var n;
    super(e), this.priority = 5, this.bodyDragDelay = 150, this.moveRange = { endIdx: -1, endCol: -1 }, this.beforeEndIdx = -1, this.beforeEndCol = -1, this.scrollDirectionX = null, this.scrollDirectionY = null, this.dragAnimationId = 0, this.lastScrollTime = 0, this.selectionInfo = e.gridMain.selectionInfo, this.bodyElement = (n = e.body) == null ? void 0 : n.getBodyElement().getElement(), this.selectionMode = this.opts.selectionMode, this.multipleFlag = Nt(this.selectionMode), this.cellClickFn = this.opts.body.cellClick;
    const { rowHeight: i, enabledCellEdit: s } = this.cfg;
    this.rowHeight = i, this.cellDblClick = this.opts.body.cellDblClick, this.isCellDbClickEvent = s || T(this.cellDblClick);
  }
  onPointerDown(e) {
    var t;
    this.cellElement = e.cellEl, this.startCellInfo = e.cellInfo, this.currentSelectionMode = this.selectionMode, this.startCellInfo.rowIndex > -1 && (this.cfg.searchMatchInfo.rowIndex = this.startCellInfo.rowIndex), this.multipleFlag && ((t = e.cellInfo) == null ? void 0 : t.field.name) == ge && (this.currentSelectionMode = ie.multiRow);
  }
  onActivate(e) {
    const t = this.cfg, i = O(this.bodyElement, !0), { mainLeftWidth: s, mainInsideWidth: n, mainRightWidth: r, mainBodyHeight: o } = t.dimensions;
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
    const l = zi(
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
    const c = Fi(t, n, this.rowHeight, this.startCellInfo, i.top, i.bottom);
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
        const f = c === k.RIGHT, g = f ? t.scroll.insideEndCol + 3 : t.scroll.insideStartCol - 3;
        i.col !== g && ((f && t.fixedRightIndex === 0 || !f && t.fixedLeftIndex === 0) && (u.endCol = g), n.moveHorizontalScroll({ direction: c, colIdx: g, drawFlag: !1 }), i.col = g, h = !0);
      }
      if (d !== null) {
        const f = d === Z.DOWN ? t.scroll.startIdx + t.scroll.insideViewRow + 1 : t.scroll.startIdx - 1;
        i.rowIdx !== f && (u.endIdx = f, n.moveVerticalScroll({ direction: d, drawFlag: !1 }), i.rowIdx = f, h = !0);
      }
      h && (e && this.selectionInfo.setSelectionRangeInfo({ range: u }, !1, !1), r.dataDraw("dragscroll")), this.dragAnimationId = requestAnimationFrame(o);
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
    var i, s, n;
    const t = !!((s = (i = this.startCellInfo) == null ? void 0 : i.viewItem) != null && s.groupRowType);
    this.selectionMode != ie.none && this.setCellClick(
      e.event,
      this.startCellInfo,
      this.multipleFlag,
      this.currentSelectionMode,
      this.cellElement
    ), t || (n = this.cellClickFn) == null || n.call(this, this.startCellInfo);
  }
  onDoubleClick(e) {
    var s;
    if (!this.isCellDbClickEvent) return;
    const t = e.cellInfo;
    if ((s = t.viewItem) != null && s.groupRowType) return;
    const i = t.field;
    if (this.cellDblClick && this.cellDblClick(this.startCellInfo), !i.$isAside && pt(this.cfg, i)) {
      setTimeout(() => {
        i.$editRenderer.render(t, e.cellEl);
      }, 10);
      return;
    }
  }
  setCellClick(e, t, i, s, n) {
    var g;
    const r = this.context, o = r.gridMain.config(), l = r.gridMain;
    t.field.renderer.type == "dropdown" && t.c == +o.activeComponent || l.hideLayer();
    const c = t.rowIndex, d = t.c;
    !Ae(o, d) && !De(o, d) && (d < o.scroll.insideStartCol ? l.getScroll().moveHorizontalScroll({ direction: k.LEFT, colIdx: d }) : d > o.scroll.insideEndCol && l.getScroll().moveHorizontalScroll({ direction: k.RIGHT, colIdx: d }));
    const h = (He(e) ? 2 : 0) + (lt(e) ? 1 : 0), u = this.selectionInfo.getSelectionModeColInfo(
      s,
      d,
      o,
      n,
      i && h == 2
    );
    (i && h != 2 || !i) && l.selectionInfo.removeStartAnchorCell();
    const f = Ge(s) ? "row" : "cell";
    if (i && h >= 2) {
      const m = { endIdx: c, endCol: u.endCol, modifierKey: 2 };
      u.startCol > -1 && (m.startCol = u.startCol), m.type = f, this.selectionInfo.setSelectionRangeInfo(
        {
          range: m,
          isMouseDown: !0
        },
        !1,
        !0
      );
    } else i && h == 1 ? this.selectionInfo.setSelectionRangeInfo(
      {
        range: {
          type: f,
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
          type: f,
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
    (g = window.getSelection()) == null || g.removeAllRanges();
  }
}
class cr {
  constructor(e, t, i) {
    this.pendingScroll = null, this.scrollRafId = null, this.gridMain = e, this.body = t, this.selectionInfo = i;
  }
  /**
   * keydown event
   */
  init() {
    this.pasteElement = new fe(this.gridMain.element().find(".dg-paste-area"));
    const e = this.gridMain.config(), t = this.gridMain.options(), i = t.selectionMode, s = Nt(i), n = t.search.enabled, r = this.pasteElement.getElement(), o = this.gridMain.getGridKeyInputElement();
    e.eventManager.off(o, "keydown"), e.eventManager.on(
      {
        el: o,
        type: "keydown"
      },
      (l) => {
        if (this.gridMain.hideLayer(), Vi(l))
          return;
        const c = Vs(l);
        if (lt(l)) {
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
            return A(l), n && this.gridMain.getDataSearch().openSearch(), !0;
          if (c === "KeyZ")
            return A(l), l.shiftKey ? e.dataManager.redo() : e.dataManager.undo(), !0;
          if (c === "KeyY")
            return A(l), e.dataManager.redo(), !0;
        }
        if (this.isNavigationKey(c)) {
          A(l), this.selectionInfo.setAllSelection(!1), this.arrowKeydownEvent(l, c);
          return;
        }
        const d = e.selection.startCell, h = e.currentFields[d.startCol];
        if (!h)
          return;
        const u = Ls(l);
        if (u && (A(l), h.renderer.type === "tree")) {
          const f = this.gridMain.getBody().getStartCellElement(), g = he(e, f);
          if (h.$renderer.bindEvents("space", g, f))
            return !0;
        }
        if (pt(e, h) && (u || c.startsWith("Key") || c.startsWith("Digit"))) {
          this.insideScrollCheck(c, l, e.scroll, d.startIdx, d.startCol);
          const f = this.gridMain.getBody().getStartCellElement(), g = he(e, f);
          u || (g.inputValue = ""), h.$editRenderer.render(g, f);
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
    const o = r.startIdx, l = r.startCol, c = Math.max(s.insideViewRow - 1, 0), d = n.startCol, h = lt(e);
    switch (t) {
      case "PageDown":
      case "Enter":
      case "ArrowDown": {
        const u = this.getDownRowIndex(t, h, o, c, n.rowLength);
        if (this.insideScrollCheck(t, e, s, u, l))
          return;
        u >= s.startIdx + c && this.scheduleVerticalScroll(u - c, Z.DOWN);
        return;
      }
      case "PageUp":
      case "ArrowUp": {
        const u = this.getUpRowIndex(t, h, o, c);
        if (this.insideScrollCheck(t, e, s, u, l))
          return;
        u < s.startIdx && this.scheduleVerticalScroll(u, Z.UP);
        return;
      }
      case "Home":
      case "ArrowLeft": {
        const u = this.getLeftColumnIndex(t, h, l, d);
        if (this.insideScrollCheck(t, e, s, o, u))
          return;
        !Ae(i, u) && u < s.insideStartCol && this.scheduleHorizontalScroll(u, k.LEFT);
        return;
      }
      case "End":
      case "Tab":
      case "ArrowRight": {
        const u = this.getRightColumnIndex(t, h, l, n.colLength);
        if (this.insideScrollCheck(t, e, s, o, u))
          return;
        !De(i, u) && u > s.insideEndCol && this.scheduleHorizontalScroll(u, k.RIGHT);
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
    if (T(l)) {
      const u = r.dataManager, g = u.getViewItems()[s], m = g ? u.getRowItem(g.id) : void 0;
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
    const c = Wi(r, i, s, n);
    if (c <= 0)
      return !1;
    const d = Math.floor(c / 10), h = c % 10;
    if (d > 0) {
      const u = d === 1 ? k.LEFT : k.RIGHT;
      this.scheduleHorizontalScroll(n, u);
    }
    if (h > 0) {
      const u = h === 1 ? Z.DOWN : Z.UP, f = s - (h === 1 ? 0 : Math.max(i.insideViewRow - 1, 0));
      this.scheduleVerticalScroll(f, u);
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
class dr {
  constructor(e, t) {
    this.gridMain = e, this.selectionInfo = t;
  }
  /**
   * init paste event
   */
  init() {
    this.pasteElement = new fe(this.gridMain.element().find(".dg-paste-area"));
    const e = this.gridMain.config(), t = this.gridMain.options(), i = t.body.pasteBefore, s = T(i), n = t.body.pasteAfter, r = T(n), o = this.pasteElement.getElement();
    e.eventManager.on(
      {
        el: o,
        type: "paste"
      },
      (l) => {
        var M;
        this.gridMain.setGridFocusIn();
        const c = l.clipboardData;
        if (!c)
          throw new Error("paste clipboard not found");
        let d = c.getData("text");
        if (s && (d = i(d)), !d)
          return;
        const h = Ys(d), u = e.selection.startCell, { currentFields: f, dataInfo: g, dataManager: m } = e, p = u.startIdx, w = u.startCol, I = f.length;
        let y = g.rowLength, x = w, E = m.getViewItems();
        m.beginHistory();
        try {
          if (p + h.length > y) {
            const C = p + h.length - y;
            for (let b = 0; b < C; b++)
              m.createItem({});
            E = m.getViewItems(), y = E.length;
          }
          for (let C = 0; C < h.length; C++) {
            const b = p + C;
            if (b >= y)
              break;
            const S = E[b];
            if (S.groupRowType)
              continue;
            const v = h[C], V = m.getRowItem(S.id);
            if (V)
              for (let D = 0; D < v.length; D++) {
                const B = w + D;
                if (B >= I)
                  continue;
                x = Math.max(x, B);
                let P = v[D];
                if (P.startsWith('"') && P.endsWith('"') && (P = P.slice(1, -1).replace(/""/g, '"')), /^=/.test(P) && (P = `'${P}`), ((M = f[B].$editRenderer) == null ? void 0 : M.setValue(l, V, P, !1)) === !1)
                  return !1;
              }
          }
          this.gridMain.refreshBody(!1, "paste"), this.selectionInfo.setSelectionRangeInfo(
            {
              range: {
                startIdx: p,
                endIdx: p + h.length - 1,
                startCol: w,
                endCol: x
              },
              startCell: u
            },
            !0,
            !1
          ), m.commitHistory();
        } catch (C) {
          throw m.rollbackHistory(), C;
        }
        this.gridMain.getBody().dataDraw("reDraw_paste"), r && n(d);
      }
    );
  }
}
class fi extends es {
  constructor(e, t) {
    super(e, t), this.priority = 10, this.ROW_DRAG_RATIO = 2, this.dropRowIdx = -1, this.moveRowIndexs = [], this.moveViewItems = [], this.isDropForbidden = !0, this.isMoveRowSequential = !1, this.language = e.gridMain.i18n(), this.rowMoveOptions = this.opts.body.rowMove, this.isSelectionRowMode = Ge(this.selectionMode), this.rowMoveDropHelperElement = e.gridMain.element().findDaraElement(".dg-drop-indicator").getElement(), this.initTemplate();
  }
  initTemplate() {
    var s;
    const e = document.createElement("div");
    e.className = "dg-row-move-helper", e.style.cssText = `height: ${this.rowHeight}px; display: none;`;
    const t = document.createElement("div");
    t.className = "dg-row-move-status dg-icon", e.appendChild(t);
    const i = document.createElement("div");
    i.className = "dg-row-move-content", e.appendChild(i), (s = document.querySelector(Dt)) == null || s.appendChild(e), this.rowMoveElement = e;
  }
  canHandle(e) {
    var r, o;
    const t = e.cellInfo;
    if ((r = t.viewItem) != null && r.groupRowType)
      return !1;
    const i = this.rowMoveOptions, s = (o = t.field) == null ? void 0 : o.name, n = i == null ? void 0 : i.dragHandle;
    return n !== "ALL" && n !== s && !((i == null ? void 0 : i.enabledDragHandle) !== !1 && s === At) ? !1 : (this.moveRowIndexs.length = 0, this.moveViewItems.length = 0, this.dropRowIdx = -1, this.scrollDirectionX = null, this.scrollDirectionY = null, this.isDropForbidden = !0, !0);
  }
  onClick(e) {
  }
  onActivate(e) {
    var p, w;
    const t = this.cfg, i = this.opts, s = e.cellInfo, n = i.body.rowMove, r = this.cfg.selection.allRange, o = [];
    if (r.size > 0) {
      const I = s.field.$colSeq;
      if (this.isSelectionRowMode) {
        const { colLength: y, startCol: x } = this.cfg.dataInfo, E = y - 1;
        for (const [M, C] of r) {
          const { minIdx: b, maxIdx: S } = C;
          if (C.minCol == x && E == C.maxCol)
            for (let v = b; v <= S; v++)
              if (C.mode == "remove") {
                const V = o.indexOf(v);
                V !== -1 && o.splice(V, 1);
              } else
                o.push(v);
          else {
            o.length = 0;
            break;
          }
        }
      } else if (I > -1)
        for (const [y, x] of r) {
          const { minIdx: E, maxIdx: M } = x;
          let C = !1;
          for (let b = E; b <= M; b++)
            if (this.selectionInfo.isCellSelection(x, b, I))
              if (x.mode == "remove") {
                const S = o.indexOf(b);
                S !== -1 && o.splice(S, 1);
              } else
                o.push(b);
            else
              C = !0;
          if (C) {
            o.length = 0;
            break;
          }
        }
    }
    const l = [];
    if (o.length > 0) {
      const I = t.dataManager.getViewItems();
      if (o.includes(s.rowIndex)) {
        o.sort((y, x) => y - x);
        for (const y of o)
          l.push(t.dataManager.getRowItem(I[y].id));
      } else
        o.length = 0;
    }
    if (o.length < 1 && (this.setCellClick(e.event, this.startCellInfo, this.multipleFlag, this.selectionMode, e.cellEl), o.push(s.rowIndex), l.push(s.item)), ((p = n == null ? void 0 : n.dragStart) == null ? void 0 : p.call(n, { moveItems: l })) === !1)
      return !1;
    this.moveRowIndexs = o, this.moveViewItems = l, this.isMoveRowSequential = Xs(o), this.moveStartItem = s;
    const c = O(this.context.gridMain.getBody().getBodyElement().getElement(), !0), { mainLeftWidth: d, mainInsideWidth: h, mainRightWidth: u, mainBodyHeight: f } = t.dimensions;
    this.gridBounds = {
      gridLeft: c.left,
      gridRight: c.left + t.dimensions.mainTotalWidth,
      mainLeft: c.left + d,
      mainRight: c.left + h - u,
      top: c.top,
      bottom: c.top + f
    }, this.bodyPosition = c;
    const g = (w = n == null ? void 0 : n.dragTemplate) == null ? void 0 : w.call(n, { moveItems: this.moveViewItems }), m = this.rowMoveElement.querySelector(".dg-row-move-content");
    g ? m.innerHTML = g : m.textContent = `${this.moveViewItems.length} ${this.language.getMessage("row")}`, this.rowMoveElement.style.display = "flex";
  }
  /** move 중 */
  onPointerMove(e) {
    var E, M;
    if (e.state != Ie.DRAGGING) return;
    const t = this.cfg, i = this.gridBounds, { x: s, y: n } = e.currentPos;
    this.rowMoveElement.style.transform = `translate(${s}px, ${n}px)`;
    const r = this.rowMoveDropHelperElement;
    if (s < i.gridLeft - 3 || s > i.gridRight + 3 || n < i.top - 30 || n > i.bottom + 30) {
      this.stopAutoScroll(), this.preventDrop();
      return;
    }
    const o = this.rowHeight, l = Fi(
      t,
      n,
      o,
      this.startCellInfo,
      i.top,
      i.bottom
    );
    this.scrollDirectionY = l.scrollDirectionY, this.scrollDirectionY && this.dragAnimationId === 0 && this.startAutoScroll(!1);
    const c = l.viewRowIdx, h = n - this.bodyPosition.top - c * o, u = h < o / this.ROW_DRAG_RATIO, f = o - h < o / this.ROW_DRAG_RATIO;
    let g = this.dropRowIdx === -1 ? c : l.rowIdx - t.scroll.startIdx;
    u ? g = c : f && (g = c + 1), g = Math.max(0, Math.min(g, t.scroll.insideViewRow));
    const m = t.scroll.startIdx + g;
    if (this.dropRowIdx === m)
      return;
    const p = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    p.remove("dg-drop-invalid"), p.add("dg-drop-valid"), this.isDropForbidden = !1;
    const w = this.moveRowIndexs;
    if (this.isMoveRowSequential && (w.includes(m) || w[w.length - 1] < m && w.includes(m - 1))) {
      this.preventDrop();
      return;
    }
    this.dropRowIdx = m, r.style.transform = `translateY(${g * o}px)`, r.style.display = "block";
    const I = this.moveStartItem;
    let y = ze.BEFORE, x = m;
    I.rowIndex < m && (y = ze.AFTER, x = m - 1), ((M = (E = this.rowMoveOptions).dragOver) == null ? void 0 : M.call(E, {
      moveItems: this.moveViewItems,
      dropItemIdx: x,
      position: y
    })) === !1 && this.preventDrop();
  }
  /**
   * drop 금지 시, 드롭 위치에 X 표시, 허용 시 O 표시
   */
  preventDrop() {
    const e = this.rowMoveElement.querySelector(".dg-row-move-status").classList;
    e.remove("dg-drop-valid"), e.add("dg-drop-invalid"), this.isDropForbidden = !0, this.rowMoveDropHelperElement.style.display = "none";
  }
  onPointerUp(e) {
    var g, m;
    this.stopAutoScroll();
    let t = this.dropRowIdx;
    if (this.rowMoveDropHelperElement.style.display = "none", this.rowMoveElement.style.display = "none", this.isDropForbidden || t === -1) {
      !this.cfg.isBodyDragging && e.clickManager.getClickCount() === 1 && this.setCellClick(e.event, this.startCellInfo, this.multipleFlag, this.selectionMode, e.cellEl);
      return;
    }
    const i = this.cfg, s = this.rowMoveOptions, n = this.moveViewItems, r = this.moveStartItem;
    let o = ze.BEFORE;
    if (r.rowIndex < t && (o = ze.AFTER), ((g = s == null ? void 0 : s.drop) == null ? void 0 : g.call(s, {
      moveItems: n,
      dropItemIdx: o == ze.AFTER ? t - 1 : t,
      position: o
    })) === !1)
      return;
    const l = this.moveRowIndexs, c = i.dataManager.getViewItems();
    for (let p = l.length - 1; p >= 0; p--) {
      const w = l[p];
      t > w && --t, c.splice(w, 1);
    }
    const d = this.moveViewItems.map((p) => ({ id: p[L.ID] }));
    c.splice(t, 0, ...d), i.dataManager.setViewItems(c);
    let h = i.dataInfo.startCol, u = i.dataInfo.colLength - 1;
    Ws(this.selectionMode) && (h = i.selection.range.startCol, u = h);
    const f = {
      startIdx: t,
      startCol: h,
      endCol: u,
      endIdx: t + l.length - 1
    };
    this.selectionInfo.setSelectionRangeInfo(
      {
        range: f
      },
      !0,
      !0
    ), this.context.gridMain.getBody().dataDraw("dragmove_redraw"), (m = s == null ? void 0 : s.dragEnd) == null || m.call(s, { moveItems: n, dropItemIdx: t, position: o });
  }
}
class hr {
  constructor(e, t, i) {
    this.gridMain = e, this.body = t, this.selectionInfo = i, this.bodyElement = t.getBodyElement(), this.handlers = [];
    const s = e.options().body.rowMove;
    (s == null ? void 0 : s.enabled) === !0 && this.handlers.push(new fi({ gridMain: e, body: t }, this)), this.handlers.push(new es({ gridMain: e, body: t }, this));
  }
  init() {
    this.initMouseOver(), this.initPointerEvent(), this.initMobileTouch();
    const e = this.gridMain.options();
    this.gridMain.config().enabledCellEdit === !0 && new dr(this.gridMain, this.selectionInfo).init(), e.body.disableKeydown !== !0 && e.selectionMode !== ie.none && new cr(this.gridMain, this.body, this.selectionInfo).init();
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
        const f = u.touches[0].clientX, g = u.touches[0].clientY, m = d - f, p = h - g;
        if (!e.isMoveRow) {
          if (t.enabledHorizontal && Math.abs(m) > Math.abs(p)) {
            const w = m > 0;
            if (cancelAnimationFrame(c), w && t.left != 0 || !w && t.left != t.hTrackWidth - t.hThumbWidth)
              A(u);
            else {
              c = 0;
              return;
            }
            c = requestAnimationFrame(() => {
              o.moveHorizontalScroll({
                direction: w ? k.LEFT : k.RIGHT,
                speed: r.scroll.horizontal.speed
              });
            });
          } else if (t.enabledVertical) {
            const w = t.startIdx, I = p < 0;
            if (cancelAnimationFrame(c), I && w !== 0 || !I && w + t.insideViewRow < s.rowLength)
              u.cancelable && A(u);
            else {
              c = 0;
              return;
            }
            c = requestAnimationFrame(() => {
              const y = Math.abs(p) / i, x = Math.ceil(s.rowLength / t.viewRow);
              o.moveVerticalScroll({
                direction: I ? Z.UP : Z.DOWN,
                speed: x < 2 ? 1 : r.scroll.vertical.speed * y
              });
            });
          }
          d = f, h = g;
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
        Ce(t.querySelectorAll(`.dg-row[data-row="${o}"]`), s);
      }
    ), i.on(
      { el: t, selector: ".dg-row", type: "mouseout.cell" },
      (n, r) => {
        if (!r) return;
        const o = r.dataset.row;
        oe(t.querySelectorAll(`.dg-row[data-row="${o}"]`), s);
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
    const n = e.enabledCellEdit, r = new Vt(), o = Ct, l = () => {
      i.off(
        document,
        "touchmove.cellclick mousemove.cellclick touchend.cellclick touchcancel.cellclick mouseup.cellclick"
      ), e.isBodyDragging = !1, e.isMoveRow = !1;
    };
    i.on(
      { el: t, selector: ".dg-cell", type: "mousedown.cellclick touchstart.cellclick" },
      (c) => {
        var m;
        if (!St(c))
          return !0;
        const d = c.target;
        if (d.closest("a")) return;
        if (Us(d.tagName))
          return !0;
        const h = d.closest(".dg-cell");
        if (h == null) {
          this.gridMain.hideLayer();
          return;
        }
        const u = he(e, h);
        if (u.field.$isAside && u.field.name !== ge && u.field.name !== At) {
          this.gridMain.hideLayer();
          return;
        }
        u.c = Math.max(u.c, e.dataInfo.startCol), s = bt(c, u, r, h);
        let f = -1;
        for (const p of this.handlers)
          if (p.canHandle(s)) {
            if (f > p.priority)
              continue;
            f = p.priority, s.handler = p;
          }
        const g = s.handler;
        if (g) {
          if (g instanceof fi && (c.preventDefault(), e.isMoveRow = !0), (m = g.onPointerDown) == null || m.call(g, s), g.onPointerMove) {
            let p = !1;
            i.on({ el: document, type: "touchmove.cellclick mousemove.cellclick" }, (w) => {
              var I, y;
              if (s.currentPos = Q(w), !p) {
                if (!at(s.startPos, s.currentPos, o))
                  return;
                if (p = !0, e.isBodyDragging = !0, ((I = g.onActivate) == null ? void 0 : I.call(g, s)) === !1) {
                  l();
                  return;
                }
              }
              s.state = Ie.DRAGGING, (y = g.onPointerMove) == null || y.call(g, s);
            }), i.on(
              { el: document, type: "touchend.cellclick touchcancel.cellclick mouseup.cellclick" },
              (w) => {
                var I;
                l(), s.state = Ie.IDLE, s.currentPos = Q(w), (I = g.onPointerUp) == null || I.call(g, s), e.isBodyDragging = !1, e.isMoveRow = !1;
              }
            );
          }
          n === !0 && r.getClickCount() == 0 && (e.edit.enabled = !1), r.processClick(s, g);
        }
      },
      { passive: !1 }
    ), i.on({ el: t, type: "mouseup.cellclick touchend.cellclick" }, (c) => {
      e.selection.isMouseDown = !1, e.isBodyDragging = !1, e.isMoveRow = !1;
    });
  }
  destroy() {
  }
}
const We = "dg-search-highlight", Je = "dg-search-match";
class ur {
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
    return this.context.bodyElement.find(".dg-cell." + j.START_CELL);
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
    r != null && r.length && e.classList.remove(...r);
    const o = Ke(s.cellClassName, {
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
    var d;
    const l = s.firstElementChild.style, c = `${r[L.HEIGHT] - 5}px`;
    if (l.maxHeight = c, this.setCellClassName(s, t, i, n, r), !n.$isAside) {
      if (o.searchEnabled) {
        const h = s.classList, u = o.searchMatchedFields ?? [];
        if (u.length > 0) {
          const f = n.name;
          if (((d = o.matchViewItem) == null ? void 0 : d.isCurrentMatch) && u[o.cellIndex] === f)
            h.add(We, Je);
          else {
            const m = u.includes(f);
            h.remove(Je), h.toggle(We, m);
          }
        } else
          h.remove(We, Je);
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
    oe(e.finds(".dg-cell." + We), We, Je);
  }
  /**
   * 수정된 Cell 다시 렌더링
   *
   * @param cell 수정된 Cell 정보
   */
  refreshEditedCell(e) {
    const t = this.context.gridMain.config();
    let i = this.context.allCellElements.center;
    Ae(t, e.c) ? i = this.context.allCellElements.left : De(t, e.c) && (i = this.context.allCellElements.right);
    const s = i[e.r][e.c];
    this.setCellClassName(s, e.rowIndex, e.c, e.field, e.item), e.field.$renderer.render(e, s.firstElementChild);
  }
  /** Cell 상태 정리 */
  destroy() {
    this.context.cellClassNameCache = /* @__PURE__ */ new WeakMap();
  }
}
class gr {
  constructor(e) {
    this.allRowElements = {}, this.allCellElements = {}, this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.gridMain = e, this.selectionInfo = e.selectionInfo, this.bodyElement = e.element().findDaraElement(".dg-body"), this.leftElement = this.bodyElement.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = this.bodyElement.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = this.bodyElement.findDaraElement('.dg-region[data-region="right"]');
  }
  resetCellState() {
    this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.allRowElements = {}, this.allCellElements = {};
  }
}
class ts {
  constructor(e, t, i) {
    this.context = e, this.cell = t, this.template = i;
  }
  drawData(e, t) {
    var Pt, Ot, _t, Gt, qt, Ut, Kt, Xt;
    const i = this.context.gridMain.options(), s = this.context.gridMain.config(), n = s.dataManager, r = n.getViewItems(), o = s.fieldHeaderGroup.leafLeft, l = s.fieldHeaderGroup.leafCenter, c = s.fieldHeaderGroup.leafRight, d = s.fixedLeftIndex, h = s.fixedRightIndex, u = o.length > 0, f = c.length > 0, g = [
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
    const w = s.dataInfo.rowLength - p;
    let I = Math.min(m, w);
    if (w === 0 && s.dimensions.mainBodyHeight < s.rowHeight && (p = s.dataInfo.rowLength - 1, this.context.gridMain.getScroll().moveVerticalScroll({
      rowIdx: p,
      drawFlag: !1
    }), I = 1), this.updateRowTemplates(g, m), this.context.bodyElement.setAttr({ "data-view-mode": r.length < 1 ? "empty" : "grid" }), I < 1)
      return;
    this.updateLastRowVisibility(g, I, m), this.context.gridMain.hideLayer(e);
    const y = this.context.bodyElement.getElement().classList;
    p % 2 === 0 ? (y.remove("dg-body-odd"), y.add("dg-body-even")) : (y.remove("dg-body-even"), y.add("dg-body-odd"));
    const x = s.selection.startCell, E = s.scroll.startCol, M = s.scroll.endCol;
    this.context.selectionInfo.removeStartAnchorCell();
    const C = (Pt = i.footer.paging) != null && Pt.enabled ? (s.paging.page - 1) * s.paging.pageSize : 0, b = s.currentFields, S = this.context.allCellElements.left, v = this.context.allCellElements.center, V = this.context.allCellElements.right, D = s.searchEnabled, B = s.searchMatchInfo, P = {
      searchEnabled: D,
      cellIndex: B.cellIndex,
      matchViewItem: void 0,
      searchMatchedFields: void 0
    }, X = {
      rowIndex: -1,
      r: -1,
      item: null,
      viewItem: void 0,
      c: -1
    }, _ = this.context.allRowElements, ns = "dg-status-delete";
    for (let ne = 0; ne < I; ne++) {
      const ve = p + ne, $e = r[ve];
      if (!$e)
        break;
      if (t($e, ne))
        continue;
      for (const F of [(Ot = _.left) == null ? void 0 : Ot[ne], (_t = _.center) == null ? void 0 : _t[ne], (Gt = _.right) == null ? void 0 : Gt[ne]])
        F == null || F.classList.remove("dg-group-row", "dg-group-header", "dg-group-summary", "dg-grand-summary");
      const Fe = n.getRowItem($e.id), rs = C + ve;
      for (const F of [(qt = _.left) == null ? void 0 : qt[ne], (Ut = _.center) == null ? void 0 : Ut[ne], (Kt = _.right) == null ? void 0 : Kt[ne]])
        F == null || F.classList.toggle(ns, Fe[L.CUD] === q.DELETE);
      if (P.matchViewItem = void 0, P.searchMatchedFields = void 0, D) {
        const F = n.getSearchMapItem($e.id);
        P.matchViewItem = F, P.searchMatchedFields = (Xt = F == null ? void 0 : F.matchedFields) == null ? void 0 : Xt.map((J) => J.fieldName);
      }
      if (X.rowIndex = rs, X.r = ve, X.item = Fe, X.viewItem = $e, u) {
        const F = S[ne];
        for (let J = 0; J < o.length; J++) {
          const ce = o[J], me = F[J];
          me.classList.remove("dg-group-cell"), me.firstElementChild.style.removeProperty("padding-left"), X.c = J, this.cell.setCellStyle(x, ve, J, me, ce, Fe, P), ce.$renderer.render(X, me.firstElementChild);
        }
      }
      const jt = v == null ? void 0 : v[ne];
      for (let F = E; jt && F <= M; F++) {
        const J = b[F], ce = jt[F];
        ce.classList.remove("dg-group-cell"), ce.firstElementChild.style.removeProperty("padding-left"), this.cell.setCellStyle(x, ve, F, ce, J, Fe, P), X.c = F, J.$renderer.render(X, ce.firstElementChild);
      }
      if (f) {
        const F = V[ne];
        for (let J = 0; J < c.length; J++) {
          const ce = c[J], me = h + J, je = F[me];
          je.classList.remove("dg-group-cell"), je.firstElementChild.style.removeProperty("padding-left"), X.c = me, this.cell.setCellStyle(x, ve, me, je, ce, Fe, P), ce.$renderer.render(X, je.firstElementChild);
        }
      }
    }
    this.selectRowAnchorCell();
  }
  updateRowTemplates(e, t) {
    var n;
    const i = this.context.gridMain.config(), s = i.scroll.before.viewRow;
    if (s > 0 && s > t) {
      for (let r = t; r < s; r++)
        for (const { fields: o, element: l } of e) {
          if (o.length === 0)
            continue;
          const c = l.find(`.dg-row[data-row="${r}"]`);
          (n = c == null ? void 0 : c.parentNode) == null || n.removeChild(c);
        }
      this.refreshCellElements(e, t), i.scroll.before.viewRow = t;
      return;
    }
    if (s < t) {
      const r = i.rowHeight, o = t - s;
      for (const { fields: l, element: c, startCol: d } of e)
        l.length !== 0 && c.find(".dg-body-table > tbody").appendChild(this.template.rowTemplate(s, o, r, l, d));
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
        const f = u.children;
        for (let g = 0; g < f.length; g++)
          l[h][n.startCol + g] = f[g];
      }
      s[r] = c, i[r] = l;
    }
    this.context.allRowElements = s, this.context.allCellElements = i;
  }
  selectRowAnchorCell() {
    var d, h, u;
    const e = this.context.gridMain.config(), t = e.fieldHeaderGroup.leafLeft;
    if (!((d = t == null ? void 0 : t[0]) != null && d.$isAside))
      return;
    const i = this.context.allCellElements.left, s = e.scroll.startIdx, n = e.scroll.viewRow, r = j.SELECTION, o = this.context.selectionInfo.isAllSelect(), l = e.dataManager.getViewItems();
    if (!i)
      return;
    if (o) {
      for (let f = 0; f < n; f++)
        (h = i[f][0]) == null || h.classList.toggle(r, !!l[s + f]);
      return;
    }
    const c = this.context.selectionInfo.getRowLine();
    for (let f = 0; f < n; f++)
      (u = i[f][0]) == null || u.classList.toggle(r, !!l[s + f] && c.has(f + s));
  }
  destroy() {
    this.context.allRowElements = {}, this.context.allCellElements = {};
  }
}
class fr extends ts {
  dataDraw(e) {
    this.drawData(e, (t, i) => this.renderGroupRow(t, i)), this.hideRepeatedGroupValues(), this.applyRowSpans();
  }
  hideRepeatedGroupValues() {
    var d, h, u, f, g, m, p, w;
    const e = this.context.gridMain.options().groupingFields ?? [];
    if (e.length === 0)
      return;
    const t = this.context.gridMain.config(), i = t.dataManager, s = i.getViewItems(), n = t.scroll.startIdx, r = Math.min(t.scroll.viewRow, t.dataInfo.rowLength - n), o = e.map((I) => t.currentFields.find((y) => y.name === I));
    let l;
    for (let I = 0; I < r; I++) {
      const y = s[n + I];
      if (!y || y.groupRowType)
        continue;
      for (const E of o) {
        if (!E)
          continue;
        const M = t.fieldHeaderGroup.leafLeft.includes(E) ? "left" : t.fieldHeaderGroup.leafRight.includes(E) ? "right" : "center";
        (u = (h = (d = this.context.allCellElements[M]) == null ? void 0 : d[I]) == null ? void 0 : h[E.$colSeq]) == null || u.classList.remove("dg-group-continuation");
      }
      const x = i.getRowItem(y.id);
      if (l)
        for (let E = 0; E < o.length; E++) {
          const M = o[E], C = o.slice(0, E + 1).every((v) => v && Object.is(x[v.name], l[v.name]));
          if (!M || !C)
            continue;
          const b = t.fieldHeaderGroup.leafLeft.includes(M) ? "left" : t.fieldHeaderGroup.leafRight.includes(M) ? "right" : "center", S = (g = (f = this.context.allCellElements[b]) == null ? void 0 : f[I]) == null ? void 0 : g[M.$colSeq];
          S && (S.firstElementChild.textContent = "", S.classList.add("dg-group-continuation"));
        }
      l = x;
    }
    const c = r - 1;
    if (c >= 0)
      for (const I of o) {
        if (!I)
          continue;
        const y = t.fieldHeaderGroup.leafLeft.includes(I) ? "left" : t.fieldHeaderGroup.leafRight.includes(I) ? "right" : "center";
        (w = (p = (m = this.context.allCellElements[y]) == null ? void 0 : m[c]) == null ? void 0 : p[I.$colSeq]) == null || w.classList.remove(
          "dg-group-continuation"
        );
      }
  }
  applyRowSpans() {
    var d, h, u, f;
    const t = this.context.gridMain.options().rowSpanFields ?? [];
    if (t.length === 0)
      return;
    const i = this.context.gridMain.config(), s = i.dataManager, n = s.getViewItems(), r = i.scroll.startIdx, o = Math.max(0, Math.min(i.scroll.viewRow, i.dataInfo.rowLength - r)), l = this.context.allCellElements, c = t.map((g) => i.currentFields.find((m) => m.name === g)).filter((g) => g !== void 0);
    for (const g of c) {
      const m = i.fieldHeaderGroup.leafLeft.includes(g) ? "left" : i.fieldHeaderGroup.leafRight.includes(g) ? "right" : "center", p = g.$colSeq, w = Array.from(
        { length: o },
        (I, y) => {
          var x, E;
          return (E = (x = l[m]) == null ? void 0 : x[y]) == null ? void 0 : E[p];
        }
      );
      for (const I of w)
        I && (I.rowSpan = 1, I.style.removeProperty("display"));
    }
    for (let g = 0; g < c.length; g++) {
      const m = c[g], p = i.fieldHeaderGroup.leafLeft.includes(m) ? "left" : i.fieldHeaderGroup.leafRight.includes(m) ? "right" : "center", w = m.$colSeq;
      let I = 0;
      for (; I < o; ) {
        const y = n[r + I];
        if (!y || y.groupRowType) {
          I++;
          continue;
        }
        const x = s.getRowItem(y.id);
        let E = 1;
        for (; I + E < o; ) {
          const M = n[r + I + E];
          if (!M || M.groupRowType)
            break;
          const C = s.getRowItem(M.id);
          if (!c.slice(0, g + 1).every((S) => Object.is(x[S.name], C[S.name])))
            break;
          E++;
        }
        if (E > 1) {
          const M = (h = (d = l[p]) == null ? void 0 : d[I]) == null ? void 0 : h[w];
          M && (M.rowSpan = E);
          for (let C = I + 1; C < I + E; C++) {
            const b = (f = (u = l[p]) == null ? void 0 : u[C]) == null ? void 0 : f[w];
            b && (b.style.display = "none");
          }
        }
        I += E;
      }
    }
  }
  renderGroupRow(e, t) {
    var d, h, u, f, g, m, p, w, I;
    if (!e.groupRowType)
      return !1;
    const i = this.context.gridMain.config(), s = this.context.allRowElements, n = this.context.allCellElements, r = e.groupRowType === "group" ? "dg-group-header" : e.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary", o = i.currentFields.find((y) => !y.$isAside), l = new Set(this.context.gridMain.options().sumFields ?? []), c = (e.groupRowType === "groupSummary" || e.groupRowType === "group") && e.groupField ? i.currentFields.find((y) => y.name === e.groupField) : i.currentFields.find((y) => !y.$isAside && !l.has(y.name)) ?? o;
    for (const y of ["left", "center", "right"]) {
      const x = (d = s[y]) == null ? void 0 : d[t];
      x == null || x.classList.remove("dg-group-header", "dg-group-summary", "dg-grand-summary", "dg-status-delete"), x == null || x.classList.add("dg-group-row", r);
    }
    for (const y of i.currentFields) {
      const x = y.$colSeq;
      let E;
      if (i.fieldHeaderGroup.leafLeft.includes(y) ? E = (u = (h = n.left) == null ? void 0 : h[t]) == null ? void 0 : u[x] : i.fieldHeaderGroup.leafRight.includes(y) ? E = (g = (f = n.right) == null ? void 0 : f[t]) == null ? void 0 : g[x] : E = (p = (m = n.center) == null ? void 0 : m[t]) == null ? void 0 : p[x], !E)
        continue;
      const M = this.context.cellClassNameCache.get(E);
      M != null && M.length && E.classList.remove(...M), this.context.cellClassNameCache.delete(E), E.classList.remove(
        "dg-group-continuation",
        "dg-search-highlight",
        "dg-search-match",
        j.SELECTION,
        j.START_CELL
      ), E.classList.add("dg-group-cell");
      const C = E.firstElementChild;
      C.textContent = "";
      const { startIdx: b, startCol: S } = i.selection.startCell;
      if (this.context.selectionInfo.updateCellSelectionClass(
        E,
        i.scroll.startIdx + t,
        x,
        b,
        S
      ), y.name === ge) {
        const v = (w = this.context.gridMain.options().footer.paging) != null && w.enabled ? (i.paging.page - 1) * i.paging.pageSize : 0, V = {
          r: i.scroll.startIdx + t,
          c: x,
          rowIndex: v + i.scroll.startIdx + t,
          field: y,
          item: i.dataManager.getRowItem(e.id),
          viewItem: e
        };
        y.$renderer.render(V, C);
      } else if (!y.$isAside && e.groupRowType === "group" && y === c)
        C.textContent = `${e.groupField}: ${String(e.groupValue ?? "")}`, C.style.paddingLeft = `${(e.groupDepth ?? 0) * 16}px`;
      else if (!y.$isAside && e.groupRowType !== "group" && y === c)
        C.textContent = e.groupRowType === "grandSummary" ? "Grand Total" : e.groupField ? `${String(e.groupValue ?? "")} 합계` : "Subtotal", C.style.paddingLeft = `${(e.groupDepth ?? 0) * 16}px`;
      else if (e.groupRowType !== "group" && l.has(y.name)) {
        const v = (I = e.groupSums) == null ? void 0 : I[y.name];
        C.textContent = v === void 0 ? "" : String(v), C.style.paddingLeft = "";
      } else
        C.style.paddingLeft = "";
    }
    return !0;
  }
}
class mr extends ts {
  dataDraw(e) {
    this.drawData(e, (t) => !1);
  }
}
class pr {
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
      r !== void 0 && (s.setItemChecked(r, t), this.setFieldRefresh(st));
      return;
    }
    e.forEach((r) => {
      s.setItemChecked(r, t);
    }), this.setFieldRefresh(st);
    const n = s.getViewItems().filter((r) => !r.groupRowType);
    this.context.gridMain.getHeader().setCheckboxStyle(
      Ks(n.filter((r) => s.isItemChecked(r.id)).length, n.length)
    );
  }
  /**
   * 지정한 Field 다시 렌더링
   *
   * @param fieldName Field명
   */
  setFieldRefresh(e) {
    var p, w;
    const t = this.context.gridMain.config(), { scroll: i, paging: s, dataManager: n, currentFields: r } = t, o = r.find((I) => I.name === e);
    if (!o)
      return;
    const l = this.context.gridMain.options(), c = n.getViewItems(), d = i.viewRow, h = i.startIdx, u = (p = l.footer.paging) != null && p.enabled ? (s.page - 1) * s.pageSize : 0, f = o.$colSeq;
    let g = this.context.allCellElements.center;
    f < t.fixedLeftIndex ? g = this.context.allCellElements.left : f >= t.fixedRightIndex && (g = this.context.allCellElements.right);
    const m = { rowIndex: -1, r: -1, item: null, viewItem: void 0, c: -1, field: o };
    for (let I = 0; I < d; I++) {
      const y = h + I, x = c[y];
      if (!x)
        break;
      if (x.groupRowType)
        continue;
      const E = n.getRowItem(x.id), M = u + y;
      m.rowIndex = M, m.r = y, m.item = E, m.viewItem = x, m.c = f;
      const C = (w = g[I]) == null ? void 0 : w[f];
      C && o.$renderer.render(m, C.firstElementChild);
    }
  }
  /**
   * 필드값으로 Row 체크 상태 설정
   *
   * @param name 비교할 필드명
   * @param values 필드값 또는 필드값 목록
   */
  setCheckedItemByValue(e, t) {
    const { dataManager: i, isRowAllowMultiSelect: s } = this.context.gridMain.config(), n = new Set(G(t) ? t : [t]), r = i.getViewItems(), o = [];
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
    const { dataManager: i } = this.context.gridMain.config(), s = new Set(G(t) ? t : [t]), n = i.getViewItems(), r = [];
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
    const { dataManager: i } = this.context.gridMain.config(), s = new Set(G(t) ? t : [t]), n = i.getViewItems(), r = [];
    for (const o of n)
      s.has(i.getRowItem(o.id)[e]) && r.push(o.id);
    this.addItemsChecked(r, !1);
  }
  /** 선택 데이터 클립보드 복사 */
  copyData() {
    const e = this.context.selectionInfo.selectionData();
    try {
      as(e);
    } catch (t) {
      console.log("Unable to copy", t);
    }
  }
  /** Row Anchor Cell 선택 상태 갱신 */
  selectRowAnchorCell() {
    var d, h;
    const e = this.context.gridMain.config(), t = e.fieldHeaderGroup.leafLeft;
    if (t && !t[0].$isAside)
      return;
    const i = this.context.allCellElements.left, s = e.scroll.startIdx, n = e.scroll.viewRow, r = j.SELECTION, o = e.dataManager.getViewItems(), l = this.context.selectionInfo.isAllSelect();
    if (!i)
      return;
    if (l) {
      for (let u = 0; u < n; u++)
        (d = i[u][0]) == null || d.classList.toggle(r, !!o[s + u]);
      return;
    }
    const c = this.context.selectionInfo.getRowLine();
    for (let u = 0; u < n; u++)
      (h = i[u][0]) == null || h.classList.toggle(r, !!o[s + u] && c.has(u + s));
  }
  /** Selection 상태 정리 */
  destroy() {
  }
}
class wr {
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
    return R`<table class="dg-body-table"><thead><tr>${n.join("")}</tr></thead><tbody></tbody></table>${e === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
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
        const f = document.createElement("td");
        f.className = u.cellClassName, f.dataset.cellPosition = `${d},${u.col}`;
        const g = document.createElement("div");
        g.className = u.rendererClassName, u.rendererStyle && (g.style.cssText = u.rendererStyle), f.appendChild(g), h.appendChild(f);
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
          cellClassName: `dg-cell dg-aside dg-${us(n.name).replace("$", "")}`,
          rendererClassName: `dg-cell-renderer ${n.$alignStyle || ""}`.trim(),
          rendererStyle: ""
        };
        continue;
      }
      const { style: o, className: l } = Si(n), d = n.$renderer.supportsInteraction() ? rt(n.editRenderer) : rt(n.renderer);
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
class Ir {
  /**
   * Body 생성
   *
   * @param gridMain GridMain
   */
  constructor(e) {
    var t, i;
    this.gridMain = e, this.context = new gr(e), this.templateManager = new wr(this.context), this.cellManager = new ur(this.context), this.renderer = (t = e.options().groupingFields) != null && t.length || (i = e.options().rowSpanFields) != null && i.length ? new fr(this.context, this.cellManager, this.templateManager) : new mr(this.context, this.cellManager, this.templateManager), this.selectionManager = new pr(this.context, this.renderer), this.templateManager.create(), this.bodyEvent = new hr(e, this, this.context.selectionInfo);
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
    this.renderer.dataDraw(e);
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
const we = "dg-on";
class yr {
  constructor(e) {
    this._isActive = !1, this.contextData = /* @__PURE__ */ new Map(), this.gridMain = e;
    const t = this.gridMain.options().contextMenu;
    t && (this._isActive = !0, this.contextOpts = t);
  }
  init() {
    this._isActive && (this.create(), this.initEvent());
  }
  create() {
    var i;
    const e = document.createElement("ul");
    e.dataset.gridLayerId = this.gridMain.uid(), e.className = "dg-contextmenu dg-contextmenu-top dg-outer-layer", e.setAttribute("draggable", "false"), e.setAttribute("onselectstart", "return false");
    const t = [];
    this.contextOpts.enabledHeader && (t.push('<li><a class="dg-contextmenu-header" tabindex="-1">-</a></li>'), t.push('<li><a class="dg-divider" tabindex="-1"></a></li>')), t.push(this.template(this.contextOpts.items, "top", 0)), e.innerHTML = t.join(""), (i = document.querySelector(Dt)) == null || i.appendChild(e), this.contextElement = new fe(e), this.gridMain.config().eventManager.on({ el: e, type: "contextmenu" }, (s) => {
      A(s);
    });
  }
  initEvent() {
    const e = this.gridMain.config(), t = this.contextOpts, i = this.gridMain.getMainElement().getElement(), s = T(t.disableItem), n = T(t.beforeActivate);
    let r;
    const o = this.gridMain.config().eventManager;
    o.off(i, "contextmenu"), o.on({ el: i, type: "contextmenu" }, (l) => {
      if (A(l), this.gridMain.hideLayer(), oe(this.contextElement.finds(".dg-submenu-item." + we), we), s) {
        const f = t.disableItem(t.items);
        if (f) {
          const g = f.length;
          let m;
          if (g > 0)
            for (let p = 0; p < g; p++)
              m = f[p], Ce(this.contextElement.find('[context-key="' + m.depth + "_" + m.key + '"]'), "disabled");
        }
      }
      const c = l.target;
      if (r = c.closest(".dg-contextmenu-item"), Ce(r, "dg-select"), n) {
        const f = c.closest(".dg-cell");
        if (f) {
          const g = he(e, f);
          t.beforeActivate(g, { evt: l, element: c });
        } else
          t.beforeActivate({ evt: l, element: c });
      }
      const d = Q(l), h = this.contextElement.getElement();
      this.gridMain.openLayer(h);
      const u = vs(h, d);
      this.contextElement.css({ top: u.top + "px", left: u.left + "px" });
    }), this.initItemClickEvent(), this.initSubmenuEvent();
  }
  initItemClickEvent() {
    const e = this.contextElement.finds(".dg-contextmenu-item"), t = this.contextOpts.callback, i = T(t), s = this.gridMain.config().eventManager;
    s.off(e, "pointerdown"), s.on({ el: e, type: "pointerdown" }, (n) => {
      const r = n.currentTarget;
      if (ye(r, "dg-submenu-item"))
        return;
      const l = r.closest(".dg-contextmenu").querySelectorAll('input[type="checkbox"]'), c = {};
      l.forEach((u) => {
        var f, g;
        (f = u == null ? void 0 : u.dataset) != null && f.itemKey && (c[(g = u == null ? void 0 : u.dataset) == null ? void 0 : g.itemKey] = u.checked);
      });
      const d = r.dataset.itemKey || "", h = this.contextData.get(d);
      if (this.gridMain.hideLayer(), h != null && h.callback) {
        h.callback(h, c);
        return;
      }
      i && t(h, c);
    });
  }
  initSubmenuEvent() {
    const e = this.contextElement.finds(".dg-contextmenu-item > a");
    let t;
    const i = this.gridMain.config().eventManager;
    i.off(e, "mouseenter"), i.on({ el: e, type: "mouseenter" }, (s) => {
      const r = s.currentTarget.closest(".dg-contextmenu-item"), o = r.closest(".dg-contextmenu");
      if (clearTimeout(t), !ye(r, "dg-submenu-item")) {
        oe(o.querySelectorAll(":scope >.dg-contextmenu-item." + we), we);
        return;
      }
      ye(r, we) || oe(o.querySelectorAll(":scope >.dg-contextmenu-item." + we), we), t = setTimeout(() => {
        Ce(r, we);
        const l = Ri(), c = O(r), d = r.querySelector(".dg-contextmenu-submenu"), h = new fe(d);
        h.css({ left: "", top: "" });
        const u = O(d), f = u.width, g = u.height;
        if (f + c.left + c.width > l.width) {
          const w = f / (c.width + 3) * 100;
          h.css({ left: `-${w}%` });
        }
        const p = c.top + g - l.height;
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
   * @param {string} type position type
   * @returns {string} template string
   */
  template(e, t, i) {
    const s = [], n = e.length;
    let r, o;
    for (let l = 0; l < n; l++) {
      const c = e[l];
      if (!N(c)) {
        if (o = Ke(c.itemClass, { item: c }).join(" ") + (c.disabled === !0 ? " disabled" : ""), r = i + "_" + (c.key || ""), c.divider === !0) {
          s.push('<li><a class="dg-divider" tabindex="-1"></a></li>');
          continue;
        }
        if (c.checkbox === !0) {
          s.push(R`<li class="dg-contextmenu-check ${o}"><a tabindex="-1"><label ><input type="checkbox" data-item-key="${de(String(c.key ?? ""))}" /><span>${de(String(c.label ?? ""))}</span></label></a ></li>`);
          continue;
        }
        if (this.contextData.set(r, c), !N(c.children))
          s.push(R`<li class="dg-contextmenu-item dg-submenu-item ${o}" data-item-key="${de(r)}"><a tabindex="-1"><span class="dg-contextmenu-label">${de(String(c.label ?? ""))}</span><span class="dg-contextmenu-hotkey-empty"></span></a><ul class="dg-contextmenu dg-contextmenu-submenu">${this.template(c.children, t, i + 1)}</ul></li>`);
        else {
          const d = N(c.hotkey) ? "" : `<span class="dg-contextmenu-hotkey">${de(String(c.hotkey))}</span>`;
          s.push(R`<li class="dg-contextmenu-item ${o}" data-item-key="${de(r)}"><a tabindex="-1"><span class="dg-contextmenu-label">${de(String(c.label ?? ""))}</span>${d}</a></li>`);
        }
        s.push("</li>");
      }
    }
    return s.join("");
  }
}
class xr extends Bt {
  constructor(e, t) {
    var i;
    super(e), this.priority = 5, this.dragDelay = 150, this.beforeEndCol = -1, this.startCellIdx = 0, this.scrollDirectionX = null, this.dragAnimationId = 0, this.lastScrollTime = 0, this.selectionInfo = e.gridMain.selectionInfo, this.headerElement = (i = e.header) == null ? void 0 : i.getHeaderElement().getElement(), this.multipleFlag = Ns(this.opts.selectionMode);
  }
  canHandle(e) {
    var i, s;
    const t = (i = e.cellInfo) == null ? void 0 : i.field;
    return t != null && t.$isAside ? !1 : (this.startCellIdx = ((s = e.cellInfo) == null ? void 0 : s.c) ?? 0, !0);
  }
  onPointerDown(e) {
  }
  onActivate(e) {
    if (!this.multipleFlag) return !1;
    const t = this.cfg, i = O(this.headerElement, !0), { mainLeftWidth: s, mainInsideWidth: n, mainRightWidth: r, mainBodyHeight: o } = t.dimensions;
    this.gridBounds = {
      gridLeft: i.left,
      gridRight: i.left + t.dimensions.mainTotalWidth,
      mainLeft: i.left + s,
      mainRight: i.left + n - r,
      top: i.top,
      bottom: i.top + o
    }, this.headerPosition = i, this.scrollDirectionX = null, this.beforeEndCol = -1, ye(e.cellEl, "dg-line-number") && (this.currentSelectionMode = ie.multiRow);
  }
  onPointerMove(e) {
    if (!this.multipleFlag) return;
    const t = this.cfg, i = this.gridBounds, { x: s } = e.currentPos, n = {};
    let r = !1;
    const o = zi(
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
        const u = c === k.RIGHT, f = u ? t.scroll.insideEndCol + 1 : t.scroll.insideStartCol - 1;
        i.col !== f && (u && t.fixedRightIndex === 0 || !u && t.fixedLeftIndex === 0) && (h.endCol = f, this.selectionInfo.setSelectionRangeInfo({ range: h }, !1, !1)), n.moveHorizontalScroll({ direction: c, colIdx: f, drawFlag: !1 }), i.col = f, d = !0;
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
    lt(r) ? n.modifierKey = 1 : He(r) ? (n.modifierKey = 2, n.startCol = i ? s : t.selection.range.startCol, n.endCol = s) : i = !0, this.multipleFlag && this.selectionInfo.setSelectionRangeInfo(
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
class Cr {
  constructor(e, t) {
    this.gridMain = e, this.header = t, this.helpOpts = e.options().header;
  }
  /**
   * keydown event
   *
   */
  init() {
    const e = this.helpOpts.help, t = this.gridMain.config(), i = t.eventManager, s = this.header.getHeaderElement().finds(".dg-header-help");
    if (T(e.click)) {
      const c = e.click ?? (() => {
      });
      i.off(s, "pointerdown"), i.on(
        { el: s, type: "pointerdown" },
        (d) => {
          if (!Te(d))
            return;
          A(d);
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
      const d = c.currentTarget, h = this.getHeaderHelpCellInfo(t, d), u = h.field, f = (u == null ? void 0 : u.headerHelp) ?? e.content;
      return f && (n || (n = xe("div", "dg-header-help-tooltip", "help-tooltip"), o.appendChild(n)), l = setTimeout(() => {
        let g;
        T(f) ? g = f(h) : g = f, n.innerHTML = g;
        const m = n.style;
        m.height = "auto", m.display = "block", m.width = "auto";
        const p = gt(o, d, n);
        m.top = `${p.top}px`, m.left = `${p.left + 2}px`, m.height = `${p.height}px`;
      }, r)), !1;
    }), i.on({ el: s, type: "mouseleave" }, (c) => (clearTimeout(l), n != null && n.style && (n.style.display = "none"), !1));
  }
  getHeaderHelpCellInfo(e, t) {
    var r, o;
    let i, s;
    const n = t.closest(".dg-header-group-cell");
    if (n) {
      const l = (r = n.dataset.headerGroupPosition) == null ? void 0 : r.split(",");
      if (l && l.length > 0) {
        const c = ae(l[0]), d = ae(l[1]);
        let h;
        n.closest('.dg-region[data-region="left"]') ? h = e.fieldHeaderGroup.left : n.closest('.dg-region[data-region="right"]') ? h = e.fieldHeaderGroup.right : h = e.fieldHeaderGroup.center, s = h[c][d], i = d;
      }
    } else
      i = ae(((o = t.closest(".dg-header-cell")) == null ? void 0 : o.dataset.headerCellPosition) ?? "0"), s = e.currentFields[i];
    return { c: i, field: s };
  }
}
class Er extends Bt {
  constructor(e, t) {
    super(e), this.priority = 1, this.resizeIdx = 0, this.resizeMoveX = 0, this.positionLeft = 0;
    const i = this.opts.header.resize;
    this.resizeOpts = i, this.resizeUpdate = T(i.update) ? i.update : void 0, this.resizerHelperElement = e.gridMain.element().findDaraElement(".dg-resize-helper");
  }
  onPointerDown(e) {
    var t;
    this.resizeIdx = ((t = e.cellInfo) == null ? void 0 : t.c) || 0;
  }
  onActivate(e) {
    const t = this.cfg, i = this.resizeIdx, s = Ae(t, i), n = De(t, i);
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
class Mr {
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
        var w, I;
        if (!Te(d))
          return;
        A(d), this.gridMain.hideLayer();
        const h = d.currentTarget, u = ae(
          ((w = h.closest(".dg-header-cell")) == null ? void 0 : w.dataset.headerCellPosition) ?? "0"
        ), f = t.currentFields[u], g = f.name;
        He(d) || (ii(r.finds("[data-dg-sort]"), "data-dg-sort"), (s.length > 1 || !s.some((y) => y.name === g)) && (s.forEach((y) => {
          var x;
          (x = l[y.sortCell].querySelector(".dg-sort-num")) == null || x.replaceChildren();
        }), s.length = 0, c = 0));
        const p = s.find((y) => y.name === g);
        if (p)
          if (p.ascOrder)
            ti(h, { "data-dg-sort": "desc" }), p.ascOrder = !p.ascOrder;
          else {
            const y = s.findIndex((x) => x.name === g);
            y !== -1 && s.splice(y, 1), (I = h.querySelector(".dg-sort-num")) == null || I.replaceChildren(), ii(h, "data-dg-sort");
          }
        else
          ti(h, { "data-dg-sort": "asc" }), s.push({ name: g, field: f, ascOrder: !0, sortCell: u });
        s.length > 0 && c >= 1 && c != s.length && s.forEach((y, x) => {
          var E;
          (E = l[y.sortCell].querySelector(".dg-sort-num")) == null || E.replaceChildren(x + 1 + "");
        }), n.dataSort(s, e), c = s.length, this.gridMain.selectionInfo.initSelection(), this.gridMain.getBody().dataDraw("sort");
      },
      { passive: !1 }
    );
  }
}
class vr {
  constructor(e, t) {
    this.cfg = e.config(), this.gridMain = e, this.header = t, this.headerElement = this.header.getHeaderElement(), this.headerCellElements = this.header.getHeaderCellElements(), this.headerOpts = e.options().header;
  }
  init() {
    this.gridMain.options().search.enabled === !0 && this.initSearchButton(), this.gridMain.config().enabledHeaderHelpButton && new Cr(this.gridMain, this.header).init(), this.gridMain.config().enabledSortButton && new Mr(this.gridMain, this.header).init(), this.initPointerEvent(), this.initResizeEvent(), this.initHeaderCheckbox();
  }
  /**
   * 검색 버튼
   */
  initSearchButton() {
    const e = this.headerElement.find(".dg-search-icon"), t = this.cfg.eventManager;
    t.off(e, "click"), t.on({ el: e, type: "click" }, (i) => (A(i), this.gridMain.getDataSearch().openSearch(), !1));
  }
  /**
   * init header selection event
   */
  initPointerEvent() {
    const e = this.gridMain.options().selectionMode, t = [];
    if (this.headerOpts.enabledAllColumnSelection && !zs(e) && t.push(new xr({ gridMain: this.gridMain, header: this.header }, this)), t.length < 1) return;
    const i = this.cfg, s = i.eventManager, n = this.headerCellElements;
    let r;
    const o = new Vt(), l = Ct, c = () => {
      s.off(
        document,
        "touchmove.header.selection mousemove.header.selection touchend.header.selection touchcancel.header.selection mouseup.header.selection"
      );
    };
    s.off(n, "mousedown.header.selection touchstart.header.selection"), s.on(
      { el: n, type: "mousedown.header.selection touchstart.header.selection" },
      (d) => {
        if (!St(d))
          return !0;
        this.gridMain.hideLayer();
        const h = d.currentTarget, u = Os(i, h);
        u.c = Math.max(u.c, i.dataInfo.startCol), r = bt(d, u, o);
        let f = -1;
        for (const m of t)
          if (m.canHandle(r)) {
            if (f > m.priority)
              continue;
            f = m.priority, r.handler = m;
          }
        const g = r.handler;
        if (g) {
          if (g.onPointerMove) {
            let m = !1;
            s.on(
              { el: document, type: "touchmove.header.selection mousemove.header.selection" },
              (p) => {
                var w, I;
                if (r.currentPos = Q(p), !m) {
                  if (!at(r.startPos, r.currentPos, l))
                    return;
                  if (m = !0, ((w = g.onActivate) == null ? void 0 : w.call(g, r)) === !1) {
                    c();
                    return;
                  }
                }
                r.state = Ie.DRAGGING, (I = g.onPointerMove) == null || I.call(g, r);
              }
            ), s.on(
              { el: document, type: "touchend.header.selection touchcancel.header.selection  mouseup.header.selection" },
              (p) => {
                var w;
                c(), r.state = Ie.IDLE, r.currentPos = Q(p), (w = g.onPointerUp) == null || w.call(g, r);
              }
            );
          }
          o.processClick(r, g);
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
    const t = this.cfg, i = t.eventManager, s = this.headerElement.finds(".dg-header-resizer"), n = new Er({ gridMain: this.gridMain, header: this.header }, this);
    let r;
    const o = new Vt(), l = Ct;
    i.off(s, "mousedown.resizerclick touchstart.resizerclick"), i.on(
      { el: s, type: "mousedown.resizerclick touchstart.resizerclick" },
      (c) => {
        var u;
        if (!St(c))
          return !0;
        c.cancelable && A(c), this.gridMain.hideLayer();
        const d = c.currentTarget, h = _s(t, d);
        if (h.c = Math.max(h.c, t.dataInfo.startCol), r = bt(c, h, o), r.handler = n, (u = n.onPointerDown) == null || u.call(n, r), n.onPointerMove) {
          let f = !1;
          i.on({ el: document, type: "touchmove.resizerclick mousemove.resizerclick" }, (g) => {
            var m, p;
            if (r.currentPos = Q(g), !f) {
              if (!at(r.startPos, r.currentPos, l))
                return;
              f = !0, (m = n.onActivate) == null || m.call(n, r);
            }
            r.state = Ie.DRAGGING, (p = n.onPointerMove) == null || p.call(n, r);
          }), i.on({ el: document, type: "touchend.resizerclick mouseup.resizerclick" }, (g) => {
            var m;
            i.off(
              document,
              "touchmove.resizerclick mousemove.resizerclick touchend.resizerclick mouseup.resizerclick"
            ), r.state = Ie.IDLE, r.currentPos = Q(g), (m = n.onPointerUp) == null || m.call(n, r);
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
      this.header.setAllCheckItem(!ye(i, W), i);
    });
  }
}
const Be = "dg-indeterminate";
class br {
  constructor(e) {
    if (this.enabled = !0, this.gridMain = e, this.headerOpts = e.options().header, this.headerElement = e.element().findDaraElement(".dg-header"), this.headerOpts.view === !1) {
      this.enabled = !1, this.headerElement.getElement().remove();
      return;
    }
    this.initHeader(), this.headerEvent = new vr(e, this), this.headerEvent.init();
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
    t || (t = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all")), e ? Ce(t, W) : oe(t, W), oe(t, Be), this.gridMain.getBody().setAllCheckItem(e);
  }
  /**
   * set check box style
   *
   * @public
   * @param {number} idx
   * @param {("all" | "none" | "partial")} mode
   */
  setCheckboxStyle(e) {
    if (!this.gridMain.config().isRowAllowMultiSelect) return;
    const t = this.headerElement.getElement().querySelector(".dg-checkbox.dg-all"), i = t == null ? void 0 : t.classList;
    i && (e == "partial" ? (i.remove(W), i.contains(Be) || i.add(Be)) : (i.toggle(W, e === "all"), i.contains(Be) && i.remove(Be)));
  }
  /**
   * set header height
   *
   * @param {number} header height
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
    e ? Ce(t, "dg-on") : oe(t, "dg-on");
  }
  createTemplate() {
    this.headerElement.css({ height: `${this.gridMain.config().dimensions.mainHeaderHeight}px` }), this.leftElement = this.headerElement.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = this.headerElement.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = this.headerElement.findDaraElement('.dg-region[data-region="right"]'), this.leftElement.html(this.template("left")), this.centerElement.html(this.template("center")), this.rightElement.html(this.template("right")), this.headerCellElements = [], this.headerElement.finds(".dg-header-cell").forEach((e) => {
      const i = ae(e.dataset.headerCellPosition || "0");
      this.headerCellElements[i] = e;
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
    const e = this.gridMain.config().dataInfo, i = this.gridMain.getHeader().getHeaderCellElements(), s = this.gridMain.selectionInfo.isAllSelect(), n = this.gridMain.selectionInfo.getColumnLine();
    for (let r = e.startCol; r < e.colLength; r++) {
      const l = i[r].classList;
      s || n.has(r) ? l.contains(j.SELECTION) || l.add(j.SELECTION) : l.contains(j.SELECTION) && l.remove(j.SELECTION);
    }
  }
  clearAnchorCell() {
    oe(this.getHeaderCellElements(), j.SELECTION);
  }
  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  template(e) {
    var m;
    const t = this.gridMain.config(), i = this.gridMain.options();
    let s, n;
    const r = t.currentFields;
    if (e == "left" ? (s = t.fieldHeaderGroup.left, n = t.fieldHeaderGroup.leafLeft) : e == "right" ? (s = t.fieldHeaderGroup.right, n = t.fieldHeaderGroup.leafRight) : (s = t.fieldHeaderGroup.center, n = t.fieldHeaderGroup.leafCenter), !(s != null && s.length) || !((m = s[0]) != null && m.length)) return "";
    const o = [], l = i.search.enabled, c = i.header.help.enabled, d = s.length, h = this.headerOpts.resize.enabled, u = i.header.sort.enabled, f = l ? R`<div class="dg-search-icon">${le.search}</div>` : "";
    s.forEach((p, w) => {
      const y = [`<tr class="dg-header-row" style="height:${t.fieldHeaderGroup.heights[w]}px">`];
      p.forEach((x, E) => {
        x.$isLeaf && x.$depth < d && (x.$rowspan = d - x.$depth);
        let M = "", C = "";
        x.$isLeaf ? (M = "dg-header-cell", C = ` data-header-cell-position="${x.$resizeIdx}"`) : (M = "dg-header-group-cell", C = ` data-header-group-position="${w},${E}"`);
        const b = x.$colspan > 1 ? ` colspan="${x.$colspan}" scope="colgroup"` : "", S = x.$rowspan > 1 ? ` rowspan="${x.$rowspan}"` : "", v = x.$isLeaf && !x.$isAside && (u || x.sort === !0) ? R`<div class="dg-sort-icon"><span class="dg-sort-num"></span>${le.headerSort}</div>` : "", V = x.$enabledHelp, D = !x.$isAside && (c || V !== !1) ? R`<div class="dg-header-help-button">${le.help}</div>` : "", B = x.$isAside && x.name == st && t.isRowAllowMultiSelect ? R`<div class="dg-choice"><div class="dg-choice-item dg-checkbox dg-all"><div class="dg-indicator"></div>${x.label ? `<span class="dg-label dg-ellipsis">${x.label}</span>` : ""}</div></div>` : `<div class="centered">${x.label ?? ""}</div>`, P = x.$isAside && x.name == ge ? f : "", X = R`${D}<div class="dg-label-wrapper"><div class="dg-header-label ${x.sort ? "sort-header" : ""}"><div class="dg-inner">${B}</div>${v}</div></div>`, _ = !h || x.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${x.$resizeIdx}"></div>`;
        y.push(R`<th class="${M}" ${b}${S}${C}>${P} ${X} ${_}</th>`);
      }), y.push("</tr>"), o.push(y.join(""));
    });
    const g = [];
    for (const p of n) {
      const w = p.$colSeq;
      g.push(
        `<th data-col-idx="${w}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${r[w].$width}px;"></th>`
      );
    }
    return R`<table class="dg-header-table"><thead><tr>${g.join("")}</tr></thead><tbody>${o.join("")}</tbody></table>${e === "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
  }
}
class Sr {
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
      height: `${e - Se}px`,
      margin: `1px ${e}px`
    }), this.horizontalElement.finds(".dg-scroll-button > svg").forEach((i) => {
      i.style.width = `${e - Se}px`, i.style.height = `${e - Se}px`;
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
    l = Math.max(l, Mt), this.horizontalElement.css({ width: r + "px" }), this.horizontalThumbElement.css({ width: l + "px" }), t.oneColMove = n / e.dataInfo.colLength, t.hWidth = r, t.hTrackWidth = o, t.hThumbWidth = l, t.left + l > o ? (t.left = o - l, this.setHorizontalPosition(e)) : this.calcViewCol(e, t.centerLeftPosition);
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
      i && (s = Q(m).x);
    }, u = (m) => {
      if (!i) return;
      i = !1, l.removeClass("active"), o !== null && (cancelAnimationFrame(o), o = null);
      const p = Q(m).x;
      c({ position: r + (p - n) }), d();
    }, f = () => {
      if (!i) return;
      const m = s - n;
      c({ position: r + m }), o = requestAnimationFrame(f);
    }, g = l.getElement();
    t.off(g, "mousedown touchstart touchend touchcancel mouseup"), t.on(
      { el: g, type: "mousedown touchstart" },
      (m) => {
        if (Te(m))
          return A(m), this.gridMain.hideLayer(), i = !0, n = Q(m).x, s = n, r = e.scroll.left, l.addClass("active"), t.on({ el: document, type: "touchmove mousemove" }, h), t.on({ el: document, type: "touchend touchcancel mouseup" }, u), o !== null && cancelAnimationFrame(o), o = requestAnimationFrame(f), !0;
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
        Te(h) && (this.gridMain.hideLayer(), s = 1, r = Q(h).clientX - d.getBoundingClientRect().left, o = t.scroll.oneColMove, l = o * e.horizontal.speed * 2, n = r < t.scroll.left, c = setInterval(() => {
          s = 2, this.moveHorizontalScroll({
            position: this.getHorizontalBgMovePostion(t, r, o, n, l)
          });
        }, 100));
      },
      { passive: !1 }
    ), i.on({ el: d, type: "mouseup touchend touchcancel mouseleave" }, (h) => {
      s != 0 && (A(h), clearTimeout(c), s == 1 && this.moveHorizontalScroll({
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
        const l = ot(o.currentTarget, "data-dg-mode", "left");
        i = 1, this.gridMain.hideLayer(), e = setInterval(() => {
          i = 2, this.moveHorizontalScroll({ direction: l ? k.LEFT : k.RIGHT });
        }, 100);
      },
      { passive: !1 }
    ), n.on({ el: r, type: "mouseup touchend touchcancel mouseleave" }, (o) => {
      if (i == 1) {
        const l = ot(o.currentTarget, "data-dg-mode", "left");
        this.moveHorizontalScroll({ direction: l ? k.LEFT : k.RIGHT });
      }
      clearInterval(e), i = 0;
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
    if (Y(e.position))
      i = e.position;
    else if (Y(e.colIdx)) {
      let s = e.colIdx;
      s > 0 ? s = Math.min(s, t.dataInfo.colLength - 1) : s = 0;
      for (let n = t.fixedLeftIndex; n < s; n++)
        i += t.currentFields[n].$width;
      e.direction == "R" && (i = i + t.currentFields[s].$width), i = ri(t, i, e.direction);
    } else if (se(e.direction)) {
      const s = e.speed || 1;
      i = t.scroll.left + (e.direction == k.LEFT ? -1 : 1) * s * t.scroll.oneColMove;
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
        if (t !== !1 && T(r) && r({
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
   * @param {number} contLeftVal scroll position
   */
  setHorizontalPosition(e) {
    const t = e.scroll, i = $i(e, t.left);
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
    for (let g = 0; g < o.length; g++) {
      if (u && l >= t && (i.insideStartCol = g, u = !1), l += o[g].$width, h && l >= t) {
        c = g, h = !1;
        continue;
      }
      if (l - t >= r) {
        d = g;
        break;
      }
    }
    i.before.startCol = i.startCol, i.before.endCol = i.endCol, i.insideStartCol = e.fixedLeftIndex + i.insideStartCol, i.startCol = e.fixedLeftIndex + Math.max(c, 0), i.endCol = e.fixedLeftIndex + Math.min(d, o.length);
    const f = ri(e, l, "R") != i.left ? -1 : 0;
    i.insideEndCol = i.endCol + f;
  }
}
class Rr {
  constructor(e, t, i) {
    this.bodyDrawPending = !1, this.bodyDrawAnimationId = 0, this.lastThumbTop = -1, this.gridMain = e, this.scrollOpts = this.gridMain.options().scroll, this.verticalElement = i, this.verticalTrackElement = i.findDaraElement(".dg-scroll-track"), this.verticalThumbElement = i.findDaraElement(".dg-scroll-thumb");
  }
  /**
   * vertical event 초기화
   *
   */
  init() {
    const e = this.scrollOpts.width;
    this.verticalElement.css({ width: `${e}px` }), this.verticalThumbElement.css({ width: `${e - Se}px`, margin: `${e}px 0px` }), this.verticalElement.finds(".dg-scroll-button > svg").forEach((i) => {
      i.style.width = `${e - Se}px`, i.style.height = `${e - Se}px`;
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
    if (c >= Mt && h > 0 && (u = c * (i.mainBodyHeight / h), u = Math.max(Mt, Math.min(u, c))), d > 0 ? t.oneRowMove = (c - u) / d : t.oneRowMove = 0, t.vHeight = l, t.vTrackHeight = c, t.vThumbHeight = u, this.verticalElement.css({ height: `${l}px` }), this.verticalThumbElement.css({ height: `${u}px` }), d === 0) {
      this.setVerticalPosition(t, 0);
      return;
    }
    const f = d, g = Math.min(Math.max(0, t.startIdx), f);
    this.setVerticalPosition(t, g * t.oneRowMove);
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
        if (!Te(h))
          return;
        this.gridMain.hideLayer(), s = 1, l = Q(h).clientY - d.getBoundingClientRect().top, r = t.scroll.oneRowMove, o = r * e.vertical.speed * 5, n = l < t.scroll.top;
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
      s != 0 && (clearInterval(c), A(h), s == 1 && this.moveVerticalScroll({
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
        const l = ot(o.currentTarget, "data-dg-mode", "up");
        this.gridMain.hideLayer(), r = 1, i = setInterval(() => {
          r = 2, this.moveVerticalScroll({ direction: l ? Z.UP : Z.DOWN });
        }, s);
      },
      { passive: !1 }
    ), t.on({ el: n, type: "mouseup touchend mouseleave" }, (o) => {
      if (r == 1) {
        const l = ot(o.currentTarget, "data-dg-mode", "up");
        this.moveVerticalScroll({ direction: l ? Z.UP : Z.DOWN });
      }
      clearInterval(i), r = 0;
    });
  }
  initVerticalThumb() {
    const e = this.scrollOpts, t = this.gridMain.config(), i = e.vertical.enabledTooltip, s = this.verticalElement.findDaraElement(".dg-vscroll-bar-tip"), n = this.verticalThumbElement;
    let r = !1, o = 0, l = null, c = 0, d = 0;
    const h = (m) => {
      r && (o = Q(m).y);
    }, u = (m) => {
      if (!r) return;
      r = !1, n.removeClass("active"), l !== null && (cancelAnimationFrame(l), l = null);
      const p = Q(m).y;
      this.moveVerticalScroll({ position: c + (p - d) }), t.eventManager.off(document, "touchmove mousemove touchcancel touchend mouseup"), i && s.hide();
    }, f = () => {
      if (!r) return;
      const m = o - d;
      this.moveVerticalScroll({ position: c + m }), i && (s.text(t.scroll.viewRow + 1), s.show()), l = requestAnimationFrame(f);
    }, g = this.verticalThumbElement.getElement();
    t.eventManager.off(g, "mousedown touchstart"), t.eventManager.on(
      { el: g, type: "mousedown touchstart" },
      (m) => {
        if (Te(m))
          return A(m), this.gridMain.hideLayer(), r = !0, c = t.scroll.top, d = Q(m).y, o = d, n.addClass("active"), t.eventManager.on({ el: document, type: "touchmove mousemove" }, h), t.eventManager.on({ el: document, type: "touchend touchcancel mouseup" }, u), l !== null && cancelAnimationFrame(l), l = requestAnimationFrame(f), !0;
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
    if (Y(e.position))
      s = e.position;
    else if (Y(e.rowIdx))
      s = e.rowIdx * i.oneRowMove;
    else if (se(e.direction)) {
      const n = e.speed || 1;
      s = i.top + (e.direction == Z.UP ? -1 : 1) * n * i.oneRowMove;
    }
    this.moveVerticalScrollPosition(s, e.drawFlag);
  }
  /**
   *세로 스크롤 위치 이동.
   */
  moveVerticalScrollPosition(e, t = !0, i) {
    const n = this.gridMain.config().scroll, r = Math.max(0, n.vTrackHeight - n.vThumbHeight);
    if (e > r ? e = r : e < 0 && (e = 0), n.top == e)
      return;
    if (i !== !1) {
      const l = this.gridMain.options().scroll.vertical.onUpdate;
      if (t !== !1 && T(l) && l({ scrollTop: e, height: n.vTrackHeight }) === !1)
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
   * @param {Config} cfg 설정값
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
const ee = class ee {
  constructor(e) {
    this.wheelAnimationId = 0, this.pendingVerticalDelta = 0, this.pendingHorizontalDelta = 0, this.verticalWheelDirection = null, this.horizontalWheelDirection = null, this.verticalDirectionChanged = !1, this.horizontalDirectionChanged = !1, this.gridMain = e, this.opts = this.gridMain.options(), this.horizontalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-horizontal"), this.verticalElement = this.gridMain.getMainElement().findDaraElement(".dg-scroll.dg-vertical");
  }
  destroy() {
    var e;
    this.wheelAnimationId !== 0 && cancelAnimationFrame(this.wheelAnimationId), this.wheelAnimationId = 0, this.pendingVerticalDelta = 0, this.pendingHorizontalDelta = 0, (e = this.verticalScroll) == null || e.destroy();
  }
  /**
   * 스크롤을 초기화한다.
   */
  init() {
    this.verticalScroll = new Rr(this.gridMain, this, this.verticalElement), this.horizontalScroll = new Sr(this.gridMain, this, this.horizontalElement);
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
        const o = e.enabledHorizontal && He(n);
        !s && this.opts.scroll.enabledWheelInContainer && A(n), this.canScroll(e, r, o, s) && (A(n), o ? this.addHorizontalWheel(r) : this.addVerticalWheel(r), this.requestWheelAnimation());
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
    const t = e < 0 ? Z.UP : Z.DOWN;
    this.verticalWheelDirection !== null && this.verticalWheelDirection !== t ? (this.pendingVerticalDelta = e, this.verticalDirectionChanged = !0) : this.pendingVerticalDelta += e, this.verticalWheelDirection = t;
  }
  /**
   * 가로 wheel delta를 누적한다.
   */
  addHorizontalWheel(e) {
    const t = e < 0 ? k.LEFT : k.RIGHT;
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
    return e === Z.UP ? t.startIdx > 0 : t.startIdx + t.insideViewRow < i;
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
    return e === k.LEFT ? t.left > 0 : t.left < i;
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
    const i = Math.floor(Math.abs(e) / ee.WHEEL_TICK);
    return i > 0 ? Math.min(i, ee.MAX_TICKS_PER_FRAME) : t ? 1 : 0;
  }
  /**
   * 세로 wheel의 row 이동 속도를 반환한다.
   */
  getVerticalWheelSpeed() {
    const e = this.opts.scroll.vertical.speed;
    return e > 0 ? e : ee.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 가로 wheel의 이동 속도를 반환한다.
   */
  getHorizontalWheelSpeed() {
    const e = this.opts.scroll.horizontal.speed;
    return e > 0 ? e : ee.DEFAULT_WHEEL_SPEED;
  }
  /**
   * 처리한 세로 wheel delta를 소비한다.
   */
  consumeVerticalDelta(e) {
    const t = e * ee.WHEEL_TICK;
    this.pendingVerticalDelta < 0 ? this.pendingVerticalDelta += t : this.pendingVerticalDelta -= t, Math.abs(this.pendingVerticalDelta) < ee.WHEEL_TICK && (this.pendingVerticalDelta = 0);
  }
  /**
   * 처리한 가로 wheel delta를 소비한다.
   */
  consumeHorizontalDelta(e) {
    const t = e * ee.WHEEL_TICK;
    this.pendingHorizontalDelta < 0 ? this.pendingHorizontalDelta += t : this.pendingHorizontalDelta -= t, Math.abs(this.pendingHorizontalDelta) < ee.WHEEL_TICK && (this.pendingHorizontalDelta = 0);
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
    return Math.abs(this.pendingVerticalDelta) >= ee.WHEEL_TICK || Math.abs(this.pendingHorizontalDelta) >= ee.WHEEL_TICK || this.verticalDirectionChanged || this.horizontalDirectionChanged;
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
ee.WHEEL_TICK = 100, ee.DEFAULT_WHEEL_SPEED = 3, ee.MAX_TICKS_PER_FRAME = 2;
let Ht = ee;
function Lr(a, e, t) {
  if (e !== "min" && e !== "max" && e !== "sum" && e !== "average")
    return `${e} not valid`;
  let i = 0, s = e === "min" ? 1 / 0 : e === "max" ? -1 / 0 : 0;
  const n = a.length;
  for (let r = 0; r < n; r += Yt) {
    const o = Math.min(r + Yt, n), l = a.slice(r, o);
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
  return i === 0 ? "not valid" : e === "average" ? s / i : s;
}
class Tr {
  constructor(e, t, i) {
    this.isClick = !1, this.cellClassNameCache = /* @__PURE__ */ new WeakMap(), this.field = e, this.fieldName = e.name, this.gridMain = t, this.language = this.gridMain.i18n(), this.cfg = this.gridMain.config(), this.isVauleFunction = T(e.getValue), this.hasCellClassName = !!i.cellClassName, this.summaryItem = i;
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
    var o;
    const e = this.summaryItem, t = e.displayFormat ?? ((o = this.field) == null ? void 0 : o.displayFormat), s = this.cfg.dataManager.getAllRowItems(), n = e.expression, r = { formatValue: "" };
    return s.length > 0 && (n ? (T(n) ? r.value = n(s) : n === "count" ? r.value = s.length || 0 : r.value = Lr(s, n, e.name), r.formatValue = r.value, t && (r.formatValue = qi(r.value, t))) : e.label && (r.formatValue = e.label)), r;
  }
  setCellClassName(e, t) {
    if (!this.hasCellClassName) return;
    const i = this.cellClassNameCache.get(t), s = Ke(this.summaryItem.cellClassName, e);
    i != null && i.length && t.classList.remove(...i), s.length > 0 ? (t.classList.add(...s), this.cellClassNameCache.set(t, s)) : this.cellClassNameCache.delete(t);
  }
  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  alignStyle() {
    return U.right;
  }
}
class Vr extends Tr {
  constructor(e, t, i) {
    super(e, t, i);
  }
  render(e, t) {
    const i = this.getValue();
    this.setCellClassName(i.value, t);
    const s = t.firstElementChild, n = i.formatValue;
    s.textContent !== n && (s.textContent = n), s.classList.remove("single-line", "multi-line"), se(n) && n.includes(`
`) ? s.classList.add("multi-line") : s.classList.add("single-line");
  }
}
class Hr {
  constructor(e) {
    var s;
    this.gridMain = e, this.cfg = e.config();
    const t = e.options(), i = ((s = t.summary) == null ? void 0 : s.items) ?? [];
    this._isActive = (i == null ? void 0 : i.length) > 0, this._isActive && (this.summaryOpts = t.summary ?? {});
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
        const r = n.name, o = t.get(r) ?? $({}, n);
        n.$alignStyle = U[n.align] ?? (o.$alignStyle || U.left), s.push(new Vr(o, this.gridMain, n));
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
      h == null || h.insertBefore(t.getElement(), h.querySelector(".dg-body"));
    }
    this.leftElement = t.findDaraElement('.dg-region[data-region="left"]'), this.centerElement = t.findDaraElement('.dg-region[data-region="center"]'), this.rightElement = t.findDaraElement('.dg-region[data-region="right"]'), this.leftElement.html(this.template("left")), this.centerElement.html(this.template("center")), this.rightElement.html(this.template("right"));
    const { fieldHeaderGroup: i, fixedLeftIndex: s, fixedRightIndex: n, summary: r } = e, o = i.leafLeft, l = i.leafCenter, c = i.leafRight;
    [
      { name: "left", fields: o, element: this.leftElement, startCol: 0 },
      { name: "center", fields: l, element: this.centerElement, startCol: s },
      { name: "right", fields: c, element: this.rightElement, startCol: n }
    ].forEach(({ fields: h, element: u, startCol: f }) => {
      h.length !== 0 && u.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(r, h, f));
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
    return R`<table class="dg-body-table"><thead><tr>${n.join("")}</tr></thead><tbody></tbody></table>${e == "center" ? "" : '<div class="dg-fixed-column-line"></div>'}`;
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
  rowTemplate(e, t, i) {
    const s = [], n = e.heights, r = this.allSummaryRenders, o = r.length, l = {};
    for (let c = 0; c < o; c++) {
      const d = c, h = r[c], u = [];
      let f = 0;
      const g = n[c];
      for (let m = 0; m < t.length; m++) {
        let p = t[m];
        const w = h.find((y) => y.getFieldInfo().name === p.name);
        if (w && (p = w.getSummaryItem()), f > 0) {
          --f;
          continue;
        }
        if (l[m] > 0) {
          l[m] = l[m] - 1;
          continue;
        }
        const I = [];
        if (p.colspan && (f = p.colspan - 1, I.push(` colspan="${p.colspan}" scope="colgroup" `)), p.rowspan && (l[m] = p.rowspan - 1, I.push(` rowspan="${p.rowspan}" `)), p.$isAside)
          u.push(R`<td scope="col" class="dg-cell dg-aside" ${I.join("")} data-cell-position="${d},${i + m}" ><div role="presentation" class="dg-cell-renderer ${p.$alignStyle}"></div></td>`);
        else {
          const { style: y, className: x } = Si(p);
          u.push(R`<td scope="col" class="dg-cell" ${I.join(" ")} data-cell-position="${d},${i + m}" ><div role="presentation" style="height:${g - 2}px;max-height:${g - 2}px;${y}" class="dg-cell-renderer dg-ellipsis dg-text ${p.$alignStyle} ${x}" ></div></td>`);
        }
      }
      s.push(R`<tr class="dg-row" data-row="${d}" style="height:${g}px">${u.join("")}</tr>`);
    }
    return s.join("");
  }
}
class is {
  constructor(e) {
    this.allFieldNames = [], this.cfg = e.config(), this.searchOpts = e.options().search, this.gridMain = e;
    const t = this.searchOpts, i = [];
    for (const s of this.cfg.currentFields)
      s.$isAside || i.push(s.name);
    this.allFieldNames = i, this.defaultSearchOpts = $(
      {
        matchCase: !1,
        matchWholeWord: !1,
        useRegex: !1,
        searchFields: z,
        matchWholeRegex: vi,
        hideNonMatched: !1,
        direction: Re.NEXT
      },
      {
        matchWholeRegex: t.matchWholeRegex ?? !1,
        hideNonMatched: t.hideNonMatched ?? !1
      }
    );
  }
}
class Ar extends is {
  constructor(e) {
    super(e);
  }
  openSearch() {
    return !0;
  }
  search(e, t) {
    const i = this.gridMain.config(), s = $({}, this.defaultSearchOpts, t);
    s.searchFields == z && (s.searchFields = this.allFieldNames), e == "" ? (i.searchEnabled = !1, this.setMatchCountText(!0), this.gridMain.getBody().clearSearchHighlight()) : i.searchEnabled = !0, i.dataManager.search(e, s), this.gridMain.refreshBody(!0, "search");
    const n = this.cfg.searchMatchInfo;
    return { count: n.matchCount, matchIndex: n.currentMatchIndex };
  }
  setMatchCountText(e = !1) {
  }
}
class Dr extends is {
  constructor(e) {
    super(e), this.createTemplate();
  }
  openSearch() {
    const e = this.gridMain, t = e.getRendererLayerElement(), i = this.searchElement, s = i.style, n = e.getHeader().getHeaderElement().find(".dg-search-icon"), r = gt(t, n, i);
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
      s = xe("div", "dg-search-simple", "help-tooltip"), n.push(
        `<select class="dg-search-field"><option value="${z}">${e.i18n().getMessage("all")}</option>`
      );
      for (const r of i)
        r.$isAside || n.push(`<option value="${r.name}">${r.label}</option>`);
      n.push("</select>"), n.push(R`<div class="dg-search-container"><input type="text" class="dg-search-text" placeholder="Search" /><div class="dg-search-icons"><button class="dg-icon-button" type="button" data-search-type="mc" title="Match Case">Aa</button><button class="dg-icon-button" type="button" data-search-type="mww" title="Match Whole Word"><span class="dg-whole-word-icon">ab</span></button><button class="dg-icon-button" type="button" data-search-type="regex" title="Use Regex">.*</button></div></div><span class="dg-search-btn"><span class="dg-btn dg-search-prev" title="${e.i18n().getMessage("prev")}"></span><span class="dg-btn dg-search-next" title="${e.i18n().getMessage("next")}"></span></span><span class="dgMatchCount"></span>`), s.innerHTML = n.join(""), t.appendChild(s), this.searchElement = s;
    }
    this.searchTextElement = s.querySelector(".dg-search-text"), this.searchFieldElement = s.querySelector(".dg-search-field"), this.matchCountElement = s.querySelector(".dgMatchCount"), this.initSimpleModeEvent();
  }
  /**
   *  init simple search event
   */
  initSimpleModeEvent() {
    const e = this.gridMain.config(), t = e.eventManager, i = e.searchParameter, s = this.searchTextElement;
    t.off(s, "keydown"), t.on({ el: s, type: "keydown" }, (l) => {
      l.stopPropagation(), !l.isComposing && (Ts(l) ? (l.preventDefault(), this.simpleSearch(Re.NEXT)) : Vi(l) && this.gridMain.hideLayer(this.searchElement));
    });
    const n = this.searchElement.querySelector(".dg-search-prev");
    t.off(n, "pointerdown"), t.on({ el: n, type: "pointerdown" }, (l) => {
      A(l), this.simpleSearch(Re.PREV);
    });
    const r = this.searchElement.querySelector(".dg-search-next");
    t.off(r, "pointerdown"), t.on({ el: r, type: "pointerdown" }, (l) => {
      A(l), this.simpleSearch(Re.NEXT);
    });
    const o = this.searchElement.querySelectorAll(".dg-icon-button");
    t.off(o, "pointerdown"), t.on({ el: o, type: "pointerdown" }, (l) => {
      A(l);
      const c = l.currentTarget, d = c.dataset.searchType, h = !ye(c, "on");
      d == "mc" ? i.matchCase = h : d == "mww" ? i.matchWholeWord = h : d == "regex" && (i.useRegex = h), Ms(c, "on");
    });
  }
  search(e, t) {
    const i = this.gridMain.config(), s = $({}, this.defaultSearchOpts, t);
    s.searchFields == z && (s.searchFields = this.allFieldNames), this.searchTextElement.value = e, e == "" ? (i.searchEnabled = !1, this.setMatchCountText(!0), this.gridMain.getBody().clearSearchHighlight()) : i.searchEnabled = !0, i.dataManager.search(e, s), this.gridMain.refreshBody(!0, "search"), this.gridMain.getHeader().setSearchIcon(i.searchEnabled);
    const n = this.cfg.searchMatchInfo;
    return { count: n.matchCount, matchIndex: n.currentMatchIndex };
  }
  simpleSearch(e) {
    const t = this.searchTextElement.value, i = this.searchFieldElement.value || z, n = this.gridMain.config().searchParameter;
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
const kr = ["none", "horizontal", "vertical", "both"];
let $r = 0, mi = !1;
const ue = /* @__PURE__ */ new Map(), Fr = zr();
class pi {
  constructor(e, t, i, s) {
    var o, l;
    this.openLayers = [], this.destroyed = !1;
    const n = Pn(i);
    this.grid = e, this.language = new Ti(), s && this.language.setMessage(s), this.cfg = As(n), (o = n.groupingFields) != null && o.length ? this.cfg.dataManager = new Jn(n, this) : n.tree ? this.cfg.dataManager = new Oe(n, this) : this.cfg.dataManager = new Ji(n, this), this.structureBuilder = new lr(n, this), this.opts = n;
    const r = t.getAttribute(Ye);
    r && ue.get(r) && ((l = ue.get(r)) == null || l.destroy()), this.$instanceId = r ?? `${os}${++$r}`, this.orginStyle = t.style.cssText, t.setAttribute(Ye, this.$instanceId), this.gridElement = new fe(t), ue.set(this.$instanceId, this);
  }
  init() {
    const e = this.opts;
    this.initGridSize = {
      height: e.height == "auto" ? -1 : e.height,
      width: e.width == "auto" ? -1 : e.width
    }, this.initElement(), this.calculation(), this.initMainView(), this.initEvent(), this.initDocumentGlobalEvent();
  }
  /**
   * grid 전체 이벤트
   */
  initDocumentGlobalEvent() {
    mi || (mi = !0, document.addEventListener("pointerdown", (e) => {
      const t = e.composedPath();
      ue.forEach((i, s) => {
        const n = i.gridElement.getElement();
        t.includes(n) || i.setGridFocusOut(e);
      });
    }));
  }
  static getInstance(e) {
    var i;
    let t;
    return se(e) ? t = e : t = e instanceof HTMLElement ? e == null ? void 0 : e.getAttribute(Ye) : "", t ? ((i = ue.get(t)) == null ? void 0 : i.grid) ?? null : null;
  }
  static allInstance() {
    return ue;
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
    const e = this.cfg, t = this.opts, i = Fr.content.firstElementChild.cloneNode(!0), s = i.querySelector(".empty-text");
    s && (s.textContent = this.i18n().getMessage("no.data")), this.gridElement.getElement().appendChild(i), this.gridKeyInput = i.querySelector(".dg-text-editor"), this.gridKeyInput.id = "dg_text_" + this.$instanceId, this.cfg.disableVerticalScroll && i.classList.add("dg-auto-height"), this.layoutElement = new fe(this.gridElement.find(".daracl-grid .dg-layout")), this.setGridStyle(this.opts.style), this.rendererLayerElement = this.gridElement.find(".dg-layers"), this.mainElement = new fe(this.gridElement.find(".dg-main"));
    const n = t.hoverMode ? Qe[t.hoverMode] ?? Qe.cell : Qe.cell;
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
    this.toolbar = new tr(this), this.selectionInfo = new Gn(this, e, this.cfg), this.header = new br(this), this.body = new Ir(this), this.summary = new Hr(this), e.search.enabled ? this.dataSearch = new Dr(this) : this.dataSearch = new Ar(this), this.scroll = new Ht(this), this.footer = new ar(this), this.contextMenu = new yr(this), this.toolbar.init(), this.selectionInfo.initSelection(), this.body.init(), this.summary.init(), this.footer.init(), this.scroll.init(), this.contextMenu.init(), this.refreshBody(!0, "init");
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
    const e = this.opts, t = this.cfg;
    (e.width === "auto" || e.height === "auto") && this.initResizeEvent();
    const i = this.rendererLayerElement;
    t.eventManager.on({ el: this.mainElement.getElement(), type: "mousedown" }, (r) => {
      r.composedPath().includes(i) || (r == null || r.preventDefault(), this.setGridFocusIn(r));
    });
    const s = i, n = `[${Mi}]`;
    t.eventManager.off(s, "wheel DOMMouseScroll"), t.eventManager.on(
      { el: s, type: "wheel DOMMouseScroll" },
      (r) => {
        const l = r.target.closest(n);
        if (l == null) return;
        const c = r.deltaY, d = l.scrollTop === 0, h = l.scrollTop + l.clientHeight >= l.scrollHeight;
        return r.stopPropagation(), (c < 0 && d || c > 0 && h) && r.preventDefault(), !0;
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
        if (e.type.startsWith("focus") ? i = e.relatedTarget : i = e.target, (i == null ? void 0 : i.closest(".dg-hidden-layers")) !== null) {
          const s = i.closest(".dg-outer-layer");
          if ((s == null ? void 0 : s.dataset.gridLayerId) == this.$instanceId) {
            requestAnimationFrame(() => {
              t.focus();
            });
            return;
          }
        }
        this.cfg.focus = !1, this.hideLayer();
      }
    }
  }
  openLayer(e) {
    e.style.display = "block", this.cfg.isOpenLayer = !0, this.openLayers.push(e);
  }
  hideLayer(e) {
    if (e != "all" && ue.size > 1 && ue.forEach((t, i) => {
      i != this.$instanceId && t.setGridFocusOut();
    }), !(this.openLayers.length < 1)) {
      if (e) {
        let t;
        (e == "vscroll" || e == "hscroll") && (t = Me);
        for (let i = this.openLayers.length - 1; i >= 0; i--) {
          const s = this.openLayers[i];
          if (t && s.classList.contains(t))
            s.style.display = "none", this.openLayers.splice(i, 1);
          else if (e == s) {
            s.style.display = "none", this.openLayers.splice(i, 1);
            break;
          }
        }
        this.cfg.isOpenLayer = this.openLayers.length > 0;
        return;
      }
      this.cfg.isOpenLayer = !1;
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
    const t = this.opts.windowResizeDelay ?? 50, i = this.gridElement;
    if (typeof ResizeObserver < "u") {
      let s = !1;
      const n = i.getElement(), r = new ResizeObserver(() => {
        s || (s = !0, requestAnimationFrame(() => {
          s = !1, this.resize(i);
        }));
      });
      r.observe(n), this.resizeObserver = r;
    } else {
      const s = cs(() => {
        this.resize(i);
      }, t);
      this.windowResizeHandler = s, window.addEventListener("resize", s);
    }
  }
  /**
   * resize event 처리
   *
   * @param el grid element
   */
  resize(e) {
    if (this.destroyed) return;
    const t = this.initGridSize, i = t.width < 0, s = t.height < 0, n = this.cfg.disableVerticalScroll;
    requestAnimationFrame(() => {
      if (this.destroyed || !ls(e.getElement())) return;
      const r = {
        width: i ? n ? e.clientWidth() : e.width() : t.width,
        height: s ? e.height() : t.height
      };
      (this.currentSize.height !== r.height || this.currentSize.width !== r.width) && (this.setSize(r.width, r.height, !0), this.toolbar && this.toolbar.resizeArrowVisibility());
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
   * @param mode scroll mode
   */
  changeScrollMode() {
    const e = this.cfg, t = e.scrollbarSize, i = (e.scroll.enabledHorizontal ? 1 : 0) + (e.scroll.enabledVertical ? 2 : 0), s = this.mainElement.find(".dg-panels").style;
    s.removeProperty("height"), s.removeProperty("width"), e.scroll.enabledHorizontal && (s.height = `calc(100% - ${t})`), e.scroll.enabledVertical && (s.width = `calc(100% - ${t})`), i == 0 ? this.mainElement.removeAttr("data-scroll") : this.mainElement.setAttr({ "data-scroll": kr[i] });
  }
  /**
   * set data
   *
   * @param {any[]} items
   */
  setItems(e) {
    var t;
    this.cfg.dataManager.setItems(e), (t = this.header) == null || t.setCheckboxStyle("none"), this.scroll.moveVerticalScroll({ rowIdx: 0 }), this.refreshBody(!0, "setItems");
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
    const i = this.cfg.dataManager.addItems(e, t, q.READ);
    i > -1 && (this.scroll.moveVerticalScroll({ rowIdx: i, drawFlag: !1 }), this.getBody().dataDraw("refreshBody-addItems"));
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
    N(e) ? r = !0 : G(e) ? n = e : n = [e];
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
    return this.getBody().getCheckedItemByName(L.ID);
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
    const t = e ? xs[e] : "";
    if (e && !t) return;
    const i = this.cfg;
    if (i.theme === t) return;
    const s = this.layoutElement.getElement().classList;
    i.theme && s.contains(i.theme) && s.remove(i.theme), i.theme = t, t && !s.contains(t) && s.add(t);
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
    if (!et[e])
      return;
    const t = Object.values(et).filter((n) => n !== e).map((n) => `dg-style-${n}`), i = this.layoutElement, s = "dg-style-" + et[e];
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
    e instanceof Oe && (e.expandAll(), this.refreshBody(!0, "expandAll"));
  }
  collapseAll() {
    const e = this.cfg.dataManager;
    e instanceof Oe && (e.collapseAll(), this.refreshBody(!0, "collapseAll"));
  }
  setPaging(e) {
    this.opts.paging = e, this.cfg.paging = e, this.footer && this.footer.setPagingTemplate(e);
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
    var n, r;
    if (this.destroyed) return;
    this.destroyed = !0;
    const e = this.gridElement, t = this.$instanceId, i = this.cfg;
    (n = this.scroll) == null || n.destroy(), (r = this.toolbar) == null || r.destroy(), this.body.destroy(), i.eventManager.destroy(), e.removeAttr(Ye);
    const s = e.getElement();
    for (this.resizeObserver ? (this.resizeObserver.unobserve(s), this.resizeObserver.disconnect()) : this.windowResizeHandler && window.removeEventListener("resize", this.windowResizeHandler), s.style.cssText = this.orginStyle; s.firstChild; )
      typeof s.firstChild.remove == "function" ? s.firstChild.remove() : s.removeChild(s.firstChild);
    ue.delete(t);
  }
}
function zr() {
  const a = document.createElement("template");
  return a.innerHTML = R`<div class="daracl-grid"><div class="dg-layers"></div><div class="dg-viewport"><input type="text" class="dg-text-editor" inputmode="none" /><div class="dg-layout" style="user-select:none;touch-action:manipulation;"><div class="dg-toolbar dg-select" role="presentation"><div class="dg-toolbar-scroll"></div><div class="dg-toolbar-arrow dg-noselect"><button type="button" class="dg-button" data-direction="left">${le.scrollLeft}</button><button type="button" class="dg-button" data-direction="right">${le.scrollRight}</button></div></div><div class="dg-main" data-scroll="none"><div class="dg-panels"><div class="dg-panel dg-header"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div></div><div class="dg-panel dg-body"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div><div class="dg-empty-overlay"><span class="dg-empty-message"><i class="dg-icon-info"></i><span class="empty-text"></span></span></div><div class="dg-drop-indicator"></div></div><div class="dg-panel dg-summary"><div class="dg-region" data-region="left"></div><div class="dg-region" data-region="center"></div><div class="dg-region" data-region="right"></div></div></div><div class="dg-resize-helper"></div><div class="dg-scroll-container"><div class="dg-scroll dg-vertical"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button" data-dg-mode="up" style="top:0px;">${le.scrollUp}</div><div class="dg-scroll-button" data-dg-mode="down" style="bottom:0px;">${le.scrollDown}</div></div><div class="dg-scroll dg-horizontal"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button" data-dg-mode="left" style="left:0px;">${le.scrollLeft}</div><div class="dg-scroll-button" data-dg-mode="right" style="right:0px;">${le.scrollRight}</div></div><div class="dg-scroll-corner"></div><div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;"><textarea class="dg-paste-area"></textarea></div></div></div><div class="dg-footer" role="presentation"><span class="dg-status"><span class="dg-selection-status"></span></span><span class="dg-paging"></span><span class="dg-paging-info"></span></div></div></div></div>`, a;
}
function Le(a) {
  return a == null ? "" : a instanceof Date ? a.toISOString() : typeof a == "object" ? JSON.stringify(a) : String(a);
}
function Nr() {
  return import("./PdfConverter-CROX-xNi.mjs");
}
function Wr(a, e) {
  return a.map((t) => {
    var n, r, o, l, c;
    const i = t.$renderer;
    if (((n = t.renderer) == null ? void 0 : n.type) === "password") return "********";
    if (((r = t.renderer) == null ? void 0 : r.type) === "hidden") return "";
    const s = i.getValue(e);
    if (i instanceof K && ["dropdown", "link", "button"].includes((o = t.renderer) == null ? void 0 : o.type)) {
      const d = i.getRefValue(s, e);
      if (typeof d == "string") return d;
      if (d != null && d.hide) return "";
      if ((d == null ? void 0 : d.label) !== void 0) return Le(d.label);
      if (i instanceof Ki) {
        let h = i.getLabel(s);
        if (h.length === 0 && t.defaultValue && (h = i.getLabel(t.defaultValue)), h.length > 0) return h.join(((c = (l = t.editRenderer) == null ? void 0 : l.listItem) == null ? void 0 : c.delimiter) ?? ",");
      }
    }
    return Le(s);
  });
}
class ss {
  constructor(e) {
    this.context = e;
  }
  render() {
    const { fields: e, viewItems: t } = this.context, i = {
      columns: [...this.context.lineNumberField ? [this.context.lineNumberField] : [], ...e].map((n) => ({
        name: n.name,
        label: n.label,
        width: n.$width,
        align: n.align ?? (n.$alignStyle === U.right ? "right" : n.$alignStyle === U.center ? "center" : "left")
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
      const n = t.map((r, o) => {
        var l, c;
        return ((c = (l = this.context).getCellCharts) == null ? void 0 : c.call(l, r, o)) ?? [];
      });
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
    return Wr(this.context.fields, e);
  }
}
class Br extends ss {
  render() {
    return this.previousDataItem = void 0, super.render();
  }
  renderRow(e) {
    const { fields: t, getRowItem: i } = this.context;
    if (!e.groupRowType) {
      const o = i(e.id), l = this.renderDataRow(o), c = this.groupingFields();
      return c.forEach((d, h) => {
        const u = t.find((g) => g.name === d), f = this.previousDataItem !== void 0 && c.slice(0, h + 1).every((g) => {
          var m;
          return Object.is(o[g], (m = this.previousDataItem) == null ? void 0 : m[g]);
        });
        u && f && (l[t.indexOf(u)] = "");
      }), this.previousDataItem = o, l;
    }
    const s = super.renderRow(e), n = new Set(this.context.sumFields), r = t.find((o) => !n.has(o.name)) ?? t[0];
    if (e.groupRowType === "group") {
      const o = t.find((l) => l.name === e.groupField) ?? t[0];
      return o && (s[t.indexOf(o)] = `${e.groupField}: ${Le(e.groupValue)}`), s;
    }
    if (e.groupRowType === "groupSummary") {
      const o = e.groupField ? t.find((l) => l.name === e.groupField) ?? r : r;
      o && (s[t.indexOf(o)] = e.groupField ? `${Le(e.groupValue)} 합계` : "Subtotal");
    } else r && (s[t.indexOf(r)] = "Grand Total");
    for (const [o, l] of Object.entries(e.groupSums ?? {})) {
      const c = t.findIndex((d) => d.name === o);
      c >= 0 && (s[c] = Le(l));
    }
    return s;
  }
  groupingFields() {
    return this.context.groupingFields;
  }
}
class Pr extends ss {
}
function wi(a, e, t) {
  const i = /* @__PURE__ */ new Map(), s = (o, l) => {
    var c;
    for (const d of o) {
      if (d.hidden) continue;
      const h = [...l, d];
      (c = d.children) != null && c.length ? s(d.children, h) : i.set(d.name, h);
    }
  };
  s(a, []);
  const n = e.map((o) => i.get(o.name) ?? [o]), r = Math.max(1, ...n.map((o) => o.length));
  if (r !== 1)
    return Array.from({ length: r }, (o, l) => {
      var d, h, u, f;
      const c = [];
      for (let g = 0; g < n.length; ) {
        const m = n[g];
        if (l >= m.length) {
          g++;
          continue;
        }
        const p = m[l];
        let w = g + 1;
        for (; w < n.length && n[w][l] === p; ) w++;
        c.push({
          label: p.label ?? "",
          column: g,
          colSpan: w - g,
          rowSpan: l === m.length - 1 ? r - l : 1,
          background: (d = t.headerBackgrounds) == null ? void 0 : d[g],
          textColor: (h = t.headerTextColors) == null ? void 0 : h[g],
          gradient: (u = t.headerGradients) == null ? void 0 : u[g],
          borders: (f = t.headerCellBorders) == null ? void 0 : f[g]
        }), g = w;
      }
      return c;
    });
}
function Or() {
  return import("./ExcelExport-DpGWib3e.mjs");
}
function _r() {
  return import("./CsvExport-BesYr38W.mjs");
}
function Gr() {
  return import("./JsonExport-CFOwjeCW.mjs");
}
let Ii = null;
const ht = class ht {
  constructor(e, t, i) {
    if (e == null || N(e))
      throw new Error(`${e} grid element not found`);
    this.createGrid(e, t, i);
  }
  initGlobalConfig() {
    if (Ii === null) {
      const e = H("div", Dt.replace(".", ""));
      document.body.appendChild(e), Ii = e;
    }
  }
  static create(e, t, i) {
    return new ht(e, t, i);
  }
  static message(e) {
    Ti.setGlobalMessage(e);
  }
  static setDefaultOptions(e) {
    On(e);
  }
  createGrid(e, t, i) {
    this.initGlobalConfig(), this.gridMain = new pi(this, e, t, i), this.gridMain.init();
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
    return pi.getInstance(e);
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
  async exportPdf(e = {}) {
    var g;
    const { PdfConverter: t } = await Nr(), i = this.gridMain.config(), s = i.currentFields.filter((m) => !m.hidden && !m.$isAside), n = i.currentFields.find((m) => m.name === ge && !m.hidden), r = n ? [n, ...s] : s, o = this.gridMain.options(), l = this.createPdfCellStyleResolver(r, s), c = {
      fields: s,
      lineNumberField: n,
      lineNumberStart: (g = o.footer.paging) != null && g.enabled ? (i.paging.page - 1) * i.paging.pageSize : 0,
      viewItems: i.dataManager.getViewItems(),
      groupingFields: o.groupingFields ?? [],
      sumFields: o.sumFields ?? [],
      getRowItem: (m) => i.dataManager.getRowItem(m),
      getCellStyles: l.getCellStyles,
      getCellCharts: (m) => {
        if (m.groupRowType)
          return s.map(() => {
          });
        const p = i.dataManager.getRowItem(m.id);
        return s.map((w) => this.getPdfCellChart(w, p));
      },
      getHeaderCellBorders: l.getHeaderCellBorders,
      getHeaderCellStyles: l.getHeaderCellStyles,
      tableBorders: l.tableBorders
    }, d = c.groupingFields.length ? new Br(c) : new Pr(c), h = new t();
    let u;
    try {
      u = d.render(), u.firstPageHeader = wi(o.fields, r, u);
    } finally {
      l.destroy();
    }
    const f = await h.convert(u, e);
    return h.download(f, e.fileName), f;
  }
  /** CSV를 필요한 시점에 로드하여 실제 데이터 행을 다운로드한다. */
  async exportCsv(e = {}) {
    const { CsvConverter: t, createCsvData: i } = await _r(), s = i(this.createDataExportContext(e), e), n = new t(), r = n.convert(s.headers, s.rows, e);
    return n.download(r, e.fileName), r;
  }
  /** JSON 모듈을 필요한 시점에 로드하고 필드명을 키로 하는 행 배열을 다운로드한다. */
  async exportJson(e = {}) {
    const { JsonConverter: t, createJsonData: i } = await Gr(), s = i(this.createDataExportContext(e), e), n = new t(), r = n.convert(s, e);
    return n.download(r, e.fileName), r;
  }
  /** CSV·JSON의 대상 행과 열을 선택하며 화면·선택 상태는 유지한다. */
  createDataExportContext(e) {
    const t = this.gridMain.config(), i = t.dataManager;
    let s = e.visibleOnly ? i.getViewItems() : i instanceof Oe ? i.getAllTreeViewItems() : i.getOriginalViewItems();
    if (e.selectedOnly) {
      const r = new Set(this.getSelectedRowIds());
      s = s.filter((o) => r.has(o.id));
    }
    let n = t.currentFields.filter((r) => !r.$isAside && !r.hidden);
    if (e.includeHiddenColumns) {
      const r = new Qi(this.gridMain), o = new Map(n.map((c) => [c.name, c])), l = (c) => c.flatMap(
        (d) => {
          var h;
          return (h = d.children) != null && h.length ? l(d.children) : [o.get(d.name) ?? r.createRenderer({ ...d })];
        }
      );
      n = l(this.gridMain.options().fields);
    }
    return {
      fields: n,
      viewItems: s,
      groupingFields: [],
      sumFields: [],
      getRowItem: (r) => i.getRowItem(r)
    };
  }
  /** 현재 뷰의 표시 값·그룹 합계·셀 병합을 XLSX로 다운로드한다. */
  async exportExcel(e = {}) {
    var u;
    const { ExcelConverter: t, createExcelData: i } = await Or(), s = this.gridMain.config(), n = this.gridMain.options(), r = s.currentFields.filter((f) => !f.hidden && !f.$isAside), o = e.includeRowNumber === !1 ? void 0 : s.currentFields.find((f) => f.name === ge && !f.hidden), l = o ? [o, ...r] : r, c = this.createPdfCellStyleResolver(l, r), d = new t();
    let h;
    try {
      const f = i(
        {
          fields: r,
          lineNumberField: o,
          lineNumberStart: (u = n.footer.paging) != null && u.enabled ? (s.paging.page - 1) * s.paging.pageSize : 0,
          viewItems: s.dataManager instanceof Oe && e.includeCollapsed !== !1 ? s.dataManager.getAllTreeViewItems() : s.dataManager.getViewItems(),
          groupingFields: n.groupingFields ?? [],
          sumFields: n.sumFields ?? [],
          getRowItem: (g) => s.dataManager.getRowItem(g),
          getCellStyles: c.getCellStyles,
          getHeaderCellBorders: c.getHeaderCellBorders,
          getHeaderCellStyles: c.getHeaderCellStyles,
          rowHeight: s.rowHeight,
          getCellCharts: (g) => g.groupRowType ? r.map(() => {
          }) : r.map((m) => this.getPdfCellChart(m, s.dataManager.getRowItem(g.id)))
        },
        e.mergeCells === !1 ? [] : n.rowSpanFields ?? []
      );
      f.headerRows = wi(n.fields, l, f), h = d.convert(f, e);
    } finally {
      c.destroy();
    }
    return d.download(h, e.fileName), h;
  }
  createPdfCellStyleResolver(e, t) {
    const i = this.gridMain.config(), s = this.gridMain.options(), n = i.dataManager.getViewItems(), r = this.gridMain.element().getElement(), o = (...g) => g.map((m) => window.getComputedStyle(m).backgroundColor).find((m) => m && m !== "transparent" && m !== "rgba(0, 0, 0, 0)"), l = r.querySelector(".dg-body"), c = (g) => {
      var m;
      for (let p = g; p && r.contains(p); p = p.parentElement) {
        const w = window.getComputedStyle(p), I = (m = w.backgroundImage) != null && m.startsWith("linear-gradient(") ? w.backgroundImage.match(/rgba?\([^)]+\)/g) : void 0;
        if ((I == null ? void 0 : I.length) === 2) return { startColor: I[0], endColor: I[1] };
        if (o(p)) return;
      }
    }, d = (l == null ? void 0 : l.querySelector('.dg-region[data-region="center"] .dg-body-table tbody')) ?? (l == null ? void 0 : l.querySelector(".dg-body-table tbody"));
    if (!l || !d)
      throw new Error("Unable to resolve grid cell styles for PDF export");
    const h = document.createElement("tr");
    h.className = "dg-row", h.style.visibility = "hidden", h.style.height = "0", h.setAttribute("aria-hidden", "true");
    const u = e.map(() => {
      const g = document.createElement("td");
      return g.className = "dg-cell", h.appendChild(g), g;
    });
    d.appendChild(h);
    const f = e.map((g) => {
      const m = i.fieldHeaderGroup.leafLeft.includes(g) ? "left" : i.fieldHeaderGroup.leafRight.includes(g) ? "right" : "center";
      return r.querySelector(
        `.dg-header .dg-region[data-region="${m}"] [data-header-cell-position="${g.$resizeIdx}"]`
      ) ?? void 0;
    });
    return {
      tableBorders: this.getPdfCellBorders(r.querySelector(".dg-main") ?? r),
      getCellStyles: (g, m) => {
        const p = ["dg-row"];
        g.groupRowType && p.push(
          "dg-group-row",
          g.groupRowType === "group" ? "dg-group-header" : g.groupRowType === "groupSummary" ? "dg-group-summary" : "dg-grand-summary"
        ), h.className = p.join(" ");
        const w = g.groupRowType ? void 0 : i.dataManager.getRowItem(g.id), I = window.getComputedStyle(h).backgroundColor;
        let y;
        if (!g.groupRowType && m > 0)
          for (let C = m - 1; C >= 0; C--) {
            const b = n[C];
            if (b && !b.groupRowType) {
              y = i.dataManager.getRowItem(b.id);
              break;
            }
          }
        const x = e.map((C, b) => {
          const S = u[b], v = ["dg-cell"];
          if (C.name === ge && v.push("dg-aside", "dg-line-number"), g.groupRowType)
            v.push("dg-group-cell");
          else if (w) {
            C.cellClassName && t.includes(C) && v.push(
              ...Ke(C.cellClassName, {
                rowIdx: m,
                col: C.$colSeq,
                field: C,
                item: w
              })
            );
            const B = (s.groupingFields ?? []).indexOf(C.name);
            B >= 0 && y !== void 0 && (s.groupingFields ?? []).slice(0, B + 1).every((X) => Object.is(w[X], y == null ? void 0 : y[X])) && m < n.length - 1 && v.push("dg-group-continuation");
          }
          S.className = v.join(" ");
          const V = window.getComputedStyle(S).backgroundColor;
          return { background: V && V !== "transparent" && V !== "rgba(0, 0, 0, 0)" ? V : I && I !== "transparent" && I !== "rgba(0, 0, 0, 0)" ? I : o(l, r), borders: this.getPdfCellBorders(S), textColor: window.getComputedStyle(S).color };
        }), E = x.map((C) => C.background), M = x.map((C) => C.borders);
        return { backgrounds: E, borders: M, textColors: x.map((C) => C.textColor || void 0) };
      },
      getHeaderCellBorders: () => f.map((g) => g ? this.getPdfCellBorders(g) : void 0),
      getHeaderCellStyles: () => ({
        gradients: f.map((g) => g ? c(g) : void 0),
        backgrounds: f.map(
          (g) => g ? o(g, g.parentElement ?? r, r) : void 0
        ),
        borders: f.map((g) => g ? this.getPdfCellBorders(g) : void 0),
        textColors: f.map((g) => g && window.getComputedStyle(g).color || void 0)
      }),
      destroy: () => h.remove()
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
    var n, r;
    const i = e.renderer.type, s = e.$renderer.getValue(t);
    if (i === "bar" && e.$renderer instanceof Ui) {
      const o = e.$renderer.getRefValue(s, t), l = Number((o == null ? void 0 : o.percent) ?? s);
      if (!Number.isFinite(l))
        return;
      const c = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue("--bar-positive-bg").trim(), d = window.getComputedStyle(this.gridMain.element().getElement()).getPropertyValue("--bar-negative-bg").trim();
      return {
        type: "bar",
        value: l,
        minimum: ((n = e.renderer.rule) == null ? void 0 : n.minimum) ?? 0,
        maximum: ((r = e.renderer.rule) == null ? void 0 : r.maximum) ?? 100,
        label: Le((o == null ? void 0 : o.label) ?? s),
        color: l < 0 ? d || "#ff8989" : c || "#77c0fc"
      };
    }
    if (i === "sparkline" && e.$renderer instanceof Xi || i === "sparklineBar" && e.$renderer instanceof ji) {
      const o = e.$renderer.getRefValue(s, t), l = (o == null ? void 0 : o.value) ?? s;
      return !Array.isArray(l) || !l.every((c) => typeof c == "number" && Number.isFinite(c)) ? void 0 : { type: i, values: [...l] };
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
  static setIcons(e) {
    Object.assign(le, e);
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
ht.VERSION = "0.0.20";
let yi = ht;
export {
  yi as D,
  Br as G,
  Pr as S,
  Wr as g,
  Le as n
};
//# sourceMappingURL=index-Dr_a9YvP.mjs.map
