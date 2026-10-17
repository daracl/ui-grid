import { DaraElement } from '../../../element/DaraElement.js';
import { GridMain } from '../../GridMain.js';
import { Scroll } from './Scroll';
import { ScrollMoveOptions } from '../../../types/Scroll.js';
/**
 * vertical event
 */
export declare class VerticalScroll {
    private readonly gridMain;
    private readonly scrollOpts;
    private readonly verticalElement;
    private readonly verticalTrackElement;
    private readonly verticalThumbElement;
    private bodyDrawPending;
    private bodyDrawAnimationId;
    private lastThumbTop;
    constructor(gridMain: GridMain, scroll: Scroll, verticalElement: DaraElement);
    /**
     * vertical event 초기화
     *
     */
    init(): void;
    /**
     * 세로 스크롤 계산
     * @returns
     */
    calculate(): void;
    /**
     * init vertical track event
     *
     * @private
     */
    private initVerticalTrack;
    private initVerticalButton;
    private initVerticalThumb;
    /**
     *
     * @param cfg 설정 정보
     * @param startEventY start event y
     * @param oneRowMove row move value
     * @param upFlag up down flag up = true
     * @param bgMoveRow
     * @returns
     */
    private getVerticalBgMovePostion;
    /**
     * 세로 스크롤 이동.
     *
     * @param  moveObj.position {Integer} top position
     * @param  moveObj.direction {String} 'U' or 'D'
     * @param  moveObj.drawFlag {boolean} redraw flag
     * @param  moveObj.speed {Integer} row move count
     * @param  moveObj.rowIdx {Integer} move row idx
     */
    moveVerticalScroll(moveObj: ScrollMoveOptions): void;
    /**
     *세로 스크롤 위치 이동.
     */
    private moveVerticalScrollPosition;
    private scheduleBodyDraw;
    destroy(): void;
    /**
     * 세로 스크롤 위치 설정
     *
     * @private
     * @param {Config} cfg 설정값
     * @param {number} topVal 스크롤 바 포지션
     */
    private setVerticalPosition;
}
