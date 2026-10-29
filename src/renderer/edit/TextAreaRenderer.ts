import { FIELD_LAYER_CLASS } from '@/constants';
import { getLayerElement } from '@/util/domUtils';
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

    this.isShow = true;
    this.openCellLayer(textareaElement, element);

    const value = this.getValue(item, cellInfo.inputValue);

    textareaElement.value = value;
    textareaElement.focus();
  }

  public getElementValue(): string {
    return this.textareaElement.value;
  }

  valid(value: string): any {
    return true;
  }
}
