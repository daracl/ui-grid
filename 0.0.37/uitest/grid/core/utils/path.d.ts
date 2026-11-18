type PlainObject = Record<string, unknown>;
export interface SetInOptions {
    toObject?: (value: unknown) => PlainObject;
    prune?: boolean;
}
/** boolean·문자열 축약 옵션을 객체로 바꾸고 객체는 얕게 복사합니다. */
export declare function toObjectForm(value: unknown, stringKey?: string): PlainObject;
/** 중간 객체를 복사해 경로 값을 지정합니다. undefined는 삭제하며 위험 경로는 거부합니다. */
export declare function setIn(target: PlainObject, path: readonly string[], value: unknown, options?: SetInOptions): void;
/** 객체의 own property 경로만 조회합니다. 위험 경로는 undefined입니다. */
export declare function getIn(target: unknown, path: readonly string[], toObject?: (value: unknown) => unknown): unknown;
/** 데이터 앞부분에서 등장 순서대로 중복 없는 필드 목록을 반환합니다. */
export declare function fieldsOf(rows: readonly unknown[] | null | undefined, limit?: number): string[];
/** label(field) 형식의 필드 표시 이름을 반환합니다. */
export declare function fieldDisplayName(field: string, label?: string): string;
export {};
