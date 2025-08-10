import DaraGrid, { HIDDEN_ELEMENT } from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import SelectionInfo from "src/selection/selection";
import { ContextMenuItem, ContextMenuOptions } from "@t/GridOptions";
import { isFunction, isUndefined } from "src/util/utils";
import { eventOff, eventOn, eventPosition, stopPreventCancel } from "src/util/eventUtils";
import { addClass, removeClass } from "src/util/styleUtils";

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
    const contextElement = document.createElement("div");
    contextElement.className = "dg-contextmenu-container";
    contextElement.setAttribute("draggable", "false");
    contextElement.setAttribute("onselectstart", "return false");
    contextElement.innerHTML = this.template(contextOpts.items, "top", false, 0);

    HIDDEN_ELEMENT?.appendChild(contextElement);

    this.contextElement = new DaraElement(contextElement);

    this.initEvent();
  }

  private initEvent() {
    const contextOpts = this.contextOpts;
    const bodyElement = this.gridMain.mainElement().getElement();

    const isDisableItemKeyFn = isFunction(contextOpts.disableItem);
    const isBeforeSelectFn = isFunction(contextOpts.beforeSelect);

    let selectElement: HTMLElement;

    const _$win = window;
    eventOff(bodyElement, "contextmenu");
    eventOn(bodyElement, "contextmenu", (e: Event) => {
      stopPreventCancel(e);

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

      const selectItemElement = new DaraElement(selectElement);

      if (isBeforeSelectFn) {
        contextOpts.beforeSelect.call(this, { evt: e, element: selectElement });
      }
      const evtPosition = eventPosition(e);

      const position = calculateLayerPosition(targetElement, this.contextElement.getElement(), evtPosition);
      console.log("position : ", position, this.contextElement);

      this.contextElement.addClass("dg-on");
      this.contextElement.css({ top: position.top + "px", left: position.left + "px" });
      //$dd.css({ top: offTop, left: offLeft }).fadeIn(opt.fadeSpeed);
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

/**
 * 기준 요소(targetEl)를 기준으로 레이어(layerEl)를 띄울 위치를 계산합니다.
 * 스크롤과 창 크기를 고려해 화면 밖으로 나가지 않도록 자동 조정됩니다.
 *
 * @param targetEl 기준이 되는 DOM 요소
 * @param layerEl 띄울 레이어 DOM 요소
 * @param preferredDirection 기본 방향 ('bottom' 또는 'top')
 * @returns top, left 좌표 (픽셀 단위)
 */
function calculateLayerPosition(targetEl: HTMLElement, layerEl: HTMLElement, evtPosition: any, preferredDirection?: "top" | "bottom") {
  const rect = targetEl.getBoundingClientRect();

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const targetTop = evtPosition.y;
  const targetLeft = evtPosition.x;
  const targetBottom = rect.bottom + scrollTop;

  const layerWidth = layerEl.offsetWidth;
  const layerHeight = layerEl.offsetHeight;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let top: number;
  let left: number;

  // 기본 방향: 아래
  top = preferredDirection === "top" ? targetTop - layerHeight : targetBottom;

  left = targetLeft;

  // 오른쪽 넘어가면 왼쪽으로 붙임
  if (left + layerWidth > scrollLeft + windowWidth) {
    left = scrollLeft + windowWidth - layerWidth - 10;
  }

  // 아래쪽 넘어가면 위로 올림
  if (top + layerHeight > scrollTop + windowHeight) {
    top = targetTop - layerHeight - 10;
  }

  // 위쪽도 넘치면 다시 아래로
  if (top < scrollTop) {
    top = targetBottom;
  }

  return { top, left };
}
