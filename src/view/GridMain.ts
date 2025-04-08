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

  private _BODY_STYLE: string[] = ["default", "striped", "borderless"];

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

    this.initEvent();
  }

  initMainView() {
    this.header = new Header(this.grid, this);
    this.body = new Body(this.grid, this);
    this.scroll = new Scroll(this.grid, this);
  }

  public initEvent() {
    const opts = this.grid.getOptions();

    if (opts.autoResize.enabled === true) {
      this.initResizeEvent();
    }
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    let beforeResizeTime = -1;
    const opts = this.grid.getOptions();
    const threshold = opts.autoResize.threshold;
    window.addEventListener("resize", () => {
      console.log("aaaa");

      if (threshold < 1) {
        console.log("2222");
        return;
      }

      if (beforeResizeTime != -1 && beforeResizeTime + threshold > new Date().getTime()) {
        return;
      }

      beforeResizeTime = new Date().getTime();

      window.requestAnimationFrame(() => {
        setTimeout(() => {
          console.log("this._mainElement.width() : ", this.grid.element().width(), this.grid.element().height());
        }, threshold);
      });
    });
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

  setSize(width?: number, height?: number) {
    const cfg = this.grid.config();
    cfg.dimensions.width = utils.isNumber(width) ? width : this.grid.element().width();
    cfg.dimensions.height = utils.isNumber(height) ? height : this.grid.element().height();

    //
    //처리할것.
    //

    cfg.dimensions.mainHeight = cfg.dimensions.height - (cfg.dimensions.toolbarHeight + cfg.dimensions.footerHeight);
  }

  setElementsDimentions() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    this._mainElement.setHeight(dimensions.mainHeight);
    this._mainElement.findDaraElement(".dg-body").setHeight(dimensions.mainBodyHeight);
  }

  /**
   * 사이즈 계산 후
   */
  calcGridDimention() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;

    const opts = this.grid.getOptions();

    cfg.dataInfo.rowLength = this.grid.getOptions().items.length;

    if (opts.toolbar.enabled) {
      dimensions.toolbarHeight = utils.isNumber(opts.toolbar.height) ? opts.toolbar.height : TOOLBAR_HEIGHT;
    }

    if (opts.footer.enabled) {
      dimensions.footerHeight = utils.isNumber(opts.footer.height) ? opts.footer.height : FOOTER_HEIGHT;
    }

    if (!utils.isUndefined(opts.summary)) {
      const summaryItemLength = opts.summary.items.length > 0 ? opts.summary.items.length : 0;
      dimensions.mainSummaryHeight = summaryItemLength * opts.body.row.height;
    }

    this.setSize();
  }

  /**
   * grid body 계산
   *
   * @public
   */
  public calcBody() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();
    const fields = cfg.currentFields;
    const fieldLength = fields.length;

    let mainTotalWidth = 0;
    for (const field of fields) {
      mainTotalWidth += field.width;
    }

    cfg.scroll.enableHorizontal = mainTotalWidth > dimensions.width;

    //세로 스크롭 계산 start
    const rowHeight = this.grid.getOptions().body.row.height;

    dimensions.mainBodyHeight = dimensions.mainHeight - (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (cfg.scroll.enableHorizontal ? this.grid.getOptions().scroll.width : 0));
    cfg.scroll.viewRow = Math.ceil(dimensions.mainBodyHeight / rowHeight);
    cfg.scroll.viewRow = cfg.scroll.viewRow > cfg.dataInfo.rowLength ? cfg.dataInfo.rowLength : cfg.scroll.viewRow;

    cfg.scroll.enableVertical = rowHeight * cfg.dataInfo.rowLength > dimensions.mainBodyHeight;
    //세로 스크롭 계산 end

    const viewGridWidth = mainTotalWidth + (cfg.scroll.enableVertical ? opts.scroll.width : 0) + (cfg.fixedRightIndex > 0 ? 1 : 3); // 마지막 여백처리;
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
      field.$maxWidth = -1;

      this.setRendererInfo(field);

      // 그리드 남는 영역을 계산 해서 컬럼에 추가.
      if (!field.$isAside && opts.enableWidthFixed !== true) {
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
    dimensions.mainTotalWidth = leftWidth + centerWidth + rightWidth;
    dimensions.mainInsideWidth = dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0) - (cfg.fixedRightIndex > 0 ? 0 : 1); // 마지막 여백처리;

    cfg.dataInfo.colLength = fieldLength;
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

    asideOrder = asideOrder.filter((item) => item !== null && item !== undefined);

    cfg.dataInfo.asideLength = asideOrder.length;

    const fixedLeftIndex = cfg.dataInfo.asideLength + cfg.fixedLeftIndex - 1;
    let fixedRightIndex = cfg.fixedRightIndex < 1 ? 0 : cfg.dataInfo.asideLength + cfg.fixedRightIndex;

    fixedRightIndex = fixedRightIndex > fixedLeftIndex + 1 ? fixedRightIndex : 0;

    fields.unshift(...asideOrder);

    let fieldIndex = 0;

    for (let field of fields) {
      this.headerGroupInfo(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, "" + fieldIndex++);
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
  public headerGroupInfo(field: FieldItem, depth: number, fieldGroupInfo: FieldHeaderGroupInfo, fixedLeftIndex: number, fixedRightIndex: number, fieldIndex: string) {
    if (field.hidden) {
      field.$colspan = 0;
      return field;
    }

    field.$depth = depth + 1;

    field.$uid = "u_" + field.$depth + "_" + fieldIndex;
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
        let childFieldIndex = 0;
        for (let childNode of children) {
          this.headerGroupInfo(childNode, field.$depth, fieldGroupInfo, fixedLeftIndex, fixedRightIndex, fieldIndex + "_" + childFieldIndex++);
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

    // left 고정 컬럼
    if ((field.$childLength > 0 && fixedLeftIndex > field.$resizeIdx - field.$colspan) || (field.$childLength < 1 && fixedLeftIndex >= field.$resizeIdx)) {
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
    }

    // right 고정 컬럼
    if (fixedRightIndex > 0 && fixedRightIndex <= field.$resizeIdx) {
      if (field.$colspan == 1) {
        fieldGroupInfo.right[depth].push(field);
      } else {
        let rightColspan = field.$colspan;
        if (fixedRightIndex <= field.$resizeIdx) {
          const bodyNode = utils.merge({}, field) as FieldItem;
          bodyNode.$colspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;
          bodyNode.$resizeIdx = fixedRightIndex - 1;
          rightColspan = rightColspan - bodyNode.$colspan;

          const idx = fieldGroupInfo.center[depth].findIndex((value) => value.$uid === bodyNode.$uid);

          if (idx > -1) {
            fieldGroupInfo.center[depth][idx] = bodyNode;
          } else {
            fieldGroupInfo.center[depth].push(bodyNode);
          }
        }

        const rightNode = utils.merge({}, field);

        rightNode.$colspan = rightColspan;
        rightNode.$resizeIdx = field.$resizeIdx;

        fieldGroupInfo.right[depth].push(rightNode);
      }

      field.$panel = "right";
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    }

    if (utils.isUndefined(field.$panel)) {
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

    const scrollMode = (cfg.scroll.enableHorizontal ? 1 : 0) + (cfg.scroll.enableVertical ? 2 : 0);

    let templateHtml = `
      <div class="daracl-grid">
        <div style="width:${dimensions.width}px;height:${dimensions.height}px;overflow: hidden;position:absolute;">
          ${opts.toolbar.enabled ? `<div class="dg-toolbar" style="height:${dimensions.toolbarHeight}px;"></div>` : ""}
          <div class="dg-main daracl-noselect dg-style-${this._BODY_STYLE.includes(opts.styleClass) ? opts.styleClass : "default"}" data-scroll="${SCROLL_MODE[scrollMode]}">
              <div class="dg-main-container ">
                  ${
                    opts.header.view
                      ? `<div class="dg-panel dg-header" style="height:${dimensions.mainHeaderHeight}px;">
                        <div class="dg-left"></div>
                        <div class="dg-center"></div>
                        <div class="dg-right"></div>
                    </div>`
                      : ""
                  }
                  
                  <div class="dg-panel dg-body ">
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
                  <div class="dg-scroll vertical" style="width:${opts.scroll.width}px">
                    <div class="dg-scroll-track"></div>
                    <div class="dg-scroll-thumb"></div>
                    <div class="dg-scroll-button up"><svg style="width: 12px; height: 12px;fill: currentColor;" viewBox="0 0 1024 1024"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"/></svg></div>
                    <div class="dg-scroll-button down"><svg style="width: 12px; height: 12px;fill: currentColor;" viewBox="0 0 1024 1024"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"/></svg></div>
                  </div>
                  <div class="dg-scroll horizontal" style="height:${opts.scroll.width}px">
                    <div class="dg-scroll-track"></div>
                    <div class="dg-scroll-thumb"></div>
                    <div class="dg-scroll-button left"><svg style="width: 12px; height: 12px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"/></svg></div>
                    <div class="dg-scroll-button right"><svg style="width: 12px; height: 12px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"/></svg></div>
                  </div>
              </div>
          </div>
          ${opts.footer.enabled ? `<div class="dg-footer" style="height:${dimensions.footerHeight}px;"></div>` : ""}
        </div>
    </div>
    `;

    this.grid.element().html(templateHtml);

    this._mainElement = new DaraElement(this.grid.element().find(".dg-main"));
  }
}
