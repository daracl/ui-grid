import { ALIGN_STYLE, ALL_SELECT_VALUE, FIELD_LAYER_CLASS } from '@/constants';
import { getElementRect, getLayerElement, innerLayerPosition } from '@/util/domUtils';
import { getCellInfo, valuesLabelKey, valuesValueKey } from '@/util/gridUtils';
import { addClass, removeClass, toggleClass } from '@/util/styleUtils';
import { addValueIfMissing, isArray, isFunction, isString } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';

const SELECTED_STYLE_CLASS = 'selected';

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewRenderer}
 */
export class DropdownRenderer extends ViewRenderer {
  private menuElement: HTMLElement;
  private currentEditRow: number;
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly rendererContainer: HTMLElement;
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

    this.rendererContainer = this.gridMain.getRendererContainer();

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
      textElement.textContent = refValue.label ?? value;
    } else {
      let viewLabel = value;
      if (this.valueLabelMap.size > 0) {
        const valueSet = new Set(this.valueSplit(value));
        const values = Array.from(valueSet);

        const labels: string[] = [];

        const valueLabelMap = this.valueLabelMap;

        for (const val of values) {
          if (valueLabelMap.has(val)) {
            labels.push(valueLabelMap.get(val));
          }
        }
        viewLabel = labels.join(this.valueDelimiter);
      }
      textElement.textContent = viewLabel;
    }
  }

  initEvent(contentElement: HTMLElement) {
    this.cfg.eventManager.on({ el: contentElement, type: 'click' }, (e: UIEvent) => {
      const eventElement = e.target as HTMLElement;
      const cellElement = eventElement.closest('.dg-cell') as HTMLElement;
      const cellInfo = getCellInfo(this.cfg, cellElement);

      this.click(e, cellElement, cellInfo);
    });
  }

  public click(e: Event, cellElement: HTMLElement, cellInfo: CellInfo) {
    console.log('1111111111111111 : ', cellInfo, this.currentEditRow, cellInfo.rowIndex);

    if (this.currentEditRow == cellInfo.rowIndex) {
      if (window.getComputedStyle(this.menuElement).display == 'block') {
        this.menuElement.style.display = 'none';
        return;
      }
    }

    this.field.$editRenderer.render(cellInfo, cellElement);
  }

  private valueSplit(val: string) {
    return ((val || '') + '').split(this.valueDelimiter);
  }

  public canEdit() {
    return true;
  }

  public alignStyle(): string {
    return ALIGN_STYLE.center;
  }
}
