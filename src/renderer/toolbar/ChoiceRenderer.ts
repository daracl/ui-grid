import { SELECTED_STYLE_CLASS } from '@/constantStyles';
import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { normalizeChoiceOptions, uniqueListItem } from '@/util/rendererUtils';
import { intValue, isArray, isFunction, isString, replaceXss, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { createHTMLElement } from '@/util/domUtils';

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

  private selectValues: string[];
  private readonly labelOnly: boolean;

  private choiceContainer: HTMLElement;

  constructor(field: ToolbarFieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);

    this.selectValues = stringSplit(this.field.defaultValue || '', this.valueDelimiter);

    const listItem = rendererInfo?.listItem;
    this.labelOnly = true;

    if (listItem) {
      this.labelOnly = listItem.labelOnly !== false;
      this.isMultiple = listItem.multiple ?? true;
      this.valueDelimiter = listItem.delimiter ?? ',';

      const list = listItem.list;
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
      this.isMultiple = true;
      this.listItems = [];
      this.valueLabelMap = new Map<string, any>();
    }
  }

  public render(element: HTMLElement): void {
    const controlElement = this.getControlElement(element);

    const choiceContainer = createHTMLElement('div', this.getRendererClassName('dg-choice'), '');
    choiceContainer.innerHTML = this.template(this.listItems);
    controlElement.appendChild(choiceContainer);
    this.choiceContainer = choiceContainer;

    this.setValue(this.field.defaultValue ?? '');

    this.initTextEvt(choiceContainer);
  }

  initTextEvt(contentElement: HTMLElement) {
    const cfg = this.gridMain.config();

    const isMultiple = this.isMultiple;
    const choiceElements = contentElement.querySelectorAll('.dg-choice-item');

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

      if (this.selectValues.length < 1) {
        this.setValue(this.field.defaultValue ?? '');
      } else {
        this.setValue(this.selectValues);
      }
    });
  }

  public getValue() {
    const values = Array.from(
      this.choiceContainer.querySelectorAll<HTMLElement>('.dg-choice-item.' + SELECTED_STYLE_CLASS),
    ).map((ele) => {
      const index = ele.dataset.index;
      if (index) return this.listItems[intValue(index)][this.valueKey];
    });

    if (values.length < 1) {
      return [];
    }

    if (this.isMultiple) {
      return values;
    } else {
      return values[0];
    }
  }

  public setValue(value: string | string[]) {
    let values = isString(value) ? (value ?? '').split(this.valueDelimiter) : value;

    if (!this.isMultiple && values.length > 1) {
      values = values.slice(0, 1);
    }

    const listItems = this.listItems;

    const valueKey = this.valueKey;
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];

      const element = this.choiceContainer.querySelector(`.dg-choice-item[data-index="${i}"]`);

      if (element) {
        if (values.includes(listItem[valueKey])) {
          element.classList.add(SELECTED_STYLE_CLASS);
        } else {
          element.classList.remove(SELECTED_STYLE_CLASS);
        }
      }
    }

    this.changeValue(this.selectValues);
  }

  private template(list: any[]): string {
    if (!isArray(list) || list.length === 0) return '';

    const templateParts: string[] = [];

    const inputType = this.isMultiple ? 'dg-checkbox' : 'dg-radio';
    const isLabelOnly = this.labelOnly;

    for (let itemIdx = 0; itemIdx < list.length; itemIdx++) {
      const item = list[itemIdx];

      const label = item?.[this.labelKey] ?? '';

      // 비활성화 상태 클래스
      const isDisabled = !!item?.disabled;

      const classes = [isDisabled ? 'disabled' : '', isLabelOnly ? 'dg-label-only' : '', inputType]
        .filter((item) => item)
        .join(' ');

      const checkTemplate = `<div class="dg-choice-item ${classes}" data-index="${itemIdx}">
        ${isLabelOnly ? '' : '<div class="dg-indicator"></div>'}
        <span class="dg-label dg-ellipsis">${replaceXss(String(label))}</span>
      </div>`;

      templateParts.push(checkTemplate);
    }

    return templateParts.join('');
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }
}
