/**
 * UUID v4를 생성합니다. 기본값은 하이픈 없는 32자리입니다.
 *
 * @param dashRemoveFlag false이면 하이픈을 포함한 36자리를 반환합니다.
 * @returns UUID 문자열
 */
export declare function uuid(dashRemoveFlag?: boolean | undefined): string;
/** 하이픈 없는 UUID v4를 생성합니다. crypto 미지원 환경에서는 Math.random을 사용합니다. */
export declare function createUuid(): string;
