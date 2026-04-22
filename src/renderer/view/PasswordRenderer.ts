import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { ALIGN_STYLE } from '@/constants';

/**
 * password renderer
 *
 * @typedef {PasswordRenderer}
 * @extends {ViewRenderer}
 */
export class PasswordRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const masked = '********';

    if (element.textContent !== masked) {
      element.textContent = masked;
    }
  }

  public alignStyle() {
    return ALIGN_STYLE.center;
  }
}
