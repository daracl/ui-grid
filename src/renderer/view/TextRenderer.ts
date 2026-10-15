import { viewRendererClickEvent } from '@/event/renderEvents';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ViewCellRenderer}
 */
export class TextRenderer extends ViewCellRenderer {
  private initializedElements = new WeakSet<HTMLElement>();

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const renderValue = this.getValue(item);

    if (element.textContent !== renderValue) {
      element.textContent = renderValue;
      this.tooltip(element, renderValue);
    }

    if (!this.initializedElements.has(element)) {
      this.initEvent(element);
      this.initializedElements.add(element);
    }
  }

  public supportsEdit() {
    return true;
  }

  initEvent(contentElement: HTMLElement) {
    viewRendererClickEvent(this.gridMain.config(), contentElement, this);
  }
}
