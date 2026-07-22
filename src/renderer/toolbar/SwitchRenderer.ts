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
  private sliderElement: HTMLElement;
  private labelElement: HTMLElement;
  private checked: boolean;
  private showLabel: boolean;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.showLabel = rendererInfo.showLabel ?? false;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const contentElement = document.createElement('div');

    contentElement.className = this.getRendererStyleClass('dg-switch');

    const slider = document.createElement('div');
    slider.className = 'dg-slider';

    if (this.showLabel) {
      const label = document.createElement('span');
      label.className = 'dg-label';
      slider.appendChild(label);
      this.labelElement = label;
    }

    contentElement.appendChild(slider);
    controlElement.appendChild(contentElement);

    this.sliderElement = slider;

    this.setValue(this.field.defaultValue ?? false);

    this.initClick(contentElement);
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    let beforeValue = this.getValue();
    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, contentElement);

      this.checked = !this.checked;

      this.setValue(this.checked);

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
    let labelText;
    if (value === this.trueValue || value === true) {
      this.checked = true;
      labelText = this.trueValue;
    } else {
      this.checked = false;
      labelText = this.falseValue;
    }

    if (this.showLabel) {
      this.labelElement.textContent = labelText + '';
    }

    this.sliderElement.classList.toggle('dg-checked', this.checked);
  }
}
