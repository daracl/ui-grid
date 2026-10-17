import { SearchMode } from '../../types/Common.js';
import { GridMain } from '../GridMain.js';
import { DataSearch } from './DataSearch';
/**
 * api search class
 *
 * @class ApiDataSearch
 * @typedef {DataSearch}
 */
export declare class ApiDataSearch extends DataSearch {
    constructor(gridMain: GridMain);
    openSearch(): boolean;
    search(searchText: string, opts: SearchMode): {
        count: number;
        matchIndex: number;
    };
    setMatchCountText(clear?: boolean): void;
}
