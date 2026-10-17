/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
import { n as d, g as m } from "./index-Dr_a9YvP.mjs";
import { d as f } from "./downloadExport-BTOtQUXd.mjs";
class p {
  serialize(a, o, n = {}) {
    const t = n.delimiter ?? ",", e = n.quote ?? '"', s = n.lineEnding ?? `\r
`;
    if (!t || /[\r\n]/.test(t) || !e || Array.from(e).length !== 1 || /[\r\n]/.test(e) || t.includes(e))
      throw new RangeError("CSV delimiter 또는 quote 옵션이 올바르지 않습니다.");
    if (![`\r
`, `
`, "\r"].includes(s)) throw new RangeError("CSV lineEnding 옵션이 올바르지 않습니다.");
    const l = (i) => {
      let r = i == null ? n.nullValue ?? "" : d(i);
      return n.escapeFormula !== !1 && typeof i != "number" && (/^\s*[=+\-@]/.test(r) || /^[\t\r\n]/.test(r)) && (r = `'${r}`), r.includes(t) || r.includes(e) || /[\r\n]/.test(r) ? e + r.split(e).join(e + e) + e : r;
    };
    return [...n.includeHeader === !1 ? [] : [a], ...o].map((i) => i.map(l).join(t)).join(s);
  }
  convert(a, o, n = {}) {
    const t = n.encoding ?? "utf-8";
    if (t !== "utf-8" && t !== "utf-16le") throw new RangeError("지원하지 않는 CSV encoding입니다.");
    const e = (n.bom === !1 ? "" : "\uFEFF") + this.serialize(a, o, n);
    if (t === "utf-16le") {
      const s = new Uint8Array(e.length * 2);
      for (let l = 0; l < e.length; l++)
        s[l * 2] = e.charCodeAt(l) & 255, s[l * 2 + 1] = e.charCodeAt(l) >>> 8;
      return new Blob([s], { type: `text/csv;charset=${t}` });
    }
    return new Blob([e], { type: `text/csv;charset=${t}` });
  }
  download(a, o = "export.csv") {
    f(a, o, "export.csv", "csv");
  }
}
function h(u, a = {}) {
  const o = u.viewItems.filter((t) => !t.groupRowType), n = a.useFormatter !== !1;
  return {
    headers: u.fields.map((t) => t.label ?? t.name),
    rows: o.map((t) => {
      const e = u.getRowItem(t.id), s = n ? m(u.fields, e) : void 0;
      return u.fields.map((l, i) => {
        const r = e[l.name];
        if (r == null && (!s || !l.getValue && l.defaultValue == null))
          return a.nullValue ?? "";
        if (!s) return r;
        const c = s[i];
        return typeof r == "number" && c === String(r) ? r : c;
      });
    })
  };
}
export {
  p as CsvConverter,
  h as createCsvData
};
//# sourceMappingURL=CsvExport-BesYr38W.mjs.map
