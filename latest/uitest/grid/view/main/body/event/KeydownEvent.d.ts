import { EventHandler } from '../../../../event/EventHandler.js';
import { SelectionInfo } from '../../../../selection/selection.js';
import { GridMain } from '../../../GridMain.js';
import { Body } from '../Body';
/**
 * keydown event class
 *
 * Keyboard navigation + virtual scroll optimized implementation.
 */
export declare class KeydownEvent implements EventHandler {
    private readonly body;
    private readonly gridMain;
    private readonly selectionInfo;
    private pasteElement;
    /**
     * 같은 frame에서 발생한 scroll 요청을 합친다.
     */
    private pendingScroll;
    /**
     * 실제 scroll 실행 예약 여부.
     *
     * RAF는 항상 하나만 유지한다.
     */
    private scrollRafId;
    constructor(gridMain: GridMain, body: Body, selectionInfo: SelectionInfo);
    /**
     * keydown event
     */
    init(): void;
    /**
     * navigation key 여부
     */
    private isNavigationKey;
    /**
     * 방향키 navigation
     */
    private arrowKeydownEvent;
    /**
     * Down row index
     */
    private getDownRowIndex;
    /**
     * Up row index
     */
    private getUpRowIndex;
    /**
     * Left column index
     */
    private getLeftColumnIndex;
    /**
     * Right column index
     */
    private getRightColumnIndex;
    /**
     * 현재 이동 위치가 viewport 밖인지 확인
     */
    private insideScrollCheck;
    /**
     * Vertical scroll cache
     */
    private scheduleVerticalScroll;
    /**
     * Horizontal scroll cache
     */
    private scheduleHorizontalScroll;
    /**
     * scroll 실행
     */
    private scheduleScrollFrame;
    destroy(): void;
}
