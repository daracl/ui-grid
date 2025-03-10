import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedPostion } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export default class Header {
  private grid: DaraGrid;

  private headerOptions: HeaderOptions;

  private config: Config;

  constructor(grid: DaraGrid, config: Config) {
    this.grid = grid;
    this.config = config;

    this.headerOptions = grid.getOptions().header;
  }

  /**
   * @method calcHeader
   * @description 헤더 정보 계산
   */
  public calcHeader(calcFlag: boolean) {
    const cfg = this.config,
      gridElementWidth = cfg.container.width;

    const headerOptions = this.headerOptions;

    let tciItem;

    const columnGroupInfo = this.getHeaderGroupInfo();
    // header element height
    if (headerOptions.view !== false) {
      this.config.header.height = headerOptions.height * columnGroupInfo.depth;
    }

    const fields = (cfg.currentFields = columnGroupInfo.leaf) as FieldItem[];

    const viewAllLabel = calcFlag === false ? false : headerOptions.enableViewAllLabel === true ? true : false;

    let leftWidth = 0,
      mainWidth = 0,
      viewColCount = 0;
    for (let j = 0; j < fields.length; j++) {
      const tciItem = fields[j];
      tciItem.$maxWidth = -1; // max width

      if (tciItem.visible === false) continue;

      tciItem.renderer = tciItem.renderer || { type: "text" };

      ++viewColCount;

      if (viewAllLabel) {
        const labelWidth = tciItem.label.length * 5;
        if (utils.isNumber(tciItem.width)) {
          tciItem.width = labelWidth > tciItem.width ? labelWidth : tciItem.width;
        } else {
          tciItem.width = labelWidth;
        }
      } else {
        tciItem.width = isNaN(tciItem.width) ? headerOptions.resize.minWidth : tciItem.width;
      }

      tciItem.width = Math.max(tciItem.width, headerOptions.resize.minWidth);

      tciItem.$alignStyle = ALIGN_STYLE[tciItem.align] ?? ALIGN_STYLE.left;

      cfg.currentFields[j] = tciItem;

      if (isFixedPostion(cfg, j)) {
        leftWidth += tciItem.width;
      } else {
        mainWidth += tciItem.width;
      }
    }

    cfg.gridWidth.left = leftWidth;
    cfg.gridWidth.main = mainWidth;

    cfg.dataInfo.colLength = viewColCount;

    if (calcFlag === false) {
      return;
    }

    this.grid.calcContainerWidth();
  }

  /**
   * @method _getColumnGroupInfo
   * @description 헤더 그룹 정보
   */
  public getHeaderGroupInfo() {
    /*
  header group 수정 할것. 
  검색값 처리 할것. 
  */
    const cfg = this.config;
    const opts = this.grid.getOptions();
    const tci = cfg.currentFields || opts.fields;

    const columnGroupInfo = { left: [], body: [], leaf: [], depth: 1 };

    for (let i = 0; i < tci.length; i++) {
      this.groupInfo(tci[i], 0, columnGroupInfo);
    }

    return columnGroupInfo;
  }

  public groupInfo(node: FieldItem, depth: number, columnGroupInfo: any) {
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

    const children = node.children;
    if (children) {
      const childrenLen = children.length;

      if (childrenLen > 0) {
        node.$isLeaf = false;
        node.$childLength = childrenLen;
        let colspan = 0;
        for (let i = 0; i < childrenLen; i++) {
          const childNode = children[i];
          this.groupInfo(childNode, node.$depth, columnGroupInfo);
          colspan += childNode.$colspan;
        }

        node.$colspan = colspan;
        node.$resizeIdx = columnGroupInfo.leaf.length - 1;
      }
    } else {
      node.$resizeIdx = columnGroupInfo.leaf.length;
    }

    const fixedIndex = this.headerOptions.fixedIndex - 1;

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
        const leftNode = utils.merge({}, node);

        if (leftNode.$resizeIdx > fixedIndex) {
          leftNode.$colspan = fixedIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedIndex;
        }

        columnGroupInfo.left[depth].push(leftNode);
        if (fixedIndex < node.$resizeIdx) {
          const bodyNode = utils.merge({}, node);
          bodyNode.$colspan = node.$resizeIdx - fixedIndex;
          columnGroupInfo.body[depth].push(bodyNode);
        }
      }
    } else {
      columnGroupInfo.body[depth].push(node);
    }

    if (node.$isLeaf) {
      columnGroupInfo.leaf.push(node);
    }

    return node;
  }
}
