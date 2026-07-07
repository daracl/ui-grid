import { ToolbarFieldItem } from '@/types/Toolbar';
import { stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ToolBarRenderer}
 */
export class ButtonRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const btnElement = document.createElement('button');
    btnElement.className = this.getRendererStyleClass('dg-button');
    controlElement.appendChild(btnElement);

    this.initEvent(btnElement);

    btnElement.textContent = this.field.label ?? '';
  }

  initEvent(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'mousedown' }, (e: UIEvent) => {
      stopPreventCancel(e);

      this.click(e, contentElement);

      this.search(e);
    });
  }

  public getValue() {
    return '';
  }

  public canEdit() {
    return false;
  }
}
