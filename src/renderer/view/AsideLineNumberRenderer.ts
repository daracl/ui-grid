import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { ALIGN_STYLE } from '@/constants';

/**
 * Aside LineNumber renderer
 *
 * @class AsideLineNumberRenderer
 * @typedef {AsideLineNumberRenderer}
 * @extends {ViewRenderer}
 */
export class AsideLineNumberRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    element.textContent = cellInfo.rowIndex + 1 + '';
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
