import { ToolbarFieldItem } from '@/types/Toolbar';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * Switch renderer
 *
 * @class SwitchRenderer
 * @typedef {SwitchRenderer}
 * @extends {ToolBarRenderer}
 */
export class SwitchRenderer extends ToolBarRenderer {
  private trueValue: string | boolean;
  private falseValue: string | boolean;
  private editElement: HTMLInputElement;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const val = this.field.defaultValue;

    const contentElement = document.createElement('div');

    contentElement.className = this.getRendererStyleClass('dg-switch');

    const label = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'checkbox';
    label.appendChild(input);

    const mark = document.createElement('span');
    mark.className = 'dg-slider';
    label.appendChild(mark);

    contentElement.appendChild(label);
    controlElement.appendChild(contentElement);

    input.checked = val === this.trueValue;
    this.editElement = input;

    this.initClick(input);
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    let beforeValue = this.getValue();
    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, contentElement);

      const val = this.getValue();
      if (beforeValue !== val) {
        beforeValue = val;
        this.changeValue(e, contentElement, this.getValue());
      }
    });
  }

  public getValue() {
    return this.editElement.checked ? this.trueValue : this.falseValue;
  }
}
