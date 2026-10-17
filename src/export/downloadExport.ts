/** 다운로드 링크와 Object URL은 성공·실패 여부와 관계없이 정리한다. */
export function downloadExport(blob: Blob, fileName: string, defaultFileName: string, extension: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const name = fileName.trim() || defaultFileName;
  anchor.href = url;
  anchor.download = name.toLowerCase().endsWith(`.${extension}`) ? name : `${name}.${extension}`;
  anchor.style.display = 'none';
  try {
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
