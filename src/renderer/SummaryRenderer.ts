import { FieldItem } from '@t/GridField';
import { ViewRenderer } from './ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { Renderer } from './Renderer';
import { SummaryItem } from '../types/GridOptions';
import { ALIGN_STYLE } from '@/constants';
import { isFunction } from '@/util/utils';

/**
 * summary Render
 *
 * @export
 * @abstract
 * @class SummaryRenderer
 * @typedef {SummaryRenderer}
 * @extends {Renderer}
 */
export abstract class SummaryRenderer extends Renderer {
  protected readonly summaryItem;
  protected readonly isVauleFunction: boolean;
  protected isClick = false;
  protected eventStyleClass = '';
  protected readonly cfg: Config;

  constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem) {
    super(field, gridMain);
    this.cfg = this.gridMain.config();
    this.isVauleFunction = isFunction(field.getValue);

    this.summaryItem = summaryItem;
  }

  /**
   * view render
   *
   * @public
   * @abstract
   * @param {CellInfo} cellInfo cell info
   * @param {HTMLElement} element cell element
   */
  public abstract render(cellInfo: CellInfo, element: HTMLElement): void;

  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  public getValue(rowItem: any): any {
    const val = rowItem[this.fieldName];

    return val;
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return ALIGN_STYLE.right;
  }
}
