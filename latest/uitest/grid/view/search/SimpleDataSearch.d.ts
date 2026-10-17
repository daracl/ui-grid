import { SearchMode } from '../../types/Common.js';
import { GridMain } from '../GridMain.js';
import { DataSearch } from './DataSearch';
/**
 * simple search class
 *
 * @class SimpleDataSearch
 * @typedef {DataSearch}
 */
export declare class SimpleDataSearch extends DataSearch {
    private searchElement;
    private searchTextElement;
    private searchFieldElement;
    private matchCountElement;
    constructor(gridMain: GridMain);
    openSearch(): boolean;
    createTemplate(): void;
    /**
     * simple search template
     *
     * @private
     */
    private simpleTemplate;
    /**
     *  init simple search event
     */
    initSimpleModeEvent(): void;
    search(searchText: string, opts: SearchMode): any;
    private simpleSearch;
    setMatchCountText(clear?: boolean): void;
}
