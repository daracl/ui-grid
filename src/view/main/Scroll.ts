import { GridOptions } from "@t/GridOptions";
import { Config } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { getCenterContentLeft, getHorizontalScrollPosition } from "src/util/gridUtils";
import { eventOff, eventOn, eventPosition, isShiftKey, stopPreventCancel } from "src/util/eventUtils";
import DaraGrid from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import { hasClass } from "src/util/domUtils";
import { SCROLL_ARROW_BUTTON_SIZE } from "src/constants";

const SCROLL_THUMB_MIN_SIZE = 18;

export default class Scroll {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private opts: GridOptions;

  private horizontalElement: DaraElement;
  private horizontalTrackElement: DaraElement;
  private horizontalThumbElement: DaraElement;

  private verticalElement: DaraElement;
  private verticalTrackElement: DaraElement;
  private verticalThumbElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.opts = this.grid.getOptions();

    this.horizontalElement = this.gridMain.mainElement().findDaraElement(".dg-scroll.horizontal");
    this.horizontalTrackElement = this.horizontalElement.findDaraElement(".dg-scroll-track");
    this.horizontalThumbElement = this.horizontalElement.findDaraElement(".dg-scroll-thumb");

    this.verticalElement = this.gridMain.mainElement().findDaraElement(".dg-scroll.vertical");
    this.verticalTrackElement = this.verticalElement.findDaraElement(".dg-scroll-track");
    this.verticalThumbElement = this.verticalElement.findDaraElement(".dg-scroll-thumb");

    this.calcScroll();

    this.initEvent();
  }

  public calcScroll() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    const arrowButtonSize = SCROLL_ARROW_BUTTON_SIZE * 2;

    if (cfg.scroll.enableVertical) {
      const rowHeight = opts.body.row.height;
      const totalRows = cfg.dataInfo.rowLength;
      const totalRowHeight = rowHeight * totalRows;
      const verticalHeight = dimensions.mainHeight - (cfg.scroll.enableHorizontal ? opts.scroll.width : 0);

      const vHeight = verticalHeight;
      const vTrackHeight = vHeight - arrowButtonSize;

      let thumbHeight = (vTrackHeight * ((dimensions.mainBodyHeight / totalRowHeight) * 100)) / 100;
      if (vTrackHeight < SCROLL_THUMB_MIN_SIZE) {
        thumbHeight = 0;
      } else {
        thumbHeight = Math.max(SCROLL_THUMB_MIN_SIZE, Math.min(thumbHeight, verticalHeight));
      }

      // row 보이기 기준으로 계산
      cfg.scroll.oneRowMove = (vTrackHeight - thumbHeight) / (totalRows - Math.floor(dimensions.mainBodyHeight / rowHeight));

      this.verticalElement.css({ height: vHeight + "px" });
      this.verticalThumbElement.css({ height: thumbHeight + "px" });

      cfg.scroll.vHeight = vHeight;
      cfg.scroll.vTrackHeight = vTrackHeight;
      cfg.scroll.vThumbHeight = thumbHeight;

      if (totalRows < cfg.scroll.startIdx + cfg.scroll.viewRow) {
        this.setVerticalPosition(cfg, (totalRows - cfg.scroll.viewRow) * cfg.scroll.oneRowMove);
      } else if (cfg.scroll.startIdx > 0) {
        this.setVerticalPosition(cfg, cfg.scroll.startIdx * cfg.scroll.oneRowMove);
      }
    } else {
      this.setVerticalPosition(cfg, 0);
    }

    if (cfg.scroll.enableHorizontal) {
      const totalColWidth = dimensions.mainTotalWidth;

      const hWidth = dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0);
      const hTrackWidth = hWidth - arrowButtonSize;
      let thumbWidth = (hTrackWidth * ((hTrackWidth / totalColWidth) * 100)) / 100;
      thumbWidth = Math.max(thumbWidth, SCROLL_THUMB_MIN_SIZE);

      this.horizontalElement.css({ width: hWidth + "px" });
      this.horizontalThumbElement.css({ width: thumbWidth + "px" });

      cfg.scroll.oneColMove = totalColWidth / cfg.dataInfo.colLength;
      cfg.scroll.hWidth = hWidth;
      cfg.scroll.hTrackWidth = hTrackWidth;
      cfg.scroll.hThumbWidth = thumbWidth;

      if (cfg.scroll.left + thumbWidth > hTrackWidth) {
        cfg.scroll.left = hTrackWidth - thumbWidth;
        this.setHorizontalPosition(cfg);
      } else {
        this.calcViewCol(cfg, cfg.scroll.centerLeftPosition);
      }
    } else {
      cfg.scroll.left = 0;
      this.setHorizontalPosition(cfg);
    }
  }

  /**
   * @method scroll
   * @description 스크롤 컨트롤.
   */
  public initEvent() {
    this.initMouseWheel();

    this.initVerticalEvent();

    this.initHorizontalEvent();

    //this.config;
  }

  private initMouseWheel() {
    const cfg = this.grid.config();
    const opts = this.opts;

    this.gridMain.mainElement().eventOff("wheel DOMMouseScroll");
    this.gridMain.mainElement().eventOn(
      "wheel DOMMouseScroll",
      (evt: WheelEvent) => {
        let delta = evt.deltaY;

        if (utils.isEmpty(delta)) return;

        const isShift = isShiftKey(evt);

        //delta > 0--up
        if (cfg.scroll.enableVertical && !isShift) {
          requestAnimationFrame(() => {
            const speed = getFirstDigitMath(Math.abs(delta));
            const pageCount = Math.ceil(cfg.dataInfo.rowLength / cfg.scroll.viewRow);
            this.moveVerticalScroll({ direction: delta < 0 ? "U" : "D", speed: pageCount < 2 ? 1 : opts.scroll.vertical.speed * speed });
          });
          if (opts.scroll.enableStopPropagation === true || (cfg.scroll.top != 0 && cfg.scroll.top != cfg.scroll.vTrackHeight - cfg.scroll.vThumbHeight)) {
            stopPreventCancel(evt);
          }
        } else if (cfg.scroll.enableHorizontal && (opts.scroll.horizontal.enableWheel === true || isShift)) {
          requestAnimationFrame(() => {
            this.moveHorizontalScroll({ direction: delta < 0 ? "L" : "R", speed: opts.scroll.horizontal.speed });
          });

          if (opts.scroll.enableStopPropagation === true || (cfg.scroll.left != 0 && cfg.scroll.left != cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth)) {
            stopPreventCancel(evt);
          }
        }
      },
      null,
      { passive: false }
    );
  }

  /**
   * vertical event 초기화
   *
   * @private
   */
  private initVerticalEvent() {
    const opts = this.opts;

    if (opts.scroll.vertical.enable === false) return;

    this.initVerticalTrack();
    this.initVerticalThumb();
    this.initVerticalButton();
  }

  /**
   * init vertical track event
   *
   * @private
   */
  private initVerticalTrack() {
    const opts = this.opts;
    const cfg = this.grid.config();

    let bgMoveMode = 0;
    let upFlag = false;
    let oneRowMove = 0;
    let bgMoveRow = 0;
    let startEventY = 0;

    let verticalScrollTimer: any;

    this.verticalTrackElement.eventOff("mousedown touchstart mouseup touchend mouseleave");
    this.verticalTrackElement
      .eventOn(
        "mousedown touchstart",
        (e: MouseEvent) => {
          bgMoveMode = 1;
          startEventY = e.offsetY;
          oneRowMove = cfg.scroll.oneRowMove;
          bgMoveRow = oneRowMove * opts.scroll.vertical.speed * 5;

          upFlag = startEventY < cfg.scroll.top;

          verticalScrollTimer = setInterval(() => {
            bgMoveMode = 2;

            this.moveVerticalScroll({ position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow) });
          }, 100);
        },
        null,
        { passive: false }
      )
      .eventOn("mouseup touchend mouseleave", (e: Event) => {
        if (bgMoveMode == 1) {
          this.moveVerticalScroll({ position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow) });
        }
        clearTimeout(verticalScrollTimer);
        bgMoveMode = 0;
      });
  }

  private initVerticalButton() {
    let scrollBtnTimer: any;
    let vBtnDelay = 100;
    const scrollButtonElements = this.verticalElement.finds(".dg-scroll-button");
    let buttonMoveMode = 0;
    //세로 방향키
    eventOff(scrollButtonElements, "mousedown touchstart mouseup touchend mouseleave");
    eventOn(
      scrollButtonElements,
      "mousedown touchstart",
      (e: Event) => {
        const mode = hasClass(e.currentTarget as HTMLElement, "up");
        buttonMoveMode = 1;

        scrollBtnTimer = setInterval(() => {
          buttonMoveMode = 2;
          this.moveVerticalScroll({ direction: mode ? "U" : "D" });
        }, vBtnDelay);
      },
      null,
      { passive: false }
    );
    eventOn(scrollButtonElements, "mouseup touchend mouseleave", (e: Event) => {
      if (buttonMoveMode == 1) {
        const mode = hasClass(e.currentTarget as HTMLElement, "up");
        this.moveVerticalScroll({ direction: mode ? "U" : "D" });
      }
      clearInterval(scrollBtnTimer);
      buttonMoveMode = 0;
    });
  }

  private initVerticalThumb() {
    const opts = this.opts;
    const cfg = this.grid.config();
    /* 스크롤 바 button drag */
    const tooltipFlag = opts.scroll.vertical.enableTooltip;
    const tooltipEle = this.verticalElement.findDaraElement(".dg-vscroll-bar-tip");
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
      verticalThumbElement.removeClass("active");

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      const endY = eventPosition(e).y;
      this.moveVerticalScroll({ position: initialTop + (endY - startY) });

      eventOff(document, "touchmove mousemove");
      eventOff(document, "touchend mouseup");

      if (tooltipFlag) {
        tooltipEle.hide();
      }
    };

    // 루프 함수 (매 프레임마다 스크롤 이동)
    const loop = () => {
      if (!dragging) return;

      const delta = lastY - startY;
      this.moveVerticalScroll({ position: initialTop + delta });

      if (tooltipFlag) {
        tooltipEle.text(cfg.scroll.viewRow + 1);
        tooltipEle.show();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    verticalThumbElement.eventOff("touchstart mousedown");
    verticalThumbElement.eventOn(
      "touchstart mousedown",
      (e: MouseEvent | TouchEvent) => {
        stopPreventCancel(e);

        dragging = true;
        initialTop = cfg.scroll.top;
        startY = eventPosition(e).y;
        lastY = startY;

        verticalThumbElement.addClass("active");

        // 이벤트 바인딩
        eventOn(document, "touchmove mousemove", onMove);
        eventOn(document, "touchend mouseup", onEnd);

        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId); // 중복 방지
        }
        animationFrameId = requestAnimationFrame(loop);

        return true;
      },
      null,
      { passive: false }
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
  public getVerticalBgMovePostion(cfg: Config, startEventY: number, oneRowMove: number, upFlag: boolean, bgMoveRow: number) {
    let scrollTop = cfg.scroll.top + (upFlag ? -1 : 1) * bgMoveRow;

    if (upFlag) {
      if (scrollTop < 0) {
        scrollTop = startEventY - cfg.scroll.vThumbHeight;
      } else if (startEventY >= scrollTop) {
        scrollTop = startEventY - oneRowMove * 2;
      }
    } else if (startEventY <= scrollTop + cfg.scroll.vThumbHeight) {
      scrollTop = startEventY - cfg.scroll.vThumbHeight + oneRowMove * 2;
    }

    return scrollTop;
  }

  /**
   * horizontal event 초기화
   *
   * @private
   */
  private initHorizontalEvent() {
    this.initHorizontalTrack();
    this.initHorizontalThumb();
    this.initHorizontalButton();
  }

  /**
   * init horizontal thumb drag event
   *
   * @private
   */
  private initHorizontalThumb() {
    const cfg = this.grid.config();

    let dragging = false;
    let lastX = 0;
    let startX = 0;
    let initialLeft = 0;
    let animationFrameId: number | null = null;

    const horizontalThumbElement = this.horizontalThumbElement;
    const moveHorizontalScroll = this.moveHorizontalScroll.bind(this);

    const cleanup = () => {
      eventOff(document, "touchmove mousemove");
      eventOff(document, "touchend mouseup");
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      lastX = eventPosition(e).x;
    };

    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      dragging = false;

      horizontalThumbElement.removeClass("active");

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

    // 먼저 기존 이벤트 제거
    horizontalThumbElement.eventOff("touchstart mousedown touchend mouseup");

    // 이벤트 등록
    horizontalThumbElement.eventOn(
      "touchstart mousedown",
      (e: MouseEvent | TouchEvent) => {
        stopPreventCancel(e);

        dragging = true;
        startX = eventPosition(e).x;
        lastX = startX;
        initialLeft = cfg.scroll.left;

        horizontalThumbElement.addClass("active");

        eventOn(document, "touchmove mousemove", onMove);
        eventOn(document, "touchend mouseup", onEnd);

        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(loop);

        return true;
      },
      null,
      { passive: false }
    );
  }

  /**
   * init horizontal track event
   *
   * @private
   */
  private initHorizontalTrack() {
    const cfg = this.grid.config();
    const opts = this.opts;

    let bgMoveMode = 0;
    let leftFlag = false;

    let startEventX = 0;
    let oneColMove = 0;
    let bgMoveCol = 0;
    let horizontalScrollTimer: any;

    this.horizontalTrackElement.eventOff("mousedown touchstart mouseup touchend mouseleave");
    this.horizontalTrackElement
      .eventOn(
        "mousedown touchstart",
        (e: MouseEvent) => {
          bgMoveMode = 1;
          startEventX = e.offsetX;

          oneColMove = cfg.scroll.oneColMove;
          bgMoveCol = oneColMove * opts.scroll.horizontal.speed * 2;

          leftFlag = startEventX < cfg.scroll.left;

          horizontalScrollTimer = setInterval(() => {
            bgMoveMode = 2;

            this.moveHorizontalScroll({ position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol) });
          }, 100);
        },
        null,
        { passive: false }
      )
      .eventOn("mouseup touchend mouseleave", (e: Event) => {
        if (bgMoveMode == 1) {
          this.moveHorizontalScroll({ position: this.getHorizontalBgMovePostion(cfg, startEventX, oneColMove, leftFlag, bgMoveCol) });
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
    let vBtnDelay = 100;
    let buttonMoveMode = 0;

    const scrollButtonElements = this.horizontalElement.finds(".dg-scroll-button");

    //세로 방향키
    eventOff(scrollButtonElements, "mousedown touchstart mouseup touchend mouseleave");
    eventOn(
      scrollButtonElements,
      "mousedown touchstart",
      (e: Event) => {
        const mode = hasClass(e.currentTarget as HTMLElement, "left");
        buttonMoveMode = 1;

        scrollBtnTimer = setInterval(() => {
          buttonMoveMode = 2;
          this.moveHorizontalScroll({ direction: mode ? "L" : "R" });
        }, vBtnDelay);
      },
      null,
      { passive: false }
    );
    eventOn(scrollButtonElements, "mouseup touchend mouseleave", (e: Event) => {
      if (buttonMoveMode == 1) {
        const mode = hasClass(e.currentTarget as HTMLElement, "left");
        this.moveHorizontalScroll({ direction: mode ? "L" : "R" });
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
  public getHorizontalBgMovePostion(cfg: Config, startEventX: number, oneColMove: number, leftFlag: boolean, bgMoveCol: number) {
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
    const cfg = this.grid.config();

    if (!cfg.scroll.enableVertical && moveObj.resizeFlag !== true) {
      cfg.scroll.startIdx = 0;
      return;
    }

    let topVal = 0;

    if (utils.isNumber(moveObj.position)) {
      topVal = moveObj.position;
    } else if (utils.isNumber(moveObj.rowIdx)) {
      topVal = moveObj.rowIdx * cfg.scroll.oneRowMove;
    } else if (utils.isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      topVal = cfg.scroll.top + (moveObj.direction == "U" ? -1 : 1) * speed * cfg.scroll.oneRowMove;
    }

    this.moveVerticalScrollPosition(topVal, moveObj.drawFlag);
  }

  /**
   *세로 스크롤 위치 이동.
   */
  public moveVerticalScrollPosition(topVal: number, drawFlag: boolean, updateChkFlag?: boolean) {
    const cfg = this.grid.config();

    if (topVal >= cfg.scroll.vTrackHeight - cfg.scroll.vThumbHeight) {
      topVal = cfg.scroll.vTrackHeight - cfg.scroll.vThumbHeight;
    } else if (topVal <= 0) {
      topVal = 0;
    }

    if (cfg.scroll.top == topVal) {
      return;
    }

    if (updateChkFlag !== false) {
      const onUpdateFn = this.grid.getOptions().scroll.vertical.onUpdate;
      if (drawFlag !== false && utils.isFunction(onUpdateFn)) {
        if (onUpdateFn({ scrollTop: topVal, height: cfg.scroll.vTrackHeight }) === false) {
          return;
        }
      }
    }

    const beforeStartIdx = cfg.scroll.startIdx;

    this.setVerticalPosition(cfg, topVal);

    if (drawFlag === false || cfg.scroll.startIdx == beforeStartIdx) return;

    this.gridMain.getBody().dataDraw("vscroll");
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
    const cfg = this.grid.config();

    if (!cfg.scroll.enableHorizontal) {
      if (cfg.scroll.left > 0) {
        this.moveHorizontalScrollPosition(0, moveObj.drawFlag);
      }

      if (moveObj.resizeFlag !== true) {
        return;
      }
    }

    let leftVal = 0;

    if (utils.isNumber(moveObj.position)) {
      leftVal = moveObj.position;
    } else if (utils.isNumber(moveObj.colIdx)) {
      let colIdx = moveObj.colIdx;

      if (colIdx > 0) {
        colIdx = colIdx < cfg.dataInfo.colLength - 1 ? colIdx : cfg.dataInfo.colLength - 1;
      } else {
        colIdx = 0;
      }

      for (let i = cfg.fixedLeftIndex; i < colIdx; i++) {
        leftVal += cfg.currentFields[i].$width;
      }

      if (moveObj.direction == "R") {
        leftVal = leftVal + cfg.currentFields[colIdx].$width;
      }

      leftVal = getHorizontalScrollPosition(cfg, leftVal, moveObj.direction);
    } else if (utils.isString(moveObj.direction)) {
      const speed = moveObj.speed || 1;
      leftVal = cfg.scroll.left + (moveObj.direction == "L" ? -1 : 1) * speed * cfg.scroll.oneColMove;
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
    const cfg = this.grid.config();

    if (leftVal >= cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth) {
      leftVal = cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth;
    } else if (leftVal <= 0) {
      leftVal = 0;
    }

    if (cfg.scroll.left == leftVal) {
      return;
    }

    cfg.scroll.left = leftVal;

    if (updateChkFlag !== false) {
      const onUpdateFn = this.opts.scroll.horizontal.onUpdate;
      if (drawFlag !== false && utils.isFunction(onUpdateFn)) {
        if (onUpdateFn.call(null, { scrollLeft: leftVal, width: cfg.scroll.hTrackWidth, barPosition: cfg.scroll.hBarPosition }) === false) {
          return;
        }
      }
    }

    this.setHorizontalPosition(cfg);

    if (drawFlag === false) {
      return;
    }

    this.gridMain.getBody().dataDraw("hscroll");
  }

  /**
   * 세로 스크롤 위치 설정
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} topVal 스크롤 바 포지션
   */
  private setVerticalPosition(cfg: Config, topVal: number) {
    if (topVal < 0) return;

    cfg.scroll.top = topVal;

    this.verticalThumbElement.css({ top: topVal + "px" });

    let startIdx = 0;

    if (topVal > 0) {
      startIdx = Math.round(topVal / cfg.scroll.oneRowMove);
    }

    cfg.scroll.startIdx = startIdx;
  }

  /**
   * 가로 스크롤 위치 셋팅
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} contLeftVal scroll position
   */
  private setHorizontalPosition(cfg: Config) {
    let centerLeftPosition = getCenterContentLeft(cfg, cfg.scroll.left);
    cfg.scroll.centerLeftPosition = centerLeftPosition;
    this.calcViewCol(cfg, centerLeftPosition);

    this.horizontalThumbElement.css({ left: cfg.scroll.left + "px" });

    this.gridMain.getHeader().centerElement.css({ left: "-" + centerLeftPosition + "px" });
    this.gridMain.getBody().centerElement.css({ left: "-" + centerLeftPosition + "px" });
  }

  /**
   * view col 위치 구하기.
   *
   * @param {Config} cfg 설정 정보
   */
  private calcViewCol(cfg: Config, centerLeftPosition: number) {
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
        cfg.scroll.insideStartCol = i;
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

    cfg.scroll.before.startCol = cfg.scroll.startCol; // 이전데이터
    cfg.scroll.before.endCol = cfg.scroll.endCol;

    cfg.scroll.insideStartCol = cfg.fixedLeftIndex + cfg.scroll.insideStartCol;
    cfg.scroll.startCol = cfg.fixedLeftIndex + (startCol > 0 ? startCol : 0);
    cfg.scroll.endCol = cfg.fixedLeftIndex + (endCol >= fields.length ? fields.length : endCol);

    // 화면에 다 보이는 col size
    cfg.scroll.insideEndCol = cfg.scroll.endCol + (getHorizontalScrollPosition(cfg, itemLeftVal, "R") != cfg.scroll.left ? -1 : 0);
  }
}

function getFirstDigitMath(num: number) {
  while (num >= 10) {
    num = Math.floor(num / 10);
  }
  return num;
}
