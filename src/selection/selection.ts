import { GridOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo, initSelectionRange } from "../defaultGridConfig";
import { isMultipleSelection, isRowSelection } from "src/util/gridUtils";
import GridMain from "src/view/GridMain";
import { removeClass } from "src/util/styleUtils";
import { hasClass } from "src/util/domUtils";
import { isShiftKey } from "src/util/eventUtils";

export default class SelectionInfo {
  private readonly gridMain: GridMain;

  private readonly options: GridOptions;
  private readonly config: Config;

  /**
   * select id number
   *
   * @private
   * @type {number}
   */
  private serialNumber = 0;

  constructor(gridMain: GridMain, options: GridOptions, config: Config) {
    this.gridMain = gridMain;
    this.options = options;
    this.config = config;

    this.config.selection = initSelectionInfo();
  }

  public setSelectionRangeInfo(changeSelection: Selection, initFlag?: boolean, cellSelectFlag?: boolean) {
    if (initFlag !== true && this.isAllSelect()) {
      return;
    }

    if (initFlag) {
      this.serialNumber = 0;
    }

    const cfg = this.config;
    const changeRangeInfo = changeSelection.range;
    let currentSelection = initFlag ? initSelectionInfo() : cfg.selection;
    currentSelection = this.setSelectionInfo(currentSelection, changeSelection);

    // const stack = new Error().stack;

    // if (stack) {
    //   console.log("호출한 함수:", stack);
    // }

    console.log("cellSelectFlag : ", cellSelectFlag, changeRangeInfo);

    if (currentSelection.range.mode == "remove") {
      currentSelection.range = initSelectionRange();
    } else {
      if (utils.isUndefined(changeRangeInfo)) return;

      const lastRowIdx = cfg.dataInfo.lastRow;
      const lastCol = cfg.dataInfo.colLength - 1;

      let rangeInfo = currentSelection.range;

      rangeInfo.startIdx = Math.min(Math.max(rangeInfo.startIdx, 0), lastRowIdx);
      rangeInfo.endIdx = Math.min(Math.max(rangeInfo.endIdx, 0), lastRowIdx);

      rangeInfo.startCol = Math.min(Math.max(rangeInfo.startCol, 0), lastCol);
      rangeInfo.endCol = Math.min(Math.max(rangeInfo.endCol, 0), lastCol);

      rangeInfo.minIdx = Math.min(rangeInfo.startIdx, rangeInfo.endIdx);
      rangeInfo.maxIdx = Math.max(rangeInfo.endIdx, rangeInfo.startIdx);
      rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
      rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);

      currentSelection.allRange[currentSelection.id] = rangeInfo;
    }

    let selectionMinIdx = Infinity,
      selectionMaxIdx = -1;
    let selectionMinCol = Infinity,
      selectionMaxCol = -1;

    for (const sel of Object.values(currentSelection.allRange)) {
      selectionMinIdx = Math.min(selectionMinIdx, sel.minIdx);
      selectionMaxIdx = Math.max(selectionMaxIdx, sel.maxIdx);
      selectionMinCol = Math.min(selectionMinCol, sel.minCol);
      selectionMaxCol = Math.max(selectionMaxCol, sel.maxCol);
    }

    currentSelection.minIdx = selectionMinIdx;
    currentSelection.maxIdx = selectionMaxIdx;
    currentSelection.minCol = selectionMinCol;
    currentSelection.maxCol = selectionMaxCol;

    if (cellSelectFlag) {
      this.setCellSelection();
    }

    this.gridMain.getFooter().setSelectionStatus();
  }

  /**
   * set selection info
   *
   * @public
   * @param {Selection} currentSelection change selection info
   * @param {SelectionRange} changeSelection changeRangeInfo
   * @returns {*}
   */
  public setSelectionInfo(currentSelection: Selection, changeSelection: Selection) {
    const currentRange = currentSelection.range;
    const beforeSelectionId = currentSelection.id;
    const selectionInfo = utils.merge(currentSelection, changeSelection);

    const mode = changeSelection.mode;

    if (mode == "add") {
      if (changeSelection.id) {
        if (beforeSelectionId != changeSelection.id) {
          ++this.serialNumber;
        }
        selectionInfo.id = changeSelection.id;
      } else {
        selectionInfo.id = this.getSelectionId("add");
      }

      selectionInfo.range.mode = "add";

      const selectionId = selectionInfo.id;
      // shift 누르고 header 클릭시 버그 수정할것.
      //

      if (selectionId.startsWith("col-")) {
        // range 에 우선순위 적용해서 selection 처리 할것.
        // current 에서 drag 시 나 shift일때 unselection position 이 있으면 정보 삭제.

        // 1 번 startCol == endCol 같고

        const startCol = changeSelection.range.startCol;

        console.log("::::::::::: ", startCol, changeSelection.range.endCol);

        if (startCol == changeSelection.range.endCol) {
          const allRange = selectionInfo.allRange;

          for (let key in allRange) {
            if (key.startsWith("col-")) {
              const rangeInfo = allRange[key];

              if (rangeInfo.startCol == rangeInfo.endCol && rangeInfo.startCol == startCol) {
                selectionInfo.range.mode = "remove";
                delete selectionInfo.allRange[key];
                delete selectionInfo.unSelectPosition[key];
                break;
              } else if (rangeInfo.minCol <= startCol && startCol <= rangeInfo.maxCol) {
                selectionInfo.range = currentRange;

                if (this.isUnSelection(0, startCol)) {
                  delete selectionInfo.unSelectPosition["col-" + startCol];
                } else {
                  selectionInfo.unSelectPosition["col-" + startCol] = rangeInfo.index;
                }
              }
            }
          }
        }
      } else {
        delete selectionInfo.unSelectPosition[selectionId];
      }
    } else if (mode == "remove") {
      selectionInfo.range.mode = "remove";
      delete selectionInfo.allRange[selectionInfo.id];
    }

    console.log("selectionInfo.range : ", selectionInfo.id, selectionInfo.range.index, this.serialNumber, selectionInfo.range.index != this.serialNumber ? this.serialNumber : selectionInfo.range.index);

    selectionInfo.range.index = selectionInfo.range.index != this.serialNumber ? this.serialNumber : selectionInfo.range.index;

    this.config.selection = selectionInfo;

    return selectionInfo;
  }

  /**
   * @method isRangeKey
   * @description header , col 선택 여부 확인
   */
  public isRangeKey(key: string): boolean {
    return this.config.selection.allRange.hasOwnProperty(key);
  }

  /**
   * is all cell selection
   *
   * @public
   * @returns {*} boolean
   */
  public isAllSelect() {
    return this.config.selection.all;
  }

  /**
   * cell all selection
   *
   * @public
   * @param {boolean} flag all selection true|false
   */
  public setAllSelection(flag: boolean) {
    this.config.selection.all = flag;
    this.setCellSelection();
    this.gridMain.getFooter().setSelectionStatus();
  }

  /**
   * @method selectionData
   * @description select data 구하기.
   */
  public selectionData(dataType: "text" | "json" = "text", isSummary: boolean = false): any {
    console.log("selectionData : ");

    const { items, currentFields, selection, dataInfo } = this.config;
    const isJson = dataType === "json";

    if (dataInfo.rowLength < 1) return isJson ? {} : "";

    const isAll = this.isAllSelect();

    const startCol = isAll ? 0 : selection.minCol;
    const endCol = isAll ? dataInfo.colLength - 1 : selection.maxCol;
    const startIdx = isAll ? 0 : selection.minIdx;
    const endIdx = isAll ? dataInfo.lastRow : selection.maxIdx;

    if (startIdx < 0 || endIdx < 0) return isJson ? {} : "";

    const result = [];
    const keyInfoMap = {} as any;
    const summary = { count: 0, numbers: [] as number[] };

    for (let i = startIdx; i <= endIdx; i++) {
      const item = items[i];

      const rowText: string[] = [];
      const rowJson: any = { _dgIdx: i };
      let hasSelection = false;

      for (let j = startCol; j <= endCol; j++) {
        const col = currentFields[j];

        if (col.hidden) continue;

        const colName = col.name;

        const selected = !this.isUnSelection(i, j) && (isAll || this.isSelection(i, j));

        const cellValue = selected ? col.$renderer.getValue(item) : "";

        if (isJson) {
          rowJson[colName] = cellValue;
        } else {
          rowText.push(cellValue);
        }

        if (selected) {
          hasSelection = true;

          keyInfoMap[j] = col;

          if (!utils.isBlank(cellValue)) {
            summary.count++;
            if (utils.isNumber(cellValue)) {
              summary.numbers.push(Number(cellValue));
            }
          }
        }
      }

      if (hasSelection) {
        result.push(isJson ? rowJson : rowText.join("\t"));
      }
    }

    if (!isJson) {
      return result.join("\n");
    }

    const headers = Object.values(keyInfoMap);
    let summaryInfo = {
      count: summary.count,
      numFieldCount: summary.numbers.length,
      min: -1,
      max: -1,
      avg: "",
      sum: -1,
    };

    if (isSummary && summary.numbers.length > 0) {
      summaryInfo.min = Math.min(...summary.numbers);
      summaryInfo.max = Math.max(...summary.numbers);
      summaryInfo.sum = summary.numbers.reduce((a, b) => a + b, 0);
      summaryInfo.avg = summary.numbers.length ? (summaryInfo.sum / summary.numbers.length).toFixed(1) : "0";
    }

    return {
      header: headers,
      data: result,
      summary: summaryInfo,
    };
  }

  /**
   * selection check
   *
   * @public
   * @param {number} rowIdx row index
   * @param {number} col cell index
   * @returns {boolean} selection return
   */
  public isSelection(rowIdx: number, col: number): boolean {
    const allRange = this.config.selection.allRange;

    if (this.isUnSelection(rowIdx, col)) {
      return false;
    }

    for (const key in allRange) {
      if (this.isSelRange(allRange[key], rowIdx, col)) {
        return true;
      }
    }

    return false;
  }

  /**
   * cell all 선택시 선택 여부
   *
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isUnSelection(rowIdx: number, col: number): boolean {
    if (this.config.selection.unSelectPosition.hasOwnProperty("col-" + col)) {
      return true;
    }

    if (this.config.selection.unSelectPosition.hasOwnProperty(rowIdx + "," + col)) {
      return true;
    }

    return false;
  }

  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isSelRange(range: SelectionRange, rowIdx: number, col: number): boolean {
    return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol <= col && col <= range.maxCol;
  }

  /**
   * cell select
   *
   * @public
   * @param {boolean} initFlag
   */
  public setCellSelection() {
    const cfg = this.config;
    const { selection, scroll, dataInfo, fixedLeftIndex, fixedRightIndex } = cfg;
    const { startCell } = selection;
    const isAllSelection = this.isAllSelect();

    const startRow = 0;
    const endRow = scroll.viewRow;
    const startCol = isAllSelection ? 0 : selection.minCol;
    const endCol = isAllSelection ? dataInfo.colLength : selection.maxCol;
    const scrollStartIdx = scroll.startIdx;

    const allCellElements = this.gridMain.getBody().allCellElements;
    const { left: leftElements, center: centerElements, right: rightElements } = allCellElements;

    const enableLeftField = fixedLeftIndex > 0 && fixedLeftIndex > startCol;
    const enableRightField = fixedRightIndex > 0 && fixedRightIndex < endCol;

    const { startIdx: startCellIdx, startCol: startCellCol } = startCell;
    const minFixedLeftCol = Math.min(fixedLeftIndex - 1, endCol);
    const minScrollEndCol = Math.min(scroll.endCol, endCol);

    this.clearSelectionCell();

    for (let i = startRow; i < endRow; i++) {
      const currRow = scrollStartIdx + i;

      // 왼쪽 고정 영역
      if (enableLeftField) {
        for (let j = 0; j <= minFixedLeftCol; j++) {
          this.setCellSelectionStyleClass(leftElements[`${i},${j}`], currRow, j, startCellIdx, startCellCol);
        }
      }

      // 중앙 스크롤 영역
      for (let j = scroll.startCol; j <= minScrollEndCol; j++) {
        this.setCellSelectionStyleClass(centerElements[`${i},${j}`], currRow, j, startCellIdx, startCellCol);
      }

      // 오른쪽 고정 영역
      if (enableRightField) {
        for (let j = fixedRightIndex; j <= endCol; j++) {
          this.setCellSelectionStyleClass(rightElements[`${i},${j}`], currRow, j, startCellIdx, startCellCol);
        }
      }
    }
  }

  /**
   * add cell selection style class
   * @param cellEle cell htmlelement
   * @param rowIdx row index
   * @param col col
   * @param startIdx start row index
   * @param startCol start cell
   * @returns
   */
  public setCellSelectionStyleClass(cellEle: HTMLElement, rowIdx: number, col: number, startIdx: number, startCol: number) {
    const classList = cellEle.classList;

    if (startIdx == rowIdx && startCol == col) {
      classList.add("selection", "start-cell");
      return;
    }

    if (this.isAllSelect() || this.isSelection(rowIdx, col)) {
      if (!classList.contains("selection")) classList.add("selection");
      return;
    }

    if (classList.contains("selection")) classList.remove("selection");
  }

  /**
   * clear selection cell
   *
   */
  public clearSelectionCell() {
    removeClass(this.gridMain.getBody().bodyElement.finds(".dg-cell.selection"), "selection");
  }

  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  public getSelectionRangeInfo() {
    const rangeInfo = this.config.selection.range;

    let selectionStartIdx = rangeInfo.minIdx,
      selectionEndIdx = rangeInfo.maxIdx,
      startRow = -1,
      endRow = -1;

    if (this.config.scroll.startIdx >= selectionStartIdx) {
      startRow = 0;
    } else {
      startRow = selectionStartIdx - this.config.scroll.startIdx;
    }

    if (this.config.scroll.startIdx + this.config.scroll.viewRow <= selectionEndIdx) {
      endRow = this.config.scroll.viewRow;
    } else {
      endRow = selectionEndIdx - this.config.scroll.startIdx;
    }

    return {
      startRow: startRow,
      endRow: endRow,
      startCol: rangeInfo.minCol,
      endCol: rangeInfo.maxCol,
    };
  }

  /**
   * selection mode col info
   *
   * @public
   * @param {string} selectionMode selection mode
   * @param {number} col col
   * @param {*} dataInfo
   * @param {boolean} isMouseDown
   * @returns {{ startCol: number; endCol: number; }}
   */
  public getSelectionModeColInfo(selectionMode: string, col: number, cfg: Config, cellElement: HTMLElement, isMouseDown?: boolean) {
    let startCol = col,
      endCol = col;

    if (isRowSelection(selectionMode)) {
      startCol = 0;
      endCol = cfg.dataInfo.colLength - 1;
    } else if (selectionMode == "multiple-cell") {
      if (isMouseDown) {
        startCol = -1;
      } else if (hasClass(cellElement, "line-number")) {
        startCol = 0;
        endCol = cfg.dataInfo.colLength - 1;
      } else {
        startCol = col;
      }
    }

    return { startCol: startCol, endCol: endCol };
  }

  /**
   * set range info
   *
   * @public
   * @param {number} evtKey event key
   * @param {Event} evt event
   * @param {number} endIdx end row index
   * @param {number} moveCol  move cell position
   */
  public setRangeInfo(evtKey: number, evt: Event, endIdx: number, moveCol: number) {
    let startCol = moveCol,
      endCol = moveCol;

    if (isRowSelection(this.options.selectionMode)) {
      startCol = 0;
      endCol = this.config.dataInfo.colLength - 1;
    }

    let multipleFlag = isMultipleSelection(this.options.selectionMode);

    if (multipleFlag && evtKey != 9 && isShiftKey(evt)) {
      this.setSelectionRangeInfo(
        {
          range: { endIdx: endIdx, endCol: endCol },
          startCell: { startIdx: endIdx, startCol: moveCol },
        } as any,
        false,
        true
      );
    } else {
      this.setSelectionRangeInfo(
        {
          range: { startIdx: endIdx, endIdx: endIdx, startCol: startCol, endCol: endCol },
          startCell: { startIdx: endIdx, startCol: moveCol },
        } as any,
        true,
        true
      );
    }
  }

  /**
   * selection id
   *
   * @public
   * @param {?string} [type] selection type
   * @returns {string} selection id
   */
  public getSelectionId(type?: string): string {
    if (type) {
      return type + ++this.serialNumber;
    }

    return "auto" + ++this.serialNumber;
  }
}
