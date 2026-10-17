/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("./index-CvHAVtKE.js"),l=require("./downloadExport-CNqx1BbA.js");class p{convert(t,e={}){const r=e.space??2;if(!Number.isInteger(r)||r<0||r>10)throw new RangeError("JSON space는 0부터 10까지의 정수여야 합니다.");return new Blob([JSON.stringify(t,null,r)],{type:"application/json;charset=utf-8"})}download(t,e="export.json"){l.downloadExport(t,e,"export.json","json")}}function u(o,t={}){return o.viewItems.filter(e=>!e.groupRowType).map(e=>{const r=o.getRowItem(e.id),n=t.useFormatter?i.getExportCellValues(o.fields,r):void 0;return Object.fromEntries(o.fields.map((s,a)=>[s.name,n?n[a]:r[s.name]??null]))})}exports.JsonConverter=p;exports.createJsonData=u;
//# sourceMappingURL=JsonExport-B8s_Olie.js.map
