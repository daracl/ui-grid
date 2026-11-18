import { Config } from '../../types/GridConfig.js';
import { SearchMode } from '../../types/Common.js';
import { GridMain } from '../GridMain.js';
import { SearchOptions } from '../../types/GridOptions.js';
/**
 * DataSearch class
 *
 * @class DataSearch
 * @typedef {DataSearch}
 */
export declare abstract class DataSearch {
    protected readonly gridMain: GridMain;
    protected readonly cfg: Config;
    protected readonly searchOpts: SearchOptions;
    protected readonly allFieldNames: string[];
    protected readonly defaultSearchOpts: SearchOptions;
    protected readonly matchWholeRegex?: RegExp;
    constructor(gridMain: GridMain);
    abstract openSearch(): boolean;
    abstract search(searchText: string, opts: SearchMode): any;
    abstract setMatchCountText(): void;
}
