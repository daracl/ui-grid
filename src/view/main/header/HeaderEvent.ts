import { HeaderOptions } from '@t/GridOptions';

import { MOUSE_MOVE_THRESHOLD, POINTER_STATE } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { ClickManager } from '@/event/ClickManager';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { Config } from '@/types/GridConfig';
import { eventPosition, initPointerSession, isPrimaryPointer, stopPreventCancel } from '@/util/eventUtils';
import {
  getHeaderCellInfo,
  getHeaderResizeCellInfo,
  isMouseMoved,
  isRowSelectionMode,
  isSingleSelectionMode,
} from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { Header } from './Header';
import { HeaderCellClickHandler } from './HeaderCellClickHandler';
import { HelpButtonEvent } from './HelpButtonEvent ';
import { ResizeHandler } from './ResizeHandler';
import { SortButtonEvent } from './SortButtonEvent';

/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export class HeaderEvent {
  private readonly gridMain: GridMain;

  private readonly cfg: Config;

  private readonly header: Header;

  private readonly headerOpts: HeaderOptions;

  private readonly headerElement: DaraElement;

  private readonly headerCellElements: HTMLElement[];

  constructor(gridMain: GridMain, header: Header) {
    this.cfg = gridMain.config();
    this.gridMain = gridMain;
    this.header = header;
    this.headerElement = this.header.getHeaderElement();
    this.headerCellElements = this.header.getHeaderCellElements();

    this.headerOpts = gridMain.options().header;
  }

  init() {
    if (this.gridMain.options().search.enabled === true) {
      this.initSearchButton();
    }

    if (this.gridMain.config().enableHeaderHelpButton) {
      new HelpButtonEvent(this.gridMain, this.header).init();
    }

    if (this.gridMain.config().enableSortButton) {
      new SortButtonEvent(this.gridMain, this.header).init();
    }

    this.initPointerEvent();

    this.initResizeEvent();
    this.initHeaderCheckbox();
  }

  /**
   * 검색 버튼
   */
  initSearchButton() {
    const searchIconElement = this.headerElement.find('.dg-search-icon');
    const eventManager = this.cfg.eventManager;
    // 검색 처리 추가 할것.
    eventManager.off(searchIconElement, 'click');
    eventManager.on({ el: searchIconElement, type: 'click' }, (e: UIEvent) => {
      stopPreventCancel(e);

      this.gridMain.getDataSearch().openSearch();
      return false;
    });
  }

  /**
   * init header selection event
   */
  private initPointerEvent() {
    const selectionMode = this.gridMain.options().selectionMode;

    const allHandlers: BasePointerHandler[] = [];

    if (this.headerOpts.enableAllColumnSelection && !isSingleSelectionMode(selectionMode)) {
      allHandlers.push(new HeaderCellClickHandler({ gridMain: this.gridMain, header: this.header }, this));
    }

    if (allHandlers.length < 1) return;

    const cfg = this.cfg;
    const eventManager = cfg.eventManager;

    const headerCellElements = this.headerCellElements;
    let session: PointerSession;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventManager.off(headerCellElements, 'mousedown.header.selection touchstart.header.selection');
    eventManager.on(
      { el: headerCellElements, type: 'mousedown.header.selection touchstart.header.selection' },
      (e: UIEvent) => {
        if (!isPrimaryPointer(e)) {
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

          eventManager.on(
            { el: document, type: 'touchmove.header.selection mousemove.header.selection' },
            (moveEvt: Event) => {
              session.currentPos = eventPosition(moveEvt);

              if (!isStarted) {
                if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
                  return;
                }

                isStarted = true;

                if (handler.onActivate?.(session) === false) {
                  eventManager.off(
                    document,
                    'touchmove.header.selection mousemove.header.selection touchend.header.selection mouseup.header.selection',
                  );
                  return;
                }
              }

              session.state = POINTER_STATE.DRAGGING;

              handler.onPointerMove?.(session);
            },
          );

          eventManager.on(
            { el: document, type: 'touchend.header.selection mouseup.header.selection' },
            (moveEvt: Event) => {
              eventManager.off(
                document,
                'touchmove.header.selection mousemove.header.selection touchend.header.selection mouseup.header.selection',
              );

              session.state = POINTER_STATE.IDLE;
              session.currentPos = eventPosition(moveEvt);
              handler.onPointerUp?.(session);
            },
          );
        }

        clickManager.processClick(session, handler);
      },
      { passive: true },
    );
  }

  /**
   * resize event
   *
   * @private
   */
  private initResizeEvent() {
    const opts = this.gridMain.options();

    if (opts.header.resize.enabled === false) return;

    const cfg = this.cfg;
    const eventManager = cfg.eventManager;
    const resizerElements = this.headerElement.finds('.dg-header-resizer');

    const resizeHandler = new ResizeHandler({ gridMain: this.gridMain, header: this.header }, this);

    let session: PointerSession;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventManager.off(resizerElements, 'mousedown.resizerclick touchstart.resizerclick');
    eventManager.on(
      { el: resizerElements, type: 'mousedown.resizerclick touchstart.resizerclick' },
      (e: UIEvent) => {
        if (!isPrimaryPointer(e)) {
          return true;
        }

        if (e.cancelable) {
          stopPreventCancel(e);
        }

        this.gridMain.hideLayer();

        const targetElement = e.currentTarget as HTMLElement;

        const startCellInfo = getHeaderResizeCellInfo(cfg, targetElement);
        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

        session = initPointerSession(e, startCellInfo, clickManager);
        session.handler = resizeHandler;

        resizeHandler.onPointerDown?.(session);

        if (resizeHandler.onPointerMove) {
          let isStarted = false;

          eventManager.on({ el: document, type: 'touchmove.resizerclick mousemove.resizerclick' }, (moveEvt: Event) => {
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

          eventManager.on({ el: document, type: 'touchend.resizerclick mouseup.resizerclick' }, (moveEvt: Event) => {
            eventManager.off(
              document,
              'touchmove.resizerclick mousemove.resizerclick touchend.resizerclick mouseup.resizerclick',
            );

            session.state = POINTER_STATE.IDLE;
            session.currentPos = eventPosition(moveEvt);
            resizeHandler.onPointerUp?.(session);
          });
        }

        clickManager.processClick(session, resizeHandler);
      },
      { passive: false },
    );
  }

  /**
   * header all check
   *
   */
  private initHeaderCheckbox() {
    const dgRowAllCheckElement = this.headerElement.getElement().querySelector('[name="dgRowAllCheck"]');

    this.cfg.eventManager.on({ el: dgRowAllCheckElement, type: 'click' }, (e: UIEvent) => {
      const eventElement = e.target as HTMLInputElement;
      this.header.setAllCheckItem(eventElement.checked, eventElement);
    });
  }
}
