import { PagingInfo } from '../../types/PagingInfo.js';
import { GridMain } from '../GridMain';
/**
 * Footer class
 *
 * @class Footer
 * @typedef {Footer}
 */
export declare class Footer {
    private readonly gridMain;
    private readonly footerOpts;
    private selectionStatusElement;
    private footerElement;
    private readonly selectionInfo;
    private readonly cfg;
    private readonly isSelectionInfo;
    private pagingInfoElement;
    private paingElement;
    private readonly _isActive;
    constructor(gridMain: GridMain);
    /**
     * init footer event
     */
    init(): void;
    isEnabled(): boolean;
    /**
     * init paging event
     */
    initPagingEvent(): void;
    goPage(pageNum: number, drawFlag?: boolean): void;
    /**
     * selection status info
     *
     * @public
     * @param {string} info selection info
     */
    setSelectionStatus(dataInfo?: any): void;
    /**
     * set paging info
     *
     * @param pagingInfo paging info
     */
    private setPagingInfo;
    /**
     * paging
     *
     * @public
     * @param {PagingInfo} pagingInfo paging info
     * @returns {this}
     */
    setPagingTemplate(pagingInfo: PagingInfo): void;
}
