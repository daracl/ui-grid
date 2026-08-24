import { Config } from '@t/GridConfig';

import { ALL_ICONS } from '@/constantIcons';
import {
  FIELD_LAYER_CLASS,
  FIELD_PREFIX,
  HoverModeMap,
  INSTANCE_ATTR_KEY,
  ItemStatusMap,
  LAYER_ATTR_NAME,
  ROW_FIELD,
} from '@/constants';
import { BODY_STYLE, BodyStyle, GRID_THEME, ThemeType } from '@/constantStyles';
import { DaraGrid } from '@/DaraGrid';
import { initConfig } from '@/defaultGridConfig';
import { initGridOptions } from '@/defaultGridOption';
import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { ListDataManager } from '@/service/ListDataManager';
import { TreeDataManager } from '@/service/TreeDataManager';
import { AddRowOptions } from '@/types/Common';
import { GridOptions } from '@/types/GridOptions';
import { Message } from '@/types/Message';
import { PagingInfo } from '@/types/PagingInfo';
import { html } from '@/util/htmlTemplate';
import { Language } from '@/util/Language';
import { debounce, isArray, isString, isUndefined, isVisible } from '@/util/utils';
import { Toolbar } from '@/view/toolbar/Toolbar';
import { StructureBuilder } from './builder/StructureBuilder';
import { Footer } from './footer/Footer';
import { Body } from './main/body/Body';
import { ContextMenu } from './main/ContextMenu';
import { Header } from './main/header/Header';
import { Scroll } from './main/scroll/Scroll';
import { Summary } from './main/Summary';
import { ApiDataSearch } from './search/ApiDataSearch';
import { DataSearch } from './search/DataSearch';
import { SimpleDataSearch } from './search/SimpleDataSearch';

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

  private mainElement: DaraElement;

  private layoutElement: DaraElement;

  private rendererLayerElement: HTMLElement;

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

  private readonly structureBuilder: StructureBuilder;

  constructor(grid: DaraGrid, element: HTMLElement, options: GridOptions, message?: Message) {
    const opts = initGridOptions(options);

    this.grid = grid;
    this.language = new Language();

    if (message) this.language.setMessage(message);

    this.cfg = initConfig(opts);
    if (opts.tree) {
      this.cfg.dataManager = new TreeDataManager(opts, this);
    } else {
      this.cfg.dataManager = new ListDataManager(opts, this);
    }

    this.structureBuilder = new StructureBuilder(opts, this);

    this.opts = opts;

    const beforeUid = element.getAttribute(INSTANCE_ATTR_KEY);

    if (beforeUid && ALL_INSTANCE.get(beforeUid)) {
      ALL_INSTANCE.get(beforeUid)?.destroy();
    }

    this.$instanceId = beforeUid ?? `${FIELD_PREFIX}${++DARA_GRID_SEQ}`;
    this.orginStyle = element.style.cssText;

    element.setAttribute(INSTANCE_ATTR_KEY, this.$instanceId);

    this.gridElement = new DaraElement(element);

    ALL_INSTANCE.set(this.$instanceId, this);
  }

  public init() {
    const opts = this.opts;

    this.initGridSize = {
      height: opts.height == 'auto' ? -1 : opts.height,
      width: opts.width == 'auto' ? -1 : opts.width,
    };

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
      const path = e.composedPath();
      ALL_INSTANCE.forEach((grid, id) => {
        const gridElement = grid.gridElement.getElement();

        if (!path.includes(gridElement)) {
          grid.setGridFocusOut();
        }
      });
    });
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
    if (this.cfg.disableVerticalScroll) {
      gridElement.classList.add('dg-auto-height');
    }
    this.layoutElement = new DaraElement(this.gridElement.find('.daracl-grid .dg-layout'));

    this.setGridStyle(this.opts.style);

    this.rendererLayerElement = this.gridElement.find('.dg-layers');

    this.mainElement = new DaraElement(this.gridElement.find('.dg-main'));

    const hoverClassName = opts.hoverMode ? HoverModeMap[opts.hoverMode] ?? HoverModeMap.cell : HoverModeMap.cell;

    this.mainElement.addClass(
      opts.selectionMode === 'none' ? 'dg-select' : 'dg-noselect',
      'dg-body-hover-' + hoverClassName,
    );

    this.setTheme(this.opts.theme);

    const style = window.getComputedStyle(this.mainElement.getElement());

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
      this.dataSearch = new SimpleDataSearch(this);
    } else {
      this.dataSearch = new ApiDataSearch(this);
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

  public getRendererLayerElement() {
    return this.rendererLayerElement;
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

    const containerElement = this.layoutElement;

    const rendererLayerElement = this.rendererLayerElement;

    // focus in, mousedown
    cfg.eventManager.on({ el: containerElement.getElement(), type: 'mousedown' }, (e: UIEvent) => {
      const path = e.composedPath();
      if (path.includes(rendererLayerElement)) {
        return;
      }
      this.setGridFocusIn(e);
    });

    const dgLayersElement = containerElement.findDaraElement('.dg-layers').getElement();

    const layerSelector = `[${LAYER_ATTR_NAME}]`;

    cfg.eventManager.off(dgLayersElement, 'wheel DOMMouseScroll');
    cfg.eventManager.on(
      { el: dgLayersElement, type: 'wheel DOMMouseScroll' },
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
  public setGridFocusIn(e?: Event) {
    if (e) {
      const targetElement = e.target as HTMLElement;

      if (
        targetElement.closest('.dg-empty-overlay') != null ||
        (targetElement.closest('.dg-body') == null && targetElement.closest('.dg-layers') == null)
      ) {
        this.hideLayer();
      }
    }

    if (document.activeElement != this.mainElement.getElement()) {
      this.mainElement.getElement().focus({ preventScroll: true });
    }

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
      const layoutElement = this.layoutElement.getElement();

      const relatedTarget = (e as any).relatedTarget as HTMLElement;

      if (relatedTarget?.closest('.dg-hidden-layers') !== null) {
        const outerLayerElement = relatedTarget.closest('.dg-outer-layer') as HTMLElement;

        if (outerLayerElement?.dataset.gridId == this.$instanceId) {
          layoutElement.focus({ preventScroll: true });
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

      return;
    }

    this.cfg.isOpenLayer = false;

    for (let idx = this.openLayers.length - 1; idx >= 0; idx--) {
      const layerElement = this.openLayers[idx];

      layerElement.style.display = 'none';

      this.openLayers.splice(idx, 1);
    }

    this.cfg.activeComponent = '';
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
      let resizeScheduled = false;
      const mainElement = el.getElement();
      const resizeObserver = new ResizeObserver(() => {
        if (resizeScheduled) {
          return;
        }

        resizeScheduled = true;

        requestAnimationFrame(() => {
          resizeScheduled = false;
          this.resize(el);
        });
      });
      resizeObserver.observe(mainElement);
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
    const disableVerticalScroll = this.cfg.disableVerticalScroll;
    requestAnimationFrame(() => {
      if (!isVisible(el.getElement())) return;

      const newOffset = {
        width: isWidthResize ? (disableVerticalScroll ? el.clientWidth() : el.width()) : initGridSize.width,
        height: isHeightResize ? el.height() : initGridSize.height,
      };

      if (this.currentSize.height !== newOffset.height || this.currentSize.width !== newOffset.width) {
        this.setSize(newOffset.width, newOffset.height, true);
        if (this.toolbar) {
          this.toolbar.resizeArrowVisibility();
        }
      }
    });
  }

  /**
   * grid size 및 field 정보 계산
   */
  public calculation() {
    this.structureBuilder.buildFields();
    this.cfg.dataManager.setItems(this.opts.items);

    this.setSize(this.initGridSize.width, this.initGridSize.height, false);
    this.structureBuilder.calcGridDimension();

    this.calcBody();
  }

  public calcBody() {
    this.structureBuilder.calculateBodyLayout(this.currentSize.width, this.currentSize.height);
  }

  /**
   * main element
   *
   * @public
   * @returns {DaraElement} main element
   */
  public getMainElement() {
    return this.mainElement;
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

  public getStructureBuilder() {
    return this.structureBuilder;
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
    this.currentSize = { width: width, height: height };

    if (drawFlag) {
      this.resizeDraw();
    }
  }

  resizeDraw() {
    this.calcBody();
    this.refreshBody(false, 'resizeDraw');
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

  setElementDimensions() {
    const cfg = this.cfg;
    const dimensions = cfg.dimensions;
    this.mainElement.setHeight(dimensions.mainHeight);
    this.mainElement.findDaraElement('.dg-body').setHeight(dimensions.mainBodyHeight);
    this.layoutElement.css({
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
   * change scroll mode
   *
   * @param mode scroll mode
   */
  private changeScrollMode() {
    const cfg = this.cfg;
    const scrollbarSize = cfg.scrollbarSize;
    const scrollMode = (cfg.scroll.enableHorizontal ? 1 : 0) + (cfg.scroll.enableVertical ? 2 : 0);

    const mainPanelStyle = this.mainElement.find('.dg-panels').style;

    mainPanelStyle.removeProperty('height');
    mainPanelStyle.removeProperty('width');

    if (cfg.scroll.enableHorizontal) {
      mainPanelStyle.height = `calc(100% - ${scrollbarSize})`;
    }

    if (cfg.scroll.enableVertical) {
      mainPanelStyle.width = `calc(100% - ${scrollbarSize})`;
    }

    if (scrollMode == 0) {
      this.mainElement.removeAttr('data-scroll');
    } else {
      this.mainElement.setAttr({ 'data-scroll': SCROLL_MODE[scrollMode] });
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
    this.setElementDimensions();
    this.fieldResize();

    if (drawFlag) {
      this.getBody().dataDraw('refreshBody-' + mode);
      return;
    }

    if (mode == 'resizeDraw') {
      const scroll = this.cfg.scroll;

      if (
        scroll.before.startIdx !== scroll.startIdx ||
        scroll.before.viewRow !== scroll.viewRow ||
        scroll.before.startCol !== scroll.startCol ||
        scroll.before.endCol !== scroll.endCol
      ) {
        this.getBody().dataDraw('refreshBody-' + mode);
      }
    }
  }

  /**
   * 데이터를 추가
   *
   * @param items - 추가할 행 데이터 배열
   * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
   * @returns void
   */
  public addItems(items: any[], addOpts?: AddRowOptions) {
    const rowIdx = this.cfg.dataManager.addItems(items, addOpts, ItemStatusMap.READ);

    if (rowIdx > -1) {
      this.scroll.moveVerticalScroll({ rowIdx: rowIdx, drawFlag: false });
      this.getBody().dataDraw('refreshBody-addItems');
    }
  }

  /**
   * 새로운 item을 Grid에 추가합니다.
   *
   * item을 데이터 매니저에 추가하면서 신규 생성 상태(CREATE)를 설정하고,
   * 정상적으로 추가된 경우 해당 row 위치로 스크롤을 이동한 후 body를 갱신합니다.
   *
   * @param item 추가할 item
   * @param addOpts item 추가 옵션
   */
  public createItem(item: any, addOpts?: AddRowOptions) {
    const rowIdx = this.cfg.dataManager.createItem(item, addOpts);

    if (rowIdx > -1) {
      this.scroll.moveVerticalScroll({ rowIdx: rowIdx, drawFlag: false });
      this.getBody().dataDraw('refreshBody-addItems');
    }
  }

  /**
   * item을 삭제
   *
   * @param {any[]} ids rowId
   */
  public removeItems(ids: any[]) {
    const cfg = this.cfg;

    cfg.dataManager.removeItems(ids);
    this.refreshBody(true, 'removeItems');
  }

  /**
   * all items clear
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
    const viewItems = dataManager.getViewItems();
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

    for (const viewItem of viewItems) {
      const rowId = viewItem.id;
      if (dataManager.isItemChecked(rowId)) {
        const rowItem = dataManager.getRowItem(rowId);
        let checkItem;
        if (isAll) {
          checkItem = rowItem;
        } else {
          checkItem = {} as any;
          for (const name of exportNames) {
            checkItem[name] = rowItem[name];
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
    return this.getBody().getCheckedItemByName(ROW_FIELD.ID);
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
   * 변경된 아이템 얻기
   */
  public getChangedItems() {
    return this.cfg.dataManager.getChangedItems();
  }

  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (THEME_TYPE enum 값: 예: 'light', 'dark' 등)
   */
  public setTheme(themeName: ThemeType) {
    const dgElement = this.layoutElement.getElement();

    const theme = GRID_THEME[themeName];

    const cfg = this.cfg;

    if (!theme && !cfg.theme) {
      return;
    }

    if ((cfg.theme && !theme) || cfg.theme === theme) return;

    const classList = dgElement.classList;

    if (classList.contains(cfg.theme)) classList.remove(cfg.theme);

    cfg.theme = theme;

    if (!classList.contains(theme)) classList.add(theme);
  }

  /**
   * 그리드 스타일 변경
   *
   *  BodyStyle 스타일
   *  ex) default, striped, borderless, list
   *
   * @param styleName 적용할 그리드 스타일
   *
   */
  public setGridStyle(styleName: BodyStyle) {
    if (!BODY_STYLE[styleName]) {
      return;
    }
    const values = Object.values(BODY_STYLE)
      .filter((value) => value !== styleName)
      .map((value) => `dg-style-${value}`);

    const layoutElement = this.layoutElement;
    const newStyle = 'dg-style-' + BODY_STYLE[styleName];

    layoutElement.removeClass(...values);
    if (!layoutElement.hasClass(newStyle)) {
      layoutElement.addClass(newStyle);
    }
  }

  /**
   * tree 확장
   * @param id id
   */
  public expandRow(id: any) {
    const cfg = this.cfg;
    cfg.dataManager.expandRow(id);
  }

  public expandAll() {
    const dataManager = this.cfg.dataManager;
    if (dataManager instanceof TreeDataManager) {
      dataManager.expandAll();
      this.refreshBody(true, 'expandAll');
    }
  }

  public collapseAll() {
    const dataManager = this.cfg.dataManager;
    if (dataManager instanceof TreeDataManager) {
      dataManager.collapseAll();
      this.refreshBody(true, 'collapseAll');
    }
  }

  public setPaging(paging: PagingInfo) {
    this.opts.paging = paging;
    this.cfg.paging = paging;
    if (this.footer) {
      this.footer.setPagingTemplate(paging);
    }
  }

  public getToolbar() {
    return this.toolbar;
  }

  /**
   * toolbar value
   * @returns [] toolbar value
   */
  public getToolbarValues() {
    return this.toolbar.getValues();
  }

  public setToolbarValues(val: any) {
    return this.toolbar.setValues(val);
  }

  public destroy() {
    const gridElement = this.gridElement;
    const uid = this.$instanceId;

    const cfg = this.cfg;

    this.body.destroy();
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

function getGridTemplate() {
  // 파일 상단 추가
  const GRID_TEMPLATE = document.createElement('template');

  GRID_TEMPLATE.innerHTML = html`
    <div class="daracl-grid" tabindex="-1">
      <div class="dg-viewport">
        <div class="dg-layout" style="user-select:none;touch-action:manipulation;">
          <div class="dg-layers"></div>
          <div class="dg-toolbar dg-select" role="presentation">
            <div class="dg-toolbar-scroll"></div>
            <div class="dg-toolbar-arrow dg-noselect">
              <button type="button" class="dg-button" data-direction="left">${ALL_ICONS.scrollLeft}</button>
              <button type="button" class="dg-button" data-direction="right">${ALL_ICONS.scrollRight}</button>
            </div>
          </div>

          <div class="dg-main" data-scroll="none" tabindex="-1">
            <div class="dg-panels">
              <div class="dg-panel dg-header">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>
              </div>

              <div class="dg-panel dg-body">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>

                <div class="dg-empty-overlay">
                  <span class="dg-empty-message">
                    <i class="dg-icon-info"></i>
                    <span class="empty-text"></span>
                  </span>
                </div>

                <div class="dg-drop-indicator"></div>
              </div>

              <div class="dg-panel dg-summary">
                <div class="dg-region" data-region="left"></div>
                <div class="dg-region" data-region="center"></div>
                <div class="dg-region" data-region="right"></div>
              </div>
            </div>

            <div class="dg-resize-helper"></div>

            <div class="dg-scroll-container">
              <div class="dg-scroll dg-vertical">
                <div class="dg-scroll-track"></div>
                <div class="dg-scroll-thumb"></div>
                <div class="dg-scroll-button" data-dg-mode="up" style="top:0px;">${ALL_ICONS.scrollUp}</div>
                <div class="dg-scroll-button" data-dg-mode="down" style="bottom:0px;">${ALL_ICONS.scrollDown}</div>
              </div>

              <div class="dg-scroll dg-horizontal">
                <div class="dg-scroll-track"></div>
                <div class="dg-scroll-thumb"></div>
                <div class="dg-scroll-button" data-dg-mode="left" style="left:0px;">${ALL_ICONS.scrollLeft}</div>
                <div class="dg-scroll-button" data-dg-mode="right" style="right:0px;">${ALL_ICONS.scrollRight}</div>
              </div>
              <div class="dg-scroll-corner"></div>

              <div style="top:-9999px;left:-9999px;position:fixed;z-index:9999;">
                <textarea class="dg-paste-area"></textarea>
              </div>
            </div>
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
    </div>
  `;
  return GRID_TEMPLATE;
}
