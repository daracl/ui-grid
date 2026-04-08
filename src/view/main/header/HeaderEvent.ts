import { Config, Selection, SelectionRange } from '@t/GridConfig';
import { HeaderOptions } from '@t/GridOptions';

import { POINTER_STATE } from '@/constants';
import { DaraGrid } from '@/DaraGrid';
import { DaraElement } from '@/element/DaraElement';
import { ClickManager } from '@/event/ClickManager';
import { PointerSession } from '@/event/PointerSession';
import { FieldSortInfo } from '@/types/Header';
import { addAttr, getElementRect, getLayerElement, innerLayerPosition, removeAttr } from '@/util/domUtils';
import {
  eventOff,
  eventOn,
  eventPosition,
  isClickEvent,
  isCtrlKey,
  isShiftKey,
  stopPreventCancel,
} from '@/util/eventUtils';
import {
  dragHorizontalMovePosition,
  getHeaderResizeCellInfo,
  isFixedLeftPostion,
  isFixedRightPostion,
  isMouseMoved,
  isMultipleCellSelectionMode,
  isRowSelectionMode,
} from '@/util/gridUtils';
import { arrayCopy, isFunction, multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Header } from './Header';
import { ResizeHandler } from './ResizeHandler';

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export class HeaderEvent {
  private readonly grid: DaraGrid;
  private readonly gridMain: GridMain;

  private readonly header: Header;

  private readonly headerOpts: HeaderOptions;

  private readonly headerElement: DaraElement;

  private readonly headerCellElements: HTMLElement[];

  private drag: any;

  private toolTipElement: HTMLElement;

  constructor(grid: DaraGrid, gridMain: GridMain, header: Header) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.header = header;
    this.drag = {};
    this.headerElement = this.header.getHeaderElement();
    this.headerCellElements = this.header.getHeaderCellElements();

    this.headerOpts = grid.getOptions().header;

    this.initEvt();
  }

  initEvt() {
    this.initSearchButton();
    this.initHelpButton();
    this.initHeaderSelectionEvent();
    this.initSortEvent();

    this.initResizeEvent();
    this.initHeaderCheckbox();
  }
  initSearchButton() {
    const searchOpts = this.grid.getOptions().search;

    if (!searchOpts.enabled) return;

    const headerElement = this.headerElement;

    const searchIconElement = headerElement.find('.dg-search-icon');

    const cfg = this.grid.config();

    // 검색 처리 추가 할것.
    eventOff(searchIconElement, 'click');
    eventOn(
      searchIconElement,
      'click',
      (e: UIEvent) => {
        stopPreventCancel(e);

        this.gridMain.getDataSearch().openSearch();
        return false;
      },
      null,
      { passive: false },
    );
  }

  /**
   * init help button event
   * @returns
   */
  initHelpButton() {
    const helpOpts = this.headerOpts.help;

    if (!helpOpts.enabled) return;

    const isClick = isFunction(helpOpts.click);

    const cfg = this.grid.config();

    const helpElements = this.headerElement.finds('.dg-header-help');

    if (isClick) {
      const helpClickFn = helpOpts.click ?? (() => void 0);
      eventOff(helpElements, 'mousedown touchstart');
      eventOn(
        helpElements,
        'mousedown touchstart',
        (e: UIEvent) => {
          if (!isClickEvent(e)) {
            return;
          }
          stopPreventCancel(e);

          const currentElement = e.currentTarget as HTMLElement;
          const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

          helpClickFn(cellInfo);

          return false;
        },
        null,
        { passive: false },
      );
    }

    // tooltip mouseenter
    const delay = helpOpts.showDelay;
    const renderContainer = this.gridMain.getRendererContainer();
    let tooltipTimer: any;
    eventOff(helpElements, 'mouseenter');
    eventOn(helpElements, 'mouseenter', (e: UIEvent) => {
      const currentElement = e.currentTarget as HTMLElement;
      const cellInfo = this.getHeaderHelpCellInfo(cfg, currentElement);

      const field = cellInfo.field;

      const content = field?.headerTooltip?.content;

      if (!content) return false;

      let toolTipElement = this.toolTipElement;

      if (!toolTipElement) {
        toolTipElement = getLayerElement('div', 'dg-header-help-tooltip', 'help-tooltip');

        renderContainer.appendChild(toolTipElement);
        this.toolTipElement = toolTipElement;
      }

      tooltipTimer = setTimeout(() => {
        let tooltipContent: any;
        if (isFunction(content)) {
          tooltipContent = content(cellInfo);
        } else {
          tooltipContent = content;
        }

        toolTipElement.innerHTML = tooltipContent;

        const layerStyle = toolTipElement.style;

        layerStyle.height = 'auto';
        layerStyle.display = 'block';
        layerStyle.width = 'auto';

        const openPosition = innerLayerPosition(renderContainer, currentElement, toolTipElement);

        layerStyle.top = `${openPosition.top}px`;
        layerStyle.left = `${openPosition.left}px`;
        layerStyle.height = `${openPosition.height}px`;
      }, delay);

      return false;
    });

    eventOn(helpElements, 'mouseleave', (e: UIEvent) => {
      clearTimeout(tooltipTimer);

      if (this.toolTipElement && this.toolTipElement.style) {
        this.toolTipElement.style.display = 'none';
      }

      return false;
    });
  }

  /**
   * init header sort event
   */
  initSortEvent() {
    const cfg = this.grid.config();
    const sortOrders = cfg.sort.orders;
    const dataManager = cfg.dataManager;
    const sortElements = this.headerElement.finds('.dg-sort-icon');

    const nullsLast = this.headerOpts.sort.nullsLast;
    let beforeSortOrderLength = 0;
    eventOff(sortElements, 'mousedown touchstart');
    eventOn(
      sortElements,
      'mousedown touchstart',
      (e: MouseEvent | TouchEvent) => {
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);

        const currentElement = e.currentTarget as HTMLElement;

        const sortCell = parseInt(
          currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0',
          10,
        );

        const sortField = cfg.currentFields[sortCell];

        const sortName = sortField.name;

        let sortItems;
        if (isShiftKey(e)) {
          sortItems = dataManager.getViewItems();
        } else {
          removeAttr(this.headerElement.finds('[data-dg-sort]'), 'data-dg-sort');

          if (sortOrders.length > 1 || !sortOrders.some((item: FieldSortInfo) => item.name === sortName)) {
            sortOrders.forEach((item: FieldSortInfo) => {
              (this.headerCellElements[item.sortCell].querySelector('.dg-sort-num') as HTMLElement).textContent = '';
            });
            sortOrders.length = 0;
            beforeSortOrderLength = 0;
          }
          sortItems = arrayCopy(dataManager.getViewItems());
        }

        const currentSortItem = sortOrders.find((item: FieldSortInfo) => item.name === sortName);

        if (currentSortItem) {
          if (currentSortItem.ascOrder) {
            addAttr(currentElement, { 'data-dg-sort': 'desc' });
            currentSortItem.ascOrder = !currentSortItem.ascOrder;
          } else {
            const index = sortOrders.findIndex((item: FieldSortInfo) => item.name === sortName);

            if (index !== -1) {
              sortOrders.splice(index, 1);
            }

            (currentElement.querySelector('.dg-sort-num') as HTMLElement).textContent = '';

            removeAttr(currentElement, 'data-dg-sort');
          }
        } else {
          addAttr(currentElement, { 'data-dg-sort': 'asc' });
          sortOrders.push({ name: sortName, ascOrder: true, sortCell: sortCell });
        }

        if (sortOrders.length > 0) {
          if (beforeSortOrderLength >= 1 && beforeSortOrderLength != sortOrders.length) {
            sortOrders.forEach((item: FieldSortInfo, index: number) => {
              (this.headerCellElements[item.sortCell].querySelector('.dg-sort-num') as HTMLElement).textContent =
                index + 1 + '';
            });
          }

          dataManager.setViewItems(multiSort(sortItems, sortOrders, nullsLast));
        } else {
          dataManager.setViewItems(cfg.dataManager.getViewItems());
        }

        beforeSortOrderLength = sortOrders.length;

        this.gridMain.selectionInfo.initSelection();
        this.gridMain.getBody().dataDraw('sort');
      },
      null,
      { passive: false },
    );
    //dg-sort-icon
  }

  /**
   * init  header selection event
   */
  private initHeaderSelectionEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const headerElement = this.headerElement;
    const leafAllFields = cfg.currentFields;

    const selectionMode = opts.selectionMode;

    let headDragTimer: any = -1;
    const headDragDelay = 150;
    const multipleFlag = isMultipleCellSelectionMode(selectionMode);

    const headerCellElements = this.headerCellElements;

    if (this.headerOpts.enableAllColumnSelection && !isRowSelectionMode(selectionMode)) {
      //header resize, dblclick or drag
      eventOff(headerCellElements, 'mousedown touchstart');
      eventOn(
        headerCellElements,
        'mousedown touchstart',
        (e: MouseEvent | TouchEvent) => {
          if (!isClickEvent(e)) {
            return;
          }

          const position = getElementRect(headerElement.getElement(), true);
          const mainRightWidth = cfg.dimensions.mainRightWidth;
          const _l = position.left + cfg.dimensions.mainLeftWidth,
            _r = position.left + cfg.dimensions.mainInsideWidth - mainRightWidth;

          const currentElement = e.currentTarget as HTMLElement;

          const colIdx = parseInt(currentElement.getAttribute('data-header-cell-position') ?? '0', 10);
          const field = leafAllFields[colIdx];
          if (field.$isAside) {
            return;
          }

          if (multipleFlag) {
            let beforeMoveRange = { endCol: -1 };
            // mouse darg scroll
            let scrollDirectionX: string | null = null;
            eventOn(document, 'touchmove mousemove', (moveEvt: Event) => {
              cfg.isHeaderDragging = true;

              const e1Position = eventPosition(moveEvt);

              const moveXInfo = dragHorizontalMovePosition(
                cfg,
                e1Position.x,
                position.left,
                _l,
                _r,
                beforeMoveRange.endCol,
              );
              scrollDirectionX = moveXInfo.scrollDirectionX;

              const moveRange: any = {};
              if (moveXInfo.overCell > 0) {
                moveRange.endCol = this.gridMain.selectionInfo.getSelectionModeColInfo(
                  selectionMode,
                  moveXInfo.overCell,
                  cfg,
                  currentElement,
                  cfg.selection.isMouseDown,
                ).endCol;

                if (beforeMoveRange.endCol == moveRange.endCol) return;

                this.gridMain.selectionInfo.setSelectionRangeInfo(
                  {
                    id: cfg.selection.id,
                    range: moveRange as SelectionRange,
                  } as Selection,
                  false,
                  scrollDirectionX == null,
                );

                beforeMoveRange = moveRange;
              }

              if (headDragTimer < 1) {
                const beforeMovePosition = { col: -1 };
                headDragTimer = setInterval(() => {
                  if (scrollDirectionX !== '') {
                    const isRight = scrollDirectionX === 'R';
                    const endCol = isRight ? cfg.scroll.insideEndCol + 1 : cfg.scroll.insideStartCol - 1;

                    if (beforeMovePosition.col != endCol) {
                      if ((isRight && cfg.fixedRightIndex == 0) || (!isRight && cfg.fixedLeftIndex == 0)) {
                        this.gridMain.selectionInfo.setSelectionRangeInfo(
                          {
                            range: { endCol: endCol } as SelectionRange,
                          } as Selection,
                          false,
                          false,
                        );
                      }

                      this.gridMain
                        .getScroll()
                        .moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });
                      beforeMovePosition.col = endCol;
                      this.gridMain.getBody().dataDraw('drageHeadScroll');
                    }
                  }
                }, headDragDelay);
              }
            });

            eventOn(document, 'touchend mouseup', () => {
              cfg.isHeaderDragging = false;
              eventOff(document, 'touchmove mousemove touchend mouseup');
              clearInterval(headDragTimer);
              headDragTimer = -1;
            });
          }

          let initFlag = cfg.selection.id == '';
          const range: any = {
            type: 'column',
            startIdx: 0,
            endIdx: cfg.dataInfo.lastRow,
            startCol: colIdx,
            endCol: colIdx,
          };
          if (isCtrlKey(e)) {
            range.modifierKey = 1;
          } else if (isShiftKey(e)) {
            range.modifierKey = 2;
            range.startCol = initFlag ? colIdx : cfg.selection.range.startCol;
            range.endCol = colIdx;
          } else {
            initFlag = true;
          }

          this.gridMain.selectionInfo.setSelectionRangeInfo(
            {
              range: range as SelectionRange,
              isSelect: true,
            } as Selection,
            initFlag,
            true,
          );
        },
        null,
        { passive: false },
      );

      eventOn(this.headerElement.getElement(), 'mouseup touchend', (e: UIEvent) => {
        cfg.selection.isMouseDown = false;
        cfg.isHeaderDragging = false;
      });
    }
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (opts.header.resize.enabled === false) return;

    const resizerElements = this.headerElement.finds('.dg-header-resizer');

    const resizeHandler = new ResizeHandler({ grid: this.grid, gridMain: this.gridMain, header: this.header }, this);

    let session: PointerSession;
    const editable = opts.editable;

    const clickManager = new ClickManager();

    const DRAG_THRESHOLD = 5; // px

    eventOn(resizerElements, 'mousedown.resizerclick touchstart.resizerclick', (e: UIEvent) => {
      if ((e as MouseEvent).button !== 0) {
        return true;
      }

      stopPreventCancel(e);

      this.gridMain.hideLayer();

      const targetElement = e.currentTarget as HTMLElement;

      const startEvtPosition = eventPosition(e);
      const startCellInfo = getHeaderResizeCellInfo(cfg, targetElement);
      startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

      session = {
        state: 'PRESSED',
        event: e,
        startPos: startEvtPosition,
        currentPos: startEvtPosition,
        cellInfo: startCellInfo,
        startTime: Date.now(),
        lastClickTime: 0,
        cellEl: targetElement,
        clickManager: clickManager,
        handler: resizeHandler,
      };

      const handler = session.handler!;

      handler.onPointerDown?.(session);

      if (handler.onPointerMove) {
        let isStarted = false;
        eventOn(document, 'touchmove.cellclick mousemove.cellclick', (moveEvt: Event) => {
          session.currentPos = eventPosition(moveEvt);

          if (!isStarted) {
            if (!isMouseMoved(session.startPos, session.currentPos, DRAG_THRESHOLD)) {
              return;
            }

            isStarted = true;
            cfg.isBodyDragging = true;
            if (handler.onActivate?.(session) === false) {
              eventOff(document, 'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick');
              return;
            }
          }

          session.state = POINTER_STATE.DRAGGING;

          handler.onPointerMove?.(session);
        });

        eventOn(document, 'touchend.cellclick mouseup.cellclick', (moveEvt: Event) => {
          eventOff(document, 'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick');
          session.state = POINTER_STATE.IDLE;
          session.currentPos = eventPosition(moveEvt);
          handler.onPointerUp?.(session);
          cfg.isBodyDragging = false;
        });
      }

      clickManager.processClick(session, handler);
    });

    eventOn(resizerElements, 'mouseup.resizerclick touchend.resizerclick', (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
    });
  }

  /**
   * header column resize
   *
   * @public
   * @param {number} resizeIdx resize index
   * @param {number} resizeWidth resize width
   */
  public headerColumnResize(resizeIdx: number, resizeWidth: number) {
    const cfg = this.grid.config();

    const currentFireld = cfg.currentFields[resizeIdx];

    const w = currentFireld.$width + resizeWidth;

    this.header.setColumnWidth(resizeIdx, w);
    if (isFunction(this.headerOpts.resize.update)) {
      this.headerOpts.resize.update.call(null, { index: this.drag.resizeIdx, width: w });
    }
  }

  /**
   * header all check
   *
   */
  private initHeaderCheckbox() {
    const dgRowAllCheckElement = this.headerElement.getElement().querySelector('[name="dgRowAllCheck"]');

    eventOn(
      dgRowAllCheckElement,
      'click',
      (e: UIEvent) => {
        const eventElement = e.target as HTMLInputElement;

        this.header.setAllCheckItem(eventElement.checked, eventElement);
      },
      { passive: false },
    );
  }

  getHeaderHelpCellInfo(cfg: Config, currentElement: HTMLElement) {
    let cell;
    let field;
    const groupCellElement = currentElement.closest('.dg-header-group-cell');
    if (groupCellElement) {
      const groupPosition = groupCellElement.getAttribute('data-header-group-position')?.split(',');

      if (groupPosition && groupPosition.length > 0) {
        const row = parseInt(groupPosition[0], 10);
        const idx = parseInt(groupPosition[1], 10);

        let fieldGroups;
        if (groupCellElement.closest('.dg-left')) {
          fieldGroups = cfg.fieldHeaderGroup.left;
        } else if (groupCellElement.closest('.dg-right')) {
          fieldGroups = cfg.fieldHeaderGroup.right;
        } else {
          fieldGroups = cfg.fieldHeaderGroup.center;
        }
        field = fieldGroups[row][idx];
        cell = idx;
      }
    } else {
      cell = parseInt(currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0', 10);
      field = cfg.currentFields[cell];
    }

    return { c: cell, field: field };
  }
}
