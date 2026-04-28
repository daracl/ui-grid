import { Config, FieldHeaderGroupInfo } from '@t/GridConfig';

import {
  ADD_ROW_POSITION,
  ALIGN,
  ALIGN_STYLE,
  EDIT_RENDERER,
  FIELD_LAYER_CLASS,
  FIELD_PREFIX,
  FOOTER_HEIGHT,
  GRID_THEME,
  INSTANCE_ATTR_KEY,
  LAYER_ATTR_NAME,
  LINE_NUMBER_NAME,
  ROW_CHECK_KEY,
  ROW_CHECK_NAME,
  ROW_CUD_KEY,
  ROW_DRAG_HANDLE_NAME,
  ROW_ID_KEY,
  THEME_TYPE,
  TOOLBAR_HEIGHT,
  VIEW_RENDERER,
} from '@/constants';
import { DaraGrid } from '@/DaraGrid';
import { defaultFieldGroupInfo, initConfig } from '@/defaultGridConfig';
import { DEFAULT_FIELD_INFO, DEFAULT_OPTIONS } from '@/defaultGridOption';
import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { DataManager } from '@/service/DataManager';
import { GridOptions } from '@/types/GridOptions';
import { Message } from '@/types/Message';
import { PagingInfo } from '@/types/PagingInfo';
import { getTextWidth, heightOptionValue, isInputField } from '@/util/gridUtils';
import { Language } from '@/util/Language';
import {
  debounce,
  deepCopy,
  insertToArray,
  isArray,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  isVisible,
  merge,
} from '@/util/utils';
import { FieldItem } from '@t/GridField';
import { Footer } from './Footer';
import { Body } from './main/body/Body';
import { ContextMenu } from './main/ContextMenu';
import { DataSearch } from './main/DataSearch';
import { Header } from './main/header/Header';
import { Scroll } from './main/scroll/Scroll';
import { Summary } from './main/Summary';

const SCROLL_MODE = ['none', 'horizontal', 'vertical', 'both'];

// main-body  margin = border top + border bottom+ 공백1
const MAIN_MARGIN_BOTTOM = 3;

interface GridSize {
  height: number;
  width: number;
}

let DARA_GRID_SEQ = 0;

let INIT_GRID_GLOBAL_EVNET = false;

// all instance
const ALL_INSTANCE = new Map<string, GridMain>();
/**
 * GridMain class
 *
 * @class GridMain
 * @typedef {GridMain}
 */
export class GridMain {
  private readonly _BODY_STYLE: string[] = ['default', 'striped', 'borderless'];

  private grid: DaraGrid;

  private readonly opts: GridOptions;

  private language: Language;

  // grid 설정
  private cfg: Config;

  private header: Header;

  private body: Body;

  private footer: Footer;

  private scroll: Scroll;

  private summary: Summary;

  private contextMenu: ContextMenu;

  private dataSearch: DataSearch;

  private _mainElement: DaraElement;

  private containerElement: DaraElement;

  private rendererContainer: HTMLElement;

  private readonly enableViewAllLabel: boolean;

  private readonly cellMinWidth: number;

  public selectionInfo: SelectionInfo;

  private currentSize: GridSize;

  private initGridSize: GridSize;

  /**
   * grid id
   */
  private readonly $instanceId: string;

  private readonly gridElement: DaraElement;

  private readonly orginStyle: string;

  private readonly openLayers: HTMLElement[] = [];

  private resizeObserver: ResizeObserver;

  constructor(grid: DaraGrid, element: HTMLElement, options: GridOptions, message?: Message) {
    const opts = merge({}, DEFAULT_OPTIONS, options) as GridOptions;

    this.grid = grid;
    this.language = new Language();

    if (message) this.language.setMessage(message);

    this.cfg = initConfig(opts);
    this.cfg.dataManager = new DataManager(opts, this.cfg);

    this.opts = opts;

    const beforeUid = element.getAttribute(INSTANCE_ATTR_KEY);
    this.$instanceId = beforeUid ?? `${FIELD_PREFIX}${++DARA_GRID_SEQ}`;
    this.orginStyle = element.style.cssText;

    element.setAttribute(INSTANCE_ATTR_KEY, this.$instanceId);

    this.gridElement = new DaraElement(element);

    GridMain.setInstance(this.$instanceId, this);

    const headerOpts = opts.header;
    this.enableViewAllLabel = headerOpts.enableViewAllLabel === true;
    this.cellMinWidth = headerOpts.resize.minWidth;
  }

  public init() {
    const opts = this.opts;

    this.initGridSize = {
      height: opts.height == 'auto' ? -1 : opts.height,
      width: opts.width == 'auto' ? -1 : opts.width,
    };

    this.setDataInfo(this.opts.items);
    this.calcGridDimention();
    this.setSize(this.initGridSize.width, this.initGridSize.height, false);

    this.initTemplate();
    this.initElement();
    this.calculation();

    this.initMainView();

    this.setElementDimentions();

    this.initEvent();

    this.initDocumentGlobalEvent();
  }
  /**
   * grid 전체 이벤트
   */
  initDocumentGlobalEvent() {
    if (INIT_GRID_GLOBAL_EVNET) return;
    INIT_GRID_GLOBAL_EVNET = true;

    document.addEventListener('pointerdown', (e: Event) => {
      ALL_INSTANCE.forEach((grid, id) => {
        const gridElement = grid.gridElement.getElement();

        const path = e.composedPath();

        if (!path.includes(gridElement)) {
          grid.setGridFocusOut();
        }
      });
    });
  }

  public static setInstance(instanceID: string, gridMain: GridMain) {
    ALL_INSTANCE.set(instanceID, gridMain);
  }

  public static getInstance(eleOrId: HTMLElement | string): DaraGrid | null {
    let id;
    if (isString(eleOrId)) {
      id = eleOrId;
    } else {
      id = eleOrId instanceof HTMLElement ? eleOrId?.getAttribute(INSTANCE_ATTR_KEY) : '';
    }

    if (id) {
      return ALL_INSTANCE.get(id)?.grid ?? null;
    }

    return null;
  }

  public static allInstance() {
    return ALL_INSTANCE;
  }

  public element() {
    return this.gridElement;
  }

  public config() {
    return this.cfg;
  }

  public options() {
    return this.opts;
  }

  public i18n() {
    return this.language;
  }

  /**
   * init grid element
   */
  private initElement() {
    const cfg = this.cfg;
    this._mainElement = new DaraElement(this.gridElement.find('.dg-main'));

    this.containerElement = new DaraElement(this.gridElement.find('.daracl-grid > div'));

    this.rendererContainer = this.gridElement.find('.dg-layer-container');

    this.setTheme(this.opts.theme);

    const style = window.getComputedStyle(this._mainElement.getElement());

    cfg.fontFamily = style.fontFamily;
    cfg.fontSize = style.fontSize;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = style.fontSize + ' ' + style.fontFamily; // "16px Arial";
    cfg.canvasContext = context;
  }

  /**
   * init main object viewer
   *
   * @private
   */
  private initMainView() {
    const opts = this.opts;
    this.selectionInfo = new SelectionInfo(this, opts, this.cfg);
    this.header = new Header(this);
    this.body = new Body(this);

    this.summary = new Summary(this);

    if (opts.search.enabled) {
      this.dataSearch = new DataSearch(this);
    }

    this.scroll = new Scroll(this);
    this.scroll.init();

    this.footer = new Footer(this);
    this.contextMenu = new ContextMenu(this);

    if (!opts.footer.enabled || !opts.footer.paging?.enabled) {
      this.body.dataDraw();
    }
  }

  public getRendererContainer() {
    return this.rendererContainer;
  }

  public uid() {
    return this.$instanceId;
  }

  /**
   * init event
   *
   * @public
   */
  public initEvent() {
    const opts = this.opts;

    const cfg = this.cfg;

    if (opts.width === 'auto' || opts.height === 'auto') {
      this.initResizeEvent();
    }

    const mainElement = this._mainElement.getElement();

    // focus in, mousedown
    cfg.eventManager.on({ el: mainElement, type: 'mousedown' }, (e: UIEvent) => {
      this.setGridFocusIn(e);
    });

    const rendererElement = this.mainElement().findDaraElement('.dg-layer-container').getElement();

    const layerSelector = `[${LAYER_ATTR_NAME}]`;

    cfg.eventManager.off(rendererElement, 'wheel DOMMouseScroll');
    cfg.eventManager.on(
      { el: rendererElement, type: 'wheel DOMMouseScroll' },
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
      { passive: false },
    );
  }

  /**
   * set focus in
   *
   * @public
   * @param {Event} e event
   */
  public setGridFocusIn(e?: Event, focunInFlag = false) {
    if (!focunInFlag && e) {
      const targetElement = e.target as HTMLElement;
      if (targetElement.closest('.dg-body') == null && targetElement.closest('.dg-layer-container') == null) {
        this.hideLayer();
      }
    }

    if (this.cfg.focus) return;

    if (this._mainElement) this._mainElement.getElement().focus({ preventScroll: true });

    this.cfg.focus = true;
  }

  /**
   * grid focus out
   *
   * @public
   * @param {Event} e event
   */
  public setGridFocusOut(e?: Event) {
    if (!this.cfg.focus) return;

    if (!e) {
      this.cfg.focus = false;
      this.hideLayer();
      return;
    }

    if ((e as MouseEvent).button !== 2) {
      const mainElement = this._mainElement.getElement();

      const relatedTarget = (e as any).relatedTarget as HTMLElement;

      if (relatedTarget?.closest('.dg-hidden-container') !== null) {
        const outerLayerElement = relatedTarget.closest('.dg-outer-layer') as HTMLElement;

        if (outerLayerElement?.getAttribute('data-grid-id') == this.$instanceId) {
          mainElement.focus({ preventScroll: true });
          return;
        }
      }

      this.cfg.focus = false;
      this.hideLayer();
    }
  }

  public openLayer(layerElement: HTMLElement) {
    layerElement.style.display = 'block';
    this.cfg.isOpenLayer = true;

    this.openLayers.push(layerElement);
  }

  public hideLayer(hideElement?: HTMLElement | string) {
    if (hideElement != 'all') {
      if (ALL_INSTANCE.size > 1) {
        ALL_INSTANCE.forEach((grid, id) => {
          if (id != this.$instanceId) {
            grid.setGridFocusOut();
          }
        });
      }
    }

    if (this.openLayers.length < 1) return;

    if (hideElement) {
      let checkLayerClass;
      if (hideElement == 'vscroll' || hideElement == 'hscroll') {
        checkLayerClass = FIELD_LAYER_CLASS;
      }

      for (let idx = this.openLayers.length - 1; idx >= 0; idx--) {
        const layerElement = this.openLayers[idx];

        if (checkLayerClass && layerElement.classList.contains(checkLayerClass)) {
          layerElement.style.display = 'none';
          this.openLayers.splice(idx, 1);
        } else if (hideElement == layerElement) {
          layerElement.style.display = 'none';
          this.openLayers.splice(idx, 1);
          break;
        }
      }
      this.cfg.isOpenLayer = this.openLayers.length > 0;
      this.setGridFocusIn();
      return;
    }

    this.cfg.isOpenLayer = false;

    for (let idx = this.openLayers.length - 1; idx >= 0; idx--) {
      const layerElement = this.openLayers[idx];

      layerElement.style.display = 'none';

      this.openLayers.splice(idx, 1);
    }

    this.cfg.activeComponent = '';
    this.setGridFocusIn();
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const opts = this.opts;
    const threshold = opts.windowResizeDelay ?? 50;

    const el = this.gridElement;

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(
        debounce(() => {
          this.resize(el);
        }, threshold),
      );
      resizeObserver.observe(el.getElement());
      this.resizeObserver = resizeObserver;
    } else {
      window.addEventListener(
        'resize',
        debounce(() => {
          this.resize(el);
        }, threshold),
      );
    }
  }

  /**
   * resize event 처리
   *
   * @param el grid element
   */
  public resize(el: DaraElement) {
    const initGridSize = this.initGridSize;

    const isWidthResize = initGridSize.width < 0;
    const isHeightResize = initGridSize.height < 0;
    requestAnimationFrame(() => {
      if (!isVisible(el.getElement())) return;

      const newOffset = {
        width: isWidthResize ? el.width() : initGridSize.width,
        height: isHeightResize ? el.height() : initGridSize.height,
      };

      if (this.currentSize.height !== newOffset.height || this.currentSize.width !== newOffset.width) {
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

  public getDataSearch() {
    return this.dataSearch;
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
   * contextmenu object
   *
   * @returns {ContextMenu}
   */
  public getContextMenu() {
    return this.contextMenu;
  }

  /**
   * summary object
   *
   * @public
   * @returns {Summary}
   */
  public getSummary() {
    return this.summary;
  }

  /**
   * footer object
   *
   * @public
   * @returns {Footer}
   */
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
  public setSize(width: number, height: number, drawFlag = false) {
    const { dimensions } = this.cfg;

    dimensions.width = width < 0 ? this.gridElement.width() : width;
    dimensions.height = height < 0 ? this.gridElement.height() : height;

    this.currentSize = { width: dimensions.width, height: dimensions.height };

    dimensions.mainHeight = dimensions.height - (dimensions.toolbarHeight + dimensions.footerHeight);

    if (drawFlag) {
      this.resizeDraw();
    }
  }

  public getCurrentSize() {
    return this.currentSize;
  }

  resizeDraw() {
    const cfg = this.cfg;
    this.calcBody();

    if (!isUndefined(this._mainElement)) {
      this.setElementDimentions();
      this.scroll.calculate();
      this.fieldResize();

      if (
        cfg.scroll.before.startIdx !== cfg.scroll.startIdx ||
        cfg.scroll.before.viewRow !== cfg.scroll.viewRow ||
        cfg.scroll.before.startCol !== cfg.scroll.startCol ||
        cfg.scroll.before.endCol !== cfg.scroll.endCol
      ) {
        this.body.dataDraw('resize');
      }
    }
  }

  /**
   * cell size 설정
   */
  public fieldResize() {
    this.updateFieldWidth();
  }

  /**
   * update field width
   */
  private updateFieldWidth() {
    const fields = this.cfg.currentFields;
    const headerElement = this.header.getHeaderElement();
    const bodyElement = this.body.getBodyElement();
    const summaryElement = this.summary.getElement();

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];

      const selector = `th[data-col-idx="${j}"]`;
      const width = `${field.$width}px`;

      headerElement.find(selector).style.width = width;
      bodyElement.find(selector).style.width = width;
      if (summaryElement) {
        summaryElement.find(selector).style.width = width;
      }
    }
  }

  setElementDimentions() {
    const cfg = this.cfg;
    const dimensions = cfg.dimensions;
    this._mainElement.setHeight(dimensions.mainHeight);
    this._mainElement.findDaraElement('.dg-body').setHeight(dimensions.mainBodyHeight);
    this.containerElement.css({
      width: dimensions.width + 'px',
      height: dimensions.height + 'px',
    });

    const mainSize: any = {};
    if (this.initGridSize.width > 0) {
      mainSize.width = dimensions.width + 'px';
    }

    if (this.initGridSize.height > 0) {
      mainSize.height = dimensions.height + 'px';
    }

    this.gridElement.css(mainSize);

    const mainLeftWidth = dimensions.mainLeftWidth;
    const mainCenterWidth = dimensions.mainCenterWidth;
    const mainRightWidth = dimensions.mainRightWidth;

    this.header.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.body.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);
    this.summary.setGridPanelWidth(mainLeftWidth, mainCenterWidth, mainRightWidth);

    this.changeScrollMode();
  }

  /**
   * 사이즈 계산 후
   */
  calcGridDimention() {
    const cfg = this.cfg;
    const dimensions = cfg.dimensions;

    const opts = this.opts;

    if (opts.toolbar.enabled) {
      dimensions.toolbarHeight = isNumber(opts.toolbar.height) ? opts.toolbar.height : TOOLBAR_HEIGHT;
    }

    if (opts.footer.enabled) {
      dimensions.footerHeight = isNumber(opts.footer.height) ? opts.footer.height : FOOTER_HEIGHT;
    }

    if (!isUndefined(opts.summary)) {
      const heightOption = heightOptionValue(opts.summary.height, 28);
      const { height, heights } = heightOption;

      const len = opts.summary.items.length;

      cfg.summary.heights = new Array(len);

      let totalHeight = 0;

      let summaryHeight = height;
      for (let i = 0; i < len; i++) {
        if (heights.length > i) {
          summaryHeight = heights[i];
          summaryHeight = summaryHeight > 0 ? summaryHeight : height;
        }
        totalHeight += summaryHeight;
        cfg.summary.heights[i] = summaryHeight;
      }

      dimensions.mainSummaryHeight = totalHeight + 3; // 2 border + 1 padding
    }
  }

  /**
   * grid body 계산
   *
   * @public
   */
  public calcBody(isInit?: boolean) {
    const cfg = this.cfg;
    const { dimensions, rowHeight, dataInfo, currentFields: fields } = cfg;
    const opts = this.opts;

    const fieldLength = fields.length;

    const rowLength = dataInfo.rowLength;

    const isHeaderResize = cfg.isHeaderResize;

    const lineNumberCol = cfg.allFieldMap.get(LINE_NUMBER_NAME)?.$colSeq;
    if (!isUndefined(lineNumberCol)) {
      const numberField = fields[lineNumberCol];
      if (rowLength >= 100000) {
        const textWidth = getTextWidth(cfg, rowLength + '');
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
      dimensions.mainHeight =
        rowHeight * rowLength +
        (dimensions.mainHeaderHeight +
          dimensions.mainSummaryHeight +
          (cfg.scroll.enableHorizontal ? opts.scroll.width : 0));
      dimensions.mainHeight = dimensions.mainHeight + MAIN_MARGIN_BOTTOM;
    }

    const mainBodyHeight =
      dimensions.mainHeight -
      (dimensions.mainHeaderHeight +
        dimensions.mainSummaryHeight +
        (cfg.scroll.enableHorizontal ? opts.scroll.width : 0)) -
      2; // 2 border height;

    cfg.scroll.enableVertical = verticalEnable === false ? false : rowHeight * rowLength > mainBodyHeight;
    cfg.scroll.enableHorizontal =
      mainTotalWidth > dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0);

    dimensions.mainBodyHeight = mainBodyHeight;

    const orginViewRow = mainBodyHeight / rowHeight;
    const viewRow = Math.min(Math.max(1, Math.ceil(orginViewRow)), rowLength);

    cfg.scroll.insideViewRow = viewRow - (viewRow > 1 && viewRow > Math.floor(orginViewRow) ? 1 : 0);
    cfg.scroll.viewRow = viewRow;

    const verticalScrollWidth = cfg.scroll.enableVertical ? opts.scroll.width + (cfg.fixedRightIndex > 0 ? 1 : 3) : 0; // +3 마지막 여백처리;

    let remainderWidth = 0,
      lastSpaceW = 0;

    let isAddSpaceWidth;

    if (!cfg.scroll.enableHorizontal) {
      const viewGridWidth = mainTotalWidth + verticalScrollWidth;
      const overWidth = dimensions.width - viewGridWidth;
      isAddSpaceWidth = true;
      const absOverWidth = overWidth < 0 ? Math.abs(overWidth) : overWidth;

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

      field.$alignStyle = ALIGN_STYLE[field.align] ?? (field.$renderer.alignStyle() || ALIGN_STYLE.left);

      if (field.$panel == 'left') {
        leftWidth += fieldWidth;
      } else if (field.$panel == 'right') {
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
  }

  /**
   * @method calcHeader
   * @description 헤더 정보 계산
   */
  public calcHeader() {
    const cfg = this.cfg;
    const opts = this.opts;
    const fields = deepCopy(opts.fields);

    cfg.fieldHeaderGroup = defaultFieldGroupInfo();

    const asideOrder: any[] = [];
    // linenumber
    if (opts.aside.lineNumber.enabled === true) {
      opts.aside.lineNumber.order = opts.aside.lineNumber.order ?? 0;
      const fieldItem = merge({}, DEFAULT_FIELD_INFO, opts.aside.lineNumber, {
        name: LINE_NUMBER_NAME,
        renderer: { type: 'lineNumber' },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    // rowCheckbox
    if (opts.aside.rowCheckbox.enabled === true) {
      opts.aside.rowCheckbox.order = opts.aside.rowCheckbox.order ?? 1;
      const fieldItem = merge({}, DEFAULT_FIELD_INFO, opts.aside.rowCheckbox, {
        name: ROW_CHECK_NAME,
        renderer: { type: 'rowCheckbox', customOptions: { allowMultiSelect: opts.aside.rowCheckbox.allowMultiSelect } },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    // rowDragHandle
    if (opts.body.rowMove?.enabled === true && opts.body.rowMove?.enableDragHandle !== false) {
      const fieldItem = merge({}, DEFAULT_FIELD_INFO, {
        name: ROW_DRAG_HANDLE_NAME,
        width: 32,
        order: 2,
        renderer: { type: 'rowDragHandle' },
        $isAside: true,
      });
      asideOrder.push(fieldItem);
    }

    // modifyInfo 추가.
    if (opts.aside.modifyInfo.enabled === true) {
      opts.aside.modifyInfo.order = opts.aside.modifyInfo.order ?? 2;
      const fieldItem = merge({}, DEFAULT_FIELD_INFO, opts.aside.modifyInfo, {
        name: '$modifyInfo',
        renderer: { type: 'modifyInfo' },
        $isAside: true,
      });
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

    for (const field of fields) {
      this.headerGroupInfo(field, 0, cfg.fieldHeaderGroup, fixedLeftIndex, fixedRightIndex, '' + fieldIndex++);
    }

    cfg.fieldHeaderGroup.depth = cfg.fieldHeaderGroup.center.length;
    cfg.currentFields = cfg.fieldHeaderGroup.leaf;
    cfg.fixedLeftIndex = fixedLeftIndex + 1;
    cfg.fixedRightIndex = fixedRightIndex > cfg.currentFields.length ? 0 : fixedRightIndex;
    cfg.dataInfo.colLength = cfg.currentFields.length;

    if (opts.header.view === false) {
      return;
    }

    const heightOption = heightOptionValue(opts.header.height, 28);
    const { height, heights } = heightOption;

    const groupDepth = cfg.fieldHeaderGroup.depth;

    cfg.fieldHeaderGroup.heights = new Array(groupDepth);

    let mainHeaderHeight = 0;
    let headerHeight = height;
    for (let i = 0; i < groupDepth; i++) {
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
  public headerGroupInfo(
    field: FieldItem,
    depth: number,
    fieldGroupInfo: FieldHeaderGroupInfo,
    fixedLeftIndex: number,
    fixedRightIndex: number,
    fieldIndex: string,
  ) {
    if (field.hidden) {
      field.$colspan = 0;
      return field;
    }

    field.$enableHelp = !isUndefined(field.headerHelp);

    // help button
    if (field.$enableHelp && !this.cfg.enableHeaderHelpButton) {
      this.cfg.enableHeaderHelpButton = true;
    }

    // sort button
    if (field.sort && !this.cfg.enableSortButton) {
      this.cfg.enableSortButton = true;
    }

    field.$depth = depth + 1;

    field.$uid = this.$instanceId + '_' + field.$depth + '_' + fieldIndex;
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
        for (const childNode of children) {
          this.headerGroupInfo(
            childNode,
            field.$depth,
            fieldGroupInfo,
            fixedLeftIndex,
            fixedRightIndex,
            fieldIndex + '_' + childFieldIndex++,
          );
          colspan += childNode.$colspan;
        }

        field.$colspan = colspan;
        field.$resizeIdx = fieldGroupInfo.leaf.length - 1;
      }
    } else {
      field.$resizeIdx = fieldGroupInfo.leaf.length;
    }

    if (isUndefined(fieldGroupInfo.left[depth])) {
      fieldGroupInfo.left[depth] = [];
    }
    if (isUndefined(fieldGroupInfo.center[depth])) {
      fieldGroupInfo.center[depth] = [];
    }

    if (isUndefined(fieldGroupInfo.right[depth])) {
      fieldGroupInfo.right[depth] = [];
    }

    if (field.$isLeaf) {
      field = this.setRendererInfo(field);
    }

    // left 고정 컬럼
    if (
      (field.$childLength > 0 && fixedLeftIndex > field.$resizeIdx - field.$colspan) ||
      (field.$childLength < 1 && fixedLeftIndex >= field.$resizeIdx)
    ) {
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
      field.$panel = 'left';
      if (field.$isLeaf) fieldGroupInfo.leafLeft.push(field);
    }

    // right 고정 컬럼
    if (fixedRightIndex > 0 && fixedRightIndex <= field.$resizeIdx) {
      if (field.$colspan == 1) {
        fieldGroupInfo.right[depth].push(field);
      } else {
        let rightColspan = field.$colspan;

        const bodyFieldColspan = field.$colspan - (field.$resizeIdx - fixedRightIndex) - 1;

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

      field.$panel = 'right';
      if (field.$isLeaf) fieldGroupInfo.leafRight.push(field);
    }

    if (isUndefined(field.$panel)) {
      fieldGroupInfo.center[depth].push(field);
      field.$panel = 'center';
      if (field.$isLeaf) fieldGroupInfo.leafCenter.push(field);
    }

    if (field.$isLeaf) {
      field.width = isNumber(field.width) ? field.width : this.cellMinWidth;

      if (!field.$isAside) {
        field.width = Math.max(field.width, this.cellMinWidth);
      }

      field.$width = field.width;

      fieldGroupInfo.leaf.push(field);

      field.$colSeq = fieldGroupInfo.leaf.length - 1;

      this.cfg.allFieldMap.set(field.name, field);
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
    const opts = this.opts;
    let renderInfo = { type: 'text' };

    if (isPlainObject(field.renderer)) {
      renderInfo = merge({}, field.renderer);
    } else if (isString(field.renderer)) {
      renderInfo = { type: field.renderer };
    }

    const render = VIEW_RENDERER[renderInfo.type];

    if (isUndefined(render)) {
      renderInfo.type = 'text';
    }

    field.renderer = renderInfo;
    field.$renderer = new VIEW_RENDERER[renderInfo.type](field, this);

    if (opts.editable && field.editable !== false) {
      let editRendererInfo = field.editRenderer;

      if (isString(editRendererInfo)) {
        editRendererInfo = { type: editRendererInfo };
      }

      let type = 'text';
      const editType = editRendererInfo?.type;

      if (editType && EDIT_RENDERER[editType]) {
        type = editType;
      } else if (EDIT_RENDERER[renderInfo.type]) {
        type = renderInfo.type;
      }

      field.$editRenderer = new EDIT_RENDERER[type](field, this);
    }

    return field;
  }

  /**
   * change scroll mode
   *
   * @param mode scroll mode
   */
  private changeScrollMode() {
    const cfg = this.cfg;
    const scrollWidth = this.opts.scroll.width;
    const scrollMode = (cfg.scroll.enableHorizontal ? 1 : 0) + (cfg.scroll.enableVertical ? 2 : 0);

    const mainContainerStyle = this._mainElement.find('.dg-main-container').style;

    mainContainerStyle.removeProperty('height');
    mainContainerStyle.removeProperty('width');

    if (cfg.scroll.enableHorizontal) {
      mainContainerStyle.height = `calc(100% - ${scrollWidth})`;
    }

    if (cfg.scroll.enableVertical) {
      mainContainerStyle.width = `calc(100% - ${scrollWidth})`;
    }

    if (scrollMode == 0) {
      this._mainElement.removeAttr('data-scroll');
    } else {
      this._mainElement.setAttr({ 'data-scroll': SCROLL_MODE[scrollMode] });
    }
  }

  /**
   * set data
   *
   * @param {any[]} items
   */
  public setItems = (items: any[]) => {
    this.setDataInfo(items);
    this.body.dataDraw('setItems');
  };

  private setDataInfo(items: any[]) {
    this.cfg.dataManager.setItems(items);
  }

  public refreshBody() {
    this.calcBody();
    if (this.scroll) {
      this.scroll.calculate();
      this.setElementDimentions();
      this.fieldResize();
      this.summary.drawData();
    }

    this.getBody().dataDraw('refreshBody');
  }

  /**
   * add row
   *
   * @param {any[]} items items
   * @param {ADD_ROW_POSITION} position before , after
   * @param {?number} [rowIndex] row index
   */
  public addRow = (items: any | any[], position: ADD_ROW_POSITION, rowIndex?: number) => {
    const cfg = this.cfg;
    const currentItems = cfg.dataManager.getOriginItems();
    const isBefore = position === 'before';

    const addItems = Array.isArray(items) ? items : [items];

    insertToArray(currentItems, items, isBefore, rowIndex);

    this.setItems(currentItems);

    if (isUndefined(rowIndex)) {
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
    const cfg = this.cfg;
    const currentItems = cfg.dataManager.getOriginItems();

    for (const item of currentItems) {
      if (ids.length < 1) break;

      const index = ids.findIndex((el) => el === item[ROW_ID_KEY]);

      if (index !== -1) {
        ids.splice(index, 1); // 인덱스 위치에서 1개 요소 삭제
        item[ROW_CUD_KEY] = 'D';
      }
    }
    this.cfg.dataManager.setViewItems(currentItems);
    this.refreshBody();
  };

  /**
   * all data clear
   *
   * @public
   */
  public clearItems() {
    this.setItems([]);
  }

  /**
   * get checked items
   *
   * @param names filed names
   * @returns {array} checked item array
   */
  public getCheckedItems(names?: string | string[]) {
    const items = this.cfg.dataManager.getViewItems();
    const checkItems = [];

    let exportNames: string[] = [];
    let isAll = false;
    if (isUndefined(names)) {
      isAll = true;
    } else if (!isArray(names)) {
      exportNames = [names];
    } else {
      exportNames = names;
    }

    for (const item of items) {
      if (item[ROW_CHECK_KEY]) {
        let checkItem;
        if (isAll) {
          checkItem = item;
        } else {
          checkItem = {} as any;
          for (const name of exportNames) {
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

  public getCheckedIds() {
    return this.getBody().getCheckedItemByName(ROW_ID_KEY);
  }

  /**
   * all check
   *
   * @public
   * @param {boolean} checked
   */
  public setAllCheckedItems(checked: boolean) {
    if (!this.cfg.isRowAllowMultiSelect) throw new Error('The allowMultiSelect option does not support methods.');
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
    if (!this.cfg.isRowAllowMultiSelect) throw new Error('The allowMultiSelect option does not support methods.');
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
    const dgElement = this.gridElement.find('.daracl-grid > div');

    const theme = GRID_THEME[themeName];

    if (!theme) return;

    const cfg = this.cfg;

    if (cfg.theme == theme) return;

    const classList = dgElement.classList;

    if (classList.contains(cfg.theme)) classList.remove(cfg.theme);

    cfg.theme = theme;

    if (!classList.contains(theme)) classList.add(theme);
  }

  /**
   * tree 확장
   * @param id id
   */
  expandRow(id: any) {
    const cfg = this.cfg;
    cfg.dataManager.expandRow(id);
    this.body.dataDraw('expandRow');
  }

  /**
   * int grid html tempate
   *
   * @private
   */
  private initTemplate() {
    const cfg = this.cfg;
    const dimensions = cfg.dimensions;
    const opts = this.opts;
    const { footer, summary, scroll } = opts;

    const pagingAlign = ALIGN[footer.paging?.position ?? 'center'];
    const selectionAlign = ALIGN[footer.selection?.position ?? 'center'];
    const pagingInfoAlign = ALIGN[footer.paging?.formatPosition ?? 'center'];

    let summaryTemplate = '';
    let isSummaryTop = false;
    if (dimensions.mainSummaryHeight > 0) {
      isSummaryTop = summary?.position === 'top';
      summaryTemplate = `<div class="dg-panel dg-summary ${isSummaryTop ? 'dg-top' : ''}" style="height:${
        dimensions.mainSummaryHeight
      }px;">
          <div class="dg-left"></div>
          <div class="dg-center"></div>
          <div class="dg-right"></div>
      </div>`;
    }

    const scrollSize = scroll.width;

    const templateHtml = `
      <div class="daracl-grid" tabindex="-1"  style="outline:none !important;">
        <div style="position:absolute;">
          ${
            opts.toolbar.enabled
              ? `<div class="dg-toolbar" role="presentation" style="height:${dimensions.toolbarHeight}px;"></div>`
              : ''
          }
          <div tabindex="-1" style="outline:none !important;" class="dg-main ${
            opts.selectionMode != 'none' ? 'daracl-noselect' : ''
          } dg-style-${this._BODY_STYLE.includes(opts.styleClass) ? opts.styleClass : 'default'}" data-scroll="none">
              <div class="dg-main-container">
                  ${
                    opts.header.view
                      ? `<div class="dg-panel dg-header" style="height:${dimensions.mainHeaderHeight}px;">
                        <div class="dg-left"></div>
                        <div class="dg-center"></div>
                        <div class="dg-right"></div>
                    </div>`
                      : ''
                  }
                  
                  ${isSummaryTop ? summaryTemplate : ''}
                  <div class="dg-panel dg-body">
                      <div class="dg-left"></div>
                      <div class="dg-center"></div>
                      <div class="dg-right"></div>
                      <div class="dg-empty-msg-area"><span class="dg-empty-msg"><i class="dg-icon-info"></i><span class="empty-text">${this.i18n().getMessage(
                        'no.data',
                      )}</span></span></div>
                      <div class="dg-movedrop-helper"></div>
                  </div>
                  ${!isSummaryTop ? summaryTemplate : ''}
              </div>
              <div class="dg-resize-helper"></div>
              <div class="dg-scroll-container">
                  <div class="dg-scroll dg-vertical" style="width:${scrollSize}px">
                    <div class="dg-scroll-track"></div>
                    <div class="dg-scroll-thumb" style="width:${scrollSize - 3}px;margin:${scrollSize}px 0px;"></div>
                    <div class="dg-scroll-button" data-dg-mode="up" style="top:0px;"><svg style="width: ${scrollSize}px; height: ${scrollSize}px;fill: currentColor;" viewBox="0 0 1024 1024"><path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"/></svg></div>
                    <div class="dg-scroll-button" data-dg-mode="down" style="bottom:-2px;"><svg style="width: ${scrollSize}px; height: ${scrollSize}px;fill: currentColor;" viewBox="0 0 1024 1024"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"/></svg></div>
                  </div>
                  <div class="dg-scroll dg-horizontal" style="height:${scrollSize}px">
                    <div class="dg-scroll-track"></div>
                    <div class="dg-scroll-thumb" style="height:${scrollSize - 3}px;margin:0px ${scrollSize}px"></div>
                    <div class="dg-scroll-button" data-dg-mode="left" style="left:0px;"><svg style="width: ${scrollSize}px; height: ${scrollSize}px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1"><path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"/></svg></div>
                    <div class="dg-scroll-button" data-dg-mode="right" style="right:0px;"><svg style="width: ${scrollSize}px; height: ${scrollSize}px;fill: currentColor;" viewBox="0 0 1024 1024" version="1.1"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"/></svg></div>
                  </div>
                  <div class="dg-scroll-edge" style="width:${scrollSize}px;height:${scrollSize}px;"></div>
              </div>
              <div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;">
                <textarea class="dg-paste-area"></textarea>
              </div>
              <div class="dg-layer-container"></div>
          </div>
          ${
            footer.enabled
              ? `<div class="dg-footer" role="presentation" style="height:${dimensions.footerHeight}px;">
            <span class="dg-status ${selectionAlign}">
              <span class="dg-selection-status"></span>
            </span>
            <span class="dg-paging ${pagingAlign}"></span>
            <span class="dg-paging-info ${pagingInfoAlign}"></span>
          </div>`
              : ''
          }
        </div>
    </div>
    `;

    this.gridElement.html(templateHtml);
  }

  public setPaging(paging: PagingInfo) {
    this.opts.paging = paging;
    this.config().paging = paging;
    this.getFooter().setPaging(paging);
  }

  public destroy() {
    const gridElement = this.gridElement;
    const uid = this.$instanceId;

    const cfg = this.cfg;

    if (ALL_INSTANCE.get(uid)) {
      cfg.eventManager.destroy();
      gridElement.removeAttr(INSTANCE_ATTR_KEY);
      const el = gridElement.getElement();

      this.resizeObserver.unobserve(el);
      this.resizeObserver.disconnect();

      el.style.cssText = this.orginStyle;
      while (el.firstChild) {
        if (typeof el.firstChild.remove === 'function') {
          el.firstChild.remove(); // DOM에서 제거
        } else {
          el.removeChild(el.firstChild);
        }
      }
      ALL_INSTANCE.delete(uid);
    }
  }
}

function fieldCopy(field: any): any {
  const result: any = {};

  Object.entries(field).forEach(([key, value]) => {
    if (!isObject(value) || key == 'renderer') {
      result[key] = value;
    }
  });

  return result;
}
