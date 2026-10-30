import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { CellInfo, Config } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { getMaxColumnSize } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { FieldItem } from '@t/GridField';

export abstract class CellRenderer {
  protected field;
  protected fieldName;
  protected gridMain;
  protected language;
  protected readonly enabledTooltip: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
    this.enabledTooltip = gridMain.options().enabledTooltip;
  }

  /**
   * 편집 기능을 지원하는지 여부
   *
   * @returns {boolean}
   */
  public abstract supportsEdit(): boolean;

  /**
   * view render
   *
   * @param {HTMLElement} element td element
   @param {CellInfo} cellInfo cell info
   */
  public abstract render(cellInfo: CellInfo, element: HTMLElement): void;

  public abstract tooltip(element: HTMLElement, value: any): void;

  public abstract getValue(rowItem: any, initValue?: any): any;

  public getClosestCellElement(target: HTMLElement) {
    return target.closest('.dg-cell') as HTMLElement;
  }

  public supportsInteraction() {
    return false;
  }

  /**
   * 그리드를 파괴할 때 호출된다. 그리드 바깥(document 등)에 만든 요소가 있으면 여기서 제거한다.
   */
  public destroy(): void {
    // 기본 렌더러는 정리할 자원이 없다.
  }

  public bindEvents(eventType: string, cellInfo: CellInfo, element: HTMLElement): boolean {
    return false;
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.left;
  }

  /**
   *
   * @param cfg 설정
   * @param opts 옵션
   * @returns
   */
  public getMinWidth(cfg: Config, opts: GridOptions) {
    return getMaxColumnSize(cfg, opts, this.field);
  }

  public applyRendererRefState(contentElement: HTMLElement, refValue: any) {
    const isHide = refValue?.hide ?? false;

    const classList = contentElement.classList;
    if (classList.contains('dg-hide') !== isHide) {
      classList.toggle('dg-hide', isHide);
    }

    if (isHide) return false;

    const isDisabled = refValue?.disabled ?? false;

    if (classList.contains('dg-disabled') !== isDisabled) {
      classList.toggle('dg-disabled', isDisabled);
    }
  }
}
