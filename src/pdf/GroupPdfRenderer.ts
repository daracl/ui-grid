import { ViewItem } from '@/types/Common';
import { normalizePdfCellValue } from './PdfConverter';
import { PdfRenderer } from './PdfRenderer';

export class GroupPdfRenderer extends PdfRenderer {
  private previousDataItem?: Record<string, unknown>;

  protected renderRow(viewItem: ViewItem): string[] {
    const { fields, getRowItem } = this.context;

    if (!viewItem.groupRowType) {
      const item = getRowItem(viewItem.id);
      const row = this.renderDataRow(item);
      const groupingFields = this.groupingFields();

      groupingFields.forEach((fieldName, groupIndex) => {
        const field = fields.find((candidate) => candidate.name === fieldName);
        const sameGroup =
          this.previousDataItem !== undefined &&
          groupingFields
            .slice(0, groupIndex + 1)
            .every((name) => Object.is(item[name], this.previousDataItem?.[name]));

        if (field && sameGroup) {
          row[fields.indexOf(field)] = '';
        }
      });
      this.previousDataItem = item;
      return row;
    }

    const row = super.renderRow(viewItem);
    const sumFields = new Set(this.context.sumFields);
    const summaryLabelField = fields.find((field) => !sumFields.has(field.name)) ?? fields[0];

    if (viewItem.groupRowType === 'group') {
      const groupField = fields.find((field) => field.name === viewItem.groupField) ?? fields[0];
      if (groupField) {
        row[fields.indexOf(groupField)] = `${viewItem.groupField}: ${normalizePdfCellValue(viewItem.groupValue)}`;
      }
      return row;
    }

    if (viewItem.groupRowType === 'groupSummary') {
      const labelField = viewItem.groupField
        ? fields.find((field) => field.name === viewItem.groupField) ?? summaryLabelField
        : summaryLabelField;
      if (labelField) {
        row[fields.indexOf(labelField)] = viewItem.groupField
          ? `${normalizePdfCellValue(viewItem.groupValue)} 합계`
          : 'Subtotal';
      }
    } else if (summaryLabelField) {
      row[fields.indexOf(summaryLabelField)] = 'Grand Total';
    }

    for (const [fieldName, sum] of Object.entries(viewItem.groupSums ?? {})) {
      const columnIndex = fields.findIndex((field) => field.name === fieldName);
      if (columnIndex >= 0) {
        row[columnIndex] = normalizePdfCellValue(sum);
      }
    }

    return row;
  }

  private groupingFields(): string[] {
    return this.context.groupingFields;
  }
}
