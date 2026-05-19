import { Selection } from '@t/GridConfig';

import { createNewItems, parseClipboard } from '@/util/gridUtils';

import { DaraElement } from '@/element/DaraElement';
import { EventHandler } from '@/event/EventHandler';
import { SelectionInfo } from '@/selection/selection';
import { isFunction } from '@/util/utils';
import { GridMain } from '@/view/GridMain';

/**
 * paste event class
 *
 * @class PasteEvent
 * @typedef {PasteEvent}
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
   *
   * @private
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

    cfg.eventManager.on({ el: pasteElement, type: 'paste' }, (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;

      if (!clipboardData) {
        throw new Error('paste clipboard not found');
      }

      let pastedText = clipboardData.getData('text');

      if (pasteBeforeFnFlag) {
        pastedText = pasteBeforeFn(pastedText);
      }

      if (!pastedText) return;

      // ✅ 핵심: CSV 안전 파싱
      const parsed = parseClipboard(pastedText);

      const startCellInfo = cfg.selection.startCell;
      const { currentFields, dataInfo } = cfg;

      const startIdx = startCellInfo.startIdx;
      const startCol = startCellInfo.startCol;
      const headerItemsLength = currentFields.length;

      let itemLength = dataInfo.rowLength;
      let maxCol = 0;

      let pasteResultItems: any[] = cfg.dataManager.getViewItems();

      // row 부족하면 추가
      if (startIdx + parsed.length > itemLength) {
        pasteResultItems = pasteResultItems.concat(
          createNewItems(currentFields, startIdx + parsed.length - itemLength),
        );
        itemLength = pasteResultItems.length;
      }

      // ✅ 데이터 적용
      for (let i = 0; i < parsed.length; i++) {
        const rowIdx = startIdx + i;
        if (rowIdx >= itemLength) break;

        const rowItem = pasteResultItems[rowIdx];
        const row = parsed[i];

        for (let j = 0; j < row.length; j++) {
          const colIdx = startCol + j;
          if (colIdx >= headerItemsLength) continue;

          maxCol = Math.max(maxCol, colIdx);

          let value = row[j];

          // "" → " 복원
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
          }

          // ✅ Excel 수식 방지
          if (/^=/.test(value)) {
            value = "'" + value;
          }

          const field = currentFields[colIdx];

          if (field.$editRenderer?.setValue(event, rowItem, value) === false) {
            return;
          }

          rowItem[field.name] = value;
        }
      }

      cfg.dataManager.setViewItems(pasteResultItems);
      this.gridMain.refreshBody(true, 'paste');

      // selection 갱신
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

      this.gridMain.getBody().dataDraw('reDraw_paste');

      if (pasteAfterFnFlag) {
        pasteAfterFn(pastedText);
      }
    });
  }
}
