import { SCROLL_THUMB_MIN_SIZE } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { eqAttributeValue, hasClass } from '@/util/domUtils';
import { eventPosition, isClickEvent, stopPreventCancel } from '@/util/eventUtils';
import { isFunction, isNumber, isString } from '@/util/utils';
import { Config, ScrollInfo } from '@t/GridConfig';
import { GridOptions } from '@t/GridOptions';
import { GridMain } from '../../GridMain';
import { Scroll } from './Scroll';

/**
 * vertical event
 */
export class VerticalScroll {
  private readonly gridMain: GridMain;

  private readonly opts: GridOptions;

  private readonly verticalElement: DaraElement;
  private readonly verticalTrackElement: DaraElement;
  private readonly verticalThumbElement: DaraElement;

  constructor(gridMain: GridMain, scroll: Scroll, verticalElement: DaraElement) {
    this.gridMain = gridMain;
    this.opts = this.gridMain.options();

    this.verticalElement = verticalElement;
    this.verticalTrackElement = verticalElement.findDaraElement('.dg-scroll-track');
    this.verticalThumbElement = verticalElement.findDaraElement('.dg-scroll-thumb');
  }

  /**
   * vertical event 초기화
   *
   */
  init() {
    this.initVerticalTrack();
    this.initVerticalThumb();
    this.initVerticalButton();
  }

  /**
   * 세로 스크롤 계산
   * @returns
   */
  calculate() {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;

    if (!scroll.enableVertical) {
      this.setVerticalPosition(scroll, 0);
      return;
    }

    const dimensions = cfg.dimensions;
    const opts = this.gridMain.options();
    const arrowButtonSize = opts.scroll.width * 2;

    const rowHeight = cfg.rowHeight;
    const totalRows = cfg.dataInfo.rowLength;
    const totalRowHeight = rowHeight * totalRows;
    const verticalHeight = dimensions.mainHeight - (scroll.enableHorizontal ? opts.scroll.width : 0);

    const vHeight = verticalHeight - 2; // 2 top bottom border
    const vTrackHeight = vHeight - arrowButtonSize;

    let thumbHeight = (vTrackHeight * ((dimensions.mainBodyHeight / totalRowHeight) * 100)) / 100;
    if (vTrackHeight < SCROLL_THUMB_MIN_SIZE) {
      thumbHeight = 0;
    } else {
      thumbHeight = Math.max(SCROLL_THUMB_MIN_SIZE, Math.min(thumbHeight, verticalHeight));
    }
    // row 보이기 기준으로 계산
    scroll.oneRowMove = (vTrackHeight - thumbHeight) / (totalRows - scroll.insideViewRow);

    this.verticalElement.css({ height: vHeight + 'px' });
    this.verticalThumbElement.css({ height: thumbHeight + 'px' });

    scroll.vHeight = vHeight;
    scroll.vTrackHeight = vTrackHeight;
    scroll.vThumbHeight = thumbHeight;

    //console.log("111111111scroll  : ", totalRows, scroll.startIdx, scroll.viewRow, scroll.insideViewRow);

    if (totalRows < scroll.startIdx + scroll.viewRow) {
      this.setVerticalPosition(scroll, (totalRows - scroll.insideViewRow) * scroll.oneRowMove);
    } else if (scroll.startIdx > 0) {
      this.setVerticalPosition(scroll, scroll.startIdx * scroll.oneRowMove);
    }
  }

  /**
   * init vertical track event
   *
   * @private
   */
  private initVerticalTrack() {
    const opts = this.opts;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    let bgMoveMode = 0;
    let upFlag = false;
    let oneRowMove = 0;
    let bgMoveRow = 0;
    let startEventY = 0;

    let verticalScrollTimer: any;
    const verticalTrackElement = this.verticalTrackElement.getElement();

    eventManager.off(verticalTrackElement, 'mousedown touchstart mouseup touchend mouseleave');
    eventManager.on({ el: verticalTrackElement, type: 'mousedown touchstart' }, (e: MouseEvent) => {
      if (!isClickEvent(e)) {
        return;
      }
      bgMoveMode = 1;
      startEventY = e.offsetY;
      oneRowMove = cfg.scroll.oneRowMove;
      bgMoveRow = oneRowMove * opts.scroll.vertical.speed * 5;

      upFlag = startEventY < cfg.scroll.top;

      verticalScrollTimer = setInterval(() => {
        bgMoveMode = 2;

        this.moveVerticalScroll({
          position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow),
        });
      }, 100);
    });

    eventManager.on({ el: verticalTrackElement, type: 'mouseup touchend mouseleave' }, (e: Event) => {
      if (bgMoveMode == 1) {
        this.moveVerticalScroll({
          position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow),
        });
      }
      clearTimeout(verticalScrollTimer);
      bgMoveMode = 0;
    });
  }

  private initVerticalButton() {
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    let scrollBtnTimer: any;
    const vBtnDelay = 100;
    const scrollButtonElements = this.verticalElement.finds('.dg-scroll-button');
    let buttonMoveMode = 0;
    //세로 방향키
    eventManager.off(scrollButtonElements, 'mousedown touchstart mouseup touchend mouseleave');
    eventManager.on({ el: scrollButtonElements, type: 'mousedown touchstart' }, (e: Event) => {
      const mode = eqAttributeValue(e.currentTarget as HTMLElement, 'data-dg-mode', 'up');

      buttonMoveMode = 1;

      scrollBtnTimer = setInterval(() => {
        buttonMoveMode = 2;
        this.moveVerticalScroll({ direction: mode ? 'U' : 'D' });
      }, vBtnDelay);
    });

    eventManager.on({ el: scrollButtonElements, type: 'mouseup touchend mouseleave' }, (e: Event) => {
      if (buttonMoveMode == 1) {
        const mode = hasClass(e.currentTarget as HTMLElement, 'up');
        this.moveVerticalScroll({ direction: mode ? 'U' : 'D' });
      }
      clearInterval(scrollBtnTimer);
      buttonMoveMode = 0;
    });
  }

  private initVerticalThumb() {
    const opts = this.opts;
    const cfg = this.gridMain.config();
    /* 스크롤 바 button drag */
    const tooltipFlag = opts.scroll.vertical.enableTooltip;
    const tooltipEle = this.verticalElement.findDaraElement('.dg-vscroll-bar-tip');
    const verticalThumbElement = this.verticalThumbElement;

    let dragging = false;
    let lastY = 0;
    let animationFrameId: number | null = null;
    let initialTop = 0;
    let startY = 0;

    // move 핸들러
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      lastY = eventPosition(e).y;
    };

    // end 핸들러
    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      dragging = false;
      verticalThumbElement.removeClass('active');

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      const endY = eventPosition(e).y;
      this.moveVerticalScroll({ position: initialTop + (endY - startY) });

      cfg.eventManager.off(document, 'touchmove mousemove touchend mouseup');

      if (tooltipFlag) {
        tooltipEle.hide();
      }
    };

    // 루프 함수 (매 프레임마다 스크롤 이동)
    const loop = () => {
      if (!dragging) return;

      const delta = lastY - startY;

      //console.log("111111 : ", lastY, startY);

      this.moveVerticalScroll({ position: initialTop + delta });

      if (tooltipFlag) {
        tooltipEle.text(cfg.scroll.viewRow + 1);
        tooltipEle.show();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const orginVerticalThumbElement = this.verticalThumbElement.getElement();
    cfg.eventManager.off(orginVerticalThumbElement, 'mousedown touchstart');
    cfg.eventManager.on(
      { el: orginVerticalThumbElement, type: 'mousedown touchstart' },
      (e: MouseEvent | TouchEvent) => {
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);

        dragging = true;
        initialTop = cfg.scroll.top;
        startY = eventPosition(e).y;
        lastY = startY;

        verticalThumbElement.addClass('active');

        // 이벤트 바인딩
        cfg.eventManager.on({ el: document, type: 'touchmove mousemove' }, onMove);
        cfg.eventManager.on({ el: document, type: 'touchend mouseup' }, onEnd);

        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId); // 중복 방지
        }
        animationFrameId = requestAnimationFrame(loop);

        return true;
      },
    );
  }

  /**
   *
   * @param cfg 설정 정보
   * @param startEventY start event y
   * @param oneRowMove row move value
   * @param upFlag up down flag up = true
   * @param bgMoveRow
   * @returns
   */
  private getVerticalBgMovePostion(
    cfg: Config,
    startEventY: number,
    oneRowMove: number,
    upFlag: boolean,
    bgMoveRow: number,
  ) {
    const scroll = cfg.scroll;
    let scrollTop = scroll.top + (upFlag ? -1 : 1) * bgMoveRow;

    if (upFlag) {
      if (scrollTop < 0) {
        scrollTop = startEventY - scroll.vThumbHeight;
      } else if (startEventY >= scrollTop) {
        scrollTop = startEventY - oneRowMove * 2;
      }
    } else if (startEventY <= scrollTop + scroll.vThumbHeight) {
      scrollTop = startEventY - scroll.vThumbHeight + oneRowMove * 2;
    }

    return scrollTop;
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
  moveVerticalScroll(moveObj: any) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;

    if (!scroll.enableVertical && moveObj.resizeFlag !== true) {
      scroll.startIdx = 0;
      return;
    }

    let topVal = 0;

    if (isNumber(moveObj.position)) {
      topVal = moveObj.position;
    } else if (isNumber(moveObj.rowIdx)) {
      topVal = moveObj.rowIdx * scroll.oneRowMove;
    } else if (isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      topVal = scroll.top + (moveObj.direction == 'U' ? -1 : 1) * speed * scroll.oneRowMove;
    }

    this.moveVerticalScrollPosition(topVal, moveObj.drawFlag);
  }

  /**
   *세로 스크롤 위치 이동.
   */
  private moveVerticalScrollPosition(topVal: number, drawFlag: boolean, updateChkFlag?: boolean) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;

    if (topVal >= scroll.vTrackHeight - scroll.vThumbHeight) {
      topVal = scroll.vTrackHeight - scroll.vThumbHeight;
    } else if (topVal <= 0) {
      topVal = 0;
    }

    if (scroll.top == topVal) {
      return;
    }

    //this.gridMain.hideLayer();

    if (updateChkFlag !== false) {
      const onUpdateFn = this.gridMain.options().scroll.vertical.onUpdate;
      if (drawFlag !== false && isFunction(onUpdateFn)) {
        if (onUpdateFn({ scrollTop: topVal, height: scroll.vTrackHeight }) === false) {
          return;
        }
      }
    }

    const beforeStartIdx = scroll.startIdx;

    this.setVerticalPosition(scroll, topVal);

    if (drawFlag === false || scroll.startIdx == beforeStartIdx) return;

    this.gridMain.getBody().dataDraw('vscroll');
  }

  /**
   * 세로 스크롤 위치 설정
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} topVal 스크롤 바 포지션
   */
  private setVerticalPosition(scroll: ScrollInfo, topVal: number) {
    if (topVal < 0) return;

    scroll.top = topVal;

    this.verticalThumbElement.css({ top: topVal + 'px' });

    let startIdx = 0;

    if (topVal > 0) {
      startIdx = Math.round(topVal / scroll.oneRowMove);
    }
    scroll.before.startIdx = scroll.startIdx;
    scroll.startIdx = startIdx;
  }
}
