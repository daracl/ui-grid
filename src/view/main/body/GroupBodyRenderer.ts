import { BodyCellStyleMap, LINE_NUMBER_NAME } from '@/constants';
import { ViewItem } from '@/types/Common';
import { CellInfo } from '@t/GridConfig';
import { BodyRenderer } from './BodyRenderer';

export class GroupBodyRenderer extends BodyRenderer {
  public dataDraw(mode?: string): void {
    this.drawData(mode, (viewItem, rowIndex) => this.renderGroupRow(viewItem, rowIndex));
    this.hideRepeatedGroupValues();
    this.applyRowSpans();
  }

  private hideRepeatedGroupValues(): void {
    const groupingFields = this.context.gridMain.options().groupingFields ?? [];
    if (groupingFields.length === 0) {
      return;
    }

    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();
    const startIdx = cfg.scroll.startIdx;
    const visibleRowCount = Math.min(cfg.scroll.viewRow, cfg.dataInfo.rowLength - startIdx);
    const fields = groupingFields.map((name) => cfg.currentFields.find((field) => field.name === name));
    let previousDataItem: any;

    for (let rowIndex = 0; rowIndex < visibleRowCount; rowIndex++) {
      const viewItem = viewItems[startIdx + rowIndex];
      if (!viewItem || viewItem.groupRowType) {
        continue;
      }

      for (const field of fields) {
        if (!field) {
          continue;
        }

        const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
          ? 'left'
          : cfg.fieldHeaderGroup.leafRight.includes(field)
            ? 'right'
            : 'center';
        this.context.allCellElements[region]?.[rowIndex]?.[field.$colSeq]?.classList.remove('dg-group-continuation');
      }

      const item = dataManager.getRowItem(viewItem.id);
      if (previousDataItem) {
        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
          const field = fields[fieldIndex];
          const sameGroup = fields
            .slice(0, fieldIndex + 1)
            .every((groupField) => groupField && Object.is(item[groupField.name], previousDataItem[groupField.name]));

          if (!field || !sameGroup) {
            continue;
          }

          const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
            ? 'left'
            : cfg.fieldHeaderGroup.leafRight.includes(field)
              ? 'right'
              : 'center';
          const cell = this.context.allCellElements[region]?.[rowIndex]?.[field.$colSeq];
          if (cell) {
            (cell.firstElementChild as HTMLElement).textContent = '';
            cell.classList.add('dg-group-continuation');
          }
        }
      }

      previousDataItem = item;
    }

    const lastVisibleRowIndex = visibleRowCount - 1;
    if (lastVisibleRowIndex >= 0) {
      for (const field of fields) {
        if (!field) {
          continue;
        }

        const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
          ? 'left'
          : cfg.fieldHeaderGroup.leafRight.includes(field)
            ? 'right'
            : 'center';
        this.context.allCellElements[region]?.[lastVisibleRowIndex]?.[field.$colSeq]?.classList.remove(
          'dg-group-continuation',
        );
      }
    }
  }

  private applyRowSpans(): void {
    const options = this.context.gridMain.options();
    const rowSpanFields = options.rowSpanFields ?? [];
    if (rowSpanFields.length === 0) {
      return;
    }

    const cfg = this.context.gridMain.config();
    const dataManager = cfg.dataManager;
    const viewItems = dataManager.getViewItems();
    const startIdx = cfg.scroll.startIdx;
    const visibleRowCount = Math.max(0, Math.min(cfg.scroll.viewRow, cfg.dataInfo.rowLength - startIdx));
    const cellElements = this.context.allCellElements;
    const fields = rowSpanFields
      .map((name) => cfg.currentFields.find((field) => field.name === name))
      .filter((field): field is (typeof cfg.currentFields)[number] => field !== undefined);

    for (const field of fields) {
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
        ? 'left'
        : cfg.fieldHeaderGroup.leafRight.includes(field)
        ? 'right'
        : 'center';
      const colIndex = field.$colSeq;
      const cells = Array.from(
        { length: visibleRowCount },
        (_, rowIndex) => cellElements[region]?.[rowIndex]?.[colIndex],
      );

      for (const cell of cells) {
        if (cell) {
          (cell as HTMLTableCellElement).rowSpan = 1;
          cell.style.removeProperty('display');
        }
      }
    }

    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      const field = fields[fieldIndex];
      const region = cfg.fieldHeaderGroup.leafLeft.includes(field)
        ? 'left'
        : cfg.fieldHeaderGroup.leafRight.includes(field)
        ? 'right'
        : 'center';
      const colIndex = field.$colSeq;
      let rowIndex = 0;

      while (rowIndex < visibleRowCount) {
        const viewItem = viewItems[startIdx + rowIndex];
        if (!viewItem || viewItem.groupRowType) {
          rowIndex++;
          continue;
        }

        const item = dataManager.getRowItem(viewItem.id);
        let span = 1;

        while (rowIndex + span < visibleRowCount) {
          const nextViewItem = viewItems[startIdx + rowIndex + span];
          if (!nextViewItem || nextViewItem.groupRowType) {
            break;
          }

          const nextItem = dataManager.getRowItem(nextViewItem.id);
          const sameGroup = fields.slice(0, fieldIndex + 1).every((groupField) => {
            return Object.is(item[groupField.name], nextItem[groupField.name]);
          });

          if (!sameGroup) {
            break;
          }

          span++;
        }

        if (span > 1) {
          const firstCell = cellElements[region]?.[rowIndex]?.[colIndex];
          if (firstCell) {
            (firstCell as HTMLTableCellElement).rowSpan = span;
          }

          for (let hiddenIndex = rowIndex + 1; hiddenIndex < rowIndex + span; hiddenIndex++) {
            const cell = cellElements[region]?.[hiddenIndex]?.[colIndex];
            if (cell) {
              cell.style.display = 'none';
            }
          }
        }

        rowIndex += span;
      }
    }
  }

  private renderGroupRow(viewItem: ViewItem, rowIndex: number): boolean {
    if (!viewItem.groupRowType) {
      return false;
    }

    const cfg = this.context.gridMain.config();
    const rowElements = this.context.allRowElements;
    const cellElements = this.context.allCellElements;
    const rowClass =
      viewItem.groupRowType === 'group'
        ? 'dg-group-header'
        : viewItem.groupRowType === 'groupSummary'
        ? 'dg-group-summary'
        : 'dg-grand-summary';
    const firstDataField = cfg.currentFields.find((field) => !field.$isAside);
    const sumFields = new Set(this.context.gridMain.options().sumFields ?? []);
    const summaryLabelField =
      (viewItem.groupRowType === 'groupSummary' || viewItem.groupRowType === 'group') && viewItem.groupField
        ? cfg.currentFields.find((field) => field.name === viewItem.groupField)
        : cfg.currentFields.find((field) => !field.$isAside && !sumFields.has(field.name)) ?? firstDataField;

    for (const region of ['left', 'center', 'right'] as const) {
      const rowElement = rowElements[region]?.[rowIndex];
      rowElement?.classList.remove('dg-group-header', 'dg-group-summary', 'dg-grand-summary', 'dg-status-delete');
      rowElement?.classList.add('dg-group-row', rowClass);
    }

    for (const field of cfg.currentFields) {
      const colIndex = field.$colSeq;
      let cell: HTMLElement | undefined;

      if (cfg.fieldHeaderGroup.leafLeft.includes(field)) {
        cell = cellElements.left?.[rowIndex]?.[colIndex];
      } else if (cfg.fieldHeaderGroup.leafRight.includes(field)) {
        cell = cellElements.right?.[rowIndex]?.[colIndex];
      } else {
        cell = cellElements.center?.[rowIndex]?.[colIndex];
      }

      if (!cell) {
        continue;
      }

      cell.classList.remove('dg-group-continuation', BodyCellStyleMap.SELECTION, BodyCellStyleMap.START_CELL);
      cell.classList.add('dg-group-cell');
      const renderer = cell.firstElementChild as HTMLElement;
      renderer.textContent = '';

      if (viewItem.groupRowType !== 'group') {
        const { startIdx, startCol } = cfg.selection.startCell;
        this.context.selectionInfo.updateCellSelectionClass(
          cell,
          cfg.scroll.startIdx + rowIndex,
          colIndex,
          startIdx,
          startCol,
        );
      }

      if (field.name === LINE_NUMBER_NAME) {
        const pagingStartIdx = this.context.gridMain.options().footer.paging?.enabled
          ? (cfg.paging.page - 1) * cfg.paging.pageSize
          : 0;
        const cellInfo: CellInfo = {
          r: cfg.scroll.startIdx + rowIndex,
          c: colIndex,
          rowIndex: pagingStartIdx + cfg.scroll.startIdx + rowIndex,
          field,
          item: cfg.dataManager.getRowItem(viewItem.id),
          viewItem,
        };
        field.$renderer.render(cellInfo, renderer);
      } else if (!field.$isAside && viewItem.groupRowType === 'group' && field === summaryLabelField) {
        renderer.textContent = `${viewItem.groupField}: ${String(viewItem.groupValue ?? '')}`;
        renderer.style.paddingLeft = `${(viewItem.groupDepth ?? 0) * 16}px`;
      } else if (!field.$isAside && viewItem.groupRowType !== 'group' && field === summaryLabelField) {
        renderer.textContent =
          viewItem.groupRowType === 'grandSummary'
            ? 'Grand Total'
            : viewItem.groupField
              ? `${String(viewItem.groupValue ?? '')} 합계`
              : 'Subtotal';
        renderer.style.paddingLeft = `${(viewItem.groupDepth ?? 0) * 16}px`;
      } else if (viewItem.groupRowType !== 'group' && sumFields.has(field.name)) {
        const sum = viewItem.groupSums?.[field.name];
        renderer.textContent = sum === undefined ? '' : String(sum);
        renderer.style.paddingLeft = '';
      } else {
        renderer.style.paddingLeft = '';
      }
    }

    return true;
  }
}
