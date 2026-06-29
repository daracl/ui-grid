import { ALIGN_STYLE } from '@/constants';
import { stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ToolBarRenderer}
 */
export class ButtonRenderer extends ToolBarRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    let btnElement = element.firstElementChild as HTMLElement | null;

    // 최초 렌더링 시만 생성
    if (!btnElement) {
      btnElement = document.createElement('span');
      btnElement.className = this.getRendererStyleClass('dg-cell-content');
      element.appendChild(btnElement);
      this.initEvent(btnElement);
    }

    btnElement.textContent = this.field.label;
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);

      this.click(e, this.field);
    });
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }

  public canEdit() {
    return false;
  }
}
