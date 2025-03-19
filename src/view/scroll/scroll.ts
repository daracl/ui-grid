import { GridOptions } from "@t/GridOptions";
import { Config, Scroll, Selection, SelectionRange } from "@t/GridConfig";
import * as utils from "src/util/utils";
import { initSelectionInfo } from "../../defaultGridConfig";
import { FieldItem } from "@t/GridField";
import { isFixedLeftPostion, removeActiveColumnStyle, isMultipleSelection, calcViewCol } from "src/util/gridUtils";
import { eventPosition, stopPreventCancel } from "src/util/eventUtils";
import DaraGrid from "src/DaraGrid";

export default class ScrollInfo {
  private grid: DaraGrid;
  private options: GridOptions;
  private config: Config;

  constructor(grid: DaraGrid, config: Config) {
    this.grid = grid;
    this.config = config;
    this.initEvent();
  }

  /**
   * @method scroll
   * @description 스크롤 컨트롤.
   */
  public initEvent() {
    // this.initMouseWheel();

    // this.initHorizontal();

    // this.initVertical();

    this.config;
  }

  // private initMouseWheel() {
  //   this.grid.elementMap.container.off("mousewheel DOMMouseScroll");
  //   this.grid.elementMap.container.on("mousewheel DOMMouseScroll", (e: Event) => {
  //     const oe = e.originalEvent;
  //     let delta = 0;

  //     if (oe.detail) {
  //       delta = oe.detail * -40;
  //     } else {
  //       delta = oe.wheelDelta;
  //     }

  //     //delta > 0--up
  //     if (this.config.scroll.enableVertical) {
  //       this.moveVerticalScroll({ pos: delta > 0 ? "U" : "D", speed: this.options.scroll.vertical.speed });

  //       if (this.options.scroll.enableStopPropagation === true || (this.config.scroll.top != 0 && this.config.scroll.top != this.config.scroll.vTrackHeight)) {
  //         stopPreventCancel(e);
  //       }
  //     } else {
  //       if (this.config.scroll.enableHorizontal && this.options.scroll.horizontal.enableWheel === true) {
  //         this.moveHorizontalScroll({ pos: delta > 0 ? "L" : "R", speed: this.options.scroll.horizontal.speed });

  //         if (this.options.scroll.enableStopPropagation === true || (this.config.scroll.left != 0 && this.config.scroll.left != this.config.scroll.hTrackWidth)) {
  //           stopPreventCancel(e);
  //         }
  //       }
  //     }
  //   });
  // }

  // private initVertical() {
  //   $("#" + this.prefix + "_vscroll .pubGrid-vscroll-bar-bg").off("mousedown touchstart mouseup touchend mouseleave");
  //   $("#" + this.prefix + "_vscroll .pubGrid-vscroll-bar-bg")
  //     .on("mousedown touchstart", (e: Event) => {
  //       this.verticalMove(e.offsetY, this.config.scroll.top, this.config.scroll.vThumbHeight, this.config.scroll.oneRowMove * this.options.scroll.horizontal.speed);
  //     })
  //     .on("mouseup touchend mouseleave", (e: Event) => {
  //       this.config.scroll.mouseDown = false;
  //       clearTimeout(this.config.scroll.verticalScrollTimer);
  //     });

  //   let scrollbarDragTimer: any;
  //   const tooltipFlag = this.options.scroll.vertical.tooltip;
  //   const vDragDelay = this.options.scroll.vertical.dragDelay;
  //   const tooltipEle = this.grid.elementMap.vScrollBar.find(".pubGrid-vscroll-bar-tip");
  //   // 세로 스크롤 바 .
  //   this.grid.elementMap.vScrollBar.off("touchstart.pubvscroll mousedown.pubvscroll");
  //   this.grid.elementMap.vScrollBar.on("touchstart.pubvscroll mousedown.pubvscroll", (e: Event) => {
  //     e.stopPropagation();

  //     const ele = $(this);
  //     const data = {} as any;
  //     data.top = this.config.scroll.top;
  //     data.pageY = eventPosition(e).y;

  //     ele.addClass("active");

  //     let startTime: number = -1;

  //     $(document)
  //       .on("touchmove.pubvscroll mousemove.pubvscroll", (e1: Event) => {
  //         if (startTime == -1) {
  //           startTime = new Date().getTime();
  //         }

  //         if (new Date().getTime() - vDragDelay <= startTime) {
  //           clearTimeout(scrollbarDragTimer);
  //         }

  //         scrollbarDragTimer = setTimeout(() => {
  //           startTime = -1;
  //           this.verticalScroll(data, e1, "move");

  //           if (tooltipFlag) {
  //             tooltipEle.text(this.config.scroll.viewRow + 1);
  //             tooltipEle.show();
  //           }
  //         }, vDragDelay);
  //       })
  //       .on("touchend.pubvscroll mouseup.pubvscroll mouseleave.pubvscroll", (e1: Event) => {
  //         ele.removeClass("active");
  //         clearTimeout(scrollbarDragTimer);
  //         this.verticalScroll(data, e1, "end");
  //         startTime = -1;

  //         if (tooltipFlag) {
  //           tooltipEle.hide();
  //         }
  //       });

  //     return true;
  //   });

  //   let scrollBtnTimer: any;

  //   //세로 스크롤 방향키
  //   $("#" + this.prefix + "_vscroll .pubGrid-vscroll-btn").off("mousedown touchstart mouseup touchend mouseleave");
  //   $("#" + this.prefix + "_vscroll .pubGrid-vscroll-btn")
  //     .on("mousedown touchstart", (e: Event) => {
  //       const sEle = $(this),
  //         mode = sEle.attr("data-pubgrid-btn");

  //       scrollBtnTimer = setInterval(() => {
  //         this.moveVerticalScroll({ pos: mode });
  //       }, vBtnDelay);
  //     })
  //     .on("mouseup touchend mouseleave", function (e) {
  //       clearInterval(scrollBtnTimer);
  //     });
  // }

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
  //         this.moveHorizontalScroll({ pos: mode });
  //       }, hBtnDelay);
  //     })
  //     .on("mouseup touchend mouseleave", function (e) {
  //       clearInterval(scrollBtnTimer);
  //     });
  // }

  // /**
  //  * 세로 스크롤 드래그 이동
  //  *
  //  * @param {*} data
  //  * @param {*} e
  //  * @param {*} type
  //  */
  // public verticalScroll(data: any, e: Event, type: string) {
  //   const oy = data.top + (eventPosition(e).y - data.pageY);

  //   this.moveVerticalScroll({ pos: oy });
  //   if (type == "end") {
  //     $(document).off("touchmove.pubvscroll mousemove.pubvscroll").off("touchend.pubvscroll mouseup.pubvscroll mouseleave.pubvscroll");
  //   }
  // }
  // /**
  //  * 세로 스크롤 이동.
  //  *
  //  * @method moveVerticalScroll
  //  * @param  moveObj.pos {String ,Integer} 'U' or 'D' or top position
  //  * @param  moveObj.resizeFlag {boolean} resize flag
  //  * @param  moveObj.drawFlag {boolean} redraw flag
  //  * @param  moveObj.speed {Integer} row move count
  //  * @param  moveObj.rowIdx {Integer} move row idx
  //  */
  // public moveVerticalScroll(moveObj: any) {
  //   const _this = this,
  //     opt = this.options;

  //   if (!this.config.scroll.enableVertical && moveObj.resizeFlag !== true) {
  //     this.config.scroll.viewRow = 0;
  //     return;
  //   }

  //   const posVal = moveObj.pos,
  //     speed = moveObj.speed || 1,
  //     drawFlag = moveObj.drawFlag,
  //     rowIdx = moveObj.rowIdx;

  //   let topVal = posVal;

  //   if (!isNaN(rowIdx)) {
  //     topVal = rowIdx * this.config.scroll.oneRowMove;
  //   } else {
  //     if (isNaN(posVal)) {
  //       topVal = this.config.scroll.top + (topVal == "U" ? -1 : 1) * speed * this.config.scroll.oneRowMove;
  //     }
  //   }

  //   this.moveVScrollPosition(topVal, moveObj.drawFlag);
  // }

  // /**
  //  *세로 스크롤 위치 이동.
  //  */
  // public moveVScrollPosition(topVal: number, drawFlag: boolean, updateChkFlag?: boolean) {
  //   let barPos = 0;

  //   if (topVal > 0) {
  //     if (topVal >= this.config.scroll.vTrackHeight) {
  //       topVal = this.config.scroll.vTrackHeight;
  //     }
  //     barPos = (topVal / this.config.scroll.vTrackHeight) * 100;
  //   } else {
  //     topVal = 0;
  //     barPos = 0;
  //   }

  //   if (this.config.scroll.top == topVal) {
  //     return;
  //   }

  //   if (updateChkFlag !== false) {
  //     const onUpdateFn = this.options.scroll.vertical.onUpdate;
  //     if (drawFlag !== false && utils.isFunction(onUpdateFn)) {
  //       if (onUpdateFn({ scrollTop: topVal, height: this.config.scroll.vTrackHeight, barPosition: barPos }) === false) {
  //         return;
  //       }
  //     }
  //   }

  //   this.config.scroll.top = topVal;
  //   this.grid.elementMap.vScrollBar.css("top", topVal);

  //   let itemIdx = 0;

  //   if (topVal > 0) {
  //     itemIdx = topVal / (this.config.scroll.vTrackHeight / (this.config.dataInfo.rowLength - this.config.scroll.viewCount));
  //     itemIdx = Math.round(itemIdx);
  //   }

  //   this.config.scroll.vBarPosition = barPos;

  //   if (drawFlag === false) {
  //     this.config.scroll.viewRow = itemIdx;
  //     return;
  //   }

  //   if (this.config.scroll.viewRow == itemIdx) return;

  //   this.config.scroll.viewRow = itemIdx;

  //   this.drawGrid("vscroll");
  // }

  // /**
  //  * 가로 스크롤 드래그 이동
  //  */
  // public horizontalScroll(data: any, e: Event, type: string) {
  //   const ox = data.left + (eventPosition(e).x - data.pageX);

  //   this.moveHorizontalScroll({ pos: ox });

  //   if (type == "end") {
  //     $(document).off("touchmove.pubhscroll mousemove.pubhscroll").off("touchend.pubhscroll mouseup.pubhscroll mouseleave.pubhscroll");
  //   }
  // }

  // /**
  //  * @method moveHorizontalScroll
  //  * @param  moveObj.pos {String ,Integer} 'L' or 'R' or left position
  //  * @param  moveObj.resizeFlag {boolean} resize flag
  //  * @param  moveObj.drawFlag {boolean} redraw flag
  //  * @param  moveObj.speed {Integer} row move count
  //  * @description 가로 스크롤 이동.
  //  */
  // public moveHorizontalScroll(moveObj: any) {
  //   const _this = this;

  //   if (!this.config.scroll.enableHorizontal) {
  //     if (this.config.scroll.left > 0) {
  //       this.moveHScrollPosition(0, moveObj.drawFlag);
  //     }

  //     if (moveObj.resizeFlag !== true) {
  //       return;
  //     }
  //   }

  //   const posVal = moveObj.pos;

  //   let leftVal = posVal;

  //   if (isNaN(posVal)) {
  //     if (utils.isUndefined(moveObj.colIdx)) {
  //       leftVal = this.config.scroll.left + (posVal == "L" ? -1 : 1) * this.config.scroll.oneColMove;
  //     } else {
  //       const firstRowEle = this.grid.elementMap.body.find('[data-cell-position="0,' + moveObj.colIdx + '"]');
  //       const headerPos = firstRowEle.position();

  //       if (posVal == "L") {
  //         leftVal = headerPos.left;
  //       } else {
  //         leftVal = headerPos.left + firstRowEle.outerWidth();
  //         leftVal = leftVal - this.config.gridWidth.mainInsideWidth;
  //       }

  //       leftVal = (leftVal / this.config.gridWidth.mainOverWidth) * 100;
  //       leftVal = (leftVal * this.config.scroll.hTrackWidth) / 100;
  //     }
  //   }

  //   this.moveHScrollPosition(leftVal, moveObj.drawFlag);
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

  // /**
  //  * @method moveHScrollPosition
  //  * @param leftVal {Integer} body left position
  //  * @param drawFlag {Boolean} draw flag
  //  * @param updateChkFlag {Boolean} 업데이트 여부.
  //  * @description 가로 스크롤바 위치 이동
  //  */
  // public moveHScrollPosition(leftVal: number, drawFlag: boolean, updateChkFlag?: boolean) {
  //   const hw = this.config.scroll.hTrackWidth;
  //   leftVal = leftVal >= hw ? hw : leftVal;
  //   leftVal = leftVal > -1 ? leftVal : 0;

  //   if (this.config.scroll.left == leftVal) {
  //     return;
  //   }

  //   const contLeftVal = calcViewCol(this.config, leftVal);

  //   this.config.scroll.left = leftVal;
  //   this.config.scroll.hBarPosition = (leftVal / hw) * 100;

  //   if (updateChkFlag !== false) {
  //     const onUpdateFn = this.options.scroll.horizontal.onUpdate;
  //     if (drawFlag !== false && utils.isFunction(onUpdateFn)) {
  //       if (onUpdateFn.call(null, { scrollLeft: leftVal, width: this.config.scroll.hTrackWidth, barPosition: this.config.scroll.hBarPosition }) === false) {
  //         return;
  //       }
  //     }
  //   }

  //   this.grid.elementMap.hScrollBar.css("left", this.config.scroll.left + "px");
  //   this.grid.elementMap.header.find(".pubGrid-header-cont-wrapper").css("left", "-" + contLeftVal + "px");
  //   this.grid.elementMap.body.find(".pubGrid-body-cont-wrapper").css("left", "-" + contLeftVal + "px");

  //   if (drawFlag !== false) {
  //     this.grid.drawGrid("hscroll");
  //   }
  // }

  // public verticalMove(pEvtY: number, pTop: number, vThumbHeight: number, oneRowMove: number) {
  //   this.config.scroll.mouseDown = true;

  //   clearTimeout(this.config.scroll.verticalScrollTimer);

  //   const upFlag = pEvtY < this.config.scroll.top;
  //   const loopcount = 5;

  //   pTop = pTop + (upFlag ? -1 : 1) * (oneRowMove * loopcount);

  //   if (upFlag) {
  //     if (pEvtY >= pTop) {
  //       this.config.scroll.mouseDown = false;
  //       pTop = pEvtY;
  //     }
  //   } else {
  //     if (pEvtY <= pTop + vThumbHeight) {
  //       this.config.scroll.mouseDown = false;
  //       pTop = pEvtY - vThumbHeight;
  //     }
  //   }

  //   this.moveVerticalScroll({ pos: pTop });

  //   if (this.config.scroll.mouseDown) {
  //     this.config.scroll.verticalScrollTimer = setTimeout(() => {
  //       this.verticalMove(pEvtY, pTop, vThumbHeight, oneRowMove * this.options.scroll.horizontal.speed);
  //     }, 100);
  //   }
  // }

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

  //   this.moveHorizontalScroll({ pos: pLeft });

  //   if (this.config.scroll.mouseDown) {
  //     this.config.scroll.horizontalScrollTimer = setTimeout(() => {
  //       this.horizontalMove(pEvtX, pLeft, hThumbWidth, oneColMove);
  //     }, 100);
  //   }
  // }
}
