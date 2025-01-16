import { GridOptions, HeaderOptions } from "@t/GridOptions";
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
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";

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
export default class Header {
  private grid: DaraGrid;

  private headerOptions: HeaderOptions;

  constructor(grid: DaraGrid) {
    this.grid = grid;
    this.headerOptions = grid.getOptions().header;
  }

  public groupInfo(node: FieldItem, depth: number, columnGroupInfo) {
    if (node.visible === false) {
      node.$colspan = 0;
      return node;
    }

    node.$depth = depth + 1;
    node.$isLeaf = true;
    node.$colspan = 1;
    node.$rowspan = 1;
    node.$childLength = 0;

    columnGroupInfo.depth = Math.max(columnGroupInfo.depth, node.$depth);

    var children = node.children;
    if (children) {
      var childrenLen = children.length;

      if (childrenLen > 0) {
        node.$isLeaf = false;
        node.$childLength = childrenLen;
        var colspan = 0;
        for (var i = 0; i < childrenLen; i++) {
          var childNode = children[i];
          this.groupInfo(childNode, node.$depth, columnGroupInfo);
          colspan += childNode.$colspan;
        }

        node.$colspan = colspan;
        node.$resizeIdx = columnGroupInfo.leaf.length - 1;
      }
    } else {
      node.$resizeIdx = columnGroupInfo.leaf.length;
    }

    var fixedIndex = this.headerOptions.fixedIndex - 1;

    if (typeof columnGroupInfo.left[depth] === "undefined") {
      columnGroupInfo.left[depth] = [];
    }
    if (typeof columnGroupInfo.body[depth] === "undefined") {
      columnGroupInfo.body[depth] = [];
    }

    if (fixedIndex > node.$resizeIdx - node.$colspan) {
      // 컬럼 고정 처리.

      if (node.$colspan == 1) {
        columnGroupInfo.left[depth].push(node);
      } else {
        var leftNode = objectMerge({}, node);

        if (leftNode.$resizeIdx > fixedIndex) {
          leftNode.$colspan = fixedIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedIndex;
        }

        columnGroupInfo.left[depth].push(leftNode);
        if (fixedIndex < node.$resizeIdx) {
          var bodyNode = objectMerge({}, node);
          bodyNode.$colspan = node.$resizeIdx - fixedIndex;
          columnGroupInfo.body[depth].push(bodyNode);
        }
      }
    } else {
      columnGroupInfo.body[depth].push(node);
    }

    if (node.$isLeaf) {
      node.isSort = node.sort === false ? false : true;
      columnGroupInfo.leaf.push(node);
    }

    return node;
  }
}
