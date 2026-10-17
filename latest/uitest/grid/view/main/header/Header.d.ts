import { DaraElement } from '../../../element/DaraElement.js';
import { GridMain } from '../../GridMain.js';
/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export declare class Header {
    private readonly gridMain;
    private readonly headerOpts;
    private readonly headerEvent;
    private headerElement;
    private leftElement;
    private centerElement;
    private rightElement;
    private headerCellElements;
    private enabled;
    constructor(gridMain: GridMain);
    initHeader(): void;
    isEnabled(): boolean;
    getHeaderCellElements(): HTMLElement[];
    getHeaderElement(): DaraElement;
    /**
     * all item check
     *
     * @public
     * @param {boolean} checked
     * @param {?HTMLInputElement} [allCheckedElement]
     */
    setAllCheckItem(checked: boolean, allCheckedElement?: HTMLElement): void;
    /**
     * set check box style
     *
     * @public
     * @param {number} idx
     * @param {("all" | "none" | "partial")} mode
     */
    setCheckboxStyle(mode: 'all' | 'none' | 'partial'): void;
    /**
     * set header height
     *
     * @param {number} header height
     */
    setHeight(height: number): void;
    /**
     * set header panel width
     *
     * @public
     * @param {number} mainLeftWidth
     * @param {number} mainCenterWidth
     * @param {number} mainRightWidth
     */
    setGridPanelWidth(mainLeftWidth: number, mainCenterWidth: number, mainRightWidth: number): void;
    setCenterElementStyle(styleCss: any): void;
    setSearchIcon(searchDataFlag: boolean): void;
    createTemplate(): void;
    /**
     *  set column line selection style
     * @param columnLine  selected column line set
     * @param isAll all select flag
     * @returns
     */
    selectColumnAnchorCell(): void;
    clearAnchorCell(): void;
    /**
     * header html template
     *
     * @public
     * @param {string} type position type
     * @returns {string} template string
     */
    template(type: string): string;
}
