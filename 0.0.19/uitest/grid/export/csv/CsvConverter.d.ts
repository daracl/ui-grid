export interface CsvExportOptions {
    fileName?: string;
    /** 외부 인코딩 라이브러리 없이 지원하는 문자 인코딩. 기본값 utf-8. */
    encoding?: 'utf-8' | 'utf-16le';
    bom?: boolean;
    delimiter?: string;
    quote?: string;
    lineEnding?: '\r\n' | '\n' | '\r';
    includeHeader?: boolean;
    includeHiddenColumns?: boolean;
    selectedOnly?: boolean;
    visibleOnly?: boolean;
    nullValue?: string;
    useFormatter?: boolean;
    escapeFormula?: boolean;
}
export declare class CsvConverter {
    serialize(headers: string[], rows: unknown[][], options?: CsvExportOptions): string;
    convert(headers: string[], rows: unknown[][], options?: CsvExportOptions): Blob;
    download(blob: Blob, fileName?: string): void;
}
