import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "../util/Lanauage";
import * as utils from "../util/utils";
import { addStyleTag } from "../util/styleUtils";
import { isFixedPostion } from "../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { merge } from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";

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

  private headerOptions: HeaderOptions;

  private config: Config;

  constructor(grid: DaraGrid, config: Config) {
    this.grid = grid;
    this.config = config;

    this.headerOptions = grid.getOptions().header;

    this.init();
  }

  public init() {
    const opts = this.grid.getOptions();

    this.grid.element().innerHTML = `
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
  }
}
