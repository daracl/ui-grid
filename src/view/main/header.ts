import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, FieldHeaderGroupInfo, GridElement, Selection } from "@t/GridConfig";

import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE, RENDER_TEMPLATE } from "src/constants";
import DaraElement from "src/element/DaraElement";
import GridMain from "../GridMain";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";

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
    this.leftElement = containerElement.findDaraElement(".dg-header>.dg-left");
    this.centerElement = containerElement.findDaraElement(".dg-header>.dg-center");
    this.rightElement = containerElement.findDaraElement(".dg-header>.dg-right");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
  }

  /**
   * @method calculation
   * @description 헤더 정보 계산
   */
  public calculation(calcFlag: boolean) {
    const cfg = this.grid.config();

    const headerOptions = this.headerOptions;

    this.initFieldGroupInfo();
    let fieldGroupInfo = cfg.fieldHeaderGroup;
    // header element height
    if (headerOptions.view !== false) {
      cfg.dimension.mainHeaderHeight = headerOptions.height * fieldGroupInfo.depth;
    }

    cfg.currentFields = fieldGroupInfo.leaf;

    const enableViewAllLabel = calcFlag === false ? false : headerOptions.enableViewAllLabel === true;

    let leftWidth = 0,
      centerWidth = 0,
      rightWidth = 0,
      viewColCount = 0;

    const fields = fieldGroupInfo.leaf;

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      field.$maxWidth = -1; // max width

      if (field.hidden) continue;

      this.setRendererInfo(field);

      ++viewColCount;

      if (field.$isAside) {
        field.width = isNaN(field.width) ? headerOptions.resize.minWidth : field.width;
      } else {
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
      }

      field.$alignStyle = ALIGN_STYLE[field.align] ?? ALIGN_STYLE.left;

      cfg.currentFields[j] = field;

      if (field.$panel == "left") {
        leftWidth += field.width;
      } else if (field.$panel == "right") {
        rightWidth += field.width;
      } else {
        centerWidth += field.width;
      }
    }

    cfg.dimension.mainLeftWidth = leftWidth;
    cfg.dimension.mainCenterWidth = centerWidth;
    cfg.dimension.mainRightWidth = rightWidth;

    cfg.dataInfo.colLength = viewColCount;

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
    const opts = this.grid.getOptions();
    if (opts.enableWidthFixed === true) {
      return;
    }

    const cfg = this.grid.config();

    const _gw = cfg.dimension.width,
      tci = cfg.currentFields,
      tciLen = cfg.dataInfo.colLength;

    let verticalScrollWidth = 0;

    if (opts.items.length > 0) {
      if (opts.items.length * opts.body.row.height > cfg.dimension.mainHeight) {
        verticalScrollWidth = opts.scroll.vertical.width;
      }
    }

    const _totW = cfg.dimension.mainLeftWidth + cfg.dimension.mainLeftWidth + cfg.dimension.mainCenterWidth + verticalScrollWidth;

    const resizeFlag = _totW < _gw;
    const remainderWidth = Math.floor((_gw - _totW) / tciLen),
      lastSpaceW = _gw - _totW - remainderWidth * tciLen;

    if (resizeFlag) {
      let leftWidth = 0,
        rightWidth = 0,
        centerWidth = 0;
      const resizeMinWidth = opts.header.resize.minWidth;

      for (let j = 0; j < tciLen; j++) {
        const field = tci[j];

        if (field.$panel == "left") {
          leftWidth += field.width;
        } else if (field.$panel == "right") {
          rightWidth += field.width;
        } else {
          field.width += remainderWidth;
          field.width = Math.max(field.width, resizeMinWidth);
          centerWidth += field.width;
        }
      }
      cfg.currentFields[tciLen - 1].width += lastSpaceW;
      cfg.dimension.mainLeftWidth = rightWidth;
      cfg.dimension.mainCenterWidth = rightWidth + lastSpaceW;
      cfg.dimension.mainRightWidth = rightWidth;
    }
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
    let fields = utils.deepCopy(opts.fields);

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    let asideOrder: any[] = [];

    // linenumber
    if (opts.aside.lineNumber.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.lineNumber, { name: "lineNumber", renderer: { type: "lineNumber" }, $isAside: true });
      console.log("lineNumber    ", opts.aside.lineNumber, fieldItem);

      asideOrder[opts.aside.lineNumber.order ?? 0] = fieldItem;
    }

    // rowCheckbox
    if (opts.aside.rowCheckbox.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.rowCheckbox, { name: "rowCheckbox", renderer: { type: "rowCheckbox" }, $isAside: true });
      asideOrder[opts.aside.rowCheckbox.order ?? 1] = fieldItem;
    }

    // modifyInfo 추가.
    if (opts.aside.modifyInfo.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.modifyInfo, { name: "modifyInfo", renderer: { type: "modifyInfo" }, $isAside: true });
      asideOrder[opts.aside.modifyInfo.order ?? 2] = fieldItem;
    }

    const fixedLeftIndex = asideOrder.length + cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;

    fields.unshift(...asideOrder);

    for (let field of fields) {
      this.groupInfo(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex);
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
  public groupInfo(field: FieldItem, depth: number, fieldGroupInfo: FieldHeaderGroupInfo, fixedLeftIndex: number, fixedRightIndex: number) {
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
          this.groupInfo(childNode, field.$depth, fieldGroupInfo, fixedLeftIndex, fixedRightIndex);
          colspan += childNode.$colspan;
        }

        field.$colspan = colspan;
        field.$resizeIdx = fieldGroupInfo.leaf.length - 1;
      }
    } else {
      field.$resizeIdx = fieldGroupInfo.leaf.length;
    }

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
      field.$panel = "left";
      if (field.$isLeaf) fieldGroupInfo.leafLeft.push(field);
    } else if (fixedRightIndex <= field.$resizeIdx - field.$colspan) {
      fieldGroupInfo.right[depth].push(field);
      field.$panel = "right";
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    } else {
      fieldGroupInfo.center[depth].push(field);
      field.$panel = "center";
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
  public template(type: string) {
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

        let thHtm = [];
        thHtm.push(`<th class="dg-header-th ${ghItem.styleClass ? ghItem.styleClass(ghItem) : ""}"
              ${ghItem.$colspan > 1 ? ` scope="colgroup" colspan="${ghItem.$colspan}" ` : ""}
              ${ghItem.$rowspan > 1 ? ` rowspan="${ghItem.$rowspan}" ` : ""}
              data-header-info="${i + "," + j}" 
              data-col-idx="${ghItem.$resizeIdx}"
        ">`);

        if (ghItem.$isAside) {
          thHtm.push(`
           <div class="label-wrapper">
             <div class="dg-header-cont ${ghItem.sort === true ? "sort-header" : ""} ">
               <div class="dg-inner"><div class="centered">${ghItem.label}</div></div>
             </div>
           </div>
           `);
        } else {
          thHtm.push(`
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
            `);
        }

        thHtm.push(`  </th> `);

        strHtm.push(thHtm.join(""));
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

    return `<table class="dg-header-table" style="width:${tableWidth}px;">
      <colgroup>${colGroupHtm.join("")}</colgroup>
      <thead>${strHtm.join("")}</thead>
    </table>`;
  }
}
