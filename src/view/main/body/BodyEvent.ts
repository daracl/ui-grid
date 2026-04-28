import { getCellInfo, isInputField, isMouseMoved } from '@/util/gridUtils';

import { MOUSE_MOVE_THRESHOLD, POINTER_STATE } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { ClickManager } from '@/event/ClickManager';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { SelectionInfo } from '@/selection/selection';
import { hasClass } from '@/util/domUtils';
import { eventPosition, initPointerSession } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { Body } from './Body';
import { CellClickHandler } from './CellClickHandler';
import { KeydownEvent } from './KeydownEvent ';
import { PasteEvent } from './PasteEventHandler';
import { RowMoveHandler } from './RowMoveHandler';

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
    this.initPointerEvent();

    if (this.gridMain.options().editable !== false) {
      new PasteEvent(this.gridMain, this.selectionInfo).init();
    }

    if (this.gridMain.options().body.disableKeydown !== true) {
      new KeydownEvent(this.gridMain, this.body, this.selectionInfo).init();
    }
  }

  initPointerEvent() {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    const bodyElement = this.bodyElement.getElement();

    const eventManager = cfg.eventManager;

    let session: PointerSession;
    const editable = opts.editable;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventManager.on(
      { el: bodyElement, selector: '.dg-cell', type: 'mousedown.cellclick touchstart.cellclick' },
      (e: UIEvent) => {
        if ((e as MouseEvent).button !== 0) {
          return true;
        }

        const eventElement = e.target as HTMLElement;

        if (eventElement.closest('a')) return;

        if (isInputField(eventElement.tagName)) {
          return true;
        }

        const cellElement = eventElement.closest('.dg-cell') as HTMLElement;

        if (cellElement == null || hasClass(cellElement, '$row-check $modify-info')) {
          this.gridMain.hideLayer();
          return;
        }

        const startCellInfo = getCellInfo(cfg, cellElement);
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
                eventManager.off(
                  document,
                  'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick',
                );
                return;
              }
            }

            session.state = POINTER_STATE.DRAGGING;

            handler.onPointerMove?.(session);
          });

          eventManager.on({ el: document, type: 'touchend.cellclick mouseup.cellclick' }, (moveEvt: Event) => {
            eventManager.off(document, 'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick');
            session.state = POINTER_STATE.IDLE;
            session.currentPos = eventPosition(moveEvt);
            handler.onPointerUp?.(session);
            cfg.isBodyDragging = false;
          });
        }

        if (editable === true) {
          if (clickManager.getClickCount() == 0) {
            cfg.edit.enable = false;
          }
        }

        clickManager.processClick(session, handler);
      },
    );

    eventManager.on({ el: bodyElement, type: 'mouseup.cellclick touchend.cellclick' }, (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
    });
  }
}
