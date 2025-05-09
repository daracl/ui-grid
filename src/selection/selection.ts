import { GridOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, getCellPosition } from "src/util/gridUtils";
import DaraGrid from "src/DaraGrid";
import GridMain from "src/view/GridMain";

export default class SelectionInfo {
  private readonly grid: DaraGrid;

  private gridMain: GridMain;

  private readonly options: GridOptions;
  private readonly config: Config;

  /**
   * select id number
   *
   * @private
   * @type {number}
   */
  private serialNumber = 0;

  constructor(grid: DaraGrid, gridMain: GridMain, options: GridOptions, config: Config) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.options = options;
    this.config = config;

    this.config.selection = initSelectionInfo();
  }

  public setSelectionRangeInfo(changeSelection: Selection, initFlag?: boolean, tdSelectFlag?: boolean) {
    if (initFlag !== true && this.isAllSelect()) {
      return;
    }

    const changeRangeInfo = changeSelection.range;
    let currentSelection = this.config.selection;
    if (initFlag) {
      currentSelection = initSelectionInfo();

      currentSelection = this.setSelectionInfo(currentSelection, changeSelection);
      currentSelection.allRange[currentSelection.id] = currentSelection.range;
    } else {
      currentSelection = this.setSelectionInfo(currentSelection, changeSelection);
    }

    // const stack = new Error().stack;

    // if (stack) {
    //   console.log("호출한 함수:", stack);
    // }

    console.log("------setSelectionRangeInfo------initFlag---- ", initFlag, currentSelection.range, changeSelection.range);

    let isRangeInfo = utils.isUndefined(changeRangeInfo);

    let rangeInfo = currentSelection.range;

    currentSelection.minRow = currentSelection.minRow == -1 ? Math.min(rangeInfo.startRow, rangeInfo.endRow) : Math.min(currentSelection.minRow, rangeInfo.startRow, rangeInfo.endRow);
    currentSelection.maxRow = Math.max(currentSelection.maxRow, rangeInfo.endRow, rangeInfo.startRow);
    currentSelection.minRow = currentSelection.minRow < -1 ? 0 : currentSelection.minRow;
    currentSelection.maxRow = currentSelection.maxRow >= this.config.dataInfo.lastRow ? this.config.dataInfo.lastRow : currentSelection.maxRow;

    if (initFlag !== true || (isRangeInfo && currentSelection.minCol == -1)) {
      currentSelection.minCol = currentSelection.minCol == -1 ? Math.min(rangeInfo.endCol, rangeInfo.startCol) : Math.min(currentSelection.minCol, rangeInfo.endCol, rangeInfo.startCol);
      currentSelection.maxCol = Math.max(currentSelection.maxCol, rangeInfo.endCol, rangeInfo.startCol);

      currentSelection.minCol = currentSelection.minCol < -1 ? 0 : currentSelection.minCol;
      currentSelection.maxCol = currentSelection.maxCol >= this.config.currentFields.length ? this.config.currentFields.length - 1 : currentSelection.maxCol;
    }

    if (isRangeInfo) return;

    rangeInfo.minRow = Math.min(rangeInfo.startRow, rangeInfo.endRow);
    rangeInfo.maxRow = Math.max(rangeInfo.endRow, rangeInfo.startRow);
    rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
    rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);

    if (initFlag !== true) {
      rangeInfo.minCol = rangeInfo.minCol < -1 ? 0 : rangeInfo.minCol;
      rangeInfo.maxCol = rangeInfo.maxCol >= this.config.currentFields.length ? this.config.currentFields.length - 1 : rangeInfo.maxCol;

      rangeInfo.minRow = rangeInfo.minRow < -1 ? 0 : rangeInfo.minRow;
      rangeInfo.maxRow = rangeInfo.maxRow >= this.config.dataInfo.lastRow ? this.config.dataInfo.lastRow : rangeInfo.maxRow;
    }

    if (tdSelectFlag) {
      this.setCellSelect(initFlag);
    }

    console.log("rangeInfo : ", JSON.stringify(rangeInfo));

    if (this.options.footer.enableSelectionInfo) {
      const dataInfo = this.selectionData("json");

      if (!utils.isUndefined(dataInfo) && dataInfo.summaryInfo.count > 1) {
        //this.grid.elementMap.navSelectionInfo.empty().html(utils.replaceMesasgeFormat(this.options.navigation.selectionInfoFormat || "", dataInfo.summaryInfo));
      } else {
        //this.grid.elementMap.navSelectionInfo.innerHTML = "";
      }
    }
  }

  /**
   * set selection info
   *
   * @public
   * @param {Selection} currentSelection change selection info
   * @param {SelectionRange} changeSelection changeRangeInfo
   * @returns {*}
   */
  public setSelectionInfo(currentSelection: any, changeSelection: any) {
    //delete currentSelection.range;

    const selectionInfo = utils.merge(currentSelection, changeSelection);

    const mode = currentSelection.mode;
    if (mode == "add") {
      selectionInfo.id = this.getSelectionId();
      selectionInfo.range = changeSelection.range;
      const rangeKey = changeSelection._key ?? selectionInfo.id;

      if (this.isRangeKey(rangeKey)) {
        changeSelection.mode = "remove";
        delete selectionInfo.allRange[rangeKey];
      } else {
        selectionInfo.allRange[rangeKey] = changeSelection;
      }
    } else if (mode == "remove") {
      selectionInfo.id = this.getSelectionId();
      selectionInfo.range = changeSelection;
      const rangeKey = changeSelection._key ?? selectionInfo.id;
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
   * @method _isAllSelect
   * @description cell select
   */
  public isAllSelect() {
    return this.config.selection.all;
  }

  /**
   * @method selectionData
   * @description select data 구하기.
   */
  public selectionData(dataType: string): any {
    const items = this.options.items;

    if (items.length < 1) return;

    dataType = dataType || "text";

    let sCol, eCol, sRow, eRow;

    const allSelectFlag = this.isAllSelect();

    if (allSelectFlag) {
      sCol = 0;
      eCol = this.config.currentFields.length - 1;
      sRow = 0;
      eRow = this.config.dataInfo.lastRow;
    } else {
      const colInfo = this.config.selection;
      sCol = colInfo.minCol;
      eCol = colInfo.maxCol;
      sRow = colInfo.minRow;
      eRow = colInfo.maxRow;
    }

    if (sRow < 0 || eRow < 0) return dataType == "json" ? {} : "";

    const returnVal = [];
    let addRowFlag;

    const headerItems = this.config.currentFields;

    let keyInfo = {} as any;
    let tmpVal: any;
    const summaryInfo: { count: number; numbers: number[] } = { count: 0, numbers: [] };
    for (let i = sRow; i <= eRow; i++) {
      let item = items[i];

      let rowText = [],
        rowItem = { _pubIdx: i } as any;
      addRowFlag = false;

      for (let j = sCol; j <= eCol; j++) {
        const colItem = headerItems[j];

        if (colItem.hidden) continue;

        const colName = colItem.name;

        if ((allSelectFlag && !this.isAllSelectUnSelectPosition(i, j)) || this.isSelectPosition(i, j)) {
          addRowFlag = true;

          tmpVal = colItem.$renderer.getValue(item);

          if (dataType == "json") {
            keyInfo[j] = colItem;
            rowItem[colName] = tmpVal;
            summaryInfo.count += utils.isBlank(tmpVal) ? 0 : 1;
            if (utils.isNumber(tmpVal)) {
              const numval = Number(tmpVal);
              summaryInfo.numbers.push(numval);
            }
          } else {
            rowText.push(tmpVal);
          }
        } else {
          rowText.push("");
          rowItem[colName] = "";
        }
      }

      if (addRowFlag) {
        if (dataType == "json") {
          returnVal.push(rowItem);
        } else {
          returnVal.push(rowText.join("\t"));
        }
      }
    }

    if (dataType == "json") {
      const reKeyInfo = [];

      for (const key in keyInfo) {
        reKeyInfo.push(keyInfo[key]);
      }
      let sum = summaryInfo.numbers.reduce((a, b) => a + b, 0);
      return {
        header: reKeyInfo,
        data: returnVal,
        summaryInfo: {
          count: summaryInfo.count,
          sum: sum,
          avg: sum == 0 ? 0 : (sum / summaryInfo.numbers.length).toFixed(1),
        },
      };
    } else {
      return returnVal.join("\n");
    }
  }

  public isSelectPosition(row: number, col: number, currFlag?: boolean): boolean {
    if (this.config.selection.unSelectPosition.hasOwnProperty(row + "," + col)) {
      return false;
    }
    if (currFlag) {
      return this.isSelRange(this.config.selection.range, row, col);
    } else {
      const allRange = this.config.selection.allRange;

      for (const key in allRange) {
        if (this.isSelRange(allRange[key], row, col)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * cell all 선택시 선택 여부
   *
   * @param {number} row row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isAllSelectUnSelectPosition(row: number, col: number): boolean {
    return this.config.selection.unSelectPosition.hasOwnProperty(row + "," + col);
  }

  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} row row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isSelRange(range: SelectionRange, row: number, col: number): boolean {
    return range.minRow <= row && row <= range.maxRow && range.minCol <= col && col <= range.maxCol;
  }

  /**
   * cell select
   *
   * @public
   * @param {boolean} initFlag
   */
  public setCellSelect(initFlag?: boolean) {
    const cfg = this.config;
    const currentId = cfg.selection.id;
    const colInfo = this.getSelectionRangeInfo();
    const startCellInfo = cfg.selection.startCell; // start cell

    let sRow = colInfo.startRow,
      eRow = colInfo.endRow,
      sCol = colInfo.startCol,
      eCol = colInfo.endCol,
      startRow = cfg.scroll.startRow;

    sRow = sRow < startRow ? 0 : sRow - startRow;
    eRow = eRow - startRow;

    eRow = eRow > cfg.scroll.viewRow ? cfg.scroll.viewRow : eRow;

    const bodyElement = this.gridMain.getBody().bodyElement;

    if (cfg.selection.range.mode == "remove") {
      for (let i = sRow; i <= eRow; i++) {
        for (let j = sCol; j <= eCol; j++) {
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

    const startCellElement = bodyElement.find(".dg-cell.selection-start-cell");
    if (startCellElement) {
      startCellElement.classList.remove("selection-start-cell");
    }

    if (initFlag) {
      bodyElement.finds(".selection[data-cell-position]").forEach((cellNode, idx) => {
        (cellNode as HTMLElement).classList.remove("selection");
      });
    } else {
      bodyElement.finds('.dg-cell[data-selection-id="' + currentId + '"].selection').forEach((cellNode, idx) => {
        const cellElement = cellNode as HTMLElement;
        const posInfo = getCellPosition(cellElement);
        if (this.isSelectPosition(startRow + posInfo.r, posInfo.c)) {
        } else {
          cellElement.classList.remove("selection");
        }
      });
    }

    const rangeKey = cfg.selection.range._key;
    let isRowSelect = false,
      isColSelect = false;
    if (!utils.isUndefined(rangeKey)) {
      isRowSelect = cfg.selection.range._key.indexOf("row") == 0;
      isColSelect = cfg.selection.range._key.indexOf("col") == 0;
    }

    for (let i = sRow; i <= eRow; i++) {
      for (let j = sCol; j <= eCol; j++) {
        const cellPosition = i + "," + j;
        const currRow = startRow + i;

        if (isRowSelect || isColSelect) {
          delete cfg.selection.unSelectPosition[cellPosition];
        }

        if (!this.isSelectPosition(currRow, j, true)) {
          continue;
        }

        let addEle = bodyElement.find('[data-cell-position="' + cellPosition + '"]');

        if (addEle == null) continue;

        addEle.setAttribute("data-selection-id", currentId);

        if (startCellInfo.startRow == currRow && startCellInfo.startCol == j) {
          addEle.classList.add("selection");
          addEle.classList.add("selection-start-cell");
        } else {
          addEle.classList.add("selection");
        }
      }
    }
  }

  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  public getSelectionRangeInfo() {
    const selectionInfo = this.config.selection.range;

    let selectionStartRow = selectionInfo.startRow,
      selectionEndRow = selectionInfo.endRow,
      startCol = selectionInfo.startCol,
      endCol = selectionInfo.endCol,
      startRow = -1,
      endRow = -1;

    if (selectionStartRow > selectionEndRow) {
      const tmp = selectionEndRow;
      selectionEndRow = selectionStartRow;
      selectionStartRow = tmp;
    }

    if (startCol > endCol) {
      const tmp = endCol;
      endCol = startCol;
      startCol = tmp;
    }

    if (this.config.scroll.viewRow >= selectionStartRow) {
      startRow = 0;
    } else {
      startRow = selectionStartRow - this.config.scroll.viewRow;
    }

    if (this.config.scroll.viewRow + this.config.scroll.viewRow <= selectionEndRow) {
      endRow = this.config.scroll.viewRow - 1;
    } else {
      endRow = selectionEndRow - this.config.scroll.viewRow;
    }

    return {
      startIdx: selectionStartRow,
      endIdx: selectionEndRow,
      startRow: startRow,
      endRow: endRow,
      startCol: startCol,
      endCol: endCol,
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
  public getSelectionModeColInfo(selectionMode: string, col: number, dataInfo: any, isMouseDown?: boolean) {
    let startCol, endCol;

    if (selectionMode == "multiple-row" || selectionMode == "row") {
      startCol = 0;
      endCol = dataInfo.colLen - 1;
    } else if (selectionMode == "multiple-cell") {
      if (isMouseDown) {
        startCol = -1;
      } else {
        startCol = col;
      }

      endCol = col;
    } else {
      startCol = col;
      endCol = col;
    }

    return { startCol: startCol, endCol: endCol };
  }

  public setRangeInfo(evtKey: number, evt: Event, endRow: number, moveCol: number) {
    let startCol = moveCol,
      endCol = moveCol;

    if (this.options.selectionMode == "multiple-row" || this.options.selectionMode == "row") {
      startCol = 0;
      endCol = this.config.dataInfo.colLength - 1;
    }

    let multipleFlag = isMultipleSelection(this.options.selectionMode);

    if (multipleFlag && evtKey != 9 && (evt as KeyboardEvent).shiftKey) {
      this.setSelectionRangeInfo(
        {
          range: { endRow: endRow, endCol: endCol },
          startCell: { startRow: endRow, startCol: moveCol },
        } as any,
        false,
        true
      );
    } else {
      this.setSelectionRangeInfo(
        {
          range: { startRow: endRow, endRow: endRow, startCol: startCol, endCol: endCol },
          startCell: { startRow: endRow, startCol: moveCol },
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
