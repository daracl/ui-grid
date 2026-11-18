/** 첫 번째 일치 항목을 제거한 새 배열을 반환합니다. */
export declare function removeItem<T>(array: readonly T[], item: T): T[];
/** 배열의 지정 범위를 얕게 복사합니다. */
export declare function arrayCopy<T>(array: readonly T[], start?: number, end?: number): T[];
/** 원본 배열에 삽입하고 제한 길이 초과 시 앞의 항목을 제거합니다. */
export declare function insertToArray<T>(targetArray: T[], values: T | T[], isBefore?: boolean, rowIndex?: number, limit?: number): T[];
/** 원본 배열의 항목을 이동합니다. 유효하지 않은 인덱스는 무시합니다. */
export declare function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[];
/** 중복 없는 연속 정수 배열인지 검사합니다. 빈 배열은 false입니다. */
export declare function isSequential(array: readonly number[]): boolean;
/** 순서와 중복 개수를 고려해 비교하며, ignoreOrder이면 순서만 무시합니다. */
export declare function arrayEquals<T, U = T>(a: readonly T[], b: readonly T[], ignoreOrder?: boolean, selector?: (item: T) => U): boolean;
/** 배열은 그대로 반환하고 그 외 값은 구분자로 나눠 공백·빈 항목을 정리합니다. */
export declare function toListValue(value: unknown, delimiter?: string): unknown[];
