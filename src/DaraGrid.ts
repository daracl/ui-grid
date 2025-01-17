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
   * @method _calcContainerWidth
   * @description width 계산.
   */
  public calcContainerWidth() {
    if (this.options.widthFixed === true) {
      return;
    }

    const _this = this,
      opts = this.options,
      _gw = this.config.container.width,
      tci = this.config.currentHeaderItems,
      tciLen = this.config.dataInfo.colLength;

    let verticalW = 0;

    if (opts.items.length > 0) {
      if (opts.items.length * this.config.rowHeight > this.getGridHeight() - this.config.header.height - this.config.footer.height) {
        verticalW = opts.scroll.vertical.width;
      }
    }

    const _totW = this.config.gridWidth.aside + this.config.gridWidth.left + this.config.gridWidth.main + verticalW;

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

        if (isFixedPostion(this.config, j)) {
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

  /**
   * grid height
   *
   * @public
   * @returns {*}
   */
  public getGridHeight(): number {
    return this.options.height == "auto" ? this.gridElement.height() : this.options.height;
  }
}
