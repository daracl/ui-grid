import { Config, FieldHeaderGroupInfo } from "@t/GridConfig";

import * as utils from "../util/utils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import { ADD_ROW_POSITION, ALIGN, ALIGN_STYLE, FOOTER_HEIGHT, GRID_THEME, LAYER_ATTR_NAME, LINE_NUMBER_NAME, ROW_CHECK_KEY, ROW_CHECK_NAME, ROW_HEIGHT_KEY, ROW_ID_KEY, THEME_TYPE, TOOLBAR_HEIGHT, VIEW_RENDERER } from "src/constants";
import Header from "./main/Header";
import Body from "./main/Body";
import DaraElement from "src/element/DaraElement";
import { defaultFieldGroupInfo } from "src/defaultGridConfig";
import { DEFAULT_FIELD_INFO, DEFAULT_OPTIONS } from "src/defaultGridOption";
import Scroll from "./main/Scroll";
import { eventOn, stopPreventCancel } from "src/util/eventUtils";
import { getTextWidth, isInputField } from "src/util/gridUtils";
import SelectionInfo from "src/selection/selection";
import Footer from "./Footer";
import { addClass } from "src/util/styleUtils";

const SCROLL_MODE = ["none", "horizontal", "vertical", "both"];

// main-body  margin = border top + border bottom+ 공백1
const MAIN_MARGIN_BOTTOM = 3;

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

  private footer: Footer;

  private scroll: Scroll;

  private _mainElement: DaraElement;

  private containerElement: DaraElement;

  private rendererContainer: HTMLElement;

  private readonly enableViewAllLabel: boolean;

  private readonly cellMinWidth: number;

  public selectionInfo: SelectionInfo;

  private GRID_OFFSET: any;

  private readonly initGridSize: any;

  private readonly layerSelector: string;

  constructor(grid: DaraGrid) {
    this.grid = grid;

    const opts = grid.getOptions();
    const headerOpts = opts.header;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;

    this.cellMinWidth = headerOpts.resize.minWidth;

    this.setDataInfo(opts.items);
    this.calcGridDimention();

    this.initTemplate();
    this.initElement();
    this.calculation();

    this.initMainView();

    this.setElementDimentions();

    this.initEvent();

    this.initGridSize = {
      height: opts.height == "auto" ? -1 : opts.height,
      width: opts.width == "auto" ? -1 : opts.width,
    };

    this.layerSelector = `[${LAYER_ATTR_NAME}]`;
  }

  /**
   * init grid element
   */
  private initElement() {
    const cfg = this.grid.config();
    this._mainElement = new DaraElement(this.grid.element().find(".dg-main"));
    this.containerElement = new DaraElement(this.grid.element().find(".daracl-grid > div"));

    this.rendererContainer = this.grid.element().find(".dg-renderer-container");

    this.setTheme(this.grid.getOptions().theme);

    const style = window.getComputedStyle(this._mainElement.getElement());

    cfg.fontFamily = style.fontFamily;
    cfg.fontSize = style.fontSize;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.font = style.fontSize + " " + style.fontFamily; // "16px Arial";
    cfg.canvasContext = context;
  }

  /**
   * init main object viewer
   *
   * @private
   */
  private initMainView() {
    this.selectionInfo = new SelectionInfo(this, this.grid.getOptions(), this.grid.config());
    this.header = new Header(this.grid, this);
    this.body = new Body(this.grid, this);
    this.scroll = new Scroll(this.grid, this);
    this.footer = new Footer(this.grid, this);

    if (!this.grid.getOptions().footer.enabled || !this.grid.getOptions().footer.paging?.enabled) {
      this.body.dataDraw();
    }
  }

  public getRendererContainer() {
    return this.rendererContainer;
  }

  public getGrid() {
    return this.grid;
  }

  /**
   * init event
   *
   * @public
   */
  public initEvent() {
    const opts = this.grid.getOptions();

    if (opts.width === "auto" || opts.height === "auto") {
      this.initResizeEvent();
    }

    const mainElement = this._mainElement.getElement();

    // focus in, mousedown
    eventOn(mainElement, "mousedown", (e: UIEvent) => {
      this.setGridFocusIn(e);
    });

    // focus out // blur, focusout
    eventOn(mainElement, "blur", (e: FocusEvent) => {
      const nextFocused = e.relatedTarget as HTMLElement;

      console.log("nextFocused :  ", nextFocused);

      // container 바깥으로 포커스가 나간 경우에만 실행
      if (!nextFocused || !mainElement?.contains(nextFocused)) {
        if (!this.grid.config().focus) {
          return true;
        }

        this.setGridFocusOut(e);
      } else {
        mainElement.focus({ preventScroll: true });
      }
    });

    const rendererElement = this.mainElement().findDaraElement(".dg-renderer-container");

    const layerSelector = `[${LAYER_ATTR_NAME}]`;

    rendererElement.eventOff("wheel DOMMouseScroll");
    rendererElement.eventOn(
      "wheel DOMMouseScroll",
      (evt: WheelEvent) => {
        const targetElement = evt.target as HTMLElement;
        const el = targetElement.closest(layerSelector) as HTMLElement;
        if (el == null) return;

        const delta = evt.deltaY;

        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

        evt.stopPropagation();

        if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
          evt.preventDefault();
        }

        return true;
      },
      null,
      { passive: false }
    );
  }

  /**
   * set focus in
   *
   * @public
   * @param {Event} e event
   */
  public setGridFocusIn(e: Event, focunInFlag: boolean = false) {
    if (!focunInFlag) {
      const targetElement = e.target as HTMLElement;
      if (targetElement.closest(".dg-body") == null && targetElement.closest(".dg-renderer-container") == null) {
        this.hideLayer();
      }
    }

    if (this.grid.config().focus) return;
    this.grid.config().focus = true;

    const targetElement = e.target as HTMLElement;

    if (!isInputField(targetElement.tagName)) {
      // TODO
      //this.body.editAreaClose();
    }
  }

  /**
   * grid focus out
   *
   * @public
   * @param {Event} e event
   */
  public setGridFocusOut(e: Event) {
    if (!this.grid.config().focus) return;

    console.log("setGridFocusOut : ");

    const targetElement = e.target as HTMLElement;

    if ((e as MouseEvent).button !== 2) {
      this.grid.config().focus = false;

      this.hideLayer();

      this.body.editAreaClose();
    }
  }
  public hideLayer(activeComponent?: string) {
    const layers = this._mainElement.getElement().querySelectorAll(this.layerSelector);

    if (!activeComponent) {
      this.grid.config().activeComponent = "";
    }

    console.log("hideLayer  ");
    //  const stack = new Error().stack;

    // if (stack) {
    //   console.log("호출한 함수:", stack);
    // }

    layers.forEach((layer) => {
      const layerElement = layer as HTMLElement;
      if (activeComponent) {
        const attrValue = layerElement.getAttribute(LAYER_ATTR_NAME) ?? "";

        if (activeComponent != attrValue) {
          layerElement.style.display = "none";
        }
      } else {
        layerElement.style.display = "none";
      }
    });
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const opts = this.grid.getOptions();
    const threshold = opts.windowResizeDelay ?? 50;

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

      const initGridSize = this.initGridSize;

      let newOffset = { width: initGridSize.width == -1 ? el.width() : initGridSize.width, height: initGridSize.height == -1 ? el.height() : initGridSize.height };
      if (this.GRID_OFFSET.height != newOffset.height || this.GRID_OFFSET.width != newOffset.width) {
        this.GRID_OFFSET = newOffset;
        this.setSize(newOffset.width, newOffset.height, true);
      }
    });
  }

  /**
   * grid size 및 field 정보 계산
   */
  public calculation() {
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

  public getFooter() {
    return this.footer;
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
  public setSize(width?: number | "auto", height?: number | "auto", drawFlag: boolean = false) {
    const cfg = this.grid.config();

    if (!utils.isNumber(width) && utils.isNumber(this.grid.getOptions().width)) {
      width = this.grid.getOptions().width;
    }

    if (!utils.isNumber(height) && utils.isNumber(this.grid.getOptions().height)) {
      height = this.grid.getOptions().height;
    }

    cfg.dimensions.width = utils.isNumber(width) ? width : this.grid.element().width();
    cfg.dimensions.height = utils.isNumber(height) ? height : this.grid.element().height();
    cfg.dimensions.mainHeight = cfg.dimensions.height - (cfg.dimensions.toolbarHeight + cfg.dimensions.footerHeight);

    if (drawFlag) {
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
  public fieldResize() {
    this.updateFieldWidth(this.grid.config().currentFields, this.header.getHeaderElement(), this.body.getBodyElement());
  }

  /**
   * update field width
   *
   * @param fields field resize
   * @param headerElement header html element
   * @param bodyElement body html element
   */
  private updateFieldWidth(fields: FieldItem[], headerElement: DaraElement, bodyElement: DaraElement) {
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];

      const selector = `th[data-col-idx="${j}"]`;
      const width = `${field.$width}px`;

      headerElement.find(selector).style.width = width;
      bodyElement.find(selector).style.width = width;
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

    this.header.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.body.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);

    this.changeScrollMode();
  }

  /**
   * 사이즈 계산 후
   */
  calcGridDimention() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;

    const opts = this.grid.getOptions();

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

    this.setSize(this.grid.getOptions().width, this.grid.getOptions().height, false);
  }

  /**
   * grid body 계산
   *
   * @public
   */
  public calcBody(isInit?: boolean) {
    const cfg = this.grid.config();
    const { dimensions, rowHeight, dataInfo, currentFields: fields } = cfg;
    const opts = this.grid.getOptions();

    const fieldLength = fields.length;

    const rowLength = dataInfo.rowLength;

    const isHeaderResize = cfg.isHeaderResize;

    const lineNumberIdx = cfg.fieldIndex.get(LINE_NUMBER_NAME);
    if (!utils.isUndefined(lineNumberIdx)) {
      const numberField = fields[lineNumberIdx];
      if (rowLength >= 100000) {
        const textWidth = getTextWidth(cfg, rowLength + "");
        numberField.width = textWidth ?? numberField.width;
        numberField.$width = textWidth ?? numberField.$width;
      } else {
        const defaultLineNumberWidth = opts.aside.lineNumber.width ?? DEFAULT_OPTIONS.aside.lineNumber.width ?? 40;
        numberField.width = defaultLineNumberWidth;
        numberField.$width = defaultLineNumberWidth;
      }
    }

    let mainTotalWidth = 0;
    for (const field of fields) {
      if (!isHeaderResize && this.enableViewAllLabel) {
        const labelWidth = getTextWidth(cfg, field.label, 20);
        field.width = field.width > labelWidth ? field.width : labelWidth;
      }

      mainTotalWidth += isHeaderResize ? field.$width : field.width;
    }

    cfg.scroll.enableHorizontal = mainTotalWidth > dimensions.width;

    //세로 스크롭 계산 start

    const verticalEnable = opts.scroll.vertical.enable;

    if (verticalEnable === false) {
      dimensions.mainHeight = rowHeight * rowLength + (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (cfg.scroll.enableHorizontal ? opts.scroll.width : 0));
      dimensions.mainHeight = dimensions.mainHeight + MAIN_MARGIN_BOTTOM;
    }

    dimensions.mainBodyHeight = dimensions.mainHeight - (dimensions.mainHeaderHeight + dimensions.mainSummaryHeight + (cfg.scroll.enableHorizontal ? opts.scroll.width : 0));

    cfg.scroll.enableVertical = verticalEnable === false ? false : rowHeight * rowLength > dimensions.mainBodyHeight - MAIN_MARGIN_BOTTOM;
    cfg.scroll.enableHorizontal = mainTotalWidth > dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0);

    cfg.scroll.viewRow = Math.ceil(dimensions.mainBodyHeight / rowHeight);
    cfg.scroll.viewRow = Math.min(Math.max(1, cfg.scroll.viewRow), rowLength);
    cfg.scroll.insideViewRow = cfg.scroll.viewRow - (dimensions.mainBodyHeight % rowHeight > 0 ? 1 : 0);

    const verticalScrollWidth = cfg.scroll.enableVertical ? opts.scroll.width + (cfg.fixedRightIndex > 0 ? 1 : 3) : 0; // +3 마지막 여백처리;

    let remainderWidth = 0,
      lastSpaceW = 0;

    let isAddSpaceWidth;

    if (!cfg.scroll.enableHorizontal) {
      const viewGridWidth = mainTotalWidth + verticalScrollWidth;
      const overWidth = dimensions.width - viewGridWidth;
      isAddSpaceWidth = true;
      let absOverWidth = overWidth < 0 ? Math.abs(overWidth) : overWidth;

      remainderWidth = Math.floor(absOverWidth / (fieldLength - dataInfo.asideLength));
      lastSpaceW = absOverWidth - remainderWidth * (fieldLength - dataInfo.asideLength);

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

      field.$alignStyle = ALIGN_STYLE[field.align] ?? ALIGN_STYLE.center;

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

    dataInfo.colLength = fieldLength;
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
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.lineNumber, { name: LINE_NUMBER_NAME, renderer: { type: "lineNumber" }, $isAside: true });

      opts.aside.lineNumber.order = opts.aside.lineNumber.order ?? 0;
      asideOrder.push(fieldItem);
    }

    // rowCheckbox
    if (opts.aside.rowCheckbox.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.rowCheckbox, { name: ROW_CHECK_NAME, renderer: { type: "rowCheckbox", customOptions: { allowMultiSelect: opts.aside.rowCheckbox.allowMultiSelect } }, $isAside: true });
      opts.aside.rowCheckbox.order = opts.aside.rowCheckbox.order ?? 1;
      asideOrder.push(fieldItem);
    }

    // modifyInfo 추가.
    if (opts.aside.modifyInfo.enabled === true) {
      let fieldItem = utils.merge({}, DEFAULT_FIELD_INFO, opts.aside.modifyInfo, { name: "$modifyInfo", renderer: { type: "modifyInfo" }, $isAside: true });
      opts.aside.modifyInfo.order = opts.aside.modifyInfo.order ?? 2;
      asideOrder.push(fieldItem);
    }

    asideOrder.sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;

      const aIsUndefined = orderA === undefined;
      const bIsUndefined = orderB === undefined;

      if (aIsUndefined && bIsUndefined) return 0;
      if (aIsUndefined) return 1; // a가 뒤로
      if (bIsUndefined) return -1; // b가 뒤로

      return orderA - orderB;
    });

    const asideLength = asideOrder.length;

    cfg.dataInfo.asideLength = asideLength;
    cfg.dataInfo.startCol = asideLength;

    const fixedLeftIndex = asideLength + cfg.fixedLeftIndex - 1;
    let fixedRightIndex = cfg.fixedRightIndex < 1 ? 0 : asideLength + cfg.fixedRightIndex;

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
      let headerHeight = height;
      if (heights.length > i) {
        headerHeight = heights[i];
        headerHeight = headerHeight > 0 ? headerHeight : height;
      }
      mainHeaderHeight += headerHeight;
      cfg.fieldHeaderGroup.heights[i] = headerHeight;
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

    if (field.$isLeaf) {
      field = this.setRendererInfo(field);
    }

    // left 고정 컬럼
    if ((field.$childLength > 0 && fixedLeftIndex > field.$resizeIdx - field.$colspan) || (field.$childLength < 1 && fixedLeftIndex >= field.$resizeIdx)) {
      if (field.$colspan <= 1) {
        fieldGroupInfo.left[depth].push(field);
      } else {
        const leftNode = fieldCopy(field);

        if (leftNode.$resizeIdx > fixedLeftIndex) {
          leftNode.$colspan = fixedLeftIndex - (leftNode.$resizeIdx - leftNode.$colspan);
          leftNode.$resizeIdx = fixedLeftIndex;
        }

        fieldGroupInfo.left[depth].push(leftNode);
        if (fixedLeftIndex < field.$resizeIdx) {
          const bodyNode = fieldCopy(field);
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
          const bodyNode = fieldCopy(field) as FieldItem;
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

        const rightNode = fieldCopy(field);

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
      field.width = utils.isNumber(field.width) ? field.width : this.cellMinWidth;

      if (!field.$isAside) {
        field.width = Math.max(field.width, this.cellMinWidth);
      }

      field.$width = field.width;

      fieldGroupInfo.leaf.push(field);

      this.grid.config().fieldIndex.set(field.name, fieldGroupInfo.leaf.length - 1);
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
    field.$renderer = new VIEW_RENDERER[renderInfo.type](field, this);

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
   * set data
   *
   * @param {any[]} items
   */
  public setData = (items: any[]) => {
    this.setDataInfo(items);

    this.body.dataDraw("setdata");
  };

  private setDataInfo(items: any[]) {
    const cfg = this.grid.config();

    cfg.orginItems = utils.arrayCopy(items);

    this.setRowId(cfg);

    this.setViewDataInfo(cfg.orginItems);
  }

  public setViewDataInfo(items: any[]) {
    const cfg = this.grid.config();
    cfg.items = utils.arrayCopy(items);
    cfg.dataInfo.rowLength = cfg.items.length;
    cfg.dataInfo.lastRow = cfg.dataInfo.rowLength > 0 ? cfg.dataInfo.rowLength - 1 : 0;

    this.calcBody();
    if (this.scroll) {
      this.scroll.calcScroll();
      this.setElementDimentions();
      this.fieldResize();
    }
  }

  /**
   * set item row id
   *
   * @public
   * @param {Config} cfg
   */
  public setRowId(cfg: Config) {
    const items = cfg.orginItems;
    const len = items.length;

    const rowHeight = cfg.rowHeight;

    for (let i = 0; i < len; i++) {
      const item = items[i];
      item[ROW_ID_KEY] = cfg.rowIdSeq++;
      item[ROW_HEIGHT_KEY] = rowHeight;
    }

    return;
  }

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

  /**
   * remove row data
   *
   * @param {any[]} ids row positions
   */
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

  /**
   * all data clear
   *
   * @public
   */
  public clearData() {
    this.setData([]);
  }

  /**
   * get checked items
   *
   * @param names filed names
   * @returns {array} checked item array
   */
  public getCheckedItems(names?: string | string[]) {
    const items = this.grid.config().items;
    const checkItems = [];

    let exportNames: string[] = [];
    let isAll = false;
    if (utils.isUndefined(names)) {
      isAll = true;
    } else if (!utils.isArray(names)) {
      exportNames = [names];
    } else {
      exportNames = names;
    }

    for (let item of items) {
      if (item[ROW_CHECK_KEY]) {
        let checkItem;
        if (isAll) {
          checkItem = item;
        } else {
          checkItem = {} as any;
          for (let name of exportNames) {
            checkItem[name] = item[name];
          }
        }

        checkItems.push(checkItem);
      }
    }

    return checkItems;
  }

  /**
   * get check items
   *
   * @public
   * @param {string} name field name
   * @returns {*} name 값만 리턴
   */
  public getCheckedItemByName(name: string) {
    return this.getBody().getCheckedItemByName(name);
  }

  /**
   * all check
   *
   * @public
   * @param {boolean} checked
   */
  public setAllCheckedItems(checked: boolean) {
    if (!this.grid.config().isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getHeader().setAllCheckItem(checked);
  }

  /**
   * name value item check
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  public setCheckedItemByValue(name: string, values: any) {
    this.getBody().setCheckedItemByValue(name, values);
  }

  /**
   * add check item
   *
   * @public
   * @param {string} name field name
   * @param {*} values field value
   */
  public addCheckedItemByValue(name: string, values: any) {
    if (!this.grid.config().isRowAllowMultiSelect) throw new Error("The allowMultiSelect option does not support methods.");
    this.getBody().addCheckedItemByValue(name, values);
  }

  /**
   * un checked
   *
   * @public
   * @param {string} name field name
   * @param {*} values field values
   */
  public unCheckedItemByValue(name: string, values: any) {
    this.getBody().unCheckedItemByValue(name, values);
  }

  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (THEME_TYPE enum 값: 예: 'light', 'dark' 등)
   */
  public setTheme(themeName: THEME_TYPE) {
    const dgElement = this.grid.element().find(".daracl-grid > div");

    const theme = GRID_THEME[themeName];

    if (!theme) return;

    const cfg = this.grid.config();

    if (cfg.theme == theme) return;

    const classList = dgElement.classList;

    if (classList.contains(cfg.theme)) classList.remove(cfg.theme);

    cfg.theme = theme;

    if (!classList.contains(theme)) classList.add(theme);
  }

  /**
   * int grid html tempate
   *
   * @private
   */
  private initTemplate() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    const pagingAlign = ALIGN[opts.footer.paging?.position ?? "center"];
    const selectionAlign = ALIGN[opts.footer.selection?.position ?? "center"];
    const pagingInfoAlign = ALIGN[opts.footer.paging?.formatPosition ?? "center"];
    // class="${align}"

    let templateHtml = `
      <div class="daracl-grid" tabindex="-1"  style="outline:none !important;">
        <div style="position:absolute;">
          ${opts.toolbar.enabled ? `<div class="dg-toolbar" role="presentation" style="height:${dimensions.toolbarHeight}px;"></div>` : ""}
          <div tabindex="-1" style="outline:none !important;" class="dg-main ${opts.selectionMode != "none" ? "daracl-noselect" : ""} dg-style-${this._BODY_STYLE.includes(opts.styleClass) ? opts.styleClass : "default"}" data-scroll="none">
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
                      <div class="dg-empty-msg-area"><span class="dg-empty-msg"><i class="dg-icon-info"></i><span class="empty-text">${this.grid.i18n().getMessage("no.data")}</span></span></div>
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
              <div class="dg-renderer-container"></div>
          </div>
          ${
            opts.footer.enabled
              ? `<div class="dg-footer" role="presentation" style="height:${dimensions.footerHeight}px;">
            <span class="dg-status ${selectionAlign}">
              <span class="dg-selection-status"></span>
            </span>
            <span class="dg-paging ${pagingAlign}"></span>
            <span class="dg-paging-info ${pagingInfoAlign}"></span>
          </div>`
              : ""
          }
        </div>
    </div>
    `;

    this.grid.element().html(templateHtml);
  }
}
function fieldCopy(field: any): any {
  const result: any = {};

  Object.entries(field).forEach(([key, value]) => {
    if (!utils.isObject(value) || key == "renderer") {
      result[key] = value;
    }
  });

  return result;
}
