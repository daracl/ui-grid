import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { listToValueLabelMap } from '@/util/rendererUtils';

const SELECTED_STYLE_CLASS = 'selected';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ToolBarRenderer}
 */
export class DropdownRenderer extends ToolBarRenderer {
  private dropdownElement: HTMLElement;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;
  private valueLabelMap: Map<string, any>;

  private selectValues = '';

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);

    if (rendererInfo?.listItem) {
      this.isMultiple = rendererInfo.listItem?.multiple ?? false;
      this.valueDelimiter = rendererInfo.listItem?.delimiter ?? ',';

      const list = rendererInfo.listItem?.list;
      if (isArray(list)) {
        this.valueLabelMap = listToValueLabelMap(list, this.labelKey, this.valueKey);
      } else if (isFunction(list)) {
        list({ init: true }, (result: any[]) => {
          this.valueLabelMap = listToValueLabelMap(result, this.labelKey, this.valueKey);
        });
      }
    } else {
      this.valueDelimiter = ',';
      this.isMultiple = false;
      this.valueLabelMap = new Map<string, any>();
    }
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const contentElement = document.createElement('div');
    contentElement.className = this.getRendererStyleClass('dg-cell-content');

    const text = document.createElement('div');

    text.className = 'dg-cell-content-label ';
    const icon = document.createElement('div');
    icon.className = 'dg-cell-content-icon';

    contentElement.appendChild(text);
    contentElement.appendChild(icon);

    controlElement.appendChild(contentElement);

    this.initEvent(contentElement);

    const textElement = contentElement.querySelector('.dg-cell-content-label') as HTMLElement;

    let viewLabel = '';
    if (this.valueLabelMap.size > 0) {
      const value = this.field.defaultValue ?? '';
      let labels = this.getLabel(value);

      if (labels.length < 1 && this.field.defaultValue) {
        labels = this.getLabel(this.field.defaultValue);
      }
      viewLabel = labels.join(this.valueDelimiter);
    }
    textElement.textContent = viewLabel;
  }

  public getLabel(value: string | string[]) {
    let valueSet;
    if (isString(value)) {
      valueSet = new Set(stringSplit(value || '', this.valueDelimiter));
    } else {
      valueSet = new Set(value);
    }

    const values = Array.from(valueSet);

    const labels: string[] = [];

    const valueLabelMap = this.valueLabelMap;

    for (const val of values) {
      if (valueLabelMap.has(val)) {
        labels.push(valueLabelMap.get(val));
      }
    }
    return labels;
  }

  initEvent(contentElement: HTMLElement) {
    this.cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      this.click(e, contentElement);

      this.editRender(contentElement);
    });
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }

  private editRender(eventElement: HTMLElement) {
    const layerId = this.field.$uid;

    const cfg = this.gridMain.config();

    cfg.activeComponent = layerId;

    //const eventElement = element.querySelector('.dg-cell-content') as HTMLElement;

    let dropdownElement = this.dropdownElement;
    if (!dropdownElement) {
      dropdownElement = getLayerElement('div', 'dg-dropdown-menu ' + FIELD_LAYER_CLASS, layerId);

      this.rendererContainer.appendChild(dropdownElement);
      this.dropdownElement = dropdownElement;
    }

    let list = this.field.renderer.listItem?.list;

    const value = (this.field.defaultValue ?? '').split(this.valueDelimiter);

    if (isArray(list)) {
      list = this.uniqueListItem(list);
      dropdownElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(eventElement, dropdownElement, list);
    } else if (isFunction(list)) {
      list(this.field, (result: any[]) => {
        result = this.uniqueListItem(result);
        dropdownElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(eventElement, dropdownElement, result);
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
  private openMenu(cellElement: HTMLElement, dropdownElement: HTMLElement, list: any[]) {
    const elementRect = getElementRect(cellElement);

    const menuStyle = dropdownElement.style;

    menuStyle.height = 'auto';
    this.gridMain.openLayer(dropdownElement);
    menuStyle.width = `${elementRect.width}px`;

    const openPosition = innerLayerPosition(this.rendererContainer, cellElement, dropdownElement);

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
