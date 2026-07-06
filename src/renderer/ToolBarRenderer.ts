import { ToolbarFieldItem } from '@/types/Toolbar';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Config } from '@t/GridConfig';

/**
 *
 */
export abstract class ToolBarRenderer {
  protected isClick = false;
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

    this.rendererContainer = this.gridMain.getRendererLayerElement();
  }

  /**
   * event class
   *
   * @public
   * @param {string} defaultStyleClass
   * @returns {string}
   */
  public getRendererStyleClass(defaultStyleClass: string) {
    const styleClass = this.field.styleClass;

    if (!styleClass) {
      return defaultStyleClass;
    }

    const addClass = isFunction(styleClass) ? styleClass() : styleClass;

    return addClass ? defaultStyleClass + ' ' + addClass : defaultStyleClass;
  }

  /**
   * view render
   *
   * @public
   * @abstract
   * @param {HTMLElement} element cell element
   */
  public abstract render(element: HTMLElement): void;

  protected textRender(element: HTMLElement, type: string): HTMLInputElement {
    const editElement = document.createElement('input');

    editElement.type = type;
    editElement.name = this.field.$uid;
    editElement.setAttribute('autocomplete', 'off');
    editElement.placeholder = this.field.placeholder ?? '';

    editElement.className = this.getRendererStyleClass('dg-edit-' + type);

    editElement.value = this.field.defaultValue ?? '';

    element.appendChild(editElement);

    return editElement;
  }

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

  public changeValue(e: Event, eventElement: HTMLElement, newValue: any) {
    if (this.field.change) {
      this.field.change.call(null, { evt: e, field: this.field, value: newValue, element: eventElement });
    }
  }

  public getControlElement(fieldElement: HTMLElement): HTMLElement {
    return fieldElement.querySelector('.dg-control') as HTMLElement;
  }

  public abstract getValue(): any;
}
