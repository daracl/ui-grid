import { PointerContext } from "@/event/PointerContext";
import { PointerHandler } from "@/event/PointerHandler";
import { PointerSession } from "@/event/PointerSession";
import { SelectionInfo } from "@/selection/selection";
import { Config, SelectionRange, Selection, CellInfo } from "@/types/GridConfig";
import { getElementRect, hasClass } from "@/util/domUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, isFixedLeftPostion, isFixedRightPostion, isMultipleSelection, isRowSelection } from "@/util/gridUtils";
import { BodyEvent } from "./BodyEvent";
import * as utils from "@/util/utils";
import { GridOptions } from "@/types/GridOptions";
import { ROW_CHECK_NAME, ScrollDirectionX, ScrollDirectionY, SelectionMode } from "@/constants";
import { isCtrlKey, isShiftKey } from "@/util/eventUtils";
import { DaraElement } from "@/element/DaraElement";

/**
 * CellClickHandler class
 *
 * @class CellClickHandler
 * @typedef {CellClickHandler}
 */
export class CellClickHandler implements PointerHandler {
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

  protected gridBounds: { left: number; right: number; top: number; bottom: number };

  protected startCellInfo: CellInfo;
  private cellElement: HTMLElement;

  protected scrollDirectionX: ScrollDirectionX | null = null;
  protected scrollDirectionY: ScrollDirectionY | null = null;

  protected dragAnimationId: number = 0;
  private lastScrollTime = 0;

  private currentSelectionMode: string;

  private readonly enableDblClickRowCheck: boolean;
  private readonly cellDblClick: ((cellInfo: any) => any) | undefined;
  private readonly isCellDbClickEvent: boolean;

  private readonly bodyElement: HTMLElement;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    this.context = context;
    this.cfg = context.grid.config();
    this.selectionInfo = context.gridMain.selectionInfo;

    this.bodyElement = context.body?.getBodyElement().getElement()!;
    this.opts = context.grid.getOptions();

    this.selectionMode = this.opts.selectionMode;

    this.multipleFlag = isMultipleSelection(this.selectionMode);

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
    this.currentSelectionMode = this.selectionMode;
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;

    const position = getElementRect(this.bodyElement, true);

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

    if (this.multipleFlag && hasClass(session.cellEl!, "line-number")) {
      this.currentSelectionMode = SelectionMode.MULTIPLE_ROW;
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
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(this.currentSelectionMode, moveXInfo.overCell, cfg, this.cellElement, cfg.selection.isMouseDown).endCol;
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

  protected startAutoScroll(selection: boolean = true) {
    if (this.dragAnimationId) return;

    this.lastScrollTime = 0;

    const cfg = this.cfg;

    let beforeMovePosition = { col: -1, rowIdx: -1 };

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
        const endIdx = scrollDirectionY === ScrollDirectionY.DOWN ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1 : cfg.scroll.startIdx - 1;

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

        body.dataDraw("dragscroll");
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
    this.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.currentSelectionMode, this.cellElement);

    this.cellClickFn?.(this.startCellInfo);
  }

  onDoubleClick(session: PointerSession): void {
    if (!this.isCellDbClickEvent) return;

    const cellInfo = session.cellInfo!;
    const field = cellInfo.field;

    if (!field.$isAside && !field.$renderer.isEditRenderer() && (field.editable === true || (this.editable === true && field.editable !== false))) {
      field.$editRenderer.render(cellInfo, session.cellEl!);
    }

    if (this.enableDblClickRowCheck) {
      this.setRowCheckItemClick(cellInfo);
    }

    if (this.cellDblClick?.(cellInfo) === false) return;
  }

  /**
   * row check item click event trigger
   *
   * @public
   * @param {CellInfo} cellInfo
   */
  private setRowCheckItemClick(cellInfo: CellInfo) {
    const cfg = this.context.grid.config();
    const rowCheckCol = cfg.allFieldMap.get(ROW_CHECK_NAME)?.$colSeq;
    if (!utils.isEmpty(rowCheckCol)) {
      (this.bodyElement.querySelector(`[data-cell-position="${cellInfo.r},${rowCheckCol}"] [name="dgRowCheck"]`) as HTMLElement).click();
    }
  }

  // cell click
  protected setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string, cellElement: HTMLElement) {
    const context = this.context;
    const cfg = context.grid.config();
    const gridMain = context.gridMain;

    gridMain.setGridFocusIn(e, true);

    if (!(cellInfo.field.renderer.type == "dropdown" && cellInfo.c == +cfg.activeComponent)) {
      gridMain.hideLayer();
    }

    const rowIndex = cellInfo.rowIndex,
      cellIdx = cellInfo.c;

    if (!isFixedLeftPostion(cfg, cellIdx) && !isFixedRightPostion(cfg, cellIdx)) {
      if (cellIdx < cfg.scroll.insideStartCol) {
        gridMain.getScroll().moveHorizontalScroll({ direction: "L", colIdx: cellIdx });
      } else if (cellIdx > cfg.scroll.insideEndCol) {
        gridMain.getScroll().moveHorizontalScroll({ direction: "R", colIdx: cellIdx });
      }
    }

    let keyMode = (isShiftKey(e) ? 2 : 0) + (isCtrlKey(e) ? 1 : 0);

    const selectRangeInfo = this.selectionInfo.getSelectionModeColInfo(selectionMode, cellIdx, cfg, cellElement, multipleFlag && keyMode == 2);

    if ((multipleFlag && keyMode != 2) || !multipleFlag) {
      context.body?.removeStartCellClass();
    }

    const rangeType = isRowSelection(selectionMode) ? "row" : "cell";

    if (multipleFlag && keyMode >= 2) {
      // shift key
      let rangeInfo = { endIdx: rowIndex, endCol: selectRangeInfo.endCol, modifierKey: 2 } as SelectionRange;

      if (selectRangeInfo.startCol > -1) {
        rangeInfo.startCol = selectRangeInfo.startCol;
      }

      rangeInfo.type = rangeType;

      this.selectionInfo.setSelectionRangeInfo(
        {
          range: rangeInfo,
          isMouseDown: true,
        } as Selection,
        false,
        true
      );
    } else if (multipleFlag && keyMode == 1) {
      // ctrl key

      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { type: rangeType, startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol, modifierKey: 1 } as SelectionRange,
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: selectRangeInfo.startCol },
        } as Selection,
        false,
        true
      );
    } else {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: { type: rangeType, startIdx: rowIndex, endIdx: rowIndex, startCol: selectRangeInfo.startCol, endCol: selectRangeInfo.endCol } as SelectionRange,
          isSelect: true,
          isMouseDown: true,
          startCell: { startIdx: rowIndex, startCol: cellIdx },
        } as Selection,
        true,
        true
      );
    }

    window.getSelection()?.removeAllRanges();
  }
}
