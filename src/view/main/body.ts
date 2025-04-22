import { BodyOptions, GridOptions, HeaderOptions } from "@t/GridOptions";
import { Config, GridElement, ScrollInfo, Selection } from "@t/GridConfig";

import { addStyleTag } from "../../util/styleUtils";
import { isFixedLeftPostion, isFixedRightPostion, isInputField } from "../../util/gridUtils";
import DaraGrid from "src/DaraGrid";
import { FieldItem } from "@t/GridField";
import * as utils from "src/util/utils";
import { ALIGN_STYLE } from "src/constants";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { eventKeyCode, eventOff, eventOn, stopPreventCancel } from "src/util/eventUtils";
import SelectionInfo from "src/selection/selection";

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
    // body  selection 처리.
    // cell event 처리할것.
    //
    const mainElement = this.gridMain.mainElement().getElement();
    eventOn(
      mainElement,
      "mousedown",
      (e: UIEvent) => {
        if (e.which === 3) {
          return true;
        }
        const currentElement = e.target as HTMLElement;
        if (isInputField(currentElement.tagName)) {
          return true;
        }

        const cfg = this.grid.config();
        const opts = this.grid.getOptions();
        // 처리 할것.
        /*
      const position = {left:0, top:0};

      const _l = position.left,
        _r = _l + cfg.dimensions..width - _this.options.scroll.vertical.width;
      const _t = position.top,
        _b = _t + _this.config.container.bodyHeight;

      if (multipleFlag) {
        // mouse darg scroll
        $(document)
          .on("touchmove.pubgrid.body.drag mousemove.pubgrid.body.drag", function (e1) {
            _this.config.isBodyDragging = true;

            const evtInfo1 = evtPos(e1);

            const movePageX = evtInfo1.x,
              movePageY = evtInfo1.y;

            _this.config.mouseScrollDirectionX = false;
            if (movePageX < _l) {
              _this.config.mouseScrollDirectionX = "L";
            } else if (movePageX > _r) {
              _this.config.mouseScrollDirectionX = "R";
            }

            _this.config.mouseDragDirectionY = false;
            if (movePageY < _t) {
              _this.config.mouseDragDirectionY = "U";
            } else if (movePageY > _b) {
              _this.config.mouseDragDirectionY = "D";
            }

            if (!bodyDragTimer) dragScrollMove(_this);
          })
          .on("touchend.pubgrid.body.drag mouseup.pubgrid.body.drag mouseleave.pubgrid.body.drag", function (e1) {
            _this.config.isBodyDragging = false;
            $(document).off("touchmove.pubgrid.body.drag mousemove.pubgrid.body.drag").off("touchend.pubgrid.body.drag mouseup.pubgrid.body.drag mouseleave.pubgrid.body.drag");
            clearInterval(bodyDragTimer);
            bodyDragTimer = false;
          });
      }

      const sEle = $(this);

      const cellInfo = _$util.getCellInfo(_this, sEle);

      const currViewIdx = _this.config.scroll.viewIdx;

      _this.setCellClick(e, cellInfo, multipleFlag, selectionMode);

      const newViewIdx = _this.config.scroll.viewIdx;

      if (currViewIdx != newViewIdx) {
        cellInfo.r = cellInfo.r - 1;
      }

      const colIdx = cellInfo.c;
      const rowItemIdx = cellInfo.rowItemIdx;

      const positionInfo = {
        position: sEle.attr("data-cell-position"),
        rowItemIdx: rowItemIdx,
      };

      if (editable === true) {
        if (cellInfo.colInfo.renderer.type == "dropdown") {
          resetClick();
          _$renderer.editCell(_this, cellInfo, e);
          return false;
        }

        if (clickCnt == 0) {
          _$renderer.editAreaClose(_this); // 이전 에디트창 닫기
        }
      }

      if (clickCnt > 0 && currentCellPosition.position == positionInfo.position && currentCellPosition.rowItemIdx == positionInfo.rowItemIdx) {
        // double click 처리.
        conserveClick(positionInfo);
        resetClick();

        if (dobleClickEventFlag) {
          if (editable === true) {
            _$renderer.editCell(_this, cellInfo, e);
            return false;
          }

          const clickRowItem = cellInfo.rowItem;
          if (dblCheckFlag) {
            _this.options.tbodyItem[rowItemIdx] = _this.getRowCheckValue(clickRowItem, clickRowItem["_pubcheckbox"] === true ? false : true);

            const addEle = $pubSelector("#" + _this.prefix + "_bodyContainer .pubGrid-body-aside-cont").querySelector('[data-aside-position="' + cellInfo.r + ',checkbox"]>.aside-content');

            _$util.setCheckBoxCheck(addEle, clickRowItem);
          }

          fnDblClick.call(sEle, { item: clickRowItem, r: rowItemIdx, c: colIdx, keyItem: cellInfo.colInfo });
        }
      } else {
        ++clickCnt;
        conserveClick(positionInfo);
      }

      if (!editable) {
        const renderEle = $(e.target).closest(".pub-render-element");

        if (renderEle.length > 0) {
          // render item click 처리.
          if (isFunction(cellInfo.colInfo.renderer.click)) {
            cellInfo.colInfo.renderer.click.call(null, {
              r: rowItemIdx,
              c: colIdx,
              item: cellInfo.rowItem,
            });
            return false;
          }
        }
      }

      if (isFunction(cellInfo.colInfo.colClick)) {
        cellInfo.colInfo.colClick.call(this, colIdx, {
          r: rowItemIdx,
          c: colIdx,
          item: cellInfo.rowItem,
        });
        return true;
      }
      // row click event
      if (rowClickFlag) {
        if (sEle.closest(".pubGrid-body-aside-cont").length > 0) {
          return true;
        }
        const clickInfo = _this.getCurrentClickInfo();
        rowClickFn.call(null, { rowItemIdx: clickInfo.rowItemIdx, item: clickInfo.item });
      }

      return true;
      */
      },
      ".pub-body-td"
    );

    eventOn(
      mainElement,
      "mouseover",
      (e: UIEvent) => {
        /*
      if (!_this.config.isBodyDragging) return;

      if (!(selectionMode == "multiple-row" || selectionMode == "multiple-cell")) {
        return;
      }

      const cellInfo = _$util.getCellInfo(_this, $(this));

      const selectRangeInfo = _$util.getSelectionModeColInfo(selectionMode, cellInfo.c, _this.config.dataInfo);

      _$util.setSelectionRangeInfo(
        _this,
        {
          rangeInfo: {
            endIdx: cellInfo.rowItemIdx,
            endCol: selectRangeInfo.endCol,
          },
        },
        false,
        true
      );

      */
      },
      ".pub-body-td"
    );
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

    const fieldGroups = [
      { name: "left", fields: leftFields, element: this.leftElement },
      { name: "center", fields: centerFields, element: this.centerElement },
      { name: "right", fields: rightFields, element: this.rightElement },
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

      fieldGroups.forEach(({ fields, element }) => {
        if (fields.length === 0) return;
        element.findDaraElement(".dg-body-table > tbody").append(this.rowTemplate(beforeViewRow, addViewRow, rowHeight, fields));
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

    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    //console.log(mode, "dataDraw", currentViewRow, viewRow, startCol, endCol);

    //const start = performance.now();
    if (opts.scroll.vertical.enable === false && !utils.isEmpty(mode)) {
      return;
    }

    for (let i = 0; i < currentViewRow; i++) {
      const startRowIdx = startRow + i;
      let item = items[startRowIdx];

      // left panel
      leftFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["left"][`${i},${j}`]);
      });

      // center panel
      for (let j = startCol; j <= endCol; j++) {
        const field = centerFields[j];
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["center"][`${i},${j}`]);
      }

      // right panel
      rightFields.forEach((field, j) => {
        field.$renderer.render(startRowIdx, j, item, this.allCellMap["right"][`${i},${j}`]);
      });
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
    if (type == "left") {
      leafFields = cfg.fieldHeaderGroup.leafLeft;
    } else if (type == "right") {
      leafFields = cfg.fieldHeaderGroup.leafRight;
    } else {
      leafFields = cfg.fieldHeaderGroup.leafCenter;
    }

    const viewRow = cfg.scroll.viewRow;
    const leafLength = leafFields.length;

    if (viewRow < 1 || leafLength < 1) return "";

    let colGroupHtm = [];
    let colGroupIdx = 0;
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
  private rowTemplate(startRowIdx: number, rowCount: number, rowHeight: number, fields: FieldItem[]): any {
    const returnTemplate = [];

    for (let i = 0; i < rowCount; i++) {
      let rowIdx = startRowIdx + i;

      let cellTemplate = [];
      for (let j = 0; j < fields.length; j++) {
        let field = fields[j];
        let clickFlag = field.click;

        if (field.$isAside) {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + j}">
          <div role="presentation" class="dg-cell-content ${field.$alignStyle}"></div>
        </td>`);
        } else {
          cellTemplate.push(`<td scope="col" class="dg-cell" data-cell-position="${rowIdx + "," + j}">
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
