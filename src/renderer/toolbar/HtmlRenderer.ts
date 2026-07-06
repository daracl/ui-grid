import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { ViewRenderer } from '../ViewRenderer';
import { isFunction } from '@/util/utils';

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewRenderer}
 */
export class HtmlRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    controlElement.classList = this.getRendererStyleClass('dg-html');

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
}
