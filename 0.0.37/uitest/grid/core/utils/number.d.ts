/** 천 단위 쉼표를 허용해 숫자로 변환합니다. 빈 값·비유한 값·숫자 형식이 아닌 문자열(0x10, 1,2,3 등)은 null입니다. */
export declare function toNumber(value: unknown): number | null;
/** 값을 10진수 정수로 해석합니다. 변환할 수 없으면 NaN입니다. */
export declare function intValue(value: unknown): number;
/** 값을 최솟값과 최댓값 사이로 제한합니다. */
export declare function clamp(value: number, min: number, max: number): number;
/** 0,0.00 같은 패턴으로 숫자를 표시합니다. #도 고정 소수 자릿수입니다. */
export declare function formatNumber(value: number, pattern: string): string;
/** Date·숫자·날짜 문자열을 timestamp로 변환합니다. 실패하면 null입니다. */
export declare function toTimestamp(value: unknown): number | null;
