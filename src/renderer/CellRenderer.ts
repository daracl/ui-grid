import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { CellInfo } from '@/types/GridConfig';
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

  public abstract getValue(rowItem: any): any;

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
}
