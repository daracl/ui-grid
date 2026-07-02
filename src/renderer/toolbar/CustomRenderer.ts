import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * custom renderer
 *
 * @class CustomRenderer
 * @typedef {CustomRenderer}
 * @extends {ToolBarRenderer}
 */
export class CustomRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public getValue() {
    return '';
  }

  public render(element: HTMLElement): void {
    element.innerHTML = '<input type="text">';

    this.getValue();
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
