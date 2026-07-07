import { SummaryItem } from '@/types/GridOptions';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { SummaryRenderer } from '../SummaryRenderer';
import { isString } from '@/util/utils';

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

    const formatValue = summaryValue.formatValue;

    if (element.textContent !== formatValue) {
      element.textContent = formatValue;
    }

    // 기존 클래스 제거
    element.classList.remove('single-line', 'multi-line');

    // 줄바꿈 여부 판단
    if (isString(formatValue) && formatValue.includes('\n')) {
      element.classList.add('multi-line');
    } else {
      element.classList.add('single-line');
    }
  }
}
