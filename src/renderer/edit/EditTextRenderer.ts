import EditRenderer from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import GridMain from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { LAYER_ATTR_NAME } from "src/constants";
import { getElementRect } from "src/util/domUtils";
import { eventOn } from "src/util/eventUtils";

/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditRenderer}
 */
export default class TextRenderer extends EditRenderer {
  private editElement: HTMLInputElement;
  private readonly rendererContainer: HTMLElement;
  private item: any;
  private cellElement: HTMLElement;
  private cellInfo: CellInfo;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;

    this.rendererContainer = this.gridMain.getRendererContainer();
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    this.cellInfo = cellInfo;
    this.item = item;
    this.cellElement = element;

    let editElement = this.editElement;
    if (!editElement) {
      editElement = document.createElement("input");
      editElement.className = "dg-edit-input";
      editElement.name = this.fieldName;
      editElement.setAttribute(LAYER_ATTR_NAME, cellInfo.c + "");

      this.rendererContainer.appendChild(editElement);
      this.editElement = editElement;

      this.initEvt(editElement, item);
    }

    const style = editElement.style;

    const cellRect = getElementRect(element);
    const rendererContainer = getElementRect(this.rendererContainer);

    style.display = "block";
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
      const value = this.editElement.value;

      this.item[this.fieldName] = value;

      console.log("value ", value);
      this.changeEventCall(e, value);
      //
      //
      //
      // cell element 수정할것.

      this.field.$renderer.render(this.cellInfo, this.cellElement);

      this.gridMain.hideLayer();
    });
  }
  public reset(element: HTMLElement): void {
    this.setValue(element, this.field.renderer.defaultValue);
  }

  valid(element: HTMLElement): any {
    return true;
  }
}
