import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { SELECTED_STYLE_CLASS } from '@/constantStyles';
import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { createHTMLElement, getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { bindHideOnBlur, normalizeChoiceOptions, uniqueListItem } from '@/util/rendererUtils';
import { addClass, removeClass } from '@/util/styleUtils';
import { isArray, isFunction, isString, removeItem, stringSplit } from '@/util/utils';
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
  private listElement: HTMLElement;
  private selectLabelElement: HTMLElement;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;
  private valueLabelMap: Map<string, any>;

  private listItems: any[] = [];

  private selectValues: string[];

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

    this.selectValues = stringSplit(this.field.defaultValue || '', this.valueDelimiter);
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
    buttonElement.className = this.getRendererStyleClass('dg-dropdown-button');

    const text = createHTMLElement('div', 'dg-dropdown-label');
    const icon = createHTMLElement('div', 'dg-dropdown-icon');

    buttonElement.appendChild(text);
    buttonElement.appendChild(icon);

    controlElement.appendChild(buttonElement);
    this.selectLabelElement = text;

    this.initEvent(buttonElement);

    this.setValue(this.selectValues);
  }

  public getLabel(value: string[]) {
    const values = Array.from(new Set(value));

    const labels: string[] = [];

    const valueLabelMap = this.valueLabelMap;

    for (const val of values) {
      if (valueLabelMap.has(val)) {
        labels.push(valueLabelMap.get(val));
      }
    }
    return labels;
  }

  initEvent(buttonElement: HTMLElement) {
    this.cfg.eventManager.on({ el: buttonElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, buttonElement);

      this.editRender(buttonElement);
    });
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  private editRender(buttonElement: HTMLElement) {
    const layerId = this.field.$uid;

    const cfg = this.gridMain.config();

    cfg.activeComponent = layerId;

    let listElement = this.listElement;

    if (!listElement) {
      listElement = getLayerElement('div', 'dg-dropdown-menu dg-toolbar ' + FIELD_LAYER_CLASS, layerId);

      this.rendererContainer.appendChild(listElement);
      this.listElement = listElement;
    }

    this.getListItems();

    const list = this.listItems;

    if (this.useIncludeAllOption && list.filter((item) => item[this.valueKey] == ALL_SELECT_VALUE).length < 1) {
      const allItem: any = {};
      allItem[this.valueKey] = ALL_SELECT_VALUE;
      allItem[this.labelKey] = this.language.getMessage('select.all');
      list.unshift(allItem);
    }

    listElement.innerHTML = this.dropdownMenuTemplate(list);

    this.setValue(this.selectValues);
    this.openMenu(buttonElement, listElement, list);
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} buttonElement cell element
   * @param {HTMLElement} listElement dropdown element
   * @param {HTMLElement} eventElement click element
   * @param {any[]} list list item
   */
  private openMenu(buttonElement: HTMLElement, listElement: HTMLElement, list: any[]) {
    const elementRect = getElementRect(buttonElement);

    const menuStyle = listElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(listElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, buttonElement, listElement);

    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;

    const items = listElement.querySelectorAll('.dg-dropdown-item');

    const isMultiple = this.isMultiple;

    const cfg = this.gridMain.config();

    bindHideOnBlur(listElement, cfg.eventManager);

    const enabledItems = list.filter((item) => !item.disabled);
    const enabledCount = enabledItems.length;

    cfg.eventManager.on({ el: items, type: 'click' }, (e: UIEvent) => {
      const target = e.target as HTMLElement;
      const addItemIndex = Number(target.dataset.index || '0');

      if (target.classList.contains('disabled')) {
        return;
      }

      const addItem = list[addItemIndex];

      const addItemValue = addItem[this.valueKey];

      let selectValues = this.selectValues;

      if (isMultiple) {
        if (addItemValue == ALL_SELECT_VALUE) {
          if (enabledCount == selectValues.length) {
            selectValues = [];
          } else {
            const valueKey = this.valueKey;
            const newValue = enabledItems.map((item) => {
              return item[valueKey];
            });

            selectValues = newValue;
          }
        } else {
          if (selectValues.includes(addItemValue)) {
            selectValues = removeItem(selectValues, addItemValue);
          } else {
            selectValues.push(addItemValue);
          }

          if (selectValues.length != enabledCount) {
            selectValues = removeItem(selectValues, ALL_SELECT_VALUE);
          }
        }
      } else if (!this.selectValues.includes(addItemValue)) {
        selectValues = [addItemValue];
      }

      this.setValue(selectValues);

      if (!isMultiple) {
        cfg.eventManager.off(items, 'click');
        menuStyle.display = 'none';
      }
    });
  }

  public setValue(value: string | string[]) {
    let values = isString(value) ? (value ?? '').split(this.valueDelimiter) : value;

    const listItems = this.listItems;

    const valueKey = this.valueKey;

    const notDisabledList = listItems.filter((item) => !item.disabled);
    const allItemLength = notDisabledList.length;

    if (!values.includes(ALL_SELECT_VALUE) && values.length == allItemLength - 1) {
      values.push(ALL_SELECT_VALUE);
    }

    let isAll = false;
    if (this.useIncludeAllOption) {
      if (values.includes(ALL_SELECT_VALUE)) {
        values = notDisabledList.map((item) => item[valueKey]);
        this.selectValues = values;
        isAll = true;
      }
    }

    this.selectLabelElement.textContent = this.getLabel(values).join(this.valueDelimiter);

    this.selectValues = values;

    this.changeValue(values);

    if (!this.listElement) {
      return;
    }

    const listElement = this.listElement;

    if (isAll) {
      addClass(listElement.querySelectorAll('.dg-dropdown-item:not(.disabled)'), SELECTED_STYLE_CLASS);
      return;
    }

    removeClass(listElement.querySelectorAll('.dg-dropdown-item.' + SELECTED_STYLE_CLASS), SELECTED_STYLE_CLASS);

    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      const val = listItem[valueKey];

      if (values.includes(val)) {
        const element = listElement.querySelector(`.dg-dropdown-item[data-index="${i}"]`);

        if (element) element.classList.add(SELECTED_STYLE_CLASS);
      }
    }
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

      html.push(`<div data-index="${i}" class="${className}">${item[labelKey] ?? ''}</div>`);
    }

    return html.join('');
  }

  public getValue() {
    return this.selectValues;
  }
}
