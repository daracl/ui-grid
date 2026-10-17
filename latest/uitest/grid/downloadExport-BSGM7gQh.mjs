function downloadExport(blob, fileName, defaultFileName, extension) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const name = fileName.trim() || defaultFileName;
  anchor.href = url;
  anchor.download = name.toLowerCase().endsWith(`.${extension}`) ? name : `${name}.${extension}`;
  anchor.style.display = "none";
  try {
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
export {
  downloadExport as d
};
//# sourceMappingURL=downloadExport-BSGM7gQh.mjs.map
