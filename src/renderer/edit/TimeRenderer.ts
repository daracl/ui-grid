import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { getElementRect, getLayerElement } from "src/util/domUtils";
import { eventOn } from "src/util/eventUtils";
import { stringValidator } from "src/rule/stringValidator";

/**
 * time renderer
 *
 * @typedef {TimeRenderer}
 * @extends {EditRenderer}
 */
export default class TimeRenderer extends EditRenderer {
  private editElement: HTMLInputElement;
  private item: any;
  private cellElement: HTMLElement;
  private cellInfo: CellInfo;

  private isShow: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let editElement = this.editElement;
    if (!editElement) {
      editElement = getLayerElement("input", "dg-edit-input", cellInfo.c + "") as HTMLInputElement;
      editElement.type = "time";
      editElement.name = this.fieldName;
      editElement.setAttribute("autocomplete", "off");

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
    editElement.value = item[this.fieldName] ?? "";

    setTimeout(() => {
      editElement.focus();
    }, 100);
  }

  initEvt(editElement: HTMLInputElement, item: any) {
    eventOn(editElement, "blur", (e: FocusEvent) => {
      if (this.isShow) {
        this.setChangeValue(e);
      }
    });

    eventOn(editElement, "keydown", (e: KeyboardEvent) => {
      const key = e.key;

      if (key === "Enter") {
        this.setChangeValue(e);
      } else if (key === "Escape") {
        this.setChangeValue(e, true);
      }
    });
  }

  setChangeValue(e: Event, cancelFlag: boolean = false) {
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
    const result = stringValidator(value, this.field, this.item, this.gridMain.getGrid().config());

    if (result == null) {
      return true;
    }

    return !this.showInvalidMessage(result, this.cellElement);
  }
}
