export interface SortOption {
    field: string;
    direction: "asc" | "desc";
}
export interface SearchOptions {
    matchCase?: boolean;
    matchWholeWord?: boolean;
    useRegex?: boolean;
}
export interface DisplayFormat {
    type: "number" | "currency" | "date";
    format?: string;
    prefix?: string;
    suffix?: string;
    locale?: string;
}
export type SummaryExpression<T> = "sum" | "average" | "min" | "max" | "count" | ((rows: T[]) => unknown);
/** 숫자끼리는 숫자, 그 외에는 문자열로 비교합니다. nullsLast는 방향과 무관합니다. */
export declare function compareValues(a: unknown, b: unknown, ascending?: boolean, nullsLast?: boolean): number;
/** 복수 필드로 정렬한 새 배열을 반환합니다. 같은 값의 순서는 유지합니다. */
export declare function sortRows<T extends object>(rows: readonly T[], sorts: readonly SortOption[], nullsLast?: boolean): T[];
/**
 * 검색 함수를 만듭니다. 잘못되었거나 길이 200자를 넘거나 역추적 위험이 있는 정규식은 리터럴로 검색합니다.
 * 정규식 검색은 패턴의 반복 개수에 따른 텍스트 길이 상한(1~3개: 10000/1000/200자, 반복 없음: 10000자)을 넘는 텍스트에는 적용하지 않고 리터럴로 검색합니다.
 */
export declare function createMatcher(keyword: string, options?: SearchOptions): (text: string) => boolean;
/** 지정한 필드 중 하나라도 검색 조건과 일치하는지 검사합니다. */
export declare function matchRow(row: object, fields: readonly string[], matcher: (text: string) => boolean): boolean;
/** 텍스트를 이스케이프한 뒤 한 구간을 강조합니다. 강조 태그는 텍스트용 태그만 허용합니다. */
export declare function highlightSingleMatch(text: string, match: {
    start: number;
    end: number;
}, highlightTag?: string): string;
/** 로컬 시간 기준 YYYY·MM·DD·HH·mm·ss 패턴을 적용합니다. */
export declare function formatDate(date: Date, pattern: string): string;
/** 숫자·통화·날짜 표시 형식을 적용합니다. 변환 실패 시 원래 문자열을 반환합니다. */
export declare function formatValue(value: unknown, format?: DisplayFormat): string;
/** 숫자 필드 요약을 단일 순회로 계산합니다. 대상이 없으면 null입니다. */
export declare function computeSummary<T extends object>(rows: T[], field: string, expression: SummaryExpression<T>): unknown;
/** 기존 Grid의 avg·not valid 계약을 공통 요약 함수로 연결합니다. */
export declare function calcSummary(items: object[], mode: string, itemKey: string): number | string;
