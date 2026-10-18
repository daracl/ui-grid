import { ItemStatusMap, ROW_FIELD, ROW_KEY_PREFIX } from '@/constants';
import { CURRENT_MATCH_INFO, RowId, ViewItem } from '@/types/Common';
import { FieldItem } from '@/types/GridField';
import { GridOptions, SortOption } from '@/types/GridOptions';
import { FieldSortInfo } from '@/types/Header';
import { multiSort } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { ListDataManager } from './ListDataManager';
import { HistoryEntry } from './HistoryManager';
import { getSummaryField, calculateGroupSummary, getGroupSummaries, getGroupSummaryFields } from '@/util/groupSummaryUtils';

export class GroupDataManager extends ListDataManager {
  private readonly groupRows = new Map<RowId, any>();
  private sourceViewItems: ViewItem[] = [];
  private groupRowId = 0;
  private historyBatchDepth = 0;
  private groupingRefreshPending = false;

  constructor(opts: GridOptions, gridMain: GridMain) {
    super(opts, gridMain, 'group');
  }

  public setViewItems(items: ViewItem[]): void {
    const dataItems = items.filter((item) => !item.groupRowType);
    this.sourceViewItems = dataItems;
    const groupFields = this.opts.groupingFields ?? [];

    this.groupRows.clear();

    if (groupFields.length === 0) {
      super.setViewItems(dataItems);
      return;
    }

    const groupedItems: ViewItem[] = [];
    const dataRows = dataItems.map((viewItem) => ({
      viewItem,
      item: super.getRowItem(viewItem.id),
    }));

    const appendGroups = (rows: typeof dataRows, fieldIndex: number, groupValues: any[]): void => {
      const fieldName = groupFields[fieldIndex];
      const groups = new Map<any, typeof dataRows>();

      for (const row of rows) {
        const value = row.item?.[fieldName];
        const group = groups.get(value);
        if (group) {
          group.push(row);
        } else {
          groups.set(value, [row]);
        }
      }

      for (const [value, groupRows] of groups) {
        const currentGroupValues = [...groupValues, value];

        if (fieldIndex + 1 < groupFields.length) {
          appendGroups(groupRows, fieldIndex + 1, currentGroupValues);
        } else {
          groupedItems.push(...groupRows.map(({ viewItem }) => viewItem));

          if ((this.opts.showGroupSummary) !== false && getGroupSummaries(this.opts).length > 0) {
            groupedItems.push(
              this.createGroupRow({
                groupRowType: 'groupSummary',
                groupDepth: fieldIndex,
                groupField: fieldName,
                groupValue: value,
                groupValues: currentGroupValues,
                groupSums: this.sumRows(groupRows),
              }),
            );
          }
        }
      }
    };

    if (dataRows.length > 0) {
      appendGroups(dataRows, 0, []);
    }

    if ((this.opts.showGrandSummary) !== false && getGroupSummaries(this.opts).length > 0 && dataRows.length > 0) {
      groupedItems.push(
        this.createGroupRow({
          groupRowType: 'grandSummary',
          groupSums: this.sumRows(dataRows),
        }),
      );
    }

    super.setViewItems(groupedItems);
  }

  public setChangeValue(
    rowItem: any,
    field: FieldItem,
    newValue: any,
    applyValue?: (rowItem: any, field: FieldItem, newValue: any) => boolean | void,
  ): boolean {
    const changed = super.setChangeValue(rowItem, field, newValue, applyValue);
    if (
      changed &&
      ((this.opts.groupingFields ?? []).includes(field.name) || getGroupSummaryFields(this.opts).includes(field.name) || getGroupSummaries(this.opts).some((item) => typeof item.expression === 'function'))
    ) {
      this.groupingRefreshPending = true;
      this.refreshGroupingIfReady();
    }
    return changed;
  }

  public beginHistory(): void {
    super.beginHistory();
    this.historyBatchDepth++;
  }

  public commitHistory(): void {
    super.commitHistory();
    this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1);
    this.refreshGroupingIfReady();
  }

  public rollbackHistory(): void {
    super.rollbackHistory();
    this.historyBatchDepth = Math.max(0, this.historyBatchDepth - 1);
    this.refreshGroupingIfReady();
  }

  public getSortData(sortOrders: FieldSortInfo[], sortOpts: SortOption): ViewItem[] {
    const sortData = multiSort(this.sourceViewItems, this.cfg.dataManager, sortOrders, sortOpts.nullsLast);

    if (!this.cfg.searchEnabled) {
      return sortData;
    }

    const searchMatchInfo = this.cfg.searchMatchInfo;
    const matchId = searchMatchInfo.id ?? '';
    let matchRowIndex = -1;
    let offset = 0;

    this.matchOffsetMap.clear();

    for (let i = 0; i < sortData.length; i++) {
      const id = sortData[i].id;
      const matchViewItem = this.getSearchMapItem(id);

      if (matchViewItem) {
        this.matchOffsetMap.set(id, offset);
        offset += matchViewItem.matchedFields?.length ?? 0;
      }

      if (matchRowIndex === -1 && id === matchId) {
        matchRowIndex = i;
      }
    }

    const currentMatchIndex = this.getCurrentMatchIndex(matchId);
    this.setCurrentMatchInfo(currentMatchIndex, {
      id: matchId,
      rowIndex: matchRowIndex,
      cellIndex: searchMatchInfo.cellIndex,
    } as CURRENT_MATCH_INFO);

    return sortData;
  }

  protected refreshAfterHistory(entry: HistoryEntry, undo: boolean): void {
    // History 적용으로 바뀐 원본 행과 그룹 정렬 대상을 먼저 동기화한다.
    this.sourceViewItems = this.sourceViewItems.filter((viewItem) => super.getRowItem(viewItem.id) !== undefined);
    for (const change of entry.changes) {
      const restored = (change.type === 'add' && !undo) || (change.type === 'remove' && undo);
      if (restored && !this.sourceViewItems.some((viewItem) => viewItem.id === change.rowId)) {
        const viewItem = this.getOriginalViewItems().find((candidate) => candidate.id === change.rowId);
        this.sourceViewItems.push(viewItem ?? { id: change.rowId, sortOrder: this.sourceViewItems.length });
      }
    }
    super.refreshAfterHistory(entry, undo);
  }

  public getRowItem(rowId: RowId): any {
    return this.groupRows.get(rowId) ?? super.getRowItem(rowId);
  }

  public getAllRowItems(rowIdInclude = false): any[] {
    return this.getViewItems()
      .filter((viewItem) => !viewItem.groupRowType)
      .map((viewItem) => {
        const item = super.getRowItem(viewItem.id);
        if (rowIdInclude) {
          return item;
        }

        const result: Record<string, any> = {};
        for (const key in item) {
          if (key.indexOf(ROW_KEY_PREFIX) !== 0) {
            result[key] = item[key];
          }
        }
        return result;
      });
  }

  public convertViewItemsToRowItems(): any[] {
    return this.getViewItems()
      .filter((viewItem) => !viewItem.groupRowType)
      .map((viewItem) => super.getRowItem(viewItem.id));
  }

  public setAllCheck(): void {
    for (const viewItem of this.getViewItems()) {
      if (!viewItem.groupRowType) {
        this.setItemChecked(viewItem.id, true);
      }
    }
  }

  public setItemChecked(id: RowId, checked: boolean): void {
    if (this.groupRows.has(id)) {
      return;
    }
    super.setItemChecked(id, checked);
  }

  private createGroupRow(info: Omit<ViewItem, 'id' | 'sortOrder'>): ViewItem {
    let id: string;
    do {
      id = `dg$group$${++this.groupRowId}`;
    } while (this.sourceViewItems.some((item) => item.id === id));

    const viewItem: ViewItem = {
      id,
      sortOrder: this.groupRowId,
      ...info,
    };

    this.groupRows.set(id, { [ROW_FIELD.ID]: id, [ROW_FIELD.CUD]: ItemStatusMap.READ });
    return viewItem;
  }

  private sumRows(rows: { item: any }[]): Record<string, number> {
    const sums: Record<string, number> = {};
    const items = rows.map(({ item }) => item);
    for (const summary of getGroupSummaries(this.opts)) {
      sums[getSummaryField(summary)] = calculateGroupSummary(items, summary);
    }

    return sums;
  }

  private refreshGroupingIfReady(): void {
    if (this.groupingRefreshPending && this.historyBatchDepth === 0) {
      this.groupingRefreshPending = false;
      this.setViewItems(this.sourceViewItems.slice());
    }
  }
}
