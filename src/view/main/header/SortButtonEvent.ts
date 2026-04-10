import { DaraGrid } from '@/DaraGrid';

import { EventHandler } from '@/event/EventHandler';
import { FieldSortInfo } from '@/types/Header';
import { addAttr, removeAttr } from '@/util/domUtils';
import { eventOff, eventOn, isClickEvent, isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { arrayCopy, intValue, multiSort } from '@/util/utils';
import { GridMain } from '../../GridMain';
import { Header } from './Header';

/**
 * sort button event class
 *
 * @class SortButtonEvent
 * @typedef {SortButtonEvent }
 */
export class SortButtonEvent implements EventHandler {
  private readonly grid: DaraGrid;
  private readonly gridMain: GridMain;

  private readonly header: Header;
  private readonly sortOpts;

  constructor(grid: DaraGrid, gridMain: GridMain, header: Header) {
    this.grid = grid;
    this.gridMain = gridMain;
    this.header = header;

    this.sortOpts = grid.getOptions().header.sort;
  }

  /**
   * keydown event
   *
   */
  public init() {
    const sortOpts = this.sortOpts;

    const cfg = this.grid.config();
    const sortOrders = cfg.sort.orders;
    const dataManager = cfg.dataManager;

    const headerElement = this.header.getHeaderElement();
    const sortElements = headerElement.finds('.dg-sort-icon');
    const headerCellElements = this.header.getHeaderCellElements();

    const nullsLast = sortOpts.nullsLast;
    let beforeSortOrderLength = 0;
    eventOff(sortElements, 'mousedown touchstart');
    eventOn({ el: sortElements, type: 'mousedown touchstart' }, (e: MouseEvent | TouchEvent) => {
      if (!isClickEvent(e)) {
        return;
      }
      stopPreventCancel(e);

      const currentElement = e.currentTarget as HTMLElement;

      const sortCell = intValue(
        currentElement.closest('.dg-header-cell')?.getAttribute('data-header-cell-position') ?? '0',
      );

      const sortField = cfg.currentFields[sortCell];

      const sortName = sortField.name;

      const isShift = isShiftKey(e);

      if (!isShift) {
        removeAttr(headerElement.finds('[data-dg-sort]'), 'data-dg-sort');

        if (sortOrders.length > 1 || !sortOrders.some((item: FieldSortInfo) => item.name === sortName)) {
          sortOrders.forEach((item: FieldSortInfo) => {
            headerCellElements[item.sortCell].querySelector('.dg-sort-num')?.replaceChildren();
          });
          sortOrders.length = 0;
          beforeSortOrderLength = 0;
        }
      }

      const currentSortItem = sortOrders.find((item: FieldSortInfo) => item.name === sortName);

      if (currentSortItem) {
        if (currentSortItem.ascOrder) {
          addAttr(currentElement, { 'data-dg-sort': 'desc' });
          currentSortItem.ascOrder = !currentSortItem.ascOrder;
        } else {
          const index = sortOrders.findIndex((item: FieldSortInfo) => item.name === sortName);

          if (index !== -1) {
            sortOrders.splice(index, 1);
          }

          currentElement.querySelector<HTMLElement>('.dg-sort-num')?.replaceChildren();

          removeAttr(currentElement, 'data-dg-sort');
        }
      } else {
        addAttr(currentElement, { 'data-dg-sort': 'asc' });
        sortOrders.push({ name: sortName, ascOrder: true, sortCell: sortCell });
      }

      if (sortOrders.length > 0) {
        if (beforeSortOrderLength >= 1 && beforeSortOrderLength != sortOrders.length) {
          sortOrders.forEach((item: FieldSortInfo, index: number) => {
            headerCellElements[item.sortCell].querySelector('.dg-sort-num')?.replaceChildren(index + 1 + '');
          });
        }
      }

      dataManager.dataSort(isShift, sortOrders, sortOpts);

      beforeSortOrderLength = sortOrders.length;

      this.gridMain.selectionInfo.initSelection();
      this.gridMain.getBody().dataDraw('sort');
    });
  }
}
