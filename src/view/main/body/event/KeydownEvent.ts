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

import { getCellRowSpanRange, RowSpanRange } from '@/util/rowSpanUtils';
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

/**
 * 병합 셀 좌우 이동 시 복귀할 기준 행(Excel 방식).
 * lastRow/lastCol은 마지막으로 이동한 셀이며, 현재 startCell과 다르면(마우스 클릭 등) 무효로 본다.
 */
interface NavAnchor {
  row: number;
  lastRow: number;
  lastCol: number;
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

  /**
   * 병합 셀 좌우 이동 기준 행.
   */
  private navAnchor: NavAnchor | null = null;

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
        this.navAnchor = null;

        // 병합 블록의 끝 행 기준으로 이동하고, 이동한 위치가 병합 블록이면 블록 시작 행으로 맞춘다.
        const currentEndIdx = this.getRowSpanRange(currentRowIdx, currentColIdx).end;
        const downRowIdx = this.getDownRowIndex(evtCode, isCtrl, currentEndIdx, insideViewRow, dataInfo.rowLength);
        const moveRowIdx = this.getRowSpanRange(downRowIdx, currentColIdx).start;

        // 화면 밖 행이거나 병합 블록이 화면 아래로 넘치면 insideScrollCheck에서 세로 스크롤을 예약한다.
        this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx, true);

        return;
      }

      //Up
      case 'PageUp':
      case 'ArrowUp': {
        this.navAnchor = null;

        // 병합 블록의 시작 행 기준으로 이동하고, 이동한 위치가 병합 블록이면 블록 시작 행으로 맞춘다.
        const currentStartIdx = this.getRowSpanRange(currentRowIdx, currentColIdx).start;
        const upRowIdx = this.getUpRowIndex(evtCode, isCtrl, currentStartIdx, insideViewRow);
        const moveRowIdx = this.getRowSpanRange(upRowIdx, currentColIdx).start;

        // 화면 밖 행이거나 병합 블록이 화면 아래로 넘치면 insideScrollCheck에서 세로 스크롤을 예약한다.
        this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, currentColIdx, true);

        return;
      }

      //Left
      case 'Home':
      case 'ArrowLeft': {
        const moveColIdx = this.getLeftColumnIndex(evtCode, isCtrl, currentColIdx, gridStartCol);
        const moveRowIdx = this.getHorizontalMoveRowIndex(currentRowIdx, currentColIdx, moveColIdx);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, moveColIdx)) {
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
        const moveRowIdx = this.getHorizontalMoveRowIndex(currentRowIdx, currentColIdx, moveColIdx);

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, moveColIdx)) {
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
   * 셀이 속한 병합 블록 범위(rowSpanFields 미사용·병합 컬럼이 아니면 자기 자신).
   */
  private getRowSpanRange(rowIdx: number, colIdx: number): RowSpanRange {
    const { rowSpanFields, groupingFields } = this.gridMain.options();

    if (!rowSpanFields?.length) {
      return { start: rowIdx, end: rowIdx };
    }

    return getCellRowSpanRange(this.gridMain.config(), rowSpanFields, rowIdx, colIdx, groupingFields);
  }

  /**
   * 좌우 이동 시 이동할 행 index.
   *
   * Excel처럼 병합 셀에 진입하기 전 행(anchor)을 기억했다가, 병합 셀을 벗어나면 그 행으로 복귀한다.
   * 이동 대상 컬럼이 병합 블록이면 블록 시작 행(실제 표시되는 셀)으로 맞춘다.
   */
  private getHorizontalMoveRowIndex(currentRowIdx: number, currentColIdx: number, moveColIdx: number): number {
    const anchor = this.navAnchor;
    let anchorRowIdx = currentRowIdx;

    if (anchor && anchor.lastRow === currentRowIdx && anchor.lastCol === currentColIdx) {
      const currentRange = this.getRowSpanRange(currentRowIdx, currentColIdx);

      if (currentRange.start <= anchor.row && anchor.row <= currentRange.end) {
        anchorRowIdx = anchor.row;
      }
    }

    const moveRowIdx = this.getRowSpanRange(anchorRowIdx, moveColIdx).start;

    this.navAnchor = { row: anchorRowIdx, lastRow: moveRowIdx, lastCol: moveColIdx };

    return moveRowIdx;
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
    revealRowSpan = false,
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

    const horizontal = checkCode > 0 ? Math.floor(checkCode / 10) : 0;

    const vertical = checkCode > 0 ? checkCode % 10 : 0;

    const scrollRowIdx = this.getVerticalScrollRowIndex(scrollInfo, vertical, moveRowIdx, moveColIdx, revealRowSpan);

    if (horizontal === 0 && scrollRowIdx < 0) {
      return false;
    }

    //Horizontal
    if (horizontal > 0) {
      const direction = horizontal === 1 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT;
      this.scheduleHorizontalScroll(moveColIdx, direction);
    }

    //Vertical
    if (scrollRowIdx >= 0) {
      const direction = scrollRowIdx < scrollInfo.startIdx ? ScrollDirectionYMap.UP : ScrollDirectionYMap.DOWN;

      this.scheduleVerticalScroll(scrollRowIdx, direction);
    }

    return true;
  }

  /**
   * 세로 스크롤 후 화면 첫 행이 될 row index(스크롤 불필요 시 -1).
   *
   * - 위쪽 화면 밖: 이동 행(병합 블록 시작)을 화면 맨 위에 맞춘다.
   * - 아래쪽 화면 밖, 또는 revealRowSpan이고 병합 블록이 화면 아래로 넘칠 때:
   *   블록(이동 행 ~ 블록 끝)이 온전히 보이는 행 수 안에 들어가면 블록 끝을 화면 맨 아래에,
   *   들어가지 않으면 이동 행을 화면 맨 위에 맞춘다. 병합이 아닌 셀은 블록 끝 = 이동 행이다.
   *
   * @param vertical getScrollDirectionCode의 세로 코드(0: 화면 안, 1: 위, 2: 아래)
   */
  private getVerticalScrollRowIndex(
    scrollInfo: ScrollInfo,
    vertical: number,
    moveRowIdx: number,
    moveColIdx: number,
    revealRowSpan: boolean,
  ): number {
    if (vertical === 1) {
      return moveRowIdx;
    }

    const visibleRows = Math.max(scrollInfo.insideViewRow, 1);
    const blockEndIdx = Math.max(this.getRowSpanRange(moveRowIdx, moveColIdx).end, moveRowIdx);
    const lastVisibleIdx = scrollInfo.startIdx + visibleRows - 1;

    if (vertical !== 2 && !(revealRowSpan && blockEndIdx > lastVisibleIdx)) {
      return -1;
    }

    if (blockEndIdx - moveRowIdx + 1 <= visibleRows) {
      return blockEndIdx - (visibleRows - 1);
    }

    return moveRowIdx;
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
    this.navAnchor = null;
  }
}
