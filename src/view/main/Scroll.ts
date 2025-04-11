import { GridOptions } from "@t/GridOptions";
import { Config, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, calcViewCol } from "src/util/gridUtils";
import { eventOff, eventOn, eventPosition, stopPreventCancel } from "src/util/eventUtils";
import DaraGrid from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import domUtils from "src/util/domUtils";

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

    const rowHeight = opts.body.row.height;

    const arrowButtonSize = 14 * 2;

    if (cfg.scroll.enableVertical) {
      const totalRowHeight = rowHeight * cfg.dataInfo.rowLength;
      const verticalHeight = dimensions.mainHeight - (cfg.scroll.enableHorizontal ? opts.scroll.width : 0);

      cfg.scroll.vHeight = verticalHeight;
      cfg.scroll.vTrackHeight = cfg.scroll.vHeight - arrowButtonSize;

      let barHeight = (cfg.scroll.vTrackHeight * ((dimensions.mainBodyHeight / totalRowHeight) * 100)) / 100;
      if (cfg.scroll.vTrackHeight < SCROLL_THUMB_MIN_SIZE) {
        barHeight = 0;
      } else {
        barHeight = barHeight < SCROLL_THUMB_MIN_SIZE ? SCROLL_THUMB_MIN_SIZE : barHeight > verticalHeight ? verticalHeight : barHeight;
      }

      cfg.scroll.vThumbHeight = barHeight;

      // row 보이기 기준으로 계산
      cfg.scroll.oneRowMove = (cfg.scroll.vTrackHeight - barHeight) / (cfg.dataInfo.rowLength - Math.floor(dimensions.mainBodyHeight / rowHeight));

      this.verticalElement.css({ height: cfg.scroll.vHeight + "px" });
      this.verticalTrackElement.css({ height: cfg.scroll.vTrackHeight + "px" });
      this.verticalThumbElement.css({ height: cfg.scroll.vThumbHeight + "px" });

      if (cfg.dataInfo.rowLength < cfg.scroll.startRow + cfg.scroll.viewRow) {
        this.setVerticalPosition(cfg, (cfg.dataInfo.rowLength - cfg.scroll.viewRow) * cfg.scroll.oneRowMove);
      } else if (cfg.scroll.startRow > 0) {
        this.setVerticalPosition(cfg, cfg.scroll.startRow * cfg.scroll.oneRowMove);
      }
    } else {
      this.setVerticalPosition(cfg, 0);
    }

    if (cfg.scroll.enableHorizontal) {
      const columnTotalWidth = dimensions.mainTotalWidth;

      cfg.scroll.hWidth = dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0);
      cfg.scroll.hTrackWidth = cfg.scroll.hWidth - arrowButtonSize;
      cfg.scroll.oneColMove = columnTotalWidth / cfg.dataInfo.colLength;

      let barWidth = (cfg.scroll.hTrackWidth * ((cfg.scroll.hTrackWidth / columnTotalWidth) * 100)) / 100;

      barWidth = barWidth < SCROLL_THUMB_MIN_SIZE ? SCROLL_THUMB_MIN_SIZE : barWidth;

      cfg.scroll.hThumbWidth = barWidth;

      this.horizontalElement.css({ width: cfg.scroll.hWidth + "px" });
      this.horizontalTrackElement.css({ width: cfg.scroll.hTrackWidth + "px" });
      this.horizontalThumbElement.css({ width: cfg.scroll.hThumbWidth + "px" });

      if (cfg.scroll.left + cfg.scroll.hThumbWidth > cfg.scroll.hTrackWidth) {
        cfg.scroll.left = cfg.scroll.hTrackWidth - cfg.scroll.hThumbWidth;
        this.setHorizontalPosition(cfg);
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

        //delta > 0--up
        if (cfg.scroll.enableVertical) {
          this.moveVerticalScroll({ direction: delta < 0 ? "U" : "D", speed: cfg.scroll.viewRow < 3 ? 1 : opts.scroll.vertical.speed });

          if (opts.scroll.enableStopPropagation === true || (cfg.scroll.top != 0 && cfg.scroll.top != cfg.scroll.vTrackHeight - cfg.scroll.vThumbHeight)) {
            stopPreventCancel(evt);
          }
        } else if (cfg.scroll.enableHorizontal && opts.scroll.horizontal.enableWheel === true) {
          this.moveHorizontalScroll({ direction: delta < 0 ? "L" : "R", speed: opts.scroll.horizontal.speed });

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
    const cfg = this.grid.config();
    const opts = this.opts;

    let bgMoveMode = 0;
    let upFlag = false;
    let oneRowMove = cfg.scroll.oneRowMove;
    let startEventY = 0;
    let bgMoveRow = oneRowMove * opts.scroll.vertical.speed * 5;
    let verticalScrollTimer: any;

    this.verticalTrackElement.eventOff("mousedown touchstart mouseup touchend mouseleave");
    this.verticalTrackElement
      .eventOn(
        "mousedown touchstart",
        (e: MouseEvent) => {
          bgMoveMode = 1;
          startEventY = e.offsetY;

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

    let scrollbarDragTimer: any;
    const tooltipFlag = opts.scroll.vertical.enableTooltip;
    const vDragDelay = 7; //opts.scroll.vertical.dragDelay;

    const tooltipEle = this.verticalElement.findDaraElement(".dg-vscroll-bar-tip");

    const verticalThumbElement = this.verticalThumbElement;
    // 세로 스크롤 바 .
    verticalThumbElement.eventOff("touchstart mousedown");
    verticalThumbElement.eventOn(
      "touchstart mousedown",
      (e: MouseEvent) => {
        stopPreventCancel(e);

        const data = {} as any;
        data.top = cfg.scroll.top;
        data.pageY = eventPosition(e).y;

        verticalThumbElement.addClass("active");

        let startTime: number = -1;

        eventOn(document, "touchmove mousemove", (e1: Event) => {
          if (startTime == -1) {
            startTime = new Date().getTime();
          }

          if (new Date().getTime() - vDragDelay <= startTime) {
            clearTimeout(scrollbarDragTimer);
          }

          scrollbarDragTimer = setTimeout(() => {
            startTime = -1;

            this.moveVerticalScroll({ position: data.top + (eventPosition(e1).y - data.pageY) });

            if (tooltipFlag) {
              tooltipEle.text(cfg.scroll.viewRow + 1);
              tooltipEle.show();
            }
          }, vDragDelay);
        });

        eventOn(document, "touchend mouseup", (e1: Event) => {
          verticalThumbElement.removeClass("active");
          clearTimeout(scrollbarDragTimer);

          this.moveVerticalScroll({ position: data.top + (eventPosition(e1).y - data.pageY) });
          eventOff(document, "touchmove mousemove touchend mouseup");

          startTime = -1;

          if (tooltipFlag) {
            tooltipEle.hide();
          }
        });

        return true;
      },
      null,
      { passive: false }
    );

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
        const mode = domUtils.hasClass(e.currentTarget as HTMLElement, "up");
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
        const mode = domUtils.hasClass(e.currentTarget as HTMLElement, "up");
        this.moveVerticalScroll({ direction: mode ? "U" : "D" });
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
   * @param bgMoveRow
   * @returns
   */
  public getVerticalBgMovePostion(cfg: Config, startEventY: number, oneRowMove: number, upFlag: boolean, bgMoveRow: number) {
    let pTop = cfg.scroll.top + (upFlag ? -1 : 1) * bgMoveRow;

    if (upFlag) {
      if (startEventY >= pTop) {
        pTop = startEventY - oneRowMove * 2;
      }
    } else if (startEventY <= pTop + cfg.scroll.vThumbHeight) {
      pTop = startEventY - cfg.scroll.vThumbHeight + oneRowMove * 2;
    }
    return pTop;
  }

  /**
   * horizontal event 초기화
   *
   * @private
   */
  private initHorizontalEvent() {
    const cfg = this.grid.config();
    const opts = this.opts;

    let bgMoveMode = 0;
    let leftFlag = false;
    let oneColMove = cfg.scroll.oneColMove;
    let startEventX = 0;
    let bgMoveCol = oneColMove * opts.scroll.horizontal.speed * 2;
    let horizontalScrollTimer: any;

    this.horizontalTrackElement.eventOff("mousedown touchstart mouseup touchend mouseleave");
    this.horizontalTrackElement
      .eventOn(
        "mousedown touchstart",
        (e: MouseEvent) => {
          bgMoveMode = 1;
          startEventX = e.offsetX;

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

    let scrollbarDragTimer: any;
    const hDragDelay = 7; //opts.scroll.horizontal.dragDelay;

    const horizontalThumbElement = this.horizontalThumbElement;

    horizontalThumbElement.eventOff("touchstart mousedown");
    horizontalThumbElement.eventOn(
      "touchstart mousedown",
      (e: MouseEvent) => {
        stopPreventCancel(e);

        const data = {} as any;

        data.left = cfg.scroll.left;
        data.pageX = eventPosition(e).x;

        horizontalThumbElement.addClass("active");
        let startTime: number = -1;

        eventOn(document, "touchmove mousemove", (e1: Event) => {
          if (startTime == -1) {
            startTime = new Date().getTime();
          }

          if (new Date().getTime() - hDragDelay <= startTime) {
            clearTimeout(scrollbarDragTimer);
          }

          scrollbarDragTimer = setTimeout(() => {
            startTime = -1;

            this.moveHorizontalScroll({ position: data.left + (eventPosition(e1).x - data.pageX) });
          }, hDragDelay);
        });

        eventOn(document, "touchend mouseup", (e1: Event) => {
          horizontalThumbElement.removeClass("active");
          clearTimeout(scrollbarDragTimer);

          this.moveHorizontalScroll({ position: data.left + (eventPosition(e1).x - data.pageX) });
          eventOff(document, "touchmove mousemove touchend mouseup");

          startTime = -1;
        });

        return true;
      },
      null,
      { passive: false }
    );

    let scrollBtnTimer: any;
    let vBtnDelay = 100;
    const scrollButtonElements = this.horizontalElement.finds(".dg-scroll-button");
    let buttonMoveMode = 0;
    //세로 방향키
    eventOff(scrollButtonElements, "mousedown touchstart mouseup touchend mouseleave");
    eventOn(
      scrollButtonElements,
      "mousedown touchstart",
      (e: Event) => {
        const mode = domUtils.hasClass(e.currentTarget as HTMLElement, "left");
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
        const mode = domUtils.hasClass(e.currentTarget as HTMLElement, "left");
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
      cfg.scroll.startRow = 0;
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

    const beforeStartRow = cfg.scroll.startRow;

    this.setVerticalPosition(cfg, topVal);

    if (drawFlag === false || cfg.scroll.startRow == beforeStartRow) return;

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
    } else if (utils.isNumber(moveObj.rowIdx)) {
      leftVal = moveObj.rowIdx * cfg.scroll.oneRowMove;
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

    if (drawFlag !== false) {
      this.gridMain.getBody().dataDraw("hscroll");
    }
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

    let startRow = 0;

    if (topVal > 0) {
      startRow = Math.round(topVal / cfg.scroll.oneRowMove);
    }

    cfg.scroll.startRow = startRow;
  }

  /**
   * 가로 스크롤 위치 셋팅
   *
   * @private
   * @param {Config} cfg 설정값
   * @param {number} contLeftVal scroll position
   */
  private setHorizontalPosition(cfg: Config) {
    const leftVal = cfg.scroll.left;

    const contLeftVal = calcViewCol(cfg, leftVal);

    this.horizontalThumbElement.css({ left: cfg.scroll.left + "px" });

    this.gridMain.getHeader().centerElement.css({ left: "-" + contLeftVal + "px" });
    this.gridMain.getBody().centerElement.css({ left: "-" + contLeftVal + "px" });
  }
}
