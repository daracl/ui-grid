import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';

const SELECTED_STYLE_CLASS = 'selected';

/**
 * dropdown edit renderer
 *
 * @class DropdownEditRenderer
 * @typedef {DropdownEditRenderer}
 * @extends {EditRenderer}
 */
export class DropdownEditRenderer extends EditRenderer {
  private menuElement: HTMLElement;
  private currentEditRow: number;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;

  private valueLabelMap: Map<string, any>;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    this.isMultiple = rendererInfo.listItem?.multiple ?? false;

    this.valueDelimiter = rendererInfo.listItem?.delimiter ?? ',';

    const list = rendererInfo.listItem?.list;
    if (isArray(list)) {
      this.initListItem(list);
    } else if (isFunction(list)) {
      list({ init: true }, (result: any[]) => {
        this.initListItem(result);
      });
    }
  }
  private initListItem(list: any[]) {
    const valueLabelMap = new Map<string, any>();
    const isStringValue = isString(list[0]);
    for (const item of list) {
      let val: string;
      let label: string;

      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item?.[this.valueKey] ?? '';
        label = item?.[this.labelKey] ?? '';
      }
      valueLabelMap.set(val, label);
    }

    this.valueLabelMap = valueLabelMap;
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  public render(cellInfo: CellInfo, cellElement: HTMLElement): void {
    if (this.currentEditRow == cellInfo.rowIndex) {
      if (window.getComputedStyle(this.menuElement).display == 'block') {
        this.menuElement.style.display = 'none';
        return;
      }
    }

    //console.log("activeComponent  : ", this.currentEditRow == cellInfo.rowIndex ? window.getComputedStyle(this.menuElement).display : "", cellInfo);

    const cellPosition = cellInfo.c + '';

    const cfg = this.gridMain.config();

    cfg.activeComponent = cellPosition;

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector('.dg-cell-content') as HTMLElement;

    let menuElement = this.menuElement;
    if (!menuElement) {
      menuElement = getLayerElement('div', 'dg-dropdown-menu ' + FIELD_LAYER_CLASS, cellPosition);

      this.rendererContainer.appendChild(menuElement);
      this.menuElement = menuElement;
    }

    let list = this.field.renderer.listItem?.list;

    const value = cellInfo.item[this.fieldName];

    if (isArray(list)) {
      list = this.uniqueListItem(list);
      menuElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(cellElement, menuElement, eventElement, cellInfo, list);
    } else if (isFunction(list)) {
      list(cellInfo, (result: any[]) => {
        result = this.uniqueListItem(result);
        menuElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(cellElement, menuElement, eventElement, cellInfo, result);
      });
    }
  }

  private uniqueListItem(list: any[]) {
    const seen = new Set();
    const valueKey = this.valueKey;
    const uniqueArr = list.filter((item) => {
      if (seen.has(item[valueKey])) return false;
      seen.add(item[valueKey]);
      return true;
    });
    return uniqueArr;
  }

  private valueSplit(val: string) {
    return ((val || '') + '').split(this.valueDelimiter);
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} menuElement dropdown element
   * @param {HTMLElement} eventElement click element
   * @param {CellInfo} cellInfo cell info
   * @param {any[]} list list item
   */
  private openMenu(
    cellElement: HTMLElement,
    menuElement: HTMLElement,
    eventElement: HTMLElement,
    cellInfo: CellInfo,
    list: any[],
  ) {
    const elementRect = getElementRect(eventElement);

    const menuStyle = menuElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(menuElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, eventElement, menuElement);

    menuStyle.top = `${openPosition.top}px`;
    menuStyle.left = `${openPosition.left}px`;
    menuStyle.height = `${openPosition.height}px`;

    const items = menuElement.querySelectorAll('.dg-dropdown-item');

    const isMultiple = this.isMultiple;

    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: items, type: 'click' }, (e: UIEvent) => {
      const target = e.target as HTMLElement;
      const addValue = target.getAttribute('data-dg-value');

      if (target.classList.contains('disabled')) {
        return;
      }

      toggleClass(target, SELECTED_STYLE_CLASS);

      if (isMultiple) {
        const notDisabledList = list.filter((item) => !item.disabled);
        const allItemLength = notDisabledList.length;
        let currentValue = this.getValue(cellInfo.item) ?? '';

        if (isString(currentValue)) {
          currentValue = currentValue.split(this.valueDelimiter);
        }

        if (addValue == ALL_SELECT_VALUE) {
          const allItemElement = menuElement.querySelectorAll('.dg-dropdown-item:not(.disabled)');
          if (allItemLength == currentValue.length) {
            this.setValue(e, cellInfo.item, '');

            removeClass(allItemElement, SELECTED_STYLE_CLASS);
          } else {
            const valueKey = this.valueKey;
            const newValue = notDisabledList
              .map((item) => {
                return item[valueKey];
              })
              .join(this.valueDelimiter);

            this.setValue(e, cellInfo.item, newValue);

            addClass(allItemElement, SELECTED_STYLE_CLASS);
          }
        } else {
          const newValue = addValueIfMissing(cellInfo.item[this.fieldName], addValue, false, this.valueDelimiter);

          this.setValue(e, cellInfo.item, newValue.join(this.valueDelimiter));

          if (allItemLength == newValue.length) {
            addClass(menuElement.querySelectorAll('.dg-dropdown-item:not(.disabled)'), SELECTED_STYLE_CLASS);
          } else {
            removeClass(
              menuElement.querySelectorAll('.dg-dropdown-item[data-dg-value="' + ALL_SELECT_VALUE + '"]'),
              SELECTED_STYLE_CLASS,
            );
          }
        }
      } else {
        this.setValue(e, cellInfo.item, addValue || '');
      }

      if (!isMultiple) {
        cfg.eventManager.off(items, 'click');
        menuStyle.display = 'none';
      }
    });
  }

  private dropdownMenuTemplate(list: any[], value: string): string {
    if (!isArray(list) || list.length === 0) return '';

    const templateParts: string[] = [];

    const valueSet = new Set(this.valueSplit(value));

    const isStringValue = isString(list[0]);
    const isMultiple = this.isMultiple;

    if (isMultiple) {
      templateParts.push(
        `<div data-dg-value="${ALL_SELECT_VALUE}" class="dg-dropdown-item dg-all ${
          list.length == valueSet.size ? SELECTED_STYLE_CLASS : ''
        }">${this.language.getMessage('select.all')}</div>`,
      );
    }

    for (const item of list) {
      let val: string;
      let label: string;

      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item?.[this.valueKey] ?? '';
        label = item?.[this.labelKey] ?? '';
      }

      // 선택됨/비활성화 상태 클래스
      const isSelected = valueSet.has(val);
      const isDisabled = !!item?.disabled;

      const classes = [isSelected ? SELECTED_STYLE_CLASS : '', isDisabled ? 'disabled' : ''].join(' ');

      templateParts.push(`<div data-dg-value="${val}" class="dg-dropdown-item ${classes}">${label}</div>`);
    }

    return templateParts.join('');
  }
}
