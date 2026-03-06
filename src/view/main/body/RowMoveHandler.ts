import { PointerContext } from "@/event/PointerContext";
import { PointerHandler } from "@/event/PointerHandler";
import { PointerSession } from "@/event/PointerSession";
import { SelectionInfo } from "@/selection/selection";
import { Config, SelectionRange, Selection } from "@/types/GridConfig";
import { getElementRect, hasClass } from "@/util/domUtils";
import { dragHorizontalMovePosition, dragVerticalMovePosition, getCellInfo, isMultipleSelection } from "@/util/gridUtils";
import { BodyEvent } from "./BodyEvent";
import * as utils from "@/util/utils";
import { GridOptions } from "@/types/GridOptions";
import { HIDDEN_ELEMENT_SELECTOR } from "@/constants";

/**
 * RowMoveHandler class
 *
 * @class RowMoveHandler
 * @typedef {RowMoveHandler}
 */
export class RowMoveHandler implements PointerHandler {
  priority = 10;
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

  private rowMoveOptions: any;
  private rowMoveDropHelperElement: HTMLElement;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    this.context = context;
    this.cfg = context.grid.config();
    this.selectionInfo = context.gridMain.selectionInfo;
    this.bodyEvent = bodyEvent;
    this.opts = context.grid.getOptions();

    this.orginSelectionMode = this.opts.selectionMode;
    this.bodyDragDelay = 150;

    this.multipleFlag = isMultipleSelection(this.orginSelectionMode);

    const rowMoveOptions = this.opts.body.rowMove;

    this.rowMoveOptions = rowMoveOptions;

    this.rowHeight = this.cfg.rowHeight;

    this.rowMoveDropHelperElement = context.grid.element().findDaraElement(".dg-movedrop-helper").getElement();
    this.initTemplate();
  }

  initTemplate() {
    const rowMoveElement = document.createElement("div");
    rowMoveElement.className = "dg-row-move-helper";
    // set static styles once
    rowMoveElement.style.cssText = `position: absolute; z-index: 1000; padding: 3px; height: ${this.rowHeight}px; will-change: transform; display: none;`;

    document.querySelector(HIDDEN_ELEMENT_SELECTOR)?.appendChild(rowMoveElement);
  }

  canHandle(session: PointerSession) {
    const moveRowItem = session.cellInfo!;
    const rowMoveOptions = this.rowMoveOptions;

    if (!(rowMoveOptions?.dragHandle == moveRowItem.field.name || (utils.isArray(rowMoveOptions?.dragHandle) && rowMoveOptions?.dragHandle.indexOf(moveRowItem.field.name) > -1) || !rowMoveOptions?.dragHandle)) {
      return false;
    }

    return true;
  }

  onPointerDown(session: PointerSession): void {}

  onActivate(session: PointerSession) {
    const cfg = this.cfg;
    const opts = this.opts;
    const rowMoveOptions = opts.body.rowMove;

    const moveRowItem = session.cellInfo!;

    const dragStart = rowMoveOptions?.dragStart;

    if (dragStart?.({ moveItems: [moveRowItem] }) === false) {
      return false;
    }
  }

  /** move 중 */
  onPointerMove(session: PointerSession) {
    scrollDirectionY = verticalMovePosition.scrollDirectionY ?? "";
    const viewRowIdx = verticalMovePosition.viewRowIdx;

    const moveViewRowY = mouseMovePosition.y - bodyTop;

    const offsetInRow = moveViewRowY - viewRowIdx * rowHeight;

    // 위쪽 1/3, 아래쪽 2/3 기준
    let isMoveUp = offsetInRow < rowHeight / ROW_DRAG_RATIO; // 상단 1/3 안쪽
    let isMoveDown = rowHeight - offsetInRow < rowHeight / ROW_DRAG_RATIO; // 하단 2/3 밖

    let helperViewIndex = dropRowIdx === -1 ? viewRowIdx : verticalMovePosition.rowIdx - scroll.startIdx;

    if (isMoveUp) {
      helperViewIndex = viewRowIdx;
    } else if (isMoveDown) {
      helperViewIndex = viewRowIdx + 1;
    }

    helperViewIndex = Math.max(0, Math.min(helperViewIndex, cfg.scroll.insideViewRow));

    isTicking = false;

    const helperTop = helperViewIndex * rowHeight;

    rowMoveElement.style.transform = `translate(${mouseMovePosition.x}px, ${mouseMovePosition.y}px)`;

    const currentDropRowIdx = scroll.startIdx + helperViewIndex;

    console.log("viewRowIdx : ", viewRowIdx, "isMoveUp : ", isMoveUp, "isMoveDown : ", isMoveDown, "currentDropRowIdx : ", currentDropRowIdx);

    if (dropRowIdx !== currentDropRowIdx) {
      rowMoveDropHelperElement.style.transform = `translateY(${helperTop}px)`;
      dropRowIdx = currentDropRowIdx;
      isDropForbidden = false;

      if (moveRowItem.rowIndex === currentDropRowIdx || moveRowItem.rowIndex === currentDropRowIdx - 1) {
        isDropForbidden = true;
        rowMoveDropHelperElement.style.display = "none";
        return;
      } else {
        rowMoveDropHelperElement.style.display = "block";
      }

      if (dragOver?.({ moveItems: moveRowItem, dropItemIdx: currentDropRowIdx }) === false) {
        isDropForbidden = true;
        rowMoveDropHelperElement.classList.add("dg-drop-forbidden");
      } else {
        rowMoveDropHelperElement.classList.remove("dg-drop-forbidden");
      }
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
    const cellInfo = session.cellInfo!;
    const field = cellInfo.field;

    if (this.opts.body.cellDblClick) {
      if (this.opts.body.cellDblClick(cellInfo) === false) return;
    }

    if ((field.editable === true || (this.editable === true && field.editable !== false)) && !field.$renderer.isEditRenderer()) {
      field.$editRenderer.render(cellInfo, session.cellEl!);
    }
  }
}
