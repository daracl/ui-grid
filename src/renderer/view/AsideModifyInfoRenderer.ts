import { ALIGN_STYLE, ROW_FIELD } from '@/constants';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

/**
 * aside modify info
 *
 * @class AsideModifyInfoRenderer
 * @typedef {AsideModifyInfoRenderer}
 * @extends {ViewRenderer}
 */
export class AsideModifyInfoRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const cudValue = item[ROW_FIELD.CUD];
    if (cudValue == 'C') {
      element.textContent = 'C';
      return;
    }

    if (cudValue == 'U') {
      element.textContent = 'M';
      return;
    }

    if (cudValue == 'D') {
      element.textContent = 'D';
      return;
    }

    element.textContent = '';
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
