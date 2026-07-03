import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * checkbox renderer
 *
 * @class CheckboxRenderer
 * @typedef {CheckboxRenderer}
 * @extends {ToolBarRenderer}
 */
export class CheckboxRenderer extends ToolBarRenderer {
  private readonly trueValue: string | boolean;
  private readonly falseValue: string | boolean;
  private readonly showLabel: boolean;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;

    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
    this.showLabel = rendererInfo.showLabel ?? false;
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const label = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = this.field.$uid;

    const mark = document.createElement('span');
    mark.className = 'dg-checkmark';

    label.appendChild(input);
    label.appendChild(mark);

    if (this.showLabel) {
      const textLabel = document.createElement('span');
      textLabel.className = 'dg-toolbar-content-label dg-cell-ellipsis';
      label.appendChild(textLabel);
    }

    controlElement.appendChild(label);

    this.initClick(input);

    /* 
    초기 체크 처리 할 것
    const input = label.firstChild as HTMLInputElement;
    input.checked = val === this.trueValue;
    */
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const checked = contentElement.checked;

      // set value 처리할것
      // this.setValue(e, checked ? this.trueValue : this.falseValue);
    });
  }

  public getValue() {
    return '';
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }
}
