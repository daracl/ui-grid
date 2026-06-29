import { FieldItem } from '@t/GridField';

import { ALIGN_STYLE } from '@/constants';
import { isFunction, isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Config } from '@t/GridConfig';
import { Renderer } from './Renderer';

/**
 *
 */
export abstract class ToolBarRenderer extends Renderer {
  private readonly isRefFunction: boolean;
  private readonly isRefString: boolean;
  private readonly isVauleFunction: boolean;
  protected readonly refValue: any;
  protected isClick = false;
  protected eventStyleClass = '';
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
   * @param {HTMLElement} element cell element
   */
  public abstract render(element: HTMLElement): void;

  public getRefValue(value: any, rowItem?: any): any {
    if (this.isRefFunction) {
      return this.refValue.call(null, this.field, value, rowItem);
    }

    if (this.isRefString) return { label: this.refValue };

    return this.refValue[value];
  }

  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   */
  public click(e: Event, field: FieldItem) {
    if (this.isClick) {
      this.field.renderer.click?.call(null, { evt: e, field: this.field });
    }
  }

  /**
   * 랜더러가 editor 랜더러 인지 여부
   *
   * @returns {boolean}
   */
  public canEdit() {
    return false;
  }

  /**
   *  값 정렬 스타일
   * @returns {string} align style
   */
  public alignStyle(): string {
    return ALIGN_STYLE.left;
  }
}
