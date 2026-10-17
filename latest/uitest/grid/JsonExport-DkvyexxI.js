"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-B5B90UkQ.js");
const downloadExport = require("./downloadExport-CiewKGwZ.js");
class JsonConverter {
  convert(rows, options = {}) {
    const space = options.space ?? 2;
    if (!Number.isInteger(space) || space < 0 || space > 10) {
      throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");
    }
    return new Blob([JSON.stringify(rows, null, space)], { type: "application/json;charset=utf-8" });
  }
  download(blob, fileName = "export.json") {
    downloadExport.downloadExport(blob, fileName, "export.json", "json");
  }
}
function createJsonData(context, options = {}) {
  return context.viewItems.filter((viewItem) => !viewItem.groupRowType).map((viewItem) => {
    const item = context.getRowItem(viewItem.id);
    const formatted = options.useFormatter ? index.getExportCellValues(context.fields, item) : void 0;
    return Object.fromEntries(
      context.fields.map((field, column) => [field.name, formatted ? formatted[column] : item[field.name] ?? null])
    );
  });
}
exports.JsonConverter = JsonConverter;
exports.createJsonData = createJsonData;
//# sourceMappingURL=JsonExport-DkvyexxI.js.map
