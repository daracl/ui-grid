import { EditRenderer } from "../EditRenderer";
import { FieldItem } from "@t/GridField";
import { GridMain } from "src/view/GridMain";
import { CellInfo } from "@t/GridConfig";
import { getElementRect, getLayerElement } from "src/util/domUtils";
import { eventOn } from "src/util/eventUtils";
import { stringValidator } from "src/rule/stringValidator";
import { TextEditAbstractRenderer } from "./TextEditAbstractRenderer";

/**
 * time renderer
 *
 * @typedef {TimeRenderer}
 * @extends {EditRenderer}
 */
export class TimeRenderer extends TextEditAbstractRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    this.textRender(cellInfo, element, "time");
  }
}
