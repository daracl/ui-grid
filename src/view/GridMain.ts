import { FieldHeaderGroupInfo } from "@t/GridConfig";

import * as utils from "../util/utils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { ALIGN_STYLE, FOOTER_HEIGHT, TOOLBAR_HEIGHT, VIEW_RENDERER } from "src/constants";
import Header from "./main/Header";
import Body from "./main/Body";
import DaraElement from "src/element/DaraElement";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";
import Scroll from "./main/Scroll";

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

  private scroll: Scroll;

  private _mainElement: DaraElement;

  private readonly enableViewAllLabel: boolean;

  private readonly cellMinWidth: number;

  constructor(grid: DaraGrid) {
    this.grid = grid;

    const headerOpts = grid.getOptions().header;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;

    this.cellMinWidth = headerOpts.resize.minWidth;

    this.calculation();
    this.initTemplate();

    this.setElementsDimentions();

    this.initMainView();
  }

  initMainView() {
    this.header = new Header(this.grid, this);
    this.body = new Body(this.grid, this);
    this.scroll = new Scroll(this.grid, this);
  }

  public initEvent() {
    //this.scroll();
  }

  public calculation() {
    this.calcGridDimention();
    this.calcHeader();
    this.calcBody();
  }

  public mainElement() {
    return this._mainElement;
  }

  public getBody() {
    return this.body;
  }

  setElementsDimentions() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    this._mainElement.setHeight(dimensions.mainHeight);
    this._mainElement.findDaraElement(".dg-body").setHeight(dimensions.mainBodyHeight);
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

  public calcBody() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();
    const fields = cfg.currentFields;
    const fieldLength = fields.length;

    let mainWidth = 0;
    for (const field of fields) {
      mainWidth += field.width;
    }
    dimensions.mainWidth = mainWidth;

    this.calcScroll();

    const viewGridWidth = mainWidth + (cfg.scroll.enableVertical ? opts.scroll.width : 0);
    const overWidth = dimensions.width - viewGridWidth;
    let remainderWidth = 0,
      lastSpaceW = 0;
    if (overWidth > 0) {
      remainderWidth = Math.floor(overWidth / (fieldLength - cfg.dataInfo.asideLength));
      lastSpaceW = overWidth - remainderWidth * (fieldLength - cfg.dataInfo.asideLength);
    }

    let leftWidth = 0,
      centerWidth = 0,
      rightWidth = 0;

    for (let j = 0; j < fieldLength; j++) {
      const field = fields[j];
      field.$maxWidth = -1; // max width

      this.setRendererInfo(field);

      if (field.$isAside || opts.enableWidthFixed === true) {
        field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
      } else {
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

    dimensions.mainLeftWidth = leftWidth;
    dimensions.mainCenterWidth = centerWidth;
    dimensions.mainRightWidth = rightWidth;
    dimensions.mainWidth = leftWidth + centerWidth + rightWidth;

    cfg.dataInfo.colLength = fieldLength;
  }
  calcScroll() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    //스크롭 계산
    const rowHeight = this.grid.getOptions().body.row.height;
    const totalRowHeight = rowHeight * cfg.dataInfo.rowLength;

    dimensions.mainBodyHeight = dimensions.mainHeight - (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight);
    cfg.scroll.viewRow = Math.ceil(dimensions.mainBodyHeight / rowHeight);
    cfg.scroll.viewRow = cfg.scroll.viewRow > cfg.dataInfo.rowLength ? cfg.dataInfo.rowLength : cfg.scroll.viewRow;

    cfg.scroll.enableVertical = rowHeight * cfg.dataInfo.rowLength > dimensions.mainBodyHeight;
    cfg.scroll.enableHorizontal = dimensions.mainWidth > dimensions.width + (cfg.scroll.enableVertical ? this.grid.getOptions().scroll.width : 0);

    const scrollHeight = dimensions.mainHeight;

    let barHeight = (scrollHeight * ((dimensions.mainBodyHeight / totalRowHeight) * 100)) / 100;
    if (scrollHeight < 25) {
      barHeight = 1;
    } else {
      barHeight = barHeight < 25 ? 25 : barHeight > scrollHeight ? scrollHeight : barHeight;
    }

    cfg.scroll.vHeight = scrollHeight;
    cfg.scroll.vThumbHeight = barHeight;
    cfg.scroll.vTrackHeight = scrollHeight - barHeight;
    cfg.scroll.oneRowMove = cfg.scroll.vTrackHeight / (cfg.dataInfo.rowLength - cfg.scroll.viewRow);

    /*
    스크롤 처리할것. 
    */

    topVal = (cfg.scroll.vTrackHeight * cfg.scroll.vBarPosition) / 100;

    _this.element.vScrollBar.css("height", barHeight);
  }

  /**
   * @method calcHeader
   * @description 헤더 정보 계산
   */
  public calcHeader() {
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
      this.headerGroupInfo(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex);
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

    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
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
  public headerGroupInfo(field: FieldItem, depth: number, fieldGroupInfo: FieldHeaderGroupInfo, fixedLeftIndex: number, fixedRightIndex: number) {
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
          this.headerGroupInfo(childNode, field.$depth, fieldGroupInfo, fixedLeftIndex, fixedRightIndex);
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
      if (this.enableViewAllLabel) {
        const labelWidth = field.label.length * 5;
        field.width = utils.isNumber(field.width) && field.width > labelWidth ? field.width : labelWidth;
      } else {
        field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;
      }

      if (!field.$isAside) {
        field.width = Math.max(field.width, this.cellMinWidth);
      }

      fieldGroupInfo.leaf.push(field);
    }

    return field;
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
   * change scroll mode
   *
   * @param mode scroll mode
   */
  public changeScrollMode(mode: string) {
    if (mode == "none") {
      this._mainElement.removeAttr("data-scroll");
    } else {
      this._mainElement.attr({ "data-scroll": mode });
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
        <div class="dg-main daracl-noselect" data-scroll="${SCROLL_MODE[scrollMode]}">
            <div class="dg-main-container">
               ${
                 opts.header.view
                   ? `<div class="dg-panel dg-header" style="height:${dimensions.mainHeaderHeight}px;">
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
                    ? `<div class="dg-panel dg-summary" style="height:${dimensions.mainSummaryHeight}px;">
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

    this._mainElement = new DaraElement(this.grid.element().find(".dg-main"));
  }
}
