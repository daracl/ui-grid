import { FieldHeaderGroupInfo } from "@t/GridConfig";

import * as utils from "../util/utils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { ADD_ROW_POSITION, ALIGN_STYLE, FOOTER_HEIGHT, TOOLBAR_HEIGHT, VIEW_RENDERER } from "src/constants";
import Header from "./main/Header";
import Body from "./main/Body";
import DaraElement from "src/element/DaraElement";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO } from "src/defaultGridOption";
import Scroll from "./main/Scroll";
import { eventOff, eventOn } from "src/util/eventUtils";
import { isInputField } from "src/util/gridUtils";
import SelectionInfo from "src/selection/selection";

const SCROLL_MODE = ["none", "horizontal", "vertical", "both"];
/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export default class GridMain {
  private readonly grid: DaraGrid;

  private readonly _BODY_STYLE: string[] = ["default", "striped", "borderless"];

  private header: Header;

  private body: Body;

  private scroll: Scroll;

  private _mainElement: DaraElement;

  private containerElement: DaraElement;

  public pasteElement: DaraElement;

  private selectionStatusElement: DaraElement;

  private scrollStatusElement: DaraElement;

  private readonly enableViewAllLabel: boolean;

  private readonly cellMinWidth: number;

  public selectionInfo: SelectionInfo;

  private GRID_OFFSET: any;

  constructor(grid: DaraGrid) {
    this.grid = grid;

    const headerOpts = grid.getOptions().header;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;

    this.cellMinWidth = headerOpts.resize.minWidth;

    this.calculation();
    this.initTemplate();

    this.initMainView();

    this.setElementDimentions();

    this.initEvent();
  }

  initMainView() {
    this.selectionInfo = new SelectionInfo(this, this.grid.getOptions(), this.grid.config());
    this.header = new Header(this.grid, this);
    this.body = new Body(this.grid, this);
    this.scroll = new Scroll(this.grid, this);

    // grid draw
    this.body.dataDraw();
  }

  public initEvent() {
    const opts = this.grid.getOptions();

    if (opts.autoResize.enabled === true) {
      this.initResizeEvent();
    }

    const mainElement = this._mainElement.getElement();

    // focus in
    eventOn(mainElement, "mousedown", (e: UIEvent) => {
      this.setGridFocusIn(e);
    });

    // focus out
    eventOff(document, "mousedown");
    eventOn(document, "mousedown", (e: UIEvent) => {
      if (!this.grid.config().focus) {
        return true;
      }

      this.setGridFocusOut(e);
    });
  }

  public setGridFocusIn(e: Event) {
    if (this.grid.config().focus) return;
    this.grid.config().focus = true;

    const targetElement = e.target as HTMLElement;

    if (!isInputField(targetElement.tagName)) {
      // TODO
      //this.body.editAreaClose();
    }
  }

  // grid focus out
  public setGridFocusOut(e: Event) {
    if (!this.grid.config().focus) return;

    const targetElement = e.target as HTMLElement;

    if ((e as MouseEvent).button !== 2 && targetElement.closest(this.grid.getUidAttrSelector()) == null && targetElement.closest('[data-dg-grid-layer="' + this.grid.instanceId() + '"]') == null) {
      this.grid.config().focus = false;

      this.body.editAreaClose();
    }
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const opts = this.grid.getOptions();
    const threshold = opts.autoResize.threshold;

    const el = this.grid.element();

    this.GRID_OFFSET = { width: el.width(), height: el.height() };

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(
        utils.debounce(() => {
          this.resize(el);
        }, threshold)
      );

      resizeObserver.observe(el.getElement());
    } else {
      window.addEventListener(
        "resize",
        utils.debounce(() => {
          this.resize(el);
        }, threshold)
      );
    }
  }

  /**
   * resize event 처리
   *
   * @param el grid element
   */
  public resize(el: DaraElement) {
    requestAnimationFrame(() => {
      if (!utils.isVisible(el.getElement())) return;

      let newOffset = { width: el.width(), height: el.height() };
      if (this.GRID_OFFSET.height != newOffset.height || this.GRID_OFFSET.width != newOffset.width) {
        this.GRID_OFFSET = newOffset;
        this.setSize(el.width(), el.height());
      }
    });
  }

  /**
   * grid size 및 field 정보 계산
   */
  public calculation() {
    this.calcGridDimention();
    this.calcHeader();
    this.calcBody(true);
  }

  /**
   * main element
   *
   * @public
   * @returns {DaraElement} main element
   */
  public mainElement() {
    return this._mainElement;
  }

  /**
   * body object
   *
   * @public
   * @returns {Body} body object
   */
  public getBody() {
    return this.body;
  }

  /**
   * header object
   *
   * @public
   * @returns {Header} header object
   */
  public getHeader() {
    return this.header;
  }

  /**
   * scroll object
   *
   * @public
   * @returns {Scroll} object
   */
  public getScroll() {
    return this.scroll;
  }

  /**
   * set size
   *
   * @public
   * @param {?number} [width] 넓이
   * @param {?number} [height] 높이
   */
  public setSize(width?: number, height?: number) {
    const cfg = this.grid.config();
    cfg.dimensions.width = utils.isNumber(width) ? width : this.grid.element().width();
    cfg.dimensions.height = utils.isNumber(height) ? height : this.grid.element().height();
    cfg.dimensions.mainHeight = cfg.dimensions.height - (cfg.dimensions.toolbarHeight + cfg.dimensions.footerHeight);
    if (!utils.isUndefined(width)) {
      this.resizeDraw();
    }
  }

  resizeDraw() {
    const cfg = this.grid.config();
    this.calcBody();

    if (!utils.isUndefined(this._mainElement)) {
      this.setElementDimentions();
      this.scroll.calcScroll();
      this.fieldResize();

      if (cfg.scroll.before.viewRow != cfg.scroll.viewRow || cfg.scroll.before.startCol != cfg.scroll.startCol || cfg.scroll.before.endCol != cfg.scroll.endCol) {
        this.body.dataDraw("resize");
      }
    }
  }

  /**
   * cell size 설정
   */
  fieldResize() {
    const cfg = this.grid.config();

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    // left panel
    for (let j = 0; j < leftFields.length; j++) {
      const field = leftFields[j];
      if (!field.$isAside) {
        this.header.leftElement.find('th[data-col-idx="' + j + '"]').style.width = field.$width + "px";
        this.body.leftElement.find('th[data-col-idx="' + j + '"]').style.width = field.$width + "px";
      }
    }

    // center panel
    for (let j = 0; j < centerFields.length; j++) {
      const field = centerFields[j];
      const idx = cfg.fixedLeftIndex + j;
      this.header.centerElement.find('th[data-col-idx="' + idx + '"]').style.width = field.$width + "px";
      this.body.centerElement.find('th[data-col-idx="' + idx + '"]').style.width = field.$width + "px";
    }

    // right panel
    for (let j = 0; j < rightFields.length; j++) {
      const field = rightFields[j];
      const idx = cfg.fixedRightIndex + j;
      this.header.rightElement.find('th[data-col-idx="' + idx + '"]').style.width = field.$width + "px";
      this.body.rightElement.find('th[data-col-idx="' + idx + '"]').style.width = field.$width + "px";
    }
  }

  setElementDimentions() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    this._mainElement.setHeight(dimensions.mainHeight);
    this._mainElement.findDaraElement(".dg-body").setHeight(dimensions.mainBodyHeight);
    this.containerElement.css({
      width: dimensions.width + "px",
      height: dimensions.height + "px",
    });

    const mainLeftWidth = dimensions.mainLeftWidth;
    const mainCenterWidth = dimensions.mainCenterWidth;
    const mainRightWidth = dimensions.mainRightWidth;

    this.header.leftElement.css({ width: mainLeftWidth + "px" });
    this.header.centerElement.css({ "margin-left": mainLeftWidth - 1 + "px", width: mainCenterWidth + "px" });
    this.header.rightElement.css({ width: mainRightWidth + "px" });

    this.body.leftElement.css({ width: mainLeftWidth + "px" });
    this.body.centerElement.css({ "margin-left": mainLeftWidth - 1 + "px", width: mainCenterWidth + "px" });
    this.body.rightElement.css({ width: mainRightWidth + "px" });

    this.changeScrollMode();
  }

  /**
   * 사이즈 계산 후
   */
  calcGridDimention() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;

    const opts = this.grid.getOptions();

    cfg.items = utils.arrayCopy(this.grid.getOptions().items);
    cfg.orginItems = utils.arrayCopy(this.grid.getOptions().items);
    cfg.dataInfo.rowLength = cfg.items.length;
    cfg.dataInfo.lastRow = cfg.items.length > 0 ? cfg.dataInfo.rowLength - 1 : 0;

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
  public calcBody(isInit?: boolean) {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();
    const fields = cfg.currentFields;
    const fieldLength = fields.length;

    const isHeaderResize = cfg.isHeaderResize;

    let mainTotalWidth = 0;
    for (const field of fields) {
      mainTotalWidth += isHeaderResize ? field.$width : field.width;
    }

    cfg.scroll.enableHorizontal = mainTotalWidth > dimensions.width - this.grid.getOptions().scroll.width;

    //세로 스크롭 계산 start
    const rowHeight = this.grid.getOptions().body.row.height;

    if (opts.scroll.vertical.enable === false) {
      dimensions.mainHeight = rowHeight * cfg.dataInfo.rowLength + (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (cfg.scroll.enableHorizontal ? this.grid.getOptions().scroll.width : 0));
    }

    dimensions.mainBodyHeight = dimensions.mainHeight - (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (cfg.scroll.enableHorizontal ? this.grid.getOptions().scroll.width : 0));
    cfg.scroll.before.viewRow = cfg.scroll.viewRow;
    cfg.scroll.viewRow = Math.ceil(dimensions.mainBodyHeight / rowHeight);
    cfg.scroll.viewRow = cfg.scroll.viewRow < 1 ? 1 : cfg.scroll.viewRow;
    cfg.scroll.viewRow = cfg.scroll.viewRow > cfg.dataInfo.rowLength ? cfg.dataInfo.rowLength : cfg.scroll.viewRow;
    cfg.scroll.insideViewRow = cfg.scroll.viewRow - (dimensions.mainBodyHeight % rowHeight > 0 ? 1 : 0);

    cfg.scroll.enableVertical = rowHeight * cfg.dataInfo.rowLength > dimensions.mainBodyHeight;
    const verticalScrollWidth = cfg.scroll.enableVertical ? opts.scroll.width + 1 : 0; // +2 마지막 여백처리;

    let remainderWidth = 0,
      lastSpaceW = 0;

    let isAddSpaceWidth;

    if (!cfg.scroll.enableHorizontal) {
      const viewGridWidth = mainTotalWidth + verticalScrollWidth;
      const overWidth = dimensions.width - viewGridWidth;
      isAddSpaceWidth = true;
      let absOverWidth = overWidth < 0 ? Math.abs(overWidth) : overWidth;

      remainderWidth = Math.floor(absOverWidth / (fieldLength - cfg.dataInfo.asideLength));
      lastSpaceW = absOverWidth - remainderWidth * (fieldLength - cfg.dataInfo.asideLength);

      if (overWidth < 0) {
        isAddSpaceWidth = false;
        remainderWidth = -remainderWidth;
      }
    }

    let leftWidth = 0,
      centerWidth = 0,
      rightWidth = 0;

    for (let j = 0; j < fieldLength; j++) {
      const field = fields[j];
      let fieldWidth = isHeaderResize ? field.$width : field.width;

      if (isInit === true) {
        this.setRendererInfo(field);
      }

      // 그리드 남는 영역을 계산 해서 컬럼에 추가.
      if (!isHeaderResize && !field.$isAside && opts.enableWidthFixed !== true) {
        fieldWidth = fieldWidth + remainderWidth;

        if (lastSpaceW > 0) {
          const addSpaceW = lastSpaceW > 1 ? 1 : lastSpaceW;
          fieldWidth = fieldWidth + (isAddSpaceWidth ? 1 : -1) * addSpaceW;
          lastSpaceW = lastSpaceW - 1;
        }

        fieldWidth = Math.max(fieldWidth, this.cellMinWidth);
      }

      field.$alignStyle = ALIGN_STYLE[field.align] ?? ALIGN_STYLE.left;

      cfg.currentFields[j] = field;

      if (field.$panel == "left") {
        leftWidth += fieldWidth;
      } else if (field.$panel == "right") {
        rightWidth += fieldWidth;
      } else {
        centerWidth += fieldWidth;
      }

      field.$width = fieldWidth;
    }

    dimensions.mainLeftWidth = leftWidth;
    dimensions.mainCenterWidth = centerWidth;
    dimensions.mainRightWidth = rightWidth;
    dimensions.mainTotalWidth = leftWidth + centerWidth + rightWidth;
    dimensions.mainInsideWidth = dimensions.width - verticalScrollWidth; // 마지막 여백처리;
    dimensions.mainCenterOverWidth = dimensions.mainTotalWidth - dimensions.mainInsideWidth; // 마지막 여백처리;
    dimensions.mainCenterViewWidth = dimensions.mainInsideWidth - (leftWidth + rightWidth);

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
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.rowCheckbox, { name: "rowCheck", renderer: { type: "rowCheckbox" }, $isAside: true });
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
    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
    cfg.fixedLeftIndex = fixedLeftIndex + 1;
    cfg.fixedRightIndex = fixedRightIndex > cfg.currentFields.length ? 0 : fixedRightIndex;

    if (opts.header.view === false) {
      return;
    }

    const height = opts.header.height;
    const heights = opts.header.heights;
    const groupDepth = cfg.fieldHeaderGroup.depth;

    cfg.fieldHeaderGroup.heights = new Array(groupDepth);

    let mainHeaderHeight = 0;

    for (let i = 0; i < groupDepth; i++) {
      let rowHeight = height;
      if (heights.length > i) {
        rowHeight = heights[i];
        rowHeight = rowHeight > 0 ? rowHeight : height;
      }
      mainHeaderHeight += rowHeight;
      cfg.fieldHeaderGroup.heights[i] = rowHeight;
    }

    cfg.dimensions.mainHeaderHeight = mainHeaderHeight;
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

        let bodyFieldColspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;

        if (fixedRightIndex <= field.$resizeIdx && bodyFieldColspan > 0) {
          const bodyNode = utils.merge({}, field) as FieldItem;
          bodyNode.$colspan = bodyFieldColspan;
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

      field.$width = field.width;

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
  private changeScrollMode() {
    const cfg = this.grid.config();
    const scrollMode = (cfg.scroll.enableHorizontal ? 1 : 0) + (cfg.scroll.enableVertical ? 2 : 0);

    if (scrollMode == 0) {
      this._mainElement.removeAttr("data-scroll");
    } else {
      this._mainElement.attr({ "data-scroll": SCROLL_MODE[scrollMode] });
    }
  }

  /**
   * selection status info
   *
   * @public
   * @param {string} info selection info
   */
  public setSelectionStatus(dataInfo?: any) {
    const footerOpts = this.grid.getOptions().footer;

    if (footerOpts.enableSelectionInfo) {
      const dataInfo = this.selectionInfo.selectionData("json", true);

      if (!utils.isUndefined(dataInfo) && dataInfo.summary.count > 1) {
        const selectionFormat = this.grid.getOptions().footer.selectionFormat;
        let statusText = "";
        if (utils.isString(selectionFormat)) {
          statusText = utils.replaceMesasgeFormat(selectionFormat, dataInfo.summary);
        } else if (utils.isFunction(selectionFormat)) {
          statusText = selectionFormat(dataInfo);
        }

        this.selectionStatusElement.text(statusText);
      } else {
        this.selectionStatusElement.text("");
      }
    }
  }

  public setScrollStatus() {
    const footerOpts = this.grid.getOptions().footer;

    if (footerOpts.enableStatus) {
      const cfg = this.grid.config();

      let statusInfo: any = {
        currStart: 1,
        currEnd: 10,
        total: cfg.dataInfo.rowLength,
      };

      if (!utils.isUndefined(statusInfo)) {
        const statusFormat = this.grid.getOptions().footer.statusFormat;
        let statusText = "";
        if (utils.isString(statusFormat)) {
          statusText = utils.replaceMesasgeFormat(statusFormat, statusInfo);
        } else if (utils.isFunction(statusFormat)) {
          statusText = statusFormat(statusInfo);
        }

        this.scrollStatusElement.text(statusText);
      } else {
        this.scrollStatusElement.text("");
      }
    }
  }

  /**
   * set data
   *
   * @param {any[]} items
   */
  public setData = (items: any[]) => {
    this.grid.getOptions().items = items;
    this.calcGridDimention();
    this.calcBody();

    this.setElementDimentions();
    this.scroll.calcScroll();
    this.fieldResize();

    this.body.dataDraw("setdata");
  };

  /**
   * add row
   *
   * @param {any[]} items items
   * @param {ADD_ROW_POSITION} position before , after
   * @param {?number} [rowIndex] row index
   */
  public addRow = (items: any | any[], position: ADD_ROW_POSITION, rowIndex?: number) => {
    const cfg = this.grid.config();
    const currentItems = cfg.orginItems;
    const isBefore = position === "before";

    const addItems = Array.isArray(items) ? items : [items];

    utils.insertToArray(currentItems, items, isBefore, rowIndex);

    this.setData(currentItems);

    if (utils.isUndefined(rowIndex)) {
      if (isBefore) {
        this.scroll.moveVerticalScroll({ rowIdx: 0 });
      } else {
        this.scroll.moveVerticalScroll({ rowIdx: cfg.dataInfo.rowLength });
      }
    } else {
      this.scroll.moveVerticalScroll({ rowIdx: rowIndex + (isBefore ? -addItems.length : -1) });
    }
  };

  public removeRow = (ids: any[]) => {
    const cfg = this.grid.config();
    const currentItems = cfg.orginItems;

    const sortedPositions = [...new Set(ids)].sort((a, b) => b - a);

    for (const pos of sortedPositions) {
      if (pos >= 0 && pos < currentItems.length) {
        currentItems.splice(pos, 1);
      }
    }
    this.setData(currentItems);
  };

  public clearData() {
    this.setData([]);
  }

  public initTemplate() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    let templateHtml = `
      <div class="daracl-grid" tabindex="-1"  style="outline:none !important;">
        <div style="width:${dimensions.width}px;height:${dimensions.height}px;${opts.scroll.vertical.enable === false ? "" : "overflow:hidden;"}position:absolute;">
          ${opts.toolbar.enabled ? `<div class="dg-toolbar" role="presentation" style="height:${dimensions.toolbarHeight}px;"></div>` : ""}
          <div tabindex="-1" style="outline:none !important;" class="dg-main daracl-noselect dg-style-${this._BODY_STYLE.includes(opts.styleClass) ? opts.styleClass : "default"}" data-scroll="none">
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
              <div class="dg-resize-helper"></div>
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
              <div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;">
                <textarea class="dg-paste-area"></textarea>
              </div>
          </div>
          ${
            opts.footer.enabled
              ? `<div class="dg-footer" role="presentation" style="height:${dimensions.footerHeight}px;">
            <span class="dg-paging"></span>
            <span class="dg-status">
              <span class="dg-selection-status"></span>
              <span class="dg-scroll-status"></span>
            </span>
          </div>`
              : ""
          }
        </div>
    </div>
    `;

    this.grid.element().html(templateHtml);

    this._mainElement = new DaraElement(this.grid.element().find(".dg-main"));
    this.containerElement = new DaraElement(this.grid.element().find(".daracl-grid > div"));
    this.pasteElement = new DaraElement(this.grid.element().find(".dg-paste-area"));

    if (opts.footer.enabled) {
      this.selectionStatusElement = new DaraElement(this.grid.element().find(".dg-footer .dg-selection-status"));
      this.scrollStatusElement = new DaraElement(this.grid.element().find(".dg-footer .dg-scroll-status"));
    }
  }
}
