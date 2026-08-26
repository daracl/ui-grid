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

  constructor(field: FieldItem, gridMain: GridMain) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
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
   * @param {*} value value row item
   */
  public abstract render(cellInfo: CellInfo, element: HTMLElement): void;

  public abstract getValue(rowItem: any, initValue?: any): any;

  public getClosestCellElement(target: HTMLElement) {
    return target.closest('.dg-cell') as HTMLElement;
  }

  public supportsInteraction() {
    return false;
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
   * @param checkWidth
   * @returns
   */
  public getMinWidth(cfg: Config, opts: GridOptions) {
    return getMaxColumnSize(cfg, opts, this.field);
  }
}
