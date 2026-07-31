import { TEXT_ALIGN_STYLE } from '@/constantStyles';
import { formatValue } from '@/util/formatUtils';
import { calcSummary } from '@/util/mathUtils';
import { resolveClassName } from '@/util/styleUtils';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Config, CellPositionInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { SummaryItem } from '../types/GridOptions';

/**
 * summary Render
 *
 * @export
 * @abstract
 * @class SummaryRenderer
 * @typedef {SummaryRenderer}
 */
export abstract class SummaryRenderer {
  protected readonly summaryItem;
  protected readonly isVauleFunction: boolean;
  protected isClick = false;
  protected readonly cfg: Config;

  protected field;
  protected fieldName;
  protected gridMain;
  protected language;

  private readonly hasCellClass: boolean;
  private readonly cellClassCache = new WeakMap<HTMLElement, string[]>();

  constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();

    this.cfg = this.gridMain.config();
    this.isVauleFunction = isFunction(field.getValue);

    this.hasCellClass = !!summaryItem.cellClass;

    this.summaryItem = summaryItem;
  }

  /**
   * view render
   *
   * @public
   * @abstract
   * @param {HTMLElement} element cell element
   */
  public abstract render(cellInfo: CellPositionInfo, element: HTMLElement): void;

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

  public setCellClass(renderValue: any, element: HTMLElement) {
    if (!this.hasCellClass) return;

    const prev = this.cellClassCache.get(element);

    const classNames = resolveClassName(this.summaryItem.cellClass, renderValue);

    if (prev?.length) {
      element.classList.remove(...prev);
    }
    if (classNames.length > 0) {
      element.classList.add(...classNames);
      this.cellClassCache.set(element, classNames);
    } else {
      this.cellClassCache.delete(element);
    }
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return TEXT_ALIGN_STYLE.right;
  }
}
