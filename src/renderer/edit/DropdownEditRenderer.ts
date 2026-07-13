import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString, removeItem, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';
import { bindHideOnBlur, normalizeChoiceOptions, uniqueListItem } from '@/util/rendererUtils';
import { SELECTED_STYLE_CLASS } from '@/constantStyles';

/**
 * dropdown edit renderer
 *
 * @class DropdownEditRenderer
 * @typedef {DropdownEditRenderer}
 * @extends {EditRenderer}
 */
export class DropdownEditRenderer extends EditRenderer {
  private dropdownElement: HTMLElement;
  private currentEditRow: number;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;

  private listItems: any[] = [];

  private readonly useIncludeAllOption: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.editRenderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);

    if (rendererInfo?.listItem) {
      this.isMultiple = rendererInfo.listItem?.multiple ?? false;
      this.valueDelimiter = rendererInfo.listItem?.delimiter ?? ',';
    } else {
      this.valueDelimiter = ',';
      this.isMultiple = false;
    }

    this.useIncludeAllOption = this.isMultiple && (rendererInfo.listItem?.includeAllOption ?? true);
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  public render(cellInfo: CellInfo, cellElement: HTMLElement): void {
    if (this.currentEditRow == cellInfo.rowIndex) {
      if (window.getComputedStyle(this.dropdownElement).display == 'block') {
        this.dropdownElement.style.display = 'none';
        return;
      }
    }

    const cellPosition = String(cellInfo.c);

    this.gridMain.config().activeComponent = cellPosition;

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector('.dg-cell-content') as HTMLElement;

    let dropdownElement = this.dropdownElement;
    if (!dropdownElement) {
      dropdownElement = getLayerElement('div', 'dg-dropdown-menu ' + FIELD_LAYER_CLASS, cellPosition);

      this.rendererContainer.appendChild(dropdownElement);
      this.dropdownElement = dropdownElement;
    }
    const rendererInfo = this.field.editRenderer;
    const list = rendererInfo.listItem?.list;

    const { labelKey, valueKey } = this;

    const renderDropdown = (items: any[]) => {
      const { list } = normalizeChoiceOptions(items, labelKey, valueKey);
      const listItems = uniqueListItem(list, valueKey);

      this.listItems = listItems;

      if (this.useIncludeAllOption && listItems.filter((item) => item[valueKey] == ALL_SELECT_VALUE).length < 1) {
        const allItem: any = {};
        allItem[this.valueKey] = ALL_SELECT_VALUE;
        allItem[this.labelKey] = this.language.getMessage('select.all');
        listItems.unshift(allItem);
      }

      dropdownElement.innerHTML = this.dropdownMenuTemplate(listItems);
      this.openMenu(dropdownElement, eventElement, cellInfo, listItems);

      this.setDropItemCheck(this.getValue(cellInfo.item));
    };

    if (Array.isArray(list)) {
      renderDropdown(list);
    } else if (isFunction(list)) {
      list(cellInfo, renderDropdown);
    }
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   * @param {HTMLElement} eventElement click element
   * @param {CellInfo} cellInfo cell info
   * @param {any[]} list list item
   */
  private openMenu(dropdownElement: HTMLElement, eventElement: HTMLElement, cellInfo: CellInfo, listItems: any[]) {
    const elementRect = getElementRect(eventElement);

    const menuStyle = dropdownElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, eventElement, dropdownElement);

    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;

    const items = dropdownElement.querySelectorAll('.dg-dropdown-item');

    const isMultiple = this.isMultiple;

    const cfg = this.gridMain.config();

    bindHideOnBlur(dropdownElement, cfg.eventManager);

    const enabledItems = listItems.filter((item) => !item.disabled);
    const enabledCount = enabledItems.length;

    const valueKey = this.valueKey;
    const enabledValues = enabledItems.map((item) => {
      return item[valueKey];
    });

    cfg.eventManager.on({ el: items, type: 'click' }, (e: UIEvent) => {
      const target = e.currentTarget as HTMLElement;
      const addItemIndex = Number(target.dataset.index || '0');

      if (target.classList.contains('disabled')) {
        return;
      }

      const addItem = listItems[addItemIndex];

      const addItemValue = addItem[this.valueKey];

      const itemValue = this.getValue(cellInfo.item) ?? '';
      let selectValues: string[] = itemValue;

      if (isString(itemValue)) {
        if (itemValue) {
          selectValues = stringSplit(itemValue, this.valueDelimiter);
        } else {
          selectValues = [];
        }
      }

      if (isMultiple) {
        if (addItemValue == ALL_SELECT_VALUE) {
          if (enabledCount == selectValues.length) {
            selectValues = [];
          } else {
            selectValues = enabledValues;
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
      } else if (!selectValues.includes(addItemValue)) {
        selectValues = [addItemValue];
      }

      this.setValue(e, cellInfo.item, selectValues.join(this.valueDelimiter));

      this.setDropItemCheck(selectValues);

      if (!isMultiple) {
        cfg.eventManager.off(items, 'click');
        menuStyle.display = 'none';
      }
    });
  }

  public setDropItemCheck(value: string | string[]) {
    let values = isString(value) ? stringSplit(value, this.valueDelimiter) : value;

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
        isAll = true;
      }
    }

    const listElement = this.dropdownElement;

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
}
