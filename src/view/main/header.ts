import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, FieldHeaderGroupInfo, GridElement, Selection } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE, VIEW_RENDERER } from "src/constants";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";
import { eventOff, eventOn, eventPosition, stopPreventCancel } from "src/util/eventUtils";
import { getMaxColumnSize, isFixedLeftPostion } from "src/util/gridUtils";

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
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (opts.header.resize.enabled === false) return;

    const resizerElements = this.headerElement.finds(".dg-header-resizer");

    eventOff(resizerElements, "dblclick");

    eventOn(resizerElements, "dblclick", (e: UIEvent) => {
      const targetElement = e.currentTarget as HTMLElement;
      this.calcColumnResize(targetElement);

      const field = cfg.currentFields[this.drag.resizeIdx];

      const resizeW = getMaxColumnSize(cfg, opts, field, 0);

      this.setColumnWidth(this.drag.resizeIdx, resizeW);
    });

    eventOff(resizerElements, "touchstart mousedown");
    eventOn(
      resizerElements,
      "touchstart mousedown",
      (e: UIEvent) => {
        stopPreventCancel(e);

        let resizeMoveX = 0;

        const targetElement = e.currentTarget as HTMLElement;
        this.calcColumnResize(targetElement);
        const data = {} as any;

        const startX = eventPosition(e).x;
        this.drag.pageX = startX;

        data.left = cfg.scroll.left;
        data.pageX = eventPosition(e).x;

        this.resizerHelperElement.css({ left: this.drag.positionLeft + "px" });
        this.resizerHelperElement.addClass("active");

        let moveStart = false;

        eventOn(document, "touchmove mousemove", (e1: Event) => {
          document.documentElement.setAttribute("onselectstart", "return false");
          let moveX = eventPosition(e1).x;
          if (!moveStart) {
            if (moveX > startX + 10 || moveX < startX - 10) {
              moveStart = true;
            }
          }
          resizeMoveX = moveX - startX;
          let moveLeftPosition = this.drag.positionLeft + resizeMoveX;
          this.resizerHelperElement.css({ left: moveLeftPosition + "px" });
          //this.onGripDrag(e1, _this);
        });

        eventOn(document, "touchend mouseup", (e1: Event) => {
          document.documentElement.removeAttribute("onselectstart");
          eventOff(document, "touchmove mousemove touchend mouseup");

          this.headerColumnResize(this.drag.resizeIdx, resizeMoveX);

          this.resizerHelperElement.removeClass("active");
        });

        return true;
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
    cfg.isHeaderResize = true;

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
    this.drag.ele = sEle;
    const colIdx = this.drag.ele.closest("[data-header-info]").getAttribute("data-col-idx");
    this.drag.resizeIdx = parseInt(colIdx, 10);
    this.drag.isLeftContent = isFixedLeftPostion(cfg, this.drag.resizeIdx);
    // get absolute left position
    let posLeft = 0;

    for (let i = 0; i <= this.drag.resizeIdx; i++) {
      posLeft += cfg.currentFields[i].$width;
    }

    this.drag.positionLeft = posLeft;
    if (!this.drag.isLeftContent) {
      this.drag.positionLeft -= cfg.scroll.centerLeftPosition;
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
    const cfg = this.grid.config(),
      opts = this.grid.getOptions();

    let headerGroup;
    let leafGroup;
    if (type == "left") {
      headerGroup = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      headerGroup = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      headerGroup = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }

    let headerGroupLength = headerGroup.length;

    if (headerGroupLength < 1 || headerGroup[0].length < 1) return "";

    let strHtm = [];

    const helpEnabled = opts.header.help.enabled;
    const helpTitle = opts.header.help.title;

    for (let i = 0; i < headerGroupLength; i++) {
      let ghArr = headerGroup[i];

      let trHeight = cfg.fieldHeaderGroup.heights[i];

      strHtm.push(`<tr class="dg-header-row" style="height:${trHeight}px">`);
      for (let j = 0; j < ghArr.length; j++) {
        let ghItem = ghArr[j];

        if (ghItem.$isLeaf && ghItem.$depth < headerGroupLength) {
          ghItem.$rowspan = headerGroupLength - ghItem.$depth + 1;
        }

        let thHtm = [];
        thHtm.push(`<th class="dg-header-col ${ghItem.styleClass ? ghItem.styleClass(ghItem) : ""}"
              ${ghItem.$colspan > 1 ? ` scope="colgroup" colspan="${ghItem.$colspan}" ` : ""}
              ${ghItem.$rowspan > 1 ? ` rowspan="${ghItem.$rowspan}" ` : ""}
              data-header-info="${i + "," + j}" 
              data-col-idx="${ghItem.$resizeIdx}"
        ">`);

        if (ghItem.$isAside) {
          thHtm.push(`
           <div class="label-wrapper">
             <div class="dg-header-cont ${ghItem.sort === true ? "sort-header" : ""} ">
               <div class="dg-inner"><div class="centered">${ghItem.label}</div></div>
             </div>
           </div>
           `);
        } else {
          thHtm.push(`
             ${
               helpEnabled
                 ? `<div class="dg-header-help-wrapper" title="${helpTitle}">
              <svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg> 
            </div>`
                 : ""
             }
              
            <div class="label-wrapper">
              <div class="dg-header-cont ${ghItem.sort === true ? "sort-header" : ""} ">
                <div class="dg-inner"><div class="centered">${ghItem.label}</div></div>
                ${ghItem.sort === true ? '<div class="dg-sort-icon sort-up">u</div><div class="dg-sort-icon sort-down">d</div>' : ""}
              </div>
            </div>
            <div class="dg-header-resizer"></div>
            `);
        }

        thHtm.push(`  </th> `);

        strHtm.push(thHtm.join(""));
      }
      strHtm.push("</tr>");
    }

    let colGroupHtm = [];
    let colGroupIdx = 0;
    let tableWidth = 0;
    for (let leafNode of leafGroup) {
      const nodeWidth = leafNode.$width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<col data-col-idx="${colGroupIdx++}" style="width:${nodeWidth}px;">`);
    }

    return `<table class="dg-header-table">
      <colgroup>${colGroupHtm.join("")}</colgroup>
      <thead>${strHtm.join("")}</thead>
    </table>${type != "center" ? '<div class="fixed-column-line"></div>' : ""}`;
  }
}
