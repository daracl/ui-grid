import { CellInfo, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";

import { dragVerticalMovePosition, getCellInfo, isFixedLeftPostion, isFixedRightPostion, isInputField, createNewItems, isRowSelection, moveItem } from "../../../util/gridUtils";
import { DaraGrid } from "@/DaraGrid";
import * as utils from "@/util/utils";

import { GridMain } from "../../GridMain";
import { DaraElement } from "@/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, isSpacebar, stopPreventCancel } from "@/util/eventUtils";
import { SelectionInfo } from "@/selection/selection";
import { getElementRect, hasClass } from "@/util/domUtils";
import { Body } from "./Body";
import { HIDDEN_ELEMENT_SELECTOR, ROW_CHECK_NAME, POINTER_STATE } from "@/constants";
import { PointerHandler } from "@/event/PointerHandler";
import { CellClickHandler } from "./CellClickHandler";
import { PointerSession } from "@/event/PointerSession";
import { ClickManager } from "@/event/ClickManager";
import { RowMoveHandler } from "./RowMoveHandler";
import { PasteEvent } from "./PasteEventHandler";
import { KeydownEvent } from "./KeydownEvent ";

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

  private readonly handlers: PointerHandler[];

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

    let clickManager = new ClickManager();

    eventOn(
      bodyElement,
      "mousedown.cellclick touchstart.cellclick",
      (e: UIEvent) => {
        if ((e as MouseEvent).button !== 0) {
          return true;
        }
        const eventElement = e.target as HTMLElement;
        if (isInputField(eventElement.tagName)) {
          return true;
        }

        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;

        if (cellElement == null || hasClass(cellElement, "$row-check $modify-info")) {
          this.gridMain.hideLayer();
          return;
        }

        const startEvtPosition = eventPosition(e);
        const startCellInfo = getCellInfo(cfg, cellElement);
        startCellInfo.c = Math.max(startCellInfo.c, cfg.dataInfo.startCol);

        session = {
          state: "PRESSED",
          event: e,
          startPos: startEvtPosition,
          currentPos: startEvtPosition,
          cellInfo: startCellInfo,
          startTime: Date.now(),
          lastClickTime: 0,
          cellEl: cellElement,
          clickCount: 1,
        };

        //clickManager.conserveClick(session.startPos);

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

        handler.onPointerDown?.(session);

        if (handler.onPointerMove) {
          let isMoveStarted = false;
          eventOn(document, "touchmove.cellclick mousemove.cellclick", (moveEvt: Event) => {
            if (!isMoveStarted) {
              cfg.isBodyDragging = true;
              isMoveStarted = true;
              if (handler.onActivate?.(session) === false) {
                eventOff(document, "touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick");
                return;
              }
            }

            session.state = POINTER_STATE.DRAGGING;
            session.currentPos = eventPosition(moveEvt);
            handler.onPointerMove?.(session);
          });

          eventOn(document, "touchend.cellclick mouseup.cellclick", (moveEvt: Event) => {
            eventOff(document, "touchmove.cellclick mousemove.cellclick touchend.cellclick mouseup.cellclick");
            cfg.isBodyDragging = false;
            session.state = POINTER_STATE.IDLE;
            session.currentPos = eventPosition(moveEvt);
            handler.onPointerUp?.(session);
          });
        }

        if (editable === true) {
          if (clickManager.getClickCount() == 0) {
            cfg.edit.enable = false;
          }
        }

        clickManager.processClick(session, handler);

        if (startCellInfo.field.$isAside) {
          return;
        }
      },
      ".dg-cell",
      { passive: false }
    );

    eventOn(bodyElement, "mouseup.cellclick touchend.cellclick", (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
    });
  }
}
