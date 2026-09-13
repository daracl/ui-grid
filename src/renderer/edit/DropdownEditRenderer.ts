import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { getListItemValue, valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import {
  bindHideOnBlur,
  normalizeChoiceOptions,
  uniqueListItem,
  updateDropdownSelection,
  updateSelectValues,
} from '@/util/rendererUtils';
import { isArray, isFunction, isNumber, isString, replaceXss, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { getRendererVariantClass } from '@/util/styleUtils';

/**
 * dropdown edit renderer
 *
 * @class DropdownEditRenderer
 * @typedef {DropdownEditRenderer}
 * @extends {EditCellRenderer}
 */
export class DropdownEditRenderer extends EditCellRenderer {
  private dropdownElement: HTMLElement;
  private currentEditRow: number;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;

  private listItems: any[] = [];

  private readonly useIncludeAllOption: boolean;
  private readonly required: boolean;

  private currentCellInfo: CellInfo;

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
    this.required = this.field.editRenderer.required ?? false;
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

    this.currentCellInfo = cellInfo;

    const colIdx = String(cellInfo.c);

    this.gridMain.config().activeComponent = colIdx;

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector('.dg-cell-renderer') as HTMLElement;

    let dropdownElement = this.dropdownElement;
    if (!dropdownElement) {
      const variantClass = getRendererVariantClass(this.field.editRenderer);
      dropdownElement = getLayerElement('div', `dg-dropdown-menu ${FIELD_LAYER_CLASS} ${variantClass}`, colIdx);

      this.rendererContainer.appendChild(dropdownElement);
      this.dropdownElement = dropdownElement;

      this.initDropdownEvt();
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
      this.openMenu(dropdownElement, eventElement);

      this.setDropItemCheck(this.getValue(cellInfo.item, cellInfo.inputValue));
    };

    if (Array.isArray(list)) {
      renderDropdown(list);
    } else if (isFunction(list)) {
      list(cellInfo, renderDropdown);
    }
  }

  initDropdownEvt() {
    const cfg = this.gridMain.config();
    const dropdownElement = this.dropdownElement;

    const { valueKey, valueDelimiter, isMultiple, required } = this;

    cfg.eventManager.on({ el: dropdownElement, type: 'click', selector: '.dg-dropdown-item' }, (e: UIEvent) => {
      const target = e.target as HTMLElement;

      const addItemIndex = Number(target.dataset.index || '0');

      if (target.classList.contains('disabled')) {
        return;
      }
      const listItems = this.listItems;
      const cellInfo = this.currentCellInfo;

      const enabledItems = listItems.filter((item) => !item.disabled);
      const enabledValues = enabledItems.map((item) => {
        return item[valueKey];
      });

      const itemValue = this.getValue(cellInfo.item, cellInfo.inputValue);
      const currentValues: string[] = getListItemValue(itemValue, valueDelimiter);

      const addItemValue = listItems[addItemIndex][valueKey];

      const selectValues = updateSelectValues(currentValues, addItemValue, isMultiple, enabledValues, required);

      this.setValue(e, cellInfo.item, selectValues.join(valueDelimiter));

      this.setDropItemCheck(selectValues);

      if (!isMultiple) {
        dropdownElement.style.display = 'none';
      }

      this.completeEdit();
    });
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   */
  private openMenu(dropdownElement: HTMLElement, eventElement: HTMLElement) {
    const elementRect = getElementRect(eventElement);

    const menuStyle = dropdownElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, eventElement, dropdownElement);

    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;

    //bindHideOnBlur(dropdownElement, this.gridMain.config().eventManager);
  }

  public setDropItemCheck(value: string | string[] = '') {
    const values = getListItemValue(value, this.valueDelimiter);

    let isAll = false;
    if (this.useIncludeAllOption) {
      if (values.includes(ALL_SELECT_VALUE)) {
        isAll = true;
      }
    }

    updateDropdownSelection(this.dropdownElement, this.listItems, values, this.valueKey, isAll);
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

      const labelValue = item[labelKey] ?? '';

      html.push(`<div data-index="${i}" class="${className}">${replaceXss(String(labelValue))}</div>`);
    }

    return html.join('');
  }
}
