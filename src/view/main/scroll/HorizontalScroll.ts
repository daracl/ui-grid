import { SCROLL_THUMB_MIN_SIZE } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { eqAttributeValue, hasClass } from '@/util/domUtils';
import { eventPosition, isClickEvent, stopPreventCancel } from '@/util/eventUtils';
import { getCenterContentLeft, getHorizontalScrollPosition } from '@/util/gridUtils';
import { isFunction, isNumber, isString } from '@/util/utils';
import { Config } from '@t/GridConfig';
import { GridOptions } from '@t/GridOptions';
import { GridMain } from '../../GridMain';
import { Scroll } from './Scroll';

/**
 * horizontal scroll event
 */
export class HorizontalScroll {
  private readonly gridMain: GridMain;

  private readonly opts: GridOptions;

  private readonly horizontalElement: DaraElement;
  private readonly horizontalTrackElement: DaraElement;
  private readonly horizontalThumbElement: DaraElement;

  constructor(gridMain: GridMain, scroll: Scroll, horizontalElement: DaraElement) {
    this.gridMain = gridMain;

    this.opts = this.gridMain.options();

    this.horizontalElement = horizontalElement;
    this.horizontalTrackElement = horizontalElement.findDaraElement('.dg-scroll-track');
    this.horizontalThumbElement = horizontalElement.findDaraElement('.dg-scroll-thumb');
  }

  /**
   * horizontal event 초기화
   *
   */
  init() {
    this.initHorizontalTrack();
    this.initHorizontalThumb();
    this.initHorizontalButton();
  }

  /**
   * 가로 스크롤 계산
   * @returns
   */
  calculate() {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;

    if (!scroll.enableHorizontal) {
      scroll.left = 0;
      this.setHorizontalPosition(cfg);
      return;
    }

    const dimensions = cfg.dimensions;
    const opts = this.gridMain.options();
    const arrowButtonSize = opts.scroll.width * 2;

    const totalColWidth = dimensions.mainTotalWidth;

    const hWidth = dimensions.width - (scroll.enableVertical ? opts.scroll.width : 0) - 2; // 2 left right border
    // 2 top bottom border
    const hTrackWidth = hWidth - arrowButtonSize;
    let thumbWidth = (hTrackWidth * ((hTrackWidth / totalColWidth) * 100)) / 100;
    thumbWidth = Math.max(thumbWidth, SCROLL_THUMB_MIN_SIZE);

    this.horizontalElement.css({ width: hWidth + 'px' });
    this.horizontalThumbElement.css({ width: thumbWidth + 'px' });

    scroll.oneColMove = totalColWidth / cfg.dataInfo.colLength;
    scroll.hWidth = hWidth;
    scroll.hTrackWidth = hTrackWidth;
    scroll.hThumbWidth = thumbWidth;

    if (scroll.left + thumbWidth > hTrackWidth) {
      scroll.left = hTrackWidth - thumbWidth;
      this.setHorizontalPosition(cfg);
    } else {
      this.calcViewCol(cfg, scroll.centerLeftPosition);
    }
  }

  /**
   * init horizontal thumb drag event
   *
   * @private
   */
  private initHorizontalThumb() {
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    let dragging = false;
    let lastX = 0;
    let startX = 0;
    let initialLeft = 0;
    let animationFrameId: number | null = null;

    const horizontalThumbElement = this.horizontalThumbElement;
    const moveHorizontalScroll = this.moveHorizontalScroll.bind(this);

    const cleanup = () => {
      cfg.eventManager.off(document, 'touchmove mousemove touchend mouseup');
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      lastX = eventPosition(e).x;
    };

    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      dragging = false;

      horizontalThumbElement.removeClass('active');

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      const endX = eventPosition(e).x;
      moveHorizontalScroll({ position: initialLeft + (endX - startX) });

      cleanup();
    };

    const loop = () => {
      if (!dragging) return;

      const delta = lastX - startX;
      moveHorizontalScroll({ position: initialLeft + delta });

      animationFrameId = requestAnimationFrame(loop);
    };

    const orginHorizontalThumbElement = horizontalThumbElement.getElement();

    eventManager.off(orginHorizontalThumbElement, 'mousedown touchstart touchend mouseup');
    eventManager.on({ el: orginHorizontalThumbElement, type: 'mousedown touchstart' }, (e: MouseEvent | TouchEvent) => {
      if (!isClickEvent(e)) {
        return;
      }
      stopPreventCancel(e);

      dragging = true;
      startX = eventPosition(e).x;
      lastX = startX;
      initialLeft = cfg.scroll.left;

      horizontalThumbElement.addClass('active');

      eventManager.on({ el: document, type: 'touchmove mousemove' }, onMove);
      eventManager.on({ el: document, type: 'touchend mouseup' }, onEnd);

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(loop);

      return true;
    });
  }

  /**
   * init horizontal track event
   *
   * @private
   */
  private initHorizontalTrack() {
    const opts = this.opts;
    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    let bgMoveMode = 0;
    let leftFlag = false;

    let startEventX = 0;
    let oneColMove = 0;
    let bgMoveCol = 0;
    let horizontalScrollTimer: any;

    const horizontalTrackElement = this.horizontalTrackElement.getElement();

    eventManager.off(horizontalTrackElement, 'mousedown touchstart mouseup touchend mouseleave');
    eventManager.on({ el: horizontalTrackElement, type: 'mousedown touchstart' }, (e: MouseEvent) => {
      if (!isClickEvent(e)) {
        return;
      }
      bgMoveMode = 1;
      startEventX = e.offsetX;

      oneColMove = cfg.scroll.oneColMove;
      bgMoveCol = oneColMove * opts.scroll.horizontal.speed * 2;

      leftFlag = startEventX < cfg.scroll.left;

      horizontalScrollTimer = setInterval(() => {
        bgMoveMode = 2;

        this.moveHorizontalScroll({
          position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol),
        });
      }, 100);
    });

    eventManager.on({ el: horizontalTrackElement, type: 'mouseup touchend mouseleave' }, (e: Event) => {
      if (bgMoveMode == 1) {
        this.moveHorizontalScroll({
          position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol),
        });
      }
      clearTimeout(horizontalScrollTimer);
      bgMoveMode = 0;
    });
  }

  /**
   * init horizontal button event
   *
   * @private
   */
  private initHorizontalButton() {
    let scrollBtnTimer: any;
    const vBtnDelay = 100;
    let buttonMoveMode = 0;

    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;

    const scrollButtonElements = this.horizontalElement.finds('.dg-scroll-button');

    //세로 방향키
    eventManager.off(scrollButtonElements, 'mousedown touchstart mouseup touchend mouseleave');
    eventManager.on({ el: scrollButtonElements, type: 'mousedown touchstart' }, (e: Event) => {
      const mode = eqAttributeValue(e.currentTarget as HTMLElement, 'data-dg-mode', 'left');
      buttonMoveMode = 1;

      scrollBtnTimer = setInterval(() => {
        buttonMoveMode = 2;
        this.moveHorizontalScroll({ direction: mode ? 'L' : 'R' });
      }, vBtnDelay);
    });

    eventManager.on({ el: scrollButtonElements, type: 'mouseup touchend mouseleave' }, (e: Event) => {
      if (buttonMoveMode == 1) {
        const mode = hasClass(e.currentTarget as HTMLElement, 'left');
        this.moveHorizontalScroll({ direction: mode ? 'L' : 'R' });
      }
      clearInterval(scrollBtnTimer);
      buttonMoveMode = 0;
    });
  }

  /**
   *
   * @param cfg 설정 정보
   * @param startEventY start event y
   * @param oneRowMove row move value
   * @param upFlag up down flag up = true
   * @param bgMoveCol
   * @returns
   */
  public getHorizontalBgMovePostion(
    cfg: Config,
    startEventX: number,
    oneColMove: number,
    leftFlag: boolean,
    bgMoveCol: number,
  ) {
    let leftPosition = cfg.scroll.left + (leftFlag ? -1 : 1) * bgMoveCol;

    if (leftFlag) {
      if (startEventX >= leftPosition) {
        leftPosition = startEventX - oneColMove;
      }
    } else if (startEventX <= leftPosition + cfg.scroll.hThumbWidth) {
      leftPosition = startEventX - cfg.scroll.hThumbWidth + oneColMove * 2;
    }

    return leftPosition;
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
    const cfg = this.gridMain.config();

    if (!cfg.scroll.enableHorizontal) {
      if (cfg.scroll.left > 0) {
        this.moveHorizontalScrollPosition(0, moveObj.drawFlag);
      }

      if (moveObj.resizeFlag !== true) {
        return;
      }
    }

    let leftVal = 0;

    if (isNumber(moveObj.position)) {
      leftVal = moveObj.position;
    } else if (isNumber(moveObj.colIdx)) {
      let colIdx = moveObj.colIdx;

      if (colIdx > 0) {
        colIdx = Math.min(colIdx, cfg.dataInfo.colLength - 1);
      } else {
        colIdx = 0;
      }

      for (let i = cfg.fixedLeftIndex; i < colIdx; i++) {
        leftVal += cfg.currentFields[i].$width;
      }

      if (moveObj.direction == 'R') {
        leftVal = leftVal + cfg.currentFields[colIdx].$width;
      }

      leftVal = getHorizontalScrollPosition(cfg, leftVal, moveObj.direction);
    } else if (isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      leftVal = cfg.scroll.left + (moveObj.direction == 'L' ? -1 : 1) * speed * cfg.scroll.oneColMove;
    }

    this.moveHorizontalScrollPosition(leftVal, moveObj.drawFlag);
  }

  /**
   * @method moveHorizontalScrollPosition
   * @param leftVal {Integer} body left position
   * @param drawFlag {Boolean} draw flag
   * @param updateChkFlag {Boolean} 업데이트 여부.
   * @description 가로 스크롤바 위치 이동
   */
  public moveHorizontalScrollPosition(leftVal: number, drawFlag: boolean, updateChkFlag?: boolean) {
    const cfg = this.gridMain.config();
    const scroll = cfg.scroll;

    if (leftVal >= scroll.hTrackWidth - scroll.hThumbWidth) {
      leftVal = scroll.hTrackWidth - scroll.hThumbWidth;
    } else if (leftVal <= 0) {
      leftVal = 0;
    }

    if (scroll.left == leftVal) {
      return;
    }

    //this.gridMain.hideLayer();

    scroll.left = leftVal;

    if (updateChkFlag !== false) {
      const onUpdateFn = this.opts.scroll.horizontal.onUpdate;
      if (drawFlag !== false && isFunction(onUpdateFn)) {
        if (
          onUpdateFn({
            scrollLeft: leftVal,
            width: scroll.hTrackWidth,
            barPosition: scroll.hBarPosition,
          }) === false
        ) {
          return;
        }
      }
    }

    this.setHorizontalPosition(cfg);

    if (drawFlag === false) {
      return;
    }

    this.gridMain.getBody().dataDraw('hscroll');
  }

  /**
   * 가로 스크롤 위치 셋팅
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} contLeftVal scroll position
   */
  setHorizontalPosition(cfg: Config) {
    const centerLeftPosition = getCenterContentLeft(cfg, cfg.scroll.left);
    cfg.scroll.centerLeftPosition = centerLeftPosition;
    this.calcViewCol(cfg, centerLeftPosition);

    this.horizontalThumbElement.css({ left: cfg.scroll.left + 'px' });

    const leftCss = { left: '-' + centerLeftPosition + 'px' };

    this.gridMain.getHeader().setCenterElementStyle(leftCss);
    this.gridMain.getBody().setCenterElementStyle(leftCss);
    this.gridMain.getSummary().setCenterElementStyle(leftCss);
  }

  /**
   * view col 위치 구하기.
   *
   * @param {Config} cfg 설정 정보
   */
  calcViewCol(cfg: Config, centerLeftPosition: number) {
    const scroll = cfg.scroll;
    const dimensions = cfg.dimensions;
    const mainInsideWidth = dimensions.mainInsideWidth;

    const mainViewWidth = mainInsideWidth - (dimensions.mainLeftWidth + dimensions.mainRightWidth);

    const fields = cfg.fieldHeaderGroup.leafCenter;

    let itemLeftVal = 0;

    let startCol = 0,
      endCol = fields.length - 1;

    let startFlag = true,
      inSideStartFlag = true;

    for (let i = 0; i < fields.length; i++) {
      if (inSideStartFlag && itemLeftVal >= centerLeftPosition) {
        scroll.insideStartCol = i;
        inSideStartFlag = false;
      }

      itemLeftVal += fields[i].$width;

      if (startFlag && itemLeftVal >= centerLeftPosition) {
        startCol = i;
        startFlag = false;
        continue;
      }

      if (itemLeftVal - centerLeftPosition >= mainViewWidth) {
        endCol = i;
        break;
      }
    }

    scroll.before.startCol = scroll.startCol; // 이전데이터
    scroll.before.endCol = scroll.endCol;

    scroll.insideStartCol = cfg.fixedLeftIndex + scroll.insideStartCol;
    scroll.startCol = cfg.fixedLeftIndex + Math.max(startCol, 0);
    scroll.endCol = cfg.fixedLeftIndex + Math.min(endCol, fields.length);

    const colValue = getHorizontalScrollPosition(cfg, itemLeftVal, 'R') != scroll.left ? -1 : 0;
    // 화면에 다 보이는 col size
    scroll.insideEndCol = scroll.endCol + colValue;
  }
}
