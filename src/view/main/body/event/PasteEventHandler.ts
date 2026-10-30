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
    const pasteBeforeFnFlag = isFunction<(text: string) => string>(pasteBeforeFn);

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

        // 유효하지 않은 값을 만나 붙여넣기를 중단했는지 여부와 마지막으로 처리한 행
        let aborted = false;
        let lastRowIdx = startIdx;
        let rowsAdded = false;

        /**
         * Paste 전체를 하나의 History 단위로 처리
         */
        dataManager.beginHistory();

        try {
          //row 부족하면 추가
          if (startIdx + parsed.length > itemLength) {
            const addCount = startIdx + parsed.length - itemLength;

            for (let i = 0; i < addCount; i++) {
              dataManager.createItem({});
            }

            pasteResultItems = dataManager.getViewItems();

            itemLength = pasteResultItems.length;
            rowsAdded = true;
          }

          //데이터 적용
          rows: for (let i = 0; i < parsed.length; i++) {
            const rowIdx = startIdx + i;

            if (rowIdx >= itemLength) {
              break;
            }

            lastRowIdx = rowIdx;

            const viewItem = pasteResultItems[rowIdx];
            if (viewItem.groupRowType) {
              continue;
            }

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

              // 유효성 검사 등으로 거부되면 거기서 중단한다. 이미 적용한 값은 유지하고 아래에서 이력을 정상 종료한다.
              if (rendererResult === false) {
                aborted = true;
                break rows;
              }
            }
          }

          // 행이 추가되면 화면에 보이는 행 수가 늘어나므로, 선택 영역을 갱신하기 전에 본문을 다시 그려 행 요소를 만든다.
          this.gridMain.refreshBody(rowsAdded, 'paste');

          this.selectionInfo.setSelectionRangeInfo(
            {
              range: {
                startIdx,
                endIdx: aborted ? lastRowIdx : startIdx + parsed.length - 1,
                startCol,
                endCol: maxCol,
              },
              startCell: startCellInfo,
            } as Selection,
            true,
            false,
          );

          dataManager.commitHistory();
        } catch (error) {
          dataManager.rollbackHistory();

          throw error;
        }

        this.gridMain.getBody().dataDraw('reDraw_paste');

        if (aborted) {
          return false;
        }

        if (pasteAfterFnFlag) {
          pasteAfterFn(pastedText);
        }
      },
    );
  }
}
