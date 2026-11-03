import { EventHandler } from '@/event/EventHandler';
import { FieldSortInfo } from '@/types/Header';
import { addAttr, removeAttr } from '@/util/domUtils';
import { isClickEvent, isShiftKey, stopPreventCancel } from '@/util/eventUtils';
import { intValue } from '@/util/utils';
import { GridMain } from '@/view/GridMain';
import { Header } from './Header';

/**
 * sort button event class
 *
 * @class SortButtonEvent
 * @typedef {SortButtonEvent }
 */
export class SortButtonEvent implements EventHandler {
  private readonly gridMain: GridMain;

  private readonly header: Header;
  private readonly sortOpts;

  constructor(gridMain: GridMain, header: Header) {
    this.gridMain = gridMain;
    this.header = header;

    this.sortOpts = gridMain.options().header.sort;
  }

  /**
   * init
   *
   */
  public init() {
    const sortOpts = this.sortOpts;

    const cfg = this.gridMain.config();
    const eventManager = cfg.eventManager;
    const sortOrders = cfg.sort.orders;
    const dataManager = cfg.dataManager;

    const headerElement = this.header.getHeaderElement();
    const sortElements = headerElement.finds('.dg-sort-icon');
    const headerCellElements = this.header.getHeaderCellElements();

    let beforeSortOrderLength = 0;

    // 서버 정렬 조회가 실패·취소되었을 때 헤더의 정렬 상태(정렬 목록, 아이콘, 정렬 순번)를 되돌리기 위한 스냅샷
    const createSortSnapshot = () => {
      const orders = sortOrders.map((item: FieldSortInfo) => ({ ...item }));
      const icons = sortElements.map((el: HTMLElement) => el.getAttribute('data-dg-sort'));
      const nums = headerElement.finds('.dg-sort-num').map((el) => ({
        el,
        text: el.textContent ?? '',
      }));
      const length = beforeSortOrderLength;

      return () => {
        sortOrders.length = 0;
        orders.forEach((item: FieldSortInfo) => sortOrders.push({ ...item }));
        sortElements.forEach((el: HTMLElement, index: number) => {
          const sort = icons[index];
          if (sort === null) el.removeAttribute('data-dg-sort');
          else el.setAttribute('data-dg-sort', sort);
        });
        nums.forEach(({ el, text }) => {
          el.textContent = text;
        });
        beforeSortOrderLength = length;
      };
    };
    eventManager.off(sortElements, 'pointerdown');
    eventManager.on(
      { el: sortElements, type: 'pointerdown' },
      (e: MouseEvent | TouchEvent) => {
        if (!isClickEvent(e)) {
          return;
        }
        stopPreventCancel(e);
        this.gridMain.hideLayer();

        const currentElement = e.currentTarget as HTMLElement;

        // 서버 정렬은 조회할 수 없는 상태(미저장 변경 등)에서는 정렬 상태를 바꾸지 않고 오류만 알린다.
        const remote = this.gridMain.options().dataSource?.sorting?.mode === 'server' ? this.gridMain.getRemote() : null;
        if (remote?.isLoadBlocked()) {
          remote.sortRemote().catch(() => undefined);
          return;
        }

        // 서버 정렬: 조회가 실패하거나 취소되면 헤더 정렬 상태를 되돌리기 위해 변경 전 상태를 보관한다.
        const revertSort = remote ? createSortSnapshot() : undefined;

        const sortCell = intValue(
          (currentElement.closest('.dg-header-cell') as HTMLElement)?.dataset.headerCellPosition ?? '0',
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
          sortOrders.push({ name: sortName, field: sortField, ascOrder: true, sortCell: sortCell });
        }

        if (sortOrders.length > 0) {
          if (beforeSortOrderLength >= 1 && beforeSortOrderLength != sortOrders.length) {
            sortOrders.forEach((item: FieldSortInfo, index: number) => {
              headerCellElements[item.sortCell].querySelector('.dg-sort-num')?.replaceChildren(index + 1 + '');
            });
          }
        }

        beforeSortOrderLength = sortOrders.length;

        if (remote) {
          // 서버 정렬: 로컬 정렬 없이 정렬 정보를 조회 조건으로 보내 다시 조회한다(실패는 loadError 이벤트로 알린다).
          remote.sortRemote(undefined, revertSort).catch(() => undefined);
          return;
        }

        dataManager.dataSort(sortOrders, sortOpts);

        this.gridMain.selectionInfo.initSelection();
        this.gridMain.getBody().dataDraw('sort');
      },
      { passive: false },
    );
  }
}
