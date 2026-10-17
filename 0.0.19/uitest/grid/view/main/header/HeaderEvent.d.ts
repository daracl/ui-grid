import { GridMain } from '../../GridMain.js';
import { Header } from './Header';
/**
 * Header class
 *
 * @class Header
 * @typedef {Header}
 */
export declare class HeaderEvent {
    private readonly gridMain;
    private readonly cfg;
    private readonly header;
    private readonly headerOpts;
    private readonly headerElement;
    private readonly headerCellElements;
    constructor(gridMain: GridMain, header: Header);
    init(): void;
    /**
     * 검색 버튼
     */
    initSearchButton(): void;
    /**
     * init header selection event
     */
    private initPointerEvent;
    /**
     * resize event
     *
     * @private
     */
    private initResizeEvent;
    /**
     * header all check
     *
     */
    private initHeaderCheckbox;
}
