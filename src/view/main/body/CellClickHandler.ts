import { PointerContext } from "@/event/PointerContext";
import { PointerHandler } from "@/event/PointerHandler";
import { PointerSession } from "@/event/PointerSession";
import { SelectionInfo } from "@/selection/selection";
import { Config, SelectionRange, Selection } from "@/types/GridConfig";
import { getElementRect, hasClass } from "@/util/domUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, isMultipleSelection } from "@/util/gridUtils";
import { BodyEvent } from "./BodyEvent";
import * as utils from "@/util/utils";
import { GridOptions } from "@/types/GridOptions";

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

  private readonly cellClickFn: ((cellInfo: any) => void) | undefined;
  private readonly isCellClick: boolean;

  private readonly editable: boolean;

  private readonly opts: GridOptions;

  private readonly multipleFlag: boolean;

  private gridBounds: { left: number; right: number; top: number; bottom: number };

  private startCellInfo: any;
  private beforeMoveRange: { endIdx: number; endCol: number };
  private cellElement: HTMLElement;

  private scrollDirectionX: string;
  private scrollDirectionY: string;

  private bodyDragTimer: any = -1;
  private selectionMode: string;

  private readonly enableDblClickRowCheck: boolean;
  private readonly cellDblClick: ((cellInfo: any) => void) | undefined;
  private readonly isCellDblClick: boolean;
  private isCellDbClickEvent: boolean;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    this.context = context;
    this.cfg = context.grid.config();
    this.selectionInfo = context.gridMain.selectionInfo;
    this.bodyEvent = bodyEvent;
    this.opts = context.grid.getOptions();

    this.orginSelectionMode = this.opts.selectionMode;
    this.bodyDragDelay = 150;

    this.multipleFlag = isMultipleSelection(this.orginSelectionMode);

    this.cellClickFn = this.opts.body.cellClick;
    this.isCellClick = utils.isFunction(this.cellClickFn);
    this.editable = this.opts.editable;
    this.rowHeight = this.cfg.rowHeight;

    const rowOptions = this.opts.body.row;

    // row cell double click event
    this.enableDblClickRowCheck = rowOptions.enableDblClickRowCheck === true;
    this.cellDblClick = this.opts.body.cellDblClick;
    this.isCellDblClick = utils.isFunction(this.cellDblClick);
    this.isCellDbClickEvent = this.editable || this.enableDblClickRowCheck || this.isCellDblClick;
  }

  canHandle(session: PointerSession) {
    return true;
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

    this.cellElement = session.cellEl!;
    this.startCellInfo = session.cellInfo!;
    this.selectionMode = this.orginSelectionMode;
    this.scrollDirectionX = "";
    this.scrollDirectionY = "";
    if (this.multipleFlag && hasClass(this.cellElement, "line-number")) {
      this.selectionMode = "multiple-row";
    }

    this.beforeMoveRange = { endIdx: -1, endCol: -1 };
  }

  /** move 중 */
  onPointerMove(session: PointerSession) {
    if (!this.multipleFlag) return;

    const cfg = this.cfg;

    this.cfg.isBodyDragging = true;

    const bounds = this.gridBounds;

    const e1Position = session.currentPos;

    const moveXInfo = dragHorizontalMovePosition(cfg, e1Position.x, this.bodyPosition.left, bounds.left, bounds.right, this.beforeMoveRange.endCol);
    this.scrollDirectionX = moveXInfo.mouseScrollDirectionX;

    const moveRange: any = {};
    if (moveXInfo.overCell > -1) {
      moveRange.endCol = this.selectionInfo.getSelectionModeColInfo(this.selectionMode, moveXInfo.overCell, cfg, this.cellElement, cfg.selection.isMouseDown).endCol;
    }

    const moveYInfo = dragVerticalMovePosition(cfg, e1Position.y, this.rowHeight, this.startCellInfo, bounds.top, bounds.bottom);
    this.scrollDirectionY = moveYInfo.scrollDirectionY;
    if (moveYInfo.rowIdx > -1) {
      moveRange.endIdx = moveYInfo.rowIdx;
    }

    if (this.beforeMoveRange.endIdx == moveRange.endIdx && this.beforeMoveRange.endCol == moveRange.endCol) return;

    if (Object.keys(moveRange).length > 0) {
      this.selectionInfo.setSelectionRangeInfo(
        {
          range: moveRange as SelectionRange,
        } as Selection,
        false,
        this.scrollDirectionX == "" && this.scrollDirectionY == ""
      );
    }

    this.beforeMoveRange = moveRange;

    if (this.bodyDragTimer < 1) {
      let beforeMovePosition = { col: -1, rowIdx: -1 };
      this.bodyDragTimer = setInterval(() => {
        const scrollDirectionX = this.scrollDirectionX;
        const scrollDirectionY = this.scrollDirectionY;

        if (scrollDirectionX == "" && scrollDirectionY == "") return;

        let isDraw = false;

        const moveRangeInfo = {} as SelectionRange;

        if (scrollDirectionX != "") {
          const isRight = scrollDirectionX === "R";
          let endCol = isRight ? cfg.scroll.insideEndCol + 3 : cfg.scroll.insideStartCol - 3;

          if (beforeMovePosition.col != endCol) {
            if ((isRight && cfg.fixedRightIndex == 0) || (!isRight && cfg.fixedLeftIndex == 0)) {
              moveRangeInfo.endCol = endCol;
            }

            this.context.gridMain.getScroll().moveHorizontalScroll({ direction: scrollDirectionX, colIdx: endCol, drawFlag: false });
            beforeMovePosition.col = endCol;
            isDraw = true;
          }
        }

        if (scrollDirectionY != "") {
          let endIdx = scrollDirectionY == "D" ? cfg.scroll.startIdx + cfg.scroll.insideViewRow + 1 : cfg.scroll.startIdx - 1;

          if (beforeMovePosition.rowIdx != endIdx) {
            moveRangeInfo.endIdx = endIdx;
            this.context.gridMain.getScroll().moveVerticalScroll({ direction: scrollDirectionY, drawFlag: false });
            beforeMovePosition.rowIdx = endIdx;
            isDraw = true;
          }
        }

        if (isDraw) {
          this.selectionInfo.setSelectionRangeInfo(
            {
              range: moveRangeInfo,
            } as Selection,
            false,
            false
          );
          this.context.gridMain.getBody().dataDraw("dragscroll");
        }
      }, this.bodyDragDelay);
    }
  }

  /** pointer up */
  onPointerUp(session: PointerSession) {
    this.cfg.isBodyDragging = false;
    clearInterval(this.bodyDragTimer);
    this.bodyDragTimer = -1;
  }
  /** click */
  onClick(session: PointerSession): void {
    this.bodyEvent.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, this.cellElement);

    if (this.isCellClick) {
      if (this.cellClickFn) this.cellClickFn(this.startCellInfo);
    }
  }

  /** 더블 클릭 */
  onDoubleClick(session: PointerSession): void {
    if (!this.isCellDbClickEvent) return;

    const cellInfo = session.cellInfo!;
    const field = cellInfo.field;

    if (this.opts.body.cellDblClick) {
      if (this.opts.body.cellDblClick(cellInfo) === false) return;
    }

    if ((field.editable === true || (this.editable === true && field.editable !== false)) && !field.$renderer.isEditRenderer()) {
      field.$editRenderer.render(cellInfo, session.cellEl!);
    }

    if (this.enableDblClickRowCheck) {
      this.bodyEvent.setRowCheckItemClick(cellInfo);
    }

    if (this.isCellDblClick) {
      this.cellDblClick!(cellInfo);
    }
  }
}
