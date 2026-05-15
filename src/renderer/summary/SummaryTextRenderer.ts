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

  public render(element: HTMLElement): void {
    const summaryValue = this.getValue();

    this.setStyleClassValue(summaryValue.value, element);

    if (element.textContent !== summaryValue.foramtValue) {
      element.textContent = summaryValue.foramtValue;
    }
  }
}
