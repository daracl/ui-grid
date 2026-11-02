import { d as K } from "./downloadExport-zXkclMbq.mjs";
import { G as q, S as J } from "./index-DXJq1JXI.mjs";
function U(l) {
  let t = "";
  for (let i = l + 1; i > 0; i = Math.floor((i - 1) / 26))
    t = String.fromCharCode(65 + (i - 1) % 26) + t;
  return t;
}
function se(l, t = []) {
  const c = (l.groupingFields.length ? new q(l) : new J(l)).render(), s = l.lineNumberField ? 1 : 0, $ = l.fields.some((n) => n.renderer?.type === "tree"), y = l.viewItems.map((n) => Math.max(0, Math.floor(n.depth ?? 0))), e = $ ? l.viewItems.map((n, w) => [
    ...s ? [0] : [],
    ...l.fields.map((x) => x.renderer?.type === "tree" ? Math.min(250, y[w]) : 0)
  ]) : void 0, b = c.rows.map((n, w) => {
    const x = [...n], h = l.viewItems[w];
    return s && (x[0] = (l.lineNumberStart ?? 0) + w + 1), l.fields.forEach((u, F) => {
      if (h.groupRowType) {
        const f = h.groupSums?.[u.name];
        f !== void 0 && l.summaryFieldNames.includes(u.name) && n[F + s] === String(f) && (x[F + s] = f);
      } else if (!u.displayFormat && ["text", "number"].includes(u.renderer?.type ?? "text")) {
        const f = u.$renderer.getValue(l.getRowItem(h.id));
        (typeof f == "number" && Number.isFinite(f) || typeof f == "boolean") && n[F + s] === String(f) && (x[F + s] = f);
      }
    }), x;
  }), m = [];
  return c.cellCharts?.forEach(
    (n, w) => n.forEach((x, h) => {
      x && (b[w][h] = "");
    })
  ), t.forEach((n, w) => {
    const x = l.fields.findIndex((h) => h.name === n);
    if (!(x < 0))
      for (let h = 0; h < l.viewItems.length; ) {
        const u = l.viewItems[h];
        if (u.groupRowType) {
          h++;
          continue;
        }
        const F = l.getRowItem(u.id);
        let f = h + 1;
        for (; f < l.viewItems.length && !l.viewItems[f].groupRowType && t.slice(0, w + 1).every((P) => Object.is(F[P], l.getRowItem(l.viewItems[f].id)[P])); )
          f++;
        if (f - h > 1) {
          const P = U(x + s);
          m.push(`${P}${h + 2}:${P}${f + 1}`);
          for (let C = h + 1; C < f; C++)
            b[C][x + s] = "", c.cellCharts?.[C] && (c.cellCharts[C][x + s] = void 0);
        }
        h = f;
      }
  }), {
    ...c,
    rows: b,
    merges: m,
    cellIndents: e,
    outlineLevels: $ ? y.map((n) => Math.min(7, n)) : void 0,
    rowHeight: l.rowHeight
  };
}
const z = new TextEncoder(), Q = Uint32Array.from({ length: 256 }, (l, t) => {
  let i = t;
  for (let c = 0; c < 8; c++) i = i >>> 1 ^ (i & 1 ? 3988292384 : 0);
  return i >>> 0;
});
function Y(l) {
  const t = Object.entries(l).map(([m, n]) => ({
    name: z.encode(m),
    data: z.encode(n)
  })), i = t.reduce((m, n) => m + n.data.length + n.name.length * 2 + 76, 22);
  if (t.length > 65535 || i > 4294967295) throw new RangeError("XLSX exceeds ZIP32 limits");
  const c = new Uint8Array(i), s = new DataView(c.buffer), $ = [], y = [];
  let e = 0;
  for (const m of t) {
    let n = 4294967295;
    for (const w of m.data) n = n >>> 8 ^ Q[(n ^ w) & 255];
    n = (n ^ 4294967295) >>> 0, $.push(e), y.push(n), s.setUint32(e, 67324752, !0), s.setUint16(e + 4, 20, !0), s.setUint16(e + 6, 2048, !0), s.setUint16(e + 12, 33, !0), s.setUint32(e + 14, n, !0), s.setUint32(e + 18, m.data.length, !0), s.setUint32(e + 22, m.data.length, !0), s.setUint16(e + 26, m.name.length, !0), c.set(m.name, e + 30), c.set(m.data, e + 30 + m.name.length), e += 30 + m.name.length + m.data.length;
  }
  const b = e;
  return t.forEach((m, n) => {
    s.setUint32(e, 33639248, !0), s.setUint16(e + 4, 20, !0), s.setUint16(e + 6, 20, !0), s.setUint16(e + 8, 2048, !0), s.setUint16(e + 14, 33, !0), s.setUint32(e + 16, y[n], !0), s.setUint32(e + 20, m.data.length, !0), s.setUint32(e + 24, m.data.length, !0), s.setUint16(e + 28, m.name.length, !0), s.setUint32(e + 42, $[n], !0), c.set(m.name, e + 46), e += 46 + m.name.length;
  }), s.setUint32(e, 101010256, !0), s.setUint16(e + 8, t.length, !0), s.setUint16(e + 10, t.length, !0), s.setUint32(e + 12, e - b, !0), s.setUint32(e + 16, b, !0), c;
}
function ee(l, t, i, c = 1) {
  const s = [];
  let $ = 1;
  const y = (b, m = "FF222222") => t(b, m).slice(2), e = (b) => Math.round(b);
  return l.cellCharts?.forEach(
    (b, m) => b.forEach((n, w) => {
      if (!n || !l.columns[w]) return;
      const x = Math.max(12, l.columns[w].width ?? 100), h = Math.max(12, l.rowHeight ?? 26), u = x - 8, F = h - 8, f = [], P = (p, g, v, I) => `<a:xfrm><a:off x="${e(p)}" y="${e(g)}"/><a:ext cx="${Math.max(1, e(v))}" cy="${Math.max(
        1,
        e(I)
      )}"/></a:xfrm>`, C = (p, g, v, I, S, r) => {
        f.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${$++}" name="${p} ${$}"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${P(
            g,
            v,
            I,
            S
          )}<a:prstGeom prst="${p}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${r}"/></a:solidFill><a:ln><a:noFill/></a:ln></xdr:spPr></xdr:sp>`
        );
      };
      if (n.type === "bar") {
        if (![n.value, n.minimum, n.maximum].every(Number.isFinite)) return;
        const p = Math.min(n.minimum, n.maximum), g = Math.max(n.minimum, n.maximum), v = g - p || 1, I = Math.max(p, Math.min(g, n.value)), S = p < 0 && g > 0 ? -p / v * u : p >= 0 ? 0 : u, r = p < 0 && g > 0 ? Math.abs(I) / v * u : p >= 0 ? (I - p) / v * u : Math.abs(I - g) / v * u;
        r > 0 && C("rect", 4 + S - (p < 0 && I < 0 || g <= 0 ? r : 0), 4, r, F, y(n.color));
        const o = y(l.cellTextColors?.[m]?.[w]);
        f.push(
          `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${$++}" name="Bar label"/><xdr:cNvSpPr txBox="1"/></xdr:nvSpPr><xdr:spPr>${P(
            0,
            0,
            x,
            h
          )}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></xdr:spPr><xdr:txBody><a:bodyPr wrap="none" anchor="ctr" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="ko-KR" sz="900"><a:solidFill><a:srgbClr val="${o}"/></a:solidFill><a:latin typeface="Calibri"/></a:rPr><a:t>${i(
            n.label
          )}</a:t></a:r><a:endParaRPr lang="ko-KR"/></a:p></xdr:txBody></xdr:sp>`
        );
      } else {
        const p = n.values;
        if (!p.length || !p.every(Number.isFinite)) return;
        let g = 1 / 0, v = -1 / 0;
        for (const r of p)
          g = Math.min(g, r), v = Math.max(v, r);
        const I = v - g || 1, S = (r, o) => r === v ? "28A745" : r === g ? "DC3545" : o === 0 || o === p.length - 1 ? "0000FF" : "FF9900";
        if (n.type === "sparklineBar") {
          const r = u / p.length;
          p.forEach((o, a) => {
            const d = (o - g) / I * F;
            d > 0 && C(
              "rect",
              4 + a * r + Math.min(1, r / 4),
              4 + F - d,
              Math.max(0.5, r - 2),
              d,
              S(o, a)
            );
          });
        } else {
          const r = p.map((a, d) => ({
            x: 4 + (p.length > 1 ? d / (p.length - 1) * u : u / 2),
            y: 4 + (1 - (a - g) / I) * F
          })), o = r.map(
            (a, d) => `<a:${d ? "lnTo" : "moveTo"}><a:pt x="${e(a.x)}" y="${e(a.y)}"/></a:${d ? "lnTo" : "moveTo"}>`
          ).join("");
          f.push(
            `<xdr:sp><xdr:nvSpPr><xdr:cNvPr id="${$++}" name="Sparkline"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>${P(
              0,
              0,
              x,
              h
            )}<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="${e(
              x
            )}" h="${e(
              h
            )}" fill="none">${o}</a:path></a:pathLst></a:custGeom><a:noFill/><a:ln w="7144"><a:solidFill><a:srgbClr val="007ACC"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>`
          ), r.forEach(
            (a, d) => C("ellipse", a.x - 1.875, a.y - 1.875, 3.75, 3.75, S(p[d], d))
          );
        }
      }
      f.length && s.push(
        `<xdr:twoCellAnchor editAs="oneCell"><xdr:from><xdr:col>${w}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${m + c}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${w + 1}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${m + c + 1}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:grpSp><xdr:nvGrpSpPr><xdr:cNvPr id="${$++}" name="Cell chart ${m + c + 1}-${w + 1}"/><xdr:cNvGrpSpPr/></xdr:nvGrpSpPr><xdr:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${e(
          x * 9525
        )}" cy="${e(h * 9525)}"/><a:chOff x="0" y="0"/><a:chExt cx="${e(x)}" cy="${e(
          h
        )}"/></a:xfrm></xdr:grpSpPr>${f.join("")}</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>`
      );
    })
  ), s.length ? `<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${s.join(
    ""
  )}</xdr:wsDr>` : void 0;
}
const te = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", D = "http://schemas.openxmlformats.org/spreadsheetml/2006/main", R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships", j = (l) => Array.from(l).filter((t) => {
  const i = t.codePointAt(0);
  return i === 9 || i === 10 || i === 13 || i >= 32 && i <= 55295 || i >= 57344 && i <= 65533 || i >= 65536;
}).join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function N(l, t) {
  if (!l) return t;
  const i = l.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (i) return "FF" + (i[1].length === 3 ? [...i[1]].map((e) => e + e).join("") : i[1]).toUpperCase();
  const c = l.match(/^rgba?\(([^)]+)\)$/i);
  if (!c) return t;
  const s = c[1].split(/[,\s/]+/).filter(Boolean), $ = s[3] === void 0 ? 1 : Math.min(1, Math.max(0, parseFloat(s[3]) / (s[3].endsWith("%") ? 100 : 1))), y = s.slice(0, 3).map((e) => Math.max(0, Math.min(255, parseFloat(e) * (e.endsWith("%") ? 2.55 : 1))));
  return y.length !== 3 || y.some((e) => !Number.isFinite(e)) || !Number.isFinite($) ? t : "FF" + y.map(
    (e) => Math.round(e * $ + 255 * (1 - $)).toString(16).padStart(2, "0")
  ).join("").toUpperCase();
}
class oe {
  convert(t, i = {}) {
    const c = t.headerRows?.length || 1;
    if (!t.columns.length || t.columns.length > 16384 || t.rows.length + c > 1048576)
      throw new RangeError("Invalid XLSX worksheet dimensions");
    const s = i.sheetName ?? "Grid";
    if (!s.trim() || s.length > 31 || /[\\/*?:[\]]/.test(s) || /^'|'$/.test(s))
      throw new Error("Invalid Excel sheet name");
    const $ = ['<font><sz val="11"/><color rgb="FF222222"/><name val="Calibri"/></font>'], y = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>'
    ], e = ["<border><left/><right/><top/><bottom/><diagonal/></border>"], b = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'], m = /* @__PURE__ */ new Map(), n = (r, o) => {
      const a = r.indexOf(o);
      return a >= 0 ? a : (r.push(o), r.length - 1);
    }, w = (r, o, a, d) => {
      const k = N(
        r ? d?.textColor ?? t.headerTextColors?.[o] : t.cellTextColors?.[a]?.[o],
        "FF222222"
      ), M = r ? d?.background ?? t.headerBackgrounds?.[o] ?? "#e9edf2" : t.cellBackgrounds?.[a]?.[o], E = r ? d?.gradient ?? t.headerGradients?.[o] : void 0, A = (r ? d?.borders ?? t.headerCellBorders?.[o] : t.cellBorders?.[a]?.[o]) ?? {
        right: { color: "#cdcdcd", width: 1 },
        bottom: { color: "#cdcdcd", width: 1 }
      }, L = r ? 0 : Math.max(0, Math.min(250, Math.floor(t.cellIndents?.[a]?.[o] ?? 0))), B = L ? "left" : r ? "center" : t.columns[o].align ?? "left", G = JSON.stringify([r, k, M, E, A, B, L]), _ = m.get(G);
      if (_ !== void 0) return _;
      const X = n(
        $,
        `<font><sz val="11"/><color rgb="${k}"/><name val="Calibri"/>${r ? "<b/>" : ""}</font>`
      ), V = E ? n(
        y,
        `<fill><gradientFill degree="90"><stop position="0"><color rgb="${N(
          E.startColor,
          "FFFFFFFF"
        )}"/></stop><stop position="1"><color rgb="${N(
          E.endColor,
          "FFF1F1F1"
        )}"/></stop></gradientFill></fill>`
      ) : M ? n(
        y,
        `<fill><patternFill patternType="solid"><fgColor rgb="${N(
          M,
          "FFFFFFFF"
        )}"/><bgColor indexed="64"/></patternFill></fill>`
      ) : 0, W = n(
        e,
        "<border>" + ["left", "right", "top", "bottom"].map((O) => {
          const T = A[O];
          if (!T || !Number.isFinite(T.width) || T.width <= 0) return `<${O}/>`;
          const Z = T.style === "dashed" || T.style === "dotted" || T.style === "double" ? T.style : T.width >= 3 ? "thick" : T.width >= 2 ? "medium" : "thin";
          return `<${O} style="${Z}"><color rgb="${N(T.color, "FFCDCDCD")}"/></${O}>`;
        }).join("") + "<diagonal/></border>"
      ), H = b.length;
      return b.push(
        `<xf numFmtId="0" fontId="${X}" fillId="${V}" borderId="${W}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="${B}" vertical="center" wrapText="1"${L ? ` indent="${L}"` : ""}/></xf>`
      ), m.set(G, H), H;
    }, x = (r, o, a) => {
      const d = `${U(a)}${o + 1}`, k = `r="${d}" s="${w(
        o < c,
        a,
        o - c,
        u[o]?.[a]
      )}"`;
      if (typeof r == "number" && Number.isFinite(r)) return `<c ${k}><v>${r}</v></c>`;
      if (typeof r == "boolean") return `<c ${k} t="b"><v>${r ? 1 : 0}</v></c>`;
      const M = String(r ?? "");
      if (M.length > 32767) throw new RangeError(`Excel cell ${d} exceeds 32767 characters`);
      return `<c ${k} t="inlineStr"><is><t xml:space="preserve">${j(M)}</t></is></c>`;
    }, h = Array.from({ length: c }, () => t.columns.map(() => "")), u = Array.from({ length: c }, () => []), F = [];
    t.headerRows?.length ? t.headerRows.forEach(
      (r, o) => r.forEach((a) => {
        h[o][a.column] = a.label;
        for (let d = o; d < o + a.rowSpan; d++)
          for (let k = a.column; k < a.column + a.colSpan; k++) u[d][k] = a;
        (a.rowSpan > 1 || a.colSpan > 1) && F.push(
          `${U(a.column)}${o + 1}:${U(a.column + a.colSpan - 1)}${o + a.rowSpan}`
        );
      })
    ) : h[0] = t.columns.map((r) => r.label ?? "");
    const f = Math.max(12, t.rowHeight ?? 26) * 0.75, P = [...h, ...t.rows].map(
      (r, o) => `<row r="${o + 1}" ht="${f}" customHeight="1"${o >= c && t.outlineLevels ? ` outlineLevel="${t.outlineLevels[o - c]}"` : ""}>${t.columns.map((a, d) => x(r[d] ?? "", o, d)).join("")}</row>`
    ).join(""), C = `${U(t.columns.length - 1)}${t.rows.length + c}`, p = i.mergeCells === !1 ? [] : [
      ...F,
      ...t.merges.map(
        (r) => r.replace(/([A-Z]+)(\d+)/g, (o, a, d) => `${a}${Number(d) + c - 1}`)
      )
    ], g = ee(t, N, j, c), v = t.outlineLevels?.reduce((r, o) => Math.max(r, o), 0) ?? 0, I = `<worksheet xmlns="${D}" xmlns:r="${R}">${t.outlineLevels ? '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' : ""}<dimension ref="A1:${C}"/><sheetViews><sheetView workbookViewId="0">${i.freezeHeader === !1 ? "" : `<pane ySplit="${c}" topLeftCell="A${c + 1}" activePane="bottomLeft" state="frozen"/>`}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="${f}"${v ? ` outlineLevelRow="${v}"` : ""}/><cols>${t.columns.map(
      (r, o) => `<col min="${o + 1}" max="${o + 1}" width="${Math.min(
        255,
        Math.max(1, ((r.width ?? 100) - 5) / 7)
      ).toFixed(2)}" customWidth="1"/>`
    ).join("")}</cols><sheetData>${P}</sheetData>${i.autoFilter ? `<autoFilter ref="A${c}:${C}"/>` : ""}${p.length ? `<mergeCells count="${p.length}">${p.map((r) => `<mergeCell ref="${j(r)}"/>`).join("")}</mergeCells>` : ""}${g ? '<drawing r:id="rId1"/>' : ""}</worksheet>`, S = {
      "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      "xl/workbook.xml": `<workbook xmlns="${D}" xmlns:r="${R}"><sheets><sheet name="${j(
        s
      )}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${R}/styles" Target="styles.xml"/></Relationships>`,
      "xl/styles.xml": `<styleSheet xmlns="${D}"><fonts count="${$.length}">${$.join(
        ""
      )}</fonts><fills count="${y.length}">${y.join("")}</fills><borders count="${e.length}">${e.join(
        ""
      )}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${b.length}">${b.join(
        ""
      )}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
      "xl/worksheets/sheet1.xml": I
    };
    return g && (S["[Content_Types].xml"] = S["[Content_Types].xml"].replace(
      "</Types>",
      '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'
    ), S["xl/drawings/drawing1.xml"] = g, S["xl/worksheets/_rels/sheet1.xml.rels"] = `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`), new Blob([Y(S)], { type: te });
  }
  download(t, i = "grid-export.xlsx") {
    K(t, i, "grid-export.xlsx", "xlsx");
  }
}
export {
  oe as ExcelConverter,
  se as createExcelData
};
//# sourceMappingURL=ExcelExport-B3DYfdmT.mjs.map
