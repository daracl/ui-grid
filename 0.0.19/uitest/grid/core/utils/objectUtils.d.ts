/** JSON 직렬화 규칙으로 복사합니다. undefined 자체는 그대로 반환합니다. */
export declare function cloneJson<T>(value: T): T;
/** 함수는 보존하고 객체·배열의 undefined는 제외하는 설정 복사입니다. */
export declare function cloneConfig<T>(value: T): T;
/** JSON 문자열 기준으로 값을 비교합니다. 객체 키 순서도 비교에 포함됩니다. */
export declare function jsonEqual(a: unknown, b: unknown): boolean;
/** 객체·배열은 내용, 함수는 참조로 비교합니다. 누락된 키와 undefined는 동일하게 봅니다. */
export declare function sameValue(a: unknown, b: unknown): boolean;
/** JSON 객체 문자열을 해석합니다. 잘못된 문자열은 빈 객체로 처리합니다. */
export declare function parseConfigString(value: unknown): unknown;
/** boolean 축약 옵션을 enabled 객체로 바꾸며 객체 옵션은 core deepCopy로 복사합니다. */
export declare function toOptionObject<T extends object>(value: boolean | T | undefined): Partial<T> & {
    enabled?: boolean;
};
