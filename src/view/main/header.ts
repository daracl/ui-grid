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

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.headerOpts = grid.getOptions().header;

    // 헤더정보 계산할것.================================================

    this.initHeader();
  }

  initHeader() {
    this.createTemplate();

    this.setHeight(this.grid.config().dimensions.mainHeaderHeight);

    // left 값 셋팅
    this.centerElement.css({ left: this.grid.config().dimensions.mainLeftWidth + "px" });
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
      const nodeWidth = leafNode.width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<col data-col-idx="${colGroupIdx++}" style="width:${nodeWidth}px;">`);
    }

    return `<table class="dg-header-table" style="width:${tableWidth}px;">
      <colgroup>${colGroupHtm.join("")}</colgroup>
      <thead>${strHtm.join("")}</thead>
    </table>`;
  }
}
