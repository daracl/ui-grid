import { FieldItem } from "@t/GridField";
import ViewRenderer from "../ViewRenderer";
import { addValueIfMissing, isArray, isFunction, isString, isUndefined } from "src/util/utils";
import { CellInfo } from "@t/GridConfig";
import { eventOff, eventOn, stopPreventCancel } from "src/util/eventUtils";
import { RendererInfo } from "@t/RendererInfo";
import { getCellInfo, valuesLabelKey, valuesLabelValue, valuesValueKey } from "src/util/gridUtils";
import Language from "src/util/Language";
import { HIDDEN_ELEMENT } from "src/DaraGrid";
import GridMain from "src/view/GridMain";
import { LAYER_ATTR_NAME } from "src/constants";
import { toggleClass } from "src/util/styleUtils";

const SELECTED_STYLE_CLASS = "selected";

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
  private labelKey: string;
  private valueKey: string;
  private rendererContainer: HTMLElement;
  private isMultiple: boolean;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    this.isMultiple = this.field.renderer.listItem?.multiple ?? false;

    this.rendererContainer = this.gridMain.getRendererContainer();
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

      this.initEvent(contentElement);
    }

    const textElement = contentElement.querySelector(".dg-cell-content-label") as HTMLElement;

    if (refValue) {
      textElement.textContent = refValue.label ?? value;
    } else {
      textElement.textContent = value;
    }
  }

  initEvent(contentElement: HTMLElement) {
    eventOn(
      contentElement,
      "click",
      (e: UIEvent) => {
        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;
        const cellInfo = getCellInfo(this.cfg, cellElement);

        this.click(e, cellElement, cellInfo);
      },
      { passive: false }
    );
  }

  public click(e: Event, cellElement: HTMLElement, cellInfo: CellInfo) {
    if (this.currentEditRow == cellInfo.rowIndex) {
      if (window.getComputedStyle(this.menuElement).display == "block") {
        this.menuElement.style.display = "none";
        return;
      }
    }

    //console.log("activeComponent  : ", this.currentEditRow == cellInfo.rowIndex ? window.getComputedStyle(this.menuElement).display : "", cellInfo);

    const cellPosition = cellInfo.c + "";

    this.cfg.activeComponent = cellPosition;

    this.currentEditRow = cellInfo.rowIndex;

    const eventElement = cellElement.querySelector(".dg-cell-content") as HTMLElement;

    let menuElement = this.menuElement;
    if (!menuElement) {
      menuElement = document.createElement("div");
      menuElement.className = "dg-dropdown-menu";
      menuElement.setAttribute(LAYER_ATTR_NAME, cellPosition);

      this.rendererContainer.appendChild(menuElement);
      this.menuElement = menuElement;
    }

    const list = this.field.renderer.listItem?.list;

    const value = cellInfo.item[this.fieldName];

    if (isArray(list)) {
      menuElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(cellElement, menuElement, eventElement, cellInfo);
    } else if (isFunction(list)) {
      list(cellInfo, (result: any[]) => {
        menuElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(cellElement, menuElement, eventElement, cellInfo);
      });
    }
  }

  private openMenu(cellElement: HTMLElement, menuElement: HTMLElement, eventElement: HTMLElement, cellInfo: CellInfo) {
    const rendererContainer = this.rendererContainer.getBoundingClientRect();
    const elementRect = eventElement.getBoundingClientRect();

    menuElement.style.display = "block";

    const menuHeight = menuElement.offsetHeight || menuElement.getBoundingClientRect().height;
    const windowBottom = window.innerHeight;

    // 버튼 위치를 #grid 기준으로 변환
    const relativeTop = elementRect.top - rendererContainer.top;
    const relativeLeft = elementRect.left - rendererContainer.left;

    // 위로 띄울지 아래로 띄울지 결정
    const shouldOpenUpward = elementRect.bottom + menuHeight > windowBottom;

    if (shouldOpenUpward) {
      menuElement.style.top = `${relativeTop - menuHeight - 2}px`;
    } else {
      menuElement.style.top = `${relativeTop + eventElement.offsetHeight}px`;
    }

    menuElement.style.left = `${relativeLeft}px`;
    menuElement.style.minWidth = `${elementRect.width}px`;

    const items = menuElement.querySelectorAll(".dg-dropdown-item");

    const isMultiple = this.isMultiple;

    eventOn(
      items,
      "pointerdown",
      (e: UIEvent) => {
        const target = e.target as HTMLElement;
        const addValue = target.getAttribute("data-dg-value");

        toggleClass(target, SELECTED_STYLE_CLASS);

        if (isMultiple) {
          cellInfo.item[this.fieldName] = addValueIfMissing(cellInfo.item[this.fieldName], addValue);
        } else {
          cellInfo.item[this.fieldName] = addValue;
        }

        this.render(cellInfo.rowIndex, cellInfo.r, cellInfo.c, cellInfo.item, cellElement);

        if (!isMultiple) {
          eventOff(items, "click");
          menuElement.style.display = "none";
        }
      },
      { passive: false }
    );
  }

  private dropdownMenuTemplate(list: any[], value: string) {
    let template = "";

    const valueSet = new Set(((value || "") + "").split(","));

    let isStringValue = isString(list[0]);

    list?.forEach((item) => {
      let val: any = "";
      let label: any = "";
      let addStyle: string = "";
      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item[this.valueKey] ?? "";
        label = item[this.labelKey];
      }

      addStyle = `${valueSet.has(val) ? SELECTED_STYLE_CLASS : ""} ${item.disabled ? "disabled" : ""}`;

      template += `<div data-dg-value="${val}" class="dg-dropdown-item ${addStyle}">${label}</div>`;
    });

    return template;
  }
}
