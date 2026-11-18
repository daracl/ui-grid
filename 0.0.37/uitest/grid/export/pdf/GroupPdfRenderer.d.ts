import { ViewItem } from '../../types/Common.js';
import type { PdfTableData } from './PdfConverter';
import { PdfRenderer } from './PdfRenderer';
export declare class GroupPdfRenderer extends PdfRenderer {
    private previousDataItem?;
    render(): PdfTableData;
    protected renderRow(viewItem: ViewItem): string[];
    private groupingFields;
}
