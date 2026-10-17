import { AddRowOptions, CURRENT_MATCH_INFO, MatchedField, RowId, SearchMatchInfo, SearchMode, SearchResult, TreeViewItem } from '../types/Common.js';
import { GridOptions, SortOption } from '../types/GridOptions.js';
import { FieldSortInfo } from '../types/Header.js';
import { GridMain } from '../view/GridMain.js';
import { DataManager } from './DataManager';
/**
 * TreeDataManager class
 *
 * @class TreeDataManager
 * @typedef {TreeDataManager}
 */
export declare class TreeDataManager extends DataManager {
    private readonly idViewItemMap;
    private readonly idKey;
    private readonly pidKey;
    private readonly childrenKey;
    private originalTreeItems;
    private viewTreeItems;
    private flatViewTreeItems;
    private readonly visibleIndexMap;
    constructor(opts: GridOptions, gridMain: GridMain);
    /**
     * 트리 노드 렌더링을 위한 데이터 초기화
     * @param items 원본 데이터 배열
     */
    setItems(items: any[]): void;
    private convertOriginalTreeToTreeViewItems;
    /**
     * flat → tree
     * @param flatItems items
     * @returns
     */
    private buildTree;
    /**
     * viewItems
     * @param items items
     */
    buildViewItems(): void;
    /** 현재 정렬 순서를 유지하면서 접힌 하위 행까지 반환한다. */
    getAllTreeViewItems(): TreeViewItem[];
    private getTreeToList;
    /**
     * toggle row expand/collapse
     * @param rowId 행의 ID
     */
    toggleRow(rowId: RowId): void;
    /**
     * 모든 행을 접음
     */
    collapseAll(): void;
    /**
     * 모든 행을 펼침
     */
    expandAll(): void;
    private allToggle;
    /**
     * 특정 행을 펼침
     * @param rowId 펼칠 행의 ID
     * @returns
     */
    expandRow(rowId: RowId): void;
    private expandParents;
    /**
     * 검색
     *
     * @param keyword 검색어
     * @param options 검색 옵션
     * @returns
     */
    getSearchData(keyword: string, options: SearchMode): SearchResult;
    getMatchInfo(searchMatchInfo: SearchMatchInfo, isNew: boolean, options: SearchMode): CURRENT_MATCH_INFO;
    createMatchInfo(matchId: RowId, rowIndex: number, cellIndex: number, matchedFields: MatchedField[]): CURRENT_MATCH_INFO;
    /**
     * 정렬
     *
     * @param sortOrders 정렬 정보
     * @param sortOpts 정렬 옵션
     * @returns
     */
    getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): any[];
    getRowIndexById(rowId: RowId): number;
    /**
     * 트리 구조에 신규 행 아이템들을 추가
     *
     * @param items 추가할 아이템 배열
     * @param addOpts 추가 옵션 { rowId?, position? ('before' | 'after' | 'inside') }
     */
    addItems(items: any[], addOpts?: AddRowOptions, status?: string): number;
    /**
     * 행 삭제 구현
     * @param ids 삭제할 행의 ID 배열
     * @returns 삭제된 행 ID 배열
     */
    removeItems(ids: RowId[]): RowId[];
}
