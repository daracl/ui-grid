import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { ValidResult } from '@/types/ValidResult';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';

/**
 * checkbox renderer
 *
 * @class CheckboxRenderer
 * @typedef {CheckboxRenderer}
 * @extends {EditCellRenderer}
 */
export class CheckboxRenderer extends EditCellRenderer {
  private readonly trueValue: string | boolean;
  private readonly falseValue: string | boolean;
  private readonly showLabel: boolean;

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
      mark.className = 'dg-checkmark';

      label.appendChild(input);
      label.appendChild(mark);

      if (this.showLabel) {
        const textLabel = document.createElement('span');
        textLabel.className = 'dg-cell-content-label dg-ellipsis';
        label.appendChild(textLabel);
      }

      element.appendChild(label);

      if (this.isEditable()) {
        this.initClick(input);
      }
    }

    const input = label.firstChild as HTMLInputElement;
    input.checked = val === this.trueValue;

    if (this.showLabel) {
      const labelElement = element.querySelector('.dg-cell-content-label');
      if (labelElement) labelElement.textContent = val;
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

  public supportsInteraction() {
    return true;
  }

  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.center;
  }
}
