import { stringValidator } from '@/rule/stringValidator';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { EditRenderer } from '../EditRenderer';

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditRenderer}
 */
export abstract class TextEditAbstractRenderer extends EditRenderer {
  protected editElement: HTMLInputElement;
  protected item: any;
  protected cellElement: HTMLElement;
  protected cellInfo: CellInfo;

  protected isShow: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  initEvt(editElement: HTMLInputElement, item: any) {
    const { eventManager } = this.gridMain.config();

    eventManager.on({ el: editElement, type: 'blur' }, (e: FocusEvent) => {
      if (this.isShow) {
        this.setChangeValue(e);
      }
    });

    eventManager.on({ el: editElement, type: 'keydown' }, (e: KeyboardEvent) => {
      const key = e.key;

      if (key === 'Enter') {
        this.setChangeValue(e);
      } else if (key === 'Escape') {
        this.setChangeValue(e, true);
      }
    });
  }

  setChangeValue(e: Event, cancelFlag = false) {
    this.isShow = false;
    if (!cancelFlag) {
      const value = this.editElement.value;
      if (this.setValue(e, this.item, value) === false) {
        this.isShow = true;
        return false;
      }
    }

    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild as HTMLElement);
    this.gridMain.hideLayer();
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
      editElement = getLayerElement('input', 'dg-edit-input', cellInfo.c + '') as HTMLInputElement;
      editElement.type = type;
      editElement.name = this.fieldName;
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
    editElement.value = item[this.fieldName] ?? '';

    setTimeout(() => {
      editElement.focus();
    }, 100);
  }
}
