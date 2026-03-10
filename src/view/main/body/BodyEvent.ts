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

/**
 * Body event class
 *
 * @class BodyEvent
 * @typedef {BodyEvent}
 */
export class BodyEvent {
  private readonly grid: DaraGrid;
  private readonly body: Body;
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private readonly bodyElement: DaraElement;
  private readonly pasteElement: DaraElement;

  private readonly allCellElements: any;

  private handlers: PointerHandler[];

  constructor(grid: DaraGrid, gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;

    this.bodyElement = this.body.getBodyElement();
    this.allCellElements = this.body.getBodyCellElements();
    this.pasteElement = new DaraElement(this.grid.element().find(".dg-paste-area"));

    this.handlers = [];

    const rowMoveOptions = grid.getOptions().body.rowMove;

    if (rowMoveOptions?.enabled === true) {
      this.handlers.push(new RowMoveHandler({ grid, gridMain }, this));
    }
    this.handlers.push(new CellClickHandler({ grid, gridMain }, this));

    this.initEvent();
  }

  public initEvent() {
    this.initKeydownEvent();

    this.initBodyPointerEvent();

    this.initPasteEvent();
  }

  initBodyPointerEvent() {
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

        console.log("startEvtPosition : ", startEvtPosition, "startCellInfo : ", startCellInfo);

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

        console.log("pointer handler : ", handlerPriority, this.handlers, handler);

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

  /**
   * row check item click event trigger
   *
   * @public
   * @param {CellInfo} cellInfo
   */
  public setRowCheckItemClick(cellInfo: CellInfo) {
    const cfg = this.grid.config();
    const rowCheckCol = cfg.allFieldMap.get(ROW_CHECK_NAME)?.$colSeq;
    if (!utils.isEmpty(rowCheckCol)) {
      (this.bodyElement.getElement().querySelector(`[data-cell-position="${cellInfo.r},${rowCheckCol}"] [name="dgRowCheck"]`) as HTMLElement).click();
    }
  }

  /**
   * init paste event
   *
   * @private
   */
  private initPasteEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = utils.isFunction(pasteBeforeFn);

    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = utils.isFunction(pasteAfterFn);

    const pasteElement = this.pasteElement.getElement();

    eventOn(pasteElement, "paste", (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData; // ClipboardEvent에서 clipboardData 가져오기

      if (!clipboardData) {
        throw new Error("paste clipboard not found");
      }

      let pastedText = clipboardData.getData("text");

      if (pasteBeforeFnFlag) {
        pastedText = pasteBeforeFn(pastedText);
      }

      if (pastedText != "") {
        const contentArr = pastedText.split(/\r\n|\r|\n/);

        const startCellInfo = cfg.selection.startCell;

        const { currentFields, items } = cfg;

        const startIdx = startCellInfo.startIdx,
          startCol = startCellInfo.startCol,
          headerItemsLength = currentFields.length;

        let itemLength = items.length;

        //console.log("llllll : ", contentArr.length, startCellInfo.startIdx + contentArr.length, itemLength);

        let maxCol = 0,
          iLen = contentArr.length;
        let pasteResultItems: any[] = items;
        if (startCellInfo.startIdx + iLen > itemLength) {
          // 붙여 넣기 데이터가 더 많으면 추가 row 생성.
          pasteResultItems = pasteResultItems.concat(createNewItems(currentFields, startCellInfo.startIdx + iLen - itemLength));
          itemLength = pasteResultItems.length;
        }

        for (let i = 0; i < iLen; i++) {
          const addCont = contentArr[i];

          const addRowIdx = startIdx + i;

          if (addRowIdx >= itemLength) {
            break;
          }

          const rowItem = pasteResultItems[addRowIdx];

          const addContArr = addCont.split(/\t/);
          const jLen = addContArr.length;

          for (let j = 0; j < jLen; j++) {
            const addColIdx = startCol + j;

            if (addColIdx < headerItemsLength) {
              maxCol = Math.max(maxCol, addColIdx);

              if (currentFields[addColIdx].$editRenderer.setValue(event, rowItem, addContArr[j]) === false) {
                return;
              }

              rowItem[currentFields[addColIdx].name] = addContArr[j];
            }
          }
        }

        this.gridMain.setViewDataInfo(pasteResultItems);

        this.selectionInfo.setSelectionRangeInfo(
          {
            range: { startIdx: startCellInfo.startIdx, endIdx: startCellInfo.startIdx + iLen - 1, startCol: startCellInfo.startCol, endCol: maxCol },
            startCell: startCellInfo,
          } as Selection,
          true,
          false
        );

        this.gridMain.getBody().dataDraw("reDraw_paste");

        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      }
    });
  }

  /**
   * keydown event
   *
   * @private
   */
  private initKeydownEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const editable = opts.editable;
    const selectionMode = opts.selectionMode;
    // window keydown 처리.  tabindex 처리 확인 해볼것.

    const searchEnabled = opts.search.enabled;

    const pasteElement = this.pasteElement.getElement();
    const mainElement = this.gridMain.mainElement().getElement();

    eventOff(mainElement, "keydown");
    eventOn(mainElement, "keydown", (e: KeyboardEvent) => {
      if (!cfg.focus) return;

      const targetElement = e.target as HTMLElement;

      if (isInputField(targetElement.tagName)) {
        return true;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest(".dg-setting-area")) return true;

      const evtKey = eventKeyCode(e);

      if (isSpacebar(e)) {
        stopPreventCancel(e);

        const startCell = cfg.selection.startCell;

        const field = cfg.currentFields[startCell.startCol];

        if (editable === true && field.editable !== false && !field.$renderer.isEditRenderer()) {
          // 스크롤 이동하고 움직일것

          this.insideScrollCheck(evtKey, e, cfg.scroll, startCell.startIdx, startCell.startCol);

          const startElement = this.gridMain.getBody().getBodyElement().find(".dg-cell.start-cell");

          const cellInfo = getCellInfo(cfg, startElement);

          field.$editRenderer.render(cellInfo, startElement);
          return;
        }

        return false;
      }

      if (e.metaKey || isCtrlKey(e)) {
        // copy

        if (evtKey == 67) {
          // ctrl+ c
          if (selectionMode == "none") {
            return;
          }

          this.body.copyData();

          return;
        } else if (evtKey == 65) {
          // ctrl + a
          this.selectionInfo.setAllSelection(true);
          return false;
        } else if (evtKey == 86) {
          // ctrl + v
          pasteElement.focus();
          return true;
        } else if (evtKey == 70) {
          // ctrl+f
          stopPreventCancel(e);

          if (searchEnabled) {
            this.gridMain.getDataSearch().openSearch();
          }
          return true;
        }
      }

      if (opts.editable === true) {
        if ((65 <= evtKey && evtKey <= 90) || (48 <= evtKey && evtKey <= 57)) {
          // const clickInfo = _this.getCurrentClickInfo();
          // const cellInfo = _$util.getCellInfo(_this, _$util.getCellElement(_this, clickInfo.r, clickInfo.c));
          // _$renderer.editCell(_this, cellInfo, e);
          // return false;
        }
      }

      if ((32 < evtKey && evtKey < 41) || evtKey == 13 || evtKey == 9) {
        stopPreventCancel(e);
        this.selectionInfo.setAllSelection(false);
        this.arrowKeydownEvent(e, evtKey);
      }
    });
  }

  /**
   * 방향키 ctrl
   *
   * @private
   * @param {UIEvent} evt key event
   * @param {number} evtKey key code
   */
  private arrowKeydownEvent(evt: UIEvent, evtKey: number) {
    const cfg = this.grid.config();
    const scrollCtrl = this.gridMain.getScroll();

    const scrollInfo = cfg.scroll,
      dataInfo = cfg.dataInfo,
      startCell = cfg.selection.startCell;

    this.body.removeStartCellClass();

    const endIdx = startCell.startIdx,
      endCol = startCell.startCol;

    let insideViewRow = scrollInfo.insideViewRow - 1; // start idx 0 부터 시작 하기 때문에 하나 처리함;

    let gridStartCol = cfg.dataInfo.startCol;

    const isCtrl = isCtrlKey(evt);
    switch (evtKey) {
      case 34: // PageDown
      case 13: // enter
      case 40: {
        //down
        let moveRowIdx = 0;
        if (evtKey == 40 && isCtrl) {
          moveRowIdx = dataInfo.rowLength - 1;
        } else {
          moveRowIdx = endIdx + (evtKey == 34 ? insideViewRow : 1);
          moveRowIdx = moveRowIdx >= dataInfo.rowLength ? dataInfo.rowLength - 1 : moveRowIdx;
        }

        // 스크롤 밖에 있을때
        if (this.insideScrollCheck(evtKey, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx >= scrollInfo.startIdx + insideViewRow) {
          scrollCtrl.moveVerticalScroll({ direction: "D", rowIdx: moveRowIdx - insideViewRow });
        }

        break;
      }
      case 33: //PageUp
      case 38: {
        //up
        let moveRowIdx = 0;
        if (evtKey == 38 && isCtrl) {
          moveRowIdx = 0;
        } else {
          moveRowIdx = endIdx - (evtKey == 33 ? insideViewRow : 1);
          moveRowIdx = moveRowIdx > 0 ? moveRowIdx : 0;
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx < scrollInfo.startIdx) {
          scrollCtrl.moveVerticalScroll({ direction: "U", rowIdx: moveRowIdx });
        }

        break;
      }
      case 36: // Home
      case 37: {
        //left

        let moveCol = gridStartCol;
        if (evtKey == 37 && isCtrl) {
          moveCol = gridStartCol;
        } else {
          moveCol = evtKey == 36 ? gridStartCol : endCol - 1;
          moveCol = moveCol > gridStartCol ? moveCol : gridStartCol;
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, endIdx, moveCol)) {
          return;
        }

        if (!isFixedLeftPostion(cfg, moveCol) && moveCol < scrollInfo.insideStartCol) {
          scrollCtrl.moveHorizontalScroll({ direction: "L", colIdx: moveCol });
        }

        break;
      }
      case 35: // End
      case 9: // tab
      case 39: {
        let moveCol;
        if (evtKey == 39 && isCtrl) {
          moveCol = dataInfo.colLength - 1;
        } else {
          moveCol = evtKey == 35 ? dataInfo.colLength - 1 : endCol + 1;
          moveCol = moveCol >= dataInfo.colLength ? dataInfo.colLength - 1 : moveCol;
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, endIdx, moveCol)) {
          return;
        }

        if (!isFixedRightPostion(cfg, moveCol) && moveCol > scrollInfo.insideEndCol) {
          scrollCtrl.moveHorizontalScroll({ direction: "R", colIdx: moveCol });
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * cursor scroll inside check
   *
   * @private
   * @type {function (ctx, evtKey, evt, endCol, scrollInfo, moveRowIdx, moveColIdx)}
   */
  private insideScrollCheck(evtKey: number, evt: UIEvent, scrollInfo: ScrollInfo, moveRowIdx: number, moveColIdx: number) {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (utils.isFunction(opts.body.keyNavHandler) && opts.body.keyNavHandler(evt, { key: evtKey, moveCol: moveColIdx, moveRow: moveRowIdx, item: cfg.items[moveRowIdx] }) === false) {
      return false;
    }

    this.selectionInfo.setRangeInfo(evtKey, evt, moveRowIdx, moveColIdx);

    let checkCode = -1;

    if (moveRowIdx < scrollInfo.startIdx) {
      // 'U'
      checkCode = 1;
    } else if (moveRowIdx > scrollInfo.startIdx + scrollInfo.viewRow) {
      // 'D'
      checkCode = 2;
    }

    if (!isFixedLeftPostion(cfg, moveColIdx) && !isFixedRightPostion(cfg, moveColIdx)) {
      if (moveColIdx < scrollInfo.insideStartCol) {
        // 'L'
        checkCode = (checkCode > 0 ? checkCode : 0) + 10;
      } else if (moveColIdx > scrollInfo.insideEndCol) {
        // 'R'
        checkCode = (checkCode > 0 ? checkCode : 0) + 20;
      }
    }

    if (checkCode > 0) {
      const horizontal = Math.floor(checkCode / 10);
      const vertical = checkCode % 10;

      const scrollCtrl = this.gridMain.getScroll();

      if (horizontal > 0) {
        scrollCtrl.moveHorizontalScroll({ direction: horizontal == 1 ? "L" : "R", colIdx: moveColIdx, drawFlag: vertical > 0 ? false : true });
      }

      if (vertical > 0) {
        scrollCtrl.moveVerticalScroll({ rowIdx: moveRowIdx - (vertical == 1 ? 0 : scrollInfo.insideViewRow - 1) });
      }

      return true;
    }

    return false;
  }

  // cell click
  public setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string, cellElement: HTMLElement) {
    const cfg = this.grid.config();

    this.gridMain.setGridFocusIn(e, true);

    if (!(cellInfo.field.renderer.type == "dropdown" && cellInfo.c == +cfg.activeComponent)) {
      this.gridMain.hideLayer();
    }

    const rowIndex = cellInfo.rowIndex,
      cellIdx = cellInfo.c;

    if (!isFixedLeftPostion(cfg, cellIdx) && !isFixedRightPostion(cfg, cellIdx)) {
      if (cellIdx < cfg.scroll.insideStartCol) {
        this.gridMain.getScroll().moveHorizontalScroll({ direction: "L", colIdx: cellIdx });
      } else if (cellIdx > cfg.scroll.insideEndCol) {
        this.gridMain.getScroll().moveHorizontalScroll({ direction: "R", colIdx: cellIdx });
      }
    }

    let keyMode = (isShiftKey(e) ? 2 : 0) + (isCtrlKey(e) ? 1 : 0);

    const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(selectionMode, cellIdx, cfg, cellElement, multipleFlag && keyMode == 2);

    //console.log(`multipleFlag : ${multipleFlag}, keymode : ${keyMode}, multipleFlag:${multipleFlag}`);

    if ((multipleFlag && keyMode != 2) || !multipleFlag) {
      this.body.removeStartCellClass();
    }

    const rangeType = isRowSelection(selectionMode) ? "row" : "cell";

    if (multipleFlag && keyMode >= 2) {
      // shift key
      let rangeInfo = { endIdx: rowIndex, endCol: selectRangeInfo.endCol, modifierKey: 2 } as SelectionRange;

      if (selectRangeInfo.startCol > -1) {
        rangeInfo.startCol = selectRangeInfo.startCol;
      }

      rangeInfo.type = rangeType;

      this.selectionInfo.setSelectionRangeInfo(
        {
          range: rangeInfo,
          isMouseDown: true,
        } as Selection,
        false,
        true
      );
    } else if (multipleFlag && keyMode == 1) {
      // ctrl key

      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { type: rangeType, startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol, modifierKey: 1 } as SelectionRange,
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: selectRangeInfo.startCol },
        } as Selection,
        false,
        true
      );
    } else {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { type: rangeType, startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: cellIdx },
        } as Selection,
        true,
        true
      );
    }

    window.getSelection()?.removeAllRanges();
  }
}
