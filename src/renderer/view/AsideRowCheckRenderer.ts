import { ROW_FIELD } from '@/constants';
import { TEXT_ALIGN_STYLE, SELECTED_STYLE_CLASS } from '@/constantStyles';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { createHTMLElement } from '@/util/domUtils';
import { getCellInfo } from '@/util/gridUtils';
import { removeClass } from '@/util/styleUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

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

    this.allowMultiSelect = this.gridMain.options()?.aside?.rowCheckbox?.allowMultiSelect ?? true;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const isMulti = this.allowMultiSelect;

    let choiceElement = element.firstElementChild as HTMLElement;

    // 최초 렌더링 시 구조 생성
    if (!choiceElement) {
      choiceElement = createHTMLElement('div', 'dg-choice', '');

      const itemElement = createHTMLElement('div', 'dg-choice-item ' + (isMulti ? 'dg-checkbox' : 'dg-radio'), {
        role: 'presentation',
      });
      itemElement.appendChild(createHTMLElement('div', 'dg-indicator ', ''));
      choiceElement.appendChild(itemElement);

      element.appendChild(choiceElement);

      this.initClick(itemElement);
    }

    if (this.cfg.dataManager.isItemChecked(item[ROW_FIELD.ID])) {
      choiceElement.firstElementChild?.classList.add(SELECTED_STYLE_CLASS);
    } else {
      choiceElement.firstElementChild?.classList.remove(SELECTED_STYLE_CLASS);
    }
  }

  initClick(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();
    const allowMultiSelect = this.allowMultiSelect;

    const clickFn = this.gridMain.options().aside?.rowCheckbox?.click;

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const cellElement = this.getClosestCellElement(contentElement);
      const cellInfo = getCellInfo(cfg, cellElement);

      const checked = cfg.dataManager.isItemChecked(cellInfo.viewItem?.id ?? '');

      if (clickFn && clickFn(checked) === false) {
        return;
      }

      if (allowMultiSelect) {
        this.multipleRowCheck(contentElement, cellInfo, checked);
      } else {
        this.singleRowCheck(contentElement, cellInfo, checked);
      }
    });
  }

  /**
   * 단일 선택(Row Checkbox) 처리
   *
   * 다른 Row의 체크를 모두 해제한 후 현재 Row만 체크
   *
   * @param contentElement 체크박스 요소
   * @param cellInfo 현재 Cell 정보
   * @param currentChecked 현재 체크 여부
   */
  private singleRowCheck(contentElement: HTMLElement, cellInfo: CellInfo, currentChecked: boolean) {
    console.log('cellInfo : ', cellInfo);
    this.gridMain.getBody().setItemChecked(cellInfo.viewItem?.id ?? '', true);
  }

  /**
   * 다중 선택(Row Checkbox) 처리
   *
   * 현재 Row의 체크 상태를 토글
   *
   * @param contentElement 체크박스 요소
   * @param cellInfo 현재 Cell 정보
   * @param currentChecked 현재 체크 여부
   */
  private multipleRowCheck(contentElement: HTMLElement, cellInfo: CellInfo, currentChecked: boolean) {
    const checked = !currentChecked;
    this.gridMain.getBody().addItemChecked(cellInfo.viewItem?.id ?? '', checked);
  }

  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.center;
  }
}
