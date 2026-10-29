import { FIELD_LAYER_CLASS } from '@/constants';
import { numberValidator } from '@/rule/numberValidator';
import { getLayerElement } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRendererInfo } from '@t/RendererInfo';
import { TextAbstractRenderer } from './TextAbstractRenderer';

/**
 * number renderer
 *
 * @class NumberEditRenderer
 * @typedef {NumberEditRenderer}
 * @extends {TextAbstractRenderer}
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

    this.isShow = true;
    this.openCellLayer(editElement, element);
    editElement.value = this.getValue(item, cellInfo.inputValue);

    editElement.focus();
  }

  valid(value: string): boolean {
    const result = numberValidator(value, this.field, this.item, this.gridMain.config());

    if (result == null) {
      return true;
    }

    return !this.showInvalidMessage(result, this.cellElement);
  }
}
