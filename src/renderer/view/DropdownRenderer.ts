import { ALIGN_STYLE } from '@/constantStyles';
import { getCellInfo, valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { getLabelsByValue, normalizeChoiceOptions } from '@/util/rendererUtils';
import { isArray, isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewCellRenderer}
 */
export class DropdownRenderer extends ViewCellRenderer {
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
      contentElement.className = 'dg-cell-content';

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
    return getLabelsByValue(value, this.valueDelimiter, this.valueLabelMap);
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

  public supportsEdit() {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
