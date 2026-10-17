import { DaraElement } from '../../../element/DaraElement.js';
import { GridMain } from '../../GridMain.js';
import { Config } from '../../../types/GridConfig.js';
import { Scroll } from './Scroll';
import { ScrollMoveOptions } from '../../../types/Scroll.js';
/**
 * horizontal scroll event
 */
export declare class HorizontalScroll {
    private readonly gridMain;
    private readonly scrollOpts;
    private readonly horizontalElement;
    private readonly horizontalTrackElement;
    private readonly horizontalThumbElement;
    constructor(gridMain: GridMain, scroll: Scroll, horizontalElement: DaraElement);
    /**
     * horizontal event 초기화
     *
     */
    init(): void;
    /**
     * 가로 스크롤 계산
     * @returns
     */
    calculate(): void;
    /**
     * init horizontal thumb drag event
     *
     * @private
     */
    private initHorizontalThumb;
    /**
     * init horizontal track event
     *
     * @private
     */
    private initHorizontalTrack;
    /**
     * init horizontal button event
     *
     * @private
     */
    private initHorizontalButton;
    /**
     *
     * @param cfg 설정 정보
     * @param startEventY start event y
     * @param oneRowMove row move value
     * @param upFlag up down flag up = true
     * @param bgMoveCol
     * @returns
     */
    getHorizontalBgMovePostion(cfg: Config, startEventX: number, oneColMove: number, leftFlag: boolean, bgMoveCol: number): number;
    /**
     * @method moveHorizontalScroll
     * @param  moveObj.position {Integer} left position
     * @param  moveObj.direction {String} 'L' or 'R'
     * @param  moveObj.drawFlag {boolean} redraw flag
     * @param  moveObj.speed {Integer} row move count
     * @description 가로 스크롤 이동.
     */
    moveHorizontalScroll(moveObj: ScrollMoveOptions): void;
    /**
     * @method moveHorizontalScrollPosition
     * @param leftVal {Integer} body left position
     * @param drawFlag {Boolean} draw flag
     * @param updateChkFlag {Boolean} 업데이트 여부.
     * @description 가로 스크롤바 위치 이동
     */
    moveHorizontalScrollPosition(leftVal: number, drawFlag?: boolean, updateChkFlag?: boolean): void;
    /**
     * 가로 스크롤 위치 셋팅
     *
     * @private
     * @param {Config} cfg 설정값
     * @param {number} contLeftVal scroll position
     */
    setHorizontalPosition(cfg: Config): void;
    /**
     * view col 위치 구하기.
     *
     * @param {Config} cfg 설정 정보
     */
    calcViewCol(cfg: Config, centerLeftPosition: number): void;
}
