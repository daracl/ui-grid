import {
  HIDDEN_ELEMENT_SELECTOR,
  MovePosition,
  MovePositionMap,
  PointerStateMap,
  ROW_DRAG_HANDLE_NAME,
  ROW_FIELD,
} from '@/constants';
import { PointerContext } from '@/event/PointerContext';
import { PointerSession } from '@/event/PointerSession';
import { ViewItem } from '@/types/Common';
import { CellInfo, Selection, SelectionRange } from '@/types/GridConfig';
import { RowMoveOptions } from '@/types/GridOptions';
import { getElementRect } from '@/util/domUtils';
import { dragVerticalMovePosition, isCellSelectionMode, isRowSelectionMode, isSequential } from '@/util/gridUtils';
import { Language } from '@/util/Language';
import { BodyEvent } from './BodyEvent';
import { CellClickHandler } from './CellClickHandler';

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
  private readonly language: Language;

  private rowMoveElement: HTMLElement;

  private dropRowIdx = -1;
  private moveStartItem: CellInfo;

  private moveRowIndexs: number[] = [];
  private moveViewItems: any[] = [];

  private isDropForbidden = true;

  private isMoveRowSequential = false;

  private readonly isSelectionRowMode: boolean;

  public constructor(context: PointerContext, bodyEvent: BodyEvent) {
    super(context, bodyEvent);

    this.language = context.gridMain.i18n();

    this.rowMoveOptions = this.opts.body.rowMove as RowMoveOptions;

    this.isSelectionRowMode = isRowSelectionMode(this.selectionMode);

    this.rowMoveDropHelperElement = context.gridMain.element().findDaraElement('.dg-movedrop-helper').getElement();
    this.initTemplate();
  }

  initTemplate() {
    const rowMoveElement = document.createElement('div');
    rowMoveElement.className = 'dg-row-move-helper';
    rowMoveElement.style.cssText = `height: ${this.rowHeight}px; display: none;`;

    const statusElement = document.createElement('div');
    statusElement.className = 'dg-row-move-status dg-icon';
    rowMoveElement.appendChild(statusElement);

    const helperElement = document.createElement('div');
    helperElement.className = 'dg-row-move-content';

    rowMoveElement.appendChild(helperElement);

    document.querySelector(HIDDEN_ELEMENT_SELECTOR)?.appendChild(rowMoveElement);
    this.rowMoveElement = rowMoveElement;
  }

  canHandle(session: PointerSession) {
    const moveRowItem = session.cellInfo as CellInfo;
    const rowMoveOptions = this.rowMoveOptions;
    const fieldName = moveRowItem.field?.name;

    const dragHandle = rowMoveOptions?.dragHandle;

    if (
      dragHandle !== 'ALL' &&
      dragHandle !== fieldName &&
      !(rowMoveOptions?.enableDragHandle !== false && fieldName === ROW_DRAG_HANDLE_NAME)
    ) {
      return false;
    }
    this.moveRowIndexs.length = 0;
    this.moveViewItems.length = 0;
    this.dropRowIdx = -1;
    this.scrollDirectionX = null;
    this.scrollDirectionY = null;
    this.isDropForbidden = true;

    return true;
  }

  onClick(session: PointerSession): void {
    // click ignore
  }

  onActivate(session: PointerSession) {
    const cfg = this.cfg;
    const opts = this.opts;

    const moveStartItem = session.cellInfo as CellInfo;
    const rowMoveOptions = opts.body.rowMove;

    const allRange = this.cfg.selection.allRange;

    const moveRowIndexs: number[] = [];

    if (allRange.size > 0) {
      const col = moveStartItem.field.$colSeq;
      if (this.isSelectionRowMode) {
        const { colLength, startCol } = this.cfg.dataInfo;
        const lastCol = colLength - 1;
        for (const [key, range] of allRange) {
          const { minIdx, maxIdx } = range;
          if (range.minCol == startCol && lastCol == range.maxCol) {
            for (let idx = minIdx; idx <= maxIdx; idx++) {
              if (range.mode == 'remove') {
                const removeIdx = moveRowIndexs.indexOf(idx);

                if (removeIdx !== -1) {
                  moveRowIndexs.splice(removeIdx, 1);
                }
              } else {
                moveRowIndexs.push(idx);
              }
            }
          } else {
            moveRowIndexs.length = 0;
            break;
          }
        }
      } else if (col > -1) {
        for (const [key, range] of allRange) {
          const { minIdx, maxIdx } = range;
          let breakFlag = false;

          for (let idx = minIdx; idx <= maxIdx; idx++) {
            if (this.selectionInfo.isCellSelection(range, idx, col)) {
              if (range.mode == 'remove') {
                const removeIdx = moveRowIndexs.indexOf(idx);

                if (removeIdx !== -1) {
                  moveRowIndexs.splice(removeIdx, 1);
                }
              } else {
                moveRowIndexs.push(idx);
              }
            } else {
              breakFlag = true;
            }
          }
          if (breakFlag) {
            moveRowIndexs.length = 0;
            break;
          }
        }
      }
    }

    // 이동할 item 구하기
    const moveItems: any[] = [];

    if (moveRowIndexs.length > 0) {
      const viewItems = cfg.dataManager.getViewItems();
      if (moveRowIndexs.includes(moveStartItem.rowIndex)) {
        moveRowIndexs.sort((a, b) => a - b);
        for (const rowIdx of moveRowIndexs) {
          moveItems.push(cfg.dataManager.getRowItem(viewItems[rowIdx].id));
        }
      } else {
        moveRowIndexs.length = 0;
      }
    }

    if (moveRowIndexs.length < 1) {
      this.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, session.cellEl!);
      moveRowIndexs.push(moveStartItem.rowIndex);
      moveItems.push(moveStartItem.item);
    }

    if (rowMoveOptions?.dragStart?.({ moveItems: moveItems }) === false) {
      return false;
    }

    this.moveRowIndexs = moveRowIndexs;
    this.moveViewItems = moveItems;
    this.isMoveRowSequential = isSequential(moveRowIndexs);
    this.moveStartItem = moveStartItem;
    const position = getElementRect(this.context.gridMain.getBody().getBodyElement().getElement(), true);

    const { mainLeftWidth, mainInsideWidth, mainRightWidth, mainBodyHeight } = cfg.dimensions;

    this.gridBounds = {
      gridLeft: position.left,
      gridRight: position.left + cfg.dimensions.mainTotalWidth,
      mainLeft: position.left + mainLeftWidth,
      mainRight: position.left + mainInsideWidth - mainRightWidth,
      top: position.top,
      bottom: position.top + mainBodyHeight,
    };

    this.bodyPosition = position;

    const helperTemplate = rowMoveOptions?.dragTemplate?.({ moveItems: this.moveViewItems });
    const helperContent = this.rowMoveElement.querySelector('.dg-row-move-content') as HTMLElement;
    if (helperTemplate) {
      helperContent.innerHTML = helperTemplate;
    } else {
      helperContent.textContent = `${this.moveViewItems.length} ${this.language.getMessage('row')}`;
    }

    this.rowMoveElement.style.display = 'flex';
  }

  /** move 중 */
  onPointerMove(session: PointerSession) {
    if (session.state != PointerStateMap.DRAGGING) return;
    const cfg = this.cfg;
    const bounds = this.gridBounds;
    const { x, y } = session.currentPos;
    this.rowMoveElement.style.transform = `translate(${x}px, ${y}px)`;
    const rowMoveDropHelperElement = this.rowMoveDropHelperElement;

    if (x < bounds.gridLeft - 3 || x > bounds.gridRight + 3 || y < bounds.top - 30 || y > bounds.bottom + 30) {
      this.stopAutoScroll();
      this.preventDrop();

      return;
    }

    const rowHeight = this.rowHeight;

    const verticalMovePosition = dragVerticalMovePosition(
      cfg,
      y,
      rowHeight,
      this.startCellInfo,
      bounds.top,
      bounds.bottom,
    );

    this.scrollDirectionY = verticalMovePosition.scrollDirectionY;

    if (this.scrollDirectionY && this.dragAnimationId === 0) {
      this.startAutoScroll(false);
    }

    const viewRowIdx = verticalMovePosition.viewRowIdx;

    const moveViewRowY = y - this.bodyPosition.top;

    const offsetInRow = moveViewRowY - viewRowIdx * rowHeight;

    const isMoveUp = offsetInRow < rowHeight / this.ROW_DRAG_RATIO; // 상단 체크
    const isMoveDown = rowHeight - offsetInRow < rowHeight / this.ROW_DRAG_RATIO; // 하단 체크

    let helperViewIndex = this.dropRowIdx === -1 ? viewRowIdx : verticalMovePosition.rowIdx - cfg.scroll.startIdx;

    if (isMoveUp) {
      helperViewIndex = viewRowIdx;
    } else if (isMoveDown) {
      helperViewIndex = viewRowIdx + 1;
    }

    helperViewIndex = Math.max(0, Math.min(helperViewIndex, cfg.scroll.insideViewRow));

    const currentDropRowIdx = cfg.scroll.startIdx + helperViewIndex;

    if (this.dropRowIdx === currentDropRowIdx) {
      return;
    }

    const classlist = this.rowMoveElement.querySelector('.dg-row-move-status')!.classList;
    classlist.remove('dg-fail');
    classlist.add('dg-success');

    this.isDropForbidden = false;
    const moveRowIndexs = this.moveRowIndexs;
    if (this.isMoveRowSequential) {
      if (
        moveRowIndexs.includes(currentDropRowIdx) ||
        (moveRowIndexs[moveRowIndexs.length - 1] < currentDropRowIdx && moveRowIndexs.includes(currentDropRowIdx - 1))
      ) {
        this.preventDrop();
        return;
      }
    }

    this.dropRowIdx = currentDropRowIdx;
    rowMoveDropHelperElement.style.transform = `translateY(${helperViewIndex * rowHeight}px)`;
    rowMoveDropHelperElement.style.display = 'block';

    const moveStartItem = this.moveStartItem;

    let position: MovePosition = MovePositionMap.BEFORE;
    let dropItemIdx = currentDropRowIdx;
    if (moveStartItem.rowIndex < currentDropRowIdx) {
      position = MovePositionMap.AFTER;
      dropItemIdx = currentDropRowIdx - 1;
    }

    if (
      this.rowMoveOptions.dragOver?.({
        moveItems: this.moveViewItems,
        dropItemIdx: dropItemIdx,
        position: position,
      }) === false
    ) {
      this.preventDrop();
    }
  }

  /**
   * drop 금지 시, 드롭 위치에 X 표시, 허용 시 O 표시
   */
  preventDrop() {
    const classlist = this.rowMoveElement.querySelector('.dg-row-move-status')!.classList;
    classlist.remove('dg-success');
    classlist.add('dg-fail');
    this.isDropForbidden = true;
    this.rowMoveDropHelperElement.style.display = 'none';
  }

  onPointerUp(session: PointerSession) {
    this.stopAutoScroll();
    let dropRowIdx = this.dropRowIdx;

    this.rowMoveDropHelperElement.style.display = 'none';
    this.rowMoveElement.style.display = 'none';

    if (this.isDropForbidden || dropRowIdx === -1) {
      if (!this.cfg.isBodyDragging && session.clickManager.getClickCount() === 1) {
        this.setCellClick(session.event, this.startCellInfo, this.multipleFlag, this.selectionMode, session.cellEl!);
      }
      return;
    }

    const cfg = this.cfg;
    const rowMoveOptions = this.rowMoveOptions;
    const moveItems = this.moveViewItems;
    const moveStartItem = this.moveStartItem;

    let position: MovePosition = MovePositionMap.BEFORE;

    if (moveStartItem.rowIndex < dropRowIdx) {
      position = MovePositionMap.AFTER;
    }

    if (
      rowMoveOptions?.drop?.({
        moveItems: moveItems,
        dropItemIdx: position == MovePositionMap.AFTER ? dropRowIdx - 1 : dropRowIdx,
        position: position,
      }) === false
    ) {
      return;
    }

    const moveRowIndexs = this.moveRowIndexs;

    const ids = cfg.dataManager.getViewItems();

    for (let idx = moveRowIndexs.length - 1; idx >= 0; idx--) {
      const rowIndex = moveRowIndexs[idx];

      if (dropRowIdx > rowIndex) {
        --dropRowIdx;
      }

      ids.splice(rowIndex, 1);
    }

    const moveViewItems: ViewItem[] = this.moveViewItems.map((item) => ({ id: item[ROW_FIELD.ID] } as ViewItem));

    ids.splice(dropRowIdx, 0, ...moveViewItems);

    cfg.dataManager.setViewItems(ids);

    let startCol = cfg.dataInfo.startCol;
    let endCol = cfg.dataInfo.colLength - 1;
    if (isCellSelectionMode(this.selectionMode)) {
      startCol = cfg.selection.range.startCol;
      endCol = startCol;
    }

    const moveRange: any = {
      startIdx: dropRowIdx,
      startCol: startCol,
      endCol: endCol,
      endIdx: dropRowIdx + moveRowIndexs.length - 1,
    };

    this.selectionInfo.setSelectionRangeInfo(
      {
        range: moveRange as SelectionRange,
      } as Selection,
      true,
      true,
    );

    this.context.gridMain.getBody().dataDraw('dragmove_redraw');
    rowMoveOptions?.dragEnd?.({ moveItems: moveItems, dropItemIdx: dropRowIdx, position: position });
  }
}
