import { SELECTED_STYLE_CLASS, TEXT_ALIGN_STYLE } from '@/constantStyles';
import { ValidResult } from '@/types/ValidResult';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { GridOptions } from '@/types/GridOptions';
import { createHTMLElement } from '@/util/domUtils';

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
    const val = this.getValue(cellInfo.item, cellInfo.inputValue);

    let choiceElement = element.firstElementChild as HTMLElement;

    // 최초 렌더링 시 구조 생성
    if (!choiceElement) {
      choiceElement = createHTMLElement('div', 'dg-choice', '');

      const itemElement = createHTMLElement('div', 'dg-choice-item  dg-checkbox', {
        role: 'presentation',
      });
      itemElement.appendChild(createHTMLElement('div', 'dg-indicator ', ''));
      choiceElement.appendChild(itemElement);

      if (this.showLabel) {
        const textLabel = document.createElement('span');
        textLabel.className = 'dg-cell-content-label dg-ellipsis';
        itemElement.appendChild(textLabel);
      }

      element.appendChild(choiceElement);

      if (this.isEditable()) {
        this.initClick(choiceElement);
      }
    }

    if (val === this.trueValue) {
      choiceElement.firstElementChild?.classList.add(SELECTED_STYLE_CLASS);
    } else {
      choiceElement.firstElementChild?.classList.remove(SELECTED_STYLE_CLASS);
    }

    if (this.showLabel) {
      const labelElement = element.querySelector('.dg-cell-content-label');
      if (labelElement) labelElement.textContent = val;
    }
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);

      const cellInfo = getCellInfo(cfg, cellElement);
      const item = cellInfo.item;

      const val = this.getValue(item, cellInfo.inputValue);

      const checked = val === this.trueValue;

      this.setValue(e, item, !checked ? this.trueValue : this.falseValue);

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

  public getMinWidth(cfg: Config, opts: GridOptions) {
    return 50;
  }
}
