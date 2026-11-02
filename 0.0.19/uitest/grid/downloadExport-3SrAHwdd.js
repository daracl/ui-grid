"use strict";function a(c,d,r,t){const n=URL.createObjectURL(c),e=document.createElement("a"),o=d.trim()||r;e.href=n,e.download=o.toLowerCase().endsWith(`.${t}`)?o:`${o}.${t}`,e.style.display="none";try{document.body.appendChild(e),e.click()}finally{e.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e4)}}exports.downloadExport=a;
//# sourceMappingURL=downloadExport-3SrAHwdd.js.map
