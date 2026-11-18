/**
 * 문자열 메시지 포맷 변환
 *
 * - "{key}" 형태는 msgParam[key] 값으로 치환
 * - 단, "{key}" 앞에 "$" 또는 "\"가 있으면 치환하지 않고 그대로 유지
 *
 * @param msgFormat 포맷 문자열
 * @param msgParam 치환할 값이 담긴 객체. 생략하면 원문을 반환합니다.
 * @returns 치환된 문자열
 */
export declare function formatMessage(msgFormat: string, msgParam?: Record<string, unknown>): string;
