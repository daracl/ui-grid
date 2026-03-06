import { PointerContext } from "@/event/PointerContext";
import { PointerHandler } from "@/event/PointerHandler";
import { PointerSession } from "@/event/PointerSession";
import { SelectionInfo } from "@/selection/selection";
import { Config, SelectionRange, Selection, CellInfo } from "@/types/GridConfig";
import { getElementRect, hasClass } from "@/util/domUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, isMultipleSelection } from "@/util/gridUtils";
import { BodyEvent } from "./BodyEvent";
import * as utils from "@/util/utils";
import { GridOptions } from "@/types/GridOptions";
import { ScrollDirectionX, ScrollDirectionY, SelectionMode } from "@/constants";

/**
 * CellClickHandler class
 *
 * @class CellClickHandler
 * @typedef {CellClickHandler}
 */
export class CellClickHandler implements PointerHandler {
  priority = 5;
  private readonly rowHeight: number;
  private readonly context: PointerContext;
  private readonly cfg: Config;
  private readonly bodyDragDelay = 150;

  private readonly orginSelectionMode: string;
  private readonly selectionInfo: SelectionInfo;
  private readonly bodyEvent: BodyEvent;
  private bodyPosition: any;

  private readonly moveRange: { endIdx: number; endCol: number } = { endIdx: -1, endCol: -1 };
  private beforeEndIdx = -1;
  private beforeEndCol = -1;

  private readonly cellClickFn: ((cellInfo: any) => void) | undefined;

  private readonly editable: boolean;
  private readonly opts: GridOptions;
  private readonly multipleFlag: boolean;

  private gridBounds: { left: number; right: number; top: number; bottom: number };

  private startCellInfo: CellInfo;
  private cellElement: HTMLElement;

  private scrollDirectionX: ScrollDirectionX | null = null;
  private scrollDirectionY: ScrollDirectionY | null = null;

  private dragAnimationId: number = 0;

  private selectionMode: string;

  private readonly enableDblClickRowCheck: boolean;
  private readonly cellDblClick: ((cellInfo: any) => any) | undefined;
  private readonly isCellDbClickEvent: boolean;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    this.context = context;
    this.cfg = context.grid.config();
    this.selectionInfo = context.gridMain.selectionInfo;
    this.bodyEvent = bodyEvent;
    this.opts = context.grid.getOptions();

    this.orginSelectionMode = this.opts.selectionMode;
    this.multipleFlag = isMultipleSelection(this.orginSelectionMode);

    this.cellClickFn = this.opts.body.cellClick;
    this.editable = this.opts.editable;
    this.rowHeight = this.cfg.rowHeight;

    const rowOptions = this.opts.body.row;

    this.enableDblClickRowCheck = rowOptions.enableDblClickRowCheck === true;
    this.cellDblClick = this.opts.body.cellDblClick;

    this.isCellDbClickEvent = this.editable || this.enableDblClickRowCheck || utils.isFunction(this.cellDblClick);
  }

  canHandle(session: PointerSession) {
    return true;
  }

  onPointerDown(session: PointerSession): void {
    this.cellElement = session.cellEl!;
    this.startCellInfo = session.cellInfo!;
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;

    const position = getElementRect(this.context.gridMain.getBody().getBodyElement().getElement(), true);

    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;

    this.gridBounds = {
      left: position.left + mainLeftWidth,
      right: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight,
    };

    this.bodyPosition = position;

    this.scrollDirectionX = null;
    this.scrollDirectionY = null;

    this.beforeEndIdx = -1;
    this.beforeEndCol = -1;

    this.selectionMode = this.orginSelectionMode;

    if (this.multipleFlag && hasClass(session.cellEl!, "line-number")) {
      this.selectionMode = SelectionMode.MULTIPLE_ROW;
    }
  }

  onPointerMove(session: PointerSession) {
    if (!this.multipleFlag) return;

    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x, y } = session.currentPos;

    const moveRange = this.moveRange;
    moveRange.endCol = -1;
    moveRange.endIdx = -1;

    let hasMove = false;

    const moveXInfo = dragHorizontalMovePosition(cfg, x, this.bodyPosition.left, bounds.left, bounds.right, this.beforeEndCol);
    if (moveXInfo.overCell > -1) {
      hasMove = true;
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(this.selectionMode, moveXInfo.overCell, cfg, this.cellElement, cfg.selection.isMouseDown).endCol;
    }

    const moveYInfo = dragVerticalMovePosition(cfg, y, this.rowHeight, this.startCellInfo, bounds.top, bounds.bottom);
    if (moveYInfo.rowIdx > -1) {
      hasMove = true;
      moveRange.endIdx = moveYInfo.rowIdx;
    }

    this.scrollDirectionX = moveXInfo.scrollDirectionX;
    this.scrollDirectionY = moveYInfo.scrollDirectionY;

    if (this.beforeEndIdx === moveRange.endIdx && this.beforeEndCol === moveRange.endCol) return;

    if (hasMove) {
      this.selectionInfo.setSelectionRangeInfo({ range: moveRange as SelectionRange } as Selection, false, this.scrollDirectionX === null && this.scrollDirectionY === null);
    }

    this.beforeEndCol = moveRange.endCol ?? -1;
    this.beforeEndIdx = moveRange.endIdx ?? -1;

    if ((this.scrollDirectionX || this.scrollDirectionY) && this.dragAnimationId === 0) {
      this.startAutoScroll();
    }
  }

  private lastScrollTime = 0;

  private startAutoScroll() {
    if (this.dragAnimationId) return;

    this.lastScrollTime = 0;

    const cfg = this.cfg;

    let beforeMovePosition = { col: -1, rowIdx: -1 };

    const gridMain = this.context.gridMain;
    const scroll = gridMain.getScroll();
    const body = gridMain.getBody();

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
        const endIdx = scrollDirectionY === ScrollDirectionY.DOWN ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1 : cfg.scroll.startIdx - 1;

        if (beforeMovePosition.rowIdx !== endIdx) {
          moveRangeInfo.endIdx = endIdx;

          scroll.moveVerticalScroll({ direction: scrollDirectionY, drawFlag: false });

          beforeMovePosition.rowIdx = endIdx;
          isDraw = true;
        }
      }

      if (isDraw) {
        this.selectionInfo.setSelectionRangeInfo({ range: moveRangeInfo } as Selection, false, false);

        body.dataDraw("dragscroll");
      }

      this.dragAnimationId = requestAnimationFrame(loop);
    };

    this.dragAnimationId = requestAnimationFrame(loop);
  }

  private stopAutoScroll() {
    if (this.dragAnimationId !== 0) {
      cancelAnimationFrame(this.dragAnimationId);
      this.dragAnimationId = 0;
    }
  }

  onPointerUp(session: PointerSession) {
    this.stopAutoScroll();
  }

  onClick(session: PointerSession): void {
    this.bodyEvent.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, this.cellElement);

    this.cellClickFn?.(this.startCellInfo);
  }

  onDoubleClick(session: PointerSession): void {
    if (!this.isCellDbClickEvent) return;

    const cellInfo = session.cellInfo!;
    const field = cellInfo.field;

    if ((field.editable === true || (this.editable === true && field.editable !== false)) && !field.$renderer.isEditRenderer()) {
      field.$editRenderer.render(cellInfo, session.cellEl!);
    }

    if (this.enableDblClickRowCheck) {
      this.bodyEvent.setRowCheckItemClick(cellInfo);
    }

    if (this.cellDblClick?.(cellInfo) === false) return;
  }
}
