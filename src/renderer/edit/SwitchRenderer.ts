import { ALIGN_STYLE } from '@/constantStyles';
import { ValidResult } from '@/types/ValidResult';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';

/**
 * Switch renderer
 *
 * @class SwitchRenderer
 * @typedef {SwitchRenderer}
 * @extends {EditRenderer}
 */
export class SwitchRenderer extends EditRenderer {
  private trueValue: string | boolean;
  private falseValue: string | boolean;
  private showLabel: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.editRenderer;
    this.trueValue = rendererInfo.trueValue ?? true;
    this.falseValue = rendererInfo.falseValue ?? false;
    this.showLabel = rendererInfo.showLabel ?? false;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const val = this.getValue(item);

    let label = element.firstElementChild as HTMLLabelElement;

    // 최초 렌더링 시 구조 생성
    if (!label) {
      label = document.createElement('label');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = this.field.$uid;

      const mark = document.createElement('span');
      mark.className = 'dg-slider';

      label.appendChild(input);
      label.appendChild(mark);

      element.appendChild(label);

      this.initClick(input);
    }

    const input = label.firstChild as HTMLInputElement;
    input.checked = val === this.trueValue;

    if (this.showLabel) {
      const labelElement = element.querySelector('.dg-slider');
      if (labelElement) labelElement.textContent = `${val === this.trueValue ? this.falseValue : this.trueValue}`;
    }
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);

      const cellInfo = getCellInfo(cfg, cellElement);

      const checked = contentElement.checked;

      const item = cellInfo.item;

      this.setValue(e, item, checked ? this.trueValue : this.falseValue);

      this.render(cellInfo, cellElement);
    });
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
