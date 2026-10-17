import { RowId, ViewItem } from '../../types/Common.js';
import { FieldItem } from '../../types/GridField.js';
import type { PdfCellBorders, PdfCellChart, PdfCellGradient, PdfTableData } from './PdfConverter';
export interface PdfCellStyles {
    backgrounds: (string | undefined)[];
    borders: (PdfCellBorders | undefined)[];
    textColors?: (string | undefined)[];
    gradients?: (PdfCellGradient | undefined)[];
}
export interface PdfRendererContext {
    fields: FieldItem[];
    lineNumberField?: FieldItem;
    lineNumberStart?: number;
    viewItems: ViewItem[];
    groupingFields: string[];
    sumFields: string[];
    getRowItem: (id: RowId) => Record<string, unknown>;
    getCellStyles?: (viewItem: ViewItem, rowIndex: number) => PdfCellStyles;
    getCellCharts?: (viewItem: ViewItem, rowIndex: number) => (PdfCellChart | undefined)[];
    getHeaderCellBorders?: () => (PdfCellBorders | undefined)[];
    getHeaderCellStyles?: () => PdfCellStyles;
    tableBorders?: PdfCellBorders;
}
export declare abstract class PdfRenderer {
    protected readonly context: PdfRendererContext;
    constructor(context: PdfRendererContext);
    render(): PdfTableData;
    protected renderRow(viewItem: ViewItem): string[];
    protected renderDataRow(item: Record<string, unknown>): string[];
}
