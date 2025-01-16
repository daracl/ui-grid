import { GridOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { defaultOptions } from "./defaultGridOption";
import { initConfig } from "./defaultGridConfig";
import { FIELD_PREFIX } from "./constants";

import * as utils from "./util/utils";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { stringValidator } from "./rule/stringValidator";
import { numberValidator } from "./rule/numberValidator";
import { regexpValidator } from "./rule/regexpValidator";
import FormTemplate from "./GridTemplate";
import AbstractRenderer from "./renderer/AbstractRenderer";
import { addStyleTag } from "./util/styleUtils";
import { isFixedPostion } from "./util/gridUtils";

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
export default class DaraGrid {
  public static VERSION = `${APP_VERSION}`;

  private readonly options;

  /**
   * unique id
   */
  private readonly $uid: string;

  // grid 설정
  private config: Config;

  private gridElement: HTMLElement;

  // element
  private elements: GridElement;

  public formTemplate: FormTemplate;

  constructor(gridElement: HTMLElement, options: GridOptions, message?: Message) {
    this.options = utils.merge({}, defaultOptions, options) as GridOptions;

    Lanauage.set(message);

    if (gridElement == null || typeof gridElement === "undefined") {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.$uid = `${FIELD_PREFIX}_${++DARA_GRID_SEQ}`;

    /*
    gridElement.classList.add("daracl-grid");
    gridElement.setAttribute(SEQ_ATTR_KEY, this.$uid);

    if (this.options.width) {
      gridElement.setAttribute("style", `width:${this.options.width};`);
    }
    */

    this.gridElement = gridElement;

    allInstance[this.$uid] = this;
    this.createGrid();
  }

  public static create(gridElement: HTMLElement, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  private createGrid() {
    this.config = initConfig();

    addStyleTag(this);
  }

  public getOptions(): GridOptions {
    return this.options;
  }

  public getUidAttribute() {
    return `[${SEQ_ATTR_KEY}="${this.$uid}"]`;
  }

  public instanceId() {
    return this.$uid;
  }

  /**
   * grid instance 구하기
   *
   * @public
   * @static
   * @param {(HTMLElement | string)} eleOrUid grid element, grid uid
   * @returns {DaraGrid} 그리드 object
   */
  public static instance(eleOrUid: HTMLElement | string): DaraGrid {
    let element;
    if (utils.isString(eleOrUid)) {
      if (allInstance[eleOrUid]) {
        return allInstance[eleOrUid];
      }
      element = document.querySelector(eleOrUid);
    } else {
      element = eleOrUid;
    }

    let uid = (element as HTMLElement).querySelector(".dg-grid")?.getAttribute(SEQ_ATTR_KEY);

    if (uid && allInstance[uid]) {
      return allInstance[uid];
    }

    throw new Error(`instance not found : [${eleOrUid}]`);
  }
  /**
   * 모든 field 얻기
   */
  public getFields = (): any[] => {
    return this.options.fields;
  };

  /**
   * @method calcHeader
   * @description 헤더 정보 계산
   */
  public calcHeader(calcFlag: boolean) {
    const cfg = this.config,
      gridElementWidth = cfg.container.width,
      opts = this.options;

    let tciItem;

    const columnGroupInfo = _$util._getHeaderGroupInfo(this);

    cfg.headerLeftGroup = columnGroupInfo.left;
    cfg.headerBodyGroup = columnGroupInfo.body;

    // header element height
    if (opts.header.view !== false) {
      this.config.header.height = opts.header.height * columnGroupInfo.depth;
    }

    const tci = (cfg.currentHeaderItems = columnGroupInfo.leaf);

    let colWidth = Math.floor(gridElementWidth / tci.length);

    colWidth = colWidth - 10;

    const viewAllLabel = calcFlag === false ? false : opt.headerOptions.viewAllLabel === true ? true : false;

    let leftWidth = 0,
      mainWidth = 0,
      viewColCount = 0;
    for (let j = 0; j < tci.length; j++) {
      const tciItem = tci[j];
      tciItem.maxWidth = -1; // max width

      tciItem.styleClass = utils.isUndefined(tciItem.styleClass) ? false : tciItem.styleClass;

      if (tciItem.visible === false) continue;

      tciItem.renderer = tciItem.renderer || { type: "text" };

      if (!utils.isUndefined(tciItem.tooltip) && utils.isFunction(tciItem.tooltip.formatter)) {
        tciItem.afTooltipFormatter = tciItem.tooltip.formatter;
      } else {
        tciItem.afTooltipFormatter = false;
      }

      ++viewColCount;

      if (viewAllLabel) {
        const labelWidth = tciItem.label.length * 5;
        tciItem.width = isNaN(tciItem.width) ? labelWidth : labelWidth > tciItem.width ? labelWidth : tciItem.width;
      } else {
        tciItem.width = isNaN(tciItem.width) ? opt.headerOptions.resize.minWidth : tciItem.width;
      }

      tciItem.width = Math.max(tciItem.width, opt.headerOptions.resize.minWidth);

      tciItem["_alignClass"] = tciItem.align == "right" ? "ar" : tciItem.align == "center" ? "ac" : "al";
      cfg.currentHeaderItems[j] = tciItem;

      if (isFixedPostion(cfg, j)) {
        leftWidth += tciItem.width;
      } else {
        mainWidth += tciItem.width;
      }
    }

    cfg.gridWidth.left = leftWidth;
    cfg.gridWidth.main = mainWidth;

    cfg.dataInfo.colLen = viewColCount;

    if (calcFlag === false) {
      return;
    }

    this.calcContainerWidth();
  }
  /**
   * @method _calcContainerWidth
   * @description width 계산.
   */
  public calcContainerWidth() {
    if (this.options.widthFixed === true) {
      return;
    }

    const _this = this,
      opt = this.options,
      _gw = this.config.container.width,
      tci = this.config.currentHeaderItems,
      tciLen = this.config.dataInfo.colLen;

    const verticalW = 0;

    if (this.options.tbodyItem.length > 0) {
      if (this.options.tbodyItem.length * this.config.rowHeight > this.getGridHeight() - this.config.header.height - this.config.footer.height) {
        verticalW = opt.scroll.vertical.width;
      }
    }

    const _totW = this.config.gridWidth.aside + this.config.gridWidth.left + this.config.gridWidth.main + verticalW;

    const resizeFlag = _totW < _gw ? true : false;
    const remainderWidth = Math.floor((_gw - _totW) / tciLen),
      lastSpaceW = _gw - _totW - remainderWidth * tciLen;

    if (resizeFlag) {
      const leftGridWidth = 0,
        mainGridWidth = 0;
      for (const j = 0; j < tciLen; j++) {
        const item = tci[j];
        item.width += remainderWidth;
        item.width = Math.max(item.width, opt.headerOptions.resize.minWidth);

        if (this._isFixedPostion(j)) {
          leftGridWidth += item.width;
        } else {
          mainGridWidth += item.width;
        }
      }
      this.config.currentHeaderItems[tciLen - 1].width += lastSpaceW;
      this.config.gridWidth.left = leftGridWidth;
      this.config.gridWidth.main = mainGridWidth + lastSpaceW;
    }
  }
}
