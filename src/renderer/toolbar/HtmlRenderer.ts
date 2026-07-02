import { isHTMLElement } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { ToolbarFieldItem } from '@/types/Toolbar';

/**
 * html renderer
 *
 * @class HtmlRenderer
 * @typedef {HtmlRenderer}
 * @extends {ViewRenderer}
 */
export class HtmlRenderer extends ToolBarRenderer {
  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(element: HTMLElement): void {
    element.innerHTML = this.field.editRenderer.defaultValue ?? '';
  }

  public getValue() {
    return '';
  }
}
