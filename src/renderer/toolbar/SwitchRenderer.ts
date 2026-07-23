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
  private readonly showLabel: boolean;

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

    contentElement.className = this.getRendererClass('dg-switch');

    const slider = document.createElement('div');
    slider.className = 'dg-slider';

    if (this.showLabel) {
      const label = document.createElement('span');
      label.className = 'dg-slider-label';
      slider.appendChild(label);
      this.labelElement = label;
    }

    contentElement.appendChild(slider);
    controlElement.appendChild(contentElement);

    this.sliderElement = slider;

    this.setValue(this.field.defaultValue);

    this.initClick(contentElement);
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, contentElement);

      this.setChecked(!this.checked);
    });
  }

  public getValue() {
    return this.checked ? this.trueValue : this.falseValue;
  }

  public setValue(value: any) {
    this.setChecked(value === this.trueValue);
  }

  public setChecked(checked: boolean) {
    if (this.checked === checked) {
      return;
    }

    if (this.showLabel) {
      this.labelElement.textContent = (checked ? this.trueValue : this.falseValue) + '';
    }

    this.checked = checked;

    this.changeValue(this.getValue());

    this.sliderElement.classList.toggle('dg-checked', checked);
  }
}
