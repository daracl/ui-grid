import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * Aside LineNumber renderer
 *
 * @class AsideLineNumberRenderer
 * @typedef {AsideLineNumberRenderer}
 * @extends {ViewCellRenderer}
 */
export class AsideLineNumberRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const viewItem = cellInfo.viewItem;

    if (this.cfg.dataManager.getDataType() === 'group' && viewItem) {
      const viewItems = this.cfg.dataManager.getViewItems();
      const viewItemIndex = viewItems.findIndex((item) => item.id === viewItem.id);

      if (viewItemIndex > -1) {
        const pagingStartIdx = this.gridMain.options().footer.paging?.enabled
          ? (this.cfg.paging.page - 1) * this.cfg.paging.pageSize
          : 0;

        element.textContent = String(pagingStartIdx + viewItemIndex + 1);
        return;
      }
    }

    element.textContent = String(cellInfo.rowIndex + 1);
  }

  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.center;
  }
}
