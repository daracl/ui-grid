import { ROW_FIELD } from '@/constants';
import { ALIGN_STYLE } from '@/constantStyles';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { createHTMLElement } from '@/util/domUtils';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * Aside RowCheck Renderer
 *
 * @class AsideRowCheckRenderer
 * @typedef {AsideRowCheckRenderer}
 * @extends {ViewCellRenderer}
 */
export class AsideRowCheckRenderer extends ViewCellRenderer {
  private readonly allowMultiSelect: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    this.allowMultiSelect = this.gridMain.options()?.aside?.rowCheckbox?.allowMultiSelect ?? true;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const isMulti = this.allowMultiSelect;

    let choiceElement = element.firstElementChild as HTMLElement;

    // 최초 렌더링 시 구조 생성
    if (!choiceElement) {
      /*
      <div class="dg-choice"><div class="dg-choice-item dg-checkbox dg-selected" data-index="0">
        <div class="dg-indicator"></div>
      </div></div>
*/
      choiceElement = createHTMLElement('div', 'dg-choice', '');

      const itemElement = createHTMLElement('div', 'dg-choice-item ' + isMulti ? 'dg-checkbox' : 'dg-radio', '');
      itemElement.appendChild(createHTMLElement('div', 'dg-indicator ', ''));
      choiceElement.appendChild(itemElement);

      element.appendChild(choiceElement);

      this.initClick(itemElement);
    }
    const input = choiceElement.firstChild as HTMLInputElement;

    input.checked = this.cfg.dataManager.isItemChecked(item[ROW_FIELD.ID]);
  }

  public isAllowMultiSelect(): boolean {
    return this.allowMultiSelect;
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      this.gridMain.getBody().setItemChecked(cellInfo.item, cfg.dataManager.isItemChecked(cellInfo.viewItem?.id ?? ''));
    });
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
