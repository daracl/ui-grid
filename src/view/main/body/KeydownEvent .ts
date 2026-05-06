import { ScrollInfo } from '@t/GridConfig';

import { getCellInfo, isFixedLeftPostion, isFixedRightPostion, isInputField } from '@/util/gridUtils';

import { DaraElement } from '@/element/DaraElement';
import { EventHandler } from '@/event/EventHandler';
import { SelectionInfo } from '@/selection/selection';
import { eventKeyCode, isCtrlKey, isSpacebar, stopPreventCancel } from '@/util/eventUtils';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Body } from './Body';

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
    const editable = opts.editable;
    const selectionMode = opts.selectionMode;
    // window keydown 처리.  tabindex 처리 확인 해볼것.

    const searchEnabled = opts.search.enabled;

    const pasteElement = this.pasteElement.getElement();
    const mainElement = this.gridMain.mainElement().getElement();

    cfg.eventManager.off(mainElement, 'keydown');

    cfg.eventManager.on({ el: mainElement, type: 'keydown' }, (e: KeyboardEvent) => {
      if (!cfg.focus) return;

      const targetElement = e.target as HTMLElement;

      if (isInputField(targetElement.tagName)) {
        return true;
      }

      // 설정 영역 keydown 처리
      if (targetElement.closest('.dg-setting-area')) return true;

      const evtKey = eventKeyCode(e);

      if (isSpacebar(e)) {
        stopPreventCancel(e);

        const startCell = cfg.selection.startCell;

        const field = cfg.currentFields[startCell.startCol];

        if (editable === true && field.editable !== false && field.$renderer.canEdit()) {
          // 스크롤 이동
          this.insideScrollCheck(evtKey, e, cfg.scroll, startCell.startIdx, startCell.startCol);

          const startElement = this.gridMain.getBody().getBodyElement().find('.dg-cell.dg-start-cell');

          const cellInfo = getCellInfo(cfg, startElement);

          field.$editRenderer.render(cellInfo, startElement);
          return;
        }

        return false;
      }

      if (e.metaKey || isCtrlKey(e)) {
        // copy

        if (evtKey == 67) {
          // ctrl+ c
          if (selectionMode == 'none') {
            return;
          }

          this.body.copyData();

          return;
        } else if (evtKey == 65) {
          // ctrl + a
          this.selectionInfo.setAllSelection(true);
          return false;
        } else if (evtKey == 86) {
          // ctrl + v
          pasteElement.focus();
          return true;
        } else if (evtKey == 70) {
          // ctrl+f
          stopPreventCancel(e);

          if (searchEnabled) {
            this.gridMain.getDataSearch().openSearch();
          }
          return true;
        }
      }

      if (opts.editable === true) {
        if ((65 <= evtKey && evtKey <= 90) || (48 <= evtKey && evtKey <= 57)) {
          // const clickInfo = _this.getCurrentClickInfo();
          // const cellInfo = _$util.getCellInfo(_this, _$util.getCellElement(_this, clickInfo.r, clickInfo.c));
          // _$renderer.editCell(_this, cellInfo, e);
          // return false;
        }
      }

      if ((32 < evtKey && evtKey < 41) || evtKey == 13 || evtKey == 9) {
        stopPreventCancel(e);
        this.selectionInfo.setAllSelection(false);
        this.arrowKeydownEvent(e, evtKey);
      }
    });
  }

  /**
   * 방향키 ctrl
   *
   * @private
   * @param {UIEvent} evt key event
   * @param {number} evtKey key code
   */
  private arrowKeydownEvent(evt: UIEvent, evtKey: number) {
    const cfg = this.gridMain.config();
    const scrollCtrl = this.gridMain.getScroll();

    const scrollInfo = cfg.scroll,
      dataInfo = cfg.dataInfo,
      startCell = cfg.selection.startCell;

    this.body.removeStartCellClass();

    const endIdx = startCell.startIdx,
      endCol = startCell.startCol;

    const insideViewRow = scrollInfo.insideViewRow - 1; // start idx 0 부터 시작 하기 때문에 하나 처리함;

    const gridStartCol = cfg.dataInfo.startCol;

    const isCtrl = isCtrlKey(evt);
    switch (evtKey) {
      case 34: // PageDown
      case 13: // enter
      case 40: {
        //down
        let moveRowIdx = 0;
        if (evtKey == 40 && isCtrl) {
          moveRowIdx = dataInfo.rowLength - 1;
        } else {
          moveRowIdx = endIdx + (evtKey == 34 ? insideViewRow : 1);
          moveRowIdx = moveRowIdx >= dataInfo.rowLength ? dataInfo.rowLength - 1 : moveRowIdx;
        }

        // 스크롤 밖에 있을때
        if (this.insideScrollCheck(evtKey, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx >= scrollInfo.startIdx + insideViewRow) {
          scrollCtrl.moveVerticalScroll({ direction: 'D', rowIdx: moveRowIdx - insideViewRow });
        }

        break;
      }
      case 33: //PageUp
      case 38: {
        //up
        let moveRowIdx = 0;
        if (evtKey == 38 && isCtrl) {
          moveRowIdx = 0;
        } else {
          moveRowIdx = endIdx - (evtKey == 33 ? insideViewRow : 1);
          moveRowIdx = Math.max(moveRowIdx, 0);
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, moveRowIdx, endCol)) {
          return;
        }

        if (moveRowIdx < scrollInfo.startIdx) {
          scrollCtrl.moveVerticalScroll({ direction: 'U', rowIdx: moveRowIdx });
        }

        break;
      }
      case 36: // Home
      case 37: {
        //left

        let moveCol = gridStartCol;
        if (evtKey == 37 && isCtrl) {
          moveCol = gridStartCol;
        } else {
          moveCol = evtKey == 36 ? gridStartCol : endCol - 1;
          moveCol = moveCol > gridStartCol ? moveCol : gridStartCol;
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, endIdx, moveCol)) {
          return;
        }

        if (!isFixedLeftPostion(cfg, moveCol) && moveCol < scrollInfo.insideStartCol) {
          scrollCtrl.moveHorizontalScroll({ direction: 'L', colIdx: moveCol });
        }

        break;
      }
      case 35: // End
      case 9: // tab
      case 39: {
        let moveCol;
        if (evtKey == 39 && isCtrl) {
          moveCol = dataInfo.colLength - 1;
        } else {
          moveCol = evtKey == 35 ? dataInfo.colLength - 1 : endCol + 1;
          moveCol = moveCol >= dataInfo.colLength ? dataInfo.colLength - 1 : moveCol;
        }

        if (this.insideScrollCheck(evtKey, evt, scrollInfo, endIdx, moveCol)) {
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
   * @type {function (ctx, evtKey, evt, endCol, scrollInfo, moveRowIdx, moveColIdx)}
   */
  private insideScrollCheck(
    evtKey: number,
    evt: UIEvent,
    scrollInfo: ScrollInfo,
    moveRowIdx: number,
    moveColIdx: number,
  ) {
    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    if (
      isFunction(opts.body.keyNavHandler) &&
      opts.body.keyNavHandler(evt, {
        key: evtKey,
        moveCol: moveColIdx,
        moveRow: moveRowIdx,
        item: cfg.dataManager.getViewItems()[moveRowIdx],
      }) === false
    ) {
      return false;
    }

    this.selectionInfo.setRangeInfo(evtKey, evt, moveRowIdx, moveColIdx);

    let checkCode = -1;

    if (moveRowIdx < scrollInfo.startIdx) {
      // 'U'
      checkCode = 1;
    } else if (moveRowIdx > scrollInfo.startIdx + scrollInfo.viewRow) {
      // 'D'
      checkCode = 2;
    }

    if (!isFixedLeftPostion(cfg, moveColIdx) && !isFixedRightPostion(cfg, moveColIdx)) {
      if (moveColIdx < scrollInfo.insideStartCol) {
        // 'L'
        checkCode = Math.max(checkCode, 0) + 10;
      } else if (moveColIdx > scrollInfo.insideEndCol) {
        // 'R'
        checkCode = Math.max(checkCode, 0) + 20;
      }
    }

    if (checkCode > 0) {
      const horizontal = Math.floor(checkCode / 10);
      const vertical = checkCode % 10;

      const scrollCtrl = this.gridMain.getScroll();

      if (horizontal > 0) {
        scrollCtrl.moveHorizontalScroll({
          direction: horizontal == 1 ? 'L' : 'R',
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
