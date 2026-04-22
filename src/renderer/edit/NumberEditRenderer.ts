import { numberValidator } from '@/rule/numberValidator';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRendererInfo } from '@t/RendererInfo';
import { EditRenderer } from '../EditRenderer';
import { TextAbstractRenderer } from './TextAbstractRenderer';
import { FIELD_LAYER_CLASS } from '@/constants';

/**
 * number renderer
 *
 * @class NumberEditRenderer
 * @typedef {NumberEditRenderer}
 * @extends {EditRenderer}
 */
export class NumberEditRenderer extends TextAbstractRenderer {
  private readonly editRendererInfo: EditRendererInfo;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    this.editRendererInfo = field.editRenderer ?? ({} as EditRendererInfo);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let editElement = this.editElement;
    if (!editElement) {
      editElement = getLayerElement('input', 'dg-edit-input ' + FIELD_LAYER_CLASS, cellInfo.c + '') as HTMLInputElement;
      editElement.type = 'number';
      editElement.name = this.field.$uid;
      editElement.setAttribute('autocomplete', 'off');

      if (this.editRendererInfo.rule?.minimum) {
        editElement.min = this.editRendererInfo.rule?.minimum + '';
      }

      if (this.editRendererInfo.rule?.maximum) {
        editElement.max = this.editRendererInfo.rule?.maximum + '';
      }

      this.rendererContainer.appendChild(editElement);
      this.editElement = editElement;

      this.initEvt(editElement, item);
    }

    const style = editElement.style;

    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);

    this.isShow = true;
    this.gridMain.openLayer(editElement);
    style.top = `${cellRect.top - rendererContainer.top}px`;
    style.left = `${cellRect.left - rendererContainer.left}px`;
    style.width = `${cellRect.width}px`;
    style.height = `${cellRect.height}px`;
    editElement.value = item[this.fieldName] ?? '';

    setTimeout(() => {
      editElement.focus();
    }, 100);
  }

  valid(value: string): boolean {
    const result = numberValidator(value, this.field, this.item, this.gridMain.config());

    if (result == null) {
      return true;
    }

    return !this.showInvalidMessage(result, this.cellElement);
  }
}
