import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { CellInfo, Config, GridElement, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { getCellInfo, getOverCellPosition, isFixedLeftPostion, isFixedRightPostion, isInputField, isMultipleSelection } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, eventPosition, stopPreventCancel } from "src/util/eventUtils";
import SelectionInfo from "src/selection/selection";
import AsideRowCheckRenderer from "src/renderer/view/AsideRowCheckRenderer";
import { getOffset } from "src/util/domUtils";

/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export default class Body {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private bodyOpts: BodyOptions;

  private selectionInfo: SelectionInfo;

  private bodyElement: DaraElement;

  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public allCellMap: any;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.bodyOpts = this.grid.getOptions().body;

    this.grid = grid;

    this.calcBodyDemention();

    this.createTemplate();

    this.initEvent();

    this.selectionInfo = gridMain.selectionInfo;
  }
  public initEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    this.initKeydownEvent();
    this.initCellEvent();
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
    const selectionMode = opts.selectionMode;

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

    let beforeOverCell: any = {};

    const bodyElement = this.bodyElement.getElement();
    eventOn(
      bodyElement,
      "mousedown",
      (e: UIEvent) => {
        if ((e as MouseEvent).button === 3) {
          return true;
        }
        const currentElement = e.target as HTMLElement;
        if (isInputField(currentElement.tagName)) {
          return true;
        }

        const position = getOffset(bodyElement);

        const _l = position.left,
          _r = _l + cfg.dimensions.width - opts.scroll.width;
        const _t = position.top,
          _b = _t + cfg.dimensions.mainBodyHeight;

        console.log("cell click  multipleFlag: ", multipleFlag, _l, _r, _t, _b);

        if (multipleFlag) {
          // mouse darg scroll
          let mouseScrollDirectionX: string;
          let mouseDragDirectionY: string;
          eventOn(document, "touchmove mousemove", (e1: Event) => {
            cfg.isBodyDragging = true;

            const e1Position = eventPosition(e1);

            const movePageX = e1Position.x,
              movePageY = e1Position.y;

            mouseScrollDirectionX = "";
            if (movePageX < _l) {
              mouseScrollDirectionX = "L";
            } else if (movePageX > _r) {
              mouseScrollDirectionX = "R";
            }

            mouseDragDirectionY = "";
            if (movePageY < _t) {
              mouseDragDirectionY = "U";
            } else if (movePageY > _b) {
              mouseDragDirectionY = "D";
            }

            if (bodyDragTimer < 1) {
              let rangeInfo = cfg.selection.range;

              bodyDragTimer = setInterval(() => {
                if (mouseDragDirectionY !== "") {
                  console.log(" mouseDragDirectionY: ", mouseDragDirectionY, rangeInfo);

                  let endRow = -1;
                  if (mouseDragDirectionY == "D") {
                    endRow = rangeInfo.maxRow + 1;
                  } else {
                    endRow = rangeInfo.startRow > rangeInfo.minRow ? rangeInfo.minRow - 1 : rangeInfo.maxRow - 1;
                  }

                  this.selectionInfo.setSelectionRangeInfo(
                    {
                      range: { endRow: endRow } as SelectionRange,
                    } as Selection,
                    false,
                    false
                  );

                  this.gridMain.getScroll().moveVerticalScroll({ pos: mouseDragDirectionY });
                }

                if (mouseScrollDirectionX !== "") {
                  let endCol = -1;

                  if (mouseScrollDirectionX == "R") {
                    endCol = cfg.scroll.insideEndCol + 1;
                  } else {
                    endCol = cfg.scroll.insideStartCol - 1;
                  }

                  this.selectionInfo.setSelectionRangeInfo(
                    {
                      range: { endCol: endCol } as SelectionRange,
                    } as Selection,
                    false,
                    endCol < 0 || endCol >= cfg.dataInfo.colLength
                  );

                  this.gridMain.getScroll().moveHorizontalScroll({ pos: mouseScrollDirectionX });
                }
              }, bodyDragDelay);
            }
          });

          eventOn(document, "touchend mouseup", (e1: Event) => {
            cfg.isBodyDragging = false;
            eventOff(document, "touchmove mousemove touchend mouseup");
            clearInterval(bodyDragTimer);
            bodyDragTimer = -1;
          });
        }

        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;

        if (cellElement == null) return;

        const cellInfo = getCellInfo(cfg, cellElement);

        beforeOverCell = getOverCellPosition(cellInfo);

        const currViewIdx = cfg.scroll.startRow;

        this.setCellClick(e, cellInfo, multipleFlag, selectionMode);

        const newViewIdx = cfg.scroll.startRow;

        if (currViewIdx != newViewIdx) {
          cellInfo.r = cellInfo.r - 1;
        }

        const rowIndex = cellInfo.rowIndex;

        const positionInfo = {
          position: cellElement.getAttribute("data-cell-position"),
          rowItemIdx: rowIndex,
        };

        if (editable === true) {
          if (cellInfo.field.renderer.type == "dropdown") {
            resetClick();
            cfg.edit.enable = true;
            cellInfo.field.$editRenderer.render(cellElement, cellInfo);
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
            if (editable === true) {
              cellInfo.field.$editRenderer.render(cellElement, cellInfo);
              return false;
            }

            const clickRowItem = cellInfo.item;
            if (dblCheckFlag) {
              //cfg.tbodyItem[rowIndex] = this.getRowCheckValue(clickRowItem, !(clickRowItem["_dgRowCheck"] === true));

              asideRowCheckRenderer.$renderer.render(cellInfo.r, cellInfo.c, clickRowItem, this.allCellMap["left"][`${cellInfo.r},${cellInfo.c}`]);
            }

            if (utils.isFunction(fnDblClick)) fnDblClick(cellInfo);
          }
        } else {
          ++clickCnt;
          conserveClick(positionInfo);
        }

        if (!editable) {
          if (utils.isFunction(cellInfo.field.click)) {
            cellInfo.field.$renderer.click(cellInfo);
            return false;
          }
        }

        // row click event
        if (rowClickFlag) {
          if (cellInfo.field.$isAside) {
            return true;
          }

          if (rowClickFn) rowClickFn(cellInfo);
        }

        return true;
      },
      ".dg-cell"
    );

    eventOn(
      bodyElement,
      "mouseover",
      (e: UIEvent) => {
        if (!cfg.isBodyDragging) return;

        if (!multipleFlag) {
          return;
        }

        const eventElement = e.target as HTMLElement;
        const cellElement = eventElement.closest(".dg-cell") as HTMLElement;

        if (cellElement == null) return;

        const cellInfo = getCellInfo(cfg, cellElement);

        const currentOverCell = getOverCellPosition(cellInfo);

        if (beforeOverCell == currentOverCell) return;

        beforeOverCell = currentOverCell;

        const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(selectionMode, cellInfo.c, cfg.dataInfo);

        this.selectionInfo.setSelectionRangeInfo(
          {
            range: {
              endRow: cellInfo.rowIndex,
              endCol: selectRangeInfo.endCol,
            } as SelectionRange,
          } as Selection,
          false,
          true
        );
      },
      ".dg-cell"
    );
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
  private setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string) {
    const cfg = this.grid.config();

    this.gridMain.setGridFocusIn(e);

    const rowIndex = cellInfo.rowIndex,
      colIdx = cellInfo.c;

    const selItem = cellInfo.item;

    if (!isFixedLeftPostion(cfg, colIdx)) {
      if (colIdx < cfg.scroll.insideStartCol) {
        this.gridMain.getScroll().moveHorizontalScroll({ pos: "L", colIdx: colIdx });
      } else if (colIdx > cfg.scroll.insideEndCol) {
        this.gridMain.getScroll().moveHorizontalScroll({ pos: "R", colIdx: colIdx });
      }
    }

    const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(selectionMode, colIdx, cfg.dataInfo, cfg.selection.isMouseDown);

    if (multipleFlag && (e as KeyboardEvent).shiftKey) {
      // shift key
      let rangeInfo = { endRow: rowIndex, endCol: selectRangeInfo.endCol } as SelectionRange;

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
    } else if (multipleFlag && (e as KeyboardEvent).ctrlKey) {
      // ctrl key

      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { startRow: rowIndex, endRow: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
          isSelect: true,
          id: cfg.selection.isSelect ? "add" : "",
          isMouseDown: true,
          startCell: { startRow: rowIndex, startCol: selectRangeInfo.startCol },
        } as Selection,
        false,
        true
      );
    } else {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { startRow: rowIndex, endRow: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
          isSelect: true,
          all: false,
          isMouseDown: true,
          startCell: { startRow: rowIndex, startCol: colIdx },
        } as Selection,
        true,
        true
      );
    }

    /*
    let _r = cellInfo.r;
    // hidden row up
    if (cellInfo.r + 1 > cfg.scroll.viewRow) {
      this.gridMain.getScroll().moveVerticalScroll({ pos: "D" });
      _r = cellInfo.r - 1;
    }

    cfg.currentClickInfo = {
      field: cellInfo.field,
      item: selItem,
      rowIndex: rowIndex,
      c: colIdx,
      r: _r,
    };
    */

    window.getSelection()?.removeAllRanges();
  }

  /**
   * keydown event
   *
   * @private
   */
  private initKeydownEvent() {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const copyMode = opts.copyMode;
    const selectionMode = opts.selectionMode;
    // window keydown 처리.  tabindex 처리 확인 해볼것.

    eventOff(document, "keydown");
    eventOn(document, "keydown", (e: KeyboardEvent) => {
      if (!cfg.focus) return;

      const targetElement = e.target as HTMLElement;

      if (isInputField(targetElement.tagName)) {
        return true;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest(".pubGrid-setting-area")) return true;

      const evtKey = eventKeyCode(e);

      if (e.metaKey || e.ctrlKey) {
        // copy

        if (evtKey == 67) {
          // ctrl+ c
          if (copyMode == "none") {
            return;
          }

          const copyData = "";

          if (selectionMode == "row" && copyMode == "single" && cfg.selection.all !== true) {
            // const startCellInfo = cfg.selection.startCell;
            // const selItem = cfg.currentClickInfo[startCellInfo.startIdx];
            // if (utils.isUndefined(selItem)) {
            //   return;
            // }
            // copyData = opts.tbodyItem[startCellInfo.startIdx][cfg.currentHeaderItems[startCellInfo.startCol].key];
          } else {
            // copyData = _this.selectionData();
          }

          try {
            //utils.copyStringToClipboard(_this.prefix, copyData);
          } catch (e) {
            console.log("Unable to copy", e);
          }
          return;
        } else if (evtKey == 65) {
          // ctrl + a 처리 할것.
          // if (targetElement.closest("#" + _this.prefix + "_pubGrid .pubGrid-setting-wrapper").length > 0) {
          //   return true;
          // }

          //_this.allItemSelect();
          return false;
        } else if (evtKey == 86) {
          // ctrl + v
          //_this.element.pasteArea.focus();
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

        this.gridKeyCtrl(e, evtKey);
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
  private gridKeyCtrl(evt: UIEvent, evtKey: number) {
    const cfg = this.grid.config();
    const scrollCtrl = this.gridMain.getScroll();

    const scrollInfo = cfg.scroll,
      dataInfo = cfg.dataInfo,
      startCell = cfg.selection.startCell;

    console.log(cfg.selection, startCell);

    const endIdx = startCell.startRow,
      endCol = startCell.startCol;

    switch (evtKey) {
      case 34: // PageDown
      case 13: // enter
      case 40: {
        //down

        console.log("enter");

        if (endIdx + 1 >= dataInfo.rowLength) {
          if (endIdx > scrollInfo.startRow + scrollInfo.viewRow) {
            scrollCtrl.moveVerticalScroll({ pos: "M", rowIdx: endIdx });
          }
          return;
        }

        const moveRow = evtKey == 34 ? scrollInfo.viewRow : 1;
        let moveRowIdx = endIdx + moveRow;

        moveRowIdx = moveRowIdx >= dataInfo.rowLength ? dataInfo.rowLength - 1 : moveRowIdx;

        if (this.insideScrollCheck(evtKey, evt, endIdx, endCol, scrollInfo, moveRowIdx, endCol)) {
          // 스크롤 밖에 있을때
          return;
        }

        if (moveRowIdx - scrollInfo.startRow >= scrollInfo.viewRow) {
          scrollCtrl.moveVerticalScroll({ pos: "D", speed: moveRow });
        }

        break;
      }
      case 33: //PageUp
      case 38: {
        //up

        if (endIdx <= 0) {
          if (endIdx < scrollInfo.startRow) {
            scrollCtrl.moveVerticalScroll({ pos: "M", rowIdx: endIdx });
          }
          return;
        }

        const moveRow = evtKey == 33 ? scrollInfo.viewRow : 1;
        let moveRowIdx = endIdx - moveRow;

        moveRowIdx = moveRowIdx > 0 ? moveRowIdx : 0;

        if (this.insideScrollCheck(evtKey, evt, endIdx, endCol, scrollInfo, moveRowIdx, endCol)) {
          // 스크롤 밖에 있을때
          return;
        }

        if (moveRowIdx < scrollInfo.startRow) {
          scrollCtrl.moveVerticalScroll({ pos: "U", speed: moveRow });
        }

        break;
      }
      case 36: // Home
      case 37: {
        //left

        if (endCol <= 0) {
          if (endCol < scrollInfo.startCol) {
            scrollCtrl.moveHorizontalScroll({ pos: "L", colIdx: endCol });
          }
          return;
        }

        let moveColIdx = evtKey == 36 ? 0 : endCol - 1;

        moveColIdx = moveColIdx > 0 ? moveColIdx : 0;

        if (this.insideScrollCheck(evtKey, evt, endIdx, endCol, scrollInfo, endIdx, moveColIdx)) {
          // 스크롤 밖에 있을때
          return;
        }

        if (!isFixedLeftPostion(cfg, moveColIdx) && moveColIdx <= scrollInfo.startCol) {
          scrollCtrl.moveHorizontalScroll({ pos: "L", colIdx: moveColIdx });
        }

        break;
      }
      case 35: // End
      case 9: // tab
      case 39: {
        //right
        if (endCol + 1 >= dataInfo.colLength) {
          if (endCol > scrollInfo.endCol) {
            scrollCtrl.moveHorizontalScroll({ pos: "R", colIdx: endCol });
          }

          return;
        }

        const moveColIdx = evtKey == 35 ? dataInfo.colLength - 1 : endCol + 1;

        if (this.insideScrollCheck(evtKey, evt, endIdx, endCol, scrollInfo, endIdx, moveColIdx)) {
          // 스크롤 밖에 있을때
          return;
        }

        if (!isFixedRightPostion(cfg, moveColIdx) && moveColIdx >= scrollInfo.insideEndCol) {
          scrollCtrl.moveHorizontalScroll({ pos: "R", colIdx: moveColIdx });
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
  private insideScrollCheck(evtKey: number, evt: UIEvent, endIdx: number, endCol: number, scrollInfo: ScrollInfo, moveRowIdx: number, moveColIdx: number) {
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();

    if (utils.isFunction(opts.body.keyNavHandler) && opts.body.keyNavHandler(evt, { key: evtKey, moveCol: moveColIdx, moveRow: moveRowIdx, item: null }) === false) {
      // item 부분 처리 할것. TODO
      //item: cfg.getItems(moveRowIdx) }) === false) {
      return false;
    }

    //this.setRangeInfo(ctx, evtKey, evt, moveRowIdx, moveColIdx);

    let reFlag = false;
    if (endIdx < scrollInfo.startRow || endIdx > scrollInfo.startRow + scrollInfo.viewRow) {
      reFlag = true;
    }

    if (!isFixedLeftPostion(cfg, moveColIdx)) {
      if (endCol < scrollInfo.startCol) {
        reFlag = true;
      } else if (endCol > scrollInfo.endCol) {
        reFlag = true;
      }
    }
    return reFlag;
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
    const items = opts.items;
    const cfg = this.grid.config();
    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;
    const enableLeftField = rightFields.length > 0;
    const enableRightField = rightFields.length > 0;

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement, startCol: 0 },
      { name: "center", fields: centerFields, element: this.centerElement, startCol: fixedLeftIndex },
      { name: "right", fields: rightFields, element: this.rightElement, startCol: fixedRightIndex },
    ];

    let viewRow = cfg.scroll.viewRow;
    const startRow = cfg.scroll.startRow;

    const currentViewRow = viewRow < cfg.dataInfo.rowLength - startRow ? viewRow : cfg.dataInfo.rowLength - startRow;
    const beforeViewRow = cfg.scroll.before.viewRow;

    if (beforeViewRow > 1 && beforeViewRow > viewRow) {
      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        for (let i = viewRow; i < beforeViewRow; i++) {
          let trEle = element.find(`.dg-row[rowinfo="${i}"]`);
          trEle.parentNode?.removeChild(trEle);
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

    this.bodyElement.attr({ "data-striped-type": startRow % 2 == 0 ? "odd" : "even" });

    const startCol = cfg.fixedLeftIndex + cfg.scroll.startCol;
    const endCol = cfg.fixedLeftIndex + cfg.scroll.endCol;

    //console.log(mode, "dataDraw", currentViewRow, viewRow, startCol, endCol, fieldGroups);

    const leafAllFields = cfg.currentFields;

    //const start = performance.now();
    if (opts.scroll.vertical.enable === false && !utils.isEmpty(mode)) {
      return;
    }

    for (let i = 0; i < currentViewRow; i++) {
      const startRowIdx = startRow + i;
      let item = items[startRowIdx];

      // left panel
      if (enableLeftField) {
        leftFields.forEach((field, j) => {
          field.$renderer.render(startRowIdx, j, item, this.allCellMap["left"][`${i},${j}`]);
        });
      }

      for (let j = startCol; j <= endCol; j++) {
        const field = leafAllFields[j];
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["center"][`${i},${j}`]);
      }

      // right panel
      if (enableRightField) {
        rightFields.forEach((field, j) => {
          field.$renderer.render(startRowIdx, j, item, this.allCellMap["right"][`${i},${fixedRightIndex + j}`]);
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
  private rowTemplate(startRowIdx: number, rowCount: number, rowHeight: number, fields: FieldItem[], startCol: number): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = startRowIdx + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let clickFlag = field.click;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + (startCol + j)}">
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
}
