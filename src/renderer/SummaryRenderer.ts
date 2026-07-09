import { ALIGN_STYLE } from '@/constantStyles';
import { formatValue } from '@/util/formatUtils';
import { calcSummary } from '@/util/mathUtils';
import { isFunction, isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Config } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { SummaryItem } from '../types/GridOptions';
import { Renderer } from './Renderer';

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
   * @param {HTMLElement} element cell element
   */
  public abstract render(element: HTMLElement): void;

  public getCol() {
    return this.field.$colSeq;
  }

  public getFieldInfo() {
    return this.field;
  }

  public getSummaryItem() {
    return this.summaryItem;
  }

  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  public getValue(): any {
    const summaryItem = this.summaryItem;
    const displayFormat = summaryItem.displayFormat ?? this.field?.displayFormat;
    const dataManager = this.cfg.dataManager;

    const items = dataManager.getAllRowItems();

    const expression = summaryItem.expression;

    const summaryValue: any = { formatValue: '' };

    if (items.length > 0) {
      if (expression) {
        if (isFunction(expression)) {
          summaryValue.value = expression(items);
        } else if (expression === 'count') {
          summaryValue.value = items.length || 0;
        } else {
          summaryValue.value = calcSummary(items, expression, summaryItem.name);
        }
        summaryValue.formatValue = summaryValue.value;
        if (displayFormat) {
          summaryValue.formatValue = formatValue(summaryValue.value, displayFormat);
        }
      } else if (summaryItem.label) {
        summaryValue.formatValue = summaryItem.label;
      }
    }

    return summaryValue;
  }

  public setStyleClassValue(renderValue: any, element: HTMLElement) {
    let styleClass = '';
    if (isFunction(this.summaryItem.styleClass)) {
      styleClass = this.summaryItem.styleClass(renderValue);
    } else {
      styleClass = isString(this.summaryItem.styleClass) ? this.summaryItem.styleClass : '';
    }

    if (styleClass) {
      element.classList.add(styleClass);
    }
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return ALIGN_STYLE.right;
  }
}
