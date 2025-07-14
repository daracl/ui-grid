import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { LAYER_ATTR_NAME } from "src/constants";
import { getElementRect } from "src/util/domUtils";
import { eventOn } from "src/util/eventUtils";

/**
 * password renderer
 *
 * @class PasswordEditRenderer
 * @typedef {PasswordEditRenderer}
 * @extends {EditRenderer}
 */
export default class PasswordEditRenderer extends EditRenderer {
  private editElement: HTMLInputElement;
  private item: any;
  private cellElement: HTMLElement;
  private cellInfo: CellInfo;

  private isShow: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let editElement = this.editElement;
    if (!editElement) {
      editElement = document.createElement("input");
      editElement.type = "password";
      editElement.className = "dg-edit-input";
      editElement.name = this.fieldName;
      editElement.setAttribute(LAYER_ATTR_NAME, cellInfo.c + "");
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
      this.setValue(e, this.item, value);
    }

    this.field.$renderer.render(this.cellInfo, this.cellElement.firstElementChild as HTMLElement);
    this.gridMain.hideLayer();
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
