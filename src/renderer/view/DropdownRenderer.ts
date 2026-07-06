import { ALIGN_STYLE } from '@/constants';
import { getCellInfo, valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { normalizeChoiceOptions } from '@/util/rendererUtils';
import { isArray, isFunction, isString, stringSplit } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewRenderer}
 */
export class DropdownRenderer extends ViewRenderer {
  private readonly valueDelimiter: string;

  private listItems: any[] = [];

  private valueLabelMap: Map<string, any>;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const editInfo = this.field.editRenderer;
    const labelKey = valuesLabelKey(editInfo);
    const valueKey = valuesValueKey(editInfo);

    if (editInfo?.listItem) {
      this.valueDelimiter = editInfo.listItem?.delimiter ?? ',';

      const list = editInfo.listItem?.list;
      if (isArray(list)) {
        const reval = normalizeChoiceOptions(list, labelKey, valueKey);

        this.listItems = reval.list;
        this.valueLabelMap = reval.map;
      } else if (isFunction(list)) {
        list({ init: true }, (result: any[]) => {
          const reval = normalizeChoiceOptions(result, labelKey, valueKey);
          this.listItems = reval.list;
          this.valueLabelMap = reval.map;
        });
      }
    } else {
      this.valueDelimiter = ',';
      this.valueLabelMap = new Map<string, any>();
    }
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);

    let contentElement = element.firstElementChild as HTMLElement;

    // 처음 생성 시
    if (!contentElement) {
      contentElement = document.createElement('div');
      contentElement.className = this.getRendererStyleClass('dg-cell-content');

      const text = document.createElement('div');

      text.className = 'dg-cell-content-label ' + this.field.$alignStyle;
      const icon = document.createElement('div');
      icon.className = 'dg-cell-content-icon';

      contentElement.appendChild(text);
      contentElement.appendChild(icon);

      element.appendChild(contentElement);

      this.initEvent(contentElement);
    }

    const textElement = contentElement.querySelector('.dg-cell-content-label') as HTMLElement;

    if (refValue) {
      textElement.textContent = refValue.label ?? refValue;
    } else {
      let viewLabel = value;
      if (this.valueLabelMap.size > 0) {
        let labels = this.getLabel(value);

        if (labels.length < 1 && this.field.defaultValue) {
          labels = this.getLabel(this.field.defaultValue);
        }
        viewLabel = labels.join(this.valueDelimiter);
      }
      textElement.textContent = viewLabel;
    }
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
      const eventElement = e.target as HTMLElement;
      const cellElement = this.getClosestCellElement(eventElement);
      const cellInfo = getCellInfo(this.cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }

  /**
   * click
   * @param e event
   * @param cellElement cell element
   * @param cellInfo cell info
   * @returns
   */
  public click(e: Event, cellElement: HTMLElement, cellInfo: CellInfo) {
    this.field.$editRenderer.render(cellInfo, cellElement);
  }

  public canEdit() {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
