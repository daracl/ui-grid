/**
 * 주어진 값이 함수인지 확인하는 함수
 * 제네릭 T의 인자·반환 타입은 검사하지 않으므로 호출자가 보장해야 합니다.
 *
 * @param value - 확인할 값
 * @returns 함수이면 true, 그렇지 않으면 false
 */
export declare function isFunction<T extends (...args: any[]) => unknown = (...args: any[]) => unknown>(value: unknown): value is T;
