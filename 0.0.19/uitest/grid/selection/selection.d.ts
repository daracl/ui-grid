import { GridMain } from '../view/GridMain.js';
import { Config, Selection, SelectionRange } from '../types/GridConfig.js';
import { GridOptions } from '../types/GridOptions.js';
import { RowId } from '../types/Common.js';
export declare class SelectionInfo {
    private readonly gridMain;
    private readonly options;
    private readonly config;
    private reversedAllRanges;
    private readonly rowLine;
    private readonly columnLine;
    /**
     * select id number
     *
     * @private
     * @type {number}
     */
    private serialNumber;
    constructor(gridMain: GridMain, options: GridOptions, config: Config);
    initSelection(): void;
    setSelectionRangeInfo(changeSelection: Selection, initFlag: boolean, cellSelectFlag?: boolean): void;
    /**
     * 주어진 SelectionRange의 행/열 인덱스를 실제 데이터 범위 내로 제한합니다.
     *
     * @param range - 현재 선택된 범위 객체
     * @param maxRow - 데이터의 최대 행 인덱스
     * @param maxCol - 데이터의 최대 열 인덱스
     * @returns 유효한 인덱스 범위로 조정된 새로운 SelectionRange
     */
    private clampRange;
    /**
     * 주어진 SelectionRange 목록에서 'remove' 모드 범위를 제외한
     * 실질적인 최소/최대 행 및 열 범위를 계산합니다.
     *
     * @param ranges - 정렬된 SelectionRange 목록 (보통 역순으로 되어 있음)
     * @returns 실제 선택된 셀의 최소/최대 행, 열 인덱스 정보
     */
    private computeEffectiveSelectionRange;
    /**
     * selection row col
     *
     * @private
     * @param {SelectionRange[]} ranges info
     */
    getSelectedRowsAndCols(ranges: SelectionRange[]): void;
    private setReverseAllRange;
    setRangeMinMaxInfo(rangeInfo: SelectionRange): SelectionRange;
    /**
     * set selection info
     *
     * @public
     * @param {Selection} currentSelection change selection info
     * @param {SelectionRange} changeSelection changeRangeInfo
     * @returns {*}
     */
    setSelectionInfo(initFlag: boolean, currentSelection: Selection, changeSelection: Selection): any;
    /**
     * is all cell selection
     *
     * @public
     * @returns {*} boolean
     */
    isAllSelect(): boolean;
    /**
     * cell all selection
     *
     * @public
     * @param {boolean} flag all selection true|false
     */
    setAllSelection(flag: boolean): void;
    /**
     * clear anchor cell
     *
     */
    clearAnchorCell(): void;
    selectAnchorCell(): void;
    removeStartAnchorCell(): void;
    /**
     * @method selectionData
     * @description select data 구하기.
     */
    selectionData(dataType?: 'text' | 'json', isSummary?: boolean): any;
    selectionRows(): any[];
    selectionRowIds(): any[];
    /**
     * selection check
     *
     * @public
     * @param {number} rowIdx row index
     * @param {number} col cell index
     * @returns {boolean} selection return
     */
    isSelection(rowIdx: number, col: number): boolean;
    /**
     * column selection check
     *
     * @public
     * @param {*} chackRange check column range info
     * @returns {boolean} true = selection, false = not selection
     */
    isColumnSelection(chackRange: any): boolean;
    /**
     * 선택된 cell 인지 확인
     *
     * @param {SelectionRange} range range info
     * @param {number} rowIdx row number
     * @param {number} col col number
     * @returns {boolean} 여부
     */
    isCellSelectionRange(range: SelectionRange, rowIdx: number, col: number): boolean;
    /**
     * 선택된 cell 인지 확인
     *
     * @param {SelectionRange} range range info
     * @param {number} rowIdx row number
     * @param {number} col col number
     * @returns {boolean} 여부
     */
    isCellSelection(range: SelectionRange, rowIdx: number, col: number): boolean;
    /**
     * cell select
     *
     * @public
     * @param {boolean} initFlag
     */
    setCellSelection(): void;
    /**
     
     */
    getColumnLine(): Set<number>;
    getRowLine(): Set<number>;
    getRowIds(): RowId[];
    /**
     * add cell selection style class
     * @param cellElement cell htmlelement
     * @param rowIdx row index
     * @param col col
     * @param startIdx start row index
     * @param startCol start cell
     * @returns
     */
    updateCellSelectionClass(cellElement: HTMLElement, rowIdx: number, col: number, startIdx: number, startCol: number): boolean;
    /**
     * 선택된 cell 영역 구하기.
     *
     * @returns 선택된 cell 영역 구하기.
     */
    getSelectionRangeInfo(): {
        startRow: number;
        endRow: number;
        startCol: number;
        endCol: number;
    };
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
    getSelectionModeColInfo(selectionMode: string, col: number, cfg: Config, cellElement: HTMLElement, isMouseDown?: boolean): {
        startCol: number;
        endCol: number;
    };
    /**
     * set range info
     *
     * @public
     * @param {number} evtCode event key
     * @param {Event} evt event
     * @param {number} endIdx end row index
     * @param {number} moveCol  move cell position
     */
    setRangeInfo(evtCode: string, evt: Event, endIdx: number, moveCol: number): void;
    /**
     * selection id
     *
     * @public
     * @param {?string} [type] selection type
     * @returns {string} selection id
     */
    getSelectionId(type?: string): string;
    /**
     * set start cell row index
     * @param {number} rowIdx row index
     */
    setStartCellRowIdx(rowIdx: number): void;
}
