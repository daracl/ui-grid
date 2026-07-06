import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ToolBarRenderer}
 */
export class NumberRenderer extends ToolBarRenderer {
  private editElement: HTMLInputElement;
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const editElement = this.textRender(controlElement, 'number');

    this.editElement = editElement;
    this.initEvent(editElement);
  }

  initEvent(editElement: HTMLInputElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: editElement, type: 'input' }, (e: UIEvent) => {
      this.changeValue(e, editElement, editElement.value);
    });
  }

  public getValue() {
    return this.editElement.value;
  }
}
