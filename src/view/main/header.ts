import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, FieldHeaderGroupInfo, GridElement, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedLeftPostion } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE, RENDER_TEMPLATE } from "src/constants";
import DaraElement from "src/element/DaraElement";
import { getRenderer } from "src/util/renderFactory";
import GridMain from "../GridMain";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";

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

    // 헤더정보 계산할것.================================================

    this.calculation(true);

    this.createTemplate();
  }

  public createTemplate() {
    const containerElement = this.grid.element();
    this.leftElement = containerElement.find(".dg-header>.dg-left");
    this.centerElement = containerElement.find(".dg-header>.dg-center");
    this.rightElement = containerElement.find(".dg-header>.dg-right");

    this.leftElement.html(this.headerTemplate("left"));
    this.centerElement.html(this.headerTemplate("center"));
    this.rightElement.html(this.headerTemplate("right"));
  }

  /**
   * @method calculation
   * @description 헤더 정보 계산
   */
  public calculation(calcFlag: boolean) {
    const cfg = this.grid.config(),
      gridElementWidth = cfg.dimension.width;

    const headerOptions = this.headerOptions;

    this.initFieldGroupInfo();
    let fieldGroupInfo = cfg.fieldHeaderGroup;
    // header element height
    if (headerOptions.view !== false) {
      cfg.dimension.mainHeaderHeight = headerOptions.height * fieldGroupInfo.depth;
    }

    const fields = (cfg.currentFields = fieldGroupInfo.leaf) as FieldItem[];

    const enableViewAllLabel = calcFlag === false ? false : headerOptions.enableViewAllLabel === true;

    let leftWidth = 0,
      mainWidth = 0,
      viewColCount = 0;
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      field.$maxWidth = -1; // max width

      if (field.hidden) continue;

      this.setRendererInfo(field);

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
   * 필드에 랜더링 정보 추가
   *
   * @param {FieldItem} field 필드 정보
   * @returns {FieldItem} 필드 item
   */
  public setRendererInfo(field: FieldItem): FieldItem {
    let renderInfo = { type: "text" };

    if (utils.isPlainObject(field.renderer)) {
      renderInfo = utils.merge({}, field.renderer);
    } else if (utils.isString(field.renderer)) {
      renderInfo = { type: field.renderer };
    }

    let render = RENDER_TEMPLATE[renderInfo.type];
    if (utils.isUndefined(render)) {
      renderInfo.type = "text";
    }

    field.renderer = renderInfo;
    field.$renderer = RENDER_TEMPLATE[renderInfo.type];

    return field;
  }

  /**
   * @method _getColumnGroupInfo
   * @description 헤더 그룹 정보
   */
  public initFieldGroupInfo() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const fields = utils.deepCopy(opts.fields);

    console.log("opts.fields ", opts.fields, fields);

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    for (let field of fields) {
      this.groupInfo(field, 0, cfg.fieldHeaderGroup, cfg);
    }
  }

  /**
   * field group 정보
   *
   * @public
   * @param {FieldItem} field field 정보
   * @param {number} depth 그룹 depth
   * @param {*} fieldGroupInfo 그룹정보
   * @param {Config} cfg 설정정보
   * @returns {FieldItem} 필드 정보
   */
  public groupInfo(field: FieldItem, depth: number, fieldGroupInfo: FieldHeaderGroupInfo, cfg: Config) {
    if (field.hidden) {
      field.$colspan = 0;
      return field;
    }

    field.$depth = depth + 1;
    field.$isLeaf = true;
    field.$colspan = 1;
    field.$rowspan = 1;
    field.$childLength = 0;

    fieldGroupInfo.depth = Math.max(fieldGroupInfo.depth, field.$depth);

    const children = field.children;
    if (children) {
      const childrenLen = children.length;

      if (childrenLen > 0) {
        field.$isLeaf = false;
        field.$childLength = childrenLen;
        let colspan = 0;
        for (let childNode of children) {
          this.groupInfo(childNode, field.$depth, fieldGroupInfo, cfg);
          colspan += childNode.$colspan;
        }

        field.$colspan = colspan;
        field.$resizeIdx = fieldGroupInfo.leaf.length - 1;
      }
    } else {
      field.$resizeIdx = fieldGroupInfo.leaf.length;
    }

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;

    if (utils.isUndefined(fieldGroupInfo.left[depth])) {
      fieldGroupInfo.left[depth] = [];
    }
    if (utils.isUndefined(fieldGroupInfo.center[depth])) {
      fieldGroupInfo.center[depth] = [];
    }

    if (utils.isUndefined(fieldGroupInfo.right[depth])) {
      fieldGroupInfo.right[depth] = [];
    }

    // 컬럼 고정 처리.
    if (fixedLeftIndex > field.$resizeIdx - field.$colspan) {
      if (field.$colspan == 1) {
        fieldGroupInfo.left[depth].push(field);
      } else {
        const leftNode = utils.merge({}, field);

        if (leftNode.$resizeIdx > fixedLeftIndex) {
          leftNode.$colspan = fixedLeftIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedLeftIndex;
        }

        fieldGroupInfo.left[depth].push(leftNode);
        if (fixedLeftIndex < field.$resizeIdx) {
          const bodyNode = utils.merge({}, field);
          bodyNode.$colspan = field.$resizeIdx - fixedLeftIndex;
          fieldGroupInfo.center[depth].push(bodyNode);
        }
      }
      if (field.$isLeaf) fieldGroupInfo.leafLeft.push(field);
    } else if (fixedRightIndex <= field.$resizeIdx - field.$colspan) {
      fieldGroupInfo.right[depth].push(field);
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    } else {
      fieldGroupInfo.center[depth].push(field);
      if (field.$isLeaf) fieldGroupInfo.leafCenter.push(field);
    }

    if (field.$isLeaf) {
      fieldGroupInfo.leaf.push(field);
    }

    return field;
  }

  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public headerTemplate(type: string) {
    const cfg = this.grid.config(),
      opts = this.grid.getOptions();

    let headerGroup;
    let leafGroup;
    if (type == "left") {
      headerGroup = cfg.fieldHeaderGroup.left;
      leafGroup = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      headerGroup = cfg.fieldHeaderGroup.right;
      leafGroup = cfg.fieldHeaderGroup.leafRight;
    } else {
      headerGroup = cfg.fieldHeaderGroup.center;
      leafGroup = cfg.fieldHeaderGroup.leafCenter;
    }

    let headerGroupLength = headerGroup.length;

    if (headerGroupLength < 1 || headerGroup[0].length < 1) return "";

    let strHtm = [];

    const height = opts.header.height;
    const heights = opts.header.heights;

    const helpEnabled = opts.header.help.enabled;
    const helpTitle = opts.header.help.title;

    for (let i = 0, len = headerGroupLength; i < len; i++) {
      let ghArr = headerGroup[i];

      let trHeight = height;
      if (heights.length > i) {
        trHeight = heights[i];
        trHeight = trHeight > 0 ? trHeight : height;
      }

      strHtm.push(`<tr class="dg-header-tr" style="height:${trHeight}px">`);
      for (let j = 0; j < ghArr.length; j++) {
        let ghItem = ghArr[j];

        if (ghItem.$isLeaf && ghItem.$depth < headerGroupLength) {
          ghItem.$rowspan = headerGroupLength - ghItem.$depth + 1;
        }

        let thHtm = `<th class="dg-header-th ${ghItem.styleClass ? ghItem.styleClass(ghItem) : ""}"
              ${ghItem.$colspan > 1 ? ` scope="colgroup" colspan="${ghItem.$colspan}" ` : ""}
              ${ghItem.$rowspan > 1 ? ` rowspan="${ghItem.$rowspan}" ` : ""}
              data-header-info="${i + "," + j}" 
              data-col-idx="${ghItem.$resizeIdx}"
            ">
            
            ${
              helpEnabled
                ? `<div class="dg-header-help-wrapper" title="${helpTitle}">
              <svg class="dg-header-help" viewBox="0 0 100 100"><g><polygon class="dg-header-help-btn" points="0 0,0 100,100 0"></polygon></g></svg> 
            </div>`
                : ""
            }
              
            <div class="label-wrapper">
              <div class="dg-header-cont ${ghItem.sort === true ? "sort-header" : ""} ">
                <div class="dg-inner"><div class="centered">${ghItem.label}</div></div>
                ${ghItem.sort === true ? '<div class="dg-sort-icon sort-up">u</div><div class="dg-sort-icon sort-down">d</div>' : ""}
              </div>
            </div>
            <div class="dg-header-resizer"></div>
            </th>
          `;

        strHtm.push(thHtm);
      }
      strHtm.push("</tr>");
    }

    let colGroupHtm = [];
    let colGroupIdx = 0;
    let tableWidth = 0;
    for (let leafNode of leafGroup) {
      const nodeWidth = leafNode.width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<col data-col-idx="${colGroupIdx++}" style="width:${nodeWidth}px;">`);
    }

    return `<table class="dg-header-table" style="width:${tableWidth}px;"><colgroup>${colGroupHtm.join("")}</colgroup><thead>${strHtm.join("")}</thead></table>`;
  }
}
