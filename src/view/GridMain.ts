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
import { ALIGN_STYLE, FOOTER_HEIGHT, TOOLBAR_HEIGHT } from "src/constants";
import Header from "./main/Header";
import Body from "./main/Body";
import DaraElement from "src/element/DaraElement";

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

  private body: Body;

  private mainElement: DaraElement;

  constructor(grid: DaraGrid) {
    this.grid = grid;
    this.calcGridDimention();
    this.initTemplate();

    this.initMainView();
  }
  initMainView() {
    this.header = new Header(this.grid, this);

    this.body = new Body(this.grid, this);
  }

  /**
   * 치수 셋팅
   */
  calcGridDimention() {
    const cfg = this.grid.config();

    const opts = this.grid.getOptions();

    // 수치 계산할것.
    cfg.dimensions.width = utils.isNumber(opts.width) ? opts.width : this.grid.element().width();
    cfg.dimensions.height = utils.isNumber(opts.height) ? opts.height : this.grid.element().height();

    if (opts.toolbar.enabled) {
      cfg.dimensions.toolbarHeight = utils.isNumber(opts.toolbar.height) ? opts.toolbar.height : TOOLBAR_HEIGHT;
    }

    if (opts.footer.enabled) {
      cfg.dimensions.footerHeight = utils.isNumber(opts.footer.height) ? opts.footer.height : FOOTER_HEIGHT;
    }

    cfg.dimensions.mainHeight = cfg.dimensions.height - (cfg.dimensions.toolbarHeight + cfg.dimensions.footerHeight);
  }

  public changeScrollMode(mode: string) {
    if (mode == "none") {
      this.mainElement.removeAttr("data-scroll");
    } else {
      this.mainElement.attr({ "data-scroll": mode });
    }
  }

  public initTemplate() {
    const dimensions = this.grid.config().dimensions;
    const opts = this.grid.getOptions();

    let templateHtml = `
      <div class="daracl-grid" style="width:${dimensions.width}px;height:${dimensions.height}px;">
        ${opts.toolbar.enabled ? `<div class="dg-toolbar" style="height:${dimensions.toolbarHeight}px;"></div>` : ""}
        <div class="dg-main daracl-noselect" style="height:${dimensions.mainHeight}px;" data-scroll="both">
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
        ${opts.footer.enabled ? `<div class="dg-footer" style="height:${dimensions.footerHeight}px;"></div>` : ""}
    </div>
    `;

    this.grid.element().html(templateHtml);

    this.mainElement = new DaraElement(this.grid.element().find(".dg-main"));
  }
}
