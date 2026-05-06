import { GridOptions } from '@t/GridOptions';
import { Config, Selection, SelectionRange } from '@t/GridConfig';
import * as utils from '@/util/utils';
import { initSelectionInfo } from '../defaultGridConfig';
import { isMultipleSelectionMode, isRowSelectionMode } from '@/util/gridUtils';
import { GridMain } from '@/view/GridMain';
import { removeClass } from '@/util/styleUtils';
import { hasClass } from '@/util/domUtils';
import { isShiftKey } from '@/util/eventUtils';
import { SELECTION_STYLE_CLASS, SelectionMode } from '@/constants';
import { escapeCellValue } from '@/util/gridUtils';

export class SelectionInfo {
  private readonly gridMain: GridMain;

  private readonly options: GridOptions;
  private readonly config: Config;

  private reversedAllRanges: SelectionRange[] = [];

  private readonly rowLine: Set<number> = new Set();
  private readonly columnLine: Set<number> = new Set();

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
  }

  public initSelection() {
    this.config.selection = initSelectionInfo();
    this.setReverseAllRange();
    this.gridMain.getHeader().clearAnchorCell();
    this.rowLine.clear();
    this.columnLine.clear();
  }

  public setSelectionRangeInfo(changeSelection: Selection, initFlag: boolean, cellSelectFlag?: boolean) {
    if (initFlag !== true && this.isAllSelect()) {
      return;
    }

    const cfg = this.config;
    const changeRangeInfo = changeSelection.range;
    if (initFlag) {
      this.serialNumber = 0;
      this.initSelection();
    }

    if (utils.isUndefined(changeRangeInfo)) return;

    const currentSelection = this.setSelectionInfo(initFlag, cfg.selection, changeSelection);

    const lastRowIdx = cfg.dataInfo.lastRow;
    const lastCol = cfg.dataInfo.colLength - 1;

    let rangeInfo = this.clampRange(currentSelection.range, lastRowIdx, lastCol);

    rangeInfo = this.setRangeMinMaxInfo(rangeInfo);

    currentSelection.allRange.set(currentSelection.id, rangeInfo);

    this.setReverseAllRange();

    this.computeEffectiveSelectionRange(this.reversedAllRanges, currentSelection);

    if (cellSelectFlag) {
      this.setCellSelection();
    }

    this.selectAnchorCell();

    this.gridMain.getFooter().setSelectionStatus();
  }

  /**
   * 주어진 SelectionRange의 행/열 인덱스를 실제 데이터 범위 내로 제한합니다.
   *
   * @param range - 현재 선택된 범위 객체
   * @param maxRow - 데이터의 최대 행 인덱스
   * @param maxCol - 데이터의 최대 열 인덱스
   * @returns 유효한 인덱스 범위로 조정된 새로운 SelectionRange
   */
  private clampRange(range: SelectionRange, maxRow: number, maxCol: number): SelectionRange {
    return {
      ...range,
      startIdx: Math.min(Math.max(range.startIdx, 0), maxRow),
      endIdx: Math.min(Math.max(range.endIdx, 0), maxRow),
      startCol: Math.min(Math.max(range.startCol, 0), maxCol),
      endCol: Math.min(Math.max(range.endCol, 0), maxCol),
    };
  }

  /**
   * 주어진 SelectionRange 목록에서 'remove' 모드 범위를 제외한
   * 실질적인 최소/최대 행 및 열 범위를 계산합니다.
   *
   * @param ranges - 정렬된 SelectionRange 목록 (보통 역순으로 되어 있음)
   * @returns 실제 선택된 셀의 최소/최대 행, 열 인덱스 정보
   */
  private computeEffectiveSelectionRange(ranges: SelectionRange[], currentSelection: Selection) {
    let minIdx = Infinity,
      maxIdx = -1;
    let minCol = Infinity,
      maxCol = -1;

    const removeRangesLen = ranges.length;
    const removeRanges: SelectionRange[] = [];

    for (let i = 0; i < removeRangesLen; i++) {
      const range = ranges[i];

      if (range.mode === 'remove') {
        removeRanges.push(range);
        continue;
      }

      let rMinIdx = range.minIdx;
      let rMaxIdx = range.maxIdx;
      let rMinCol = range.minCol;
      let rMaxCol = range.maxCol;

      const removeLen = removeRanges.length;

      if (removeLen > 0) {
        for (let j = 0; j < removeLen; j++) {
          const rem = removeRanges[j];

          if (isRowRange(rem, rMinIdx, rMinCol, rMaxCol)) {
            rMinIdx = rem.maxIdx;
          }
          if (isRowRange(rem, rMaxIdx, rMinCol, rMaxCol)) {
            rMaxIdx = rem.minIdx;
          }

          if (isCellRange(rem, rMinCol, rMinIdx, rMaxIdx)) {
            rMinCol = rem.maxCol + 1;
          }
          if (isCellRange(rem, rMaxCol, rMinIdx, rMaxIdx)) {
            rMaxCol = rem.minCol;
          }
        }
      }

      // 유효한 범위인지 체크
      if (rMinIdx <= rMaxIdx && rMinCol <= rMaxCol) {
        if (rMinIdx < minIdx) minIdx = rMinIdx;
        if (rMaxIdx > maxIdx) maxIdx = rMaxIdx;
        if (rMinCol < minCol) minCol = rMinCol;
        if (rMaxCol > maxCol) maxCol = rMaxCol;
      }
    }

    currentSelection.minIdx = minIdx;
    currentSelection.maxIdx = maxIdx;
    currentSelection.minCol = minCol;
    currentSelection.maxCol = maxCol;

    this.getSelectedRowsAndCols(ranges);
  }

  /**
   * selection row col
   *
   * @private
   * @param {SelectionRange[]} ranges info
   */
  public getSelectedRowsAndCols(ranges: SelectionRange[]) {
    /* 0) 행 개수에 따라 인코딩 전략 선택 */
    const NEED_WIDE = ranges.some((r) => r.maxIdx >= 1_000_000);

    /* 1) 인코더 / 디코더 */
    const COL_BITS = 12 as const; // fast-path: 열 0-4095
    const COL_MASK = (1 << COL_BITS) - 1;
    const ROW_OFFSET = 100_000; // wide-path: 열 0-99 999

    const encode = NEED_WIDE
      ? (row: number, col: number) => row * ROW_OFFSET + col
      : (row: number, col: number) => (row << COL_BITS) | col;

    const decodeRow = NEED_WIDE ? (v: number) => (v / ROW_OFFSET) | 0 : (v: number) => v >>> COL_BITS;

    const decodeCol = NEED_WIDE ? (v: number) => v % ROW_OFFSET : (v: number) => v & COL_MASK;

    /* 2) 집합 선언
         processed : 이미 첫 등장한 셀 키 기록
         selected  : 첫 등장이 add 인 셀만 저장                         */
    const processed = new Set<number>();
    const selected = new Set<number>();

    /* 3) ranges *순서대로* 처리 → 첫 등장만 반영 */
    for (const r of ranges) {
      for (let row = r.minIdx; row <= r.maxIdx; row++) {
        for (let col = r.minCol; col <= r.maxCol; col++) {
          const key = encode(row, col);

          if (processed.has(key)) continue; // 이미 확정된 셀은 스킵
          processed.add(key);

          if (r.mode === 'add') selected.add(key); // 첫 등장 = add ⇒ 선택 확정
          /* r.mode === "remove" 이면 선택하지 않음 → 이후 add 도 무시 */
        }
      }
    }

    /* 4) 행·열 집합 생성 */
    this.rowLine.clear();
    this.columnLine.clear();
    const rows = this.rowLine;
    const cols = this.columnLine;

    selected.forEach((v) => {
      rows.add(decodeRow(v));
      cols.add(decodeCol(v));
    });
  }

  private setReverseAllRange() {
    this.reversedAllRanges = Array.from(this.config.selection.allRange.values()).reverse();
  }

  setRangeMinMaxInfo(rangeInfo: SelectionRange): SelectionRange {
    rangeInfo.minIdx = Math.min(rangeInfo.startIdx, rangeInfo.endIdx);
    rangeInfo.maxIdx = Math.max(rangeInfo.endIdx, rangeInfo.startIdx);
    rangeInfo.minCol = Math.min(rangeInfo.endCol, rangeInfo.startCol);
    rangeInfo.maxCol = Math.max(rangeInfo.endCol, rangeInfo.startCol);

    return rangeInfo;
  }

  /**
   * set selection info
   *
   * @public
   * @param {Selection} currentSelection change selection info
   * @param {SelectionRange} changeSelection changeRangeInfo
   * @returns {*}
   */
  public setSelectionInfo(initFlag: boolean, currentSelection: Selection, changeSelection: Selection) {
    const allRange = currentSelection.allRange;
    const selectionInfo = utils.merge(currentSelection, changeSelection);
    selectionInfo.allRange = allRange;

    const newRange = changeSelection.range;
    let mode = '';
    if (!utils.isEmpty(newRange.startCol) && newRange.modifierKey != 2) {
      let selectionFlag = false;
      if (newRange.type == 'column') {
        selectionFlag = this.isColumnSelection(newRange);
      } else {
        selectionFlag = this.isSelection(newRange.startIdx, newRange.startCol);
      }
      newRange.mode = initFlag || !selectionFlag ? 'add' : 'remove';
      mode = newRange.mode;
      selectionInfo.id = this.getSelectionId(mode);
      selectionInfo.range = utils.merge(selectionInfo.range, newRange);
    }

    this.config.selection = selectionInfo;

    return selectionInfo;
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
    this.selectAnchorCell();
  }

  /**
   * clear anchor cell
   *
   */
  public clearAnchorCell() {
    const bodyElement = this.gridMain.getBody().getBodyElement();
    removeClass(bodyElement.finds('.dg-cell.dg-start-cell'), 'dg-start-cell');
    removeClass(bodyElement.finds('.dg-cell.' + SELECTION_STYLE_CLASS), SELECTION_STYLE_CLASS);
  }

  public selectAnchorCell() {
    this.gridMain.getHeader().selectColumnAnchorCell();
    this.gridMain.getBody().selectRowAnchorCell();
  }

  /**
   * @method selectionData
   * @description select data 구하기.
   */
  public selectionData(dataType: 'text' | 'json' = 'text', isSummary = false): any {
    const { dataManager, currentFields, selection, dataInfo } = this.config;
    const items = dataManager.getViewItems();
    const isJson = dataType === 'json';

    if (dataInfo.rowLength < 1) return isJson ? {} : '';

    const isAll = this.isAllSelect();
    const startCol = isAll ? 0 : selection.minCol;
    const endCol = isAll ? dataInfo.colLength - 1 : selection.maxCol;
    const startIdx = isAll ? 0 : selection.minIdx;
    const endIdx = isAll ? dataInfo.lastRow : selection.maxIdx;

    if (startIdx < 0 || endIdx < 0) return isJson ? {} : '';

    const result: any[] = [];
    const keyInfoMap = new Map<number, any>();
    const summary = { count: 0, numbers: [] as number[] };

    for (let i = startIdx; i <= endIdx; i++) {
      const item = items[i];
      const rowOutput: any = isJson ? { _dgIdx: i } : [];
      let hasSelection = false;

      for (let j = startCol; j <= endCol; j++) {
        const col = currentFields[j];
        if (col.hidden || col.$isAside) continue;

        const colName = col.name;
        const selected = isAll || this.isSelection(i, j);

        let cellValue: any = '';
        if (selected) {
          cellValue = col.$renderer.getValue(item);
          hasSelection = true;

          if (!keyInfoMap.has(j)) keyInfoMap.set(j, col);

          if (!utils.isBlank(cellValue)) {
            summary.count++;
            if (utils.isNumber(cellValue)) {
              summary.numbers.push(Number(cellValue));
            }
          }
        }

        if (isJson) {
          rowOutput[colName] = cellValue;
        } else {
          rowOutput.push(escapeCellValue(cellValue));
        }
      }

      if (hasSelection) {
        result.push(isJson ? rowOutput : rowOutput.join('\t'));
      }
    }

    if (!isJson) return result.join('\n');

    const headers = Array.from(keyInfoMap.values());

    if (isSummary && summary.numbers.length > 0) {
      const summaryInfo = {
        count: summary.count,
        numFieldCount: summary.numbers.length,
        min: -1,
        max: -1,
        avg: '',
        sum: -1,
      };
      const nums = summary.numbers;
      const total = nums.reduce((a, b) => a + b, 0);
      summaryInfo.min = Math.min(...nums);
      summaryInfo.max = Math.max(...nums);
      summaryInfo.sum = total;
      summaryInfo.avg = (total / nums.length).toFixed(1);

      return {
        header: headers,
        data: result,
        summary: summaryInfo,
      };
    }

    return {
      header: headers,
      data: result,
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
    const reversedRanges = this.reversedAllRanges;
    for (const range of reversedRanges) {
      if (this.isCellSelectionRange(range, rowIdx, col)) {
        return range.mode != 'remove';
      }
    }

    return false;
  }

  /**
   * column selection check
   *
   * @public
   * @param {*} chackRange check column range info
   * @returns {boolean} true = selection, false = not selection
   */
  public isColumnSelection(chackRange: any): boolean {
    const reversedRanges = this.reversedAllRanges;
    const { startIdx, startCol, endIdx, endCol } = chackRange;
    for (const range of reversedRanges) {
      if (this.isCellSelectionRange(range, startIdx, startCol) && this.isCellSelectionRange(range, endIdx, endCol)) {
        return range.mode != 'remove';
      }
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
  public isCellSelectionRange(range: SelectionRange, rowIdx: number, col: number): boolean {
    return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol <= col && col <= range.maxCol;
  }

  /**
   * 선택된 cell 인지 확인
   *
   * @param {SelectionRange} range range info
   * @param {number} rowIdx row number
   * @param {number} col col number
   * @returns {boolean} 여부
   */
  public isCellSelection(range: SelectionRange, rowIdx: number, col: number): boolean {
    return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol == col && col == range.maxCol;
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

    const gridStartCol = cfg.dataInfo.startCol;
    const isAllSelection = this.isAllSelect();
    const startRow = 0;
    const endRow = scroll.viewRow;
    const startCol = isAllSelection ? gridStartCol : selection.minCol;
    const endCol = isAllSelection ? dataInfo.colLength : selection.maxCol;
    const scrollStartIdx = scroll.startIdx;
    const scrollStartCol = scroll.startCol;

    const {
      left: leftElements,
      center: centerElements,
      right: rightElements,
    } = this.gridMain.getBody().getBodyCellElements();

    const enableLeftField = fixedLeftIndex > 0 && fixedLeftIndex > startCol;
    const enableRightField = fixedRightIndex > 0 && fixedRightIndex <= endCol;

    const { startIdx: startCellIdx, startCol: startCellCol } = selection.startCell;
    const minFixedLeftCol = Math.min(fixedLeftIndex - 1, endCol);
    const minScrollEndCol = Math.min(scroll.endCol, endCol);

    this.clearAnchorCell();

    //console.log(fixedRightIndex, endCol, dataInfo.colLength, "  setCellSelection22222222222 : ", startRow, endRow, minFixedLeftCol, minScrollEndCol, selection);

    for (let i = startRow; i < endRow; i++) {
      const currRow = scrollStartIdx + i;

      // 왼쪽 고정 영역
      if (enableLeftField) {
        for (let j = gridStartCol; j <= minFixedLeftCol; j++) {
          this.setCellSelectionStyleClass(leftElements[i][j], currRow, j, startCellIdx, startCellCol);
        }
      }

      // 중앙 스크롤 영역
      for (let j = scrollStartCol; j <= minScrollEndCol; j++) {
        this.setCellSelectionStyleClass(centerElements[i][j], currRow, j, startCellIdx, startCellCol);
      }

      // 오른쪽 고정 영역
      if (enableRightField) {
        for (let j = fixedRightIndex; j <= endCol; j++) {
          this.setCellSelectionStyleClass(rightElements[i][j], currRow, j, startCellIdx, startCellCol);
        }
      }
    }
  }

  /**
   
   */
  public getColumnLine() {
    return this.columnLine;
  }

  public getRowLine() {
    return this.rowLine;
  }

  /**
   * add cell selection style class
   * @param cellElement cell htmlelement
   * @param rowIdx row index
   * @param col col
   * @param startIdx start row index
   * @param startCol start cell
   * @returns
   */
  public setCellSelectionStyleClass(
    cellElement: HTMLElement,
    rowIdx: number,
    col: number,
    startIdx: number,
    startCol: number,
  ) {
    const classList = cellElement.classList;

    if (startIdx == rowIdx && startCol == col) {
      classList.add('dg-start-cell');
    }

    if (this.isAllSelect() || this.isSelection(rowIdx, col)) {
      if (!classList.contains(SELECTION_STYLE_CLASS)) classList.add(SELECTION_STYLE_CLASS);

      return true;
    }

    if (classList.contains(SELECTION_STYLE_CLASS)) classList.remove(SELECTION_STYLE_CLASS);

    return false;
  }

  /**
   * 선택된 cell 영역 구하기.
   *
   * @returns 선택된 cell 영역 구하기.
   */
  public getSelectionRangeInfo() {
    const rangeInfo = this.config.selection.range;

    const selectionStartIdx = rangeInfo.minIdx,
      selectionEndIdx = rangeInfo.maxIdx;

    let startRow = -1,
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
  public getSelectionModeColInfo(
    selectionMode: string,
    col: number,
    cfg: Config,
    cellElement: HTMLElement,
    isMouseDown?: boolean,
  ) {
    let startCol = col,
      endCol = col;

    if (isRowSelectionMode(selectionMode)) {
      startCol = cfg.dataInfo.startCol;
      endCol = cfg.dataInfo.colLength - 1;
    } else if (selectionMode == SelectionMode.MULTIPLE_CELL) {
      if (isMouseDown) {
        startCol = -1;
      } else if (hasClass(cellElement, 'dg-line-number')) {
        startCol = cfg.dataInfo.startCol;
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

    if (isRowSelectionMode(this.options.selectionMode)) {
      startCol = 0;
      endCol = this.config.dataInfo.colLength - 1;
    }

    const multipleFlag = isMultipleSelectionMode(this.options.selectionMode);

    if (multipleFlag && evtKey != 9 && isShiftKey(evt)) {
      this.setSelectionRangeInfo(
        {
          range: { endIdx: endIdx, endCol: endCol },
          startCell: { startIdx: endIdx, startCol: moveCol },
        } as any,
        false,
        true,
      );
    } else {
      this.setSelectionRangeInfo(
        {
          range: { startIdx: endIdx, endIdx: endIdx, startCol: startCol, endCol: endCol },
          startCell: { startIdx: endIdx, startCol: moveCol },
        } as any,
        true,
        true,
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

    return 'auto' + ++this.serialNumber;
  }

  /**
   * set start cell row index
   * @param {number} rowIdx row index
   */
  public setStartCellRowIdx(rowIdx: number) {
    this.config.selection.startCell.startIdx = rowIdx;
  }
}

/**
 * row 영역 선택여부 체크
 *
 * @param {SelectionRange} range 체크 range
 * @param {number} rowIdx row index
 * @param {number} minCol min col
 * @param {number} maxCol max col
 * @returns {boolean} result
 */
function isRowRange(range: SelectionRange, rowIdx: number, minCol: number, maxCol: number): boolean {
  return range.minIdx <= rowIdx && rowIdx <= range.maxIdx && range.minCol <= minCol && range.maxCol >= maxCol;
}

function isCellRange(range: SelectionRange, col: number, minIdx: number, maxIdx: number): boolean {
  return range.minCol <= col && col <= range.maxCol && range.minIdx <= minIdx && range.maxIdx >= maxIdx;
}
