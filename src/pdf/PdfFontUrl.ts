const fontAssetPath = './assets/NotoSansKR-Regular.ttf';
const currentScriptUrl =
  typeof document === 'undefined' ? undefined : document.currentScript?.getAttribute('src') ?? undefined;

export function getKoreanFontUrl(): string {
  if (currentScriptUrl) {
    return new URL(fontAssetPath, currentScriptUrl).href;
  }

  if (import.meta.env.DEV) {
    return new URL('/assets/NotoSansKR-Regular.ttf', document.baseURI).href;
  }

  return new URL(fontAssetPath, import.meta.url).href;
}
