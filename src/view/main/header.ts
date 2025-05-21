import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, FieldHeaderGroupInfo, GridElement, Selection, SelectionRange } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE, VIEW_RENDERER } from "src/constants";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";
import { eventOff, eventOn, eventPosition, isCtrlKey, stopPreventCancel } from "src/util/eventUtils";
import { getCenterContentLeft, getMaxColumnSize, isFixedLeftPostion, isFixedRightPostion } from "src/util/gridUtils";

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
    this.initHeaderClick();

    this.initResizeEvent();
  }

  initHeaderClick() {
    const cfg = this.grid.config();
    const headerCellElements = this.headerElement.finds(".dg-header-cell");

    let clicks = 0;
    let clickTimer: any;
    const threshold = 200;

    if (this.headerOpts.enableAllColumnSelection) {
      //header resize, dblclick or drag
      eventOff(headerCellElements, "touchstart mousedown");
      eventOn(
        headerCellElements,
        "touchstart mousedown",
        (e: UIEvent) => {
          const currentElement = e.currentTarget as HTMLElement;

          const cellIdx = currentElement.getAttribute("data-header-cell-idx") ?? "0";

          const colIdx = parseInt(cellIdx, 10);

          //console.log(currentElement, cfg.dataInfo, ` cellIdx : ${cellIdx}, colIdx: ${colIdx}`);

          let mode = "",
            initFlag = true;
          if (isCtrlKey(e)) {
            mode = "add";
            initFlag = false;
          } else {
            this.gridMain.selectionInfo.clearSelectionCell();
          }

          this.gridMain.selectionInfo.setSelectionRangeInfo(
            {
              range: { _key: "col" + colIdx, startIdx: 0, endIdx: cfg.dataInfo.lastRow, startCol: colIdx, endCol: colIdx } as SelectionRange,
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

    let headerGroup, leafGroup;
    let startGroupIdx = 0;

    if (type == "left") {
      headerGroup = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      startGroupIdx = cfg.fixedRightIndex;
      headerGroup = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      headerGroup = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }

    if (!headerGroup?.length || !headerGroup[0]?.length) return "";

    const rowsHtml: string[] = [];
    const helpEnabled = opts.header.help.enabled;
    const helpTitle = opts.header.help.title;
    const headerGroupLength = headerGroup.length;

    headerGroup.forEach((rowGroup, rowIndex) => {
      const trHeight = cfg.fieldHeaderGroup.heights[rowIndex];
      const rowHtml: string[] = [`<tr class="dg-header-row" style="height:${trHeight}px">`];

      rowGroup.forEach((ghItem) => {
        if (ghItem.$isLeaf && ghItem.$depth < headerGroupLength) {
          ghItem.$rowspan = headerGroupLength - ghItem.$depth + 1;
        }
        let classes = "";
        let cellIdx = "";
        if (ghItem.$isLeaf) {
          classes = "dg-header-cell";
          cellIdx = ` data-header-cell-idx="${ghItem.$resizeIdx}"`;
        } else {
          classes = "dg-header-group-cell";
        }

        const colspan = ghItem.$colspan > 1 ? ` colspan="${ghItem.$colspan}" scope="colgroup"` : "";
        const rowspan = ghItem.$rowspan > 1 ? ` rowspan="${ghItem.$rowspan}"` : "";

        const sortIcons = ghItem.sort === true ? '<div class="dg-sort-icon sort-up">u</div><div class="dg-sort-icon sort-down">d</div>' : "";

        const helpIcon =
          helpEnabled && !ghItem.$isAside
            ? `<div class="dg-header-help-wrapper" title="${helpTitle}">
               <svg class="dg-header-help" viewBox="0 0 100 100">
                 <g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g>
               </svg>
             </div>`
            : "";

        const labelHtml = `
          ${helpIcon}
          <div class="label-wrapper">
            <div class="dg-header-label ${ghItem.sort ? "sort-header" : ""}">
              <div class="dg-inner"><div class="centered">${ghItem.label}</div></div>
              ${sortIcons}
            </div>
          </div>`;

        const resizerHtml = ghItem.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${ghItem.$resizeIdx}"></div>`;

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
