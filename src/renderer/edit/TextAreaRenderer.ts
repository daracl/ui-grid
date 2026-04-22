import { FIELD_LAYER_CLASS } from '@/constants';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { TextAbstractRenderer } from './TextAbstractRenderer';
import { EditRendererInfo } from '@/types/RendererInfo';

/**
 * textarea renderer
 *
 * @class TextAreaRenderer
 * @typedef {TextAreaRenderer}
 * @extends {TextAbstractRenderer}
 */
export class TextAreaRenderer extends TextAbstractRenderer {
  private readonly editRendererInfo: EditRendererInfo;
  private textareaElement: HTMLTextAreaElement;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    this.editRendererInfo = field.editRenderer ?? ({} as EditRendererInfo);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let textareaElement = this.textareaElement;
    if (!textareaElement) {
      textareaElement = getLayerElement(
        'textarea',
        'dg-edit-textarea ' + FIELD_LAYER_CLASS,
        cellInfo.c + '',
      ) as HTMLTextAreaElement;

      textareaElement.rows = 3;
      textareaElement.name = this.field.$uid;

      this.rendererContainer.appendChild(textareaElement);
      this.textareaElement = textareaElement;

      this.initEvt(textareaElement, item);
    }

    const style = textareaElement.style;

    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);

    this.isShow = true;
    this.gridMain.openLayer(textareaElement);
    style.top = `${cellRect.top - rendererContainer.top}px`;
    style.left = `${cellRect.left - rendererContainer.left}px`;
    style.width = `${cellRect.width}px`;
    textareaElement.value = item[this.fieldName] ?? '';

    setTimeout(() => {
      textareaElement.focus();
    }, 100);
  }

  setChangeValue(e: Event, cancelFlag = false) {
    this.isShow = false;
    if (!cancelFlag) {
      const value = this.textareaElement.value;
      if (this.setValue(e, this.item, value) === false) {
        this.isShow = true;
        return false;
      }
    }

    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild as HTMLElement);
    this.gridMain.hideLayer();
  }

  valid(value: string): any {
    return true;
  }
}
