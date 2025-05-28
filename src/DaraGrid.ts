import { GridOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { DEFAULT_OPTIONS } from "./defaultGridOption";
import { initConfig } from "./defaultGridConfig";
import { ADD_ROW_POSITION, FIELD_PREFIX } from "./constants";

import * as utils from "./util/utils";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { addStyleTag } from "./util/styleUtils";
import GridMain from "./view/GridMain";
import DaraElement from "./element/DaraElement";
import { FieldItem } from "@t/GridField";

declare const APP_VERSION: string;

// all instance
const ALL_INSTANCE: any = {};

const SEQ_ATTR_KEY = "daracl-grid-id";

let HIDDEN_ELEMENT: HTMLElement | null = null;

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
   * grid element
   *
   * @private
   * @type {GridElement}
   */
  public elementMap: GridElement;

  /**
   * unique id
   */
  private readonly $uid: string;

  // grid 설정
  private mainConfig: Config;

  private gridElement: DaraElement;

  private readonly uidAttrSelector;

  private gridMain: GridMain;

  constructor(gridElement: HTMLElement, options: GridOptions, message?: Message) {
    this.options = utils.merge({}, DEFAULT_OPTIONS, options) as GridOptions;

    Lanauage.set(message);

    if (gridElement == null || typeof gridElement === "undefined") {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.$uid = `${FIELD_PREFIX}_${++DARA_GRID_SEQ}`;

    gridElement.setAttribute(SEQ_ATTR_KEY, this.$uid);

    this.uidAttrSelector = `[${SEQ_ATTR_KEY}="${this.$uid}"]`;

    this.gridElement = new DaraElement(gridElement);

    ALL_INSTANCE[this.$uid] = this;
    this.createGrid();
  }

  createHiddenElement() {
    if (HIDDEN_ELEMENT === null) {
      const hiddenElement = document.createElement("div");
      hiddenElement.classList.add("daracl-grid-hidden-container");
      document.body.appendChild(hiddenElement);
      HIDDEN_ELEMENT = hiddenElement;
    }
  }

  public element() {
    return this.gridElement;
  }

  public config() {
    return this.mainConfig;
  }

  public static create(gridElement: HTMLElement, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  private createGrid() {
    this.mainConfig = initConfig(this.options);

    this.createHiddenElement();

    addStyleTag(this);

    this.gridMain = new GridMain(this);
  }

  public getOptions(): GridOptions {
    return this.options;
  }

  public getUidAttrSelector() {
    return this.uidAttrSelector;
  }

  public instanceId() {
    return this.$uid;
  }

  /**
   * grid instance 구하기
   *
   * @public
   * @static
   * @param {(HTMLElement | string)} eleOrId grid element, grid uid
   * @returns {DaraGrid} 그리드 object
   */
  public static instance(eleOrId: HTMLElement | string): DaraGrid {
    let id;
    if (utils.isString(eleOrId)) {
      id = eleOrId;
    } else {
      id = eleOrId instanceof HTMLElement ? eleOrId?.getAttribute(SEQ_ATTR_KEY) : "";
    }

    if (id && ALL_INSTANCE[id]) {
      return ALL_INSTANCE[id];
    }

    throw new Error(`instance not found : [${eleOrId}]`);
  }
  /**
   * 모든 field 얻기
   */
  public getFields = (): FieldItem[] => {
    return this.mainConfig.currentFields;
  };

  public getData = () => {
    return this.mainConfig.items;
  };

  /**
   * set data
   *
   * @param {any[]} items
   */
  public setData = (items: any[]) => {
    this.gridMain.setData(items);
  };

  public clearData = () => {
    this.gridMain.clearData();
  };

  public addRow = (items: any[], position: ADD_ROW_POSITION, addRowIndex?: number) => {
    this.gridMain.addRow(items, position, addRowIndex);
  };

  public removeRow = (ids: any[]) => {
    this.gridMain.removeRow(ids);
  };

  public setSize = (width?: number, height?: number) => {
    this.gridMain.setSize(width, height);
  };

  /**
   * grid height
   *
   * @public
   * @returns {*}
   */
  public getGridHeight(): number {
    if (this.options.height == "auto") {
      return this.gridElement.height();
    } else {
      return this.options.height;
    }
  }
}
