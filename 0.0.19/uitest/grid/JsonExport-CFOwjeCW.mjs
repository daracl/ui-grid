/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
import { g as p } from "./index-Dr_a9YvP.mjs";
import { d as i } from "./downloadExport-BTOtQUXd.mjs";
class u {
  convert(t, e = {}) {
    const r = e.space ?? 2;
    if (!Number.isInteger(r) || r < 0 || r > 10)
      throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");
    return new Blob([JSON.stringify(t, null, r)], { type: "application/json;charset=utf-8" });
  }
  download(t, e = "export.json") {
    i(t, e, "export.json", "json");
  }
}
function c(o, t = {}) {
  return o.viewItems.filter((e) => !e.groupRowType).map((e) => {
    const r = o.getRowItem(e.id), n = t.useFormatter ? p(o.fields, r) : void 0;
    return Object.fromEntries(
      o.fields.map((s, a) => [s.name, n ? n[a] : r[s.name] ?? null])
    );
  });
}
export {
  u as JsonConverter,
  c as createJsonData
};
//# sourceMappingURL=JsonExport-CFOwjeCW.mjs.map
