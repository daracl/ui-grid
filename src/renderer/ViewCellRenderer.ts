import { FieldItem } from '@t/GridField';

import { formatValue } from '@/util/formatUtils';
import { isFunction, isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { isBlank } from '../util/utils';
import { CellRenderer } from './CellRenderer';

export abstract class ViewCellRenderer extends CellRenderer {
  private readonly isRefFunction: boolean;
  private readonly isRefString: boolean;
  private readonly isVauleFunction: boolean;
  protected readonly refValue: any;
  protected isClick = false;
  protected interactiveClass: string;
  protected readonly cfg: Config;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    this.cfg = this.gridMain.config();
    const refValue = field.renderer.refValue;
    this.isRefFunction = isFunction(refValue);
    this.isRefString = isString(refValue);
    this.isVauleFunction = isFunction(field.getValue);

    if (this.isRefString || this.isRefFunction) {
      this.refValue = refValue;
    } else {
      this.refValue = refValue ?? {};
    }

    this.isClick = isFunction(this.field.renderer.click);
    this.initEventClass();
  }

  initEventClass() {
    const interactiveClass = this.isClick ? 'dg-cell-click' : '';

    this.interactiveClass = interactiveClass;
  }

  public getRendererClass(className: string) {
    if (!this.interactiveClass) return className;

    return className ? className + ' ' + this.interactiveClass : this.interactiveClass;
  }

  /**
   * interactive class
   *
   * @public
   * @param {string} className
   * @returns {string}
   */
  public getInteractiveClass(className: string) {
    if (!this.interactiveClass) return className;

    return className ? className + ' ' + this.interactiveClass : this.interactiveClass;
  }

  public getRefValue(value: any, rowItem?: any): any {
    if (this.isRefFunction) {
      return this.refValue.call(null, this.field, value, rowItem);
    }

    if (this.isRefString) return { label: this.refValue };

    return this.refValue[value];
  }

  /**
   * 값 얻기
   * @param rowItem row item
   * @returns
   */
  public getValue(rowItem: any): any {
    const val = rowItem[this.fieldName];

    if (this.isVauleFunction) {
      return this.field.getValue?.({ field: this.field, item: rowItem });
    }

    if (this.field.displayFormat) {
      return formatValue(val, this.field.displayFormat);
    }

    if (!val && !isBlank(this.field.defaultValue)) {
      return this.field.defaultValue;
    }

    return val;
  }

  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   * @param cellInfo  cell info
   */
  public click(e: Event, eventElement: HTMLElement, cellInfo: CellInfo) {
    if (this.isClick) {
      this.field.renderer.click?.call(null, cellInfo);
    }
  }

  /**
   * 랜더러가 editor 랜더러 인지 여부
   *
   * @returns {boolean}
   */
  public supportsEdit() {
    return false;
  }
}
