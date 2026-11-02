/** 탭·줄바꿈·큰따옴표가 있는 문자열을 인용 셀로 변환합니다. */
export declare function escapeCellValue<T>(value: T): T | string;
/** 인용된 탭·여러 줄·큰따옴표를 포함한 클립보드 텍스트를 해석합니다. */
export declare function parseClipboard(text: string): string[][];
/** 기존 어댑터 계약대로 셀 안의 탭·줄바꿈은 공백으로 치환해 TSV를 생성합니다. */
export declare function toTsv(rows: readonly object[], fields: readonly string[]): string;
/** 인용 처리가 없는 단순 TSV를 해석하고 마지막 줄바꿈 하나를 제거합니다. */
export declare function parseTsv(text: string): string[][];
