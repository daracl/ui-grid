import { ToolbarFieldItem } from '@/types/Toolbar';
import { createHTMLElement, getIcon } from '@/util/domUtils';
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

    const btnElement = createHTMLElement('button', this.getRendererClassName('dg-button'));

    if (this.field.renderer.icon) {
      const iconElement = createHTMLElement('span', 'dg-icon');
      iconElement.innerHTML = getIcon(this.field.renderer.icon);
      btnElement.appendChild(iconElement);
    } else if (this.field.renderer.iconStyle) {
      const iconElement = createHTMLElement('span', 'dg-icon ' + this.field.renderer.iconStyle);
      btnElement.appendChild(iconElement);
    }

    if (this.field.label) {
      const btnLabelElement = createHTMLElement('span', 'dg-button-label');
      btnLabelElement.textContent = this.field.label ?? '';
      btnElement.appendChild(btnLabelElement);
    }

    controlElement.appendChild(btnElement);

    this.initEvent(btnElement);
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

  public supportsEdit() {
    return false;
  }

  public setValue(value: string | string[]) {
    //ignore;
  }
}
