import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { ALIGN_STYLE } from '@/constantStyles';
import { stopPreventCancel } from '@/util/eventUtils';

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewCellRenderer}
 */
export class ButtonRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement('span');
      btnElement.className = 'dg-cell-content';
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }

    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);

    let buttonLabel;
    if (refValue) {
      buttonLabel = refValue?.label ?? refValue;
    } else {
      buttonLabel = value;
    }

    // 값이 바뀌었을 때만 갱신
    if (btnElement.textContent !== buttonLabel) {
      btnElement.textContent = buttonLabel;
    }
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);
      const eventElement = e.target as HTMLElement;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }

  public supportsEdit() {
    return false;
  }
}
