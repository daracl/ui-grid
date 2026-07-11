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
  private editElement: HTMLInputElement;
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const editElement = this.textRender(controlElement, 'date');

    this.editElement = editElement;
    this.initTextEvt(editElement);
  }

  public setValue(value: string) {
    this.editElement.value = value;
    this.changeValue(value);
  }

  public getValue() {
    return this.editElement.value;
  }
}
