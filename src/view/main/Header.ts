import { HeaderOptions } from "@t/GridOptions";

import DaraGrid from "src/DaraGrid";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";

import { getHeaderCellInfo } from "src/util/gridUtils";
import { addClass, removeClass } from "src/util/styleUtils";
import HeaderEvent from "./HeaderEvent";
import { LINE_NUMBER_NAME, ROW_CHECK_NAME } from "src/constants";

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

  private headerElement: DaraElement;
  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  private headerCellElements: HTMLElement[];

  private headerEvent: HeaderEvent;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.headerOpts = grid.getOptions().header;

    this.initHeader();

    this.headerEvent = new HeaderEvent(grid, gridMain, this);
  }

  initHeader() {
    this.createTemplate();

    this.setHeight(this.grid.config().dimensions.mainHeaderHeight);
  }

  public getHeaderCellElements() {
    return this.headerCellElements;
  }

  public getHeaderElement() {
    return this.headerElement;
  }

  /**
   * all item check
   *
   * @public
   * @param {boolean} checked
   * @param {?HTMLInputElement} [allCheckedElement]
   */
  public setAllCheckItem(checked: boolean, allCheckedElement?: HTMLInputElement) {
    const cfg = this.grid.config();
    if (!allCheckedElement) {
      allCheckedElement = this.headerElement.getElement().querySelector('[name="dgRowAllCheck"]') as HTMLInputElement;
    }

    if (allCheckedElement.checked != checked) {
      allCheckedElement.checked = checked;
    }

    const headerCellElement = allCheckedElement.closest(".dg-header-cell");

    const cellInfo = getHeaderCellInfo(cfg, headerCellElement as HTMLElement);

    const checkEle = headerCellElement?.querySelector(".dg-checkbox.dg-all");

    removeClass(checkEle as HTMLElement, "indeterminate");

    this.gridMain.getBody().setAllCheckItem(cellInfo, allCheckedElement.checked);
  }

  /**
   * set check box style
   *
   * @public
   * @param {number} idx
   * @param {("all" | "none" | "partial")} mode
   */
  public setCheckboxStyle(mode: "all" | "none" | "partial", idx?: number) {
    if (!this.grid.config().isRowAllowMultiSelect) return;

    let headerCellElement;
    if (!idx) {
      headerCellElement = (this.headerElement.getElement().querySelector('[name="dgRowAllCheck"]') as HTMLInputElement).closest(".dg-header-cell");
    } else {
      headerCellElement = this.headerElement.getElement().querySelector(`[data-header-cell-position="${idx}"]`);
    }

    const checkEle = headerCellElement?.querySelector(".dg-checkbox.dg-all");

    const classList = checkEle?.classList;
    if (mode == "partial") {
      (checkEle?.querySelector('[name="dgRowAllCheck"]') as HTMLInputElement).checked = false;
      if (!classList?.contains("indeterminate")) classList?.add("indeterminate");
    } else {
      (checkEle?.querySelector('[name="dgRowAllCheck"]') as HTMLInputElement).checked = mode == "all";
      if (classList?.contains("indeterminate")) classList.remove("indeterminate");
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
   * set header height
   *
   * @param {number} header height
   */
  public setHeight(height: number) {
    this.headerElement.setHeight(height);
  }

  /**
   * set header panel width
   *
   * @public
   * @param {number} mainLeftWidth
   * @param {number} mainCenterWidth
   * @param {number} mainRightWidth
   */
  public setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number) {
    this.leftElement.css({ width: mainLeftWidth + "px" });
    this.centerElement.css({ "margin-left": mainLeftWidth + "px", width: mainCenterWidth + "px" });
    this.rightElement.css({ width: mainRightWidth + "px" });
  }

  public setCenterElementStyle(styleCss: any) {
    this.centerElement.css(styleCss);
  }

  public setSearchIcon(searchDataFlag: boolean) {
    const searchIconElement = this.headerElement.find(".dg-search-icon");

    if (searchDataFlag) {
      addClass(searchIconElement, "dg-on");
    } else {
      removeClass(searchIconElement, "dg-on");
    }
  }

  public createTemplate() {
    this.headerElement = this.grid.element().findDaraElement(".dg-header");
    this.leftElement = this.headerElement.findDaraElement(".dg-header>.dg-left");
    this.centerElement = this.headerElement.findDaraElement(".dg-header>.dg-center");
    this.rightElement = this.headerElement.findDaraElement(".dg-header>.dg-right");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));

    this.headerCellElements = [];
    this.headerElement.finds(".dg-header-cell").forEach((node) => {
      const ele = node as HTMLElement;
      const cellIdx = parseInt(ele.getAttribute("data-header-cell-position") || "0", 10);
      this.headerCellElements[cellIdx] = node;
    });
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
    const currentFields = cfg.currentFields;

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
    const searchEnabled = opts.search.enabled;
    const helpEnabled = opts.header.help.enabled;
    const headerGroupLength = headerGroups.length;

    const resizeEnabled = this.headerOpts.resize.enabled;

    const sortEnabled = opts.header.sort.enabled;

    const searchIcon = searchEnabled
      ? `<div class="dg-search-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5" cy="5" r="3.5" />
      <line x1="8.5" y1="8.5" x2="11" y2="11" />
    </svg>
    </div>`
      : "";

    headerGroups.forEach((headerGroup, rowIndex) => {
      const trHeight = cfg.fieldHeaderGroup.heights[rowIndex];
      const rowHtml: string[] = [`<tr class="dg-header-row" style="height:${trHeight}px">`];

      headerGroup.forEach((headerItem, colIndex: number) => {
        if (headerItem.$isLeaf && headerItem.$depth < headerGroupLength) {
          headerItem.$rowspan = headerGroupLength - headerItem.$depth + 1;
        }
        let classes = "";
        let cellIdx = "";
        if (headerItem.$isLeaf) {
          classes = "dg-header-cell";
          cellIdx = ` data-header-cell-position="${headerItem.$resizeIdx}"`;
        } else {
          classes = "dg-header-group-cell";
          cellIdx = ` data-header-group-position="${rowIndex},${colIndex}"`;
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

        const isHeaderTooltip = headerItem.headerTooltip?.enabled ?? true;
        const helpIcon =
          helpEnabled && isHeaderTooltip !== false && !headerItem.$isAside
            ? `<div class="dg-header-help-button">
               <svg class="dg-header-help" viewBox="0 0 100 100">
                 <g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g>
               </svg>
             </div>`
            : "";

        const label =
          headerItem.$isAside && headerItem.name == ROW_CHECK_NAME && cfg.isRowAllowMultiSelect
            ? '<label class="dg-checkbox dg-all"><input type="checkbox" name="dgRowAllCheck" /><span class="checkmark"></span></label>'
            : `<div class="centered">${headerItem.label}</div>`;

        const searchHtml = headerItem.$isAside && headerItem.name == LINE_NUMBER_NAME ? searchIcon : "";

        const labelHtml = `
          ${helpIcon}
          <div class="label-wrapper">
            <div class="dg-header-label ${headerItem.sort ? "sort-header" : ""}">
             <div class="dg-inner"> ${label}</div>
              ${sortIcons}
            </div>
          </div>`;

        const resizerHtml = !resizeEnabled || headerItem.$isAside ? "" : `<div class="dg-header-resizer" data-resize-idx="${headerItem.$resizeIdx}"></div>`;

        rowHtml.push(`
          <th class="${classes}"${colspan}${rowspan}${cellIdx}>
            ${searchHtml}
            ${labelHtml}
            ${resizerHtml}
          </th>`);
      });

      rowHtml.push("</tr>");
      rowsHtml.push(rowHtml.join(""));
    });

    let colGroupHtml = [];
    let colGroupIdx = startGroupIdx;

    for (let i = 0; i < leafGroup.length; i++) {
      const idx = colGroupIdx++;
      colGroupHtml.push(`<th data-col-idx="${idx}" style="border:0;margin:0;padding:0;font-size:0;line-height:0;height:0;width:${currentFields[idx].$width}px;"></th>`);
    }

    return `
      <table class="dg-header-table">
        <thead><tr>${colGroupHtml.join("")}</tr></thead>
        <tbody>${rowsHtml.join("")}</tbody>
      </table>
      ${type !== "center" ? '<div class="fixed-column-line"></div>' : ""}`;
  }
}
