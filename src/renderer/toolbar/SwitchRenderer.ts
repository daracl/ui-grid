import { ToolbarFieldItem } from '@/types/Toolbar';
import { getCellInfo } from '@/util/gridUtils';
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

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const val = this.field.defaultValue;

    const label = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = this.field.$uid;

    const mark = document.createElement('span');
    mark.className = 'dg-slider';

    label.appendChild(input);
    label.appendChild(mark);

    controlElement.appendChild(label);

    this.initClick(input);

    input.checked = val === this.trueValue;
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const checked = contentElement.checked;

      this.click(e, contentElement);

      //this.setValue(e, item, checked ? this.trueValue : this.falseValue);

      //this.changeValue();
    });
  }

  public getValue() {
    return '';
  }
}
