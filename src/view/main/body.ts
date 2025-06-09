import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { CellInfo, Config, GridElement, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";

import { addStyleTag, removeClass } from "../../util/styleUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, getCellInfo, getCenterContentLeft, getOverCellPosition, isFixedLeftPostion, isFixedRightPostion, isInputField, isMultipleSelection, createNewItems } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, eventPosition, isCtrlKey, isShiftKey, stopPreventCancel } from "src/util/eventUtils";
import SelectionInfo from "src/selection/selection";
import AsideRowCheckRenderer from "src/renderer/view/AsideRowCheckRenderer";
import { getOffset, hasClass } from "src/util/domUtils";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class Body {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private selectionInfo: SelectionInfo;

  public bodyElement: DaraElement;

  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public allCellMap: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.grid = grid;

    this.calcBodyDemention();

    this.createTemplate();

    this.initEvent();

    this.selectionInfo = gridMain.selectionInfo;
  }
  public initEvent() {
    this.initKeydownEvent();
    this.initCellEvent();
    this.initBodyEvent();
  }

  private initBodyEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = utils.isFunction(pasteBeforeFn);

    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = utils.isFunction(pasteAfterFn);

    eventOn(this.gridMain.pasteElement.getElement(), "paste", (event: ClipboardEvent) => {
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

          this.setChangeValue("new", rowItem);

          for (let j = 0; j < jLen; j++) {
            const addColIdx = startCol + j;

            if (addColIdx < headerItemsLength) {
              maxCol = Math.max(maxCol, addColIdx);
              rowItem[currentFields[addColIdx].name] = addContArr[j];
            }
          }
        }

        this.gridMain.selectionInfo.setSelectionRangeInfo(
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
   * @method setChangeValue
   * @description CUD모드 변경. (c = create , u = update , d =delete)
   */
  private setChangeValue(mode: string, rowItem: any, colInfo?: FieldItem, newValue?: any) {
    if (mode == "new" || mode == "remove") {
      rowItem["_dgCUD"] = mode == "new" ? "C" : "D";
      return rowItem;
    }

    if (mode == "modify" && colInfo) {
      rowItem["_dgCUD"] = rowItem["_dgCUD"] == "_C" ? "C" : rowItem["_dgCUD"] == "C" ? "CU" : "U";

      rowItem[colInfo.name] = newValue;

      const cell = this.grid.config().edit.cell;

      const cellEle = this.gridMain.getBody().bodyElement.find('[data-cell-position="' + cell.r + "," + cell.c + '"]');

      this.setCellStyleClass(cellEle, cell.rowIndex, cell.c, cell.field, cell.item);
      cell.field.$renderer.render(cell.rowIndex, cell.c, rowItem, cellEle.querySelector(".dg-cell") as HTMLElement);

      return rowItem;
    }
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
    const rowHeight = opts.body.row.height;
    // row cell double click event
    const dblCheckFlag = rowOptions.dblClickCheck === true;
    const editable = opts.editable;
    const dblClickEventFlag = editable || dblCheckFlag || utils.isFunction(opts.body.cellDblClick);
    const fnDblClick = opts.body.cellDblClick || function () {};

    const rowClickFn = opts.body.row.click;
    const rowClickFlag = utils.isFunction(rowClickFn);

    let asideRowCheckRenderer: FieldItem;
    if (dblCheckFlag) {
      const leftFields = cfg.fieldHeaderGroup.leafLeft;

      leftFields.forEach((field, j) => {
        if (field instanceof AsideRowCheckRenderer) {
          asideRowCheckRenderer = field;
          return;
        }
      });
    }

    const bodyElement = this.bodyElement.getElement();
    eventOn(
      bodyElement,
      "mousedown touchstart",
      (e: UIEvent) => {
        if ((e as MouseEvent).button === 3) {
          return true;
        }
        const currentElement = e.target as HTMLElement;
        if (isInputField(currentElement.tagName)) {
          return true;
        }

        //const startEvtPosition = eventPosition(e);

        const position = getOffset(bodyElement);
        const mainRightWidth = cfg.dimensions.mainRightWidth;
        const _l = position.left + cfg.dimensions.mainLeftWidth,
          _r = position.left + cfg.dimensions.mainInsideWidth - mainRightWidth;
        const _t = position.top,
          _b = _t + cfg.dimensions.mainBodyHeight;

        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;

        if (cellElement == null || hasClass(cellElement, "row-check modify-info")) return;

        if (multipleFlag && hasClass(cellElement, "line-number")) {
          selectionMode = "multiple-row";
        }

        const startCellInfo = getCellInfo(cfg, cellElement);

        if (multipleFlag) {
          // mouse darg scroll
          let mouseScrollDirectionX: string;
          let mouseDragDirectionY: string;
          eventOn(document, "touchmove mousemove", (moveEvt: Event) => {
            cfg.isBodyDragging = true;

            const e1Position = eventPosition(moveEvt);

            const moveXInfo = dragHorizontalMovePosition(cfg, e1Position.x, startCellInfo, position.left, _l, _r);
            mouseScrollDirectionX = moveXInfo.mouseScrollDirectionX;

            const moveRange: any = {};
            if (moveXInfo.overCell > -1) {
              const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(selectionMode, moveXInfo.overCell, cfg, cellElement, cfg.selection.isMouseDown);
              moveRange.endCol = selectRangeInfo.endCol;
            }

            const moveYInfo = dragVerticalMovePosition(cfg, e1Position.y, rowHeight, startCellInfo, _t, _b);
            mouseDragDirectionY = moveYInfo.mouseDragDirectionY;
            if (moveYInfo.rowIdx > -1) {
              moveRange.endIdx = moveYInfo.rowIdx;
            }

            if (Object.keys(moveRange).length > 0) {
              this.selectionInfo.setSelectionRangeInfo(
                {
                  range: moveRange as SelectionRange,
                } as Selection,
                false,
                true
              );
            }

            if (bodyDragTimer < 1) {
              bodyDragTimer = setInterval(() => {
                let isVerticalDraw = mouseDragDirectionY != "";

                if (mouseScrollDirectionX !== "") {
                  let endCol = -1;

                  if (mouseScrollDirectionX == "R") {
                    endCol = cfg.scroll.insideEndCol + 3;
                  } else {
                    endCol = cfg.scroll.insideStartCol - 3;
                  }

                  this.gridMain.getScroll().moveHorizontalScroll({ direction: mouseScrollDirectionX, colIdx: endCol, drawFlag: !isVerticalDraw });
                }

                if (isVerticalDraw) {
                  let endIdx = -1;
                  if (mouseDragDirectionY == "D") {
                    endIdx = cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1;
                  } else {
                    endIdx = cfg.scroll.startIdx - 1;
                  }

                  this.selectionInfo.setSelectionRangeInfo(
                    {
                      range: { endIdx: endIdx } as SelectionRange,
                    } as Selection,
                    false,
                    true
                  );

                  this.gridMain.getScroll().moveVerticalScroll({ direction: mouseDragDirectionY });
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
            this.editAreaClose(); // 이전 에디트창 닫기
          }
        }

        if (clickCnt > 0 && currentCellPosition.position == positionInfo.position && currentCellPosition.rowItemIdx == rowIndex) {
          // double click 처리.
          conserveClick(positionInfo);
          resetClick();

          console.log("dblclick ---------- ");

          if (dblClickEventFlag) {
            if (editable === true && !startCellInfo.field.$isAside) {
              startCellInfo.field.$editRenderer.render(cellElement, startCellInfo);
              return false;
            }

            const clickRowItem = startCellInfo.item;
            if (dblCheckFlag) {
              //cfg.tbodyItem[rowIndex] = this.getRowCheckValue(clickRowItem, !(clickRowItem["_dgRowCheck"] === true));

              asideRowCheckRenderer.$renderer.render(startCellInfo.r, startCellInfo.c, clickRowItem, this.allCellMap["left"][`${startCellInfo.r},${startCellInfo.c}`]);
            }

            if (utils.isFunction(fnDblClick)) fnDblClick(startCellInfo);
          }
        } else {
          ++clickCnt;
          conserveClick(positionInfo);
        }

        if (!editable) {
          if (utils.isFunction(startCellInfo.field.click)) {
            startCellInfo.field.$renderer.click(startCellInfo);
            return false;
          }
        }

        // row click event
        if (rowClickFlag) {
          if (startCellInfo.field.$isAside) {
            return true;
          }

          if (rowClickFn) rowClickFn(startCellInfo);
        }

        return true;
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
   * get rowitem check value
   *
   * @public
   * @param {*} rowItem row item
   * @param {boolean} checkFlag check 여부
   * @returns {*}
   */
  public setRowCheck(rowItem: any, checkFlag: boolean) {
    rowItem["_dgRowCheck"] = checkFlag;
    return rowItem;
  }

  public editAreaClose() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    if (cfg.isCellEdit === true) {
      /*
      const editRowInfo = cfg.editRowInfo;
      const renderer = editRowInfo.colInfo.renderer;

      const newValue = editRowInfo.rowItem[editRowInfo.colInfo.key];
      if (renderer && renderer.type == "dropdown") {
        const selectElements = $("#" + gridCtx.prefix + "_pubGridEditArea .pubGrid-select-item.selected");

        if (selectElements.length > 0) {
          newValue = selectElements.attr("data-val");
        }

        $("#" + gridCtx.prefix + "_pubGridEditArea").removeClass("open");
      } else {
        let beforeEditEle = gridCtx.element.body.find('.pub-body-td[data-cell-position="' + cfg.editRowInfo.r + "," + cfg.editRowInfo.c + '"] .pubGrid-edit-field');

        if (beforeEditEle.length > 0) {
          newValue = beforeEditEle.val();
          beforeEditEle.remove();
        }
      }

      if (newValue != editRowInfo.rowItem[editRowInfo.colInfo.key]) {
        _$util.setChangeValue(gridCtx, "modify", editRowInfo.rowItem, editRowInfo.colInfo, newValue);
      }
      */
    }
  }

  // cell click
  private setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string, cellElement: HTMLElement) {
    const cfg = this.grid.config();

    //this.gridMain.setGridFocusIn(e);

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

    console.log(`multipleFlag : ${multipleFlag}, keymode : ${keyMode}, multipleFlag:${multipleFlag}`);

    if ((multipleFlag && keyMode != 2) || !multipleFlag) {
      this.removeStartCellClass();
    }

    if (multipleFlag && keyMode >= 2) {
      // shift key
      let rangeInfo = { endIdx: rowIndex, endCol: selectRangeInfo.endCol } as SelectionRange;

      if (selectRangeInfo.startCol > -1) {
        rangeInfo.startCol = selectRangeInfo.startCol;
      }

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
          range: { startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
          isSelect: true,
          mode: cfg.selection.isSelect ? "add" : "",
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: selectRangeInfo.startCol },
        } as Selection,
        false,
        true
      );
    } else {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
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

  /**
   * remove start cell style class
   *
   */
  private removeStartCellClass() {
    const startCellElement = this.bodyElement.finds(".dg-cell.start-cell");

    if (startCellElement) {
      removeClass(startCellElement, "start-cell");
    }
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

    eventOff(this.gridMain.mainElement().getElement(), "keydown");
    eventOn(this.gridMain.mainElement().getElement(), "keydown", (e: KeyboardEvent) => {
      if (!cfg.focus) return;

      const targetElement = e.target as HTMLElement;

      if (isInputField(targetElement.tagName)) {
        return true;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest(".pubGrid-setting-area")) return true;

      const evtKey = eventKeyCode(e);

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
          this.gridMain.pasteElement.getElement().focus();
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

    this.removeStartCellClass();

    const endIdx = startCell.startIdx,
      endCol = startCell.startCol;

    let insideViewRow = scrollInfo.insideViewRow - 1; // start idx 0 부터 시작 하기 때문에 하나 처리함;

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
        if (this.insideScrollCheck(evtKey, evt, endIdx, scrollInfo, moveRowIdx, endCol)) {
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

        if (this.insideScrollCheck(evtKey, evt, endIdx, scrollInfo, moveRowIdx, endCol)) {
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

        let moveCol = 0;
        if (evtKey == 37 && isCtrl) {
          moveCol = 0;
        } else {
          moveCol = evtKey == 36 ? 0 : endCol - 1;
          moveCol = moveCol > 0 ? moveCol : 0;
        }

        if (this.insideScrollCheck(evtKey, evt, endIdx, scrollInfo, endIdx, moveCol)) {
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
        let moveCol = 0;
        if (evtKey == 39 && isCtrl) {
          moveCol = dataInfo.colLength - 1;
        } else {
          moveCol = evtKey == 35 ? dataInfo.colLength - 1 : endCol + 1;
          moveCol = moveCol >= dataInfo.colLength ? dataInfo.colLength - 1 : moveCol;
        }

        if (this.insideScrollCheck(evtKey, evt, endIdx, scrollInfo, endIdx, moveCol)) {
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
   * @type {function (ctx, evtKey, evt, endIdx, endCol, scrollInfo, moveRowIdx, moveColIdx)}
   */
  private insideScrollCheck(evtKey: number, evt: UIEvent, endIdx: number, scrollInfo: ScrollInfo, moveRowIdx: number, moveColIdx: number) {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (utils.isFunction(opts.body.keyNavHandler) && opts.body.keyNavHandler(evt, { key: evtKey, moveCol: moveColIdx, moveRow: moveRowIdx, item: cfg.items[moveRowIdx] }) === false) {
      return false;
    }

    this.selectionInfo.setRangeInfo(evtKey, evt, moveRowIdx, moveColIdx);

    let checkCode = -1;

    if (endIdx < scrollInfo.startIdx) {
      // 'U'
      checkCode = 1;
    } else if (endIdx > scrollInfo.startIdx + scrollInfo.viewRow) {
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

  public calcBodyDemention() {
    const cfg = this.grid.config();
  }

  public createTemplate() {
    const bodyElement = this.grid.element().findDaraElement(".dg-body");
    this.bodyElement = bodyElement;
    this.leftElement = bodyElement.findDaraElement(".dg-left");
    this.centerElement = bodyElement.findDaraElement(".dg-center");
    this.rightElement = bodyElement.findDaraElement(".dg-right");

    this.leftElement.html(this.template("left"));
    this.centerElement.html(this.template("center"));
    this.rightElement.html(this.template("right"));
  }

  /**
   * body 데이터 그리기
   */
  public dataDraw(mode?: string) {
    const opts = this.grid.getOptions();
    const cfg = this.grid.config();

    const items = cfg.items;

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;
    const enableLeftField = leftFields.length > 0;
    const enableRightField = rightFields.length > 0;

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: "center", fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: "right", fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    let viewRow = cfg.scroll.viewRow;
    const startIdx = cfg.scroll.startIdx;

    const currentViewRow = viewRow < cfg.dataInfo.rowLength - startIdx ? viewRow : cfg.dataInfo.rowLength - startIdx;
    const beforeViewRow = cfg.scroll.before.viewRow;

    if (beforeViewRow > 1 && beforeViewRow > viewRow) {
      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        for (let i = viewRow; i < beforeViewRow; i++) {
          let trEle = element.find(`.dg-row[rowinfo="${i}"]`);
          if (trEle) {
            trEle.parentNode?.removeChild(trEle);
          }
          //element.find(`.dg-row[rowinfo="${i}"]`).remove();
        }
      });

      cfg.scroll.before.viewRow = viewRow;
    } else if (beforeViewRow < viewRow) {
      const rowHeight = opts.body.row.height;

      const addViewRow = viewRow - beforeViewRow;

      fieldGroups.forEach(({ fields, element, startCol }) => {
        if (fields.length === 0) return;
        element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(beforeViewRow, addViewRow, rowHeight, fields, startCol));
      });

      // 속도 향상 위해 cell을 cache
      const allCellMap = {} as any;
      fieldGroups.forEach(({ name, fields, element }) => {
        if (fields.length > 0) {
          allCellMap[name] = {} as any;
          element.finds(".dg-cell").forEach((cellElement, idx) => {
            let element = cellElement as HTMLElement;
            const cellPosition = element.getAttribute("data-cell-position");
            // this.leftElement.find(`[data-cell-position="${i},${j}"]>.dg-cell-content`));
            if (cellPosition) allCellMap[name][cellPosition] = element.children[0];
          });
        }
      });

      this.allCellMap = allCellMap;

      cfg.scroll.before.viewRow = viewRow;
    }

    this.bodyElement.attr({ "data-view-mode": items.length < 1 ? "empty" : "grid" });

    if (viewRow < 1) {
      return;
    }

    // 마지막 라인 처리
    if (currentViewRow < viewRow) {
      for (let i = currentViewRow; i < viewRow; i++) {
        fieldGroups.forEach(({ fields, element }) => {
          if (fields.length > 0) {
            element.find(`.dg-row[rowinfo="${i}"]`).style.display = "none";
          }
        });
      }

      cfg.scroll.before.hideLastRow = true;
    } else if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;
      for (let i = 0; i < viewRow; i++) {
        fieldGroups.forEach(({ fields, element }) => {
          if (fields.length > 0) {
            const style = element.find(`.dg-row[rowinfo="${i}"]`).style;
            if (style.display) style.removeProperty("display");
          }
        });
      }
    }

    const bodyClassList = this.bodyElement.getElement().classList;

    if (startIdx % 2 == 0) {
      bodyClassList.remove("dg-body-even");
      bodyClassList.add("dg-body-odd");
    } else {
      bodyClassList.remove("dg-body-odd");
      bodyClassList.add("dg-body-even");
    }

    const startCell = cfg.selection.startCell;
    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    console.log(mode, startCol, endCol, "dataDraw", currentViewRow, viewRow, fieldGroups);

    const leafAllFields = cfg.currentFields;

    //const start = performance.now();

    this.removeStartCellClass();

    const pagingStartIdx = opts.footer.paging?.enabled ? (cfg.paging.currPage - 1) * cfg.paging.countPerPage : 0;

    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      let item = items[viewRowIdx];

      const rowIdx = pagingStartIdx + viewRowIdx;

      // left panel
      if (enableLeftField) {
        leftFields.forEach((field, j) => {
          const cellIdx = j;
          const cellElement = this.allCellMap["left"][`${i},${cellIdx}`];

          this.setSelectCell(startCell, viewRowIdx, cellIdx, cellElement, field, item);
          field.$renderer.render(rowIdx, viewRowIdx, cellIdx, item, cellElement);
        });
      }

      for (let j = startCol; j <= endCol; j++) {
        const field = leafAllFields[j];
        const cellElement = this.allCellMap["center"][`${i},${j}`];

        this.setSelectCell(startCell, viewRowIdx, j, cellElement, field, item);
        field.$renderer.render(rowIdx, viewRowIdx, j, item, cellElement);
      }

      // right panel
      if (enableRightField) {
        rightFields.forEach((field, j) => {
          const cellIdx = fixedRightIndex + j;
          const cellElement = this.allCellMap["right"][`${i},${cellIdx}`];
          this.setSelectCell(startCell, viewRowIdx, cellIdx, cellElement, field, item);
          field.$renderer.render(rowIdx, viewRowIdx, cellIdx, item, cellElement);
        });
      }
    }

    //const end = performance.now();
    //console.log(`실행 시간: ${end - start} ms`);
  }

  /**
   * header html template
   *
   * @public
   * @param {string} type position type
   * @returns {string} template string
   */
  public template(type: string) {
    const cfg = this.grid.config();

    let leafFields;
    let startGroupIdx = 0;
    if (type == "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      startGroupIdx = cfg.fixedRightIndex;
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      startGroupIdx = cfg.fixedLeftIndex;
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const viewRow = cfg.scroll.viewRow;
    const leafLength = leafFields.length;

    if (viewRow < 1 || leafLength < 1) return "";

    let colGroupHtm = [];
    let colGroupIdx = startGroupIdx;
    let tableWidth = 0;
    for (let leafNode of leafFields) {
      const nodeWidth = leafNode.$width;
      tableWidth += nodeWidth;
      colGroupHtm.push(`<th data-col-idx="${colGroupIdx++}" style="border:0px;margin: 0px !important; padding: 0px !important; font-size: 0px !important; line-height: 0 !important; height: 0px;width:${nodeWidth}px;"></th>`);
    }

    return `<table class="dg-body-table">
      <thead><tr>${colGroupHtm.join("")}</tr></thead>
      <tbody></tbody>
    </table> 
    ${type != "center" ? '<div class="fixed-column-line"></div>' : ""}`;
  }

  /**
   * row template
   *
   * @private
   * @param {number} rowIdx row index
   * @param {number} rowHeight row height
   * @param {FieldItem[]} fields fields 정보
   * @returns {string} template
   */
  private rowTemplate(viewRow: number, rowCount: number, rowHeight: number, fields: FieldItem[], startCol: number): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = viewRow + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let clickFlag = field.click;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell ${utils.camelToKebab(field.name)}" data-cell-position="${rowIdx + "," + (startCol + j)}">
          <div role="presentation" class="dg-cell-content ${field.$alignStyle}"></div>
        </td>`);
        } else {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + (startCol + j)}">
          <div role="presentation" class="dg-cell-content dg-cell-ellipsis ${field.$alignStyle}  ${clickFlag ? "dg-cell-click" : ""}"></div>
        </td>`);
        }
      }

      returnTemplate.push(`<tr class="dg-row" rowinfo="${rowIdx}" style="height:${rowHeight}px">
        ${cellTemplate.join("")}
      </tr>`);
    }

    return returnTemplate.join("");
  }

  /**
   * cell 선택
   *
   * @private
   * @param {*} startCellInfo
   * @param {number} rowIdx row index
   * @param {number} col cell index
   * @param {HTMLElement} addEle cell element
   * @returns {boolean}
   */
  private setSelectCell(startCellInfo: any, rowIdx: number, col: number, contentEle: HTMLElement, field: FieldItem, item: any) {
    const cellEle = contentEle.parentElement as HTMLElement;

    // field add class
    this.setCellStyleClass(cellEle, rowIdx, col, field, item);

    const classList = cellEle.classList;

    if (startCellInfo.startIdx == rowIdx && startCellInfo.startCol == col) {
      classList.add("selection", "start-cell");
      return;
    }

    if (this.selectionInfo.isAllSelect()) {
      if (this.selectionInfo.isAllSelectUnSelectPosition(rowIdx, col)) {
        classList.remove("selection");
      } else {
        classList.add("selection");
      }
      return;
    }

    if (this.selectionInfo.isSelectPosition(rowIdx, col) && !classList.contains("selection")) {
      classList.add("selection");
      return;
    }

    classList.remove("selection");
  }

  /**
   * cell style 추가
   *
   * @private
   * @param {HTMLElement} cellEle cell element
   * @param {number} rowIdx row index
   * @param {number} col column index
   * @param {FieldItem} field field info
   * @param {*} item item
   */
  private setCellStyleClass(cellEle: HTMLElement, rowIdx: number, col: number, field: FieldItem, item: any) {
    if (!field.styleClass) return;

    const { classList } = cellEle;

    // Determine new class to add
    const newClass = utils.isFunction(field.styleClass) ? field.styleClass({ rowIdx, col, field, item }) : utils.isString(field.styleClass) ? field.styleClass : "";

    // Define base classes that should not be removed
    const baseClasses = new Set(["dg-cell", "start-cell", "selection"]);

    if (newClass) {
      if (!classList.contains(newClass)) {
        classList.add(newClass);
      }

      baseClasses.add(newClass);
    }

    classList.forEach((cls) => {
      if (!baseClasses.has(cls)) {
        classList.remove(cls);
      }
    });
  }
}
