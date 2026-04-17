import { FieldItem } from '@t/GridField';

import { Renderer } from './Renderer';
import { isFunction, isString } from '@/util/utils';
import { CellInfo, Config } from '@t/GridConfig';
import { GridMain } from '@/view/GridMain';
import { formatValue } from '@/util/formatUtils';
import { ALIGN_STYLE } from '@/constants';

export abstract class ViewRenderer extends Renderer {
  private readonly isRefFunction: boolean;
  private readonly isRefString: boolean;
  protected readonly refValue: any;
  protected isClick = false;
  protected eventStyleClass = '';
  protected readonly cfg: Config;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    this.cfg = this.gridMain.config();
    const refValue = this.field.renderer.refValue;
    this.isRefFunction = isFunction(refValue);
    this.isRefString = isString(refValue);

    if (this.isRefString || this.isRefFunction) {
      this.refValue = refValue;
    } else {
      this.refValue = refValue ?? {};
    }

    this.isClick = isFunction(this.field.renderer.click);
    this.initEventClass();
  }

  initEventClass() {
    const eventStyleClass = this.isClick ? 'dg-cell-click' : '';

    this.eventStyleClass = eventStyleClass;
  }

  /**
   * event class
   *
   * @public
   * @param {string} defaultStyleClass
   * @returns {string}
   */
  public getRendererStyleClass(defaultStyleClass: string) {
    if (!this.eventStyleClass) return defaultStyleClass;

    return defaultStyleClass ? defaultStyleClass + ' ' + this.eventStyleClass : this.eventStyleClass;
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

  public isWrapper(): boolean {
    return true;
  }

  public getRefValue(value: any, rowItem?: any): any {
    if (this.isRefFunction) {
      return this.refValue.call(null, this.field, value, rowItem);
    }

    if (this.isRefString) return { label: this.refValue };

    return this.refValue[value];
  }

  public getValue(rowItem: any): any {
    const val = rowItem[this.fieldName];
    if (this.field.displayFormat) {
      return formatValue(val, this.field.displayFormat);
    }

    return val;
  }

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
  public canEdit() {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.left;
  }
}
