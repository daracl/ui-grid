import { viewRendererClickEvent } from '@/event/renderEvents';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { isSafeUrl } from '@/util/utils';
import { RefOptionValue } from '@/types/RefValue';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 * @extends {ViewCellRenderer}
 */
export class LinkRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item) as RefOptionValue;

    let aElement = element.firstElementChild as HTMLAnchorElement | null;

    // 처음 생성 시
    if (!aElement) {
      aElement = document.createElement('a');
      aElement.className = 'dg-cell-content';
      element.appendChild(aElement);
      this.initEvent(aElement);
    }

    aElement.href = 'javascript:void(0);';

    const href = refValue?.href ?? value;
    const target = refValue?.target ?? '_blank';
    const label = refValue?.label ?? value;

    if (this.applyRendererRefState(aElement, refValue) === false) {
      return;
    }

    if (!this.isClick && refValue) {
      // javascript: 등 허용되지 않은 스킴은 기본 href 를 유지합니다.
      if (typeof href === 'string' && isSafeUrl(href)) aElement.href = href;
      aElement.target = target;
      aElement.rel = 'noopener noreferrer';
    } else {
      aElement.removeAttribute('target');
    }

    aElement.textContent = label;
    this.tooltip(aElement, label);
  }

  initEvent(contentElement: HTMLElement) {
    viewRendererClickEvent(this.gridMain.config(), contentElement, this);
  }
}
