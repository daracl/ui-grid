"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-B5B90UkQ.js");
const downloadExport = require("./downloadExport-CiewKGwZ.js");
class CsvConverter {
  serialize(headers, rows, options = {}) {
    const delimiter = options.delimiter ?? ",";
    const quote = options.quote ?? '"';
    const lineEnding = options.lineEnding ?? "\r\n";
    if (!delimiter || /[\r\n]/.test(delimiter) || !quote || Array.from(quote).length !== 1 || /[\r\n]/.test(quote) || delimiter.includes(quote)) {
      throw new RangeError("CSV delimiter 또는 quote 옵션이 올바르지 않습니다.");
    }
    if (!["\r\n", "\n", "\r"].includes(lineEnding)) throw new RangeError("CSV lineEnding 옵션이 올바르지 않습니다.");
    const cell = (value) => {
      let text = value == null ? options.nullValue ?? "" : index.normalizeExportValue(value);
      if (options.escapeFormula !== false && typeof value !== "number" && (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)))
        text = `'${text}`;
      return text.includes(delimiter) || text.includes(quote) || /[\r\n]/.test(text) ? quote + text.split(quote).join(quote + quote) + quote : text;
    };
    return [...options.includeHeader === false ? [] : [headers], ...rows].map((row) => row.map(cell).join(delimiter)).join(lineEnding);
  }
  convert(headers, rows, options = {}) {
    const encoding = options.encoding ?? "utf-8";
    if (encoding !== "utf-8" && encoding !== "utf-16le") throw new RangeError("지원하지 않는 CSV encoding입니다.");
    const text = (options.bom === false ? "" : "\uFEFF") + this.serialize(headers, rows, options);
    if (encoding === "utf-16le") {
      const bytes = new Uint8Array(text.length * 2);
      for (let index2 = 0; index2 < text.length; index2++) {
        bytes[index2 * 2] = text.charCodeAt(index2) & 255;
        bytes[index2 * 2 + 1] = text.charCodeAt(index2) >>> 8;
      }
      return new Blob([bytes], { type: `text/csv;charset=${encoding}` });
    }
    return new Blob([text], { type: `text/csv;charset=${encoding}` });
  }
  download(blob, fileName = "export.csv") {
    downloadExport.downloadExport(blob, fileName, "export.csv", "csv");
  }
}
function createCsvData(context, options = {}) {
  const viewItems = context.viewItems.filter((item) => !item.groupRowType);
  const useFormatter = options.useFormatter !== false;
  return {
    headers: context.fields.map((field) => field.label ?? field.name),
    rows: viewItems.map((viewItem) => {
      const item = context.getRowItem(viewItem.id);
      const formatted = useFormatter ? index.getExportCellValues(context.fields, item) : void 0;
      return context.fields.map((field, column) => {
        const value = item[field.name];
        if (value == null && (!formatted || !field.getValue && field.defaultValue == null))
          return options.nullValue ?? "";
        if (!formatted) return value;
        const display = formatted[column];
        return typeof value === "number" && display === String(value) ? value : display;
      });
    })
  };
}
exports.CsvConverter = CsvConverter;
exports.createCsvData = createCsvData;
//# sourceMappingURL=CsvExport-CX5zaYDi.js.map
