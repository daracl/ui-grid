import { ToolbarFieldItem } from '@/types/Toolbar';
import { ValidResult } from '@/types/ValidResult';
import { GridMain } from '@/view/GridMain';
import { ToolBarRenderer } from '../ToolBarRenderer';
import { valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { normalizeChoiceOptions } from '@/util/rendererUtils';
import { isArray, isFunction, isString, stringSplit } from '@/util/utils';

const SELECTED_STYLE_CLASS = 'selected';
/**
 * checkbox renderer
 *
 * @class CheckboxRenderer
 * @typedef {CheckboxRenderer}
 * @extends {ToolBarRenderer}
 */
export class CheckboxRenderer extends ToolBarRenderer {
  private readonly showLabel: boolean;

  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;
  private valueLabelMap: Map<string, any>;

  private listItems: any[] = [];

  private selectValues = '';
  private labelOnly = true;

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

        this.listItems = reval.list;
        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result: any[]) => {
          const reval = normalizeChoiceOptions(result, this.labelKey, this.valueKey);
          this.listItems = reval.list;
          this.valueLabelMap = reval.map;
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

    let list = this.listItems;

    const value = (this.selectValues ?? '').split(this.valueDelimiter);

    list = this.uniqueListItem(list);

    controlElement.innerHTML = this.checkboxTemplate(list, value);

    //this.initClick(input);

    /* 
    초기 체크 처리 할 것
    const input = label.firstChild as HTMLInputElement;
    input.checked = val === this.trueValue;
    */
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

  initClick(contentElement: HTMLInputElement) {
    const cfg = this.gridMain.config();

    cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const checked = contentElement.checked;

      // set value 처리할것
      // this.setValue(e, checked ? this.trueValue : this.falseValue);
    });
  }

  public getValue() {
    return '';
  }

  private checkboxTemplate(list: any[], value: string | string[]): string {
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
    const isLabelOnly = this.labelOnly;

    const uid = this.field.$uid;

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

      const classes = [
        isSelected ? SELECTED_STYLE_CLASS : '',
        isDisabled ? 'disabled' : '',
        isLabelOnly ? 'dg-label-only' : '',
      ].join(' ');

      const checkTemplate = `<label class="${classes}"><input type="checkbox" name="${uid}">
        <span class="dg-checkmark"></span>
        <span class="dg-cell-content-label dg-cell-ellipsis">${label}</span></label>`;

      templateParts.push(checkTemplate);
    }

    return templateParts.join('');
  }

  public valid(value: any): ValidResult | boolean {
    return true;
  }
}
