import { GridOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, getCellPosition, isRowSelection } from "src/util/gridUtils";
import DaraGrid from "src/DaraGrid";
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
    const cfg = this.config;
    const changeRangeInfo = changeSelection.range;
    let currentSelection = initFlag ? initSelectionInfo() : cfg.selection;
    currentSelection = this.setSelectionInfo(currentSelection, changeSelection);

    const lastRowIdx = cfg.dataInfo.lastRow;
    const lastCol = cfg.dataInfo.colLength - 1;

    if (initFlag) {
      currentSelection.allRange[currentSelection.id] = currentSelection.range;
    }

    // const stack = new Error().stack;

    // if (stack) {
    //   console.log("호출한 함수:", stack);
    // }

    let isRangeInfo = utils.isUndefined(changeRangeInfo);

    let rangeInfo = currentSelection.range;

    rangeInfo.startIdx = Math.min(Math.max(rangeInfo.startIdx, 0), lastRowIdx);
    rangeInfo.endIdx = Math.min(Math.max(rangeInfo.endIdx, 0), lastRowIdx);

    rangeInfo.startCol = Math.min(Math.max(rangeInfo.startCol, 0), lastCol);
    rangeInfo.endCol = Math.min(Math.max(rangeInfo.endCol, 0), lastCol);

    currentSelection.minIdx = Math.min(currentSelection.minIdx == -1 ? rangeInfo.startIdx : currentSelection.minIdx, rangeInfo.startIdx, rangeInfo.endIdx);
    currentSelection.maxIdx = Math.max(currentSelection.maxIdx == -1 ? rangeInfo.endIdx : currentSelection.maxIdx, rangeInfo.endIdx, rangeInfo.startIdx);

    currentSelection.minCol = Math.min(currentSelection.minCol == -1 ? rangeInfo.startCol : currentSelection.minCol, rangeInfo.endCol, rangeInfo.startCol);
    currentSelection.maxCol = Math.max(currentSelection.maxCol == -1 ? rangeInfo.endCol : currentSelection.maxCol, rangeInfo.endCol, rangeInfo.startCol);

    if (isRangeInfo) return;

    rangeInfo.minIdx = Math.min(rangeInfo.startIdx, rangeInfo.endIdx);
    rangeInfo.maxIdx = Math.max(rangeInfo.endIdx, rangeInfo.startIdx);
    rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
    rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);

    //console.log("JSON.stringify(rangeInfo) : ", JSON.stringify(currentSelection));

    currentSelection.allRange[currentSelection.id] = rangeInfo;

    if (cellSelectFlag) {
      this.setCellSelect(initFlag);
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
    const selectionInfo = utils.merge(currentSelection, changeSelection);

    const mode = changeSelection.mode;

    if (mode == "add") {
      selectionInfo.id = this.getSelectionId("add");
      selectionInfo.range.mode = "add";

      const rangeKey = changeSelection.range._key ?? selectionInfo.id;

      if (this.isRangeKey(rangeKey)) {
        selectionInfo.range.mode = "remove";
        delete selectionInfo.allRange[rangeKey];
      } else {
        selectionInfo.allRange[rangeKey] = changeSelection;
      }
    } else if (mode == "remove") {
      selectionInfo.id = this.getSelectionId("remove");
      selectionInfo.range.mode = "remove";
      const rangeKey = changeSelection.range._key ?? selectionInfo.id;
      delete selectionInfo.allRange[rangeKey];
    }

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
    this.setCellSelect(false);
    this.gridMain.getFooter().setSelectionStatus();
  }

  /**
   * @method selectionData
   * @description select data 구하기.
   */
  public selectionData(dataType: "text" | "json" = "text", isSummary: boolean = false): any {
    const { items, currentFields, selection, dataInfo } = this.config;

    if (dataInfo.rowLength < 1) return dataType === "json" ? {} : "";

    const isAll = this.isAllSelect();

    const startCol = isAll ? 0 : selection.minCol;
    const endCol = isAll ? dataInfo.colLength - 1 : selection.maxCol;
    const startIdx = isAll ? 0 : selection.minIdx;
    const endIdx = isAll ? dataInfo.lastRow : selection.maxIdx;

    if (startIdx < 0 || endIdx < 0) return dataType == "json" ? {} : "";

    const result = [];
    const keyInfoMap = {} as any;
    const summary = { count: 0, numbers: [] as number[] };
    const isJson = dataType === "json";

    for (let i = startIdx; i <= endIdx; i++) {
      const item = items[i];

      const rowText: string[] = [];
      const rowJson: any = { _dgIdx: i };
      let hasSelected = false;

      for (let j = startCol; j <= endCol; j++) {
        const col = currentFields[j];

        if (col.hidden) continue;

        const colName = col.name;

        const selected = isAll ? !this.isAllSelectUnSelectPosition(i, j) : this.isSelectPosition(i, j);

        const val = selected ? col.$renderer.getValue(item) : "";

        if (selected) {
          hasSelected = true;

          if (isJson) {
            keyInfoMap[j] = col;
            rowJson[colName] = val;

            if (!utils.isBlank(val)) {
              summary.count++;
              if (utils.isNumber(val)) {
                summary.numbers.push(Number(val));
              }
            }
          } else {
            rowText.push(val);
          }
        } else {
          if (isJson) {
            rowJson[colName] = "";
          } else rowText.push("");
        }
      }

      if (hasSelected) {
        result.push(isJson ? rowJson : rowText.join("\t"));
      }
    }

    if (isJson) {
      const headers = Object.values(keyInfoMap);
      let summaryInfo = {};

      if (isSummary) {
        let sum = -1;
        let avg: any = -1;
        let min = -1;
        let max = -1;
        if (summary.numbers.length > 0) {
          sum = summary.numbers.reduce((a, b) => a + b, 0);
          avg = summary.numbers.length ? (sum / summary.numbers.length).toFixed(1) : 0;
          min = Math.min(...summary.numbers);
          max = Math.max(...summary.numbers);
        }

        summaryInfo = {
          count: summary.count,
          min: min,
          max: max,
          sum,
          avg,
          numFieldCount: summary.numbers.length,
        };
      }

      return {
        header: headers,
        data: result,
        summary: summaryInfo,
      };
    }

    return result.join("\n");
  }

  public isSelectPosition(rowIdx: number, col: number, currFlag?: boolean): boolean {
    //console.log("$$$ isSelectPosition : ", rowIdx, col, currFlag, this.config.selection.unSelectPosition);

    if (this.config.selection.unSelectPosition.hasOwnProperty(rowIdx + "," + col)) {
      return false;
    }
    if (currFlag) {
      return this.isSelRange(this.config.selection.range, rowIdx, col);
    } else {
      const allRange = this.config.selection.allRange;

      for (const key in allRange) {
        //console.log("allRange : ", rowIdx, col, key, allRange[key]);

        if (this.isSelRange(allRange[key], rowIdx, col)) {
          return true;
        }
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
  public isAllSelectUnSelectPosition(rowIdx: number, col: number): boolean {
    return this.config.selection.unSelectPosition.hasOwnProperty(rowIdx + "," + col);
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
  public setCellSelect(initFlag?: boolean) {
    const cfg = this.config;
    const currentId = cfg.selection.mode;
    const startCellInfo = cfg.selection.startCell; // start cell
    const isAllSelection = this.isAllSelect();

    //console.log("setCellSelect : ", colInfo);
    let startRow = 0,
      endRow = 0,
      startCol = 0,
      endCol = 0,
      scrollStartIdx = cfg.scroll.startIdx;

    if (isAllSelection) {
      endRow = cfg.scroll.viewRow;
      endCol = cfg.dataInfo.colLength - 1;
    } else {
      const colInfo = this.getSelectionRangeInfo();
      startRow = colInfo.startRow;
      endRow = colInfo.endRow;
      startCol = colInfo.startCol;
      endCol = colInfo.endCol;
    }

    //console.log(`11111111 ::initFlag .: ${initFlag} `, scrollStartIdx, startCellInfo.startIdx, isAllSelection, startRow, endRow, startCol, endCol);

    const bodyElement = this.gridMain.getBody().bodyElement;

    if (cfg.selection.range.mode == "remove") {
      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          const cellPosition = i + "," + j;

          let addEle = bodyElement.find('[data-cell-position="' + cellPosition + '"]');

          if (addEle == null) continue;

          cfg.selection.unSelectPosition[cellPosition] = "";

          addEle.removeAttribute("data-selection-id");
          addEle.classList.remove("selection");
        }
      }
      return;
    }

    if (initFlag) {
      this.clearSelectionCell();
    } else {
      bodyElement.finds(".dg-cell.selection").forEach((cellNode, idx) => {
        const cellElement = cellNode as HTMLElement;
        const posInfo = getCellPosition(cellElement);
        if (!this.isSelectPosition(scrollStartIdx + posInfo.r, posInfo.c)) {
          cellElement.classList.remove("selection");
        }
      });
    }

    const rangeKey = cfg.selection.range._key;
    let isRowSelect = false,
      isColSelect = false;
    if (!utils.isUndefined(rangeKey)) {
      isRowSelect = rangeKey.startsWith("row");
      isColSelect = rangeKey.startsWith("col");
    }

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        const cellPosition = i + "," + j;
        const currRow = scrollStartIdx + i;

        if (!isAllSelection) {
          if (isRowSelect || isColSelect) {
            delete cfg.selection.unSelectPosition[cellPosition];
          }

          if (!this.isSelectPosition(currRow, j, true)) {
            continue;
          }
        }
        let addEle = bodyElement.find('[data-cell-position="' + cellPosition + '"]');

        if (addEle == null) continue;

        addEle.setAttribute("data-selection-id", currentId);

        if (startCellInfo.startIdx == currRow && startCellInfo.startCol == j) {
          addEle.classList.add("selection");
          addEle.classList.add("start-cell");
        } else {
          addEle.classList.add("selection");
        }
      }
    }
  }

  /**
   * clear selection cell
   *
   * @public
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

  public getSelectionId(type?: string): string {
    if (type) {
      return type + ++this.serialNumber;
    }

    return "auto" + ++this.serialNumber;
  }
}
