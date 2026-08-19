import { DaraElement } from '@/element/DaraElement';
import { isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { GridMain } from '@/view/GridMain';
import { GridOptions } from '@t/GridOptions';
import { ScrollInfo } from '@t/GridConfig';
import { HorizontalScroll } from './HorizontalScroll';
import { VerticalScroll } from './VerticalScroll';
import { ScrollMoveOptions } from '@/types/Scroll';
import { ScrollDirectionX, ScrollDirectionXMap, ScrollDirectionY, ScrollDirectionYMap } from '@/constants';

export class Scroll {
  private readonly gridMain: GridMain;
  private readonly opts: GridOptions;

  private readonly horizontalElement: DaraElement;
  private readonly verticalElement: DaraElement;

  private verticalScroll: VerticalScroll;
  private horizontalScroll: HorizontalScroll;

  // wheel animation frame
  private wheelAnimationId = 0;

  // 누적된 wheel delta
  private pendingVerticalDelta = 0;
  private pendingHorizontalDelta = 0;

  // 현재 wheel 방향
  private verticalWheelDirection: ScrollDirectionY | null = null;
  private horizontalWheelDirection: ScrollDirectionX | null = null;

  // 방향이 변경되었는지 여부
  private verticalDirectionChanged = false;
  private horizontalDirectionChanged = false;

  // wheel 100 = 1 tick
  private static readonly WHEEL_TICK = 100;

  // wheel 1 tick당 기본 이동 row
  private static readonly DEFAULT_WHEEL_SPEED = 3;

  // 한 frame에서 처리할 최대 tick
  private static readonly MAX_TICKS_PER_FRAME = 2;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.opts = this.gridMain.options();

    this.horizontalElement = this.gridMain.getMainElement().findDaraElement('.dg-scroll.dg-horizontal');

    this.verticalElement = this.gridMain.getMainElement().findDaraElement('.dg-scroll.dg-vertical');
  }

  /**
   * 스크롤을 초기화한다.
   */
  public init() {
    this.verticalScroll = new VerticalScroll(this.gridMain, this, this.verticalElement);

    this.horizontalScroll = new HorizontalScroll(this.gridMain, this, this.horizontalElement);

    const scrollbarSize = this.gridMain.config().scrollbarSize;

    const edge = this.gridMain.getMainElement().findDaraElement('.dg-scroll-corner');

    edge.css({ width: `${scrollbarSize}px`, height: `${scrollbarSize}px` });

    this.calculate();

    this.initMouseWheel();

    if (!this.gridMain.config().disableVerticalScroll) {
      this.verticalScroll.init();
    }

    this.horizontalScroll.init();
  }

  /**
   * 스크롤 크기와 위치를 계산한다.
   */
  public calculate() {
    this.horizontalScroll.calculate();
    this.verticalScroll.calculate();
  }

  /**
   * 마우스 휠 이벤트를 초기화한다.
   */
  private initMouseWheel() {
    const { scroll, eventManager } = this.gridMain.config();

    const mainElement = this.gridMain.getMainElement().getElement();

    const disableVerticalScroll = this.gridMain.config().disableVerticalScroll;

    eventManager.off(mainElement, 'wheel DOMMouseScroll');
    eventManager.on(
      {
        el: mainElement,
        type: 'wheel DOMMouseScroll',
      },
      (evt: WheelEvent) => {
        const delta = this.normalizeWheelDelta(evt);

        if (delta === 0) {
          return;
        }

        const isHorizontal = scroll.enableHorizontal && isShiftKey(evt);

        if (!disableVerticalScroll && this.opts.scroll.enableWheelInContainer) {
          stopPreventCancel(evt);
        }

        if (!this.canScroll(scroll, delta, isHorizontal, disableVerticalScroll)) {
          return;
        }

        stopPreventCancel(evt);

        if (isHorizontal) {
          this.addHorizontalWheel(delta);
        } else {
          this.addVerticalWheel(delta);
        }

        this.requestWheelAnimation();
      },
      { passive: false },
    );
  }

  /**
   * 현재 wheel 방향으로 스크롤할 수 있는지 확인한다.
   */
  private canScroll(scroll: ScrollInfo, delta: number, isHorizontal: boolean, disableVerticalScroll: boolean): boolean {
    if (isHorizontal) {
      const maxLeft = scroll.hTrackWidth - scroll.hThumbWidth;

      if (delta < 0) {
        return scroll.left > 0;
      }

      return scroll.left < maxLeft;
    }

    if (disableVerticalScroll) {
      return false;
    }

    const rowLength = this.gridMain.config().dataInfo.rowLength;

    if (delta < 0) {
      return scroll.startIdx > 0;
    }

    return scroll.startIdx + scroll.insideViewRow < rowLength;
  }

  /**
   * 세로 wheel delta를 누적한다.
   */
  private addVerticalWheel(delta: number) {
    const direction = delta < 0 ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN;

    if (this.verticalWheelDirection !== null && this.verticalWheelDirection !== direction) {
      // 방향이 바뀌면 이전 방향의 누적량을 버린다.
      this.pendingVerticalDelta = delta;

      // 작은 delta라도 방향 변경 직후 바로 반응하도록 한다.
      this.verticalDirectionChanged = true;
    } else {
      this.pendingVerticalDelta += delta;
    }

    this.verticalWheelDirection = direction;
  }

  /**
   * 가로 wheel delta를 누적한다.
   */
  private addHorizontalWheel(delta: number) {
    const direction = delta < 0 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT;

    if (this.horizontalWheelDirection !== null && this.horizontalWheelDirection !== direction) {
      // 방향이 바뀌면 이전 방향의 누적량을 버린다.
      this.pendingHorizontalDelta = delta;

      // 작은 delta라도 방향 변경 직후 바로 반응하도록 한다.
      this.horizontalDirectionChanged = true;
    } else {
      this.pendingHorizontalDelta += delta;
    }

    this.horizontalWheelDirection = direction;
  }

  /**
   * wheel animation frame을 예약한다.
   */
  private requestWheelAnimation() {
    if (this.wheelAnimationId !== 0) {
      return;
    }

    this.wheelAnimationId = requestAnimationFrame(() => {
      this.wheelAnimationId = 0;

      this.processWheel();

      if (this.hasPendingWheel()) {
        this.requestWheelAnimation();
      }
    });
  }

  /**
   * 누적된 vertical/horizontal wheel을 처리한다.
   */
  private processWheel() {
    if (this.pendingVerticalDelta !== 0) {
      this.processVerticalWheel();
    }

    if (this.pendingHorizontalDelta !== 0) {
      this.processHorizontalWheel();
    }
  }

  /**
   * 지정된 방향으로 세로 스크롤 이동이 가능한지 확인합니다.
   *
   * @param direction - 세로 스크롤 이동 방향
   * @param scroll - 현재 스크롤 위치 및 표시 영역 정보
   * @param rowLength - 전체 행의 개수
   * @returns 해당 방향으로 이동할 수 있으면 true, 그렇지 않으면 false
   */
  private canMoveVertical(direction: ScrollDirectionY, scroll: ScrollInfo, rowLength: number) {
    return direction === ScrollDirectionYMap.UP
      ? scroll.startIdx > 0
      : scroll.startIdx + scroll.insideViewRow < rowLength;
  }

  /**
   * 누적된 세로 wheel을 처리한다.
   */
  private processVerticalWheel() {
    const { scroll, dataInfo } = this.gridMain.config();

    if (this.pendingVerticalDelta === 0 || this.verticalWheelDirection === null) {
      return;
    }

    const direction = this.verticalWheelDirection;

    const rowLength = dataInfo.rowLength;

    const canMove = this.canMoveVertical(direction, scroll, rowLength);

    if (!canMove) {
      this.clearVerticalWheel();
      return;
    }

    const ticks = this.getWheelTicks(this.pendingVerticalDelta, this.verticalDirectionChanged);

    if (ticks <= 0) {
      return;
    }

    const speed = this.getVerticalWheelSpeed();

    this.moveVerticalScroll({
      direction,
      speed: speed * ticks,
    });

    this.consumeVerticalDelta(ticks);

    this.verticalDirectionChanged = false;

    const nextCanMove = this.canMoveVertical(direction, scroll, rowLength);

    if (!nextCanMove) {
      this.clearVerticalWheel();
    }
  }

  private canMoveHorizontal(direction: ScrollDirectionX, scroll: ScrollInfo, maxLeft: number) {
    return direction === ScrollDirectionXMap.LEFT ? scroll.left > 0 : scroll.left < maxLeft;
  }

  /**
   * 누적된 가로 wheel을 처리한다.
   */
  private processHorizontalWheel() {
    const { scroll } = this.gridMain.config();

    if (this.pendingHorizontalDelta === 0 || this.horizontalWheelDirection === null) {
      return;
    }

    const direction = this.horizontalWheelDirection;

    const maxLeft = scroll.hTrackWidth - scroll.hThumbWidth;

    const canMove = this.canMoveHorizontal(direction, scroll, maxLeft);

    if (!canMove) {
      this.clearHorizontalWheel();
      return;
    }

    const ticks = this.getWheelTicks(this.pendingHorizontalDelta, this.horizontalDirectionChanged);

    if (ticks <= 0) {
      return;
    }

    const speed = this.getHorizontalWheelSpeed();

    this.moveHorizontalScroll({
      direction,
      speed: speed * ticks,
    });

    this.consumeHorizontalDelta(ticks);

    this.horizontalDirectionChanged = false;

    const nextCanMove = this.canMoveHorizontal(direction, scroll, maxLeft);

    if (!nextCanMove) {
      this.clearHorizontalWheel();
    }
  }

  /**
   * wheel delta를 tick으로 변환한다.
   */
  private getWheelTicks(delta: number, directionChanged: boolean): number {
    const ticks = Math.floor(Math.abs(delta) / Scroll.WHEEL_TICK);

    if (ticks > 0) {
      return Math.min(ticks, Scroll.MAX_TICKS_PER_FRAME);
    }

    // 방향이 바뀐 직후에는 작은 delta라도
    // 최소 1 tick을 처리한다.
    if (directionChanged) {
      return 1;
    }

    return 0;
  }

  /**
   * 세로 wheel의 row 이동 속도를 반환한다.
   */
  private getVerticalWheelSpeed(): number {
    const speed = this.opts.scroll.vertical.speed;

    return speed > 0 ? speed : Scroll.DEFAULT_WHEEL_SPEED;
  }

  /**
   * 가로 wheel의 이동 속도를 반환한다.
   */
  private getHorizontalWheelSpeed(): number {
    const speed = this.opts.scroll.horizontal.speed;

    return speed > 0 ? speed : Scroll.DEFAULT_WHEEL_SPEED;
  }

  /**
   * 처리한 세로 wheel delta를 소비한다.
   */
  private consumeVerticalDelta(ticks: number) {
    const consumed = ticks * Scroll.WHEEL_TICK;

    if (this.pendingVerticalDelta < 0) {
      this.pendingVerticalDelta += consumed;
    } else {
      this.pendingVerticalDelta -= consumed;
    }

    if (Math.abs(this.pendingVerticalDelta) < Scroll.WHEEL_TICK) {
      this.pendingVerticalDelta = 0;
    }
  }

  /**
   * 처리한 가로 wheel delta를 소비한다.
   */
  private consumeHorizontalDelta(ticks: number) {
    const consumed = ticks * Scroll.WHEEL_TICK;

    if (this.pendingHorizontalDelta < 0) {
      this.pendingHorizontalDelta += consumed;
    } else {
      this.pendingHorizontalDelta -= consumed;
    }

    if (Math.abs(this.pendingHorizontalDelta) < Scroll.WHEEL_TICK) {
      this.pendingHorizontalDelta = 0;
    }
  }

  /**
   * 세로 wheel 상태를 초기화한다.
   */
  private clearVerticalWheel() {
    this.pendingVerticalDelta = 0;
    this.verticalWheelDirection = null;
    this.verticalDirectionChanged = false;
  }

  /**
   * 가로 wheel 상태를 초기화한다.
   */
  private clearHorizontalWheel() {
    this.pendingHorizontalDelta = 0;
    this.horizontalWheelDirection = null;
    this.horizontalDirectionChanged = false;
  }

  /**
   * 처리할 wheel이 남아있는지 확인한다.
   */
  private hasPendingWheel(): boolean {
    return (
      Math.abs(this.pendingVerticalDelta) >= Scroll.WHEEL_TICK ||
      Math.abs(this.pendingHorizontalDelta) >= Scroll.WHEEL_TICK ||
      this.verticalDirectionChanged ||
      this.horizontalDirectionChanged
    );
  }

  /**
   * 브라우저별 wheel delta를 동일한 기준으로 변환한다.
   */
  private normalizeWheelDelta(evt: WheelEvent): number {
    let delta = evt.deltaY;

    if (!Number.isFinite(delta) || delta === 0) {
      return 0;
    }

    if (evt.deltaMode === 1) {
      delta *= 16;
    } else if (evt.deltaMode === 2) {
      delta *= this.gridMain.config().dimensions.mainHeight;
    }

    return delta;
  }

  /**
   * 세로 스크롤을 이동한다.
   */
  public moveVerticalScroll(moveObj: ScrollMoveOptions) {
    this.verticalScroll.moveVerticalScroll(moveObj);
  }

  /**
   * 가로 스크롤을 이동한다.
   */
  public moveHorizontalScroll(moveObj: any) {
    this.horizontalScroll.moveHorizontalScroll(moveObj);
  }
}
