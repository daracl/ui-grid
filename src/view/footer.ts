import { FooterOptions, GridOptions, HeaderOptions, PagingOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN, ALIGN_STYLE } from "src/constants";
import DaraElement from "src/element/DaraElement";
import GridMain from "./GridMain";
import SelectionInfo from "src/selection/selection";
import { getPagingInfo } from "src/util/pagingUtil";
import { PagingInfo } from "@t/PagingInfo";

/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export default class Footer {
  private grid: DaraGrid;

  private footerOpts: FooterOptions;

  private selectionStatusElement: DaraElement;

  private scrollStatusElement: DaraElement;

  private paingElement: DaraElement;

  private selectionInfo: SelectionInfo;

  private config: Config;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.footerOpts = grid.getOptions().footer;

    if (!this.footerOpts.enabled) return;

    this.grid = grid;
    this.selectionInfo = gridMain.selectionInfo;
    this.config = this.grid.config();

    this.selectionStatusElement = new DaraElement(grid.element().find(".dg-footer .dg-selection-status"));
    this.scrollStatusElement = new DaraElement(grid.element().find(".dg-footer .dg-scroll-status"));

    this.paingElement = new DaraElement(grid.element().find(".dg-footer .dg-paging"));

    // paging 처리 할것.
    //
    //
    //
    //
  }

  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  public setSelectionStatus(dataInfo?: any) {
    if (this.footerOpts.enableSelectionInfo) {
      const dataInfo = this.selectionInfo.selectionData("json", true);

      if (!utils.isUndefined(dataInfo) && dataInfo.summary.count > 1) {
        const selectionFormat = this.footerOpts.selectionFormat;
        let statusText = "";
        if (utils.isString(selectionFormat)) {
          dataInfo.summary.enableSummary = dataInfo.summary.numFieldCount > 0;
          statusText = utils.replaceMesasgeFormat(selectionFormat, dataInfo.summary);
        } else if (utils.isFunction(selectionFormat)) {
          statusText = selectionFormat(dataInfo);
        }

        this.selectionStatusElement.text(statusText);
      } else {
        this.selectionStatusElement.text("");
      }
    }
  }

  public setScrollStatus() {
    if (this.footerOpts.enablePaging) {
      const cfg = this.grid.config();

      let statusInfo: any = {
        currStart: 1,
        currEnd: 10,
        total: cfg.dataInfo.rowLength,
      };

      if (!utils.isUndefined(statusInfo)) {
        const statusFormat = this.footerOpts.pagingFormat;
        let statusText = "";
        if (utils.isString(statusFormat)) {
          statusText = utils.replaceMesasgeFormat(statusFormat, statusInfo);
        } else if (utils.isFunction(statusFormat)) {
          statusText = statusFormat(statusInfo);
        }

        this.scrollStatusElement.text(statusText);
      } else {
        this.scrollStatusElement.text("");
      }
    }
  }

  /**
   * paging
   *
   * @public
   * @param {PagingOptions} info
   * @returns {this}
   */
  public setPaging(info: PagingOptions) {
    if (this.footerOpts.enablePaging !== true) {
      throw new Error("enablePaging not enabled");
    }

    if (info.totalCount < 1) {
      this.paingElement.empty();
      return;
    }

    const pagingInfo = getPagingInfo(info.totalCount ?? 0, info.currPage, info.countPerPage, info.unitPage);

    this.config.paging = pagingInfo;

    let currP = pagingInfo.currPage;
    if (currP == 0) currP = 1;
    const preP_is = pagingInfo.prePage_is;
    const currS = pagingInfo.currStartPage;
    let currE = pagingInfo.currEndPage;
    if (currE == 0) currE = 1;
    const nextO = 1 * currP + 1;
    const preO = currP - 1;
    const strHTML = [];

    strHTML.push(`<ul >`);

    if (currP <= 1) {
      strHTML.push(' <li class="disabled page-icon"><a href="javascript:">&laquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="page-num page-icon" pageno="' + preO + '">&laquo;</a></li>');
    }

    if (preP_is && currE - pagingInfo.unitPage >= 0) {
      strHTML.push(' <li class="page-num" pageno="1"><a href="javascript:" >1...</a></li>');
    }

    let no = 0;
    for (no = currS * 1; no <= currE * 1; no++) {
      if (no == currP) {
        strHTML.push(' <li class="active"><a href="javascript:">' + no + "</a></li>");
      } else {
        strHTML.push(' <li class="page-num" pageno="' + no + '"><a href="javascript:" >' + no + "</a></li>");
      }
    }

    if (currS + pagingInfo.unitPage < pagingInfo.totalPage) {
      strHTML.push(' <li class="page-num" pageno="' + pagingInfo.totalPage + '"><a href="javascript:" >...' + pagingInfo.totalPage + "</a></li>");
    }

    if (currP == currE) {
      strHTML.push(' <li class="disabled"><a href="javascript:">&raquo;</a></li>');
    } else {
      strHTML.push(' <li><a href="javascript:" class="page-num page-icon" pageno="' + nextO + '">&raquo;</a></li>');
    }

    strHTML.push("</ul>");

    this.paingElement.html(strHTML.join(""));

    return this;
  }
}
