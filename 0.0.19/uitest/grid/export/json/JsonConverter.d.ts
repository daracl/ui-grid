export interface JsonExportOptions {
    fileName?: string;
    /** 들여쓰기 공백 수. 기본값 2, 0이면 압축 출력. */
    space?: number;
    includeHiddenColumns?: boolean;
    selectedOnly?: boolean;
    visibleOnly?: boolean;
    /** 기본값 false: 숫자·boolean·배열·객체 등 원본 JSON 값을 유지한다. */
    useFormatter?: boolean;
}
export declare class JsonConverter {
    convert(rows: Record<string, unknown>[], options?: JsonExportOptions): Blob;
    download(blob: Blob, fileName?: string): void;
}
