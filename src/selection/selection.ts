import { GridOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, getCellPosition } from "src/util/gridUtils";
import DaraGrid from "src/DaraGrid";

export default class SelectionInfo {
  private grid: DaraGrid;

  private options: GridOptions;
  private config: Config;
  private selection: Selection;

  /**
   * select id number
   *
   * @private
   * @type {number}
   */
  private serialNumber = 0;

  constructor(grid: DaraGrid, options: GridOptions, config: Config) {
    this.grid = grid;
    this.options = options;
    this.config = config;

    this.selection = initSelectionInfo();

    this.setSelectionRangeInfo({} as Selection, false, false);
  }

  public setSelectionRangeInfo(changeInfo: Selection, initFlag: boolean, tdSelectFlag: boolean) {
    if (initFlag !== true && this.isAllSelect()) {
      return;
    }

    const changeRangeInfo = changeInfo.range;
    let currSelectionInfo = this.selection;
    if (initFlag) {
      currSelectionInfo = initSelectionInfo();

      this.selection = currSelectionInfo;
      currSelectionInfo.allRange[currSelectionInfo.id] = currSelectionInfo.range;
    } else {
      this.setSelectionInfo(changeInfo, changeRangeInfo);
    }

    let isRangeInfo = utils.isUndefined(changeRangeInfo);

    let rangeInfo = currSelectionInfo.range;

    rangeInfo = utils.merge(rangeInfo, changeInfo);

    currSelectionInfo.minRow = currSelectionInfo.minRow == -1 ? Math.min(rangeInfo.startRow, rangeInfo.endRow) : Math.min(currSelectionInfo.minRow, rangeInfo.startRow, rangeInfo.endRow);
    currSelectionInfo.maxRow = Math.max(currSelectionInfo.maxRow, rangeInfo.endRow, rangeInfo.startRow);
    currSelectionInfo.minRow = currSelectionInfo.minRow < -1 ? 0 : currSelectionInfo.minRow;
    currSelectionInfo.maxRow = currSelectionInfo.maxRow >= this.config.dataInfo.lastRow ? this.config.dataInfo.lastRow : currSelectionInfo.maxRow;

    if (initFlag !== true || (isRangeInfo && currSelectionInfo.minCol == -1)) {
      currSelectionInfo.minCol = currSelectionInfo.minCol == -1 ? Math.min(rangeInfo.endCol, rangeInfo.startCol) : Math.min(currSelectionInfo.minCol, rangeInfo.endCol, rangeInfo.startCol);
      currSelectionInfo.maxCol = Math.max(currSelectionInfo.maxCol, rangeInfo.endCol, rangeInfo.startCol);

      currSelectionInfo.minCol = currSelectionInfo.minCol < -1 ? 0 : currSelectionInfo.minCol;
      currSelectionInfo.maxCol = currSelectionInfo.maxCol >= this.config.currentFields.length ? this.config.currentFields.length - 1 : currSelectionInfo.maxCol;
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
   * @param {Selection} changeInfo change selection info
   * @param {SelectionRange} rangeInfo changeRangeInfo
   * @returns {*}
   */
  public setSelectionInfo(changeInfo: any, rangeInfo: SelectionRange) {
    delete changeInfo.range;
    this.selection = utils.merge(this.selection, changeInfo);
    const selectionInfo = this.selection;

    const mode = rangeInfo.mode;
    if (mode == "add") {
      selectionInfo.id = this.getSelectionId();
      selectionInfo.range = rangeInfo;
      const rangeKey = rangeInfo._key ? rangeInfo._key : selectionInfo.id;

      if (this.isRangeKey(rangeKey)) {
        rangeInfo.mode = "remove";
        delete selectionInfo.allRange[rangeKey];
      } else {
        selectionInfo.allRange[rangeKey] = rangeInfo;
      }
    } else if (mode == "remove") {
      selectionInfo.id = this.getSelectionId();
      selectionInfo.range = rangeInfo;
      const rangeKey = rangeInfo._key ? rangeInfo._key : selectionInfo.id;
      delete selectionInfo.allRange[rangeKey];
    }
  }

  /**
   * @method isRangeKey
   * @description header , col 선택 여부 확인
   */
  public isRangeKey(key: string): boolean {
    return this.selection.allRange.hasOwnProperty(key);
  }

  /**
   * @method _isAllSelect
   * @description cell select
   */
  public isAllSelect() {
    return this.selection.allSelect;
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
      const colInfo = this.selection;
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
    if (this.selection.unSelectPosition.hasOwnProperty(row + "," + col)) {
      return false;
    }
    if (currFlag) {
      return this.isSelRange(this.selection.range, "", row, col);
    } else {
      const allRange = this.selection.allRange;

      for (const key in allRange) {
        if (this.isSelRange(allRange[key], "", row, col)) {
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
    return this.selection.unSelectPosition.hasOwnProperty(row + "," + col);
  }

  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} row row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isSelRange(range: SelectionRange, mode: string, row: number, col: number): boolean {
    if (mode == "row") {
      return range.minRow <= row && row <= range.maxRow;
    } else {
      return range.minRow <= row && row <= range.maxRow && range.minCol <= col && col <= range.maxCol;
    }
  }

  /**
   * cell select
   *
   * @public
   * @param {boolean} initFlag
   */
  public setCellSelect(initFlag: boolean) {
    const currentId = this.selection.id;
    const colInfo = this.getSelectionRangeInfo();
    const startCellInfo = this.selection.startCell; // start cell

    let sRow = colInfo.startRow,
      eRow = colInfo.endRow,
      sCol = colInfo.startCol,
      eCol = colInfo.endCol,
      currViewRow = this.config.scroll.viewRow;

    sRow = sRow < currViewRow ? 0 : sRow - currViewRow;
    eRow = eRow - currViewRow;

    eRow = eRow > this.config.scroll.viewCount ? this.config.scroll.viewCount : eRow;

    // if (this.selection.range.mode == "remove") {
    //   for (let i = sRow; i <= eRow; i++) {
    //     for (let j = sCol; j <= eCol; j++) {
    //       const cellPosition = i + "," + j;
    //       const currRow = currViewRow + i;

    //       let addEle;

    //       if (isFixedPostion(this.config, j)) {
    //         addEle = this.grid.elementMap.mainBodyLeft.querySelector('[data-cell-position="' + cellPosition + '"]');
    //       } else {
    //         addEle = this.grid.elementMap.mainBodyCenter.querySelector('[data-cell-position="' + cellPosition + '"]');
    //       }
    //       if (addEle == null) continue;

    //       this.selection.unSelectPosition[cellPosition] = "";

    //       addEle.removeAttribute("data-select-idx");
    //       addEle.classList.remove("col-active");

    //       addEle = null;
    //     }
    //   }
    //   return;
    // }

    // this.grid.elementMap.main.find(".dg-cell.selection-start-col").removeClass("selection-start-col");

    // if (initFlag) {
    //   removeActiveColumnStyle(this.grid.element);
    // } else {
    //   this.grid.elementMap.main.find('.dg-cell[data-select-idx="' + currentId + '"].col-active').each(() => {
    //     const sEle = $(this);
    //     const posInfo = getCellPosition(sEle);
    //     if (this.isSelectPosition(currViewRow + posInfo.r, posInfo.c)) {
    //     } else {
    //       sEle.removeClass("col-active");
    //     }
    //   });
    // }

    // const rangeKey = this.selection.range._key;
    // let isRowSelect = false,
    //   isColSelect = false;
    // if (!utils.isUndefined(rangeKey)) {
    //   isRowSelect = this.selection.range._key.indexOf("row") == 0;
    //   isColSelect = this.selection.range._key.indexOf("col") == 0;
    // }

    // for (let i = sRow; i <= eRow; i++) {
    //   for (let j = sCol; j <= eCol; j++) {
    //     const cellPosition = i + "," + j;
    //     const currRow = currViewRow + i;

    //     if (isRowSelect || isColSelect) {
    //       delete this.selection.unSelectPosition[cellPosition];
    //     }

    //     if (!this.isSelectPosition(currRow, j, true)) {
    //       continue;
    //     }

    //     let addEle;

    //     if (isFixedPostion(this.config, j)) {
    //       addEle = this.element.leftContent.querySelector('[data-cell-position="' + cellPosition + '"]');
    //     } else {
    //       addEle = this.element.bodyContent.querySelector('[data-cell-position="' + cellPosition + '"]');
    //     }
    //     if (addEle == null) continue;

    //     addEle.setAttribute("data-select-idx", currentId);

    //     if (startCellInfo.startRow == currRow && startCellInfo.startCol == j) {
    //       addEle.classList.add("col-active");
    //       addEle.classList.add("selection-start-col");
    //     } else {
    //       addEle.classList.add("col-active");
    //     }

    //     addEle = null;
    //   }
    // }
  }

  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  public getSelectionRangeInfo() {
    const selectionInfo = this.selection.range;

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

    if (this.config.scroll.viewRow + this.config.scroll.maxViewCount <= selectionEndRow) {
      endRow = this.config.scroll.viewCount - 1;
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
  public getSelectionModeColInfo(selectionMode: string, col: number, dataInfo: any, isMouseDown: boolean) {
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

    let shiftKeyFlag = false;
    if (evt instanceof KeyboardEvent) {
      shiftKeyFlag = (evt as KeyboardEvent).shiftKey;
    }

    if (multipleFlag && evtKey != 9 && shiftKeyFlag) {
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
