import { CellInfo } from '@t/GridConfig';

import { BodyCellStyleMap } from '@/constants';

import { BodyCell } from './BodyCell';
import { BodyContext } from './BodyContext';
import { BodyTemplate } from './BodyTemplate';
import { BodyFieldGroup, BodyMatchInfo } from '@/types/Body';

/**
 * Body의 virtualized row / cell 렌더링을 담당합니다.
 */
export class BodyRenderer {
  constructor(
    private readonly context: BodyContext,
    private readonly cell: BodyCell,
    private readonly template: BodyTemplate,
  ) {}

  public dataDraw(mode?: string): void {
    const opts = this.context.gridMain.options();
    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();

    const leftFields = cfg.fieldHeaderGroup.leafLeft;
    const centerFields = cfg.fieldHeaderGroup.leafCenter;
    const rightFields = cfg.fieldHeaderGroup.leafRight;

    const fixedLeftIndex = cfg.fixedLeftIndex;
    const fixedRightIndex = cfg.fixedRightIndex;

    const enableLeftField = leftFields.length > 0;
    const enableRightField = rightFields.length > 0;

    const fieldGroups: BodyFieldGroup[] = [
      {
        name: 'left',
        fields: leftFields,
        element: this.context.leftElement,
        startCol: 0,
      },
      {
        name: 'center',
        fields: centerFields,
        element: this.context.centerElement,
        startCol: fixedLeftIndex,
      },
      {
        name: 'right',
        fields: rightFields,
        element: this.context.rightElement,
        startCol: fixedRightIndex,
      },
    ];

    const viewRow = cfg.scroll.viewRow;
    let startIdx = cfg.scroll.startIdx;

    const maxRow = cfg.dataInfo.rowLength - startIdx;
    let currentViewRow = Math.min(viewRow, maxRow);

    if (maxRow === 0 && cfg.dimensions.mainBodyHeight < cfg.rowHeight) {
      startIdx = cfg.dataInfo.rowLength - 1;

      this.context.gridMain.getScroll().moveVerticalScroll({
        rowIdx: startIdx,
        dragFlag: false,
      });

      currentViewRow = 1;
    }

    this.updateRowTemplates(fieldGroups, viewRow);

    this.context.bodyElement.setAttr({ 'data-view-mode': viewItems.length < 1 ? 'empty' : 'grid' });

    if (currentViewRow < 1) {
      return;
    }

    this.context.gridMain.hideLayer(mode);

    this.updateLastRowVisibility(fieldGroups, currentViewRow, viewRow);

    const bodyClassList = this.context.bodyElement.getElement().classList;

    if (startIdx % 2 === 0) {
      bodyClassList.remove('dg-body-odd');
      bodyClassList.add('dg-body-even');
    } else {
      bodyClassList.remove('dg-body-even');
      bodyClassList.add('dg-body-odd');
    }

    const startCell = cfg.selection.startCell;
    const startCol = cfg.scroll.startCol;
    const endCol = cfg.scroll.endCol;

    this.context.selectionInfo.removeStartAnchorCell();

    const pagingStartIdx = opts.footer.paging?.enabled ? (cfg.paging.currPage - 1) * cfg.paging.countPerPage : 0;

    const leafAllFields = cfg.currentFields;

    const leftElements = this.context.allCellElements.left;
    const centerElements = this.context.allCellElements.center;
    const rightElements = this.context.allCellElements.right;

    const searchEnable = cfg.searchEnable;
    const searchMatchInfo = cfg.searchMatchInfo;

    const matchInfo: BodyMatchInfo = {
      searchEnable,
      cellIndex: searchMatchInfo.cellIndex,
      matchViewItem: undefined,
      searchMatchedFields: undefined,
    };

    const rowCellInfo = {
      rowIndex: -1,
      r: -1,
      item: null,
      viewItem: undefined,
      c: -1,
    } as CellInfo;

    for (let i = 0; i < currentViewRow; i++) {
      const viewRowIdx = startIdx + i;
      const viewItem = viewItems[viewRowIdx];

      if (!viewItem) {
        break;
      }

      const item = dataManager.getRowItem(viewItem.id);
      const rowIdx = pagingStartIdx + viewRowIdx;

      matchInfo.matchViewItem = undefined;
      matchInfo.searchMatchedFields = undefined;

      if (searchEnable) {
        const matchViewItem = dataManager.getSearchMapItem(viewItem.id);

        matchInfo.matchViewItem = matchViewItem;
        matchInfo.searchMatchedFields = matchViewItem?.matchedFields?.map((f) => f.fieldName);
      }

      rowCellInfo.rowIndex = rowIdx;
      rowCellInfo.r = viewRowIdx;
      rowCellInfo.item = item;
      rowCellInfo.viewItem = viewItem;

      // left panel
      if (enableLeftField) {
        const rowCells = leftElements[i];

        for (let j = 0; j < leftFields.length; j++) {
          const field = leftFields[j];
          const cell = rowCells[j];

          rowCellInfo.c = j;

          this.cell.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);

          field.$renderer.render(rowCellInfo, cell.firstElementChild as HTMLElement);
        }
      }

      // center panel
      const rowCenterCells = centerElements[i];
      for (let j = startCol; j <= endCol; j++) {
        const field = leafAllFields[j];
        const cell = rowCenterCells[j];

        this.cell.setCellStyle(startCell, viewRowIdx, j, cell, field, item, matchInfo);
        rowCellInfo.c = j;
        field.$renderer.render(rowCellInfo, cell.firstElementChild as HTMLElement);
      }

      // right panel
      if (enableRightField) {
        const rowCells = rightElements[i];
        for (let j = 0; j < rightFields.length; j++) {
          const field = rightFields[j];
          const cellIdx = fixedRightIndex + j;
          const cell = rowCells[cellIdx];

          rowCellInfo.c = cellIdx;
          this.cell.setCellStyle(startCell, viewRowIdx, cellIdx, cell, field, item, matchInfo);
          field.$renderer.render(rowCellInfo, cell.firstElementChild as HTMLElement);
        }
      }
    }

    this.selectRowAnchorCell();
  }

  private updateRowTemplates(fieldGroups: BodyFieldGroup[], viewRow: number): void {
    const cfg = this.context.gridMain.config();
    const beforeViewRow = cfg.scroll.before.viewRow;

    if (beforeViewRow > 1 && beforeViewRow > viewRow) {
      for (let i = viewRow; i < beforeViewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }

          const rowEl = element.find(`.dg-row[data-row="${i}"]`);

          rowEl?.parentNode?.removeChild(rowEl);
        }
      }

      this.refreshCellElements(fieldGroups, viewRow);
      cfg.scroll.before.viewRow = viewRow;

      return;
    }

    if (beforeViewRow < viewRow) {
      const rowHeight = cfg.rowHeight;
      const addRowTemplateCount = viewRow - beforeViewRow;

      for (const { fields, element, startCol } of fieldGroups) {
        if (fields.length === 0) {
          continue;
        }

        element
          .find('.dg-body-table > tbody')
          .appendChild(this.template.rowTemplate(beforeViewRow, addRowTemplateCount, rowHeight, fields, startCol));
      }

      this.refreshCellElements(fieldGroups, viewRow);
      cfg.scroll.before.viewRow = viewRow;
    }
  }

  private updateLastRowVisibility(fieldGroups: BodyFieldGroup[], currentViewRow: number, viewRow: number): void {
    const cfg = this.context.gridMain.config();

    if (currentViewRow < viewRow) {
      const hideRowIdx = viewRow - 1;

      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }

          if (i === hideRowIdx) {
            element.find(`.dg-row[data-row="${hideRowIdx}"]`).style.display = 'none';

            continue;
          }

          const style = element.find(`.dg-row[data-row="${i}"]`).style;

          if (style.display === 'none') {
            style.removeProperty('display');
          }
        }
      }

      cfg.scroll.before.hideLastRow = true;
      return;
    }

    if (cfg.scroll.before.hideLastRow) {
      cfg.scroll.before.hideLastRow = false;

      for (let i = 0; i < viewRow; i++) {
        for (const { fields, element } of fieldGroups) {
          if (fields.length === 0) {
            continue;
          }

          const style = element.find(`.dg-row[data-row="${i}"]`).style;

          if (style.display) {
            style.removeProperty('display');
          }
        }
      }
    }
  }

  private refreshCellElements(fieldGroups: BodyFieldGroup[], viewRow: number): void {
    const allCellMap: Record<string, HTMLElement[][]> = {};

    for (const group of fieldGroups) {
      const { name, element } = group;

      if (group.fields.length === 0) {
        continue;
      }

      const cellElements: HTMLElement[][] = new Array(viewRow);

      for (let i = 0; i < viewRow; i++) {
        cellElements[i] = [];
      }

      const rows = element.getElement().querySelectorAll('.dg-body-table > tbody > .dg-row');

      for (let rowIndex = 0; rowIndex < viewRow; rowIndex++) {
        const row = rows[rowIndex];

        if (!row) {
          continue;
        }

        const cells = row.children;

        for (let colIndex = 0; colIndex < cells.length; colIndex++) {
          cellElements[rowIndex][group.startCol + colIndex] = cells[colIndex] as HTMLElement;
        }
      }

      allCellMap[name] = cellElements;
    }

    this.context.allCellElements = allCellMap;
  }

  public selectRowAnchorCell(): void {
    const cfg = this.context.gridMain.config();
    const leafLeft = cfg.fieldHeaderGroup.leafLeft;

    if (leafLeft && !leafLeft[0].$isAside) {
      return;
    }

    const leftElements = this.context.allCellElements.left;
    const startIdx = cfg.scroll.startIdx;
    const viewRow = cfg.scroll.viewRow;
    const selectionClass = BodyCellStyleMap.SELECTION;
    const isAll = this.context.selectionInfo.isAllSelect();

    if (!leftElements) {
      return;
    }

    if (isAll) {
      for (let i = 0; i < viewRow; i++) {
        leftElements[i][0]?.classList.add(selectionClass);
      }

      return;
    }

    const rowLine = this.context.selectionInfo.getRowLine();

    for (let i = 0; i < viewRow; i++) {
      leftElements[i][0]?.classList.toggle(selectionClass, rowLine.has(i + startIdx));
    }
  }

  public destroy(): void {
    this.context.allCellElements = {};
  }
}
