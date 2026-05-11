import { SummaryItem } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { SummaryRenderer } from '../SummaryRenderer';

/**
 * view custom renderer
 *
 * @class ViewCustomRenderer
 * @typedef {ViewCustomRenderer}
 * @extends {ViewRenderer}
 */
/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ViewRenderer}
 */
export class SummaryTextRenderer extends SummaryRenderer {
  constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem) {
    super(field, gridMain, summaryItem);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const renderValue = this.getValue(item);

    if (element.textContent !== renderValue) {
      element.textContent = renderValue;
    }
  }

  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  public getValue(rowItem: any): any {
    const val = rowItem[this.fieldName];

    return val;
  }
}
