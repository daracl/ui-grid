import { CellPositionInfo } from '@/types/GridConfig';
import { isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';
import { SummaryRenderer } from '../SummaryRenderer';
import { SummaryItem } from '@/types/Summary';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {SummaryRenderer}
 */
export class SummaryTextRenderer extends SummaryRenderer {
  constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem) {
    super(field, gridMain, summaryItem);
  }

  public render(cellInfo: CellPositionInfo, element: HTMLElement): void {
    const summaryValue = this.getValue();

    this.setCellClassName(summaryValue.value, element);

    const renderElement = element.firstElementChild as HTMLElement;

    const formatValue = summaryValue.formatValue;

    if (renderElement.textContent !== formatValue) {
      renderElement.textContent = formatValue;
    }

    // 기존 클래스 제거
    renderElement.classList.remove('single-line', 'multi-line');

    // 줄바꿈 여부 판단
    if (isString(formatValue) && formatValue.includes('\n')) {
      renderElement.classList.add('multi-line');
    } else {
      renderElement.classList.add('single-line');
    }
  }
}
