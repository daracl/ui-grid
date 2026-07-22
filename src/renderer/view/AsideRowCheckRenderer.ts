import { ALIGN_STYLE } from '@/constantStyles';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';

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

    this.allowMultiSelect = field.renderer.customOptions?.allowMultiSelect ?? true;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const isMulti = this.allowMultiSelect;

    let label = element.firstElementChild as HTMLLabelElement;

    // 최초 렌더링 시 구조 생성
    if (!label) {
      label = document.createElement('label');

      const input = document.createElement('input');
      input.type = isMulti ? 'checkbox' : 'radio';
      input.name = this.field.$uid;
      if (!isMulti) input.classList.add('childRadio');

      const mark = document.createElement('span');
      mark.className = isMulti ? 'dg-checkmark' : 'radiomark';

      label.appendChild(input);
      label.appendChild(mark);

      element.appendChild(label);

      this.initClick(input);
    }
    const input = label.firstChild as HTMLInputElement;
    input.checked = this.cfg.dataManager.isItemChecked(item);
  }

  public isAllowMultiSelect(): boolean {
    return this.allowMultiSelect;
  }

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      this.gridMain.getBody().setItemChecked(cellInfo.item, contentElement.checked);
    });
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
