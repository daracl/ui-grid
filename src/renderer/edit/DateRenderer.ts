import { EditRenderer } from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import { GridMain } from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { getElementRect, getLayerElement } from "src/util/domUtils";
import { eventOn } from "src/util/eventUtils";
import { stringValidator } from "src/rule/stringValidator";
import { TextEditAbstractRenderer } from "./TextEditAbstractRenderer";

/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {EditRenderer}
 */
export class DateRenderer extends TextEditAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    const rendererInfo = this.field.editRenderer;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, "date");
  }
}
