import type { ExcelTableData } from './ExcelData';
export interface ExcelExportOptions {
    fileName?: string;
    sheetName?: string;
    freezeHeader?: boolean;
    autoFilter?: boolean;
    includeRowNumber?: boolean;
    mergeCells?: boolean;
    /** 트리의 접힌 하위 행도 포함한다. 기본값 true, false이면 현재 표시되는 행만 내보낸다. */
    includeCollapsed?: boolean;
}
export declare class ExcelConverter {
    convert(data: ExcelTableData, options?: ExcelExportOptions): Blob;
    download(blob: Blob, fileName?: string): void;
}
