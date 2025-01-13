import { GridOptions } from "@t/GridOptions";
import { defaultOptions } from "./defaultGridOption";

import * as utils from "./util/utils";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { stringValidator } from "./rule/stringValidator";
import { numberValidator } from "./rule/numberValidator";
import { regexpValidator } from "./rule/regexpValidator";
import FieldInfoMap from "src/FieldInfoMap";
import FormTemplate from "./GridTemplate";

declare const APP_VERSION: string;

interface FieldMap {
  [key: string]: EditRenderer;
}

interface DaraGridMap {
  [key: string]: DaraGrid;
}

// all instance
const allInstance: DaraGridMap = {};

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

  private orginFormStyleClass;

  /**
   * grid unique id
   */
  private $uid: string;

  private gridElement: Element;

  private fieldInfoMap: FieldInfoMap;

  private formValue: any = {};

  public formTemplate: FormTemplate;

  constructor(gridElement: Element, options: GridOptions, message?: Message) {
    this.options = utils.merge({}, defaultOptions, options) as GridOptions;

    Lanauage.set(message);

    if (gridElement == null || typeof gridElement === "undefined") {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.orginFormStyleClass = gridElement.className;
    gridElement.classList.add("daracl-grid");

    this.$uid = `dg_${++DARA_GRID_SEQ}`;
    gridElement.setAttribute(SEQ_ATTR_KEY, this.$uid);

    if (this.options.width) {
      gridElement.setAttribute("style", `width:${this.options.width};`);
    }

    this.gridElement = gridElement;

    allInstance[this.$uid] = this;
    this.createGrid();
  }

  public static create(gridElement: Element, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  private createGrid() {
    this.fieldInfoMap = new FieldInfoMap(this.$uid, this);
  }

  public static instance(ele: Element | String) {
    let element;
    if (utils.isString(ele)) {
      element = document.querySelector(ele);
    } else {
      element = ele;
    }
    element = element as Element;
    let uid = element.getAttribute(SEQ_ATTR_KEY);

    if (utils.isUndefined(uid) || utils.isBlank(uid)) {
      const keys = Object.keys(allInstance);
      if (keys.length > 1) {
        throw new Error(`uid empty : [${uid}]`);
      }
      uid = keys[0];

      return allInstance[uid];
    }
  }
  /**
   * 모든 field 얻기
   */
  public getFields = (): any[] => {
    return this.options.fields;
  };

  public getFieldInfoMap() {
    return this.fieldInfoMap;
  }
}
