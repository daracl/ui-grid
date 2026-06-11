import { ALIGN_STYLE, ROW_ID_FIELD_NAME } from '@/constants';
import { TreeDataManager } from '@/service/TreeDataManager';
import { TreeViewItem } from '@/types/Common';
import { createHTMLElement } from '@/util/domUtils';
import { getCellInfo } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

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
    const viewItem = cellInfo.viewItem as TreeViewItem;
    const item = cellInfo.item;
    const renderValue = this.getValue(item);

    // 트리 뎁스/자식/펼침 상태 등은 cellInfo에 있다고 가정
    const depth = viewItem.depth;
    const hasChildren = (viewItem.children?.length ?? 0) > 0;
    const expanded = viewItem.expanded > 0;

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
      icon.classList.remove('dg-file');
      icon.classList.add('dg-folder');
      expander.textContent = expanded ? '▼' : '▶';
    } else {
      icon.classList.remove('dg-folder');
      icon.classList.add('dg-file');
      expander.textContent = '';
    }

    contentElement.style.paddingLeft = `${depth * 16}px`;

    title.textContent = renderValue;
  }

  initExpanderEvent(expander: HTMLSpanElement) {
    const cfg = this.cfg;
    const treeDataManager = cfg.dataManager as TreeDataManager;
    cfg.eventManager.on({ el: expander, type: 'mousedown' }, (e: UIEvent) => {
      const eventElement = e.target as HTMLElement;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      treeDataManager.toggleRow(cellInfo.item[ROW_ID_FIELD_NAME]);
      this.gridMain.refreshBody(true, 'treeExpander');

      //stopPreventCancel(e);

      //this.click(e, cellElement, cellInfo);
    });
  }

  public alignStyle() {
    return ALIGN_STYLE.left;
  }

  public canEdit() {
    return true;
  }
}
