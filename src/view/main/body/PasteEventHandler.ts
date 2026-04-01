import { Selection } from '@t/GridConfig';

import { createNewItems } from '@/util/gridUtils';
import { DaraGrid } from '@/DaraGrid';

import { GridMain } from '@/view/GridMain';
import { DaraElement } from '@/element/DaraElement';
import { eventOn } from '@/util/eventUtils';
import { SelectionInfo } from '@/selection/selection';
import { EventHandler } from '@/event/EventHandler';
import { isFunction } from '@/util/utils';

/**
 * paste event class
 *
 * @class PasteEvent
 * @typedef {PasteEvent}
 */
export class PasteEvent implements EventHandler {
  private readonly grid: DaraGrid;
  private readonly gridMain: GridMain;
  private readonly selectionInfo: SelectionInfo;

  private pasteElement: DaraElement;

  constructor(grid: DaraGrid, gridMain: GridMain, selectionInfo: SelectionInfo) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.selectionInfo = selectionInfo;
  }

  /**
   * init paste event
   *
   * @private
   */
  public init() {
    this.pasteElement = new DaraElement(this.grid.element().find('.dg-paste-area'));
    const cfg = this.grid.config();
    const opts = this.grid.getOptions();
    const pasteBeforeFn = opts.body.pasteBefore;
    const pasteBeforeFnFlag = isFunction(pasteBeforeFn);

    const pasteAfterFn = opts.body.pasteAfter;
    const pasteAfterFnFlag = isFunction(pasteAfterFn);

    const pasteElement = this.pasteElement.getElement();

    eventOn(pasteElement, 'paste', (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData; // ClipboardEvent에서 clipboardData 가져오기

      if (!clipboardData) {
        throw new Error('paste clipboard not found');
      }

      let pastedText = clipboardData.getData('text');

      if (pasteBeforeFnFlag) {
        pastedText = pasteBeforeFn(pastedText);
      }

      if (pastedText != '') {
        const contentArr = pastedText.split(/\r\n|\r|\n/);

        const startCellInfo = cfg.selection.startCell;

        const { currentFields, items } = cfg;

        const startIdx = startCellInfo.startIdx,
          startCol = startCellInfo.startCol,
          headerItemsLength = currentFields.length;

        let itemLength = items.length;

        let maxCol = 0;
        const iLen = contentArr.length;
        let pasteResultItems: any[] = items;
        if (startCellInfo.startIdx + iLen > itemLength) {
          // 붙여 넣기 데이터가 더 많으면 추가 row 생성.
          pasteResultItems = pasteResultItems.concat(
            createNewItems(currentFields, startCellInfo.startIdx + iLen - itemLength),
          );
          itemLength = pasteResultItems.length;
        }

        for (let i = 0; i < iLen; i++) {
          const addCont = contentArr[i];

          const addRowIdx = startIdx + i;

          if (addRowIdx >= itemLength) {
            break;
          }

          const rowItem = pasteResultItems[addRowIdx];

          const addContArr = addCont.split(/\t/);
          const jLen = addContArr.length;

          for (let j = 0; j < jLen; j++) {
            const addColIdx = startCol + j;

            if (addColIdx < headerItemsLength) {
              maxCol = Math.max(maxCol, addColIdx);

              if (currentFields[addColIdx].$editRenderer.setValue(event, rowItem, addContArr[j]) === false) {
                return;
              }

              rowItem[currentFields[addColIdx].name] = addContArr[j];
            }
          }
        }

        this.gridMain.setViewDataInfo(pasteResultItems);

        this.selectionInfo.setSelectionRangeInfo(
          {
            range: {
              startIdx: startCellInfo.startIdx,
              endIdx: startCellInfo.startIdx + iLen - 1,
              startCol: startCellInfo.startCol,
              endCol: maxCol,
            },
            startCell: startCellInfo,
          } as Selection,
          true,
          false,
        );

        this.gridMain.getBody().dataDraw('reDraw_paste');

        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      }
    });
  }
}
