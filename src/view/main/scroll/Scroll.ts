import { DaraElement } from '@/element/DaraElement';
import { isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { isEmpty } from '@/util/utils';
import { GridOptions } from '@t/GridOptions';
import { GridMain } from '../../GridMain';
import { HorizontalScroll } from './HorizontalScroll';
import { VerticalScroll } from './VerticalScroll';

export class Scroll {
  private readonly gridMain: GridMain;

  private readonly opts: GridOptions;

  private readonly horizontalElement: DaraElement;
  private readonly horizontalThumbElement: DaraElement;

  private readonly verticalElement: DaraElement;
  private readonly verticalThumbElement: DaraElement;

  private verticalScroll: VerticalScroll;
  private horizontalScroll: HorizontalScroll;

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;

    this.opts = this.gridMain.options();

    this.horizontalElement = this.gridMain.mainElement().findDaraElement('.dg-scroll.dg-horizontal');
    this.horizontalThumbElement = this.horizontalElement.findDaraElement('.dg-scroll-thumb');

    this.verticalElement = this.gridMain.mainElement().findDaraElement('.dg-scroll.dg-vertical');
    this.verticalThumbElement = this.verticalElement.findDaraElement('.dg-scroll-thumb');
  }

  /**
   * init scroll
   */
  public init() {
    this.verticalScroll = new VerticalScroll(this.gridMain, this, this.verticalElement);
    this.horizontalScroll = new HorizontalScroll(this.gridMain, this, this.horizontalElement);

    this.calculate();

    this.initMouseWheel();

    if (this.opts.scroll.vertical.enable !== false) {
      this.verticalScroll.init();
    }

    this.horizontalScroll.init();
  }

  public calculate() {
    this.verticalScroll.calculate();
    this.horizontalScroll.calculate();
  }

  private initMouseWheel() {
    const { scroll, dataInfo, eventManager } = this.gridMain.config();
    const opts = this.opts;

    const enableWheelInContainer = opts.scroll.enableWheelInContainer;

    const mainElement = this.gridMain.mainElement().getElement();

    eventManager.off(mainElement, 'wheel DOMMouseScroll');
    eventManager.on(
      { el: mainElement, type: 'wheel DOMMouseScroll' },
      (evt: WheelEvent) => {
        const delta = evt.deltaY;

        if (isEmpty(delta)) return;

        const isShift = isShiftKey(evt);

        //delta > 0--up
        if (scroll.enableVertical && !isShift) {
          const upDown = delta < 0 ? 'U' : 'D';
          if (
            (upDown == 'U' && scroll.startIdx == 0) ||
            (upDown == 'D' && scroll.startIdx + scroll.viewRow > dataInfo.rowLength)
          ) {
            if (enableWheelInContainer) stopPreventCancel(evt);

            return;
          }

          requestAnimationFrame(() => {
            const speed = getFirstDigitMath(Math.abs(delta));
            const pageCount = Math.ceil(dataInfo.rowLength / scroll.viewRow);
            this.moveVerticalScroll({
              direction: upDown,
              speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed,
            });
          });
          if (
            opts.scroll.enableWheelInContainer === true ||
            (scroll.top != 0 && scroll.top != scroll.vTrackHeight - scroll.vThumbHeight)
          ) {
            stopPreventCancel(evt);
          }
        } else if (scroll.enableHorizontal && (opts.scroll.horizontal.enableWheel === true || isShift)) {
          requestAnimationFrame(() => {
            this.moveHorizontalScroll({ direction: delta < 0 ? 'L' : 'R', speed: opts.scroll.horizontal.speed });
          });

          if (scroll.left != 0 && scroll.left != scroll.hTrackWidth - scroll.hThumbWidth) {
            stopPreventCancel(evt);
          }

          if (enableWheelInContainer) stopPreventCancel(evt);
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
