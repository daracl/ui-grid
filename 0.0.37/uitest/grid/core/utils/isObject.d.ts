/**
 * 주어진 값이 객체인지 확인하는 함수
 *
 * `typeof` 가 "object" 또는 "function" 이고 null 이 아니면 true 입니다. 배열·Date·Map·함수·클래스 인스턴스도 포함하므로
 * 일반 객체만 구분하려면 isPlainObject, 배열은 isArray, 함수는 isFunction 을 사용하세요.
 *
 * @param value - 확인할 값
 * @returns 객체(배열·함수 포함)이면 true, 그렇지 않으면 false
 */
export declare function isObject(value: any): boolean;
