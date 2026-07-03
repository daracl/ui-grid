import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {ToolBarRenderer}
 */
export class DateRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.renderer;
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);
    //this.textRender(cellInfo, element, 'date');
  }

  public getValue() {
    return '';
  }
}
