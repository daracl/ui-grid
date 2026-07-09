import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { normalizeChoiceOptions } from '@/util/rendererUtils';
import { isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { SELECTED_STYLE_CLASS } from '@/constantStyles';

/**
 * Selection renderer
 *
 * @class ChoiceRenderer
 * @typedef {ChoiceRenderer}
 * @extends {ToolBarRenderer}
 */
export class ChoiceRenderer extends ToolBarRenderer {
  private readonly showLabel: boolean;

  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;
  private valueLabelMap: Map<string, any>;

  private listItems: any[] = [];

  private selectValues = '';
  private labelOnly = true;

  private choiceContainer: HTMLElement;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);

    this.selectValues = this.field.defaultValue ?? '';

    const listItem = rendererInfo?.listItem;

    if (listItem) {
      this.labelOnly = listItem.labelOnly ?? true;
      this.isMultiple = listItem.multiple ?? true;
      this.valueDelimiter = listItem.delimiter ?? ',';

      const list = listItem.list;
      if (isArray(list)) {
        const reval = normalizeChoiceOptions(list, this.labelKey, this.valueKey);

        this.listItems = this.uniqueListItem(reval.list);
        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result: any[]) => {
          const reval = normalizeChoiceOptions(result, this.labelKey, this.valueKey);
          this.listItems = this.uniqueListItem(reval.list);
          this.valueLabelMap = reval.map;
        });
      }
    } else {
      this.valueDelimiter = ',';
      this.isMultiple = true;
      this.valueLabelMap = new Map<string, any>();
    }
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const choiceContainer = document.createElement('div');
    choiceContainer.className = this.getRendererStyleClass('');

    const value = (this.selectValues ?? '').split(this.valueDelimiter);

    choiceContainer.innerHTML = this.template(this.listItems, value);

    controlElement.appendChild(choiceContainer);

    this.initEvt(choiceContainer);

    this.choiceContainer = choiceContainer;
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

  initEvt(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    const isMultiple = this.isMultiple;
    const choiceElements = contentElement.querySelectorAll('.dg-choice');

    cfg.eventManager.on({ el: choiceElements, type: 'click' }, (e: UIEvent) => {
      const choiceElement = e.currentTarget as HTMLElement;

      if (isMultiple) {
        if (choiceElement.classList.contains(SELECTED_STYLE_CLASS)) {
          choiceElement.classList.remove(SELECTED_STYLE_CLASS);
        } else {
          choiceElement.classList.add(SELECTED_STYLE_CLASS);
        }
      } else {
        choiceElements.forEach((element) => {
          if (element != choiceElement) {
            element.classList.remove(SELECTED_STYLE_CLASS);
          }
        });

        if (!choiceElement.classList.contains(SELECTED_STYLE_CLASS)) {
          choiceElement.classList.add(SELECTED_STYLE_CLASS);
        }
      }

      this.selectValues = this.getValue();

      if (this.selectValues == '') {
        this.setValue(this.field.defaultValue ?? '');
      }

      this.changeValue(e, contentElement, this.selectValues);
    });
  }

  public getValue() {
    const values = Array.from(
      this.choiceContainer.querySelectorAll<HTMLElement>('.dg-choice.' + SELECTED_STYLE_CLASS),
    ).map((ele) => {
      const index = ele.dataset.index;
      if (index) return this.listItems[parseInt(index, 10)][this.valueKey];
    });

    return values.join(this.valueDelimiter);
  }

  public setValue(value: string | string[]) {
    const values = isString(value) ? (value ?? '').split(this.valueDelimiter) : value;
    //
    //처리할것.
    //
    //
    for (const item of this.listItems) {
      //
    }
  }

  private template(list: any[], value: string | string[]): string {
    if (!isArray(list) || list.length === 0) return '';

    const templateParts: string[] = [];

    let valueSet;
    if (isString(value)) {
      valueSet = new Set(stringSplit(value || '', this.valueDelimiter));
    } else {
      valueSet = new Set(value);
    }

    const isStringValue = isString(list[0]);
    const inputType = this.isMultiple ? 'checkbox' : 'radio';
    const isLabelOnly = this.labelOnly;
    let itemIdx = -1;
    for (const item of list) {
      let val: string;
      let label: string;
      itemIdx++;

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

      const classes = [
        isSelected ? SELECTED_STYLE_CLASS : '',
        isDisabled ? 'disabled' : '',
        isLabelOnly ? 'dg-label-only' : '',
        inputType,
      ]
        .filter((item) => item)
        .join(' ');

      const checkTemplate = `<div class="dg-choice ${classes}" data-index="${itemIdx}">
        ${isLabelOnly ? '' : '<div class="dg-indicator"></div>'}
        <span class="dg-label dg-ellipsis">${label}</span>
      </div>`;

      templateParts.push(checkTemplate);
    }

    return templateParts.join('');
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }
}
