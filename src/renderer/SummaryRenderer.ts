import { FieldItem } from '@t/GridField';
import { ViewRenderer } from './ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { Renderer } from './Renderer';
import { SummaryItem } from '../types/GridOptions';
import { ALIGN_STYLE } from '@/constants';
import { isFunction } from '@/util/utils';
import { calcSummary } from '@/util/mathUtils';
import { formatValue } from '@/util/formatUtils';

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
  public abstract render(element: HTMLElement): void;

  public getCol() {
    return this.field.$colSeq;
  }

  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  public getValue(): any {
    const summaryItem = this.summaryItem;
    const displayFormat = summaryItem.displayFormat ?? this.field?.displayFormat;

    const items = this.cfg.dataManager.getViewItems();

    const expression = summaryItem.expression;

    let summaryValue: any = '';

    if (items.length > 0) {
      if (expression) {
        if (isFunction(expression)) {
          summaryValue = expression(items);
        } else {
          summaryValue = calcSummary(items, expression, summaryItem.name);
        }
        if (displayFormat) {
          summaryValue = formatValue(summaryValue, displayFormat);
        }
      } else if (summaryItem.label) {
        summaryValue = summaryItem.label;
      }
    }

    return summaryValue;
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return ALIGN_STYLE.right;
  }
}
