import { ScrollInfo } from '@t/GridConfig';

import {
  getCellInfo,
  getScrollDirectionCode,
  isFieldEditable,
  isFixedLeftPostion,
  isFixedRightPostion,
  isMultipleSelectionMode,
} from '@/util/gridUtils';

import { ScrollDirectionX, ScrollDirectionXMap, ScrollDirectionY, ScrollDirectionYMap } from '@/constants';

import { DaraElement } from '@/element/DaraElement';
import { EventHandler } from '@/event/EventHandler';
import { SelectionInfo } from '@/selection/selection';

import { eventCodeValue, isCtrlKey, isEsc, isSpacebar, stopPreventCancel } from '@/util/eventUtils';

import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Body } from '../Body';

interface PendingVerticalScroll {
  rowIdx: number;
  direction: ScrollDirectionY;
}

interface PendingHorizontalScroll {
  colIdx: number;
  direction: ScrollDirectionX;
}

interface ScrollRequest {
  vertical?: PendingVerticalScroll;
  horizontal?: PendingHorizontalScroll;
}

/**
 * keydown event class
 *
 * Keyboard navigation + virtual scroll optimized implementation.
 */
export class KeydownEvent implements EventHandler {
  private readonly body: Body;
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private pasteElement: DaraElement;

  /**
   * 같은 frame에서 발생한 scroll 요청을 합친다.
   */
  private pendingScroll: ScrollRequest | null = null;

  /**
   * 실제 scroll 실행 예약 여부.
   *
   * RAF는 항상 하나만 유지한다.
   */
  private scrollRafId: number | null = null;

  constructor(gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;
  }

  /**
   * keydown event
   */
  public init() {
    this.pasteElement = new DaraElement(this.gridMain.element().find('.dg-paste-area'));

    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    const selectionMode = opts.selectionMode;
    const isMultiple = isMultipleSelectionMode(selectionMode);
    const searchEnabledd = opts.search.enabled;

    const pasteElement = this.pasteElement.getElement();
    const gridKeyInputElement = this.gridMain.getGridKeyInputElement();

    cfg.eventManager.off(gridKeyInputElement, 'keydown');

    cfg.eventManager.on(
      {
        el: gridKeyInputElement,
        type: 'keydown',
      },
      (e: KeyboardEvent) => {
        this.gridMain.hideLayer();

        if (isEsc(e)) {
          return;
        }

        const code = eventCodeValue(e);

        if (isCtrlKey(e)) {
          if (code === 'KeyC') {
            if (selectionMode === 'none') {
              return;
            }

            this.body.copyData();
            return;
          }

          if (code === 'KeyA') {
            if (isMultiple) {
              this.selectionInfo.setAllSelection(true);
            }

            return false;
          }

          if (code === 'KeyV') {
            pasteElement.focus();

            requestAnimationFrame(() => {
              this.gridMain.setGridFocusIn();
            });

            return true;
          }

          if (code === 'KeyF') {
            stopPreventCancel(e);

            if (searchEnabledd) {
              this.gridMain.getDataSearch().openSearch();
            }

            return true;
          }

          if (code === 'KeyZ') {
            stopPreventCancel(e);

            if (e.shiftKey) {
              cfg.dataManager.redo();
            } else {
              cfg.dataManager.undo();
            }

            return true;
          }

          if (code === 'KeyY') {
            stopPreventCancel(e);
            cfg.dataManager.redo();

            return true;
          }
        }

        //Navigation
        if (this.isNavigationKey(code)) {
          stopPreventCancel(e);

          this.selectionInfo.setAllSelection(false);

          this.arrowKeydownEvent(e, code);

          return;
        }

        const startCell = cfg.selection.startCell;
        const field = cfg.currentFields[startCell.startCol];

        if (!field) {
          return;
        }

        const isSpace = isSpacebar(e);

        //Space
        if (isSpace) {
          stopPreventCancel(e);

          if (field.renderer.type === 'tree') {
            const startElement = this.gridMain.getBody().getStartCellElement();

            const cellInfo = getCellInfo(cfg, startElement);

            if (field.$renderer.bindEvents('space', cellInfo, startElement)) {
              return true;
            }
          }
        }

        //Editable field input
        if (isFieldEditable(cfg, field) && (isSpace || code.startsWith('Key') || code.startsWith('Digit'))) {
          this.insideScrollCheck(code, e, cfg.scroll, startCell.startIdx, startCell.startCol);

          const startElement = this.gridMain.getBody().getStartCellElement();

          const cellInfo = getCellInfo(cfg, startElement);

          if (!isSpace) {
            cellInfo.inputValue = '';
          }

          field.$editRenderer.render(cellInfo, startElement);

          return;
        }
      },
    );
  }

  /**
   * navigation key 여부
   */
  private isNavigationKey(code: string): boolean {
    return (
      code.startsWith('Arrow') ||
      code === 'Home' ||
      code === 'End' ||
      code === 'PageUp' ||
      code === 'PageDown' ||
      code === 'Enter' ||
      code === 'Tab'
    );
  }

  /**
   * 방향키 navigation
   */
  private arrowKeydownEvent(evt: UIEvent, evtCode: string) {
    const cfg = this.gridMain.config();

    const scrollInfo = cfg.scroll;
    const dataInfo = cfg.dataInfo;
    const startCell = cfg.selection.startCell;

    this.selectionInfo.removeStartAnchorCell();

    const currentRowIdx = startCell.startIdx;
    const currentColIdx = startCell.startCol;

    const insideViewRow = Math.max(scrollInfo.insideViewRow - 1, 0);

    const gridStartCol = dataInfo.startCol;

    const isCtrl = isCtrlKey(evt);

    switch (evtCode) {
      //Down
      case 'PageDown':
      case 'Enter':
      case 'ArrowDown': {
        const moveRowIdx = this.getDownRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow, dataInfo.rowLength);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx)) {
          return;
        }

        // last row
        if (moveRowIdx >= scrollInfo.startIdx + insideViewRow) {
          this.scheduleVerticalScroll(moveRowIdx - insideViewRow, ScrollDirectionYMap.DOWN);
        }

        return;
      }

      //Up
      case 'PageUp':
      case 'ArrowUp': {
        const moveRowIdx = this.getUpRowIndex(evtCode, isCtrl, currentRowIdx, insideViewRow);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx)) {
          return;
        }

        if (moveRowIdx < scrollInfo.startIdx) {
          this.scheduleVerticalScroll(moveRowIdx, ScrollDirectionYMap.UP);
        }

        return;
      }

      //Left
      case 'Home':
      case 'ArrowLeft': {
        const moveColIdx = this.getLeftColumnIndex(evtCode, isCtrl, currentColIdx, gridStartCol);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, currentRowIdx, moveColIdx)) {
          return;
        }

        if (!isFixedLeftPostion(cfg, moveColIdx) && moveColIdx < scrollInfo.insideStartCol) {
          this.scheduleHorizontalScroll(moveColIdx, ScrollDirectionXMap.LEFT);
        }

        return;
      }

      //Right
      case 'End':
      case 'Tab':
      case 'ArrowRight': {
        const moveColIdx = this.getRightColumnIndex(evtCode, isCtrl, currentColIdx, dataInfo.colLength);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, currentRowIdx, moveColIdx)) {
          return;
        }

        if (!isFixedRightPostion(cfg, moveColIdx) && moveColIdx > scrollInfo.insideEndCol) {
          this.scheduleHorizontalScroll(moveColIdx, ScrollDirectionXMap.RIGHT);
        }

        return;
      }

      default:
        return;
    }
  }

  /**
   * Down row index
   */
  private getDownRowIndex(
    evtCode: string,
    isCtrl: boolean,
    currentRowIdx: number,
    insideViewRow: number,
    rowLength: number,
  ): number {
    if (evtCode === 'ArrowDown' && isCtrl) {
      return Math.max(rowLength - 1, 0);
    }

    const step = evtCode === 'PageDown' ? insideViewRow : 1;

    return Math.min(currentRowIdx + step, Math.max(rowLength - 1, 0));
  }

  /**
   * Up row index
   */
  private getUpRowIndex(evtCode: string, isCtrl: boolean, currentRowIdx: number, insideViewRow: number): number {
    if (evtCode === 'ArrowUp' && isCtrl) {
      return 0;
    }

    const step = evtCode === 'PageUp' ? insideViewRow : 1;

    return Math.max(currentRowIdx - step, 0);
  }

  /**
   * Left column index
   */
  private getLeftColumnIndex(evtCode: string, isCtrl: boolean, currentColIdx: number, gridStartCol: number): number {
    if (evtCode === 'ArrowLeft' && isCtrl) {
      return gridStartCol;
    }

    if (evtCode === 'Home') {
      return gridStartCol;
    }

    return Math.max(currentColIdx - 1, gridStartCol);
  }

  /**
   * Right column index
   */
  private getRightColumnIndex(evtCode: string, isCtrl: boolean, currentColIdx: number, colLength: number): number {
    const lastColIdx = Math.max(colLength - 1, 0);

    if (evtCode === 'ArrowRight' && isCtrl) {
      return lastColIdx;
    }

    if (evtCode === 'End') {
      return lastColIdx;
    }

    return Math.min(currentColIdx + 1, lastColIdx);
  }

  /**
   * 현재 이동 위치가 viewport 밖인지 확인
   */
  private insideScrollCheck(
    evtCode: string,
    evt: UIEvent,
    scrollInfo: ScrollInfo,
    moveRowIdx: number,
    moveColIdx: number,
  ): boolean {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    const keyNavHandler = opts.body.keyNavHandler;

    if (isFunction(keyNavHandler)) {
      const dataManager = cfg.dataManager;

      const viewItems = dataManager.getViewItems();

      const viewItem = viewItems[moveRowIdx];

      const item = viewItem ? dataManager.getRowItem(viewItem.id) : undefined;

      if (
        keyNavHandler({
          code: evtCode,
          moveCol: moveColIdx,
          moveRow: moveRowIdx,
          item,
          evt,
        }) === false
      ) {
        return true;
      }
    }

    this.selectionInfo.setRangeInfo(evtCode, evt, moveRowIdx, moveColIdx);

    //scroll 계산
    const checkCode = getScrollDirectionCode(cfg, scrollInfo, moveRowIdx, moveColIdx);

    if (checkCode <= 0) {
      return false;
    }

    const horizontal = Math.floor(checkCode / 10);

    const vertical = checkCode % 10;

    //Horizontal
    if (horizontal > 0) {
      const direction = horizontal === 1 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT;
      this.scheduleHorizontalScroll(moveColIdx, direction);
    }

    //Vertical
    if (vertical > 0) {
      const direction = vertical === 1 ? ScrollDirectionYMap.DOWN : ScrollDirectionYMap.UP;

      const rowIdx = moveRowIdx - (vertical === 1 ? 0 : Math.max(scrollInfo.insideViewRow - 1, 0));

      this.scheduleVerticalScroll(rowIdx, direction);
    }

    return true;
  }

  /**
   * Vertical scroll cache
   */
  private scheduleVerticalScroll(rowIdx: number, direction: ScrollDirectionY) {
    if (!this.pendingScroll) {
      this.pendingScroll = {};
    }

    this.pendingScroll.vertical = {
      rowIdx,
      direction,
    };

    // 마지막에서 처리
    if (this.pendingScroll.horizontal) {
      this.pendingScroll.horizontal = {
        ...this.pendingScroll.horizontal,
      };
    }

    this.scheduleScrollFrame();
  }

  /**
   * Horizontal scroll cache
   */
  private scheduleHorizontalScroll(colIdx: number, direction: ScrollDirectionX) {
    if (!this.pendingScroll) {
      this.pendingScroll = {};
    }

    this.pendingScroll.horizontal = {
      colIdx,
      direction,
    };

    this.scheduleScrollFrame();
  }

  /**
   * scroll 실행
   */
  private scheduleScrollFrame() {
    if (this.scrollRafId !== null) {
      return;
    }

    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;

      const pending = this.pendingScroll;

      this.pendingScroll = null;

      if (!pending) {
        return;
      }

      const scrollCtrl = this.gridMain.getScroll();
      const horizontal = pending.horizontal;
      const vertical = pending.vertical;

      if (horizontal) {
        scrollCtrl.moveHorizontalScroll({
          direction: horizontal.direction,
          colIdx: horizontal.colIdx,
          drawFlag: !vertical,
        });
      }

      if (vertical) {
        scrollCtrl.moveVerticalScroll({
          rowIdx: vertical.rowIdx,
          direction: vertical.direction,
        });
      }
    });
  }

  public destroy() {
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);

      this.scrollRafId = null;
    }

    this.pendingScroll = null;
  }
}
