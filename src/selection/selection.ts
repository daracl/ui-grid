import { GridOptions } from "@t/GridOptions";
import { Config, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../defaultGridConfig";
import { FieldItem } from "@t/GridField";

export default class SelectionInfo {
  private options: GridOptions;
  private config: Config;
  private selection: Selection;

  constructor(options: GridOptions, config: Config) {
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

      this.setSelectionInfo(currSelectionInfo, changeRangeInfo);
      currSelectionInfo = this.selection = currSelectionInfo;
      currSelectionInfo.allRange[currSelectionInfo.curr] = currSelectionInfo.range;
    } else {
      this.setSelectionInfo(currSelectionInfo, changeRangeInfo);
    }

    let isRangeInfo = utils.isUndefined(changeRangeInfo);

    let rangeInfo = currSelectionInfo.range;

    rangeInfo = utils.merge(rangeInfo, changeInfo);

    currSelectionInfo.minIdx = currSelectionInfo.minIdx == -1 ? Math.min(rangeInfo.startIdx, rangeInfo.endIdx) : Math.min(currSelectionInfo.minIdx, rangeInfo.startIdx, rangeInfo.endIdx);
    currSelectionInfo.maxIdx = Math.max(currSelectionInfo.maxIdx, rangeInfo.endIdx, rangeInfo.startIdx);
    currSelectionInfo.minIdx = currSelectionInfo.minIdx < -1 ? 0 : currSelectionInfo.minIdx;
    currSelectionInfo.maxIdx = currSelectionInfo.maxIdx >= this.config.dataInfo.lastRowIdx ? this.config.dataInfo.lastRowIdx : currSelectionInfo.maxIdx;

    if (initFlag !== true || (isRangeInfo && currSelectionInfo.minCol == -1)) {
      currSelectionInfo.minCol = currSelectionInfo.minCol == -1 ? Math.min(rangeInfo.endCol, rangeInfo.startCol) : Math.min(currSelectionInfo.minCol, rangeInfo.endCol, rangeInfo.startCol);
      currSelectionInfo.maxCol = Math.max(currSelectionInfo.maxCol, rangeInfo.endCol, rangeInfo.startCol);

      currSelectionInfo.minCol = currSelectionInfo.minCol < -1 ? 0 : currSelectionInfo.minCol;
      currSelectionInfo.maxCol = currSelectionInfo.maxCol >= this.config.currentHeaderItems.length ? this.config.currentHeaderItems.length - 1 : currSelectionInfo.maxCol;
    }

    if (isRangeInfo) return;

    rangeInfo.minIdx = Math.min(rangeInfo.startIdx, rangeInfo.endIdx);
    rangeInfo.maxIdx = Math.max(rangeInfo.endIdx, rangeInfo.startIdx);
    rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
    rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);

    if (initFlag !== true) {
      rangeInfo.minCol = rangeInfo.minCol < -1 ? 0 : rangeInfo.minCol;
      rangeInfo.maxCol = rangeInfo.maxCol >= this.config.currentHeaderItems.length ? this.config.currentHeaderItems.length - 1 : rangeInfo.maxCol;

      rangeInfo.minIdx = rangeInfo.minIdx < -1 ? 0 : rangeInfo.minIdx;
      rangeInfo.maxIdx = rangeInfo.maxIdx >= this.config.dataInfo.lastRowIdx ? this.config.dataInfo.lastRowIdx : rangeInfo.maxIdx;
    }

    if (tdSelectFlag) {
      this.setCellSelect(initFlag);
    }

    if (this.options.navigation.enableSelectionInfo) {
      const dataInfo = this.selectionData("json");

      if (!utils.isUndefined(dataInfo) && dataInfo.summaryInfo.count > 1) {
        this.element.navSelectionInfo.empty().html(utils.replaceMesasgeFormat(this.options.navigation.selectionInfoFormat || "", dataInfo.summaryInfo));
      } else {
        this.element.navSelectionInfo.empty();
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
  public setSelectionInfo(changeInfo: Selection, rangeInfo: SelectionRange) {
    const cfgSelect = this.selection;
    for (const key in changeInfo) {
      if (key == "range") {
      } else if (key == "curr") {
        if (changeInfo[key] == "add") {
          cfgSelect.curr += 1;
          cfgSelect.range = rangeInfo;
          const rangeKey = rangeInfo._key ? rangeInfo._key : cfgSelect.curr;

          if (this.isRangeKey(rangeKey)) {
            rangeInfo.mode = "remove";
            delete cfgSelect.allRange[rangeKey];
          } else {
            cfgSelect.allRange[rangeKey] = rangeInfo;
          }
        } else if (attrInfo[key] == "remove") {
          cfgSelect.curr += 1;
          cfgSelect.range = rangeInfo;
          const rangeKey = rangeInfo._key ? rangeInfo._key : cfgSelect.curr;
          rangeInfo.mode = "remove";
          delete cfgSelect.allRange[rangeKey];
        }
      } else {
        cfgSelect[key] = attrInfo[key];
      }
    }
  }

  /**
   * @method isRangeKey
   * @description header , col 선택 여부 확인
   */
  public isRangeKey(key: number): boolean {
    return this.selection.allRange[key] ? true : false;
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
    var tbodyItem = this.options.tbodyItem;

    if (tbodyItem.length < 1) return;

    dataType = dataType || "text";

    var sCol, eCol, sIdx, eIdx;

    var allSelectFlag = this.isAllSelect();

    if (allSelectFlag) {
      sCol = 0;
      eCol = this.config.currentHeaderItems.length - 1;
      sIdx = 0;
      eIdx = this.config.dataInfo.lastRowIdx;
    } else {
      const colInfo = this.config.selection;
      sCol = colInfo.minCol;
      eCol = colInfo.maxCol;
      sIdx = colInfo.minIdx;
      eIdx = colInfo.maxIdx;
    }

    if (sIdx < 0 || eIdx < 0) return dataType == "json" ? {} : "";

    const returnVal = [];
    let addRowFlag;

    const headerItems = this.config.currentHeaderItems;

    const keyInfo = {};
    const tmpVal = "";
    const summaryInfo = { count: 0, numbers: [] };
    for (let i = sIdx; i <= eIdx; i++) {
      let item = tbodyItem[i];

      let rowText = [],
        rowItem = { _pubIdx: i };
      addRowFlag = false;

      for (const j = sCol; j <= eCol; j++) {
        const colItem = headerItems[j];

        if (colItem.visible === false) continue;

        const tmpKey = colItem.key;

        if ((allSelectFlag && !this.isAllSelectUnSelectPosition(i, j)) || this.isSelectPosition(i, j)) {
          addRowFlag = true;

          tmpVal = this.getRenderValue(colItem, item, "data");

          if (dataType == "json") {
            keyInfo[j] = colItem;
            rowItem[tmpKey] = tmpVal;
            summaryInfo.count += isBlank(tmpVal) ? 0 : 1;
            if (isNumber(tmpVal)) {
              tmpVal = Number(tmpVal);
              summaryInfo.numbers.push(tmpVal);
            }
          } else {
            rowText.push(tmpVal);
          }
        } else {
          rowText.push("");
          rowItem[tmpKey] = "";
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
      var reKeyInfo = [];

      for (var key in keyInfo) {
        reKeyInfo.push(keyInfo[key]);
      }
      sum = summaryInfo.numbers.reduce((a, b) => a + b, 0);
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

  /**
   * cell select
   *
   * @public
   * @param {boolean} initFlag
   */
  public setCellSelect(initFlag: boolean) {
    const tmpCurr = this.config.selection.curr;
    const colInfo = this.getSelectionRangeInfo();
    const startCellInfo = this.config.selection.startCell; // start cell

    const sIdx = colInfo.startIdx,
      eIdx = colInfo.endIdx,
      sCol = colInfo.startCol,
      eCol = colInfo.endCol,
      currViewIdx = this.config.scroll.viewIdx;

    const sRow = sIdx < currViewIdx ? 0 : sIdx - currViewIdx,
      eRow = eIdx - currViewIdx;

    eRow = eRow > this.config.scroll.viewCount ? this.config.scroll.viewCount : eRow;

    if (this.config.selection.range.mode == "remove") {
      for (const i = sRow; i <= eRow; i++) {
        for (const j = sCol; j <= eCol; j++) {
          const cellPosition = i + "," + j;
          const currIdx = currViewIdx + i;

          let addEle;

          if (this._isFixedPostion(j)) {
            addEle = this.element.leftContent.querySelector('[data-cell-position="' + cellPosition + '"]');
          } else {
            addEle = this.element.bodyContent.querySelector('[data-cell-position="' + cellPosition + '"]');
          }
          if (addEle == null) continue;

          this.config.selection.unSelectPosition[cellPosition] = "";

          addEle.removeAttribute("data-select-idx");
          addEle.classList.remove("col-active");

          addEle = null;
        }
      }
      return;
    }

    this.element.body.find(".pub-body-td.selection-start-col").removeClass("selection-start-col");

    if (initFlag) {
      _$util.clearActiveColumn(this.element);
    } else {
      this.element.body.find('.pub-body-td[data-select-idx="' + tmpCurr + '"].col-active').each(function () {
        const sEle = $(this);
        const posInfo = _$util.getCellPosition(sEle);
        if (this.isSelectPosition(currViewIdx + posInfo.r, posInfo.c)) {
        } else {
          sEle.removeClass("col-active");
        }
      });
    }

    const rangeKey = this.config.selection.range._key;
    const isRowSelect = false,
      isColSelect = false;
    if (!isUndefined(rangeKey)) {
      isRowSelect = this.config.selection.range._key.indexOf("row") == 0;
      isColSelect = this.config.selection.range._key.indexOf("col") == 0;
    }

    for (const i = sRow; i <= eRow; i++) {
      for (const j = sCol; j <= eCol; j++) {
        const cellPosition = i + "," + j;
        const currIdx = currViewIdx + i;

        if (isRowSelect || isColSelect) {
          delete this.selection.unSelectPosition[cellPosition];
        }

        if (!this.isSelectPosition(currIdx, j, true)) {
          continue;
        }

        let addEle;

        if (this._isFixedPostion(j)) {
          addEle = this.element.leftContent.querySelector('[data-cell-position="' + cellPosition + '"]');
        } else {
          addEle = this.element.bodyContent.querySelector('[data-cell-position="' + cellPosition + '"]');
        }
        if (addEle == null) continue;

        addEle.setAttribute("data-select-idx", tmpCurr);

        if (startCellInfo.startIdx == currIdx && startCellInfo.startCol == j) {
          addEle.classList.add("col-active");
          addEle.classList.add("selection-start-col");
        } else {
          addEle.classList.add("col-active");
        }

        addEle = null;
      }
    }
  }

  /**
   * 선택된 cell 영역 구하기.
   * @returns 선택된 cell 영역 구하기.
   */
  public getSelectionRangeInfo() {
    const selectionInfo = this.selection.range;

    const startIdx = selectionInfo.startIdx,
      endIdx = selectionInfo.endIdx,
      startCol = selectionInfo.startCol,
      endCol = selectionInfo.endCol,
      startRow = -1,
      endRow = -1;

    if (startIdx > endIdx) {
      const tmp = endIdx;
      endIdx = startIdx;
      startIdx = tmp;
    }

    if (startCol > endCol) {
      const tmp = endCol;
      endCol = startCol;
      startCol = tmp;
    }

    if (ctx.config.scroll.viewIdx >= startIdx) {
      startRow = 0;
    } else {
      startRow = startIdx - ctx.config.scroll.viewIdx;
    }

    if (ctx.config.scroll.viewIdx + ctx.config.scroll.maxViewCount <= endIdx) {
      endRow = ctx.config.scroll.viewCount - 1;
    } else {
      endRow = endIdx - ctx.config.scroll.viewIdx;
    }

    return {
      startIdx: startIdx,
      endIdx: endIdx,
      startRow: startRow,
      endRow: endRow,
      startCol: startCol,
      endCol: endCol,
    };
  }
}
