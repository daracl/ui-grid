import { stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { ToolbarFieldItem } from '@/types/Toolbar';

/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 */
export class LinkRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const refValue: any = this.field.renderer.defaultValue ?? {};

    // 최초 렌더링 시만 생성

    const aElement = document.createElement('a');
    aElement.className = this.getRendererStyleClass('dg-link');
    aElement.setAttribute('tabindex', '-1');
    controlElement.appendChild(aElement);
    this.initEvent(aElement);

    if (this.isClick) {
      aElement.href = 'javascript:void(0);';
    } else if (refValue?.href) {
      aElement.href = refValue.href;

      if (refValue.target) {
        aElement.target = refValue.target;
      }
    }

    aElement.textContent = refValue.label ?? refValue;
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      this.click(e, contentElement);
    });
  }

  public getValue() {
    return '';
  }
}
