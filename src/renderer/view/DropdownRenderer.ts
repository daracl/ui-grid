import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { isString, isUndefined } from "src/util/utils";
import { CellInfo } from "@t/GridConfig";
import { eventOff, eventOn, stopPreventCancel } from "src/util/eventUtils";
import { RendererInfo } from "@t/RendererInfo";
import { valuesLabelKey, valuesLabelValue, valuesValueKey } from "src/util/gridUtils";
import Language from "src/util/Language";
import { HIDDEN_ELEMENT } from "src/DaraGrid";
import GridMain from "src/view/GridMain";

/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewRenderer}
 */
export default class DropdownRenderer extends ViewRenderer {
  private menuElement: HTMLElement;
  private currentEditRow: number;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(rowIdx: number, rowNumber: number, colNumber: number, item: any, element: HTMLElement): void {
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value);

    let contentElement = element.firstElementChild as HTMLElement;

    // 처음 생성 시
    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.className = this.getRendererStyleClass("dg-cell-content");

      const text = document.createElement("div");

      text.className = "dg-cell-content-label " + this.field.$alignStyle;
      const icon = document.createElement("div");
      icon.className = "dg-cell-content-icon";

      contentElement.appendChild(text);
      contentElement.appendChild(icon);

      element.appendChild(contentElement);
    }

    const textElement = contentElement.querySelector(".dg-cell-content-label") as HTMLElement;

    if (refValue) {
      textElement.textContent = refValue.label ?? value;
    } else {
      textElement.textContent = value;
    }
  }

  public click(e: Event, cellElement: HTMLElement, cellInfo: CellInfo) {
    stopPreventCancel(e);

    if (this.currentEditRow == cellInfo.rowIndex && this.menuElement.style.display != "none") {
      this.menuElement.style.display = "none";
      return;
    }

    console.log(this.currentEditRow, cellInfo.rowIndex, this.menuElement?.style.display);

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector(".dg-cell-content") as HTMLElement;

    const rect = eventElement.getBoundingClientRect();

    let menuElement = this.menuElement;
    if (!menuElement) {
      menuElement = document.createElement("div");
      menuElement.className = "dg-dropdown-menu";
      menuElement.setAttribute("data-dg-grid-layer", this.gridMain.getGrid().instanceId());

      this.gridMain.getRendererContainer().appendChild(menuElement);
      this.menuElement = menuElement;
    }

    menuElement.innerHTML = this.dropdownMenuTemplate(this.field.renderer);

    const menuHeight = menuElement.offsetHeight;
    const windowBottom = window.innerHeight;

    menuElement.style.display = "block";

    // 위로 띄울지 아래로 띄울지 결정
    const shouldOpenUpward = rect.bottom + menuHeight > windowBottom;

    console.log(shouldOpenUpward, menuElement.offsetHeight, menuElement.clientHeight, rect.top, window.scrollY, windowBottom);

    if (shouldOpenUpward) {
      menuElement.style.top = `${rect.top + window.scrollY - menuHeight}px`;
    } else {
      menuElement.style.top = `${rect.bottom + window.scrollY}px`;
    }

    menuElement.style.left = `${rect.left + window.scrollX}px`;
    menuElement.style.minWidth = `${rect.width}px`;

    const items = menuElement.querySelectorAll(".dg-dropdown-item");

    eventOn(items, "mousedown touchstart", (e: UIEvent) => {
      const target = e.target as HTMLElement;
      const value = target.getAttribute("data-dg-value");

      cellInfo.item[this.fieldName] = value;

      this.render(cellInfo.rowIndex, cellInfo.r, cellInfo.c, cellInfo.item, cellElement);
      menuElement.style.display = "none";
      eventOff(items, "mousedown touchstart");
    });
  }

  private dropdownMenuTemplate(rendererInfo: RendererInfo) {
    const labelKey = valuesLabelKey(rendererInfo);
    const valueKey = valuesValueKey(rendererInfo);
    let template = "";

    let isStringValue = isString(rendererInfo.listItem?.list[0]);

    rendererInfo.listItem?.list?.forEach((item) => {
      let val: any = "";
      let label: any = "";
      let addStyle: string = "";
      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item[valueKey] ?? "";
        label = item[labelKey];
        addStyle = `${item.selected ? "selected" : ""} ${item.disabled ? "disabled" : ""}`;
      }

      template += `<div data-dg-value="${val}" class="dg-dropdown-item ${addStyle}">${label}</div>`;
    });

    return template;
  }
}
