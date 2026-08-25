import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { isFunction } from '@/util/utils';

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

    const defaultValue = this.field.defaultValue;

    if (!defaultValue) return;

    const refValue = isFunction(defaultValue) ? defaultValue(this.field) : defaultValue;

    // 최초 렌더링 시만 생성
    const aElement = document.createElement('a');
    aElement.className = this.getRendererClassName('dg-link');
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

    aElement.textContent = refValue.label ?? this.field.label;
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown touchstart' }, (e: UIEvent) => {
      this.click(e, contentElement);
    });
  }

  public getValue() {
    return '';
  }

  public supportsEdit() {
    return false;
  }

  public setValue(value: string) {
    //ignore
  }
}
