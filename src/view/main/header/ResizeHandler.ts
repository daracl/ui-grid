import { ScrollDirectionX, ScrollDirectionY } from '@/constants';
import { PointerContext } from '@/event/PointerContext';
import { PointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { SelectionInfo } from '@/selection/selection';
import { Config, HeaderCellInfo, Selection, SelectionRange } from '@/types/GridConfig';
import { GridOptions } from '@/types/GridOptions';
import { getMaxColumnSize, isFixedLeftPostion, isFixedRightPostion, isMultipleSelectionMode } from '@/util/gridUtils';
import * as utils from '@/util/utils';
import { HeaderEvent } from './HeaderEvent';
import { DaraElement } from '@/element/DaraElement';

/**
 * ResizeHandler class
 *
 * @class ResizeHandler
 * @typedef {ResizeHandler}
 */
export class ResizeHandler implements PointerHandler {
  priority = 5;
  protected readonly rowHeight: number;
  protected readonly context: PointerContext;
  protected readonly cfg: Config;
  protected readonly selectionInfo: SelectionInfo;
  protected readonly opts: GridOptions;
  private readonly bodyDragDelay = 150;

  protected readonly selectionMode: string;

  protected bodyPosition: any;

  private readonly moveRange: { endIdx: number; endCol: number } = { endIdx: -1, endCol: -1 };
  private beforeEndIdx = -1;
  private beforeEndCol = -1;

  private readonly cellClickFn: ((cellInfo: any) => void) | undefined;

  private readonly editable: boolean;

  protected readonly multipleFlag: boolean;

  protected gridBounds: {
    gridLeft: number;
    gridRight: number;
    mainLeft: number;
    mainRight: number;
    top: number;
    bottom: number;
  };

  protected startCellInfo: HeaderCellInfo;
  private cellElement: HTMLElement;

  protected scrollDirectionX: ScrollDirectionX | null = null;
  protected scrollDirectionY: ScrollDirectionY | null = null;

  protected dragAnimationId = 0;
  private lastScrollTime = 0;

  private currentSelectionMode: string;

  private readonly enableDblClickRowCheck: boolean;
  private readonly cellDblClick: ((cellInfo: any) => any) | undefined;
  private readonly isCellDbClickEvent: boolean;

  private readonly bodyElement: HTMLElement;

  private readonly resizerHelperElement: DaraElement;

  private positionLeft = 0;

  public constructor(context: PointerContext, headerEvent: HeaderEvent) {
    this.context = context;
    this.cfg = context.grid.config();
    this.selectionInfo = context.gridMain.selectionInfo;

    this.bodyElement = context.body?.getBodyElement().getElement() as HTMLElement;
    this.opts = context.grid.getOptions();

    this.selectionMode = this.opts.selectionMode;

    this.multipleFlag = isMultipleSelectionMode(this.selectionMode);

    this.cellClickFn = this.opts.body.cellClick;
    this.editable = this.opts.editable;
    this.rowHeight = this.cfg.rowHeight;

    const rowOptions = this.opts.body.row;

    this.enableDblClickRowCheck = rowOptions.enableDblClickRowCheck === true;
    this.cellDblClick = this.opts.body.cellDblClick;

    this.isCellDbClickEvent = this.editable || this.enableDblClickRowCheck || utils.isFunction(this.cellDblClick);

    this.resizerHelperElement = context.grid.element().findDaraElement('.dg-resize-helper');
  }

  canHandle(session: PointerSession) {
    return true;
  }

  onPointerDown(session: PointerSession): void {
    this.cellElement = session.cellEl!;
    this.startCellInfo = session.cellInfo!;
    this.currentSelectionMode = this.selectionMode;
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;

    const resizeIdx = session.cellInfo?.c || 0;

    const isLeftContent = isFixedLeftPostion(cfg, resizeIdx);
    const isRightContent = isFixedRightPostion(cfg, resizeIdx);

    let posLeft = 0;
    if (isRightContent) {
      for (let i = cfg.fixedRightIndex; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }
      this.positionLeft = cfg.dimensions.mainInsideWidth - cfg.dimensions.mainRightWidth + posLeft;
    } else if (isLeftContent) {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.positionLeft = posLeft;
    } else {
      for (let i = 0; i <= resizeIdx; i++) {
        posLeft += cfg.currentFields[i].$width;
      }

      this.positionLeft = posLeft - cfg.scroll.centerLeftPosition;
    }

    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
  }

  onPointerMove(session: PointerSession) {
    console.log('122');

    this.resizerHelperElement.css({ left: this.positionLeft + 'px' });
    this.resizerHelperElement.addClass('active');
  }

  protected startAutoScroll(selection = true) {
    if (this.dragAnimationId) return;

    this.lastScrollTime = 0;

    const cfg = this.cfg;

    const beforeMovePosition = { col: -1, rowIdx: -1 };

    const gridMain = this.context.gridMain;
    const scroll = gridMain.getScroll();
    const body = this.context.body!;

    const loop = (time: number) => {
      const scrollDirectionX = this.scrollDirectionX;
      const scrollDirectionY = this.scrollDirectionY;

      if (scrollDirectionX === null && scrollDirectionY === null) {
        this.stopAutoScroll();
        return;
      }

      if (time - this.lastScrollTime < this.bodyDragDelay) {
        this.dragAnimationId = requestAnimationFrame(loop);
        return;
      }

      this.lastScrollTime = time;

      let isDraw = false;

      const moveRangeInfo = {} as SelectionRange;

      if (scrollDirectionX !== null) {
        const isRight = scrollDirectionX === ScrollDirectionX.RIGHT;

        const endCol = isRight ? cfg.scroll.insideEndCol + 3 : cfg.scroll.insideStartCol - 3;

        if (beforeMovePosition.col !== endCol) {
          if ((isRight && cfg.fixedRightIndex === 0) || (!isRight && cfg.fixedLeftIndex === 0)) {
            moveRangeInfo.endCol = endCol;
          }

          scroll.moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });

          beforeMovePosition.col = endCol;
          isDraw = true;
        }
      }

      if (scrollDirectionY !== null) {
        const endIdx =
          scrollDirectionY === ScrollDirectionY.DOWN
            ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1
            : cfg.scroll.startIdx - 1;

        if (beforeMovePosition.rowIdx !== endIdx) {
          moveRangeInfo.endIdx = endIdx;

          scroll.moveVerticalScroll({ direction: scrollDirectionY, drawFlag: false });

          beforeMovePosition.rowIdx = endIdx;
          isDraw = true;
        }
      }

      if (isDraw) {
        if (selection) {
          this.selectionInfo.setSelectionRangeInfo({ range: moveRangeInfo } as Selection, false, false);
        }

        body.dataDraw('dragscroll');
      }

      this.dragAnimationId = requestAnimationFrame(loop);
    };

    this.dragAnimationId = requestAnimationFrame(loop);
  }

  protected stopAutoScroll() {
    if (this.dragAnimationId !== 0) {
      cancelAnimationFrame(this.dragAnimationId);
      this.dragAnimationId = 0;
    }
  }

  onPointerUp(session: PointerSession) {
    this.stopAutoScroll();
  }

  onClick(session: PointerSession): void {
    console.log('1111');
  }

  onDoubleClick(session: PointerSession): void {
    if (!this.isCellDbClickEvent) return;

    const resizeIdx = session.cellInfo?.c || 0;

    const field = this.cfg.currentFields[resizeIdx];

    const resizeW = getMaxColumnSize(this.cfg, this.opts, field, 0);

    this.context.header?.setColumnWidth(resizeIdx, resizeW);
  }
}
