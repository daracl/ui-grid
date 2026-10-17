import { d as downloadExport } from "./downloadExport-BSGM7gQh.mjs";
import { G as GroupPdfRenderer, S as SimplePdfRenderer } from "./index-Drfruday.mjs";
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
//# sourceMappingURL=ExcelExport-8otpXeFZ.mjs.map
