/*!
* @daracl/grid v0.0.20
* Copyright 2023-2026 darainfo;
* Licensed MIT
*/
"use strict";function a(c,d,r,t){const n=URL.createObjectURL(c),e=document.createElement("a"),o=d.trim()||r;e.href=n,e.download=o.toLowerCase().endsWith(`.${t}`)?o:`${o}.${t}`,e.style.display="none";try{document.body.appendChild(e),e.click()}finally{e.remove(),setTimeout(()=>URL.revokeObjectURL(n),0)}}exports.downloadExport=a;
//# sourceMappingURL=downloadExport-CNqx1BbA.js.map
