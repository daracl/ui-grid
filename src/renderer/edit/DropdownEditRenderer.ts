import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';
import { uniqueListItem } from '@/util/rendererUtils';

const SELECTED_STYLE_CLASS = 'selected';

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

    const cellPosition = cellInfo.c + '';

    const cfg = this.gridMain.config();

    cfg.activeComponent = cellPosition;

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector('.dg-cell-content') as HTMLElement;

    let dropdownElement = this.dropdownElement;
    if (!dropdownElement) {
      dropdownElement = getLayerElement('div', 'dg-dropdown-menu ' + FIELD_LAYER_CLASS, cellPosition);

      this.rendererContainer.appendChild(dropdownElement);
      this.dropdownElement = dropdownElement;
    }

    let list = this.field.editRenderer.listItem?.list;

    const value = cellInfo.item[this.fieldName];

    if (isArray(list)) {
      list = uniqueListItem(list, this.valueKey);
      dropdownElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(cellElement, dropdownElement, eventElement, cellInfo, list);
    } else if (isFunction(list)) {
      list(cellInfo, (result: any[]) => {
        result = uniqueListItem(result, this.valueKey);
        dropdownElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(cellElement, dropdownElement, eventElement, cellInfo, result);
      });
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
  private openMenu(
    cellElement: HTMLElement,
    dropdownElement: HTMLElement,
    eventElement: HTMLElement,
    cellInfo: CellInfo,
    list: any[],
  ) {
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
          currentValue = stringSplit(currentValue, this.valueDelimiter);
        }

        const valueKey = this.valueKey;

        if (addValue == ALL_SELECT_VALUE) {
          const allItemElement = dropdownElement.querySelectorAll('.dg-dropdown-item:not(.disabled)');
          if (allItemLength == currentValue.length) {
            this.setValue(e, cellInfo.item, '');

            removeClass(allItemElement, SELECTED_STYLE_CLASS);
          } else {
            const newValue = notDisabledList
              .map((item) => {
                return item[valueKey];
              })
              .join(this.valueDelimiter);

            this.setValue(e, cellInfo.item, newValue);

            addClass(allItemElement, SELECTED_STYLE_CLASS);
          }
        } else {
          const validValues = notDisabledList.map((item) => {
            return item[valueKey];
          });

          const newValue = addValueIfMissing(
            cellInfo.item[this.fieldName],
            addValue,
            false,
            this.valueDelimiter,
            validValues,
          );

          this.setValue(e, cellInfo.item, newValue.join(this.valueDelimiter));

          if (allItemLength == newValue.length) {
            addClass(dropdownElement.querySelectorAll('.dg-dropdown-item:not(.disabled)'), SELECTED_STYLE_CLASS);
          } else {
            removeClass(
              dropdownElement.querySelectorAll('.dg-dropdown-item[data-dg-value="' + ALL_SELECT_VALUE + '"]'),
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

  private dropdownMenuTemplate(list: any[], value: string | string[]): string {
    if (!isArray(list) || list.length === 0) return '';

    const templateParts: string[] = [];

    let valueSet;
    if (isString(value)) {
      valueSet = new Set(stringSplit(value || '', this.valueDelimiter));
    } else {
      valueSet = new Set(value);
    }

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
