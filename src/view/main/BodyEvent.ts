import { CellInfo, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";

import { dragHorizontalMovePosition, dragVerticalMovePosition, getCellInfo, isFixedLeftPostion, isFixedRightPostion, isInputField, isMultipleSelection, createNewItems, isRowSelection } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";

import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, isSpacebar, stopPreventCancel } from "src/util/eventUtils";
import SelectionInfo from "src/selection/selection";
import AsideRowCheckRenderer from "src/renderer/view/AsideRowCheckRenderer";
import { getOffset, hasClass } from "src/util/domUtils";
import Body from "./Body";
import { ROW_CHECK_NAME } from "src/constants";

/**
 * Body event class
 *
 * @class BodyEvent
 * @typedef {BodyEvent}
 */
export default class BodyEvent {
  private readonly grid: DaraGrid;
  private readonly body: Body;
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private readonly bodyElement: DaraElement;
  private readonly pasteElement: DaraElement;

  private readonly allCellElements: any;

  constructor(grid: DaraGrid, gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;

    this.bodyElement = this.body.getBodyElement();
    this.allCellElements = this.body.getBodyCellElements();
    this.pasteElement = new DaraElement(this.grid.element().find(".dg-paste-area"));

    this.initEvent();
  }

  public initEvent() {
    this.initKeydownEvent();
    this.initCellEvent();
    this.initBodyEvent();

    this.initRowCheckEvent();
  }

  /**
   * init row check event
   *
   * @private
   */
  private initRowCheckEvent() {
    const cfg = this.grid.config();
    const bodyElement = this.bodyElement.getElement();

    eventOn(
      bodyElement,
      "click",
      (e: UIEvent) => {
        const eventElement = e.target as HTMLInputElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;

        const cellInfo = getCellInfo(cfg, cellElement);

        const checked = eventElement.checked;

        const item = cellInfo.item;

        this.body.setCheckItem(cellInfo, checked, item);
      },
      '[name="dgRowCheck"]',
      { passive: false }
    );
  }

  /**
   * row check item click event trigger
   *
   * @public
   * @param {CellInfo} cellInfo
   */
  private setRowCheckItemClick(cellInfo: CellInfo) {
    const cfg = this.grid.config();
    const rowCheckIdx = cfg.fieldIndex.get(ROW_CHECK_NAME);
    if (!utils.isEmpty(rowCheckIdx)) {
      (this.bodyElement.getElement().querySelector(`[data-cell-position="${cellInfo.r},${rowCheckIdx}"] [name="dgRowCheck"]`) as HTMLElement).click();
    }
  }

  private initBodyEvent() {
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

        let maxCol = 0,
          iLen = contentArr.length;
        let addItems = [];
        if (startCellInfo.startIdx + iLen > itemLength) {
          // 붙여 넣기 데이터가 더 많으면 추가 row 생성.
          addItems = items.concat(createNewItems(currentFields, startCellInfo.startIdx + iLen - itemLength));
          itemLength = addItems.length;
        }

        for (let i = 0; i < iLen; i++) {
          const addCont = contentArr[i];

          const addRowIdx = startIdx + i;

          if (addRowIdx >= itemLength) {
            break;
          }

          const rowItem = items[addRowIdx];

          const addContArr = addCont.split(/\t/);
          const jLen = addContArr.length;

          this.body.setChangeValue("new", rowItem);

          for (let j = 0; j < jLen; j++) {
            const addColIdx = startCol + j;

            if (addColIdx < headerItemsLength) {
              maxCol = Math.max(maxCol, addColIdx);
              rowItem[currentFields[addColIdx].name] = addContArr[j];
            }
          }
        }

        this.selectionInfo.setSelectionRangeInfo(
          {
            range: { startIdx: startCellInfo.startIdx, endIdx: startCellInfo.startIdx + iLen - 1, startCol: startCellInfo.startCol, endCol: maxCol },
            startCell: startCellInfo,
          } as Selection,
          true,
          false
        );

        // add, set data 부분 처리 할것.
        //
        //

        // _this.setData(items, "reDraw_paste", { focus: true, index: _this.config.scroll.viewIdx });

        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      }
    });
  }

  /**
   * cell click drag event
   *
   * @private
   */
  private initCellEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    // body  selection 처리.
    // cell event 처리할것.
    const orginSelectionMode = opts.selectionMode;
    let selectionMode = orginSelectionMode;

    let bodyDragTimer: any = -1;
    let bodyDragDelay = 150;
    let multipleFlag = isMultipleSelection(selectionMode);

    let clickCnt = 0,
      clickDelay = 400;

    let clickTimer: any;
    let currentCellPosition: any;
    const resetClick = function () {
      clickCnt = 0;
      currentCellPosition = null;
    };

    function conserveClick(cellPosition: any) {
      currentCellPosition = cellPosition;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(resetClick, clickDelay);
    }

    const rowOptions = opts.body.row;
    const rowHeight = cfg.rowHeight;
    // row cell double click event
    const enableDblClickRowCheck = rowOptions.enableDblClickRowCheck === true;
    const editable = opts.editable;
    const dblClickEventFlag = editable || enableDblClickRowCheck || utils.isFunction(opts.body.cellDblClick);
    const isCellDblClick = utils.isFunction(opts.body.cellDblClick);
    const cellDblClick = opts.body.cellDblClick ?? function () {};

    const cellClickFn = opts.body.cellClick;
    const isCellClick = utils.isFunction(cellClickFn);

    const bodyElement = this.bodyElement.getElement();
    eventOn(
      bodyElement,
      "mousedown touchstart",
      (e: UIEvent) => {
        if ((e as MouseEvent).button === 3) {
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

        //const startEvtPosition = eventPosition(e);

        const position = getOffset(bodyElement);
        const mainRightWidth = cfg.dimensions.mainRightWidth;
        const _l = position.left + cfg.dimensions.mainLeftWidth,
          _r = position.left + cfg.dimensions.mainInsideWidth - mainRightWidth;
        const _t = position.top,
          _b = _t + cfg.dimensions.mainBodyHeight;

        if (multipleFlag && hasClass(cellElement, "$line-number")) {
          selectionMode = "multiple-row";
        }

        const startCellInfo = getCellInfo(cfg, cellElement);
        startCellInfo.c = startCellInfo.c < cfg.dataInfo.startCol ? cfg.dataInfo.startCol : startCellInfo.c;

        let beforeMoveRange = { endIdx: -1, endCol: -1 };

        if (multipleFlag) {
          // mouse darg scroll
          let mouseScrollDirectionX: string;
          let mouseDragDirectionY: string;
          eventOn(document, "touchmove mousemove", (moveEvt: Event) => {
            cfg.isBodyDragging = true;

            const e1Position = eventPosition(moveEvt);

            const moveXInfo = dragHorizontalMovePosition(cfg, e1Position.x, position.left, _l, _r, beforeMoveRange.endCol);
            mouseScrollDirectionX = moveXInfo.mouseScrollDirectionX;

            const moveRange: any = {};
            if (moveXInfo.overCell > -1) {
              moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(selectionMode, moveXInfo.overCell, cfg, cellElement, cfg.selection.isMouseDown).endCol;
            }

            const moveYInfo = dragVerticalMovePosition(cfg, e1Position.y, rowHeight, startCellInfo, _t, _b);
            mouseDragDirectionY = moveYInfo.mouseDragDirectionY;
            if (moveYInfo.rowIdx > -1) {
              moveRange.endIdx = moveYInfo.rowIdx;
            }

            if (beforeMoveRange.endIdx == moveRange.endIdx && beforeMoveRange.endCol == moveRange.endCol) return;

            if (Object.keys(moveRange).length > 0) {
              this.selectionInfo.setSelectionRangeInfo(
                {
                  range: moveRange as SelectionRange,
                } as Selection,
                false,
                mouseScrollDirectionX == "" && mouseDragDirectionY == ""
              );
            }

            // console.log("moveRange 11111111 : ", mouseScrollDirectionX, mouseDragDirectionY, moveRange);

            beforeMoveRange = moveRange;

            if (bodyDragTimer < 1) {
              let beforeMovePosition = { col: -1, rowIdx: -1 };
              bodyDragTimer = setInterval(() => {
                if (mouseScrollDirectionX == "" && mouseDragDirectionY == "") return;

                let isDraw = false;

                const moveRangeInfo = {} as SelectionRange;

                if (mouseScrollDirectionX != "") {
                  const isRight = mouseScrollDirectionX === "R";
                  let endCol = isRight ? cfg.scroll.insideEndCol + 3 : cfg.scroll.insideStartCol - 3;

                  if (beforeMovePosition.col != endCol) {
                    if ((isRight && cfg.fixedRightIndex == 0) || (!isRight && cfg.fixedLeftIndex == 0)) {
                      moveRangeInfo.endCol = endCol;
                    }

                    this.gridMain.getScroll().moveHorizontalScroll({ direction: mouseScrollDirectionX, colIdx: endCol, drawFlag: false });
                    beforeMovePosition.col = endCol;
                    isDraw = true;
                  }
                }

                if (mouseDragDirectionY != "") {
                  let endIdx = mouseDragDirectionY == "D" ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1 : cfg.scroll.startIdx - 1;

                  if (beforeMovePosition.rowIdx != endIdx) {
                    moveRangeInfo.endIdx = endIdx;
                    this.gridMain.getScroll().moveVerticalScroll({ direction: mouseDragDirectionY, drawFlag: false });
                    beforeMovePosition.rowIdx = endIdx;
                    isDraw = true;
                  }
                }

                if (isDraw) {
                  this.selectionInfo.setSelectionRangeInfo(
                    {
                      range: moveRangeInfo,
                    } as Selection,
                    false,
                    false
                  );
                  this.body.dataDraw("dragscroll");
                }
              }, bodyDragDelay);
            }
          });

          eventOn(document, "touchend mouseup", () => {
            cfg.isBodyDragging = false;
            eventOff(document, "touchmove mousemove touchend mouseup");
            clearInterval(bodyDragTimer);
            bodyDragTimer = -1;
          });
        }

        const currViewIdx = cfg.scroll.startIdx;

        this.setCellClick(e, startCellInfo, multipleFlag, selectionMode, cellElement);

        const newViewIdx = cfg.scroll.startIdx;

        if (currViewIdx != newViewIdx) {
          startCellInfo.r = startCellInfo.r - 1;
        }

        const rowIndex = startCellInfo.rowIndex;

        const positionInfo = {
          position: cellElement.getAttribute("data-cell-position"),
          rowItemIdx: rowIndex,
        };

        if (editable === true) {
          if (startCellInfo.field.renderer.type == "dropdown") {
            resetClick();
            cfg.edit.enable = true;
            startCellInfo.field.$editRenderer.render(cellElement, startCellInfo);
            return false;
          }

          if (clickCnt == 0) {
            cfg.edit.enable = false;
            this.body.editAreaClose(); // 이전 에디트창 닫기
          }
        }

        if (clickCnt > 0 && currentCellPosition.position == positionInfo.position && currentCellPosition.rowItemIdx == rowIndex) {
          // double click 처리.
          conserveClick(positionInfo);
          resetClick();

          if (dblClickEventFlag) {
            if (editable === true && !startCellInfo.field.$isAside) {
              startCellInfo.field.$editRenderer.render(cellElement, startCellInfo);
              return;
            }

            if (enableDblClickRowCheck) {
              this.setRowCheckItemClick(startCellInfo);
            }

            if (isCellDblClick) cellDblClick(startCellInfo);

            return;
          }
        } else {
          ++clickCnt;
          conserveClick(positionInfo);
        }

        // row click event
        if (isCellClick) {
          if (startCellInfo.field.$isAside) {
            return;
          }

          if (cellClickFn) cellClickFn(startCellInfo);
        }

        return;
      },
      ".dg-cell",
      { passive: false }
    );

    eventOn(bodyElement, "mouseup touchend", (e: UIEvent) => {
      cfg.selection.isMouseDown = false;
      selectionMode = orginSelectionMode;
      //this.selectionInfo.setSelectionRangeInfo({ isMouseDown: false } as Selection);
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
    const selectionMode = opts.selectionMode;
    // window keydown 처리.  tabindex 처리 확인 해볼것.

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
      if (targetElement.closest(".pubGrid-setting-area")) return true;

      const evtKey = eventKeyCode(e);

      if (isSpacebar(e)) {
        //TODO spacebar 처리 할것.
        stopPreventCancel(e);
        return false;
      }

      if (e.metaKey || isCtrlKey(e)) {
        // copy

        if (evtKey == 67) {
          // ctrl+ c
          if (selectionMode == "none") {
            return;
          }

          let copyData = this.selectionInfo.selectionData();

          try {
            utils.copyStringToClipboard(copyData);
          } catch (e) {
            console.log("Unable to copy", e);
          }
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

          //_$setting.settingBtnToggle(_this);
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

        console.log("moveRowIdx11 : ", moveRowIdx);

        // 스크롤 밖에 있을때
        if (this.insideScrollCheck(evtKey, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        console.log("moveRowIdx22 : ", moveRowIdx);

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
        let moveCol = gridStartCol;
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
  private setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string, cellElement: HTMLElement) {
    const cfg = this.grid.config();

    this.gridMain.setGridFocusIn(e, true);

    if (cellInfo.field.renderer.type == "dropdown" && cellInfo.c == +cfg.activeComponent) {
      //this.gridMain.hideLayer(cfg.activeComponent);
    } else {
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
