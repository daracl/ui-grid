import { GridMain } from '../../GridMain.js';
import { ScrollMoveOptions } from '../../../types/Scroll.js';
export declare class Scroll {
    destroy(): void;
    private readonly gridMain;
    private readonly opts;
    private readonly horizontalElement;
    private readonly verticalElement;
    private verticalScroll;
    private horizontalScroll;
    private wheelAnimationId;
    private pendingVerticalDelta;
    private pendingHorizontalDelta;
    private verticalWheelDirection;
    private horizontalWheelDirection;
    private verticalDirectionChanged;
    private horizontalDirectionChanged;
    private static readonly WHEEL_TICK;
    private static readonly DEFAULT_WHEEL_SPEED;
    private static readonly MAX_TICKS_PER_FRAME;
    constructor(gridMain: GridMain);
    /**
     * 스크롤을 초기화한다.
     */
    init(): void;
    /**
     * 스크롤 크기와 위치를 계산한다.
     */
    calculate(): void;
    /**
     * 마우스 휠 이벤트를 초기화한다.
     */
    private initMouseWheel;
    /**
     * 현재 wheel 방향으로 스크롤할 수 있는지 확인한다.
     */
    private canScroll;
    /**
     * 세로 wheel delta를 누적한다.
     */
    private addVerticalWheel;
    /**
     * 가로 wheel delta를 누적한다.
     */
    private addHorizontalWheel;
    /**
     * wheel animation frame을 예약한다.
     */
    private requestWheelAnimation;
    /**
     * 누적된 vertical/horizontal wheel을 처리한다.
     */
    private processWheel;
    /**
     * 지정된 방향으로 세로 스크롤 이동이 가능한지 확인합니다.
     *
     * @param direction - 세로 스크롤 이동 방향
     * @param scroll - 현재 스크롤 위치 및 표시 영역 정보
     * @param rowLength - 전체 행의 개수
     * @returns 해당 방향으로 이동할 수 있으면 true, 그렇지 않으면 false
     */
    private canMoveVertical;
    /**
     * 누적된 세로 wheel을 처리한다.
     */
    private processVerticalWheel;
    private canMoveHorizontal;
    /**
     * 누적된 가로 wheel을 처리한다.
     */
    private processHorizontalWheel;
    /**
     * wheel delta를 tick으로 변환한다.
     */
    private getWheelTicks;
    /**
     * 세로 wheel의 row 이동 속도를 반환한다.
     */
    private getVerticalWheelSpeed;
    /**
     * 가로 wheel의 이동 속도를 반환한다.
     */
    private getHorizontalWheelSpeed;
    /**
     * 처리한 세로 wheel delta를 소비한다.
     */
    private consumeVerticalDelta;
    /**
     * 처리한 가로 wheel delta를 소비한다.
     */
    private consumeHorizontalDelta;
    /**
     * 세로 wheel 상태를 초기화한다.
     */
    private clearVerticalWheel;
    /**
     * 가로 wheel 상태를 초기화한다.
     */
    private clearHorizontalWheel;
    /**
     * 처리할 wheel이 남아있는지 확인한다.
     */
    private hasPendingWheel;
    /**
     * 브라우저별 wheel delta를 동일한 기준으로 변환한다.
     */
    private normalizeWheelDelta;
    /**
     * 세로 스크롤을 이동한다.
     */
    moveVerticalScroll(moveObj: ScrollMoveOptions): void;
    /**
     * 가로 스크롤을 이동한다.
     */
    moveHorizontalScroll(moveObj: any): void;
}
