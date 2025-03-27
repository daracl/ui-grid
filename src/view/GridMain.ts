import { GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, FieldHeaderGroupInfo, GridElement, Selection } from "@t/GridConfig";

import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "../util/Lanauage";
import * as utils from "../util/utils";
import { addStyleTag } from "../util/styleUtils";
import { isFixedLeftPostion } from "../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { merge } from "src/util/utils";
import { ALIGN_STYLE, FOOTER_HEIGHT, TOOLBAR_HEIGHT, VIEW_RENDERER } from "src/constants";
import Header from "./main/Header";
import Body from "./main/Body";
import DaraElement from "src/element/DaraElement";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";

declare const APP_VERSION: string;

// all instance
const allInstance: any = {};

const SCROLL_MODE = ["none", "horizontal", "vertical", "both"];

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

  private header: Header;

  private body: Body;

  private mainElement: DaraElement;

  private enableViewAllLabel: boolean;

  private cellMinWidth: number;

  private enableWidthFixed: boolean;

  constructor(grid: DaraGrid) {
    this.grid = grid;

    const headerOpts = grid.getOptions().header;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;

    this.cellMinWidth = headerOpts.resize.minWidth;
    this.enableWidthFixed = grid.getOptions().enableWidthFixed;

    this.calculation();
    this.initTemplate();

    this.initMainView();
  }
  initMainView() {
    this.header = new Header(this.grid, this);

    this.body = new Body(this.grid, this);
  }

  public calculation() {
    this.calcGridDimention();
    this.calcScroll();
    this.calcHeader(true);
  }

  /**
   * 치수 셋팅
   */
  calcGridDimention() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;

    const opts = this.grid.getOptions();

    cfg.dataInfo.rowLength = this.grid.getOptions().items.length;

    // 수치 계산할것.
    dimensions.width = utils.isNumber(opts.width) ? opts.width : this.grid.element().width();
    dimensions.height = utils.isNumber(opts.height) ? opts.height : this.grid.element().height();

    if (opts.toolbar.enabled) {
      dimensions.toolbarHeight = utils.isNumber(opts.toolbar.height) ? opts.toolbar.height : TOOLBAR_HEIGHT;
    }

    if (opts.footer.enabled) {
      dimensions.footerHeight = utils.isNumber(opts.footer.height) ? opts.footer.height : FOOTER_HEIGHT;
    }

    if (!utils.isUndefined(opts.summary)) {
      const summaryItemLength = opts.summary.items.length > 0 ? opts.summary.items.length : 0;
      dimensions.mainSummaryHeight = summaryItemLength + opts.body.row.height;
    }

    dimensions.mainHeight = dimensions.height - (dimensions.toolbarHeight + dimensions.footerHeight);
  }

  /**
   * 스크롭 계산
   */
  calcScroll() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;

    const rowHeight = this.grid.getOptions().body.row.height;

    dimensions.mainBodyHeight = dimensions.mainHeight - dimensions.mainHeaderHeight;
    cfg.scroll.viewRow = Math.ceil(dimensions.mainBodyHeight / rowHeight);
    cfg.scroll.viewRow = cfg.scroll.viewRow > cfg.dataInfo.rowLength ? cfg.dataInfo.rowLength : cfg.scroll.viewRow;

    cfg.scroll.enableVertical = rowHeight * cfg.dataInfo.rowLength > dimensions.mainBodyHeight;
    cfg.scroll.enableHorizontal = dimensions.mainWidth > dimensions.width + (cfg.scroll.enableVertical ? this.grid.getOptions().scroll.width : 0);
  }

  /**
   * @method calcHeader
   * @description 헤더 정보 계산
   */
  public calcHeader(calcFlag: boolean) {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    let fieldGroupInfo = this.calcHeaderGroupInfo();

    cfg.currentFields = fieldGroupInfo.leaf;

    const fields = cfg.currentFields;
    const fieldLength = fields.length;

    const totalGridWidth = cfg.dimensions.width;

    const viewGridWidth = cfg.dimensions.mainWidth + (cfg.scroll.enableVertical ? opts.scroll.width : 0);
    const overWidth = totalGridWidth - viewGridWidth;
    let remainderWidth = 0,
      lastSpaceW = 0;
    if (overWidth > 0) {
      remainderWidth = Math.floor(overWidth / (fieldLength - cfg.dataInfo.asideLength));

      lastSpaceW = overWidth - remainderWidth * (fieldLength - cfg.dataInfo.asideLength);
    }

    console.table({ totalGridWidth, viewGridWidth, remainderWidth, lastSpaceW });

    let leftWidth = 0,
      centerWidth = 0,
      rightWidth = 0,
      viewColCount = 0;

    for (let j = 0; j < fieldLength; j++) {
      const field = fields[j];
      field.$maxWidth = -1; // max width

      this.setRendererInfo(field);

      ++viewColCount;

      if (field.$isAside || opts.enableWidthFixed === true) {
        field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
      } else {
        //넓이 처리 할것.
        //ㅁㄴㅇㄹ/ㅁㅈㄷ
        // ㅁ;
        // ㅈㄷㄹ;
        // ㅁㅈ;
        // ㄷㄻ;
        // ㅈㄹㄷ;

        if (this.enableViewAllLabel) {
          const labelWidth = field.label.length * 5;
          field.width = utils.isNumber(field.width) && field.width > labelWidth ? field.width : labelWidth;
        } else {
          field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
        }

        field.width = field.width + remainderWidth + (lastSpaceW > 0 ? 1 : 0);

        lastSpaceW = lastSpaceW - 1;

        field.width = Math.max(field.width, this.cellMinWidth);
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

    cfg.dimensions.mainLeftWidth = leftWidth;
    cfg.dimensions.mainCenterWidth = centerWidth;
    cfg.dimensions.mainRightWidth = rightWidth;
    cfg.dimensions.mainWidth = leftWidth + centerWidth + rightWidth;

    cfg.dataInfo.colLength = viewColCount;
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

    let render = VIEW_RENDERER[renderInfo.type];
    if (utils.isUndefined(render)) {
      renderInfo.type = "text";
    }

    field.renderer = renderInfo;
    field.$renderer = new VIEW_RENDERER[renderInfo.type](field);

    return field;
  }

  /**
   * @method _getColumnGroupInfo
   * @description 헤더 그룹 정보
   */
  public calcHeaderGroupInfo() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    let fields = utils.deepCopy(opts.fields);

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    let asideOrder: any[] = [];

    // linenumber
    if (opts.aside.lineNumber.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.lineNumber, { name: "lineNumber", renderer: { type: "lineNumber" }, $isAside: true });
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

    cfg.dataInfo.asideLength = asideOrder.length;
    fields.unshift(...asideOrder);

    for (let field of fields) {
      this.groupInfo(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex);
    }

    cfg.fieldHeaderGroup.depth = cfg.fieldHeaderGroup.center.length;

    const height = opts.header.height;
    const heights = opts.header.heights;
    const groupDepth = cfg.fieldHeaderGroup.depth;

    cfg.fieldHeaderGroup.heights = new Array(groupDepth);

    let mainHeaderHeight = 0;

    for (let i = 0; i < groupDepth; i++) {
      let trHeight = height;
      if (heights.length > i) {
        trHeight = heights[i];
        trHeight = trHeight > 0 ? trHeight : height;
      }
      mainHeaderHeight += trHeight;
      cfg.fieldHeaderGroup.heights[i] = trHeight;
    }

    cfg.dimensions.mainHeaderHeight = mainHeaderHeight;

    return cfg.fieldHeaderGroup;
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
    field.$colspan = field.colspan ?? 1;
    field.$rowspan = field.rowspan ?? 1;
    field.$childLength = 0;

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
      if (field.$isAside || this.enableWidthFixed === true) {
        field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
      } else {
        if (this.enableViewAllLabel) {
          const labelWidth = field.label.length * 5;
          field.width = utils.isNumber(field.width) && field.width > labelWidth ? field.width : labelWidth;
        } else {
          field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
        }
      }

      fieldGroupInfo.leaf.push(field);
    }

    return field;
  }

  /**
   * change scroll mode
   *
   * @param mode scroll mode
   */
  public changeScrollMode(mode: string) {
    if (mode == "none") {
      this.mainElement.removeAttr("data-scroll");
    } else {
      this.mainElement.attr({ "data-scroll": mode });
    }
  }

  public initTemplate() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    const scrollMode = (cfg.scroll.enableHorizontal ? 1 : 0) + (cfg.scroll.enableVertical ? 2 : 0); // vertical을 왼쪽으로 1비트 이동하고, horizontal과 OR 연산

    let templateHtml = `
      <div class="daracl-grid" style="width:${dimensions.width}px;height:${dimensions.height}px;">
        ${opts.toolbar.enabled ? `<div class="dg-toolbar" style="height:${dimensions.toolbarHeight}px;"></div>` : ""}
        <div class="dg-main daracl-noselect" style="height:${dimensions.mainHeight}px;" data-scroll="${SCROLL_MODE[scrollMode]}">
            <div class="dg-main-container">
               ${
                 opts.header.view
                   ? `<div class="dg-panel dg-header">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>`
                   : ""
               }
                
                <div class="dg-panel dg-body">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>
                ${
                  dimensions.mainSummaryHeight > 0
                    ? `<div class="dg-panel dg-summary">
                    <div class="dg-left"></div>
                    <div class="dg-center"></div>
                    <div class="dg-right"></div>
                </div>`
                    : ""
                }
            </div>
            <div class="dg-scroll-container">
                <div class="dg-scroll vertical"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button up"></div><div class="dg-scroll-button down"></div></div>
                <div class="dg-scroll horizontal"><div class="dg-scroll-track"></div><div class="dg-scroll-thumb"></div><div class="dg-scroll-button up"></div><div class="dg-scroll-button down"></div></div>
            </div>
        </div>
        ${opts.footer.enabled ? `<div class="dg-footer" style="height:${dimensions.footerHeight}px;"></div>` : ""}
    </div>
    `;

    this.grid.element().html(templateHtml);

    this.mainElement = new DaraElement(this.grid.element().find(".dg-main"));
  }
}
