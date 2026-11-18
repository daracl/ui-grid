/** null과 undefined는 동일하게, 나머지는 문자열 기준으로 비교합니다. */
export declare function isSameValue(a: unknown, b: unknown): boolean;
/** 기존 UI 프로젝트의 32비트 문자열 해시를 반환합니다. 빈 문자열은 0입니다. */
export declare function getHashCode(value: string): string | number;
/** camelCase를 snake_case로 변환합니다. */
export declare function camelToUnderscore(value: string): string;
/** camelCase를 kebab-case로 변환합니다. */
export declare function camelToKebab(value: string): string;
/** 문자열을 구분자로 나눕니다. */
export declare function stringSplit(value: string, delimiter: string): string[];
/** 기존 Grid 계약대로 값의 포함 여부를 토글하고 문자열 배열을 반환합니다. */
export declare function addValueIfMissing(currentValue: string, addValue: string | null, shouldSort?: boolean, delimiter?: string, originValues?: string[]): string[];
/** {{if(key)}}...{{/if}}와 {{key}}를 해석합니다. HTML 이스케이프는 하지 않습니다. */
export declare function renderTemplate(template: string, data: Record<string, unknown>): string;
/** CSS scope로 사용할 수 있는 식별자를 검증합니다. */
export declare function assertScope(scope: string): string;
/** 키를 data-* 속성 이름으로 바꾸며 잘못된 이름·예약 키는 제외합니다. */
export declare function toDataAttribute(key: string, reserved?: readonly string[]): string | undefined;
