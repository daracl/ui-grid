export { normalizePdfCellValue } from './PdfValue';
export interface PdfColumn {
    name: string;
    label: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
}
export interface PdfCellGradient {
    startColor: string;
    endColor: string;
}
export interface PdfBorderSide {
    color: string;
    width: number;
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
}
export interface PdfCellBorders {
    top?: PdfBorderSide;
    right?: PdfBorderSide;
    bottom?: PdfBorderSide;
    left?: PdfBorderSide;
}
export type PdfCellChart = {
    type: 'bar';
    value: number;
    minimum: number;
    maximum: number;
    label: string;
    color: string;
} | {
    type: 'sparkline' | 'sparklineBar';
    values: number[];
};
export interface PdfTableData {
    firstPageHeader?: PdfHeaderCell[][];
    columns: PdfColumn[];
    rows: string[][];
    cellBackgrounds?: (string | undefined)[][];
    cellBorders?: (PdfCellBorders | undefined)[][];
    headerCellBorders?: (PdfCellBorders | undefined)[];
    cellCharts?: (PdfCellChart | undefined)[][];
    cellTextColors?: (string | undefined)[][];
    headerBackgrounds?: (string | undefined)[];
    headerTextColors?: (string | undefined)[];
    headerGradients?: (PdfCellGradient | undefined)[];
    tableBorders?: PdfCellBorders;
}
export interface PdfHeaderCell {
    label: string;
    column: number;
    colSpan: number;
    rowSpan: number;
    background?: string;
    textColor?: string;
    gradient?: PdfCellGradient;
    borders?: PdfCellBorders;
}
export interface PdfExportOptions {
    fileName?: string;
    title?: string;
    author?: string;
    pageSize?: string | [number, number];
    orientation?: 'portrait' | 'landscape';
    margin?: number;
    fontName?: string;
    fontSize?: number;
    customFont?: {
        name: string;
        data: Uint8Array | ArrayBuffer;
    };
}
export declare class PdfConverter {
    convert(data: PdfTableData, options?: PdfExportOptions): Promise<Blob>;
    download(blob: Blob, fileName?: string): void;
    private getColumnWidths;
    private getRowHeight;
    private drawRow;
    private drawCellChart;
    private drawCellBorders;
}
export declare function normalizePdfColor(value: string): string;
