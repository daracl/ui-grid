import { DataManager } from '../service/DataManager.js';
import { SearchMode, SearchResult, ViewItem } from '../types/Common.js';
export declare function gridDataSearch(searchList: ViewItem[], dataManager: DataManager, searchText: string, options: SearchMode): SearchResult;
export declare function highlightSingleMatch(text: string, match: {
    start: number;
    end: number;
}, highlightTag?: string): string;
