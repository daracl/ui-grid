import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { createHTMLElement, getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import {
  bindHideOnBlur,
  getLabelsByValue,
  normalizeChoiceOptions,
  uniqueListItem,
  updateDropdownSelection,
  updateSelectValues,
} from '@/util/rendererUtils';
import { arrayEquals, isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ToolBarRenderer}
 */
export class DropdownRenderer extends ToolBarRenderer {
  private dropdownElement: HTMLElement;
  private selectLabelElement: HTMLElement;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;
  private valueLabelMap: Map<string, any>;

  private listItems: any[] = [];

  private selectValues: string[];

  private readonly required: boolean;

  private readonly useIncludeAllOption: boolean;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);

    if (rendererInfo?.listItem) {
      this.isMultiple = rendererInfo.listItem?.multiple ?? false;
      this.valueDelimiter = rendererInfo.listItem?.delimiter ?? ',';

      this.getListItems();
    } else {
      this.valueDelimiter = ',';
      this.isMultiple = false;
      this.valueLabelMap = new Map<string, any>();
    }
    this.required = rendererInfo.required ?? false;
    this.selectValues = [];
    this.useIncludeAllOption = this.isMultiple && (this.field.renderer.listItem?.includeAllOption ?? false);
  }
  getListItems() {
    const rendererInfo = this.field.renderer;
    const list = rendererInfo.listItem?.list;

    const renderDropdown = (items: any[]) => {
      const { list, map } = normalizeChoiceOptions(items, this.labelKey, this.valueKey);
      this.listItems = uniqueListItem(list, this.valueKey);
      this.valueLabelMap = map;
    };

    if (Array.isArray(list)) {
      renderDropdown(list);
    } else if (isFunction(list)) {
      list({ init: true, values: this.getToolbarValues() }, renderDropdown);
    }
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const buttonElement = document.createElement('button');
    buttonElement.className = this.getRendererClass('dg-dropdown-button');

    const text = createHTMLElement('div', 'dg-dropdown-label');
    const icon = createHTMLElement('div', 'dg-dropdown-icon');

    buttonElement.appendChild(text);
    buttonElement.appendChild(icon);

    controlElement.appendChild(buttonElement);
    this.selectLabelElement = text;

    const dropdownElement = getLayerElement('div', 'dg-dropdown-menu dg-toolbar ' + FIELD_LAYER_CLASS, this.field.$uid);
    this.rendererContainer.appendChild(dropdownElement);
    this.dropdownElement = dropdownElement;

    this.initEvent(buttonElement);

    this.setValue(stringSplit(this.field.defaultValue || '', this.valueDelimiter));
  }

  initEvent(buttonElement: HTMLElement) {
    const { eventManager } = this.gridMain.config();

    eventManager.on({ el: buttonElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, buttonElement);

      this.editRender(buttonElement);
    });

    const { valueKey, isMultiple, required } = this;

    eventManager.on({ el: this.dropdownElement, type: 'click', selector: '.dg-dropdown-item' }, (e: UIEvent) => {
      const target = e.target as HTMLElement;
      const addItemIndex = Number(target.dataset.index || '0');

      if (target.classList.contains('disabled')) {
        return;
      }

      const enabledItems = this.listItems.filter((item) => !item.disabled);
      const enabledValues = enabledItems.map((item) => {
        return item[valueKey];
      });

      const addItemValue = this.listItems[addItemIndex][valueKey];

      const selectValues = updateSelectValues(this.selectValues, addItemValue, isMultiple, enabledValues, required);

      if (!arrayEquals(this.selectValues, selectValues)) {
        this.setValue(selectValues);
      }

      if (!isMultiple) {
        this.dropdownElement.style.display = 'none';
      }
    });
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  private editRender(buttonElement: HTMLElement) {
    const layerId = this.field.$uid;

    const cfg = this.gridMain.config();

    cfg.activeComponent = layerId;

    this.getListItems();

    const list = this.listItems;

    if (this.useIncludeAllOption && list.filter((item) => item[this.valueKey] == ALL_SELECT_VALUE).length < 1) {
      const allItem: any = {};
      allItem[this.valueKey] = ALL_SELECT_VALUE;
      allItem[this.labelKey] = this.language.getMessage('select.all');
      list.unshift(allItem);
    }

    const dropdownElement = this.dropdownElement;

    dropdownElement.innerHTML = this.dropdownMenuTemplate(list);

    this.setValue(this.selectValues);
    this.openMenu(buttonElement, dropdownElement);
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} buttonElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  private openMenu(buttonElement: HTMLElement, dropdownElement: HTMLElement) {
    const elementRect = getElementRect(buttonElement);

    const menuStyle = dropdownElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, buttonElement, dropdownElement);

    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;

    bindHideOnBlur(dropdownElement, this.gridMain.config().eventManager);
  }

  public setValue(value: string | string[]) {
    const values = isString(value) ? (value ?? '').split(this.valueDelimiter) : value;

    const listItems = this.listItems;

    const valueKey = this.valueKey;

    let isAll = false;
    if (this.useIncludeAllOption) {
      if (values.includes(ALL_SELECT_VALUE)) {
        isAll = true;
      }
    }

    this.selectValues = values;
    this.selectLabelElement.textContent = getLabelsByValue(values, this.valueDelimiter, this.valueLabelMap).join(
      this.valueDelimiter,
    );

    this.changeValue(values);

    if (!this.dropdownElement) {
      return;
    }

    updateDropdownSelection(this.dropdownElement, listItems, values, valueKey, isAll);
  }

  private dropdownMenuTemplate<T extends Record<string, unknown>>(list: T[]): string {
    if (!isArray(list) || list.length === 0) return '';

    const { valueKey, labelKey } = this;
    const html: string[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      let className = 'dg-dropdown-item';

      if (item.disabled) {
        className += ' disabled';
      }

      if (item[valueKey] === ALL_SELECT_VALUE) {
        className += ' dg-all';
      }

      html.push(`<div data-index="${i}" class="${className}">${item[labelKey]}</div>`);
    }

    return html.join('');
  }

  public getValue() {
    return this.selectValues;
  }
}
