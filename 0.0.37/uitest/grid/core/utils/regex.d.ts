/** 정규식 특수문자를 이스케이프해 리터럴로 검색할 수 있게 합니다. */
export declare function escapeRegExp(value: string): string;
/**
 * 정규식 소스를 검사해 정규식 검색을 적용할 수 있는 텍스트 길이 상한을 반환합니다.
 * 위험한 정규식(isRiskyRegex)이면 0 입니다. 호출자는 이보다 긴 텍스트는 리터럴로 검색해야 합니다.
 *
 * @param pattern 검사할 정규식 소스
 * @returns 정규식을 적용할 수 있는 최대 텍스트 길이
 */
export declare function maxRegexTextLength(pattern: string): number;
export declare function isRiskyRegex(pattern: string): boolean;
