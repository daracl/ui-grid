import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { BodyCellStyleMap, ROW_FIELD } from '@/constants';
import { removeClass, resolveClassName } from '@/util/styleUtils';
import { isFixedLeftPostion, isFixedRightPostion } from '@/util/gridUtils';

import { BodyContext } from './BodyContext';
import { BodyMatchInfo } from '@/types/Body';

const CELL_HIGHLIGHT_CLASS = 'dg-search-highlight';
const CELL_MATCH_CLASS = 'dg-search-match';

/**
 * Body Cell 관리
 *
 * Cell의 style, class, selection, search 상태를 관리
 */
export class BodyCell {
  /**
   * Body Cell 생성
   *
   * @param context Body Context
   */
  constructor(private readonly context: BodyContext) {}

  /** Center Element Style 설정 */
  public setCenterElementStyle(styleCss: any): void {
    this.context.centerElement.css(styleCss);
  }

  /** 시작 Cell Element 반환 */
  public getStartCellElement() {
    return this.context.bodyElement.find('.dg-cell.' + BodyCellStyleMap.START_CELL);
  }

  /**
   * Grid 영역 너비 설정
   *
   * @param leftWidth Left 영역 너비
   * @param centerWidth Center 영역 너비
   * @param rightWidth Right 영역 너비
   */
  public setGridPanelWidth(leftWidth: number, centerWidth: number, rightWidth: number): void {
    this.context.leftElement.css({ width: leftWidth + 'px' });

    this.context.centerElement.css({
      'margin-left': leftWidth + 'px',
      width: centerWidth + 'px',
    });

    this.context.rightElement.css({
      width: rightWidth + 'px',
    });
  }

  /**
   * Cell 동적 Class 설정
   *
   * 기존 동적 Class를 제거하고 새로운 Class를 적용
   *
   * @param cellEle Cell Element
   * @param rowIdx View Row Index
   * @param col Column Index
   * @param field Field 정보
   * @param item Row 데이터
   */
  public setCellClassName(cellEle: HTMLElement, rowIdx: number, col: number, field: FieldItem, item: any): void {
    if (!field.cellClassName) return;

    const prevClasses = this.context.cellClassNameCache.get(cellEle);

    if (prevClasses?.length) {
      cellEle.classList.remove(...prevClasses);
    }

    const newClasses = resolveClassName(field.cellClassName, {
      rowIdx,
      col,
      field,
      item,
    });

    if (newClasses.length > 0) {
      cellEle.classList.add(...newClasses);
      this.context.cellClassNameCache.set(cellEle, newClasses);
    } else {
      this.context.cellClassNameCache.delete(cellEle);
    }
  }

  /**
   * Cell Style 및 상태 갱신
   *
   * Cell 높이, 동적 Class, Search, Selection 상태를 갱신
   *
   * @param startCellInfo Selection 시작 Cell 정보
   * @param rowIdx View Row Index
   * @param col Column Index
   * @param cellElement Cell Element
   * @param field Field 정보
   * @param item Row 데이터
   * @param matchInfo Search Match 정보
   */
  public setCellStyle(
    startCellInfo: any,
    rowIdx: number,
    col: number,
    cellElement: HTMLElement,
    field: FieldItem,
    item: any,
    matchInfo: BodyMatchInfo,
  ): void {
    const contentEleStyle = (cellElement.firstElementChild as HTMLElement).style;
    const heightPixel = `${item[ROW_FIELD.HEIGHT] - 5}px`;

    contentEleStyle.maxHeight = heightPixel;
    // contentEleStyle.height = heightPixel;

    this.setCellClassName(cellElement, rowIdx, col, field, item);

    if (field.$isAside) return;

    if (matchInfo.searchEnable) {
      const classList = cellElement.classList;
      const matchedFields = matchInfo.searchMatchedFields ?? [];

      if (matchedFields.length > 0) {
        const fieldName = field.name;

        const isMatch = matchInfo.matchViewItem?.isCurrentMatch && matchedFields[matchInfo.cellIndex] === fieldName;

        if (isMatch) {
          classList.add(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
        } else {
          const highlightFlag = matchedFields.includes(fieldName);

          classList.remove(CELL_MATCH_CLASS);
          classList.toggle(CELL_HIGHLIGHT_CLASS, highlightFlag);
        }
      } else {
        classList.remove(CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
      }
    }

    this.context.selectionInfo.updateCellSelectionClass(
      cellElement,
      rowIdx,
      col,
      startCellInfo.startIdx,
      startCellInfo.startCol,
    );
  }

  /** Search Highlight 제거 */
  public clearSearchHighlight(): void {
    const bodyElement = this.context.bodyElement;

    removeClass(bodyElement.finds('.dg-cell.' + CELL_HIGHLIGHT_CLASS), CELL_HIGHLIGHT_CLASS, CELL_MATCH_CLASS);
  }

  /**
   * 수정된 Cell 다시 렌더링
   *
   * @param cell 수정된 Cell 정보
   */
  public refreshEditedCell(cell: CellInfo): void {
    const cfg = this.context.gridMain.config();

    let fieldMapElement = this.context.allCellElements.center;

    if (isFixedLeftPostion(cfg, cell.c)) {
      fieldMapElement = this.context.allCellElements.left;
    } else if (isFixedRightPostion(cfg, cell.c)) {
      fieldMapElement = this.context.allCellElements.right;
    }

    const cellEle = fieldMapElement[cell.r][cell.c];

    this.setCellClassName(cellEle, cell.rowIndex, cell.c, cell.field, cell.item);

    cell.field.$renderer.render(cell, cellEle.firstElementChild as HTMLElement);
  }

  /** Cell 상태 정리 */
  public destroy(): void {
    this.context.cellClassNameCache = new WeakMap<HTMLElement, string[]>();
  }
}
