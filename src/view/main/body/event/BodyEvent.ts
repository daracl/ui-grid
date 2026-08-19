import { getCellInfo, isInputField, isMouseMoved } from '@/util/gridUtils';

import {
  LINE_NUMBER_NAME,
  MOUSE_MOVE_THRESHOLD,
  PointerStateMap,
  ROW_DRAG_HANDLE_NAME,
  ScrollDirectionXMap,
  ScrollDirectionYMap,
  SelectionModeMap,
} from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { ClickManager } from '@/event/ClickManager';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { SelectionInfo } from '@/selection/selection';
import { eventPosition, initPointerSession, isPrimaryPointer, stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { Body } from '../Body';
import { CellClickHandler } from './CellClickHandler';
import { KeydownEvent } from './KeydownEvent ';
import { PasteEvent } from './PasteEventHandler';
import { RowMoveHandler } from './RowMoveHandler';
import { addClass } from '@/util/styleUtils';
import { removeClass } from '../../../../util/styleUtils';

/**
 * Body event class
 *
 * @class BodyEvent
 * @typedef {BodyEvent}
 */
export class BodyEvent {
  private readonly gridMain: GridMain;
  private readonly body: Body;
  private readonly selectionInfo: SelectionInfo;

  private readonly bodyElement: DaraElement;

  private readonly handlers: BasePointerHandler[];

  constructor(gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;

    this.bodyElement = body.getBodyElement();

    this.handlers = [];

    const rowMoveOptions = gridMain.options().body.rowMove;

    if (rowMoveOptions?.enabled === true) {
      this.handlers.push(new RowMoveHandler({ gridMain, body }, this));
    }
    this.handlers.push(new CellClickHandler({ gridMain, body }, this));
  }

  init() {
    this.initMouseOver();
    this.initPointerEvent();
    this.initMobileTouch();

    const opts = this.gridMain.options();

    if (this.gridMain.config().enableCellEdit === true) {
      new PasteEvent(this.gridMain, this.selectionInfo).init();
    }

    if (opts.body.disableKeydown !== true && opts.selectionMode !== SelectionModeMap.none) {
      new KeydownEvent(this.gridMain, this.body, this.selectionInfo).init();
    }
  }

  /**
   * init mobile touch event
   */
  initMobileTouch() {
    const cfg = this.gridMain.config();
    const { scroll, rowHeight, dataInfo, eventManager } = cfg;
    const opts = this.gridMain.options();
    const scrollInfo = this.gridMain.getScroll();

    const bodyElement = this.gridMain.getMainElement().getElement().querySelector('.dg-body') as HTMLElement;
    let animationId: number;
    let lastX: number;
    let lastY: number;

    eventManager.off(bodyElement, 'touchstart');
    eventManager.on(
      { el: bodyElement, type: 'touchstart' },
      (evt: TouchEvent) => {
        lastX = evt.touches[0].clientX;
        lastY = evt.touches[0].clientY;
      },
      { passive: true },
    );

    eventManager.off(bodyElement, 'touchmove touchend touchcancel');
    eventManager.on(
      { el: bodyElement, type: 'touchmove' },
      (evt: TouchEvent) => {
        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;

        const dx = lastX - x;
        const dy = lastY - y;

        if (cfg.isMoveRow) {
          return;
        }

        // ✔ 더 크게 움직인 방향만 선택
        if (scroll.enableHorizontal && Math.abs(dx) > Math.abs(dy)) {
          const upFlag = dx > 0;
          cancelAnimationFrame(animationId);
          if ((upFlag && scroll.left != 0) || (!upFlag && scroll.left != scroll.hTrackWidth - scroll.hThumbWidth)) {
            stopPreventCancel(evt);
          } else {
            animationId = 0;
            return;
          }
          animationId = requestAnimationFrame(() => {
            scrollInfo.moveHorizontalScroll({
              direction: upFlag ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT,
              speed: opts.scroll.horizontal.speed,
            });
          });
        } else if (scroll.enableVertical) {
          const startIdx = scroll.startIdx;
          const upFlag = dy < 0;
          cancelAnimationFrame(animationId);

          if ((upFlag && startIdx !== 0) || (!upFlag && startIdx + scroll.insideViewRow < dataInfo.rowLength)) {
            if (evt.cancelable) {
              stopPreventCancel(evt);
            }
          } else {
            animationId = 0;
            return;
          }

          animationId = requestAnimationFrame(() => {
            const speed = Math.abs(dy) / rowHeight;
            const pageCount = Math.ceil(dataInfo.rowLength / scroll.viewRow);
            scrollInfo.moveVerticalScroll({
              direction: upFlag ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN,
              speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed,
            });
          });
        }

        lastX = x;
        lastY = y;
      },
      { passive: false },
    );

    eventManager.on({ el: bodyElement, type: 'touchend touchcancel' }, () => {
      cancelAnimationFrame(animationId);
      animationId = 0;
    });
  }

  private initMouseOver() {
    if (this.gridMain.options().hoverMode !== 'row') {
      return;
    }

    const cfg = this.gridMain.config();
    const bodyElement = this.bodyElement.getElement();

    const eventManager = cfg.eventManager;

    const hoverClassName = 'dg-row-hover';

    eventManager.on(
      { el: bodyElement, selector: '.dg-row', type: 'mouseover.cell' },
      (e: UIEvent, rowElement: HTMLElement) => {
        const rowIdx = rowElement.dataset.row;

        addClass(bodyElement.querySelectorAll(`.dg-row[data-row="${rowIdx}"]`), hoverClassName);
      },
    );

    eventManager.on(
      { el: bodyElement, selector: '.dg-row', type: 'mouseout.cell' },
      (e: UIEvent, rowElement: HTMLElement) => {
        if (!rowElement) return;

        const rowIdx = rowElement.dataset.row;

        removeClass(bodyElement.querySelectorAll(`.dg-row[data-row="${rowIdx}"]`), hoverClassName);
      },
    );
  }

  /**
   * init pointer event
   * cell click , cell drag, row move event
   */
  private initPointerEvent() {
    const cfg = this.gridMain.config();
    const bodyElement = this.bodyElement.getElement();

    const eventManager = cfg.eventManager;

    let session: PointerSession;
    const editable = cfg.enableCellEdit;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    const cleanupDragEvents = () => {
      eventManager.off(
        document,
        'touchmove.cellclick mousemove.cellclick touchend.cellclick touchcancel.cellclick mouseup.cellclick',
      );

      cfg.isBodyDragging = false;
      cfg.isMoveRow = false;
    };

    eventManager.on(
      { el: bodyElement, selector: '.dg-cell', type: 'mousedown.cellclick touchstart.cellclick' },
      (e: UIEvent) => {
        if (!isPrimaryPointer(e)) {
          return true;
        }

        const eventElement = e.target as HTMLElement;

        if (eventElement.closest('a')) return;

        if (isInputField(eventElement.tagName)) {
          return true;
        }

        const cellElement = eventElement.closest('.dg-cell') as HTMLElement;

        if (cellElement == null) {
          this.gridMain.hideLayer();
          return;
        }

        const startCellInfo = getCellInfo(cfg, cellElement);
        if (
          startCellInfo.field.$isAside &&
          startCellInfo.field.name !== LINE_NUMBER_NAME &&
          startCellInfo.field.name !== ROW_DRAG_HANDLE_NAME
        ) {
          this.gridMain.hideLayer();
          return;
        }

        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

        session = initPointerSession(e, startCellInfo, clickManager, cellElement);

        let handlerPriority = -1;
        for (const handler of this.handlers) {
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

        if (handler instanceof RowMoveHandler) {
          e.preventDefault();
          cfg.isMoveRow = true;
        }

        handler.onPointerDown?.(session);

        if (handler.onPointerMove) {
          let isStarted = false;

          eventManager.on({ el: document, type: 'touchmove.cellclick mousemove.cellclick' }, (moveEvt: Event) => {
            session.currentPos = eventPosition(moveEvt);

            if (!isStarted) {
              if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
                return;
              }

              isStarted = true;
              cfg.isBodyDragging = true;

              if (handler.onActivate?.(session) === false) {
                cleanupDragEvents();
                return;
              }
            }

            session.state = PointerStateMap.DRAGGING;

            handler.onPointerMove?.(session);
          });

          eventManager.on(
            { el: document, type: 'touchend.cellclick touchcancel.cellclick mouseup.cellclick' },
            (moveEvt: Event) => {
              cleanupDragEvents();
              session.state = PointerStateMap.IDLE;
              session.currentPos = eventPosition(moveEvt);
              handler.onPointerUp?.(session);
              cfg.isBodyDragging = false;
              cfg.isMoveRow = false;
            },
          );
        }

        if (editable === true) {
          if (clickManager.getClickCount() == 0) {
            cfg.edit.enable = false;
          }
        }

        clickManager.processClick(session, handler);
      },
      { passive: false },
    );

    eventManager.on({ el: bodyElement, type: 'mouseup.cellclick touchend.cellclick' }, (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      cfg.isBodyDragging = false;
      cfg.isMoveRow = false;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
    });
  }

  public destroy() {
    //
  }
}
