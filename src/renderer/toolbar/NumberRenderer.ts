import { ToolbarFieldItem } from '@/types/Toolbar';
import { stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ToolBarRenderer}
 */
export class NumberRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement('button');
      btnElement.className = this.getRendererStyleClass('dg-button');
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }

    btnElement.textContent = this.field.label ?? '';
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);

      this.click(e, contentElement);
    });
  }

  public getValue() {
    return '';
  }
}
