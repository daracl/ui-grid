import { RowId, ViewItem } from '@/types/Common';
import { FieldItem } from '@/types/GridField';
import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { DropdownRenderer } from '@/renderer/view/DropdownRenderer';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { RefOptionValue } from '@/types/RefValue';
import type { PdfCellBorders, PdfCellChart, PdfTableData } from './PdfConverter';
import { normalizePdfCellValue } from './PdfValue';

export interface PdfCellStyles {
  backgrounds: (string | undefined)[];
  borders: (PdfCellBorders | undefined)[];
  textColors?: (string | undefined)[];
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

export abstract class PdfRenderer {
  constructor(protected readonly context: PdfRendererContext) {}

  public render(): PdfTableData {
    const { fields, viewItems } = this.context;
    const data: PdfTableData = {
      columns: [...(this.context.lineNumberField ? [this.context.lineNumberField] : []), ...fields].map((field) => ({
        name: field.name,
        label: field.label,
        width: field.$width,
        align:
          field.align ??
          (field.$alignStyle === TEXT_ALIGN_STYLE.right
            ? 'right'
            : field.$alignStyle === TEXT_ALIGN_STYLE.center
            ? 'center'
            : 'left'),
      })),
      rows: viewItems.map((viewItem, rowIndex) => {
        const row = this.renderRow(viewItem);
        return this.context.lineNumberField
          ? [String((this.context.lineNumberStart ?? 0) + rowIndex + 1), ...row]
          : row;
      }),
    };
    if (this.context.tableBorders) data.tableBorders = this.context.tableBorders;
    const getCellStyles = this.context.getCellStyles;
    if (getCellStyles) {
      const cellStyles = viewItems.map((viewItem, rowIndex) => getCellStyles(viewItem, rowIndex));
      const cellBackgrounds = cellStyles.map((style) => style.backgrounds);
      if (cellBackgrounds.some((row) => row.some((background) => background !== undefined))) {
        data.cellBackgrounds = cellBackgrounds;
      }
      data.cellBorders = cellStyles.map((style) => style.borders);
      data.cellTextColors = cellStyles.map((style) => style.textColors ?? []);
    }
    if (this.context.getCellCharts) {
      const charts = viewItems.map((viewItem, rowIndex) => this.context.getCellCharts?.(viewItem, rowIndex) ?? []);
      data.cellCharts = charts.map((row) => (this.context.lineNumberField ? [undefined, ...row] : row));
    }
    if (this.context.getHeaderCellBorders) {
      data.headerCellBorders = this.context.getHeaderCellBorders();
    }
    if (this.context.getHeaderCellStyles) {
      const styles = this.context.getHeaderCellStyles();
      data.headerBackgrounds = styles.backgrounds;
      data.headerTextColors = styles.textColors;
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
    return this.context.fields.map((field) => {
      const renderer = field.$renderer;
      if (field.renderer?.type === 'password') return '********';
      if (field.renderer?.type === 'hidden') return '';
      const value = renderer.getValue(item);
      if (renderer instanceof ViewCellRenderer && ['dropdown', 'link', 'button'].includes(field.renderer?.type)) {
        const ref = renderer.getRefValue(value, item) as RefOptionValue | string | undefined;
        if (typeof ref === 'string') return ref;
        if (ref?.hide) return '';
        if (ref?.label !== undefined) return normalizePdfCellValue(ref.label);
        if (renderer instanceof DropdownRenderer) {
          let labels = renderer.getLabel(value);
          if (labels.length === 0 && field.defaultValue) labels = renderer.getLabel(field.defaultValue);
          if (labels.length > 0) return labels.join(field.editRenderer?.listItem?.delimiter ?? ',');
        }
      }
      return normalizePdfCellValue(value);
    });
  }
}
