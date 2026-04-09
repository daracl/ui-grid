import { Config } from '@t/GridConfig';
import { HeaderOptions } from '@t/GridOptions';

import { MOUSE_MOVE_THRESHOLD, POINTER_STATE } from '@/constants';
import { DaraGrid } from '@/DaraGrid';
import { DaraElement } from '@/element/DaraElement';
import { ClickManager } from '@/event/ClickManager';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { FieldSortInfo } from '@/types/Header';
import { addAttr, removeAttr } from '@/util/domUtils';
import {
  eventOff,
  eventOn,
  eventPosition,
  initPointerSession,
  isClickEvent,
  isShiftKey,
  stopPreventCancel,
} from '@/util/eventUtils';
import { getHeaderCellInfo, getHeaderResizeCellInfo, isMouseMoved, isRowSelectionMode } from '@/util/gridUtils';
import { arrayCopy, intValue, multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Header } from './Header';
import { HeaderCellClickHandler } from './HeaderCellClickHandler';
import { HelpButtonEvent } from './HelpButtonEvent ';
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

  constructor(grid: DaraGrid, gridMain: GridMain, header: Header) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.header = header;
    this.headerElement = this.header.getHeaderElement();
    this.headerCellElements = this.header.getHeaderCellElements();

    this.headerOpts = grid.getOptions().header;
  }

  init() {
    this.initSearchButton();

    if (this.grid.config().enableHeaderHelpButton) {
      new HelpButtonEvent(this.grid, this.gridMain, this.header).init();
    }

    // sort 이벤트 처리할것.
    //
    //
    //
    //

    this.initPointerEvent();
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

        const sortCell = intValue(
          currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0',
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
   * init header selection event
   */
  private initPointerEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const selectionMode = opts.selectionMode;

    const allHandlers: BasePointerHandler[] = [];

    if (this.headerOpts.enableAllColumnSelection && !isRowSelectionMode(selectionMode)) {
      allHandlers.push(
        new HeaderCellClickHandler({ grid: this.grid, gridMain: this.gridMain, header: this.header }, this),
      );
    }

    if (allHandlers.length < 1) return;

    const headerCellElements = this.headerCellElements;
    let session: PointerSession;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventOff(headerCellElements, 'mousedown.header.selection touchstart.header.selection');
    eventOn(headerCellElements, 'mousedown.header.selection touchstart.header.selection', (e: UIEvent) => {
      if ((e as MouseEvent).button !== 0) {
        return true;
      }

      this.gridMain.hideLayer();

      const targetElement = e.currentTarget as HTMLElement;

      const startCellInfo = getHeaderCellInfo(cfg, targetElement);
      startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

      session = initPointerSession(e, startCellInfo, clickManager);

      let handlerPriority = -1;
      for (const handler of allHandlers) {
        if (handler.canHandle(session)) {
          if (handlerPriority > handler.priority) {
            continue;
          }
          handlerPriority = handler.priority;
          session.handler = handler;
        }
      }

      const handler = session.handler!;

      if (!handler) return;

      if (handler.onPointerMove) {
        let isStarted = false;
        eventOn(document, 'touchmove.header.selection mousemove.header.selection', (moveEvt: Event) => {
          session.currentPos = eventPosition(moveEvt);

          if (!isStarted) {
            if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
              return;
            }

            isStarted = true;

            if (handler.onActivate?.(session) === false) {
              eventOff(
                document,
                'touchmove.header.selection mousemove.header.selection touchend.header.selection mouseup.header.selection',
              );
              return;
            }
          }

          session.state = POINTER_STATE.DRAGGING;

          handler.onPointerMove?.(session);
        });

        eventOn(document, 'touchend.header.selection mouseup.header.selection', (moveEvt: Event) => {
          eventOff(
            document,
            'touchmove.header.selection mousemove.header.selection touchend.header.selection mouseup.header.selection',
          );

          session.state = POINTER_STATE.IDLE;
          session.currentPos = eventPosition(moveEvt);
          handler.onPointerUp?.(session);
        });
      }

      clickManager.processClick(session, handler);
    });
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

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventOff(resizerElements, 'mousedown.resizerclick touchstart.resizerclick');
    eventOn(resizerElements, 'mousedown.resizerclick touchstart.resizerclick', (e: UIEvent) => {
      if ((e as MouseEvent).button !== 0) {
        return true;
      }

      stopPreventCancel(e);

      this.gridMain.hideLayer();

      const targetElement = e.currentTarget as HTMLElement;

      const startCellInfo = getHeaderResizeCellInfo(cfg, targetElement);
      startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

      session = initPointerSession(e, startCellInfo, clickManager);
      session.handler = resizeHandler;

      resizeHandler.onPointerDown?.(session);

      if (resizeHandler.onPointerMove) {
        let isStarted = false;
        eventOn(document, 'touchmove.cellclick mousemove.cellclick', (moveEvt: Event) => {
          session.currentPos = eventPosition(moveEvt);

          if (!isStarted) {
            if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
              return;
            }

            isStarted = true;

            resizeHandler.onActivate?.(session);
          }

          session.state = POINTER_STATE.DRAGGING;

          resizeHandler.onPointerMove?.(session);
        });

        eventOn(document, 'touchend.cellclick mouseup.cellclick', (moveEvt: Event) => {
          eventOff(document, 'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick');

          session.state = POINTER_STATE.IDLE;
          session.currentPos = eventPosition(moveEvt);
          resizeHandler.onPointerUp?.(session);
        });
      }

      clickManager.processClick(session, resizeHandler);
    });
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
        const row = intValue(groupPosition[0]);
        const idx = intValue(groupPosition[1]);

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
      cell = intValue(currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0');
      field = cfg.currentFields[cell];
    }

    return { c: cell, field: field };
  }
}
