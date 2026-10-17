import { g as getExportCellValues } from "./index-Drfruday.mjs";
import { d as downloadExport } from "./downloadExport-BSGM7gQh.mjs";
class JsonConverter {
  convert(rows, options = {}) {
    const space = options.space ?? 2;
    if (!Number.isInteger(space) || space < 0 || space > 10) {
      throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");
    }
    return new Blob([JSON.stringify(rows, null, space)], { type: "application/json;charset=utf-8" });
  }
  download(blob, fileName = "export.json") {
    downloadExport(blob, fileName, "export.json", "json");
  }
}
function createJsonData(context, options = {}) {
  return context.viewItems.filter((viewItem) => !viewItem.groupRowType).map((viewItem) => {
    const item = context.getRowItem(viewItem.id);
    const formatted = options.useFormatter ? getExportCellValues(context.fields, item) : void 0;
    return Object.fromEntries(
      context.fields.map((field, column) => [field.name, formatted ? formatted[column] : item[field.name] ?? null])
    );
  });
}
export {
  JsonConverter,
  createJsonData
};
//# sourceMappingURL=JsonExport-COILbx4M.mjs.map
