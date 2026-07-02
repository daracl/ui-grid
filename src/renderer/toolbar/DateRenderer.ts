import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { EditRenderer } from '../EditRenderer';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {EditRenderer}
 */
export class DateRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(element: HTMLElement): void {
    //this.textRender(cellInfo, element, 'date');
  }

  public getValue() {
    return '';
  }
}
