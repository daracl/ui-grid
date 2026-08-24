import { Selection } from '@t/GridConfig';

import { parseClipboard } from '@/util/gridUtils';

import { DaraElement } from '@/element/DaraElement';
import { EventHandler } from '@/event/EventHandler';
import { SelectionInfo } from '@/selection/selection';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ViewItem } from '@/types/Common';

/**
 * paste event class
 */
export class PasteEvent implements EventHandler {
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private pasteElement: DaraElement;

  constructor(gridMain: GridMain, selectionInfo: SelectionInfo) {
    this.gridMain = gridMain;
    this.selectionInfo = selectionInfo;
  }

  /**
   * init paste event
   */
  public init() {
    this.pasteElement = new DaraElement(this.gridMain.element().find('.dg-paste-area'));

    const cfg = this.gridMain.config();
    const opts = this.gridMain.options();

    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = isFunction(pasteBeforeFn);

    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = isFunction(pasteAfterFn);

    const pasteElement = this.pasteElement.getElement();

    cfg.eventManager.on(
      {
        el: pasteElement,
        type: 'paste',
      },
      (event: ClipboardEvent) => {
        this.gridMain.setGridFocusIn();

        const clipboardData = event.clipboardData;

        if (!clipboardData) {
          throw new Error('paste clipboard not found');
        }

        let pastedText = clipboardData.getData('text');

        if (pasteBeforeFnFlag) {
          pastedText = pasteBeforeFn(pastedText);
        }

        if (!pastedText) {
          return;
        }

        const parsed = parseClipboard(pastedText);

        const startCellInfo = cfg.selection.startCell;

        const { currentFields, dataInfo, dataManager } = cfg;

        const startIdx = startCellInfo.startIdx;

        const startCol = startCellInfo.startCol;

        const headerItemsLength = currentFields.length;

        let itemLength = dataInfo.rowLength;

        let maxCol = startCol;

        let pasteResultItems: ViewItem[] = dataManager.getViewItems();

        /**
         * Paste 전체를 하나의 History 단위로 처리합니다.
         *
         * beginHistory 시점:
         *   beforeSelection 저장
         */
        dataManager.beginHistory();

        try {
          // ----------------------------------------------------------
          // row 부족하면 추가
          //
          // createItem() -> addItems()에서
          // add History가 기록되어야 합니다.
          // ----------------------------------------------------------
          if (startIdx + parsed.length > itemLength) {
            const addCount = startIdx + parsed.length - itemLength;

            for (let i = 0; i < addCount; i++) {
              dataManager.createItem({});
            }

            pasteResultItems = dataManager.getViewItems();

            itemLength = pasteResultItems.length;
          }

          // ----------------------------------------------------------
          // 데이터 적용
          // ----------------------------------------------------------
          for (let i = 0; i < parsed.length; i++) {
            const rowIdx = startIdx + i;

            if (rowIdx >= itemLength) {
              break;
            }

            const viewItem = pasteResultItems[rowIdx];

            const row = parsed[i];

            const rowItem = dataManager.getRowItem(viewItem.id);

            if (!rowItem) {
              continue;
            }

            for (let j = 0; j < row.length; j++) {
              const colIdx = startCol + j;

              if (colIdx >= headerItemsLength) {
                continue;
              }

              maxCol = Math.max(maxCol, colIdx);

              let value = row[j];

              // "" → " 복원
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
              }

              // Excel 수식 방지
              if (/^=/.test(value)) {
                value = `'${value}`;
              }

              const field = currentFields[colIdx];

              const rendererResult = field.$editRenderer?.setValue(event, rowItem, value, false);

              if (rendererResult === false) {
                return false;
              }
            }
          }

          this.gridMain.refreshBody(false, 'paste');

          // ----------------------------------------------------------
          // Selection 갱신
          //
          // commitHistory()보다 먼저 실행해야
          // afterSelection으로 저장됩니다.
          // ----------------------------------------------------------
          this.selectionInfo.setSelectionRangeInfo(
            {
              range: {
                startIdx,
                endIdx: startIdx + parsed.length - 1,
                startCol,
                endCol: maxCol,
              },
              startCell: startCellInfo,
            } as Selection,
            true,
            false,
          );

          /**
           * commitHistory()
           *
           * beginHistory()에서 beforeSelection
           * commitHistory()에서 afterSelection
           * 이 저장됩니다.
           */
          dataManager.commitHistory();
        } catch (error) {
          dataManager.rollbackHistory();

          throw error;
        }

        this.gridMain.getBody().dataDraw('reDraw_paste');

        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      },
    );
  }
}
