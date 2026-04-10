import { getCellInfo, isInputField, isMouseMoved } from '../../../util/gridUtils';
import { DaraGrid } from '@/DaraGrid';

import { GridMain } from '../../GridMain';
import { DaraElement } from '@/element/DaraElement';
import { eventOff, eventOn, eventPosition, initPointerSession } from '@/util/eventUtils';
import { SelectionInfo } from '@/selection/selection';
import { hasClass } from '@/util/domUtils';
import { Body } from './Body';
import { MOUSE_MOVE_THRESHOLD, POINTER_STATE } from '@/constants';
import { BasePointerHandler } from '@/event/PointerHandler';
import { CellClickHandler } from './CellClickHandler';
import { PointerSession } from '@/event/PointerSession';
import { ClickManager } from '@/event/ClickManager';
import { RowMoveHandler } from './RowMoveHandler';
import { PasteEvent } from './PasteEventHandler';
import { KeydownEvent } from './KeydownEvent ';

/**
 * Body event class
 *
 * @class BodyEvent
 * @typedef {BodyEvent}
 */
export class BodyEvent {
  private readonly grid: DaraGrid;
  private readonly gridMain: GridMain;
  private readonly body: Body;
  private readonly selectionInfo: SelectionInfo;

  private readonly bodyElement: DaraElement;

  private readonly handlers: BasePointerHandler[];

  constructor(grid: DaraGrid, gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;

    this.bodyElement = body.getBodyElement();

    this.handlers = [];

    const rowMoveOptions = grid.getOptions().body.rowMove;

    if (rowMoveOptions?.enabled === true) {
      this.handlers.push(new RowMoveHandler({ grid, gridMain, body }, this));
    }
    this.handlers.push(new CellClickHandler({ grid, gridMain, body }, this));
  }

  init() {
    this.initPointerEvent();

    if (this.grid.getOptions().editable !== false) {
      new PasteEvent(this.grid, this.gridMain, this.selectionInfo).init();
    }

    if (this.grid.getOptions().body.disableKeydown !== true) {
      new KeydownEvent(this.grid, this.gridMain, this.body, this.selectionInfo).init();
    }
  }

  initPointerEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const bodyElement = this.bodyElement.getElement();

    let session: PointerSession;
    const editable = opts.editable;

    const clickManager = new ClickManager();

    const dragThreshold = MOUSE_MOVE_THRESHOLD; // px

    eventOn(
      { el: bodyElement, selector: '.dg-cell', type: 'mousedown.cellclick touchstart.cellclick' },
      (e: UIEvent) => {
        if ((e as MouseEvent).button !== 0) {
          return true;
        }
        const eventElement = e.target as HTMLElement;
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

        session = initPointerSession(e, startCellInfo, clickManager);

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

          eventOn({ el: document, type: 'touchmove.cellclick mousemove.cellclick' }, (moveEvt: Event) => {
            session.currentPos = eventPosition(moveEvt);

            if (!isStarted) {
              if (!isMouseMoved(session.startPos, session.currentPos, dragThreshold)) {
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

          eventOn({ el: document, type: 'touchend.cellclick mouseup.cellclick' }, (moveEvt: Event) => {
            eventOff(document, 'touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick');
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

    eventOn({ el: bodyElement, type: 'mouseup.cellclick touchend.cellclick' }, (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
    });
  }
}
