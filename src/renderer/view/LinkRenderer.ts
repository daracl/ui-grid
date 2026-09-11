import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { stopPreventCancel } from '@/util/eventUtils';

/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {ViewCellRenderer}
 */
export class LinkRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);

    let aElement = element.firstElementChild as HTMLAnchorElement | null;

    // 처음 생성 시
    if (!aElement) {
      aElement = document.createElement('a');
      aElement.className = 'dg-cell-content';
      element.appendChild(aElement);
      this.initEvent(aElement);
    }

    aElement.href = 'javascript:void(0);';

    if (refValue) {
      if (!this.isClick) {
        aElement.href = refValue.href;
        aElement.target = refValue.target ?? '_blank';
      }
      aElement.textContent = refValue.label ?? value;
    } else {
      if (!this.isClick) {
        aElement.target = '_blank';
        aElement.href = value;
      }
      aElement.textContent = value;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'pointerdown' }, (e: UIEvent) => {
      stopPreventCancel(e);
      const eventElement = e.target as HTMLElement;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }
}
