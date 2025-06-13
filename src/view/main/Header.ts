import { HeaderOptions } from "@t/GridOptions";
import { Selection, SelectionRange } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import * as utils from "src/util/utils";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";
import { eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, stopPreventCancel } from "src/util/eventUtils";
import { dragHorizontalMovePosition, getMaxColumnSize, isFixedLeftPostion, isFixedRightPostion, isMultipleCellSelection, isRowSelection } from "src/util/gridUtils";
import { addAttr, getOffset, removeAttr } from "src/util/domUtils";

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export default class Header {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private headerOpts: HeaderOptions;

  public headerElement: DaraElement;
  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public resizerHelperElement: DaraElement;

  private drag: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.drag = {};

    this.headerOpts = grid.getOptions().header;

    this.initHeader();

    this.initEvt();
  }

  initHeader() {
    this.createTemplate();

    this.setHeight(this.grid.config().dimensions.mainHeaderHeight);
  }

  initEvt() {
    this.initHeaderSelectionEvent();
    this.initSortEvent();

    this.initResizeEvent();
  }
  initSortEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const sortElements = this.headerElement.finds(".dg-sort-icon");

    const nullsLast = this.headerOpts.sort.nullsLast;

    eventOff(sortElements, "touchstart mousedown");
    eventOn(
      sortElements,
      "touchstart mousedown",
      (e: UIEvent) => {
        stopPreventCancel(e);

        const currentElement = e.currentTarget as HTMLElement;

        const sortCell = parseInt(currentElement.closest(".dg-header-cell")?.getAttribute("data-header-cell-idx") ?? "0", 10);

        const sortField = cfg.currentFields[sortCell];

        const sortName = sortField.name;

        let sortItems;
        if (isShiftKey(e)) {
          sortItems = cfg.items;
        } else {
          removeAttr(this.headerElement.finds("[data-dg-sort]"), "data-dg-sort");

          if (cfg.sort.orders.length > 1 || !cfg.sort.orders.some((item: any) => item.key === sortName)) {
            cfg.sort.orders.forEach((item: any, index: number) => {
              this.headerElement.find('.dg-header-cell[data-header-cell-idx="' + item.sortCell + '"] .dg-sort-num').textContent = "";
            });
            cfg.sort.orders = [];
          }
          sortItems = utils.arrayCopy(cfg.orginItems);
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

        //.dg-header-cell[data-header-cell-idx="8"] .dg-sort-icon;

        if (cfg.sort.orders.length > 0) {
          if (cfg.sort.orders.length > 1 && isNumModify) {
            cfg.sort.orders.forEach((item: any, index: number) => {
              this.headerElement.find('.dg-header-cell[data-header-cell-idx="' + item.sortCell + '"] .dg-sort-num').textContent = index + 1 + "";
            });
          }
          cfg.items = utils.multiSort(sortItems, cfg.sort.orders, nullsLast);
        } else {
          cfg.items = cfg.orginItems;
        }

        this.gridMain.getBody().dataDraw("sort");
      },
      null,
      { passive: false }
    );
    //dg-sort-icon
  }

  initHeaderSelectionEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const headerElement = this.headerElement;

    const selectionMode = opts.selectionMode;

    let headDragTimer: any = -1;
    let headDragDelay = 150;
    let multipleFlag = isMultipleCellSelection(selectionMode);

    const headerCellElements = this.headerElement.finds(".dg-header-cell");

    if (this.headerOpts.enableAllColumnSelection && !isRowSelection(selectionMode)) {
      //header resize, dblclick or drag
      eventOff(headerCellElements, "touchstart mousedown");
      eventOn(
        headerCellElements,
        "touchstart mousedown",
        (e: UIEvent) => {
          const position = getOffset(headerElement.getElement());
          const mainRightWidth = cfg.dimensions.mainRightWidth;
          const _l = position.left + cfg.dimensions.mainLeftWidth,
            _r = position.left + cfg.dimensions.mainInsideWidth - mainRightWidth;

          const currentElement = e.currentTarget as HTMLElement;

          const colIdx = parseInt(currentElement.getAttribute("data-header-cell-idx") ?? "0", 10);

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
                    mode: "add",
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
          let selectionId = "col-" + colIdx;
          let mode = "",
            initFlag = cfg.selection.id == "";
          let range: any = { startIdx: 0, endIdx: cfg.dataInfo.lastRow, startCol: colIdx, endCol: colIdx };
          if (isCtrlKey(e)) {
            mode = "add";
          } else if (isShiftKey(e)) {
            selectionId = cfg.selection.id == "" ? selectionId : cfg.selection.id;
            mode = "add";
            range.startCol = initFlag ? colIdx : cfg.selection.range.startCol;
            range.endCol = colIdx;
          } else {
            initFlag = true;
          }

          this.gridMain.selectionInfo.setSelectionRangeInfo(
            {
              id: selectionId,
              range: range as SelectionRange,
              isSelect: true,
              mode: mode,
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

  initResizeEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (opts.header.resize.enabled === false) return;

    const resizerElements = this.headerElement.finds(".dg-header-resizer");

    let clicks = 0;
    let clickTimer: any;
    const threshold = 200;

    //header resize, dblclick or drag
    eventOff(resizerElements, "touchstart mousedown");
    eventOn(
      resizerElements,
      "touchstart mousedown",
      (e: UIEvent) => {
        stopPreventCancel(e);
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

          this.setColumnWidth(this.drag.resizeIdx, resizeW);

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

    this.setColumnWidth(resizeIdx, w);
    if (utils.isFunction(this.headerOpts.resize.update)) {
      this.headerOpts.resize.update.call(null, { index: this.drag.resizeIdx, width: w });
    }
  }

  /**
   * set column width
   *
   * @public
   * @param {number} idx column index
   * @param {number} w  column width
   */
  public setColumnWidth(idx: number, w: number) {
    const cfg = this.grid.config();
    cfg.isHeaderResize = true;

    const minWidth = this.headerOpts.resize.minWidth,
      maxWidth = this.headerOpts.resize.maxWidth;
    if (minWidth != -1 && w < minWidth) {
      w = minWidth;
    } else if (maxWidth != -1 && w > maxWidth) {
      w = maxWidth;
    }
    if (cfg.isHeaderResize) {
      cfg.currentFields[idx].$width = w;
    } else {
      cfg.currentFields[idx].width = w;
    }

    this.gridMain.resizeDraw();
  }

  /**
   *
   * @param sEle
   */
  private calcColumnResize(sEle: HTMLElement) {
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
   * set header height
   *
   * @param {number} header height
   */
  setHeight(height: number) {
    this.headerElement.setHeight(height);
  }

  public createTemplate() {
    this.headerElement = this.grid.element().findDaraElement(".dg-header");
    this.leftElement = this.headerElement.findDaraElement(".dg-header>.dg-left");
    this.centerElement = this.headerElement.findDaraElement(".dg-header>.dg-center");
    this.rightElement = this.headerElement.findDaraElement(".dg-header>.dg-right");
    this.resizerHelperElement = this.grid.element().findDaraElement(".dg-resize-helper");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
  }

  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    let headerGroups, leafGroup;
    let startGroupIdx = 0;

    if (type == "left") {
      headerGroups = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      startGroupIdx = cfg.fixedRightIndex;
      headerGroups = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      headerGroups = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }

    if (!headerGroups?.length || !headerGroups[0]?.length) return "";

    const rowsHtml: string[] = [];
    const helpEnabled = opts.header.help.enabled;
    const helpTitle = opts.header.help.title;
    const headerGroupLength = headerGroups.length;

    const resizeEnabled = this.headerOpts.resize.enabled;

    const sortEnabled = opts.header.sort.enabled;

    headerGroups.forEach((headerGroup, rowIndex) => {
      const trHeight = cfg.fieldHeaderGroup.heights[rowIndex];
      const rowHtml: string[] = [`<tr class="dg-header-row" style="height:${trHeight}px">`];

      headerGroup.forEach((headerItem) => {
        if (headerItem.$isLeaf && headerItem.$depth < headerGroupLength) {
          headerItem.$rowspan = headerGroupLength - headerItem.$depth + 1;
        }
        let classes = "";
        let cellIdx = "";
        if (headerItem.$isLeaf) {
          classes = "dg-header-cell";
          cellIdx = ` data-header-cell-idx="${headerItem.$resizeIdx}"`;
        } else {
          classes = "dg-header-group-cell";
        }

        const colspan = headerItem.$colspan > 1 ? ` colspan="${headerItem.$colspan}" scope="colgroup"` : "";
        const rowspan = headerItem.$rowspan > 1 ? ` rowspan="${headerItem.$rowspan}"` : "";

        const sortIcons =
          headerItem.$isLeaf && !headerItem.$isAside && (sortEnabled || headerItem.sort === true)
            ? `<div class="dg-sort-icon"><span class="dg-sort-num"></span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                <path class="dg-asc" d="M10 5H2a.5.5 0 01-.46-.31.47.47 0 01.11-.54L5.29.5A1 1 0 016.7.5l3.65 3.65a.49.49 0 01.11.54A.51.51 0 0110 5z"/>
                <path class="dg-desc" d="M2 7a.5.5 0 00-.46.31.47.47 0 00.11.54L5.3 11.5a1 1 0 001.41 0l3.65-3.65a.49.49 0 00.11-.54A.53.53 0 0010 7z"/>
              </svg></div>`
            : "";

        const helpIcon =
          helpEnabled && !headerItem.$isAside
            ? `<div class="dg-header-help-wrapper" title="${helpTitle}">
               <svg class="dg-header-help" viewBox="0 0 100 100">
                 <g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g>
               </svg>
             </div>`
            : "";

        const labelHtml = `
          ${helpIcon}
          <div class="label-wrapper">
            <div class="dg-header-label ${headerItem.sort ? "sort-header" : ""}">
              <div class="dg-inner"><div class="centered">${headerItem.label}</div></div>
              ${sortIcons}
            </div>
          </div>`;

        const resizerHtml = !resizeEnabled || headerItem.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${headerItem.$resizeIdx}"></div>`;

        rowHtml.push(`
          <th class="${classes}"${colspan}${rowspan}${cellIdx}>
            ${labelHtml}
            ${resizerHtml}
          </th>`);
      });

      rowHtml.push("</tr>");
      rowsHtml.push(rowHtml.join(""));
    });

    let colGroupHtml = [];
    let colGroupIdx = startGroupIdx;
    let tableWidth = 0;

    for (let leafNode of leafGroup) {
      const nodeWidth = leafNode.$width;
      tableWidth += nodeWidth;
      colGroupHtml.push(`<th data-col-idx="${colGroupIdx++}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${nodeWidth}px;"></th>`);
    }

    return `
      <table class="dg-header-table">
        <thead><tr>${colGroupHtml.join("")}</tr></thead>
        <tbody>${rowsHtml.join("")}</tbody>
      </table>
      ${type !== "center" ? '<div class="fixed-column-line"></div>' : ""}`;
  }
}
