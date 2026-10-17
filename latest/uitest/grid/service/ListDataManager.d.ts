import { DataManager } from './DataManager.js';
import { AddRowOptions, CURRENT_MATCH_INFO, MatchedField, RowId, SearchMatchInfo, SearchMode, SearchResult, ViewItem } from '../types/Common.js';
import { GridOptions, SortOption } from '../types/GridOptions.js';
import { FieldSortInfo } from '../types/Header.js';
import { GridMain } from '../view/GridMain.js';
export declare class ListDataManager extends DataManager {
    constructor(opts: GridOptions, gridMain: GridMain, type?: string);
    /**
     * init item
     * @param items items
     * @param depth depth
     * @returns
     */
    private initItems;
    setItems(items: any[]): void;
    /**
     * 페이징 옵션 여부에 따라 현재 ViewItems 및 페이징 정보를 업데이트합니다.
     */
    private updatePagingAndViewItems;
    getSearchData(keyword: string, options: SearchMode): SearchResult;
    getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[];
    getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO;
    createMatchInfo(matchId: RowId, rowIndex: number, cellIndex: number, matchedFields: MatchedField[]): CURRENT_MATCH_INFO;
    getRowIndexById(rowId: RowId): number;
    /**
     * 신규 행 아이템들을 지정된 기준 위치(rowId, position)에 추가
     *
     * @param items 추가할 아이템 배열
     * @param addOpts AddRowOptions { rowId?, position? }
     */
    addItems(items: any[], addOpts?: AddRowOptions, status?: string): number;
    /**
     * ID 목록에 해당하는 행들을 삭제
     *
     * @param ids 삭제할 행 ID 배열
     * @returns 실제 삭제된 행 ID 배열
     */
    removeItems(ids: RowId[]): RowId[];
    expandRow(rowId: RowId): void;
}
