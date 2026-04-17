import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { stopPreventCancel } from '@/util/eventUtils';

/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {ViewRenderer}
 */
export class LinkRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    let aElement = element.firstElementChild as HTMLAnchorElement | null;

    // 처음 생성 시
    if (!aElement) {
      aElement = document.createElement('a');
      aElement.className = this.getRendererStyleClass('dg-cell-content');
      aElement.setAttribute('tabindex', '-1');
      element.appendChild(aElement);
      this.initEvent(aElement);
    }

    if (refValue) {
      aElement.href = this.isClick ? '#' : refValue.href;
      if (!this.isClick) {
        aElement.target = refValue.target ?? '_blank';
      }
      aElement.textContent = refValue.label ?? value;
    } else {
      aElement.href = this.isClick ? '#' : value;
      if (!this.isClick) {
        aElement.target = '_blank';
      }
      aElement.textContent = value;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);
      const eventElement = e.target as HTMLElement;
      const cellElement = eventElement.closest('.dg-cell') as HTMLElement;
      const cellInfo = getCellInfo(cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }
}
