import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewRenderer}
 */
export class ButtonRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement('div');
      btnElement.className = this.getRendererStyleClass('dg-cell-content');
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }

    const buttonLabel = refValue.label ?? value;

    // 값이 바뀌었을 때만 갱신
    if (btnElement.textContent !== buttonLabel) {
      btnElement.textContent = buttonLabel;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.getGrid().config();
    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const eventElement = e.target as HTMLElement;
      const cellElement = eventElement.closest('.dg-cell') as HTMLElement;
      const cellInfo = getCellInfo(cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }
}
