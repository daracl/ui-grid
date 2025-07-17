import { HeaderOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";
import { eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, stopPreventCancel } from "src/util/eventUtils";
import { dragHorizontalMovePosition, getMaxColumnSize, isFixedLeftPostion, isFixedRightPostion, isMultipleCellSelection, isRowSelection } from "src/util/gridUtils";
import { addAttr, getElementRect, getLayerElement, getOpenLayerPosition, removeAttr } from "src/util/domUtils";
import Header from "./Header";
import { arrayCopy, isFunction, multiSort } from "src/util/utils";

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export default class HeaderEvent {
  private readonly grid: DaraGrid;
  private readonly gridMain: GridMain;

  private readonly header: Header;

  private readonly headerOpts: HeaderOptions;

  private readonly headerElement: DaraElement;

  private readonly headerCellElements: HTMLElement[];

  private readonly resizerHelperElement: DaraElement;

  private drag: any;

  private toolTipElement: HTMLElement;

  constructor(grid: DaraGrid, gridMain: GridMain, header: Header) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.header = header;
    this.drag = {};
    this.headerElement = this.header.getHeaderElement();
    this.headerCellElements = this.header.getHeaderCellElements();

    this.resizerHelperElement = this.grid.element().findDaraElement(".dg-resize-helper");

    this.headerOpts = grid.getOptions().header;

    this.initEvt();
  }

  initEvt() {
    this.initSearchButton();
    this.initHelpButton();
    this.initHeaderSelectionEvent();
    this.initSortEvent();

    this.initResizeEvent();
    this.initHeaderCheckbox();
  }
  initSearchButton() {
    const searchOpts = this.grid.getOptions().search;

    if (!searchOpts.enabled) return;

    const headerElement = this.headerElement;

    const searchIconElement = headerElement.find(".dg-search-icon");

    const cfg = this.grid.config();

    // 검색 처리 추가 할것.
    eventOff(searchIconElement, "click");
    eventOn(
      searchIconElement,
      "click",
      (e: UIEvent) => {
        stopPreventCancel(e);

        this.gridMain.getDataSearch().openSearch();
        return false;
      },
      null,
      { passive: false }
    );
  }

  /**
   * init help button event
   * @returns
   */
  initHelpButton() {
    const helpOpts = this.headerOpts.help;

    if (!helpOpts.enabled) return;

    const isClick = isFunction(helpOpts.click);
    const helpClickFn = helpOpts.click ?? function () {};

    const cfg = this.grid.config();

    const helpElements = this.headerElement.finds(".dg-header-help");

    if (isClick) {
      eventOff(helpElements, "mousedown touchstart");
      eventOn(
        helpElements,
        "mousedown touchstart",
        (e: UIEvent) => {
          stopPreventCancel(e);

          const currentElement = e.currentTarget as HTMLElement;
          const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

          helpClickFn(cellInfo);

          return false;
        },
        null,
        { passive: false }
      );
    }

    // tooltip mouseenter
    const delay = helpOpts.showDelay;
    const renderContainer = this.gridMain.getRendererContainer();
    let tooltipTimer: any;
    eventOff(helpElements, "mouseenter");
    eventOn(helpElements, "mouseenter", (e: UIEvent) => {
      const currentElement = e.currentTarget as HTMLElement;
      const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

      const field = cellInfo.field;

      const content = field?.headerTooltip?.content;

      if (!content) return false;

      let toolTipElement = this.toolTipElement;

      if (!toolTipElement) {
        toolTipElement = getLayerElement("div", "dg-header-help-tooltip", "help-tooltip");

        renderContainer.appendChild(toolTipElement);
        this.toolTipElement = toolTipElement;
      }

      tooltipTimer = setTimeout(() => {
        let tooltipContent: any;
        if (isFunction(content)) {
          tooltipContent = content(cellInfo);
        } else {
          tooltipContent = content;
        }

        toolTipElement.innerHTML = tooltipContent;

        const layerStyle = toolTipElement.style;

        layerStyle.height = "auto";
        this.gridMain.openLayer(toolTipElement);
        layerStyle.width = "auto";

        const openPosition = getOpenLayerPosition(renderContainer, currentElement, toolTipElement);

        layerStyle.top = `${openPosition.top}px`;
        layerStyle.left = `${openPosition.left}px`;
        layerStyle.height = `${openPosition.height}px`;
      }, delay);

      return false;
    });

    eventOn(helpElements, "mouseleave", (e: UIEvent) => {
      clearTimeout(tooltipTimer);
      this.gridMain.hideLayer(this.toolTipElement);
      return false;
    });
  }

  /**
   * init header sort event
   */
  initSortEvent() {
    const cfg = this.grid.config();
    const sortElements = this.headerElement.finds(".dg-sort-icon");

    const nullsLast = this.headerOpts.sort.nullsLast;

    eventOff(sortElements, "mousedown touchstart");
    eventOn(
      sortElements,
      "mousedown touchstart",
      (e: UIEvent) => {
        stopPreventCancel(e);

        const currentElement = e.currentTarget as HTMLElement;

        const sortCell = parseInt(currentElement.closest(".dg-header-cell")?.getAttribute("data-header-cell-position") ?? "0", 10);

        const sortField = cfg.currentFields[sortCell];

        const sortName = sortField.name;

        let sortItems;
        if (isShiftKey(e)) {
          sortItems = cfg.items;
        } else {
          removeAttr(this.headerElement.finds("[data-dg-sort]"), "data-dg-sort");

          if (cfg.sort.orders.length > 1 || !cfg.sort.orders.some((item: any) => item.key === sortName)) {
            cfg.sort.orders.forEach((item: any, index: number) => {
              (this.headerCellElements[item.sortCell].querySelector(".dg-sort-num") as HTMLElement).textContent = "";
            });
            cfg.sort.orders = [];
          }
          sortItems = arrayCopy(cfg.orginItems);
        }

        const currentSortItem = cfg.sort.orders.find((item: any) => item.key === sortName);

        let isNumModify = false;
        if (currentSortItem) {
          if (currentSortItem.ascOrder) {
            addAttr(currentElement, { "data-dg-sort": "desc" });
            currentSortItem.ascOrder = !currentSortItem.ascOrder;
          } else {
            const index = cfg.sort.orders.findIndex((item: any) => item.key === sortName);

            if (index !== -1) {
              cfg.sort.orders.splice(index, 1);
            }

            isNumModify = true;

            (currentElement.querySelector(".dg-sort-num") as HTMLElement).textContent = "";

            removeAttr(currentElement, "data-dg-sort");
          }
        } else {
          isNumModify = true;
          addAttr(currentElement, { "data-dg-sort": "asc" });
          cfg.sort.orders.push({ key: sortName, ascOrder: true, sortCell: sortCell });
        }

        if (cfg.sort.orders.length > 0) {
          if (cfg.sort.orders.length > 1 && isNumModify) {
            cfg.sort.orders.forEach((item: any, index: number) => {
              (this.headerCellElements[item.sortCell].querySelector(".dg-sort-num") as HTMLElement).textContent = index + 1 + "";
            });
          }
          cfg.items = multiSort(sortItems, cfg.sort.orders, nullsLast);
        } else {
          cfg.items = cfg.orginItems;
        }

        this.gridMain.selectionInfo.initSelection();
        this.gridMain.getBody().dataDraw("sort");
      },
      null,
      { passive: false }
    );
    //dg-sort-icon
  }

  /**
   * init  header selection event
   */
  private initHeaderSelectionEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const headerElement = this.headerElement;
    const leafAllFields = cfg.currentFields;

    const selectionMode = opts.selectionMode;

    let headDragTimer: any = -1;
    let headDragDelay = 150;
    let multipleFlag = isMultipleCellSelection(selectionMode);

    const headerCellElements = this.headerCellElements;

    if (this.headerOpts.enableAllColumnSelection && !isRowSelection(selectionMode)) {
      //header resize, dblclick or drag
      eventOff(headerCellElements, "mousedown touchstart");
      eventOn(
        headerCellElements,
        "mousedown touchstart",
        (e: UIEvent) => {
          const position = getElementRect(headerElement.getElement(), true);
          const mainRightWidth = cfg.dimensions.mainRightWidth;
          const _l = position.left + cfg.dimensions.mainLeftWidth,
            _r = position.left + cfg.dimensions.mainInsideWidth - mainRightWidth;

          const currentElement = e.currentTarget as HTMLElement;

          const colIdx = parseInt(currentElement.getAttribute("data-header-cell-position") ?? "0", 10);
          const field = leafAllFields[colIdx];
          if (field.$isAside) {
            return;
          }

          if (multipleFlag) {
            let beforeMoveRange = { endCol: -1 };
            // mouse darg scroll
            let mouseScrollDirectionX: string;
            eventOn(document, "touchmove mousemove", (moveEvt: Event) => {
              cfg.isHeaderDragging = true;

              const e1Position = eventPosition(moveEvt);

              const moveXInfo = dragHorizontalMovePosition(cfg, e1Position.x, position.left, _l, _r, beforeMoveRange.endCol);
              mouseScrollDirectionX = moveXInfo.mouseScrollDirectionX;

              const moveRange: any = {};
              if (moveXInfo.overCell > 0) {
                moveRange.endCol = this.gridMain.selectionInfo.getSelectionModeColInfo(selectionMode, moveXInfo.overCell, cfg, currentElement, cfg.selection.isMouseDown).endCol;

                if (beforeMoveRange.endCol == moveRange.endCol) return;

                this.gridMain.selectionInfo.setSelectionRangeInfo(
                  {
                    id: cfg.selection.id,
                    range: moveRange as SelectionRange,
                  } as Selection,
                  false,
                  mouseScrollDirectionX == ""
                );

                beforeMoveRange = moveRange;
              }

              if (headDragTimer < 1) {
                let beforeMovePosition = { col: -1 };
                headDragTimer = setInterval(() => {
                  if (mouseScrollDirectionX !== "") {
                    const isRight = mouseScrollDirectionX === "R";
                    let endCol = isRight ? cfg.scroll.insideEndCol + 1 : cfg.scroll.insideStartCol - 1;

                    if (beforeMovePosition.col != endCol) {
                      if ((isRight && cfg.fixedRightIndex == 0) || (!isRight && cfg.fixedLeftIndex == 0)) {
                        this.gridMain.selectionInfo.setSelectionRangeInfo(
                          {
                            range: { endCol: endCol } as SelectionRange,
                          } as Selection,
                          false,
                          false
                        );
                      }

                      this.gridMain.getScroll().moveHorizontalScroll({ direction: mouseScrollDirectionX, colIdx: endCol, drawFlag: false });
                      beforeMovePosition.col = endCol;
                      this.gridMain.getBody().dataDraw("drageHeadScroll");
                    }
                  }
                }, headDragDelay);
              }
            });

            eventOn(document, "touchend mouseup", () => {
              cfg.isHeaderDragging = false;
              eventOff(document, "touchmove mousemove touchend mouseup");
              clearInterval(headDragTimer);
              headDragTimer = -1;
            });
          }

          let initFlag = cfg.selection.id == "";
          let range: any = { type: "column", startIdx: 0, endIdx: cfg.dataInfo.lastRow, startCol: colIdx, endCol: colIdx };
          if (isCtrlKey(e)) {
            range.modifierKey = 1;
          } else if (isShiftKey(e)) {
            range.modifierKey = 2;
            range.startCol = initFlag ? colIdx : cfg.selection.range.startCol;
            range.endCol = colIdx;
          } else {
            initFlag = true;
          }

          this.gridMain.selectionInfo.setSelectionRangeInfo(
            {
              range: range as SelectionRange,
              isSelect: true,
            } as Selection,
            initFlag,
            true
          );
        },
        null,
        { passive: false }
      );

      eventOn(this.headerElement.getElement(), "mouseup touchend", (e: UIEvent) => {
        cfg.selection.isMouseDown = false;
        cfg.isHeaderDragging = false;
      });
    }
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (opts.header.resize.enabled === false) return;

    const resizerElements = this.headerElement.finds(".dg-header-resizer");

    let clicks = 0;
    let clickTimer: any;
    const threshold = 200;

    //header resize, dblclick or drag
    eventOff(resizerElements, "mousedown touchstart");
    eventOn(
      resizerElements,
      "mousedown touchstart",
      (e: UIEvent) => {
        stopPreventCancel(e);

        this.gridMain.hideLayer();

        const targetElement = e.currentTarget as HTMLElement;
        this.calcColumnResize(targetElement);
        clicks++;
        // click drag
        if (clicks === 1) {
          clickTimer = setTimeout(() => {
            clicks = 0;
          }, threshold);
        }

        // dblclick
        if (clicks === 2) {
          const field = cfg.currentFields[this.drag.resizeIdx];

          const resizeW = getMaxColumnSize(cfg, opts, field, 0);

          this.header.setColumnWidth(this.drag.resizeIdx, resizeW);

          clearTimeout(clickTimer);
          clicks = 0;

          return;
        }

        let resizeMoveX = 0;

        const startX = eventPosition(e).x;

        this.resizerHelperElement.css({ left: this.drag.positionLeft + "px" });
        this.resizerHelperElement.addClass("active");

        let isMouseMove = false;

        eventOn(document, "touchmove mousemove", (e1: Event) => {
          isMouseMove = true;
          document.documentElement.setAttribute("onselectstart", "return false");

          let moveX = eventPosition(e1).x;

          resizeMoveX = moveX - startX;
          let moveLeftPosition = this.drag.positionLeft + resizeMoveX;
          this.resizerHelperElement.css({ left: moveLeftPosition + "px" });
        });

        eventOn(document, "touchend mouseup", (e1: Event) => {
          eventOff(document, "touchmove mousemove touchend mouseup");
          this.resizerHelperElement.removeClass("active");
          if (isMouseMove) {
            document.documentElement.removeAttribute("onselectstart");

            this.headerColumnResize(this.drag.resizeIdx, resizeMoveX);
          }
        });
      },
      null,
      { passive: false }
    );
  }

  /**
   * header column resize
   *
   * @public
   * @param {number} resizeIdx resize index
   * @param {number} resizeWidth resize width
   */
  public headerColumnResize(resizeIdx: number, resizeWidth: number) {
    const cfg = this.grid.config();

    const currentFireld = cfg.currentFields[resizeIdx];

    let w = currentFireld.$width + resizeWidth;

    this.header.setColumnWidth(resizeIdx, w);
    if (isFunction(this.headerOpts.resize.update)) {
      this.headerOpts.resize.update.call(null, { index: this.drag.resizeIdx, width: w });
    }
  }

  /**
   *column resize calculate
   *
   * @param sEle
   */
  public calcColumnResize(sEle: HTMLElement) {
    const cfg = this.grid.config();
    this.drag = {};
    const colIdx = (sEle as HTMLElement)?.getAttribute("data-resize-idx") ?? "0";

    this.drag.resizeIdx = parseInt(colIdx, 10);

    const isLeftContent = isFixedLeftPostion(cfg, this.drag.resizeIdx);
    const isRightContent = isFixedRightPostion(cfg, this.drag.resizeIdx);

    let posLeft = 0;
    if (isRightContent) {
      for (let i = cfg.fixedRightIndex; i <= this.drag.resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.drag.positionLeft = cfg.dimensions.mainInsideWidth - cfg.dimensions.mainRightWidth + posLeft;
    } else if (isLeftContent) {
      for (let i = 0; i <= this.drag.resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.drag.positionLeft = posLeft;
    } else {
      for (let i = 0; i <= this.drag.resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.drag.positionLeft = posLeft - cfg.scroll.centerLeftPosition;
    }
  }

  /**
   * header all check
   *
   */
  private initHeaderCheckbox() {
    const dgRowAllCheckElement = this.headerElement.getElement().querySelector('[name="dgRowAllCheck"]');

    eventOn(
      dgRowAllCheckElement,
      "click",
      (e: UIEvent) => {
        const eventElement = e.target as HTMLInputElement;

        this.header.setAllCheckItem(eventElement.checked, eventElement);
      },
      { passive: false }
    );
  }

  getHeaderHelpCellInfo(cfg: Config, currentElement: HTMLElement) {
    let cell;
    let field;
    const groupCellElement = currentElement.closest(".dg-header-group-cell");
    if (groupCellElement) {
      const groupPosition = groupCellElement.getAttribute("data-header-group-position")?.split(",");

      if (groupPosition && groupPosition.length > 0) {
        const row = parseInt(groupPosition[0], 10);
        const idx = parseInt(groupPosition[1], 10);

        let fieldGroups;
        if (groupCellElement.closest(".dg-left")) {
          fieldGroups = cfg.fieldHeaderGroup.left;
        } else if (groupCellElement.closest(".dg-right")) {
          fieldGroups = cfg.fieldHeaderGroup.right;
        } else {
          fieldGroups = cfg.fieldHeaderGroup.center;
        }
        field = fieldGroups[row][idx];
        cell = idx;
      }
    } else {
      cell = parseInt(currentElement.closest(".dg-header-cell")?.getAttribute("data-header-cell-position") ?? "0", 10);
      field = cfg.currentFields[cell];
    }

    return { c: cell, field: field };
  }
}
