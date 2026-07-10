import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ToolBarRenderer}
 */
export class TextRenderer extends ToolBarRenderer {
  private editElement: HTMLInputElement;
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const editElement = this.textRender(controlElement, 'text');

    this.editElement = editElement;
    this.initTextEvent(editElement);

    this.setIsInit();
  }

  public getValue() {
    return this.editElement.value;
  }

  public setValue(value: string) {
    this.editElement.value = value;
  }
}
