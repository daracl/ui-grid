import { DaraElement } from '@/element/DaraElement';
import { isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { isEmpty } from '@/util/utils';
import { GridOptions } from '@t/GridOptions';
import { GridMain } from '@/view/GridMain';
import { HorizontalScroll } from './HorizontalScroll';
import { VerticalScroll } from './VerticalScroll';

/**
 * body scroll
 */
export class Scroll {
  private readonly gridMain: GridMain;

  private readonly opts: GridOptions;

  private readonly horizontalElement: DaraElement;

  private readonly verticalElement: DaraElement;

  private verticalScroll: VerticalScroll;
  private horizontalScroll: HorizontalScroll;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;

    this.opts = this.gridMain.options();

    this.horizontalElement = this.gridMain.mainElement().findDaraElement('.dg-scroll.dg-horizontal');

    this.verticalElement = this.gridMain.mainElement().findDaraElement('.dg-scroll.dg-vertical');
  }

  /**
   * init scroll
   */
  public init() {
    this.verticalScroll = new VerticalScroll(this.gridMain, this, this.verticalElement);
    this.horizontalScroll = new HorizontalScroll(this.gridMain, this, this.horizontalElement);

    this.calculate();

    this.initMouseWheel();
    this.initMobileTouch();

    if (this.opts.scroll.vertical.enable !== false) {
      this.verticalScroll.init();
    }

    this.horizontalScroll.init();
  }

  public calculate() {
    this.verticalScroll.calculate();
    this.horizontalScroll.calculate();
  }

  initMobileTouch() {
    const { scroll, rowHeight, dataInfo, eventManager } = this.gridMain.config();
    const opts = this.opts;

    const bodyElement = this.gridMain.mainElement().getElement().querySelector('.dg-body') as HTMLElement;
    let animationId: number;
    let lastX: number;
    let lastY: number;
    eventManager.off(bodyElement, 'touchstart');
    eventManager.on({ el: bodyElement, type: 'touchstart' }, (evt: TouchEvent) => {
      lastX = evt.touches[0].clientX;
      lastY = evt.touches[0].clientY;
    });

    const TOUCH_MOVE_DELAY = 50; // 터치 이동으로 간주되는 최소 거리
    let lastTouchTime = 0;

    eventManager.off(bodyElement, 'touchmove');
    eventManager.on(
      { el: bodyElement, type: 'touchmove' },
      (evt: TouchEvent) => {
        const x = evt.touches[0].clientX;
        const y = evt.touches[0].clientY;

        const dx = lastX - x;
        const dy = lastY - y;

        const now = Date.now();

        if (now - lastTouchTime < TOUCH_MOVE_DELAY) {
          return;
        }

        lastTouchTime = now;

        // ✔ 더 크게 움직인 방향만 선택
        if (scroll.enableHorizontal && Math.abs(dx) > Math.abs(dy)) {
          const upFlag = dx > 0;
          if ((upFlag && scroll.left != 0) || (!upFlag && scroll.left != scroll.hTrackWidth - scroll.hThumbWidth)) {
            cancelAnimationFrame(animationId);
            stopPreventCancel(evt);
          } else {
            cancelAnimationFrame(animationId);
            animationId = 0;
            return;
          }
          animationId = requestAnimationFrame(() => {
            this.moveHorizontalScroll({ direction: upFlag ? 'L' : 'R', speed: opts.scroll.horizontal.speed });
          });
        } else if (scroll.enableVertical) {
          const startIdx = scroll.startIdx;
          const upFlag = dy > 0;
          if ((upFlag && startIdx !== 0) || (!upFlag && startIdx + scroll.insideViewRow < dataInfo.rowLength)) {
            cancelAnimationFrame(animationId);
            stopPreventCancel(evt);
          } else {
            cancelAnimationFrame(animationId);
            animationId = 0;
            return;
          }

          animationId = requestAnimationFrame(() => {
            const speed = Math.abs(dy) / rowHeight;
            const pageCount = Math.ceil(dataInfo.rowLength / scroll.viewRow);
            this.moveVerticalScroll({
              direction: upFlag ? 'U' : 'D',
              speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed,
            });
          });
        }

        lastX = x;
        lastY = y;
      },
      { passive: false },
    );
  }

  private initMouseWheel() {
    const { scroll, dataInfo, eventManager } = this.gridMain.config();
    const opts = this.opts;

    const enableWheelInContainer = opts.scroll.enableWheelInContainer;

    const mainElement = this.gridMain.mainElement().getElement();
    let animationId: number;
    let beforeStartIdx = -1;
    eventManager.off(mainElement, 'wheel DOMMouseScroll');
    eventManager.on(
      { el: mainElement, type: 'wheel DOMMouseScroll' },
      (evt: WheelEvent) => {
        const delta = evt.deltaY;

        if (isEmpty(delta)) return;

        const isHorizontal = scroll.enableHorizontal && isShiftKey(evt);

        const startIdx = scroll.startIdx;

        if (enableWheelInContainer) stopPreventCancel(evt);

        //delta < 0 --up
        const upFlag = delta < 0;

        if (scroll.enableVertical && !isHorizontal) {
          if ((upFlag && startIdx !== 0) || (!upFlag && startIdx + scroll.insideViewRow < dataInfo.rowLength)) {
            stopPreventCancel(evt);
          } else {
            cancelAnimationFrame(animationId);
            animationId = 0;
            return;
          }

          if (beforeStartIdx == startIdx) return;

          beforeStartIdx = startIdx;

          animationId = requestAnimationFrame(() => {
            const speed = getFirstDigitMath(Math.abs(delta));
            const pageCount = Math.ceil(dataInfo.rowLength / scroll.viewRow);
            this.moveVerticalScroll({
              direction: upFlag ? 'U' : 'D',
              speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed,
            });
          });
        } else if (isHorizontal) {
          if ((upFlag && scroll.left != 0) || (!upFlag && scroll.left != scroll.hTrackWidth - scroll.hThumbWidth)) {
            stopPreventCancel(evt);
          } else {
            cancelAnimationFrame(animationId);
            animationId = 0;
            return;
          }

          animationId = requestAnimationFrame(() => {
            this.moveHorizontalScroll({ direction: upFlag ? 'L' : 'R', speed: opts.scroll.horizontal.speed });
          });
        }
      },
      { passive: false },
    );
  }

  /**
   * 세로 스크롤 이동.
   *
   * @param  moveObj.position {Integer} top position
   * @param  moveObj.direction {String} 'U' or 'D'
   * @param  moveObj.resizeFlag {boolean} resize flag
   * @param  moveObj.drawFlag {boolean} redraw flag
   * @param  moveObj.speed {Integer} row move count
   * @param  moveObj.rowIdx {Integer} move row idx
   */
  public moveVerticalScroll(moveObj: any) {
    this.verticalScroll.moveVerticalScroll(moveObj);
  }

  /**
   * @method moveHorizontalScroll
   * @param  moveObj.direction {String ,Integer} 'L' or 'R' or left position
   * @param  moveObj.resizeFlag {boolean} resize flag
   * @param  moveObj.drawFlag {boolean} redraw flag
   * @param  moveObj.speed {Integer} row move count
   * @description 가로 스크롤 이동.
   */
  public moveHorizontalScroll(moveObj: any) {
    this.horizontalScroll.moveHorizontalScroll(moveObj);
  }
}

function getFirstDigitMath(num: number) {
  while (num >= 10) {
    num = Math.floor(num / 10);
  }
  return num;
}
