/**
 * 일반 객체와 null prototype 객체인지 확인합니다. 다른 iframe의 일반 객체도 포함합니다.
 * 사용자 정의 프로토타입과 클래스 인스턴스는 제외하며 Symbol.toStringTag는 조회하지 않습니다.
 *
 * @param value - 확인할 값
 * @returns 순수 객체이면 true, 그렇지 않으면 false
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
