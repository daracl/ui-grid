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
  private readonly trueValue: string | boolean;
  private readonly falseValue: string | boolean;
  private switchElement: HTMLElement;
  private checked: boolean;

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

    const mark = document.createElement('span');
    mark.className = 'dg-slider';

    contentElement.appendChild(mark);
    controlElement.appendChild(contentElement);

    this.switchElement = contentElement;

    this.initClick(contentElement);
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    let beforeValue = this.getValue();
    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, contentElement);

      this.checked = !this.checked;

      this.switchElement.classList.toggle('dg-checked', this.checked);

      const val = this.getValue();
      if (beforeValue !== val) {
        beforeValue = val;
        this.changeValue(this.getValue());
      }
    });
  }

  public getValue() {
    return this.checked ? this.trueValue : this.falseValue;
  }

  public setValue(value: string | boolean) {
    if (value === this.trueValue || value === true) {
      this.checked = true;
    } else {
      this.checked = false;
    }

    this.switchElement.classList.toggle('dg-checked', this.checked);
  }
}
