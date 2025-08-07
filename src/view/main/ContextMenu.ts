import DaraGrid, { HIDDEN_ELEMENT } from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";
import { ContextMenuItem, ContextMenuOptions } from "@t/GridOptions";
import { isUndefined } from "src/util/utils";

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

  private contextElement: HTMLElement;

  private contextData: Map<String, ContextMenuItem> = new Map();

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    const contextOpts = this.grid.getOptions().contextMenu;

    console.log("contextOpts : ", contextOpts);

    if (!contextOpts) {
      return;
    }

    this.contextOpts = contextOpts;
    this.selectionInfo = gridMain.selectionInfo;
    const contextElement = document.createElement("div");
    contextElement.innerHTML = this.template(contextOpts.items, "top", false, 0);
    this.contextElement = contextElement;

    HIDDEN_ELEMENT?.appendChild(this.contextElement);
  }

  /**
   * html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(data: ContextMenuItem[], id: string, isChildren: boolean, depth: number): string {
    const subClass = isChildren ? " dg-contextmenu-sub" : " dg-contextmenu-top";
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
        htmlTemplate.push(`<li class="dg-contextmenu-submenu ${styleClass}" data-context-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>
            <span class="dg-contextmenu-hotkey-empty"></span>
          </a>`);

        htmlTemplate.push(this.template(item.children, id, true, depth + 1));
      } else {
        const hotkeyHtm = !isUndefined(item.hotkey) ? `<span class="dg-contextmenu-hotkey">${item.hotkey}</span>` : "";
        htmlTemplate.push(`<li class="dg-contextmenu-item ${styleClass}" data-context-key="${itemKey}">
          <a tabindex="-1">
            <span class="dg-contextmenu-label">${item.label}</span>${hotkeyHtm}
          </a>`);
      }
      htmlTemplate.push("</li>");
    }

    return `<ul class="dg-contextmenu ${subClass}" id="${id}">${htmlTemplate.join("")}</ul>`;
  }
}
