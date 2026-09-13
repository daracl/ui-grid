import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { createHTMLElement } from '@/util/domUtils';
import { isFunction } from '@/util/utils';

/**
 * label renderer
 *
 * @typedef {LabelRenderer}
 * @extends {ToolBarRenderer}
 */
export class LabelRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    let className = '';
    const rendererClassName = this.field?.rendererClassName;
    if (rendererClassName) {
      if (isFunction(rendererClassName)) {
        className = rendererClassName(this.field);
      } else {
        className = rendererClassName;
      }
    }

    const spanElement = createHTMLElement('span', className, {}) as HTMLInputElement;

    spanElement.textContent = this.field.label || '';
    controlElement.appendChild(spanElement);
  }

  public getValue() {
    return '';
  }

  public setValue(value: string) {
    // ignore
  }
}
