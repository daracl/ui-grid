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
    this.initEvent(editElement);
  }

  initEvent(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'input' }, (e: UIEvent) => {
      this.changeValue(e, contentElement, contentElement.value);
    });
  }

  public getValue() {
    return this.editElement.value;
  }
}
