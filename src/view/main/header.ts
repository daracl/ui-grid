import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedLeftPostion } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import DaraElement from "src/element/DaraElement";
import { getRenderer } from "src/util/renderFactory";
import GridMain from "../GridMain";

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export default class Header {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private headerOptions: HeaderOptions;

  private leftElement: DaraElement;
  private centerElement: DaraElement;
  private rightElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.headerOptions = grid.getOptions().header;

    this.leftElement = this.grid.element().find(".dg-header>.dg-left");
    this.centerElement = this.grid.element().find(".dg-header>.dg-center");
    this.rightElement = this.grid.element().find(".dg-header>.dg-right");

    // 헤더정보 계산할것.================================================

    this.calculation(true);
  }

  /**
   * @method calculation
   * @description 헤더 정보 계산
   */
  public calculation(calcFlag: boolean) {
    const cfg = this.grid.config(),
      gridElementWidth = cfg.dimension.width;

    const headerOptions = this.headerOptions;

    const columnGroupInfo = this.getHeaderGroupInfo();
    // header element height
    if (headerOptions.view !== false) {
      cfg.dimension.mainHeaderHeight = headerOptions.height * columnGroupInfo.depth;
    }

    const fields = (cfg.currentFields = columnGroupInfo.leaf) as FieldItem[];

    const enableViewAllLabel = calcFlag === false ? false : headerOptions.enableViewAllLabel === true;

    let leftWidth = 0,
      mainWidth = 0,
      viewColCount = 0;
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      field.$maxWidth = -1; // max width

      if (field.hidden) continue;

      field.renderer = field.renderer;
      field.$renderer = getRenderer(field);

      ++viewColCount;

      if (enableViewAllLabel) {
        const labelWidth = field.label.length * 5;
        if (utils.isNumber(field.width)) {
          field.width = labelWidth > field.width ? labelWidth : field.width;
        } else {
          field.width = labelWidth;
        }
      } else {
        field.width = isNaN(field.width) ? headerOptions.resize.minWidth : field.width;
      }

      field.width = Math.max(field.width, headerOptions.resize.minWidth);

      field.$alignStyle = ALIGN_STYLE[field.align] ?? ALIGN_STYLE.left;

      cfg.currentFields[j] = field;

      if (isFixedLeftPostion(cfg, j)) {
        leftWidth += field.width;
      } else {
        mainWidth += field.width;
      }
    }

    cfg.dimension.mainLeftWidth = leftWidth;
    cfg.dimension.mainCenterWidth = mainWidth;

    cfg.dataInfo.colLength = viewColCount;

    if (calcFlag === false) {
      return;
    }

    this.gridMain.calcContainerWidth();
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
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const tci = cfg.currentFields || opts.fields;

    const columnGroupInfo = { left: [], body: [], leaf: [], depth: 1 };

    for (let i = 0; i < tci.length; i++) {
      this.groupInfo(tci[i], 0, columnGroupInfo);
    }

    return columnGroupInfo;
  }

  public groupInfo(node: FieldItem, depth: number, columnGroupInfo: any) {
    if (node.hidden) {
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
