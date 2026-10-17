import { DaraElement } from '../../element/DaraElement.js';
import { GridMain } from '../GridMain';
/**
 * Summary class
 *
 * @class Summary
 * @typedef {Summary}
 */
export declare class Summary {
    private readonly gridMain;
    private readonly cfg;
    private readonly summaryOpts;
    private readonly _isActive;
    private summaryElement;
    private leftElement;
    private centerElement;
    private rightElement;
    private allSummaryRenders;
    constructor(gridMain: GridMain);
    init(): void;
    private initRenderer;
    isEnabled(): boolean;
    getElement(): DaraElement;
    setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number): void;
    setCenterElementStyle(styleCss: any): void;
    drawData(): void;
    private createTemplate;
    /**
     * html template
     *
     * @public
     * @param {string} type position type
     * @returns {string} template string
     */
    template(type: string): string;
    /**
     * row template
     *
     * @private
     * @param {number} rowIdx row index
     * @param {number} rowHeight row height
     * @param {FieldItem[]} fields fields 정보
     * @returns {string} template
     */
    private rowTemplate;
}
