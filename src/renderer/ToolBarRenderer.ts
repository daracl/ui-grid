import { ToolbarFieldItem } from '@/types/Toolbar';
import { createHTMLElement } from '@/util/domUtils';
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

  private isInit = false;

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

  public afterRender() {
    this.isInit = true;
  }

  protected textRender(element: HTMLElement, type: string): HTMLInputElement {
    const attr = {
      type: type,
      autocomplete: 'off',
      placeholder: this.field.placeholder ?? '',
    };
    const editElement = createHTMLElement(
      'input',
      this.getRendererStyleClass('dg-edit-' + type),
      attr,
    ) as HTMLInputElement;

    editElement.value = this.field.defaultValue ?? '';

    element.appendChild(editElement);

    return editElement;
  }

  initTextEvt(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();
    cfg.eventManager.on({ el: contentElement, type: 'input' }, (e: UIEvent) => {
      this.changeValue(this.getValue());
    });

    cfg.eventManager.on({ el: contentElement, type: 'keydown' }, (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.search(e);
      }
    });
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

  public changeValue(newValue: any) {
    if (!this.isInit) return;

    if (this.field.change) {
      const toolbarValues = this.gridMain.getToolbarValues();
      this.field.change.call(null, {
        field: this.field,
        value: newValue,
        values: toolbarValues,
      });
    }
  }

  public search(e: Event) {
    if (this.field.search) {
      const toolbarValues = this.gridMain.getToolbarValues();
      this.field.search.call(null, {
        evt: e,
        field: this.field,
        values: toolbarValues,
      });
    }
  }

  public getToolbarValues() {
    if (!this.isInit) return {};
    return this.gridMain.getToolbarValues();
  }

  public getControlElement(fieldElement: HTMLElement): HTMLElement {
    return fieldElement.querySelector('.dg-control') as HTMLElement;
  }

  public abstract setValue(values: any): void;

  public abstract getValue(): any;

  public canEdit() {
    return true;
  }
}
