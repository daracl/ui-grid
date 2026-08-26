import { FIELD_LAYER_CLASS } from '@/constants';
import { EditCellRenderer } from '@/renderer/EditCellRenderer';
import { stringValidator } from '@/rule/stringValidator';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditCellRenderer}
 */
export abstract class TextAbstractRenderer extends EditCellRenderer {
  protected editElement: HTMLInputElement;
  protected item: any;
  protected cellElement: HTMLElement;
  protected cellInfo: CellInfo;

  protected isShow: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  initEvt(editElement: HTMLElement, item: any) {
    const { eventManager } = this.gridMain.config();

    eventManager.on({ el: editElement, type: 'blur' }, (e: FocusEvent) => {
      if (this.isShow) {
        this.setChangeValue(e);
      }
    });

    eventManager.on({ el: editElement, type: 'keydown' }, (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'Enter' && this.field.editRenderer?.type !== 'textarea') {
        this.setChangeValue(e);
      } else if (key === 'Escape') {
        this.setChangeValue(e, true);
      }
    });
  }

  public getElementValue(): string {
    return this.editElement.value;
  }

  setChangeValue(e: Event, cancelFlag = false) {
    this.isShow = false;

    if (!cancelFlag) {
      const value = this.getElementValue();
      if (this.setValue(e, this.item, value) === false) {
        this.isShow = true;
        return false;
      }
    }

    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild as HTMLElement);
    this.gridMain.hideLayer();

    this.completeEdit();
  }

  valid(value: string): any {
    const result = stringValidator(value, this.field, this.item, this.gridMain.config());

    if (result == null) {
      return true;
    }

    return !this.showInvalidMessage(result, this.cellElement);
  }

  protected textRender(cellInfo: CellInfo, element: HTMLElement, type: string): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let editElement = this.editElement;
    if (!editElement) {
      editElement = getLayerElement('input', 'dg-edit-input ' + FIELD_LAYER_CLASS, cellInfo.c + '') as HTMLInputElement;
      editElement.type = type;
      editElement.name = this.field.$uid;
      editElement.setAttribute('autocomplete', 'off');

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

    const value = this.getValue(item, cellInfo.inputValue);
    editElement.value = value;
    editElement.focus();
    //setTimeout(() => {}, 100);
  }
}
