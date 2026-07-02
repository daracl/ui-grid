import { ALIGN_STYLE } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { ToolbarFieldItem } from '@/types/Toolbar';

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

    const rendererInfo = this.field.editRenderer;

    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
    this.showLabel = rendererInfo.showLabel ?? false;
  }

  public render(element: HTMLElement): void {
    let label = element.firstElementChild as HTMLLabelElement;

    // 최초 렌더링 시 구조 생성
    if (!label) {
      label = document.createElement('label');

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

      element.appendChild(label);

      this.initClick(input);
    }

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
