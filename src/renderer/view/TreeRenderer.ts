import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { ALIGN_STYLE, ROW_DEPTH_KEY } from '@/constants';
import { createHTMLElement } from '@/util/domUtils';
import { eventOn, stopPreventCancel } from '@/util/eventUtils';
import { getCellInfo } from '@/util/gridUtils';

/**
 * tree renderer
 *
 * @typedef {TreeRenderer}
 * @extends {ViewRenderer}
 */
export class TreeRenderer extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  /**
   * 트리 노드를 렌더링합니다.
   * @param cellInfo 셀 정보
   * @param element 셀 엘리먼트
   */
  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const renderValue = this.getValue(item);

    // 트리 뎁스/자식/펼침 상태 등은 cellInfo에 있다고 가정
    const depth = (item[ROW_DEPTH_KEY] ?? 0) - 1;
    const hasChildren = item.children && item.children.length > 0;
    const expanded = !!item.expanded;

    let contentElement = element.firstElementChild as HTMLElement;

    // 바, 라벨 DOM 가져오기 또는 생성
    let expander = element.querySelector('.dg-cell-content-expander') as HTMLSpanElement;
    let icon = element.querySelector('.dg-cell-content-icon') as HTMLSpanElement;
    let title = element.querySelector('.dg-cell-content-title') as HTMLSpanElement;

    // 처음 생성 시
    if (!contentElement) {
      contentElement = createHTMLElement('div', this.getRendererStyleClass('dg-cell-content'));

      expander = createHTMLElement('span', 'dg-cell-content-expander dg-icon');
      icon = createHTMLElement('span', 'dg-cell-content-icon dg-icon');
      title = createHTMLElement('span', 'dg-cell-content-title');

      contentElement.appendChild(expander);
      contentElement.appendChild(icon);
      contentElement.appendChild(title);

      element.appendChild(contentElement);

      this.initExpanderEvent(expander);
    }

    // 트리 토글(펼침/접힘) 아이콘
    if (hasChildren) {
      icon.classList.add('dg-folder');
      expander.textContent = expanded ? '▼' : '▶';
      expander.classList.add('dg-visible');
    } else {
      icon.classList.add('dg-file');
      expander.classList.remove('dg-visible');
    }

    contentElement.style.paddingLeft = `${depth * 16}px`;

    title.textContent = renderValue;
  }
  initExpanderEvent(expander: HTMLSpanElement) {
    eventOn(
      expander,
      'mousedown',
      (e: UIEvent) => {
        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest('.dg-cell') as HTMLElement;
        const cellInfo = getCellInfo(this.cfg, cellElement);

        console.log('initExpanderEvent cellInfo ', cellInfo);

        //stopPreventCancel(e);

        //this.click(e, cellElement, cellInfo);
      },
      { passive: false },
    );
  }

  public alignStyle() {
    return ALIGN_STYLE.left;
  }
}
