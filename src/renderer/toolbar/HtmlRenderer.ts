import { ToolbarFieldItem } from '@/types/Toolbar';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ToolBarRenderer}
 */
export class HtmlRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    controlElement.classList.add(this.getRendererStyleClass('dg-html'));

    const defaultValue = this.field.defaultValue;

    if (!defaultValue) return;

    if (isFunction(defaultValue)) {
      controlElement.innerHTML = defaultValue(this.field);
    } else {
      controlElement.innerHTML = defaultValue;
    }
  }

  public getValue() {
    return '';
  }

  public canEdit() {
    return false;
  }
}
