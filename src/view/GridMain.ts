import { Config } from '@t/GridConfig';

import {
  ADD_ITEM_POSITION,
  FIELD_LAYER_CLASS,
  FIELD_PREFIX,
  FOOTER_HEIGHT,
  GRID_THEME,
  HIDDEN_ELEMENT_SELECTOR,
  INSTANCE_ATTR_KEY,
  LAYER_ATTR_NAME,
  THEME_TYPE,
  TOOLBAR_HEIGHT,
} from '@/constants';
import { DaraGrid } from '@/DaraGrid';
import { initConfig } from '@/defaultGridConfig';
import { DEFAULT_OPTIONS } from '@/defaultGridOption';
import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { ListDataManager } from '@/service/ListDataManager';
import { TreeDataManager } from '@/service/TreeDataManager';
import { AddRowOptions } from '@/types/Common';
import { GridOptions } from '@/types/GridOptions';
import { Message } from '@/types/Message';
import { PagingInfo } from '@/types/PagingInfo';
import { heightOptionValue } from '@/util/gridUtils';
import { html } from '@/util/htmlTemplate';
import { Language } from '@/util/Language';
import { debounce, isArray, isNumber, isString, isUndefined, isVisible, merge } from '@/util/utils';
import { Toolbar } from '@/view/toolbar/Toolbar';
import { Footer } from './footer/Footer';
import { GridStructureBuilder } from './GridStructureBuilder';
import { Body } from './main/body/Body';
import { ContextMenu } from './main/ContextMenu';
import { DataSearch } from './main/DataSearch';
import { Header } from './main/header/Header';
import { Scroll } from './main/scroll/Scroll';
import { Summary } from './main/Summary';

const SCROLL_MODE = ['none', 'horizontal', 'vertical', 'both'];

interface GridSize {
  height: number;
  width: number;
}

let DARA_GRID_SEQ = 0;

let INIT_GRID_GLOBAL_EVNET = false;

// all instance
const ALL_INSTANCE = new Map<string, GridMain>();

const GRID_TEMPLATE = getGridTemplate();
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

  private toolbar: Toolbar;

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

  private gridStructureBuilder: GridStructureBuilder;

  constructor(grid: DaraGrid, element: HTMLElement, options: GridOptions, message?: Message) {
    const opts = merge({}, DEFAULT_OPTIONS, options) as GridOptions;

    this.grid = grid;
    this.language = new Language();

    if (message) this.language.setMessage(message);

    this.cfg = initConfig(opts);
    if (opts.tree) {
      this.cfg.dataManager = new TreeDataManager(opts, this);
    } else {
      this.cfg.dataManager = new ListDataManager(opts, this);
    }

    this.gridStructureBuilder = new GridStructureBuilder(opts, this);

    this.opts = opts;

    const beforeUid = element.getAttribute(INSTANCE_ATTR_KEY);
    this.$instanceId = beforeUid ?? `${FIELD_PREFIX}${++DARA_GRID_SEQ}`;
    this.orginStyle = element.style.cssText;

    element.setAttribute(INSTANCE_ATTR_KEY, this.$instanceId);

    this.gridElement = new DaraElement(element);

    GridMain.setInstance(this.$instanceId, this);

    const headerOpts = opts.header;
    this.cellMinWidth = headerOpts.resize.minWidth;
  }

  public init() {
    const opts = this.opts;

    this.initGridSize = {
      height: opts.height == 'auto' ? -1 : opts.height,
      width: opts.width == 'auto' ? -1 : opts.width,
    };

    this.calcGridDimention();
    this.setSize(this.initGridSize.width, this.initGridSize.height, false);

    this.initElement();

    this.calculation();

    this.initMainView();

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

        for (const el of document.querySelectorAll(`${HIDDEN_ELEMENT_SELECTOR} [data-grid-id="dg1"]`)) {
          if (path.includes(el)) {
            return;
          }
        }

        if (!path.includes(gridElement)) {
          grid.setGridFocusOut();
        }
      });
    });
  }

  public static setInstance(instanceID: string, gridMain: GridMain) {
    if (ALL_INSTANCE.get(instanceID)) {
      ALL_INSTANCE.get(instanceID)?.destroy();
    }

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
    const opts = this.opts;

    const gridElement = GRID_TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // empty text
    const emptyText = gridElement.querySelector('.empty-text');

    if (emptyText) {
      emptyText.textContent = this.i18n().getMessage('no.data');
    }

    // append
    this.gridElement.getElement().appendChild(gridElement);

    this._mainElement = new DaraElement(this.gridElement.find('.dg-main'));

    this.containerElement = new DaraElement(this.gridElement.find('.daracl-grid > div'));

    this.rendererContainer = this.gridElement.find('.dg-layer-container');

    this._mainElement.addClass(
      `dg-style-${this._BODY_STYLE.includes(opts.styleClass) ? opts.styleClass : 'default'} ${
        opts.selectionMode === 'none' ? '' : 'daracl-noselect'
      }`,
    );

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

    this.toolbar = new Toolbar(this);

    this.selectionInfo = new SelectionInfo(this, opts, this.cfg);

    this.header = new Header(this);
    this.body = new Body(this);
    this.summary = new Summary(this);

    if (opts.search.enabled) {
      this.dataSearch = new DataSearch(this);
    }

    this.scroll = new Scroll(this);

    this.footer = new Footer(this);

    this.contextMenu = new ContextMenu(this);

    this.toolbar.init();
    this.selectionInfo.initSelection();

    this.body.init();

    this.summary.init();

    this.footer.init();

    this.scroll.init();

    this.contextMenu.init();

    this.refreshBody(true, 'init');
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
    this.gridStructureBuilder.buildFields();
    this.cfg.dataManager.setItems(this.opts.items);
    //this.calcBody();
  }

  public calcBody() {
    this.gridStructureBuilder.calculateBodyLayout();
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

  public getCurrentSize() {
    return this.currentSize;
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

  resizeDraw() {
    const scroll = this.cfg.scroll;

    this.calcBody();

    if (
      scroll.before.startIdx !== scroll.startIdx ||
      scroll.before.viewRow !== scroll.viewRow ||
      scroll.before.startCol !== scroll.startCol ||
      scroll.before.endCol !== scroll.endCol
    ) {
      this.refreshBody(true, 'resizeDraw');
    } else {
      this.refreshBody(false, 'resizeDraw');
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

    const shouldResizeHeader = this.header.isEnabled();
    const shouldResizeBody = this.cfg.dataInfo.rowLength > 0;
    const shouldResizeSummary = this.summary.isEnabled();

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];

      const selector = `th[data-col-idx="${j}"]`;
      const width = `${field.$width}px`;
      if (shouldResizeHeader) {
        headerElement.find(selector).style.width = width;
      }

      if (shouldResizeBody) {
        bodyElement.find(selector).style.width = width;
      }

      if (shouldResizeSummary) {
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

    if (!isUndefined(opts.summary) && opts.summary.items.length > 0) {
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

      dimensions.mainSummaryHeight = totalHeight + Math.min(totalHeight, 3); // 2 border + 1 padding
    }
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
  public setItems(items: any[]) {
    this.cfg.dataManager.setItems(items);
    this.scroll.moveVerticalScroll({ rowIdx: 0 });
    this.refreshBody(true, 'setItems');
  }

  public refreshBody(drawFlag: boolean, mode: string) {
    this.scroll.calculate();
    this.setElementDimentions();
    this.fieldResize();
    this.summary.drawData();

    if (drawFlag) {
      this.getBody().dataDraw('refreshBody-' + mode);
    }
  }

  /**
   * add row
   *
   * @param {any[]} items items
   * @param {ADD_ITEM_POSITION} position before , after
   * @param {?number} [rowIndex] row index
   */
  public addRows(addOpts: AddRowOptions) {
    const cfg = this.cfg;

    const rowIdx = cfg.dataManager.addRows(addOpts);

    this.scroll.moveVerticalScroll({ rowIdx: rowIdx });
  }

  /**
   * remove row data
   *
   * @param {any[]} ids row positions
   */
  public removeRows(ids: any[]) {
    const cfg = this.cfg;

    cfg.dataManager.removeRows(ids);
    this.refreshBody(true, 'removeRows');
  }

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
  public getCheckedItems(names?: string | string[] | undefined) {
    const { dataManager } = this.cfg;
    const items = dataManager.getViewItems();
    const checkItems = [];

    let exportNames: string[] = [];
    let isAll = false;
    if (isUndefined(names)) {
      isAll = true;
    } else if (isArray(names)) {
      exportNames = names;
    } else {
      exportNames = [names];
    }

    for (const item of items) {
      if (dataManager.isItemChecked(item)) {
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
    return this.getBody().getCheckedItemByName(this.cfg.rowIdField);
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

      if (this.resizeObserver) {
        this.resizeObserver.unobserve(el);
        this.resizeObserver.disconnect();
      }

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

function getGridTemplate() {
  // 파일 상단 추가
  const GRID_TEMPLATE = document.createElement('template');

  GRID_TEMPLATE.innerHTML = html`
    <div class="daracl-grid" tabindex="-1" style="outline:none !important;">
      <div style="position:absolute;user-select:none;touch-action:manipulation;">
        <div class="dg-toolbar" role="presentation"></div>

        <div tabindex="-1" class="dg-main" data-scroll="none" style="outline:none !important;">
          <div class="dg-main-container">
            <div class="dg-panel dg-header">
              <div class="dg-left"></div>
              <div class="dg-center"></div>
              <div class="dg-right"></div>
            </div>

            <div class="dg-panel dg-body">
              <div class="dg-left"></div>
              <div class="dg-center"></div>
              <div class="dg-right"></div>

              <div class="dg-empty-msg-area">
                <span class="dg-empty-msg">
                  <i class="dg-icon-info"></i>
                  <span class="empty-text"></span>
                </span>
              </div>

              <div class="dg-movedrop-helper"></div>
            </div>

            <div class="dg-panel dg-summary">
              <div class="dg-left"></div>
              <div class="dg-center"></div>
              <div class="dg-right"></div>
            </div>
          </div>

          <div class="dg-resize-helper"></div>

          <div class="dg-scroll-container">
            <div class="dg-scroll dg-vertical">
              <div class="dg-scroll-track"></div>
              <div class="dg-scroll-thumb"></div>

              <div class="dg-scroll-button" data-dg-mode="up" style="top:0px;">
                <svg viewBox="0 0 1024 1024" style="fill: currentColor;">
                  <path d="M951.1626 819.412438 72.8374 819.412438 511.999488 204.586538Z"></path>
                </svg>
              </div>

              <div class="dg-scroll-button" data-dg-mode="down" style="bottom:-2px;">
                <svg viewBox="0 0 1024 1024" style="fill: currentColor;">
                  <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z"></path>
                </svg>
              </div>
            </div>

            <div class="dg-scroll dg-horizontal">
              <div class="dg-scroll-track"></div>
              <div class="dg-scroll-thumb"></div>

              <div class="dg-scroll-button" data-dg-mode="left" style="left:0px;">
                <svg viewBox="0 0 1024 1024" style="fill: currentColor;">
                  <path d="M819.41295 72.835865 819.41295 951.161065 204.586027 512Z"></path>
                </svg>
              </div>

              <div class="dg-scroll-button" data-dg-mode="right" style="right:0px;">
                <svg viewBox="0 0 1024 1024" style="fill: currentColor;">
                  <path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z"></path>
                </svg>
              </div>
            </div>

            <div class="dg-scroll-edge"></div>
          </div>

          <div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;">
            <textarea class="dg-paste-area"></textarea>
          </div>

          <div class="dg-layer-container"></div>
        </div>

        <div class="dg-footer" role="presentation">
          <span class="dg-status">
            <span class="dg-selection-status"></span>
          </span>

          <span class="dg-paging"></span>

          <span class="dg-paging-info"></span>
        </div>
      </div>
    </div>
  `;
  return GRID_TEMPLATE;
}
