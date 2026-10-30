/** 다운로드가 시작될 시간을 주기 위해 Object URL을 해제하기까지 기다리는 시간 */
const REVOKE_DELAY_MS = 10_000;

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
    // 다운로드가 시작되기 전에 URL이 폐기되지 않도록 잠시 뒤에 해제한다.
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
  }
}
