import { ToolbarFieldItem } from '@/types/Toolbar';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Config } from '@t/GridConfig';

/**
 *
 */
export abstract class ToolBarRenderer {
  protected isClick = false;
  protected eventStyleClass = '';
  protected readonly cfg: Config;

  protected field;
  protected fieldName;
  protected gridMain;
  protected language;

  protected readonly rendererContainer: HTMLElement;

  private validatorElement: HTMLElement;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    this.field = field;
    this.fieldName = field.name;
    this.gridMain = gridMain;
    this.language = this.gridMain.i18n();
    this.cfg = this.gridMain.config();

    this.isClick = isFunction(this.field.click);
    this.initEventClass();

    this.rendererContainer = this.gridMain.getRendererLayerElement();
  }

  initEventClass() {
    const eventStyleClass = this.isClick ? 'dg-tool-click' : '';

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

  /**
   * cell click event
   * @param e click event object
   * @param eventElement  event element
   */
  public click(e: Event, eventElement: HTMLElement) {
    if (this.isClick) {
      this.field.click?.call(null, { evt: e, field: this.field, element: eventElement });
    }
  }

  public changeValue(eventElement: HTMLElement) {
    if (this.field.change) {
      this.field.change.call(null, { field: this.field, value: this.getValue(), element: eventElement });
    }
  }

  public getControlElement(fieldElement: HTMLElement): HTMLElement {
    return fieldElement.querySelector('.dg-control') as HTMLElement;
  }

  public abstract getValue(): any;
}
