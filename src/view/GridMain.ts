import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "../util/Lanauage";
import * as utils from "../util/utils";
import { addStyleTag } from "../util/styleUtils";
import { isFixedLeftPostion } from "../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { merge } from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import Header from "./main/Header";

declare const APP_VERSION: string;

// all instance
const allInstance: any = {};

const SEQ_ATTR_KEY = "daracl-grid-uid";

let DARA_GRID_SEQ = 0;
/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export default class GridMain {
  private grid: DaraGrid;

  private header: Header;

  private headerOptions: HeaderOptions;

  constructor(grid: DaraGrid) {
    this.grid = grid;

    this.headerOptions = grid.getOptions().header;

    this.initTemplate();

    this.header = new Header(grid, this);
  }

  /**
   * 치수 셋팅
   */
  setGridDimention() {
    this.grid.config().dimension.width = this.grid.element().width();
    this.grid.config().dimension.height = this.grid.element().height();
  }

  public initTemplate() {
    const opts = this.grid.getOptions();

    let templateHtml = `
      <div class="daracl-grid">
        ${opts.toolbar.enabled ? `<div class="dg-toolbar"></div>` : ""}
        <div class="dg-main daracl-noselect" data-scroll="both">
            <div class="dg-main-container">
                <div class="dg-panel dg-header">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>
                <div class="dg-panel dg-body">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>
                <div class="dg-panel dg-summary">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>
            </div>
            <div class="dg-scroll-container">
                <div class="dg-scroll vertical"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button up"></div><div class="dg-scroll-button down"></div></div>
                <div class="dg-scroll horizontal"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button up"></div><div class="dg-scroll-button down"></div></div>
            </div>
        </div>
        ${opts.footer.enabled ? `<div class="dg-footer"></div>` : ""}
    </div>
    `;

    this.grid.element().html(templateHtml);

    this.setGridDimention();
  }

  /**
   * @method _calcContainerWidth
   * @description width 계산.
   */
  public calcContainerWidth() {
    const opts = this.grid.getOptions();
    if (opts.enableWidthFixed === true) {
      return;
    }

    const cfg = this.grid.config();

    const _gw = cfg.dimension.width,
      tci = cfg.currentFields,
      tciLen = cfg.dataInfo.colLength;

    let verticalScrollWidth = 0;

    if (opts.items.length > 0) {
      if (opts.items.length * cfg.rowHeight > cfg.dimension.mainHeight) {
        verticalScrollWidth = opts.scroll.vertical.width;
      }
    }

    const _totW = cfg.dimension.mainLeftWidth + cfg.dimension.mainLeftWidth + cfg.dimension.mainCenterWidth + verticalScrollWidth;

    const resizeFlag = _totW < _gw;
    const remainderWidth = Math.floor((_gw - _totW) / tciLen),
      lastSpaceW = _gw - _totW - remainderWidth * tciLen;

    if (resizeFlag) {
      let leftGridWidth = 0,
        mainGridWidth = 0;
      const resizeMinWidth = opts.header.resize.minWidth;
      for (let j = 0; j < tciLen; j++) {
        const item = tci[j];
        item.width += remainderWidth;
        item.width = Math.max(item.width, resizeMinWidth);

        if (isFixedLeftPostion(cfg, j)) {
          leftGridWidth += item.width;
        } else {
          mainGridWidth += item.width;
        }
      }
      cfg.currentFields[tciLen - 1].width += lastSpaceW;
      cfg.dimension.mainLeftWidth = leftGridWidth;
      cfg.dimension.mainCenterWidth = mainGridWidth + lastSpaceW;
    }
  }
}
