import { RowId, ViewItem } from '@/types/Common';
import { FieldItem } from '@/types/GridField';
import { normalizePdfCellValue, PdfCellBorders, PdfCellChart, PdfTableData } from './PdfConverter';

export interface PdfCellStyles {
  backgrounds: (string | undefined)[];
  borders: (PdfCellBorders | undefined)[];
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
}

export abstract class PdfRenderer {
  constructor(protected readonly context: PdfRendererContext) {}

  public render(): PdfTableData {
    const { fields, viewItems } = this.context;
    const data: PdfTableData = {
      columns: [...(this.context.lineNumberField ? [this.context.lineNumberField] : []), ...fields].map((field) => ({
        name: field.name,
        label: field.label,
        width: field.$width,
      })),
      rows: viewItems.map((viewItem, rowIndex) => {
        const row = this.renderRow(viewItem);
        return this.context.lineNumberField
          ? [String((this.context.lineNumberStart ?? 0) + rowIndex + 1), ...row]
          : row;
      }),
    };
    const getCellStyles = this.context.getCellStyles;
    if (getCellStyles) {
      const cellStyles = viewItems.map((viewItem, rowIndex) => getCellStyles(viewItem, rowIndex));
      const cellBackgrounds = cellStyles.map((style) => style.backgrounds);
      if (cellBackgrounds.some((row) => row.some((background) => background !== undefined))) {
        data.cellBackgrounds = cellBackgrounds;
      }
      data.cellBorders = cellStyles.map((style) => style.borders);
    }
    if (this.context.getCellCharts) {
      const charts = viewItems.map((viewItem, rowIndex) => this.context.getCellCharts?.(viewItem, rowIndex) ?? []);
      data.cellCharts = charts.map((row) => (this.context.lineNumberField ? [undefined, ...row] : row));
    }
    if (this.context.getHeaderCellBorders) {
      data.headerCellBorders = this.context.getHeaderCellBorders();
    }
    return data;
  }

  protected renderRow(viewItem: ViewItem): string[] {
    if (viewItem.groupRowType) {
      return this.context.fields.map(() => '');
    }

    const item = this.context.getRowItem(viewItem.id);
    return this.renderDataRow(item);
  }

  protected renderDataRow(item: Record<string, unknown>): string[] {
    return this.context.fields.map((field) => normalizePdfCellValue(field.$renderer.getValue(item)));
  }
}
