import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { ToolbarFieldItem } from '@/types/Toolbar';

const SELECTED_STYLE_CLASS = 'selected';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ToolBarRenderer}
 */
export class DropdownRenderer extends ToolBarRenderer {
  private menuElement: HTMLElement;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;

  private selectValues = '';

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
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

  public render(cellElement: HTMLElement): void {
    const cellPosition = '';
    const eventElement = cellElement.querySelector('.dg-cell-content') as HTMLElement;

    const dropdwonElement = getLayerElement('div', 'dg-dropdown-menu toolbar ' + FIELD_LAYER_CLASS, cellPosition);

    cellElement.appendChild(dropdwonElement);

    let list = this.field.editRenderer.listItem?.list;

    const value = this.field.defaultValue;

    if (isArray(list)) {
      list = this.uniqueListItem(list);
      dropdwonElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(cellElement, dropdwonElement, eventElement, list);
    } else if (isFunction(list)) {
      list(this.field, (result: any[]) => {
        result = this.uniqueListItem(result);
        dropdwonElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(cellElement, dropdwonElement, eventElement, result);
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

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} dropdownElement dropdown element
   * @param {HTMLElement} eventElement click element
   * @param {any[]} list list item
   */
  private openMenu(cellElement: HTMLElement, dropdownElement: HTMLElement, eventElement: HTMLElement, list: any[]) {
    const elementRect = getElementRect(eventElement);

    const menuStyle = dropdownElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(cellElement, eventElement, dropdownElement);

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
        let currentValue = [];

        if (isString(this.selectValues)) {
          currentValue = stringSplit(this.selectValues, this.valueDelimiter);
        }

        const valueKey = this.valueKey;

        if (addValue == ALL_SELECT_VALUE) {
          const allItemElement = dropdownElement.querySelectorAll('.dg-dropdown-item:not(.disabled)');
          if (allItemLength == currentValue.length) {
            this.selectValues = '';

            removeClass(allItemElement, SELECTED_STYLE_CLASS);
          } else {
            const newValue = notDisabledList
              .map((item) => {
                return item[valueKey];
              })
              .join(this.valueDelimiter);

            this.selectValues = newValue;

            addClass(allItemElement, SELECTED_STYLE_CLASS);
          }
        } else {
          const validValues = notDisabledList.map((item) => {
            return item[valueKey];
          });

          const newValue = addValueIfMissing(this.selectValues, addValue, false, this.valueDelimiter, validValues);

          this.selectValues = newValue.join(this.valueDelimiter);

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
        this.selectValues = addValue || '';
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

  public getValue() {
    return '';
  }
}
