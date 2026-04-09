import { ScrollDirectionX, SelectionMode } from '@/constants';
import { PointerContext } from '@/event/PointerContext';
import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerSession } from '@/event/PointerSession';
import { SelectionInfo } from '@/selection/selection';
import { CellInfo, Selection, SelectionRange } from '@/types/GridConfig';
import { getElementRect, hasClass } from '@/util/domUtils';
import { isCtrlKey, isShiftKey } from '@/util/eventUtils';
import { dragHorizontalMovePosition, isMultipleCellSelectionMode } from '@/util/gridUtils';
import { HeaderEvent } from './HeaderEvent';

/**
 * HeaderCellClickHandler class
 *
 * @class HeaderCellClickHandler
 * @typedef {HeaderCellClickHandler}
 */
export class HeaderCellClickHandler extends BasePointerHandler {
  priority = 5;
  protected readonly rowHeight: number;

  protected readonly selectionInfo: SelectionInfo;
  private readonly dragDelay = 150;

  protected readonly selectionMode: string;

  protected headerPosition: any;

  private readonly moveRange: { endIdx: number; endCol: number } = { endIdx: -1, endCol: -1 };
  private beforeEndCol = -1;

  private startCellIdx = 0;

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

  protected startCellInfo: CellInfo;

  protected scrollDirectionX: ScrollDirectionX | null = null;

  protected dragAnimationId = 0;
  private lastScrollTime = 0;

  private currentSelectionMode: string;

  private readonly headerElement: HTMLElement;

  public constructor(context: PointerContext, headerEvent: HeaderEvent) {
    super(context);

    this.selectionInfo = context.gridMain.selectionInfo;

    this.headerElement = context.header?.getHeaderElement().getElement() as HTMLElement;

    this.multipleFlag = isMultipleCellSelectionMode(this.opts.selectionMode);
  }

  canHandle(session: PointerSession): void | boolean {
    this.startCellIdx = session.cellInfo?.c ?? 0;
    const field = this.cfg.currentFields[this.startCellIdx];
    if (field.$isAside) {
      return false;
    }

    return true;
  }

  onPointerDown(session: PointerSession): void | boolean {
    //
  }

  onActivate(session: PointerSession) {
    if (!this.multipleFlag) return false;
    const cfg = this.cfg;

    const position = getElementRect(this.headerElement, true);

    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;

    this.gridBounds = {
      gridLeft: position.left,
      gridRight: position.left + cfg.dimensions.mainTotalWidth,
      mainLeft: position.left + mainLeftWidth,
      mainRight: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight,
    };

    this.headerPosition = position;

    this.scrollDirectionX = null;
    this.beforeEndCol = -1;

    if (this.multipleFlag && hasClass(session.cellEl!, 'line-number')) {
      this.currentSelectionMode = SelectionMode.MULTIPLE_ROW;
    }
  }

  onPointerMove(session: PointerSession) {
    if (!this.multipleFlag) return;

    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x } = session.currentPos;

    const moveRange: any = {};

    let hasMove = false;

    const moveXInfo = dragHorizontalMovePosition(
      cfg,
      x,
      this.headerPosition.left,
      bounds.mainLeft,
      bounds.mainRight,
      this.beforeEndCol,
    );

    if (moveXInfo.overCell > -1) {
      hasMove = true;
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(
        this.currentSelectionMode,
        moveXInfo.overCell,
        cfg,
        session.cellEl!,
        cfg.selection.isMouseDown,
      ).endCol;
    }

    this.scrollDirectionX = moveXInfo.scrollDirectionX;

    if (this.beforeEndCol === moveRange.endCol) return;

    if (hasMove) {
      this.selectionInfo.setSelectionRangeInfo(
        {
          id: cfg.selection.id,
          range: moveRange as SelectionRange,
        } as Selection,
        false,
        this.scrollDirectionX === null,
      );
    }

    this.beforeEndCol = moveRange.endCol ?? -1;

    if (this.scrollDirectionX && this.dragAnimationId === 0) {
      this.startAutoScroll();
    }
  }

  protected startAutoScroll(selection = true) {
    if (this.dragAnimationId) return;

    this.lastScrollTime = 0;

    const cfg = this.cfg;

    const beforeMovePosition = { col: -1, rowIdx: -1 };

    const gridMain = this.context.gridMain;
    const scroll = gridMain.getScroll();
    const body = this.context.gridMain.getBody();

    const loop = (time: number) => {
      const scrollDirectionX = this.scrollDirectionX;

      if (scrollDirectionX === null) {
        this.stopAutoScroll();
        return;
      }

      if (time - this.lastScrollTime < this.dragDelay) {
        this.dragAnimationId = requestAnimationFrame(loop);
        return;
      }

      this.lastScrollTime = time;

      let isDraw = false;

      const moveRangeInfo = {} as SelectionRange;

      if (scrollDirectionX !== null) {
        const isRight = scrollDirectionX === ScrollDirectionX.RIGHT;

        const endCol = isRight ? cfg.scroll.insideEndCol + 1 : cfg.scroll.insideStartCol - 1;

        if (beforeMovePosition.col !== endCol) {
          if ((isRight && cfg.fixedRightIndex === 0) || (!isRight && cfg.fixedLeftIndex === 0)) {
            moveRangeInfo.endCol = endCol;

            this.selectionInfo.setSelectionRangeInfo({ range: moveRangeInfo } as Selection, false, false);
          }
        }

        scroll.moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });

        beforeMovePosition.col = endCol;
        isDraw = true;
      }

      if (isDraw) {
        body.dataDraw('drageHeadScroll');
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
    const cfg = this.cfg;
    let initFlag = cfg.selection.id == '';
    const startCellIdx = this.startCellIdx;
    const range: any = {
      type: 'column',
      startIdx: 0,
      endIdx: cfg.dataInfo.lastRow,
      startCol: startCellIdx,
      endCol: startCellIdx,
    };
    const e = session.event;
    if (isCtrlKey(e)) {
      range.modifierKey = 1;
    } else if (isShiftKey(e)) {
      range.modifierKey = 2;
      range.startCol = initFlag ? startCellIdx : cfg.selection.range.startCol;
      range.endCol = startCellIdx;
    } else {
      initFlag = true;
    }

    this.selectionInfo.setSelectionRangeInfo(
      {
        range: range as SelectionRange,
        isSelect: true,
        startCell: { startCol: startCellIdx },
      } as Selection,
      initFlag,
      true,
    );
  }
}
