/**
 * 숫자를 주어진 포맷에 맞춰 문자열로 반환합니다.
 * - 숫자 포맷 문자는: 0, ,, . 만 사용합니다.
 * - 그 외 문자는 접두사/접미사로 그대로 유지됩니다 (예: "원", "%", "개", "$")
 * - % 기호는 계산 없이 단순 출력만 합니다.
 *
 * @param value - 포맷할 숫자 값
 * @param format - 포맷 문자열 (예: "0,0.00 원", "$0,0", "0.0%")
 * @returns 포맷된 문자열
 *
 * @example
 * formatNumber(1234567.89, "0,0.00 원"); // "1,234,567.89 원"
 * formatNumber(1234.5, "$0,0.0");        // "$1,234.5"
 * formatNumber(0.92, "확률: 0.0%");      // "확률: 0.9%"
 */
export function formatNumber(value: number, format: string): string {
  // 숫자 포맷 추출

  const numberPatternRegex = /[0,.]+/;
  const numberPatternMatch = numberPatternRegex.exec(format);
  if (!numberPatternMatch) return format;

  const numberPattern = numberPatternMatch[0];
  const prefix = format.slice(0, format.indexOf(numberPattern));
  const suffix = format.slice(format.indexOf(numberPattern) + numberPattern.length);

  const [intFmt, decFmt] = numberPattern.split('.');
  const useComma = intFmt.includes(',');

  let result = '';

  if (decFmt) {
    // 반올림한 소수점 문자열
    const rounded = value.toFixed(decFmt.length);
    const [intPart, decPart] = rounded.split('.');

    // 소수점 뒤 0 제거 (불필요한 자리 제거)
    const trimmedDec = decPart.replace(/0+$/, '');

    result = useComma ? addComma(intPart) : intPart;
    if (trimmedDec.length > 0) {
      result += '.' + trimmedDec;
    }
  } else {
    const rounded = Math.round(value).toString();
    result = useComma ? addComma(rounded) : rounded;
  }

  return `${prefix}${result}${suffix}`;
}

function addComma(numStr: string): string {
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
