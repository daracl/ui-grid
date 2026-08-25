import { ScrollInfo } from '@t/GridConfig';

import {
  getCellInfo,
  getScrollDirectionCode,
  isFieldEditable,
  isFixedLeftPostion,
  isFixedRightPostion,
  isInputField,
  isMultipleSelectionMode,
} from '@/util/gridUtils';

import { ScrollDirectionXMap, ScrollDirectionYMap } from '@/constants';
import { DaraElement } from '@/element/DaraElement';
import { EventHandler } from '@/event/EventHandler';
import { SelectionInfo } from '@/selection/selection';
import { eventCodeValue, isCtrlKey, isEsc, isSpacebar, stopPreventCancel } from '@/util/eventUtils';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Body } from '../Body';

/**
 * keydown event class
 *
 * @class KeydownEvent
 * @typedef {KeydownEvent }
 */
export class KeydownEvent implements EventHandler {
  private readonly body: Body;
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private pasteElement: DaraElement;

  constructor(gridMain: GridMain, body: Body, selectionInfo: SelectionInfo) {
    this.gridMain = gridMain;
    this.body = body;
    this.selectionInfo = selectionInfo;
  }

  /**
   * keydown event
   *
   */
  public init() {
    this.pasteElement = new DaraElement(this.gridMain.element().find('.dg-paste-area'));
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();
    const selectionMode = opts.selectionMode;

    const isMultiple = isMultipleSelectionMode(selectionMode);

    const searchEnabled = opts.search.enabled;

    const pasteElement = this.pasteElement.getElement();
    const gridKeyInputElement = this.gridMain.getGridKeyInputElement();

    cfg.eventManager.off(gridKeyInputElement, 'keydown');

    cfg.eventManager.on({ el: gridKeyInputElement, type: 'keydown' }, (e: KeyboardEvent) => {
      const targetElement = e.target as HTMLElement;

      // console.log('22222222');

      // if (isInputField(targetElement.tagName)) {
      //   return true;
      // }

      this.gridMain.hideLayer();

      if (isEsc(e)) {
        return;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest('.dg-setting-area')) return true;

      const code = eventCodeValue(e);

      if (isCtrlKey(e)) {
        if (code === 'KeyC') {
          // ctrl + c
          if (selectionMode == 'none') {
            return;
          }

          this.body.copyData();

          return;
        } else if (code === 'KeyA') {
          // ctrl + a
          if (isMultiple) this.selectionInfo.setAllSelection(true);
          return false;
        } else if (code === 'KeyV') {
          // ctrl + v
          pasteElement.focus();

          requestAnimationFrame(() => {
            this.gridMain.setGridFocusIn();
          });
          return true;
        } else if (code === 'KeyF') {
          // ctrl + f
          stopPreventCancel(e);

          if (searchEnabled) {
            this.gridMain.getDataSearch().openSearch();
          }
          return true;
        } else if (code === 'KeyZ') {
          // ctrl + z (Undo / Redo)
          stopPreventCancel(e);
          if (e.shiftKey) {
            cfg.dataManager.redo();
          } else {
            cfg.dataManager.undo();
          }
          return true;
        } else if (code === 'KeyY') {
          // ctrl + y (Redo)
          stopPreventCancel(e);
          cfg.dataManager.redo();
          return true;
        }
      }

      const startCell = cfg.selection.startCell;
      const field = cfg.currentFields[startCell.startCol];
      const editable = isFieldEditable(cfg, field);
      const isSpace = isSpacebar(e);

      if (isSpace) {
        stopPreventCancel(e);

        if (field.renderer.type === 'tree') {
          const startElement = this.gridMain.getBody().getStartCellElement();
          const cellInfo = getCellInfo(cfg, startElement);
          if (field.$renderer.bindEvents('space', cellInfo, startElement)) return true;
        }
      }

      if (editable) {
        // 영문 알파벳(KeyA~KeyZ) 또는 숫자(Digit0~Digit9)
        if (isSpace || code.startsWith('Key') || code.startsWith('Digit')) {
          // 스크롤 이동
          this.insideScrollCheck(code, e, cfg.scroll, startCell.startIdx, startCell.startCol);
          const startElement = this.gridMain.getBody().getStartCellElement();
          const cellInfo = getCellInfo(cfg, startElement);

          if (!isSpace) {
            cellInfo.inputValue = '';
          }

          field.$editRenderer.render(cellInfo, startElement);

          return;
        }
      }

      // 방향키, Home, End, PageUp, PageDown, Enter, Tab
      const isNavigationOrActionKey =
        code.startsWith('Arrow') ||
        code === 'Home' ||
        code === 'End' ||
        code === 'PageUp' ||
        code === 'PageDown' ||
        code === 'Enter' ||
        code === 'Tab';

      if (isNavigationOrActionKey) {
        stopPreventCancel(e);
        this.selectionInfo.setAllSelection(false);
        this.arrowKeydownEvent(e, code);
      }
    });
  }

  /**
   * 방향키 ctrl
   *
   * @private
   * @param {UIEvent} evt key event
   * @param {number} evtCode key code
   */
  private arrowKeydownEvent(evt: UIEvent, evtCode: string) {
    const cfg = this.gridMain.config();
    const scrollCtrl = this.gridMain.getScroll();

    const scrollInfo = cfg.scroll,
      dataInfo = cfg.dataInfo,
      startCell = cfg.selection.startCell;

    this.selectionInfo.removeStartAnchorCell();

    const endIdx = startCell.startIdx,
      endCol = startCell.startCol;

    const insideViewRow = scrollInfo.insideViewRow - 1; // start idx 0 부터 시작 하기 때문에 하나 처리함;

    const gridStartCol = cfg.dataInfo.startCol;

    const isCtrl = isCtrlKey(evt);
    switch (evtCode) {
      case 'PageDown':
      case 'Enter':
      case 'ArrowDown': {
        // down
        let moveRowIdx = 0;
        if (evtCode === 'ArrowDown' && isCtrl) {
          moveRowIdx = dataInfo.rowLength - 1;
        } else {
          moveRowIdx = endIdx + (evtCode === 'PageDown' ? insideViewRow : 1);
          moveRowIdx = moveRowIdx >= dataInfo.rowLength ? dataInfo.rowLength - 1 : moveRowIdx;
        }

        // 스크롤 밖에 있을때
        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx >= scrollInfo.startIdx + insideViewRow) {
          scrollCtrl.moveVerticalScroll({ direction: 'D', rowIdx: moveRowIdx - insideViewRow });
        }

        break;
      }

      case 'PageUp':
      case 'ArrowUp': {
        // up
        let moveRowIdx = 0;
        if (evtCode === 'ArrowUp' && isCtrl) {
          moveRowIdx = 0;
        } else {
          moveRowIdx = endIdx - (evtCode === 'PageUp' ? insideViewRow : 1);
          moveRowIdx = Math.max(moveRowIdx, 0);
        }

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx < scrollInfo.startIdx) {
          scrollCtrl.moveVerticalScroll({ direction: ScrollDirectionYMap.UP, rowIdx: moveRowIdx });
        }

        break;
      }

      case 'Home':
      case 'ArrowLeft': {
        // left
        let moveCol = gridStartCol;
        if (evtCode === 'ArrowLeft' && isCtrl) {
          moveCol = gridStartCol;
        } else {
          moveCol = evtCode === 'Home' ? gridStartCol : endCol - 1;
          moveCol = Math.max(moveCol, gridStartCol);
        }

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, endIdx, moveCol)) {
          return;
        }

        if (!isFixedLeftPostion(cfg, moveCol) && moveCol < scrollInfo.insideStartCol) {
          scrollCtrl.moveHorizontalScroll({ direction: ScrollDirectionXMap.LEFT, colIdx: moveCol });
        }

        break;
      }

      case 'End':
      case 'Tab':
      case 'ArrowRight': {
        // right
        let moveCol;
        if (evtCode === 'ArrowRight' && isCtrl) {
          moveCol = dataInfo.colLength - 1;
        } else {
          moveCol = evtCode === 'End' ? dataInfo.colLength - 1 : endCol + 1;
          moveCol = moveCol >= dataInfo.colLength ? dataInfo.colLength - 1 : moveCol;
        }

        if (this.insideScrollCheck(evtCode, evt, scrollInfo, endIdx, moveCol)) {
          return;
        }

        if (!isFixedRightPostion(cfg, moveCol) && moveCol > scrollInfo.insideEndCol) {
          scrollCtrl.moveHorizontalScroll({ direction: 'R', colIdx: moveCol });
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * cursor scroll inside check
   *
   * @private
   * @type {function (evtKey, evt, endCol, scrollInfo, moveRowIdx, moveColIdx)}
   */
  private insideScrollCheck(
    evtCode: string,
    evt: UIEvent,
    scrollInfo: ScrollInfo,
    moveRowIdx: number,
    moveColIdx: number,
  ) {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    if (
      isFunction(opts.body.keyNavHandler) &&
      opts.body.keyNavHandler({
        code: evtCode,
        moveCol: moveColIdx,
        moveRow: moveRowIdx,
        item: cfg.dataManager.getRowItem(cfg.dataManager.getViewItems()[moveRowIdx]?.id),
        evt: evt,
      }) === false
    ) {
      return false;
    }

    this.selectionInfo.setRangeInfo(evtCode, evt, moveRowIdx, moveColIdx);

    const checkCode = getScrollDirectionCode(cfg, scrollInfo, moveRowIdx, moveColIdx);

    if (checkCode > 0) {
      const horizontal = Math.floor(checkCode / 10);
      const vertical = checkCode % 10;

      const scrollCtrl = this.gridMain.getScroll();

      if (horizontal > 0) {
        scrollCtrl.moveHorizontalScroll({
          direction: horizontal == 1 ? ScrollDirectionXMap.LEFT : ScrollDirectionXMap.RIGHT,
          colIdx: moveColIdx,
          drawFlag: vertical < 1,
        });
      }

      if (vertical > 0) {
        scrollCtrl.moveVerticalScroll({ rowIdx: moveRowIdx - (vertical == 1 ? 0 : scrollInfo.insideViewRow - 1) });
      }

      return true;
    }

    return false;
  }
}
