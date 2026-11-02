function r(c, a, d, t) {
  const n = URL.createObjectURL(c), e = document.createElement("a"), o = a.trim() || d;
  e.href = n, e.download = o.toLowerCase().endsWith(`.${t}`) ? o : `${o}.${t}`, e.style.display = "none";
  try {
    document.body.appendChild(e), e.click();
  } finally {
    e.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e4);
  }
}
export {
  r as d
};
//# sourceMappingURL=downloadExport-zXkclMbq.mjs.map
