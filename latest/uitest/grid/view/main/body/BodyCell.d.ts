import { CellInfo } from '../../../types/GridConfig.js';
import { FieldItem } from '../../../types/GridField.js';
import { BodyContext } from './BodyContext';
import { BodyMatchInfo } from '../../../types/Body.js';
/**
 * Body Cell 관리
 *
 * Cell의 style, class, selection, search 상태를 관리
 */
export declare class BodyCell {
    private readonly context;
    /**
     * Body Cell 생성
     *
     * @param context Body Context
     */
    constructor(context: BodyContext);
    /** Center Element Style 설정 */
    setCenterElementStyle(styleCss: any): void;
    /** 시작 Cell Element 반환 */
    getStartCellElement(): HTMLElement;
    /**
     * Grid 영역 너비 설정
     *
     * @param leftWidth Left 영역 너비
     * @param centerWidth Center 영역 너비
     * @param rightWidth Right 영역 너비
     */
    setGridPanelWidth(leftWidth: number, centerWidth: number, rightWidth: number): void;
    /**
     * Cell 동적 Class 설정
     *
     * 기존 동적 Class를 제거하고 새로운 Class를 적용
     *
     * @param cellEle Cell Element
     * @param rowIdx View Row Index
     * @param col Column Index
     * @param field Field 정보
     * @param item Row 데이터
     */
    setCellClassName(cellEle: HTMLElement, rowIdx: number, col: number, field: FieldItem, item: any): void;
    /**
     * Cell Style 및 상태 갱신
     *
     * Cell 높이, 동적 Class, Search, Selection 상태를 갱신
     *
     * @param startCellInfo Selection 시작 Cell 정보
     * @param rowIdx View Row Index
     * @param col Column Index
     * @param cellElement Cell Element
     * @param field Field 정보
     * @param item Row 데이터
     * @param matchInfo Search Match 정보
     */
    setCellStyle(startCellInfo: any, rowIdx: number, col: number, cellElement: HTMLElement, field: FieldItem, item: any, matchInfo: BodyMatchInfo): void;
    /** Search Highlight 제거 */
    clearSearchHighlight(): void;
    /**
     * 수정된 Cell 다시 렌더링
     *
     * @param cell 수정된 Cell 정보
     */
    refreshEditedCell(cell: CellInfo): void;
    /** Cell 상태 정리 */
    destroy(): void;
}
