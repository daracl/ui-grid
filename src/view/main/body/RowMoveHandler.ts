import { PointerContext } from "@/event/PointerContext";
import { PointerSession } from "@/event/PointerSession";
import { SelectionRange, Selection, CellInfo } from "@/types/GridConfig";
import { getElementRect } from "@/util/domUtils";
import { dragVerticalMovePosition } from "@/util/gridUtils";
import { BodyEvent } from "./BodyEvent";
import * as utils from "@/util/utils";
import { HIDDEN_ELEMENT_SELECTOR, MovePosition, POINTER_STATE, ROW_DRAG_HANDLE_NAME } from "@/constants";
import { CellClickHandler } from "./CellClickHandler";
import { moveItem } from "../../../util/gridUtils";
import { RowMoveOptions } from "@/types/GridOptions";

/**
 * RowMoveHandler class
 *
 * @class RowMoveHandler
 * @typedef {RowMoveHandler}
 */
export class RowMoveHandler extends CellClickHandler {
  priority = 10;

  private readonly ROW_DRAG_RATIO = 2;

  private readonly rowMoveOptions: RowMoveOptions;
  private readonly rowMoveDropHelperElement: HTMLElement;
  private rowMoveElement: HTMLElement;

  private dropRowIdx: number = -1;
  private moveStartItem: CellInfo;

  private moveItems: CellInfo[];

  private isDropForbidden: boolean = true;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    super(context, bodyEvent);

    this.rowMoveOptions = this.opts.body.rowMove!;

    this.rowMoveDropHelperElement = context.grid.element().findDaraElement(".dg-movedrop-helper").getElement();
    this.initTemplate();
  }

  initTemplate() {
    const rowMoveElement = document.createElement("div");
    rowMoveElement.className = "dg-row-move-helper";
    rowMoveElement.style.cssText = `height: ${this.rowHeight}px; display: none;`;

    document.querySelector(HIDDEN_ELEMENT_SELECTOR)?.appendChild(rowMoveElement);
    this.rowMoveElement = rowMoveElement;
  }

  canHandle(session: PointerSession) {
    const moveRowItem = session.cellInfo!;
    const rowMoveOptions = this.rowMoveOptions;
    const fieldName = moveRowItem.field?.name;

    const dragHandle = rowMoveOptions?.dragHandle;

    if (dragHandle !== "ALL" && dragHandle !== fieldName && !(rowMoveOptions?.enableDragHandle !== false && fieldName === ROW_DRAG_HANDLE_NAME)) {
      return false;
    }

    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
    this.isDropForbidden = true;

    return true;
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;
    const opts = this.opts;

    const moveStartItem = session.cellInfo!;
    const rowMoveOptions = opts.body.rowMove;
    this.moveItems = [session.cellInfo!];

    //TODO 다중 이동 처리할 것.
    // ctrl 또는 multi 일경우.
    // drag 영역 ctrl+ click 해서 찍었을때  drag시 drag될 수 있게 처리할것.
    // drag handle 처리할것.
    //
    //
    //

    if (rowMoveOptions?.dragStart?.({ moveItems: this.moveItems }) === false) {
      return false;
    }
    this.moveStartItem = moveStartItem;

    const position = getElementRect(this.context.gridMain.getBody().getBodyElement().getElement(), true);

    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;

    this.gridBounds = {
      left: position.left + mainLeftWidth,
      right: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight,
    };

    this.bodyPosition = position;

    const helperTemplate = rowMoveOptions?.dragTemplate?.({ moveItems: this.moveItems });

    if (helperTemplate) {
      this.rowMoveElement.innerHTML = helperTemplate;
    } else {
      this.rowMoveElement.textContent = `${this.moveItems.length} Row`;
    }
    this.rowMoveElement.style.display = "flex";
  }

  /** move 중 */
  onPointerMove(session: PointerSession) {
    if (session.state != POINTER_STATE.DRAGGING) return;
    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x, y } = session.currentPos;

    const rowHeight = this.rowHeight;

    const verticalMovePosition = dragVerticalMovePosition(cfg, y, rowHeight, this.startCellInfo, bounds.top, bounds.bottom);

    this.scrollDirectionY = verticalMovePosition.scrollDirectionY;

    if (this.scrollDirectionY && this.dragAnimationId === 0) {
      this.startAutoScroll(false);
    }

    const viewRowIdx = verticalMovePosition.viewRowIdx;

    const moveViewRowY = y - this.bodyPosition.top;

    const offsetInRow = moveViewRowY - viewRowIdx * rowHeight;

    // 위쪽 1/3, 아래쪽 2/3 기준
    let isMoveUp = offsetInRow < rowHeight / this.ROW_DRAG_RATIO; // 상단 1/3 안쪽
    let isMoveDown = rowHeight - offsetInRow < rowHeight / this.ROW_DRAG_RATIO; // 하단 2/3 밖

    let helperViewIndex = this.dropRowIdx === -1 ? viewRowIdx : verticalMovePosition.rowIdx - cfg.scroll.startIdx;

    if (isMoveUp) {
      helperViewIndex = viewRowIdx;
    } else if (isMoveDown) {
      helperViewIndex = viewRowIdx + 1;
    }

    helperViewIndex = Math.max(0, Math.min(helperViewIndex, cfg.scroll.insideViewRow));

    const helperTop = helperViewIndex * rowHeight;

    this.rowMoveElement.style.transform = `translate(${x}px, ${y}px)`;

    const currentDropRowIdx = cfg.scroll.startIdx + helperViewIndex;

    const moveStartItem = this.moveStartItem;

    const rowMoveDropHelperElement = this.rowMoveDropHelperElement;
    if (this.dropRowIdx !== currentDropRowIdx) {
      rowMoveDropHelperElement.style.transform = `translateY(${helperTop}px)`;
      this.dropRowIdx = currentDropRowIdx;
      this.isDropForbidden = false;

      if (moveStartItem.rowIndex === currentDropRowIdx || moveStartItem.rowIndex === currentDropRowIdx - 1) {
        this.isDropForbidden = true;
        rowMoveDropHelperElement.style.display = "none";
        return;
      } else {
        rowMoveDropHelperElement.style.display = "block";
      }

      let position = MovePosition.BEFORE;
      let dropItemIdx = currentDropRowIdx;
      if (moveStartItem.rowIndex < currentDropRowIdx) {
        position = MovePosition.AFTER;
        dropItemIdx = currentDropRowIdx - 1;
      }

      if (this.rowMoveOptions.dragOver?.({ moveItems: [moveStartItem], dropItemIdx: dropItemIdx, position: position }) === false) {
        this.isDropForbidden = true;
        rowMoveDropHelperElement.classList.add("dg-drop-forbidden");
      } else {
        rowMoveDropHelperElement.classList.remove("dg-drop-forbidden");
      }
    }
  }

  onPointerUp(session: PointerSession) {
    this.stopAutoScroll();

    this.rowMoveDropHelperElement.style.display = "none";
    this.rowMoveElement.style.display = "none";
    let dropRowIdx = this.dropRowIdx;

    if (this.isDropForbidden || dropRowIdx === -1) {
      return;
    }

    const cfg = this.cfg;
    const rowMoveOptions = this.rowMoveOptions;
    const moveItems = this.moveItems;
    const moveStartItem = this.moveStartItem;

    let position = MovePosition.BEFORE;

    if (moveStartItem.rowIndex < dropRowIdx) {
      position = MovePosition.AFTER;
      dropRowIdx = dropRowIdx - 1;
    }

    if (rowMoveOptions?.drop?.({ moveItems: moveItems, dropItemIdx: dropRowIdx, position: position }) === false) {
      return;
    }

    cfg.items = moveItem(cfg.items, moveStartItem.rowIndex, dropRowIdx);

    // /cfg.selection.maxIdx moveIdx
    this.selectionInfo.setStartCellRowIdx(dropRowIdx);
    const moveRange: any = { startIdx: dropRowIdx, endIdx: dropRowIdx };
    this.selectionInfo.setSelectionRangeInfo(
      {
        range: moveRange as SelectionRange,
      } as Selection,
      false,
      false
    );

    this.context.gridMain.getBody().dataDraw("dragmove_redraw");
    rowMoveOptions?.dragEnd?.({ moveItems: moveItems, dropItemIdx: dropRowIdx, position: position });
  }
}
