import { SummaryItem } from '../types/Summary.js';
import { GridMain } from '../view/GridMain.js';
import { Config, CellPositionInfo } from '../types/GridConfig.js';
import { FieldItem } from '../types/GridField.js';
/**
 * summary Render
 *
 * @export
 * @abstract
 * @class SummaryRenderer
 * @typedef {SummaryRenderer}
 */
export declare abstract class SummaryRenderer {
    protected readonly summaryItem: SummaryItem;
    protected readonly isVauleFunction: boolean;
    protected isClick: boolean;
    protected readonly cfg: Config;
    protected field: FieldItem;
    protected fieldName: string;
    protected gridMain: GridMain;
    protected language: import("../util/Language").Language;
    private readonly hasCellClassName;
    private readonly cellClassNameCache;
    constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem);
    /**
     * view render
     *
     * @public
     * @abstract
     * @param {HTMLElement} element cell element
     */
    abstract render(cellInfo: CellPositionInfo, element: HTMLElement): void;
    getCol(): number;
    getFieldInfo(): FieldItem;
    getSummaryItem(): SummaryItem;
    /**
     * 값 얻기
     * @param rowItem row item
     * @returns
     */
    getValue(): any;
    setCellClassName(renderValue: any, element: HTMLElement): void;
    /**
     *  값 정렬 스타일
     * @returns {string} align style
     */
    alignStyle(): string;
}
