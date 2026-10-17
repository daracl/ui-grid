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
export declare function formatNumber(value: number, format: string): string;
