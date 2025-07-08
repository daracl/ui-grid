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
import { addClass, removeClass, toggleClass } from "src/util/styleUtils";

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
  private readonly labelKey: string;
  private readonly valueKey: string;
  private readonly rendererContainer: HTMLElement;
  private readonly isMultiple: boolean;
  private readonly valueDelimiter: string;

  private valueLabelMap: Map<string, any>;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    const rendererInfo = this.field.renderer;
    this.labelKey = valuesLabelKey(rendererInfo);
    this.valueKey = valuesValueKey(rendererInfo);
    this.isMultiple = rendererInfo.listItem?.multiple ?? false;

    this.valueDelimiter = rendererInfo.listItem?.delimiter ?? ",";

    this.rendererContainer = this.gridMain.getRendererContainer();

    const list = rendererInfo.listItem?.list;
    if (isArray(list)) {
      this.initListItem(list);
    } else if (isFunction(list)) {
      list({ init: true }, (result: any[]) => {
        this.initListItem(result);
      });
    }
  }
  private initListItem(list: any[]) {
    const valueLabelMap = new Map<string, any>();
    const isStringValue = isString(list[0]);
    for (const item of list) {
      let val: string;
      let label: string;

      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item?.[this.valueKey] ?? "";
        label = item?.[this.labelKey] ?? "";
      }
      valueLabelMap.set(val, label);
    }

    this.valueLabelMap = valueLabelMap;
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
      let viewLabel = value;
      if (this.valueLabelMap.size > 0) {
        const valueSet = new Set(this.valueSplit(value));
        const values = Array.from(valueSet);

        const labels: string[] = [];

        const valueLabelMap = this.valueLabelMap;

        for (let val of values) {
          if (valueLabelMap.has(val)) {
            labels.push(valueLabelMap.get(val));
          }
        }
        viewLabel = labels.join(this.valueDelimiter);
      }
      textElement.textContent = viewLabel;
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

    let list = this.field.renderer.listItem?.list;

    const value = cellInfo.item[this.fieldName];

    if (isArray(list)) {
      list = this.uniqueListItem(list);
      menuElement.innerHTML = this.dropdownMenuTemplate(list, value);
      this.openMenu(cellElement, menuElement, eventElement, cellInfo, list);
    } else if (isFunction(list)) {
      list(cellInfo, (result: any[]) => {
        result = this.uniqueListItem(result);
        menuElement.innerHTML = this.dropdownMenuTemplate(result, value);
        this.openMenu(cellElement, menuElement, eventElement, cellInfo, result);
      });
    }
  }

  private uniqueListItem(list: any[]) {
    const seen = new Set();
    const valueKey = this.valueKey;
    const uniqueArr = list.filter((item) => {
      if (seen.has(item[valueKey])) return false;
      seen.add(item[valueKey]);
      return true;
    });
    return uniqueArr;
  }

  private valueSplit(val: string) {
    return ((val || "") + "").split(this.valueDelimiter);
  }

  /**
   * dropdown list open
   *
   * @private
   * @param {HTMLElement} cellElement cell element
   * @param {HTMLElement} menuElement dropdown element
   * @param {HTMLElement} eventElement click element
   * @param {CellInfo} cellInfo cell info
   * @param {any[]} list list item
   */
  private openMenu(cellElement: HTMLElement, menuElement: HTMLElement, eventElement: HTMLElement, cellInfo: CellInfo, list: any[]) {
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
          const allItemLength = list.length;
          const currentValue = cellInfo.item[this.fieldName] ?? "";
          if (addValue == "$all$") {
            const allItemElement = menuElement.querySelectorAll(".dg-dropdown-item");
            if (allItemLength == currentValue.split(this.valueDelimiter).length) {
              cellInfo.item[this.fieldName] = "";

              removeClass(allItemElement, SELECTED_STYLE_CLASS);
            } else {
              const valueKey = this.valueKey;
              cellInfo.item[this.fieldName] = list
                .map((item) => {
                  return item[valueKey];
                })
                .join(this.valueDelimiter);

              addClass(allItemElement, SELECTED_STYLE_CLASS);
            }
          } else {
            const newValue = addValueIfMissing(cellInfo.item[this.fieldName], addValue, false, this.valueDelimiter);

            cellInfo.item[this.fieldName] = newValue.join(this.valueDelimiter);

            if (allItemLength == newValue.length) {
              addClass(menuElement.querySelectorAll(".dg-dropdown-item"), SELECTED_STYLE_CLASS);
            } else {
              removeClass(menuElement.querySelectorAll('.dg-dropdown-item[data-dg-value="$all$"]'), SELECTED_STYLE_CLASS);
            }
          }
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

  private dropdownMenuTemplate(list: any[], value: string): string {
    if (!isArray(list) || list.length === 0) return "";

    const templateParts: string[] = [];

    const valueSet = new Set(this.valueSplit(value));

    const isStringValue = isString(list[0]);
    const isMultiple = this.isMultiple;

    if (isMultiple) {
      templateParts.push(`<div data-dg-value="$all$" class="dg-dropdown-item dg-all ${list.length == valueSet.size ? SELECTED_STYLE_CLASS : ""}">ALL</div>`);
    }

    for (const item of list) {
      let val: string;
      let label: string;

      if (isStringValue) {
        val = item;
        label = item;
      } else {
        val = item?.[this.valueKey] ?? "";
        label = item?.[this.labelKey] ?? "";
      }

      // 선택됨/비활성화 상태 클래스
      const isSelected = valueSet.has(val);
      const isDisabled = !!item?.disabled;

      const classes = [isSelected ? SELECTED_STYLE_CLASS : "", isDisabled ? "disabled" : ""].join(" ");

      templateParts.push(`<div data-dg-value="${val}" class="dg-dropdown-item ${classes}">${label}</div>`);
    }

    return templateParts.join("");
  }
}
