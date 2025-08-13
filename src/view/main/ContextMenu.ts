import DaraGrid, { HIDDEN_ELEMENT } from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";
import { ContextMenuItem, ContextMenuOptions } from "@t/GridOptions";
import { isFunction, isUndefined } from "src/util/utils";
import { eventOff, eventOn, eventPosition, stopPreventCancel } from "src/util/eventUtils";
import { addClass, addStyleCss, removeClass } from "src/util/styleUtils";
import { outerLayerPosition, getElementRect, hasClass, getBrowserSize, getScrollPosition } from "src/util/domUtils";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class ContextMenu {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private contextOpts: ContextMenuOptions;

  private selectionInfo: SelectionInfo;

  private contextElement: DaraElement;

  private contextData: Map<String, ContextMenuItem> = new Map();

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    const contextOpts = this.grid.getOptions().contextMenu;

    if (!contextOpts) {
      return;
    }

    this.contextOpts = contextOpts;
    this.selectionInfo = gridMain.selectionInfo;

    this.create();
    this.initEvent();
  }

  create() {
    const contextElement = document.createElement("ul");
    contextElement.setAttribute("data-grid-id", this.grid.instanceId());
    contextElement.className = "dg-contextmenu dg-contextmenu-top dg-outer-layer";
    contextElement.setAttribute("draggable", "false");
    contextElement.setAttribute("onselectstart", "return false");
    contextElement.innerHTML = this.template(this.contextOpts.items, "top", 0);

    HIDDEN_ELEMENT?.appendChild(contextElement);

    this.contextElement = new DaraElement(contextElement);

    eventOn(contextElement, "contextmenu", (e: Event) => {
      stopPreventCancel(e);
    });
  }

  private initEvent() {
    const contextOpts = this.contextOpts;
    const gridElement = this.gridMain.mainElement().getElement();

    const isDisableItemKeyFn = isFunction(contextOpts.disableItem);
    const isBeforeSelectFn = isFunction(contextOpts.beforeSelect);

    let selectElement: HTMLElement;

    eventOff(gridElement, "contextmenu");
    eventOn(gridElement, "contextmenu", (e: Event) => {
      stopPreventCancel(e);

      removeClass(this.contextElement.finds(".dg-submenu-item.dg-on"), "dg-on");

      if (isDisableItemKeyFn) {
        const disableItem = contextOpts.disableItem(contextOpts.items);
        const disableItemLen = disableItem.length;
        let item;
        if (disableItemLen > 0) {
          for (let i = 0; i < disableItemLen; i++) {
            item = disableItem[i];
            addClass(this.contextElement.find('[context-key="' + item.depth + "_" + item.key + '"]'), "disabled");
          }
        }
      }

      const targetElement = e.target as HTMLElement;
      selectElement = targetElement.closest(".dg-contextmenu-item") as HTMLElement;
      addClass(selectElement, "dg-select");

      if (isBeforeSelectFn) {
        contextOpts.beforeSelect.call(this, { evt: e, element: selectElement });
      }
      const evtPosition = eventPosition(e);

      const orginContextElement = this.contextElement.getElement();

      this.gridMain.openLayer(orginContextElement);

      const position = outerLayerPosition(orginContextElement, evtPosition);

      this.contextElement.css({ top: position.top + "px", left: position.left + "px" });
    });
    this.itemClick();
    this.submenuEvent();
  }
  itemClick() {
    const contextItemElements = this.contextElement.finds(".dg-contextmenu-item");

    const fnContextCallback = this.contextOpts.callback;

    const isContextCallback = isFunction(fnContextCallback);

    // contextmenu item click
    eventOff(contextItemElements, "click");
    eventOn(contextItemElements, "click", (e: Event) => {
      const itemElement = e.currentTarget as HTMLElement;

      if (hasClass(itemElement, "dg-submenu-item")) {
        return;
      }

      const itemKey = itemElement.getAttribute("data-item-key") || "";

      const clickItem = this.contextData.get(itemKey);

      this.gridMain.hideLayer();

      if (clickItem?.callback) {
        clickItem.callback(clickItem);
        return;
      }

      if (isContextCallback) {
        fnContextCallback(clickItem);
      }
    });
  }

  submenuEvent() {
    const contextItemElements = this.contextElement.finds(".dg-contextmenu-item > a");

    let submenuTimer: any;

    // sub mouseenter
    eventOff(contextItemElements, "mouseenter");
    eventOn(contextItemElements, "mouseenter", (e: Event) => {
      const targetElement = e.currentTarget as HTMLElement;
      const itemElement = targetElement.closest(".dg-contextmenu-item") as HTMLElement;
      const parentElement = itemElement.closest(".dg-contextmenu") as HTMLElement;

      clearTimeout(submenuTimer);

      if (!hasClass(itemElement, "dg-submenu-item")) {
        removeClass(parentElement.querySelectorAll(":scope >.dg-contextmenu-item.dg-on"), "dg-on");
        return;
      }

      if (!hasClass(itemElement, "dg-on")) {
        removeClass(parentElement.querySelectorAll(":scope >.dg-contextmenu-item.dg-on"), "dg-on");
      }

      submenuTimer = setTimeout(() => {
        addClass(itemElement, "dg-on");

        const browserSize = getBrowserSize();

        const itemRect = getElementRect(itemElement);

        const subMenuElement = itemElement.querySelector(".dg-contextmenu-submenu") as HTMLElement;

        const submenuElement = new DaraElement(subMenuElement);
        submenuElement.css({ left: "", top: "" });
        const submenuRect = getElementRect(subMenuElement);

        const submenuWidth = submenuRect.width;
        const submenuHeight = submenuRect.height;
        const willOverflowRight = submenuWidth + itemRect.left + itemRect.width > browserSize.width;

        if (willOverflowRight) {
          const shiftLeftPercent = (submenuWidth / (itemRect.width + 3)) * 100;
          submenuElement.css({ left: `-${shiftLeftPercent}%` });
        }

        const overflowBottom = itemRect.top + submenuHeight - browserSize.height;

        if (overflowBottom > 0) {
          submenuElement.css({ top: `-${overflowBottom}px` });
        }
      }, 450);
    });
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(data: ContextMenuItem[], id: string, depth: number): string {
    const htmlTemplate = [];

    const dateLen = data.length;

    let itemKey, styleClass;
    for (let i = 0; i < dateLen; i++) {
      const item = data[i];

      if (isUndefined(item)) continue;

      styleClass = (item.styleClass ? item.styleClass : "") + (item.disabled === true ? " disabled" : "");

      itemKey = depth + "_" + (item.key || "");

      if (item.divider === true) {
        htmlTemplate.push(`<li><a class="dg-divider" tabindex="-1"></a></li>`);
        continue;
      }

      if (typeof item.header !== "undefined") {
        htmlTemplate.push(`<li class="dg-contextmenu-header ${styleClass}" data-item-key="${itemKey}_header">${item.header}</li>`);
        continue;
      }

      if (item.checkbox === true) {
        htmlTemplate.push(`<li class="dg-contextmenu-header ${styleClass}" data-item-key="checkbox">
          <label for="dgcontext_${item.key}"><input type="checkbox" id="dgcontext_${item.key}" /> <span>${item.label}</span>
          </label>
        </li>`);
        continue;
      }

      this.contextData.set(itemKey, item);

      if (!isUndefined(item.children)) {
        htmlTemplate.push(`<li class="dg-contextmenu-item dg-submenu-item ${styleClass}" data-item-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>`);

        htmlTemplate.push(`<ul class="dg-contextmenu dg-contextmenu-submenu">${this.template(item.children, id, depth + 1)}</ul>`);
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey) ? `<span class="dg-contextmenu-hotkey">${item.hotkey}</span>` : "";
        htmlTemplate.push(`<li class="dg-contextmenu-item ${styleClass}" data-item-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>${hotkeyHtm}
          </a>`);
      }
      htmlTemplate.push("</li>");
    }

    return htmlTemplate.join("");
  }
}
