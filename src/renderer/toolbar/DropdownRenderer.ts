import { ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { bindHideOnBlur, normalizeChoiceOptions, uniqueListItem } from '@/util/rendererUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { isArray, isFunction, isString, removeItem, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';

const SELECTED_STYLE_CLASS = 'selected';

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

      const list = rendererInfo.listItem?.list;
      if (isArray(list)) {
        const reval = normalizeChoiceOptions(list, this.labelKey, this.valueKey);
        this.listItems = uniqueListItem(reval.list, this.valueKey);

        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result: any[]) => {
          const reval = normalizeChoiceOptions(result, this.labelKey, this.valueKey);
          this.listItems = uniqueListItem(reval.list, this.valueKey);
          this.valueLabelMap = reval.map;
        });
      }
    } else {
      this.valueDelimiter = ',';
      this.isMultiple = false;
      this.valueLabelMap = new Map<string, any>();
    }

    this.selectValues = stringSplit(this.field.defaultValue || '', this.valueDelimiter);
    this.useIncludeAllOption = this.isMultiple && (this.field.renderer.listItem?.includeAllOption ?? false);
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const buttonElement = document.createElement('button');
    buttonElement.className = this.getRendererStyleClass('dg-dropdown-button');

    const text = document.createElement('div');
    text.className = 'dg-dropdown-label';

    const icon = document.createElement('div');
    icon.className = 'dg-dropdown-icon';

    buttonElement.appendChild(text);
    buttonElement.appendChild(icon);

    controlElement.appendChild(buttonElement);

    this.initEvent(buttonElement);

    let viewLabel = '';
    if (this.valueLabelMap.size > 0) {
      const labels = this.getLabel(this.selectValues);
      viewLabel = labels.join(this.valueDelimiter);
    }
    text.textContent = viewLabel;
    this.selectLabelElement = text;
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

    const list = this.listItems;

    if (this.useIncludeAllOption) {
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

    cfg.eventManager.on({ el: items, type: 'click' }, (e: UIEvent) => {
      const target = e.target as HTMLElement;
      const addItemIndex = Number(target.dataset.index || '0');

      if (target.classList.contains('disabled')) {
        return;
      }

      toggleClass(target, SELECTED_STYLE_CLASS);

      const addItem = list[addItemIndex];

      const addItemValue = addItem[this.valueKey];

      if (isMultiple) {
        const notDisabledList = list.filter((item) => !item.disabled);
        const allItemLength = notDisabledList.length;
        const currentValue = this.selectValues;

        const valueKey = this.valueKey;

        if (addItemValue == ALL_SELECT_VALUE) {
          const allItemElement = listElement.querySelectorAll('.dg-dropdown-item:not(.disabled)');

          if (allItemLength == currentValue.length) {
            this.selectValues = [];

            removeClass(allItemElement, SELECTED_STYLE_CLASS);
          } else {
            const newValue = notDisabledList.map((item) => {
              return item[valueKey];
            });

            this.selectValues = newValue;

            addClass(allItemElement, SELECTED_STYLE_CLASS);
          }
        } else {
          if (this.selectValues.includes(addItemValue)) {
            this.selectValues = removeItem(this.selectValues, addItemValue);
          } else {
            this.selectValues.push(addItemValue);
          }

          if (this.useIncludeAllOption) {
            if (!this.selectValues.includes(ALL_SELECT_VALUE) && allItemLength - 1 == this.selectValues.length) {
              addClass(listElement.querySelectorAll('.dg-dropdown-item:not(.disabled)'), SELECTED_STYLE_CLASS);
            } else {
              removeClass(listElement.querySelectorAll('.dg-dropdown-item[data-index="0"]'), SELECTED_STYLE_CLASS);
            }
          }
        }
      } else {
        this.selectValues = this.selectValues.includes(addItemValue) ? [] : [addItemValue];
      }

      this.changeValue(e, target, this.selectValues);

      this.selectLabelElement.textContent = this.getLabel(this.selectValues).join(this.valueDelimiter);

      if (!isMultiple) {
        cfg.eventManager.off(items, 'click');
        menuStyle.display = 'none';
      }
    });
  }

  public setValue(value: string | string[]) {
    const values = isString(value) ? (value ?? '').split(this.valueDelimiter) : value;

    const listItems = this.listItems;

    const valueKey = this.valueKey;
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      const val = listItem[valueKey];

      if (values.includes(val)) {
        const element = this.listElement.querySelector(`.dg-dropdown-item[data-index="${i}"]`);

        if (element) element.classList.add(SELECTED_STYLE_CLASS);
      }
    }
  }

  private dropdownMenuTemplate(list: any[]): string {
    if (!isArray(list) || list.length === 0) return '';

    const templateParts: string[] = [];

    for (let itemIdx = 0; itemIdx < list.length; itemIdx++) {
      const item = list[itemIdx];
      const label = item?.[this.labelKey] ?? '';

      // 비활성화 상태 클래스
      const isDisabled = !!item?.disabled;

      const classes = [isDisabled ? 'disabled' : ''].join(' ');

      templateParts.push(`<div data-index="${itemIdx}" class="dg-dropdown-item ${classes}">${label}</div>`);
    }

    return templateParts.join('');
  }

  public getValue() {
    return this.selectValues;
  }
}
