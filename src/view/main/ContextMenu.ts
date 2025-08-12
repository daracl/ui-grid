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
    const contextElement = document.createElement("ul");
    contextElement.className = "dg-contextmenu dg-contextmenu-top";
    contextElement.setAttribute("draggable", "false");
    contextElement.setAttribute("onselectstart", "return false");
    contextElement.innerHTML = this.template(contextOpts.items, "top", false, 0);

    HIDDEN_ELEMENT?.appendChild(contextElement);

    this.contextElement = new DaraElement(contextElement);

    this.initEvent();
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

    const contextItemElements = this.contextElement.finds(".dg-contextmenu-item");

    let submenuTimer: any;

    // sub mouseenter
    eventOff(contextItemElements, "mouseenter");
    eventOn(contextItemElements, "mouseenter", (e: Event) => {
      const itemElement = e.target as HTMLElement;

      const parentElement = itemElement.closest(".dg-contextmenu") as HTMLElement;

      const activeItemElement = parentElement.querySelectorAll(":scope >.dg-contextmenu-item.dg-on");

      removeClass(activeItemElement, "dg-on");

      clearTimeout(submenuTimer);

      if (!hasClass(itemElement, "dg-submenu-item")) {
        return;
      }

      submenuTimer = setTimeout(() => {
        addClass(itemElement, "dg-on");

        const browserSize = getBrowserSize();

        const itemRect = getElementRect(itemElement);

        const subMenuElement = itemElement.querySelector(".dg-contextmenu-submenu") as HTMLElement;

        const subContextMenuElement = new DaraElement(subMenuElement);
        subContextMenuElement.css({ left: "", top: "" });
        const rect = getElementRect(subMenuElement);

        const subWidth = rect.width;
        const collision = subWidth + itemRect.left + itemRect.width > browserSize.width;

        if (collision) {
          subContextMenuElement.css({ left: "-" + (subWidth / (itemRect.width + 3)) * 100 + "%" });
        }

        let offTop = itemRect.top,
          subHeight = rect.height,
          screenBottom = browserSize.height;

        if (offTop + subHeight > screenBottom) {
          offTop = offTop + subHeight - screenBottom;
          offTop = offTop < 0 ? 0 : offTop;
          subContextMenuElement.css({ top: "-" + offTop + "px" });
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
  public template(data: ContextMenuItem[], id: string, isChildren: boolean, depth: number): string {
    const htmlTemplate = [];

    const dateLen = data.length;

    let itemKey, styleClass;
    for (let i = 0; i < dateLen; i++) {
      const item = data[i];

      if (isUndefined(item)) continue;

      styleClass = (item.styleClass ? item.styleClass : "") + (item.disabled === true ? " disabled" : "");

      itemKey = depth + "_" + (item.key || "");

      if (item.divider === true) {
        htmlTemplate.push(`<li class="divider ${styleClass}" data-context-key="divider"></li>`);
        continue;
      }

      if (typeof item.header !== "undefined") {
        htmlTemplate.push(`<li class="dg-contextmenu-header ${styleClass}" data-context-key="${itemKey}_header">${item.header}</li>`);
        continue;
      }

      if (item.checkbox === true) {
        htmlTemplate.push(`<li class="dg-contextmenu-header ${styleClass}" data-context-key="checkbox">
          <label for="dgcontext_${item.key}"><input type="checkbox" id="dgcontext_${item.key}" /> <span>${item.label}</span>
          </label>
        </li>`);
        continue;
      }

      this.contextData.set(itemKey, item);

      if (!isUndefined(item.children)) {
        htmlTemplate.push(`<li class="dg-contextmenu-item dg-submenu-item ${styleClass}" data-context-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>`);

        htmlTemplate.push(`<ul class="dg-contextmenu dg-contextmenu-submenu">${this.template(item.children, id, true, depth + 1)}</ul>`);
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey) ? `<span class="dg-contextmenu-hotkey">${item.hotkey}</span>` : "";
        htmlTemplate.push(`<li class="dg-contextmenu-item ${styleClass}" data-context-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>${hotkeyHtm}
          </a>`);
      }
      htmlTemplate.push("</li>");
    }

    return htmlTemplate.join("");
  }
}
