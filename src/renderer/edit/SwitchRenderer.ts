import { ALIGN_STYLE } from '@/constantStyles';
import { ValidResult } from '@/types/ValidResult';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { hasClass } from '@/util/domUtils';

/**
 * Switch renderer
 *
 * @class SwitchRenderer
 * @typedef {SwitchRenderer}
 * @extends {EditCellRenderer}
 */
export class SwitchRenderer extends EditCellRenderer {
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

    let slider = element.firstElementChild as HTMLElement;

    // 최초 렌더링 시 구조 생성
    if (!slider) {
      slider = document.createElement('div');
      slider.className = 'dg-slider';

      if (this.showLabel) {
        const label = document.createElement('span');
        label.className = 'dg-label';
        slider.appendChild(label);
      }

      element.appendChild(slider);

      if (this.isEditable()) {
        this.initClick(slider);
      }
    }

    this.toggle(slider, val);
  }

  public toggle(sliderElement: HTMLElement, value: string | boolean) {
    let labelText = this.falseValue;
    let checked = false;
    if (value === this.trueValue || value === true) {
      checked = true;
      labelText = this.trueValue;
    }

    if (this.showLabel) {
      const labelElement = sliderElement.querySelector('.dg-label');
      if (labelElement) labelElement.textContent = labelText + '';
    }

    sliderElement.classList.toggle('dg-checked', checked);
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);

      const cellInfo = getCellInfo(cfg, cellElement);

      const checked = !hasClass(contentElement, 'dg-checked');

      this.toggle(contentElement, checked);

      const item = cellInfo.item;

      this.setValue(e, item, checked ? this.trueValue : this.falseValue);

      this.render(cellInfo, cellElement);
    });
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  public supportsInteraction() {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
