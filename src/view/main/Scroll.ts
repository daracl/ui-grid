import { GridOptions } from "@t/GridOptions";
import { Config, ScrollInfo, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, calcViewCol } from "src/util/gridUtils";
import { eventPosition, stopPreventCancel } from "src/util/eventUtils";
import DaraGrid from "src/DaraGrid";
import GridMain from "../GridMain";
import DaraElement from "src/element/DaraElement";
import eventUtils from "src/element/eventUtils";
import domUtils from "src/element/domUtils";

export default class Scroll {
  private grid: DaraGrid;
  private gridMain: GridMain;

  private opts: GridOptions;

  private horizontalElement: DaraElement;
  private horizontalThumbElement: DaraElement;

  private verticalElement: DaraElement;
  private verticalThumbElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain) {
    this.grid = grid;
    this.gridMain = gridMain;

    this.opts = this.grid.getOptions();

    this.horizontalElement = this.gridMain.mainElement().findDaraElement(".dg-scroll.horizontal");
    this.horizontalThumbElement = this.horizontalElement.findDaraElement(".dg-scroll-thumb");

    this.verticalElement = this.gridMain.mainElement().findDaraElement(".dg-scroll.vertical");
    this.verticalThumbElement = this.verticalElement.findDaraElement(".dg-scroll-thumb");

    this.calcScroll();

    this.setElementsDimentions();
    this.initEvent();
  }

  public setElementsDimentions() {}

  public calcScroll() {
    const cfg = this.grid.config();
    const dimensions = cfg.dimensions;
    const opts = this.grid.getOptions();

    const rowHeight = opts.body.row.height;

    if (cfg.scroll.enableVertical) {
      const totalRowHeight = rowHeight * cfg.dataInfo.rowLength;
      const scrollHeight = dimensions.mainHeight;

      let barHeight = (scrollHeight * ((dimensions.mainBodyHeight / totalRowHeight) * 100)) / 100;
      if (scrollHeight < 25) {
        barHeight = 1;
      } else {
        barHeight = barHeight < 25 ? 25 : barHeight > scrollHeight ? scrollHeight : barHeight;
      }

      cfg.scroll.vHeight = scrollHeight - (cfg.scroll.enableHorizontal ? opts.scroll.width : 0);
      cfg.scroll.vThumbHeight = barHeight;
      cfg.scroll.vTrackHeight = cfg.scroll.vHeight - 20;
      // row 보이기 기준으로 계산
      cfg.scroll.oneRowMove = (cfg.scroll.vHeight - (barHeight + 20)) / (cfg.dataInfo.rowLength - Math.floor((dimensions.mainBodyHeight - (cfg.scroll.enableHorizontal ? opts.scroll.width : 0)) / rowHeight));

      this.verticalElement.css({ height: cfg.scroll.vHeight + "px" });
      this.verticalElement.find(".dg-scroll-track").style.height = cfg.scroll.vTrackHeight + "px";
      this.verticalThumbElement.css({ height: cfg.scroll.vThumbHeight + "px" });
    }

    if (cfg.scroll.enableHorizontal) {
      const columnTotalWidth = dimensions.mainTotalWidth;
      const horizontalWidth = dimensions.width - (10 * 2 + (cfg.scroll.enableVertical ? opts.scroll.width : 0));

      let barWidth = (horizontalWidth * ((dimensions.width / columnTotalWidth) * 100)) / 100;

      barWidth = barWidth < 25 ? 25 : barWidth > horizontalWidth ? horizontalWidth : barWidth;

      cfg.scroll.hThumbWidth = barWidth;
      cfg.scroll.hTrackWidth = horizontalWidth - barWidth;
      cfg.scroll.oneColMove = columnTotalWidth / cfg.dataInfo.colLength;

      this.horizontalElement.css({ width: dimensions.width - (cfg.scroll.enableVertical ? opts.scroll.width : 0) + "px" });
      this.horizontalThumbElement.css({ width: cfg.scroll.hThumbWidth + "px" });
    }
  }

  /**
   * @method scroll
   * @description 스크롤 컨트롤.
   */
  public initEvent() {
    this.initMouseWheel();

    this.initVertical();

    // this.initHorizontal();

    //this.config;
  }

  private initMouseWheel() {
    const cfg = this.grid.config();
    const opts = this.opts;

    this.gridMain.mainElement().eventOff("wheel DOMMouseScroll");
    this.gridMain.mainElement().eventOn("wheel DOMMouseScroll", (evt: WheelEvent) => {
      let delta = evt.deltaY;

      //delta > 0--up
      if (cfg.scroll.enableVertical) {
        this.moveVerticalScroll({ direction: delta < 0 ? "U" : "D", speed: opts.scroll.vertical.speed });

        if (opts.scroll.enableStopPropagation === true || (cfg.scroll.top != 0 && cfg.scroll.top != cfg.scroll.vTrackHeight)) {
          stopPreventCancel(evt);
        }
      } else if (cfg.scroll.enableHorizontal && opts.scroll.horizontal.enableWheel === true) {
        this.moveHorizontalScroll({ direction: delta < 0 ? "L" : "R", speed: opts.scroll.horizontal.speed });

        if (opts.scroll.enableStopPropagation === true && cfg.scroll.left != 0 && cfg.scroll.left != cfg.scroll.hTrackWidth) {
          stopPreventCancel(evt);
        }
      }
    });
  }

  private initVertical() {
    const cfg = this.grid.config();
    const opts = this.opts;

    const loopcount = 5;
    let bgMoveMode = 0;
    let upFlag = false;
    let oneRowMove = cfg.scroll.oneRowMove;
    let startEventY = 0;
    let bgMoveRow = oneRowMove * opts.scroll.vertical.speed * 5;
    let verticalScrollTimer: any;
    const trackElement = this.verticalElement.findDaraElement(".dg-scroll-track");
    trackElement.eventOff("mousedown touchstart mouseup touchend mouseleave");
    trackElement
      .eventOn("mousedown touchstart", (e: MouseEvent) => {
        cfg.scroll.mouseDown = true;

        bgMoveMode = 1;
        startEventY = e.offsetY;

        upFlag = startEventY < cfg.scroll.top;

        verticalScrollTimer = setInterval(() => {
          bgMoveMode = 2;

          this.moveVerticalScroll({ position: this.getVerticalBgMovePostion(cfg, startEventY, oneRowMove, upFlag, bgMoveRow) });
        }, 100);
      })
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
    verticalThumbElement.eventOn("touchstart mousedown", (e: MouseEvent) => {
      stopPreventCancel(e);

      const data = {} as any;
      data.top = cfg.scroll.top;
      data.pageY = eventPosition(e).y;

      verticalThumbElement.addClass("active");

      let startTime: number = -1;

      eventUtils.eventOn(document, "touchmove mousemove", (e1: Event) => {
        if (startTime == -1) {
          startTime = new Date().getTime();
        }

        if (new Date().getTime() - vDragDelay <= startTime) {
          clearTimeout(scrollbarDragTimer);
        }

        scrollbarDragTimer = setTimeout(() => {
          startTime = -1;
          this.verticalScroll(data, e1, "move");

          if (tooltipFlag) {
            tooltipEle.text(cfg.scroll.viewRow + 1);
            tooltipEle.show();
          }
        }, vDragDelay);
      });

      eventUtils.eventOn(document, "touchend mouseup", (e1: Event) => {
        verticalThumbElement.removeClass("active");
        clearTimeout(scrollbarDragTimer);
        this.verticalScroll(data, e1, "end");
        startTime = -1;

        if (tooltipFlag) {
          tooltipEle.hide();
        }
      });

      return true;
    });

    let scrollBtnTimer: any;
    let vBtnDelay = 100;
    const scrollButtonElements = this.verticalElement.finds(".dg-scroll-button");
    let buttonMoveMode = 0;
    //세로 방향키
    eventUtils.eventOff(scrollButtonElements, "mousedown touchstart mouseup touchend mouseleave");
    eventUtils.eventOn(scrollButtonElements, "mousedown touchstart", (e: Event) => {
      const sEle = e.currentTarget as HTMLElement;

      const mode = domUtils.hasClass(sEle, "up");
      buttonMoveMode = 1;

      scrollBtnTimer = setInterval(() => {
        buttonMoveMode = 2;
        this.moveVerticalScroll({ direction: mode ? "U" : "D" });
      }, vBtnDelay);
    });
    eventUtils.eventOn(scrollButtonElements, "mouseup touchend mouseleave", (e: Event) => {
      if (buttonMoveMode == 1) {
        const sEle = e.currentTarget as HTMLElement;
        const mode = domUtils.hasClass(sEle, "up");
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
        cfg.scroll.mouseDown = false;
        pTop = startEventY - oneRowMove * 2;
      }
    } else if (startEventY <= pTop + cfg.scroll.vThumbHeight) {
      cfg.scroll.mouseDown = false;
      pTop = startEventY - cfg.scroll.vThumbHeight + oneRowMove * 2;
    }
    return pTop;
  }

  /**
   * 세로 스크롤 드래그 이동
   *
   * @param {*} data
   * @param {*} e
   * @param {*} type
   */
  public verticalScroll(data: any, e: Event, type: string) {
    const oy = data.top + (eventPosition(e).y - data.pageY);

    this.moveVerticalScroll({ position: oy });
    if (type == "end") {
      eventUtils.eventOff(document, "touchmove mousemove touchend mouseup");
    }
  }

  // private initHorizontal() {
  //   $("#" + this.prefix + "_hscroll .pubGrid-hscroll-bar-bg").off("mousedown touchstart mouseup touchend mouseleave");
  //   $("#" + this.prefix + "_hscroll .pubGrid-hscroll-bar-bg")
  //     .on("mousedown touchstart", (e: Event) => {
  //       this.horizontalMove(e.offsetX, this.config.scroll.left, this.config.scroll.hThumbWidth, this.config.scroll.oneColMove);
  //     })
  //     .on("mouseup touchend mouseleave", (e: Event) => {
  //       this.config.scroll.mouseDown = false;
  //       clearTimeout(this.config.scroll.horizontalScrollTimer);
  //     });

  //   let scrollbarDragTimer: any;
  //   let startTime: number = -1;
  //   const hDragDelay = this.options.scroll.horizontal.dragDelay;
  //   // 가로 스크롤 bar drag
  //   this.grid.elementMap.hScrollBar.off("touchstart.pubhscroll mousedown.pubhscroll");
  //   this.grid.elementMap.hScrollBar.on("touchstart.pubhscroll mousedown.pubhscroll", (e: Event) => {
  //     e.stopPropagation();

  //     const ele = $(this);
  //     const data = {} as any;

  //     data.left = this.config.scroll.left;
  //     data.pageX = eventPosition(e).x;

  //     ele.addClass("active");

  //     $(document)
  //       .on("touchmove.pubhscroll mousemove.pubhscroll", (e1: Event) => {
  //         if (startTime == -1) {
  //           startTime = new Date().getTime();
  //         }

  //         if (new Date().getTime() - hDragDelay <= startTime) {
  //           clearTimeout(scrollbarDragTimer);
  //         }

  //         scrollbarDragTimer = setTimeout(() => {
  //           startTime = -1;
  //           this.horizontalScroll(data, e1, "move");
  //         }, hDragDelay);
  //       })
  //       .on("touchend.pubhscroll mouseup.pubhscroll mouseleave.pubhscroll", (e1: Event) => {
  //         ele.removeClass("active");
  //         clearTimeout(scrollbarDragTimer);
  //         startTime = -1;
  //         this.horizontalScroll(data, e1, "end");
  //       });

  //     return true;
  //   });

  //   // 가로 스크롤 방향키
  //   let scrollBtnTimer: any,
  //     vBtnDelay = this.options.scroll.vertical.btnDelay,
  //     hBtnDelay = this.options.scroll.horizontal.btnDelay;

  //   $("#" + this.prefix + "_hscroll .pubGrid-hscroll-btn").off("mousedown touchstart mouseup touchend mouseleave");
  //   $("#" + this.prefix + "_hscroll .pubGrid-hscroll-btn")
  //     .on("mousedown touchstart", (e: Event) => {
  //       const sEle = $(this),
  //         mode = sEle.attr("data-pubgrid-btn");

  //       scrollBtnTimer = setInterval(() => {
  //         this.moveHorizontalScroll({ direction: mode });
  //       }, hBtnDelay);
  //     })
  //     .on("mouseup touchend mouseleave", function (e) {
  //       clearInterval(scrollBtnTimer);
  //     });
  // }

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

    cfg.scroll.top = topVal;

    this.verticalThumbElement.css({ top: topVal + "px" });

    let startRow = 0;

    if (topVal > 0) {
      startRow = topVal / cfg.scroll.oneRowMove;
      startRow = Math.round(startRow);
    }

    if (drawFlag === false) {
      cfg.scroll.startRow = startRow;
      return;
    }

    if (cfg.scroll.startRow == startRow) return;

    cfg.scroll.startRow = startRow;

    this.gridMain.getBody().dataDraw("vscroll");
  }

  // /**
  //  * 가로 스크롤 드래그 이동
  //  */
  // public horizontalScroll(data: any, e: Event, type: string) {
  //   const ox = data.left + (eventPosition(e).x - data.pageX);

  //   this.moveHorizontalScroll({ direction: ox });

  //   if (type == "end") {
  //     $(document).off("touchmove.pubhscroll mousemove.pubhscroll").off("touchend.pubhscroll mouseup.pubhscroll mouseleave.pubhscroll");
  //   }
  // }

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

    const posVal = moveObj.direction;

    let leftVal = posVal;

    if (isNaN(posVal)) {
      if (utils.isUndefined(moveObj.colIdx)) {
        leftVal = cfg.scroll.left + (posVal == "L" ? -1 : 1) * cfg.scroll.oneColMove;
      } else {
        const constLeft = cfg.scroll.left;

        if (posVal == "L") {
          leftVal = constLeft;
        } else {
          leftVal = constLeft + cfg.dimensions.mainTotalWidth;
          leftVal = leftVal - cfg.dimensions.mainInsideWidth;
        }

        leftVal = (leftVal / cfg.dimensions.mainInsideWidth) * 100;
        leftVal = (leftVal * cfg.scroll.hTrackWidth) / 100;
      }
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

    const hw = cfg.scroll.hTrackWidth;
    leftVal = leftVal >= hw ? hw : leftVal;
    leftVal = leftVal > -1 ? leftVal : 0;

    if (cfg.scroll.left == leftVal) {
      return;
    }

    const contLeftVal = calcViewCol(cfg, leftVal);

    cfg.scroll.left = leftVal;
    cfg.scroll.hBarPosition = (leftVal / hw) * 100;

    if (updateChkFlag !== false) {
      const onUpdateFn = this.opts.scroll.horizontal.onUpdate;
      if (drawFlag !== false && utils.isFunction(onUpdateFn)) {
        if (onUpdateFn.call(null, { scrollLeft: leftVal, width: cfg.scroll.hTrackWidth, barPosition: cfg.scroll.hBarPosition }) === false) {
          return;
        }
      }
    }

    this.horizontalThumbElement.css({ left: cfg.scroll.left + "px" });

    this.gridMain
      .mainElement()
      .findDaraElement(".dg-header > .dg-center")
      .css({ left: "-" + contLeftVal + "px" });

    this.gridMain
      .mainElement()
      .findDaraElement(".dg-body > .dg-center")
      .css({ left: "-" + contLeftVal + "px" });

    if (drawFlag !== false) {
      this.gridMain.getBody().dataDraw("hscroll");
    }
  }

  // public horizontalMove(pEvtX: number, pLeft: number, hThumbWidth: number, oneColMove: number) {
  //   this.config.scroll.mouseDown = true;

  //   clearTimeout(this.config.scroll.horizontalScrollTimer);

  //   const leftFlag = pEvtX < this.config.scroll.left;
  //   const loopcount = 10;

  //   pLeft = pLeft + (leftFlag ? -1 : 1) * (oneColMove * loopcount);

  //   if (leftFlag) {
  //     if (pEvtX >= pLeft) {
  //       this.config.scroll.mouseDown = false;
  //       pLeft = pEvtX;
  //     }
  //   } else if (pEvtX <= pLeft + hThumbWidth) {
  //     this.config.scroll.mouseDown = false;
  //     pLeft = pEvtX - hThumbWidth;
  //   }

  //   this.moveHorizontalScroll({ direction: pLeft });

  //   if (this.config.scroll.mouseDown) {
  //     this.config.scroll.horizontalScrollTimer = setTimeout(() => {
  //       this.horizontalMove(pEvtX, pLeft, hThumbWidth, oneColMove);
  //     }, 100);
  //   }
  // }

  // /**
  //  * @method _getBodyContainerLeft
  //  * @param leftVal {Integer} body left position
  //  * @param drawFlag {Boolean} draw flag
  //  * @param updateChkFlag {Boolean} 업데이트 여부.
  //  * @description 가로 스크롤바 위치 이동
  //  */
  // public _getBodyContainerLeft(leftVal: number) {
  //   return leftVal < 1 ? 0 : (this.config.gridWidth.mainOverWidth * ((leftVal / this.config.scroll.hTrackWidth) * 100)) / 100;
  // }
}
